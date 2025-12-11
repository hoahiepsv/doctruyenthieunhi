
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Story } from "../types";
import { base64ToUint8Array, pcmToWavBlob } from "../utils/audio";

let genAI: GoogleGenAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenAI({ apiKey });
};

export const checkApiKey = () => !!genAI;

/**
 * Searches for stories using Gemini with Google Search grounding.
 */
export const searchStories = async (query: string): Promise<Story[]> => {
  if (!genAI) throw new Error("API Key not set");

  const model = "gemini-2.5-flash";
  const prompt = `Tìm danh sách 5 truyện cổ tích hoặc truyện thiếu nhi Việt Nam và thế giới liên quan đến: "${query}". 
  Yêu cầu truyện phải mang tính giáo dục, đạo đức tốt.
  Trả về định dạng JSON thuần túy (không markdown, không code block) theo cấu trúc mảng sau:
  [
    {
      "title": "Tên truyện",
      "content": "Tóm tắt ngắn nội dung khoảng 100 từ",
      "moral": "Bài học rút ra"
    }
  ]`;

  try {
    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // responseMimeType cannot be used with googleSearch
        tools: [{ googleSearch: {} }],
        // responseSchema cannot be used with googleSearch
      }
    });

    let text = response.text;
    if (!text) return [];
    
    // Clean up markdown code blocks if present (e.g., ```json ... ```)
    text = text.replace(/```json\n?|```/g, '').trim();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.warn("Failed to parse JSON from search result", text);
      // Fallback: try to extract array part if there is extra text
      const match = text.match(/\[.*\]/s);
      if (match) {
         try {
           data = JSON.parse(match[0]);
         } catch (e) {
           return [];
         }
      } else {
        return [];
      }
    }

    if (!Array.isArray(data)) return [];

    return data.map((item: any, index: number) => ({
      id: `search-${Date.now()}-${index}`,
      title: item.title,
      content: item.content,
      moral: item.moral
    }));

  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

/**
 * Generates detailed content for a specific story if the summary is too short.
 * IMPROVED PROMPT ENGINEERING FOR TTS EMOTION
 */
export const expandStory = async (title: string, currentContent: string): Promise<string> => {
  if (!genAI) throw new Error("API Key not set");

  // Prompt được tối ưu cho giọng đọc AI (TTS)
  const prompt = `Bạn là một người kể chuyện cuốn hút cho trẻ em. Hãy kể lại toàn bộ câu chuyện cổ tích "${title}" một cách chi tiết.
  
  MỤC TIÊU QUAN TRỌNG: Viết để "ĐỌC THÀNH TIẾNG" thật truyền cảm.
  
  KỸ THUẬT VIẾT (Bắt buộc tuân thủ):
  1. Sử dụng nhiều dấu ba chấm (...) để tạo khoảng lặng cảm xúc hoặc sự hồi hộp. (Ví dụ: "Bỗng nhiên... một tiếng động lớn vang lên!")
  2. Sử dụng dấu chấm than (!) cho các câu cảm thán, hội thoại để tạo điểm nhấn.
  3. Ngắt câu bằng dấu phẩy (,) hợp lý để giọng đọc không bị hụt hơi.
  4. Văn phong thủ thỉ, tâm tình, như đang kể cho bé nghe trước khi ngủ.
  
  Yêu cầu khác:
  - Tuyệt đối KHÔNG tóm tắt. Kể đầy đủ đầu đuôi.
  - Giữ nguyên ý nghĩa giáo dục.
  
  Nội dung gốc tham khảo (nếu có): "${currentContent}".`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || currentContent;
  } catch (error) {
    console.error("Expand story error:", error);
    return currentContent;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper to generate a single image with Retry logic for 429 errors
 */
const generateSingleImage = async (prompt: string, attempt = 1): Promise<string | null> => {
    if (!genAI) return null;
    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    } catch (e: any) {
        // Handle 429 Resource Exhausted
        // Check for 429 in status or message
        if (attempt <= 3 && (e.status === 429 || (e.message && e.message.includes('429')) || (e.message && e.message.includes('RESOURCE_EXHAUSTED')))) {
            // Increase wait time significantly: 15s, 30s, 45s to clear the quota buffer
            const waitTime = 15000 * attempt; 
            console.warn(`Image generation 429 Limit hit. Retrying attempt ${attempt + 1} in ${waitTime/1000}s...`);
            await delay(waitTime);
            return generateSingleImage(prompt, attempt + 1);
        }
        
        // If we ran out of retries, just return null quietly for 429 so we don't spam console error
        if (e.status === 429 || (e.message && e.message.includes('429'))) {
             console.warn("Quota exceeded (429), skipping image generation.");
             return null;
        }

        console.error("Single image generation failed", e);
    }
    return null;
}

/**
 * Generates a gallery of 2 scenes (Beginning, End).
 * Reduced from 3 to 2 to speed up generation and save tokens.
 */
export const generateStoryScenes = async (storyTitle: string, storyContent: string): Promise<string[]> => {
  if (!genAI) throw new Error("API Key not set");

  // GIẢM XUỐNG CÒN 2 ẢNH: ĐẦU và CUỐI
  const prompts = [
    `Illustration for the BEGINNING of the fairy tale "${storyTitle}". 
     Context: The start of the story, introducing characters. 
     Style: Cute, colorful digital art for children, soft lighting, disney style.`,

    `Illustration for the HAPPY ENDING of the fairy tale "${storyTitle}". 
     Context: The conclusion, happy resolution. 
     Style: Cute, colorful digital art for children, soft lighting, disney style.`
  ];

  try {
    const results: string[] = [];
    
    // Execute sequentially with delay to respect rate limits
    for (const prompt of prompts) {
        const img = await generateSingleImage(prompt);
        if (img) {
            results.push(img);
        }
        // Wait 10 seconds between requests (optimized from 3s) because limit is very strict (2 RPM often)
        await delay(10000);
    }
    
    return results;
  } catch (e) {
    console.error("Gallery generation failed", e);
    return [];
  }
};

/**
 * Text-to-Speech generation.
 */
export const generateSpeech = async (text: string, voiceName: string): Promise<Blob | null> => {
  if (!genAI) throw new Error("API Key not set");

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const pcmData = base64ToUint8Array(base64Audio);
      // Gemini TTS usually returns 24kHz mono audio
      return pcmToWavBlob(pcmData, 24000);
    }
  } catch (e) {
    console.error("TTS failed", e);
  }
  return null;
};

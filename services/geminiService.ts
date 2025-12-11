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
 */
export const expandStory = async (title: string, currentContent: string): Promise<string> => {
  if (!genAI) throw new Error("API Key not set");

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Hãy kể lại câu chuyện "${title}" một cách chi tiết, hấp dẫn cho trẻ em. 
    Nội dung hiện tại: "${currentContent}". 
    Hãy viết lại đầy đủ, giọng văn kể chuyện nhẹ nhàng, trong sáng.`,
  });

  return response.text || currentContent;
};

/**
 * Generates an illustration for the story.
 */
export const generateStoryImage = async (storyTitle: string, storyContent: string): Promise<string | null> => {
  if (!genAI) throw new Error("API Key not set");

  const prompt = `A cute, colorful, fairy tale style illustration for children for the story "${storyTitle}". 
  Scene description derived from: ${storyContent.substring(0, 200)}...
  Style: Digital art, soft lighting, vibrant colors, disney style suitable for kids.`;

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
  } catch (e) {
    console.error("Image generation failed", e);
  }
  return null;
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

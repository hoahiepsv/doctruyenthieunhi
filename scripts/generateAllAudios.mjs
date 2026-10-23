import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/audio/stories');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Split text into safe chunks under 140 chars
function splitIntoChunks(text) {
  const rawSentences = text.split(/([.,!?;:\n]+)/);
  const chunks = [];
  let current = '';

  for (let i = 0; i < rawSentences.length; i++) {
    current += rawSentences[i];
    if (i % 2 === 1 || current.length > 100) {
      if (current.trim()) chunks.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function fetchChunkAudio(text) {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function processStory(id, title, content) {
  const targetFile = path.join(outputDir, `${id}.mp3`);
  if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 20000) {
    console.log(`[SKIP] Already exists: ${id}.mp3 (${fs.statSync(targetFile).size} bytes)`);
    return;
  }

  console.log(`[START] Generating audio for: ${title} (${id})...`);
  const fullText = `${title}. ${content}`;
  const chunks = splitIntoChunks(fullText);
  const buffers = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const buf = await fetchChunkAudio(chunk);
      buffers.push(buf);
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 80));
    } catch (err) {
      console.warn(`Chunk ${i} failed for ${id}:`, err.message);
    }
  }

  if (buffers.length > 0) {
    const finalBuffer = Buffer.concat(buffers);
    fs.writeFileSync(targetFile, finalBuffer);
    console.log(`[DONE] Saved ${id}.mp3: ${finalBuffer.length} bytes (${(finalBuffer.length / 1024).toFixed(1)} KB)`);
  }
}

// Read offlineStories source to extract stories
async function main() {
  const storiesFilePath = path.resolve(__dirname, '../data/offlineStories.ts');
  const code = fs.readFileSync(storiesFilePath, 'utf-8');

  // Regex to extract id, title, content
  const regex = /id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],[\s\S]*?content:\s*`([\s\S]*?)`/g;
  let match;
  const stories = [];

  while ((match = regex.exec(code)) !== null) {
    stories.push({
      id: match[1],
      title: match[2],
      content: match[3]
    });
  }

  console.log(`Found ${stories.length} stories to process.`);

  for (const story of stories) {
    try {
      await processStory(story.id, story.title, story.content);
    } catch (e) {
      console.error(`Error processing story ${story.id}:`, e);
    }
  }

  console.log("ALL AUDIO GENERATION COMPLETE!");
}

main().catch(console.error);

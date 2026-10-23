import path from 'path';
import url from 'url';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function vietnameseTtsPlugin(): Plugin {
  const handler = async (req: any, res: any) => {
    try {
      const parsedUrl = url.parse(req.url || '', true);
      const text = (parsedUrl.query.text as string) || '';

      if (!text || !text.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing text parameter' }));
        return;
      }

      // Encode and limit chunk length
      const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.trim().slice(0, 200))}&tl=vi&client=tw-ob`;

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
        }
      });

      if (!response.ok) {
        res.statusCode = response.status;
        res.end('TTS fetch failed');
        return;
      }

      const buffer = await response.arrayBuffer();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(Buffer.from(buffer));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'TTS Error' }));
    }
  };

  return {
    name: 'vietnamese-tts-proxy',
    configureServer(server) {
      server.middlewares.use('/api/tts', (req, res) => {
        handler(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tts', (req, res) => {
        handler(req, res);
      });
    }
  };
}

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), vietnameseTtsPlugin()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

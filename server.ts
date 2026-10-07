import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable JSON parsing
  app.use(express.json());

  // Helper to extract or fallback the correct HTTP Referer to satisfy restricted API keys
  function getRequestReferer(req?: express.Request): string {
    if (req) {
      const r = req.get('Referer') || req.get('Origin');
      if (r) return r;
      const host = req.get('host');
      if (host) return `https://${host}/`;
    }
    return process.env.APP_URL || 'https://engineering-portfolio-981159597186.europe-west3.run.app/';
  }

  // Gemini client generator supporting dynamic Referer headers
  function getGeminiClient(referer?: string): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY secret is not set. Please configure it in Settings > Secrets.');
    }
    const cleanReferer = referer || process.env.APP_URL || 'https://engineering-portfolio-981159597186.europe-west3.run.app/';
    
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
          'Referer': cleanReferer,
        },
      },
    });
  }

  // System Instruction as specified by the user
  const SYSTEM_INSTRUCTION = `You are the assistant for Fran Lee, a done-for-you technical setup service for clinics, coaches, and small businesses in South Dublin. You explain the offer (a bespoke website, automated booking engine, and a 24/7 AI chat assistant for €750 setup + €99/month), answer questions warmly and briefly, and encourage visitors to book a free discovery call. Keep replies short and friendly. Never invent prices or features beyond these.`;

  // Expose POST endpoint for on-site interactive 24/7 AI chat widget
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Missing or invalid messages array' });
        return;
      }

      // Enforce model constraints and system instructions, and use client referrer
      const referer = getRequestReferer(req);
      const ai = getGeminiClient(referer);
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: messages,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const replyText = response.text || "I'm sorry, I'm having trouble connecting right now. Please try again soon.";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('On-site Chat API error:', error);
      const errorMessage = error.message || '';
      const isReferrerError = errorMessage.toLowerCase().includes('referer') || 
                              errorMessage.toLowerCase().includes('referrer') || 
                              errorMessage.toLowerCase().includes('blocked') ||
                              errorMessage.toLowerCase().includes('permission_denied');
      res.status(500).json({ 
        error: errorMessage || 'Internal Server Error',
        isReferrerError: isReferrerError
      });
    }
  });

  // Vite middleware setup to serve landing page and preview at /
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Cache hashed assets for 1 year, but require revalidation for index.html
    app.use(express.static(distPath, {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start the server (bind to 0.0.0.0 and port 3000)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();

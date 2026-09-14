import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable JSON parsing
  app.use(express.json());

  // In-memory message history map per chat
  // Structure: Map<chatId, Content[]>
  const historyMap = new Map<number, any[]>();

  // In-memory cache for auto-discovered Fran Lee's Chat ID as the console owner
  let detectedOwnerChatId: number | null = null;

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

  // Expose POST webhook endpoint
  app.post('/webhook', async (req, res) => {
    try {
      const update = req.body;
      console.log('Incoming update:', JSON.stringify(update));

      if (update?.message?.text) {
        const chatId = update.message.chat.id;
        const incomingText = update.message.text;
        const fromUsername = update?.message?.from?.username;

        // Resolve reference/host to satisfy API Key restrictions
        const referer = getRequestReferer(req);
        await handleBotConversation(chatId, incomingText, referer, update.message.reply_to_message, fromUsername);
      }

      // Always reply with 200 OK to acknowledge receipt to Telegram immediately
      res.status(200).json({ ok: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(200).json({ ok: false, error: error.message });
    }
  });

  // Expose basic check endpoint for monitoring
  app.get('/bot-status', (req, res) => {
    res.send('Bot is running');
  });

  // Cached bot username discovered at startup
  let cachedBotUsername = 'PortfolioFranLee_bot';

  // Expose bot info to frontend
  app.get('/api/bot-info', async (req, res) => {
    const rawToken = process.env.TELEGRAM_BOT_TOKEN;
    const botToken = (rawToken && rawToken.trim() !== '' && rawToken !== 'YOUR_TELEGRAM_BOT_TOKEN') ? rawToken : null;
    
    // If we have a real token but haven't discovered the username yet, try to fetch it now
    if (botToken && !cachedBotUsername) {
      try {
        const getMeUrl = `https://api.telegram.org/bot${botToken}/getMe`;
        const response = await fetch(getMeUrl);
        const data: any = await response.json();
        if (data.ok && data.result?.username) {
          cachedBotUsername = data.result.username;
          console.log(`On-demand discovered Telegram Bot username: @${cachedBotUsername}`);
        } else {
          console.warn(`Telegram Bot token is present but not yet verified with Telegram (ok: false). Description: ${data?.description || 'N/A'}`);
        }
      } catch (err) {
        console.warn('Failed to auto-discover Telegram Bot username:', err);
      }
    }

    res.json({
      username: cachedBotUsername || null,
      hasToken: !!botToken
    });
  });

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

  // Bridge incoming messages, call Gemini, support owner notifications & manual replies
  async function handleBotConversation(chatId: number, text: string, referer?: string, replyToMessage?: any, fromUsername?: string) {
    const rawToken = process.env.TELEGRAM_BOT_TOKEN;
    const token = (rawToken && rawToken.trim() !== '' && rawToken !== 'YOUR_TELEGRAM_BOT_TOKEN') ? rawToken : null;
    if (!token) {
      console.warn('TELEGRAM_BOT_TOKEN secret is not configured or uses default placeholders. Skipping Telegram handler.');
      return;
    }

    const ownerChatIdStr = process.env.TELEGRAM_OWNER_CHAT_ID;

    // Direct dynamic linking with owner username '@franleegram' or '@franLeeGram'
    if (fromUsername && fromUsername.toLowerCase() === 'franleegram') {
      if (detectedOwnerChatId !== chatId) {
        detectedOwnerChatId = chatId;
        console.log(`✨ Dynamically auto-registered Fran Lee's Owner Chat ID to: ${chatId}`);
      }
    }

    let isOwner = false;
    if (detectedOwnerChatId && chatId === detectedOwnerChatId) {
      isOwner = true;
    } else if (ownerChatIdStr && ownerChatIdStr.trim() !== '' && ownerChatIdStr !== 'YOUR_PERSONAL_TELEGRAM_CHAT_ID' && chatId.toString() === ownerChatIdStr.trim()) {
      isOwner = true;
    }

    // Owner Intercept Mode (Reply and Direct Takeover)
    if (isOwner) {
      let targetChatId: string | null = null;
      
      // 1. Direct reply to a forwarded notification card containing "Client Chat ID: 12345"
      if (replyToMessage && replyToMessage.text) {
        const match = replyToMessage.text.match(/Client Chat ID:\s*([a-zA-Z0-9_-]+)/i);
        if (match) {
          targetChatId = match[1];
        }
      }

      // 2. Direct manual override command: "/reply <client_chat_id> <message>"
      if (!targetChatId) {
        const cmdMatch = text.match(/^\/reply\s+([a-zA-Z0-9_-]+)\s+(.+)$/i);
        if (cmdMatch) {
          targetChatId = cmdMatch[1];
          text = cmdMatch[2];
        }
      }

      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

      if (targetChatId) {
        try {
          const targetNum = parseInt(targetChatId, 10);
          const tgResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: targetNum,
              text: text,
            }),
          });
          
          if (tgResponse.ok) {
            // Confirm direct delivery back to the owner
            await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: `✅ **Delivered to Client (${targetChatId})**:\n"${text}"`,
                parse_mode: 'Markdown',
              }),
            });
            
            // Log conversation state or inject owner's response into Gemini's history map so the bot stays in context
            const clientHistory = historyMap.get(targetNum) || [];
            clientHistory.push({
              role: 'model',
              parts: [{ text: text }],
            });
            historyMap.set(targetNum, clientHistory.slice(-10));
          } else {
            const errDetails = await tgResponse.text();
            throw new Error(errDetails);
          }
        } catch (err: any) {
          await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: `⚠️ **Delivery Failed to Client (${targetChatId})**.\nError: ${err.message}`,
              parse_mode: 'Markdown',
            }),
          });
        }
      } else {
        // Standard helper instructions
        await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `👋 **Hello Fran Lee (@franleegram)!**\n\nI have successfully detected your Telegram profile and linked your numeric Chat ID: \`${chatId}\` as the owner profile! 🎉\n\nFrom now on:\n1️⃣ Anytime a prospective customer messages this bot, I will copy and forward their texts right here to your personal Telegram chat so you receive push notifications instantly.\n2️⃣ **How to reply**: Simply click **"Reply"** on the forwarded message here in Telegram, type your message, and hit send! I will automatically deliver it straight back to the client.\n3️⃣ Alternatively, you can use the command:\n\`/reply <client_chat_id> <message>\`\n\nTry sending a message to your bot from another account to test it! 🚀`,
            parse_mode: 'Markdown',
          }),
        });
      }
      return;
    }

    // Client/Customer Request Mode
    // Retrieve message history or initialize
    let history = historyMap.get(chatId) || [];

    // Append new user statement
    history.push({
      role: 'user',
      parts: [{ text: text }],
    });

    // Maintain a short history (e.g. up to last 10 turns to avoid extreme growth)
    const MAX_HISTORY = 10;
    if (history.length > MAX_HISTORY) {
      history = history.slice(-MAX_HISTORY);
      // Maintain alignment so the chain always starts with user prompt
      if (history[0].role === 'model') {
        history.shift();
      }
    }

    try {
      const ai = getGeminiClient(referer);

      // Query Gemini model
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: history,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const replyText = response.text || 'I am sorry, I am currently offline. Please try again soon.';

      // Append model reply to history
      history.push({
        role: 'model',
        parts: [{ text: replyText }],
      });

      // Update in-memory history map
      historyMap.set(chatId, history);

      // Call Telegram sendMessage API to client
      const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
      const tgResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
        }),
      });

      if (!tgResponse.ok) {
        const details = await tgResponse.text();
        console.error(`Telegram API response error: Status ${tgResponse.status}, Details: ${details}`);
      } else {
        console.log(`Successfully sent reply to Telegram Chat ID: ${chatId}`);
        
        // Forward conversation copy back to the owner's channel for situational awareness and direct overrides
        const finalOwnerId = detectedOwnerChatId || (ownerChatIdStr && ownerChatIdStr.trim() !== '' && ownerChatIdStr !== 'YOUR_PERSONAL_TELEGRAM_CHAT_ID' ? parseInt(ownerChatIdStr.trim(), 10) : null);
        if (finalOwnerId && chatId !== finalOwnerId) {
          try {
            await fetch(telegramUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: finalOwnerId,
                text: `🔔 **Clinic Message Received**\n👤 Client Chat ID: \`${chatId}\`\n💬 Client Text: "${text}"\n\n🤖 **Bot Response Sent**:\n"${replyText}"\n\n👉 *To override and reply directly, simply click "Reply" to this message in Telegram.*`,
                parse_mode: 'Markdown',
              }),
            });
          } catch (fwErr) {
            console.warn('Failed to forward copy to owner Telegram window:', fwErr);
          }
        }
      }
    } catch (err: any) {
      console.error(`Error querying Gemini or reply delivery:`, err);
    }
  }

  // Vite middleware setup to serve landing page and preview at /
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start the server (bind to 0.0.0.0 and port 3000)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Full-stack server listening on http://0.0.0.0:${PORT}`);

    // Proactive automatic Telegram webhook setup helper
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const appUrl = process.env.APP_URL;

    if (botToken) {
      // Auto-discover bot username from Telegram
      const getMeUrl = `https://api.telegram.org/bot${botToken}/getMe`;
      fetch(getMeUrl)
        .then((r) => r.json())
        .then((data: any) => {
          if (data.ok && data.result?.username) {
            cachedBotUsername = data.result.username;
            console.log(`Discovered Telegram Bot username: @${cachedBotUsername}`);
          } else {
            console.error('getMe response was not ok or has no username:', data);
          }
        })
        .catch((err) => console.error('Failed to auto-discover Telegram Bot username:', err));
    }

    if (botToken && appUrl) {
      const cleanUrl = appUrl.endsWith('/') ? appUrl : appUrl + '/';
      const webhookUrl = `${cleanUrl}webhook`;
      const setWebhookUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

      console.log(`Setting up Telegram Webhook to target url: ${webhookUrl}`);
      fetch(setWebhookUrl)
        .then((r) => r.json())
        .then((resJson) => console.log('Telegram webhook registration output:', resJson))
        .catch((err) => console.error('Telegram webhook registration failure:', err));
    } else {
      console.log('Skipping proactive Telegram webhook setup. Ensure botToken and appUrl are set.');
    }
  });
}

startServer();

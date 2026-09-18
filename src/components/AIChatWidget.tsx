import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Calendar } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hi there! I'm the digital assistant for Fran Lee's AI Setup Service. I can explain our South Dublin premium website and booking system package, or help you secure a slot! How can I help you today? ✨",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGcpAlert, setShowGcpAlert] = useState(false);
  const [lastErrorDetails, setLastErrorDetails] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: 'What is the offer? 🏷️', text: 'What is your complete offer and package details?' },
    { label: 'How much does it cost? 💶', text: 'How much does the setup and monthly fee cost?' },
    { label: 'Contact Fran ✉️', text: 'How do I get in touch or contact Fran?' },
  ];

  // Intelligent local fallback generator for perfect resilience
  const getOfflineFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('offer') || q.includes('package') || q.includes('what do') || q.includes('service') || q.includes('complete') || q.includes('setup') || q.includes('starter') || q.includes('growth')) {
      return "Fran Lee's Done-For-You AI Clinic Setup is a premium patient acquisition suite. It includes three core deliverables: (1) an ultra-fast, bespoke responsive website, (2) an automated slot-scheduling online calendar, and (3) a customized 24/7 interactive AI Assistant tailored directly to your clinic regulations, pricing structures, and booking links to convert visitors around the clock. ✨";
    }
    
    if (q.includes('price') || q.includes('cost') || q.includes('charging') || q.includes('fee') || q.includes('euro') || q.includes('€') || q.includes('month') || q.includes('pay') || q.includes('bill') || q.includes('vat')) {
      return "Our flagship 'Growth' package is €750 flat setup/onboarding plus a recurring €99/month ongoing maintenance. This handles premium CDN hosting, scheduled system updates, domain/DNS upkeep, and covers all Gemini AI token quotas and scheduling API requests out of the box. No external keys or developer profiles required! 💶";
    }
    
    if (q.includes('book') || q.includes('call') || q.includes('schedule') || q.includes('contact') || q.includes('appointment') || q.includes('slot') || q.includes('consult')) {
      return "Reaching out is simple! You can submit your project details directly in the 'Let's talk about your project' contact form on this page, or email Fran directly at franny.lee@gmail.com. Fran will review your requirements and reply within 24 hours! ✉️";
    }

    if (q.includes('telegram') || q.includes('bot') || q.includes('whatsapp') || q.includes('phone') || q.includes('mobile')) {
      return "Yes! In addition to this website's chat bubble, we build standalone Telegram bots and WhatsApp automation paths. This lets you receive instantly routed appointment alerts on your phone, step in to talk to patients manually, or let your custom AI engine handle inquiries at 3 AM.";
    }

    if (q.includes('ireland') || q.includes('dublin') || q.includes('south dublin') || q.includes('local') || q.includes('who is')) {
      return "Fran Lee is a Dublin-based AI operations and software systems expert, hand-building high-conversion patient intake funnels and bespoke chatbots for practices and clinics across South Dublin. 🇮🇪";
    }

    return "I am Fran Lee's automated clinical setup assistant. While we finalize our cloud API pipeline, I am pre-programmed with all details of our service! Our core Growth tier offers a full custom clinical website, automated scheduling calendar integration, and a custom-tailored 24/7 AI chat assistant for €750 setup + €99/month. Would you like to schedule a free discovery call with Fran?";
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Listen to open-ai-chat custom events
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      setIsOpen(true);
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        // Prevent duplicate appending
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].text === customEvent.detail.message) {
            return prev;
          }
          return [...prev, { role: 'model', text: customEvent.detail.message }];
        });
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message to UI
    const updatedMessages = [...messages, { role: 'user', text: textToSend } as ChatMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Prepare to invoke real API or fallback gracefully
    try {
      const rawContents = updatedMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: rawContents }),
      });

      if (!res.ok) {
        // Read response body to extract rich Google API error diagnostics
        let isRefErr = false;
        let errText = 'Server Error';
        try {
          const errData = await res.json();
          isRefErr = errData.isReferrerError;
          errText = errData.error || errText;
        } catch (_) {}
        
        throw { message: errText, isReferrerError: isRefErr };
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: data.reply || "I'm having a small connection issue. Can you ask that again?" },
      ]);
      setShowGcpAlert(false);
    } catch (err: any) {
      console.warn('Real AI API failed, routing to local FAQ knowledge helper.', err);
      
      const isReferrerError = err?.isReferrerError || 
                              err?.message?.toLowerCase().includes('referer') || 
                              err?.message?.toLowerCase().includes('referrer') ||
                              err?.message?.toLowerCase().includes('blocked');
      
      const isDevHost = window.location.hostname.includes('localhost') || 
                        window.location.hostname.includes('ais-dev') || 
                        window.location.hostname.includes('ais-pre');
      
      if (isReferrerError && isDevHost) {
        setShowGcpAlert(true);
        setLastErrorDetails(err?.message || 'API Key referrer restriction blocked this call.');
      }

      // Generate localized, polished response based on business rules
      const simulatedReply = getOfflineFallbackResponse(textToSend);
      
      // Delay simulated reply for 600ms to mimic model processing cleanly
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: simulatedReply },
        ]);
        setIsLoading(false);
      }, 550);
      return; // Skip standard finally block as we handle state asynchronously here
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans" id="ai-chat-widget-root">
      {/* Activator Floating Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="ai-chat-widget-trigger"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium pl-3.5 pr-5 py-3 shadow-[0_8px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] transition-all cursor-pointer group border border-white/15"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <div className="bg-white/10 p-2 rounded-full">
                <MessageSquare className="h-4.5 w-4.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 font-mono">24/7 Live Agent</span>
              <span className="text-sm font-semibold text-white">Ask AI Assistant</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            className="w-[360px] sm:w-[400px] h-[550px] rounded-3xl bg-zinc-950 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-zinc-900 border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    24/7 AI Assistant
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">FRAN LEE · CLINICAL SYSTEM</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center border text-[10px] shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                        : 'bg-zinc-900/90 text-zinc-200 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 animate-bounce" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-zinc-900/90 border border-white/5 px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Developer GCP API Key Alert */}
            {showGcpAlert && (
              <div className="mx-4 my-2 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200">
                <p className="font-bold flex items-center gap-1.5 mb-1 text-amber-300">
                  ⚠️ Google Cloud Restricted Key Alert
                </p>
                <p className="leading-relaxed mb-2 font-medium">
                  Your <code className="bg-zinc-900 px-1 py-0.5 rounded text-amber-100 font-mono text-[10px]">GEMINI_API_KEY</code> has website referrer constraints which block server-side requests (Node on Cloud Run).
                </p>
                <div className="space-y-1 text-[10px] leading-relaxed text-zinc-350 bg-black/45 p-2 rounded-xl border border-white/5">
                  <p><strong>To fix:</strong> Go to <strong>Google Cloud Console &rarr; APIs &amp; Services &rarr; Credentials</strong>.</p>
                  <p>Edit this API Key and set <strong>Application restrictions</strong> to <strong>None</strong> (or use <strong>API restrictions</strong> to lock it to <em>Generative Language API</em> only).</p>
                </div>
              </div>
            )}

            {/* Suggestions Quick actions */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-white/5 bg-zinc-950/45 space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">RECOMMENDED QUESTIONS:</span>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt.text)}
                      className="text-left text-xs bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-white/5 hover:border-emerald-500/20 px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Form Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-zinc-950 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question about €750 package..."
                disabled={isLoading}
                className="flex-1 bg-zinc-900 border border-white/10 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

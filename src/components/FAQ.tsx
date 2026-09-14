import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'setup',
    question: 'What is included in the €750 Setup package?',
    answer: 'The setup package includes a custom-designed, SEO-friendly, mobile-optimized professional website tailored to your practice or small business. Additionally, we integrate an automated scheduling calendar (like Cal.com or similar), build your custom-trained 24/7 AI Chat Assistant, and configure the automated booking flows.'
  },
  {
    id: 'monthly',
    question: 'What does the €99/month subscription cover?',
    answer: 'The monthly fee hosts your website on highly secure, lightning-fast servers (Cloud Run CDN). It includes continuous security updates, minor content changes, domain/DNS upkeep, and active monitoring. Most importantly, it fully covers your Gemini AI token usage quotas and live calendar API routing fees.'
  },
  {
    id: 'hidden-costs',
    question: 'Are there any hidden costs or API subscriptions?',
    answer: 'None. We believe in absolute transparency. Your €99 monthly fee covers the essential AI and scheduling integrations without you needing to sign up for external API developer accounts.'
  },
  {
    id: 'customize',
    question: 'How is the AI trained or customized for my practice?',
    answer: 'Fran conducts a thorough clinical/business intake interview with you. We collect your booking rules, treatments list, price lists, and clinic policies. All this knowledge is converted into strict system instructions for your chatbot, ensuring it never invents details and always represents your brand accurately.'
  },
  {
    id: 'telegram',
    question: 'How does the Telegram bot work for business owners?',
    answer: 'For businesses wanting real-time notification or response capability, we offer active clinical setup assistant chatbots connected directly via Telegram. This lets you receive client booking alerts instantly on your phone, step in to talk to patients, or let the AI handle questions at any hour.'
  },
  {
    id: 'contract',
    question: 'Is there a long-term contract requirement?',
    answer: 'No. The €99/month service is billed monthly on a cancel-at-any-time schedule. You own your service assets, and we allow seamless buyout transitions if you ever wish to host and maintain the system yourself.'
  }
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="border-b border-white/10 bg-transparent px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            FAQ
          </p>
          <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Have questions about the setup, recurring hosting, or the interactive AI assistant? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isExpanded = expandedId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`rounded-2xl border transition-all ${
                  isExpanded 
                    ? 'border-accent/40 bg-[#0E0E0E] shadow-[0_4px_20px_rgba(209,178,128,0.05)]' 
                    : 'border-white/5 bg-[#0A0A0A]/65 hover:border-white/10'
                }`}
              >
                <button
                  id={`faq-btn-${faq.id}`}
                  onClick={() => toggle(faq.id)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-white focus:outline-none cursor-pointer select-none"
                >
                  <span className="flex items-center gap-3 font-medium text-sm sm:text-base">
                    <HelpCircle className={`h-4 w-4 shrink-0 transition-colors ${isExpanded ? 'text-accent' : 'text-zinc-500'}`} />
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-colors ${
                    isExpanded ? 'bg-accent/10 border-accent/35 text-accent' : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}>
                    {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm leading-relaxed text-zinc-400 font-medium">
                        <div className="h-px bg-white/5 mb-4" />
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Still have queries? Let our 24/7 Assistant know or{' '}
            <a 
              href="https://cal.com/fran-lee-mnjzic" 
              target="_blank" 
              rel="noreferrer" 
              className="text-accent underline hover:text-white transition-colors"
            >
              schedule a discovery call
            </a>{' '}
            with Fran.
          </p>
        </div>
      </div>
    </section>
  );
}

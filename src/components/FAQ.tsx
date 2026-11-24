import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface FAQProps {
  audioEnabled: boolean;
}

interface FAQItem {
  id: string;
  index: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'setup',
    index: '01',
    question: 'What is included in the €750 Growth setup?',
    answer:
      'The setup covers a custom-designed, fast-loading, mobile-optimised website engineered specifically for your practice or business. It also includes automated calendar scheduling, a custom-trained 24/7 AI intake assistant, and end-to-end booking notification workflows.',
  },
  {
    id: 'monthly',
    index: '02',
    question: 'What does the €99/month subscription cover?',
    answer:
      'It covers fast, secure hosting, continuous security updates, minor content and copy adjustments, domain and DNS upkeep, and active uptime monitoring. Crucially, it also includes your AI token usage quotas and live booking calendar API routing.',
  },
  {
    id: 'hidden-costs',
    index: '03',
    question: 'Are there any hidden costs or third-party API fees?',
    answer:
      'None. Your €99 monthly plan covers the core AI and scheduling infrastructure without requiring you to set up or manage separate developer billing accounts.',
  },
  {
    id: 'customize',
    index: '04',
    question: 'How is an AI assistant trained for my specific practice?',
    answer:
      'We start with a focused intake session covering your services, pricing, booking rules, and clinic or business policies. That verified knowledge is locked into strict system instructions so your assistant represents your brand accurately and never invents details.',
  },
  {
    id: 'notifications',
    index: '05',
    question: 'How do I receive new bookings and client inquiries?',
    answer:
      'Whenever a client books a session or submits an inquiry, structured details are routed straight to your email or designated device—ready for immediate follow-up without manual inbox sorting.',
  },
  {
    id: 'contract',
    index: '06',
    question: 'Is there a long-term lock-in contract?',
    answer:
      'No. The €99/month plan is billed month-to-month and can be cancelled at any time. You own your domain and brand assets, and you can transition to a full one-off Buyout whenever you choose.',
  },
];

export default function FAQ({ audioEnabled }: FAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>('setup');

  const toggle = (id: string) => {
    playHoverChime('toggle', audioEnabled);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Header Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Common Questions
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.08]">
              Straight answers before we start.
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400">
              Everything you need to know about build scope, monthly hosting, ownership, and how automation fits your workflow.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-zinc-500">
                Have a specific setup or integration question?
              </p>
              <a
                href="#contact"
                onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                className="group mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-accent transition-colors"
              >
                <span>Message Fran directly</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right Hairline Accordion */}
          <div className="lg:col-span-8 border-t border-white/10 divide-y divide-white/10">
            {FAQS.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                  className="transition-colors duration-150"
                >
                  <button
                    id={`faq-btn-${faq.id}`}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`faq-panel-${faq.id}`}
                    onClick={() => toggle(faq.id)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span
                        className={`font-mono text-xs tabular-nums transition-colors ${
                          isExpanded ? 'text-accent' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}
                      >
                        {faq.index}
                      </span>
                      <span
                        className={`font-display text-base sm:text-lg font-semibold leading-snug transition-colors ${
                          isExpanded ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-colors ${
                        isExpanded
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : 'border-white/10 bg-[#0D0D0F] text-zinc-400 group-hover:border-white/25 group-hover:text-white'
                      }`}
                    >
                      {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`faq-panel-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-9 sm:pl-11 pr-10 pb-6 text-sm sm:text-[15px] leading-relaxed text-zinc-400">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

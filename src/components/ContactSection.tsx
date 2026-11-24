import React, { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Linkedin,
  MapPin,
  Clock,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { playHoverChime } from '../utils/audio';
import type { InquiryBrief } from '../types';

interface ContactSectionProps {
  audioEnabled: boolean;
  inquiryBrief: InquiryBrief | null;
  onClearBrief: () => void;
}

export default function ContactSection({
  audioEnabled,
  inquiryBrief,
  onClearBrief,
}: ContactSectionProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (inquiryBrief) {
      setFormData((prev) => ({
        ...prev,
        message: inquiryBrief.summaryText,
      }));
      if (status === 'success') {
        setStatus('idle');
      }
    }
  }, [inquiryBrief, status]);

  const handleClear = () => {
    playHoverChime('toggle', audioEnabled);
    onClearBrief();
    setFormData((prev) => ({ ...prev, message: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const formPayload = new FormData();
      formPayload.append('access_key', 'f520cdcf-ea91-4f86-859b-14a431cc2280');
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('message', formData.message);
      formPayload.append(
        'subject',
        inquiryBrief
          ? `New Project Inquiry (${inquiryBrief.recommendedTier}) from ${formData.name}`
          : `New Project Inquiry from ${formData.name}`,
      );
      formPayload.append('from_name', 'Fran Lee Portfolio');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formPayload,
      });

      const data = await response.json();

      if (data.success) {
        playHoverChime('mint', audioEnabled);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        onClearBrief();
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        'Network error while submitting. Please check your connection and try again.',
      );
    }
  };

  return (
    <section
      id="contact"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct 1-on-1 Partner Details & Attached Brief */}
          <div className="lg:col-span-5">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Direct Inquiry
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Start the conversation.
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-400">
              Whether you run a private clinic, lead a coaching practice, or are building a founder-led business, tell me what you want to launch or automate. Every message goes directly to me—no account managers, no agency handoffs.
            </p>

            {/* Hairline Direct Contact Details */}
            <dl className="mt-9 border-t border-white/10 divide-y divide-white/10">
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  <span>Base</span>
                </dt>
                <dd className="text-right text-sm text-zinc-200">
                  Dublin, Ireland · IE, UK &amp; EU clients
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <Clock className="h-3.5 w-3.5 text-signal" />
                  <span>Response</span>
                </dt>
                <dd className="text-right text-sm text-zinc-200">
                  Direct 1-on-1 reply within 24 hours
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4">
                <dt className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                  <Linkedin className="h-3.5 w-3.5 text-zinc-400" />
                  <span>LinkedIn</span>
                </dt>
                <dd className="text-right text-sm">
                  <a
                    href="https://www.linkedin.com/in/franleeprofile/"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => playHoverChime('soft', audioEnabled)}
                    className="group inline-flex items-center gap-1 text-zinc-200 hover:text-accent transition-colors"
                  >
                    <span>linkedin.com/in/franleeprofile</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </dd>
              </div>
            </dl>

            {/* Attached Blueprint / Package Summary */}
            {inquiryBrief && (
              <div className="mt-8 border border-accent/45 bg-[#11100E] p-6">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.12em] text-accent">
                      {inquiryBrief.source === 'configurator'
                        ? 'Attached Engine Blueprint'
                        : 'Selected Package'}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">
                      {inquiryBrief.recommendedTier}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear attached brief"
                    className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-1 font-mono text-[11px] text-zinc-400 hover:border-white/35 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>

                <dl className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-zinc-500">Investment</dt>
                    <dd className="font-mono font-medium text-white tabular-nums">
                      {inquiryBrief.priceLabel}
                    </dd>
                  </div>
                  {inquiryBrief.verticalLabel && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-zinc-500">Profile</dt>
                      <dd className="text-zinc-200">{inquiryBrief.verticalLabel}</dd>
                    </div>
                  )}
                  {inquiryBrief.estimatedAnnualValue && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-zinc-500">Est. Annual Value</dt>
                      <dd className="font-mono font-medium text-signal tabular-nums">
                        {inquiryBrief.estimatedAnnualValue}
                      </dd>
                    </div>
                  )}
                  {inquiryBrief.estimatedHoursReclaimed && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-zinc-500">Time Reclaimed</dt>
                      <dd className="font-mono text-zinc-200 tabular-nums">
                        {inquiryBrief.estimatedHoursReclaimed}
                      </dd>
                    </div>
                  )}
                  {inquiryBrief.timeline && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="font-mono text-zinc-500">Target Sprint</dt>
                      <dd className="font-mono text-zinc-200 tabular-nums">
                        {inquiryBrief.timeline}
                      </dd>
                    </div>
                  )}
                </dl>

                {inquiryBrief.modules && inquiryBrief.modules.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="font-mono text-[11px] text-zinc-500">Included Modules</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                      {inquiryBrief.modules.join(' · ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Sharp Web3Forms Surface */}
          <div className="lg:col-span-7">
            <div className="border border-white/15 bg-[#0D0D0F] p-7 sm:p-10">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center border border-signal/40 bg-signal/10 text-signal">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">
                    Message Received
                  </h3>
                  <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. I will review your project details personally and reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-8 inline-flex items-center justify-center border border-white/20 px-6 py-3 text-xs font-mono uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:text-accent cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <input
                    type="hidden"
                    name="access_key"
                    value="f520cdcf-ea91-4f86-859b-14a431cc2280"
                  />
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="form-name"
                        className="block font-mono text-xs text-zinc-400 mb-2"
                      >
                        Your Name <span className="text-accent">*</span>
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Dr. Sarah Jenkins"
                        className="w-full border border-white/15 bg-[#070708] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="form-email"
                        className="block font-mono text-xs text-zinc-400 mb-2"
                      >
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="sarah@yourclinic.ie"
                        className="w-full border border-white/15 bg-[#070708] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <label
                        htmlFor="form-message"
                        className="block font-mono text-xs text-zinc-400"
                      >
                        Project Details / Message <span className="text-accent">*</span>
                      </label>
                      {inquiryBrief && (
                        <span className="font-mono text-[11px] text-signal">
                          Blueprint pre-filled
                        </span>
                      )}
                    </div>
                    <textarea
                      id="form-message"
                      name="message"
                      required
                      rows={7}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell me a little about your clinic, coaching practice, or business, and the bottleneck you want to solve..."
                      className="w-full border border-white/15 bg-[#070708] px-4 py-3 text-sm leading-relaxed text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors resize-y"
                    />
                  </div>

                  {status === 'error' && (
                    <div
                      role="alert"
                      className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200 flex items-center gap-2.5"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="font-mono text-[11px] text-zinc-500">
                      Delivered directly to Fran&apos;s inbox via Web3Forms.
                    </p>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      onMouseEnter={() => playHoverChime('gold', audioEnabled)}
                      className="group inline-flex items-center justify-center gap-2.5 bg-accent px-7 py-3.5 text-sm font-semibold text-[#070708] transition-colors duration-150 hover:bg-[#DFC496] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      {status === 'submitting' ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#070708] border-r-transparent" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Inquiry</span>
                          <Send className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

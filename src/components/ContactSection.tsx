import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Linkedin } from 'lucide-react';

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

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
      formPayload.append('subject', `New Project Inquiry from ${formData.name}`);
      formPayload.append('from_name', 'Fran Lee Portfolio');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formPayload,
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error while submitting. Please check your connection and try again.');
    }
  };

  return (
    <section id="contact" className="border-b border-white/10 bg-transparent px-6 py-24 scroll-mt-16 relative">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-accent font-bold flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            Let's Talk About Your Project
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl uppercase">
            Start the conversation.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 font-medium">
            Whether you run a private clinic, manage a coaching practice, or are scaling a boutique business, let me know what you're looking to build or streamline.
          </p>
        </div>

        {/* Web3Forms Contact Form */}
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 sm:p-10 backdrop-blur-sm shadow-2xl relative">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-white">Message Received</h3>
                <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out! I will review your project details and get back to you directly within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-2.5 text-xs font-bold text-white transition-colors hover:border-accent hover:text-accent"
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
                {/* Web3Forms Access Key */}
                <input type="hidden" name="access_key" value="f520cdcf-ea91-4f86-859b-14a431cc2280" />
                {/* Honeypot Spam Protection */}
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div>
                  <label htmlFor="form-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Your Name <span className="text-accent">*</span>
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Jenkins / Liam Murphy"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Email Address <span className="text-accent">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@exampleclinic.ie"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="form-message" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Project Details / Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me a bit about your business, the systems you're currently using, or what bottleneck you want to solve..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none font-sans"
                  />
                </div>

                {status === 'error' && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/10"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-r-transparent" />
                      <span>Submitting Form...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Form</span>
                      <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-zinc-500 font-mono flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <span>Direct delivery to Fran's inbox via Web3Forms.</span>
                  <span className="hidden sm:inline">·</span>
                  <a
                    href="https://www.linkedin.com/in/franleeprofile/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-accent transition-colors underline"
                  >
                    <Linkedin className="h-3 w-3" />
                    Connect on LinkedIn
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

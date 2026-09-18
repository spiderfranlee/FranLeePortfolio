import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Globe, CalendarCheck, MessageSquare, PhoneCall, Check, Linkedin } from 'lucide-react';

const playOfferHoverSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.012, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    masterGain.connect(ctx.destination);

    // Dynamic offer sound: high-value dual chime pitch (C6 & E6 rising to G6)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.50, now); // C6
    osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.15); // G6
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now); // E6
    osc2.frequency.exponentialRampToValueAtTime(1959.98, now + 0.15); // G6 range
    
    osc1.connect(masterGain);
    osc2.connect(masterGain);
    
    osc1.start(now);
    osc1.stop(now + 0.5);
    osc2.start(now);
    osc2.stop(now + 0.5);
  } catch (error) {
    // Autoplay restrictions
  }
};

/**
 * HERO — SMB consulting / lead-gen cut.
 *
 * This is a SALES page now, not a portfolio. The reader is a busy electrician or
 * plumber, not a hiring manager. So:
 *  - Headline names their problem in their words ("on the tools"), not your stack.
 *  - No "RAG pipelines / agent workflows" jargon — they don't care how it's built.
 *  - Price is on the page. Trades walk when pricing is hidden.
 *  - One dominant CTA (book a call). Everything else is secondary.
 *  - Right panel is the OFFER (what you get + price), not GitHub repos.
 *  - Trust chips replace credentials: local, fast, no lock-in.
 *
 * EDIT THESE: the booking link, phone/email, the price, and the target trades.
 */

const ACCENT = '#D1B280';

const LINKS = {
  contact: '#contact',
  tel: 'tel:+353871234567',
  email: 'mailto:franny.lee@gmail.com',
};

// Pricing config
const PRICE = { setup: '€750', monthly: '€99' };

const INCLUDED = [
  { icon: Globe, title: 'Clean digital systems', blurb: 'Bespoke, high-performing websites and digital hubs engineered for clinics, coaches, and modern service businesses.' },
  { icon: CalendarCheck, title: 'Integrated booking & automations', blurb: 'Frictionless patient and client scheduling, payment setup, and calendar sync that runs on autopilot.' },
  { icon: MessageSquare, title: 'AI assistants & smart routing', blurb: 'Qualify inbound inquiries and support clients 24/7 without burning your own time.' },
  { icon: PhoneCall, title: 'Handoff & full walk-through', blurb: 'Keys in hand, complete walkthrough, and zero lock-in so you stay 100% in control.' },
];

const TRUST = ['1-on-1 technical partner', 'Clinics, coaches & small businesses', 'You keep 100% control'];

export default function Hero() {
  const offerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!offerRef.current) return;
    const rect = offerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playOfferHoverSound();
  };

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const rotateX = isHovered && offerRef.current && !isReduced
    ? -((coords.y - offerRef.current.offsetHeight / 2) / offerRef.current.offsetHeight) * 12
    : 0;
  const rotateY = isHovered && offerRef.current && !isReduced
    ? ((coords.x - offerRef.current.offsetWidth / 2) / offerRef.current.offsetWidth) * 12
    : 0;

  return (
    <section
      id="top"
      className="relative mt-16 sm:mt-20 min-h-[calc(100vh-4rem)] border-b border-white/10 bg-transparent text-primary-300"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${ACCENT}22, transparent 70%)` }}
      />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:gap-16 lg:py-0">
        {/* LEFT: their problem, the offer in one line, the CTA */}
        <div className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-accent font-bold"
          >
            1-on-1 Technical Partnership · Dublin
          </motion.p>

          <h1 className="font-display text-balance text-5xl font-black leading-[1.0] md:leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
            <span className="block overflow-hidden relative" style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
              <span 
                className="block animate-slide-up"
                style={{
                  animationDelay: '0ms',
                }}
              >
                You master the craft.
              </span>
            </span>
            <span className="block overflow-hidden relative text-accent" style={{ paddingBottom: '0.18em', marginBottom: '-0.18em' }}>
              <span 
                className="block animate-slide-up"
                style={{
                  animationDelay: '80ms',
                }}
              >
                I’ll build the engine.
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 font-medium"
          >
            I partner 1-on-1 with ambitious founders, clinic owners, coaches, and small businesses to turn messy tech, clunky tools, and broken workflows into clean, high-performing digital systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              onClick={() => {
                setTimeout(() => {
                  const el = document.getElementById('form-name');
                  if (el) el.focus();
                }, 300);
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-bold text-black transition-transform active:scale-95 cursor-pointer shadow-[0_4px_25px_rgba(209,178,128,0.25)] hover:shadow-[0_8px_35px_rgba(209,178,128,0.4)]"
            >
              Let's Talk About Your Project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* Trust row — what a tradesperson actually wants reassured */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
          >
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-primary-400 font-semibold">
                <Check className="h-4 w-4 text-accent" />
                {t}
              </li>
            ))}
          </motion.ul>

          {/* Meet Your Partner Biography Block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-white/5 bg-[#080808] p-6 relative overflow-hidden group"
          >
            {/* Ambient indicator */}
            <div className="absolute top-0 left-0 w-2 h-full bg-accent" />

            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-zinc-800 bg-[#121212] flex items-center justify-center">
              <img
                src="/fran_headshot.jpg"
                alt="Fran Lee"
                onError={(e) => {
                  // If image is missing, dynamically display default typography fallback index letter
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="h-full w-full object-cover object-center"
              />
              <div 
                className="avatar-fallback hidden absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-tr from-[#D1B280]/20 to-[#0A0A0A] text-accent font-display text-xl font-black"
                style={{ display: 'none' }}
              >
                FL
              </div>
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h4 className="font-display text-lg font-black text-white uppercase tracking-tight">Fran Lee</h4>
                  <span className="rounded-sm bg-accent/10 border border-accent/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
                    Technical Corner Man
                  </span>
                </div>
                <a
                  href="https://www.linkedin.com/in/franleeprofile/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono text-zinc-300 hover:border-accent/50 hover:text-accent hover:bg-accent/10 transition-all self-center sm:self-auto"
                >
                  <Linkedin className="h-3 w-3 text-accent" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                Technical partner for clinic owners, coaches, and small business founders. BSc in Computer Science (UCD) with honors and AI distinction. Whether you’re on the clinic floor, coaching clients, or scaling your service, I handle the build, integrations, and digital heavy lifting so you can stay in your zone of genius.
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: the offer. What you get + the price, in plain sight. */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div
            ref={offerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: !isReduced 
                ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
                : 'none',
              transition: isHovered 
                ? 'transform 0.1s ease-out, border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: isHovered && !isReduced ? '0 25px 50px rgba(209, 178, 128, 0.12)' : 'none',
              zIndex: isHovered ? 20 : 1,
            }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent hover:border-accent/40 cursor-pointer"
          >
            {/* Spotlight overlay */}
            {isHovered && !isReduced && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(209, 178, 128, 0.08), transparent 70%)`,
                  zIndex: 2,
                }}
              />
            )}
            <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <span className="font-mono text-[11px] uppercase tracking-widest text-primary-500 font-bold">
                The Engine Package
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                1-on-1 Build
              </span>
            </div>

            <ul className="flex flex-col">
              {INCLUDED.map(({ icon: Icon, title, blurb }) => (
                <li key={title} className="flex items-start gap-4 border-b border-white/5 px-6 py-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-semibold text-white">{title}</div>
                    <div className="mt-0.5 text-sm leading-snug text-primary-400">{blurb}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline justify-between px-6 py-5">
              <div>
                <span className="font-display text-3xl font-black text-white">{PRICE.setup}</span>
                <span className="ml-2 text-sm text-primary-400">setup</span>
              </div>
              <div className="text-right">
                <span className="font-display text-2xl font-black text-white">{PRICE.monthly}</span>
                <span className="ml-1 text-sm text-primary-400">/mo support</span>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-primary-500">
            No lock-in. Cancel any time — you keep the site and systems.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

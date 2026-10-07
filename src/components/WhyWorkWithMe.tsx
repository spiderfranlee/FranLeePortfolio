import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Wrench, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import CornerWorker from './CornerWorker';

const ACCENT = '#D1B280';
const GREEN = '#2FA87A';

interface Pillar {
  id: string;
  tag: string;
  title: string;
  headline: string;
  text: string;
  icon: any;
  accent: string;
  highlight: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'reality',
    tag: '// 01. The Reality',
    title: 'The Reality',
    headline: 'Stop Wrestling With The Tech',
    text: "You shouldn't have to spend 20 hours wrestling with website builders, booking calendars, or integrations when you should be treating patients, working with clients, and running your business.",
    icon: Compass,
    accent: '#E06C75',
    highlight: '20+ hours saved per week'
  },
  {
    id: 'role',
    tag: '// 02. The Role I Play',
    title: 'The Role I Play',
    headline: 'Your Technical Corner Man',
    text: 'Think of me as your technical corner man. You bring the clinical, coaching, or industry expertise in what you do; I take care of the build, the connections, and the digital heavy lifting.',
    icon: Wrench,
    accent: ACCENT,
    highlight: 'Direct 1-on-1 engineer partner'
  },
  {
    id: 'delivery',
    tag: '// 03. The Delivery',
    title: 'The Delivery',
    headline: 'Handing You The Keys',
    text: 'No hand-waving or endless strategy decks. I get under the hood, build the solution, and hand you the keys with a clear walk-through so you feel 100% in control.',
    icon: Key,
    accent: GREEN,
    highlight: '100% ownership & clarity'
  }
];

interface Step {
  number: string;
  name: string;
  focus: string;
  whatHappens: string;
  duration: string;
  deliverable: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    name: 'Untangle',
    focus: 'The Bottleneck',
    whatHappens: "We sit down 1-on-1, identify what’s stalling your launch, and map the cleanest path to get live.",
    duration: 'Kickoff Call · 45 mins',
    deliverable: 'Clear system architecture & launch roadmap'
  },
  {
    number: '02',
    name: 'Build',
    focus: 'Hands-on Craft',
    whatHappens: 'I engineer the bespoke website, booking engine, and automations to make your clinic or business look and run like a tier-one brand.',
    duration: 'Deep Sprint · 7–14 days',
    deliverable: 'Bespoke website, booking engine & workflow automation'
  },
  {
    number: '03',
    name: 'Launch',
    focus: 'The Handoff',
    whatHappens: 'We walk through the finished build together. You get the confidence, clarity, and momentum to launch.',
    duration: 'Live Session · Keys In Hand',
    deliverable: 'Recorded walk-through, DNS switch & 100% sovereignty'
  }
];

export default function WhyWorkWithMe() {
  const [activeStep, setActiveStep] = useState(0);
  const [workImpact, setWorkImpact] = useState(false);

  const handleWorkImpact = () => {
    setWorkImpact(true);
    setTimeout(() => setWorkImpact(false), 90);
  };

  return (
    <section id="approach" className="relative border-b border-white/10 bg-transparent px-6 py-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[55rem] rounded-full blur-[140px] opacity-25"
        style={{ background: `radial-gradient(circle, ${ACCENT}40, transparent 70%)` }}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* ============================================================ */}
        {/* PART 1: The Problem & Solution (Why Work With Me)           */}
        {/* ============================================================ */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-accent uppercase">
                  Why Work With Me
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.0]">
                The Problem &amp; Solution.
              </h2>
            </div>
            <p className="max-w-md text-sm md:text-base text-zinc-400 font-sans leading-relaxed">
              No agencies. No junior handoffs. Direct collaboration for clinic owners, coaches, and small business founders who need their systems to run on autopilot.
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-6 sm:p-8 transition-all duration-300 hover:border-accent/40 hover:bg-zinc-950/80 hover:-translate-y-1 shadow-lg overflow-hidden"
                >
                  {/* Accent Top Border Bar */}
                  <div 
                    className="absolute top-0 left-6 right-6 h-[2px] transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                    style={{ backgroundColor: p.accent }}
                  />

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                        {p.tag}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 border border-white/10 px-2 py-0.5 rounded shrink-0">
                        {p.highlight}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" style={{ color: p.accent }} />
                    </div>

                    <span className="font-mono text-xs uppercase tracking-widest font-black block mb-2" style={{ color: p.accent }}>
                      {p.title}
                    </span>

                    <h3 className="font-display text-2xl font-black text-white tracking-tight mb-4">
                      {p.headline}
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-350 font-medium">
                      {p.text}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400 group-hover:text-zinc-300">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                      Zero fluff approach
                    </span>
                    <span className="font-bold">0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PART 2: How I Work (3-Step Scaffolding)                      */}
        {/* ============================================================ */}
        <div className="w-full max-w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-[#080808]/90 p-5 sm:p-10 lg:p-14 relative overflow-hidden">
          {/* Subtle architectural background crosshair */}
          <div className="hidden sm:block absolute top-6 right-8 text-xs font-mono text-white/10 uppercase tracking-widest select-none">
            ENGINE_EXECUTION_PROTOCOL // v3.2
          </div>

          <div className="max-w-3xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#2FA87A]/20 bg-[#2FA87A]/5 mb-3 sm:mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2FA87A] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#2FA87A] uppercase">
                3-Step Scaffolding
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.05] pt-12 sm:pt-14">
              <span>How I </span>
              <span 
                className={`relative inline-block transition-colors duration-150 ${
                  workImpact 
                    ? 'text-white [text-shadow:0_0_20px_#D1B280,0_0_35px_#D1B280]' 
                    : 'text-accent [text-shadow:0_0_10px_rgba(209,178,128,0.25)]'
                }`}
              >
                <span>Work.</span>
                {/* Pickaxe Silhouette Craftsman tapping on top of the work with edge sparks */}
                <CornerWorker position="on-word" boxLabel="How I Work" onImpact={handleWorkImpact} />
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              From our first conversation to full production launch, here is the exact 3-step roadmap to get your digital engine built, integrated, and humming.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 relative w-full">
            {STEPS.map((s, index) => {
              const isSelected = activeStep === index;
              return (
                <div
                  key={s.number}
                  onClick={() => setActiveStep(index)}
                  className={`cursor-pointer rounded-2xl border p-5 sm:p-7 lg:p-8 transition-all duration-300 flex flex-col justify-between relative w-full max-w-full overflow-hidden ${
                    isSelected 
                      ? 'border-accent bg-gradient-to-b from-white/[0.07] to-[#0d0d0d] shadow-[0_10px_30px_rgba(209,178,128,0.12)]' 
                      : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="w-full">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 sm:pb-5 border-b border-white/10 mb-5 sm:mb-6">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <span className="font-mono text-2xl sm:text-3xl font-black text-accent shrink-0">
                          {s.number}.
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight break-words">
                          {s.name}
                        </span>
                      </div>
                      <span className="rounded bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold shrink-0">
                        Step {s.number}
                      </span>
                    </div>

                    {/* Focus Badge */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                        Primary Focus:
                      </span>
                      <span className="inline-block max-w-full font-mono text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 border border-accent/25 px-2.5 py-1 rounded break-words">
                        {s.focus}
                      </span>
                    </div>

                    {/* What Happens Narrative */}
                    <div className="mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
                        What Happens:
                      </span>
                      <p className="text-sm md:text-base leading-relaxed text-zinc-300 font-medium break-words">
                        "{s.whatHappens}"
                      </p>
                    </div>
                  </div>

                  {/* Footnotes / Deliverables */}
                  <div className="pt-5 border-t border-white/5 space-y-2.5 w-full">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-500 shrink-0">Timeline</span>
                      <span className="font-semibold text-zinc-300 text-right">{s.duration}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-500 shrink-0">Deliverable</span>
                      <span className="font-semibold text-left sm:text-right text-accent/90 break-words">{s.deliverable}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action bar */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>Direct personal collaboration. No outsourcing. You talk straight to the engineer building it.</span>
            </div>
            
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-black transition-transform active:scale-95 hover:bg-accent/90 shrink-0 cursor-pointer shadow-[0_4px_20px_rgba(209,178,128,0.25)] text-center w-full sm:w-auto"
            >
              Let's Talk About Your Project
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}

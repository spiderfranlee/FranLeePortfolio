import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface HeroProps {
  audioEnabled: boolean;
}

const PROOF_METRICS = [
  {
    value: '€750 + €99/mo',
    label: 'Complete Digital Engine',
    detail: 'Website, booking & 24/7 AI intake',
  },
  {
    value: '7–14 Days',
    label: 'Kickoff to Live Launch',
    detail: 'Direct 1-on-1 engineering sprint',
  },
  {
    value: 'Computer Science and AI',
    label: 'Verified CS Foundation',
    detail: 'BSc Computer Science & 2× Distinction',
  },
  {
    value: '100% Ownership',
    label: 'Zero Agency Lock-In',
    detail: 'Your domain, code & full walkthrough',
  },
];

export default function Hero({ audioEnabled }: HeroProps) {
  const [imgState, setImgState] = useState<'remote' | 'local' | 'fallback'>('remote');

  const portraitSrc =
    imgState === 'remote'
      ? 'https://media.theresetclann.com/fran%20image.jpg'
      : '/fran_image.jpg';

  const handleImageError = () => {
    setImgState((prev) => (prev === 'remote' ? 'local' : 'fallback'));
  };

  return (
    <section
      id="top"
      className="relative pt-24 sm:pt-28 border-b border-white/10 bg-[#070708]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main 12-Column Architectural Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch gap-10 lg:gap-0 border-x border-t border-white/10 bg-[#0D0D0F]">
          {/* LEFT: Value Proposition & Primary Action */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-12 lg:p-14 lg:border-r border-white/10">
            <div>
              <p className="text-xs font-mono tracking-[0.16em] text-zinc-400">
                Dublin, Ireland
                <span className="mx-2.5 text-zinc-600" aria-hidden="true">·</span>
                <span className="text-accent">1-on-1 Technical Partner</span>
              </p>

              <h1 className="mt-6 font-display text-[clamp(2.5rem,4.6vw,4.35rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white text-balance">
                You master the craft.{' '}
                <span className="text-accent">I build the engine.</span>
              </h1>

              <p className="mt-6 max-w-[56ch] text-base sm:text-[17px] leading-[1.65] text-zinc-300">
                I partner directly with private clinic owners, coaches, and boutique founders to replace clunky DIY websites, manual scheduling, and disconnected tools with fast, self-running digital systems.
              </p>

              {/* Single Dominant Primary CTA + Quiet Secondary Anchor */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <a
                  href="#configurator"
                  onMouseEnter={() => playHoverChime('gold', audioEnabled)}
                  className="group inline-flex items-center gap-2.5 bg-accent px-7 py-3.5 text-sm font-semibold text-[#070708] transition-all duration-150 hover:bg-[#DFC496] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap shrink-0"
                >
                  <span>Configure Your Engine</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent whitespace-nowrap shrink-0"
                >
                  <span>Explore Live Builds</span>
                  <ArrowDownRight className="h-4 w-4 text-accent transition-transform duration-150 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Quiet Partner Credibility Footer inside Left Column */}
            <div className="mt-12 pt-7 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="leading-relaxed">
                <span className="text-zinc-200 font-medium">Direct engineering, zero agency handoffs.</span>{' '}
                Built for clinics, coaches, and service founders who want clarity and speed.
              </div>
              <a
                href="https://www.linkedin.com/in/franleeprofile/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-zinc-300 hover:text-accent transition-colors whitespace-nowrap shrink-0"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* RIGHT: Editorial Portrait Frame (Natural 4:5 Aspect with Faded Obsidian Side Borders) */}
          <div
            onMouseEnter={() => playHoverChime('soft', audioEnabled)}
            className="lg:col-span-5 flex flex-col justify-between bg-[#09090B] border-t lg:border-t-0 border-white/10"
          >
            {/* Portrait Stage */}
            <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] lg:min-h-0 flex items-center justify-center overflow-hidden bg-[#08080A]">
              {imgState !== 'fallback' ? (
                <>
                  {/* Ambient soft dark backdrop so edges melt seamlessly */}
                  <img
                    src={portraitSrc}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 blur-2xl scale-110"
                  />

                  {/* Natural 4:5 portrait keeping full face 100% visible */}
                  <div className="relative z-10 h-full w-full max-w-[320px] sm:max-w-[350px] aspect-[4/5] mx-auto overflow-hidden">
                    <img
                      src={portraitSrc}
                      alt="Fran Lee — Technical Systems Partner in Dublin"
                      onError={handleImageError}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  {/* Faded obsidian side and bottom scrims for seamless architectural framing */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-28 bg-gradient-to-r from-[#08080A] via-[#08080A]/85 to-transparent z-20" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-28 bg-gradient-to-l from-[#08080A] via-[#08080A]/85 to-transparent z-20" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#08080A]/75 to-transparent z-20" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#08080A] via-[#08080A]/75 to-transparent z-20" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <span className="font-display text-5xl font-bold tracking-tight text-accent">
                    FL
                  </span>
                  <span className="mt-2 font-mono text-xs text-zinc-500">
                    Fran Lee · Dublin
                  </span>
                </div>
              )}
            </div>

            {/* Clean Unboxed Portrait Caption Bar */}
            <div className="border-t border-white/10 px-6 sm:px-8 py-5 bg-[#0D0D0F] flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-base font-bold text-white tracking-tight">
                  Fran Lee
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  Technical Corner Man · Build &amp; Operations
                </div>
              </div>
              <div className="text-right font-mono text-[11px] text-signal tabular-nums whitespace-nowrap shrink-0">
                UCD BSc CS
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Architectural Proof Strip Below the Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 bg-[#0A0A0C] divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {PROOF_METRICS.map((metric) => (
            <div
              key={metric.label}
              onMouseEnter={() => playHoverChime('soft', audioEnabled)}
              className="p-6 lg:p-7 transition-colors duration-150 hover:bg-[#111114]"
            >
              <div className="font-mono text-lg sm:text-xl font-semibold text-white tabular-nums tracking-tight">
                {metric.value}
              </div>
              <div className="mt-1.5 text-sm font-medium text-accent">
                {metric.label}
              </div>
              <div className="mt-1 text-xs text-zinc-400 leading-relaxed">
                {metric.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breathing room before next section */}
      <div className="h-14 sm:h-16" aria-hidden="true" />
    </section>
  );
}

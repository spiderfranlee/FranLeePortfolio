import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface WhyWorkWithMeProps {
  audioEnabled: boolean;
}

interface Pillar {
  index: string;
  title: string;
  headline: string;
  text: string;
  outcome: string;
}

const PILLARS: Pillar[] = [
  {
    index: '01',
    title: 'The Reality',
    headline: 'Stop wrestling with fragile tech',
    text: "You shouldn't spend evenings fixing broken plugins, wrestling with booking calendars, or chasing scattered inquiries when you should be serving patients, coaching clients, and leading your business.",
    outcome: 'Reclaim 15–35+ hours every month',
  },
  {
    index: '02',
    title: 'The Role I Play',
    headline: 'Your technical corner man',
    text: 'You bring the clinical, coaching, or domain mastery. I handle the design, engineering, calendar integrations, AI intake, and DNS directly—1-on-1, with zero junior agency handoffs.',
    outcome: 'Direct 1-on-1 senior execution',
  },
  {
    index: '03',
    title: 'The Delivery',
    headline: 'Keys in hand, full ownership',
    text: 'No bloated strategy decks or lock-in contracts. I build the live engine, test every booking and alert path with you, and hand over full access with a clear recorded walkthrough.',
    outcome: '100% code and domain sovereignty',
  },
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
    name: 'Plan',
    focus: 'Challenges & Architecture',
    whatHappens:
      'We sit down 1-on-1 for 45 minutes to map your business goals, pinpoint the exact bottlenecks costing you time or bookings, and agree on a clear build plan.',
    duration: 'Kickoff Call · 45 mins',
    deliverable: 'Clear scope, timeline & fixed pricing',
  },
  {
    number: '02',
    name: 'Build',
    focus: 'Hands-On Engineering Sprint',
    whatHappens:
      'I build your bespoke website, automated scheduling engine, and AI intake routing end-to-end—sharing live staging previews so you see real progress every few days.',
    duration: 'Deep Sprint · 7–14 days',
    deliverable: 'Live staging build, booking & automation suite',
  },
  {
    number: '03',
    name: 'Launch',
    focus: 'Switch-Over & Walkthrough',
    whatHappens:
      'We walk through the finished platform together, point your custom domain, verify live notifications, and hand you the keys with complete clarity and zero friction.',
    duration: 'Live Session · Keys In Hand',
    deliverable: 'DNS launch, walkthrough & full ownership',
  },
];

export default function WhyWorkWithMe({ audioEnabled }: WhyWorkWithMeProps) {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section
      id="process"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Part 1: Why Work 1-on-1 With Me */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              1-on-1 Partnership Model
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Why founders work directly with me.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
            No account managers, no bloated retainers, and no black-box templates. Clean engineering tailored around how you actually run your business.
          </p>
        </div>

        {/* 3 Architectural Principle Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-x border-b border-white/10 bg-[#0D0D0F] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.index}
              onMouseEnter={() => playHoverChime('soft', audioEnabled)}
              className="flex flex-col justify-between p-8 sm:p-10 transition-colors duration-150 hover:bg-[#111114]"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                  <span className="text-accent tabular-nums">{pillar.index}</span>
                  <span>{pillar.title}</span>
                </div>
                <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {pillar.headline}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                  {pillar.text}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 font-mono text-xs text-signal">
                {pillar.outcome}
              </div>
            </div>
          ))}
        </div>

        {/* Part 2: 3-Step Roadmap (Plan -> Build -> Launch) */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono text-xs tracking-[0.14em] text-signal">
                How We Launch
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
                From first call to live engine in three steps.
              </h3>
            </div>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>Book a 45-min kickoff</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 border border-white/10 bg-[#0D0D0F] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {STEPS.map((step, index) => {
              const isSelected = activeStep === index;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => {
                    playHoverChime('toggle', audioEnabled);
                    setActiveStep(index);
                  }}
                  onMouseEnter={() => {
                    setActiveStep(index);
                    playHoverChime('soft', audioEnabled);
                  }}
                  className={`flex flex-col justify-between p-8 sm:p-10 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent ${
                    isSelected ? 'bg-[#131317]' : 'bg-[#0D0D0F] hover:bg-[#111114]'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4 pb-5 border-b border-white/10">
                      <div className="flex items-baseline gap-3">
                        <span
                          className={`font-mono text-2xl font-semibold tabular-nums transition-colors ${
                            isSelected ? 'text-accent' : 'text-zinc-500'
                          }`}
                        >
                          {step.number}
                        </span>
                        <span className="font-display text-2xl font-bold text-white">
                          {step.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">
                        {step.focus}
                      </span>
                    </div>

                    <p className="mt-6 text-sm leading-relaxed text-zinc-300">
                      {step.whatHappens}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/10 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Timeline</span>
                      <span className="text-zinc-200">{step.duration}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-zinc-500 shrink-0">Deliverable</span>
                      <span className="text-right text-accent">{step.deliverable}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

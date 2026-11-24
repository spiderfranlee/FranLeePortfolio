import React, { useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { playHoverChime, type ChimePreset } from '../utils/audio';
import type { InquiryBrief } from '../types';

interface PricingProps {
  audioEnabled: boolean;
  onSelectTier: (brief: InquiryBrief) => void;
}

interface Tier {
  id: 'starter' | 'growth' | 'buyout';
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  excludes?: string;
  cta: string;
  highlighted?: boolean;
  chime: ChimePreset;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€979',
    cadence: 'one-off',
    blurb: 'A bespoke, fast-loading website or digital hub, designed and handed over cleanly.',
    features: [
      'Bespoke responsive design & Architectural styling',
      'Engineered for sub-second speed & local SEO',
      'Services, craft & case study showcase',
      'Custom domain & DNS setup — 100% ownership',
    ],
    excludes: 'Automated booking calendars and 24/7 AI assistants are included in Growth.',
    cta: 'Select Starter',
    chime: 'starter',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '€750',
    cadence: '+ €99 / mo',
    blurb: 'The complete digital engine: bespoke website, automated scheduling, 24/7 AI intake, and ongoing 1-on-1 support.',
    features: [
      'Everything in Starter included',
      'Automated calendar scheduling & reminders',
      'Custom-trained 24/7 AI assistant & lead routing',
      'Instant inquiry & booking intake alerts',
      'Deposit & checkout payment integration',
      'Fast hosting, security updates & AI quotas covered',
      'Direct 1-on-1 technical partner support',
    ],
    cta: 'Start With Growth',
    highlighted: true,
    chime: 'growth',
  },
  {
    id: 'buyout',
    name: 'Buyout',
    price: '€2,400',
    cadence: 'one-off',
    blurb: 'The entire automated engine built once and handed over in full—walkthrough included, zero recurring fees.',
    features: [
      'Everything in Growth, fully built & tested',
      'Recorded video walkthrough of every workflow',
      'All source code, credentials & DNS handed over',
      'Zero ongoing monthly platform fees',
    ],
    excludes: 'Future custom feature additions billed separately on request after handoff.',
    cta: 'Discuss Buyout',
    chime: 'buyout',
  },
];

const PricingCard: React.FC<{
  tier: Tier;
  audioEnabled: boolean;
  onSelectTier: (brief: InquiryBrief) => void;
}> = ({ tier, audioEnabled, onSelectTier }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isReduced) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
      cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
    });
  };

  const handleClick = () => {
    playHoverChime('gold', audioEnabled);
    onSelectTier({
      source: 'pricing',
      recommendedTier: tier.name,
      priceLabel: `${tier.price} ${tier.cadence}`,
      summaryText: [
        `Interested in: ${tier.name} Package (${tier.price} ${tier.cadence})`,
        '',
        'Tell me a little about your clinic, coaching practice, or business and what you want to launch:',
      ].join('\n'),
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverChime(tier.chime, audioEnabled);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }}
      className={`relative flex flex-col justify-between border p-8 sm:p-9 transition-colors duration-150 ${
        tier.highlighted
          ? 'border-accent/60 bg-[#11100E]'
          : 'border-white/10 bg-[#0D0D0F] hover:border-white/25'
      }`}
    >
      {isHovered && !isReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(360px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${
              tier.highlighted ? 'rgba(209, 178, 128, 0.08)' : 'rgba(255, 255, 255, 0.04)'
            }, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-bold text-white">{tier.name}</h3>
          {tier.highlighted && (
            <span className="font-mono text-[11px] font-medium text-accent">
              Most Chosen
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-2.5 pb-6 border-b border-white/10">
          <span className="font-mono text-4xl font-semibold text-white tabular-nums tracking-tight">
            {tier.price}
          </span>
          <span className="font-mono text-xs text-zinc-400 tabular-nums">
            {tier.cadence}
          </span>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-zinc-300">{tier.blurb}</p>

        <ul className="mt-7 space-y-3">
          {tier.features.map((feat) => (
            <li key={feat} className="flex items-start gap-3 text-sm text-zinc-200">
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  tier.highlighted ? 'text-accent' : 'text-signal'
                }`}
              />
              <span className="leading-snug">{feat}</span>
            </li>
          ))}
        </ul>

        {tier.excludes && (
          <p className="mt-6 pt-5 border-t border-white/10 text-xs leading-relaxed text-zinc-500">
            {tier.excludes}
          </p>
        )}
      </div>

      <div className="relative z-10 mt-9 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={handleClick}
          className={`group w-full inline-flex items-center justify-between px-5 py-3.5 text-sm font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent ${
            tier.highlighted
              ? 'bg-accent text-[#070708] hover:bg-[#DFC496]'
              : 'border border-white/20 bg-[#070708] text-white hover:bg-white hover:text-[#070708] hover:border-white'
          }`}
        >
          <span>{tier.cta}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}

export default function Pricing({ audioEnabled, onSelectTier }: PricingProps) {
  return (
    <section
      id="pricing"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Transparent Investment
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Clear pricing. Zero surprises.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
            No hidden API markups or lock-in contracts. Cancel any monthly plan whenever you like—you keep your domain and website.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              audioEnabled={audioEnabled}
              onSelectTier={onSelectTier}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

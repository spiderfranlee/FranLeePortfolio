import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowUpRight } from 'lucide-react';

/**
 * PRICING — three tiers, all roads bend toward the monthly (Growth).
 *
 * Strategy baked into the layout:
 *  - Starter (€979 one-off) is a STRIPPED product: no chatbot, no automations.
 *    It captures subscription-refusers without cannibalising the recurring plan.
 *  - Growth (€750 + €99/mo) is the hero. Highlighted, "Most popular", solid CTA.
 *    It incorporates the 3D matching interactive credentials.
 *  - Buyout (€2,400 one-off) is priced ABOVE year-one recurring on purpose.
 */

type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  excludes?: string;
  cta: string;
  highlighted?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: '€979',
    cadence: 'one-off',
    blurb: 'A bespoke, high-performing website or digital hub, fully designed and handed to you.',
    features: [
      'Bespoke responsive design & brand styling',
      'Engineered for speed, clarity & SEO',
      'Services, craft & portfolio showcase',
      'Domain & DNS setup — 100% sovereignty',
    ],
    excludes: 'No automated booking or AI assistants — those live in Growth.',
    cta: 'Get started',
  },
  {
    name: 'Growth',
    price: '€750',
    cadence: '+ €99/mo',
    blurb: 'The complete digital engine: automated booking, AI assistant, and continuous technical leverage.',
    features: [
      'Everything in Starter',
      'Seamless automated calendar scheduling',
      '24/7 AI smart assistant & routing',
      'Inquiry qualification & instant intake alerts',
      'Payment processing & checkout integration',
      'Dedicated 1-on-1 technical partner support',
      'Continuous hosting, monitoring & iterations',
    ],
    cta: "Let's talk about your project",
    highlighted: true,
  },
  {
    name: 'Buyout',
    price: '€2,400',
    cadence: 'one-off',
    blurb: 'The complete engine suite, built once and handed over. Full walkthrough, zero ongoing fees.',
    features: [
      'Everything in Growth, fully built & tested',
      'Comprehensive recorded video walkthrough',
      'All source code, credentials & DNS handed over',
      'Zero ongoing platform or subscription fees',
    ],
    excludes: 'Subsequent custom feature additions billed separately on request after handoff.',
    cta: 'Discuss buyout',
  },
];

const playPricingSound = (tierName: string) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.012, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    masterGain.connect(ctx.destination);

    if (tierName === 'Starter') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (tierName === 'Growth') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(392.00, now); // G4
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(493.88, now); // B4
      
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      
      osc1.start(now);
      osc1.stop(now + 0.4);
      osc2.start(now);
      osc2.stop(now + 0.4);
    } else {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C5 slide
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (error) {
    // Gracefully handle browser restrictions
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 16,
    },
  },
};

function PricingCard({ tier, index }: { tier: Tier; index: number; key?: React.Key }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playPricingSound(tier.name);
  };

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const rotateX = isHovered && cardRef.current && !isReduced
    ? -((coords.y - cardRef.current.offsetHeight / 2) / cardRef.current.offsetHeight) * 12
    : 0;
  const rotateY = isHovered && cardRef.current && !isReduced
    ? ((coords.x - cardRef.current.offsetWidth / 2) / cardRef.current.offsetWidth) * 12
    : 0;

  const ACCENT = '#D1B280';
  const GLOW_COLOR = tier.highlighted ? 'rgba(209, 178, 128, 0.05)' : 'rgba(255, 255, 255, 0.03)';

  return (
    <motion.div
      variants={cardVariants}
      className="h-full flex flex-col"
    >
      <div
        ref={cardRef}
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
          boxShadow: isHovered && !isReduced 
            ? (tier.highlighted ? `0 25px 50px rgba(209, 178, 128, 0.08)` : `0 25px 50px rgba(255, 255, 255, 0.03)`) 
            : 'none',
          zIndex: isHovered ? 20 : 1,
        }}
        className={`glass-panel relative rounded-2xl border p-8 transition-all cursor-pointer select-none overflow-hidden h-full flex flex-col justify-between ${
          tier.highlighted
            ? 'border-accent lg:-translate-y-3 bg-gradient-to-b from-[#110e0a] to-[#040404]'
            : 'border-white/5 bg-[#0A0A0A] hover:border-white/15'
        }`}
      >
        {/* Top ambient glow mapping */}
        <div 
          className="absolute top-0 right-0 w-48 h-48 rounded-full filter blur-[80px] opacity-10 pointer-events-none transition-all duration-500 group-hover:opacity-20"
          style={{
            background: `radial-gradient(circle, ${tier.highlighted ? ACCENT : '#ffffff'} 0%, transparent 70%)`
          }}
        />

        {/* Spotlight pointer tracker */}
        {isHovered && !isReduced && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${GLOW_COLOR}, transparent 70%)`,
              zIndex: 1,
            }}
          />
        )}

        {/* Card Content Wrapper */}
        <div className="relative z-10 flex flex-col flex-1">
          {tier.highlighted && (
            <div className="mb-4">
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0px rgba(209, 178, 128, 0)',
                    '0 0 16px rgba(209, 178, 128, 0.55)',
                    '0 0 0px rgba(209, 178, 128, 0)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block rounded-full bg-accent px-3.5 py-1 font-mono text-[9px] uppercase tracking-wider text-black font-black border border-white/10 select-none relative overflow-hidden"
              >
                Most popular
                {/* Micro-shimmer sweep light effect */}
                <motion.span 
                  animate={{
                    left: ['-120%', '150%']
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 top-0"
                />
              </motion.span>
            </div>
          )}

          <h3 className="font-mono text-xs uppercase tracking-widest text-accent font-black">
            {tier.name}
          </h3>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-black text-white">{tier.price}</span>
            <span className="text-xs font-mono uppercase text-zinc-500 font-bold">{tier.cadence}</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400 font-medium">{tier.blurb}</p>

          <ul className="mt-6 flex flex-col gap-3 flex-1 h-full justify-start">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs text-zinc-350 font-medium">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {tier.excludes && (
            <p className="mt-4 text-[10px] font-mono leading-snug text-zinc-500">{tier.excludes}</p>
          )}
        </div>

        <a
          href="#contact"
          className={
            tier.highlighted
              ? 'group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold text-black transition-transform active:scale-95 relative z-10'
              : 'group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-xs font-bold text-white transition-colors hover:border-white/20 relative z-10'
          }
        >
          <span>{tier.cta}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-white/10 bg-transparent px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-accent font-bold">
            Transparent Pricing
          </p>
          <h2 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl uppercase">
            Simple pricing. Measurable leverage.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400 font-medium">
            No hand-waving or endless strategy decks. I get under the hood, build the solution, and hand you the keys with a clear walk-through so you feel 100% in control.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3"
        >
          {TIERS.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </motion.div>

        <p className="mt-12 text-center text-xs text-zinc-600 font-mono tracking-wide">All prices ex. VAT.</p>
      </div>
    </section>
  );
}

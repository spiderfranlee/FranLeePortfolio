import React, { useRef } from 'react';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';

function WarpImageTile({ src, alt, children }: { src: string; alt: string; children?: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const pctX = (mouseX - rect.width / 2) / (rect.width / 2);
    const pctY = (mouseY - rect.height / 2) / (rect.height / 2);

    const moveX = pctX * 8;
    const moveY = pctY * 8;
    const rotate = pctX * 2;

    img.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px) rotate(${rotate}deg) scale(1.06)`;
  };

  const handleMouseLeave = () => {
    const img = imgRef.current;
    if (img) {
      img.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="motion-image-tile relative min-h-[16rem] overflow-hidden cursor-none"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover"
      />
      {children}
    </div>
  );
}

/**
 * PROJECTS / WORK — one REAL shipped site + concept builds for target verticals.
 *
 * HONESTY RULES (do not remove):
 *  - 'live'    -> a real site you designed, built and launched. Reset Clann is real.
 *  - 'concept' -> a sample/demo build. Never imply it was a paid client.
 *  - 'client'  -> reserved for real PAID work. Don't use until it's true.
 *  - The featured (live) card is visually separated so nobody can mistake a
 *    concept for shipped work, and vice versa.
 *  - No invented metrics anywhere. `goal` is an objective, not a result.
 *
 * EDIT: demo URLs, the verticals, and ideally swap the Reset Clann image for a
 * fresh screenshot if the OG image ever changes.
 */

// --- The real one. Verified live at the URL below. ---
const FEATURED = {
  vertical: 'Fitness & Wellness Retreat',
  name: 'The Reset Clann',
  url: 'https://www.theresetclann.com',
  image: 'https://media.theresetclann.com/Cliffs%202.jpg',
  badge: 'Live Client Build · Shipped',
  founderBlock: 'Founder & Head Coach running high-end fitness retreats across Ireland. He was stuck wrestling with fragmented media hosts, clunky DIY website builders, and manual message threads that failed to reflect the luxury nature of his retreats.',
  whatWeBuilt: 'A bespoke, ultra-responsive brand platform with its own dedicated media subdomain, streamlined client inquiry flows, immersive retreat showcase galleries, and frictionless registration setup.',
  outcome: 'Shipped on custom domain with full media sovereignty. Instant credibility uplift for luxury retreat ticket tiers, and total relief from plugin errors — freeing him up to focus 100% on coaching and client experience.',
  stack: ['Custom Domain + Media Host', 'Responsive Showcase', 'Streamlined Registration'],
};

type ProjectCaseStudy = {
  vertical: string;
  name: string;
  founderBlock: string;
  whatWeBuilt: string;
  outcome: string;
  stack: string[];
  demo?: string;
  github?: string;
  hue: string;
  statusBadge: string;
};

const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    vertical: 'Aesthetics & Skin Clinic',
    name: 'Aura Aesthetics Dalkey',
    statusBadge: 'Case Study · Ready-to-Deploy',
    founderBlock: 'Solo aesthetic practitioner overwhelmed by high-ticket consultation leads lost in Instagram DMs and manual text threads while she was treating patients in clinic.',
    whatWeBuilt: 'Editorial-grade clinic storefront, streamlined treatment consultation booking engine, upfront Stripe deposit intake, and automated 24/7 inquiry routing.',
    outcome: 'Eliminated DM scheduling tag entirely, zero lost weekend enquiries, and immediate confidence to step away from administrative phone calls and focus purely on clinical craft.',
    stack: ['Bespoke Clinic UI', 'Direct Booking Engine', 'Deposit Intake'],
    demo: 'https://franny-aesthetics.demo',
    hue: '#D1B280',
  },
  {
    vertical: 'Classical Vocalist & Soprano',
    name: 'Sarah Guilmartin Lavery',
    statusBadge: 'Client Build · Open Source',
    founderBlock: 'Irish operatic soprano performing across European recitals, luxury weddings, and private engagements. She needed an editorial digital brand to showcase her recordings and repertoire, but was held back by clunky website builders that couldn’t handle audio preview streaming without awkward popups or ads.',
    whatWeBuilt: 'An editorial portfolio with an integrated floating aria audio player, high-definition media showcase, interactive concert repertoire catalog, and a direct wedding ceremony booking inquiry engine.',
    outcome: 'Elevated her artistic presence to match international concert standards. Event planners, concert promoters, and couples can audition her recordings instantly with zero friction and secure booking availability.',
    stack: ['Editorial Portfolio', 'Floating Aria Player', 'Wedding Inquiry Flow', 'Repertoire Catalog'],
    demo: 'https://github.com/spiderfranlee/SarahWebsite',
    github: 'https://github.com/spiderfranlee/SarahWebsite',
    hue: '#E5C07B',
  },
  {
    vertical: 'Physio & Performance Gym',
    name: 'Blackrock Performance Physio',
    statusBadge: 'Case Study · Ready-to-Deploy',
    founderBlock: 'Head physio and athletic therapist constantly interrupted on the rehab floor by booking calls, intake form administration, and payment chasing.',
    whatWeBuilt: 'Frictionless calendar scheduling engine with upfront payment integration, mobile digital medical waivers, and automated client prep sequences.',
    outcome: '100% upfront booking compliance, zero on-the-floor distractions during patient treatment, and complete operational peace of mind.',
    stack: ['Therapist Calendar Engine', 'Digital Medical Waivers', 'Stripe Payment Flow'],
    demo: 'https://franny-physio.demo',
    hue: '#D1B280',
  },
];

function BrowserMock({ name, vertical, hue }: { name: string; vertical: string; hue: string }) {
  // Honest visual mock of a premium booking portal — completely customized by vertical
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-primary-900">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2 bg-[#090909]">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>
        <span className="ml-2 truncate font-mono text-[9px] text-[#555] lowercase tracking-wide font-medium">
          {name.toLowerCase().includes('sarah') ? 'sarahguilmartinlavery.com' : `${name.toLowerCase().replace(/[^a-z]/g, '')}.ie`}
        </span>
      </div>

      {name.toLowerCase().includes('sarah') || vertical.toLowerCase().includes('vocalist') ? (
        <div className="flex h-36 flex-col justify-between p-3.5 bg-gradient-to-b from-[#181410] via-[#0D0B09] to-[#050505]">
          <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
            <span className="font-serif italic text-[10px] text-accent font-semibold tracking-wide">
              Sarah Guilmartin Lavery
            </span>
            <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-widest border border-white/10 px-1.5 py-[1px] rounded">
              Operatic Soprano
            </span>
          </div>

          {/* Floating Aria Audio Player Mock */}
          <div className="my-1 rounded-lg bg-[#201A13] border border-accent/25 p-2 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center text-black shadow-sm">
                  <span className="text-[7px] font-bold">▶</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-medium text-zinc-100 truncate max-w-[130px]">O Mio Babbino Caro</span>
                  <span className="text-[6.5px] font-mono text-accent/80">G. Puccini · Live Recital</span>
                </div>
              </div>
              {/* Equalizer waves */}
              <div className="flex items-end gap-[2px] h-3 px-1">
                <span className="w-[2px] h-2 bg-accent rounded-full animate-pulse" />
                <span className="w-[2px] h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-[2px] h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="w-[2px] h-2.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              </div>
            </div>
            <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden">
              <div className="bg-accent h-full w-2/5" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[7.5px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              Weddings &amp; Recitals
            </span>
            <span className="text-zinc-500 font-bold uppercase">2026/27 Open</span>
          </div>
        </div>
      ) : vertical.toLowerCase().includes('aesthetics') ? (
        <div className="flex h-36 flex-col justify-between p-3.5 bg-gradient-to-b from-[#14110C] to-[#050505]">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="font-display text-[9px] uppercase font-black tracking-[0.25em] text-accent">Aura Dalkey</span>
            <span className="text-[7.5px] font-mono text-accent uppercase tracking-widest font-black">Online Booking</span>
          </div>
          <div className="my-1.5 space-y-1">
            <div className="flex items-center justify-between rounded bg-[#1A1610]/80 border border-accent/20 px-2 py-1 text-[9px]">
              <div className="flex items-center gap-1.5 text-zinc-350 font-semibold">
                <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                <span>Anti-Wrinkle (3 Areas)</span>
              </div>
              <span className="font-mono text-zinc-200 font-bold text-[8px]">€290</span>
            </div>
            <div className="flex items-center justify-between rounded bg-zinc-950/60 border border-white/5 px-2 py-1 text-[8.5px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>Lip Filler (1.0ml)</span>
              </div>
              <span className="font-mono font-medium">€275</span>
            </div>
          </div>
          <div className="rounded bg-accent/15 border border-accent/30 py-1 text-center text-[8px] font-black text-accent uppercase tracking-wider">
            Schedule Treatment · Secure Slot
          </div>
        </div>
      ) : (
        <div className="flex h-36 flex-col justify-between p-3.5 bg-gradient-to-b from-[#14120D] to-[#050505]">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="font-display text-[9px] uppercase font-black tracking-[0.2em] text-accent">Blackrock Physio</span>
            <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest">Intake System</span>
          </div>
          <div className="my-1.5 space-y-1">
            <div className="flex items-center justify-between rounded bg-[#1A1510]/80 border border-accent/20 px-2 py-1 text-[8.5px]">
              <div className="flex flex-col">
                <span className="text-zinc-200 font-bold">Initial Rehab Consult (60m)</span>
                <span className="text-[6.5px] text-accent font-mono">Expert biomechanical screening</span>
              </div>
              <span className="font-mono text-zinc-200 font-black text-[8px]">€85</span>
            </div>
            <div className="flex items-center justify-between text-[7px] text-zinc-500 font-mono">
              <span>✓ Active sports rehab therapy</span>
              <span>✓ Pay secure via Stripe</span>
            </div>
          </div>
          <div className="rounded bg-accent/80 hover:bg-accent py-1 text-center text-[8.5px] font-black text-black uppercase tracking-wider cursor-pointer">
            Book Assessment &amp; Pay Securely
          </div>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="border-b border-white/10 bg-transparent px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-accent uppercase">
              Case Study &amp; Storytelling Layout
            </span>
          </div>
          <h2 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.0]">
            Projects Engineered For High Performance.
          </h2>
          <p className="mt-4 text-base text-zinc-400 font-sans leading-relaxed">
            From private clinics and healthcare practitioners to high-end retreats, coaches, and small businesses, every build is an intimate 1-on-1 collaboration. We untangle the exact technical hurdles stalling your growth, build the custom engine, and hand you the keys.
          </p>
        </div>

        {/* FEATURED — The Real Shipped Live Build using the exact 3-part format */}
        <article
          className="glass-panel reveal-on-scroll unseen-card-shine mb-12 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/90 lg:grid-cols-12 shadow-2xl"
        >
          <div className="lg:col-span-5 relative min-h-[18rem] lg:min-h-full">
            <WarpImageTile src={FEATURED.image} alt={`${FEATURED.name} — live website`}>
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black font-black z-10 shadow-md">
                {FEATURED.badge}
              </span>
            </WarpImageTile>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                  {FEATURED.vertical}
                </span>
                <a
                  href={FEATURED.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 hover:text-accent transition-colors"
                >
                  theresetclann.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-black text-white">{FEATURED.name}</h3>

              {/* Exact 3-part storytelling structure */}
              <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                
                {/* 1. The Founder & The Block */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E06C75]" />
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                      The Founder &amp; The Block
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {FEATURED.founderBlock}
                  </p>
                </div>

                {/* 2. What We Built */}
                <div className="rounded-xl border border-accent/20 bg-accent/[0.03] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                      What We Built
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {FEATURED.whatWeBuilt}
                  </p>
                </div>

                {/* 3. The Outcome */}
                <div className="rounded-xl border border-[#2FA87A]/20 bg-[#2FA87A]/[0.03] p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2FA87A]" />
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#2FA87A]">
                      The Outcome
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    {FEATURED.outcome}
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {FEATURED.stack.map((s) => (
                  <span key={s} className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[10px] text-zinc-350">
                    {s}
                  </span>
                ))}
              </div>

              <a
                href={FEATURED.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-accent active:scale-95"
              >
                Visit live website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </article>

        {/* 3-PART CASE STUDIES GRID */}
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 font-bold">
            // Targeted Vertical Systems &amp; Case Studies
          </p>
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            3-Part Storytelling Format
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {CASE_STUDIES.map((c, i) => (
            <article
              key={c.name}
              className="glass-panel glass-panel-hover reveal-on-scroll unseen-card-shine flex flex-col justify-between rounded-3xl border border-white/10 bg-[#080808] p-6 transition-all duration-300 hover:border-white/20"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">
                    {c.vertical}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent font-bold">
                    {c.statusBadge}
                  </span>
                </div>

                <BrowserMock name={c.name} vertical={c.vertical} hue={c.hue} />

                <h3 className="mt-5 font-display text-xl font-black text-white">{c.name}</h3>

                {/* 3-Part Storytelling Layout */}
                <div className="mt-5 space-y-3.5">
                  
                  {/* The Founder & The Block */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#E06C75] mb-1">
                      The Founder &amp; The Block:
                    </span>
                    <p className="text-xs leading-relaxed text-zinc-400">
                      {c.founderBlock}
                    </p>
                  </div>

                  {/* What We Built */}
                  <div className="rounded-xl border border-accent/15 bg-accent/[0.02] p-3.5">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
                      What We Built:
                    </span>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {c.whatWeBuilt}
                    </p>
                  </div>

                  {/* The Outcome */}
                  <div className="rounded-xl border border-[#2FA87A]/20 bg-[#2FA87A]/[0.02] p-3.5">
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#2FA87A] mb-1">
                      The Outcome:
                    </span>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {c.outcome}
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.stack.map((s) => (
                    <span key={s} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-zinc-400 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {c.github ? (
                    <div className="flex items-center gap-3">
                      <a
                        href={c.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent hover:text-white transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" />
                        View GitHub Code
                        <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                      <span className="text-zinc-600">·</span>
                      <a
                        href="https://cal.com/fran-lee-mnjzic"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                      >
                        Discuss Build
                      </a>
                    </div>
                  ) : c.demo ? (
                    <a
                      href="https://cal.com/fran-lee-mnjzic"
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent hover:text-white transition-colors"
                    >
                      Discuss this build blueprint
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Callout Card */}
        <div className="mt-14 flex flex-col items-start gap-6 rounded-3xl border border-accent/30 bg-gradient-to-r from-accent/10 via-black to-black p-8 sm:flex-row sm:items-center sm:justify-between shadow-2xl">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold block mb-1">
              Ready to get unstuck?
            </span>
            <p className="text-lg font-display font-black text-white">
              Taking on 3 ambitious clinics, coaches, or small business founders this sprint.
            </p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Bring your messy tools, scheduling headaches, or half-built platforms. I’ll map the shortest path to launch and build the engine.
            </p>
          </div>
          <a
            href="https://cal.com/fran-lee-mnjzic"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-black transition-transform active:scale-95 shadow-[0_4px_20px_rgba(209,178,128,0.3)]"
          >
            Let's Talk About Your Project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

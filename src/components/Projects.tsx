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
      className="motion-image-tile relative min-h-[22rem] h-full w-full overflow-hidden"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover object-center transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
      {children}
    </div>
  );
}

type ShippedProject = {
  vertical: string;
  name: string;
  url: string;
  displayUrl: string;
  image: string;
  github?: string;
  badge: string;
  founderBlock: string;
  whatWeBuilt: string;
  outcome: string;
  stack: string[];
};

const SHIPPED_PROJECTS: ShippedProject[] = [
  {
    vertical: 'Fitness & Wellness Retreat',
    name: 'The Reset Clann',
    url: 'https://www.theresetclann.com',
    displayUrl: 'theresetclann.com',
    image: 'https://media.theresetclann.com/Cliffs%202.jpg',
    badge: 'Live Client Build · Shipped',
    founderBlock: 'Founder & Head Coach running high-end fitness retreats across Ireland. He was stuck wrestling with fragmented media hosts, clunky DIY website builders, and manual message threads that failed to reflect the luxury nature of his retreats.',
    whatWeBuilt: 'A bespoke, ultra-responsive brand platform with its own dedicated media subdomain, streamlined client inquiry flows, immersive retreat showcase galleries, and frictionless registration setup.',
    outcome: 'Shipped on custom domain with full media sovereignty. Instant credibility uplift for luxury retreat ticket tiers, and total relief from plugin errors — freeing him up to focus 100% on coaching and client experience.',
    stack: ['Custom Domain + Media Host', 'Responsive Showcase', 'Streamlined Registration'],
  },
  {
    vertical: 'Classical Vocalist & Soprano',
    name: 'Sarah Guilmartin Lavery',
    url: 'http://www.sarahguilmartinlavery.ie/',
    displayUrl: 'sarahguilmartinlavery.ie',
    image: 'https://pub-84dd5a431965456da7d85a0e76ea51a7.r2.dev/Sarah%20Lavery_CHD_9049%20export.jpg',
    github: 'https://github.com/spiderfranlee/SarahWebsite',
    badge: 'Live Client Build · Shipped',
    founderBlock: 'Irish operatic soprano performing across European recitals, luxury weddings, and private engagements. She needed an editorial digital brand to showcase her recordings and repertoire, but was held back by clunky website builders that couldn’t handle audio preview streaming without awkward popups or ads.',
    whatWeBuilt: 'An editorial portfolio with an integrated floating aria audio player, high-definition media showcase, interactive concert repertoire catalog, and a direct wedding ceremony booking inquiry engine.',
    outcome: 'Shipped on custom .ie domain with full code sovereignty. Elevated her artistic presence to match international concert standards. Event planners, concert promoters, and couples can audition her recordings instantly with zero friction and secure booking availability.',
    stack: ['Editorial Portfolio', 'Floating Aria Player', 'Wedding Inquiry Flow', 'Repertoire Catalog', 'Custom .ie Domain'],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="border-b border-white/10 bg-transparent px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/20 bg-accent/5 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-accent uppercase">
              Live Shipped Builds · Case Studies
            </span>
          </div>
          <h2 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.0]">
            Projects Engineered For High Performance.
          </h2>
          <p className="mt-4 text-base text-zinc-400 font-sans leading-relaxed">
            Real clients, custom domains, and bespoke technical engines. Every build is an intimate 1-on-1 collaboration untangling operational bottlenecks, crafting editorial design, and deploying rock-solid infrastructure.
          </p>
        </div>

        {/* Shipped Projects Stack */}
        <div className="space-y-12">
          {SHIPPED_PROJECTS.map((project) => (
            <article
              key={project.name}
              className="glass-panel reveal-on-scroll unseen-card-shine grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/90 lg:grid-cols-12 shadow-2xl"
            >
              <div className="lg:col-span-5 relative min-h-[22rem] lg:min-h-full">
                <WarpImageTile src={project.image} alt={`${project.name} — live website`}>
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-black font-black z-10 shadow-md">
                    {project.badge}
                  </span>
                </WarpImageTile>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">
                      {project.vertical}
                    </span>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-400 hover:text-accent transition-colors"
                    >
                      {project.displayUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl font-black text-white">{project.name}</h3>

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
                        {project.founderBlock}
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
                        {project.whatWeBuilt}
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
                        {project.outcome}
                      </p>
                    </div>

                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span key={s} className="rounded-md bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[10px] text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-mono font-bold text-zinc-200 transition-all hover:bg-white/10 hover:border-white/30 hover:text-white"
                      >
                        <Github className="h-3.5 w-3.5" />
                        GitHub Code
                      </a>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black transition-all hover:bg-accent active:scale-95"
                    >
                      Visit live website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
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
              Taking on ambitious founders, clinic directors, coaches, and creators.
            </p>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Bring your messy tools, scheduling headaches, or vision for a high-converting platform. I’ll map the shortest path to launch and build the engine.
            </p>
          </div>
          <a
            href="#contact"
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

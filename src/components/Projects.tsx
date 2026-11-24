import React, { useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface ProjectsProps {
  audioEnabled: boolean;
}

interface ShippedProject {
  id: string;
  index: string;
  vertical: string;
  name: string;
  url: string;
  displayUrl: string;
  image: string;
  github?: string;
  founderBlock: string;
  whatWeBuilt: string;
  outcome: string;
  deliverables: string[];
}

const SHIPPED_PROJECTS: ShippedProject[] = [
  {
    id: 'reset-clann',
    index: '01',
    vertical: 'Fitness & Wellness Retreat',
    name: 'The Reset Clann',
    url: 'https://www.theresetclann.com',
    displayUrl: 'theresetclann.com',
    image: 'https://media.theresetclann.com/Cliffs%202.jpg',
    founderBlock:
      'Founder and head coach running high-end fitness retreats across Ireland. Stuck wrestling with fragmented media hosts, clunky DIY builders, and manual message threads that undercut the luxury tier of his retreats.',
    whatWeBuilt:
      'A bespoke, fast-loading brand platform with a dedicated media subdomain, immersive retreat galleries, and a streamlined registration and inquiry flow.',
    outcome:
      'Launched on a custom domain with 100% media sovereignty. Elevated brand credibility for premium retreat bookings and eliminated plugin maintenance completely.',
    deliverables: ['Custom Domain & Media Host', 'Editorial Retreat Showcase', 'Direct Registration Flow'],
  },
  {
    id: 'sarah-lavery',
    index: '02',
    vertical: 'Classical Vocalist & Soprano',
    name: 'Sarah Guilmartin Lavery',
    url: 'http://www.sarahguilmartinlavery.ie/',
    displayUrl: 'sarahguilmartinlavery.ie',
    image: 'https://pub-84dd5a431965456da7d85a0e76ea51a7.r2.dev/Sarah%20Lavery_CHD_9049%20export.jpg',
    github: 'https://github.com/spiderfranlee/SarahWebsite',
    founderBlock:
      'Irish operatic soprano performing across European recitals and luxury weddings. Held back by template builders that could not stream studio recordings cleanly without awkward popups or third-party ads.',
    whatWeBuilt:
      'An editorial portfolio featuring a persistent floating aria audio player, high-definition gallery, searchable concert repertoire catalog, and direct wedding booking inquiry engine.',
    outcome:
      'Shipped on a custom .ie domain with full source ownership. Promoters and couples can audition recordings smoothly and inquire about availability in seconds.',
    deliverables: ['Floating Aria Audio Player', 'Repertoire Catalog', 'Wedding Booking Engine', 'Custom .ie Domain'],
  },
];

function ProjectMedia({
  src,
  alt,
  title,
  vertical,
}: {
  src: string;
  alt: string;
  title: string;
  vertical: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-center bg-[#111114] p-8 text-center">
        <span className="font-mono text-xs text-accent">{vertical}</span>
        <span className="mt-2 font-display text-2xl font-bold text-white">{title}</span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[280px] lg:min-h-full w-full overflow-hidden bg-[#0A0A0C]">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070708]/75 via-transparent to-[#070708]/20" />
    </div>
  );
}

export default function Projects({ audioEnabled }: ProjectsProps) {
  return (
    <section id="work" className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Selected Client Builds
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Live platforms shipped for real founders.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
            Every engagement is a direct 1-on-1 collaboration—untangling technical bottlenecks, crafting distinct visual authority, and shipping rock-solid systems on custom domains.
          </p>
        </div>

        {/* Editorial Case Study Spreads */}
        <div className="mt-12 space-y-10">
          {SHIPPED_PROJECTS.map((project, idx) => (
            <article
              key={project.id}
              onMouseEnter={() => playHoverChime(idx === 0 ? 'gold' : 'mint', audioEnabled)}
              className="group grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-[#0D0D0F] transition-colors duration-200 hover:border-white/25"
            >
              {/* Visual Column */}
              <div className="lg:col-span-5 lg:border-r border-b lg:border-b-0 border-white/10">
                <ProjectMedia
                  src={project.image}
                  alt={`${project.name} — live client platform`}
                  title={project.name}
                  vertical={project.vertical}
                />
              </div>

              {/* Narrative & Proof Column */}
              <div className="lg:col-span-7 flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                <div>
                  {/* Clean Unboxed Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
                    <div>
                      <span className="text-accent tabular-nums">{project.index}</span>
                      <span className="mx-2 text-zinc-600" aria-hidden="true">·</span>
                      <span>{project.vertical}</span>
                      <span className="mx-2 text-zinc-600" aria-hidden="true">·</span>
                      <span className="text-signal">Live Build</span>
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-300 hover:text-accent transition-colors whitespace-nowrap"
                    >
                      {project.displayUrl}
                    </a>
                  </div>

                  <h3 className="mt-4 font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
                    {project.name}
                  </h3>

                  {/* Hairline-Separated Case Study Breakdown (Zero Nested Cards) */}
                  <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                    <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                      <div className="sm:col-span-3 font-mono text-xs text-zinc-400 pt-0.5">
                        The Block
                      </div>
                      <p className="sm:col-span-9 text-sm leading-relaxed text-zinc-300">
                        {project.founderBlock}
                      </p>
                    </div>

                    <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                      <div className="sm:col-span-3 font-mono text-xs text-accent pt-0.5">
                        The Build
                      </div>
                      <p className="sm:col-span-9 text-sm leading-relaxed text-zinc-200">
                        {project.whatWeBuilt}
                      </p>
                    </div>

                    <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                      <div className="sm:col-span-3 font-mono text-xs text-signal pt-0.5">
                        The Outcome
                      </div>
                      <p className="sm:col-span-9 text-sm leading-relaxed text-zinc-200">
                        {project.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unboxed Deliverables + Clean Action Links */}
                <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                    {project.deliverables.join(' · ')}
                  </p>

                  <div className="flex items-center gap-4 shrink-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 border border-white/15 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors duration-150 hover:border-white/40 hover:text-white whitespace-nowrap"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>View Code</span>
                      </a>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-2 bg-white px-5 py-2.5 text-xs font-semibold text-[#070708] transition-colors duration-150 hover:bg-accent whitespace-nowrap"
                    >
                      <span>Visit Live Site</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

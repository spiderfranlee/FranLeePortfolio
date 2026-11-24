import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface CredentialShowcaseProps {
  audioEnabled: boolean;
}

interface Credential {
  id: string;
  title: string;
  issuer: string;
  period: string;
  grade: string;
  hash: string;
  description: string;
  verificationUrl: string;
  location: string;
  highlights: string[];
  accentType: 'mint' | 'gold';
}

const CREDENTIALS_DATA: Credential[] = [
  {
    id: 'ucd-bsc-cs',
    title: 'BSc in Computer Science',
    issuer: 'University College Dublin',
    period: 'Honours Degree',
    grade: 'BSc (Hons)',
    hash: 'UCD-BSc-CS-2003',
    description:
      "Foundational Bachelor of Science Honours degree in Computer Science from Ireland's leading computing faculty—covering distributed software architecture, algorithms, networks, and relational database design.",
    verificationUrl: 'https://www.ucd.ie/cs/',
    location: 'Dublin, IE',
    accentType: 'mint',
    highlights: [
      'Full-stack software architecture, responsive UX engineering & clean code standards',
      'Relational database modeling, API design, and dependable web infrastructure',
      'Formal computer science rigor powering fast, reliable client platforms',
    ],
  },
  {
    id: 'ucd-advanced-ai',
    title: 'Advanced Artificial Intelligence',
    issuer: 'UCD Professional Academy',
    period: 'May 2026',
    grade: 'Distinction · 36 Hours',
    hash: 'UCD-AAI-260529',
    description:
      'Professional Academy Diploma focused on production artificial intelligence systems, neural architectures, autonomous agent workflows, and reliable model evaluation controls.',
    verificationUrl: 'https://www.ucdprofessionalacademy.com/',
    location: 'Dublin, IE',
    accentType: 'gold',
    highlights: [
      'Autonomous agent design, structured tool calling & multi-turn routing',
      'Prompt architecture, context management & grounded retrieval pipelines',
      'Awarded peak Distinction bracket across formal assessment',
    ],
  },
  {
    id: 'ucd-ai-business',
    title: 'Artificial Intelligence for Business',
    issuer: 'UCD Professional Academy',
    period: 'July 2025',
    grade: 'Distinction · 36 Hours',
    hash: 'UCD-AIB-250728',
    description:
      'Professional Academy Diploma dedicated to translating AI into measurable commercial ROI, streamlining operational workflows, and designing trustworthy governance guardrails.',
    verificationUrl: 'https://www.ucdprofessionalacademy.com/',
    location: 'Dublin, IE',
    accentType: 'gold',
    highlights: [
      'Commercial AI strategy, workflow automation & practical ROI modeling',
      'Risk mitigation, EU AI Act alignment & reliable human-in-the-loop controls',
      'Awarded peak Distinction bracket across operational case assessments',
    ],
  },
];

const CredentialCard: React.FC<{
  cred: Credential;
  audioEnabled: boolean;
}> = ({ cred, audioEnabled }) => {
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
      const rotX = -((y - rect.height / 2) / rect.height) * 5;
      const rotY = ((x - rect.width / 2) / rect.width) * 5;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
      cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = 'none';
    }
  };

  const spotlightColor =
    cred.accentType === 'mint'
      ? 'rgba(47, 168, 122, 0.06)'
      : 'rgba(209, 178, 128, 0.06)';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverChime(cred.accentType === 'mint' ? 'mint' : 'credential', audioEnabled);
      }}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: isHovered
          ? 'border-color 0.2s ease'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease',
      }}
      className="group relative flex flex-col justify-between border border-white/10 bg-[#0D0D0F] p-7 sm:p-8 overflow-hidden hover:border-accent/40"
    >
      {/* Subtle Pointer Spotlight */}
      {isHovered && !isReduced && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(340px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col flex-1">
        {/* Clean Unboxed Issuer & Grade Line */}
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-zinc-400">
          <span>
            {cred.issuer}
            <span className="mx-1.5 text-zinc-600" aria-hidden="true">·</span>
            {cred.location}
          </span>
          <span
            className={
              cred.accentType === 'mint' ? 'text-signal font-medium' : 'text-accent font-medium'
            }
          >
            {cred.grade}
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-accent transition-colors duration-150">
          {cred.title}
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300 flex-1">
          {cred.description}
        </p>

        {/* Core Capabilities List */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="font-mono text-[11px] text-zinc-400 mb-3">
            Core Disciplines Evaluated
          </div>
          <ul className="space-y-2.5">
            {cred.highlights.map((hlt) => (
              <li
                key={hlt}
                className="flex items-start gap-2.5 text-[13px] leading-relaxed text-zinc-300"
              >
                <span className="text-accent font-mono shrink-0" aria-hidden="true">
                  ↳
                </span>
                <span>{hlt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verification Footer */}
      <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[11px] text-zinc-400 tabular-nums">
          <span className="text-zinc-500">Ref: </span>
          <span className="text-zinc-200">{cred.hash}</span>
          {cred.period && (
            <>
              <span className="mx-1.5 text-zinc-600" aria-hidden="true">·</span>
              <span>{cred.period}</span>
            </>
          )}
        </div>

        <a
          href={cred.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex items-center gap-2 border border-white/20 bg-[#070708] px-4 py-2 font-mono text-[11px] font-medium text-white transition-colors duration-150 hover:bg-white hover:text-[#070708] hover:border-white whitespace-nowrap shrink-0"
        >
          <span>Verify Credential</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}

export default function CredentialShowcase({ audioEnabled }: CredentialShowcaseProps) {
  return (
    <section
      id="credentials"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-signal">
              Academic &amp; AI Foundation
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.06]">
              Verified Expertise.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-zinc-400">
            Real computer science fundamentals paired with Distinction-level AI training from University College Dublin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {CREDENTIALS_DATA.map((cred) => (
            <CredentialCard key={cred.id} cred={cred} audioEnabled={audioEnabled} />
          ))}
        </div>
      </div>
    </section>
  );
}

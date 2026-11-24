import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { playHoverChime } from '../utils/audio';

interface TechnicalPortfolioProps {
  audioEnabled: boolean;
}

type CategoryFilter = 'All' | 'AI Systems' | 'Enterprise AI' | 'Fintech & CV' | 'SaaS & WebGL';

interface SystemBuild {
  id: string;
  index: string;
  title: string;
  tech: string;
  build: string;
  impact: string;
  category: Exclude<CategoryFilter, 'All'>;
  stack: string[];
  stage: string;
}

const TECHNICAL_PROJECTS: SystemBuild[] = [
  {
    id: 'energy-grant-navigator',
    index: '01',
    title: 'SMB Energy Grant Navigator',
    tech: 'Production RAG Architecture',
    build:
      'Ingested and semantically chunked 14+ complex Irish energy policy documents to automate SME grant eligibility checks.',
    impact:
      'Replaced manual document parsing with a low-latency, context-grounded conversational interface for Irish small business owners.',
    category: 'AI Systems',
    stack: ['LlamaIndex', 'RAG Pipelines', 'Semantic Search', 'Irish Policy'],
    stage: 'Production-Ready',
  },
  {
    id: 'guardrail-compliance',
    index: '02',
    title: 'GuardRail: Agentforce Compliance Layer',
    tech: 'Enterprise AI Governance',
    build:
      'Salesforce-native compliance framework that dynamically audits autonomous agents against EU AI Act risk tiers and generates mandatory risk-mitigation documentation.',
    impact:
      'Addressed enterprise governance friction by ensuring frontier AI deployments meet European regulatory requirements out of the box.',
    category: 'Enterprise AI',
    stack: ['Salesforce SDK', 'EU AI Act', 'Audit Logs', 'Automated Reporting'],
    stage: 'Stable Core',
  },
  {
    id: 'smallprint-os',
    index: '03',
    title: 'Smallprint: AI OS for Irish SMBs',
    tech: 'Full-Stack SaaS (Next.js + Supabase)',
    build:
      'Comprehensive AI back-office operational system designed around Irish Revenue rules and local VAT mapping.',
    impact:
      'Consolidated fragmented accounting, tax tracking, and admin workflows into one unified dashboard for Irish founders.',
    category: 'SaaS & WebGL',
    stack: ['Next.js', 'Supabase', 'Irish Revenue Rules', 'VAT Mapping'],
    stage: 'Beta Architecture',
  },
  {
    id: 'conversational-engines',
    index: '04',
    title: 'B2B Conversational AI Engines',
    tech: 'Autonomous Agentic Frameworks',
    build:
      'Turnkey lead capture, qualification, and automated follow-up email sequences engineered for local service businesses.',
    impact:
      'Cut top-of-funnel admin overhead by automating inquiry triage and timely client re-engagement loops.',
    category: 'Enterprise AI',
    stack: ['Vercel AI SDK', 'Agent Loops', 'Twilio', 'Resend'],
    stage: 'Field-Tested',
  },
  {
    id: 'fitness-ecosystem',
    index: '05',
    title: 'AI-Native Fitness Ecosystem',
    tech: 'Computer Vision + Agent Orchestration',
    build:
      'Combined edge-based body composition analysis with multi-agent orchestration for personalised meal planning and local coaching lead capture.',
    impact:
      'Bridged real-world biometric inputs with automated digital coaching workflows.',
    category: 'Fintech & CV',
    stack: ['MediaPipe', 'OpenCV', 'Multi-Agent', 'Biometrics'],
    stage: 'Active Prototype',
  },
  {
    id: 'retailedge-terminal',
    index: '06',
    title: 'RetailEdge Terminal',
    tech: 'Pine Script v5 + Quantitative Analytics',
    build:
      'Backtested a proprietary mean-reversion engine using Connors RSI(2) confluence signals paired with a custom real-time web analytics dashboard.',
    impact:
      'Surfaced real-time technical signals and sentiment telemetry to accelerate strategy validation.',
    category: 'Fintech & CV',
    stack: ['Pine Script v5', 'Connors RSI(2)', 'Real-Time Dashboard'],
    stage: 'Live Model',
  },
  {
    id: 'wetrix-3d',
    index: '07',
    title: 'Wetrix 3D',
    tech: 'Real-Time 3D Rendering & WebGL',
    build:
      'Interactive browser-based 3D environment optimizing spatial state-tracking and fluid shader rendering at 60 FPS.',
    impact:
      'Demonstrates deep frontend engineering across complex real-time client state and GPU shaders.',
    category: 'SaaS & WebGL',
    stack: ['WebGL', 'Three.js', 'GLSL Shaders', '60 FPS Engine'],
    stage: 'Live Scene',
  },
];

const CATEGORIES: CategoryFilter[] = [
  'All',
  'AI Systems',
  'Enterprise AI',
  'Fintech & CV',
  'SaaS & WebGL',
];

const ArchiveCard: React.FC<{
  project: SystemBuild;
  isExpanded: boolean;
  onToggle: () => void;
  audioEnabled: boolean;
}> = ({ project, isExpanded, onToggle, audioEnabled }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverChime('soft', audioEnabled);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      }}
      className={`relative border bg-[#0D0D0F] transition-colors duration-150 ${
        isExpanded ? 'border-accent/45 bg-[#111115]' : 'border-white/10 hover:border-white/25'
      }`}
    >
      {isHovered && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(320px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(209, 178, 128, 0.06), transparent 70%)',
          }}
        />
      )}

      <button
        type="button"
        onClick={() => {
          playHoverChime('toggle', audioEnabled);
          onToggle();
        }}
        aria-expanded={isExpanded}
        className="relative z-10 w-full p-6 sm:p-7 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-zinc-400">
              <span className="text-accent tabular-nums">{project.index}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-signal">{project.stage}</span>
            </div>
            <h3 className="mt-2.5 font-display text-xl font-bold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="mt-1 text-xs font-mono text-zinc-400">{project.tech}</p>
          </div>

          <span
            className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center border transition-colors ${
              isExpanded
                ? 'border-accent/50 text-accent bg-accent/10'
                : 'border-white/10 text-zinc-400'
            }`}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300 line-clamp-2">
          {project.build}
        </p>

        {isExpanded && (
          <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
            <div>
              <div className="font-mono text-[11px] text-signal mb-1">Business Impact</div>
              <p className="text-sm leading-relaxed text-zinc-200">{project.impact}</p>
            </div>
            <div className="font-mono text-[11px] text-zinc-400">
              {project.stack.join(' · ')}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

export default function TechnicalPortfolio({ audioEnabled }: TechnicalPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [expandedId, setExpandedId] = useState<string | null>('energy-grant-navigator');

  const filtered =
    selectedCategory === 'All'
      ? TECHNICAL_PROJECTS
      : TECHNICAL_PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section
      id="systems"
      className="border-b border-white/10 bg-[#070708] py-24 sm:py-28 scroll-mt-16"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header + Interactive Category Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-[0.14em] text-accent">
              Applied AI &amp; Engineering Depth
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white text-balance leading-[1.08]">
              Under the hood: systems &amp; R&amp;D archive.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Beyond client websites, I engineer RAG pipelines, EU AI Act compliance layers, and full-stack SaaS tools—bringing serious software depth to every small business build.
            </p>
          </div>

          {/* Functional Segmented Filter Controls */}
          <div
            role="tablist"
            aria-label="Filter technical systems by discipline"
            className="flex flex-wrap border border-white/10 bg-[#0D0D0F] p-1 gap-1 self-start lg:self-end"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    playHoverChime('toggle', audioEnabled);
                    setSelectedCategory(category);
                  }}
                  className={`px-3.5 py-2 text-xs font-mono transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-accent text-[#070708] font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Uniform Grid of Expandable Engineering Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ArchiveCard
              key={project.id}
              project={project}
              isExpanded={expandedId === project.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === project.id ? null : project.id))
              }
              audioEnabled={audioEnabled}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

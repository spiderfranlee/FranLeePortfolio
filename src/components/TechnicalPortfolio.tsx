import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Activity, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Calculator, 
  Box, 
  Terminal 
} from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  build: string;
  impact: string;
  icon: any;
  category: 'Enterprise AI' | 'AI Systems' | 'Fintech & CV' | 'SaaS & WebGL';
  tags: string[];
  status: string;
}

const TECHNICAL_PROJECTS: ProjectItem[] = [
  {
    id: 'energy-grant-navigator',
    title: 'SMB Energy Grant Navigator',
    tech: 'Production-grade RAG architecture.',
    build: 'Ingests and chunked 14+ complex Irish policy documents to automate SME grant eligibility checks.',
    impact: 'Replaced manual, high-friction document parsing with a context-aware, low-latency conversational interface for small business owners.',
    icon: FileText,
    category: 'AI Systems',
    tags: ['LlamaIndex', 'RAG Pipelines', 'OpenAI API', 'Semantic Search', 'Irish Policy'],
    status: 'PRODUCTION-READY'
  },
  {
    id: 'fitness-ecosystem',
    title: 'AI-Native Fitness Ecosystem',
    tech: 'Computer Vision (CV) + Agentic Workflows.',
    build: 'Integrated edge-based body composition analysis with multi-agent orchestration for personalized meal planning and B2B local service provider lead generation.',
    icon: Activity,
    category: 'Fintech & CV',
    tags: ['MediaPipe', 'OpenCV', 'LangChain Agents', 'Nutrition Planning', 'B2B LeadGen'],
    status: 'ACTIVE DEMO',
    impact: 'Created an end-to-end wellness platform bridging real-world biometric data with automated digital coaching.'
  },
  {
    id: 'conversational-engines',
    title: 'B2B Conversational AI Engines',
    tech: 'Autonomous Agentic Frameworks.',
    build: 'Turnkey lead-capture, qualification, and automated Dunning/follow-up email sequences built for hyper-local businesses.',
    impact: 'Quantifiable overhead reduction for SMBs by automating the top-of-funnel sales process and customer re-engagement loops.',
    icon: MessageSquare,
    category: 'Enterprise AI',
    tags: ['Vercel AI SDK', 'Auto-GPT Loops', 'Dunning Sequences', 'Twilio API', 'Resend Email'],
    status: 'PROTOTYPED'
  },
  {
    id: 'retailedge-terminal',
    title: 'RetailEdge Terminal',
    tech: 'Pine Script v5 + Quantitative Analytics.',
    build: 'Backtested a proprietary mean-reversion engine using Connors RSI(2) confluence signals. Paired with a custom, high-performance HTML/JS trading dashboard featuring a charcoal/teal UI.',
    impact: 'Surfaced real-time technical signals and sentiment data, optimizing execution speed and strategy validation.',
    icon: TrendingUp,
    category: 'Fintech & CV',
    tags: ['Pine Script v5', 'Connors RSI(2)', 'Tailwind CSS', 'High-Freq Dashboard', 'Real-Time Sync'],
    status: 'LIVE MODEL'
  },
  {
    id: 'guardrail-compliance',
    title: 'GuardRail: Agentforce Compliance Layer',
    tech: 'Enterprise AI Governance.',
    build: 'A Salesforce-native compliance framework that dynamically audits autonomous agents against EU AI Act risk tiers, auto-generating mandatory governance and risk-mitigation docs.',
    impact: 'Solved a critical enterprise friction point by ensuring frontier AI deployments meet strict regulatory standards out of the box.',
    icon: ShieldCheck,
    category: 'Enterprise AI',
    tags: ['Salesforce SDK', 'Agentforce Audit', 'EU AI Act Compliance', 'PDF Generation', 'Audit Logs'],
    status: 'STABLE CORE'
  },
  {
    id: 'smallprint-os',
    title: 'Smallprint: AI OS for Irish SMBs',
    tech: 'Full-Stack SaaS (Next.js + Supabase).',
    build: 'Formulated a comprehensive AI back-office operational system featuring native integrations with Irish Revenue and local VAT rules.',
    impact: 'Consolidated fragmented accounting, tax tracking, and administrative tasks into a unified, intelligent dashboard for small business owners.',
    icon: Calculator,
    category: 'SaaS & WebGL',
    tags: ['Next.js 14', 'Supabase DB', 'Irish Revenue API', 'SaaS Accounting', 'VAT Auto-Mapping'],
    status: 'SOLUTIONS BETA'
  },
  {
    id: 'wetrix-3d',
    title: 'Wetrix 3D',
    tech: 'Real-Time 3D Rendering & WebGL.',
    build: 'Engineered a web-based, interactive 3D environment optimizing spatial state-tracking and fluid visual rendering.',
    impact: 'Demonstrated deep frontend capability, managing complex client-side states and high-frame-rate rendering without degrading browser performance.',
    icon: Box,
    category: 'SaaS & WebGL',
    tags: ['WebGL', 'Three.js / R3F', 'GLSL Shaders', 'Spatio-Temporal Tracking', '60 FPS Target'],
    status: 'LIVE SCENE'
  }
];

// Elegant client-side micro-synth for low-profile tech hover sounds
const playProjectHoverSound = (index: number) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Low master volume (very polite, elegant, exuding high craft)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.008, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    masterGain.connect(ctx.destination);

    if (index === 0) {
      // "RAG Navigator" -> Dual crisp futuristic databeep (A5 & E6)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1320, now + 0.03);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760, now);
      osc2.frequency.setValueAtTime(2640, now + 0.03);
      
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.12);
      osc2.start(now);
      osc2.stop(now + 0.12);
    } else if (index === 1) {
      // "Fitness CV" -> Swooping sensory scanner frequency
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.quadraticRampToValueAtTime(1000, now + 0.12);
      
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (index === 2) {
      // "Conversational" -> Double low-pass digital bubble chime
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.setValueAtTime(1500, now + 0.025);
      
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (index === 3) {
      // "RetailEdge" -> Fast mechanical stock ticker speed click
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(3000, now);
      osc.frequency.setValueAtTime(4500, now + 0.012);
      
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (index === 4) {
      // "GuardRail" -> Stable corporate security drone chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.18);
      osc2.start(now);
      osc2.stop(now + 0.18);
    } else if (index === 5) {
      // "Smallprint" -> Tiny accounting calculator audit ticks
      const delay = 0.03;
      for (let j = 0; j < 3; j++) {
        const tickOsc = ctx.createOscillator();
        const tickGain = ctx.createGain();
        tickOsc.type = 'sine';
        tickOsc.frequency.setValueAtTime(1800 + j * 400, now + j * delay);
        
        tickGain.gain.setValueAtTime(0, now + j * delay);
        tickGain.gain.linearRampToValueAtTime(0.008, now + j * delay + 0.002);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, now + j * delay + 0.02);
        
        tickOsc.connect(tickGain);
        tickGain.connect(ctx.destination);
        
        tickOsc.start(now + j * delay);
        tickOsc.stop(now + j * delay + 0.025);
      }
    } else {
      // "Wetrix 3D" -> Spatio-temporal WebGL stereo harmonic glide
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (error) {
    // Gracefully handle browser autoplay blocks
  }
};

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  key?: React.Key;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const IconComponent = project.icon;
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
    playProjectHoverSound(index);
  };

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const rotateX = isHovered && cardRef.current && !isReduced
    ? -((coords.y - cardRef.current.offsetHeight / 2) / cardRef.current.offsetHeight) * 12
    : 0;
  const rotateY = isHovered && cardRef.current && !isReduced
    ? ((coords.x - cardRef.current.offsetWidth / 2) / cardRef.current.offsetWidth) * 12
    : 0;

  return (
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
        boxShadow: isHovered && !isReduced ? '0 25px 50px rgba(209, 178, 128, 0.1)' : 'none',
        zIndex: isHovered ? 20 : 1,
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#080808]/90 p-6 transition-colors duration-300 hover:border-accent/30 cursor-pointer"
    >
      {/* Dynamic Cursor-following Light Spotlight */}
      {isHovered && !isReduced && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(209, 178, 128, 0.08), transparent 70%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Grid Pattern Mesh overlay illuminated on hover */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-300"
      />

      <div>
        {/* Top Metadata removed */}


        {/* Title Block with Interactive Icon Accent */}
        <div className="flex items-start gap-4 mb-5 relative z-10">
          <span className="mt-1 p-2 bg-zinc-900 border border-zinc-800 rounded-md text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300 shrink-0 transform group-hover:rotate-3 group-hover:scale-105 shadow-inner">
            <IconComponent className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-display font-black text-white tracking-tight group-hover:text-accent transition-colors duration-200 leading-snug uppercase flex items-center gap-1">
              <span>{project.title}</span>
              {isHovered && (
                <span className="w-2.5 h-4 bg-accent animate-[pulse_0.4s_infinite] inline-block ml-0.5 shrink-0" />
              )}
            </h3>
          </div>
        </div>

        {/* Technical metrics/arguments */}
        <div className="space-y-4 relative z-10">
          {/* Tech Segment */}
          <div className="border-l-2 border-accent pl-3 transition-transform duration-300 group-hover:translate-x-1">
            <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-black leading-none mb-1">
              The Tech
            </div>
            <p className="text-xs text-white leading-relaxed font-bold">
              {project.tech}
            </p>
          </div>

          {/* Build Segment */}
          <div className="border-l-2 border-zinc-800 pl-3 group-hover:border-zinc-700 transition-colors duration-300">
            <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-black leading-none mb-1">
              The Build
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
              {project.build}
            </p>
          </div>

          {/* Impact Segment */}
          {project.impact && (
            <div className="border-l-2 border-zinc-900 pl-3 group-hover:border-zinc-800 transition-colors duration-300">
              <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-black leading-none mb-1">
                The Impact
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                {project.impact}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tag Array & Equalizer */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-1.5 py-0.5 bg-black/40 border border-white/5 font-mono text-[8px] text-zinc-500 group-hover:text-accent group-hover:border-accent/10 rounded-sm transition-all duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Sensory Equalizer Waves */}
        <div className="flex gap-[2px] items-end h-3 shrink-0">
          <div className={`w-[1.5px] bg-[#D1B280] transition-all duration-300 ${isHovered && !isReduced ? 'animate-equalizer-one' : 'h-1 opacity-25'}`} />
          <div className={`w-[1.5px] bg-[#D1B280] transition-all duration-300 ${isHovered && !isReduced ? 'animate-equalizer-two' : 'h-2 opacity-25'}`} />
          <div className={`w-[1.5px] bg-[#D1B280] transition-all duration-300 ${isHovered && !isReduced ? 'animate-equalizer-three' : 'h-1.5 opacity-25'}`} />
        </div>
      </div>
    </div>
  );
}

export default function TechnicalPortfolio() {
  return (
    <section id="architecture" className="border-b border-white/10 bg-transparent px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
              Core Systems &amp; Engineering
            </p>
            <h2 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl uppercase">
              Technical Project Portfolio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-400">
              A curated directory detailing foundational system infrastructure, WebGL state-tracking mechanics, complex quantitative logic models, and deep local integrations.
            </p>
          </div>
          

        </div>

        {/* Technical Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TECHNICAL_PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Award, ShieldCheck, ExternalLink, CheckCircle2, Landmark, BadgeAlert, ArrowUpRight } from 'lucide-react';

const ACCENT = '#D1B280';
const VERIFIED_GREEN = '#2FA87A';

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
  badgeType: string;
  highlights: string[];
}

const CREDENTIALS_DATA: Credential[] = [
  {
    id: 'ucd-bsc-cs',
    title: 'BSc in Computer Science',
    issuer: 'University College Dublin',
    period: '',
    grade: '',
    hash: 'UCD-BSc-CS-2003',
    description: 'Foundational Bachelor of Science Honours degree in Computer Science from Ireland\'s elite computing academy. Specialization in distributed software architecture, advanced algorithmic analysis, system networks, and relational databases.',
    verificationUrl: 'https://www.ucd.ie/cs/',
    location: 'Dublin, IE',
    badgeType: 'ACADEMIC DEGREE',
    highlights: [
      'Bespoke website design, user experience architecture, and responsive full-stack coding',
      'Advanced software engineering paradigms, object-oriented design, and database modeling',
      'The formal logic and technical standards powering elite high-converting clinical applications'
    ]
  },
  {
    id: 'ucd-advanced-ai',
    title: 'Advanced Artificial Intelligence',
    issuer: 'UCD Professional Academy',
    period: 'May 29, 2026',
    grade: 'Distinction (36 Hours)',
    hash: 'UCD-AAI-260529',
    description: 'Professional Academy Diploma focusing on advanced artificial intelligence systems, including deep neural network topologies, autonomous agent construction, multi-turn cognitive workflows, and robust model scaling controls.',
    verificationUrl: 'https://www.ucdprofessionalacademy.com/',
    location: 'Dublin, IE',
    badgeType: 'DIPLOMA WITH DISTINCTION',
    highlights: [
      'Advanced neural architecture configuration & agent logic loops',
      'Prompt hierarchies, model fine-tuning guidance, and context windows',
      'Evaluated at peak distinction bracket over a rigorous examination cycle'
    ]
  },
  {
    id: 'ucd-ai-business',
    title: 'Artificial Intelligence for Business',
    issuer: 'UCD Professional Academy',
    period: 'July 28, 2025',
    grade: 'Distinction (36 Hours)',
    hash: 'UCD-AIB-250728',
    description: 'Professional Academy Diploma designing AI strategies to optimize modern business workflows, streamline enterprise operations, configure reliable trust layers, and map governance guidelines.',
    verificationUrl: 'https://www.ucdprofessionalacademy.com/',
    location: 'Dublin, IE',
    badgeType: 'DIPLOMA WITH DISTINCTION',
    highlights: [
      'Strategic enterprise AI selection, operational optimization & value planning',
      'AI-driven risk mitigation, ethical compliance policy systems & trust layers',
      'Evaluated at peak distinction bracket over comprehensive operational cases'
    ]
  }
];

const playCredentialSound = (id: string) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.015, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    masterGain.connect(ctx.destination);

    if (id === 'ucd-bsc-cs') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now);
      
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      
      osc1.start(now);
      osc1.stop(now + 0.5);
      osc2.start(now);
      osc2.stop(now + 0.5);
    } else if (id === 'ucd-advanced-ai') {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.2);
      
      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now);
      
      osc1.connect(masterGain);
      osc2.connect(masterGain);
      
      osc1.start(now);
      osc1.stop(now + 0.4);
      osc2.start(now);
      osc2.stop(now + 0.4);
    }
  } catch (error) {
    // Gracefully handle browser restrictions
  }
};

import React, { useRef, useState } from 'react';

function CredentialCard({ cred }: { cred: Credential; key?: React.Key }) {
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
    playCredentialSound(cred.id);
  };

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const rotateX = isHovered && cardRef.current && !isReduced
    ? -((coords.y - cardRef.current.offsetHeight / 2) / cardRef.current.offsetHeight) * 12
    : 0;
  const rotateY = isHovered && cardRef.current && !isReduced
    ? ((coords.x - cardRef.current.offsetWidth / 2) / cardRef.current.offsetWidth) * 12
    : 0;

  const resolvedAccentColor = cred.id.startsWith('ucd--bsc') ? VERIFIED_GREEN : ACCENT;

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
        boxShadow: isHovered && !isReduced ? `0 25px 50px rgba(47, 168, 122, 0.08)` : 'none',
        zIndex: isHovered ? 20 : 1,
      }}
      className="group relative flex flex-col justify-between border border-white/10 bg-[#0d0d0d] p-6 md:p-8 rounded-none overflow-hidden hover:border-accent/30 cursor-pointer"
    >
      {/* Top ambient glow mapping */}
      <div 
        className="absolute top-0 right-0 w-48 h-48 rounded-full filter blur-[80px] opacity-10 pointer-events-none transition-all duration-500 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle, ${cred.id.startsWith('ucd-') ? VERIFIED_GREEN : ACCENT} 0%, transparent 70%)`
        }}
      />

      {/* Spotlight pointer tracker */}
      {isHovered && !isReduced && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(47, 168, 122, 0.04), transparent 70%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Certificate Inner Framing */}
      <div className="flex flex-col flex-1 relative z-10">
        {/* Main Titles */}
        <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight leading-none group-hover:text-accent transition-colors">
          {cred.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-xs font-mono text-zinc-400 font-medium">
          {cred.id.startsWith('ucd-') ? <Landmark className="w-3.5 h-3.5 text-zinc-500" /> : <Award className="w-3.5 h-3.5 text-zinc-500" />}
          <span>{cred.issuer} · {cred.location}</span>
        </div>

        {/* Grade and Timeline Metrics */}
        {cred.grade && cred.period && (
          <div className="mt-4 self-start inline-flex items-center gap-4 border border-white/5 bg-black/40 py-1.5 px-3 font-mono text-[10px] text-zinc-400">
            <span className="text-white font-bold">{cred.grade}</span>
            <span className="w-1 h-2 bg-white/10" />
            <span>{cred.period}</span>
          </div>
        )}

        {/* Content blurb */}
        <p className="mt-5 text-sm leading-relaxed text-zinc-400 font-medium flex-1">
          {cred.description}
        </p>

        {/* Core Highlights with sub bullet styling */}
        <div className="mt-6 border-t border-white/5 pt-5">
          <div className="text-[9px] font-mono uppercase tracking-widest text-accent font-bold mb-3">
            // CORE CAPABILITIES EVALUATED
          </div>
          <ul className="space-y-2">
            {cred.highlights.map((hlt, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-zinc-350 leading-relaxed">
                <span className="text-accent font-black shrink-0 mt-[1px]">↳</span>
                <span>{hlt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verify Link / Footer with full high-visibility container and hover action triggers */}
      <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="font-mono text-[11px] text-zinc-500 flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
          <div>
            <span>RECORD HASH: </span>
            <span className="text-white font-bold tracking-wider">{cred.hash}</span>
          </div>

          {/* Micro Sensory Equalizer Bars */}
          <div className="flex gap-[1.5px] items-end h-2.5">
            <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-1 opacity-25 group-hover:animate-equalizer-one" />
            <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-2 opacity-25 group-hover:animate-equalizer-two" />
            <div className="w-[1px] bg-emerald-500 transition-all duration-300 h-1.5 opacity-25 group-hover:animate-equalizer-three" />
          </div>
        </div>

        {/* Hover trigger verify button */}
        <a
          href={cred.verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn relative inline-flex items-center justify-between gap-3 bg-[#0a0a0a] overflow-hidden hover:bg-white text-white hover:text-black border border-white/15 hover:border-white px-4 py-2.5 transition-all duration-300"
        >
          <span className="font-mono text-[11px] font-black tracking-widest uppercase flex items-center gap-2 z-10">
            VERIFY CREDENTIAL
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 z-10" />
          
          <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        </a>
      </div>
    </div>
  );
}

export default function CredentialShowcase() {
  return (
    <section id="experience" className="py-20 border-b border-white/10 bg-transparent relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header section with technical styling */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter uppercase leading-[0.9]">
              Verified <span className="font-extralight text-white/40">Expertise</span>
            </h2>
          </div>

        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {CREDENTIALS_DATA.map((cred) => (
            <CredentialCard key={cred.id} cred={cred} />
          ))}
        </div>

      </div>
    </section>
  );
}

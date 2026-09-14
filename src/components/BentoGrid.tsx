import React, { useRef, useState } from 'react';
import { Award, ShieldCheck, ExternalLink, Layers, Cpu, Zap, Volume2, VolumeX } from 'lucide-react';

const playSound = (type: 'conversion' | 'ai' | 'instant' | 'local') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    switch (type) {
      case 'conversion': {
        // Clinical Platform Focus: Rising pure electronic chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, ctx.currentTime); // Mi (E4)
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3); // High Mi (E5)

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        break;
      }
      case 'ai': {
        // 24/7 AI Receptionist: Robotic, intelligent scanning chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        
        // Double electronic sweep/beep
        osc.frequency.setValueAtTime(784, ctx.currentTime); // G5
        osc.frequency.setValueAtTime(1174, ctx.currentTime + 0.08); // D6

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        break;
      }
      case 'instant': {
        // Instant Lead Zap: Descending high-speed laser sound (speed)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.22);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.23);
        break;
      }
      case 'local': {
        // Dominate Local Search: Geographical sonar echolocation pulse
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(130.81, ctx.currentTime + 0.8); // C3

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.82);

        // Simulated Echo/Delay
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.18;

        const delayGain = ctx.createGain();
        delayGain.gain.value = 0.35; // feedback volume

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(ctx.destination);
        delayGain.connect(delay); // Echo recursion feedback

        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        break;
      }
    }
  } catch (err) {
    console.warn('Audio Synthesis engine not active yet or restricted by browser', err);
  }
};

interface BentoCardProps {
  id: string;
  icon: React.ComponentType<any>;
  category: string;
  title: string;
  blurb: string;
  description: string;
  accentColor: 'gold' | 'green';
  soundKey: 'conversion' | 'ai' | 'instant' | 'local';
  soundEnabled: boolean;
}

function BentoCard({
  id,
  icon: Icon,
  category,
  title,
  blurb,
  description,
  accentColor,
  soundKey,
  soundEnabled,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Setup styles based on design accents
  const shadowColor = accentColor === 'gold' ? 'rgba(209, 178, 128, 0.12)' : 'rgba(47, 168, 122, 0.12)';
  const borderActiveColor = accentColor === 'gold' ? 'border-[#D1B280]/40' : 'border-[#2FA87A]/40';
  const textAccent = accentColor === 'gold' ? 'text-[#D1B280]' : 'text-[#2FA87A]';
  const glowDot = accentColor === 'gold' ? 'bg-[#D1B280]' : 'bg-[#2FA87A]';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (soundEnabled) {
      playSound(soundKey);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Safe 3D perspective transform parameters (always checks reduced-motion fallback)
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
      onMouseLeave={handleMouseLeave}
      style={{
        transform: !isReduced 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` 
          : 'none',
        transition: isHovered 
          ? 'transform 0.1s ease-out, border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
          : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered && !isReduced ? `0 25px 50px ${shadowColor}` : 'none',
        zIndex: isHovered ? 20 : 1,
      }}
      className={`p-8 md:p-10 border border-white/5 bg-[#010101] flex flex-col justify-between ${isHovered ? borderActiveColor : ''} rounded-none relative overflow-hidden group unseen-card-shine cursor-pointer`}
    >
      {/* Precision Dynamic Cursor Spotlight Radial Overlay */}
      {isHovered && !isReduced && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, ${accentColor === 'gold' ? 'rgba(209, 178, 128, 0.05)' : 'rgba(47, 168, 122, 0.05)'}, transparent 80%)`,
            zIndex: 1,
          }}
        />
      )}

      {/* Code index indicator */}
      <div className="absolute top-4 right-4 text-[8px] font-mono text-white/10 select-none z-10 tracking-widest">
        {id}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Customized Icon Container */}
          <div className="w-12 h-12 bg-black border border-white/5 flex items-center justify-center mb-8 relative overflow-hidden group-hover:border-white/15 transition-colors">
            {/* Dynamic Hover Glow Layer inside Icon space */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${glowDot}`} />
            <Icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 relative z-10 ${textAccent}`} />
          </div>

          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest block">
            {category}
          </span>
          
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight mt-3 transition-colors duration-300 group-hover:text-accent">
            {title}
          </h3>
          
          <p className={`text-sm ${textAccent} font-mono mt-3 leading-snug`}>
            {blurb}
          </p>
          
          <p className="text-xs text-zinc-400 mt-4 font-sans leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Sensory Audio Signal Status & Equalizer Waves */}
        <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-6">
          <div className="flex gap-[3px] items-end justify-start h-4">
            <div 
              className={`w-[2px] transition-all duration-300 ${glowDot} ${isHovered && !isReduced ? 'animate-equalizer-one' : 'h-1 opacity-25'}`} 
              style={{ animationDelay: '0ms' }}
            />
            <div 
              className={`w-[2px] transition-all duration-300 ${glowDot} ${isHovered && !isReduced ? 'animate-equalizer-two' : 'h-2 opacity-25'}`} 
              style={{ animationDelay: '100ms' }}
            />
            <div 
              className={`w-[2px] transition-all duration-300 ${glowDot} ${isHovered && !isReduced ? 'animate-equalizer-three' : 'h-1.5 opacity-25'}`} 
              style={{ animationDelay: '200ms' }}
            />
            <div 
              className={`w-[2px] transition-all duration-300 ${glowDot} ${isHovered && !isReduced ? 'animate-equalizer-four' : 'h-2.5 opacity-25'}`} 
              style={{ animationDelay: '300ms' }}
            />
          </div>

          <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-650 transition-colors group-hover:text-zinc-400 select-none">
            {isHovered ? 'AUDIO_FEEDBACK_ACTIVE' : 'AUDIO_STANDBY'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BentoGrid() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <section id="architecture" className="py-24 border-b border-white/5 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-white/10 bg-[#0c0c0c] mb-4">
              <Layers className="w-3.5 h-3.5 text-[#D1B280]" />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#D1B280] uppercase">The Response Framework</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tighter uppercase leading-[0.85]">
              Response is<br /> everything
            </h2>
          </div>

          {/* Spatial Sound Controller */}
          <div className="self-start sm:self-auto relative z-20">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-2.5 px-3.5 py-2 border border-white/10 bg-[#070707] hover:bg-zinc-900 transition-all text-[9px] font-mono tracking-widest font-extrabold text-[#D1B280] uppercase rounded-none select-none hover:border-[#D1B280]/30 cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#D1B280] animate-pulse" />
                  <span>SENSORY FEEDBACK: ACTIVE</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                  <span>SENSORY FEEDBACK: MUTED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* The Problem (Pain Section) */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-white/5 bg-black/60 p-6 md:p-10 relative overflow-hidden">
          {/* Subtle grid crosshair decoration */}
          <div className="absolute top-4 left-4 text-[10px] text-white/10 font-mono select-none">+</div>
          <div className="absolute top-4 right-4 text-[10px] text-white/10 font-mono select-none">+</div>
          
          <div className="lg:col-span-5 border-r border-white/5 pr-0 lg:pr-10 py-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#D1B280] uppercase font-black block mb-2">// The Cost of Waiting_</span>
            <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight leading-snug">
              Every missed enquiry is money walking out the door.
            </h3>
          </div>
          <div className="lg:col-span-7 pl-0 lg:pl-6">
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-sans font-medium">
              You're treating a patient, performing a consultation, or in the middle of a clinic procedure — and the phone rings or an Instagram DM comes in. By the time you call them back, they've already booked with a competitor. Premium clinics live and die by responsiveness. <strong className="text-white font-black">That's not a marketing problem. It's a booking response problem.</strong> And it's 100% fixable.
            </p>
          </div>
        </div>

        {/* Reframed Services Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-20">
          <BentoCard
            id="// CORE_M_01"
            icon={Layers}
            category="// Conversion Engine"
            title="Clinical Platform That Protects Bookings"
            blurb="Most clinic websites are flat brochures. Yours will capture premium treatment cases."
            description="An immersive, bespoke digital storefront optimized to turn high-intent visitors into booked clinical appointments — clear pathways, mobile-first, matching the caliber of your in-person experience."
            accentColor="gold"
            soundKey="conversion"
            soundEnabled={soundEnabled}
          />

          <BentoCard
            id="// CORE_M_02"
            icon={Cpu}
            category="// Autonomous Intake"
            title="24/7 AI Patient Receptionist"
            blurb="Never lose high-value cases to after-hours delays."
            description="A smart assistant answers patient questions, qualifies interest for high-ticket procedures (Invisalign, Botox, sports S&C), and schedules consults. It works while you're in surgery, asleep, or with your family."
            accentColor="green"
            soundKey="ai"
            soundEnabled={soundEnabled}
          />

          <BentoCard
            id="// CORE_M_03"
            icon={Zap}
            category="// Real-Time Funnel"
            title="Instant Lead Follow-Up"
            blurb="Reply in seconds, not days — automatically."
            description="The moment someone enquires, they get a friendly reply, a booking link, and a reminder. No lead goes cold because you were too busy to call back."
            accentColor="gold"
            soundKey="instant"
            soundEnabled={soundEnabled}
          />

          <BentoCard
            id="// CORE_M_04"
            icon={ShieldCheck}
            category="// Local Growth"
            title="Dominate Local Search"
            blurb="Attract top-tier patients in your neighborhood."
            description="Strategic optimization to make your clinic rank for premium treatment terms (like aesthetics, dermal fillers, private ortho, physical rehab) in high-income Dublin postal codes."
            accentColor="green"
            soundKey="local"
            soundEnabled={soundEnabled}
          />
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef, memo } from 'react';

interface CornerWorkerProps {
  cardRef?: React.RefObject<HTMLDivElement | null>;
  position?: 'top-right' | 'top-left' | 'on-word';
  boxLabel?: string;
  onImpact?: () => void;
}

interface ClickSpark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const CornerWorker = memo(function CornerWorker({
  cardRef,
  position = 'on-word',
  boxLabel = 'How I Work',
  onImpact,
}: CornerWorkerProps) {
  const [speech, setSpeech] = useState<string | null>(null);
  const [clickSparks, setClickSparks] = useState<ClickSpark[]>([]);
  const sparkIdRef = useRef(0);
  const clickAnimFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const isFacingLeft = position === 'top-right' || position === 'on-word';

  // Pause work loop when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Synchronize the parent's onImpact pulse with the rhythmic 0.85s strike cycle
  // (Impact lands at ~68% into the cycle = 580ms from cycle start)
  useEffect(() => {
    if (!onImpact || !isVisible) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    const initialDelay = setTimeout(() => {
      onImpact();

      if (cardRef?.current) {
        cardRef.current.style.borderColor = 'rgba(209, 178, 128, 0.7)';
        setTimeout(() => {
          if (cardRef?.current) cardRef.current.style.borderColor = '';
        }, 120);
      }

      intervalId = setInterval(() => {
        onImpact();
        if (cardRef?.current) {
          cardRef.current.style.borderColor = 'rgba(209, 178, 128, 0.7)';
          setTimeout(() => {
            if (cardRef?.current) cardRef.current.style.borderColor = '';
          }, 120);
        }
      }, 850);
    }, 580);

    return () => {
      clearTimeout(initialDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, [onImpact, cardRef]);

  // Click interaction: fast burst of sparks and witty artisan quote
  const handleWorkerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const quotes = position === 'on-word'
      ? [
          'Tapping How I Work! 🔨',
          'Crafting clean systems...',
          'Zero lock-in code craft!',
          'Chiseling high-performance architecture...',
          '100% digital sovereignty!',
        ]
      : [
          'Tapping gold corners! 🔨',
          'Refining the border bevel...',
          'Zero rough edges here!',
          'Crafting 60fps polish...',
        ];
    setSpeech(quotes[Math.floor(Math.random() * quotes.length)]);

    // Trigger parent impact glow
    if (onImpact) onImpact();

    // Spawn interactive shower of sparks
    const colors = ['#FFFFFF', '#FFF3D6', '#D1B280', '#FCD34D', '#2FA87A'];
    const newSparks: ClickSpark[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.6;
      const speed = 60 + Math.random() * 120;
      newSparks.push({
        id: sparkIdRef.current++,
        x: 18,
        y: 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.25,
      });
    }

    setClickSparks((prev) => [...prev.slice(-20), ...newSparks]);
    setTimeout(() => setSpeech(null), 2400);
  };

  // Animate dynamic click sparks if any are active
  useEffect(() => {
    if (clickSparks.length === 0) return;

    let lastTime = performance.now();
    const updateClickSparks = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      setClickSparks((prev) => {
        const next = prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx * dt,
            y: s.y + s.vy * dt,
            vy: s.vy + 360 * dt, // gravity pull
            life: s.life + dt,
            alpha: Math.max(0, 1 - s.life / s.maxLife),
          }))
          .filter((s) => s.life < s.maxLife);

        if (next.length > 0) {
          clickAnimFrameRef.current = requestAnimationFrame(updateClickSparks);
        }
        return next;
      });
    };

    clickAnimFrameRef.current = requestAnimationFrame(updateClickSparks);
    return () => {
      if (clickAnimFrameRef.current) cancelAnimationFrame(clickAnimFrameRef.current);
    };
  }, [clickSparks.length]);

  const containerStyle: React.CSSProperties = position === 'on-word'
    ? {
        position: 'absolute',
        bottom: 'calc(100% - 6px)',
        right: '-4px',
        zIndex: 35,
      }
    : {
        position: 'absolute',
        top: 0,
        right: position === 'top-right' ? '20px' : 'auto',
        left: position === 'top-left' ? '20px' : 'auto',
        transform: 'translateY(-100%)',
        zIndex: 35,
      };

  return (
    <div
      ref={containerRef}
      onClick={handleWorkerClick}
      style={containerStyle}
      className="cursor-pointer select-none group pointer-events-auto"
      title={`${boxLabel} Craftsman at work! Click to interact.`}
    >
      {/* Dynamic Keyframe Styles: Hardware Accelerated, 100% Jam-Proof */}
      <style>{`
        .miner-arm-swing {
          animation: pickaxeSwing 0.85s cubic-bezier(0.35, 0, 0.25, 1) infinite;
          transform-origin: 58px 40px;
          will-change: transform;
        }
        .miner-torso-lean {
          animation: torsoSwing 0.85s cubic-bezier(0.35, 0, 0.25, 1) infinite;
          transform-origin: 55px 72px;
          will-change: transform;
        }
        .miner-contact-burst {
          animation: contactBurst 0.85s infinite;
          transform-origin: 18px 100px;
        }
        .miner-spark-1 { animation: sparkFly1 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-2 { animation: sparkFly2 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-3 { animation: sparkFly3 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-4 { animation: sparkFly4 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-5 { animation: sparkFly5 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-6 { animation: sparkFly6 0.85s infinite; transform-origin: 18px 100px; }
        .miner-spark-7 { animation: sparkFly7 0.85s infinite; transform-origin: 18px 100px; }

        @keyframes pickaxeSwing {
          0% {
            /* Ready rest pose */
            transform: rotate(18deg);
          }
          35% {
            /* Smooth windup, raising pickaxe high */
            transform: rotate(44deg);
          }
          50% {
            /* Peak of windup, drawn back ready to strike */
            transform: rotate(50deg);
          }
          68% {
            /* POWERFUL SNAP DOWN: Pickaxe tip strikes exactly on the word line at Y=100 */
            transform: rotate(0deg);
          }
          74% {
            /* Sharp recoil bounce off the word */
            transform: rotate(7deg);
          }
          85% {
            /* Recovering smoothly */
            transform: rotate(14deg);
          }
          100% {
            /* Back to ready pose */
            transform: rotate(18deg);
          }
        }

        @keyframes torsoSwing {
          0% {
            transform: rotate(0deg);
          }
          35% {
            /* Lean back slightly as pickaxe raises */
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(-5deg);
          }
          68% {
            /* Thrust body forward into the impact */
            transform: rotate(7deg);
          }
          74% {
            transform: rotate(3deg);
          }
          85% {
            transform: rotate(1deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes contactBurst {
          0%, 66% {
            opacity: 0;
            transform: scale(0.2);
          }
          68% {
            opacity: 1;
            transform: scale(1.4);
          }
          75% {
            opacity: 0.6;
            transform: scale(1.1);
          }
          82%, 100% {
            opacity: 0;
            transform: scale(0.3);
          }
        }

        @keyframes sparkFly1 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(1); }
          78% { opacity: 0.9; transform: translate(-9px, -15px) scale(0.9); }
          88% { opacity: 0; transform: translate(-15px, -22px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly2 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(1.1); }
          78% { opacity: 1; transform: translate(-3px, -20px) scale(1.2); }
          88% { opacity: 0; transform: translate(-5px, -30px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly3 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(1); }
          78% { opacity: 0.9; transform: translate(6px, -16px) scale(0.9); }
          88% { opacity: 0; transform: translate(11px, -24px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly4 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(0.9); }
          78% { opacity: 0.85; transform: translate(-13px, -9px) scale(0.85); }
          88% { opacity: 0; transform: translate(-20px, -12px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly5 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(1.2); }
          78% { opacity: 1; transform: translate(2px, -23px) scale(1.3); }
          88% { opacity: 0; transform: translate(3px, -33px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly6 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(0.9); }
          78% { opacity: 0.85; transform: translate(10px, -10px) scale(0.8); }
          88% { opacity: 0; transform: translate(16px, -14px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }

        @keyframes sparkFly7 {
          0%, 67% { opacity: 0; transform: translate(0, 0) scale(0); }
          68% { opacity: 1; transform: translate(0, 0) scale(1); }
          78% { opacity: 0.9; transform: translate(-7px, -22px) scale(1); }
          88% { opacity: 0; transform: translate(-10px, -31px) scale(0); }
          100% { opacity: 0; transform: translate(0, 0) scale(0); }
        }
      `}</style>

      {/* Speech / Thought Bubble */}
      {speech && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/70 bg-black/95 px-2 py-0.5 font-mono text-[9px] font-bold text-accent shadow-lg backdrop-blur-md animate-bounce pointer-events-none z-50">
          {speech}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rotate-45 border-b border-r border-accent/70 bg-black" />
        </div>
      )}

      {/* Craftsman SVG Graphic Container */}
      <div
        style={{
          transform: isFacingLeft ? 'none' : 'scaleX(-1)',
          transformOrigin: 'center bottom',
        }}
        className="relative w-16 h-18 sm:w-20 sm:h-22 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
      >
        <svg
          viewBox="-20 0 125 110"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Elegant Champagne Gold Gradient */}
            <linearGradient id="cornerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4DE" />
              <stop offset="50%" stopColor="#D1B280" />
              <stop offset="100%" stopColor="#A88248" />
            </linearGradient>

            {/* Pickaxe Head Top Facet (Chiseled Metallic Highlight) */}
            <linearGradient id="pickHeadTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFF5E3" />
              <stop offset="70%" stopColor="#D9BA89" />
              <stop offset="100%" stopColor="#B58F52" />
            </linearGradient>

            {/* Pickaxe Head Bottom Facet (Forged Bronze Shadow Bevel) */}
            <linearGradient id="pickHeadShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A68144" />
              <stop offset="50%" stopColor="#6E5023" />
              <stop offset="100%" stopColor="#402D11" />
            </linearGradient>

            {/* Wooden Handle Gradient (Polished Ash/Hickory Haft) */}
            <linearGradient id="woodHaftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DFBC" />
              <stop offset="50%" stopColor="#CBA56B" />
              <stop offset="100%" stopColor="#875E26" />
            </linearGradient>

            {/* Miner Headlamp Beam Projection */}
            <linearGradient id="headlampBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#FFE8B5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D1B280" stopOpacity="0" />
            </linearGradient>

            <filter id="cornerGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#D1B280" floodOpacity="0.45" />
            </filter>

            <radialGradient id="sparkFlashGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="35%" stopColor="#FFE8B5" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#D1B280" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#D1B280" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* BASE SILHOUETTE BODY (Leans dynamically with swing) */}
          <g className="miner-torso-lean">
            {/* Back Leg (Braced backward) */}
            <g>
              <path
                d="M 52 70 Q 42 78 40 88 L 38 100"
                fill="none"
                stroke="url(#cornerGoldGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Back Foot resting flat on the box/word line */}
              <ellipse cx="37" cy="100" rx="5" ry="3.5" fill="url(#cornerGoldGrad)" />
            </g>

            {/* Front Leg (Bent forward at knee toward contact point) */}
            <g>
              <path
                d="M 56 70 Q 64 78 68 85 L 75 100"
                fill="none"
                stroke="url(#cornerGoldGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Front Foot planted firmly on the box/word line */}
              <ellipse cx="76" cy="100" rx="5.5" ry="3.5" fill="url(#cornerGoldGrad)" />
            </g>

            {/* TORSO: Muscular arched back leaning toward the tool */}
            <path
              d="M 50 72 Q 44 55 58 38 L 66 40 Q 56 58 58 72 Z"
              fill="url(#cornerGoldGrad)"
            />
            {/* Shoulder blend socket */}
            <circle cx="58" cy="40" r="6" fill="url(#cornerGoldGrad)" />

            {/* HEAD: Miner Silhouette with Hardhat & Headlamp */}
            <g>
              {/* Face/Head profile */}
              <circle cx="66" cy="24" r="8.5" fill="url(#cornerGoldGrad)" />
              {/* Miner Hardhat Dome */}
              <path
                d="M 57 23 Q 56 13 67 13 Q 77 13 77 23 Z"
                fill="#FFF1D6"
                stroke="#A88248"
                strokeWidth="1"
              />
              {/* Helmet Front Brim */}
              <path
                d="M 53 23 L 78 23"
                stroke="#FFF6E0"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Headlamp Housing & Glowing Lens */}
              <rect x="53" y="20" width="3.5" height="4" rx="1" fill="#CBA56B" />
              <circle cx="53" cy="22" r="2" fill="#FFFFFF" />
              {/* Soft Headlamp Spotlight projected onto work target */}
              <polygon
                points="52,22 14,92 34,98"
                fill="url(#headlampBeamGrad)"
                pointerEvents="none"
              />
            </g>
          </g>

          {/* ARMS & ICONIC PICKAXE (Pivots from shoulder at 58, 40 to strike surface at 18, 100) */}
          <g className="miner-arm-swing" filter="url(#cornerGlow)">
            {/* 1. BACK ARM (Upper arm reaching down to back grip) */}
            <path
              d="M 58 40 Q 55 52 50 62"
              fill="none"
              stroke="url(#cornerGoldGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />

            {/* 2. FRONT ARM (Reaching forward down along handle) */}
            <path
              d="M 58 40 Q 46 54 38 65"
              fill="none"
              stroke="url(#cornerGoldGrad)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />

            {/* 3. WOODEN HANDLE (Polished Straight Ash/Hickory Shaft) */}
            <g id="pickaxe-haft">
              {/* Wooden shaft base */}
              <line
                x1="60"
                y1="58"
                x2="12"
                y2="70"
                stroke="url(#woodHaftGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              {/* Wooden shaft inner highlight */}
              <line
                x1="59"
                y1="58.5"
                x2="13"
                y2="69.5"
                stroke="#FFF2DC"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Rounded ergonomic butt knob */}
              <circle
                cx="60"
                cy="58"
                r="3"
                fill="#CBA56B"
                stroke="#6E5023"
                strokeWidth="0.8"
              />
              {/* Wooden nose tip protruding out the front of the eye collar */}
              <polygon
                points="12,70 17,68.8 17,71.2 12,71"
                fill="#F5DFBC"
              />
              {/* Dark iron fixing wedge driven into the nose end grain */}
              <polygon
                points="12,69.5 14.5,70 12,70.5"
                fill="#2E210D"
              />
            </g>

            {/* 4. ICONIC CURVED PICKAXE HEAD (Forged Double-Horned Arch) */}
            <g id="pickaxe-head">
              {/* Top/Outer Facet (Sunlit upper bevel) */}
              <path
                d="M 24 34 Q 13 68 18 100 Q 17 68 24 34 Z"
                fill="url(#pickHeadTopGrad)"
              />

              {/* Bottom/Inner Facet (Forged bronze shadow bevel) */}
              <path
                d="M 24 34 Q 17 68 18 100 Q 22 86 25 72 L 25 64 Q 24 50 24 34 Z"
                fill="url(#pickHeadShadowGrad)"
              />

              {/* Raised Central Spine/Ridge Line */}
              <path
                d="M 24 34 Q 17 68 18 100"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.9"
                opacity="0.85"
              />

              {/* Heavy Forged Eye Socket Collar mounting head to shaft */}
              <polygon
                points="17,63 25,62 26,73 18,74"
                fill="url(#cornerGoldGrad)"
                stroke="#402D11"
                strokeWidth="0.8"
              />
              {/* Collar Fixing Rivet Pin */}
              <circle cx="21.5" cy="67.5" r="1.3" fill="#FFFFFF" />

              {/* Sharp Strike Tip Glint (Directly at contact point 18, 100) */}
              <circle cx="18" cy="100" r="1.8" fill="#FFFFFF" />

              {/* Upper Counter-Spike Glint */}
              <circle cx="24" cy="34" r="1.3" fill="#FFFFFF" />
            </g>

            {/* 5. MINER'S HANDS GRIPPING THE HAFT */}
            {/* Back Hand Grip */}
            <ellipse
              cx="50"
              cy="62"
              rx="3.5"
              ry="3"
              fill="url(#cornerGoldGrad)"
              stroke="#6E5023"
              strokeWidth="0.8"
            />
            {/* Front Hand Grip */}
            <ellipse
              cx="38"
              cy="65"
              rx="3.5"
              ry="3"
              fill="url(#cornerGoldGrad)"
              stroke="#6E5023"
              strokeWidth="0.8"
            />
          </g>

          {/* SYNCHRONIZED IMPACT BURST & SPARKS (Directly at contact point 18, 100) */}
          <g>
            {/* Impact Flash radiating when pickaxe strikes the word */}
            <circle
              className="miner-contact-burst"
              cx="18"
              cy="100"
              r="7"
              fill="url(#sparkFlashGrad)"
            />

            {/* Rhythmic sparks flying off the contact point */}
            <circle className="miner-spark-1" cx="18" cy="100" r="1.4" fill="#FFFFFF" />
            <circle className="miner-spark-2" cx="18" cy="100" r="1.9" fill="#FFF3D6" />
            <circle className="miner-spark-3" cx="18" cy="100" r="1.6" fill="#FCD34D" />
            <circle className="miner-spark-4" cx="18" cy="100" r="1.2" fill="#D1B280" />
            <circle className="miner-spark-5" cx="18" cy="100" r="2.1" fill="#FFFFFF" />
            <circle className="miner-spark-6" cx="18" cy="100" r="1.5" fill="#2FA87A" />
            <circle className="miner-spark-7" cx="18" cy="100" r="1.7" fill="#FFEAA7" />

            {/* Interactive Click Sparks */}
            {clickSparks.map((s) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={s.size}
                fill={s.color}
                opacity={s.alpha}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
});

export default CornerWorker;

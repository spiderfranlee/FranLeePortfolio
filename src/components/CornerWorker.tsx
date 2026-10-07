import React, { useState, useEffect, useRef } from 'react';

interface Spark {
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

interface CornerWorkerProps {
  cardRef?: React.RefObject<HTMLDivElement | null>;
  position?: 'top-right' | 'top-left' | 'on-word';
  boxLabel?: string;
  onImpact?: () => void;
}

export default function CornerWorker({
  cardRef,
  position = 'on-word',
  boxLabel = 'How I Work',
  onImpact,
}: CornerWorkerProps) {
  const [tapPhase, setTapPhase] = useState(0); // 0..1 in tap cycle
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [impactFlash, setImpactFlash] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);

  const lastTimeRef = useRef(performance.now());
  const tapTimerRef = useRef(0);
  const tapCountRef = useRef(0);
  const sparkIdRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Pickaxe tip hits the box edge / text top at this local coordinate
  // When pickaxe strikes down, the sharp tip contacts at (contactX, 0)
  const isFacingLeft = position === 'top-right' || position === 'on-word';
  const CONTACT_X = isFacingLeft ? -16 : 16;
  const CONTACT_Y = 0; // Exactly on the top border edge or text top line

  const triggerEdgeSparks = () => {
    // Little crisp sparks spraying off where the pickaxe hits
    const sparkCount = 8 + Math.floor(Math.random() * 6);
    const colors = ['#FFFFFF', '#FFF3D6', '#D1B280', '#FCD34D', '#2FA87A'];
    const newSparks: Spark[] = [];

    // Fan angle spraying upward and outward from the contact point
    const baseAngle = isFacingLeft ? -Math.PI * 0.65 : -Math.PI * 0.35;

    for (let i = 0; i < sparkCount; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * 1.4;
      const speed = 45 + Math.random() * 115;
      newSparks.push({
        id: sparkIdRef.current++,
        x: CONTACT_X + (Math.random() - 0.5) * 2,
        y: CONTACT_Y, // Originates right on the contact point
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.2 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 0.34 + Math.random() * 0.28,
      });
    }

    setSparks((prev) => [...prev.slice(-28), ...newSparks]);

    // Local impact flash
    setImpactFlash(true);
    setTimeout(() => setImpactFlash(false), 90);

    // Trigger parent visual impact
    if (onImpact) {
      onImpact();
    }

    // Subtle edge pulse if cardRef is attached
    if (cardRef?.current) {
      const el = cardRef.current;
      el.style.borderColor = 'rgba(209, 178, 128, 0.7)';
      setTimeout(() => {
        el.style.borderColor = '';
      }, 110);
    }
  };

  useEffect(() => {
    const update = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Update Sparks
      setSparks((prev) =>
        prev
          .map((s) => ({
            ...s,
            x: s.x + s.vx * dt,
            y: s.y + s.vy * dt,
            vy: s.vy + 280 * dt, // gravity pulling sparks downward off edge
            vx: s.vx * 0.98,
            life: s.life + dt,
            alpha: Math.max(0, 1 - s.life / s.maxLife),
          }))
          .filter((s) => s.life < s.maxLife)
      );

      // Tapping cadence: satisfying rhythmic tap (~0.58s per tap)
      const TAP_CYCLE = 0.58;
      tapTimerRef.current += dt;
      const phase = (tapTimerRef.current % TAP_CYCLE) / TAP_CYCLE;
      setTapPhase(phase);

      // Trigger spark when pickaxe tip makes contact at ~0.70 of cycle
      const currentTap = Math.floor(tapTimerRef.current / TAP_CYCLE);
      if (currentTap > tapCountRef.current) {
        tapCountRef.current = currentTap;
        triggerEdgeSparks();

        // Occasional double-tap rhythm variation
        if (currentTap % 7 === 0) {
          setTimeout(() => {
            triggerEdgeSparks();
          }, 140);
        }
      }

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [position, cardRef]);

  // Click interaction: fast triple-tap with cheer
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
    triggerEdgeSparks();
    setTimeout(() => triggerEdgeSparks(), 120);
    setTimeout(() => triggerEdgeSparks(), 240);
    setTimeout(() => setSpeech(null), 2500);
  };

  // Tapping kinematics:
  // 0.00 -> 0.60: Raise pickaxe up smoothly (windup)
  // 0.60 -> 0.72: Fast snappy tap down onto the edge/word!
  // 0.72 -> 0.82: Micro bounce on impact
  // 0.82 -> 1.00: Return to ready
  let armRotation = -20;
  let torsoLean = 0;

  if (tapPhase < 0.60) {
    const t = tapPhase / 0.60;
    armRotation = -20 - t * 40; // raises to -60 deg
    torsoLean = -t * 4;
  } else if (tapPhase < 0.74) {
    const t = (tapPhase - 0.60) / 0.14;
    armRotation = -60 + t * 86; // strikes down to +26 deg (exact contact)
    torsoLean = -4 + t * 10;
  } else if (tapPhase < 0.84) {
    const t = (tapPhase - 0.74) / 0.10;
    armRotation = 26 - Math.sin(t * Math.PI) * 14; // recoil bounce
    torsoLean = 6 - t * 3;
  } else {
    const t = (tapPhase - 0.84) / 0.16;
    armRotation = 12 - t * 32;
    torsoLean = 3 - t * 3;
  }

  const containerStyle: React.CSSProperties = position === 'on-word'
    ? {
        position: 'absolute',
        bottom: 'calc(100% - 2px)',
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
      onClick={handleWorkerClick}
      style={containerStyle}
      className="cursor-pointer select-none group pointer-events-auto"
      title={`${boxLabel} Craftsman at work! Click to interact.`}
    >
      {/* Speech / Thought Bubble */}
      {speech && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-accent/70 bg-black/95 px-2 py-0.5 font-mono text-[9px] font-bold text-accent shadow-lg backdrop-blur-md animate-bounce pointer-events-none">
          {speech}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rotate-45 border-b border-r border-accent/70 bg-black" />
        </div>
      )}

      {/* Spark Particles Showering Directly Off the Box Edge */}
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {sparks.map((s) => (
          <span
            key={s.id}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: `translate3d(${s.x}px, ${s.y}px, 0)`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: s.color,
              opacity: s.alpha,
              boxShadow: `0 0 5px ${s.color}`,
              borderRadius: '9999px',
            }}
          />
        ))}

        {/* Impact Contact Flash right on the edge */}
        {impactFlash && (
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: `calc(50% + ${CONTACT_X}px)`,
              transform: 'translate(-50%, 50%)',
            }}
            className="h-3 w-3 rounded-full bg-accent/80 blur-[2px] animate-ping"
          />
        )}
      </div>

      {/* Silhouette Graphic Container */}
      <div
        style={{
          transform: isFacingLeft ? 'none' : 'scaleX(-1)',
          transformOrigin: 'center bottom',
        }}
        className="relative w-14 h-16 sm:w-16 sm:h-18 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)]"
      >
        <svg
          viewBox="0 0 100 110"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Elegant Champagne Gold Gradient */}
            <linearGradient id="cornerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4DE" />
              <stop offset="50%" stopColor="#D1B280" />
              <stop offset="100%" stopColor="#A88248" />
            </linearGradient>

            <filter id="cornerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#D1B280" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* BASE SILHOUETTE BODY (Matching image.png) */}
          <g style={{ transform: `rotate(${torsoLean}deg)`, transformOrigin: '55px 72px' }}>
            {/* LEGS: Authentic Miner / Mason Stance from image.png */}
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
              {/* Back Foot resting flat on the box edge */}
              <ellipse cx="37" cy="100" rx="5" ry="3.5" fill="url(#cornerGoldGrad)" />
            </g>

            {/* Front Leg (Bent forward at knee toward edge) */}
            <g>
              <path
                d="M 56 70 Q 64 78 68 85 L 75 100"
                fill="none"
                stroke="url(#cornerGoldGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Front Foot planted firmly on the box edge */}
              <ellipse cx="76" cy="100" rx="5.5" ry="3.5" fill="url(#cornerGoldGrad)" />
            </g>

            {/* TORSO: Arched back leaning forward toward pickaxe */}
            <path
              d="M 50 72 Q 44 55 58 38 L 66 40 Q 56 58 58 72 Z"
              fill="url(#cornerGoldGrad)"
            />
            {/* Shoulder blend */}
            <circle cx="60" cy="40" r="6" fill="url(#cornerGoldGrad)" />

            {/* HEAD: Solid round circle from image.png */}
            <circle cx="66" cy="22" r="9.5" fill="url(#cornerGoldGrad)" />
          </g>

          {/* ARMS & PICKAXE (Pivots dynamically for the edge tap) */}
          <g
            style={{
              transform: `rotate(${armRotation}deg)`,
              transformOrigin: '60px 40px',
              transition: 'transform 0.06s ease-out',
            }}
            filter="url(#cornerGlow)"
          >
            {/* Back Arm gripping shaft base */}
            <path
              d="M 60 40 Q 52 48 44 48"
              fill="none"
              stroke="url(#cornerGoldGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Front Arm gripping shaft middle */}
            <path
              d="M 60 40 Q 44 38 32 38"
              fill="none"
              stroke="url(#cornerGoldGrad)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* PICKAXE TOOL (Faithfully shaped like image.png) */}
            {/* Pickaxe Straight Handle */}
            <line
              x1="52"
              y1="54"
              x2="20"
              y2="22"
              stroke="#FFF0D4"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Curved Pickaxe Head & Pointed Pick Spike (image.png) */}
            {/* Front Pick: Arched curved claw tapering to sharp pointed tip */}
            <path
              d="M 20 22 Q 13 32 8 38 Q 14 34 22 24 Z"
              fill="url(#cornerGoldGrad)"
            />
            {/* Back Pick / Hammer Head */}
            <path
              d="M 20 22 L 26 16 L 28 18 L 22 24 Z"
              fill="url(#cornerGoldGrad)"
            />

            {/* Central pickaxe eye / collar */}
            <circle cx="21" cy="23" r="3.5" fill="#FFFFFF" />

            {/* Sharp Pick Tip Highlight */}
            <circle cx="8" cy="38" r="1.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    </div>
  );
}

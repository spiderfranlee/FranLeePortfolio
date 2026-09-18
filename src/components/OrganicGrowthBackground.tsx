import React, { useEffect, useRef } from 'react';

interface Spore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  swayFreq: number;
  swayAmp: number;
  seed: number;
}

interface Leaf {
  x: number;
  y: number;
  angle: number;
  targetSize: number;
  currentSize: number;
  color: string;
  alpha: number;
  pulsePhase: number;
}

interface BranchTip {
  x: number;
  y: number;
  angle: number;
  lengthRemaining: number;
  segmentLength: number;
  depth: number;
  maxDepth: number;
  width: number;
  curve: number;
  color: string;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  color: string;
  alpha: number;
}

interface Tree {
  id: number;
  seedX: number;
  seedY: number;
  scale: number;
  stage: 'seed' | 'sprouting' | 'blooming' | 'maturing' | 'fading';
  age: number;
  seedPulse: number;
  segments: Segment[];
  activeTips: BranchTip[];
  leaves: Leaf[];
  overallAlpha: number;
  targetAlpha: number;
}

export default function OrganicGrowthBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ambient floating spores (pollen & seeds floating gently upwards)
    const ambientSpores: Spore[] = [];
    const MAX_AMBIENT_SPORES = isReducedMotion ? 15 : 45;

    const createSpore = (customX?: number, customY?: number, isSeed = false): Spore => {
      const colors = ['#D1B280', '#2FA87A', '#E8D5B5', '#6ee7b7', '#F0E6D2'];
      return {
        x: customX ?? Math.random() * width,
        y: customY ?? height + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: isSeed ? -(0.8 + Math.random() * 1.2) : -(0.3 + Math.random() * 0.7),
        size: isSeed ? 2.5 + Math.random() * 2 : 1 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0,
        maxAlpha: isSeed ? 0.8 : 0.25 + Math.random() * 0.45,
        life: 0,
        maxLife: 300 + Math.random() * 400,
        swayFreq: 0.015 + Math.random() * 0.02,
        swayAmp: 0.8 + Math.random() * 1.5,
        seed: Math.random() * 1000,
      };
    };

    for (let i = 0; i < MAX_AMBIENT_SPORES; i++) {
      const sp = createSpore();
      sp.y = Math.random() * height;
      sp.life = Math.random() * sp.maxLife;
      ambientSpores.push(sp);
    }

    // Trees state
    let trees: Tree[] = [];
    let treeIdCounter = 0;

    const createTree = (preferredX?: number): Tree => {
      const seedX = preferredX ?? (width * 0.15 + Math.random() * (width * 0.7));
      const seedY = height * 0.94 + Math.random() * 15;
      const scale = Math.min(width, height) / 900 * (0.85 + Math.random() * 0.3);

      return {
        id: ++treeIdCounter,
        seedX,
        seedY,
        scale,
        stage: 'seed',
        age: 0,
        seedPulse: 0,
        segments: [],
        activeTips: [
          {
            x: seedX,
            y: seedY,
            angle: -Math.PI / 2 + (Math.random() - 0.5) * 0.15,
            lengthRemaining: (120 + Math.random() * 50) * scale,
            segmentLength: (120 + Math.random() * 50) * scale,
            depth: 0,
            maxDepth: 5,
            width: 4.5 * scale,
            curve: (Math.random() - 0.5) * 0.03,
            color: '#B89758',
          },
        ],
        leaves: [],
        overallAlpha: 0.01,
        targetAlpha: 0.35, // subtle luxury background opacity
      };
    };

    // Initialize with 2 staggered trees across the canvas
    trees.push(createTree(width * 0.22));
    setTimeout(() => {
      trees.push(createTree(width * 0.78));
    }, 2500);

    // Handle Window Resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Optional user interactive click: plant a seed where clicked!
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (trees.length < 4) {
        trees.push(createTree(clickX));
      }
      // Burst a cluster of glowing spores upward from click
      for (let i = 0; i < 8; i++) {
        ambientSpores.push(createSpore(clickX + (Math.random() - 0.5) * 40, e.clientY - rect.top, true));
      }
    };
    window.addEventListener('click', handleClick);

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Render & Update Trees (Seed -> Sapling -> Full Tree with foliage)
      for (let t = trees.length - 1; t >= 0; t--) {
        const tree = trees[t];
        tree.age++;

        // Smooth alpha fade in/out
        if (tree.stage !== 'fading') {
          tree.overallAlpha += (tree.targetAlpha - tree.overallAlpha) * 0.03;
        } else {
          tree.overallAlpha *= 0.985;
          if (tree.overallAlpha < 0.005) {
            trees.splice(t, 1);
            // Spawn next tree in fresh location after a gentle pause
            if (trees.length < 2) {
              const freshX = width * (0.15 + Math.random() * 0.7);
              trees.push(createTree(freshX));
            }
            continue;
          }
        }

        ctx.save();
        ctx.globalAlpha = tree.overallAlpha;

        // Stage 1: Seed stage (Pulsing glowing seed node at the ground)
        if (tree.stage === 'seed') {
          tree.seedPulse += 0.08;
          const pulseSize = 3 + Math.sin(tree.seedPulse) * 1.5;

          // Outer halo
          const grad = ctx.createRadialGradient(
            tree.seedX,
            tree.seedY,
            0,
            tree.seedX,
            tree.seedY,
            pulseSize * 6
          );
          grad.addColorStop(0, 'rgba(209, 178, 128, 0.9)');
          grad.addColorStop(0.4, 'rgba(47, 168, 122, 0.4)');
          grad.addColorStop(1, 'rgba(47, 168, 122, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(tree.seedX, tree.seedY, pulseSize * 6, 0, Math.PI * 2);
          ctx.fill();

          // Core bright seed
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(tree.seedX, tree.seedY, pulseSize * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Sprout roots into the ground
          if (tree.age > 45) {
            tree.stage = 'sprouting';
          }
        }

        // Stage 2: Sprouting & Branching Growth
        if (tree.stage === 'sprouting' || tree.stage === 'blooming') {
          const STEP = 2.2; // growth velocity per frame

          const newTips: BranchTip[] = [];

          for (const tip of tree.activeTips) {
            const stepLength = Math.min(STEP, tip.lengthRemaining);
            const nextX = tip.x + Math.cos(tip.angle) * stepLength;
            const nextY = tip.y + Math.sin(tip.angle) * stepLength;

            // Record line segment
            tree.segments.push({
              x1: tip.x,
              y1: tip.y,
              x2: nextX,
              y2: nextY,
              width: tip.width,
              color: tip.color,
              alpha: Math.max(0.3, 1 - tip.depth * 0.12),
            });

            tip.x = nextX;
            tip.y = nextY;
            tip.lengthRemaining -= stepLength;
            tip.angle += tip.curve;

            if (tip.lengthRemaining > 0) {
              newTips.push(tip);
            } else {
              // Reached end of branch segment
              if (tip.depth < tip.maxDepth) {
                // Bifurcate into 2 child branches
                const branchCount = 2;
                const spreadAngle = 0.42 + Math.random() * 0.28;
                const childLength = (tip.segmentLength * (0.68 + Math.random() * 0.15));
                const childWidth = Math.max(0.8, tip.width * 0.72);

                // Color gradient transitions upwards: Earthy Gold -> Champagne -> Surgical Mint
                let nextColor = '#D1B280';
                if (tip.depth >= 2) nextColor = '#2FA87A';
                if (tip.depth >= 4) nextColor = '#6ee7b7';

                for (let b = 0; b < branchCount; b++) {
                  const dir = b === 0 ? -1 : 1;
                  const newAngle = tip.angle + dir * (spreadAngle * (0.8 + Math.random() * 0.4));
                  newTips.push({
                    x: tip.x,
                    y: tip.y,
                    angle: newAngle,
                    lengthRemaining: childLength,
                    segmentLength: childLength,
                    depth: tip.depth + 1,
                    maxDepth: tip.maxDepth,
                    width: childWidth,
                    curve: (Math.random() - 0.5) * 0.04,
                    color: nextColor,
                  });
                }
              } else {
                // Leaf / Blossom canopy node
                tree.leaves.push({
                  x: tip.x,
                  y: tip.y,
                  angle: tip.angle,
                  targetSize: 3 + Math.random() * 3.5,
                  currentSize: 0,
                  color: Math.random() > 0.45 ? '#2FA87A' : '#D1B280',
                  alpha: 0.8,
                  pulsePhase: Math.random() * Math.PI * 2,
                });
              }
            }
          }

          tree.activeTips = newTips;

          if (newTips.length === 0 && tree.stage === 'sprouting') {
            tree.stage = 'blooming';
          }
        }

        // Draw all tree trunk and branch segments
        for (let i = 0; i < tree.segments.length; i++) {
          const seg = tree.segments[i];
          ctx.beginPath();
          ctx.strokeStyle = seg.color;
          ctx.lineWidth = seg.width;
          ctx.lineCap = 'round';
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.stroke();
        }

        // Stage 3 & 4: Leaves unfolding and breathing
        for (const leaf of tree.leaves) {
          if (leaf.currentSize < leaf.targetSize) {
            leaf.currentSize += (leaf.targetSize - leaf.currentSize) * 0.08;
          }

          const breathe = 1 + Math.sin(time * 0.03 + leaf.pulsePhase) * 0.18;
          const curR = leaf.currentSize * breathe;

          // Glowing botanical leaf bud
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.angle);

          // Soft ambient glow around foliage
          ctx.fillStyle = leaf.color === '#2FA87A' ? 'rgba(47, 168, 122, 0.45)' : 'rgba(209, 178, 128, 0.45)';
          ctx.beginPath();
          ctx.ellipse(0, 0, curR * 1.6, curR * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Solid leaf bud core
          ctx.fillStyle = leaf.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, curR, curR * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Occasionally shed a floating spore / seed from mature canopy
          if (tree.stage === 'blooming' && Math.random() < 0.008) {
            ambientSpores.push(createSpore(leaf.x + (Math.random() - 0.5) * 10, leaf.y, false));
          }
        }

        // Trigger maturation then graceful dissolution
        if (tree.stage === 'blooming' && tree.leaves.length > 15) {
          if (tree.age > 900) {
            tree.stage = 'fading';
          }
        }

        ctx.restore();
      }

      // 2. Render & Update Floating Spores / Rising Seeds
      for (let i = 0; i < ambientSpores.length; i++) {
        const sp = ambientSpores[i];
        sp.life++;

        // Upward drift with gentle sinusoidal horizontal sway
        sp.y += sp.vy;
        sp.x += sp.vx + Math.sin(time * sp.swayFreq + sp.seed) * sp.swayAmp;

        // Smooth fade-in then fade-out over life
        const progress = sp.life / sp.maxLife;
        if (progress < 0.2) {
          sp.alpha = (progress / 0.2) * sp.maxAlpha;
        } else if (progress > 0.8) {
          sp.alpha = ((1 - progress) / 0.2) * sp.maxAlpha;
        } else {
          sp.alpha = sp.maxAlpha;
        }

        // Reset when dead or floated past top
        if (sp.life >= sp.maxLife || sp.y < -30) {
          ambientSpores[i] = createSpore();
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.alpha);

        // Soft halo
        const sporeGrad = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 3);
        sporeGrad.addColorStop(0, sp.color);
        sporeGrad.addColorStop(0.5, sp.color === '#2FA87A' ? 'rgba(47, 168, 122, 0.4)' : 'rgba(209, 178, 128, 0.4)');
        sporeGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = sporeGrad;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Seed nucleus
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}

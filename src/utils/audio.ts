// Shared singleton Web Audio synthesizer for polite Architectural Noir hover chimes.
// Prevents AudioContext leaks, respects global mute state, and gracefully handles browser autoplay policies.

let sharedAudioCtx: AudioContext | null = null;
let lastPlayedAt = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {
        // Ignore until user has interacted with the page
      });
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export type ChimePreset =
  | 'soft'
  | 'gold'
  | 'mint'
  | 'credential'
  | 'starter'
  | 'growth'
  | 'buyout'
  | 'toggle';

export function playHoverChime(preset: ChimePreset = 'soft', enabled = true): void {
  if (!enabled) return;

  const nowMs = performance.now();
  // Rate-limit rapid hover sweeps to keep audio refined and never noisy
  if (preset !== 'toggle' && nowMs - lastPlayedAt < 110) return;
  lastPlayedAt = nowMs;

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.connect(ctx.destination);

    switch (preset) {
      case 'toggle': {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.018, now + 0.004);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 0.095);
        break;
      }

      case 'gold':
      case 'growth': {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.012, now + 0.006);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(659.25, now); // E5 warm fifth
        osc1.connect(master);
        osc2.connect(master);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.38);
        osc2.stop(now + 0.38);
        break;
      }

      case 'mint':
      case 'credential': {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.012, now + 0.006);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(783.99, now); // G5
        osc1.connect(master);
        osc2.connect(master);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.35);
        osc2.stop(now + 0.35);
        break;
      }

      case 'starter': {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.011, now + 0.006);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392.0, now); // G4
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'buyout': {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.012, now + 0.006);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 0.36);
        break;
      }

      case 'soft':
      default: {
        master.gain.setValueAtTime(0, now);
        master.gain.linearRampToValueAtTime(0.009, now + 0.005);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.connect(master);
        osc.start(now);
        osc.stop(now + 0.24);
        break;
      }
    }
  } catch {
    // Gracefully ignore audio errors
  }
}

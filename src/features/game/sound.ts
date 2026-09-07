/**
 * Tiny synthesized feedback so the game has the "click" of a real game without
 * shipping any audio asset. Everything degrades silently when the browser has
 * no Web Audio support or the student muted the game.
 */

type Cue = 'correct' | 'wrong' | 'complete' | 'tap' | 'heart';

let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) {
    try {
      context = new Ctor();
    } catch {
      return null;
    }
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, gain: number, type: OscillatorType = 'sine') {
  const oscillator = ctx.createOscillator();
  const envelope = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
  envelope.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  envelope.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + start + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
  oscillator.connect(envelope);
  envelope.connect(ctx.destination);
  oscillator.start(ctx.currentTime + start);
  oscillator.stop(ctx.currentTime + start + duration + 0.02);
}

const CUES: Record<Cue, (ctx: AudioContext) => void> = {
  correct: ctx => {
    tone(ctx, 660, 0, 0.12, 0.16);
    tone(ctx, 990, 0.09, 0.18, 0.14);
  },
  wrong: ctx => {
    tone(ctx, 190, 0, 0.2, 0.14, 'square');
    tone(ctx, 140, 0.1, 0.22, 0.1, 'square');
  },
  complete: ctx => {
    tone(ctx, 523, 0, 0.16, 0.15);
    tone(ctx, 659, 0.12, 0.16, 0.15);
    tone(ctx, 784, 0.24, 0.16, 0.15);
    tone(ctx, 1047, 0.36, 0.32, 0.16);
  },
  tap: ctx => tone(ctx, 420, 0, 0.05, 0.07, 'triangle'),
  heart: ctx => {
    tone(ctx, 320, 0, 0.14, 0.12, 'triangle');
    tone(ctx, 240, 0.1, 0.16, 0.1, 'triangle');
  },
};

export function playCue(cue: Cue, enabled: boolean): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  try {
    CUES[cue](ctx);
  } catch {
    /* áudio bloqueado pelo navegador: o jogo segue sem som */
  }
}

const VIBRATION: Partial<Record<Cue, number | number[]>> = {
  correct: 14,
  wrong: [24, 40, 24],
  complete: [16, 60, 16, 60, 24],
};

export function haptic(cue: Cue): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  const pattern = VIBRATION[cue];
  if (!pattern) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* vibração indisponível */
  }
}

export function feedback(cue: Cue, enabled: boolean): void {
  playCue(cue, enabled);
  haptic(cue);
}

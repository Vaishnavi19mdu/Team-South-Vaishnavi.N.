/**
 * Generates a two-tone emergency siren purely with the Web Audio API —
 * no .mp3/.wav asset required. Also triggers device vibration where supported.
 *
 * playSosSiren() auto-stops after `durationMs` (default 8s) so it can't run
 * forever if nobody dismisses it, but stopSosSiren() can be called earlier by
 * ANY component (resident, warden, or security) to silence it immediately —
 * each browser tab plays its own local siren, so "who can stop it" is really
 * "who can call stopSosSiren() in their own tab", which every dashboard can.
 *
 * Usage:
 *   import { playSosSiren, stopSosSiren, onSosSirenChange } from '../utils/sosSiren';
 *   playSosSiren();       // plays for the default 8 seconds, or:
 *   playSosSiren(8000);   // explicit duration in ms
 *   stopSosSiren();       // stop early, from any component
 *   onSosSirenChange(cb); // subscribe to know when it starts/stops (for UI)
 */

let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sweepInterval: number | null = null;
let autoStopTimeout: number | null = null;

type SirenListener = (playing: boolean) => void;
let listeners: SirenListener[] = [];

function notify(playing: boolean): void {
  listeners.forEach((listener) => listener(playing));
}

/** Subscribe to siren start/stop events. Returns an unsubscribe function. */
export function onSosSirenChange(listener: SirenListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function isSosSirenPlaying(): boolean {
  return oscillator !== null;
}

/**
 * Starts the siren. Auto-stops after `durationMs` (default 8000ms) unless
 * stopSosSiren() is called first.
 */
export function playSosSiren(durationMs: number = 8000): void {
  stopSosSiren(); // clean up any previous instance first

  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return; // unsupported browser — fail silently

  audioCtx = new AudioContextClass();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  gainNode.gain.value = 0.25; // audible but not painful — tune to taste

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();

  // Sweep the frequency up and down between 600Hz–1100Hz to mimic a siren
  let freq = 600;
  let rising = true;
  sweepInterval = window.setInterval(() => {
    if (!oscillator || !audioCtx) return;
    freq += rising ? 40 : -40;
    if (freq >= 1100) rising = false;
    if (freq <= 600) rising = true;
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  }, 30);

  if ('vibrate' in navigator) {
    navigator.vibrate([300, 100, 300, 100, 300]);
  }

  notify(true);

  if (durationMs > 0) {
    autoStopTimeout = window.setTimeout(() => {
      stopSosSiren();
    }, durationMs);
  }
}

export function stopSosSiren(): void {
  const wasPlaying = oscillator !== null;

  if (autoStopTimeout !== null) {
    clearTimeout(autoStopTimeout);
    autoStopTimeout = null;
  }
  if (sweepInterval !== null) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
    } catch {
      // already stopped — ignore
    }
    oscillator.disconnect();
    oscillator = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
  if ('vibrate' in navigator) {
    navigator.vibrate(0);
  }

  if (wasPlaying) {
    notify(false);
  }
}
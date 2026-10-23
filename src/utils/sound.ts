/**
 * Audio synthesis helper using Web Audio API for milestone feedback
 * Zero external mp3 dependencies, completely hermetic and reliable.
 */

class SoundEffectsManager {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playCelebrationChime(targetPercent: number) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Frequency chords based on achievement level
      let freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 (25%)
      if (targetPercent >= 50 && targetPercent < 75) {
        freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      } else if (targetPercent >= 75 && targetPercent < 100) {
        freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
      } else if (targetPercent >= 100) {
        freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // Grand fanfare
      }

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = targetPercent >= 100 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0, now + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.95);
      });
    } catch {
      // Audio playback fails gracefully if blocked by browser policy
    }
  }

  public playClickTick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundEffectsManager();

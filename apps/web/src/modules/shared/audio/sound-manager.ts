import { SOUND_DEFINITIONS, type NoiseSoundDefinition, type SoundDefinition, type SoundId } from "./sound-definitions";

type WindowWithWebkitAudio = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

type PlaySoundOptions = {
  throttleMs?: number;
  volumeScale?: number;
};

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lastPlayedAt = new Map<string, number>();
  private unlockArmed = false;
  private muted = false;
  private masterVolume = 1;
  private unlockHandler?: () => void;

  public readonly play = async (soundId: SoundId, options?: PlaySoundOptions): Promise<boolean> => {
    const definition = SOUND_DEFINITIONS[soundId];
    if (!definition || this.muted) {
      return false;
    }

    if (this.isThrottled(soundId, definition, options)) {
      return false;
    }

    const audioContext = await this.ensureAudioContext();
    const masterGain = this.masterGain;
    if (!audioContext || !masterGain || audioContext.state !== "running") {
      return false;
    }

    if (definition.kind === "synth") {
      this.playSynth(audioContext, masterGain, definition, options);
    } else if (definition.kind === "noise") {
      this.playNoise(audioContext, masterGain, definition, options);
    }

    this.lastPlayedAt.set(soundId, performance.now());
    return true;
  };

  public readonly unlock = async (): Promise<boolean> => {
    const audioContext = await this.ensureAudioContext();
    if (!audioContext) {
      return false;
    }

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch {
        return false;
      }
    }

    return audioContext.state === "running";
  };

  public readonly armUnlockOnFirstInteraction = () => {
    if (typeof window === "undefined" || this.unlockArmed) {
      return;
    }

    const onFirstInteraction = () => {
      void this.unlock().finally(() => {
        this.disarmUnlockOnFirstInteraction();
      });
    };

    this.unlockHandler = onFirstInteraction;
    this.unlockArmed = true;
    window.addEventListener("pointerdown", onFirstInteraction, { once: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
  };

  public readonly disarmUnlockOnFirstInteraction = () => {
    if (typeof window === "undefined" || !this.unlockHandler) {
      this.unlockArmed = false;
      this.unlockHandler = undefined;
      return;
    }

    window.removeEventListener("pointerdown", this.unlockHandler);
    window.removeEventListener("keydown", this.unlockHandler);
    this.unlockArmed = false;
    this.unlockHandler = undefined;
  };

  public readonly setMuted = (muted: boolean) => {
    this.muted = muted;
    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      const target = muted ? 0.0001 : Math.max(0.0001, this.masterVolume);
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(target, now, 0.01);
    }
  };

  public readonly setMasterVolume = (volume: number) => {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.audioContext && !this.muted) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(Math.max(0.0001, this.masterVolume), now, 0.01);
    }
  };

  private isThrottled(soundId: SoundId, definition: SoundDefinition, options?: PlaySoundOptions) {
    const minIntervalMs = Math.max(0, options?.throttleMs ?? definition.minIntervalMs ?? 0);
    if (minIntervalMs <= 0) return false;

    const lastAt = this.lastPlayedAt.get(soundId) ?? 0;
    return performance.now() - lastAt < minIntervalMs;
  }

  private async ensureAudioContext(): Promise<AudioContext | null> {
    if (typeof window === "undefined") {
      return null;
    }

    if (this.audioContext && this.masterGain) {
      if (this.audioContext.state === "suspended") {
        try {
          await this.audioContext.resume();
        } catch {
          return this.audioContext;
        }
      }
      return this.audioContext;
    }

    const windowAudio = window as WindowWithWebkitAudio;
    const AudioCtx = windowAudio.AudioContext ?? windowAudio.webkitAudioContext;
    if (!AudioCtx) {
      return null;
    }

    try {
      const audioContext = new AudioCtx();
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(this.muted ? 0.0001 : Math.max(0.0001, this.masterVolume), audioContext.currentTime);
      masterGain.connect(audioContext.destination);

      this.audioContext = audioContext;
      this.masterGain = masterGain;

      if (audioContext.state === "suspended") {
        try {
          await audioContext.resume();
        } catch {
          return audioContext;
        }
      }

      return audioContext;
    } catch {
      return null;
    }
  }

  private playSynth(
    audioContext: AudioContext,
    masterGain: GainNode,
    definition: Extract<SoundDefinition, { kind: "synth" }>,
    options?: PlaySoundOptions,
  ) {
    const now = audioContext.currentTime;
    const gainNode = audioContext.createGain();
    gainNode.connect(masterGain);

    const baseVolume = Math.max(0.0001, (definition.volume ?? 0.12) * (options?.volumeScale ?? 1));
    const attack = Math.max(0.001, (definition.attackMs ?? 12) / 1000);
    const release = Math.max(0.001, (definition.releaseMs ?? 80) / 1000);

    const endAt = definition.tones.reduce((max, tone) => {
      const startAt = now + (tone.atMs ?? 0) / 1000;
      const toneDuration = Math.max(0.005, tone.durationMs / 1000);
      const oscillator = audioContext.createOscillator();
      const oscillatorGain = audioContext.createGain();
      const frequencyJitter = definition.frequencyJitterRatio
        ? 1 + (Math.random() * 2 - 1) * definition.frequencyJitterRatio
        : 1;

      oscillator.type = tone.type ?? "sine";
      oscillator.frequency.setValueAtTime(Math.max(1, tone.frequency * frequencyJitter), startAt);
      oscillatorGain.gain.setValueAtTime(Math.max(0, tone.gain ?? 1), startAt);
      oscillator.connect(oscillatorGain);
      oscillatorGain.connect(gainNode);
      oscillator.start(startAt);
      oscillator.stop(startAt + toneDuration);

      return Math.max(max, startAt + toneDuration);
    }, now);

    const volumeJitter = definition.volumeJitterRatio ? 1 + (Math.random() * 2 - 1) * definition.volumeJitterRatio : 1;
    const peak = Math.max(0.0001, baseVolume * volumeJitter);
    const fadeEnd = endAt + release;

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(peak, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, fadeEnd);

    window.setTimeout(() => {
      gainNode.disconnect();
    }, Math.ceil((fadeEnd - now) * 1000) + 50);
  }

  private playNoise(
    audioContext: AudioContext,
    masterGain: GainNode,
    definition: NoiseSoundDefinition,
    options?: PlaySoundOptions,
  ) {
    const now = audioContext.currentTime;
    const duration = Math.max(0.01, definition.durationMs / 1000);
    const attack = Math.max(0.001, (definition.attackMs ?? 2) / 1000);
    const release = Math.max(0.001, (definition.releaseMs ?? 50) / 1000);
    const endAt = now + duration;
    const fadeEnd = endAt + release;

    const baseVolume = Math.max(0.0001, (definition.volume ?? 0.08) * (options?.volumeScale ?? 1));
    const volumeJitter = definition.volumeJitterRatio ? 1 + (Math.random() * 2 - 1) * definition.volumeJitterRatio : 1;
    const peak = Math.max(0.0001, baseVolume * volumeJitter);

    const sampleRate = audioContext.sampleRate;
    const frameCount = Math.max(1, Math.floor(sampleRate * duration));
    const buffer = audioContext.createBuffer(1, frameCount, sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      channel[i] = Math.random() * 2 - 1;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const playbackRateJitter = definition.playbackRateJitterRatio
      ? 1 + (Math.random() * 2 - 1) * definition.playbackRateJitterRatio
      : 1;
    source.playbackRate.setValueAtTime(Math.max(0.1, (definition.playbackRate ?? 1) * playbackRateJitter), now);

    const filter = audioContext.createBiquadFilter();
    filter.type = definition.filterType ?? "lowpass";
    const filterFrequencyJitter = definition.filterFrequencyJitterRatio
      ? 1 + (Math.random() * 2 - 1) * definition.filterFrequencyJitterRatio
      : 1;
    filter.frequency.setValueAtTime(
      Math.max(40, (definition.filterFrequency ?? 600) * filterFrequencyJitter),
      now,
    );
    filter.Q.setValueAtTime(definition.filterQ ?? 0.7, now);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(peak, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, fadeEnd);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    source.start(now);
    source.stop(endAt);

    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    };

    window.setTimeout(() => {
      source.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    }, Math.ceil((fadeEnd - now) * 1000) + 50);
  }
}

let soundManagerSingleton: SoundManager | null = null;

export function getSoundManager() {
  if (!soundManagerSingleton) {
    soundManagerSingleton = new SoundManager();
  }
  return soundManagerSingleton;
}

export type { PlaySoundOptions };

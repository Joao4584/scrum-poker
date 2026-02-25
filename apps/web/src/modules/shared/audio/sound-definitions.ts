export type SoundId = "join-room" | "footstep" | "ui-beep" | "ui-click";

export type SynthTone = {
  atMs?: number;
  durationMs: number;
  frequency: number;
  type?: OscillatorType;
  gain?: number;
};

export type SynthSoundDefinition = {
  kind: "synth";
  tones: SynthTone[];
  volume?: number;
  attackMs?: number;
  releaseMs?: number;
  minIntervalMs?: number;
  frequencyJitterRatio?: number;
  volumeJitterRatio?: number;
};

export type NoiseSoundDefinition = {
  kind: "noise";
  volume?: number;
  durationMs: number;
  attackMs?: number;
  releaseMs?: number;
  minIntervalMs?: number;
  volumeJitterRatio?: number;
  filterType?: BiquadFilterType;
  filterFrequency?: number;
  filterQ?: number;
  filterFrequencyJitterRatio?: number;
  playbackRate?: number;
  playbackRateJitterRatio?: number;
};

export type SoundDefinition = SynthSoundDefinition | NoiseSoundDefinition;

export const SOUND_DEFINITIONS: Record<SoundId, SoundDefinition> = {
  "join-room": {
    kind: "synth",
    volume: 0.2,
    attackMs: 24,
    releaseMs: 120,
    tones: [
      { atMs: 0, durationMs: 120, frequency: 740, type: "triangle" },
      { atMs: 150, durationMs: 120, frequency: 988, type: "triangle" },
      { atMs: 300, durationMs: 120, frequency: 1318, type: "triangle" },
    ],
  },
  footstep: {
    kind: "noise",
    volume: 0.07,
    durationMs: 44,
    attackMs: 1,
    releaseMs: 45,
    minIntervalMs: 120,
    volumeJitterRatio: 0.15,
    filterType: "lowpass",
    filterFrequency: 520,
    filterQ: 0.8,
    filterFrequencyJitterRatio: 0.25,
    playbackRate: 0.9,
    playbackRateJitterRatio: 0.1,
  },
  "ui-beep": {
    kind: "synth",
    volume: 0.12,
    attackMs: 10,
    releaseMs: 80,
    tones: [{ durationMs: 140, frequency: 820, type: "sine" }],
  },
  "ui-click": {
    kind: "synth",
    volume: 0.08,
    attackMs: 2,
    releaseMs: 40,
    minIntervalMs: 40,
    tones: [
      { atMs: 0, durationMs: 16, frequency: 560, type: "square", gain: 0.6 },
      { atMs: 4, durationMs: 26, frequency: 320, type: "triangle", gain: 1 },
    ],
  },
};

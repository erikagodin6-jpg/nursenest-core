import { getEcgRhythmTemplate, type EcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";

export type EcgStripMediaType = "ecg_live_strip";

export type EcgStripMediaConfig = {
  mediaType?: EcgStripMediaType;
  rhythmKey: string;
  rate: number;
  regularity: EcgRhythmTemplate["rhythmRegularity"];
  pWavePattern: EcgRhythmTemplate["pWavePresence"];
  prIntervalPattern: EcgRhythmTemplate["prIntervalPattern"];
  qrsWidth: number;
  qtBehavior?: EcgRhythmTemplate["qtBehavior"];
  artifactLevel?: number;
  difficulty: EcgRhythmTemplate["difficulty"];
  pathwayTierScope: string[];
  paperSpeed?: number;
  amplitude?: number;
  manualReviewed?: boolean;
  manuallyReviewedAt?: string;
  features?: {
    hasOrganizedQrs?: boolean;
    hasRecurringQrs?: boolean;
    avDissociation?: boolean;
    progressivePr?: boolean;
    polymorphicTwisting?: boolean;
    peakedT?: boolean;
    widenedQrs?: boolean;
    stElevation?: boolean;
    pacerSpikes?: boolean;
  };
};

export type EcgWaveformConfig = EcgStripMediaConfig;

export type EcgPoint = { x: number; y: number };

export type EcgWaveformOptions = {
  width?: number;
  height?: number;
  seconds?: number;
  sampleRate?: number;
};

export type EcgWaveformResult = {
  points: EcgPoint[];
  viewBox: string;
  path: string;
  grid: { minor: number; major: number };
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pseudoNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pulse(t: number, center: number, width: number, amplitude: number): number {
  const z = (t - center) / Math.max(width, 0.0001);
  return amplitude * Math.exp(-z * z);
}

function beatOffsets(config: EcgStripMediaConfig, seconds: number): number[] {
  if (config.rhythmKey === "asystole" || config.rhythmKey === "ventricular_fibrillation") return [];
  const rate = clamp(config.rate || 60, 20, 260);
  const base = 60 / rate;
  const out: number[] = [];
  let t = 0.35;
  let i = 0;
  while (t < seconds + 0.5) {
    const irregular =
      config.regularity === "irregular" ? (pseudoNoise(i + rate) - 0.5) * base * 0.55 :
      config.regularity === "regularly_irregular" && i % 4 === 3 ? base * 0.75 :
      0;
    t += Math.max(0.22, base + irregular);
    out.push(t);
    i += 1;
  }
  return out;
}

function baselineForRhythm(config: EcgStripMediaConfig, t: number): number {
  if (config.rhythmKey === "ventricular_fibrillation") {
    return 0.48 * Math.sin(t * 34) + 0.26 * Math.sin(t * 71) + 0.18 * Math.sin(t * 119);
  }
  if (config.rhythmKey === "asystole") {
    return 0.02 * Math.sin(t * 7);
  }
  if (config.rhythmKey === "atrial_flutter") {
    return 0.11 * Math.asin(Math.sin(t * Math.PI * 10)) / (Math.PI / 2);
  }
  return 0;
}

function beatContribution(config: EcgStripMediaConfig, t: number, beat: number, beatIndex: number): number {
  const dt = t - beat;
  const qrsWidth = clamp(config.qrsWidth || 0.08, 0.04, 0.24);
  let y = 0;

  if (config.pWavePattern === "present" || config.pWavePattern === "paced") {
    y += pulse(dt, -0.18, 0.035, 0.12);
  }
  if (config.pWavePattern === "paced" || config.features?.pacerSpikes) {
    y += pulse(dt, -0.035, 0.004, 0.95);
  }

  const dropBeat = config.prIntervalPattern === "progressive_prolongation" && beatIndex % 4 === 3;
  if (!dropBeat) {
    const wide = qrsWidth > 0.12;
    const qrsAmp = wide ? 1.0 : 0.85;
    y += pulse(dt, -qrsWidth * 0.28, qrsWidth * 0.18, -0.28);
    y += pulse(dt, 0, qrsWidth * 0.12, qrsAmp);
    y += pulse(dt, qrsWidth * 0.32, qrsWidth * 0.2, -0.36);
    const tAmp = config.features?.peakedT ? 0.54 : config.rhythmKey === "hypokalemia_pattern" ? 0.08 : 0.24;
    const tWidth = config.features?.peakedT ? 0.05 : 0.095;
    y += pulse(dt, 0.28, tWidth, tAmp);
    if (config.rhythmKey === "hypokalemia_pattern") y += pulse(dt, 0.46, 0.05, 0.18);
    if (config.features?.stElevation) y += dt > 0.05 && dt < 0.23 ? 0.12 : 0;
  }

  if (config.rhythmKey === "torsades_de_pointes") {
    const twist = Math.sin(beatIndex * 0.9);
    y += pulse(dt, 0, 0.055, 1.15 * twist) + pulse(dt, 0.08, 0.07, -0.8 * twist);
  }

  return y;
}

export function generateEcgWaveform(config: EcgStripMediaConfig, options: EcgWaveformOptions = {}): EcgWaveformResult {
  const width = options.width ?? 720;
  const height = options.height ?? 220;
  const seconds = options.seconds ?? 6;
  const sampleRate = options.sampleRate ?? 120;
  const artifact = clamp(config.artifactLevel ?? 0.02, 0, 0.18);
  const amplitude = config.amplitude ?? 44;
  const beats = beatOffsets(config, seconds);
  const points: EcgPoint[] = [];
  const total = Math.max(2, Math.floor(seconds * sampleRate));

  for (let i = 0; i <= total; i += 1) {
    const t = (i / total) * seconds;
    let signal = baselineForRhythm(config, t);
    beats.forEach((beat, beatIndex) => {
      signal += beatContribution(config, t, beat, beatIndex);
    });
    signal += (pseudoNoise(i + config.rate) - 0.5) * artifact;
    points.push({ x: (t / seconds) * width, y: height / 2 - signal * amplitude });
  }

  return {
    points,
    viewBox: `0 0 ${width} ${height}`,
    path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "),
    grid: { minor: 8, major: 40 },
  };
}

export function generateEcgWaveformPoints(config: EcgStripMediaConfig, options: EcgWaveformOptions = {}): EcgWaveformResult & { width: number; height: number } {
  const result = generateEcgWaveform(config, options);
  return { ...result, width: options.width ?? 720, height: options.height ?? 220 };
}

export function defaultEcgStripConfigForRhythm(rhythmKey: string): EcgStripMediaConfig {
  const template = getEcgRhythmTemplate(rhythmKey);
  if (!template) throw new Error(`Unknown ECG rhythm template: ${rhythmKey}`);
  const rate = template.expectedRateRange[0] === 0 && template.expectedRateRange[1] === 0
    ? 0
    : Math.round((template.expectedRateRange[0] + template.expectedRateRange[1]) / 2);
  return {
    mediaType: "ecg_live_strip",
    rhythmKey,
    rate,
    regularity: template.rhythmRegularity,
    pWavePattern: template.pWavePresence,
    prIntervalPattern: template.prIntervalPattern,
    qrsWidth: Number(((template.qrsWidthRange[0] + template.qrsWidthRange[1]) / 2).toFixed(2)),
    qtBehavior: template.qtBehavior,
    artifactLevel: 0.02,
    difficulty: template.difficulty,
    pathwayTierScope: template.applicableTiers,
    features: {
      hasOrganizedQrs: !["ventricular_fibrillation", "asystole"].includes(rhythmKey),
      hasRecurringQrs: !["ventricular_fibrillation", "asystole"].includes(rhythmKey),
      avDissociation: template.prIntervalPattern === "av_dissociation",
      progressivePr: template.prIntervalPattern === "progressive_prolongation",
      polymorphicTwisting: rhythmKey === "torsades_de_pointes",
      peakedT: rhythmKey === "hyperkalemia_pattern",
      widenedQrs: template.qrsWidthRange[1] > 0.12,
      stElevation: rhythmKey === "stemi_pattern",
      pacerSpikes: rhythmKey === "paced_rhythm",
    },
  };
}

"use client";

const PREFIX = "nn-ecg-telemetry-competency:";

export type EcgTelemetryCompetency = {
  lessonsReviewed: string[];
  measurementAttempts: number;
  measurementCorrect: number;
  drillsCompleted: number;
  confidenceSum: number;
  confidenceCount: number;
};

function empty(): EcgTelemetryCompetency {
  return {
    lessonsReviewed: [],
    measurementAttempts: 0,
    measurementCorrect: 0,
    drillsCompleted: 0,
    confidenceSum: 0,
    confidenceCount: 0,
  };
}

function key(scope: string) {
  return `${PREFIX}${scope}`;
}

export function readEcgTelemetryCompetency(scope = "core"): EcgTelemetryCompetency {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(key(scope));
    if (!raw) return empty();
    return { ...empty(), ...(JSON.parse(raw) as Partial<EcgTelemetryCompetency>) };
  } catch {
    return empty();
  }
}

export function writeEcgTelemetryCompetency(scope: string, data: EcgTelemetryCompetency) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(scope), JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function telemetryReadinessPct(c: EcgTelemetryCompetency): number {
  const parts: number[] = [];
  if (c.lessonsReviewed.length) parts.push(Math.min(40, c.lessonsReviewed.length * 4));
  if (c.measurementAttempts > 0) {
    parts.push((c.measurementCorrect / c.measurementAttempts) * 35);
  }
  if (c.drillsCompleted) parts.push(Math.min(15, c.drillsCompleted * 3));
  if (c.confidenceCount > 0) {
    parts.push((c.confidenceSum / c.confidenceCount / 5) * 10);
  }
  return Math.min(100, Math.round(parts.reduce((a, b) => a + b, 0)));
}

"use client";

const STORAGE_PREFIX = "nn-clinical-skills-competency:";

export type ClinicalSkillLessonCompetency = {
  completedStepIndices: number[];
  sequencingPassed: boolean;
  errorSpottingPassed: boolean;
  reviewedFlashcardIds: string[];
  retentionScore: number | null;
  retentionTotal: number | null;
  checkpointScore: number | null;
  checkpointTotal: number | null;
  confidenceRating: number | null;
};

function empty(): ClinicalSkillLessonCompetency {
  return {
    completedStepIndices: [],
    sequencingPassed: false,
    errorSpottingPassed: false,
    reviewedFlashcardIds: [],
    retentionScore: null,
    retentionTotal: null,
    checkpointScore: null,
    checkpointTotal: null,
    confidenceRating: null,
  };
}

function key(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

export function readClinicalSkillCompetency(slug: string): ClinicalSkillLessonCompetency {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(key(slug));
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<ClinicalSkillLessonCompetency>;
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

export function writeClinicalSkillCompetency(slug: string, data: ClinicalSkillLessonCompetency) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key(slug), JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function computeSimulationReadinessPct(
  competency: ClinicalSkillLessonCompetency,
  stepCount: number,
  flashcardCount: number,
): number {
  const parts: number[] = [];
  if (stepCount > 0) {
    parts.push((competency.completedStepIndices.length / stepCount) * 28);
  }
  if (competency.sequencingPassed) parts.push(18);
  if (competency.errorSpottingPassed) parts.push(14);
  if (flashcardCount > 0) {
    parts.push((competency.reviewedFlashcardIds.length / flashcardCount) * 18);
  }
  if (competency.retentionTotal && competency.retentionScore !== null) {
    parts.push((competency.retentionScore / competency.retentionTotal) * 12);
  }
  if (competency.checkpointTotal && competency.checkpointScore !== null) {
    parts.push((competency.checkpointScore / competency.checkpointTotal) * 10);
  }
  return Math.min(100, Math.round(parts.reduce((a, b) => a + b, 0)));
}

export function memoryStrengthLabel(pct: number): string {
  if (pct >= 85) return "Strong retention";
  if (pct >= 60) return "Building memory";
  if (pct >= 35) return "Needs rehearsal";
  return "Early practice";
}

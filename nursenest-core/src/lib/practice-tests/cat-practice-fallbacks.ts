/**
 * Shared CAT UI fallbacks — presentation only; does not change scoring or selection.
 */
import type { CatExamFeedbackMode, CatStudyFeedbackLayers, CatStudyFeedbackPayload } from "@/lib/practice-tests/types";
import {
  buildFallbackCatResultsCoachSnapshot,
  type CatResultsCoachSnapshot,
} from "@/lib/practice-tests/cat-results-coach";

export const DEFAULT_CAT_FEEDBACK_MODE: CatExamFeedbackMode = "test";

export const EMPTY_CAT_DIFFICULTY_SERIES: number[] = [];

export const SAFE_EMPTY_LESSON_LINKS: CatStudyFeedbackLayers["relatedLessons"] = [];

const COACH_STRING_FIELDS: (keyof CatResultsCoachSnapshot)[] = [
  "readinessHeadline",
  "readinessNarrative",
  "passOutlookDisclaimer",
  "confidenceSummary",
  "stabilityInterpretation",
  "passingBandCopy",
  "multiSessionGuidance",
];

const COACH_ARRAY_FIELDS: (keyof CatResultsCoachSnapshot)[] = [
  "strongestDomains",
  "weakestDomains",
  "specificStudyActions",
  "difficultySeries",
  "weaknessInsights",
  "studyNext",
];

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/**
 * Merge a partial persisted coach (or unknown JSON) into a complete snapshot for UI.
 * Sets `confidenceOmitted` when legacy payloads lack a real confidence level.
 */
export function normalizeCatResultsCoachSnapshot(raw: unknown): CatResultsCoachSnapshot {
  const base = buildFallbackCatResultsCoachSnapshot();
  if (!isRecord(raw)) {
    return { ...base, confidenceOmitted: true, passOutlookOmitted: true };
  }

  const hadConfidenceLevel =
    raw.confidenceLevel === "low" || raw.confidenceLevel === "medium" || raw.confidenceLevel === "high";
  const hadPassOutlook =
    "passOutlookPercent" in raw &&
    typeof raw.passOutlookPercent === "number" &&
    Number.isFinite(raw.passOutlookPercent);

  const merged: CatResultsCoachSnapshot = {
    ...base,
    generatedAt: typeof raw.generatedAt === "string" && raw.generatedAt.length > 4 ? raw.generatedAt : base.generatedAt,
    confidenceOmitted: !hadConfidenceLevel,
    passOutlookOmitted: !hadPassOutlook,
    passOutlookPercent:
      typeof raw.passOutlookPercent === "number" && Number.isFinite(raw.passOutlookPercent)
        ? Math.max(0, Math.min(100, raw.passOutlookPercent))
        : base.passOutlookPercent,
    confidenceLevel:
      hadConfidenceLevel ? (raw.confidenceLevel as CatResultsCoachSnapshot["confidenceLevel"]) : base.confidenceLevel,
    keyRiskFactor:
      typeof raw.keyRiskFactor === "string"
        ? raw.keyRiskFactor
        : raw.keyRiskFactor === null
          ? null
          : base.keyRiskFactor,
  };

  for (const k of COACH_STRING_FIELDS) {
    const v = raw[k as string];
    if (typeof v === "string" && v.trim().length > 0) {
      (merged as Record<string, unknown>)[k] = v;
    }
  }

  for (const k of COACH_ARRAY_FIELDS) {
    const v = raw[k as string];
    if (Array.isArray(v)) {
      (merged as Record<string, unknown>)[k] = v;
    }
  }

  if (Array.isArray(raw.errorPatterns)) {
    merged.errorPatterns = raw.errorPatterns
      .filter((p): p is { code: string; title: string; detail: string } =>
        isRecord(p) &&
        typeof p.code === "string" &&
        typeof p.title === "string" &&
        typeof p.detail === "string",
      )
      .map((p) => ({ code: p.code, title: p.title, detail: p.detail }));
  }

  if (typeof raw.examPassingStandardLine === "string" && raw.examPassingStandardLine.trim()) {
    merged.examPassingStandardLine = raw.examPassingStandardLine.trim();
  }

  if (
    raw.passingBandRelative === "above" ||
    raw.passingBandRelative === "below" ||
    raw.passingBandRelative === "uncertain"
  ) {
    merged.passingBandRelative = raw.passingBandRelative;
  }

  if (
    raw.difficultyTrendLabel === "rising" ||
    raw.difficultyTrendLabel === "falling" ||
    raw.difficultyTrendLabel === "mixed" ||
    raw.difficultyTrendLabel === "flat"
  ) {
    merged.difficultyTrendLabel = raw.difficultyTrendLabel;
  }

  if (
    raw.stabilityTrendLabel === "improving" ||
    raw.stabilityTrendLabel === "cooling" ||
    raw.stabilityTrendLabel === "steady" ||
    raw.stabilityTrendLabel === "insufficient"
  ) {
    merged.stabilityTrendLabel = raw.stabilityTrendLabel;
  }

  merged.studyNext = Array.isArray(merged.studyNext)
    ? merged.studyNext
        .filter((s) => isRecord(s) && typeof s.title === "string" && String(s.title).trim().length > 0)
        .map((s) => ({
          title: String(s.title).trim(),
          reason: typeof s.reason === "string" ? s.reason : "",
          links: Array.isArray(s.links)
            ? s.links
                .filter(
                  (l) =>
                    isRecord(l) &&
                    typeof l.href === "string" &&
                    typeof l.label === "string" &&
                    isSafeInternalStudyLinkHref(l.href),
                )
                .map((l) => ({
                  label: String(l.label),
                  href: String(l.href),
                  kind:
                    l.kind === "flashcards" || l.kind === "drill" || l.kind === "lesson" ? l.kind : ("lesson" as const),
                }))
            : [],
        }))
    : [];

  return merged;
}

/**
 * Minimal study-mode payload when full rationale build fails — keeps the runner unblocked.
 */
export function buildMinimalCatStudyFeedbackPayload(args: {
  questionId: string;
  isCorrect: boolean;
  correctKeys?: string[];
}): CatStudyFeedbackPayload {
  const correctKeys = Array.isArray(args.correctKeys) ? args.correctKeys.filter((x) => typeof x === "string") : [];
  const layers: CatStudyFeedbackLayers = {
    level1Short: args.isCorrect
      ? "Marked correct. Open your question bank or lessons for a deeper recap when you want more detail."
      : "Marked incorrect. Review the official rationale fields for this item in the full bank when you need depth — we could not load the expanded teaching layers for this screen.",
    level2Sections: [],
    level3Strategy:
      "Read the stem for what it is asking (first action, worst finding, priority) before comparing answer options.",
    relatedLessons: SAFE_EMPTY_LESSON_LINKS,
  };
  return {
    questionId: args.questionId,
    isCorrect: args.isCorrect,
    correctKeys,
    sections: [],
    topic: null,
    subtopic: null,
    layers,
  };
}

/** Internal marketing or app paths only — blocks opaque or external URLs in coach CTAs. */
export function isSafeInternalStudyLinkHref(href: string): boolean {
  const t = href.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return false;
  if (t.includes("://") || t.toLowerCase().includes("javascript:")) return false;
  return true;
}

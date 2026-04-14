/**
 * Pure scoring helpers for lesson completeness audit (no I/O).
 * Weights and thresholds align with pathway-lesson-premium structural gates.
 */
import { stripToPlainText, countWords } from "@/lib/content-quality/plain-text";
import { lessonCorpusForLinkCount, lessonUsesPremiumStructure } from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

export type LessonCompletenessStatus =
  | "production_ready"
  | "usable_but_thin"
  | "structurally_incomplete"
  | "content_incomplete"
  | "localization_incomplete"
  | "not_routable"
  | "duplicate_or_unclear_source";

export const SCORE_WEIGHTS = {
  structural: 0.45,
  educational: 0.35,
  links: 0.12,
  localization: 0.08,
} as const;

const PLACEHOLDER_RE =
  /\b(coming soon|to be determined|\btbd\b|lorem ipsum|placeholder text|under construction)\b/i;
const BRACKET_PLACEHOLDER = /\[(?:tbd|todo|fixme|draft)\]/i;

export function detectPlaceholderSignals(corpus: string): string[] {
  const out: string[] = [];
  if (PLACEHOLDER_RE.test(corpus)) out.push("placeholder_phrase");
  if (BRACKET_PLACEHOLDER.test(corpus)) out.push("bracket_placeholder");
  return out;
}

export function lessonTotalWords(lesson: PathwayLessonRecord): number {
  const parts = [
    ...(lesson.sections ?? []).map((s) => stripToPlainText(s.body ?? "")),
    lesson.seoDescription ?? "",
    lesson.title ?? "",
  ];
  return countWords(parts.join(" "));
}

function sectionWords(sec: PathwayLessonSection | undefined): number {
  if (!sec?.body) return 0;
  return countWords(stripToPlainText(sec.body));
}

/** Educational substance buckets (flexible headings; premium vs legacy). */
export function scoreEducationalSubstance(lesson: PathwayLessonRecord): {
  score: number;
  satisfied: string[];
  missing: string[];
} {
  const sections = lesson.sections ?? [];
  const byKind = new Map(sections.map((s) => [s.kind, s]));
  const premium = lessonUsesPremiumStructure(sections);

  const buckets: { id: string; ok: boolean }[] = [];

  if (premium) {
    const intro = byKind.get("introduction");
    const overview = byKind.get("pathophysiology_overview");
    const signs = byKind.get("signs_symptoms");
    buckets.push({
      id: "overview_or_intro",
      ok: sectionWords(intro) >= 80 || sectionWords(overview) >= 60 || sectionWords(signs) >= 60,
    });
    const nursing = byKind.get("nursing_assessment_interventions");
    const red = byKind.get("red_flags");
    buckets.push({
      id: "assessment_or_safety",
      ok: sectionWords(nursing) >= 100 || sectionWords(red) >= 60,
    });
    const pearls = byKind.get("clinical_pearls");
    const related = byKind.get("related_next_steps");
    const client = byKind.get("client_education");
    buckets.push({
      id: "application_or_education",
      ok: sectionWords(pearls) >= 60 || sectionWords(related) >= 30 || sectionWords(client) >= 60,
    });
    const take = byKind.get("tier_specific_relevance");
    buckets.push({
      id: "summary_or_next_steps",
      ok: sectionWords(related) >= 25 || sectionWords(take) >= 80,
    });
  } else {
    const cm = byKind.get("clinical_meaning");
    const er = byKind.get("exam_relevance");
    buckets.push({
      id: "overview_intro",
      ok: sectionWords(cm) >= 100 || sectionWords(er) >= 60,
    });
    const core = byKind.get("core_concept");
    buckets.push({ id: "core_concept_depth", ok: sectionWords(core) >= 100 });
    const scen = byKind.get("clinical_scenario");
    buckets.push({
      id: "clinical_application",
      ok: sectionWords(scen) >= 80,
    });
    const take = byKind.get("takeaways");
    buckets.push({ id: "summary_takeaways", ok: sectionWords(take) >= 80 });
  }

  const corpus = lessonCorpusForLinkCount(lesson);
  const examSignals =
    /\b(prioriti[sz]e|nclex|clinical reasoning|first response|airway|safety|delegation|assessment\b)/i.test(
      corpus,
    );
  buckets.push({ id: "exam_or_reasoning_cues", ok: examSignals });

  const safetyOrPriority =
    /\b(contraindicat|adverse|red flag|urgent|emergen|first-line|avoid|monitor|toxicity|fall risk|infection control)\b/i.test(
      corpus,
    ) || /\b(ABC|ABCDE|Maslow)\b/.test(corpus);
  if (premium) {
    const red = byKind.get("red_flags");
    buckets.push({
      id: "safety_or_priority_block",
      ok: sectionWords(red) >= 40 || safetyOrPriority,
    });
  } else {
    buckets.push({
      id: "safety_or_priority_mentioned",
      ok: safetyOrPriority,
    });
  }

  const satisfied = buckets.filter((b) => b.ok).map((b) => b.id);
  const missing = buckets.filter((b) => !b.ok).map((b) => b.id);
  const ratio = satisfied.length / Math.max(1, buckets.length);
  return {
    score: Math.round(ratio * 100),
    satisfied,
    missing,
  };
}

export function scoreLinks(internalStudyLinkCount: number): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (internalStudyLinkCount === 0) {
    reasons.push("no_internal_study_links");
    return { score: 15, reasons };
  }
  if (internalStudyLinkCount < 3) {
    reasons.push(`internal_links_below_minimum(${internalStudyLinkCount})`);
    return { score: 35 + internalStudyLinkCount * 12, reasons };
  }
  if (internalStudyLinkCount > 8) {
    reasons.push(`internal_links_high_count(${internalStudyLinkCount})`);
    return { score: 82, reasons };
  }
  return { score: 100, reasons: [] };
}

export function scoreStructuralFromGate(
  publicComplete: boolean,
  issues: string[],
  warnings: string[],
  totalWords: number,
  sectionCount: number,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = publicComplete ? 88 : 38;
  if (!publicComplete) {
    reasons.push(...issues.slice(0, 8));
    score -= Math.min(30, issues.length * 4);
  } else if (issues.length) {
    reasons.push(...issues.slice(0, 4));
    score -= Math.min(25, issues.length * 3);
  }
  score -= Math.min(15, warnings.length * 2);
  if (sectionCount === 0) {
    return { score: 0, reasons: [...reasons, "no_sections"] };
  }
  if (totalWords < 350) {
    reasons.push("low_total_word_count");
    score -= 22;
  } else if (totalWords < 550) {
    reasons.push("thin_total_word_count");
    score -= 10;
  }
  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
}

export type OverlayIndex = {
  /** locale -> Set of lesson keys present in lessons.json */
  keysByLocale: Map<string, Set<string>>;
  localesScanned: string[];
};

export function scoreLocalization(
  pathwayId: string,
  slug: string,
  overlayIndex: OverlayIndex,
): {
  score: number;
  reasons: string[];
  overlayLocalesWithDepth: string[];
  englishOnlyEducationalLikely: boolean;
} {
  const keysToTry = [`${pathwayId}:${slug}`, slug];
  const deepLocales: string[] = [];
  for (const loc of overlayIndex.localesScanned) {
    const set = overlayIndex.keysByLocale.get(loc);
    if (!set) continue;
    const hit = keysToTry.some((k) => set.has(k));
    if (hit) deepLocales.push(loc);
  }
  if (deepLocales.length >= 2) {
    return {
      score: 92,
      reasons: [],
      overlayLocalesWithDepth: deepLocales,
      englishOnlyEducationalLikely: false,
    };
  }
  if (deepLocales.length === 1) {
    return {
      score: 68,
      reasons: ["partial_educational_overlay"],
      overlayLocalesWithDepth: deepLocales,
      englishOnlyEducationalLikely: false,
    };
  }
  return {
    score: 34,
    reasons: ["no_educational_overlay_in_scanned_locales"],
    overlayLocalesWithDepth: [],
    englishOnlyEducationalLikely: true,
  };
}

export function weightedOverall(
  structural: number,
  educational: number,
  links: number,
  localization: number,
): number {
  const o =
    structural * SCORE_WEIGHTS.structural +
    educational * SCORE_WEIGHTS.educational +
    links * SCORE_WEIGHTS.links +
    localization * SCORE_WEIGHTS.localization;
  return Math.round(o * 10) / 10;
}

export function deriveStatus(args: {
  overallScore: number;
  structuralScore: number;
  educationalScore: number;
  localizationScore: number;
  linkScore: number;
  publicComplete: boolean;
  routable: boolean;
  duplicateCandidate: boolean;
  placeholderFlags: string[];
  totalWords: number;
  sectionCount: number;
}): LessonCompletenessStatus {
  if (args.duplicateCandidate) return "duplicate_or_unclear_source";
  if (!args.routable) return "not_routable";
  if (args.sectionCount === 0 || args.placeholderFlags.length > 0) {
    return args.sectionCount === 0 ? "structurally_incomplete" : "content_incomplete";
  }
  if (!args.publicComplete && args.structuralScore < 42) return "structurally_incomplete";
  if (
    args.localizationScore < 38 &&
    args.overallScore >= 58 &&
    args.publicComplete &&
    args.educationalScore >= 55
  ) {
    return "localization_incomplete";
  }
  if (
    args.overallScore >= 84 &&
    args.publicComplete &&
    args.educationalScore >= 72 &&
    args.linkScore >= 55 &&
    args.totalWords >= 500
  ) {
    return "production_ready";
  }
  if (args.publicComplete && (args.overallScore < 70 || args.totalWords < 450 || args.educationalScore < 58)) {
    if (args.overallScore >= 52) return "usable_but_thin";
  }
  if (!args.publicComplete) return "content_incomplete";
  if (args.overallScore >= 52 && args.publicComplete) return "usable_but_thin";
  return "content_incomplete";
}

export function buildRecommendedActions(status: LessonCompletenessStatus, missing: string[]): string[] {
  const a: string[] = [];
  if (status === "structurally_incomplete" || status === "content_incomplete") {
    a.push("Address structural gate issues and section depth per pathway-lesson-premium targets.");
  }
  if (missing.length) {
    a.push(`Strengthen educational buckets: ${missing.slice(0, 5).join(", ")}.`);
  }
  if (status === "localization_incomplete") {
    a.push("Add or expand educational overlays for target locales (public/i18n/educational-overlays).");
  }
  if (status === "usable_but_thin") {
    a.push("Expand prose depth; distinguish from shell-only completeness.");
  }
  if (status === "duplicate_or_unclear_source") {
    a.push("Resolve duplicate slug across pathways or document canonical pathway.");
  }
  return [...new Set(a)];
}

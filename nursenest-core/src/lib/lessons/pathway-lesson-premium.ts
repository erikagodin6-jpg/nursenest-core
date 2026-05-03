/**
 * Premium pathway lesson standard: section order, minimum prose depth, internal links, publish readiness.
 * Legacy catalog lessons use five-block normalization; premium validation runs only when a lesson
 * commits to the premium spine (substantive red_flags / related_next_steps / tier_specific_relevance).
 *
 * Exam-complete spine checklist / builders live in `exam-complete-lesson-template.ts` (same folder).
 */
import type {
  PathwayLessonOmittedPremiumSection,
  PathwayLessonPremiumSectionKind,
  PathwayLessonPremiumValidation,
  PathwayLessonRecord,
  PathwayLessonSection,
  PathwayLessonStructuralGate,
} from "@/lib/lessons/pathway-lesson-types";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import {
  evaluateLegacySubscriberReadinessIssues,
  evaluatePremiumSubscriberReadinessIssues,
} from "@/lib/lessons/pathway-lesson-subscriber-completeness";

/** Canonical premium section kinds (render order). Legacy kinds are normalized separately. */
export const PREMIUM_SECTION_KINDS: readonly PathwayLessonPremiumSectionKind[] = [
  "introduction",
  "pathophysiology_overview",
  "signs_symptoms",
  "red_flags",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "client_education",
  "tier_specific_relevance",
  "country_specific_notes",
  "related_next_steps",
];

export const PREMIUM_SECTION_HEADINGS: Record<PathwayLessonPremiumSectionKind, string> = {
  introduction: "Introduction",
  pathophysiology_overview: "Pathophysiology / Overview",
  signs_symptoms: "Signs and Symptoms",
  red_flags: "Red Flags / Danger Signs",
  labs_diagnostics: "Labs / Diagnostics",
  nursing_assessment_interventions: "Nursing Assessment and Interventions",
  clinical_pearls: "Clinical Pearls",
  client_education: "Client Education",
  tier_specific_relevance: "Your exam focus",
  country_specific_notes: "Country-Specific Notes",
  related_next_steps: "Next steps",
};

/** Minimum word counts (plain text) per section when present. */
export const PREMIUM_MIN_WORDS: Record<PathwayLessonPremiumSectionKind, number> = {
  introduction: 180,
  pathophysiology_overview: 140,
  signs_symptoms: 120,
  red_flags: 80,
  labs_diagnostics: 100,
  nursing_assessment_interventions: 180,
  clinical_pearls: 100,
  client_education: 100,
  tier_specific_relevance: 120,
  country_specific_notes: 80,
  related_next_steps: 40,
};

/** May be omitted with `premiumOmittedSections` or a single-line `[not applicable]` body. */
const PREMIUM_KINDS_OPTIONAL_NA: readonly PathwayLessonPremiumSectionKind[] = [
  "labs_diagnostics",
  "country_specific_notes",
];

const PREMIUM_KIND_SET = new Set<string>(PREMIUM_SECTION_KINDS);

/**
 * Plain-text length floor (after {@link stripToPlainText}, whitespace collapsed) for a section to count as
 * “substantive” for premium commitment and for {@link lessonQualifiesForPremiumStructuralGate}.
 */
export const SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS = 40;

/**
 * Previous meaningful-clinical gate (≥3 sections, ≥400 words, one clinical-keyword hit in any section).
 * Kept for audits, migration deltas, and tests that assert historical baselines.
 */
export const MEANINGFUL_LESSON_LEGACY_MIN_SECTIONS = 3;
export const MEANINGFUL_LESSON_LEGACY_MIN_TOTAL_WORDS = 400;

/**
 * Upgraded meaningful-clinical bar: ≥800 words, four clinical pillars each with a substantive section,
 * explicit scenario + decision-making signals, and light anti-glossary / anti-listicle guards.
 */
export const MEANINGFUL_LESSON_MIN_SECTIONS = 4;
export const MEANINGFUL_LESSON_MIN_TOTAL_WORDS = 800;
export const MEANINGFUL_BUCKET_SECTION_MIN_WORDS = 50;

export type MeaningfulClinicalContentBucket =
  | "pathophysiology"
  | "assessment_diagnosis"
  | "interventions_treatment"
  | "clinical_application";

/** Total words across section bodies (plain text) — used for meaningful-content gate + QA logs. */
export function countTotalWordsInLessonSections(sections: PathwayLessonSection[] | undefined): number {
  const list = sections ?? [];
  let n = 0;
  for (const s of list) {
    n += countWords(stripToPlainText(typeof s.body === "string" ? s.body : ""));
  }
  return n;
}

function sectionCorpusForClinicalKeyword(sec: PathwayLessonSection): string {
  return `${sec.kind ?? ""}\n${sec.heading ?? ""}\n${sec.body ?? ""}`;
}

/**
 * Legacy meaningful-clinical check (pre–pillar upgrade). Prefer {@link lessonSectionsHaveMeaningfulClinicalContent}
 * for product gates; use this only for migration reporting.
 */
export function lessonSectionsHaveMeaningfulClinicalContentLegacy(
  sections: PathwayLessonSection[] | undefined,
): boolean {
  const list = sections ?? [];
  if (list.length < MEANINGFUL_LESSON_LEGACY_MIN_SECTIONS) return false;
  if (countTotalWordsInLessonSections(list) < MEANINGFUL_LESSON_LEGACY_MIN_TOTAL_WORDS) return false;
  const clinical = /pathophysiology|treatment|intervention|diagnosis/i;
  return list.some((s) => clinical.test(sectionCorpusForClinicalKeyword(s)));
}

function sectionWordCount(sec: PathwayLessonSection): number {
  return countWords(stripToPlainText(typeof sec.body === "string" ? sec.body : ""));
}

/**
 * Maps catalog / premium / legacy section kinds to one of four clinical pillars for the meaningful-clinical gate.
 * Navigation-only rows (`related_next_steps`, `country_specific_notes`) return null.
 */
export function meaningfulClinicalBucketForSectionKind(
  kind: string | undefined,
): MeaningfulClinicalContentBucket | null {
  const normalizedKind = typeof kind === "string" ? kind.trim().toLowerCase() : "";
  switch (normalizedKind) {
    case "pathophysiology_overview":
    case "core_concept":
    case "clinical_meaning":
    case "core":
    case "introduction":
    case "intro":
      return "pathophysiology";
    case "signs_symptoms":
    case "labs_diagnostics":
    case "exam_focus":
    case "clinical_manifestations":
    case "red_flags":
      return "assessment_diagnosis";
    case "nursing_assessment_interventions":
    case "treatment_management":
    case "nursing_priorities":
    case "client_education":
    case "complications":
      return "interventions_treatment";
    case "clinical_scenario":
    case "clinical_application":
    case "exam_relevance":
    case "takeaways":
    case "clinical_pearls":
    case "tier_specific_relevance":
    case "exam_tips":
      return "clinical_application";
    default:
      return null;
  }
}

function lessonCorpusForSignals(sections: PathwayLessonSection[]): string {
  return sections.map((s) => `${s.heading ?? ""}\n${s.body ?? ""}`).join("\n\n");
}

/** Vignette / presentation / case framing (scenario or example). */
const MEANINGFUL_SCENARIO_SIGNAL =
  /clinical scenario|case study|vignette|patient presents|presentation:|case:\s|scenario:|sbar|\d{1,2}\s*[-–]\s*year\s*[-–]\s*old|year-old|y\/o|you are (the )?nurse|nursing student.*assigned|arrives (at|in) (the )?(ed|er|clinic)/i;

/** Decision-making, prioritization, branching, or when-to-act reasoning. */
const MEANINGFUL_DECISION_SIGNAL =
  /when to|whether to|choose between|prioritiz(e|ing)|clinical decision|nursing judgment|if (the )?patient|if you (see|note|identify|suspect)|differential (diagnosis)?|escalate|first[- ]line|second[- ]line|stepwise|algorithm|monitor for|reassess|next (step|action)|weigh the risks|clinical reasoning/i;

function corpusHasScenarioSignal(corpus: string): boolean {
  return MEANINGFUL_SCENARIO_SIGNAL.test(corpus);
}

function corpusHasDecisionSignal(corpus: string): boolean {
  return MEANINGFUL_DECISION_SIGNAL.test(corpus);
}

/** Many short "Term is a …" sentences — glossary / definitional stack without applied clinical reasoning. */
function corpusLooksLikeDefinitionalStack(corpus: string): boolean {
  const plain = stripToPlainText(corpus).replace(/\s+/g, " ").trim();
  if (plain.length < 500) return false;
  const sentences = plain.split(/(?<=[.!?])\s+/).map((t) => t.trim()).filter((t) => t.length > 24);
  if (sentences.length < 12) return false;
  let defLike = 0;
  for (const s of sentences) {
    if (/^(the\s+)?([A-Z][a-z]+\s+){0,5}(is|are)\s+(a|an|the)\b/i.test(s)) defLike += 1;
  }
  return defLike / sentences.length > 0.48;
}

/** Mostly bullets / list lines with limited paragraph prose — shallow summary wall. */
function corpusLooksLikeShallowListicle(corpus: string): boolean {
  const lines = corpus.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 14) return false;
  const bulletish = lines.filter((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l)).length;
  const ratio = bulletish / lines.length;
  const words = countWords(stripToPlainText(corpus));
  return ratio > 0.62 && words < 1100;
}

function meaningfulClinicalBucketsSatisfied(sections: PathwayLessonSection[]): Set<MeaningfulClinicalContentBucket> {
  const satisfied = new Set<MeaningfulClinicalContentBucket>();
  for (const s of sections) {
    const bucket = meaningfulClinicalBucketForSectionKind(s.kind);
    if (!bucket) continue;
    if (sectionWordCount(s) < MEANINGFUL_BUCKET_SECTION_MIN_WORDS) continue;
    satisfied.add(bucket);
  }
  return satisfied;
}

/**
 * True when the lesson already carries enough real clinical prose that the legacy five-block synthesizer
 * must not replace it (independent of premium spine commitment rows).
 * See `expandToStandardFiveSections` in `pathway-lesson-catalog-sync.ts`.
 *
 * Requirements (all must hold):
 * - ≥ {@link MEANINGFUL_LESSON_MIN_TOTAL_WORDS} words across section bodies
 * - ≥ {@link MEANINGFUL_LESSON_MIN_SECTIONS} total sections
 * - Each of {@link MeaningfulClinicalContentBucket} represented by ≥1 mapped section with
 *   ≥ {@link MEANINGFUL_BUCKET_SECTION_MIN_WORDS} words (kinds mapped in {@link meaningfulClinicalBucketForSectionKind})
 * - At least one clinical scenario / example signal and one decision-making signal in headings + bodies
 * - Reject dominant definitional-stack or shallow listicle heuristics when triggered
 */
export function lessonSectionsHaveMeaningfulClinicalContent(sections: PathwayLessonSection[] | undefined): boolean {
  const list = sections ?? [];
  if (list.length < MEANINGFUL_LESSON_MIN_SECTIONS) return false;
  const totalWords = countTotalWordsInLessonSections(list);
  if (totalWords < MEANINGFUL_LESSON_MIN_TOTAL_WORDS) return false;

  const buckets = meaningfulClinicalBucketsSatisfied(list);
  const need: MeaningfulClinicalContentBucket[] = [
    "pathophysiology",
    "assessment_diagnosis",
    "interventions_treatment",
    "clinical_application",
  ];
  for (const b of need) {
    if (!buckets.has(b)) return false;
  }

  const corpus = lessonCorpusForSignals(list);
  if (!corpusHasScenarioSignal(corpus)) return false;
  if (!corpusHasDecisionSignal(corpus)) return false;
  if (corpusLooksLikeDefinitionalStack(corpus)) return false;
  if (corpusLooksLikeShallowListicle(corpus)) return false;

  return true;
}

/**
 * True when incoming `sections[]` already carry non-trivial authored copy — the legacy five-block
 * synthesizer must not replace or pad them (PathwayLesson.sections remain the sole render source).
 *
 * Looser than {@link lessonSectionsHaveMeaningfulClinicalContent} (no four-pillar / 800-word / scenario bar)
 * so multi-section catalog lessons (e.g. AFib rate control) still route through the premium normalization path.
 */
export function lessonSectionsQualifyAsAuthoritativeSoleSource(sections: PathwayLessonSection[] | undefined): boolean {
  const list = sections ?? [];
  if (list.length === 0) return false;
  const words = countTotalWordsInLessonSections(list);
  if (words >= 50) return true;
  return list.some((s) => {
    const plain = stripToPlainText(typeof s.body === "string" ? s.body : "").replace(/\s+/g, " ").trim();
    return plain.length >= 48;
  });
}

/** Legacy five-block and pre-normalization archetypes — never count toward premium-normalization spine depth. */
const LEGACY_SPINE_KINDS_FOR_PREMIUM_QUALIFIER = new Set<string>([
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
  "intro",
  "core",
  "clinical_application",
  "exam_tips",
]);

/**
 * Additional clinical spine kinds (not in {@link PREMIUM_SECTION_KINDS}) that must still opt lessons into
 * the premium normalization path when three substantive rows exist.
 */
const EXTENDED_PREMIUM_NORMALIZATION_SPINE_KINDS = new Set<string>([
  "exam_focus",
  "clinical_manifestations",
  "treatment_management",
  "nursing_priorities",
  "complications",
]);

const LEGACY_KIND_ORDER = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
] as const;

const LEGACY_MIN_WORDS: Record<(typeof LEGACY_KIND_ORDER)[number], number> = {
  clinical_meaning: 180,
  exam_relevance: 80,
  core_concept: 140,
  clinical_scenario: 120,
  takeaways: 100,
};

export function isPremiumSectionKind(kind: string): kind is PathwayLessonPremiumSectionKind {
  return PREMIUM_KIND_SET.has(kind);
}

/**
 * Premium spine "commitment": legacy conversions and partial bundles often use premium *section kinds*
 * (introduction, pathophysiology_overview, …) without the full exam-complete premium spine, links, or
 * related-lesson metadata. Those must normalize through the legacy five-block path unless the lesson
 * clearly opts into premium via substantive commitment sections.
 */
const PREMIUM_SPINE_COMMITMENT_KINDS: readonly PathwayLessonPremiumSectionKind[] = [
  "red_flags",
  "related_next_steps",
  "tier_specific_relevance",
] as const;

function sectionCommitsToPremiumSpine(sec: PathwayLessonSection | undefined): boolean {
  if (!sec?.body?.trim()) return false;
  const plain = stripToPlainText(sec.body).replace(/\s+/g, " ").trim();
  return plain.length >= SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS;
}

function sectionKindCountsTowardPremiumNormalizationSpine(kind: string | undefined): boolean {
  if (!kind) return false;
  if (LEGACY_SPINE_KINDS_FOR_PREMIUM_QUALIFIER.has(kind)) return false;
  return isPremiumSectionKind(kind) || EXTENDED_PREMIUM_NORMALIZATION_SPINE_KINDS.has(kind);
}

export function lessonUsesPremiumStructure(sections: PathwayLessonSection[] | undefined): boolean {
  const list = sections ?? [];
  return PREMIUM_SPINE_COMMITMENT_KINDS.some((kind) => {
    const sec = list.find((s) => s.kind === kind);
    return sectionCommitsToPremiumSpine(sec);
  });
}

/**
 * Premium spine / commitment depth only — used for **structural publish gate** (not the meaningful-prose bypass).
 *
 * True when {@link lessonUsesPremiumStructure} passes **or** when **≥3** in-spine sections each have
 * **≥ {@link SUBSTANTIVE_PREMIUM_SECTION_MIN_PLAIN_CHARS}** plain-text characters after
 * {@link stripToPlainText}.
 *
 * Counted kinds: all {@link PREMIUM_SECTION_KINDS}, plus extended clinical rows
 * (`exam_focus`, `clinical_manifestations`, `treatment_management`, `nursing_priorities`, `complications`).
 * Legacy five-block input kinds (`clinical_meaning`, `exam_relevance`, …) never count toward this depth.
 */
export function lessonQualifiesForPremiumStructuralGate(sections: PathwayLessonSection[] | undefined): boolean {
  if (lessonUsesPremiumStructure(sections)) return true;
  const list = sections ?? [];
  let substantiveSpineSections = 0;
  for (const s of list) {
    if (!sectionKindCountsTowardPremiumNormalizationSpine(s.kind)) continue;
    if (sectionCommitsToPremiumSpine(s)) substantiveSpineSections += 1;
  }
  return substantiveSpineSections >= 3;
}

/**
 * Whether `normalizeLesson` should run the premium path (finalize + optional catalog hydrate)
 * instead of the legacy five-block expander in `pathway-lesson-catalog-sync.ts`.
 *
 * True when {@link lessonSectionsHaveMeaningfulClinicalContent} **or**
 * {@link lessonQualifiesForPremiumStructuralGate} **or**
 * {@link lessonSectionsQualifyAsAuthoritativeSoleSource}.
 */
/** Canonical marketing five-block shape (matches `CANONICAL_ORDER` in pathway-lesson-catalog-sync). */
const CANONICAL_LEGACY_MARKETING_KINDS = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
] as const;

/**
 * When bundled lessons already ship the legacy hub spine, they must normalize through the legacy
 * five-block path + subscriber enrichment — not `finalizePremiumSections`, which would reorder into
 * an incomplete premium spine and incorrectly fail {@link evaluatePathwayLessonStructuralGate}.
 */
export function lessonSectionsAreCanonicalLegacyMarketingShape(sections: PathwayLessonSection[] | undefined): boolean {
  const list = sections ?? [];
  const kinds = new Set(list.map((s) => s.kind));
  return CANONICAL_LEGACY_MARKETING_KINDS.every((k) => kinds.has(k));
}

export function lessonQualifiesForPremiumNormalization(sections: PathwayLessonSection[] | undefined): boolean {
  // Meaningful clinical prose must stay on the premium pipeline even when the incoming JSON is still
  // legacy-shaped — otherwise we regress high-yield catalog rows that intentionally carry depth in
  // the five canonical kinds.
  if (lessonSectionsHaveMeaningfulClinicalContent(sections)) return true;
  if (lessonUsesPremiumStructure(sections)) return true;
  if (lessonSectionsAreCanonicalLegacyMarketingShape(sections)) return false;
  if (lessonQualifiesForPremiumStructuralGate(sections)) return true;
  return lessonSectionsQualifyAsAuthoritativeSoleSource(sections);
}

/** Explicit N/A marker for optional sections (no filler prose). */
export function sectionIsMarkedNotApplicable(body: string): boolean {
  const t = body.trim();
  return /^\[(?:not\s*applicable|n\/a|na)\]$/i.test(t) || /^N\/A\.?$/i.test(t);
}

/** @deprecated Use {@link countInternalStudyLinks} */
export function countLessonWikiLinks(corpus: string): number {
  return countInternalStudyLinks(corpus);
}

/**
 * Internal study-flow links: `LESSON:slug` wiki targets and root-relative markdown paths.
 * Target band: 3–8 links per lesson (enforced as minimum in validators; high counts warn in legacy).
 */
export function countInternalStudyLinks(corpus: string): number {
  if (!corpus) return 0;
  let n = 0;
  const lessonWiki = /\]\(LESSON:[^)]+\)/g;
  while (lessonWiki.exec(corpus) !== null) n += 1;
  const rootRel = /\]\(\/(?!\/)[^)\s#?][^)]*\)/g;
  while (rootRel.exec(corpus) !== null) n += 1;
  return n;
}

function paragraphCount(body: string): number {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean).length;
}

export function orderPremiumSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const byKind = new Map<string, PathwayLessonSection>();
  for (const s of sections) {
    if (isPremiumSectionKind(s.kind)) byKind.set(s.kind, s);
  }
  return PREMIUM_SECTION_KINDS.map((kind) => byKind.get(kind)).filter(
    (s): s is PathwayLessonSection => Boolean(s),
  );
}

export function lessonCorpusForLinkCount(lesson: Pick<PathwayLessonRecord, "sections">): string {
  return (lesson.sections ?? []).map((s) => s.body).join("\n\n");
}

/**
 * Validate premium spine: required sections, word floors, intro paragraphs, internal links, related metadata.
 */
export function validatePathwayLessonPremium(
  lesson: Pick<PathwayLessonRecord, "sections" | "title" | "slug" | "seoTitle" | "seoDescription"> & {
    premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
    relatedLessonRefs?: PathwayLessonRecord["relatedLessonRefs"];
  },
): PathwayLessonPremiumValidation {
  const issues: string[] = [];
  const omitted = lesson.premiumOmittedSections ?? [];
  const omittedKinds = new Set(omitted.map((o) => o.kind));
  for (const o of omitted) {
    if (!o.reason?.trim()) issues.push(`Omitted section "${o.kind}" must include a documented reason.`);
  }

  const ordered = orderPremiumSections(lesson.sections ?? []);
  const corpus = lessonCorpusForLinkCount(lesson);
  const internalLinkCount = countInternalStudyLinks(corpus);

  if (!lesson.slug?.trim()) issues.push("Lesson slug is required for publish readiness.");
  if (!lesson.title?.trim()) issues.push("Lesson title (H1 source) is required.");
  if (!lesson.seoTitle?.trim()) issues.push("seoTitle is required for metadata readiness.");
  if (!lesson.seoDescription?.trim() || countWords(lesson.seoDescription) < 12) {
    issues.push("seoDescription should be a substantive summary (at least ~12 words).");
  }

  for (const kind of PREMIUM_SECTION_KINDS) {
    if (omittedKinds.has(kind)) continue;
    const sec = ordered.find((s) => s.kind === kind);
    if (!sec) {
      if ((PREMIUM_KINDS_OPTIONAL_NA as readonly string[]).includes(kind)) {
        issues.push(
          `Section "${kind}" is missing: add content, mark [not applicable] in body, or document omission in premiumOmittedSections.`,
        );
      } else {
        issues.push(`Missing required premium section: ${kind}`);
      }
      continue;
    }
    if ((PREMIUM_KINDS_OPTIONAL_NA as readonly string[]).includes(kind) && sectionIsMarkedNotApplicable(sec.body)) {
      continue;
    }
    const plain = stripToPlainText(sec.body);
    const wc = countWords(plain);
    const min = PREMIUM_MIN_WORDS[kind];
    if (wc < min) issues.push(`Section "${kind}" below minimum word count (${wc} < ${min}).`);
    if (kind === "introduction") {
      const pc = paragraphCount(sec.body);
      if (pc < 2) {
        issues.push("Introduction should contain at least 2 real paragraphs (split with a blank line).");
      }
      if (pc > 3) {
        issues.push("Introduction should use 2–3 focused paragraphs for scanability (split or merge with blank lines).");
      }
      // Catalog-backed lessons may exceed the scanability target; do not block publish on length alone.
      if (wc > 1400) {
        issues.push(`Introduction is extremely long (${wc} words); split or trim for hub scanability.`);
      }
    }
  }

  if (!omittedKinds.has("related_next_steps") && internalLinkCount < 3) {
    issues.push(
      "Related / internal study flow: include at least 3 internal links using [anchor](LESSON:slug) or [anchor](/path) in the lesson body (often in the Next steps section).",
    );
  }
  if (internalLinkCount > 16) {
    issues.push(
      `Too many internal links (${internalLinkCount}); target 3–16 meaningful anchors so the page stays scannable.`,
    );
  }

  if ((lesson.relatedLessonRefs?.length ?? 0) < 2) {
    issues.push("Metadata: provide at least 2 relatedLessonRefs for hub/SEO related mapping.");
  }

  const introSec = ordered.find((s) => s.kind === "introduction");
  const introParagraphCount = introSec ? paragraphCount(introSec.body) : 0;

  const premiumReady = issues.length === 0;
  return {
    publishReady: premiumReady,
    premiumReady,
    issues,
    internalLinkCount,
    omittedSections: omitted,
    introParagraphCount,
  };
}

/** Legacy five-block: block `publicComplete` only on broken SEO/slug; depth and links are warnings until migrated. */
export function validatePathwayLessonLegacyStructural(lesson: PathwayLessonRecord): {
  legacyReady: boolean;
  issues: string[];
  warnings: string[];
  internalStudyLinkCount: number;
} {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!lesson.slug?.trim()) issues.push("Lesson slug is required for publish readiness.");
  if (!lesson.title?.trim()) issues.push("Lesson title (H1 source) is required.");
  if (!lesson.seoTitle?.trim()) issues.push("seoTitle is required for metadata readiness.");
  if (!lesson.seoDescription?.trim() || countWords(lesson.seoDescription) < 12) {
    issues.push("seoDescription should be a substantive summary (at least ~12 words).");
  }

  const corpus = lessonCorpusForLinkCount(lesson);
  const internalStudyLinkCount = countInternalStudyLinks(corpus);
  if (internalStudyLinkCount < 3) {
    warnings.push(
      "Internal study-flow links: add 3–8 meaningful anchors using [label](LESSON:slug) or [label](/path) (legacy catalog often lacks these until upgraded).",
    );
  }
  if (internalStudyLinkCount > 8) {
    warnings.push(`Consider trimming internal links (currently ${internalStudyLinkCount}; target 3–8).`);
  }

  for (const kind of LEGACY_KIND_ORDER) {
    const sec = lesson.sections.find((s) => s.kind === kind);
    const wc = countWords(stripToPlainText(sec?.body ?? ""));
    const min = LEGACY_MIN_WORDS[kind];
    if (wc < min) {
      warnings.push(`Legacy section "${kind}" below premium-migration target (${wc} < ${min} words).`);
    }
  }

  const introLike = lesson.sections.find((s) => s.kind === "clinical_meaning");
  if (introLike && paragraphCount(introLike.body) < 2) {
    warnings.push(
      'First legacy `clinical_meaning` section reads as one block; add a blank line for a second paragraph when you expand.',
    );
  }

  const strictLegacy = process.env.PATHWAY_LESSON_STRICT_LEGACY === "1";
  if (strictLegacy) {
    const promote = [...warnings];
    warnings.length = 0;
    issues.push(...promote);
  }

  const legacyReady = issues.length === 0;
  return { legacyReady, issues, warnings, internalStudyLinkCount };
}

/**
 * Single entry point for admin, CI, and runtime gating.
 *
 * Uses {@link lessonQualifiesForPremiumStructuralGate} (premium spine: substantive commitment rows **or**
 * ≥3 substantive spine kinds). That is the same **spine** signal embedded in {@link lessonQualifiesForPremiumNormalization}
 * alongside meaningful-clinical and authoritative-sole-source expander bypasses — those bypasses still run
 * {@link validatePathwayLessonLegacyStructural} here because their sections are not full premium-spine shapes.
 */
export function evaluatePathwayLessonStructuralGate(lesson: PathwayLessonRecord): PathwayLessonStructuralGate {
  if (lessonQualifiesForPremiumStructuralGate(lesson.sections)) {
    const v = validatePathwayLessonPremium({
      sections: lesson.sections,
      title: lesson.title,
      slug: lesson.slug,
      seoTitle: lesson.seoTitle,
      seoDescription: lesson.seoDescription,
      premiumOmittedSections: lesson.premiumOmittedSections,
      relatedLessonRefs: lesson.relatedLessonRefs,
    });
    const subscriber = evaluatePremiumSubscriberReadinessIssues(lesson);
    const issues = [...v.issues, ...subscriber];
    return {
      structureMode: "premium",
      publicComplete: issues.length === 0,
      issues,
      warnings: [],
      internalStudyLinkCount: v.internalLinkCount,
    };
  }
  const l = validatePathwayLessonLegacyStructural(lesson);
  const subscriber = evaluateLegacySubscriberReadinessIssues(lesson);
  const issues = [...l.issues, ...subscriber];
  return {
    structureMode: "legacy",
    publicComplete: issues.length === 0,
    issues,
    warnings: l.warnings,
    internalStudyLinkCount: l.internalStudyLinkCount,
  };
}

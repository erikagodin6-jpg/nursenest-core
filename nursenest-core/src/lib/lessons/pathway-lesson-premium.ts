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

const PREMIUM_COMMITMENT_MIN_PLAIN_CHARS = 40;

function sectionCommitsToPremiumSpine(sec: PathwayLessonSection | undefined): boolean {
  if (!sec?.body?.trim()) return false;
  const plain = stripToPlainText(sec.body).replace(/\s+/g, " ").trim();
  return plain.length >= PREMIUM_COMMITMENT_MIN_PLAIN_CHARS;
}

export function lessonUsesPremiumStructure(sections: PathwayLessonSection[] | undefined): boolean {
  const list = sections ?? [];
  return PREMIUM_SPINE_COMMITMENT_KINDS.some((kind) => {
    const sec = list.find((s) => s.kind === kind);
    return sectionCommitsToPremiumSpine(sec);
  });
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
      if (wc > 250) {
        issues.push(`Introduction is long for scanability (${wc} words); target about 180–250 words while keeping 2–3 paragraphs.`);
      }
    }
  }

  if (!omittedKinds.has("related_next_steps") && internalLinkCount < 3) {
    issues.push(
      "Related / internal study flow: include at least 3 internal links using [anchor](LESSON:slug) or [anchor](/path) in the lesson body (often in the Next steps section).",
    );
  }
  if (internalLinkCount > 8) {
    issues.push(
      `Many internal links (${internalLinkCount}); target 3–8 meaningful anchors so the page stays scannable.`,
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
    warnings.push('First section ("What this means clinically") reads as one block; add a blank line for a second paragraph when you expand.');
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

/** Single entry point for admin, CI, and runtime gating. */
export function evaluatePathwayLessonStructuralGate(lesson: PathwayLessonRecord): PathwayLessonStructuralGate {
  if (lessonUsesPremiumStructure(lesson.sections)) {
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

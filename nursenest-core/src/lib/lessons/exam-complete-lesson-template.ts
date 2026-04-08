/**
 * Exam-complete premium lesson template — single spine for RN/PN/NP × US/Canada authoring.
 * Maps 1:1 to {@link PREMIUM_SECTION_KINDS} / {@link validatePathwayLessonPremium} in pathway-lesson-premium.ts.
 *
 * Use {@link createExamCompleteSection} when generating catalog JSON or migrations;
 * use {@link validateExamCompletePremiumSpine} in CI or authoring tools to ensure no duplicate/missing kinds.
 */
import {
  isPremiumSectionKind,
  PREMIUM_MIN_WORDS,
  PREMIUM_SECTION_HEADINGS,
  PREMIUM_SECTION_KINDS,
} from "@/lib/lessons/pathway-lesson-premium";
import type {
  PathwayLessonAudienceTier,
  PathwayLessonCountryScope,
  PathwayLessonPremiumSectionKind,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

/** Ordered premium kinds — the mandatory exam-complete spine (includes Related / Next Steps). */
export const EXAM_COMPLETE_SPINE_KINDS = PREMIUM_SECTION_KINDS;

const AUTHOR_PROMPTS: Record<PathwayLessonPremiumSectionKind, string> = {
  introduction:
    "What the topic is, why it matters clinically, and how boards frame questions. Use **2–3 paragraphs** separated by blank lines.",
  pathophysiology_overview: "Concise, accurate mechanism nurses can tie to assessment data.",
  signs_symptoms: "Early cues, classic presentation, and deteriorating findings.",
  red_flags: "Emergency / escalation triggers and immediate nursing priorities.",
  labs_diagnostics: "Key labs and imaging; interpret abnormal results (or mark `[not applicable]` when truly N/A).",
  nursing_assessment_interventions: "What to monitor, what to do, and how to prioritize safely.",
  clinical_pearls: "High-yield traps, discriminators, and “if you see X, think Y.”",
  client_education: "Teaching points, safety, discharge / follow-up instructions.",
  tier_specific_relevance:
    "RN: depth, prioritization, patho links. PN/RPN: scope-safe actions and escalation. NP: diagnostic/management and referral (when pathway includes NP).",
  country_specific_notes:
    "US vs Canada: units, scope language, NCLEX vs REx-PN emphasis when it changes the answer (or `[not applicable]`).",
  related_next_steps:
    "3–8 internal study links using `[label](LESSON:slug)` or `[label](/path)` plus relatedLessonRefs metadata.",
};

export type ExamCompleteTemplateStep = {
  step: number;
  kind: PathwayLessonPremiumSectionKind;
  heading: string;
  minWordsWhenPresent: number;
  authorPrompt: string;
};

/** Human-facing checklist for content pipelines (steps 1–11). */
export const EXAM_COMPLETE_TEMPLATE_STEPS: readonly ExamCompleteTemplateStep[] = PREMIUM_SECTION_KINDS.map((kind, i) => ({
  step: i + 1,
  kind,
  heading: PREMIUM_SECTION_HEADINGS[kind],
  minWordsWhenPresent: PREMIUM_MIN_WORDS[kind],
  authorPrompt: AUTHOR_PROMPTS[kind],
}));

/**
 * Build one premium section with canonical id + heading unless overridden.
 * Bodies must meet {@link PREMIUM_MIN_WORDS} when validated through {@link validatePathwayLessonPremium}.
 */
export function createExamCompleteSection(
  kind: PathwayLessonPremiumSectionKind,
  body: string,
  overrides?: Partial<Pick<PathwayLessonSection, "id" | "heading">>,
): PathwayLessonSection {
  const heading = overrides?.heading?.trim() || PREMIUM_SECTION_HEADINGS[kind];
  const id = overrides?.id?.trim() || kind;
  return { id, heading, kind, body: body.trim() };
}

/**
 * Returns whether every premium kind appears exactly once. Does not validate word counts or links —
 * use {@link validatePathwayLessonPremium} on a full lesson record (slug, title, seo, sections, relatedLessonRefs).
 */
export function validateExamCompletePremiumSpine(sections: PathwayLessonSection[]): {
  ok: boolean;
  missing: PathwayLessonPremiumSectionKind[];
  duplicateKinds: PathwayLessonPremiumSectionKind[];
} {
  const premiumKinds = sections.filter((s) => isPremiumSectionKind(s.kind)).map((s) => s.kind as PathwayLessonPremiumSectionKind);
  const counts = new Map<PathwayLessonPremiumSectionKind, number>();
  for (const k of premiumKinds) {
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const duplicateKinds = [...counts.entries()].filter(([, n]) => n > 1).map(([k]) => k);
  const missing = PREMIUM_SECTION_KINDS.filter((k) => !counts.has(k));
  return {
    ok: missing.length === 0 && duplicateKinds.length === 0,
    missing,
    duplicateKinds,
  };
}

/** Plain-text checklist for prompts / runbooks (no markdown file required). */
export function examCompleteAuthoringChecklistText(): string {
  return EXAM_COMPLETE_TEMPLATE_STEPS.map((s) => `${s.step}. ${s.heading} (${s.kind}) — min ~${s.minWordsWhenPresent} words. ${s.authorPrompt}`).join(
    "\n",
  );
}

/**
 * Default tier + country tags when catalog rows omit `audienceTiers` / `countryScope`.
 * Pathway id remains authoritative for entitlements; this supports hub filtering and bank alignment.
 */
export function inferExamAudienceFromPathwayId(pathwayId: string): {
  audienceTiers: PathwayLessonAudienceTier[];
  countryScope: PathwayLessonCountryScope;
} {
  const id = pathwayId.toLowerCase();
  const audienceTiers: PathwayLessonAudienceTier[] = id.includes("np")
    ? ["np"]
    : id.includes("rpn") || id.includes("lpn") || id.includes("-pn-") || id.endsWith("-pn")
      ? ["pn"]
      : ["rn"];
  const countryScope: PathwayLessonCountryScope = id.startsWith("ca-") ? "ca" : id.startsWith("us-") ? "us" : "both";
  return { audienceTiers, countryScope };
}

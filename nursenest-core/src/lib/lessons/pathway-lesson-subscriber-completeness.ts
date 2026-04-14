/**
 * Subscriber-facing completeness: required lesson spine, minimum depth, clinical scenario signal,
 * and banned “work in progress” phrasing. Used by {@link evaluatePathwayLessonStructuralGate} and
 * hub/detail gating — not for admin authoring surfaces.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { bodyIsPlaceholderOrTrivial } from "@/lib/lessons/lesson-section-presentability";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

/**
 * Minimum word counts per legacy spine block for subscriber surfacing.
 * Kept below premium migration targets so catalog lessons that are clinically complete
 * but shorter still pass; placeholder/trivial + scenario checks remain the primary bar.
 */
const LEGACY_SUBSCRIBER_SECTION_FLOORS = {
  clinical_meaning: 50,
  exam_relevance: 30,
  core_concept: 40,
  clinical_scenario: 40,
  takeaways: 35,
} as const;

const LEGACY_KIND_ORDER = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
] as const;

const BANNED_DEVELOPMENT_PHRASES: RegExp[] = [
  /\bcoming\s+soon\b/i,
  /\bin\s+progress\b/i,
  /\bto\s+be\s+determined\b/i,
  /\bcontent\s+expansion\b/i,
  /\bunder\s+construction\b/i,
  /\bplaceholder\b/i,
  /\bwork\s+in\s+progress\b/i,
  /\bnot\s+yet\s+available\b/i,
  /\btbd\b/i,
];

export function corpusContainsBannedDevelopmentPhrases(text: string): boolean {
  const t = text.length > 500_000 ? text.slice(0, 500_000) : text;
  return BANNED_DEVELOPMENT_PHRASES.some((re) => re.test(t));
}

/**
 * True when prose reads like a patient/client vignette suitable for “clinical scenario” requirement.
 */
export function bodyLooksLikeClinicalScenario(body: string): boolean {
  const plain = stripToPlainText(body);
  if (bodyIsPlaceholderOrTrivial(body)) return false;
  if (countWords(plain) < 38) return false;
  const joined = plain.toLowerCase();
  const hasPatientFrame =
    /\b(vignette|scenario|case|patients?|client|resident|infant|adolescent|mother|father|woman|man|male|female|school-age|older\s+adult)\b/i.test(
      joined,
    ) || /\b\d{1,3}\s*(y\.?o\.?|years?\s+old|year-old)\b/i.test(joined);
  const hasExamStyleFrame =
    /\b(you are (?:managing|caring)|choose the (?:client|patient)|competing priorities|clinical judgment|first move|stem asks|exam item)\b/i.test(
      joined,
    ) || /\b(stem|item)\b.*\b(priorit|assess|interven|safe|risk)\b/i.test(joined);
  const hasClinicalFrame =
    /\b(present|admits|reports|complain|arrive|develop|notice|assessment|vital|symptom|diagnos|intervention|priority|order|medication|nursing|findings|concern|risk)\b/i.test(
      joined,
    );
  return (hasPatientFrame || hasExamStyleFrame) && hasClinicalFrame;
}

const PREMIUM_SCENARIO_KINDS = [
  "signs_symptoms",
  "pathophysiology_overview",
  "nursing_assessment_interventions",
  "clinical_pearls",
  "introduction",
  "red_flags",
  "client_education",
] as const satisfies readonly PathwayLessonSection["kind"][];

export function premiumLessonHasClinicalScenarioSection(sections: PathwayLessonSection[]): boolean {
  for (const kind of PREMIUM_SCENARIO_KINDS) {
    const sec = sections.find((s) => s.kind === kind);
    if (sec?.body && bodyLooksLikeClinicalScenario(sec.body)) return true;
  }
  return false;
}

function lessonTextCorpus(lesson: Pick<PathwayLessonRecord, "sections" | "seoDescription" | "title" | "seoTitle">): string {
  const parts = [
    lesson.title ?? "",
    lesson.seoTitle ?? "",
    lesson.seoDescription ?? "",
    ...(lesson.sections ?? []).map((s) => `${s.heading ?? ""}\n${typeof s.body === "string" ? s.body : ""}`),
  ];
  return parts.join("\n\n");
}

/** Issues that block subscriber surfacing (merged into structural gate `issues`). */
export function evaluateLegacySubscriberReadinessIssues(lesson: PathwayLessonRecord): string[] {
  const issues: string[] = [];
  const corpus = lessonTextCorpus(lesson);
  if (corpusContainsBannedDevelopmentPhrases(corpus)) {
    issues.push("Lesson text contains development or placeholder phrasing that must be removed before publish.");
  }

  for (const kind of LEGACY_KIND_ORDER) {
    const sec = lesson.sections.find((s) => s.kind === kind);
    if (!sec) {
      issues.push(`Missing required legacy section: ${kind}`);
      continue;
    }
    const body = typeof sec.body === "string" ? sec.body : "";
    if (bodyIsPlaceholderOrTrivial(body)) {
      issues.push(`Legacy section "${kind}" is empty, trivial, or reads as a placeholder.`);
      continue;
    }
    const wc = countWords(stripToPlainText(body));
    const min = LEGACY_SUBSCRIBER_SECTION_FLOORS[kind];
    if (wc < min) {
      issues.push(`Legacy section "${kind}" is below the minimum depth (${wc} < ${min} words).`);
    }
    if (corpusContainsBannedDevelopmentPhrases(body)) {
      issues.push(`Legacy section "${kind}" contains banned development/placeholder phrasing.`);
    }
  }

  const scenario = lesson.sections.find((s) => s.kind === "clinical_scenario");
  if (!scenario?.body || !bodyLooksLikeClinicalScenario(scenario.body)) {
    issues.push(
      "Clinical scenario section must include a structured patient vignette (patient/client frame plus clinical context).",
    );
  }

  return issues;
}

export function evaluatePremiumSubscriberReadinessIssues(lesson: PathwayLessonRecord): string[] {
  const issues: string[] = [];
  const corpus = lessonTextCorpus(lesson);
  if (corpusContainsBannedDevelopmentPhrases(corpus)) {
    issues.push("Lesson text contains development or placeholder phrasing that must be removed before publish.");
  }
  if (!premiumLessonHasClinicalScenarioSection(lesson.sections)) {
    issues.push(
      "At least one premium section must include a structured clinical scenario (patient vignette with clinical decision context).",
    );
  }
  return issues;
}

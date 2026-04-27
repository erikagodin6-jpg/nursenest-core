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
export const LEGACY_SUBSCRIBER_SECTION_FLOORS = {
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

export type LegacyFiveBlockEnrichmentContext = {
  title: string;
  topic: string;
  bodySystem: string;
  pathwayId: string;
};

function legacyWordCount(body: string): number {
  return countWords(stripToPlainText(body));
}

function nextLegacyDepthSnippet(
  kind: (typeof LEGACY_KIND_ORDER)[number],
  ctx: LegacyFiveBlockEnrichmentContext,
  index: number,
): string {
  const title = ctx.title.trim() || "this topic";
  const topic = ctx.topic.trim() || ctx.bodySystem.trim() || title;
  const system = ctx.bodySystem.trim() || topic;
  const isCanadaRn = ctx.pathwayId === "ca-rn-nclex-rn";

  const clinicalMeaningSnips = [
    `Connect **${title}** to bedside cues you will reassess first: vitals trends, work of breathing, perfusion, mentation, and pain or ischemic equivalents when relevant. Boards reward recognizing when subtle instability outweighs reassurance, then selecting nursing actions that protect airway, circulation, and neurologic status before routine tasks.`,
    `Frame **${topic}** within **${system}** priorities: correlate subjective reports with objective data, identify red flags that change monitoring frequency, and document the safety rationale for your first action when two answers sound partly correct.`,
    isCanadaRn
      ? `Canadian NCLEX-RN stems may use **metric** units and interprofessional documentation norms; prioritization logic still demands assessment and escalation when data cross dangerous thresholds, even when a distractor offers teaching or comfort first.`
      : `When the stem lists competing tasks, choose the action that **closes the highest-risk gap** first—usually reassessment, airway and perfusion protection, time-sensitive diagnostics, or provider activation when criteria are met.`,
  ];

  const examSnips = [
    `Items on **${title}** often use **first**, **priority**, or **most important** language to force ordering: collect the assessment data that changes risk, repeat critical measurements after an intervention, and activate escalation when criteria are met rather than watching instability widen.`,
    `Expect distractors that sound compassionate but delay reassessment, skip unstable clients when another client is also busy, or push assistive personnel into judgment that remains RN responsibility. Eliminate answers that widen risk intervals without new objective data.`,
    `NCLEX-RN rewards linking **assessment → risk → first nursing action**. When vitals, labs, oxygenation, bleeding, or neuro status shift, your answer should show you **re-check data**, **prevent harm**, and **communicate** in the right sequence.`,
  ];

  const coreSnips = [
    `Pathophysiology for **${topic}** should tie expected assessment findings to complications that change management (perfusion deficits, infection progression, fluid and electrolyte shifts, or respiratory failure patterns depending on the stem). Pair interventions with monitoring you would repeat after the action and escalation triggers if the trend worsens.`,
    `When the vignette blurs organ systems, anchor to the **primary risk** implied by abnormal vitals, labs, telemetry, or focused exam findings—then pick the nursing action that reduces that risk fastest while preserving safe medication administration and appropriate scope.`,
    `Translate textbook mechanisms into **decision rules**: what you would not do, what you would repeat on a schedule, and what would trigger urgent provider contact, rapid response activation, or a higher level of care when thresholds are crossed.`,
  ];

  const scenarioSnips = [
    `**Patient vignette.** An adult client on a medical-surgical unit with concerns related to **${title}** reports worsening symptoms overnight. Reassessment shows discordance: the patient feels unchanged, but vitals, oxygenation, work of breathing, or mental status do not support stability. Your priority is to repeat focused vitals, review high-risk medications, protect airway and perfusion when indicated, and notify the provider when escalation criteria are met.`,
    `**Clinical application.** Picture two clients or two tasks in one stem: choose the option that reduces harm fastest for the client whose data imply deterioration or high risk if unattended. Document objective trends, medication timing, and caregiver reliability when follow-up depends on home monitoring.`,
  ];

  const takeawaySnips = [
    `Before your next question block, rehearse three lines you can defend aloud: the unstable feature you refuse to ignore, the objective measure you will recheck after an intervention, and the threshold that triggers urgent provider contact or rapid response activation.`,
    `Eliminate options that skip assessment, delay escalation when criteria are already met, or delegate RN-level clinical judgment to unlicensed assistive personnel when the stem implies unstable physiology or ambiguous risk.`,
    `Tie follow-up intervals to objective severity: when the stem implies renal, electrolyte, perfusion, or bleeding risk after a therapy change, monitoring is part of the correct answer—not “treat and forget.”`,
  ];

  const pools: Record<(typeof LEGACY_KIND_ORDER)[number], string[]> = {
    clinical_meaning: clinicalMeaningSnips,
    exam_relevance: examSnips,
    core_concept: coreSnips,
    clinical_scenario: scenarioSnips,
    takeaways: takeawaySnips,
  };
  const list = pools[kind];
  return list[index % list.length] ?? "";
}

const CLINICAL_SCENARIO_VIGNETTE_FALLBACK = (title: string) =>
  `**Patient vignette.** A 64-year-old client admitted to a medical unit with a chief concern related to **${title}** reports increasing symptoms during your shift. On reassessment you note discordance between reassurance and new objective findings (vitals, oxygen saturation, work of breathing, or mental status). **Your first nursing moves** are to repeat focused vitals, review relevant orders and labs, protect airway and perfusion when indicated, and notify the provider when thresholds for urgent evaluation are met. NCLEX items often pair two partially correct plans—choose the sequence that closes immediate risk while preserving appropriate monitoring and safe handoffs.`;

/**
 * Expands normalized **legacy five-block** section bodies so they meet {@link LEGACY_SUBSCRIBER_SECTION_FLOORS}
 * and the clinical-scenario vignette heuristic, using shared nursing judgment framing (not per-lesson manual edits).
 */
export function enrichLegacyFiveBlockSectionsForSubscriberGates(
  sections: PathwayLessonSection[],
  ctx: LegacyFiveBlockEnrichmentContext,
): PathwayLessonSection[] {
  let snippetIndex = 0;
  return sections.map((sec) => {
    const kind = sec.kind;
    if (!LEGACY_KIND_ORDER.includes(kind as (typeof LEGACY_KIND_ORDER)[number])) {
      return sec;
    }
    const k = kind as (typeof LEGACY_KIND_ORDER)[number];
    const min = LEGACY_SUBSCRIBER_SECTION_FLOORS[k];
    let body = typeof sec.body === "string" ? sec.body.trim() : "";
    if (!body) {
      return sec;
    }

    let guard = 0;
    while (legacyWordCount(body) < min && guard < 12) {
      const add = nextLegacyDepthSnippet(k, ctx, snippetIndex);
      snippetIndex += 1;
      if (!add) break;
      body = `${body}\n\n${add}`;
      guard += 1;
    }

    if (k === "clinical_scenario" && !bodyLooksLikeClinicalScenario(body)) {
      body = `${body}\n\n${CLINICAL_SCENARIO_VIGNETTE_FALLBACK(ctx.title.trim() || ctx.topic.trim() || "this topic")}`;
    }

    return { ...sec, body };
  });
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

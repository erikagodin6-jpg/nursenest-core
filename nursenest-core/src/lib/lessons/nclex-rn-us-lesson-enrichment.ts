import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** NCLEX-RN Client Needs groupings (NCSBN test plan) for US hub display only — does not alter catalog schema. */
export type NclexRnClientNeedsGroup =
  | "safe"
  | "health"
  | "psych"
  | "physio";

export type NclexRnPhysioSub = "pharm" | "risk_reduction" | "physio_adaptation";

export type NclexRnGroupedLesson = {
  group: NclexRnClientNeedsGroup;
  physioSub?: NclexRnPhysioSub;
  lesson: PathwayLessonRecord;
};

export type NclexRnDisplaySection = {
  anchor: string;
  title: string;
  subtitle: string;
  count: number;
  physioSub?: NclexRnPhysioSub;
  lessons: PathwayLessonRecord[];
};

export type NclexRnHubRegion = "us" | "ca";

function haystack(l: PathwayLessonRecord): string {
  return `${l.title} ${l.topic} ${l.topicSlug} ${l.bodySystem} ${l.slug}`.toLowerCase();
}

/** Map lesson metadata to Client Needs bucket for grouping and anchor nav. */
export function nclexRnClientNeedsForLesson(l: PathwayLessonRecord): {
  group: NclexRnClientNeedsGroup;
  physioSub?: NclexRnPhysioSub;
} {
  const h = haystack(l);
  if (/infection|isolation|precaution|ppe|hand.?hygiene|sterile|chain|contact|airborne|droplet/.test(h)) {
    return { group: "safe" };
  }
  if (/delegate|delegation|legal|ethical|leadership|manage|priorit|abc|scope|error|report|chain/.test(h)) {
    return { group: "safe" };
  }
  if (/immun|screen|growth|prenatal|maternal|well|health.?promo|education|prevent|vaccin|peds|development/.test(h)) {
    return { group: "health" };
  }
  if (/psych|mental|grief|abuse|therapeutic|cultural|crisis|substance|suicide|anxiety|depression/.test(h)) {
    return { group: "psych" };
  }
  if (/pharm|medication|drug|insulin|warfarin|opioid|infusion|parenteral|dosage/.test(h)) {
    return { group: "physio", physioSub: "pharm" };
  }
  if (/lab|risk|diagnostic|monitor|sensor|perioper|deteriorat|early.?warn/.test(h)) {
    return { group: "physio", physioSub: "risk_reduction" };
  }
  return { group: "physio", physioSub: "physio_adaptation" };
}

/** Build ordered sections for hub: four Client Needs areas; Physiological split by sub-focus when counts > 0. */
export function buildNclexRnUsLessonSections(lessons: PathwayLessonRecord[]): NclexRnDisplaySection[] {
  const safe: PathwayLessonRecord[] = [];
  const health: PathwayLessonRecord[] = [];
  const psych: PathwayLessonRecord[] = [];
  const physPharm: PathwayLessonRecord[] = [];
  const physRisk: PathwayLessonRecord[] = [];
  const physAdapt: PathwayLessonRecord[] = [];

  for (const l of lessons) {
    const m = nclexRnClientNeedsForLesson(l);
    if (m.group === "safe") safe.push(l);
    else if (m.group === "health") health.push(l);
    else if (m.group === "psych") psych.push(l);
    else if (m.group === "physio") {
      if (m.physioSub === "pharm") physPharm.push(l);
      else if (m.physioSub === "risk_reduction") physRisk.push(l);
      else physAdapt.push(l);
    }
  }

  const out: NclexRnDisplaySection[] = [];

  out.push({
    anchor: "client-safe",
    title: "Safe & Effective Care Environment",
    subtitle: "Delegation, prioritization, safety systems, infection control.",
    count: safe.length,
    lessons: safe,
  });
  out.push({
    anchor: "client-health",
    title: "Health Promotion & Maintenance",
    subtitle: "Screening, prevention, growth and development, patient education.",
    count: health.length,
    lessons: health,
  });
  out.push({
    anchor: "client-psych",
    title: "Psychosocial Integrity",
    subtitle: "Therapeutic communication, mental health, coping, ethics in context.",
    count: psych.length,
    lessons: psych,
  });

  const physioTitle = "Physiological Integrity";
  if (physPharm.length > 0) {
    out.push({
      anchor: "physio-pharm",
      title: physioTitle,
      subtitle: "Pharmacological & parenteral therapies",
      count: physPharm.length,
      physioSub: "pharm",
      lessons: physPharm,
    });
  }
  if (physRisk.length > 0) {
    out.push({
      anchor: "physio-risk",
      title: physioTitle,
      subtitle: "Reduction of risk potential",
      count: physRisk.length,
      physioSub: "risk_reduction",
      lessons: physRisk,
    });
  }
  if (physAdapt.length > 0) {
    out.push({
      anchor: "physio-adaptation",
      title: physioTitle,
      subtitle: "Physiological adaptation (organ systems, acute change)",
      count: physAdapt.length,
      physioSub: "physio_adaptation",
      lessons: physAdapt,
    });
  }

  return out;
}

export function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentence(text: string, max = 220): string {
  const t = stripInlineMarkdown(text);
  const cut = t.split(/(?<=[.!?])\s/)[0] ?? t;
  return cut.length > max ? `${cut.slice(0, max).trim()}…` : cut;
}

/** Exam-linked preview lines derived from existing section bodies (no schema change). */
export function nclexRnLessonExamPreview(
  l: PathwayLessonRecord,
  region: NclexRnHubRegion = "us",
): {
  scenarioType: string;
  examQuestionTypes: string;
  whyOnExam: string;
  miniScenario: string;
  rationaleSnippet: string;
} {
  const h = haystack(l);
  const intro = l.sections.find((s) => s.kind === "intro")?.body ?? "";
  const clinical = l.sections.find((s) => s.kind === "clinical_application")?.body ?? "";
  const core = l.sections.find((s) => s.kind === "core")?.body ?? "";
  const examTips = l.sections.find((s) => s.kind === "exam_tips")?.body ?? "";

  let scenarioType = "Clinical decision & prioritization";
  if (/respiratory|oxygen|breath|lung|copd|asthma/.test(h)) scenarioType = "Respiratory assessment & oxygenation decisions";
  if (/fluid|electrolyte|iv|volume|renal|k\+|potassium/.test(h)) scenarioType = "Fluid/electrolyte balance & IV therapy judgment";
  if (/cardiac|stem|mi|heart|ecg|arrhythm/.test(h)) scenarioType = "Acute cardiac presentation & monitoring priorities";
  if (/infection|isolation/.test(h)) scenarioType = "Infection prevention & isolation decisions";

  let examQuestionTypes = "Priority, best next action, NGN-style cases";
  if (/ngn|case|oxygen|respiratory/.test(h)) examQuestionTypes = "NGN case layers, priority, SATA (when multiple actions apply)";
  if (/fluid|electrolyte/.test(h)) examQuestionTypes = "Calculation-adjacent judgment, risk recognition, priority";

  const whyOnExam =
    region === "ca"
      ? "NCLEX-RN scores safe judgment under uncertainty—this lesson trains cues embedded in data-rich stems, including Canadian acute care language and SI units where the lesson notes them."
      : "NCLEX-RN reuses high-risk decision patterns (oxygenation, instability, escalation)—this lesson trains the cues those items hide in data-rich stems, not textbook definitions.";

  const miniScenario =
    clinical.length > 20
      ? firstSentence(clinical, 200)
      : intro.length > 20
        ? firstSentence(intro, 200)
        : firstSentence(l.seoDescription, 200);

  const rationaleSnippet =
    core.length > 20
      ? firstSentence(core, 180)
      : examTips.length > 10
        ? firstSentence(examTips, 180)
        : firstSentence(l.seoDescription, 180);

  return { scenarioType, examQuestionTypes, whyOnExam, miniScenario, rationaleSnippet };
}

/** Shared mistake blocks; Canada appends items to the first “all” group (registration / units context). */
export function nclexRnCommonMistakeBlocks(region: NclexRnHubRegion): { group: NclexRnClientNeedsGroup | "all"; items: string[] }[] {
  const caExtraAll = [
    "Misreading SI lab values (e.g., mmol/L) or Canadian protocol phrasing when the stem uses them explicitly.",
    "Applying US-only scope language from generic prep instead of the RN role and escalation cues your Canadian pathway expects.",
  ];
  if (region === "us") return NCLEX_RN_US_COMMON_MISTAKES;
  return NCLEX_RN_US_COMMON_MISTAKES.map((b) =>
    b.group === "all" ? { ...b, items: [...b.items, ...caExtraAll] } : b,
  );
}

export const NCLEX_RN_US_COMMON_MISTAKES: { group: NclexRnClientNeedsGroup | "all"; items: string[] }[] = [
  {
    group: "all",
    items: [
      "Selecting the most complex intervention when the stem rewards the safest immediate action (airway, bleeding, instability first).",
      "Treating a correct-but-less-urgent option as “more nursing” than a boring safety move that matches the cue.",
      "Missing deterioration patterns buried in vitals, SpO₂, or neuro status because the narrative feels routine.",
    ],
  },
  {
    group: "safe",
    items: [
      "Delegating assessment or teaching that must stay with the RN when the patient is unstable or consent is unclear.",
      "Choosing task completion over reporting a sentinel change (chain of command / escalation).",
    ],
  },
  {
    group: "physio",
    items: [
      "Mixing up oxygen targets across populations (e.g., COPD vs acute hypoxemia contexts in the stem).",
      "Picking a lab value answer without tying it to the patient risk and what you would do next in practice.",
    ],
  },
];

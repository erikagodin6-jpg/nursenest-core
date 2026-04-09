import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** Same Client Needs buckets as NCLEX-PN test plan; display-only. */
export type NclexPnClientNeedsGroup = "safe" | "health" | "psych" | "physio";

export type NclexPnPhysioSub = "pharm" | "risk_reduction" | "physio_adaptation";

export type NclexPnDisplaySection = {
  anchor: string;
  title: string;
  subtitle: string;
  count: number;
  physioSub?: NclexPnPhysioSub;
  lessons: PathwayLessonRecord[];
};

function haystack(l: PathwayLessonRecord): string {
  return `${l.title} ${l.topic} ${l.topicSlug} ${l.bodySystem} ${l.slug}`.toLowerCase();
}

/** LVN/LPN scope, delegation, and PN-level cues → Client Needs buckets. */
export function nclexPnClientNeedsForLesson(l: PathwayLessonRecord): {
  group: NclexPnClientNeedsGroup;
  physioSub?: NclexPnPhysioSub;
} {
  const h = haystack(l);
  if (
    /infection|isolation|precaution|ppe|hand.?hygiene|sterile|chain|contact|airborne|droplet|standard precaution/.test(h)
  ) {
    return { group: "safe" };
  }
  if (
    /delegate|delegation|lpn|lvn|pn |practical|vocational|uap|cna|scope|supervision|assign|report to rn|chain|error|incident/.test(
      h,
    )
  ) {
    return { group: "safe" };
  }
  if (/coordinated|management of care|ethical|legal|priorit|abc|first action/.test(h)) {
    return { group: "safe" };
  }
  if (/immun|screen|growth|prenatal|maternal|well|health.?promo|education|prevent|vaccin|peds|development/.test(h)) {
    return { group: "health" };
  }
  if (/psych|mental|grief|abuse|therapeutic|cultural|crisis|substance|anxiety|depression/.test(h)) {
    return { group: "psych" };
  }
  if (/pharm|medication|drug|insulin|injection|oral med|infusion|parenteral|dosage|five rights|mar/.test(h)) {
    return { group: "physio", physioSub: "pharm" };
  }
  if (/lab|risk|diagnostic|monitor|vital|assessment data|early.?warn|deteriorat/.test(h)) {
    return { group: "physio", physioSub: "risk_reduction" };
  }
  return { group: "physio", physioSub: "physio_adaptation" };
}

export function buildNclexPnUsLessonSections(lessons: PathwayLessonRecord[]): NclexPnDisplaySection[] {
  const safe: PathwayLessonRecord[] = [];
  const health: PathwayLessonRecord[] = [];
  const psych: PathwayLessonRecord[] = [];
  const physPharm: PathwayLessonRecord[] = [];
  const physRisk: PathwayLessonRecord[] = [];
  const physAdapt: PathwayLessonRecord[] = [];

  for (const l of lessons) {
    const m = nclexPnClientNeedsForLesson(l);
    if (m.group === "safe") safe.push(l);
    else if (m.group === "health") health.push(l);
    else if (m.group === "psych") psych.push(l);
    else if (m.group === "physio") {
      if (m.physioSub === "pharm") physPharm.push(l);
      else if (m.physioSub === "risk_reduction") physRisk.push(l);
      else physAdapt.push(l);
    }
  }

  const out: NclexPnDisplaySection[] = [];

  out.push({
    anchor: "pn-client-safe",
    title: "Safe & Effective Care Environment",
    subtitle: "Coordinated care, delegation, scope, infection control, safety sequencing.",
    count: safe.length,
    lessons: safe,
  });
  out.push({
    anchor: "pn-client-health",
    title: "Health Promotion & Maintenance",
    subtitle: "Screening, immunization, teaching, development.",
    count: health.length,
    lessons: health,
  });
  out.push({
    anchor: "pn-client-psych",
    title: "Psychosocial Integrity",
    subtitle: "Therapeutic communication, coping, abuse/neglect awareness.",
    count: psych.length,
    lessons: psych,
  });

  const physioTitle = "Physiological Integrity";
  if (physPharm.length > 0) {
    out.push({
      anchor: "pn-physio-pharm",
      title: physioTitle,
      subtitle: "Pharmacological therapies (within PN scope)",
      count: physPharm.length,
      physioSub: "pharm",
      lessons: physPharm,
    });
  }
  if (physRisk.length > 0) {
    out.push({
      anchor: "pn-physio-risk",
      title: physioTitle,
      subtitle: "Reduction of risk potential",
      count: physRisk.length,
      physioSub: "risk_reduction",
      lessons: physRisk,
    });
  }
  if (physAdapt.length > 0) {
    out.push({
      anchor: "pn-physio-adaptation",
      title: physioTitle,
      subtitle: "Basic care & physiological adaptation",
      count: physAdapt.length,
      physioSub: "physio_adaptation",
      lessons: physAdapt,
    });
  }

  return out;
}

export function stripInlineMarkdownPn(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSentencePn(text: string, max = 220): string {
  const t = stripInlineMarkdownPn(text);
  const cut = t.split(/(?<=[.!?])\s/)[0] ?? t;
  return cut.length > max ? `${cut.slice(0, max).trim()}…` : cut;
}

/** US NCLEX-PN vs Canada REx-PN — only affects learner-facing preview blurbs, not catalog slugs. */
export type NclexPnLessonPreviewFraming = "nclex-pn-us" | "rex-pn-ca";

export function nclexPnLessonExamPreview(
  l: PathwayLessonRecord,
  framing: NclexPnLessonPreviewFraming = "nclex-pn-us",
): {
  scenarioType: string;
  examQuestionTypes: string;
  whyOnExam: string;
  miniScenario: string;
  rationaleSnippet: string;
} {
  const ca = framing === "rex-pn-ca";
  const h = haystack(l);
  const intro = l.sections.find((s) => s.kind === "intro")?.body ?? "";
  const clinical = l.sections.find((s) => s.kind === "clinical_application")?.body ?? "";
  const core = l.sections.find((s) => s.kind === "core")?.body ?? "";
  const examTips = l.sections.find((s) => s.kind === "exam_tips")?.body ?? "";

  let scenarioType = "Prioritization & safe action within PN scope";
  if (/delegate|uap|cna|scope|assign|supervision|report/.test(h)) {
    scenarioType = "Delegation, assignment, and RN communication";
  }
  if (/med|insulin|injection|pharm|drug|mar|five rights/.test(h)) {
    scenarioType = ca
      ? "Medication administration and monitoring within PN (RPN) scope"
      : "Medication administration and monitoring within LVN/LPN role";
  }
  if (/infection|ppe|isolation|hand|sterile/.test(h)) {
    scenarioType = "Infection prevention and patient/environment safety";
  }
  if (/respiratory|oxygen|breath/.test(h)) scenarioType = "Respiratory monitoring & oxygen therapy within orders";
  if (/wound|skin|adl|bathing|mobility/.test(h)) scenarioType = "Basic care, skin integrity, and comfort";

  let examQuestionTypes = "Priority, best next action, delegation, SATA";
  if (/ngn|case|multiple tab/.test(h)) examQuestionTypes = "NGN-style cases, priority, SATA when several actions apply";
  if (/delegate|scope/.test(h)) {
    examQuestionTypes = ca
      ? "Delegation, scope boundaries, and collaboration per Canadian PN practice"
      : "Delegation to UAP, scope boundaries, escalation to RN";
  }

  const whyOnExam = ca
    ? "REx-PN rewards safe judgment at the practical nurse scope in Canada—recognition, monitoring, reporting, and escalation when care exceeds PN practice."
    : "NCLEX-PN rewards safe judgment at the practical nurse scope—knowing what you can do, what needs an RN, and what threatens the patient first.";

  const miniScenario =
    clinical.length > 20
      ? firstSentencePn(clinical, 200)
      : intro.length > 20
        ? firstSentencePn(intro, 200)
        : firstSentencePn(l.seoDescription, 200);

  const rationaleSnippet =
    core.length > 20
      ? firstSentencePn(core, 180)
      : examTips.length > 10
        ? firstSentencePn(examTips, 180)
        : firstSentencePn(l.seoDescription, 180);

  return { scenarioType, examQuestionTypes, whyOnExam, miniScenario, rationaleSnippet };
}

export const NCLEX_PN_US_COMMON_MISTAKES: { group: NclexPnClientNeedsGroup | "all"; items: string[] }[] = [
  {
    group: "all",
    items: [
      "Choosing the busiest task (finishing a skill) when the stem rewards stopping unsafe care or escalating to the RN first.",
      "Selecting an intervention that belongs to the RN or provider when your role is to observe, report, or carry out a specific order within scope.",
      "Confusing “helpful” with “priority”—basic comfort can wait when airway, bleeding, or sudden change is on the line.",
    ],
  },
  {
    group: "safe",
    items: [
      "Delegating assessment or teaching that must stay with the licensed nurse when the patient is unstable or the order is unclear.",
      "Assuming the UAP can “just check” findings that require licensed judgment (e.g., interpreting symptoms vs routine ADLs).",
    ],
  },
  {
    group: "physio",
    items: [
      "Picking a medication action without confirming order clarity, rights, and monitoring—PN items love unsafe sequencing.",
      "Treating a stable chronic picture as urgent when the stem adds an acute red flag (vitals, neuro, bleeding).",
    ],
  },
];

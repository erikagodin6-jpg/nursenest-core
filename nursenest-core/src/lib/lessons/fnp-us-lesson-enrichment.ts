import { pathwayLessonHasRenderableHubSlug, type PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/** Population bands for FNP board preparation (exam stems vary age; lessons map to primary focus). */
export type FnpLifespanGroup =
  | "prenatal_womens"
  | "pediatric"
  | "adolescent"
  | "adult"
  | "geriatric"
  | "lifespan_mixed";

/** AANP/ANCC-style competency lanes overlaid on lessons (display-only; does not change catalog schema). */
export type FnpClinicalDomain = "assessment" | "diagnosis" | "management" | "evaluation";

export type FnpEnrichedLesson = {
  lesson: PathwayLessonRecord;
  primaryLifespan: FnpLifespanGroup;
  /** Filter matching: a lesson can span multiple domains. */
  domains: FnpClinicalDomain[];
};

export const FNP_LIFESPAN_ORDER: { id: FnpLifespanGroup; label: string; shortLabel: string }[] = [
  { id: "prenatal_womens", label: "Prenatal / women’s health", shortLabel: "Prenatal / WH" },
  { id: "pediatric", label: "Pediatric", shortLabel: "Pediatric" },
  { id: "adolescent", label: "Adolescent", shortLabel: "Adolescent" },
  { id: "adult", label: "Adult", shortLabel: "Adult" },
  { id: "geriatric", label: "Geriatric", shortLabel: "Geriatric" },
  { id: "lifespan_mixed", label: "Lifespan-integrated primary care", shortLabel: "Lifespan" },
];

export const FNP_DOMAIN_ORDER: { id: FnpClinicalDomain; label: string }[] = [
  { id: "assessment", label: "Assessment" },
  { id: "diagnosis", label: "Diagnosis / differential" },
  { id: "management", label: "Management / plan" },
  { id: "evaluation", label: "Evaluation / follow-up" },
];

function haystack(l: PathwayLessonRecord): string {
  return `${l.title} ${l.topic} ${l.topicSlug} ${l.bodySystem} ${l.slug}`.toLowerCase();
}

function stripInlineMarkdown(s: string): string {
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

/** Explicit primary lifespan by slug when titles overlap (e.g., “family” vs pediatric). */
const SLUG_PRIMARY: Partial<Record<string, FnpLifespanGroup>> = {
  "fnp-differential-primary-care": "lifespan_mixed",
  "fnp-womens-prenatal-anemia-workup": "prenatal_womens",
  "fnp-pediatric-fever-urgency": "pediatric",
  "fnp-adolescent-mental-health-screening": "adolescent",
  "fnp-adult-hypertension-intensification": "adult",
  "fnp-geriatric-falls-syncope": "geriatric",
};

export function fnpPrimaryLifespanForLesson(l: PathwayLessonRecord): FnpLifespanGroup {
  const fromSlug = SLUG_PRIMARY[l.slug];
  if (fromSlug) return fromSlug;

  const h = haystack(l);
  if (/prenatal|pregnancy|gestation|obstet|women|lactation|prenatal|antenatal|gyn/.test(h)) return "prenatal_womens";
  if (/infant|neonat|toddler|pediatric|child|school-age|immunization schedule \(peds\)/.test(h)) return "pediatric";
  if (/adolescent|teen|confidentiality|school-based|transition age/.test(h)) return "adolescent";
  if (/geriatric|older adult|polypharm|falls|frail|nursing home|age-related/.test(h)) return "geriatric";
  if (/differential|primary care breadth|lifespan|family practice|all ages/.test(h)) return "lifespan_mixed";
  if (/adult|hypertension|diabetes|copd|cad|middle-aged/.test(h)) return "adult";
  return "adult";
}

export function fnpDomainsForLesson(l: PathwayLessonRecord): FnpClinicalDomain[] {
  const h = haystack(l);
  const d = new Set<FnpClinicalDomain>();
  if (/history|exam|screen|vitals|assessment|gather|monitoring|physical|listen|inspection|palpat/.test(h)) {
    d.add("assessment");
  }
  if (/diagnos|differential|criteria|rule out|dsm|icd|problem list|working diagnosis/.test(h)) {
    d.add("diagnosis");
  }
  if (/prescrib|dose|medication|plan|treat|refer|order|initiat|therapy|counsel|education|prevent/.test(h)) {
    d.add("management");
  }
  if (/follow|reassess|evaluate|outcome|return|adherence|safety net|callback|interval/.test(h)) {
    d.add("evaluation");
  }
  if (d.size === 0) {
    d.add("assessment");
    d.add("diagnosis");
  }
  return Array.from(d);
}

export function enrichFnpLessons(lessons: PathwayLessonRecord[]): FnpEnrichedLesson[] {
  return lessons.map((lesson) => ({
    lesson,
    primaryLifespan: fnpPrimaryLifespanForLesson(lesson),
    domains: fnpDomainsForLesson(lesson),
  }));
}

export function fnpLessonCountsByLifespan(enriched: FnpEnrichedLesson[]): Record<FnpLifespanGroup, number> {
  const counts: Record<FnpLifespanGroup, number> = {
    prenatal_womens: 0,
    pediatric: 0,
    adolescent: 0,
    adult: 0,
    geriatric: 0,
    lifespan_mixed: 0,
  };
  for (const e of enriched) {
    counts[e.primaryLifespan] += 1;
  }
  return counts;
}

export function fnpLessonCountsByDomain(enriched: FnpEnrichedLesson[]): Record<FnpClinicalDomain, number> {
  const counts: Record<FnpClinicalDomain, number> = {
    assessment: 0,
    diagnosis: 0,
    management: 0,
    evaluation: 0,
  };
  for (const e of enriched) {
    for (const dom of e.domains) {
      counts[dom] += 1;
    }
  }
  return counts;
}

export type FnpLifespanFilter = FnpLifespanGroup | "all";
export type FnpDomainFilter = FnpClinicalDomain | "all";

export function fnpEnrichedMatchesFilters(
  e: FnpEnrichedLesson,
  lifespan: FnpLifespanFilter,
  domain: FnpDomainFilter,
): boolean {
  if (lifespan !== "all" && e.primaryLifespan !== lifespan) return false;
  if (domain !== "all" && !e.domains.includes(domain)) return false;
  return true;
}

/** Provider-level preview lines for cards (distinct from RN “learn concept” framing). */
export function fnpLessonClinicalPreview(l: PathwayLessonRecord): {
  providerTasks: string;
  likelyQuestionTypes: string;
  whyBoards: string;
  miniScenario: string;
  sampleDecision: string;
  rationaleSnippet: string;
} {
  const h = haystack(l);
  const intro =
    l.sections.find((s) => s.kind === "intro" || s.kind === "clinical_meaning")?.body ?? "";
  const clinical =
    l.sections.find((s) => s.kind === "clinical_application" || s.kind === "clinical_scenario")?.body ?? "";
  const core = l.sections.find((s) => s.kind === "core" || s.kind === "core_concept")?.body ?? "";
  const examTips = l.sections.find((s) => s.kind === "exam_tips" || s.kind === "exam_relevance")?.body ?? "";

  let providerTasks =
    "Interpret data in a primary-care stem, narrow the differential, and commit to a defensible next step (including referral when scope or risk demands).";
  if (/prenatal|anemia|gestation|women/.test(h)) {
    providerTasks =
      "Apply trimester-appropriate workup, interpret CBC/iron studies in context, and decide escalation for maternal–fetal risk.";
  }
  if (/pediatric|fever|infant|child/.test(h)) {
    providerTasks =
      "Risk-stratify by age-specific vitals and appearance, choose diagnostics sparingly, and document parent safety-netting.";
  }
  if (/adolescent|mental|sti|confidential/.test(h)) {
    providerTasks =
      "Balance confidentiality with safety, screen with validated tools when indicated, and plan evidence-based management or referral.";
  }
  if (/hypertension|adult|pressure/.test(h)) {
    providerTasks =
      "Apply guideline thresholds, comorbidity-driven targets, and medication intensification rules—then schedule follow-up to evaluate response.";
  }
  if (/geriatric|falls|polypharm|syncope/.test(h)) {
    providerTasks =
      "Identify contributors (orthostasis, rhythm, medications), reduce harm (deprescribe when appropriate), and coordinate fall prevention.";
  }
  if (/differential|reasoning/.test(h)) {
    providerTasks =
      "Build a structured differential, rule in/out with targeted assessment, and select management matched to working diagnosis and risk.";
  }

  const likelyQuestionTypes =
    "Vignette-based selection of best next step; interpretation of labs/imaging; management vs referral; follow-up interval.";

  const whyBoards =
    "AANP and ANCC sample domains across assessment → diagnosis → plan → evaluation; items reward **decisions**, not recall of isolated facts.";

  const miniScenario =
    clinical.length > 25
      ? firstSentence(clinical, 200)
      : intro.length > 25
        ? firstSentence(intro, 200)
        : firstSentence(l.seoDescription, 200);

  const sampleDecision =
    core.length > 20
      ? firstSentence(core, 160)
      : firstSentence("Commit to the working diagnosis only after targeted data narrow competing explanations—then align treatment intensity with organ function, risk, and patient context.", 160);

  const rationaleSnippet =
    examTips.length > 15
      ? firstSentence(examTips, 180)
      : core.length > 15
        ? firstSentence(core, 180)
        : firstSentence(l.seoDescription, 180);

  return {
    providerTasks,
    likelyQuestionTypes,
    whyBoards,
    miniScenario,
    sampleDecision,
    rationaleSnippet,
  };
}

export type FnpClinicalPreviewBlock = ReturnType<typeof fnpLessonClinicalPreview>;

/** Hub cards only: no `sections` — full bodies stay server-side. Safe to pass to client components. */
export type FnpExplorerLesson = {
  meta: {
    slug: string;
    title: string;
    topic: string;
    topicSlug: string;
    bodySystem: string;
    seoDescription: string;
  };
  primaryLifespan: FnpLifespanGroup;
  domains: FnpClinicalDomain[];
  clinicalPreview: FnpClinicalPreviewBlock;
};

export function buildFnpExplorerPayload(lessons: PathwayLessonRecord[]): FnpExplorerLesson[] {
  return lessons.filter(pathwayLessonHasRenderableHubSlug).map((lesson) => ({
    meta: {
      slug: lesson.slug,
      title: lesson.title,
      topic: lesson.topic,
      topicSlug: lesson.topicSlug,
      bodySystem: lesson.bodySystem,
      seoDescription: lesson.seoDescription,
    },
    primaryLifespan: fnpPrimaryLifespanForLesson(lesson),
    domains: fnpDomainsForLesson(lesson),
    clinicalPreview: fnpLessonClinicalPreview(lesson),
  }));
}

export function fnpExplorerCounts(payload: FnpExplorerLesson[]): {
  countsLife: Record<FnpLifespanGroup, number>;
  countsDom: Record<FnpClinicalDomain, number>;
} {
  const countsLife: Record<FnpLifespanGroup, number> = {
    prenatal_womens: 0,
    pediatric: 0,
    adolescent: 0,
    adult: 0,
    geriatric: 0,
    lifespan_mixed: 0,
  };
  const countsDom: Record<FnpClinicalDomain, number> = {
    assessment: 0,
    diagnosis: 0,
    management: 0,
    evaluation: 0,
  };
  for (const e of payload) {
    countsLife[e.primaryLifespan] += 1;
    for (const dom of e.domains) {
      countsDom[dom] += 1;
    }
  }
  return { countsLife, countsDom };
}

export function fnpExplorerMatchesFilters(
  e: FnpExplorerLesson,
  lifespan: FnpLifespanFilter,
  domain: FnpDomainFilter,
): boolean {
  if (lifespan !== "all" && e.primaryLifespan !== lifespan) return false;
  if (domain !== "all" && !e.domains.includes(domain)) return false;
  return true;
}

export const FNP_NP_COMMON_MISTAKES: { heading: string; items: string[] }[] = [
  {
    heading: "Assessment gaps",
    items: [
      "Closing on a diagnosis before the stem’s key data are integrated (vitals trajectory, risk factors, medication list, pregnancy status).",
      "Missing **red-flag** patterns that should change the venue of care (e.g., unstable vitals, focal neuro deficit, thunderclap headache).",
    ],
  },
  {
    heading: "Diagnostic reasoning",
    items: [
      "Choosing the **most complex** workup when the stem rewards the **safest immediate** action or the **next best test** for pretest probability.",
      "Ignoring **age-specific** norms (peds vs geriatrics) when interpreting symptoms, screening, or drug choice.",
    ],
  },
  {
    heading: "Management balance",
    items: [
      "**Over-treating** (broad antibiotics, aggressive meds) without indication; **under-treating** when the stem shows clear guideline criteria for escalation.",
      "Forgetting **follow-up and evaluation**: boards often test whether the plan includes reassessment after a change.",
    ],
  },
];

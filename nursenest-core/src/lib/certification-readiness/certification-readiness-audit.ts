import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

import { ALLIED_READINESS_MANIFEST } from "@/lib/allied/allied-readiness-manifest";
import { nclexTier1FoundationalQuestions } from "@/content/questions/nclex-tier1-foundational-questions";
import { nclexTier2ClinicalJudgmentQuestions } from "@/content/questions/nclex-tier2-clinical-judgment-questions";
import { nclexTier3AdvancedReviewQuestions } from "@/content/questions/nclex-tier3-advanced-review-questions";
import { cnplePracticalNursingNgnExpansionQuestions } from "@/content/questions/cnple-practical-nursing-ngn-expansion";
import { pharmacyTechnicianQuestions } from "@/content/questions/allied-pharmacy-technician";
import { NCLEX_PN_GAP_QUESTIONS } from "@/content/questions/nclex-pn-gap-closure-questions";
import { CNPLE_GAP_FLASHCARDS } from "@/content/flashcards/cnple-gap-closure-flashcards";
import { NCLEX_PN_GAP_FLASHCARDS } from "@/content/flashcards/nclex-pn-gap-closure-flashcards";
import { PRE_NURSING_QUESTION_BANK } from "@/lib/pre-nursing/pre-nursing-question-bank";
import {
  scoreQuestionQuality,
  type QuestionQualityInput,
  type QuestionQualityScore,
} from "@/lib/questions/question-quality-score";

export type CertificationLaunchWindow = "Ready for Launch" | "Within 30 Days" | "Within 60 Days" | "Within 90 Days" | "Not Ready";

export type MonetizationGate =
  | "can_sell_now"
  | "needs_review"
  | "needs_content"
  | "needs_qa"
  | "needs_screenshots"
  | "needs_marketing"
  | "needs_analytics"
  | "needs_seo";

export type CertificationAuditTarget = {
  readonly id: string;
  readonly profession: "RN" | "RPN/LPN" | "NP" | "Allied Health";
  readonly pathway: string;
  readonly exam: string;
  readonly tags: readonly string[];
  readonly revenueWeight: number;
  readonly trafficWeight: number;
  readonly subscriptionWeight: number;
  readonly targets: Partial<Record<keyof CertificationInventoryCounts, number>>;
};

export type CertificationInventoryCounts = {
  readonly lessons: number;
  readonly flashcards: number;
  readonly questionBank: number;
  readonly sata: number;
  readonly matrix: number;
  readonly bowtie: number;
  readonly cat: number;
  readonly simulations: number;
  readonly ecg: number;
  readonly labs: number;
  readonly medicationMath: number;
  readonly pharmacology: number;
  readonly clinicalSkills: number;
  readonly carePlans: number;
  readonly conceptMaps: number;
  readonly caseStudies: number;
  readonly hotspotAssets: number;
};

export type CertificationReadinessScores = {
  readonly contentCompleteness: number;
  readonly contentQuality: number;
  readonly questionDiversity: number;
  readonly clinicalAccuracy: number;
  readonly ngnReadiness: number;
  readonly simulationReadiness: number;
  readonly analyticsReadiness: number;
  readonly monetizationReadiness: number;
  readonly overallReadiness: number;
};

export type CertificationGapAnalysis = {
  readonly missingBodySystems: readonly string[];
  readonly missingSpecialties: readonly string[];
  readonly missingNgnFormats: readonly string[];
  readonly missingSimulations: readonly string[];
  readonly missingLessons: readonly string[];
  readonly missingReadinessAnalytics: readonly string[];
  readonly missingScreenshots: readonly string[];
};

export type CertificationReadinessRow = {
  readonly target: CertificationAuditTarget;
  readonly inventory: CertificationInventoryCounts;
  readonly scores: CertificationReadinessScores;
  readonly launchWindow: CertificationLaunchWindow;
  readonly monetizationGates: readonly MonetizationGate[];
  readonly gapAnalysis: CertificationGapAnalysis;
  readonly commercializationPriority: number;
  readonly expectedTrafficPotential: number;
  readonly expectedSubscriptionPotential: number;
  readonly evidenceSources: readonly string[];
};

export type CertificationReadinessDashboard = {
  readonly generatedAt: string;
  readonly sourcePolicy: string;
  readonly rows: readonly CertificationReadinessRow[];
  readonly visualDashboards: Record<CertificationLaunchWindow, readonly CertificationReadinessRow[]>;
  readonly executiveSummary: {
    readonly top10LaunchReadyProducts: readonly CertificationReadinessRow[];
    readonly top10HighestValueGaps: readonly {
      readonly targetId: string;
      readonly pathway: string;
      readonly exam: string;
      readonly gap: string;
      readonly priority: number;
    }[];
    readonly estimatedCommercializationPriority: readonly CertificationReadinessRow[];
    readonly expectedTrafficPotential: readonly CertificationReadinessRow[];
    readonly expectedSubscriptionPotential: readonly CertificationReadinessRow[];
  };
};

const ZERO_COUNTS: CertificationInventoryCounts = {
  lessons: 0,
  flashcards: 0,
  questionBank: 0,
  sata: 0,
  matrix: 0,
  bowtie: 0,
  cat: 0,
  simulations: 0,
  ecg: 0,
  labs: 0,
  medicationMath: 0,
  pharmacology: 0,
  clinicalSkills: 0,
  carePlans: 0,
  conceptMaps: 0,
  caseStudies: 0,
  hotspotAssets: 0,
};

const BODY_SYSTEMS = [
  "cardiovascular",
  "respiratory",
  "neurological",
  "gastrointestinal",
  "endocrine",
  "renal",
  "musculoskeletal",
  "hematology",
  "oncology",
  "infectious disease",
  "mental health",
  "maternal",
  "pediatrics",
] as const;

const SPECIALTIES = [
  "medical-surgical",
  "pharmacology",
  "pediatrics",
  "maternal-newborn",
  "mental health",
  "critical care",
  "leadership",
  "community health",
  "professional practice",
] as const;

export const CERTIFICATION_AUDIT_TARGETS: readonly CertificationAuditTarget[] = [
  pathway("rn-nclex-rn", "RN", "NCLEX-RN", "NCLEX-RN", ["us-rn-nclex-rn", "nclex-rn"], 100, 100, 100, rnTargets()),
  pathway("rn-canadian-rn", "RN", "Canadian RN", "Canadian RN", ["ca-rn-nclex-rn", "canadian-rn"], 92, 90, 88, rnTargets()),
  pathway("pn-rex-pn", "RPN/LPN", "REx-PN", "REx-PN", ["ca-rpn-rex-pn", "rex-pn"], 88, 86, 84, pnTargets()),
  pathway("pn-nclex-pn", "RPN/LPN", "NCLEX-PN", "NCLEX-PN", ["us-lpn-nclex-pn", "nclex-pn"], 86, 84, 84, pnTargets()),
  pathway("np-cnple", "NP", "CNPLE", "CNPLE", ["ca-np-cnple", "cnple"], 76, 70, 72, npTargets()),
  pathway("np-fnp", "NP", "FNP", "FNP", ["us-np-fnp", "fnp"], 96, 88, 94, npTargets()),
  pathway("np-agpcnp", "NP", "AGPCNP", "AGPCNP", ["agpcnp"], 84, 76, 82, npTargets()),
  pathway("np-pmhnp", "NP", "PMHNP", "PMHNP", ["pmhnp"], 88, 82, 86, npTargets()),
  pathway("np-whnp", "NP", "WHNP", "WHNP", ["whnp"], 74, 70, 72, npTargets()),
  pathway("np-pnp-pc", "NP", "PNP-PC", "PNP-PC", ["pnp-pc"], 76, 72, 74, npTargets()),
  pathway("allied-rt", "Allied Health", "Respiratory Therapy", "RT", ["respiratory", "respiratory-therapy"], 78, 82, 76, alliedTargets()),
  pathway("allied-paramedic", "Allied Health", "Paramedicine", "Paramedic", ["paramedic", "emergency-medical-services"], 76, 78, 74, alliedTargets()),
  pathway("allied-ot", "Allied Health", "Occupational Therapy", "OT", ["occupational-therapy"], 70, 74, 70, alliedTargets()),
  pathway("allied-pt", "Allied Health", "Physiotherapy", "PT", ["physiotherapy", "physiotherapy-rehab"], 70, 74, 70, alliedTargets()),
  pathway("allied-mlt", "Allied Health", "Medical Laboratory Technology", "MLT", ["mlt", "medical-laboratory-technology"], 74, 80, 72, alliedTargets()),
  pathway("allied-psw", "Allied Health", "Personal Support Worker", "PSW", ["psw-hca", "psw"], 66, 68, 64, alliedTargets()),
];

function pathway(
  id: string,
  profession: CertificationAuditTarget["profession"],
  pathwayName: string,
  exam: string,
  tags: readonly string[],
  revenueWeight: number,
  trafficWeight: number,
  subscriptionWeight: number,
  targets: Partial<Record<keyof CertificationInventoryCounts, number>>,
): CertificationAuditTarget {
  return { id, profession, pathway: pathwayName, exam, tags, revenueWeight, trafficWeight, subscriptionWeight, targets };
}

function rnTargets(): Partial<Record<keyof CertificationInventoryCounts, number>> {
  return {
    lessons: 500,
    flashcards: 10000,
    questionBank: 8000,
    sata: 5000,
    matrix: 2000,
    bowtie: 2000,
    cat: 1,
    simulations: 250,
    ecg: 500,
    labs: 500,
    medicationMath: 150,
    pharmacology: 1500,
    clinicalSkills: 250,
    caseStudies: 250,
  };
}

function pnTargets(): Partial<Record<keyof CertificationInventoryCounts, number>> {
  return {
    lessons: 300,
    flashcards: 5000,
    questionBank: 4000,
    sata: 3000,
    matrix: 1500,
    bowtie: 1500,
    cat: 1,
    simulations: 150,
    labs: 250,
    medicationMath: 100,
    pharmacology: 750,
    clinicalSkills: 150,
    caseStudies: 150,
  };
}

function npTargets(): Partial<Record<keyof CertificationInventoryCounts, number>> {
  return {
    lessons: 250,
    flashcards: 3000,
    questionBank: 2000,
    sata: 1000,
    matrix: 500,
    bowtie: 500,
    cat: 1,
    simulations: 75,
    labs: 250,
    pharmacology: 500,
    clinicalSkills: 100,
    caseStudies: 150,
  };
}

function alliedTargets(): Partial<Record<keyof CertificationInventoryCounts, number>> {
  return {
    lessons: 150,
    flashcards: 1000,
    questionBank: 1000,
    sata: 500,
    matrix: 250,
    bowtie: 250,
    simulations: 50,
    labs: 100,
    clinicalSkills: 75,
    caseStudies: 75,
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function addCounts(a: CertificationInventoryCounts, b: Partial<CertificationInventoryCounts>): CertificationInventoryCounts {
  return {
    lessons: a.lessons + (b.lessons ?? 0),
    flashcards: a.flashcards + (b.flashcards ?? 0),
    questionBank: a.questionBank + (b.questionBank ?? 0),
    sata: a.sata + (b.sata ?? 0),
    matrix: a.matrix + (b.matrix ?? 0),
    bowtie: a.bowtie + (b.bowtie ?? 0),
    cat: a.cat + (b.cat ?? 0),
    simulations: a.simulations + (b.simulations ?? 0),
    ecg: a.ecg + (b.ecg ?? 0),
    labs: a.labs + (b.labs ?? 0),
    medicationMath: a.medicationMath + (b.medicationMath ?? 0),
    pharmacology: a.pharmacology + (b.pharmacology ?? 0),
    clinicalSkills: a.clinicalSkills + (b.clinicalSkills ?? 0),
    carePlans: a.carePlans + (b.carePlans ?? 0),
    conceptMaps: a.conceptMaps + (b.conceptMaps ?? 0),
    caseStudies: a.caseStudies + (b.caseStudies ?? 0),
    hotspotAssets: a.hotspotAssets + (b.hotspotAssets ?? 0),
  };
}

function completionScore(counts: CertificationInventoryCounts, targets: CertificationAuditTarget["targets"]): number {
  const entries = Object.entries(targets) as Array<[keyof CertificationInventoryCounts, number]>;
  if (!entries.length) return 0;
  const total = entries.reduce((sum, [key, target]) => sum + Math.min(1, counts[key] / Math.max(1, target)), 0);
  return clamp((total / entries.length) * 100);
}

type QuestionEvidence = {
  readonly pathwayIds: readonly string[];
  readonly question: QuestionQualityInput;
  readonly questionType: string;
  readonly domain: string;
  readonly topic: string;
};

function correctOptionText(question: { options?: readonly { id?: string; text?: string; correct?: boolean }[]; correctAnswer?: unknown }): string | string[] | null {
  const options = question.options ?? [];
  const correctOptions = options.filter((option) => option.correct).map((option) => option.text ?? option.id ?? "").filter(Boolean);
  if (correctOptions.length > 1) return correctOptions;
  return correctOptions[0] ?? String(question.correctAnswer ?? "");
}

function normalizeNclexQuestion(raw: any, pathwayIds: readonly string[]): QuestionEvidence {
  const wrongAnswers = raw.rationale?.wrongAnswers ?? {};
  const incorrect = Object.values(wrongAnswers).map(String);
  return {
    pathwayIds,
    questionType: raw.questionType ?? "mcq",
    domain: raw.domain ?? "",
    topic: raw.topic ?? "",
    question: {
      id: raw.id,
      stem: [raw.scenario, raw.stem].filter(Boolean).join(" "),
      options: raw.options?.map((option: { text: string }) => option.text) ?? [],
      correctAnswer: correctOptionText(raw),
      rationale: [
        raw.rationale?.correct,
        raw.rationale?.safetyPrinciple,
        raw.rationale?.prioritization,
        raw.rationale?.prioritizationLogic,
        raw.rationale?.safetyThinking,
        raw.rationale?.ngnReasoning,
        raw.rationale?.advancedNursingReasoning,
        raw.rationale?.escalationLogic,
      ]
        .filter(Boolean)
        .join(" "),
      whyCorrect: raw.rationale?.correct ?? null,
      whyIncorrect: incorrect,
      clinicalReasoning: raw.rationale?.prioritizationLogic ?? raw.rationale?.advancedNursingReasoning ?? raw.rationale?.ngnReasoning ?? null,
      patientSafetyImplications: raw.rationale?.safetyImplication ?? raw.rationale?.safetyThinking ?? raw.rationale?.safetyPrinciple ?? null,
      examStrategy: raw.noviceScopeGuardrail ?? raw.advancedScopeGuardrail ?? raw.entryLevelFocus ?? null,
      clinicalApplication: raw.scenario ?? raw.subtopic ?? null,
      clinicalPearl: raw.teachingPoint ?? null,
      hint: raw.hints?.[0] ?? null,
      topic: raw.topic ?? null,
      pathway: pathwayIds[0],
      profession: pathwayIds.some((id) => id.includes("pn")) ? "RPN/LPN" : "RN",
      questionType: raw.questionType ?? "mcq",
      relatedTopics: [raw.domain, raw.topic, raw.subtopic].filter(Boolean),
    },
  };
}

function normalizeCnpleQuestion(raw: any): QuestionEvidence {
  return {
    pathwayIds: ["pn-rex-pn", "np-cnple"],
    questionType: raw.questionType ?? "ngn",
    domain: raw.domain ?? "",
    topic: raw.topic ?? "",
    question: {
      id: raw.id,
      stem: [raw.scenario, raw.stem].filter(Boolean).join(" "),
      options: raw.options?.map((option: { text: string }) => option.text) ?? [],
      correctAnswer: raw.correctAnswer,
      rationale: [raw.rationale?.correct, raw.rationale?.pathophysiology, raw.rationale?.prioritizationLogic, raw.rationale?.safetyImplication]
        .filter(Boolean)
        .join(" "),
      whyCorrect: raw.rationale?.correct ?? null,
      whyIncorrect: raw.rationale?.wrongAnswers ?? null,
      clinicalReasoning: raw.rationale?.prioritizationLogic ?? null,
      patientSafetyImplications: raw.rationale?.safetyImplication ?? null,
      clinicalApplication: raw.scenario ?? null,
      clinicalPearl: raw.clinicalPearl ?? raw.teachingPoint ?? null,
      hint: raw.hints?.[0] ?? null,
      topic: raw.topic ?? null,
      pathway: "pn-rex-pn",
      profession: "RPN/LPN",
      questionType: raw.questionType ?? "ngn",
      relatedTopics: [raw.domain, raw.topic, raw.subtopic].filter(Boolean),
    },
  };
}

function normalizeBasicQuestion(raw: any, pathwayIds: readonly string[], profession: string): QuestionEvidence {
  return {
    pathwayIds,
    questionType: raw.questionType ?? "mcq",
    domain: raw.domain ?? raw.moduleSlug ?? "",
    topic: raw.topic ?? raw.moduleSlug ?? "",
    question: {
      id: raw.id,
      stem: raw.stem ?? raw.question ?? raw.prompt,
      options: raw.options?.map((option: unknown) => (typeof option === "string" ? option : (option as { text?: string }).text ?? "")) ?? [],
      correctAnswer: raw.correctAnswer ?? raw.correct,
      rationale: raw.rationale,
      whyCorrect: raw.rationale,
      whyIncorrect: raw.optionRationales ?? null,
      clinicalPearl: raw.clinicalPearl ?? raw.teachingPoint ?? null,
      hint: raw.hint ?? raw.hints?.[0] ?? null,
      topic: raw.topic ?? raw.moduleSlug ?? null,
      pathway: pathwayIds[0],
      profession,
      questionType: raw.questionType ?? "mcq",
      relatedTopics: [raw.domain, raw.topic, raw.moduleSlug].filter(Boolean),
    },
  };
}

function normalizeGapQuestion(raw: { id: string; stem: string; options: readonly string[]; correct: readonly number[]; rationale: string; whyCorrect: string; whyIncorrect: Record<string, string>; topic: string; lessonSlug: string; exam: string; domain: string; blueprintCategory: string; difficulty: number; questionType: string; weakAreaTag: string }, pathwayIds: readonly string[], profession: string): QuestionEvidence {
  return {
    pathwayIds: [...pathwayIds],
    questionType: raw.questionType,
    domain: raw.domain,
    topic: raw.topic,
    question: {
      id: raw.id,
      stem: raw.stem,
      options: [...raw.options],
      correctAnswer: raw.options[raw.correct[0] ?? 0] ?? String(raw.correct[0] ?? 0),
      rationale: raw.rationale,
      whyCorrect: raw.whyCorrect,
      whyIncorrect: raw.whyIncorrect,
      clinicalPearl: null,
      hint: null,
      topic: raw.topic,
      pathway: pathwayIds[0],
      profession,
      questionType: raw.questionType,
      relatedTopics: [raw.domain, raw.topic, raw.blueprintCategory, raw.weakAreaTag].filter(Boolean),
    },
  };
}

function collectQuestionEvidence(): readonly QuestionEvidence[] {
  return [
    ...nclexTier1FoundationalQuestions.flatMap((q) => {
      const pathways = q.exam.flatMap((exam) => (exam === "NCLEX-RN" ? ["rn-nclex-rn", "rn-canadian-rn"] : ["pn-nclex-pn"]));
      return normalizeNclexQuestion(q, pathways);
    }),
    ...nclexTier2ClinicalJudgmentQuestions.map((q) => normalizeNclexQuestion(q, ["rn-nclex-rn", "rn-canadian-rn"])),
    ...nclexTier3AdvancedReviewQuestions.map((q) => normalizeNclexQuestion(q, ["rn-nclex-rn", "rn-canadian-rn"])),
    ...cnplePracticalNursingNgnExpansionQuestions.map(normalizeCnpleQuestion),
    ...pharmacyTechnicianQuestions.map((q) => normalizeBasicQuestion(q, ["allied-pharmacy-technician"], "Allied Health")),
    ...PRE_NURSING_QUESTION_BANK.map((q) => normalizeBasicQuestion(q, ["pre-nursing"], "Pre-Nursing")),
    // Blueprint gap-closure question banks
    ...NCLEX_PN_GAP_QUESTIONS.map((q) => normalizeGapQuestion(q as any, ["pn-nclex-pn"], "RPN/LPN")),
  ];
}

/** Count gap-closure flashcards for a pathway target. */
function gapFlashcardCount(targetId: string): number {
  const pnIds = new Set(["pn-nclex-pn"]);
  const cnpleIds = new Set(["np-cnple"]);
  let count = 0;
  if (pnIds.has(targetId)) count += NCLEX_PN_GAP_FLASHCARDS.length;
  if (cnpleIds.has(targetId)) count += CNPLE_GAP_FLASHCARDS.length;
  return count;
}

function questionTypeCounts(evidence: readonly QuestionEvidence[], targetId: string): Partial<CertificationInventoryCounts> {
  const rows = evidence.filter((row) => row.pathwayIds.includes(targetId));
  const typeText = rows.map((row) => row.questionType.toLowerCase()).join(" ");
  const topicText = rows.map((row) => `${row.domain} ${row.topic}`.toLowerCase()).join(" ");
  return {
    questionBank: rows.length,
    sata: rows.filter((row) => /sata|select/.test(row.questionType.toLowerCase())).length,
    matrix: rows.filter((row) => /matrix|grid/.test(row.questionType.toLowerCase())).length,
    bowtie: rows.filter((row) => /bowtie|bow-tie/.test(row.questionType.toLowerCase())).length,
    caseStudies: rows.filter((row) => /case|scenario|chart-review|trend/.test(row.questionType.toLowerCase())).length,
    hotspotAssets: rows.filter((row) => /hotspot/.test(row.questionType.toLowerCase())).length,
    ecg: /ecg|telemetry|rhythm|cardiac/.test(topicText) ? rows.filter((row) => /ecg|telemetry|rhythm|cardiac/i.test(`${row.domain} ${row.topic}`)).length : 0,
    labs: rows.filter((row) => /lab|electrolyte|potassium|sodium|glucose|creatinine|hemoglobin|abg|inr/i.test(`${row.domain} ${row.topic}`)).length,
    pharmacology: rows.filter((row) => /pharm|medication|drug|insulin|anticoagulant|opioid|dose/i.test(`${row.domain} ${row.topic} ${row.question.stem}`)).length,
    medicationMath: rows.filter((row) => /calculation|dose|dosage|unit|mL|mg\/kg/i.test(`${row.domain} ${row.topic} ${row.question.stem}`)).length,
    cat: rows.length >= 150 ? 1 : 0,
    simulations: rows.filter((row) => /case|scenario|deterioration|trend/.test(row.questionType.toLowerCase()) || /deteriorat|shock|sepsis|rapid/i.test(String(row.question.stem))).length,
  };
}

function qualityScores(evidence: readonly QuestionEvidence[], targetId: string): readonly QuestionQualityScore[] {
  return evidence.filter((row) => row.pathwayIds.includes(targetId)).map((row) => scoreQuestionQuality(row.question));
}

function average(values: readonly number[], fallback = 0): number {
  return values.length ? clamp(values.reduce((sum, value) => sum + value, 0) / values.length) : fallback;
}

function readLessonCounts(rootDir: string): { counts: Record<string, number>; source: string } {
  const manifestPath = resolve(rootDir, "src/content/pathway-lessons/generated-indexes/manifest.json");
  const counts: Record<string, number> = {};
  if (!existsSync(manifestPath)) return { counts, source: "generated pathway lesson index manifest missing" };
  const parsed = JSON.parse(readFileSync(manifestPath, "utf8")) as { entries?: Array<{ pathwayId: string; lessonCount?: number }> };
  for (const entry of parsed.entries ?? []) counts[entry.pathwayId] = Number(entry.lessonCount ?? 0);
  return { counts, source: "src/content/pathway-lessons/generated-indexes/manifest.json" };
}

function listFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const fullPath = join(dir, name);
    const stat = statSync(fullPath);
    return stat.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function countFilesByNeedle(rootDir: string, dir: string, needles: readonly string[]): number {
  const fullDir = resolve(rootDir, dir);
  return listFiles(fullDir).filter((file) => {
    const haystack = `${file} ${safeRead(file).slice(0, 5000)}`.toLowerCase();
    return needles.some((needle) => haystack.includes(needle.toLowerCase()));
  }).length;
}

function safeRead(path: string): string {
  const extension = extname(path);
  if (![".md", ".json", ".ts", ".tsx"].includes(extension)) return "";
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function alliedReadinessFor(target: CertificationAuditTarget): number | null {
  const match = ALLIED_READINESS_MANIFEST.find((entry) => target.tags.includes(entry.professionKey) || target.tags.includes(entry.dedicatedCatalogFile ?? ""));
  return match?.percentComplete ?? null;
}

function evidenceCountsForTarget(
  rootDir: string,
  target: CertificationAuditTarget,
  lessonCounts: Record<string, number>,
  questionEvidence: readonly QuestionEvidence[],
): { counts: CertificationInventoryCounts; sources: string[]; scoredQuestions: readonly QuestionQualityScore[] } {
  let counts = { ...ZERO_COUNTS };
  const sources = new Set<string>();

  for (const tag of target.tags) {
    if (lessonCounts[tag]) {
      counts = addCounts(counts, { lessons: lessonCounts[tag] });
      sources.add(`lesson index:${tag}`);
    }
  }

  const questionCounts = questionTypeCounts(questionEvidence, target.id);
  if ((questionCounts.questionBank ?? 0) > 0) {
    counts = addCounts(counts, questionCounts);
    sources.add("static question catalogs");
  }

  // Gap-closure flashcard banks (blueprint gap closure 2026)
  const gapFlashcards = gapFlashcardCount(target.id);
  if (gapFlashcards > 0) {
    counts = addCounts(counts, { flashcards: gapFlashcards });
    sources.add("gap-closure flashcard catalogs");
  }

  const blogMatches = countFilesByNeedle(rootDir, "src/content/blog-static-longtail", target.tags);
  counts = addCounts(counts, { carePlans: 0, conceptMaps: 0 });
  if (blogMatches > 0) sources.add(`blog-static-longtail:${blogMatches}`);

  const allied = ALLIED_READINESS_MANIFEST.find((entry) => target.tags.includes(entry.professionKey) || target.tags.includes(entry.dedicatedCatalogFile ?? ""));
  if (allied) {
    counts = addCounts(counts, {
      lessons: Math.max(0, (allied.domains.coreCurriculum >= 95 ? target.targets.lessons ?? 0 : 0) - counts.lessons),
      simulations: Math.round(((target.targets.simulations ?? 50) * allied.domains.simulationReadiness) / 100),
      caseStudies: Math.round(((target.targets.caseStudies ?? 75) * allied.domains.assessmentReadiness) / 100),
    });
    sources.add("ALLIED_READINESS_MANIFEST");
  }

  const scoredQuestions = qualityScores(questionEvidence, target.id);
  return { counts, sources: Array.from(sources), scoredQuestions };
}

function scoreQuestionDiversity(counts: CertificationInventoryCounts): number {
  const weighted =
    (counts.questionBank > 0 ? 20 : 0) +
    (counts.sata > 0 ? 15 : 0) +
    (counts.matrix > 0 ? 15 : 0) +
    (counts.bowtie > 0 ? 15 : 0) +
    (counts.caseStudies > 0 ? 15 : 0) +
    (counts.hotspotAssets > 0 ? 10 : 0) +
    (counts.cat > 0 ? 10 : 0);
  return clamp(weighted);
}

function scoreNgn(counts: CertificationInventoryCounts): number {
  const totalNgn = counts.sata + counts.matrix + counts.bowtie + counts.caseStudies + counts.hotspotAssets;
  return counts.questionBank > 0 ? clamp((totalNgn / Math.max(1, counts.questionBank)) * 100) : 0;
}

function buildScores(
  target: CertificationAuditTarget,
  inventory: CertificationInventoryCounts,
  scoredQuestions: readonly QuestionQualityScore[],
): CertificationReadinessScores {
  const alliedReadiness = alliedReadinessFor(target);
  const contentCompleteness = completionScore(inventory, target.targets);
  const contentQuality = alliedReadiness ?? average(scoredQuestions.map((score) => score.score), inventory.lessons > 0 ? 55 : 0);
  const clinicalAccuracy = alliedReadiness ?? average(scoredQuestions.map((score) => score.dimensions.clinicalAccuracy), contentQuality);
  const questionDiversity = scoreQuestionDiversity(inventory);
  const ngnReadiness = scoreNgn(inventory);
  const simulationReadiness = target.targets.simulations ? clamp((inventory.simulations / target.targets.simulations) * 100) : 0;
  const analyticsReadiness = clamp((inventory.questionBank > 0 ? 35 : 0) + (inventory.cat > 0 ? 25 : 0) + (inventory.simulations > 0 ? 20 : 0) + (inventory.caseStudies > 0 ? 20 : 0));
  const monetizationReadiness = clamp(
    (contentCompleteness >= 95 ? 30 : contentCompleteness >= 60 ? 15 : 0) +
      (contentQuality >= 90 ? 25 : contentQuality >= 75 ? 12 : 0) +
      (questionDiversity >= 70 ? 15 : 0) +
      (simulationReadiness >= 85 ? 15 : 0) +
      (analyticsReadiness >= 80 ? 15 : 0),
  );
  const overallReadiness = clamp(
    contentCompleteness * 0.24 +
      contentQuality * 0.2 +
      questionDiversity * 0.12 +
      clinicalAccuracy * 0.12 +
      ngnReadiness * 0.1 +
      simulationReadiness * 0.1 +
      analyticsReadiness * 0.06 +
      monetizationReadiness * 0.06,
  );
  return {
    contentCompleteness,
    contentQuality,
    questionDiversity,
    clinicalAccuracy,
    ngnReadiness,
    simulationReadiness,
    analyticsReadiness,
    monetizationReadiness,
    overallReadiness,
  };
}

function launchWindow(score: number): CertificationLaunchWindow {
  if (score >= 95) return "Ready for Launch";
  if (score >= 85) return "Within 30 Days";
  if (score >= 75) return "Within 60 Days";
  if (score >= 60) return "Within 90 Days";
  return "Not Ready";
}

function gatesFor(scores: CertificationReadinessScores, gaps: CertificationGapAnalysis): MonetizationGate[] {
  const gates: MonetizationGate[] = [];
  if (scores.overallReadiness >= 95 && scores.monetizationReadiness >= 95 && gaps.missingScreenshots.length === 0) gates.push("can_sell_now");
  if (scores.contentCompleteness < 75) gates.push("needs_content");
  if (scores.contentQuality < 90 || scores.clinicalAccuracy < 95) gates.push("needs_qa");
  if (scores.analyticsReadiness < 80) gates.push("needs_analytics");
  if (scores.overallReadiness < 95) gates.push("needs_review");
  if (gaps.missingScreenshots.length > 0) gates.push("needs_screenshots");
  gates.push("needs_marketing", "needs_seo");
  return Array.from(new Set(gates));
}

function missingFromCounts(
  target: CertificationAuditTarget,
  inventory: CertificationInventoryCounts,
  keys: readonly (keyof CertificationInventoryCounts)[],
): string[] {
  return keys
    .filter((key) => (inventory[key] ?? 0) < (target.targets[key] ?? 1))
    .map((key) => `${key}: ${inventory[key]} / ${target.targets[key] ?? 1}`);
}

function buildGapAnalysis(target: CertificationAuditTarget, inventory: CertificationInventoryCounts, evidence: readonly QuestionEvidence[]): CertificationGapAnalysis {
  const targetQuestions = evidence.filter((row) => row.pathwayIds.includes(target.id));
  const text = targetQuestions.map((row) => `${row.domain} ${row.topic}`.toLowerCase()).join(" ");
  return {
    missingBodySystems: BODY_SYSTEMS.filter((system) => !text.includes(system) && target.profession !== "Allied Health"),
    missingSpecialties: SPECIALTIES.filter((specialty) => !text.includes(specialty) && target.profession !== "Allied Health"),
    missingNgnFormats: missingFromCounts(target, inventory, ["sata", "matrix", "bowtie", "hotspotAssets"]),
    missingSimulations: missingFromCounts(target, inventory, ["simulations"]),
    missingLessons: missingFromCounts(target, inventory, ["lessons"]),
    missingReadinessAnalytics: inventory.cat > 0 && inventory.caseStudies > 0 ? [] : ["CAT/case-based analytics evidence is incomplete."],
    missingScreenshots: ["No repository evidence of pathway-specific commercial screenshot inventory in this audit."],
  };
}

function commercialPriority(target: CertificationAuditTarget, scores: CertificationReadinessScores): number {
  return clamp(target.revenueWeight * 0.35 + target.trafficWeight * 0.2 + target.subscriptionWeight * 0.25 + scores.overallReadiness * 0.2);
}

function valueGaps(row: CertificationReadinessRow): Array<{ targetId: string; pathway: string; exam: string; gap: string; priority: number }> {
  const weighted = row.commercializationPriority;
  const gaps = [
    ...row.gapAnalysis.missingNgnFormats.slice(0, 3),
    ...row.gapAnalysis.missingSimulations.slice(0, 2),
    ...row.gapAnalysis.missingLessons.slice(0, 2),
    ...row.gapAnalysis.missingReadinessAnalytics.slice(0, 1),
    ...row.gapAnalysis.missingScreenshots.slice(0, 1),
  ];
  return gaps.map((gap, index) => ({
    targetId: row.target.id,
    pathway: row.target.pathway,
    exam: row.target.exam,
    gap,
    priority: clamp(weighted - index * 3),
  }));
}

export function buildCertificationReadinessDashboard(rootDir = process.cwd()): CertificationReadinessDashboard {
  const { counts: lessonCounts, source: lessonSource } = readLessonCounts(rootDir);
  const questionEvidence = collectQuestionEvidence();

  const rows = CERTIFICATION_AUDIT_TARGETS.map((target): CertificationReadinessRow => {
    const evidence = evidenceCountsForTarget(rootDir, target, lessonCounts, questionEvidence);
    const inventory = evidence.counts;
    const scores = buildScores(target, inventory, evidence.scoredQuestions);
    const gapAnalysis = buildGapAnalysis(target, inventory, questionEvidence);
    const commercializationPriority = commercialPriority(target, scores);
    return {
      target,
      inventory,
      scores,
      launchWindow: launchWindow(scores.overallReadiness),
      monetizationGates: gatesFor(scores, gapAnalysis),
      gapAnalysis,
      commercializationPriority,
      expectedTrafficPotential: clamp(target.trafficWeight * 0.75 + scores.overallReadiness * 0.25),
      expectedSubscriptionPotential: clamp(target.subscriptionWeight * 0.8 + scores.monetizationReadiness * 0.2),
      evidenceSources: [lessonSource, ...evidence.sources],
    };
  });

  const windows: CertificationLaunchWindow[] = ["Ready for Launch", "Within 30 Days", "Within 60 Days", "Within 90 Days", "Not Ready"];
  const visualDashboards: Record<CertificationLaunchWindow, readonly CertificationReadinessRow[]> = {
    "Ready for Launch": [],
    "Within 30 Days": [],
    "Within 60 Days": [],
    "Within 90 Days": [],
    "Not Ready": [],
  };
  for (const window of windows) {
    visualDashboards[window] = rows.filter((row) => row.launchWindow === window).sort((a, b) => b.commercializationPriority - a.commercializationPriority);
  }

  return {
    generatedAt: new Date().toISOString(),
    sourcePolicy:
      "Repository-evidenced static audit only. Counts come from generated lesson indexes, static question catalogs, allied readiness manifests, and static content files; DB-only runtime content is not guessed.",
    rows,
    visualDashboards,
    executiveSummary: {
      top10LaunchReadyProducts: rows
        .filter((row) => row.launchWindow === "Ready for Launch")
        .sort((a, b) => b.commercializationPriority - a.commercializationPriority)
        .slice(0, 10),
      top10HighestValueGaps: rows.flatMap(valueGaps).sort((a, b) => b.priority - a.priority).slice(0, 10),
      estimatedCommercializationPriority: rows.slice().sort((a, b) => b.commercializationPriority - a.commercializationPriority).slice(0, 10),
      expectedTrafficPotential: rows.slice().sort((a, b) => b.expectedTrafficPotential - a.expectedTrafficPotential).slice(0, 10),
      expectedSubscriptionPotential: rows.slice().sort((a, b) => b.expectedSubscriptionPotential - a.expectedSubscriptionPotential).slice(0, 10),
    },
  };
}

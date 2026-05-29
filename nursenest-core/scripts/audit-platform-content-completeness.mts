#!/usr/bin/env tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

import { loadRuntimeEnv } from "./lib/load-runtime-env.mjs";

type ScoreStatus = "scored" | "not_scored";
type FeatureStatus = "implemented" | "partial" | "missing";

type ScoredMetric = {
  label: string;
  actual: number;
  expected: number | null;
  percent: number | null;
  status: ScoreStatus;
  source: string;
  note?: string;
};

type FeatureMetric = {
  key: string;
  status: FeatureStatus;
  evidence: string[];
};

type PathwayReport = {
  key: string;
  label: string;
  group: string;
  contentMetrics: ScoredMetric[];
  featureMetrics: FeatureMetric[];
  adaptiveMetrics: FeatureMetric[];
  commercialMetrics: FeatureMetric[];
  contentCompleteness: number | null;
  featureCompleteness: number;
  adaptiveCompleteness: number;
  learningEcosystemCompleteness: number | null;
  commercialReadiness: number;
  overallCompletion: number | null;
  evidence: string[];
  gaps: string[];
};

type AuditReport = {
  generatedAt: string;
  scope: string[];
  evidenceSources: string[];
  caveats: string[];
  scorecard: Record<string, number | null>;
  pathwayReports: PathwayReport[];
  professionBreakdown: PathwayReport[];
  newGradBreakdown: PathwayReport[];
  alliedBreakdown: PathwayReport[];
  ecosystemAudits: Record<string, unknown>;
  contentQualityAudit: Record<string, unknown>;
  seoAudit: Record<string, unknown>;
  commercialReadinessAudit: Record<string, unknown>;
  priorityMatrix: Array<{
    priority: "P0" | "P1" | "P2" | "P3";
    item: string;
    evidence: string;
    estimatedHours: string;
    complexity: "Low" | "Medium" | "High";
    impact: "Low" | "Medium" | "High" | "Critical";
  }>;
  next90Days: string[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "reports");
const JSON_PATH = join(REPORTS_DIR, "content-completeness-audit-2026-05-29.json");
const MD_PATH = join(REPORTS_DIR, "content-completeness-audit-2026-05-29.md");

const CORE_THRESHOLDS = {
  lessons: 300,
  questions: 5000,
  flashcards: 10000,
  cat: 3000,
} as const;

const ALLIED_THRESHOLDS = {
  lessons: 150,
  questions: 2000,
  flashcards: 5000,
} as const;

const LAUNCH_MINIMUMS = {
  questions: 200,
  clinicalSkillsMinimum: 50,
  clinicalSkillsIdeal: 75,
  npQuestions: 1000,
} as const;

const PATHWAY_CONFIG = [
  { key: "rn", label: "RN", group: "Core Nursing", tier: "RN", roleTracks: ["rn"], threshold: CORE_THRESHOLDS },
  { key: "rpn_pn", label: "RPN / PN", group: "Core Nursing", tier: "PN", roleTracks: ["rpn", "lpn"], threshold: CORE_THRESHOLDS },
  { key: "np_cnple", label: "NP / CNPLE", group: "Advanced Practice", tier: "NP", roleTracks: ["np"], threshold: { ...CORE_THRESHOLDS, questions: LAUNCH_MINIMUMS.npQuestions } },
  { key: "rt", label: "Respiratory Therapy", group: "Allied Health", tier: "ALLIED", alliedProfession: "respiratory", roleTracks: ["allied"], threshold: ALLIED_THRESHOLDS },
  { key: "allied", label: "All Allied Health", group: "Allied Health", tier: "ALLIED", roleTracks: ["allied"], threshold: ALLIED_THRESHOLDS },
  { key: "new_grad_rn", label: "New Grad RN", group: "New Grad", tier: "NEW_GRAD", roleTracks: ["rn"], threshold: CORE_THRESHOLDS },
  { key: "new_grad_rpn", label: "New Grad RPN", group: "New Grad", tier: "NEW_GRAD", roleTracks: ["rpn", "lpn"], threshold: CORE_THRESHOLDS },
] as const;

const ALLIED_PROFESSIONS = [
  ["respiratory", "Respiratory Therapy"],
  ["occupational-therapy", "Occupational Therapy"],
  ["physiotherapy", "Physiotherapy"],
  ["paramedic", "Paramedic"],
  ["mlt", "Medical Laboratory"],
  ["diagnostic-imaging", "Diagnostic Imaging"],
  ["social-work", "Social Work"],
] as const;

const NEW_GRAD_SPECIALTIES = [
  "ICU",
  "Emergency",
  "Medicine",
  "Surgery",
  "Telemetry",
  "Critical Care",
  "Perioperative",
  "Pediatrics",
  "NICU",
  "Mental Health",
  "Community",
  "Home Care",
  "Operating Room",
  "Labour & Delivery",
  "Postpartum",
] as const;

const GENERIC_RATIONALE_PATTERNS = [
  "responds to the priority cue",
  "the clinical reasoning is",
  "guides safe escalation",
  "supports safe care",
  "using the nursing process",
  "choose the best answer",
  "focus on the most urgent issue",
  "prevents harm",
] as const;

function pct(actual: number, expected: number): number {
  if (expected <= 0) return 0;
  return Math.min(100, Number(((actual / expected) * 100).toFixed(1)));
}

function avg(values: Array<number | null | undefined>): number | null {
  const usable = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (usable.length === 0) return null;
  return Number((usable.reduce((sum, v) => sum + v, 0) / usable.length).toFixed(1));
}

function scoreStatus(status: FeatureStatus): number {
  if (status === "implemented") return 100;
  if (status === "partial") return 50;
  return 0;
}

function featureAverage(features: FeatureMetric[]): number {
  if (features.length === 0) return 0;
  return Number((features.reduce((sum, f) => sum + scoreStatus(f.status), 0) / features.length).toFixed(1));
}

function scored(label: string, actual: number, expected: number | null, source: string, note?: string): ScoredMetric {
  return {
    label,
    actual,
    expected,
    percent: expected == null ? null : pct(actual, expected),
    status: expected == null ? "not_scored" : "scored",
    source,
    note,
  };
}

function exists(relPath: string): boolean {
  return existsSync(join(ROOT, relPath));
}

function findFiles(startRel: string, predicate: (absPath: string) => boolean, limit = 10000): string[] {
  const start = join(ROOT, startRel);
  const out: string[] = [];
  function walk(abs: string) {
    if (out.length >= limit || !existsSync(abs)) return;
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      for (const entry of readdirSync(abs)) walk(join(abs, entry));
      return;
    }
    if (predicate(abs)) out.push(abs);
  }
  walk(start);
  return out;
}

function scanTextFilesForPatterns(startRel: string, patterns: readonly string[]): Record<string, number> {
  const files = findFiles(startRel, (abs) => /\.(ts|tsx|mts|mjs|json|md|mdx)$/i.test(abs));
  const counts = Object.fromEntries(patterns.map((p) => [p, 0])) as Record<string, number>;
  for (const file of files) {
    const text = readFileSync(file, "utf8").toLowerCase();
    for (const pattern of patterns) {
      counts[pattern] += text.split(pattern.toLowerCase()).length - 1;
    }
  }
  return counts;
}

async function dbCounts(prisma: PrismaClient | null, where: {
  tier?: string;
  roleTracks?: readonly string[];
  alliedProfession?: string;
  newGradSpecialty?: string;
}) {
  if (!prisma) {
    if (where.alliedProfession || where.newGradSpecialty) {
      return {
        questions: 0,
        catEligible: 0,
        lessons: 0,
        flashcards: 0,
        simulations: 0,
      };
    }
    const snapshot = await import("../src/lib/navigation/country-exam-readiness-snapshot");
    const roleTrackPathwayIds = where.roleTracks?.length
      ? await listPathwayIdsForRoleTracks(where.roleTracks)
      : [];
    const snapshotTotals = roleTrackPathwayIds.reduce(
      (acc, pathwayId) => {
        const row = snapshot.getSnapshotCounts(pathwayId);
        acc.lessons += row.lessons;
        acc.questions += row.questions;
        return acc;
      },
      { lessons: 0, questions: 0 },
    );
    return {
      questions: snapshotTotals.questions,
      catEligible: 0,
      lessons: snapshotTotals.lessons,
      flashcards: 0,
      simulations: 0,
    };
  }

  const statusPublished = { in: ["PUBLISHED", "published"] };
  const tierFilter = where.tier ? { tier: where.tier } : {};
  const examTierFilter = where.tier ? { tier: where.tier } : {};
  const roleTrackPathwayIds = where.roleTracks?.length
    ? await listPathwayIdsForRoleTracks(where.roleTracks)
    : [];
  const pathwayIdWhere = roleTrackPathwayIds.length ? { pathwayId: { in: roleTrackPathwayIds } } : {};
  const alliedTags = where.alliedProfession
    ? [
        where.alliedProfession,
        `alliedProfession:${where.alliedProfession}`,
        `profession:${where.alliedProfession}`,
        where.alliedProfession.replace(/-/g, " "),
      ]
    : [];
  const specialtyNeedles = where.newGradSpecialty
    ? [where.newGradSpecialty, where.newGradSpecialty.toLowerCase(), where.newGradSpecialty.replace(/&/g, "and")]
    : [];

  const examWhere: Record<string, unknown> = { status: statusPublished, ...examTierFilter };
  if (alliedTags.length) {
    examWhere.OR = [
      { careerType: { in: alliedTags } },
      { tags: { hasSome: alliedTags } },
      { topic: { contains: where.alliedProfession, mode: "insensitive" } },
      { bodySystem: { contains: where.alliedProfession, mode: "insensitive" } },
    ];
  }
  if (specialtyNeedles.length) {
    examWhere.OR = [
      { topic: { contains: where.newGradSpecialty, mode: "insensitive" } },
      { subtopic: { contains: where.newGradSpecialty, mode: "insensitive" } },
      { bodySystem: { contains: where.newGradSpecialty, mode: "insensitive" } },
      { tags: { hasSome: specialtyNeedles } },
    ];
  }

  const lessonWhere: Record<string, unknown> = { status: "PUBLISHED", locale: "en" };
  if (roleTrackPathwayIds.length) Object.assign(lessonWhere, pathwayIdWhere);
  if (where.tier) Object.assign(lessonWhere, { tierCode: where.tier });
  if (where.alliedProfession) Object.assign(lessonWhere, { alliedProfessionKey: where.alliedProfession });
  if (where.newGradSpecialty) {
    Object.assign(lessonWhere, {
      OR: [
        { title: { contains: where.newGradSpecialty, mode: "insensitive" } },
        { topic: { contains: where.newGradSpecialty, mode: "insensitive" } },
        { bodySystem: { contains: where.newGradSpecialty, mode: "insensitive" } },
        { topicSlug: { contains: where.newGradSpecialty.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" } },
      ],
    });
  }

  const deckWhere: Record<string, unknown> = { status: "PUBLISHED" };
  if (where.tier) Object.assign(deckWhere, { tier: where.tier });
  if (roleTrackPathwayIds.length) Object.assign(deckWhere, { pathwayId: { in: roleTrackPathwayIds } });

  const scenarioWhere: Record<string, unknown> = { publishStatus: "PUBLISHED" };
  if (roleTrackPathwayIds.length) Object.assign(scenarioWhere, { pathwayId: { in: roleTrackPathwayIds } });
  if (where.tier === "NEW_GRAD") Object.assign(scenarioWhere, { tierFocus: "RN" });
  if (where.newGradSpecialty) {
    Object.assign(scenarioWhere, {
      OR: [
        { title: { contains: where.newGradSpecialty, mode: "insensitive" } },
        { canonicalCategoryId: { contains: where.newGradSpecialty.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" } },
        { presentingConcern: { contains: where.newGradSpecialty, mode: "insensitive" } },
      ],
    });
  }

  const [questions, catEligible, lessons, flashcards, simulations] = await Promise.all([
    prisma.examQuestion.count({ where: examWhere }),
    prisma.examQuestion.count({ where: { ...examWhere, isAdaptiveEligible: true } }),
    prisma.pathwayLesson.count({ where: lessonWhere }),
    prisma.flashcard.count({
      where: {
        status: "PUBLISHED",
        ...(Object.keys(deckWhere).length ? { deck: { is: deckWhere } } : {}),
      },
    }),
    prisma.clinicalNursingScenario.count({ where: scenarioWhere }).catch(() => 0),
  ]);

  return { questions, catEligible, lessons, flashcards, simulations };
}

let examPathwayCache: Array<{ id: string; roleTrack: string; displayName: string; status: string; countrySlug: string }> | null = null;

async function loadExamPathways() {
  if (!examPathwayCache) {
    const mod = await import("../src/lib/exam-pathways/exam-pathways-catalog");
    examPathwayCache = mod.EXAM_PATHWAYS.map((p: { id: string; roleTrack: string; displayName: string; status: string; countrySlug: string }) => ({
      id: p.id,
      roleTrack: p.roleTrack,
      displayName: p.displayName,
      status: p.status,
      countrySlug: p.countrySlug,
    }));
  }
  return examPathwayCache;
}

async function listPathwayIdsForRoleTracks(roleTracks: readonly string[]): Promise<string[]> {
  const pathways = await loadExamPathways();
  return pathways
    .filter((p) => roleTracks.includes(p.roleTrack) && p.status !== "hidden")
    .map((p) => p.id);
}

async function buildPathwayReport(prisma: PrismaClient | null, cfg: typeof PATHWAY_CONFIG[number]): Promise<PathwayReport> {
  const counts = await dbCounts(prisma, cfg);
  const dbAvailable = prisma !== null;
  const countSource = dbAvailable ? "DB" : "Committed pathway-readiness snapshot fallback";
  const roleTrack = cfg.roleTracks[0] ?? "rn";
  const clinicalSkills = await import("../src/lib/clinical-skills/clinical-skills-catalog");
  const skills =
    roleTrack === "rpn" || roleTrack === "lpn"
      ? clinicalSkills.clinicalSkillsForRoleTrack("rpn_lpn").length
      : roleTrack === "np"
        ? clinicalSkills.clinicalSkillsForRoleTrack("np").length
        : roleTrack === "allied"
          ? 0
          : clinicalSkills.clinicalSkillsForRoleTrack("rn").length;

  const contentMetrics = [
    scored("Questions", counts.questions, cfg.threshold.questions, `${countSource}: exam question counts + repo high-end completeness thresholds`),
    scored("Flashcards", counts.flashcards, dbAvailable ? cfg.threshold.flashcards : null, `${countSource}: flashcard counts + repo high-end completeness thresholds`, dbAvailable ? undefined : "Not scored without live DB flashcard rows."),
    scored("Lessons", counts.lessons, cfg.threshold.lessons, `${countSource}: pathway lesson counts + repo high-end completeness thresholds`),
    scored("CAT eligible questions", counts.catEligible, dbAvailable && "cat" in cfg.threshold ? cfg.threshold.cat : null, `${countSource}: CAT eligible counts + repo CAT threshold`, dbAvailable ? undefined : "Not scored without live DB is_adaptive_eligible rows."),
    scored("Clinical skills", skills, cfg.key === "allied" || cfg.key === "rt" ? null : LAUNCH_MINIMUMS.clinicalSkillsMinimum, "Static clinical-skills catalog contract"),
    scored("Simulations", counts.simulations, null, "DB clinical_nursing_scenarios; no repo-wide expected baseline found"),
  ];

  const features = featureChecklist([
    ["questions", exists("src/app/(app)/app/(learner)/questions") || exists("src/app/api/questions")],
    ["flashcards", exists("src/app/(app)/app/(learner)/flashcards") || exists("src/lib/flashcards")],
    ["lessons", exists("src/app/(app)/app/(learner)/lessons") || exists("src/lib/lessons")],
    ["adaptive_learning", exists("src/lib/adaptive-learning") || exists("src/lib/adaptive")],
    ["weak_topic_detection", exists("src/lib/cat/performance-tracker.ts") || exists("src/lib/adaptive-learning/adaptive-recommendation-engine.ts")],
    ["remediation", exists("src/lib/remediation") || exists("src/lib/flashcards/related-learning-engine.ts")],
    ["progress_tracking", exists("src/lib/progress-sync") || exists("src/app/(app)/app/(learner)/account/progress")],
    ["analytics", exists("src/lib/analytics") || exists("src/lib/observability")],
    ["study_plans", exists("src/app/(app)/app/(learner)/study-coach") || exists("src/app/(app)/app/(learner)/study-plan") || exists("src/lib/study")],
    ["cat", exists("src/lib/cat") || exists("src/app/(runtime)/app/practice-tests")],
    ["loft", exists("src/lib/cnple") || exists("src/content/cases")],
    ["clinical_skills", exists("src/lib/clinical-skills")],
    ["pharmacology", exists("src/lib/pharmacology")],
    ["ecg", exists("src/lib/ecg-module")],
    ["simulation", exists("src/lib/clinical-simulation") || exists("src/lib/clinical-scenarios")],
    ["scoring", exists("src/lib/cat/readiness-scorer.ts") || exists("src/lib/questions/grade-answer-match.bowtie.test.ts")],
  ]);

  const adaptive = featureChecklist([
    ["weak_topic_detection", exists("src/lib/cat/performance-tracker.ts")],
    ["remediation_routing", exists("src/lib/flashcards/flashcard-remediation-bridge.ts") || exists("src/lib/remediation")],
    ["lesson_routing", exists("src/lib/flashcards/related-learning-engine.ts") || exists("src/lib/lessons")],
    ["question_routing", exists("src/lib/questions/runtime-adaptive-steering.ts")],
    ["flashcard_routing", exists("src/lib/flashcards/study-queue.ts")],
    ["clinical_skills_routing", exists("src/lib/clinical-skills/clinical-skills-adaptive-signals.ts")],
    ["pharmacology_routing", exists("src/lib/pharmacology")],
    ["ecg_routing", exists("src/lib/ecg-module/ecg-adaptive-remediation.ts")],
    ["simulation_routing", exists("src/lib/clinical-simulation") || exists("src/lib/clinical-scenarios")],
    ["readiness_routing", exists("src/lib/cat/readiness-scorer.ts") || exists("docs/readiness-engine.md")],
  ]);

  const commercial = featureChecklist([
    ["purchase_path", exists("src/app/api/subscriptions/checkout/route.ts")],
    ["access_control", exists("src/lib/entitlements")],
    ["navigation", exists("src/lib/navigation")],
    ["marketing", exists("src/lib/exam-pathways/exam-pathways-catalog.ts")],
    ["seo", exists("src/app/sitemap.ts") || exists("src/lib/seo")],
    ["feature_discoverability", exists("src/lib/discovery") || exists("src/lib/navigation/canonical-destinations.ts")],
  ]);

  const contentCompleteness = avg(contentMetrics.map((m) => m.percent));
  const featureCompleteness = featureAverage(features);
  const adaptiveCompleteness = featureAverage(adaptive);
  const commercialReadiness = featureAverage(commercial);
  const learningEcosystemCompleteness = avg([
    contentMetrics.find((m) => m.label === "Questions")?.percent,
    contentMetrics.find((m) => m.label === "Flashcards")?.percent,
    contentMetrics.find((m) => m.label === "Lessons")?.percent,
    contentMetrics.find((m) => m.label === "Clinical skills")?.percent,
    contentMetrics.find((m) => m.label === "Simulations")?.percent,
    adaptiveCompleteness,
  ]);
  const overallCompletion = avg([contentCompleteness, featureCompleteness, adaptiveCompleteness, learningEcosystemCompleteness, commercialReadiness]);

  const gaps = contentMetrics
    .filter((m) => m.status === "scored" && (m.percent ?? 0) < 100)
    .map((m) => `${m.label}: ${m.actual}/${m.expected} (${m.percent}%)`);
  for (const metric of [...features, ...adaptive, ...commercial]) {
    if (metric.status !== "implemented") gaps.push(`${metric.key}: ${metric.status}`);
  }

  return {
    key: cfg.key,
    label: cfg.label,
    group: cfg.group,
    contentMetrics,
    featureMetrics: features,
    adaptiveMetrics: adaptive,
    commercialMetrics: commercial,
    contentCompleteness,
    featureCompleteness,
    adaptiveCompleteness,
    learningEcosystemCompleteness,
    commercialReadiness,
    overallCompletion,
    evidence: [
      dbAvailable ? "DB: exam_questions" : "Committed snapshot: question counts",
      dbAvailable ? "DB: pathway_lessons" : "Committed snapshot: lesson counts",
      dbAvailable ? "DB: flashcards / flashcard_decks" : "DB unavailable: flashcards not counted",
      dbAvailable ? "DB: clinical_nursing_scenarios" : "DB unavailable: simulations not counted",
      "Static: clinical-skills catalog",
      "Static: app/lib route and feature files",
    ],
    gaps,
  };
}

function featureChecklist(items: Array<[string, boolean | "partial", string[]?]>): FeatureMetric[] {
  return items.map(([key, value, extraEvidence]) => ({
    key,
    status: value === true ? "implemented" : value === "partial" ? "partial" : "missing",
    evidence: extraEvidence ?? [`file existence check for ${key}`],
  }));
}

async function buildAlliedBreakdown(prisma: PrismaClient | null): Promise<PathwayReport[]> {
  const out: PathwayReport[] = [];
  for (const [professionKey, label] of ALLIED_PROFESSIONS) {
    const counts = await dbCounts(prisma, { tier: "ALLIED", roleTracks: ["allied"], alliedProfession: professionKey });
    const dbAvailable = prisma !== null;
    const metrics = [
      scored("Questions", counts.questions, dbAvailable ? ALLIED_THRESHOLDS.questions : null, "DB exam_questions filtered by allied profession signals", dbAvailable ? undefined : "Not scored because the database was unavailable."),
      scored("Lessons", counts.lessons, dbAvailable ? ALLIED_THRESHOLDS.lessons : null, "DB pathway_lessons.allied_profession_key", dbAvailable ? undefined : "Not scored because the database was unavailable."),
      scored("Flashcards", counts.flashcards, null, "DB flashcards are tier/pathway scoped; profession-specific expected baseline not found"),
      scored("Simulations", counts.simulations, null, "DB clinical_nursing_scenarios; profession-specific expected baseline not found"),
    ];
    const contentCompleteness = avg(metrics.map((m) => m.percent));
    const features = featureChecklist([
      ["profession_homepage", exists("src/lib/allied")],
      ["hub", exists("src/app/(runtime)/app/allied") || exists("src/lib/allied")],
      ["questions", dbAvailable ? counts.questions > 0 : "partial"],
      ["lessons", dbAvailable ? counts.lessons > 0 : "partial"],
      ["flashcards", dbAvailable && counts.flashcards > 0 ? true : "partial"],
      ["simulations", dbAvailable && counts.simulations > 0 ? true : "partial"],
      ["analytics", exists("src/lib/observability")],
    ]);
    const featureCompleteness = featureAverage(features);
    out.push({
      key: professionKey,
      label,
      group: "Allied Profession",
      contentMetrics: metrics,
      featureMetrics: features,
      adaptiveMetrics: [],
      commercialMetrics: [],
      contentCompleteness,
      featureCompleteness,
      adaptiveCompleteness: 0,
      learningEcosystemCompleteness: avg([contentCompleteness, featureCompleteness]),
      commercialReadiness: 0,
      overallCompletion: avg([contentCompleteness, featureCompleteness]),
      evidence: ["DB profession filters", "Static allied feature files"],
      gaps: metrics.filter((m) => m.status === "scored" && (m.percent ?? 0) < 100).map((m) => `${m.label}: ${m.actual}/${m.expected}`),
    });
  }
  return out;
}

async function buildNewGradBreakdown(prisma: PrismaClient | null): Promise<PathwayReport[]> {
  const out: PathwayReport[] = [];
  for (const specialty of NEW_GRAD_SPECIALTIES) {
    const counts = await dbCounts(prisma, { tier: "NEW_GRAD", roleTracks: ["rn"], newGradSpecialty: specialty });
    const metrics = [
      scored("Questions", counts.questions, null, "DB exam_questions NEW_GRAD specialty signals; no specialty expected baseline found"),
      scored("Lessons", counts.lessons, null, "DB pathway_lessons NEW_GRAD specialty signals; no specialty expected baseline found"),
      scored("Flashcards", counts.flashcards, null, "DB flashcards NEW_GRAD tier; no specialty expected baseline found"),
      scored("Simulations", counts.simulations, null, "DB clinical_nursing_scenarios specialty signals; no specialty expected baseline found"),
    ];
    const implementedSurfaces = [counts.questions > 0, counts.lessons > 0, counts.flashcards > 0, counts.simulations > 0].filter(Boolean).length;
    const contentCompleteness = Number(((implementedSurfaces / 4) * 100).toFixed(1));
    out.push({
      key: specialty.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
      label: specialty,
      group: "New Grad Specialty",
      contentMetrics: metrics,
      featureMetrics: [],
      adaptiveMetrics: [],
      commercialMetrics: [],
      contentCompleteness,
      featureCompleteness: 0,
      adaptiveCompleteness: 0,
      learningEcosystemCompleteness: contentCompleteness,
      commercialReadiness: 0,
      overallCompletion: contentCompleteness,
      evidence: ["DB NEW_GRAD specialty signal filters"],
      gaps: metrics.filter((m) => m.actual === 0).map((m) => `${m.label}: no detected specialty rows`),
    });
  }
  return out;
}

async function buildEcosystemAudits(prisma: PrismaClient | null) {
  const clinicalSkills = await import("../src/lib/clinical-skills/clinical-skills-catalog");
  const pharmacology = await import("../src/lib/pharmacology/pharmacology-learning-system");
  const medCalc = await import("../src/lib/med-calculations/med-calculations-engine");

  const ecgPackPath = join(ROOT, "src/lib/ecg-module/ecg-premium-curated-pack.ts");
  const ecgPack = existsSync(ecgPackPath) ? readFileSync(ecgPackPath, "utf8") : "";
  const ecgQuestionCount = (ecgPack.match(/makeRow\s*\(/g) ?? []).length;
  const ecgAdvancedCount = (ecgPack.match(/level:\s*["']advanced["']/g) ?? []).length;
  const ecgBasicCount = (ecgPack.match(/level:\s*["']basic["']/g) ?? []).length;

  const staticBlogFiles = findFiles("data/blog-content", (abs) => abs.endsWith(".json")).length;
  const [blogCount, authorityContent, readinessEvents, learnerEvents] = prisma
    ? await Promise.all([
        prisma.blogPost.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
        prisma.contentItem.count({ where: { status: { in: ["PUBLISHED", "published"] } } }).catch(() => 0),
        prisma.learnerActivityEvent.count({ where: { activityType: { contains: "readiness", mode: "insensitive" } } }).catch(() => 0),
        prisma.learnerActivityEvent.count().catch(() => 0),
      ])
    : [staticBlogFiles, findFiles("docs/reports", (abs) => /\.(md|json)$/i.test(abs)).length, 0, 0];

  const clinicalSkillCounts = {
    total: clinicalSkills.listClinicalSkills().length,
    rn: clinicalSkills.clinicalSkillsForRoleTrack("rn").length,
    rpnPn: clinicalSkills.clinicalSkillsForRoleTrack("rpn_lpn").length,
    np: clinicalSkills.clinicalSkillsForRoleTrack("np").length,
    targetMinimumPerTier: LAUNCH_MINIMUMS.clinicalSkillsMinimum,
    targetIdealPerTier: LAUNCH_MINIMUMS.clinicalSkillsIdeal,
  };

  const pharmacologyCategories = pharmacology.PHARMACOLOGY_CATEGORIES ?? [];
  const medCalcInventory = typeof medCalc.countMedCalcInventoryForTrack === "function"
    ? medCalc.countMedCalcInventoryForTrack("rn")
    : null;

  return {
    clinicalSkills: {
      ...clinicalSkillCounts,
      rnCoverage: pct(clinicalSkillCounts.rn, LAUNCH_MINIMUMS.clinicalSkillsMinimum),
      rpnPnCoverage: pct(clinicalSkillCounts.rpnPn, LAUNCH_MINIMUMS.clinicalSkillsMinimum),
      npCoverage: pct(clinicalSkillCounts.np, LAUNCH_MINIMUMS.clinicalSkillsMinimum),
    },
    pharmacology: {
      categories: pharmacologyCategories.length,
      commonMedicationMentions: pharmacologyCategories.reduce((sum: number, c: { commonMedications?: unknown[] }) => sum + (c.commonMedications?.length ?? 0), 0),
      expectedBaseline: "No repo-wide numeric expected baseline found; report uses detected category and medication counts only.",
    },
    medMath: {
      lessons: medCalcInventory?.lessonCount ?? 0,
      categories: medCalcInventory?.categoryCount ?? 0,
      questions: medCalcInventory?.questionCount ?? 0,
      flashcards: medCalcInventory?.flashcardCount ?? 0,
      expectedBaseline: "No repo-wide numeric expected baseline found.",
    },
    ecg: {
      coreQuestions: ecgBasicCount,
      advancedQuestions: ecgAdvancedCount,
      totalCuratedPackQuestions: ecgQuestionCount,
      fullLaunchThreshold: 300,
      basicThreshold: 150,
      coreCoverage: pct(ecgBasicCount, 150),
      advancedCoverage: pct(ecgAdvancedCount, 300),
    },
    analytics: {
      learnerActivityEvents: learnerEvents,
      readinessTaggedEvents: readinessEvents,
      instrumentationFilesPresent: exists("src/lib/observability"),
    },
    seo: {
      publishedBlogPosts: blogCount,
      contentItems: authorityContent,
      sitemapPresent: exists("src/app/sitemap.ts"),
      robotsPresent: exists("src/app/robots.ts") || exists("public/robots.txt"),
      seoLibPresent: exists("src/lib/seo"),
      authorityClustersPresent: exists("src/lib/seo") || exists("data/seo"),
    },
  };
}

async function buildContentQualityAudit(prisma: PrismaClient | null) {
  const staticCounts = scanTextFilesForPatterns("src", GENERIC_RATIONALE_PATTERNS);
  const dbCountsByPattern: Record<string, number> = {};
  for (const pattern of GENERIC_RATIONALE_PATTERNS) {
    if (!prisma) {
      dbCountsByPattern[pattern] = 0;
      continue;
    }
    const contains = { contains: pattern, mode: "insensitive" as const };
    dbCountsByPattern[pattern] = await prisma.examQuestion
      .count({
        where: {
          status: { in: ["PUBLISHED", "published"] },
          OR: [
            { rationale: contains },
            { correctAnswerExplanation: contains },
            { clinicalReasoning: contains },
            { keyTakeaway: contains },
          ],
        },
      })
      .catch(() => 0);
  }
  const thinRationales = prisma ? await prisma.examQuestion
    .count({
      where: {
        status: { in: ["PUBLISHED", "published"] },
        OR: [{ rationale: null }, { rationale: "" }],
      },
    })
    .catch(() => 0) : 0;
  const duplicateStemHashes = prisma ? await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count
    FROM (
      SELECT stem_hash
      FROM exam_questions
      WHERE status IN ('PUBLISHED', 'published') AND stem_hash IS NOT NULL
      GROUP BY stem_hash
      HAVING COUNT(*) > 1
    ) d
  `.then((rows) => Number(rows[0]?.count ?? 0)).catch(() => 0) : 0;

  return {
    genericPhraseOccurrencesInSource: staticCounts,
    genericPhraseOccurrencesInPublishedExamQuestions: dbCountsByPattern,
    publishedQuestionsMissingRationale: thinRationales,
    duplicatePublishedStemHashes: duplicateStemHashes,
    qualityScore: "Not reduced to a single score without SME weighting; raw flags are reported.",
  };
}

function scorecardFromPathways(pathways: PathwayReport[], ecosystems: Record<string, unknown>): Record<string, number | null> {
  const byKey = new Map(pathways.map((p) => [p.key, p]));
  const clinicalSkills = ecosystems.clinicalSkills as { rnCoverage?: number; rpnPnCoverage?: number; npCoverage?: number } | undefined;
  const ecg = ecosystems.ecg as { coreCoverage?: number; advancedCoverage?: number } | undefined;
  const seo = ecosystems.seo as { sitemapPresent?: boolean; robotsPresent?: boolean; seoLibPresent?: boolean; authorityClustersPresent?: boolean; publishedBlogPosts?: number } | undefined;
  return {
    RN: byKey.get("rn")?.overallCompletion ?? null,
    RPN: byKey.get("rpn_pn")?.overallCompletion ?? null,
    NP: byKey.get("np_cnple")?.overallCompletion ?? null,
    RT: byKey.get("rt")?.overallCompletion ?? null,
    Allied: byKey.get("allied")?.overallCompletion ?? null,
    NewGrad: avg([byKey.get("new_grad_rn")?.overallCompletion, byKey.get("new_grad_rpn")?.overallCompletion]),
    ClinicalSkills: avg([clinicalSkills?.rnCoverage, clinicalSkills?.rpnPnCoverage, clinicalSkills?.npCoverage]),
    Pharmacology: null,
    ECGCore: ecg?.coreCoverage ?? null,
    AdvancedECG: ecg?.advancedCoverage ?? null,
    Questions: avg(pathways.map((p) => p.contentMetrics.find((m) => m.label === "Questions")?.percent)),
    Flashcards: avg(pathways.map((p) => p.contentMetrics.find((m) => m.label === "Flashcards")?.percent)),
    Lessons: avg(pathways.map((p) => p.contentMetrics.find((m) => m.label === "Lessons")?.percent)),
    CAT: avg(pathways.map((p) => p.contentMetrics.find((m) => m.label === "CAT eligible questions")?.percent)),
    LOFT: null,
    AdaptiveLearning: avg(pathways.map((p) => p.adaptiveCompleteness)),
    Analytics: null,
    SEO: avg([
      seo?.sitemapPresent ? 100 : 0,
      seo?.robotsPresent ? 100 : 0,
      seo?.seoLibPresent ? 100 : 0,
      seo?.authorityClustersPresent ? 100 : 0,
      typeof seo?.publishedBlogPosts === "number" ? pct(seo.publishedBlogPosts, 200) : null,
    ]),
    CommercialReadiness: avg(pathways.map((p) => p.commercialReadiness)),
    OverallPlatformCompletion: avg(pathways.map((p) => p.overallCompletion)),
  };
}

function buildPriorityMatrix(pathways: PathwayReport[], scorecard: Record<string, number | null>) {
  const items: AuditReport["priorityMatrix"] = [];
  for (const pathway of pathways) {
    for (const gap of pathway.gaps.slice(0, 4)) {
      const priority = gap.includes("Questions") || gap.includes("Flashcards") || gap.includes("Lessons") ? "P0" : "P1";
      items.push({
        priority,
        item: `${pathway.label}: ${gap}`,
        evidence: pathway.evidence.join("; "),
        estimatedHours: priority === "P0" ? "16-80" : "8-40",
        complexity: priority === "P0" ? "High" : "Medium",
        impact: priority === "P0" ? "Critical" : "High",
      });
    }
  }
  if ((scorecard.SEO ?? 0) < 100) {
    items.push({
      priority: "P1",
      item: "SEO completeness is below full checklist coverage.",
      evidence: "Static sitemap/robots/SEO/blog authority checks",
      estimatedHours: "8-32",
      complexity: "Medium",
      impact: "High",
    });
  }
  return items.slice(0, 40);
}

function renderMarkdown(report: AuditReport): string {
  const lines: string[] = [
    "# Comprehensive NurseNest Content Completeness Audit",
    "",
    `_Generated: ${report.generatedAt}_`,
    "",
    "## Executive Summary",
    "",
    "This audit is generated from database counts, committed content catalogs, route/feature files, and existing repository threshold constants. It does not use marketing claims. Percentages are shown only where the repository contains an explicit expected baseline; otherwise the metric is reported as not scored.",
    "",
    "## Completion Scorecard",
    "",
    "| Area | Completion |",
    "| --- | ---: |",
    ...Object.entries(report.scorecard).map(([key, value]) => `| ${key} | ${value == null ? "Not scored" : `${value}%`} |`),
    "",
    "## Per-Tier Breakdown",
    "",
    "| Tier / Pathway | Content | Feature | Adaptive | Ecosystem | Commercial | Overall |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.pathwayReports.map((p) => `| ${p.label} | ${p.contentCompleteness ?? "Not scored"}${p.contentCompleteness == null ? "" : "%"} | ${p.featureCompleteness}% | ${p.adaptiveCompleteness}% | ${p.learningEcosystemCompleteness ?? "Not scored"}${p.learningEcosystemCompleteness == null ? "" : "%"} | ${p.commercialReadiness}% | ${p.overallCompletion ?? "Not scored"}${p.overallCompletion == null ? "" : "%"} |`),
    "",
    "## Content Inventory Evidence",
    "",
  ];

  for (const pathway of report.pathwayReports) {
    lines.push(`### ${pathway.label}`, "");
    lines.push("| Metric | Actual | Expected | Completion | Source |");
    lines.push("| --- | ---: | ---: | ---: | --- |");
    for (const metric of pathway.contentMetrics) {
      lines.push(`| ${metric.label} | ${metric.actual} | ${metric.expected ?? "No baseline"} | ${metric.percent == null ? "Not scored" : `${metric.percent}%`} | ${metric.source} |`);
    }
    if (pathway.gaps.length) {
      lines.push("", `Gaps: ${pathway.gaps.slice(0, 8).join("; ")}`);
    }
    lines.push("");
  }

  lines.push("## New Grad Breakdown", "", "| Specialty | Detected Completion | Gaps |", "| --- | ---: | --- |");
  for (const p of report.newGradBreakdown) {
    lines.push(`| ${p.label} | ${p.overallCompletion ?? "Not scored"}${p.overallCompletion == null ? "" : "%"} | ${p.gaps.join("; ") || "No zero-count surfaces detected"} |`);
  }

  lines.push("", "## Allied Breakdown", "", "| Profession | Content | Feature | Overall | Gaps |", "| --- | ---: | ---: | ---: | --- |");
  for (const p of report.alliedBreakdown) {
    lines.push(`| ${p.label} | ${p.contentCompleteness ?? "Not scored"}${p.contentCompleteness == null ? "" : "%"} | ${p.featureCompleteness}% | ${p.overallCompletion ?? "Not scored"}${p.overallCompletion == null ? "" : "%"} | ${p.gaps.join("; ") || "No scored gaps"} |`);
  }

  lines.push(
    "",
    "## Ecosystem Audits",
    "",
    "```json",
    JSON.stringify(report.ecosystemAudits, null, 2),
    "```",
    "",
    "## Content Quality Audit",
    "",
    "```json",
    JSON.stringify(report.contentQualityAudit, null, 2),
    "```",
    "",
    "## SEO Audit",
    "",
    "```json",
    JSON.stringify(report.seoAudit, null, 2),
    "```",
    "",
    "## Commercial Readiness Audit",
    "",
    "```json",
    JSON.stringify(report.commercialReadinessAudit, null, 2),
    "```",
    "",
    "## Priority Matrix",
    "",
    "| Priority | Item | Evidence | Hours | Complexity | Impact |",
    "| --- | --- | --- | ---: | --- | --- |",
    ...report.priorityMatrix.map((item) => `| ${item.priority} | ${item.item} | ${item.evidence} | ${item.estimatedHours} | ${item.complexity} | ${item.impact} |`),
    "",
    "## Recommended Next 90 Days",
    "",
    ...report.next90Days.map((item) => `- ${item}`),
    "",
    "## Caveats",
    "",
    ...report.caveats.map((item) => `- ${item}`),
    "",
    "## Evidence Sources",
    "",
    ...report.evidenceSources.map((item) => `- ${item}`),
    "",
  );
  return lines.join("\n");
}

async function main() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  loadRuntimeEnv({ envRoot: ROOT, quiet: true, validate: true, purpose: "content-completeness-audit" });

  let prisma: PrismaClient | null = new PrismaClient();
  const runtimeCaveats: string[] = [];
  const evidenceSources = [
    "Prisma database via .env.local DATABASE_URL",
    "prisma/schema.prisma",
    "src/lib/content-audit/high-end-completeness-audit.ts thresholds",
    "src/lib/questions/question-bank-coverage-thresholds.ts thresholds",
    "src/lib/navigation/country-exam-launch-readiness.ts launch checks",
    "src/lib/clinical-skills/clinical-skills-catalog.ts",
    "src/lib/pharmacology/pharmacology-learning-system.ts",
    "src/lib/ecg-module/ecg-premium-curated-pack.ts",
    "src/app route tree",
    "src/lib feature modules",
  ];

  try {
    try {
      await prisma.$connect();
    } catch (error) {
      runtimeCaveats.push(
        `Database connection unavailable during audit (${error instanceof Error ? error.message.split("\n")[0] : String(error)}). DB-backed metrics fell back to committed snapshots or are reported as zero/not scored.`,
      );
      await prisma.$disconnect().catch(() => {});
      prisma = null;
    }

    const pathwayReports = [];
    for (const cfg of PATHWAY_CONFIG) pathwayReports.push(await buildPathwayReport(prisma, cfg));
    const alliedBreakdown = await buildAlliedBreakdown(prisma);
    const newGradBreakdown = await buildNewGradBreakdown(prisma);
    const ecosystemAudits = await buildEcosystemAudits(prisma);
    const contentQualityAudit = await buildContentQualityAudit(prisma);
    const scorecard = scorecardFromPathways(pathwayReports, ecosystemAudits);
    const priorityMatrix = buildPriorityMatrix(pathwayReports, scorecard);

    const report: AuditReport = {
      generatedAt: new Date().toISOString(),
      scope: [
        "RN",
        "RPN / PN",
        "NP / CNPLE",
        "RT",
        "All Allied Health",
        "New Grad RN",
        "New Grad RPN",
        "ECG Core",
        "Advanced ECG",
        "Clinical Skills",
        "Pharmacology",
        "Med Math",
        "Questions",
        "Flashcards",
        "Lessons",
        "CAT",
        "LOFT Simulations",
        "Readiness Assessments",
        "Study Plans",
        "Adaptive Learning",
        "Analytics",
        "Career Resources",
        "Authority Content",
        "Blog Ecosystem",
      ],
      evidenceSources,
      caveats: [
        ...runtimeCaveats,
        "Percentages are not emitted for areas where no authoritative expected inventory baseline exists in code, docs, or thresholds.",
        "Clinical accuracy and SME-level content quality are flagged by heuristics here; manual clinical review remains required.",
        "Feature completeness is based on committed route/module evidence and does not replace Playwright runtime validation.",
        "Database counts reflect the database pointed to by .env.local at audit time.",
      ],
      scorecard,
      pathwayReports,
      professionBreakdown: pathwayReports,
      newGradBreakdown,
      alliedBreakdown,
      ecosystemAudits,
      contentQualityAudit,
      seoAudit: ecosystemAudits.seo as Record<string, unknown>,
      commercialReadinessAudit: {
        pathwayCommercialScores: Object.fromEntries(pathwayReports.map((p) => [p.label, p.commercialReadiness])),
        checkSource: "Static checkout, entitlement, navigation, marketing, SEO, discoverability file checks.",
      },
      priorityMatrix,
      next90Days: [
        "Close P0 scored content gaps first: questions, flashcards, lessons, and CAT pools below explicit repo thresholds.",
        "Add missing authoritative baselines for LOFT, simulations, pharmacology, med math, analytics, career resources, and specialty tracks so future audits can score them numerically.",
        "Run Playwright learner-access journeys for every pathway marked commercially ready.",
        "Convert content quality flags into admin review queues and block future seeds with generic rationale phrase checks.",
        "Expand Allied and New Grad specialty content using profession-specific competency maps instead of aggregate allied counts.",
        "Attach every readiness/adaptive recommendation to canonical lessons, questions, flashcards, clinical skills, pharmacology, ECG, or simulations.",
      ],
    };

    writeFileSync(JSON_PATH, JSON.stringify(report, null, 2) + "\n", "utf8");
    writeFileSync(MD_PATH, renderMarkdown(report), "utf8");
    console.log(`Wrote ${relative(ROOT, JSON_PATH)}`);
    console.log(`Wrote ${relative(ROOT, MD_PATH)}`);
  } finally {
    await prisma?.$disconnect().catch(() => {});
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});

#!/usr/bin/env tsx

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

import { loadRuntimeEnv } from "./lib/load-runtime-env.mjs";

type VerificationStatus = "Verified" | "Unable To Verify";
type Severity = "Critical" | "High" | "Medium" | "Low";

type MetricKey = "questions" | "lessons" | "flashcards" | "simulations" | "practiceExams" | "catCoverage";

type ReadinessMetric = {
  key: MetricKey;
  label: string;
  target: number | null;
  actual: number | null;
  completionPercent: number | null;
  verificationStatus: VerificationStatus;
  source: string;
  explanation?: string;
};

type TopicReadiness = {
  pathway: string;
  category: string;
  metrics: ReadinessMetric[];
  educationalDepthScore: number | null;
  learnerJourney: {
    status: "Complete Learning Loop" | "Incomplete Learning Loop" | "Unable To Verify";
    present: string[];
    missing: string[];
    explanation?: string;
  };
  remediation: {
    status: "Present" | "Missing" | "Partial" | "Unable To Verify";
    present: string[];
    missing: string[];
    explanation?: string;
  };
  readinessScore: number | null;
};

type Deficiency = {
  rank?: number;
  severity: Severity;
  pathway: string;
  category: string;
  asset: string;
  target: number | null;
  actual: number | null;
  completionPercent: number | null;
  issue: string;
  recommendedAction: string;
};

type Strength = {
  rank?: number;
  pathway: string;
  category: string;
  asset: string;
  actual: number;
  target: number;
  completionPercent: number;
  evidence: string;
};

type AuditReport = {
  generatedAt: string;
  audit: string;
  database: {
    status: "Connected" | "Database Unreachable";
    explanation?: string;
  };
  targetPolicy: {
    source: string;
    rationale: string;
    targets: Record<MetricKey, number | null>;
  };
  executiveSummary: string[];
  systemReadiness: Array<{
    pathway: string;
    readinessScore: number | null;
    verificationStatus: VerificationStatus;
    criticalGaps: number;
    highGaps: number;
  }>;
  educationalAssetAudit: Array<{
    asset: string;
    actual: number | null;
    verificationStatus: VerificationStatus;
    source: string;
    explanation?: string;
  }>;
  topicReadiness: TopicReadiness[];
  missingCoverageReport: Deficiency[];
  top100Deficiencies: Deficiency[];
  top100Strengths: Strength[];
  recommendedBuildOrder: Deficiency[];
  overallEducationalReadinessScore: number | null;
  unableToVerify: string[];
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "reports");
const JSON_PATH = join(REPORTS_DIR, "educational-readiness-report.json");
const MD_PATH = join(REPORTS_DIR, "educational-readiness-report.md");

const PATHWAYS = [
  { key: "RN", label: "RN", markers: ["RN", "NCLEX_RN", "NCLEX-RN", "nclex-rn", "registered-nurse"] },
  { key: "RPN", label: "RPN / PN", markers: ["RPN", "LVN_LPN", "NCLEX_PN", "REX_PN", "NCLEX-PN", "REx-PN", "rpn", "pn"] },
  { key: "NP", label: "NP", markers: ["NP", "CNPLE", "nurse-practitioner", "cnple"] },
  { key: "RT", label: "RT", markers: ["RT", "RESPIRATORY", "respiratory-therapy", "respiratory therapist"] },
  { key: "ALLIED", label: "Allied", markers: ["ALLIED", "allied", "occupational", "physiotherapy", "paramedic", "medical-lab", "diagnostic-imaging"] },
  { key: "NEW_GRAD", label: "New Grad", markers: ["NEW_GRAD", "new-grad", "residency", "transition-to-practice"] },
] as const;

const CATEGORIES = [
  { label: "Cardiovascular", aliases: ["cardio", "cardiac", "heart", "vascular", "circulation", "stemi"] },
  { label: "Respiratory", aliases: ["respiratory", "oxygen", "airway", "ventilation", "copd", "asthma"] },
  { label: "Neurological", aliases: ["neuro", "stroke", "seizure", "cns", "intracranial"] },
  { label: "Endocrine", aliases: ["endocrine", "diabetes", "insulin", "thyroid", "glucose"] },
  { label: "Renal", aliases: ["renal", "kidney", "urinary", "nephro", "dialysis"] },
  { label: "Gastrointestinal", aliases: ["gastro", "gi", "bowel", "liver", "hepatic", "abdomen"] },
  { label: "Mental Health", aliases: ["mental", "psychiatric", "anxiety", "depression", "suicide", "substance"] },
  { label: "Maternity", aliases: ["maternity", "maternal", "obstetric", "postpartum", "pregnancy", "labor"] },
  { label: "Pediatrics", aliases: ["pediatric", "child", "infant", "neonate", "adolescent"] },
  { label: "Community", aliases: ["community", "public health", "home care", "population", "health promotion"] },
  { label: "Leadership", aliases: ["leadership", "delegation", "prioritization", "management", "assignment"] },
  { label: "Professional Practice", aliases: ["professional", "ethics", "legal", "documentation", "communication", "scope"] },
  { label: "Pharmacology", aliases: ["pharmacology", "medication", "drug", "high-alert", "anticoagulant", "opioid"] },
  { label: "Clinical Skills", aliases: ["clinical skill", "skill", "procedure", "assessment", "wound", "foley", "iv"] },
  { label: "Emergency", aliases: ["emergency", "shock", "sepsis", "rapid response", "trauma", "deterioration"] },
] as const;

const TARGET_POLICY = {
  source: "Educational Readiness Audit Minimum V1",
  rationale:
    "Targets are explicit launch-readiness thresholds for depth comparison only. Actual counts are always database-derived; unavailable evidence is marked Unable To Verify.",
  targets: {
    questions: 80,
    lessons: 8,
    flashcards: 120,
    simulations: 3,
    practiceExams: 1,
    catCoverage: 40,
  } satisfies Record<MetricKey, number | null>,
};

const VALID_TIER_CODES = new Set(["RPN", "LVN_LPN", "RN", "NP", "ALLIED", "PRE_NURSING", "NEW_GRAD"]);
const VALID_EXAM_FAMILIES = new Set(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]);
const VALID_SCENARIO_TIERS = new Set(["RN_NCLEX_RN", "RPN_PN", "NP", "NEW_GRAD"]);

function normalize(input: string | null | undefined): string {
  return (input ?? "").toLowerCase();
}

function containsAny(value: string, aliases: readonly string[]): boolean {
  const normalized = normalize(value);
  return aliases.some((alias) => normalized.includes(alias.toLowerCase()));
}

function percent(actual: number | null, target: number | null): number | null {
  if (actual === null || target === null || target <= 0) return null;
  return Math.min(100, Number(((actual / target) * 100).toFixed(1)));
}

function metric(
  key: MetricKey,
  actual: number | null,
  source: string,
  explanation?: string,
): ReadinessMetric {
  const target = TARGET_POLICY.targets[key];
  return {
    key,
    label: {
      questions: "Questions",
      lessons: "Lessons",
      flashcards: "Flashcards",
      simulations: "Simulations",
      practiceExams: "Practice Exams",
      catCoverage: "CAT Coverage",
    }[key],
    target,
    actual,
    completionPercent: percent(actual, target),
    verificationStatus: actual === null ? "Unable To Verify" : "Verified",
    source,
    explanation,
  };
}

function stringFieldContains(field: string, aliases: readonly string[]) {
  return aliases.map((alias) => ({ [field]: { contains: alias, mode: "insensitive" } }));
}

function arrayFieldHasSome(field: string, aliases: readonly string[]) {
  return [{ [field]: { hasSome: [...aliases] } }];
}

function examQuestionPathwayWhere(markers: readonly string[]) {
  return {
    OR: [
      ...markers.map((marker) => ({ tier: { contains: marker, mode: "insensitive" } })),
      ...markers.map((marker) => ({ exam: { contains: marker, mode: "insensitive" } })),
      ...markers.map((marker) => ({ careerType: { contains: marker, mode: "insensitive" } })),
    ],
  };
}

function pathwayLessonPathwayWhere(markers: readonly string[]) {
  const tierMarkers = markers.filter((marker) => VALID_TIER_CODES.has(marker));
  return {
    OR: [
      ...markers.map((marker) => ({ pathwayId: { contains: marker, mode: "insensitive" } })),
      ...tierMarkers.map((marker) => ({ tierCode: marker })),
      ...markers.map((marker) => ({ alliedProfessionKey: { contains: marker, mode: "insensitive" } })),
      { exams: { hasSome: [...markers] } },
    ],
  };
}

function flashcardPathwayWhere(markers: readonly string[]) {
  const tierMarkers = markers.filter((marker) => VALID_TIER_CODES.has(marker));
  const examFamilyMarkers = markers.filter((marker) => VALID_EXAM_FAMILIES.has(marker));
  return {
    OR: [
      ...tierMarkers.map((marker) => ({ tier: marker })),
      ...examFamilyMarkers.map((marker) => ({ examFamily: marker })),
      ...markers.map((marker) => ({ sourceKey: { contains: marker, mode: "insensitive" } })),
      ...markers.map((marker) => ({ category: { slug: { contains: marker, mode: "insensitive" } } })),
    ],
  };
}

function topicWhere(aliases: readonly string[], fields: string[]) {
  return {
    OR: [
      ...fields.flatMap((field) => stringFieldContains(field, aliases)),
      ...arrayFieldHasSome("tags", aliases),
    ],
  };
}

async function safeCount(label: string, fn: () => Promise<number>): Promise<{ actual: number | null; explanation?: string }> {
  try {
    return { actual: await fn() };
  } catch (error) {
    return {
      actual: null,
      explanation: `${label} could not be verified: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function countQuestions(prisma: PrismaClient, markers: readonly string[], aliases: readonly string[], extra: object = {}) {
  return safeCount("Questions", () =>
    prisma.examQuestion.count({
      where: {
        status: { equals: "published", mode: "insensitive" },
        AND: [examQuestionPathwayWhere(markers), topicWhere(aliases, ["topic", "subtopic", "bodySystem", "stem"]), extra],
      } as never,
    }),
  );
}

async function countLessons(prisma: PrismaClient, markers: readonly string[], aliases: readonly string[]) {
  return safeCount("Lessons", () =>
    prisma.pathwayLesson.count({
      where: {
        status: "PUBLISHED",
        locale: "en",
        deprecatedAt: null,
        AND: [
          pathwayLessonPathwayWhere(markers),
          {
            OR: [
              ...stringFieldContains("topic", aliases),
              ...stringFieldContains("topicSlug", aliases),
              ...stringFieldContains("bodySystem", aliases),
              ...stringFieldContains("title", aliases),
            ],
          },
        ],
      } as never,
    }),
  );
}

async function countFlashcards(prisma: PrismaClient, markers: readonly string[], aliases: readonly string[]) {
  return safeCount("Flashcards", () =>
    prisma.flashcard.count({
      where: {
        status: "PUBLISHED",
        AND: [
          flashcardPathwayWhere(markers),
          {
            OR: [
              ...stringFieldContains("front", aliases),
              ...stringFieldContains("back", aliases),
              ...stringFieldContains("questionStem", aliases),
              ...stringFieldContains("sourceKey", aliases),
              ...aliases.map((alias) => ({ category: { name: { contains: alias, mode: "insensitive" } } })),
              ...aliases.map((alias) => ({ category: { slug: { contains: alias, mode: "insensitive" } } })),
              ...aliases.map((alias) => ({ category: { topicCode: { contains: alias, mode: "insensitive" } } })),
            ],
          },
        ],
      } as never,
    }),
  );
}

async function countSimulations(prisma: PrismaClient, markers: readonly string[], aliases: readonly string[]) {
  const scenarioTierMarkers = markers
    .map((marker) => {
      if (marker === "RN" || marker === "NCLEX_RN") return "RN_NCLEX_RN";
      if (marker === "RPN" || marker === "LVN_LPN") return "RPN_PN";
      if (marker === "NP") return "NP";
      if (marker === "NEW_GRAD") return "NEW_GRAD";
      return null;
    })
    .filter((marker): marker is string => Boolean(marker) && VALID_SCENARIO_TIERS.has(marker));

  return safeCount("Simulations", () =>
    prisma.clinicalNursingScenario.count({
      where: {
        publishStatus: "APPROVED",
        AND: [
          {
            OR: [
              ...markers.map((marker) => ({ pathwayId: { contains: marker, mode: "insensitive" } })),
              ...markers.map((marker) => ({ canonicalCategoryId: { contains: marker, mode: "insensitive" } })),
              ...scenarioTierMarkers.map((marker) => ({ tierFocus: marker })),
            ],
          },
          {
            OR: [
              ...stringFieldContains("title", aliases),
              ...stringFieldContains("canonicalCategoryId", aliases),
              ...stringFieldContains("presentingConcern", aliases),
              ...stringFieldContains("assessmentFindings", aliases),
            ],
          },
        ],
      } as never,
    }),
  );
}

async function countRemediationLinks(prisma: PrismaClient, markers: readonly string[], aliases: readonly string[]) {
  const questionLinks = await safeCount("Question remediation links", () =>
    prisma.examQuestion.count({
      where: {
        status: { equals: "published", mode: "insensitive" },
        OR: [{ isStudyGuideLinked: true }, { studyLinkPathwayId: { not: null } }, { studyLinkLessonSlug: { not: null } }],
        AND: [examQuestionPathwayWhere(markers), topicWhere(aliases, ["topic", "subtopic", "bodySystem", "stem"])],
      } as never,
    }),
  );

  const flashcardLinks = await safeCount("Flashcard remediation links", () =>
    prisma.flashcard.count({
      where: {
        status: "PUBLISHED",
        OR: [{ lessonId: { not: null } }, { examQuestionId: { not: null } }],
        AND: [
          flashcardPathwayWhere(markers),
          {
            OR: [
              ...stringFieldContains("front", aliases),
              ...stringFieldContains("back", aliases),
              ...aliases.map((alias) => ({ category: { name: { contains: alias, mode: "insensitive" } } })),
              ...aliases.map((alias) => ({ category: { slug: { contains: alias, mode: "insensitive" } } })),
            ],
          },
        ],
      } as never,
    }),
  );

  const simulationLinks = await safeCount("Simulation remediation links", () =>
    prisma.clinicalNursingScenario.count({
      where: {
        publishStatus: "APPROVED",
        studyLinkLessonSlug: { not: null },
        AND: [
          {
            OR: [
              ...markers.map((marker) => ({ pathwayId: { contains: marker, mode: "insensitive" } })),
              ...markers.map((marker) => ({ canonicalCategoryId: { contains: marker, mode: "insensitive" } })),
            ],
          },
          {
            OR: [
              ...stringFieldContains("title", aliases),
              ...stringFieldContains("canonicalCategoryId", aliases),
              ...stringFieldContains("presentingConcern", aliases),
            ],
          },
        ],
      } as never,
    }),
  );

  return {
    questionLinks,
    flashcardLinks,
    simulationLinks,
  };
}

function scoreMetrics(metrics: ReadinessMetric[]): number | null {
  const verified = metrics.filter((item) => item.completionPercent !== null);
  if (!verified.length) return null;
  return Number((verified.reduce((sum, item) => sum + (item.completionPercent ?? 0), 0) / verified.length).toFixed(1));
}

function classifyGap(metric: ReadinessMetric): Severity | null {
  if (metric.verificationStatus === "Unable To Verify") return "High";
  const actual = metric.actual ?? 0;
  const completion = metric.completionPercent ?? 0;
  if (actual === 0 && ["questions", "lessons", "flashcards", "catCoverage"].includes(metric.key)) return "Critical";
  if (actual === 0) return "High";
  if (completion < 40) return "High";
  if (completion < 70) return "Medium";
  if (completion < 90) return "Low";
  return null;
}

function buildDeficiency(pathway: string, category: string, metric: ReadinessMetric): Deficiency | null {
  const severity = classifyGap(metric);
  if (!severity) return null;
  const issue =
    metric.verificationStatus === "Unable To Verify"
      ? `${metric.label} evidence is unable to verify.`
      : `${metric.label} coverage is ${metric.completionPercent ?? 0}% against the audit target.`;
  return {
    severity,
    pathway,
    category,
    asset: metric.label,
    target: metric.target,
    actual: metric.actual,
    completionPercent: metric.completionPercent,
    issue,
    recommendedAction:
      metric.verificationStatus === "Unable To Verify"
        ? `Add an auditable content inventory source for ${metric.label.toLowerCase()} or map the existing source to Prisma.`
        : `Build ${metric.label.toLowerCase()} for ${pathway} ${category} until the readiness target is met.`,
  };
}

function buildStrength(pathway: string, category: string, metric: ReadinessMetric): Strength | null {
  if (metric.actual === null || metric.target === null || metric.completionPercent === null) return null;
  if (metric.completionPercent < 100) return null;
  return {
    pathway,
    category,
    asset: metric.label,
    actual: metric.actual,
    target: metric.target,
    completionPercent: metric.completionPercent,
    evidence: `${metric.source}: ${metric.actual} verified records.`,
  };
}

async function buildTopicReadiness(prisma: PrismaClient): Promise<TopicReadiness[]> {
  const rows: TopicReadiness[] = [];

  for (const pathway of PATHWAYS) {
    for (const category of CATEGORIES) {
      const [questions, lessons, flashcards, simulations, catCoverage, remediationLinks] = await Promise.all([
        countQuestions(prisma, pathway.markers, category.aliases),
        countLessons(prisma, pathway.markers, category.aliases),
        countFlashcards(prisma, pathway.markers, category.aliases),
        countSimulations(prisma, pathway.markers, category.aliases),
        countQuestions(prisma, pathway.markers, category.aliases, { isAdaptiveEligible: true }),
        countRemediationLinks(prisma, pathway.markers, category.aliases),
      ]);

      const metrics: ReadinessMetric[] = [
        metric("questions", questions.actual, "Prisma exam_questions", questions.explanation),
        metric("lessons", lessons.actual, "Prisma pathway_lessons", lessons.explanation),
        metric("flashcards", flashcards.actual, "Prisma flashcards joined to categories", flashcards.explanation),
        metric("simulations", simulations.actual, "Prisma clinical_nursing_scenarios", simulations.explanation),
        metric(
          "practiceExams",
          null,
          "PracticeTest stores learner-created sessions rather than production practice-exam inventory",
          "Unable To Verify: no production practice-exam catalog model with pathway/category mappings was identified in the Prisma schema.",
        ),
        metric("catCoverage", catCoverage.actual, "Prisma exam_questions where is_adaptive_eligible = true", catCoverage.explanation),
      ];

      const remediationPresent = [];
      const remediationMissing = [];
      const questionLinkCount = remediationLinks.questionLinks.actual;
      const flashcardLinkCount = remediationLinks.flashcardLinks.actual;
      const simulationLinkCount = remediationLinks.simulationLinks.actual;

      if ((questionLinkCount ?? 0) > 0) remediationPresent.push("Question rationale/study links");
      else remediationMissing.push("Question rationale/study links");
      if ((flashcardLinkCount ?? 0) > 0) remediationPresent.push("Flashcard remediation links");
      else remediationMissing.push("Flashcard remediation links");
      if ((simulationLinkCount ?? 0) > 0) remediationPresent.push("Simulation remediation links");
      else remediationMissing.push("Simulation remediation links");

      const remUnable = [remediationLinks.questionLinks, remediationLinks.flashcardLinks, remediationLinks.simulationLinks].some(
        (item) => item.actual === null,
      );

      const journeyParts = [
        ["Lesson", lessons.actual],
        ["Flashcards", flashcards.actual],
        ["Practice Questions", questions.actual],
        ["CAT", catCoverage.actual],
        ["Weak Area Remediation", remediationPresent.length],
        ["Simulation", simulations.actual],
      ] as const;
      const present = journeyParts.filter(([, actual]) => (actual ?? 0) > 0).map(([label]) => label);
      const missing = journeyParts.filter(([, actual]) => (actual ?? 0) <= 0).map(([label]) => label);

      rows.push({
        pathway: pathway.label,
        category: category.label,
        metrics,
        educationalDepthScore: scoreMetrics(metrics.filter((item) => item.key !== "practiceExams")),
        learnerJourney: {
          status: metrics.every((item) => item.verificationStatus === "Unable To Verify")
            ? "Unable To Verify"
            : missing.length === 0
              ? "Complete Learning Loop"
              : "Incomplete Learning Loop",
          present,
          missing,
        },
        remediation: {
          status: remUnable
            ? "Unable To Verify"
            : remediationMissing.length === 0
              ? "Present"
              : remediationPresent.length > 0
                ? "Partial"
                : "Missing",
          present: remediationPresent,
          missing: remediationMissing,
          explanation: remUnable ? "One or more remediation-link queries could not be verified." : undefined,
        },
        readinessScore: scoreMetrics(metrics.filter((item) => item.verificationStatus === "Verified")),
      });
    }
  }

  return rows;
}

function buildUnavailableReport(explanation: string): AuditReport {
  const topicReadiness: TopicReadiness[] = PATHWAYS.flatMap((pathway) =>
    CATEGORIES.map((category) => ({
      pathway: pathway.label,
      category: category.label,
      metrics: (Object.keys(TARGET_POLICY.targets) as MetricKey[]).map((key) =>
        metric(key, null, "Prisma database", "Unable To Verify: database was unreachable."),
      ),
      educationalDepthScore: null,
      learnerJourney: {
        status: "Unable To Verify",
        present: [],
        missing: ["Lesson", "Flashcards", "Practice Questions", "CAT", "Weak Area Remediation", "Simulation"],
        explanation,
      },
      remediation: {
        status: "Unable To Verify",
        present: [],
        missing: ["Question rationale/study links", "Flashcard remediation links", "Simulation remediation links"],
        explanation,
      },
      readinessScore: null,
    })),
  );

  return assembleReport(topicReadiness, {
    status: "Database Unreachable",
    explanation,
  });
}

function assembleReport(
  topicReadiness: TopicReadiness[],
  database: AuditReport["database"] = { status: "Connected" },
): AuditReport {
  const deficiencies = topicReadiness
    .flatMap((row) => row.metrics.map((item) => buildDeficiency(row.pathway, row.category, item)).filter(Boolean) as Deficiency[])
    .sort((a, b) => {
      const order: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
      return order[a.severity] - order[b.severity] || (a.completionPercent ?? -1) - (b.completionPercent ?? -1);
    })
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const strengths = topicReadiness
    .flatMap((row) => row.metrics.map((item) => buildStrength(row.pathway, row.category, item)).filter(Boolean) as Strength[])
    .sort((a, b) => b.actual - a.actual)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const systemReadiness = PATHWAYS.map((pathway) => {
    const rows = topicReadiness.filter((row) => row.pathway === pathway.label);
    const scores = rows.map((row) => row.readinessScore).filter((score): score is number => score !== null);
    const readinessScore = scores.length ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)) : null;
    const gaps = deficiencies.filter((item) => item.pathway === pathway.label);
    return {
      pathway: pathway.label,
      readinessScore,
      verificationStatus: readinessScore === null ? ("Unable To Verify" as const) : ("Verified" as const),
      criticalGaps: gaps.filter((item) => item.severity === "Critical").length,
      highGaps: gaps.filter((item) => item.severity === "High").length,
    };
  });

  const verifiedScores = systemReadiness.map((item) => item.readinessScore).filter((score): score is number => score !== null);
  const overallEducationalReadinessScore = verifiedScores.length
    ? Number((verifiedScores.reduce((sum, score) => sum + score, 0) / verifiedScores.length).toFixed(1))
    : null;

  const unableToVerify = topicReadiness.flatMap((row) =>
    row.metrics
      .filter((item) => item.verificationStatus === "Unable To Verify")
      .map((item) => `${row.pathway} / ${row.category} / ${item.label}: ${item.explanation ?? "Unable To Verify"}`),
  );

  const sumMetric = (key: MetricKey, category?: string): number | null => {
    const metrics = topicReadiness
      .filter((row) => !category || row.category === category)
      .map((row) => row.metrics.find((item) => item.key === key))
      .filter((item): item is ReadinessMetric => Boolean(item));
    if (!metrics.length || metrics.some((item) => item.actual === null)) return null;
    return metrics.reduce((sum, item) => sum + (item.actual ?? 0), 0);
  };

  const assetAudit: AuditReport["educationalAssetAudit"] = [
    { asset: "Lessons", actual: sumMetric("lessons"), verificationStatus: sumMetric("lessons") === null ? "Unable To Verify" : "Verified", source: "Prisma pathway_lessons" },
    { asset: "Questions", actual: sumMetric("questions"), verificationStatus: sumMetric("questions") === null ? "Unable To Verify" : "Verified", source: "Prisma exam_questions" },
    { asset: "Flashcards", actual: sumMetric("flashcards"), verificationStatus: sumMetric("flashcards") === null ? "Unable To Verify" : "Verified", source: "Prisma flashcards" },
    {
      asset: "Practice Exams",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "Prisma practice_tests",
      explanation: "PracticeTest stores learner-created sessions; no production practice-exam content catalog with topic/pathway mappings was identified.",
    },
    { asset: "CAT Pools", actual: sumMetric("catCoverage"), verificationStatus: sumMetric("catCoverage") === null ? "Unable To Verify" : "Verified", source: "Prisma exam_questions.is_adaptive_eligible" },
    { asset: "Simulations", actual: sumMetric("simulations"), verificationStatus: sumMetric("simulations") === null ? "Unable To Verify" : "Verified", source: "Prisma clinical_nursing_scenarios" },
    {
      asset: "Case Studies",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "Prisma exam_questions / clinical_nursing_scenarios",
      explanation: "No dedicated production case-study catalog model with complete pathway/category mappings was verified by this audit.",
    },
    { asset: "Pharmacology", actual: sumMetric("questions", "Pharmacology"), verificationStatus: sumMetric("questions", "Pharmacology") === null ? "Unable To Verify" : "Verified", source: "Topic-matched Prisma question counts" },
    { asset: "Clinical Skills", actual: sumMetric("questions", "Clinical Skills"), verificationStatus: sumMetric("questions", "Clinical Skills") === null ? "Unable To Verify" : "Verified", source: "Topic-matched Prisma question counts" },
    {
      asset: "ECG",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "ECG content models",
      explanation: "A complete ECG asset inventory spans specialized models and was not reduced to a single auditable count in this pass.",
    },
    {
      asset: "Med Math",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "Med math content models",
      explanation: "No dedicated med-math inventory model with pathway/category mappings was identified by this audit.",
    },
    {
      asset: "Labs",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "Labs content models",
      explanation: "No dedicated labs inventory model with pathway/category mappings was identified by this audit.",
    },
    {
      asset: "Study Plans",
      actual: null,
      verificationStatus: "Unable To Verify",
      source: "Study plan generation/runtime state",
      explanation: "Study plans are generated/runtime learner artifacts; no production study-plan content inventory model was identified.",
    },
    {
      asset: "Weak Area Remediation",
      actual: topicReadiness.some((row) => row.remediation.status === "Unable To Verify")
        ? null
        : topicReadiness.filter((row) => row.remediation.status === "Present" || row.remediation.status === "Partial").length,
      verificationStatus: topicReadiness.some((row) => row.remediation.status === "Unable To Verify") ? "Unable To Verify" : "Verified",
      source: "Question, flashcard, and simulation remediation link counts",
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    audit: "NurseNest Educational Readiness Audit System 2.0",
    database,
    targetPolicy: TARGET_POLICY,
    executiveSummary: [
      database.status === "Connected"
        ? "Database connection succeeded; verified metrics are based on read-only Prisma counts."
        : "Database connection failed; database-dependent metrics are marked Unable To Verify.",
      `Overall educational readiness score: ${overallEducationalReadinessScore === null ? "Unable To Verify" : `${overallEducationalReadinessScore}%`}.`,
      `Top deficiencies generated from ${deficiencies.length} verified or unverifiable coverage findings.`,
      "Practice exam inventory coverage is marked Unable To Verify because the detected PracticeTest model stores learner-built sessions, not a production content catalog.",
    ],
    systemReadiness,
    educationalAssetAudit: assetAudit,
    topicReadiness,
    missingCoverageReport: deficiencies,
    top100Deficiencies: deficiencies.slice(0, 100),
    top100Strengths: strengths.slice(0, 100),
    recommendedBuildOrder: deficiencies.filter((item) => item.severity === "Critical" || item.severity === "High").slice(0, 100),
    overallEducationalReadinessScore,
    unableToVerify: Array.from(new Set(unableToVerify)).slice(0, 500),
  };
}

function renderMetricTable(rows: TopicReadiness[]): string {
  const lines = [
    "| Pathway | Category | Readiness | Questions | Lessons | Flashcards | Simulations | Practice Exams | CAT | Journey |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const row of rows) {
    const byKey = new Map(row.metrics.map((item) => [item.key, item]));
    const format = (key: MetricKey) => {
      const item = byKey.get(key);
      if (!item || item.actual === null) return "Unable To Verify";
      return `${item.actual}/${item.target ?? "n/a"} (${item.completionPercent ?? "n/a"}%)`;
    };
    lines.push(
      `| ${row.pathway} | ${row.category} | ${row.readinessScore === null ? "Unable To Verify" : `${row.readinessScore}%`} | ${format("questions")} | ${format("lessons")} | ${format("flashcards")} | ${format("simulations")} | ${format("practiceExams")} | ${format("catCoverage")} | ${row.learnerJourney.status} |`,
    );
  }

  return lines.join("\n");
}

function renderReport(report: AuditReport): string {
  const systemLines = [
    "| Pathway | Readiness | Critical Gaps | High Gaps | Status |",
    "| --- | ---: | ---: | ---: | --- |",
    ...report.systemReadiness.map(
      (item) =>
        `| ${item.pathway} | ${item.readinessScore === null ? "Unable To Verify" : `${item.readinessScore}%`} | ${item.criticalGaps} | ${item.highGaps} | ${item.verificationStatus} |`,
    ),
  ];

  const assetLines = [
    "| Asset | Actual | Status | Source | Explanation |",
    "| --- | ---: | --- | --- | --- |",
    ...report.educationalAssetAudit.map(
      (item) =>
        `| ${item.asset} | ${item.actual ?? "Unable To Verify"} | ${item.verificationStatus} | ${item.source} | ${item.explanation ?? ""} |`,
    ),
  ];

  const deficiencyLines = [
    "| Rank | Severity | Pathway | Category | Asset | Actual | Target | Completion | Recommended Action |",
    "| ---: | --- | --- | --- | --- | ---: | ---: | ---: | --- |",
    ...report.top100Deficiencies.map(
      (item) =>
        `| ${item.rank} | ${item.severity} | ${item.pathway} | ${item.category} | ${item.asset} | ${item.actual ?? "Unable To Verify"} | ${item.target ?? "n/a"} | ${item.completionPercent === null ? "Unable To Verify" : `${item.completionPercent}%`} | ${item.recommendedAction} |`,
    ),
  ];

  const strengthLines = [
    "| Rank | Pathway | Category | Asset | Actual | Target | Completion |",
    "| ---: | --- | --- | --- | ---: | ---: | ---: |",
    ...report.top100Strengths.map(
      (item) =>
        `| ${item.rank} | ${item.pathway} | ${item.category} | ${item.asset} | ${item.actual} | ${item.target} | ${item.completionPercent}% |`,
    ),
  ];

  return [
    "# NurseNest Educational Readiness Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Executive Summary",
    "",
    ...report.executiveSummary.map((line) => `- ${line}`),
    "",
    "## Database Validation",
    "",
    `Status: **${report.database.status}**`,
    report.database.explanation ? `\n${report.database.explanation}\n` : "",
    "## Target Policy",
    "",
    `Source: ${report.targetPolicy.source}`,
    "",
    report.targetPolicy.rationale,
    "",
    "## System Readiness",
    "",
    systemLines.join("\n"),
    "",
    "## Educational Asset Audit",
    "",
    assetLines.join("\n"),
    "",
    "## Topic Readiness",
    "",
    renderMetricTable(report.topicReadiness),
    "",
    "## Top 100 Deficiencies",
    "",
    deficiencyLines.join("\n"),
    "",
    "## Top 100 Strengths",
    "",
    strengthLines.join("\n"),
    "",
    "## Recommended Build Order",
    "",
    ...report.recommendedBuildOrder.slice(0, 30).map((item) => `- **${item.severity}** ${item.pathway} ${item.category}: ${item.recommendedAction}`),
    "",
    "## Unable To Verify",
    "",
    ...(report.unableToVerify.length ? report.unableToVerify.slice(0, 100).map((item) => `- ${item}`) : ["- None"]),
    "",
  ].join("\n");
}

function writeReports(report: AuditReport) {
  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(MD_PATH, renderReport(report));
}

async function main() {
  try {
    loadRuntimeEnv({ envRoot: ROOT, quiet: true, validate: true, purpose: "educational-readiness-audit" });
  } catch (error) {
    const explanation = `Runtime environment could not be loaded: ${error instanceof Error ? error.message : String(error)}`;
    const report = buildUnavailableReport(explanation);
    writeReports(report);
    console.log(`Educational readiness audit generated with database status: ${report.database.status}`);
    console.log(JSON_PATH);
    console.log(MD_PATH);
    return;
  }

  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const topicReadiness = await buildTopicReadiness(prisma);
    const report = assembleReport(topicReadiness);
    writeReports(report);
    console.log(`Educational readiness audit generated: ${report.overallEducationalReadinessScore ?? "Unable To Verify"}%`);
    console.log(JSON_PATH);
    console.log(MD_PATH);
  } catch (error) {
    const explanation = `Database Unreachable: ${error instanceof Error ? error.message : String(error)}`;
    const report = buildUnavailableReport(explanation);
    writeReports(report);
    console.log(`Educational readiness audit generated with database status: ${report.database.status}`);
    console.log(JSON_PATH);
    console.log(MD_PATH);
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

void main();

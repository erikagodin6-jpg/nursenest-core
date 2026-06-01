#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { CNPLE_LOFT_CASES } from "../src/content/cases/cnple-case-catalog";
import { EXAM_PATHWAYS } from "../src/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "../src/lib/exam-pathways/types";

type NpTrackId = "ca-np-cnple" | "us-np-fnp" | "us-np-agpcnp" | "us-np-pmhnp" | "us-np-whnp" | "us-np-pnp-pc";

type TrackConfig = {
  id: NpTrackId;
  label: string;
  shortName: string;
  targetQuestions: number;
  targetLessons: number;
  targetClinicalReasoningCases: number;
  expectedBlueprintDomains: string[];
  specialtyKeywords: string[];
  pharmacologyKeywords: string[];
  differentialKeywords: string[];
};

const TRACKS: TrackConfig[] = [
  {
    id: "ca-np-cnple",
    label: "CNPLE",
    shortName: "CNPLE",
    targetQuestions: 2500,
    targetLessons: 300,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "health assessment",
      "diagnosis",
      "therapeutics",
      "health promotion",
      "professional role",
      "clinical judgment",
      "prescribing",
      "diagnostics",
    ],
    specialtyKeywords: ["cnple", "canadian np", "primary care", "family", "adult", "pediatric", "geriatric"],
    pharmacologyKeywords: ["prescribing", "pharmacology", "medication", "drug", "dose", "antibiotic", "opioid", "insulin"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "workup", "red flag", "rule out"],
  },
  {
    id: "us-np-fnp",
    label: "FNP",
    shortName: "FNP",
    targetQuestions: 3000,
    targetLessons: 350,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "assessment",
      "diagnosis",
      "planning",
      "evaluation",
      "pediatrics",
      "adult",
      "women",
      "geriatrics",
      "pharmacology",
      "professional role",
    ],
    specialtyKeywords: ["family", "lifespan", "pediatric", "adult", "geriatric", "women", "primary care", "fnp"],
    pharmacologyKeywords: ["prescribing", "pharmacology", "medication", "drug", "dose", "antibiotic", "insulin", "contraception"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "workup", "red flag", "rule out"],
  },
  {
    id: "us-np-agpcnp",
    label: "AGPCNP",
    shortName: "AGPCNP",
    targetQuestions: 3000,
    targetLessons: 350,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "assessment",
      "diagnosis",
      "planning",
      "evaluation",
      "adult",
      "gerontology",
      "chronic disease",
      "pharmacology",
      "professional role",
    ],
    specialtyKeywords: ["adult", "geriatric", "gerontology", "chronic", "primary care", "agpcnp", "older adult"],
    pharmacologyKeywords: ["prescribing", "pharmacology", "medication", "drug", "dose", "polypharmacy", "renal dosing"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "workup", "red flag", "rule out"],
  },
  {
    id: "us-np-pmhnp",
    label: "PMHNP",
    shortName: "PMHNP",
    targetQuestions: 3000,
    targetLessons: 350,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "assessment",
      "diagnosis",
      "psychopharmacology",
      "therapy",
      "crisis",
      "lifespan",
      "professional role",
    ],
    specialtyKeywords: ["psychiatric", "mental health", "psych", "therapy", "crisis", "pmhnp", "substance", "mood"],
    pharmacologyKeywords: ["psychopharmacology", "antidepressant", "antipsychotic", "mood stabilizer", "benzodiazepine", "medication"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "risk assessment", "suicide", "mania", "psychosis"],
  },
  {
    id: "us-np-whnp",
    label: "WHNP",
    shortName: "WHNP",
    targetQuestions: 2500,
    targetLessons: 300,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "gynecology",
      "obstetrics",
      "contraception",
      "primary care",
      "reproductive health",
      "pharmacology",
      "professional role",
    ],
    specialtyKeywords: ["women", "gynecology", "obstetric", "pregnancy", "contraception", "menopause", "reproductive", "whnp"],
    pharmacologyKeywords: ["contraception", "hormone", "prescribing", "medication", "antibiotic", "pregnancy", "lactation"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "pelvic pain", "bleeding", "workup", "red flag"],
  },
  {
    id: "us-np-pnp-pc",
    label: "PNP-PC",
    shortName: "PNP-PC",
    targetQuestions: 2500,
    targetLessons: 300,
    targetClinicalReasoningCases: 500,
    expectedBlueprintDomains: [
      "growth",
      "development",
      "pediatrics",
      "immunization",
      "acute illness",
      "chronic illness",
      "pharmacology",
      "family-centered care",
    ],
    specialtyKeywords: ["pediatric", "child", "adolescent", "infant", "immunization", "growth", "development", "pnp"],
    pharmacologyKeywords: ["pediatric dose", "weight based", "immunization", "antibiotic", "medication", "vaccine"],
    differentialKeywords: ["differential", "diagnosis", "diagnostic", "workup", "red flag", "rule out"],
  },
];

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production"]) {
    const file = resolve(process.cwd(), name);
    if (!existsSync(file)) continue;
    const parsed = parseDotenv(readFileSync(file, "utf8"));
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

function mdTable(rows: string[][]): string[] {
  if (rows.length === 0) return [];
  const [header, ...body] = rows;
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`),
  ];
}

function pct(current: number, target: number): number {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

function keywordWhere(keywords: string[]) {
  return {
    OR: keywords.flatMap((keyword) => [
      { stem: { contains: keyword, mode: "insensitive" as const } },
      { rationale: { contains: keyword, mode: "insensitive" as const } },
      { clinicalReasoning: { contains: keyword, mode: "insensitive" as const } },
      { clinicalPearl: { contains: keyword, mode: "insensitive" as const } },
      { topic: { contains: keyword, mode: "insensitive" as const } },
      { subtopic: { contains: keyword, mode: "insensitive" as const } },
      { tags: { has: keyword } },
    ]),
  };
}

function lessonKeywordWhere(pathwayId: string, keywords: string[]) {
  return {
    pathwayId,
    status: "PUBLISHED" as const,
    deprecatedAt: null,
    OR: keywords.flatMap((keyword) => [
      { title: { contains: keyword, mode: "insensitive" as const } },
      { topic: { contains: keyword, mode: "insensitive" as const } },
      { topicSlug: { contains: keyword.toLowerCase().replace(/\s+/g, "-"), mode: "insensitive" as const } },
      { bodySystem: { contains: keyword, mode: "insensitive" as const } },
    ]),
  };
}

function questionBaseWhere(pathway: ExamPathwayDefinition) {
  return {
    AND: [
      { status: { in: ["published", "PUBLISHED"] } },
      { exam: { in: pathway.contentExamKeys } },
      { countryCode: pathway.countryCode },
      { tier: pathway.stripeTier },
    ],
  };
}

function specialtyQuestionWhere(pathway: ExamPathwayDefinition, config: TrackConfig) {
  return {
    AND: [
      { status: { in: ["published", "PUBLISHED"] } },
      { countryCode: pathway.countryCode },
      { tier: pathway.stripeTier },
      {
        OR: [
          { exam: { in: pathway.contentExamKeys.filter((key) => key !== "NP") } },
          ...config.specialtyKeywords.flatMap((keyword) => [
            { topic: { contains: keyword, mode: "insensitive" as const } },
            { subtopic: { contains: keyword, mode: "insensitive" as const } },
            { stem: { contains: keyword, mode: "insensitive" as const } },
            { tags: { has: keyword } },
          ]),
        ],
      },
    ],
  };
}

async function countDistinctCaseIds(prisma: PrismaClient, where: object): Promise<number> {
  const rows = await prisma.examQuestion.findMany({
    where: { ...where, caseId: { not: null } } as never,
    select: { caseId: true },
    distinct: ["caseId"],
  });
  return rows.length;
}

function scoreReadiness(parts: {
  questions: number;
  lessons: number;
  flashcards: number;
  clinicalReasoning: number;
  blueprint: number;
}): number {
  return Math.round(
    parts.questions * 0.3 +
      parts.lessons * 0.2 +
      parts.flashcards * 0.15 +
      parts.clinicalReasoning * 0.2 +
      parts.blueprint * 0.15,
  );
}

function scoreMonetization(readiness: number, questionsPct: number, flashcardsPct: number, clinicalPct: number): number {
  return Math.round(readiness * 0.45 + questionsPct * 0.25 + flashcardsPct * 0.15 + clinicalPct * 0.15);
}

function scoreCompetitive(readiness: number, blueprint: number, clinicalPct: number): number {
  return Math.round(readiness * 0.45 + blueprint * 0.25 + clinicalPct * 0.3);
}

function roadmapFor(config: TrackConfig, row: AuditRow): string[] {
  const tasks: string[] = [];
  if (row.questions < config.targetQuestions) {
    tasks.push(`Add ${config.targetQuestions - row.questions} clinically reviewed questions, prioritizing specialty-tagged items over generic NP reuse.`);
  }
  if (row.lessons < config.targetLessons) {
    tasks.push(`Add ${config.targetLessons - row.lessons} lessons across weak blueprint domains.`);
  }
  if (row.clinicalReasoningCases < config.targetClinicalReasoningCases) {
    tasks.push(`Add ${config.targetClinicalReasoningCases - row.clinicalReasoningCases} clinical reasoning cases with staged diagnostics, management, and follow-up decisions.`);
  }
  if (row.soapNoteCases < 50) tasks.push("Create a SOAP-note documentation case set; current evidence is below 50 cases.");
  if (row.diagnosticReasoningCases < 150) tasks.push("Expand diagnostic reasoning and differential-diagnosis cases; target at least 150 before paid market positioning.");
  if (row.blueprintReadiness < 90) {
    tasks.push(`Close blueprint gaps: ${row.missingBlueprintDomains.join(", ") || "unclassified domains"}.`);
  }
  return tasks.length ? tasks : ["Maintain content freshness and add higher-discrimination practice items."];
}

type AuditRow = {
  inventorySource: "database" | "static";
  pathwayId: string;
  label: string;
  registryStatus: string;
  lessons: number;
  questions: number;
  specialtyTaggedQuestions: number;
  activeQuestions: number;
  catEligibleQuestions: number;
  flashcards: number;
  caseStudies: number;
  clinicalScenarios: number;
  soapNoteCases: number;
  diagnosticReasoningCases: number;
  clinicalReasoningCases: number;
  pharmacologyQuestions: number;
  pharmacologyLessons: number;
  differentialQuestions: number;
  differentialLessons: number;
  blueprintReadiness: number;
  missingBlueprintDomains: string[];
  readinessScore: number;
  monetizationScore: number;
  competitiveScore: number;
  below90Blueprint: boolean;
  roadmap: string[];
};

function loadStaticLessonCounts(): Map<string, number> {
  const files = [
    resolve(process.cwd(), "src/content/pathway-lessons/catalog.json"),
    resolve(process.cwd(), "src/content/pathway-lessons/np-core-catalog.json"),
    resolve(process.cwd(), "src/content/pathway-lessons/np-parity-expansion-catalog.json"),
  ];
  const counts = new Map<string, number>();
  for (const file of files) {
    if (!existsSync(file)) continue;
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { pathways?: Record<string, { lessons?: unknown[] }> };
    for (const [pathwayId, payload] of Object.entries(parsed.pathways ?? {})) {
      counts.set(pathwayId, Math.max(counts.get(pathwayId) ?? 0, payload.lessons?.length ?? 0));
    }
  }
  return counts;
}

function staticAuditRows(): AuditRow[] {
  const lessonCounts = loadStaticLessonCounts();
  return TRACKS.map((config) => {
    const pathway = EXAM_PATHWAYS.find((p) => p.id === config.id);
    const lessons = lessonCounts.get(config.id) ?? 0;
    const staticCnpleCaseCount = config.id === "ca-np-cnple" ? CNPLE_LOFT_CASES.length : 0;
    const staticCnpleSteps = config.id === "ca-np-cnple" ? CNPLE_LOFT_CASES.reduce((sum, c) => sum + c.steps.length, 0) : 0;
    const lessonPct = pct(lessons, config.targetLessons);
    const clinicalPct = pct(staticCnpleCaseCount + staticCnpleSteps, config.targetClinicalReasoningCases);
    const readinessScore = scoreReadiness({
      questions: 0,
      lessons: lessonPct,
      flashcards: 0,
      clinicalReasoning: clinicalPct,
      blueprint: 0,
    });
    const row: AuditRow = {
      inventorySource: "static",
      pathwayId: config.id,
      label: config.label,
      registryStatus: pathway?.status ?? "missing",
      lessons,
      questions: 0,
      specialtyTaggedQuestions: 0,
      activeQuestions: 0,
      catEligibleQuestions: 0,
      flashcards: 0,
      caseStudies: 0,
      clinicalScenarios: staticCnpleCaseCount,
      soapNoteCases: 0,
      diagnosticReasoningCases: 0,
      clinicalReasoningCases: staticCnpleCaseCount + staticCnpleSteps,
      pharmacologyQuestions: 0,
      pharmacologyLessons: 0,
      differentialQuestions: 0,
      differentialLessons: 0,
      blueprintReadiness: 0,
      missingBlueprintDomains: config.expectedBlueprintDomains,
      readinessScore,
      monetizationScore: scoreMonetization(readinessScore, 0, 0, clinicalPct),
      competitiveScore: scoreCompetitive(readinessScore, 0, clinicalPct),
      below90Blueprint: true,
      roadmap: [],
    };
    row.roadmap = [
      "Live database inventory was not available in this run; rerun with production DATABASE_URL before monetization certification.",
      ...roadmapFor(config, row),
    ];
    return row;
  });
}

async function auditTrack(prisma: PrismaClient, config: TrackConfig): Promise<AuditRow> {
  const pathway = EXAM_PATHWAYS.find((p) => p.id === config.id);
  if (!pathway) {
    return {
      inventorySource: "database",
      pathwayId: config.id,
      label: config.label,
      registryStatus: "missing",
      lessons: 0,
      questions: 0,
      specialtyTaggedQuestions: 0,
      activeQuestions: 0,
      catEligibleQuestions: 0,
      flashcards: 0,
      caseStudies: 0,
      clinicalScenarios: 0,
      soapNoteCases: 0,
      diagnosticReasoningCases: 0,
      clinicalReasoningCases: 0,
      pharmacologyQuestions: 0,
      pharmacologyLessons: 0,
      differentialQuestions: 0,
      differentialLessons: 0,
      blueprintReadiness: 0,
      missingBlueprintDomains: config.expectedBlueprintDomains,
      readinessScore: 0,
      monetizationScore: 0,
      competitiveScore: 0,
      below90Blueprint: true,
      roadmap: ["Create canonical pathway registry row before auditing publication readiness."],
    };
  }

  const questionWhere = questionBaseWhere(pathway);
  const specialtyWhere = specialtyQuestionWhere(pathway, config);
  const clinicalReasoningWhere = {
    ...questionWhere,
    AND: [
      ...questionWhere.AND,
      {
        OR: [
          { clinicalReasoning: { not: null } },
          { cognitiveLevel: { contains: "diagnostic", mode: "insensitive" as const } },
          { questionType: { in: ["NGN_CASE", "CASE_STUDY", "BOWTIE", "MATRIX", "TREND"] } },
          { isScenario: true },
          { caseId: { not: null } },
          keywordWhere(["clinical reasoning", "differential", "diagnostic", "management plan"]),
        ],
      },
    ],
  };

  const [lessons, questions, specialtyTaggedQuestions, activeQuestions, catEligibleQuestions, flashcards, caseStudies, clinicalScenarios, soapNoteQuestions, soapScenarios, diagnosticReasoningCases, pharmacologyQuestions, pharmacologyLessons, differentialQuestions, differentialLessons] =
    await Promise.all([
      prisma.pathwayLesson.count({ where: { pathwayId: config.id, status: "PUBLISHED", deprecatedAt: null } }),
      prisma.examQuestion.count({ where: questionWhere as never }),
      prisma.examQuestion.count({ where: specialtyWhere as never }),
      prisma.examQuestion.count({ where: { ...questionWhere, isMockExamEligible: true } as never }),
      prisma.examQuestion.count({ where: { ...questionWhere, isAdaptiveEligible: true } as never }),
      prisma.flashcard.count({
        where: {
          status: "PUBLISHED",
          OR: [
            { deck: { pathwayId: config.id } },
            { country: pathway.countryCode, tier: pathway.stripeTier, examFamily: pathway.examFamily },
          ],
        } as never,
      }),
      countDistinctCaseIds(prisma, questionWhere),
      prisma.clinicalNursingScenario.count({ where: { pathwayId: config.id, publishStatus: "APPROVED" } }),
      prisma.examQuestion.count({ where: { ...questionWhere, ...keywordWhere(["SOAP", "subjective objective assessment plan", "documentation note"]) } as never }),
      prisma.clinicalNursingScenario.count({
        where: {
          pathwayId: config.id,
          publishStatus: "APPROVED",
          OR: [
            { title: { contains: "SOAP", mode: "insensitive" } },
            { assessmentFindings: { contains: "SOAP", mode: "insensitive" } },
            { presentingConcern: { contains: "SOAP", mode: "insensitive" } },
          ],
        },
      }),
      prisma.examQuestion.count({ where: { ...questionWhere, ...keywordWhere(config.differentialKeywords) } as never }),
      prisma.examQuestion.count({ where: { ...questionWhere, ...keywordWhere(config.pharmacologyKeywords) } as never }),
      prisma.pathwayLesson.count({ where: lessonKeywordWhere(config.id, config.pharmacologyKeywords) as never }),
      prisma.examQuestion.count({ where: { ...questionWhere, ...keywordWhere(config.differentialKeywords) } as never }),
      prisma.pathwayLesson.count({ where: lessonKeywordWhere(config.id, config.differentialKeywords) as never }),
    ]);

  const staticCnpleCaseCount = config.id === "ca-np-cnple" ? CNPLE_LOFT_CASES.length : 0;
  const staticCnpleCaseSteps = config.id === "ca-np-cnple" ? CNPLE_LOFT_CASES.reduce((sum, c) => sum + c.steps.length, 0) : 0;
  const totalClinicalScenarios = clinicalScenarios + staticCnpleCaseCount;
  const clinicalReasoningCases = Math.max(caseStudies + totalClinicalScenarios + staticCnpleCaseSteps, await prisma.examQuestion.count({ where: clinicalReasoningWhere as never }));
  const soapNoteCases = soapNoteQuestions + soapScenarios;

  const blueprintEvidence = await Promise.all(
    config.expectedBlueprintDomains.map(async (domain) => {
      const [q, l] = await Promise.all([
        prisma.examQuestion.count({ where: { ...questionWhere, ...keywordWhere([domain]) } as never }),
        prisma.pathwayLesson.count({ where: lessonKeywordWhere(config.id, [domain]) as never }),
      ]);
      return { domain, count: q + l };
    }),
  );
  const coveredBlueprintDomains = blueprintEvidence.filter((row) => row.count > 0);
  const missingBlueprintDomains = blueprintEvidence.filter((row) => row.count === 0).map((row) => row.domain);
  const blueprintReadiness = pct(coveredBlueprintDomains.length, config.expectedBlueprintDomains.length);

  const questionPct = pct(questions, config.targetQuestions);
  const lessonPct = pct(lessons, config.targetLessons);
  const flashcardPct = pct(flashcards, 8000);
  const clinicalPct = pct(clinicalReasoningCases, config.targetClinicalReasoningCases);
  const readinessScore = scoreReadiness({
    questions: questionPct,
    lessons: lessonPct,
    flashcards: flashcardPct,
    clinicalReasoning: clinicalPct,
    blueprint: blueprintReadiness,
  });
  const monetizationScore = scoreMonetization(readinessScore, questionPct, flashcardPct, clinicalPct);
  const competitiveScore = scoreCompetitive(readinessScore, blueprintReadiness, clinicalPct);

  const row: AuditRow = {
    inventorySource: "database",
    pathwayId: config.id,
    label: config.label,
    registryStatus: pathway.status,
    lessons,
    questions,
    specialtyTaggedQuestions,
    activeQuestions,
    catEligibleQuestions,
    flashcards,
    caseStudies,
    clinicalScenarios: totalClinicalScenarios,
    soapNoteCases,
    diagnosticReasoningCases,
    clinicalReasoningCases,
    pharmacologyQuestions,
    pharmacologyLessons,
    differentialQuestions,
    differentialLessons,
    blueprintReadiness,
    missingBlueprintDomains,
    readinessScore,
    monetizationScore,
    competitiveScore,
    below90Blueprint: blueprintReadiness < 90,
    roadmap: [],
  };
  row.roadmap = roadmapFor(config, row);
  return row;
}

function writeCsv(rows: AuditRow[], outPath: string): void {
  const header = [
    "pathwayId",
    "label",
    "registryStatus",
    "lessons",
    "questions",
    "specialtyTaggedQuestions",
    "activeQuestions",
    "catEligibleQuestions",
    "flashcards",
    "caseStudies",
    "clinicalScenarios",
    "soapNoteCases",
    "diagnosticReasoningCases",
    "clinicalReasoningCases",
    "pharmacologyQuestions",
    "pharmacologyLessons",
    "differentialQuestions",
    "differentialLessons",
    "blueprintReadiness",
    "readinessScore",
    "monetizationScore",
    "competitiveScore",
    "below90Blueprint",
    "missingBlueprintDomains",
  ];
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  writeFileSync(
    outPath,
    [header.join(","), ...rows.map((row) => header.map((key) => escape((row as unknown as Record<string, unknown>)[key])).join(","))].join("\n") + "\n",
  );
}

function buildMarkdown(rows: AuditRow[]): string {
  const below90 = rows.filter((row) => row.below90Blueprint);
  const readyEnough = rows.filter((row) => row.readinessScore >= 90);
  return [
    "# Nurse Practitioner Portfolio Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Method",
    "",
    "This read-only audit uses the production Prisma content models: `pathway_lessons`, `exam_questions`, `flashcards`, `flashcard_decks`, `clinical_nursing_scenarios`, and the static CNPLE LOFT case catalog. Question counts are pathway-inclusive using each pathway registry's `contentExamKeys`, country, and NP tier. `specialtyTaggedQuestions` separates specialty-specific evidence from generic shared NP inventory.",
    "",
    "Target state used for scoring: 2,500-4,000 questions per NP pathway, 300-500 lessons per pathway, 500+ clinical reasoning cases, and full blueprint-domain coverage.",
    "",
    "## Executive Summary",
    "",
    `- Pathways audited: ${rows.length}`,
    `- Inventory source: ${rows.every((row) => row.inventorySource === "database") ? "database" : "static fallback / database blocked"}`,
    `- Pathways at or above 90% readiness: ${readyEnough.length}`,
    `- Pathways below 90% blueprint readiness: ${below90.length}`,
    `- Strongest pathway: ${rows.slice().sort((a, b) => b.readinessScore - a.readinessScore)[0]?.label ?? "n/a"}`,
    `- Largest risk: ${rows.slice().sort((a, b) => a.readinessScore - b.readinessScore)[0]?.label ?? "n/a"}`,
    "",
    "## Portfolio Scorecard",
    "",
    ...mdTable([
      [
        "Pathway",
        "Lessons",
        "Questions",
        "Specialty Qs",
        "Flashcards",
        "Cases",
        "Scenarios",
        "SOAP",
        "Dx Reasoning",
        "Blueprint",
        "Readiness",
        "Monetization",
        "Competitive",
      ],
      ...rows.map((row) => [
        row.label,
        String(row.lessons),
        String(row.questions),
        String(row.specialtyTaggedQuestions),
        String(row.flashcards),
        String(row.caseStudies),
        String(row.clinicalScenarios),
        String(row.soapNoteCases),
        String(row.diagnosticReasoningCases),
        `${row.blueprintReadiness}%`,
        `${row.readinessScore}%`,
        `${row.monetizationScore}%`,
        `${row.competitiveScore}%`,
      ]),
    ]),
    "",
    "## Coverage Detail",
    "",
    ...rows.flatMap((row) => [
      `### ${row.label}`,
      "",
      ...mdTable([
        ["Metric", "Count / Score"],
        ["Published lessons", String(row.lessons)],
        ["Published questions", String(row.questions)],
        ["Specialty-tagged questions", String(row.specialtyTaggedQuestions)],
        ["Mock/practice eligible questions", String(row.activeQuestions)],
        ["CAT/LOFT eligible questions", String(row.catEligibleQuestions)],
        ["Published flashcards", String(row.flashcards)],
        ["Question-bank case studies", String(row.caseStudies)],
        ["Clinical scenarios", String(row.clinicalScenarios)],
        ["SOAP note cases", String(row.soapNoteCases)],
        ["Diagnostic reasoning cases", String(row.diagnosticReasoningCases)],
        ["Clinical reasoning cases", String(row.clinicalReasoningCases)],
        ["Pharmacology questions", String(row.pharmacologyQuestions)],
        ["Pharmacology lessons", String(row.pharmacologyLessons)],
        ["Differential diagnosis questions", String(row.differentialQuestions)],
        ["Differential diagnosis lessons", String(row.differentialLessons)],
        ["Blueprint readiness", `${row.blueprintReadiness}%`],
        ["Missing blueprint domains", row.missingBlueprintDomains.join(", ") || "none detected"],
      ]),
      "",
      "**Gap Analysis**",
      "",
      ...row.roadmap.map((item) => `- ${item}`),
      "",
    ]),
    "## Blueprint Readiness Flags",
    "",
    ...(below90.length
      ? below90.map((row) => `- ${row.label}: ${row.blueprintReadiness}% blueprint readiness. Missing: ${row.missingBlueprintDomains.join(", ") || "domain evidence not classified"}.`)
      : ["- No pathway fell below 90% blueprint readiness."]),
    "",
    "## Content Roadmap",
    "",
    ...rows.flatMap((row, index) => [
      `${index + 1}. **${row.label}**`,
      ...row.roadmap.map((item) => `   - ${item}`),
    ]),
    "",
    "## Interpretation",
    "",
    "- A pathway should not be treated as fully mature unless both volume and specialty-specific depth pass. Shared generic NP questions help remediation breadth, but specialty-tagged questions are the stronger monetization signal.",
    "- SOAP documentation and diagnostic reasoning are tracked separately because they matter disproportionately for advanced-practice credibility.",
    "- Any pathway below 90% blueprint readiness should remain flagged for curriculum remediation before aggressive paid positioning.",
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  loadEnv();
  const outDir = resolve(process.cwd(), "docs/reports");
  mkdirSync(outDir, { recursive: true });
  if (!process.env.DATABASE_URL?.trim()) {
    const rows = staticAuditRows();
    writeFileSync(resolve(outDir, "np-portfolio-audit.md"), `${buildMarkdown(rows)}\n`, "utf8");
    writeFileSync(resolve(outDir, "np-portfolio-audit.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), inventorySource: "static", rows }, null, 2)}\n`, "utf8");
    writeCsv(rows, resolve(outDir, "np-portfolio-audit.csv"));
    console.log(`[np-portfolio-audit] DATABASE_URL unavailable; wrote static fallback ${resolve(outDir, "np-portfolio-audit.md")}`);
    return;
  }

  const prisma = new PrismaClient();
  try {
    const rows = await Promise.all(TRACKS.map((track) => auditTrack(prisma, track)));
    writeFileSync(resolve(outDir, "np-portfolio-audit.md"), `${buildMarkdown(rows)}\n`, "utf8");
    writeFileSync(resolve(outDir, "np-portfolio-audit.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2)}\n`, "utf8");
    writeCsv(rows, resolve(outDir, "np-portfolio-audit.csv"));
    console.log(`[np-portfolio-audit] wrote ${resolve(outDir, "np-portfolio-audit.md")}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

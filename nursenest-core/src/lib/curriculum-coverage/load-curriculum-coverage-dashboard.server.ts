import "server-only";

import { ClinicalNursingScenarioPublishStatus, ContentStatus, ExamFamily, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { PHARMACOLOGY_CATEGORIES } from "@/lib/pharmacology/pharmacology-learning-system";
import {
  ALLIED_PROFESSION_MAPS,
  CROSS_PROFESSION_PROFILES,
} from "@/lib/platform/cross-profession-design-system";
import {
  buildCurriculumCoverageDashboard,
  CURRICULUM_DEFINITIONS,
  inferCurriculumTopic,
  type CurriculumContentType,
  type CurriculumCoverageDashboard,
  type CurriculumDefinition,
  type CurriculumKey,
  type CurriculumMappedCount,
} from "@/lib/curriculum-coverage/curriculum-coverage-intelligence";

const CURRICULUM_COVERAGE_TIMEOUT_MS = 4000;

type ContentSignal = {
  contentType: CurriculumContentType;
  count: number;
  signals: readonly (string | null | undefined)[];
  tier?: string | null;
  examFamily?: string | null;
  exam?: string | null;
  pathwayId?: string | null;
};

function add(
  rows: CurriculumMappedCount[],
  curriculumKey: CurriculumKey,
  definition: CurriculumDefinition,
  signal: ContentSignal,
): boolean {
  const topicId = inferCurriculumTopic(definition, signal.signals);
  if (!topicId) return false;
  rows.push({ curriculumKey, topicId, contentType: signal.contentType, count: signal.count });
  return true;
}

function inferCurricula(signal: ContentSignal): CurriculumKey[] {
  const exam = `${signal.exam ?? ""} ${signal.examFamily ?? ""} ${signal.tier ?? ""} ${signal.pathwayId ?? ""}`.toLowerCase();
  const curricula = new Set<CurriculumKey>();
  if (/nclex|rn|pn|lvn|lpn/.test(exam)) curricula.add("nclex");
  if (/rex/.test(exam)) curricula.add("rex_pn");
  if (/cnple|np/.test(exam)) curricula.add("cnple");
  if (/hesi/.test(exam)) curricula.add("hesi");
  if (/teas/.test(exam)) curricula.add("teas");
  if (/rt|respiratory|allied/.test(exam)) curricula.add("rt_competencies");
  if (/new[_ -]?grad/.test(exam)) curricula.add("new_grad_competencies");
  return [...curricula];
}

function rememberUnmapped(
  unmapped: CurriculumCoverageDashboard["unmappedSignals"],
  signal: ContentSignal,
) {
  const label = signal.signals.filter(Boolean).join(" · ").trim();
  if (!label) return;
  unmapped.push({ contentType: signal.contentType, label: label.slice(0, 180), count: signal.count });
}

function mapSignals(signals: readonly ContentSignal[]) {
  const mappedCounts: CurriculumMappedCount[] = [];
  const unmappedSignals: CurriculumCoverageDashboard["unmappedSignals"] = [];

  for (const signal of signals) {
    const curricula = inferCurricula(signal);
    let mapped = false;
    for (const curriculumKey of curricula) {
      mapped = add(mappedCounts, curriculumKey, CURRICULUM_DEFINITIONS[curriculumKey], signal) || mapped;
    }
    if (!mapped) rememberUnmapped(unmappedSignals, signal);
  }

  return { mappedCounts, unmappedSignals };
}

async function questionSignals(): Promise<ContentSignal[]> {
  const rows = await prisma.examQuestion.groupBy({
    by: [
      "exam",
      "tier",
      "careerType",
      "bodySystem",
      "topic",
      "subtopic",
      "nclexClientNeedsCategory",
      "questionFormat",
    ],
    where: { status: { equals: "published", mode: "insensitive" } },
    _count: { _all: true },
  });
  return rows.map((row) => ({
    contentType: "questions",
    count: row._count._all,
    tier: row.tier,
    exam: row.exam,
    signals: [
      row.nclexClientNeedsCategory,
      row.bodySystem,
      row.topic,
      row.subtopic,
      row.questionFormat,
      row.careerType,
      row.exam,
    ],
  }));
}

async function lessonSignals(): Promise<ContentSignal[]> {
  const rows = await prisma.pathwayLesson.groupBy({
    by: ["pathwayId", "bodySystem", "topic", "topicSlug"],
    where: {
      status: ContentStatus.PUBLISHED,
      locale: "en",
      canonicalLessonId: null,
      deprecatedAt: null,
    },
    _count: { _all: true },
  });
  return rows.map((row) => ({
    contentType: "lessons",
    count: row._count._all,
    pathwayId: row.pathwayId,
    signals: [row.bodySystem, row.topic, row.topicSlug, row.pathwayId],
  }));
}

async function flashcardSignals(): Promise<ContentSignal[]> {
  const rows = await prisma.flashcard.groupBy({
    by: ["tier", "examFamily", "categoryId"],
    where: { status: ContentStatus.PUBLISHED },
    _count: { _all: true },
  });
  const categories = await prisma.category.findMany({
    where: { id: { in: [...new Set(rows.map((row) => row.categoryId))] } },
    select: { id: true, name: true, slug: true, topicCode: true },
  });
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  return rows.map((row) => {
    const category = categoryMap.get(row.categoryId);
    return {
      contentType: "flashcards",
      count: row._count._all,
      tier: row.tier,
      examFamily: row.examFamily,
      signals: [category?.topicCode, category?.name, category?.slug, row.tier, row.examFamily],
    };
  });
}

async function simulationSignals(): Promise<ContentSignal[]> {
  const rows = await prisma.clinicalNursingScenario.groupBy({
    by: ["pathwayId", "canonicalCategoryId", "tierFocus"],
    where: { publishStatus: ClinicalNursingScenarioPublishStatus.APPROVED },
    _count: { id: true },
  });
  return rows.map((row) => ({
    contentType: "simulations",
    count: row._count.id,
    pathwayId: row.pathwayId,
    tier: row.tierFocus,
    signals: [row.canonicalCategoryId, row.tierFocus, row.pathwayId],
  }));
}

async function ecgSignals(): Promise<ContentSignal[]> {
  const [videos, worksheets] = await Promise.all([
    prisma.ecgVideoQuestion.groupBy({
      by: ["level", "mode", "rhythmTag", "clinicalPriority"],
      _count: { id: true },
    }),
    prisma.ecgWorksheet.groupBy({
      by: ["level"],
      _count: { id: true },
    }),
  ]);
  return [
    ...videos.map((row) => ({
      contentType: "ecg" as const,
      count: row._count.id,
      examFamily: ExamFamily.NCLEX_RN,
      signals: ["ecg", "telemetry", row.level, row.mode, row.rhythmTag, row.clinicalPriority],
    })),
    ...worksheets.map((row) => ({
      contentType: "ecg" as const,
      count: row._count.id,
      examFamily: ExamFamily.NCLEX_RN,
      signals: ["ecg", "telemetry", row.level, "worksheet"],
    })),
  ];
}

function pharmacologySignals(): ContentSignal[] {
  return PHARMACOLOGY_CATEGORIES.flatMap((category) => {
    const curricula: Array<{ tier: string; examFamily: string }> = [];
    if (category.tierDepth.includes("rn")) curricula.push({ tier: TierCode.RN, examFamily: ExamFamily.NCLEX_RN });
    if (category.tierDepth.includes("pn")) curricula.push({ tier: TierCode.RPN, examFamily: ExamFamily.REX_PN });
    if (category.tierDepth.includes("np")) curricula.push({ tier: TierCode.NP, examFamily: ExamFamily.NP });
    if (category.tierDepth.includes("allied")) curricula.push({ tier: TierCode.ALLIED, examFamily: ExamFamily.ALLIED });
    if (category.tierDepth.includes("new_grad")) curricula.push({ tier: TierCode.NEW_GRAD, examFamily: ExamFamily.GENERIC });
    if (category.tierDepth.includes("pre_nursing")) curricula.push({ tier: TierCode.PRE_NURSING, examFamily: ExamFamily.GENERIC });
    return curricula.map((scope) => ({
      contentType: "pharmacology" as const,
      count: 1,
      tier: scope.tier,
      examFamily: scope.examFamily,
      signals: [
        category.id,
        category.title,
        category.lessonTopic,
        category.safetyFocus,
        ...category.commonMedications,
        ...category.highRiskSituations,
      ],
    }));
  });
}

function clinicalSkillSignals(): ContentSignal[] {
  const profileSignals = CROSS_PROFESSION_PROFILES.flatMap((profile) =>
    profile.clinicalSkillFocus.map((skill) => ({
      contentType: "clinical_skills" as const,
      count: 1,
      tier:
        profile.id === "rn"
          ? TierCode.RN
          : profile.id === "rpn"
            ? TierCode.RPN
            : profile.id === "np"
              ? TierCode.NP
              : profile.id === "rt" || profile.id === "allied"
                ? TierCode.ALLIED
                : profile.id === "new-grad"
                  ? TierCode.NEW_GRAD
                  : TierCode.RN,
      examFamily:
        profile.id === "rt" || profile.id === "allied"
          ? ExamFamily.ALLIED
          : profile.id === "np"
            ? ExamFamily.NP
            : profile.id === "rpn"
              ? ExamFamily.REX_PN
              : ExamFamily.NCLEX_RN,
      signals: [profile.label, skill, ...profile.competencyDomains, ...profile.simulationOpportunities],
    })),
  );
  const alliedSignals = ALLIED_PROFESSION_MAPS.flatMap((profession) =>
    profession.skills.map((skill) => ({
      contentType: "clinical_skills" as const,
      count: 1,
      tier: TierCode.ALLIED,
      examFamily: ExamFamily.ALLIED,
      signals: [profession.label, skill, ...profession.competencies, ...profession.clinicalJudgment],
    })),
  );
  return [...profileSignals, ...alliedSignals];
}

async function loadMappedSignals() {
  const [questions, lessons, flashcards, simulations, ecg] = await Promise.all([
    questionSignals(),
    lessonSignals(),
    flashcardSignals(),
    simulationSignals(),
    ecgSignals(),
  ]);
  return mapSignals([
    ...questions,
    ...lessons,
    ...flashcards,
    ...simulations,
    ...ecg,
    ...pharmacologySignals(),
    ...clinicalSkillSignals(),
  ]);
}

export async function loadCurriculumCoverageDashboard(): Promise<CurriculumCoverageDashboard> {
  const fallback = buildCurriculumCoverageDashboard({
    degraded: true,
    mappedCounts: [...pharmacologySignals(), ...clinicalSkillSignals()]
      .flatMap((signal) => {
        const curricula = inferCurricula(signal);
        return curricula.flatMap((curriculumKey) => {
          const topicId = inferCurriculumTopic(CURRICULUM_DEFINITIONS[curriculumKey], signal.signals);
          return topicId ? [{ curriculumKey, topicId, contentType: signal.contentType, count: signal.count }] : [];
        });
      }),
    unmappedSignals: [],
  });

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return fallback;

  return withDatabaseFallbackTimeout(
    async () => {
      const { mappedCounts, unmappedSignals } = await loadMappedSignals();
      return buildCurriculumCoverageDashboard({ mappedCounts, unmappedSignals });
    },
    fallback,
    CURRICULUM_COVERAGE_TIMEOUT_MS,
    { scope: "curriculum_coverage", label: "dashboard" },
  );
}

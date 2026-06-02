import "server-only";

import { ClinicalNursingScenarioPublishStatus, ContentStatus, ExamFamily, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  ALLIED_PROFESSION_MAPS,
  CROSS_PROFESSION_PROFILES,
} from "@/lib/platform/cross-profession-design-system";
import { PHARMACOLOGY_CATEGORIES } from "@/lib/pharmacology/pharmacology-learning-system";
import {
  buildContentQualityIntelligenceReport,
  type ContentQualityIntelligenceReport,
  type UniversalContentObject,
} from "@/lib/content-quality/content-quality-intelligence-engine";

const CQIE_TIMEOUT_MS = 5000;
const MAX_ROWS_PER_SURFACE = 1500;

export type ContentQualityCommandCenter = {
  generatedAt: string;
  degraded: boolean;
  report: ContentQualityIntelligenceReport;
  qualityPanels: Array<{
    id: string;
    label: string;
    score: number;
    count: number;
    critical: number;
  }>;
  notes: string[];
};

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function textFromJson(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textFromJson).join("\n");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(textFromJson).join("\n");
  }
  return String(value);
}

function normalizePathway(args: {
  tier?: string | null;
  exam?: string | null;
  examFamily?: string | null;
  pathwayId?: string | null;
  careerType?: string | null;
}): string {
  const blob = [args.pathwayId, args.exam, args.examFamily, args.tier, args.careerType].filter(Boolean).join(" ").toLowerCase();
  if (/hesi/.test(blob)) return "HESI";
  if (/teas/.test(blob)) return "TEAS";
  if (/new[_ -]?grad/.test(blob)) return "NewGrad";
  if (/rt|respiratory/.test(blob)) return "RT";
  if (/allied/.test(blob)) return "Allied";
  if (/\bnp\b|cnple/.test(blob)) return "NP";
  if (/rex|rpn|lpn|pn/.test(blob)) return "RPN";
  if (/\brn\b|nclex/.test(blob)) return "RN";
  return args.pathwayId ?? args.exam ?? args.tier ?? "Future";
}

function referencesFrom(...values: Array<string | null | undefined>): string[] {
  return values
    .flatMap((value) => String(value ?? "").split(/\n|;|\|/g))
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 8);
}

async function questionObjects(): Promise<UniversalContentObject[]> {
  const questions = await prisma.examQuestion.findMany({
    where: { status: { equals: "published", mode: "insensitive" } },
    select: {
      id: true,
      tier: true,
      exam: true,
      questionType: true,
      stem: true,
      rationale: true,
      topic: true,
      subtopic: true,
      bodySystem: true,
      difficulty: true,
      tags: true,
      clinicalPearl: true,
      examStrategy: true,
      memoryHook: true,
      clinicalReasoning: true,
      distractorRationales: true,
      incorrectAnswerRationale: true,
      referenceSource: true,
      countryCode: true,
      careerType: true,
      createdAt: true,
      updatedAt: true,
      published_by_user_id: true,
      performanceAggregate: {
        select: {
          totalAttempts: true,
          correctAttempts: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_ROWS_PER_SURFACE,
  });

  return questions.map((question) => {
    const attempts = question.performanceAggregate?.totalAttempts ?? 0;
    const correct = question.performanceAggregate?.correctAttempts ?? 0;
    return {
      id: question.id,
      contentType: question.questionType === "CAT" ? "cat" : "question",
      pathway: normalizePathway({
        tier: question.tier,
        exam: question.exam,
        careerType: question.careerType,
      }),
      tier: question.tier,
      topic: question.topic ?? question.bodySystem,
      subtopic: question.subtopic,
      difficulty: question.difficulty == null ? null : String(question.difficulty),
      author: question.published_by_user_id,
      createdAt: iso(question.createdAt),
      updatedAt: iso(question.updatedAt),
      title: question.stem.slice(0, 140),
      stem: question.stem,
      rationale: question.rationale,
      distractorRationales: [
        textFromJson(question.distractorRationales),
        textFromJson(question.incorrectAnswerRationale),
      ].filter(Boolean),
      clinicalPearl: question.clinicalPearl,
      examTip: question.examStrategy,
      memoryHook: question.memoryHook,
      siConvExplanation: question.clinicalReasoning,
      references: referencesFrom(question.referenceSource),
      tags: question.tags,
      exam: question.exam,
      country: question.countryCode,
      metrics: attempts > 0 ? { correctAnswerRate: correct / attempts } : undefined,
    };
  });
}

async function flashcardObjects(): Promise<UniversalContentObject[]> {
  const cards = await prisma.flashcard.findMany({
    where: { status: ContentStatus.PUBLISHED },
    select: {
      id: true,
      front: true,
      back: true,
      country: true,
      tier: true,
      examFamily: true,
      questionStem: true,
      rationaleCorrect: true,
      rationaleIncorrect: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true, slug: true, topicCode: true } },
      deck: { select: { pathwayId: true, title: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_ROWS_PER_SURFACE,
  });

  return cards.map((card) => ({
    id: card.id,
    contentType: "flashcard",
    pathway: normalizePathway({
      tier: card.tier,
      examFamily: card.examFamily,
      pathwayId: card.deck?.pathwayId,
    }),
    tier: card.tier,
    topic: card.category.name,
    subtopic: card.category.topicCode ?? card.category.slug,
    createdAt: iso(card.createdAt),
    updatedAt: iso(card.updatedAt),
    title: card.questionStem ?? card.front,
    stem: card.questionStem ?? card.front,
    body: card.back,
    rationale: card.rationaleCorrect ?? card.back,
    distractorRationales: [textFromJson(card.rationaleIncorrect)].filter(Boolean),
    tags: [card.category.slug, card.deck?.title].filter(Boolean) as string[],
    exam: card.examFamily,
    country: card.country,
  }));
}

async function pathwayLessonObjects(): Promise<UniversalContentObject[]> {
  const lessons = await prisma.pathwayLesson.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      locale: "en",
      canonicalLessonId: null,
      deprecatedAt: null,
    },
    select: {
      id: true,
      pathwayId: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      sections: true,
      countryCode: true,
      tierCode: true,
      exams: true,
      createdAt: true,
      updatedAt: true,
      published_by_user_id: true,
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_ROWS_PER_SURFACE,
  });

  return lessons.map((lesson) => ({
    id: lesson.id,
    contentType: "lesson",
    pathway: normalizePathway({
      tier: lesson.tierCode,
      exam: lesson.exams.join(" "),
      pathwayId: lesson.pathwayId,
    }),
    tier: lesson.tierCode,
    topic: lesson.topic,
    subtopic: lesson.topicSlug,
    author: lesson.published_by_user_id,
    createdAt: iso(lesson.createdAt),
    updatedAt: iso(lesson.updatedAt),
    title: lesson.title,
    body: textFromJson(lesson.sections),
    references: referencesFrom(textFromJson(lesson.sections).match(/https?:\/\/\S+/g)?.join("\n")),
    tags: [lesson.bodySystem, ...lesson.exams],
    exam: lesson.exams.join(","),
    country: lesson.countryCode,
  }));
}

async function contentItemLessonObjects(): Promise<UniversalContentObject[]> {
  const items = await prisma.contentItem.findMany({
    where: { type: "lesson", status: "published" },
    select: {
      id: true,
      title: true,
      category: true,
      bodySystem: true,
      tier: true,
      tags: true,
      summary: true,
      content: true,
      authorId: true,
      authorName: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  return items.map((item) => ({
    id: item.id,
    contentType: "lesson",
    pathway: normalizePathway({ tier: item.tier }),
    tier: item.tier,
    topic: item.category ?? item.bodySystem,
    author: item.authorName ?? item.authorId,
    createdAt: iso(item.createdAt),
    updatedAt: iso(item.updatedAt),
    title: item.title,
    body: [item.summary, textFromJson(item.content)].filter(Boolean).join("\n"),
    tags: item.tags,
  }));
}

async function ecgObjects(): Promise<UniversalContentObject[]> {
  const rows = await prisma.ecgVideoQuestion.findMany({
    select: {
      id: true,
      questionText: true,
      rationale: true,
      difficulty: true,
      rhythmTag: true,
      clinicalPriority: true,
      allowedTiers: true,
      level: true,
      mode: true,
      topicTags: true,
      manualReviewedAt: true,
      clinicianReviewedAt: true,
      createdAt: true,
      performanceAggregate: { select: { totalAttempts: true, correctAttempts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS_PER_SURFACE,
  });

  return rows.map((row) => {
    const attempts = row.performanceAggregate?.totalAttempts ?? 0;
    const correct = row.performanceAggregate?.correctAttempts ?? 0;
    return {
      id: row.id,
      contentType: "ecg",
      pathway: row.level === "advanced" ? "ECGAdvanced" : "ECGCore",
      tier: row.allowedTiers.join(","),
      topic: row.rhythmTag,
      subtopic: row.clinicalPriority,
      difficulty: row.difficulty,
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.clinicianReviewedAt ?? row.manualReviewedAt ?? row.createdAt),
      lastReviewedAt: iso(row.clinicianReviewedAt ?? row.manualReviewedAt),
      title: row.questionText,
      stem: row.questionText,
      rationale: row.rationale,
      tags: ["ecg", row.level, row.mode, ...row.topicTags],
      exam: "ECG",
      metrics: attempts > 0 ? { correctAnswerRate: correct / attempts } : undefined,
    };
  });
}

async function simulationObjects(): Promise<UniversalContentObject[]> {
  const scenarios = await prisma.clinicalNursingScenario.findMany({
    where: { publishStatus: ClinicalNursingScenarioPublishStatus.APPROVED },
    select: {
      id: true,
      title: true,
      pathwayId: true,
      canonicalCategoryId: true,
      tierFocus: true,
      difficulty: true,
      patientAgeContext: true,
      presentingConcern: true,
      briefHistory: true,
      assessmentFindings: true,
      labsDiagnostics: true,
      referencesJson: true,
      createdAt: true,
      updatedAt: true,
      createdByUserId: true,
      stages: {
        select: {
          scenarioText: true,
          questionStem: true,
          rationale: true,
          clinicalJudgmentFocus: true,
        },
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_ROWS_PER_SURFACE,
  });

  return scenarios.map((scenario) => ({
    id: scenario.id,
    contentType: /cnple|np/i.test(scenario.pathwayId) ? "loft" : "simulation",
    pathway: normalizePathway({ tier: scenario.tierFocus, pathwayId: scenario.pathwayId }),
    tier: scenario.tierFocus,
    topic: scenario.canonicalCategoryId,
    difficulty: scenario.difficulty,
    author: scenario.createdByUserId,
    createdAt: iso(scenario.createdAt),
    updatedAt: iso(scenario.updatedAt),
    title: scenario.title,
    body: [
      scenario.patientAgeContext,
      scenario.presentingConcern,
      scenario.briefHistory,
      scenario.assessmentFindings,
      textFromJson(scenario.labsDiagnostics),
      ...scenario.stages.flatMap((stage) => [
        stage.scenarioText,
        stage.questionStem,
        stage.rationale,
        stage.clinicalJudgmentFocus,
      ]),
    ]
      .filter(Boolean)
      .join("\n"),
    rationale: scenario.stages.map((stage) => stage.rationale).join("\n"),
    references: referencesFrom(textFromJson(scenario.referencesJson)),
    tags: [scenario.canonicalCategoryId, scenario.tierFocus, scenario.pathwayId],
    exam: scenario.pathwayId,
  }));
}

function pharmacologyObjects(): UniversalContentObject[] {
  return PHARMACOLOGY_CATEGORIES.map((category) => ({
    id: `pharmacology:${category.id}`,
    contentType: "pharmacology",
    pathway: category.tierDepth.includes("new_grad")
      ? "NewGrad"
      : category.tierDepth.includes("np")
        ? "NP"
        : category.tierDepth.includes("allied")
          ? "Allied"
          : "RN",
    tier: category.tierDepth.join(","),
    topic: category.shortTitle,
    subtopic: category.topicSlug,
    title: category.title,
    body: [
      category.description,
      category.safetyFocus,
      category.lessonTopic,
      category.commonMedications.join(", "),
      category.highRiskSituations.join(", "),
    ].join("\n"),
    tags: [category.id, category.topicSlug, ...category.tierDepth],
    exam: category.tierDepth.join(","),
  }));
}

function clinicalSkillObjects(): UniversalContentObject[] {
  const profileItems = CROSS_PROFESSION_PROFILES.flatMap((profile) =>
    profile.clinicalSkillFocus.map((skill) => ({
      id: `clinical-skill:${profile.id}:${skill.replace(/\W+/g, "-").toLowerCase()}`,
      contentType: "clinical_skill" as const,
      pathway: profile.id === "new-grad" ? "NewGrad" : profile.label,
      tier:
        profile.id === "rn"
          ? TierCode.RN
          : profile.id === "rpn"
            ? TierCode.RPN
            : profile.id === "np"
              ? TierCode.NP
              : profile.id === "new-grad"
                ? TierCode.NEW_GRAD
                : TierCode.ALLIED,
      topic: skill,
      title: `${profile.label}: ${skill}`,
      body: [
        skill,
        ...profile.competencyDomains,
        ...profile.clinicalSkillFocus,
        ...profile.simulationOpportunities,
        ...profile.analyticsDomains,
      ].join("\n"),
      tags: [profile.id, ...profile.competencyDomains],
      exam:
        profile.id === "np"
          ? ExamFamily.NP
          : profile.id === "rpn"
            ? ExamFamily.REX_PN
            : profile.id === "rt" || profile.id === "allied"
              ? ExamFamily.ALLIED
              : ExamFamily.NCLEX_RN,
    })),
  );
  const alliedItems = ALLIED_PROFESSION_MAPS.flatMap((profession) =>
    profession.skills.map((skill) => ({
      id: `clinical-skill:${profession.id}:${skill.replace(/\W+/g, "-").toLowerCase()}`,
      contentType: "clinical_skill" as const,
      pathway: "Allied",
      tier: TierCode.ALLIED,
      topic: profession.label,
      subtopic: skill,
      title: `${profession.label}: ${skill}`,
      body: [
        skill,
        ...profession.competencies,
        ...profession.skills,
        ...profession.clinicalJudgment,
        ...profession.simulationOpportunities,
      ].join("\n"),
      tags: [profession.id, ...profession.competencies],
      exam: ExamFamily.ALLIED,
    })),
  );
  return [...profileItems, ...alliedItems];
}

async function studyPlanAndRemediationObjects(): Promise<UniversalContentObject[]> {
  const [remediationEvents, remediationQueue] = await Promise.all([
    prisma.userRemediationEvent.findMany({
      select: { id: true, pathwayId: true, topic: true, bodySystem: true, mistakeType: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 300,
    }),
    prisma.userRemediationQueue.findMany({
      select: {
        id: true,
        pathwayId: true,
        topic: true,
        bodySystem: true,
        source: true,
        priorityScore: true,
        mistakeCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 300,
    }),
  ]);
  return [
    ...remediationEvents.map((event) => ({
      id: event.id,
      contentType: "remediation" as const,
      pathway: normalizePathway({ pathwayId: event.pathwayId }),
      topic: event.topic,
      subtopic: event.bodySystem,
      createdAt: iso(event.createdAt),
      updatedAt: iso(event.createdAt),
      title: `${event.mistakeType.replace(/_/g, " ")} remediation`,
      body: [event.pathwayId, event.topic, event.bodySystem, event.mistakeType].filter(Boolean).join("\n"),
      tags: ["remediation", event.mistakeType],
    })),
    ...remediationQueue.map((row) => ({
      id: row.id,
      contentType: "study_plan" as const,
      pathway: normalizePathway({ pathwayId: row.pathwayId }),
      topic: row.topic,
      subtopic: row.bodySystem,
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
      title: `${row.topic ?? "Study plan"} remediation queue`,
      body: [
        row.pathwayId,
        row.topic,
        row.bodySystem,
        row.source,
        `priority ${row.priorityScore}`,
        `mistakes ${row.mistakeCount}`,
      ]
        .filter(Boolean)
        .join("\n"),
      tags: ["study_plan", "remediation", row.source],
    })),
  ];
}

async function loadUniversalContentObjects(): Promise<UniversalContentObject[]> {
  const [questions, flashcards, lessons, contentLessons, ecg, simulations, studyPlans] = await Promise.all([
    questionObjects(),
    flashcardObjects(),
    pathwayLessonObjects(),
    contentItemLessonObjects(),
    ecgObjects(),
    simulationObjects(),
    studyPlanAndRemediationObjects().catch(() => []),
  ]);
  return [
    ...questions,
    ...flashcards,
    ...lessons,
    ...contentLessons,
    ...ecg,
    ...simulations,
    ...pharmacologyObjects(),
    ...clinicalSkillObjects(),
    ...studyPlans,
  ];
}

function panelFor(report: ContentQualityIntelligenceReport, id: string, label: string) {
  const row = report.byContentType[id];
  return {
    id,
    label,
    score: Math.round(row?.averageScore ?? 100),
    count: row?.count ?? 0,
    critical: report.items.filter(
      (item) => item.contentType === id && (item.qualityBand === "Critical" || item.qualityBand === "Poor"),
    ).length,
  };
}

function buildCommandCenter(
  items: UniversalContentObject[],
  degraded: boolean,
  notes: string[],
): ContentQualityCommandCenter {
  const generatedAt = new Date().toISOString();
  const report = buildContentQualityIntelligenceReport(items, generatedAt);
  return {
    generatedAt,
    degraded,
    report,
    qualityPanels: [
      panelFor(report, "question", "Question Quality"),
      panelFor(report, "lesson", "Lesson Quality"),
      panelFor(report, "flashcard", "Flashcard Quality"),
      panelFor(report, "pharmacology", "Pharmacology Quality"),
      panelFor(report, "clinical_skill", "Clinical Skills Quality"),
      panelFor(report, "ecg", "ECG Quality"),
      panelFor(report, "simulation", "Simulation Quality"),
      panelFor(report, "loft", "LOFT Quality"),
      panelFor(report, "study_plan", "Study Plan Quality"),
      panelFor(report, "remediation", "Remediation Quality"),
    ],
    notes,
  };
}

export async function loadContentQualityCommandCenter(): Promise<ContentQualityCommandCenter> {
  const fallbackItems = [...pharmacologyObjects(), ...clinicalSkillObjects()];
  const fallback = buildCommandCenter(fallbackItems, true, [
    "Database-backed content scan unavailable; showing static pharmacology and clinical-skill catalog quality only.",
  ]);

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return fallback;

  return withDatabaseFallbackTimeout(
    async () => {
      const items = await loadUniversalContentObjects();
      return buildCommandCenter(items, false, [
        `Live scan includes up to ${MAX_ROWS_PER_SURFACE.toLocaleString()} newest rows per large content surface.`,
        "Scores combine rationale quality, scope alignment, reference quality, freshness, content depth, and available learner performance.",
      ]);
    },
    fallback,
    CQIE_TIMEOUT_MS,
    { scope: "content_quality_intelligence", label: "command_center" },
  );
}

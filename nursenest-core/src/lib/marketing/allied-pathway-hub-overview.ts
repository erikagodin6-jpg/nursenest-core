import { ContentStatus } from "@prisma/client";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { marketingCatCompletePoolUsable } from "@/lib/exam-pathways/pathway-marketing-practice-gates";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { ALLIED_GLOBAL_PATHWAY_IDS, isAlliedGlobalPathwayId } from "@/lib/allied/allied-global-pathway";
import { countPathwayLessonsPublic } from "@/lib/lessons/pathway-lesson-loader";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type AlliedHubModuleCard = {
  id: "labs";
  title: string;
  description: string;
  href: string;
  access: "free" | "paid";
};

export type AlliedPathwayHubOverview = {
  lessonCount: number;
  flashcardCount: number | null;
  flashcardDeckCount: number | null;
  questionSnapshot: PathwayQuestionBankSnapshot;
  practiceExamReady: boolean;
  moduleCards: AlliedHubModuleCard[];
  contentCounts: {
    questions: number | null;
    flashcards: number | null;
    lessons: number;
    simulations: number | null;
    clinicalSkills: number | null;
  };
};

async function countPublishedFlashcards(pathwayIds: string[]): Promise<{ decks: number; cards: number } | null> {
  if (!isDatabaseUrlConfigured()) return null;
  try {
    const rows = await prisma.flashcardDeck.findMany({
      where: {
        pathwayId: { in: pathwayIds },
        status: ContentStatus.PUBLISHED,
      },
      select: { cardCount: true },
    });
    return {
      decks: rows.length,
      cards: rows.reduce((sum, row) => sum + Math.max(0, row.cardCount), 0),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        dependency_name: "allied_flashcard_count",
        pathway_id: pathwayIds.join(","),
        error_message: message.slice(0, 500),
      });
    return null;
  }
}

function combineQuestionSnapshots(rows: PathwayQuestionBankSnapshot[]): PathwayQuestionBankSnapshot {
  const okRows = rows.filter((row): row is Extract<PathwayQuestionBankSnapshot, { status: "ok" }> => row.status === "ok");
  if (okRows.length === 0) return { status: "unavailable" };
  const visibleQuestionCount = okRows.reduce((sum, row) => sum + row.visibleQuestionCount, 0);
  return {
    status: "ok",
    publishedQuestionCount: okRows.reduce((sum, row) => sum + row.publishedQuestionCount, 0),
    visibleQuestionCount,
    activeQuestionCount: okRows.reduce((sum, row) => sum + row.activeQuestionCount, 0),
    pathwayScopedCount: visibleQuestionCount,
    adaptiveEligibleCount: okRows.reduce((sum, row) => sum + row.adaptiveEligibleCount, 0),
    examKeys: [...new Set(okRows.flatMap((row) => row.examKeys))],
  };
}

function buildAlliedModuleCards(): AlliedHubModuleCard[] {
  return [];
}

/** Safe empty shell when hub inventory loaders fail (never generic homepage fallback). */
export function fallbackAlliedPathwayHubOverview(): AlliedPathwayHubOverview {
  return {
    lessonCount: 0,
    flashcardCount: null,
    flashcardDeckCount: null,
    questionSnapshot: { status: "unavailable" },
    practiceExamReady: false,
    moduleCards: buildAlliedModuleCards(),
    contentCounts: { questions: null, flashcards: null, lessons: 0, simulations: null, clinicalSkills: null },
  };
}

export async function loadAlliedPathwayHubOverview(
  pathway: ExamPathwayDefinition,
  _ctx: {
    pathname: string;
    locale: string;
    examCode: string;
    roleTrack: string;
  },
): Promise<AlliedPathwayHubOverview> {
  const pathwayIds = isAlliedGlobalPathwayId(pathway.id) ? [...ALLIED_GLOBAL_PATHWAY_IDS] : [pathway.id];

  const [questionSnapshots, lessonCounts, flashcards] = await Promise.all([
    Promise.all(pathwayIds.map((pathwayId) => loadPathwayQuestionBankSnapshot(pathwayId))),
    Promise.all(pathwayIds.map((pathwayId) => countPathwayLessonsPublic(pathwayId))),
    countPublishedFlashcards(pathwayIds),
  ]);

  const questionSnapshot = combineQuestionSnapshots(questionSnapshots);
  const pathwayLessonCount = lessonCounts.reduce((sum, count) => sum + count, 0);

  return {
    lessonCount: pathwayLessonCount,
    flashcardCount: flashcards?.cards ?? null,
    flashcardDeckCount: flashcards?.decks ?? null,
    questionSnapshot,
    practiceExamReady: marketingCatCompletePoolUsable(questionSnapshot, pathway.id),
    moduleCards: buildAlliedModuleCards(),
    contentCounts: {
      questions: questionSnapshot.status === "ok" ? questionSnapshot.pathwayScopedCount : null,
      flashcards: flashcards?.cards ?? null,
      lessons: pathwayLessonCount,
      simulations: null,
      clinicalSkills: null,
    },
  };
}

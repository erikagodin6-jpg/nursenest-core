import { ContentStatus } from "@prisma/client";
import { loadPathwayQuestionBankSnapshot, type PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { isLabValuesModuleEnabled } from "@/lib/lab-values/lab-values-module";
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
  flashcardDeckCount: number | null;
  questionSnapshot: PathwayQuestionBankSnapshot;
  practiceExamReady: boolean;
  moduleCards: AlliedHubModuleCard[];
};

async function countPublishedFlashcardDecks(pathwayIds: string[]): Promise<number | null> {
  if (!isDatabaseUrlConfigured()) return null;
  try {
    return await prisma.flashcardDeck.count({
      where: {
        pathwayId: { in: pathwayIds },
        status: ContentStatus.PUBLISHED,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
        event: "hub_data_load_failed",
        dependency_name: "allied_flashcard_deck_count",
        pathway_id: pathwayIds.join(","),
        error_message: message.slice(0, 500),
      });
    return null;
  }
}

function combineQuestionSnapshots(rows: PathwayQuestionBankSnapshot[]): PathwayQuestionBankSnapshot {
  const okRows = rows.filter((row): row is Extract<PathwayQuestionBankSnapshot, { status: "ok" }> => row.status === "ok");
  if (okRows.length === 0) return { status: "unavailable" };
  return {
    status: "ok",
    pathwayScopedCount: okRows.reduce((sum, row) => sum + row.pathwayScopedCount, 0),
    adaptiveEligibleCount: okRows.reduce((sum, row) => sum + row.adaptiveEligibleCount, 0),
    examKeys: [...new Set(okRows.flatMap((row) => row.examKeys))],
  };
}

function buildAlliedModuleCards(): AlliedHubModuleCard[] {
  const cards: AlliedHubModuleCard[] = [];
  if (isLabValuesModuleEnabled()) {
    cards.push({
      id: "labs",
      title: "Lab values and interpretation",
      description: "Pattern-based lab review, nursing-action layers, and focused drills when the module is live.",
      href: "/modules/lab-values",
      access: "free",
    });
  }
  return cards;
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

  const [questionSnapshots, lessonCounts, flashcardDeckCount] = await Promise.all([
    Promise.all(pathwayIds.map((pathwayId) => loadPathwayQuestionBankSnapshot(pathwayId))),
    Promise.all(pathwayIds.map((pathwayId) => countPathwayLessonsPublic(pathwayId))),
    countPublishedFlashcardDecks(pathwayIds),
  ]);

  const questionSnapshot = combineQuestionSnapshots(questionSnapshots);
  const pathwayLessonCount = lessonCounts.reduce((sum, count) => sum + count, 0);

  return {
    lessonCount: pathwayLessonCount,
    flashcardDeckCount,
    questionSnapshot,
    practiceExamReady: questionSnapshot.status === "ok" && questionSnapshot.adaptiveEligibleCount > 0,
    moduleCards: buildAlliedModuleCards(),
  };
}

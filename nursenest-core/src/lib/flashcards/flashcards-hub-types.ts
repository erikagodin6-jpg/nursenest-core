import type { BuilderCategoryOption } from "@/lib/flashcards/flashcard-builder-taxonomy";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";

/** Transparency for learner hub + `/api/flashcards/inventory` when pool counts look wrong. */
export type FlashcardsPoolInventoryDiagnostics = {
  pathwayId: string;
  examQuestionSqlPoolCount: number;
  /** Count using legacy Prisma `exam IN (...)` pathway scope — often zero when SQL norm count is non-zero. */
  legacyCanonicalPrismaPoolCount?: number | null;
  dedicatedFlashcardRowCount: number;
  tier: string | null;
  country: string | null;
  poolSource: "flashcard_learner_exam_norm_sql_v1";
  zeroHint?: string;
};

/** Server-rendered flashcards hub inventory for first paint (category counts + totals). */
export type FlashcardsHubServerPayload = {
  categoryOptions: BuilderCategoryOption[];
  matchingTotal: number;
  lessonVirtualDiagnostics?: FlashcardLessonVirtualDiagnostics | null;
  poolDiagnostics?: FlashcardsPoolInventoryDiagnostics | null;
};

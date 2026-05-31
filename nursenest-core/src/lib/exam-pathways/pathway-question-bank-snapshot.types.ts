/**
 * Client-safe types for pathway question bank aggregates (no Prisma / Next server APIs).
 */
export type PathwayQuestionBankSnapshot =
  | {
      status: "ok";
      /** Published rows in the pathway entitlement/exam scope, before marketing hub display filters. */
      publishedQuestionCount: number;
      /** Published rows visible to the standard question-bank hub after display/session filters. */
      visibleQuestionCount: number;
      /** Published rows eligible for normal practice starts. Same as visible unless a future active flag is added. */
      activeQuestionCount: number;
      /** Backwards-compatible alias for `visibleQuestionCount`. */
      pathwayScopedCount: number;
      adaptiveEligibleCount: number;
      examKeys: string[];
    }
  | {
      status: "unavailable";
      reason?: "missing_pathway" | "published_count_unavailable" | "visible_count_unavailable" | "snapshot_unavailable";
    };

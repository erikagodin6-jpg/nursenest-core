/**
 * Client-safe types for pathway question bank aggregates (no Prisma / Next server APIs).
 */
export type PathwayQuestionBankSnapshot =
  | {
      status: "ok";
      pathwayScopedCount: number;
      adaptiveEligibleCount: number;
      examKeys: string[];
    }
  | { status: "unavailable" };

import { prisma } from "@/lib/db";

let _result: Promise<boolean> | null = null;

/**
 * Returns true when the `study_link_pathway_id` column exists on `exam_questions`.
 * Memoized per server process — the column either exists or it doesn't; no need to re-query.
 * Returns false on any DB error so callers degrade gracefully (omit the OR clause).
 */
export function getStudyLinkPathwayColumnExists(): Promise<boolean> {
  if (!_result) {
    _result = prisma
      .$queryRaw<{ exists: boolean }[]>`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'exam_questions'
            AND column_name = 'study_link_pathway_id'
        ) AS exists
      `
      .then((rows) => Boolean(rows[0]?.exists))
      .catch(() => false);
  }
  return _result;
}

/**
 * Runtime checks for `pathway_lessons` columns required by the Prisma schema / loaders.
 * Used by ops scripts and lesson hub diagnostics — keep dependency-light (only `PrismaClient` typing).
 */
import type { PrismaClient } from "@prisma/client";

/** DB column mapped by {@link PathwayLesson.structuralPublicComplete} in `schema.prisma`. */
export const PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN = "structural_public_complete" as const;

/** Prisma migration folder that introduced {@link PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_COLUMN}. */
export const PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR =
  "20260416160000_pathway_lessons_structural_public_complete" as const;

/**
 * True when `public.pathway_lessons.structural_public_complete` exists (matches current Prisma schema).
 */
export async function pathwayLessonsStructuralPublicCompleteColumnPresent(
  prisma: Pick<PrismaClient, "$queryRaw">,
): Promise<boolean> {
  try {
    const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns AS c
        WHERE c.table_schema = 'public'
          AND c.table_name = 'pathway_lessons'
          AND c.column_name = 'structural_public_complete'
      ) AS "exists"
    `;
    if (!rows[0]?.exists) return false;
    /** Prove the column is readable — avoids false positives when metadata and live DDL diverge. */
    await prisma.$queryRaw`SELECT "structural_public_complete" FROM "pathway_lessons" LIMIT 1`;
    return true;
  } catch {
    return false;
  }
}

export type PathwayLessonsSchemaDriftCode = "missing_structural_public_complete";

export type PathwayLessonsSchemaDrift = {
  code: PathwayLessonsSchemaDriftCode;
  message: string;
  /** Safe remediation hint (no secrets). */
  remediation: string;
};

/**
 * Map a thrown Prisma / Postgres error message to a structured schema drift signal when the DB is behind
 * the checked-in Prisma schema.
 */
export function pathwayLessonsSchemaDriftFromPrismaErrorMessage(message: string): PathwayLessonsSchemaDrift | null {
  const m = message.toLowerCase();
  if (
    m.includes("structural_public_complete") &&
    (m.includes("does not exist") || m.includes("column") || m.includes("unknown arg"))
  ) {
    return {
      code: "missing_structural_public_complete",
      message:
        "Database is missing column public.pathway_lessons.structural_public_complete required by the current Prisma schema.",
      remediation: `Apply pending Prisma migrations to this database (includes ${PATHWAY_LESSONS_STRUCTURAL_PUBLIC_COMPLETE_MIGRATION_DIR}), e.g. from nursenest-core: npx prisma migrate deploy`,
    };
  }
  return null;
}

/** Same as {@link pathwayLessonsSchemaDriftFromPrismaErrorMessage} but accepts thrown Prisma / unknown values. */
export function pathwayLessonsSchemaDriftFromUnknown(e: unknown): PathwayLessonsSchemaDrift | null {
  const msg =
    e instanceof Error
      ? e.message
      : typeof e === "object" && e !== null && "message" in e
        ? String((e as { message?: unknown }).message ?? "")
        : String(e);
  return pathwayLessonsSchemaDriftFromPrismaErrorMessage(msg);
}

import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  pathwayLessonsSchemaDriftFromUnknown,
  pathwayLessonsStructuralPublicCompleteColumnPresent,
} from "@/lib/db/pathway-lessons-schema-contract";
import {
  PATHWAY_LESSON_METADATA_LIST_SELECT,
  PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC,
} from "@/lib/lessons/pathway-lesson-metadata-select";
import { safeServerLog } from "@/lib/observability/safe-server-log";

let structuralColumnPresent: boolean | undefined;
let structuralColumnProbe: Promise<boolean> | null = null;

export type PathwayLessonReadOmitArgs = Awaited<ReturnType<typeof pathwayLessonReadOmitArgs>>;

/** Test-only: reset memoized column detection. */
export function resetPathwayLessonStructuralColumnRuntimeCacheForTests(): void {
  structuralColumnPresent = undefined;
  structuralColumnProbe = null;
}

/**
 * Clears memoized structural-column detection so the next read re-probes the database.
 * Call after observing Prisma "column does not exist" drift for `structural_public_complete`.
 */
export function forcePathwayLessonStructuralColumnAbsentForProcess(): void {
  structuralColumnPresent = undefined;
  structuralColumnProbe = null;
}

/**
 * True when `public.pathway_lessons.structural_public_complete` exists (matches Prisma schema).
 * Memoized per process so hot paths only pay one information_schema round-trip.
 */
export async function isPathwayLessonStructuralPublicCompleteColumnPresent(): Promise<boolean> {
  if (structuralColumnPresent !== undefined) return structuralColumnPresent;
  if (!structuralColumnProbe) {
    structuralColumnProbe = pathwayLessonsStructuralPublicCompleteColumnPresent(prisma)
      .then((v) => {
        structuralColumnPresent = v;
        structuralColumnProbe = null;
        return v;
      })
      .catch((err: unknown) => {
        structuralColumnProbe = null;
        structuralColumnPresent = false;
        safeServerLog("pathway_lessons", "structural_public_complete_column_probe_failed", {
          detail: err instanceof Error ? err.message.slice(0, 240) : String(err).slice(0, 240),
        });
        return false;
      });
  }
  return structuralColumnProbe;
}

/** WHERE fragment: only when the DB column exists (otherwise the predicate would 500 Postgres). */
export async function pathwayLessonStructuralCompleteWhereInput(): Promise<Prisma.PathwayLessonWhereInput> {
  try {
    const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
    return ok ? { structuralPublicComplete: true } : {};
  } catch {
    return {};
  }
}

/**
 * When the column is missing, Prisma must not SELECT it on full-model reads — use `omit`.
 * When present, return `{}` (normal Prisma behavior).
 */
export async function pathwayLessonReadOmitArgs(): Promise<
  { omit: { structuralPublicComplete: true } } | Record<string, never>
> {
  try {
    const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
    return ok ? {} : { omit: { structuralPublicComplete: true } };
  } catch {
    structuralColumnPresent = false;
    structuralColumnProbe = null;
    return { omit: { structuralPublicComplete: true } };
  }
}

/** Metadata list select: omit `structuralPublicComplete` in SQL when the column is absent. */
export async function pathwayLessonMetadataListSelectForReads(): Promise<Prisma.PathwayLessonSelect> {
  try {
    const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
    return ok ? PATHWAY_LESSON_METADATA_LIST_SELECT : PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC;
  } catch {
    return PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC;
  }
}

type ReadOmitProvider = () => Promise<PathwayLessonReadOmitArgs>;

/**
 * Runs a PathwayLesson Prisma read; on missing `structural_public_complete` drift, clears the
 * memoized column probe and retries once with a fresh {@link pathwayLessonReadOmitArgs}.
 */
export async function withPrismaPathwayLessonStructuralDriftRetry<T>(
  op: (getReadOmit: ReadOmitProvider) => Promise<T>,
): Promise<T> {
  const getReadOmit: ReadOmitProvider = () => pathwayLessonReadOmitArgs();
  try {
    return await op(getReadOmit);
  } catch (e) {
    if (!pathwayLessonsSchemaDriftFromUnknown(e)) throw e;
    forcePathwayLessonStructuralColumnAbsentForProcess();
    return await op(getReadOmit);
  }
}

import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { pathwayLessonsStructuralPublicCompleteColumnPresent } from "@/lib/db/pathway-lessons-schema-contract";
import {
  PATHWAY_LESSON_METADATA_LIST_SELECT,
  PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC,
} from "@/lib/lessons/pathway-lesson-metadata-select";

let structuralColumnPresent: boolean | undefined;
let structuralColumnProbe: Promise<boolean> | null = null;

/** Test-only: reset memoized column detection. */
export function resetPathwayLessonStructuralColumnRuntimeCacheForTests(): void {
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
    structuralColumnProbe = pathwayLessonsStructuralPublicCompleteColumnPresent(prisma).then((v) => {
      structuralColumnPresent = v;
      structuralColumnProbe = null;
      return v;
    });
  }
  return structuralColumnProbe;
}

/** WHERE fragment: only when the DB column exists (otherwise the predicate would 500 Postgres). */
export async function pathwayLessonStructuralCompleteWhereInput(): Promise<Prisma.PathwayLessonWhereInput> {
  const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
  return ok ? { structuralPublicComplete: true } : {};
}

/**
 * When the column is missing, Prisma must not SELECT it on full-model reads — use `omit`.
 * When present, return `{}` (normal Prisma behavior).
 */
export async function pathwayLessonReadOmitArgs(): Promise<
  { omit: { structuralPublicComplete: true } } | Record<string, never>
> {
  const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
  return ok ? {} : { omit: { structuralPublicComplete: true } };
}

/** Metadata list select: omit `structuralPublicComplete` in SQL when the column is absent. */
export async function pathwayLessonMetadataListSelectForReads(): Promise<Prisma.PathwayLessonSelect> {
  const ok = await isPathwayLessonStructuralPublicCompleteColumnPresent();
  return ok ? PATHWAY_LESSON_METADATA_LIST_SELECT : PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC;
}

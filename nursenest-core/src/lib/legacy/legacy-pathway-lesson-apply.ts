import type { PrismaClient } from "@prisma/client";
import { ContentStatus, Prisma } from "@prisma/client";

import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  buildPathwayLessonUpdateFromLegacy,
  CANONICAL_LOCALE,
  assertPathwayAllowed,
  type PathwayLessonRowShape,
} from "@/lib/legacy/legacy-public-content-merge";
import type {
  LegacyChangeLogEntry,
  LegacyLessonExportRow,
  LegacyPipelineOptions,
} from "@/lib/legacy/legacy-public-content-types";
import { normalizeLegacySlug } from "@/lib/legacy/legacy-public-content-types";

export const LEGACY_PATHWAY_LESSON_SELECT = {
  id: true,
  pathwayId: true,
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  sections: true,
  locale: true,
  exams: true,
  countries: true,
  priority: true,
  examMeta: true,
  status: true,
  tierCode: true,
  structuralPublicComplete: true,
  published_at: true,
  sortOrder: true,
} as const;

/**
 * Pathway lesson upserts from legacy export rows (shared by public-content + lessons/practice pipelines).
 * Does not touch flashcards.
 */
export async function applyLegacyPathwayLessonsImport(
  prisma: PrismaClient,
  lessons: LegacyLessonExportRow[] | undefined,
  opts: LegacyPipelineOptions,
  logChange: (e: LegacyChangeLogEntry) => void,
): Promise<string[]> {
  const errors: string[] = [];

  for (const leg of lessons ?? []) {
    try {
      assertPathwayAllowed(leg.pathwayId);
    } catch (err) {
      errors.push(String(err));
      continue;
    }
    const slug = normalizeLegacySlug(leg.slug);
    if (!slug) {
      errors.push(`invalid_slug:${leg.slug}`);
      continue;
    }

    const row = await prisma.pathwayLesson.findUnique({
      where: {
        pathwayId_slug_locale: {
          pathwayId: leg.pathwayId,
          slug,
          locale: CANONICAL_LOCALE,
        },
      },
      select: LEGACY_PATHWAY_LESSON_SELECT,
    });

    if (!row) {
      if (!opts.allowCreateMissingLessons) {
        continue;
      }
      if (!leg.sections || !Array.isArray(leg.sections)) {
        errors.push(`create_skipped_no_sections:${leg.pathwayId}:${slug}`);
        continue;
      }
      if (opts.apply) {
        try {
          const created = await prisma.pathwayLesson.create({
            data: {
              pathwayId: leg.pathwayId,
              slug,
              locale: CANONICAL_LOCALE,
              title: leg.title?.trim() || slug,
              topic: leg.topic?.trim() || "General",
              topicSlug: normalizeLegacySlug(leg.topicSlug?.trim() || leg.topic?.trim() || "general") || "general",
              bodySystem: leg.bodySystem?.trim() || "general",
              previewSectionCount: 1,
              seoTitle: leg.title?.trim() || slug,
              seoDescription: "",
              sections: leg.sections as Prisma.InputJsonValue,
              status: (leg.status as ContentStatus) ?? ContentStatus.PUBLISHED,
              tierCode: (leg.tierCode as PathwayLessonRowShape["tierCode"]) ?? null,
              structuralPublicComplete: false,
              published_at: leg.visiblePublic === false ? null : new Date(),
              sortOrder: typeof leg.sortOrder === "number" && Number.isFinite(leg.sortOrder) ? leg.sortOrder : 0,
            },
            select: { id: true },
          });
          const full = await prisma.pathwayLesson.findUnique({
            where: { id: created.id },
            select: LEGACY_PATHWAY_LESSON_SELECT,
          });
          if (full) {
            const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow({
              ...full,
              pathwayId: leg.pathwayId,
            });
            await prisma.pathwayLesson.update({
              where: { id: created.id },
              data: { structuralPublicComplete },
            });
          }
          logChange({
            entity: "pathway_lesson",
            id: created.id,
            action: "create",
            before: {},
            after: { pathwayId: leg.pathwayId, slug },
          });
        } catch (e) {
          errors.push(`create_failed:${leg.pathwayId}:${slug}:${String(e)}`);
        }
      } else {
        logChange({
          entity: "pathway_lesson",
          id: "(dry-run)",
          action: "create",
          before: {},
          after: { pathwayId: leg.pathwayId, slug, title: leg.title },
        });
      }
      continue;
    }

    const current = row as PathwayLessonRowShape;
    const { data, notes } = buildPathwayLessonUpdateFromLegacy(leg, current, {
      overwriteBody: opts.overwriteBody,
      allowPathwayCorrection: opts.allowPathwayCorrection,
    });
    if (notes.some((n) => n.startsWith("skip_"))) {
      continue;
    }
    if (Object.keys(data).length === 0) continue;

    if (opts.apply) {
      try {
        if (data.slug && data.slug !== current.slug) {
          const conflict = await prisma.pathwayLesson.findUnique({
            where: {
              pathwayId_slug_locale: {
                pathwayId: (data.pathwayId as string) ?? current.pathwayId,
                slug: data.slug as string,
                locale: CANONICAL_LOCALE,
              },
            },
            select: { id: true },
          });
          if (conflict && conflict.id !== current.id) {
            errors.push(`slug_conflict:${current.id}:${String(data.slug)}`);
            continue;
          }
        }
        const before = { ...current } as Record<string, unknown>;
        await prisma.pathwayLesson.update({
          where: { id: current.id },
          data,
        });
        const afterRow = await prisma.pathwayLesson.findUnique({
          where: { id: current.id },
          select: LEGACY_PATHWAY_LESSON_SELECT,
        });
        logChange({
          entity: "pathway_lesson",
          id: current.id,
          action: "update",
          before,
          after: { ...(afterRow as Record<string, unknown>), notes },
        });
      } catch (e) {
        errors.push(`update_failed:${current.id}:${String(e)}`);
      }
    } else {
      logChange({
        entity: "pathway_lesson",
        id: current.id,
        action: "update",
        before: { ...current } as Record<string, unknown>,
        after: { ...current, ...data, notes } as Record<string, unknown>,
      });
    }
  }

  return errors;
}

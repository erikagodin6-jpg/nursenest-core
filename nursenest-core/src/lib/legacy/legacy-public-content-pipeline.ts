import type { PrismaClient } from "@prisma/client";
import { ContentStatus, FlashcardDeckVisibility, Prisma } from "@prisma/client";

import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { computeStructuralPublicCompleteFromDbRow } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  buildPathwayLessonUpdateFromLegacy,
  CANONICAL_LOCALE,
  LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS,
  assertPathwayAllowed,
  metadataNeedsRepair,
  previewPathwayLessonRowAfterUpdate,
  type PathwayLessonRowShape,
} from "@/lib/legacy/legacy-public-content-merge";
import { applyLegacyPathwayLessonsImport, LEGACY_PATHWAY_LESSON_SELECT } from "@/lib/legacy/legacy-pathway-lesson-apply";
import type {
  LegacyAuditReport,
  LegacyChangeLogEntry,
  LegacyImportResult,
  LegacyLessonExportRow,
  LegacyPipelineOptions,
  LegacyPublicContentExportV1,
} from "@/lib/legacy/legacy-public-content-types";
import { normalizeLegacySlug } from "@/lib/legacy/legacy-public-content-types";

const LESSON_SELECT = LEGACY_PATHWAY_LESSON_SELECT;

export function emptyAudit(): LegacyAuditReport {
  return {
    legacyLessonsFound: 0,
    currentLessonsMatched: 0,
    currentLessonsMissing: 0,
    slugMismatches: 0,
    pathwayMismatches: 0,
    categorySystemMismatches: 0,
    lessonsWouldBecomePublicRenderable: 0,
    flashcardTagsInExport: 0,
    flashcardDeckLinksInExport: 0,
    flashcardDecksMissingInDb: 0,
    flashcardTagsMissingInDb: 0,
    samples: { slugMismatch: [], pathwayMismatch: [], missingLesson: [] },
  };
}

async function auditLessons(
  prisma: PrismaClient,
  lessons: LegacyLessonExportRow[],
  audit: LegacyAuditReport,
): Promise<void> {
  audit.legacyLessonsFound = lessons.length;
  for (const leg of lessons) {
    try {
      assertPathwayAllowed(leg.pathwayId);
    } catch {
      continue;
    }
    const slug = normalizeLegacySlug(leg.slug);
    if (!slug) continue;
    const row = await prisma.pathwayLesson.findUnique({
      where: {
        pathwayId_slug_locale: {
          pathwayId: leg.pathwayId,
          slug,
          locale: CANONICAL_LOCALE,
        },
      },
      select: LESSON_SELECT,
    });
    if (!row) {
      audit.currentLessonsMissing += 1;
      if (audit.samples.missingLesson.length < 25) {
        audit.samples.missingLesson.push({ pathwayId: leg.pathwayId, slug });
      }
      continue;
    }
    audit.currentLessonsMatched += 1;
    if (row.slug !== slug) {
      audit.slugMismatches += 1;
      if (audit.samples.slugMismatch.length < 15) {
        audit.samples.slugMismatch.push({ legacySlug: slug, currentSlug: row.slug, pathwayId: leg.pathwayId });
      }
    }
    if (row.pathwayId !== leg.pathwayId) {
      audit.pathwayMismatches += 1;
      if (audit.samples.pathwayMismatch.length < 15) {
        audit.samples.pathwayMismatch.push({
          legacyPathwayId: leg.pathwayId,
          currentPathwayId: row.pathwayId,
          slug,
        });
      }
    }
    if (metadataNeedsRepair(leg, row)) {
      audit.categorySystemMismatches += 1;
    }
    const current = row as PathwayLessonRowShape;
    const { data } = buildPathwayLessonUpdateFromLegacy(leg, current, {
      overwriteBody: false,
      allowPathwayCorrection: true,
    });
    if (Object.keys(data).length === 0) continue;
    const preview = previewPathwayLessonRowAfterUpdate(current, data);
    const nextComplete = computeStructuralPublicCompleteFromDbRow(preview);
    if (!current.structuralPublicComplete && nextComplete) {
      audit.lessonsWouldBecomePublicRenderable += 1;
    }
  }
}

async function auditFlashcards(prisma: PrismaClient, payload: LegacyPublicContentExportV1, audit: LegacyAuditReport) {
  const tags = payload.flashcards?.tags ?? [];
  const links = payload.flashcards?.deckTagLinks ?? [];
  audit.flashcardTagsInExport = tags.length;
  audit.flashcardDeckLinksInExport = links.length;
  const deckWhere = publicMarketingFlashcardDeckWhere();
  /** Distinct deck slugs referenced in export that are missing from DB (avoids double-count from decks + links). */
  const missingDeckSlugs = new Set<string>();

  for (const t of tags) {
    const slug = normalizeLegacySlug(t.slug);
    if (!slug) continue;
    const hit = await prisma.flashcardTag.findUnique({ where: { slug }, select: { id: true } });
    if (!hit) audit.flashcardTagsMissingInDb += 1;
  }

  for (const d of payload.flashcards?.decks ?? []) {
    const ds = normalizeLegacySlug(d.slug);
    if (!ds) continue;
    const deck = await prisma.flashcardDeck.findFirst({
      where: { slug: ds, ...deckWhere },
      select: { id: true },
    });
    if (!deck) missingDeckSlugs.add(ds);
  }

  for (const link of links) {
    const ds = normalizeLegacySlug(link.deckSlug);
    const ts = normalizeLegacySlug(link.tagSlug);
    if (!ds || !ts) continue;
    const deck = await prisma.flashcardDeck.findFirst({
      where: { slug: ds, ...deckWhere },
      select: { id: true },
    });
    if (!deck) missingDeckSlugs.add(ds);
  }

  audit.flashcardDecksMissingInDb = missingDeckSlugs.size;
}

export async function runLegacyPublicContentAudit(
  prisma: PrismaClient,
  payload: LegacyPublicContentExportV1,
): Promise<LegacyAuditReport> {
  const audit = emptyAudit();
  await auditLessons(prisma, payload.lessons ?? [], audit);
  await auditFlashcards(prisma, payload, audit);
  return audit;
}

export async function runLegacyPublicContentImport(
  prisma: PrismaClient,
  payload: LegacyPublicContentExportV1,
  opts: LegacyPipelineOptions,
): Promise<LegacyImportResult> {
  const audit = await runLegacyPublicContentAudit(prisma, payload);
  const changes: LegacyChangeLogEntry[] = [];
  const errors: string[] = [];

  const logChange = (e: LegacyChangeLogEntry) => {
    changes.push(e);
    console.log(JSON.stringify({ legacy_import_change: e }));
  };

  errors.push(...(await applyLegacyPathwayLessonsImport(prisma, payload.lessons, opts, logChange)));

  const tags = payload.flashcards?.tags ?? [];
  const links = payload.flashcards?.deckTagLinks ?? [];
  const deckWhere = publicMarketingFlashcardDeckWhere();

  for (const t of tags) {
    const slug = normalizeLegacySlug(t.slug);
    if (!slug) continue;
    const name = t.name?.trim() || slug;
    const existing = await prisma.flashcardTag.findUnique({ where: { slug }, select: { id: true, name: true } });
    if (!existing) {
      if (opts.apply) {
        const created = await prisma.flashcardTag.create({ data: { slug, name } });
        logChange({
          entity: "flashcard_tag",
          id: created.id,
          action: "create",
          before: {},
          after: { slug, name },
        });
      } else {
        logChange({
          entity: "flashcard_tag",
          id: "(dry-run)",
          action: "create",
          before: {},
          after: { slug, name },
        });
      }
    }
  }

  for (const d of payload.flashcards?.decks ?? []) {
    const slug = normalizeLegacySlug(d.slug);
    if (!slug) continue;
    const deck = await prisma.flashcardDeck.findFirst({
      where: { slug, ...deckWhere },
      select: { id: true, title: true, visibility: true },
    });
    if (!deck) {
      errors.push(`deck_patch_missing:${slug}`);
      continue;
    }
    const data: Prisma.FlashcardDeckUpdateInput = {};
    if (d.title?.trim() && d.title.trim() !== deck.title) {
      data.title = d.title.trim();
    }
    if (d.visibility === "PUBLIC_PREVIEW" && deck.visibility !== FlashcardDeckVisibility.PUBLIC_PREVIEW) {
      data.visibility = FlashcardDeckVisibility.PUBLIC_PREVIEW;
    }
    if (Object.keys(data).length === 0) continue;
    if (opts.apply) {
      await prisma.flashcardDeck.update({ where: { id: deck.id }, data });
      logChange({
        entity: "flashcard_deck",
        id: deck.id,
        action: "update",
        before: { slug, title: deck.title, visibility: deck.visibility },
        after: { ...data, slug },
      });
    } else {
      logChange({
        entity: "flashcard_deck",
        id: "(dry-run-deck)",
        action: "update",
        before: { slug, title: deck.title, visibility: deck.visibility },
        after: { ...data, slug },
      });
    }
  }

  for (const link of links) {
    const deckSlug = normalizeLegacySlug(link.deckSlug);
    const tagSlug = normalizeLegacySlug(link.tagSlug);
    if (!deckSlug || !tagSlug) continue;
    const deck = await prisma.flashcardDeck.findFirst({
      where: { slug: deckSlug, ...deckWhere },
      select: { id: true, slug: true, title: true, visibility: true },
    });
    if (!deck) {
      errors.push(`deck_missing_or_not_public_scope:${deckSlug}`);
      continue;
    }
    const tag = await prisma.flashcardTag.findUnique({ where: { slug: tagSlug }, select: { id: true } });
    if (!tag) {
      errors.push(`tag_missing:${tagSlug}`);
      continue;
    }
    const existingLink = await prisma.flashcardDeckOnTag.findUnique({
      where: { deckId_tagId: { deckId: deck.id, tagId: tag.id } },
      select: { deckId: true },
    });
    if (existingLink) continue;

    if (opts.apply) {
      await prisma.flashcardDeckOnTag.create({ data: { deckId: deck.id, tagId: tag.id } });
      logChange({
        entity: "flashcard_deck_on_tag",
        id: `${deck.id}:${tag.id}`,
        action: "connect",
        before: {},
        after: { deckSlug, tagSlug },
      });
    } else {
      logChange({
        entity: "flashcard_deck_on_tag",
        id: "(dry-run)",
        action: "connect",
        before: {},
        after: { deckSlug, tagSlug },
      });
    }
  }

  return { dryRun: !opts.apply, changes, errors, audit };
}

export { LEGACY_PIPELINE_ALLOWED_PATHWAY_IDS };

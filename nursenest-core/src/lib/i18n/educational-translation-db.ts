import "server-only";

import { EducationalTranslationSourceKind, EducationalTranslationStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type {
  FlashcardEducationalBundle,
  PathwayLessonEducationalOverlay,
  QuestionEducationalOverlay,
} from "@/lib/i18n/educational-content-overlay";
import {
  loadFlashcardEducationalBundle,
  loadQuestionEducationalOverlayBundle,
} from "@/lib/i18n/educational-content-overlay";

function asQuestionOverlayPayload(raw: unknown): QuestionEducationalOverlay | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as QuestionEducationalOverlay;
}

function asPathwayLessonOverlayPayload(raw: unknown): PathwayLessonEducationalOverlay | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as PathwayLessonEducationalOverlay;
}

function asFlashcardBundlePatch(raw: unknown): Partial<FlashcardEducationalBundle> | null {
  if (!raw || typeof raw !== "object") return null;
  return raw as Partial<FlashcardEducationalBundle>;
}

const EDUCATIONAL_TRANSLATION_PUBLIC_TIMEOUT_MS = 1200;

/**
 * Published `PATHWAY_LESSON` rows keyed by `sourceId` (`pathwayId:slug` or `slug`).
 */
/** Safe for read paths: English → `{}`; DB errors → `{}` + log (file overlays still apply). */
export async function fetchPublishedPathwayLessonOverlayMapSafe(
  locale: string,
): Promise<Record<string, PathwayLessonEducationalOverlay>> {
  if (locale === DEFAULT_MARKETING_LOCALE) return {};
  const out = await withDatabaseFallbackTimeout<Record<string, PathwayLessonEducationalOverlay> | null>(
    () => fetchPublishedPathwayLessonOverlayMap(locale),
    null,
    EDUCATIONAL_TRANSLATION_PUBLIC_TIMEOUT_MS,
    {
      scope: "i18n",
      label: `pathway_lesson_overlay:${locale}`,
    },
  );
  if (out === null) {
    safeServerLog("i18n", "educational_translation_pathway_lesson_overlay_fallback_used", {
      locale,
    });
    return {};
  }
  return out;
}

export async function fetchPublishedPathwayLessonOverlayMap(
  locale: string,
): Promise<Record<string, PathwayLessonEducationalOverlay>> {
  const rows = await prisma.educationalTranslationOverlay.findMany({
    where: {
      locale,
      status: EducationalTranslationStatus.PUBLISHED,
      sourceKind: EducationalTranslationSourceKind.PATHWAY_LESSON,
    },
    select: { sourceId: true, payload: true },
  });
  const out: Record<string, PathwayLessonEducationalOverlay> = {};
  for (const r of rows) {
    const patch = asPathwayLessonOverlayPayload(r.payload);
    if (patch) out[r.sourceId] = patch;
  }
  return out;
}

/**
 * Published `EXAM_QUESTION` rows keyed by question id.
 */
export async function fetchPublishedExamQuestionOverlayMap(
  locale: string,
): Promise<Record<string, QuestionEducationalOverlay>> {
  const rows = await prisma.educationalTranslationOverlay.findMany({
    where: {
      locale,
      status: EducationalTranslationStatus.PUBLISHED,
      sourceKind: EducationalTranslationSourceKind.EXAM_QUESTION,
    },
    select: { sourceId: true, payload: true },
  });
  const out: Record<string, QuestionEducationalOverlay> = {};
  for (const r of rows) {
    const patch = asQuestionOverlayPayload(r.payload);
    if (patch) out[r.sourceId] = patch;
  }
  return out;
}

/**
 * Merge file `questions.json` with DB-published overlays (DB wins per question id).
 */
export async function resolveMergedQuestionOverlayBundle(
  locale: string,
): Promise<Record<string, QuestionEducationalOverlay>> {
  const file = loadQuestionEducationalOverlayBundle(locale);
  if (locale === DEFAULT_MARKETING_LOCALE) return file;
  try {
    const db = await fetchPublishedExamQuestionOverlayMap(locale);
    return { ...file, ...db };
  } catch (e) {
    safeServerLog("i18n", "educational_translation_question_db_merge_failed", {
      locale,
      detail: e instanceof Error ? e.message : String(e),
    });
    return file;
  }
}

/**
 * Per-row payload shapes (import-friendly):
 * - FLASHCARD_DECK: `{ "title"?, "description"? }` for `sourceId` = deck id
 * - FLASHCARD: `{ "front"?, "back"?, "explanation"? }` for `sourceId` = card id
 * - FLASHCARD_TAG: `{ "label"? }` for `sourceId` = tag id
 * Or file-shaped bundle fragments: `{ "decks": { [id]: ... } }`, etc.
 */
async function fetchFlashcardOverlaysFromDb(locale: string): Promise<FlashcardEducationalBundle> {
  const rows = await prisma.educationalTranslationOverlay.findMany({
    where: {
      locale,
      status: EducationalTranslationStatus.PUBLISHED,
      sourceKind: {
        in: [
          EducationalTranslationSourceKind.FLASHCARD_DECK,
          EducationalTranslationSourceKind.FLASHCARD,
          EducationalTranslationSourceKind.FLASHCARD_TAG,
        ],
      },
    },
    select: { sourceKind: true, sourceId: true, payload: true },
  });

  const decks: NonNullable<FlashcardEducationalBundle["decks"]> = {};
  const cards: NonNullable<FlashcardEducationalBundle["cards"]> = {};
  const tags: NonNullable<FlashcardEducationalBundle["tags"]> = {};

  for (const r of rows) {
    const p = asFlashcardBundlePatch(r.payload);
    const raw = r.payload as Record<string, unknown>;

    if (r.sourceKind === EducationalTranslationSourceKind.FLASHCARD_DECK) {
      const fromNested = p?.decks?.[r.sourceId];
      const flat =
        fromNested ??
        (typeof raw.title === "string" || raw.description !== undefined
          ? {
              title: typeof raw.title === "string" ? raw.title : undefined,
              description:
                raw.description === null || typeof raw.description === "string" ? raw.description : undefined,
            }
          : undefined);
      if (flat) decks[r.sourceId] = flat;
    } else if (r.sourceKind === EducationalTranslationSourceKind.FLASHCARD) {
      const fromNested = p?.cards?.[r.sourceId];
      const flat =
        fromNested ??
        (typeof raw.front === "string" || typeof raw.back === "string" || typeof raw.explanation === "string"
          ? {
              front: typeof raw.front === "string" ? raw.front : undefined,
              back: typeof raw.back === "string" ? raw.back : undefined,
              explanation: typeof raw.explanation === "string" ? raw.explanation : undefined,
            }
          : undefined);
      if (flat) cards[r.sourceId] = flat;
    } else if (r.sourceKind === EducationalTranslationSourceKind.FLASHCARD_TAG) {
      const fromNested = p?.tags?.[r.sourceId];
      const flat =
        fromNested ??
        (typeof raw.label === "string" ? { label: raw.label } : undefined);
      if (flat) tags[r.sourceId] = flat;
    }
  }

  const out: FlashcardEducationalBundle = {};
  if (Object.keys(decks).length) out.decks = decks;
  if (Object.keys(cards).length) out.cards = cards;
  if (Object.keys(tags).length) out.tags = tags;
  return out;
}

/**
 * Merge file `flashcards.json` with DB-published deck/card/tag rows (DB wins per id).
 */
export async function resolveMergedFlashcardEducationalBundle(
  locale: string,
): Promise<FlashcardEducationalBundle> {
  const file = loadFlashcardEducationalBundle(locale);
  if (locale === DEFAULT_MARKETING_LOCALE) return file;
  try {
    const db = await fetchFlashcardOverlaysFromDb(locale);
    return {
      decks: { ...(file.decks ?? {}), ...(db.decks ?? {}) },
      cards: { ...(file.cards ?? {}), ...(db.cards ?? {}) },
      tags: { ...(file.tags ?? {}), ...(db.tags ?? {}) },
    };
  } catch (e) {
    safeServerLog("i18n", "educational_translation_flashcard_db_merge_failed", {
      locale,
      detail: e instanceof Error ? e.message : String(e),
    });
    return file;
  }
}

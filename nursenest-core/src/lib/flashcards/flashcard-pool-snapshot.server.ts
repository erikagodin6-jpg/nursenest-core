import "server-only";

import {
  collectMergedLessonVirtualFlashcardsForPathway,
  type LessonVirtualInventoryDiagnostics,
  type MergedLessonVirtualFlashcard,
} from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import { loadPublishedPathwayLessonsForStudyFromDb } from "@/lib/learner-study-hub/load-published-pathway-lessons-for-study-from-db";
import { cacheGet, cacheSet } from "@/lib/server/content-cache";

type FlashcardPoolSnapshot = {
  virtuals: MergedLessonVirtualFlashcard[];
  diagnostics: LessonVirtualInventoryDiagnostics;
};

type ExamTopicMetaEntry = { bodySystem: string | null; topic: string | null };

const SNAPSHOT_TTL_SECONDS = 300;

function snapshotCacheKey(pathwayId: string): string {
  return `flashcards:pool-snapshot:${pathwayId}:v2`;
}

function examTopicMetaCacheKey(pathwayId: string): string {
  return `flashcards:exam-topic-meta:${pathwayId}:v2`;
}

export async function loadFlashcardPoolSnapshotForPathway(
  pathwayId: string,
): Promise<FlashcardPoolSnapshot> {
  const pid = pathwayId.trim();
  if (!pid) {
    return {
      virtuals: [],
      diagnostics: {
        pathwayId: "",
        catalogLessonCount: 0,
        lessonsWithVirtualCards: 0,
        totalVirtualCards: 0,
        recallVirtualCount: 0,
        sectionDerivedVirtualCount: 0,
        genericFillerSourcedSectionCards: 0,
      },
    };
  }

  const cached = await cacheGet<FlashcardPoolSnapshot>(snapshotCacheKey(pid));
  if (cached) return cached;

  const pathwayLessons = await loadPublishedPathwayLessonsForStudyFromDb(pid);
  const value = collectMergedLessonVirtualFlashcardsForPathway(
    pid,
    pathwayLessons.length > 0 ? pathwayLessons : undefined,
  );
  await cacheSet(snapshotCacheKey(pid), value, SNAPSHOT_TTL_SECONDS).catch(() => {});
  return value;
}

/**
 * Returns a cached exam-question topic-metadata map for the given pathway.
 * Returns `null` on cache miss — the caller must populate via
 * {@link setExamTopicMetaForPathway} after querying the DB.
 */
export async function getExamTopicMetaForPathway(
  pathwayId: string,
): Promise<Map<string, ExamTopicMetaEntry> | null> {
  const rows = await cacheGet<Array<[string, ExamTopicMetaEntry]>>(examTopicMetaCacheKey(pathwayId));
  if (!rows || rows.length === 0) return null;
  return new Map(rows);
}

/**
 * Stores an exam-question topic-metadata map for the given pathway.
 * Existing entries for IDs not in the new map are preserved so partial
 * hydrations (e.g. smaller card sets) accumulate across requests.
 */
export async function setExamTopicMetaForPathway(
  pathwayId: string,
  entries: Iterable<[string, ExamTopicMetaEntry]>,
): Promise<void> {
  const existing = await getExamTopicMetaForPathway(pathwayId);
  const byId: Map<string, ExamTopicMetaEntry> = existing ?? new Map();
  for (const [id, meta] of entries) {
    byId.set(id, meta);
  }
  await cacheSet(examTopicMetaCacheKey(pathwayId), [...byId.entries()], SNAPSHOT_TTL_SECONDS).catch(() => {});
}

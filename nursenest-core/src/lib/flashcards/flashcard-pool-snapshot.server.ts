import "server-only";

import {
  collectMergedLessonVirtualFlashcardsForPathway,
  type LessonVirtualInventoryDiagnostics,
  type MergedLessonVirtualFlashcard,
} from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import { loadPublishedPathwayLessonsForStudyFromDb } from "@/lib/learner-study-hub/load-published-pathway-lessons-for-study-from-db";

type FlashcardPoolSnapshot = {
  virtuals: MergedLessonVirtualFlashcard[];
  diagnostics: LessonVirtualInventoryDiagnostics;
};

// Exam-question topic metadata: bodySystem + topic per question ID.
// Pathway-scoped, content-only — the same data for every user on the same pathway.
// 300 s TTL: lesson virtual content only changes on admin publish; 5-minute caching
// trades at most one stale session per publish event for eliminating the cold-miss
// lesson findMany (30-70 ms) on the vast majority of requests in serverless environments
// where 60 s TTL fires prematurely across instance restarts.
type ExamTopicMetaEntry = { bodySystem: string | null; topic: string | null };
type ExamTopicMetaCache = {
  expiresAt: number;
  byId: Map<string, ExamTopicMetaEntry>;
};

const SNAPSHOT_TTL_MS = 300_000;
const SNAPSHOT_MAX = 64;

const snapshots = new Map<
  string,
  { expiresAt: number; value: FlashcardPoolSnapshot }
>();
const examTopicMetaCache = new Map<string, ExamTopicMetaCache>();

function pruneMap<V>(map: Map<string, V & { expiresAt: number }>, max: number, now: number) {
  for (const [k, entry] of map) {
    if (entry.expiresAt <= now) map.delete(k);
  }
  while (map.size > max) {
    const oldest = map.keys().next().value;
    if (!oldest) break;
    map.delete(oldest);
  }
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

  const now = Date.now();
  pruneMap(snapshots, SNAPSHOT_MAX, now);
  const cached = snapshots.get(pid);
  if (cached && cached.expiresAt > now) return cached.value;

  const pathwayLessons = await loadPublishedPathwayLessonsForStudyFromDb(pid);
  const value = collectMergedLessonVirtualFlashcardsForPathway(
    pid,
    pathwayLessons.length > 0 ? pathwayLessons : undefined,
  );
  snapshots.set(pid, { expiresAt: now + SNAPSHOT_TTL_MS, value });
  return value;
}

/**
 * Returns a cached exam-question topic-metadata map for the given pathway.
 * Returns `null` on cache miss — the caller must populate via
 * {@link setExamTopicMetaForPathway} after querying the DB.
 */
export function getExamTopicMetaForPathway(
  pathwayId: string,
): Map<string, ExamTopicMetaEntry> | null {
  const now = Date.now();
  const entry = examTopicMetaCache.get(pathwayId);
  if (!entry || entry.expiresAt <= now) return null;
  return entry.byId;
}

/**
 * Stores an exam-question topic-metadata map for the given pathway.
 * Existing entries for IDs not in the new map are preserved so partial
 * hydrations (e.g. smaller card sets) accumulate across requests.
 */
export function setExamTopicMetaForPathway(
  pathwayId: string,
  entries: Iterable<[string, ExamTopicMetaEntry]>,
): void {
  const now = Date.now();
  pruneMap(examTopicMetaCache, SNAPSHOT_MAX, now);
  const existing = examTopicMetaCache.get(pathwayId);
  const byId: Map<string, ExamTopicMetaEntry> =
    existing && existing.expiresAt > now ? existing.byId : new Map();
  for (const [id, meta] of entries) {
    byId.set(id, meta);
  }
  examTopicMetaCache.set(pathwayId, {
    expiresAt: now + SNAPSHOT_TTL_MS,
    byId,
  });
}

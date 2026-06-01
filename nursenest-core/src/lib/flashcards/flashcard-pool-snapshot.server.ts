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

const SNAPSHOT_TTL_MS = 60_000;
const SNAPSHOT_MAX = 64;
const snapshots = new Map<
  string,
  { expiresAt: number; value: FlashcardPoolSnapshot }
>();

function pruneSnapshots(now: number) {
  for (const [key, entry] of snapshots) {
    if (entry.expiresAt <= now) snapshots.delete(key);
  }
  while (snapshots.size > SNAPSHOT_MAX) {
    const oldest = snapshots.keys().next().value;
    if (!oldest) break;
    snapshots.delete(oldest);
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
  pruneSnapshots(now);
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

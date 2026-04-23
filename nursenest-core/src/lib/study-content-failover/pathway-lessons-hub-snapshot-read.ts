import "server-only";

import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import type { LoadPathwayLessonsHubPageArgs } from "@/lib/exam-pathways/marketing-hub-lessons-page-args";
import { readStudyPublishedSnapshotFile, stableListOptsKey } from "@/lib/study-content-failover/study-published-snapshot-store";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

function isPathwayLessonsPageResult(raw: unknown): raw is PathwayLessonsPageResult {
  if (!raw || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.items) || typeof o.total !== "number") return false;
  const items = o.items as unknown[];
  const total = o.total as number;
  const ra = o.renderableAll;
  if (Array.isArray(ra)) return true;
  /** Legacy snapshots may omit `renderableAll` only when `items` already represents the full list. */
  return total <= items.length;
}

/**
 * Secondary read: last successful export for this pathway + locale + page + list filter key.
 * Relative path: `lessons-hub/{pathwayId}/{locale}/p{page}-s{size}-{optsKey}.json`
 */
export async function readPathwayLessonsHubPageSnapshot(
  pathwayId: string,
  args: LoadPathwayLessonsHubPageArgs,
): Promise<StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> | null> {
  const { pageRequested, pageSizeRequested, lessonContentLocale, listOpts } = args;
  const optsKey = stableListOptsKey(listOpts);
  const rel = [
    "lessons-hub",
    pathwayId,
    lessonContentLocale,
    `p${pageRequested}-s${pageSizeRequested}-${optsKey}.json`,
  ];
  const env = await readStudyPublishedSnapshotFile<PathwayLessonsPageResult>(rel);
  if (!env || env.surface !== "pathway_lessons_hub") return null;
  if (!isPathwayLessonsPageResult(env.payload)) return null;
  return env;
}

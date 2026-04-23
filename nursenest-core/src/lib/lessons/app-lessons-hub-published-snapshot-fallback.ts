import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";

/**
 * Snapshot listOpts must match `stableListOptsKey` / export job (`export-pathway-lessons-hub-snapshot.mts`).
 * Topic text search without `topicSlug` cannot be keyed to a snapshot file — omit listOpts (use `"all"` key).
 */
export function appLessonsHubListOptsForSnapshot(args: {
  qEffective: string | null;
  topicSlugFilter: string | null;
}): { q?: string; topicSlugsIn?: string[] } | undefined {
  const q = args.qEffective?.trim();
  const ts = args.topicSlugFilter?.trim().toLowerCase();
  if (q && ts) return { q, topicSlugsIn: [ts] };
  if (q) return { q };
  if (ts) return { topicSlugsIn: [ts] };
  return undefined;
}

export type AppLessonsHubSnapshotLessonsBlock = {
  source: "pathway_lessons";
  total: number;
  page: number;
  pageCount: number;
  rows: Array<{
    id: string;
    title: string;
    summary: string | null;
    topic?: string | null;
    bodySystem?: string | null;
    pathwayMeta: { pathwayId: string; slug: string };
  }>;
};

function pathwayLessonCardSummary(row: {
  seoDescription: string;
  topic: string;
  bodySystem: string;
}): string | null {
  const d = row.seoDescription?.trim();
  if (d) return d.length > 220 ? `${d.slice(0, 217)}…` : d;
  const parts = [row.topic?.trim(), row.bodySystem?.trim()].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

/**
 * Maps a published pathway hub snapshot page into the app hub row shape (subscriber lessons list).
 */
export function lessonsListBlockFromPathwayHubSnapshot(
  pathwayId: string,
  envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult>,
): AppLessonsHubSnapshotLessonsBlock | null {
  const p = envelope.payload;
  if (!p || !Array.isArray(p.items) || typeof p.total !== "number") return null;
  const rows: AppLessonsHubSnapshotLessonsBlock["rows"] = [];
  for (const raw of p.items) {
    const r = raw as PathwayLessonRecord;
    if (!r?.id || !r.slug || !r.title) continue;
    rows.push({
      id: r.id,
      title: r.title,
      summary: pathwayLessonCardSummary({
        seoDescription: r.seoDescription ?? "",
        topic: r.topic ?? "",
        bodySystem: r.bodySystem ?? "",
      }),
      topic: r.topic ?? null,
      bodySystem: r.bodySystem ?? null,
      pathwayMeta: { pathwayId, slug: r.slug },
    });
  }
  const pageSize = p.pageSize > 0 ? p.pageSize : Math.max(1, rows.length);
  const pageCount = p.pageCount > 0 ? p.pageCount : Math.max(1, Math.ceil(p.total / pageSize) || 1);
  return {
    source: "pathway_lessons",
    total: p.total,
    page: p.page,
    pageCount,
    rows,
  };
}

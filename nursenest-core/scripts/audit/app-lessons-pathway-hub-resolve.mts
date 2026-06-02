#!/usr/bin/env npx tsx
/**
 * Audit: pathway lesson rows that pass the subscriber hub safety gate must resolve via
 * {@link getPathwayLesson} (same core identity as `/app/lessons/[id]` pathway branch).
 *
 * Usage (requires DATABASE_URL + built catalog if used by loader):
 *   cd nursenest-core && npx tsx scripts/audit/app-lessons-pathway-hub-resolve.mts
 *
 * Env:
 *   AUDIT_PATHWAY_HUB_RESOLVE_LIMIT — max DB rows to scan (default 500)
 *   AUDIT_PATHWAY_HUB_RESOLVE_STRICT — set to "1" to exit 1 on first failure (default: exit 1 on any failure)
 *
 * Exit 0 when every checked row resolves; exit 1 when any row fails or DB errors.
 */
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPathwayLesson } from "@/lib/lessons/pathway-lesson-loader";
import { PATHWAY_LESSON_CANONICAL_DB_LOCALE } from "@/lib/lessons/pathway-lesson-locale";

const LIMIT = Math.min(5000, Math.max(1, Number(process.env.AUDIT_PATHWAY_HUB_RESOLVE_LIMIT ?? "500") || 500));

/** Mirrors `pathwayLessonSafetyGateWhere` in `app/(learner)/lessons/page.tsx` — keep in sync. */
function pathwayLessonSafetyGateWhere() {
  return {
    AND: [
      { title: { not: "" } },
      { slug: { not: "" } },
      { topic: { not: "" } },
      { topicSlug: { not: "" } },
      { previewSectionCount: { gt: 0 } },
      {
        OR: [{ seoDescription: { not: "" } }, { seoTitle: { not: "" } }],
      },
      {
        NOT: [
          { title: { contains: "placeholder", mode: "insensitive" as const } },
          { title: { contains: "tbd", mode: "insensitive" as const } },
          { slug: { startsWith: "tmp-" } },
          { slug: { startsWith: "draft-" } },
        ],
      },
    ],
  };
}

async function main() {
  const where = {
    AND: [
      { status: ContentStatus.PUBLISHED },
      { locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE },
      pathwayLessonSafetyGateWhere(),
    ],
  };

  const rows = await prisma.pathwayLesson.findMany({
    where,
    select: { pathwayId: true, slug: true, id: true },
    take: LIMIT,
    orderBy: [{ pathwayId: "asc" }, { slug: "asc" }],
  });

  const failures: { pathwayId: string; slug: string; id: string; reason: string }[] = [];

  for (const row of rows) {
    try {
      const record = await getPathwayLesson(row.pathwayId, row.slug, undefined);
      if (!record) {
        failures.push({
          pathwayId: row.pathwayId,
          slug: row.slug,
          id: row.id,
          reason: "getPathwayLesson returned undefined",
        });
      }
    } catch (e) {
      failures.push({
        pathwayId: row.pathwayId,
        slug: row.slug,
        id: row.id,
        reason: e instanceof Error ? e.message : String(e),
      });
    }
  }

  if (failures.length) {
    console.error(`app-lessons-pathway-hub-resolve: ${failures.length} failure(s) of ${rows.length} scanned`);
    for (const f of failures.slice(0, 50)) {
      console.error(`  ${f.pathwayId} / ${f.slug} (${f.id}): ${f.reason}`);
    }
    if (failures.length > 50) {
      console.error(`  … and ${failures.length - 50} more`);
    }
    process.exit(1);
  }

  console.log(`app-lessons-pathway-hub-resolve: OK — ${rows.length} row(s) resolve`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

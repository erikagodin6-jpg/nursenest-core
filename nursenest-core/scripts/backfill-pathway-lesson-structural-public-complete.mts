/**
 * One-time backfill: set `pathway_lessons.structural_public_complete` from the canonical
 * normalizeLesson / structural gate (same as runtime before this denormalization).
 *
 * Run after: `npx prisma migrate deploy` (or `migrate dev`) in the same release as the column.
 *
 *   cd nursenest-core && npx tsx scripts/backfill-pathway-lesson-structural-public-complete.mts
 */
import "../src/lib/db/script-env-bootstrap";
import { prisma } from "../src/lib/db";
import { computeStructuralPublicCompleteFromDbRow } from "../src/lib/lessons/pathway-lesson-catalog-sync";

const BATCH = 80;

async function main() {
  let cursor: string | undefined;
  let updated = 0;
  let scanned = 0;
  for (;;) {
    const rows = await prisma.pathwayLesson.findMany({
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: BATCH,
      orderBy: { id: "asc" },
      select: {
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
        examMeta: true,
        countries: true,
        priority: true,
      },
    });
    if (rows.length === 0) break;
    for (const row of rows) {
      scanned++;
      const structuralPublicComplete = computeStructuralPublicCompleteFromDbRow(row);
      await prisma.pathwayLesson.update({
        where: { id: row.id },
        data: { structuralPublicComplete },
      });
      updated++;
    }
    cursor = rows[rows.length - 1]!.id;
  }
  console.log(JSON.stringify({ ok: true, scanned, rowsUpdated: updated }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

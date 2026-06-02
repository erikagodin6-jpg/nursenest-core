import "../src/lib/db/env-bootstrap";

/**
 * Batch-import allied pathway lessons from a JSON array file.
 *
 * Usage:
 *   npx tsx scripts/import-allied-pathway-lessons-batched.ts path/to/lessons.json
 *
 * File shape: { "lessons": [ { pathwayId, slug, title, topic, topicSlug, bodySystem, ... } ] }
 * or a bare array. Rows are upserted by (pathwayId, slug, locale). Failures per row do not abort the batch.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ContentStatus, Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";

const BATCH = 100;

type Incoming = {
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount?: number;
  seoTitle: string;
  seoDescription: string;
  sections: unknown;
  locale?: string;
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: npx tsx scripts/import-allied-pathway-lessons-batched.ts <json-file>");
    process.exit(1);
  }
  const raw = await readFile(path.resolve(file), "utf8");
  const parsed = JSON.parse(raw) as { lessons?: Incoming[] } | Incoming[];
  const rows: Incoming[] = Array.isArray(parsed) ? parsed : parsed.lessons ?? [];
  if (rows.length === 0) {
    console.log("No rows to import.");
    return;
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    for (const row of chunk) {
      try {
        if (!row.pathwayId || !row.slug || !row.title) {
          skipped += 1;
          continue;
        }
        const locale = row.locale ?? "en";
        const existing = await prisma.pathwayLesson.findUnique({
          where: { pathwayId_slug_locale: { pathwayId: row.pathwayId, slug: row.slug, locale } },
        });
        const data = {
          pathwayId: row.pathwayId,
          slug: row.slug,
          title: row.title,
          topic: row.topic ?? "General",
          topicSlug: row.topicSlug ?? "general",
          bodySystem: row.bodySystem ?? "general",
          previewSectionCount: row.previewSectionCount ?? 1,
          seoTitle: row.seoTitle ?? row.title,
          seoDescription: row.seoDescription ?? "",
          sections: row.sections ?? [],
          locale,
          status: ContentStatus.PUBLISHED,
        };
        if (existing) {
          await prisma.pathwayLesson.update({
            where: { id: existing.id },
            data: {
              title: data.title,
              topic: data.topic,
              topicSlug: data.topicSlug,
              bodySystem: data.bodySystem,
              previewSectionCount: data.previewSectionCount,
              seoTitle: data.seoTitle,
              seoDescription: data.seoDescription,
              sections: data.sections as Prisma.InputJsonValue,
              status: ContentStatus.PUBLISHED,
            },
          });
          updated += 1;
        } else {
          await prisma.pathwayLesson.create({
            data: { ...data, sections: data.sections as Prisma.InputJsonValue },
          });
          inserted += 1;
        }
      } catch (e) {
        failed += 1;
        console.error("Row failed:", row.slug, e);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        total: rows.length,
        inserted,
        updated,
        skipped,
        failed,
        at: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Idempotent: upserts rows in `pathway_lessons` from `src/content/pathway-lessons/catalog.json`.
 * Run after migration: `npm run db:seed-pathway-lessons`
 *
 * Catalog is English-only (`locale: "en"`). Add other locales by inserting/updating rows with the same
 * `pathwayId` + `slug` and a different `locale` (see `PATHWAY_LESSON_CONTENT_LOCALE_CODES` in pathway-lesson-locale).
 */
import "../src/lib/db/env-bootstrap";
import catalog from "@/content/pathway-lessons/catalog.json";
import { ContentStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CatalogLesson = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: unknown;
};

type CatalogShape = {
  pathways: Record<string, { lessons: CatalogLesson[] }>;
};

async function main() {
  const data = catalog as unknown as CatalogShape;
  let n = 0;
  for (const [pathwayId, bucket] of Object.entries(data.pathways)) {
    const lessons = bucket.lessons ?? [];
    for (let sortOrder = 0; sortOrder < lessons.length; sortOrder++) {
      const lesson = lessons[sortOrder];
      await prisma.pathwayLesson.upsert({
        where: { pathwayId_slug_locale: { pathwayId, slug: lesson.slug, locale: "en" } },
        create: {
          pathwayId,
          slug: lesson.slug,
          locale: "en",
          title: lesson.title,
          topic: lesson.topic,
          topicSlug: lesson.topicSlug,
          bodySystem: lesson.bodySystem,
          previewSectionCount: lesson.previewSectionCount,
          seoTitle: lesson.seoTitle,
          seoDescription: lesson.seoDescription,
          sections: lesson.sections as object,
          status: ContentStatus.PUBLISHED,
          sortOrder,
        },
        update: {
          locale: "en",
          title: lesson.title,
          topic: lesson.topic,
          topicSlug: lesson.topicSlug,
          bodySystem: lesson.bodySystem,
          previewSectionCount: lesson.previewSectionCount,
          seoTitle: lesson.seoTitle,
          seoDescription: lesson.seoDescription,
          sections: lesson.sections as object,
          status: ContentStatus.PUBLISHED,
          sortOrder,
        },
      });
      n++;
    }
  }
  console.log(`pathway_lessons: upserted ${n} rows from catalog.json`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

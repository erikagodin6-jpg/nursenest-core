import "@/lib/db/env-bootstrap";
import { ContentStatus, PrismaClient } from "@prisma/client";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";

const PATHWAY_ID = "ca-rpn-rex-pn";
const LOCALE = "en";

function parseApply(): boolean {
  return process.argv.includes("--apply");
}

const apply = parseApply();
const lessons = getCatalogPathwayLessonsSync(PATHWAY_ID);

if (!apply) {
  console.log(
    JSON.stringify(
      {
        dryRun: true,
        pathwayId: PATHWAY_ID,
        locale: LOCALE,
        lessonsToUpsert: lessons.length,
        note: "Run with --apply and DATABASE_URL configured to upsert published PathwayLesson rows.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const prisma = new PrismaClient();

try {
  let upserted = 0;
  for (let sortOrder = 0; sortOrder < lessons.length; sortOrder++) {
    const lesson = lessons[sortOrder];
    const data = {
      pathwayId: PATHWAY_ID,
      slug: lesson.slug,
      locale: LOCALE,
      title: lesson.title,
      topic: lesson.topic,
      topicSlug: lesson.topicSlug,
      bodySystem: lesson.bodySystem,
      previewSectionCount: lesson.previewSectionCount,
      seoTitle: lesson.seoTitle,
      seoDescription: lesson.seoDescription,
      sections: lesson.sections as object,
      structuralPublicComplete: Boolean(lesson.structuralQuality?.publicComplete),
      countries: lesson.countries ?? [],
      exams: lesson.exams ?? [],
      priority: lesson.priority ?? "medium",
      examMeta: lesson.examMeta ?? [],
      status: ContentStatus.PUBLISHED,
      sortOrder,
      published_at: new Date(),
    };
    await prisma.pathwayLesson.upsert({
      where: { pathwayId_slug_locale: { pathwayId: PATHWAY_ID, slug: lesson.slug, locale: LOCALE } },
      create: data,
      update: data,
    });
    upserted++;
  }
  console.log(
    JSON.stringify(
      {
        dryRun: false,
        pathwayId: PATHWAY_ID,
        locale: LOCALE,
        upserted,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}

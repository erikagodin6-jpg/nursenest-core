#!/usr/bin/env npx tsx
/**
 * Publish the dedicated Respiratory Therapy lesson catalog into pathway_lessons.
 *
 * Run:
 *   cd nursenest-core
 *   npx tsx scripts/seed-rt-lessons-from-catalog.mts
 */
import { ContentStatus, CountryCode, TierCode } from "@prisma/client";

import { prisma } from "@/lib/db";
import { respiratoryTherapyLessons } from "@/content/pathway-lessons/allied-professions/respiratory-therapy";

const PATHWAY_ID = "us-allied-core";
const PROFESSION_KEY = "respiratory";
const EXAM_KEY = "ALLIED";

async function main(): Promise<void> {
  let count = 0;

  for (const [index, lesson] of respiratoryTherapyLessons.entries()) {
    await prisma.pathwayLesson.upsert({
      where: { pathwayId_slug: { pathwayId: PATHWAY_ID, slug: lesson.slug } },
      create: {
        pathwayId: PATHWAY_ID,
        slug: lesson.slug,
        title: lesson.title,
        topic: lesson.topic,
        topicSlug: lesson.topicSlug,
        bodySystem: lesson.bodySystem ?? "respiratory",
        previewSectionCount: lesson.previewSectionCount ?? 2,
        seoTitle: lesson.seoTitle,
        seoDescription: lesson.seoDescription,
        sections: lesson.sections,
        structuralPublicComplete: true,
        countryCode: CountryCode.US,
        tierCode: TierCode.ALLIED,
        status: ContentStatus.PUBLISHED,
        sortOrder: index + 1,
        locale: "en",
        countries: ["US"],
        exams: [EXAM_KEY, "RRT", "TMC", "CSE"],
        priority: "high",
        alliedProfessionKey: PROFESSION_KEY,
        published_at: new Date(),
      },
      update: {
        title: lesson.title,
        topic: lesson.topic,
        topicSlug: lesson.topicSlug,
        bodySystem: lesson.bodySystem ?? "respiratory",
        previewSectionCount: lesson.previewSectionCount ?? 2,
        seoTitle: lesson.seoTitle,
        seoDescription: lesson.seoDescription,
        sections: lesson.sections,
        structuralPublicComplete: true,
        countryCode: CountryCode.US,
        tierCode: TierCode.ALLIED,
        status: ContentStatus.PUBLISHED,
        sortOrder: index + 1,
        countries: ["US"],
        exams: [EXAM_KEY, "RRT", "TMC", "CSE"],
        priority: "high",
        alliedProfessionKey: PROFESSION_KEY,
        published_at: new Date(),
      },
    });
    count += 1;
  }

  console.log(JSON.stringify({ ok: true, pathwayId: PATHWAY_ID, professionKey: PROFESSION_KEY, lessons: count }, null, 2));
}

main()
  .catch((error) => {
    console.error("[seed-rt-lessons-from-catalog] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import type { PrismaClient } from "@prisma/client";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { shouldSuppressProfessionalPracticeHubLesson } from "@/lib/taxonomy/nursing-taxonomy-validation";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

export type TaxonomyWriteHealthSummary = {
  reviewPendingCount: number;
  publishBlockedCount: number;
  professionalHubSuppressionSampleHits: number;
  professionalHubSuppressionSampleSize: number;
  topAmbiguousSignals: string[];
};

/**
 * Bounded admin/reporting snapshot — not a full table scan.
 */
export async function getTaxonomyWriteHealthSummary(db: PrismaClient): Promise<TaxonomyWriteHealthSummary> {
  const [examReview, blogReview, lessonReview, contentItemReview, examNullBody] = await Promise.all([
    db.examQuestion.count({ where: { bodySystem: REVIEW_REQUIRED } }),
    db.blogPost.count({ where: { category: REVIEW_REQUIRED } }),
    db.pathwayLesson.count({ where: { bodySystem: REVIEW_REQUIRED } }),
    db.contentItem.count({ where: { type: "lesson", bodySystem: REVIEW_REQUIRED } }),
    db.examQuestion.count({ where: { OR: [{ bodySystem: null }, { bodySystem: "" }] } }),
  ]);

  const flashReview = await db.flashcard.count({
    where: { category: { OR: [{ slug: "review-required" }, { topicCode: REVIEW_REQUIRED }] } },
  });

  const contentItemNull = await db.contentItem.count({
    where: { type: "lesson", OR: [{ bodySystem: null }, { bodySystem: "" }] },
  });

  const reviewPendingCount = examReview + blogReview + lessonReview + contentItemReview + flashReview;

  const blogMissing = await db.blogPost.count({ where: { OR: [{ category: null }, { category: "" }] } });
  const publishBlockedCount =
    examReview +
    examNullBody +
    blogReview +
    blogMissing +
    lessonReview +
    contentItemReview +
    contentItemNull +
    flashReview;

  const hubSampleSize = 120;
  const lessons = await db.pathwayLesson.findMany({
    take: hubSampleSize,
    orderBy: { updatedAt: "desc" },
    select: {
      slug: true,
      title: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      seoDescription: true,
      system: true,
      sections: true,
    },
  });

  let professionalHubSuppressionSampleHits = 0;
  for (const row of lessons) {
    const rec = row as unknown as PathwayLessonRecord;
    if (shouldSuppressProfessionalPracticeHubLesson(rec)) professionalHubSuppressionSampleHits += 1;
  }

  const ambiguousRows = await db.examQuestion.findMany({
    where: { bodySystem: REVIEW_REQUIRED },
    take: 40,
    orderBy: { updatedAt: "desc" },
    select: { stem: true, tags: true, topic: true },
  });
  const freq = new Map<string, number>();
  for (const r of ambiguousRows) {
    for (const t of r.tags ?? []) {
      const k = t.trim().slice(0, 64);
      if (!k) continue;
      freq.set(k, (freq.get(k) ?? 0) + 1);
    }
    const head = r.stem.trim().slice(0, 48).toLowerCase().replace(/\s+/g, " ");
    if (head) freq.set(`stem:${head}`, (freq.get(`stem:${head}`) ?? 0) + 1);
    if (r.topic?.trim()) freq.set(`topic:${r.topic.trim().slice(0, 48)}`, (freq.get(`topic:${r.topic}`) ?? 0) + 1);
  }
  const topAmbiguousSignals = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([k]) => k);

  return {
    reviewPendingCount,
    publishBlockedCount,
    professionalHubSuppressionSampleHits,
    professionalHubSuppressionSampleSize: lessons.length,
    topAmbiguousSignals,
  };
}

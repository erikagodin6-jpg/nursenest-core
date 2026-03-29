import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

const LOW_THRESHOLD = 20;
const PUBLISHED = "published";

/** Coverage gaps: topic buckets with few published questions (production `exam_questions` has no Category FK). */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const topicBuckets = await prisma.examQuestion.groupBy({
    by: ["topic"],
    where: { status: PUBLISHED, topic: { not: null } },
    _count: { _all: true },
  });

  const lowQuestionTopics = topicBuckets
    .filter((t) => (t._count._all ?? 0) < LOW_THRESHOLD)
    .map((t) => ({
      topic: t.topic,
      publishedQuestions: t._count._all,
    }));

  const lessonCount = await prisma.contentItem.count({
    where: { type: "lesson", status: PUBLISHED },
  });

  const examsPerFamily = await prisma.exam.groupBy({
    by: ["examFamily"],
    _count: { examFamily: true },
    where: { status: ContentStatus.PUBLISHED },
  });

  return NextResponse.json({
    lowQuestionTopics,
    lessonsPublished: lessonCount,
    publishedExamsByFamily: examsPerFamily,
    thresholds: { lowQuestionCount: LOW_THRESHOLD },
    note: "Flashcard↔lesson links live in `flashcard_bank.lesson_links` JSON in production; not modeled in Prisma yet.",
  });
}

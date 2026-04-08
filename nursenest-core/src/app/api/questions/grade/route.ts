import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { Prisma } from "@prisma/client";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { buildRationalePayloadForGradeResponse } from "@/lib/content-quality/rationale-display";
import { buildNormalizedTeachingPayload, buildTeachingMediaBundle } from "@/lib/content-quality/teaching-payload";
import { deriveTopicCode } from "@/lib/learner/topic-linking";
import type { RecommendationConfidence } from "@/lib/learner/topic-linking";
import { ContentStatus } from "@prisma/client";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { mergeQuestionOverlayForGradeResponse } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedQuestionOverlayBundle } from "@/lib/i18n/educational-translation-db";

function topicRoutingConfidence(row: { subtopic?: string | null; topic?: string | null; bodySystem?: string | null }): RecommendationConfidence {
  if ((row.subtopic ?? "").trim().length > 1) return "high";
  if ((row.topic ?? "").trim().length > 1) return "medium";
  if ((row.bodySystem ?? "").trim().length > 1) return "low";
  return "low";
}

function appendTopicCodeToDrillHref(href: string, topicCode: string): string {
  if (!topicCode || href.includes("topicCode=")) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}topicCode=${encodeURIComponent(topicCode)}`;
}

function normalizeCorrect(correctAnswer: Prisma.JsonValue | null | undefined): string[] {
  if (correctAnswer == null) return [];
  if (Array.isArray(correctAnswer)) return correctAnswer.map((x) => String(x));
  if (typeof correctAnswer === "string") return [correctAnswer];
  return [String(correctAnswer)];
}

function gradeMatches(questionType: string, correct: string[], userAnswer: unknown): boolean {
  const t = questionType.toUpperCase();
  if (t === "SATA" || t === "SELECT_ALL_THAT_APPLY") {
    const u = Array.isArray(userAnswer) ? userAnswer.map((x) => String(x)).sort() : [];
    const c = [...correct].map(String).sort();
    if (u.length !== c.length) return false;
    return u.every((v, i) => v === c[i]);
  }
  const u = userAnswer == null ? "" : String(userAnswer);
  return correct.length > 0 && u === String(correct[0]);
}

export async function POST(req: Request) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/questions/grade", feature: SERVER_FEATURE.question, userId: gate.userId });

  let body: { questionId?: string; answer?: unknown };
  try {
    body = (await req.json()) as { questionId?: string; answer?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const questionId = typeof body.questionId === "string" && body.questionId.length > 4 ? body.questionId : null;
  if (!questionId) {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }

  try {
    const row = await withRetry(() =>
      prisma.examQuestion.findFirst({
        where: questionIdWhereIfAllowed(questionId, gate.entitlement),
        select: {
          id: true,
          stem: true,
          questionType: true,
          correctAnswer: true,
          rationale: true,
          correctAnswerExplanation: true,
          clinicalReasoning: true,
          keyTakeaway: true,
          clinicalPearl: true,
          examStrategy: true,
          memoryHook: true,
          clinicalTrap: true,
          distractorRationales: true,
          incorrectAnswerRationale: true,
          topic: true,
          subtopic: true,
          bodySystem: true,
          tags: true,
          images: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const expected = normalizeCorrect(row.correctAnswer);
    if (expected.length === 0) {
      return NextResponse.json(
        { error: "Question is missing an answer key in the bank.", questionId: row.id },
        { status: 422 },
      );
    }

    const correct = gradeMatches(row.questionType, expected, body.answer);

    try {
      await recordTopicOutcomesSequential(gate.userId, [
        { topic: normalizeTopicLabel(row.topic), correct },
      ]);
    } catch {
      /* ledger is best-effort */
    }

    const locale = await getMarketingLocaleForDefaultRoute();
    const questionOverlayBundle = await resolveMergedQuestionOverlayBundle(locale);
    const displayRow = mergeQuestionOverlayForGradeResponse(row, row.id, locale, questionOverlayBundle);

    const rationaleBundle = buildRationalePayloadForGradeResponse(displayRow);
    const teaching = buildNormalizedTeachingPayload(displayRow);
    const teachingMedia = buildTeachingMediaBundle(displayRow);
    const topicCode = deriveTopicCode({ topic: row.topic, subtopic: row.subtopic, bodySystem: row.bodySystem });
    const linkConfidence = topicRoutingConfidence(row);

    const [linkedPathwayLesson, linkedContentLesson, linkedDeck] = topicCode
      ? await Promise.all([
          prisma.pathwayLesson.findFirst({
            where: { topicSlug: topicCode, status: ContentStatus.PUBLISHED, locale: "en" },
            select: { id: true },
            orderBy: { sortOrder: "asc" },
          }),
          prisma.contentItem.findFirst({
            where: { type: "lesson", status: "published", bodySystem: topicCode },
            select: { id: true },
            orderBy: { updatedAt: "desc" },
          }),
          prisma.flashcardDeck.findFirst({
            where: {
              status: ContentStatus.PUBLISHED,
              cards: {
                some: {
                  status: ContentStatus.PUBLISHED,
                  category: { topicCode },
                },
              },
            },
            select: { slug: true },
            orderBy: { sortOrder: "asc" },
          }),
        ])
      : [null, null, null];

    const lessonHref = linkedPathwayLesson
      ? `/app/lessons/${linkedPathwayLesson.id}`
      : linkedContentLesson
        ? `/app/lessons/${linkedContentLesson.id}`
        : null;
    const flashcardsHref = topicCode
      ? linkedDeck
        ? `/app/flashcards/${linkedDeck.slug}/study?topicCode=${encodeURIComponent(topicCode)}`
        : `/app/flashcards?topicCode=${encodeURIComponent(topicCode)}`
      : null;
    const topicDrillBase =
      topicCode && row.topic
        ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(row.topic)}`
        : topicCode
          ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topicCode)}`
          : null;
    const topicDrillHref = topicDrillBase && topicCode ? appendTopicCodeToDrillHref(topicDrillBase, topicCode) : topicDrillBase;

    return NextResponse.json({
      correct,
      rationale: displayRow.rationale ?? null,
      rationaleQuality: rationaleBundle.rationaleQuality,
      rationaleSections: rationaleBundle.sections,
      teaching,
      teachingMedia,
      referenceMedia: teachingMedia.referenceMedia,
      matchedConceptImage: teachingMedia.matchedConceptImage,
      topic: row.topic ?? null,
      topicCode,
      subtopic: row.subtopic ?? null,
      bodySystem: row.bodySystem ?? null,
      questionType: row.questionType,
      learningLoop: {
        topicCode,
        confidence: topicCode ? linkConfidence : "low",
        lessonHref,
        flashcardsHref,
        topicDrillHref,
      },
      topicStatsUpdated: true,
    });
  } catch (e) {
    safeServerLogCritical("api_questions_grade", "failed", { questionId }, e);
    return NextResponse.json({ error: "Unable to grade. Try again shortly." }, { status: 503 });
  }
}

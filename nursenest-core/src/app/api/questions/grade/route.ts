import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionIdWhereIfAllowed } from "@/lib/entitlements/assert-question-access";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
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
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { resolveRationaleLessonLinksForQuestion } from "@/lib/learner/rationale-lesson-link-resolve";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { incrementBankQuestionsGradedToday } from "@/lib/learner/increment-bank-questions-graded-today";
import { gradeMatches, normalizeCorrect } from "@/lib/questions/grade-answer-match";

export const dynamic = "force-dynamic";

function topicRoutingConfidence(row: { subtopic?: string | null; topic?: string | null; bodySystem?: string | null }): RecommendationConfidence {
  if ((row.subtopic ?? "").trim().length > 1) return "high";
  if ((row.topic ?? "").trim().length > 1) return "medium";
  if ((row.bodySystem ?? "").trim().length > 1) return "low";
  return "low";
}

function effectivePathwayIdForGrade(
  requestPathway: unknown,
  storedLearnerPath: string | null | undefined,
): string | null {
  const req = typeof requestPathway === "string" ? requestPathway.trim() : "";
  if (req && getExamPathwayById(req)) return req;
  const stored = (storedLearnerPath ?? "").trim();
  if (stored && getExamPathwayById(stored)) return stored;
  return null;
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/questions/grade", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/questions/grade", feature: SERVER_FEATURE.question, userId: gate.userId });

  let body: { questionId?: string; answer?: unknown; pathwayId?: string };
  try {
    body = (await req.json()) as { questionId?: string; answer?: unknown; pathwayId?: string };
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

    const userPathwayRow = await prisma.user.findUnique({
      where: { id: gate.userId },
      select: { learnerPath: true },
    });
    const effectivePathwayId = effectivePathwayIdForGrade(body.pathwayId, userPathwayRow?.learnerPath ?? null);

    const rationaleLessonLinks = await resolveRationaleLessonLinksForQuestion(prisma, {
      pathwayId: effectivePathwayId,
      topic: row.topic ?? null,
      subtopic: row.subtopic ?? null,
      bodySystem: row.bodySystem ?? null,
      tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
      stem: displayRow.stem ?? row.stem ?? null,
    });

    const [linkedContentLesson, linkedDeck] = topicCode
      ? await Promise.all([
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
      : [null, null];

    const lessonHrefFromRationale = rationaleLessonLinks[0]?.href ?? null;
    const lessonHrefFromContent = linkedContentLesson ? `/app/lessons/${linkedContentLesson.id}` : null;
    const lessonHref = lessonHrefFromRationale ?? lessonHrefFromContent;
    const flashcardsHref = topicCode
      ? linkedDeck
        ? `/app/flashcards/${linkedDeck.slug}/study?topicCode=${encodeURIComponent(topicCode)}`
        : `/app/flashcards?topicCode=${encodeURIComponent(topicCode)}`
      : null;
    const topicDrillQs = new URLSearchParams();
    topicDrillQs.set("preset", "topic_drill");
    if (effectivePathwayId) topicDrillQs.set("pathwayId", effectivePathwayId);
    if (topicCode && row.topic) {
      topicDrillQs.set("topic", row.topic);
    } else if (topicCode) {
      topicDrillQs.set("topic", topicCode);
    } else if (row.topic) {
      topicDrillQs.set("topic", row.topic);
    }
    if (topicCode) topicDrillQs.set("topicCode", topicCode);
    const topicDrillBase =
      topicDrillQs.has("topic") || topicDrillQs.has("topicCode")
        ? `/app/questions?${topicDrillQs.toString()}`
        : null;
    const topicDrillHref = topicDrillBase;

    void incrementBankQuestionsGradedToday(gate.userId);

    /** ~5% sample for PostHog volume/accuracy trends — no question id, no stem content. */
    if (Math.random() < 0.05) {
      void captureServerEvent(analyticsDistinctId(gate.userId), PH.learnerQuestionGradedSample, {
        is_correct: correct,
      });
    }

    return NextResponse.json({
      correct,
      /** Canonical option key(s) for client-side review styling (same strings as `options` JSON). */
      correctKeys: expected,
      rationale: displayRow.rationale ?? null,
      clinicalPearl: displayRow.clinicalPearl ?? null,
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
      rationaleLessonLinks: rationaleLessonLinks.map((l) => ({
        kind: l.kind,
        slug: l.slug,
        title: l.title,
        href: l.href,
        hrefSource: l.hrefSource,
        ctaKey: l.ctaKey,
      })),
      topicStatsUpdated: true,
    });
  } catch (e) {
    safeServerLogCritical("api_questions_grade", "failed", { questionId }, e);
    return NextResponse.json({ error: "Unable to grade. Try again shortly." }, { status: 503 });
  }
  });
}

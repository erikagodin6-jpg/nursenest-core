/**
 * POST /api/learner/lesson-topic-quiz
 *
 * Records a completed lesson-linked topic MCQ run (bottom-of-lesson quiz).
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { recordLessonTopicLinkedQuiz } from "@/lib/lessons/lesson-assessment-store";

const bodySchema = z.object({
  lessonId: z.string().min(1).max(200),
  pathwayId: z.string().max(80).default(""),
  topic: z.string().max(200).default(""),
  score: z.number().int().min(0).max(200),
  total: z.number().int().min(1).max(30),
  questionIds: z.array(z.string().min(8).max(80)).max(30),
  outcomes: z.array(z.object({ correct: z.boolean() })).max(30),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/lesson-topic-quiz", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/lesson-topic-quiz",
      feature: SERVER_FEATURE.exam,
      userId: gate.userId,
    });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 422 });
    }

    const { lessonId, pathwayId, topic, score, total, questionIds, outcomes } = parsed.data;
    if (outcomes.length !== total || questionIds.length !== total) {
      return NextResponse.json({ error: "length_mismatch" }, { status: 422 });
    }

    try {
      const practiceTestId = await recordLessonTopicLinkedQuiz({
        userId: gate.userId,
        lessonId,
        pathwayId,
        topic,
        score,
        total,
        questionIds,
        outcomes,
      });
      return NextResponse.json({ ok: true, practiceTestId });
    } catch {
      return NextResponse.json({ error: "record_failed" }, { status: 500 });
    }
  });
}

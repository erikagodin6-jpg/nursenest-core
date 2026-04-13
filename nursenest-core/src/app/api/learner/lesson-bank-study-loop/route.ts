/**
 * GET  ?lessonId=  — latest bank pre/post scores for this lesson
 * POST — persist a completed bank pre or post quiz attempt
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import {
  loadLatestLessonBankStudyRecord,
  recordLessonBankStudyLoop,
} from "@/lib/lessons/lesson-bank-study-loop-store";

const postSchema = z.object({
  lessonId: z.string().min(1).max(200),
  pathwayId: z.string().max(80).default(""),
  topic: z.string().max(200).default(""),
  type: z.enum(["pre", "post"]),
  questionIds: z.array(z.string().min(4)).min(1).max(40),
  score: z.number().int().min(0).max(200),
  total: z.number().int().min(1).max(200),
  answers: z.record(z.string(), z.number().int().min(0).max(10)),
  wrongQuestionIds: z.array(z.string()).max(40).default([]),
});

export async function GET(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/lesson-bank-study-loop",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  try {
    const record = await loadLatestLessonBankStudyRecord(gate.userId, lessonId);
    return NextResponse.json({ ok: true, record });
  } catch {
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/lesson-bank-study-loop",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 422 });
  }

  const d = parsed.data;

  try {
    const practiceTestId = await recordLessonBankStudyLoop({
      userId: gate.userId,
      lessonId: d.lessonId,
      pathwayId: d.pathwayId,
      topic: d.topic,
      type: d.type,
      questionIds: d.questionIds,
      score: d.score,
      total: d.total,
      answers: d.answers,
      wrongQuestionIds: d.wrongQuestionIds,
    });
    const record = await loadLatestLessonBankStudyRecord(gate.userId, d.lessonId);
    return NextResponse.json({ ok: true, practiceTestId, record });
  } catch {
    return NextResponse.json({ error: "record_failed" }, { status: 500 });
  }
}

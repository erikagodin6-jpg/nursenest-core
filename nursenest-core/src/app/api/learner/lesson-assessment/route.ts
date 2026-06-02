/**
 * /api/learner/lesson-assessment
 *
 * GET  ?lessonId=<id>  — load existing pre/post scores for this learner + lesson
 * POST              — record a completed pre or post assessment attempt
 *
 * Auth: requireSubscriberSession
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import {
  recordLessonAssessment,
  loadLessonAssessmentRecord,
} from "@/lib/lessons/lesson-assessment-store";

// ─── Validation ────────────────────────────────────────────────────────────────

const recordSchema = z.object({
  lessonId: z.string().min(1).max(200),
  pathwayId: z.string().max(80).default(""),
  topic: z.string().max(200).default(""),
  type: z.enum(["pre", "post"]),
  score: z.number().int().min(0).max(200),
  total: z.number().int().min(1).max(200),
});

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/lesson-assessment", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/lesson-assessment",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId || lessonId.length < 1) {
    return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  }

  try {
    const record = await loadLessonAssessmentRecord(gate.userId, lessonId);
    return NextResponse.json({ ok: true, record });
  } catch {
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
  });
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/learner/lesson-assessment", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/lesson-assessment",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = recordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues }, { status: 422 });
  }

  const { lessonId, pathwayId, topic, type, score, total } = parsed.data;

  try {
    const practiceTestId = await recordLessonAssessment({
      userId: gate.userId,
      lessonId,
      pathwayId,
      topic,
      type,
      score,
      total,
    });

    // Also fetch the updated record so the client can show the delta immediately
    const record = await loadLessonAssessmentRecord(gate.userId, lessonId);

    return NextResponse.json({ ok: true, practiceTestId, record });
  } catch {
    return NextResponse.json({ error: "record_failed" }, { status: 500 });
  }
  });
}

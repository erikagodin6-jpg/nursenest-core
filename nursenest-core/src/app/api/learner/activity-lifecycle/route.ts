import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import {
  emitActivityAbandoned,
  emitActivityCompleted,
  emitActivityError,
  emitActivityResume,
  emitActivityStarted,
} from "@/lib/observability/activity-instrumentation-hooks";

export const dynamic = "force-dynamic";

const ACTIVITY_TYPES = [
  "questions",
  "flashcards",
  "lessons",
  "clinical-skills",
  "pharmacology",
  "ecg",
  "cat",
  "loft",
  "analytics",
  "dashboard",
  "study-plan",
  "smart-review",
  "readiness",
] as const;

const bodySchema = z.object({
  activity: z.enum(ACTIVITY_TYPES),
  event: z.enum(["activity_started", "activity_completed", "activity_abandoned", "activity_error", "activity_resume"]),
  route: z.string().max(240).optional(),
  sessionId: z.string().max(128).optional(),
  pathwayId: z.string().max(128).optional(),
  durationMs: z.number().int().min(0).max(24 * 60 * 60 * 1000).optional(),
  itemsCompleted: z.number().int().min(0).max(100000).optional(),
  score: z.number().int().min(0).max(100).optional(),
  completionRatio: z.number().min(0).max(1).optional(),
  reason: z.enum(["navigation", "timeout", "error", "unknown"]).optional(),
  errorMessage: z.string().max(240).optional(),
});

async function readJsonBody(req: Request): Promise<unknown> {
  const text = await req.text();
  if (!text.trim()) return {};
  return JSON.parse(text);
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/activity-lifecycle", "content", async () => {
    const session = await auth();
    const user = session?.user as { id?: string; tier?: string } | undefined;
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    let parsedBody: z.infer<typeof bodySchema>;
    try {
      const parsed = bodySchema.safeParse(await readJsonBody(req));
      if (!parsed.success) {
        return NextResponse.json({ ok: false, error: "Invalid activity lifecycle payload" }, { status: 400 });
      }
      parsedBody = parsed.data;
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const tier = user?.tier ?? "UNKNOWN";
    const base = {
      userId,
      activity: parsedBody.activity,
      tier,
      pathwayId: parsedBody.pathwayId,
      sessionId: parsedBody.sessionId ?? `${parsedBody.activity}:${parsedBody.route ?? "unknown"}`,
    };

    switch (parsedBody.event) {
      case "activity_started":
        emitActivityStarted(base);
        break;
      case "activity_completed":
        emitActivityCompleted({
          ...base,
          durationMs: parsedBody.durationMs ?? 0,
          itemsCompleted: parsedBody.itemsCompleted,
          score: parsedBody.score,
        });
        break;
      case "activity_abandoned":
        emitActivityAbandoned({
          ...base,
          durationMs: parsedBody.durationMs ?? 0,
          completionRatio: parsedBody.completionRatio,
          reason: parsedBody.reason ?? "navigation",
        });
        break;
      case "activity_error":
        emitActivityError({
          ...base,
          errorMessage: parsedBody.errorMessage ?? "learner activity client error",
        });
        break;
      case "activity_resume":
        emitActivityResume({
          ...base,
          durationMs: parsedBody.durationMs,
        });
        break;
    }

    return NextResponse.json({ ok: true });
  });
}

/**
 * /api/learner/study-budget
 *
 * GET  — returns the learner's current study time budget settings
 * PATCH — updates dailyStudyMinutes and/or studyCadencePreference
 *
 * Auth: requireSubscriberSession (same as exam-plan route)
 */

import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const VALID_CADENCE = new Set(["light", "steady", "intensive"]);
const MIN_DAILY_MINUTES = 10;
const MAX_DAILY_MINUTES = 480; // 8 hours hard cap

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/study-budget", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/study-budget",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  try {
    const user = await prisma.user.findUnique({
      where: { id: gate.userId },
      select: { dailyStudyMinutes: true, studyCadencePreference: true },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      dailyStudyMinutes: user.dailyStudyMinutes,
      studyCadencePreference: user.studyCadencePreference,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load study budget." }, { status: 503 });
  }
  });
}

export async function PATCH(req: Request) {
  return runWithApiTelemetry(req, "PATCH /api/learner/study-budget", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/learner/study-budget",
    feature: SERVER_FEATURE.exam,
    userId: gate.userId,
  });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const updates: { dailyStudyMinutes?: number | null; studyCadencePreference?: string | null } = {};

  // ── dailyStudyMinutes ─────────────────────────────────────────────────────
  if ("dailyStudyMinutes" in b) {
    if (b.dailyStudyMinutes === null) {
      updates.dailyStudyMinutes = null;
    } else {
      const raw = Number(b.dailyStudyMinutes);
      if (!Number.isFinite(raw) || raw < MIN_DAILY_MINUTES || raw > MAX_DAILY_MINUTES) {
        return NextResponse.json(
          { error: `dailyStudyMinutes must be between ${MIN_DAILY_MINUTES} and ${MAX_DAILY_MINUTES}` },
          { status: 400 },
        );
      }
      updates.dailyStudyMinutes = Math.round(raw);
    }
  }

  // ── studyCadencePreference ────────────────────────────────────────────────
  if ("studyCadencePreference" in b) {
    if (b.studyCadencePreference === null) {
      updates.studyCadencePreference = null;
    } else if (typeof b.studyCadencePreference !== "string") {
      return NextResponse.json({ error: "studyCadencePreference must be a string or null" }, { status: 400 });
    } else {
      const val = b.studyCadencePreference.trim().toLowerCase();
      if (!VALID_CADENCE.has(val)) {
        return NextResponse.json(
          { error: "studyCadencePreference must be light, steady, or intensive" },
          { status: 400 },
        );
      }
      updates.studyCadencePreference = val;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: gate.userId },
      data: updates,
      select: { dailyStudyMinutes: true, studyCadencePreference: true },
    });
    return NextResponse.json({ ok: true, ...updated });
  } catch {
    return NextResponse.json({ error: "Unable to save study budget." }, { status: 503 });
  }
  });
}

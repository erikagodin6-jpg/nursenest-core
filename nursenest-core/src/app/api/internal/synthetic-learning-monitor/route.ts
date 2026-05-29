import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import {
  isSyntheticLearningIngestAuthorized,
  parseSyntheticLearningPayload,
  sendSyntheticLearningFailureAlerts,
} from "@/lib/observability/synthetic-learning-monitoring";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function checkedAtDate(value: string | null | undefined): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/internal/synthetic-learning-monitor", "cron", async () => {
    if (!isSyntheticLearningIngestAuthorized(req)) {
      return new NextResponse(null, { status: 404 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const parsed = parseSyntheticLearningPayload(json);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const failures = parsed.checks.filter((c) => c.status === "fail");
    const rows = parsed.checks.map((check) =>
      Prisma.sql`(
        ${randomUUID()},
        ${check.runId},
        ${check.checkName},
        ${check.route},
        ${check.status},
        ${check.durationMs},
        ${check.httpStatus ?? null},
        ${check.error ?? null},
        ${check.screenshotDataUrl ?? null},
        ${check.meta ? JSON.stringify(check.meta) : null}::jsonb,
        ${checkedAtDate(check.checkedAt)}
      )`,
    );

    await prisma.$executeRaw`
      INSERT INTO "synthetic_learning_check_results"
        ("id", "run_id", "check_name", "route", "status", "duration_ms", "http_status", "error", "screenshot_data_url", "meta", "checked_at")
      VALUES ${Prisma.join(rows)}
    `;

    for (const check of parsed.checks) {
      emitMonitoringRecord({
        scope: "synthetic_learning",
        event: check.status === "pass" ? "activity_check_passed" : "activity_check_failed",
        severity: check.status === "pass" ? "info" : "error",
        route: check.route,
        durationMs: check.durationMs,
        httpStatus: check.httpStatus ?? undefined,
        meta: {
          check: check.checkName,
          status: check.status,
          run_id: check.runId,
        },
      });
    }

    if (failures.length > 0) {
      safeServerLog("synthetic_learning", "activity_monitor_failures", {
        runId: failures[0]?.runId ?? "",
        failed: failures.length,
        total: parsed.checks.length,
      });
      await sendSyntheticLearningFailureAlerts(failures);
    }

    return NextResponse.json({
      ok: failures.length === 0,
      recorded: parsed.checks.length,
      failed: failures.length,
    });
  });
}

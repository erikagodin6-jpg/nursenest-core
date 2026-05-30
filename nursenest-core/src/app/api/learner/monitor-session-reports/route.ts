import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";

/**
 * POST /api/learner/monitor-session-reports
 *
 * Persists a completed Physiology Monitor session report.
 * Stored in ClinicalScenarioSimulationRun with scenarioId = "monitor:{conditionKey}".
 *
 * Body: { conditionKey, mode, compositeScore, clinicalJudgmentScore, harmIndexScore, harmColor, reportJson }
 */
export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/monitor-session-reports", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/monitor-session-reports",
      feature: SERVER_FEATURE.api,
      userId: gate.userId,
    });

    let body: {
      conditionKey?: string;
      mode?: string;
      compositeScore?: number;
      clinicalJudgmentScore?: number;
      harmIndexScore?: number;
      harmColor?: string;
      reportJson?: unknown;
    };

    try {
      body = (await req.json()) as typeof body;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { conditionKey, mode, compositeScore, clinicalJudgmentScore, harmIndexScore, harmColor, reportJson } = body;

    if (!conditionKey || typeof conditionKey !== "string") {
      return NextResponse.json({ error: "conditionKey required" }, { status: 400 });
    }

    if (!isDatabaseUrlConfigured()) {
      safeServerLog("monitor", "session_report_db_unavailable", { conditionKey });
      return NextResponse.json({ ok: true, persisted: false, reason: "db_unavailable" });
    }

    try {
      const tierFocus = gate.entitlement.tier ?? "unknown";
      const pathwayId = mode ?? "general";

      const run = await prisma.clinicalScenarioSimulationRun.create({
        data: {
          userId: gate.userId,
          scenarioId: `monitor:${conditionKey}`,
          pathwayId,
          tierFocus: String(tierFocus),
          summary: {
            conditionKey,
            mode: mode ?? "general",
            compositeScore: compositeScore ?? 0,
            clinicalJudgmentScore: clinicalJudgmentScore ?? 0,
            harmIndexScore: harmIndexScore ?? 0,
            harmColor: harmColor ?? "green",
            reportJson: reportJson ?? null,
          },
        },
        select: { id: true },
      });

      safeServerLog("monitor", "session_report_saved", {
        sessionRunId: run.id.slice(0, 12),
        conditionKey,
        compositeScore,
        harmColor,
      });

      return NextResponse.json({ ok: true, persisted: true, id: run.id });
    } catch (e) {
      safeServerLog("monitor", "session_report_save_failed", {
        conditionKey,
        error: e instanceof Error ? e.message.slice(0, 200) : String(e),
      });
      return NextResponse.json({ ok: true, persisted: false, reason: "db_error" });
    }
  });
}

/**
 * GET /api/learner/monitor-session-reports
 *
 * Returns the learner's recent monitor session history (last 20).
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/monitor-session-reports", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    if (!isDatabaseUrlConfigured()) {
      return NextResponse.json({ ok: true, sessions: [] });
    }

    const runs = await prisma.clinicalScenarioSimulationRun.findMany({
      where: {
        userId: gate.userId,
        scenarioId: { startsWith: "monitor:" },
      },
      select: {
        id: true,
        scenarioId: true,
        pathwayId: true,
        summary: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ ok: true, sessions: runs });
  });
}

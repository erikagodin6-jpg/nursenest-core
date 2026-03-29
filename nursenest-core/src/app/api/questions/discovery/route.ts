import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";

/**
 * Lightweight bank discovery: topic buckets + counts + exam code breakdown (no question bodies).
 */
export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/questions/discovery", feature: "question", userId: gate.userId });

  const base = questionAccessWhere(gate.entitlement);

  try {
    const byTopic = await withRetry(() =>
      prisma.examQuestion.groupBy({
        by: ["topic"],
        where: { ...base, topic: { not: null } },
        _count: { _all: true },
      }),
    );

    const byExam = await withRetry(() =>
      prisma.examQuestion.groupBy({
        by: ["exam"],
        where: base,
        _count: { _all: true },
      }),
    );

    const total = await withRetry(() =>
      prisma.examQuestion.count({ where: base }),
    );

    const buckets = byTopic
      .map((row) => ({
        topic: row.topic ?? "Unknown",
        count: row._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      total,
      buckets,
      examFamily: byExam.map((r) => ({
        exam: r.exam,
        count: r._count._all,
      })),
    });
  } catch (e) {
    safeServerLogCritical("api_questions_discovery", "failed", {}, e);
    return NextResponse.json({ error: "Unable to load discovery" }, { status: 503 });
  }
}

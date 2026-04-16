/**
 * GET /api/questions/strategy-counts
 *
 * Returns per-strategy question counts and a total for the strategy trainer hub.
 * Lightweight aggregate query — no question bodies returned.
 *
 * Auth: subscriber-only (same tier as question bank).
 * Pagination: N/A — returns a fixed aggregated summary.
 * Performance: single GROUP BY query, result is small (~7 rows).
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";
import { ALL_STRATEGY_KEYS } from "@/lib/study/strategy-taxonomy";

export const dynamic = "force-dynamic";

// ── Response type ──────────────────────────────────────────────────────────────

export type StrategyCountsResponse = {
  /** Total questions that have any examStrategy value. */
  total: number;
  /** Per-strategy counts. Keys are StrategyKey values. */
  counts: Record<string, number>;
};

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/questions/strategy-counts", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({
    route: "/api/questions/strategy-counts",
    feature: SERVER_FEATURE.question,
    userId: gate.userId,
  });

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json<StrategyCountsResponse>({ total: 0, counts: {} });
  }

  try {
    // Use Prisma groupBy to get per-strategy counts in a single query.
    // Only count published questions that have a non-null examStrategy.
    const rows = await withRetry(() =>
      prisma.examQuestion.groupBy({
        by: ["examStrategy"],
        where: {
          status: "published",
          examStrategy: { in: ALL_STRATEGY_KEYS as unknown as string[] },
        },
        _count: { _all: true },
        orderBy: { _count: { examStrategy: "desc" } },
      }),
    );

    const counts: Record<string, number> = {};
    let total = 0;

    for (const row of rows) {
      if (row.examStrategy) {
        counts[row.examStrategy] = row._count._all;
        total += row._count._all;
      }
    }

    return NextResponse.json<StrategyCountsResponse>({ total, counts });
  } catch (e) {
    safeServerLogCritical("api_strategy_counts", "groupby_failed", {}, e);
    return NextResponse.json<StrategyCountsResponse>({ total: 0, counts: {} });
  }
  });
}

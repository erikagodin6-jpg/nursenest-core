"use server";

import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import {
  loadMoreReadinessTrend,
  loadConfidencePatterns,
  loadTimeMetrics,
  loadTopicBreakdown,
} from "@/lib/study/analytics-data";
import type {
  ConfidencePatternSummary,
  TimeMetrics,
  TopicRow,
  AnalyticsReadinessTrendWindow,
} from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";

async function requireSubscriberUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

/**
 * Load older readiness trend history.
 * Called by ReadinessTrendPanel when user clicks "Load more history".
 */
export async function loadMoreTrendData(
  afterId: string,
): Promise<AnalyticsLoadResult<AnalyticsReadinessTrendWindow>> {
  const userId = await requireSubscriberUserId();
  if (!userId) {
    return { kind: "error", reason: "unauthorized" };
  }
  return loadMoreReadinessTrend(userId, afterId, 10);
}

/**
 * Load detailed confidence patterns on-demand.
 * Called when the confidence panel is expanded / scrolled into view.
 */
export async function loadConfidencePatternsAction(): Promise<AnalyticsLoadResult<ConfidencePatternSummary>> {
  const userId = await requireSubscriberUserId();
  if (!userId) return { kind: "error", reason: "unauthorized" };
  return loadConfidencePatterns(userId, 20);
}

/**
 * Load time analysis metrics on-demand.
 */
export async function loadTimeMetricsAction(): Promise<AnalyticsLoadResult<TimeMetrics>> {
  const userId = await requireSubscriberUserId();
  if (!userId) return { kind: "error", reason: "unauthorized" };
  return loadTimeMetrics(userId, 10);
}

/**
 * Load topic breakdown on-demand.
 */
export async function loadTopicBreakdownAction(): Promise<AnalyticsLoadResult<TopicRow[]>> {
  const userId = await requireSubscriberUserId();
  if (!userId) return { kind: "error", reason: "unauthorized" };
  return loadTopicBreakdown(userId, 15);
}

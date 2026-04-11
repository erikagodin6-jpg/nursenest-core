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
  ReadinessTrendPoint,
} from "@/lib/study/analytics-data";

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
): Promise<{ points: ReadinessTrendPoint[]; hasMore: boolean; cursor: string | null }> {
  const userId = await requireSubscriberUserId();
  if (!userId) return { points: [], hasMore: false, cursor: null };
  return loadMoreReadinessTrend(userId, afterId, 10);
}

/**
 * Load detailed confidence patterns on-demand.
 * Called when the confidence panel is expanded / scrolled into view.
 */
export async function loadConfidencePatternsAction(): Promise<ConfidencePatternSummary> {
  const empty: ConfidencePatternSummary = {
    overconfidentErrors: 0,
    uncertainCorrect: 0,
    stableMastery: 0,
    totalRated: 0,
    highConfidenceAccuracy: null,
    sessionsAnalyzed: 0,
  };
  const userId = await requireSubscriberUserId();
  if (!userId) return empty;
  return loadConfidencePatterns(userId, 20);
}

/**
 * Load time analysis metrics on-demand.
 */
export async function loadTimeMetricsAction(): Promise<TimeMetrics> {
  const empty: TimeMetrics = {
    avgMsPerQuestion: null,
    avgSessionDurationMs: null,
    rushSessions: 0,
    deepStudySessions: 0,
    sessionsAnalyzed: 0,
    minSessionMs: null,
    maxSessionMs: null,
  };
  const userId = await requireSubscriberUserId();
  if (!userId) return empty;
  return loadTimeMetrics(userId, 10);
}

/**
 * Load topic breakdown on-demand.
 */
export async function loadTopicBreakdownAction(): Promise<TopicRow[]> {
  const userId = await requireSubscriberUserId();
  if (!userId) return [];
  return loadTopicBreakdown(userId, 15);
}

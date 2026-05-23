"use server";

/**
 * Review Queue Server Actions
 *
 * Provides cursor-style "load more" pagination for the review queue page.
 * Auth is read server-side — userId is never accepted from the client.
 *
 * Pattern:
 *   1. Initial page render fetches first page of each tier via loadReviewQueueInitialData
 *   2. "Load more" buttons call loadMoreReviewItems which re-runs aggregation
 *      and returns the next page slice for the requested priority tier
 *
 * Performance:
 *   - Fetches only last 30 days of attempts (capped at 20 sessions)
 *   - Total processing < 600 question records
 *   - Re-aggregation is O(n) over that cap — fast enough for server action latency
 */

import { auth } from "@/lib/auth";
import { loadReviewQueuePage } from "@/lib/study/review-queue-data";
import type { ReviewPriority, ScoredReviewItem } from "@/lib/study/srs-scheduler";

export interface LoadMoreResult {
  items: ScoredReviewItem[];
  total: number;
  hasMore: boolean;
  error?: string;
}

/**
 * Load the next page of a specific priority tier for the authenticated user.
 *
 * @param priority - Which tier to paginate ("due_now" | "review_soon" | "stable")
 * @param page     - 0-based page number (initial load used page 0)
 */
export async function loadMoreReviewItems(
  priority: ReviewPriority,
  page: number,
): Promise<LoadMoreResult> {
  try {
    const session = await auth();
    const userId = (session?.user as { id?: string })?.id ?? "";

    if (!userId) {
      return { items: [], total: 0, hasMore: false, error: "Not authenticated" };
    }

    const result = await loadReviewQueuePage(userId, priority, page);
    return result;
  } catch {
    return { items: [], total: 0, hasMore: false, error: "Failed to load review items" };
  }
}

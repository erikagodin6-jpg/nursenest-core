"use client";

/**
 * ReviewQueueClient
 *
 * Client component that owns the interactive queue state:
 *   - Filter state (topic + mode)
 *   - Load-more pagination per section
 *
 * The server action (loadMoreReviewItems) is imported directly in this
 * client component — this is the correct Next.js App Router pattern for
 * wiring server actions to client-side interaction. The RSC page passes
 * only serializable data (initial items + counts).
 */

import { useMemo } from "react";
import type { ScoredReviewItem, ReviewModeLabel } from "@/lib/study/srs-scheduler";
import { DueReviewSection } from "@/components/study/due-review-section";
import { ReviewQueueFilterController } from "@/components/study/review-queue-filters";
import { loadMoreReviewItems } from "@/app/(student)/app/(learner)/review/actions";

interface PagedTier {
  items: ScoredReviewItem[];
  total: number;
  hasMore: boolean;
}

interface ReviewQueueClientProps {
  dueNow: PagedTier;
  reviewSoon: PagedTier;
  stable: PagedTier;
}

export function ReviewQueueClient({
  dueNow,
  reviewSoon,
  stable,
}: ReviewQueueClientProps) {
  // Collect all unique topics across all tiers for the topic filter
  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const item of [
      ...dueNow.items,
      ...reviewSoon.items,
      ...stable.items,
    ]) {
      if (item.topic) set.add(item.topic);
    }
    return [...set].sort();
  }, [dueNow.items, reviewSoon.items, stable.items]);

  const totalSections =
    (dueNow.total > 0 ? 1 : 0) +
    (reviewSoon.total > 0 ? 1 : 0) +
    (stable.total > 0 ? 1 : 0);

  if (totalSections === 0) return null;

  return (
    <div className="space-y-4">
      <ReviewQueueFilterController topics={allTopics}>
        {({
          topicFilter,
          modeFilter,
        }: {
          topicFilter: string | null;
          modeFilter: ReviewModeLabel | null;
        }) => (
          <div className="space-y-4">
            <DueReviewSection
              priority="due_now"
              initialItems={dueNow.items}
              total={dueNow.total}
              initialHasMore={dueNow.hasMore}
              loadMore={loadMoreReviewItems}
              topicFilter={topicFilter}
              modeFilter={modeFilter ?? undefined}
            />
            <DueReviewSection
              priority="review_soon"
              initialItems={reviewSoon.items}
              total={reviewSoon.total}
              initialHasMore={reviewSoon.hasMore}
              loadMore={loadMoreReviewItems}
              topicFilter={topicFilter}
              modeFilter={modeFilter ?? undefined}
            />
            <DueReviewSection
              priority="stable"
              initialItems={stable.items}
              total={stable.total}
              initialHasMore={stable.hasMore}
              loadMore={loadMoreReviewItems}
              topicFilter={topicFilter}
              modeFilter={modeFilter ?? undefined}
            />
          </div>
        )}
      </ReviewQueueFilterController>
    </div>
  );
}

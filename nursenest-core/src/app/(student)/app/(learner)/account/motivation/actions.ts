"use server";

import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { loadTopicProgressPageForUser } from "@/lib/study/motivation-data";
import type { TopicProgressRow } from "@/lib/study/motivation-data";

async function requireSubscriberUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

/**
 * Load the next page of topic progress rows.
 * Called by TopicProgressGrid when the user clicks "Load more".
 *
 * @param page - Zero-indexed page number (page 0 = first 8 topics)
 */
export async function loadMoreTopicsAction(
  page: number,
): Promise<{ rows: TopicProgressRow[]; hasMore: boolean }> {
  const userId = await requireSubscriberUserId();
  if (!userId) return { rows: [], hasMore: false };

  return loadTopicProgressPageForUser(userId, page);
}

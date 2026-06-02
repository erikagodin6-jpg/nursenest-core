"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { decodeQuestionBookmarkBody, type QuestionBookmarkRow } from "@/lib/bookmarks/question-bookmarks";

export type QuestionBookmarksPagePayload = {
  bookmarks: QuestionBookmarkRow[];
  total: number;
  mostBookmarkedTopics: Array<{ topic: string; count: number }>;
  weakAreaBookmarkCount: number;
};

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

export async function loadQuestionBookmarksPagePayload(userId: string): Promise<QuestionBookmarksPagePayload> {
  if (!isDatabaseUrlConfigured()) {
    return { bookmarks: [], total: 0, mostBookmarkedTopics: [], weakAreaBookmarkCount: 0 };
  }

  const rows = await prisma.learnerNote.findMany({
    where: { userId, contextId: { startsWith: "nb:saved_questions:" } },
    orderBy: { updatedAt: "desc" },
    take: 500,
    select: {
      id: true,
      contextId: true,
      title: true,
      body: true,
      topic: true,
      pathwayId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const bookmarks = rows.map(decodeQuestionBookmarkBody).filter((row): row is QuestionBookmarkRow => Boolean(row));
  const topicCounts = new Map<string, number>();
  for (const bookmark of bookmarks) {
    const topic = bookmark.topic?.trim() || "Uncategorized";
    topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
  }

  return {
    bookmarks,
    total: bookmarks.length,
    mostBookmarkedTopics: [...topicCounts.entries()]
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic))
      .slice(0, 5),
    weakAreaBookmarkCount: bookmarks.filter((bookmark) =>
      bookmark.category === "difficult" || bookmark.category === "need_more_practice",
    ).length,
  };
}

export async function loadMyQuestionBookmarks(): Promise<QuestionBookmarksPagePayload> {
  const userId = await requireUserId();
  if (!userId) return { bookmarks: [], total: 0, mostBookmarkedTopics: [], weakAreaBookmarkCount: 0 };
  return loadQuestionBookmarksPagePayload(userId);
}

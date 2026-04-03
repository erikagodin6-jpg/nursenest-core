import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

function appendTopicCodeToDrillHref(href: string, topicCode: string): string {
  if (!topicCode || href.includes("topicCode=")) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}topicCode=${encodeURIComponent(topicCode)}`;
}

/**
 * Resolves in-app lesson + topic-drill URLs for a missed topic (same rules as question-grade learning loop).
 */
export async function resolveTopicRemediationLinks(
  topicCode: string | null | undefined,
  topicLabelForBank: string,
): Promise<{ lessonHref: string; qbankHref: string }> {
  const label = topicLabelForBank.trim();
  const code = (topicCode ?? "").trim() || null;

  const qbankBase =
    label.length > 0
      ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(label)}`
      : code
        ? `/app/questions?preset=topic_drill&topic=${encodeURIComponent(code)}`
        : "/app/questions?studyMode=weak";
  const qbankHref = code ? appendTopicCodeToDrillHref(qbankBase, code) : qbankBase;

  let lessonHref = "/app/lessons";
  if (code) {
    const [pathwayLesson, contentLesson] = await Promise.all([
      prisma.pathwayLesson.findFirst({
        where: { topicSlug: code, status: ContentStatus.PUBLISHED, locale: "en" },
        select: { id: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.contentItem.findFirst({
        where: { type: "lesson", status: "published", bodySystem: code },
        select: { id: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
    if (pathwayLesson) lessonHref = `/app/lessons/${pathwayLesson.id}`;
    else if (contentLesson) lessonHref = `/app/lessons/${contentLesson.id}`;
  }
  return { lessonHref, qbankHref };
}

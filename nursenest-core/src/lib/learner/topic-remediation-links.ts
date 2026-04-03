import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";

function appendTopicCodeToDrillHref(href: string, topicCode: string): string {
  if (!topicCode || href.includes("topicCode=")) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}topicCode=${encodeURIComponent(topicCode)}`;
}

/**
 * Resolves in-app lesson + topic-drill URLs for a missed topic.
 * Pathway lessons are limited to {@link pathwayLessonsAppListWhere} (country, tier, learnerPath).
 * Catalog `content_items` lessons use {@link lessonAccessWhere} (regionScope + tier ladder).
 */
export async function resolveTopicRemediationLinks(
  topicCode: string | null | undefined,
  topicLabelForBank: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
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
    const pathwayScope = pathwayLessonsAppListWhere(entitlement, learnerPath);
    const contentScope = lessonAccessWhere(entitlement);

    const [pathwayLesson, contentLesson] = await Promise.all([
      prisma.pathwayLesson.findFirst({
        where: {
          AND: [
            pathwayScope,
            {
              topicSlug: code,
              status: ContentStatus.PUBLISHED,
              locale: "en",
            },
          ],
        },
        select: { id: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.contentItem.findFirst({
        where: {
          AND: [contentScope, { bodySystem: code }],
        },
        select: { id: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);
    if (pathwayLesson) lessonHref = `/app/lessons/${pathwayLesson.id}`;
    else if (contentLesson) lessonHref = `/app/lessons/${contentLesson.id}`;
  }
  return { lessonHref, qbankHref };
}

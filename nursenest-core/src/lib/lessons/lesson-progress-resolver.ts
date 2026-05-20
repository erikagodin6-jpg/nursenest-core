import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";

export type ResolvedLessonRef = {
  title: string;
  href: string;
  kind: "content" | "pathway" | "pre_nursing";
};

export function parsePathwaySyntheticProgressId(lessonId: string): { pathwayId: string; slug: string } | null {
  if (!lessonId.startsWith("pathway:")) return null;
  const rest = lessonId.slice("pathway:".length);
  const idx = rest.indexOf(":");
  if (idx <= 0) return null;
  const pathwayId = rest.slice(0, idx);
  const slug = rest.slice(idx + 1);
  if (!pathwayId || !slug) return null;
  return { pathwayId, slug };
}

function parsePreNursingSyntheticId(lessonId: string): { slug: string } | null {
  const prefix = "pre-nursing-module:";
  if (!lessonId.startsWith(prefix)) return null;
  const slug = lessonId.slice(prefix.length).trim();
  if (!slug) return null;
  return { slug };
}

export async function resolveLessonRefFromProgressId(params: {
  lessonId: string;
  entitlement?: AccessScope;
  learnerPath?: string | null;
}): Promise<ResolvedLessonRef | null> {
  const { lessonId, entitlement, learnerPath = null } = params;
  if (!lessonId?.trim()) return null;

  const pre = parsePreNursingSyntheticId(lessonId);
  if (pre) {
    return {
      title: "Pre-nursing module",
      href: `/pre-nursing/guide/${encodeURIComponent(pre.slug)}`,
      kind: "pre_nursing",
    };
  }

  const parsedPathway = parsePathwaySyntheticProgressId(lessonId);
  if (parsedPathway) {
    const pathwayScope = entitlement ? await pathwayLessonsAppListWhere(entitlement, learnerPath) : null;
    const row = await prisma.pathwayLesson.findFirst({
      where: entitlement && pathwayScope
        ? {
            AND: [
              pathwayScope,
              {
                pathwayId: parsedPathway.pathwayId,
                slug: parsedPathway.slug,
                locale: "en",
                status: ContentStatus.PUBLISHED,
              },
            ],
          }
        : {
            pathwayId: parsedPathway.pathwayId,
            slug: parsedPathway.slug,
            locale: "en",
            status: ContentStatus.PUBLISHED,
          },
      select: { id: true, title: true },
    });
    if (!row) return null;
    return { title: row.title, href: `/app/lessons/${row.id}`, kind: "pathway" };
  }

  const content = await prisma.contentItem.findFirst({
    where: entitlement
      ? { AND: [{ id: lessonId, type: "lesson" }, lessonAccessWhere(entitlement)] }
      : { id: lessonId, type: "lesson" },
    select: { id: true, title: true },
  });
  if (content) return { title: content.title, href: `/app/lessons/${content.id}`, kind: "content" };

  const pathwayScopeForId = entitlement ? await pathwayLessonsAppListWhere(entitlement, learnerPath) : null;
  const pathwayById = await prisma.pathwayLesson.findFirst({
    where: entitlement && pathwayScopeForId
      ? { AND: [pathwayScopeForId, { id: lessonId }] }
      : { id: lessonId },
    select: { id: true, title: true },
  });
  if (pathwayById) return { title: pathwayById.title, href: `/app/lessons/${pathwayById.id}`, kind: "pathway" };

  return null;
}

import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { pathwayLessonsAppListWhere, visiblePathwayIdsForAppLessons } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

export type PathwayNextLesson = {
  title: string;
  href: string;
  pathwayId: string;
  slug: string;
  /** True when learner has completed ≥1 lesson or has an in-progress row in this pathway. */
  engagedInPathway: boolean;
  /** True when last touch on this pathway is older than `stallDays` and there is prior completion. */
  stalled: boolean;
};

function orderedPathwayIds(learnerPath: string | null | undefined, visible: string[]): string[] {
  const lp = learnerPath?.trim() ?? "";
  const rest = visible.filter((id) => id !== lp).sort((a, b) => a.localeCompare(b));
  if (lp && visible.includes(lp)) return [lp, ...rest];
  return [...visible].sort((a, b) => a.localeCompare(b));
}

/**
 * First incomplete pathway lesson in `sortOrder` (then `slug`) order for the learner’s entitled pathways.
 * Engagement / stall flags are pathway-scoped for the pathway that owns the returned lesson.
 */
export async function resolvePathwayNextLesson(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  options?: { stallDays?: number },
): Promise<PathwayNextLesson | null> {
  if (!userId || !entitlement.hasAccess) return null;

  const visible = visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  if (visible.length === 0) return null;

  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);
  const stallDays = options?.stallDays ?? 14;
  const stallMs = stallDays * 86400000;
  const now = Date.now();

  for (const pathwayId of orderedPathwayIds(learnerPath, visible)) {
    const prefix = `pathway:${pathwayId}:`;

    const [lessons, completedCount, lastProgress] = await Promise.all([
      prisma.pathwayLesson.findMany({
        where: { AND: [pathwayWhere, { pathwayId }] },
        orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
        take: 250,
        select: { id: true, title: true, slug: true },
      }),
      prisma.progress.count({
        where: { userId, completed: true, lessonId: { startsWith: prefix } },
      }),
      prisma.progress.findFirst({
        where: { userId, lessonId: { startsWith: prefix } },
        orderBy: { updatedAt: "desc" },
        select: { lessonId: true, completed: true, updatedAt: true },
      }),
    ]);

    if (lessons.length === 0) continue;

    const completedLessonIds = new Set(
      (
        await prisma.progress.findMany({
          where: { userId, completed: true, lessonId: { startsWith: prefix } },
          select: { lessonId: true },
          take: 500,
        })
      ).map((r) => r.lessonId),
    );

    for (const l of lessons) {
      const synthetic = `${prefix}${l.slug}`;
      if (completedLessonIds.has(synthetic)) continue;

      const engagedInPathway =
        completedCount > 0 || (lastProgress != null && lastProgress.lessonId.startsWith(prefix));
      const stalled =
        completedCount > 0 &&
        lastProgress != null &&
        now - lastProgress.updatedAt.getTime() > stallMs;

      return {
        title: l.title,
        href: `/app/lessons/${l.id}`,
        pathwayId,
        slug: l.slug,
        engagedInPathway,
        stalled,
      };
    }
  }

  return null;
}

/**
 * First entitled pathway lesson whose topic metadata matches the weak-topic key (deterministic pathway order).
 */
export async function resolvePathwayLessonForWeakTopic(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  weakTopicNormalized: string,
): Promise<{ title: string; href: string; pathwayId: string } | null> {
  if (!userId || !entitlement.hasAccess || !weakTopicNormalized.trim()) return null;

  const target = normalizeTopicKey(weakTopicNormalized);
  if (target.length < 2) return null;

  const visible = visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  if (visible.length === 0) return null;

  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  for (const pathwayId of orderedPathwayIds(learnerPath, visible)) {
    const rows = await prisma.pathwayLesson.findMany({
      where: { AND: [pathwayWhere, { pathwayId }] },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      take: 250,
      select: { id: true, title: true, topic: true, topicSlug: true },
    });

    for (const r of rows) {
      const fromTopic = normalizeTopicKey(r.topic);
      const fromSlug = normalizeTopicKey(r.topicSlug.replace(/-/g, " "));
      if (fromTopic === target || fromSlug === target) {
        return { title: r.title, href: `/app/lessons/${r.id}`, pathwayId };
      }
    }
  }

  return null;
}

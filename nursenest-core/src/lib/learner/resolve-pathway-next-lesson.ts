import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { pathwayLessonsAppListWhere, visiblePathwayIdsForAppLessons } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

const NEXT_LESSON_CHUNK = 80;

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

    const [lessonsRaw, completedCount, lastProgress] = await Promise.all([
      prisma.pathwayLesson.findMany({
        where: { AND: [pathwayWhere, { pathwayId }] },
        orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
        take: 500,
        select: {
          id: true,
          title: true,
          slug: true,
          topic: true,
          topicSlug: true,
          bodySystem: true,
          previewSectionCount: true,
          seoTitle: true,
          seoDescription: true,
          locale: true,
        },
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

    /** `pathwayWhere` already requires PUBLISHED + entitlement scope — avoid loading multi‑MB `sections` JSON per row. */
    const lessons = lessonsRaw;
    if (lessons.length === 0) continue;

    for (let i = 0; i < lessons.length; i += NEXT_LESSON_CHUNK) {
      const chunk = lessons.slice(i, i + NEXT_LESSON_CHUNK);
      const ids = chunk.map((l) => syntheticPathwayLessonId(pathwayId, l.slug));
      const rows = await prisma.progress.findMany({
        where: { userId, lessonId: { in: ids } },
        select: { lessonId: true, completed: true },
      });
      const byLesson = new Map(rows.map((r) => [r.lessonId, r.completed]));

      for (const l of chunk) {
        const synthetic = syntheticPathwayLessonId(pathwayId, l.slug);
        if (byLesson.get(synthetic) === true) continue;

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
  }

  return null;
}

/**
 * Next incomplete lesson for a single marketing pathway hub (`/us/rn/nclex-rn/lessons/...`).
 */
export async function resolveNextIncompleteMarketingPathwayLesson(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  pathwayId: string,
  lessonsBasePath: string,
): Promise<{ title: string; href: string; slug: string } | null> {
  if (!userId || !entitlement.hasAccess) return null;

  const visible = visiblePathwayIdsForAppLessons(entitlement, learnerPath);
  if (!visible.includes(pathwayId)) return null;

  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);
  const lessonsRaw = await prisma.pathwayLesson.findMany({
    where: { AND: [pathwayWhere, { pathwayId }] },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    take: 500,
    select: {
      id: true,
      title: true,
      slug: true,
      topic: true,
      topicSlug: true,
      bodySystem: true,
      previewSectionCount: true,
      seoTitle: true,
      seoDescription: true,
      locale: true,
    },
  });
  const lessons = lessonsRaw;
  if (lessons.length === 0) return null;

  for (let i = 0; i < lessons.length; i += NEXT_LESSON_CHUNK) {
    const chunk = lessons.slice(i, i + NEXT_LESSON_CHUNK);
    const ids = chunk.map((l) => syntheticPathwayLessonId(pathwayId, l.slug));
    const rows = await prisma.progress.findMany({
      where: { userId, lessonId: { in: ids } },
      select: { lessonId: true, completed: true },
    });
    const byLesson = new Map(rows.map((r) => [r.lessonId, r.completed]));

    for (const l of chunk) {
      const synthetic = syntheticPathwayLessonId(pathwayId, l.slug);
      if (byLesson.get(synthetic) === true) continue;
      const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
      if (!href) continue;
      return { title: l.title, href, slug: l.slug };
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
    const rowsRaw = await prisma.pathwayLesson.findMany({
      where: { AND: [pathwayWhere, { pathwayId }] },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      take: 250,
      select: {
        id: true,
        slug: true,
        title: true,
        topic: true,
        topicSlug: true,
        bodySystem: true,
        previewSectionCount: true,
        seoTitle: true,
        seoDescription: true,
        locale: true,
      },
    });
    const rows = rowsRaw;

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

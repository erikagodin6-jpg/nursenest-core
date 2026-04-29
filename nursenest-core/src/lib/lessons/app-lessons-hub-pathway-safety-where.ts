import type { Prisma } from "@prisma/client";

/**
 * Prisma fragment for `/app/lessons` pathway rows: editorial + structural readiness gates
 * (mirrors the hub page list contract).
 */
export function pathwayLessonAppHubSafetyPrismaWhere(): Prisma.PathwayLessonWhereInput {
  return {
    AND: [
      { title: { not: "" } },
      { slug: { not: "" } },
      { topic: { not: "" } },
      { topicSlug: { not: "" } },
      { previewSectionCount: { gt: 0 } },
      {
        OR: [{ seoDescription: { not: "" } }, { seoTitle: { not: "" } }],
      },
      {
        NOT: [
          { title: { contains: "placeholder", mode: "insensitive" as const } },
          { title: { contains: "tbd", mode: "insensitive" as const } },
          { slug: { startsWith: "tmp-" } },
          { slug: { startsWith: "draft-" } },
        ],
      },
    ],
  };
}

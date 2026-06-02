import type { ContentStatus, Prisma } from "@prisma/client";
import { contentStatusToDb } from "@/lib/prisma/content-status";

export type AdminContentLessonListQuery = {
  page: number;
  pageSize: number;
  status: ContentStatus | null;
  /** `content_items.tier`: rpn | lvn | rn | np | allied */
  tier: string | null;
  /** CA | US | both → regionScope */
  country: "CA" | "US" | "both" | null;
  /** Matches category or body_system (case-insensitive contains) */
  topicDomain: string | null;
  /** Title or slug contains */
  search: string | null;
};

export function buildContentLessonWhere(q: AdminContentLessonListQuery): Prisma.ContentItemWhereInput {
  const and: Prisma.ContentItemWhereInput[] = [{ type: "lesson" }];

  if (q.status) {
    and.push({ status: contentStatusToDb(q.status) });
  }

  if (q.tier) {
    and.push({ tier: q.tier });
  }

  if (q.country === "CA") {
    and.push({ regionScope: "CA_ONLY" });
  } else if (q.country === "US") {
    and.push({ regionScope: "US_ONLY" });
  } else if (q.country === "both") {
    and.push({ regionScope: "BOTH" });
  }

  if (q.topicDomain?.trim()) {
    const t = q.topicDomain.trim();
    and.push({
      OR: [
        { category: { contains: t, mode: "insensitive" } },
        { bodySystem: { contains: t, mode: "insensitive" } },
      ],
    });
  }

  if (q.search?.trim()) {
    const s = q.search.trim();
    and.push({
      OR: [
        { title: { contains: s, mode: "insensitive" } },
        { slug: { contains: s, mode: "insensitive" } },
      ],
    });
  }

  return { AND: and };
}

export function tierDbToPathwayLabel(tier: string | null | undefined): string {
  switch ((tier ?? "").toLowerCase()) {
    case "rpn":
      return "RPN";
    case "lvn":
    case "lvn_lpn":
      return "LPN/LVN";
    case "rn":
      return "RN";
    case "np":
      return "NP";
    case "allied":
      return "Allied";
    default:
      return tier?.length ? tier : "—";
  }
}

export function regionScopeToCountryLabel(scope: string | null | undefined): string {
  switch (scope) {
    case "CA_ONLY":
      return "CA";
    case "US_ONLY":
      return "US";
    case "BOTH":
      return "Both";
    default:
      return scope?.length ? scope : "—";
  }
}

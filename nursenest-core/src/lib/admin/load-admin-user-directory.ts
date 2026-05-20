import { Prisma, TierCode, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type AdminUserDirectoryFilters = {
  paid: "all" | "paid" | "unpaid";
  /** `User.targetExamPathwayId` exact match */
  pathwayId: string | null;
  /** `User.tier` */
  tier: TierCode | null;
  /** User.updatedAt older than N days */
  inactiveDays: number | null;
  /** Has at least one topic stat with wrong activity */
  weakTopicsOnly: boolean;
  /** Alias of inactiveDays for UX copy — same filter on `updatedAt` */
  noRecentActivityDays: number | null;
};

export type AdminUserDirectoryRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  country: string;
  tier: string;
  trialStatus: string;
  targetExamPathwayId: string | null;
  updatedAt: string;
  paidSubscriptionActive: boolean;
  weakTopicSignal: boolean;
};

const PAGE_SIZE = 25;

const ACTIVE_SUB = ["ACTIVE", "GRACE"] as const;

function buildWhere(f: AdminUserDirectoryFilters): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [{ role: UserRole.LEARNER }];

  if (f.pathwayId?.trim()) {
    and.push({ targetExamPathwayId: f.pathwayId.trim() });
  }
  if (f.tier) {
    and.push({ tier: f.tier });
  }
  const inactiveDays = f.inactiveDays ?? f.noRecentActivityDays;
  if (inactiveDays != null && inactiveDays > 0) {
    const cutoff = new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000);
    and.push({ updatedAt: { lt: cutoff } });
  }
  if (f.weakTopicsOnly) {
    and.push({
      topicStats: {
        some: {
          OR: [{ wrongStreak: { gte: 1 } }, { wrongCount: { gt: 0 } }],
        },
      },
    });
  }
  if (f.paid === "paid") {
    and.push({ subscriptions: { some: { status: { in: [...ACTIVE_SUB] } } } });
  } else if (f.paid === "unpaid") {
    and.push({ NOT: { subscriptions: { some: { status: { in: [...ACTIVE_SUB] } } } } });
  }

  return { AND: and };
}

export async function loadAdminUserDirectory(
  filters: AdminUserDirectoryFilters,
  cursor: string | null,
): Promise<{ rows: AdminUserDirectoryRow[]; nextCursor: string | null }> {
  if (!isDatabaseUrlConfigured()) {
    return { rows: [], nextCursor: null };
  }

  try {
    const where = buildWhere(filters);
    const rows = await prisma.user.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: PAGE_SIZE + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        country: true,
        tier: true,
        trialStatus: true,
        targetExamPathwayId: true,
        updatedAt: true,
        subscriptions: {
          where: { status: { in: [...ACTIVE_SUB] } },
          take: 1,
          select: { id: true },
        },
        topicStats: {
          where: {
            OR: [{ wrongStreak: { gte: 1 } }, { wrongCount: { gt: 0 } }],
          },
          take: 1,
          select: { id: true },
        },
      },
    });

    const hasMore = rows.length > PAGE_SIZE;
    const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
    const nextCursor = hasMore ? page[page.length - 1]?.id ?? null : null;

    return {
      rows: page.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        country: u.country,
        tier: u.tier,
        trialStatus: u.trialStatus,
        targetExamPathwayId: u.targetExamPathwayId,
        updatedAt: u.updatedAt.toISOString(),
        paidSubscriptionActive: u.subscriptions.length > 0,
        weakTopicSignal: u.topicStats.length > 0,
      })),
      nextCursor,
    };
  } catch {
    return { rows: [], nextCursor: null };
  }
}

export const ADMIN_USER_DIRECTORY_PAGE_SIZE = PAGE_SIZE;

/** Stable query string for pagination links (excludes `after`). */
export function adminUserDirectoryFilterQueryString(f: AdminUserDirectoryFilters): string {
  const sp = new URLSearchParams();
  if (f.paid !== "all") sp.set("paid", f.paid);
  if (f.pathwayId?.trim()) sp.set("pathway", f.pathwayId.trim());
  if (f.tier) sp.set("tier", f.tier);
  if (f.inactiveDays != null) sp.set("inactive", String(f.inactiveDays));
  if (f.weakTopicsOnly) sp.set("weak", "1");
  return sp.toString();
}

export function parseAdminUserDirectoryFilters(raw: {
  paid?: string;
  pathway?: string;
  tier?: string;
  inactive?: string;
  weak?: string;
  after?: string;
}): { filters: AdminUserDirectoryFilters; cursor: string | null } {
  const paid: AdminUserDirectoryFilters["paid"] =
    raw.paid === "paid" || raw.paid === "unpaid" ? raw.paid : "all";
  const pathwayId = raw.pathway?.trim() || null;
  let tier: TierCode | null = null;
  if (raw.tier && (Object.values(TierCode) as string[]).includes(raw.tier)) {
    tier = raw.tier as TierCode;
  }
  const inactiveRaw = raw.inactive?.trim();
  const inactiveDays =
    inactiveRaw && /^\d+$/.test(inactiveRaw)
      ? Math.min(3650, Math.max(1, Number.parseInt(inactiveRaw, 10)))
      : null;
  const weakTopicsOnly = raw.weak === "1";
  const cursor = raw.after?.trim() || null;
  return {
    filters: {
      paid,
      pathwayId,
      tier,
      inactiveDays,
      weakTopicsOnly,
      noRecentActivityDays: null,
    },
    cursor,
  };
}

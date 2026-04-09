import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type AdminUserSearchRow = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  role: string;
  country: string;
  tier: string;
  trialStatus: string;
  createdAt: string;
};

const MAX_RESULTS = 25;
const MIN_QUERY_LEN = 2;

function looksLikeCuid(s: string): boolean {
  return /^c[a-z0-9]{20,}$/i.test(s.trim());
}

/**
 * Admin support search: email / name / username substring, or exact id when cuid-shaped.
 */
export async function loadAdminUserSearch(rawQuery: string): Promise<AdminUserSearchRow[]> {
  const q = rawQuery.trim();
  if (!isDatabaseUrlConfigured() || q.length < MIN_QUERY_LEN) {
    return [];
  }

  try {
    const or: Prisma.UserWhereInput[] = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
    ];
    if (looksLikeCuid(q)) {
      or.unshift({ id: q });
      or.splice(1, 0, { id: { startsWith: q } });
    }

    const rows = await prisma.user.findMany({
      where: { OR: or },
      orderBy: { updatedAt: "desc" },
      take: MAX_RESULTS,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        country: true,
        tier: true,
        trialStatus: true,
        createdAt: true,
      },
    });

    return rows.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

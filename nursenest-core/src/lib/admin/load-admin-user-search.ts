import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";

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

  return withDatabaseFallback(
    async () => {
      const or: Parameters<typeof prisma.user.findMany>[0] extends { where?: infer W } ? W["OR"] : never = [];

      if (looksLikeCuid(q)) {
        or.push({ id: q });
        or.push({ id: { startsWith: q } });
      }
      or.push({ email: { contains: q, mode: "insensitive" } });
      or.push({ name: { contains: q, mode: "insensitive" } });
      or.push({ username: { contains: q, mode: "insensitive" } });

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
    },
    [],
  );
}

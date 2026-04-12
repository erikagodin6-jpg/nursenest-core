import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";

const DEFAULT_TAKE = 50;

export type AdminBackgroundJobRow = {
  id: string;
  type: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  lastError: string | null;
  scheduledFor: Date;
  createdAt: Date;
  updatedAt: Date;
};

/** Server-side snapshot for admin queue UI — no polling; refresh the page to update. */
export async function loadAdminRecentBackgroundJobs(
  take = DEFAULT_TAKE,
): Promise<{ jobs: AdminBackgroundJobRow[]; degraded: boolean }> {
  const cap = Math.min(100, Math.max(1, Math.floor(take)));
  return withDatabaseFallback(
    async () => {
      const jobs = await prisma.backgroundJob.findMany({
        orderBy: { createdAt: "desc" },
        take: cap,
        select: {
          id: true,
          type: true,
          status: true,
          attempts: true,
          maxAttempts: true,
          lastError: true,
          scheduledFor: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return { jobs, degraded: false };
    },
    { jobs: [], degraded: true },
  );
}

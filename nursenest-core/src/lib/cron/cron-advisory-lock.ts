import { prisma } from "@/lib/db";

/** Must stay stable across deploys — used in Postgres advisory lock API. */
export const CronAdvisoryLock = {
  /** Legacy: `process-pending` worker (blocking lock). */
  backgroundJobs: 928_374_651,
  blogBatchSchedule: 928_374_652,
  stripeReconcile: 928_374_653,
  contentCompletion: 928_374_654,
} as const;

/**
 * Non-blocking try-lock. Use to skip overlapping cron invocations (idempotent no-op).
 * Returns true if lock acquired.
 */
export async function tryAcquireCronAdvisoryLock(lockId: number): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ ok: boolean }[]>`
    SELECT pg_try_advisory_lock(${lockId}) AS ok
  `;
  return Boolean(rows[0]?.ok);
}

export async function releaseCronAdvisoryLock(lockId: number): Promise<void> {
  await prisma.$executeRaw`SELECT pg_advisory_unlock(${lockId})`;
}

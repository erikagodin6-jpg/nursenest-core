import { pool } from "./storage";

let leaseTableReady = false;

/** Lock names used across instances (see entitlement-api, qbank-scheduler, reporting-scheduler). */
export const SCHEDULER_LOCK_NAMES = {
  ENTITLEMENT_QBANK: "entitlement_qbank_scheduler",
  STANDALONE_QBANK: "standalone_qbank_scheduler",
  REPORTING_WEEKLY: "reporting_weekly",
  REPORTING_SEARCH_SNAPSHOT: "reporting_search_snapshot",
} as const;

async function ensureSchedulerLeaseTable(): Promise<void> {
  if (leaseTableReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS scheduler_lease (
      lock_name text PRIMARY KEY,
      locked_until timestamptz NOT NULL DEFAULT '1970-01-01T00:00:00Z'
    );
  `);

  await pool.query(
    `
    INSERT INTO scheduler_lease (lock_name, locked_until) VALUES
      ($1, '1970-01-01T00:00:00Z'),
      ($2, '1970-01-01T00:00:00Z'),
      ($3, '1970-01-01T00:00:00Z'),
      ($4, '1970-01-01T00:00:00Z')
    ON CONFLICT (lock_name) DO NOTHING
    `,
    [
      SCHEDULER_LOCK_NAMES.ENTITLEMENT_QBANK,
      SCHEDULER_LOCK_NAMES.STANDALONE_QBANK,
      SCHEDULER_LOCK_NAMES.REPORTING_WEEKLY,
      SCHEDULER_LOCK_NAMES.REPORTING_SEARCH_SNAPSHOT,
    ],
  );

  leaseTableReady = true;
}

/**
 * Multi-instance safe: only one process holds the lease until TTL expires.
 */
export async function tryAcquireSchedulerLease(lockName: string, ttlSeconds: number): Promise<boolean> {
  await ensureSchedulerLeaseTable();
  const ttl = Math.min(Math.max(Math.floor(ttlSeconds), 30), 3600);
  const r = await pool.query(
    `UPDATE scheduler_lease
     SET locked_until = NOW() + ($2::int * interval '1 second')
     WHERE lock_name = $1 AND locked_until < NOW()
     RETURNING lock_name`,
    [lockName, ttl],
  );
  return (r.rowCount ?? 0) > 0;
}

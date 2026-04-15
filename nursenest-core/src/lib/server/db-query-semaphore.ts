import "server-only";

/**
 * Bounds concurrent Prisma operations per Node instance to reduce pool pressure under spikes.
 * Tunable via `NN_DB_MAX_CONCURRENT_QUERIES` (default 22). Queues waiters — does not reject paid reads.
 */
import { safeServerLog } from "@/lib/observability/safe-server-log";

function maxConcurrent(): number {
  const raw = process.env.NN_DB_MAX_CONCURRENT_QUERIES?.trim();
  const n = raw ? Number(raw) : 22;
  if (!Number.isFinite(n) || n < 4) return 22;
  return Math.min(128, Math.floor(n));
}

export function createDbQuerySemaphore() {
  const cap = maxConcurrent();
  let active = 0;
  const queue: (() => void)[] = [];
  let longWaitLogged = false;

  async function acquire(): Promise<void> {
    if (active < cap) {
      active++;
      return;
    }
    const waitStart = Date.now();
    await new Promise<void>((resolve) => {
      queue.push(resolve);
    });
    const waited = Date.now() - waitStart;
    if (waited > 2000 && !longWaitLogged) {
      longWaitLogged = true;
      safeServerLog("resilience", "db_query_queue_wait", { waitedMs: waited, cap });
    }
    active++;
  }

  function release(): void {
    active--;
    const next = queue.shift();
    if (next) next();
  }

  return { acquire, release, cap };
}

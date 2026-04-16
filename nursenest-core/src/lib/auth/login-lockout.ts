/**
 * Progressive login lockout after failed credential attempts.
 *
 * - **Distributed (production + DB):** rows in `AppLoginLockout` — shared across horizontally scaled instances.
 * - **In-memory:** per-process `Map` when distributed mode is off (local dev / tests).
 *
 * Prisma is loaded only via dynamic `import("@/lib/db")` on the PG path so unit tests can run
 * without pulling the `server-only` DB module when distributed mode is off.
 */
import { createHash } from "node:crypto";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

const MAX_ATTEMPTS_BEFORE_LOCK = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

type LockState = {
  failures: number;
  lockedUntil: number | null;
  lastFailure: number;
};

const lockMap = new Map<string, LockState>();

let loginLockoutFalseIgnoredInProdLogged = false;
let loginLockoutPgErrorLogged = false;

function logLoginLockoutPgErrorOnce(context: string, err: unknown): void {
  if (loginLockoutPgErrorLogged) return;
  loginLockoutPgErrorLogged = true;
  const msg = err instanceof Error ? err.message : String(err);
  safeServerLogCritical(
    "auth",
    "login_lockout_pg_error",
    { context, detail: msg.slice(0, 200) },
    err instanceof Error ? err : new Error(msg),
    { flow: "login_lockout" },
  );
}

function hashKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

/**
 * Postgres-backed lockout when `DATABASE_URL` is set. In production, `LOGIN_LOCKOUT_DISTRIBUTED=false`
 * cannot re-enable per-process memory.
 */
export function isDistributedLoginLockoutEnabled(): boolean {
  if (!isDatabaseUrlConfigured()) return false;
  if (process.env.NODE_ENV === "test") return false;
  if (process.env.LOGIN_LOCKOUT_DISTRIBUTED === "true") return true;
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.LOGIN_LOCKOUT_DISTRIBUTED === "false" && !loginLockoutFalseIgnoredInProdLogged) {
    loginLockoutFalseIgnoredInProdLogged = true;
    safeServerLogCritical(
      "auth",
      "login_lockout_distributed_false_ignored_in_production",
      { hint: "Per-process lockout is disabled when DATABASE_URL is set." },
      new Error("LOGIN_LOCKOUT_DISTRIBUTED=false ignored in production"),
    );
  }
  return true;
}

function allowMemoryLoginLockout(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return !isDistributedLoginLockoutEnabled();
}

if (allowMemoryLoginLockout()) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, state] of lockMap) {
      if (now - state.lastFailure > LOCKOUT_DURATION_MS * 2) {
        lockMap.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS).unref();
}

function recordLoginFailureMemory(key: string): void {
  const existing = lockMap.get(key);
  const now = Date.now();

  if (!existing) {
    lockMap.set(key, { failures: 1, lockedUntil: null, lastFailure: now });
    return;
  }

  if (existing.lockedUntil && now > existing.lockedUntil) {
    lockMap.set(key, { failures: 1, lockedUntil: null, lastFailure: now });
    return;
  }

  existing.failures += 1;
  existing.lastFailure = now;

  if (existing.failures >= MAX_ATTEMPTS_BEFORE_LOCK) {
    existing.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
}

async function recordLoginFailurePg(key: string): Promise<void> {
  const { prisma } = await import("@/lib/db");
  const id = hashKey(key);
  const now = new Date();
  await prisma.$transaction(async (tx) => {
    const row = await tx.appLoginLockout.findUnique({ where: { id } });
    if (!row) {
      await tx.appLoginLockout.create({
        data: { id, failures: 1, lockedUntil: null, lastFailureAt: now },
      });
      return;
    }

    if (row.lockedUntil && row.lockedUntil > now) {
      await tx.appLoginLockout.update({
        where: { id },
        data: { lastFailureAt: now },
      });
      return;
    }

    if (row.lockedUntil && row.lockedUntil <= now) {
      await tx.appLoginLockout.update({
        where: { id },
        data: {
          failures: 1,
          lockedUntil: null,
          lastFailureAt: now,
        },
      });
      return;
    }

    const failures = row.failures + 1;
    const lockedUntil =
      failures >= MAX_ATTEMPTS_BEFORE_LOCK ? new Date(now.getTime() + LOCKOUT_DURATION_MS) : null;

    await tx.appLoginLockout.update({
      where: { id },
      data: {
        failures,
        lastFailureAt: now,
        lockedUntil,
      },
    });
  });
}

export async function recordLoginFailure(key: string): Promise<void> {
  if (allowMemoryLoginLockout()) {
    recordLoginFailureMemory(key);
    return;
  }
  if (!isDistributedLoginLockoutEnabled()) {
    return;
  }
  try {
    await recordLoginFailurePg(key);
  } catch (e) {
    logLoginLockoutPgErrorOnce("recordLoginFailure", e);
  }
}

export async function clearLoginFailures(key: string): Promise<void> {
  if (allowMemoryLoginLockout()) {
    lockMap.delete(key);
    return;
  }
  if (!isDistributedLoginLockoutEnabled()) {
    return;
  }
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.appLoginLockout.deleteMany({ where: { id: hashKey(key) } });
  } catch (e) {
    logLoginLockoutPgErrorOnce("clearLoginFailures", e);
  }
}

export async function isLoginLocked(key: string): Promise<{ locked: boolean; remainingMs: number }> {
  if (allowMemoryLoginLockout()) {
    const state = lockMap.get(key);
    if (!state?.lockedUntil) return { locked: false, remainingMs: 0 };
    const now = Date.now();
    if (now >= state.lockedUntil) {
      lockMap.delete(key);
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: state.lockedUntil - now };
  }
  if (!isDistributedLoginLockoutEnabled()) {
    return { locked: false, remainingMs: 0 };
  }
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.appLoginLockout.findUnique({ where: { id: hashKey(key) } });
    if (!row?.lockedUntil) return { locked: false, remainingMs: 0 };
    const now = new Date();
    if (row.lockedUntil <= now) {
      await prisma.appLoginLockout.deleteMany({ where: { id: hashKey(key) } });
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: row.lockedUntil.getTime() - now.getTime() };
  } catch (e) {
    logLoginLockoutPgErrorOnce("isLoginLocked", e);
    return { locked: false, remainingMs: 0 };
  }
}

export async function getFailureCount(key: string): Promise<number> {
  if (allowMemoryLoginLockout()) {
    return lockMap.get(key)?.failures ?? 0;
  }
  if (!isDistributedLoginLockoutEnabled()) {
    return 0;
  }
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.appLoginLockout.findUnique({
      where: { id: hashKey(key) },
      select: { failures: true, lockedUntil: true },
    });
    if (!row) return 0;
    const now = new Date();
    if (row.lockedUntil && row.lockedUntil <= now) return row.failures;
    return row.failures;
  } catch (e) {
    logLoginLockoutPgErrorOnce("getFailureCount", e);
    return 0;
  }
}

export const CAPTCHA_THRESHOLD = 3;

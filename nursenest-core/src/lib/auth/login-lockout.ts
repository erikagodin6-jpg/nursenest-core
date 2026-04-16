/**
 * Progressive login lockout after failed credential attempts.
 *
 * - **Distributed (production + DB):** rows in `AppLoginLockout` — shared across horizontally scaled instances.
 * - **In-memory:** per-process `Map` when distributed mode is off (local dev / tests).
 */
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const MAX_ATTEMPTS_BEFORE_LOCK = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

type LockState = {
  failures: number;
  lockedUntil: number | null;
  lastFailure: number;
};

const lockMap = new Map<string, LockState>();

setInterval(() => {
  const now = Date.now();
  for (const [key, state] of lockMap) {
    if (now - state.lastFailure > LOCKOUT_DURATION_MS * 2) {
      lockMap.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

function hashKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

/** Production default: on when DB is configured; set LOGIN_LOCKOUT_DISTRIBUTED=false to force in-memory (single-instance dev only). */
export function isDistributedLoginLockoutEnabled(): boolean {
  if (process.env.LOGIN_LOCKOUT_DISTRIBUTED === "false") return false;
  if (process.env.LOGIN_LOCKOUT_DISTRIBUTED === "true") return true;
  if (process.env.NODE_ENV === "test") return false;
  return process.env.NODE_ENV === "production" && isDatabaseUrlConfigured();
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
  if (!isDistributedLoginLockoutEnabled()) {
    recordLoginFailureMemory(key);
    return;
  }
  try {
    await recordLoginFailurePg(key);
  } catch {
    recordLoginFailureMemory(key);
  }
}

export async function clearLoginFailures(key: string): Promise<void> {
  if (!isDistributedLoginLockoutEnabled()) {
    lockMap.delete(key);
    return;
  }
  try {
    await prisma.appLoginLockout.deleteMany({ where: { id: hashKey(key) } });
  } catch {
    lockMap.delete(key);
  }
}

export async function isLoginLocked(key: string): Promise<{ locked: boolean; remainingMs: number }> {
  if (!isDistributedLoginLockoutEnabled()) {
    const state = lockMap.get(key);
    if (!state?.lockedUntil) return { locked: false, remainingMs: 0 };
    const now = Date.now();
    if (now >= state.lockedUntil) {
      lockMap.delete(key);
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: state.lockedUntil - now };
  }
  try {
    const row = await prisma.appLoginLockout.findUnique({ where: { id: hashKey(key) } });
    if (!row?.lockedUntil) return { locked: false, remainingMs: 0 };
    const now = new Date();
    if (row.lockedUntil <= now) {
      await prisma.appLoginLockout.deleteMany({ where: { id: hashKey(key) } });
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: row.lockedUntil.getTime() - now.getTime() };
  } catch {
    const state = lockMap.get(key);
    if (!state?.lockedUntil) return { locked: false, remainingMs: 0 };
    const now = Date.now();
    if (now >= state.lockedUntil) {
      lockMap.delete(key);
      return { locked: false, remainingMs: 0 };
    }
    return { locked: true, remainingMs: state.lockedUntil - now };
  }
}

export async function getFailureCount(key: string): Promise<number> {
  if (!isDistributedLoginLockoutEnabled()) {
    return lockMap.get(key)?.failures ?? 0;
  }
  try {
    const row = await prisma.appLoginLockout.findUnique({
      where: { id: hashKey(key) },
      select: { failures: true, lockedUntil: true },
    });
    if (!row) return 0;
    const now = new Date();
    if (row.lockedUntil && row.lockedUntil <= now) return row.failures;
    return row.failures;
  } catch {
    return lockMap.get(key)?.failures ?? 0;
  }
}

export const CAPTCHA_THRESHOLD = 3;

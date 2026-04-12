/**
 * Progressive login lockout: tracks failed attempts and returns whether the
 * account/IP is temporarily locked. In-memory (per instance), same trade-off
 * as the existing rate limiter.
 */

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

export function recordLoginFailure(key: string): void {
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

export function clearLoginFailures(key: string): void {
  lockMap.delete(key);
}

export function isLoginLocked(key: string): { locked: boolean; remainingMs: number } {
  const state = lockMap.get(key);
  if (!state?.lockedUntil) return { locked: false, remainingMs: 0 };

  const now = Date.now();
  if (now >= state.lockedUntil) {
    lockMap.delete(key);
    return { locked: false, remainingMs: 0 };
  }

  return { locked: true, remainingMs: state.lockedUntil - now };
}

export function getFailureCount(key: string): number {
  return lockMap.get(key)?.failures ?? 0;
}

export const CAPTCHA_THRESHOLD = 3;

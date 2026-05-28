/**
 * Phase 5 — Subscription Resilience
 * 72-hour entitlement grace cache.
 *
 * When Stripe or the database is unavailable, paying learners must not be locked out.
 * This module persists last-known entitlements to the DB and serves them during outages
 * with a 72-hour grace window before downgrading to free tier.
 */

import { pool } from "./storage";

export interface EntitlementSnapshot {
  userId: string;
  plan: string;
  tier: string;
  permissions: string[];
  expiresAt: string | null;
  snapshotAt: string;
  gracePeriodEndsAt: string;
}

const GRACE_PERIOD_MS = 72 * 60 * 60 * 1000; // 72 hours
const IN_MEMORY_TTL_MS = 5 * 60 * 1000;       // 5 minutes in-memory before re-checking DB

const memCache = new Map<string, { snapshot: EntitlementSnapshot; fetchedAt: number }>();

export async function ensureEntitlementGraceTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entitlement_grace_snapshots (
        user_id varchar PRIMARY KEY,
        plan text NOT NULL DEFAULT 'free',
        tier text NOT NULL DEFAULT 'free',
        permissions text[] NOT NULL DEFAULT '{}'::text[],
        expires_at timestamptz,
        snapshot_at timestamptz NOT NULL DEFAULT NOW(),
        grace_period_ends_at timestamptz NOT NULL,
        stripe_customer_id text,
        stripe_subscription_id text,
        updated_at timestamptz NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_entitlement_grace_user ON entitlement_grace_snapshots(user_id);
      CREATE INDEX IF NOT EXISTS idx_entitlement_grace_expires ON entitlement_grace_snapshots(grace_period_ends_at);
    `);
  } catch (e: any) {
    console.error("[EntitlementGrace] Table init error:", e.message);
  }
}

export async function saveEntitlementSnapshot(
  userId: string,
  plan: string,
  tier: string,
  permissions: string[],
  expiresAt: string | null,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<void> {
  const gracePeriodEndsAt = new Date(Date.now() + GRACE_PERIOD_MS).toISOString();
  try {
    await pool.query(
      `INSERT INTO entitlement_grace_snapshots
         (user_id, plan, tier, permissions, expires_at, snapshot_at, grace_period_ends_at, stripe_customer_id, stripe_subscription_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         plan = EXCLUDED.plan,
         tier = EXCLUDED.tier,
         permissions = EXCLUDED.permissions,
         expires_at = EXCLUDED.expires_at,
         snapshot_at = NOW(),
         grace_period_ends_at = EXCLUDED.grace_period_ends_at,
         stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, entitlement_grace_snapshots.stripe_customer_id),
         stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, entitlement_grace_snapshots.stripe_subscription_id),
         updated_at = NOW()`,
      [userId, plan, tier, permissions, expiresAt, gracePeriodEndsAt, stripeCustomerId || null, stripeSubscriptionId || null]
    );
    memCache.set(userId, {
      snapshot: { userId, plan, tier, permissions, expiresAt, snapshotAt: new Date().toISOString(), gracePeriodEndsAt },
      fetchedAt: Date.now(),
    });
  } catch (e: any) {
    console.error("[EntitlementGrace] Save error:", e.message);
  }
}

export async function getEntitlementSnapshot(userId: string): Promise<EntitlementSnapshot | null> {
  // Check in-memory cache first
  const memEntry = memCache.get(userId);
  if (memEntry && Date.now() - memEntry.fetchedAt < IN_MEMORY_TTL_MS) {
    return memEntry.snapshot;
  }

  try {
    const { rows } = await pool.query(
      `SELECT user_id, plan, tier, permissions, expires_at, snapshot_at, grace_period_ends_at
       FROM entitlement_grace_snapshots WHERE user_id = $1`,
      [userId]
    );
    if (!rows.length) return null;
    const row = rows[0];
    const snapshot: EntitlementSnapshot = {
      userId: row.user_id,
      plan: row.plan,
      tier: row.tier,
      permissions: row.permissions || [],
      expiresAt: row.expires_at ? row.expires_at.toISOString() : null,
      snapshotAt: row.snapshot_at.toISOString(),
      gracePeriodEndsAt: row.grace_period_ends_at.toISOString(),
    };
    memCache.set(userId, { snapshot, fetchedAt: Date.now() });
    return snapshot;
  } catch {
    return null;
  }
}

export function isGraceActive(snapshot: EntitlementSnapshot): boolean {
  return Date.now() < new Date(snapshot.gracePeriodEndsAt).getTime();
}

export function graceHoursRemaining(snapshot: EntitlementSnapshot): number {
  const ms = new Date(snapshot.gracePeriodEndsAt).getTime() - Date.now();
  return Math.max(0, Math.round(ms / (60 * 60 * 1000)));
}

/**
 * Resolve entitlement during a Stripe or DB outage.
 * Returns: the grace snapshot if still valid, or free-tier fallback.
 */
export async function resolveEntitlementWithGrace(
  userId: string,
  stripeAvailable: boolean,
  dbAvailable: boolean
): Promise<{ tier: string; plan: string; permissions: string[]; source: "live" | "grace" | "free"; graceHoursLeft?: number }> {
  if (stripeAvailable && dbAvailable) {
    return { tier: "free", plan: "free", permissions: [], source: "live" };
  }

  const snapshot = await getEntitlementSnapshot(userId).catch(() => null);
  if (snapshot && isGraceActive(snapshot)) {
    return {
      tier: snapshot.tier,
      plan: snapshot.plan,
      permissions: snapshot.permissions,
      source: "grace",
      graceHoursLeft: graceHoursRemaining(snapshot),
    };
  }

  return { tier: "free", plan: "free", permissions: [], source: "free" };
}

export function clearEntitlementGraceCache(userId?: string): void {
  if (userId) memCache.delete(userId);
  else memCache.clear();
}

export async function expireStaleGraceSnapshots(): Promise<number> {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM entitlement_grace_snapshots WHERE grace_period_ends_at < NOW() AND tier = 'free'`
    );
    return rowCount || 0;
  } catch {
    return 0;
  }
}

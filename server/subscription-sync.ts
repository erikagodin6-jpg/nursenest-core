import { pool } from "./storage";
import type { EntitlementEventType } from "@shared/schema";

export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email || typeof email !== "string") return null;
  return email.trim().toLowerCase();
}

export async function isWebhookProcessed(eventId: string): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT id, status FROM webhook_events WHERE event_id = $1 LIMIT 1`,
      [eventId]
    );
    if (result.rows.length === 0) return false;
    return result.rows[0].status === "processed";
  } catch (e: any) {
    console.error("[WebhookDedup] Error checking processed:", e.message);
    return false;
  }
}

export async function markWebhookProcessing(
  eventId: string,
  eventType: string,
  userId: string | null,
  payload: any,
  eventTimestamp?: Date
): Promise<boolean> {
  try {
    const result = await pool.query(
      `INSERT INTO webhook_events (event_id, event_type, source, status, user_id, payload, event_timestamp, created_at)
       VALUES ($1, $2, 'stripe', 'processing', $3, $4, $5, NOW())
       ON CONFLICT (event_id) DO UPDATE
         SET status = 'processing', processed_at = NULL, error_message = NULL
         WHERE webhook_events.status IN ('failed')
            OR (webhook_events.status = 'processing' AND webhook_events.created_at < NOW() - INTERVAL '5 minutes')
       RETURNING id`,
      [eventId, eventType, userId, JSON.stringify(payload || {}), eventTimestamp || null]
    );
    return result.rows.length > 0;
  } catch (e: any) {
    console.error("[WebhookDedup] Error marking processing:", e.message);
    return false;
  }
}

export async function markWebhookProcessed(
  eventId: string,
  result: any,
  errorMessage?: string
): Promise<void> {
  try {
    await pool.query(
      `UPDATE webhook_events SET status = $1, processing_result = $2, error_message = $3, processed_at = NOW()
       WHERE event_id = $4`,
      [errorMessage ? "failed" : "processed", JSON.stringify(result || {}), errorMessage || null, eventId]
    );
  } catch (e: any) {
    console.error("[WebhookDedup] Error marking processed:", e.message);
  }
}

export async function isEventStale(
  stripeSubscriptionId: string,
  eventTimestamp: number
): Promise<boolean> {
  try {
    const result = await pool.query(
      `SELECT updated_at FROM subscriptions WHERE stripe_subscription_id = $1 LIMIT 1`,
      [stripeSubscriptionId]
    );
    if (result.rows.length === 0) return false;
    const lastUpdate = new Date(result.rows[0].updated_at).getTime();
    return eventTimestamp * 1000 < lastUpdate;
  } catch (e: any) {
    console.error("[WebhookDedup] Error checking staleness:", e.message);
    return false;
  }
}

export async function emitEntitlementEvent(
  userId: string,
  eventType: EntitlementEventType,
  opts: {
    tier?: string;
    previousTier?: string;
    accessSource?: string;
    stripeEventId?: string;
    subscriptionId?: string;
    metadata?: Record<string, any>;
  } = {}
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO entitlement_events (user_id, event_type, tier, previous_tier, access_source, stripe_event_id, subscription_id, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        userId,
        eventType,
        opts.tier || null,
        opts.previousTier || null,
        opts.accessSource || null,
        opts.stripeEventId || null,
        opts.subscriptionId || null,
        JSON.stringify(opts.metadata || {}),
      ]
    );
  } catch (e: any) {
    console.error("[EntitlementEvent] Failed to emit:", e.message);
  }
}

interface UpsertSubscriptionData {
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  planId?: string;
  planName?: string;
  tier: string;
  billingInterval?: string;
  status: string;
  purchaseSource?: string;
  expiresAt?: Date | null;
  renewsAt?: Date | null;
  canceledAt?: Date | null;
  trialStart?: Date | null;
  trialEnd?: Date | null;
  gracePeriodUntil?: Date | null;
  isLifetime?: boolean;
  currency?: string;
  amount?: number;
  metadata?: Record<string, any>;
}

export async function upsertSubscription(data: UpsertSubscriptionData): Promise<string> {
  try {
    if (data.stripeSubscriptionId) {
      const result = await pool.query(
        `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, plan_id, plan_name,
          tier, billing_interval, status, purchase_source, active_from, expires_at, renews_at, canceled_at,
          trial_start, trial_end, grace_period_until, last_verified_at, is_lifetime, currency, amount, metadata,
          created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11, $12, $13, $14, $15, NOW(), $16, $17, $18, $19, NOW(), NOW())
         ON CONFLICT (stripe_subscription_id) DO UPDATE SET
          user_id = $1,
          stripe_customer_id = COALESCE($3, subscriptions.stripe_customer_id),
          plan_id = COALESCE($4, subscriptions.plan_id),
          plan_name = COALESCE($5, subscriptions.plan_name),
          tier = $6,
          billing_interval = COALESCE($7, subscriptions.billing_interval),
          status = $8,
          purchase_source = COALESCE($9, subscriptions.purchase_source),
          expires_at = $10,
          renews_at = $11,
          canceled_at = $12,
          trial_start = COALESCE($13, subscriptions.trial_start),
          trial_end = COALESCE($14, subscriptions.trial_end),
          grace_period_until = $15,
          is_lifetime = COALESCE($16, subscriptions.is_lifetime),
          currency = COALESCE($17, subscriptions.currency),
          amount = COALESCE($18, subscriptions.amount),
          metadata = COALESCE($19, subscriptions.metadata),
          last_verified_at = NOW(),
          updated_at = NOW()
         RETURNING id`,
        [
          data.userId, data.stripeSubscriptionId, data.stripeCustomerId || null,
          data.planId || null, data.planName || null, data.tier,
          data.billingInterval || null, data.status, data.purchaseSource || "web",
          data.expiresAt !== undefined ? data.expiresAt : null,
          data.renewsAt !== undefined ? data.renewsAt : null,
          data.canceledAt !== undefined ? data.canceledAt : null,
          data.trialStart || null, data.trialEnd || null,
          data.gracePeriodUntil !== undefined ? data.gracePeriodUntil : null,
          data.isLifetime ?? false, data.currency || "usd", data.amount ?? null,
          JSON.stringify(data.metadata || {}),
        ]
      );
      return result.rows[0].id;
    }

    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, stripe_subscription_id, stripe_customer_id, plan_id, plan_name,
        tier, billing_interval, status, purchase_source, active_from, expires_at, renews_at, canceled_at,
        trial_start, trial_end, grace_period_until, last_verified_at, is_lifetime, currency, amount, metadata,
        created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11, $12, $13, $14, $15, NOW(), $16, $17, $18, $19, NOW(), NOW())
       RETURNING id`,
      [
        data.userId, null, data.stripeCustomerId || null,
        data.planId || null, data.planName || null, data.tier,
        data.billingInterval || null, data.status, data.purchaseSource || "web",
        data.expiresAt || null, data.renewsAt || null, data.canceledAt || null,
        data.trialStart || null, data.trialEnd || null, data.gracePeriodUntil || null,
        data.isLifetime ?? false, data.currency || "usd", data.amount ?? null,
        JSON.stringify(data.metadata || {}),
      ]
    );
    return result.rows[0].id;
  } catch (e: any) {
    console.error("[SubscriptionSync] Upsert failed:", e.message);
    throw e;
  }
}

export async function getSubscriptionsByUserId(userId: string): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function getActiveSubscription(userId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status IN ('active', 'trialing')
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

export async function getWebhookEventsByUserId(userId: string, limit = 50): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM webhook_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function getEntitlementEventsByUserId(userId: string, limit = 50): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT * FROM entitlement_events WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function findDuplicateAccounts(email: string): Promise<any[]> {
  const normalized = normalizeEmail(email);
  if (!normalized) return [];
  try {
    const result = await pool.query(
      `SELECT id, username, email, tier, subscription_status, created_at
       FROM users WHERE LOWER(TRIM(email)) = $1
       ORDER BY created_at ASC`,
      [normalized]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function findPotentialDuplicates(): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT LOWER(TRIM(email)) as normalized_email, COUNT(*)::int as count,
              array_agg(id) as user_ids, array_agg(username) as usernames
       FROM users
       WHERE email IS NOT NULL AND TRIM(email) != ''
       GROUP BY LOWER(TRIM(email))
       HAVING COUNT(*) > 1
       ORDER BY count DESC
       LIMIT 100`
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function getUserIdByStripeCustomer(customerId: string): Promise<string | null> {
  try {
    const result = await pool.query(
      `SELECT id FROM users WHERE stripe_customer_id = $1 LIMIT 1`,
      [customerId]
    );
    return result.rows[0]?.id || null;
  } catch {
    return null;
  }
}

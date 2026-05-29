/**
 * Phase 6 — Checkout Resilience
 * Captures checkout intent when Stripe is unavailable.
 * Stores: email, selected plan, country, exam type.
 * Sends a recovery link when Stripe comes back online.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { addAlert } from "./platform-resilience";

export interface CheckoutIntent {
  id: string;
  email: string;
  plan: string;
  tier: string;
  country: string | null;
  examType: string | null;
  locale: string | null;
  referrer: string | null;
  recoveryLinkSent: boolean;
  recoveredAt: string | null;
  createdAt: string;
}

export async function ensureCheckoutIntentTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS checkout_intents (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL,
        plan text NOT NULL,
        tier text NOT NULL DEFAULT 'rn',
        country text,
        exam_type text,
        locale text,
        referrer text,
        stripe_error text,
        recovery_link_sent boolean NOT NULL DEFAULT false,
        recovery_link_sent_at timestamptz,
        recovered_at timestamptz,
        ip_address text,
        user_agent text,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        updated_at timestamptz NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_checkout_intents_email ON checkout_intents(email);
      CREATE INDEX IF NOT EXISTS idx_checkout_intents_unsent ON checkout_intents(recovery_link_sent, created_at) WHERE recovered_at IS NULL;
      CREATE INDEX IF NOT EXISTS idx_checkout_intents_created ON checkout_intents(created_at DESC);
    `);
  } catch (e: any) {
    console.error("[CheckoutIntent] Table init error:", e.message);
  }
}

export async function captureCheckoutIntent(
  email: string,
  plan: string,
  tier: string,
  options: {
    country?: string;
    examType?: string;
    locale?: string;
    referrer?: string;
    stripeError?: string;
    ipAddress?: string;
    userAgent?: string;
  } = {}
): Promise<string | null> {
  try {
    const { rows } = await pool.query(
      `INSERT INTO checkout_intents
         (email, plan, tier, country, exam_type, locale, referrer, stripe_error, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        email.toLowerCase().trim(),
        plan,
        tier,
        options.country || null,
        options.examType || null,
        options.locale || null,
        options.referrer || null,
        options.stripeError || null,
        options.ipAddress || null,
        options.userAgent || null,
      ]
    );
    const id = rows[0]?.id;
    addAlert("warning", "checkout_intent", "Checkout Intent Captured", `User ${email} could not complete checkout — Stripe unavailable. Intent captured.`, "checkout-intent-capture", { email, plan, tier, id });
    return id || null;
  } catch (e: any) {
    console.error("[CheckoutIntent] Capture error:", e.message);
    return null;
  }
}

export async function getPendingCheckoutIntents(limit = 100): Promise<CheckoutIntent[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, plan, tier, country, exam_type, locale, referrer, recovery_link_sent, recovered_at, created_at
       FROM checkout_intents
       WHERE recovered_at IS NULL AND recovery_link_sent = false
       ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return rows.map((r: any) => ({
      id: r.id,
      email: r.email,
      plan: r.plan,
      tier: r.tier,
      country: r.country,
      examType: r.exam_type,
      locale: r.locale,
      referrer: r.referrer,
      recoveryLinkSent: r.recovery_link_sent,
      recoveredAt: r.recovered_at ? r.recovered_at.toISOString() : null,
      createdAt: r.created_at.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function markRecoveryLinkSent(intentId: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE checkout_intents SET recovery_link_sent = true, recovery_link_sent_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [intentId]
    );
  } catch (e: any) {
    console.error("[CheckoutIntent] Mark sent error:", e.message);
  }
}

export async function markCheckoutRecovered(intentId: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE checkout_intents SET recovered_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [intentId]
    );
  } catch (e: any) {
    console.error("[CheckoutIntent] Mark recovered error:", e.message);
  }
}

export function registerCheckoutIntentRoutes(app: Express): void {
  // Public endpoint: capture intent when checkout fails
  app.post("/api/checkout/intent-capture", async (req: Request, res: Response) => {
    const { email, plan, tier, country, examType, locale, referrer, stripeError } = req.body;
    if (!email || !plan) {
      return res.status(400).json({ error: "email and plan are required" });
    }
    const id = await captureCheckoutIntent(email, plan, tier || "rn", {
      country,
      examType,
      locale,
      referrer,
      stripeError,
      ipAddress: (req.headers["x-forwarded-for"] as string) || req.ip || undefined,
      userAgent: req.headers["user-agent"] || undefined,
    });
    return res.json({
      ok: true,
      id,
      message: "Your checkout intent has been saved. We will email you a recovery link as soon as our payment system is available.",
    });
  });

  // Admin: list pending intents
  app.get("/api/admin/checkout-intents", async (req: Request, res: Response) => {
    const intents = await getPendingCheckoutIntents(200);
    return res.json({ intents, count: intents.length });
  });

  // Admin: mark recovered
  app.post("/api/admin/checkout-intents/:id/recovered", async (req: Request, res: Response) => {
    await markCheckoutRecovered(String(req.params.id));
    return res.json({ ok: true });
  });
}

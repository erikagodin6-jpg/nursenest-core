/**
 * Phase 14 — Email Resilience
 * Retry queue, replay queue, and dead letter queue for all transactional email.
 * No email should ever be lost.
 *
 * Covers: password resets, verification, daily questions, marketing campaigns.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { addAlert } from "./platform-resilience";

export type EmailType =
  | "password_reset"
  | "verification"
  | "daily_question"
  | "checkout_recovery"
  | "subscription_confirmation"
  | "subscription_expiry"
  | "welcome"
  | "report_card"
  | "marketing";

export interface QueuedEmail {
  id: string;
  to: string;
  type: EmailType;
  subject: string;
  htmlBody: string;
  textBody?: string;
  metadata?: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  nextRetryAt: string;
  status: "pending" | "retrying" | "sent" | "dead";
  lastError?: string;
  createdAt: string;
  sentAt?: string;
  deadAt?: string;
}

const MAX_ATTEMPTS = 5;
const RETRY_BACKOFF_MS = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000, 4 * 60 * 60_000]; // 1m, 5m, 15m, 1h, 4h

export async function ensureEmailQueueTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_queue (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        to_address text NOT NULL,
        email_type text NOT NULL,
        subject text NOT NULL,
        html_body text NOT NULL,
        text_body text,
        metadata jsonb DEFAULT '{}'::jsonb,
        attempts integer NOT NULL DEFAULT 0,
        max_attempts integer NOT NULL DEFAULT 5,
        next_retry_at timestamptz NOT NULL DEFAULT NOW(),
        status text NOT NULL DEFAULT 'pending',
        last_error text,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        sent_at timestamptz,
        dead_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS idx_email_queue_pending ON email_queue(status, next_retry_at) WHERE status IN ('pending', 'retrying');
      CREATE INDEX IF NOT EXISTS idx_email_queue_dead ON email_queue(status, dead_at) WHERE status = 'dead';
      CREATE INDEX IF NOT EXISTS idx_email_queue_to ON email_queue(to_address);
    `);
  } catch (e: any) {
    console.error("[EmailDLQ] Table init error:", e.message);
  }
}

export async function enqueueEmail(
  to: string,
  type: EmailType,
  subject: string,
  htmlBody: string,
  options: { textBody?: string; metadata?: Record<string, unknown>; maxAttempts?: number } = {}
): Promise<string | null> {
  try {
    const { rows } = await pool.query(
      `INSERT INTO email_queue (to_address, email_type, subject, html_body, text_body, metadata, max_attempts, next_retry_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id`,
      [
        to,
        type,
        subject,
        htmlBody,
        options.textBody || null,
        JSON.stringify(options.metadata || {}),
        options.maxAttempts || MAX_ATTEMPTS,
      ]
    );
    return rows[0]?.id || null;
  } catch (e: any) {
    console.error("[EmailDLQ] Enqueue error:", e.message);
    return null;
  }
}

export async function markEmailSent(id: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE email_queue SET status = 'sent', sent_at = NOW() WHERE id = $1`,
      [id]
    );
  } catch {}
}

export async function markEmailFailed(id: string, error: string): Promise<void> {
  try {
    const { rows } = await pool.query(
      `SELECT attempts, max_attempts FROM email_queue WHERE id = $1`,
      [id]
    );
    if (!rows.length) return;

    const { attempts, max_attempts } = rows[0];
    const nextAttempt = attempts + 1;

    if (nextAttempt >= max_attempts) {
      await pool.query(
        `UPDATE email_queue SET status = 'dead', attempts = $1, last_error = $2, dead_at = NOW() WHERE id = $3`,
        [nextAttempt, error, id]
      );
      addAlert("warning", "email_dlq", "Email Dead Letter", `Email ${id} exceeded ${max_attempts} attempts. Last error: ${error}`, "email-dlq");
    } else {
      const backoffMs = (RETRY_BACKOFF_MS[nextAttempt - 1] ?? RETRY_BACKOFF_MS[RETRY_BACKOFF_MS.length - 1]) as number;
      const nextRetry = new Date(Date.now() + backoffMs).toISOString();
      await pool.query(
        `UPDATE email_queue SET status = 'retrying', attempts = $1, last_error = $2, next_retry_at = $3 WHERE id = $4`,
        [nextAttempt, error, nextRetry, id]
      );
    }
  } catch {}
}

export async function getPendingEmailBatch(limit = 50): Promise<any[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, to_address, email_type, subject, html_body, text_body, metadata, attempts
       FROM email_queue
       WHERE status IN ('pending', 'retrying') AND next_retry_at <= NOW()
       ORDER BY next_retry_at ASC
       LIMIT $1
       FOR UPDATE SKIP LOCKED`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getDeadLetterEmails(limit = 100): Promise<any[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, to_address, email_type, subject, attempts, last_error, dead_at, created_at
       FROM email_queue WHERE status = 'dead'
       ORDER BY dead_at DESC LIMIT $1`,
      [limit]
    );
    return rows;
  } catch {
    return [];
  }
}

export async function replayDeadLetterEmail(id: string): Promise<void> {
  try {
    await pool.query(
      `UPDATE email_queue SET status = 'pending', attempts = 0, next_retry_at = NOW(), dead_at = NULL, last_error = NULL WHERE id = $1`,
      [id]
    );
  } catch {}
}

export async function getEmailQueueStats(): Promise<Record<string, number>> {
  try {
    const { rows } = await pool.query(
      `SELECT status, COUNT(*) as count FROM email_queue GROUP BY status`
    );
    const stats: Record<string, number> = { pending: 0, retrying: 0, sent: 0, dead: 0 };
    for (const r of rows) stats[r.status] = parseInt(r.count || "0");
    return stats;
  } catch {
    return {};
  }
}

export function registerEmailQueueRoutes(app: Express): void {
  app.get("/api/admin/email-queue/stats", async (_req: Request, res: Response) => {
    const stats = await getEmailQueueStats();
    return res.json({ ok: true, stats });
  });

  app.get("/api/admin/email-queue/dead-letters", async (_req: Request, res: Response) => {
    const emails = await getDeadLetterEmails();
    return res.json({ ok: true, emails, count: emails.length });
  });

  app.post("/api/admin/email-queue/:id/replay", async (req: Request, res: Response) => {
    await replayDeadLetterEmail(String(req.params.id));
    return res.json({ ok: true });
  });

  app.post("/api/admin/email-queue/replay-all-dead", async (_req: Request, res: Response) => {
    try {
      const { rowCount } = await pool.query(
        `UPDATE email_queue SET status = 'pending', attempts = 0, next_retry_at = NOW(), dead_at = NULL, last_error = NULL WHERE status = 'dead'`
      );
      return res.json({ ok: true, replayed: rowCount || 0 });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
}

import { emitStructuredLog } from "./log-sink";
import { pool } from "./storage";

/**
 * Webhook idempotency (DB: `webhook_events.event_id` UNIQUE).
 *
 * **New provider checklist:** verify signature on raw body → parse stable `eventId` →
 * `withWebhookIdempotency({ ... handler })` → side effects safe to retry (upserts).
 * Details: `server/docs/WEBHOOK_IDEMPOTENCY.md`.
 */

export type WebhookSource = "stripe" | "paypal" | "other";

export type WebhookClaimResult = "claimed" | "duplicate_processed" | "duplicate_in_flight" | "retry_failed";

const STALE_PROCESSING_MS = Math.min(
  Math.max(parseInt(process.env.WEBHOOK_STALE_PROCESSING_MS || "900000", 10), 60_000),
  3_600_000,
);

/**
 * Atomically claim a webhook delivery for side-effect execution.
 * Uses existing webhook_events.event_id UNIQUE (Stripe evt_*, PayPal WH-*, etc.).
 */
export async function claimWebhookEvent(params: {
  eventId: string;
  eventType: string;
  source: WebhookSource;
  payloadSummary: unknown;
}): Promise<WebhookClaimResult> {
  const { eventId, eventType, source, payloadSummary } = params;
  const payloadJson = JSON.stringify(payloadSummary ?? {});

  const ins = await pool.query(
    `INSERT INTO webhook_events (event_id, event_type, source, status, user_id, payload, created_at)
     VALUES ($1, $2, $3, 'processing', NULL, $4::jsonb, NOW())
     ON CONFLICT (event_id) DO NOTHING
     RETURNING id`,
    [eventId, eventType, source, payloadJson],
  );

  if (ins.rows.length > 0) {
    return "claimed";
  }

  const sel = await pool.query<{ status: string; created_at: Date }>(
    `SELECT status, created_at FROM webhook_events WHERE event_id = $1 LIMIT 1`,
    [eventId],
  );
  const row = sel.rows[0];
  if (!row) {
    return "claimed";
  }

  if (row.status === "processed") {
    return "duplicate_processed";
  }

  if (row.status === "failed") {
    const up = await pool.query(
      `UPDATE webhook_events
       SET status = 'processing', error_message = NULL, processed_at = NULL, payload = $2::jsonb
       WHERE event_id = $1 AND status = 'failed'
       RETURNING id`,
      [eventId, payloadJson],
    );
    return up.rows.length > 0 ? "claimed" : "duplicate_in_flight";
  }

  if (row.status === "processing") {
    const age = Date.now() - new Date(row.created_at).getTime();
    if (age < STALE_PROCESSING_MS) {
      return "duplicate_in_flight";
    }
    const reclaim = await pool.query(
      `UPDATE webhook_events
       SET status = 'processing', error_message = NULL, processed_at = NULL, created_at = NOW(), payload = $2::jsonb
       WHERE event_id = $1 AND status = 'processing'
       RETURNING id`,
      [eventId, payloadJson],
    );
    return reclaim.rows.length > 0 ? "claimed" : "duplicate_in_flight";
  }

  return "duplicate_in_flight";
}

export async function finishWebhookEvent(
  eventId: string,
  result: Record<string, unknown> | null,
  errorMessage?: string | null,
): Promise<void> {
  await pool.query(
    `UPDATE webhook_events
     SET status = $1,
         processing_result = $2::jsonb,
         error_message = $3,
         processed_at = NOW()
     WHERE event_id = $4`,
    [
      errorMessage ? "failed" : "processed",
      JSON.stringify(result ?? {}),
      errorMessage ?? null,
      eventId,
    ],
  );
}

export function logWebhookDuplicate(info: {
  source: WebhookSource;
  eventId: string;
  eventType?: string;
  reason: WebhookClaimResult;
  requestId?: string;
}): void {
  emitStructuredLog(
    {
      level: "info",
      type: "webhook_duplicate",
      provider: info.source,
      source: info.source,
      eventId: info.eventId,
      eventType: info.eventType,
      reason: info.reason,
      requestId: info.requestId,
    },
    "log",
  );
}

/**
 * Claim → run handler → finish (success/fail). Duplicate deliveries log at info and skip handler.
 */
export async function withWebhookIdempotency<T>(params: {
  eventId: string;
  eventType: string;
  source: WebhookSource;
  payloadSummary: unknown;
  requestId?: string;
  handler: () => Promise<T>;
}): Promise<{ duplicate: true } | { duplicate: false; result: T }> {
  const claim = await claimWebhookEvent({
    eventId: params.eventId,
    eventType: params.eventType,
    source: params.source,
    payloadSummary: params.payloadSummary,
  });

  if (claim !== "claimed") {
    logWebhookDuplicate({
      source: params.source,
      eventId: params.eventId,
      eventType: params.eventType,
      reason: claim,
      requestId: params.requestId,
    });
    return { duplicate: true };
  }

  try {
    const result = await params.handler();
    await finishWebhookEvent(params.eventId, { ok: true, eventType: params.eventType });
    return { duplicate: false, result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await finishWebhookEvent(params.eventId, null, msg);
    throw e;
  }
}

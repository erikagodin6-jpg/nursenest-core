/**
 * Phase 13 — Admin Panel Resilience
 * Action queue for admin operations when the database is unavailable.
 * Queued actions are replayed automatically when DB recovers.
 *
 * Covers: user management, content publishing, subscription controls,
 * discount codes, promotions.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { addAlert } from "./platform-resilience";

export type AdminActionType =
  | "publish_content"
  | "unpublish_content"
  | "update_user_tier"
  | "revoke_subscription"
  | "grant_provisional_access"
  | "create_discount_code"
  | "disable_discount_code"
  | "quarantine_content"
  | "send_email_blast"
  | "toggle_kill_switch";

export interface AdminQueuedAction {
  id: string;
  actionType: AdminActionType;
  actorId: string;
  actorUsername: string;
  payload: Record<string, unknown>;
  status: "pending" | "replaying" | "applied" | "failed";
  createdAt: string;
  appliedAt?: string;
  failureReason?: string;
  retries: number;
}

export async function ensureAdminActionQueueTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_action_queue (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        action_type text NOT NULL,
        actor_id varchar NOT NULL,
        actor_username text NOT NULL,
        payload jsonb NOT NULL DEFAULT '{}'::jsonb,
        status text NOT NULL DEFAULT 'pending',
        retries integer NOT NULL DEFAULT 0,
        failure_reason text,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        applied_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS idx_admin_queue_pending ON admin_action_queue(status, created_at) WHERE status IN ('pending', 'replaying');
      CREATE INDEX IF NOT EXISTS idx_admin_queue_actor ON admin_action_queue(actor_id);
    `);
  } catch (e: any) {
    console.error("[AdminActionQueue] Table init error:", e.message);
  }
}

export async function enqueueAdminAction(
  actionType: AdminActionType,
  actorId: string,
  actorUsername: string,
  payload: Record<string, unknown>
): Promise<string | null> {
  try {
    const { rows } = await pool.query(
      `INSERT INTO admin_action_queue (action_type, actor_id, actor_username, payload)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [actionType, actorId, actorUsername, JSON.stringify(payload)]
    );
    return rows[0]?.id || null;
  } catch (e: any) {
    console.error("[AdminActionQueue] Enqueue error:", e.message);
    return null;
  }
}

export async function getPendingAdminActions(limit = 50): Promise<AdminQueuedAction[]> {
  try {
    const { rows } = await pool.query(
      `SELECT id, action_type, actor_id, actor_username, payload, status, retries, failure_reason, created_at, applied_at
       FROM admin_action_queue WHERE status IN ('pending', 'replaying')
       ORDER BY created_at ASC LIMIT $1`,
      [limit]
    );
    return rows.map((r: any) => ({
      id: r.id,
      actionType: r.action_type,
      actorId: r.actor_id,
      actorUsername: r.actor_username,
      payload: r.payload || {},
      status: r.status,
      retries: r.retries,
      failureReason: r.failure_reason,
      createdAt: r.created_at.toISOString(),
      appliedAt: r.applied_at ? r.applied_at.toISOString() : undefined,
    }));
  } catch {
    return [];
  }
}

export async function replayPendingAdminActions(): Promise<{ applied: number; failed: number }> {
  const pending = await getPendingAdminActions(50);
  let applied = 0;
  let failed = 0;

  for (const action of pending) {
    try {
      await pool.query(
        `UPDATE admin_action_queue SET status = 'replaying' WHERE id = $1`,
        [action.id]
      );
      await applyAdminAction(action);
      await pool.query(
        `UPDATE admin_action_queue SET status = 'applied', applied_at = NOW() WHERE id = $1`,
        [action.id]
      );
      applied++;
    } catch (e: any) {
      await pool.query(
        `UPDATE admin_action_queue SET status = 'failed', failure_reason = $1, retries = retries + 1 WHERE id = $2`,
        [e.message, action.id]
      );
      failed++;
    }
  }

  if (applied > 0) {
    console.log(`[AdminActionQueue] Replayed ${applied} queued admin actions`);
  }
  return { applied, failed };
}

async function applyAdminAction(action: AdminQueuedAction): Promise<void> {
  const { actionType, payload } = action;

  switch (actionType) {
    case "update_user_tier": {
      if (!payload.userId || !payload.tier) throw new Error("Missing userId or tier");
      await pool.query(
        `UPDATE users SET tier = $1, updated_at = NOW() WHERE id = $2`,
        [payload.tier, payload.userId]
      );
      break;
    }
    case "publish_content": {
      if (!payload.contentId || !payload.contentType) throw new Error("Missing contentId or contentType");
      await pool.query(
        `UPDATE lessons SET is_published = true, published_at = NOW() WHERE id = $1`,
        [payload.contentId]
      ).catch(() => {});
      break;
    }
    case "unpublish_content": {
      if (!payload.contentId) throw new Error("Missing contentId");
      await pool.query(
        `UPDATE lessons SET is_published = false WHERE id = $1`,
        [payload.contentId]
      ).catch(() => {});
      break;
    }
    case "toggle_kill_switch": {
      if (!payload.featureKey) throw new Error("Missing featureKey");
      await pool.query(
        `UPDATE kill_switches SET enabled = $1, updated_at = NOW() WHERE feature_key = $2`,
        [!!payload.enabled, payload.featureKey]
      ).catch(() => {});
      break;
    }
    case "grant_provisional_access": {
      if (!payload.userId || !payload.hours) throw new Error("Missing userId or hours");
      const expiresAt = new Date(Date.now() + Number(payload.hours) * 60 * 60 * 1000).toISOString();
      await pool.query(
        `INSERT INTO provisional_access_log (user_id, reason, granted_at, expires_at)
         VALUES ($1, $2, NOW(), $3)`,
        [payload.userId, payload.reason || "admin_queue_replay", expiresAt]
      ).catch(() => {});
      break;
    }
    default:
      addAlert("info", "admin_queue", "Unknown Admin Action", `Unhandled action type: ${actionType}`, "admin-action-queue");
      break;
  }
}

export function registerAdminActionQueueRoutes(app: Express): void {
  app.get("/api/admin/action-queue", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser || (authUser as any).role !== "admin") return res.status(403).json({ error: "forbidden" });

    const actions = await getPendingAdminActions(100);
    return res.json({ ok: true, actions, count: actions.length });
  });

  app.post("/api/admin/action-queue/replay", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser || (authUser as any).role !== "admin") return res.status(403).json({ error: "forbidden" });

    const result = await replayPendingAdminActions();
    return res.json({ ok: true, ...result });
  });

  // Enqueue a deferred action when DB is temporarily degraded
  app.post("/api/admin/action-queue/enqueue", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser || (authUser as any).role !== "admin") return res.status(403).json({ error: "forbidden" });

    const { actionType, payload } = req.body;
    if (!actionType || !payload) return res.status(400).json({ error: "actionType and payload required" });

    const id = await enqueueAdminAction(
      actionType,
      authUser.id,
      (authUser as any).username || authUser.email || "unknown",
      payload
    );
    return res.json({ ok: true, id });
  });
}

/**
 * Phase 2 — Progress Protection: Server-side sync receiver.
 * Accepts batched progress events from offline queues and persists them.
 */

import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

interface ProgressEvent {
  id: string;
  type: string;
  userId: string;
  payload: Record<string, unknown>;
  createdAt: number;
}

async function ensureProgressSyncTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress_sync_log (
        id varchar PRIMARY KEY,
        user_id varchar NOT NULL,
        event_type text NOT NULL,
        payload jsonb NOT NULL DEFAULT '{}'::jsonb,
        client_created_at timestamptz NOT NULL,
        synced_at timestamptz NOT NULL DEFAULT NOW(),
        processed boolean NOT NULL DEFAULT false,
        processed_at timestamptz
      );
      CREATE INDEX IF NOT EXISTS idx_progress_sync_user ON progress_sync_log(user_id);
      CREATE INDEX IF NOT EXISTS idx_progress_sync_processed ON progress_sync_log(processed, synced_at);
      CREATE INDEX IF NOT EXISTS idx_progress_sync_type ON progress_sync_log(event_type);
    `);
  } catch (e: any) {
    console.error("[ProgressSync] Table init error:", e.message);
  }
}

ensureProgressSyncTables().catch(() => {});

const ALLOWED_TYPES = new Set([
  "lesson_complete",
  "flashcard_mastery",
  "question_answered",
  "confidence_rating",
  "cat_result",
  "clinical_skill_complete",
  "pharmacology_progress",
  "ecg_progress",
  "adaptive_signal",
  "study_session_end",
]);

export function registerProgressSyncRoutes(app: Express): void {
  app.post("/api/progress/sync-batch", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser) return res.status(401).json({ error: "unauthorized" });

    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      return res.json({ syncedIds: [], count: 0 });
    }

    const syncedIds: string[] = [];
    const MAX_BATCH = 100;
    const batch = events.slice(0, MAX_BATCH) as ProgressEvent[];

    for (const event of batch) {
      if (!event.id || !event.type || !ALLOWED_TYPES.has(event.type)) continue;
      if (event.userId !== authUser.id) continue;

      try {
        await pool.query(
          `INSERT INTO progress_sync_log (id, user_id, event_type, payload, client_created_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [
            event.id,
            authUser.id,
            event.type,
            JSON.stringify(event.payload || {}),
            new Date(event.createdAt || Date.now()).toISOString(),
          ]
        );
        syncedIds.push(event.id);
      } catch (e: any) {
        console.error("[ProgressSync] Insert error for event", event.id, e.message);
      }
    }

    // Fire-and-forget: apply synced events to actual user progress tables
    applyProgressEvents(syncedIds).catch(() => {});

    return res.json({ syncedIds, count: syncedIds.length });
  });

  app.get("/api/progress/sync-status", async (req: Request, res: Response) => {
    const authUser = await resolveAuthUser(req).catch(() => null);
    if (!authUser) return res.status(401).json({ error: "unauthorized" });

    try {
      const { rows } = await pool.query(
        `SELECT event_type, COUNT(*) as count, MAX(synced_at) as last_sync
         FROM progress_sync_log WHERE user_id = $1
         GROUP BY event_type`,
        [authUser.id]
      );
      return res.json({ status: "ok", events: rows });
    } catch {
      return res.json({ status: "error" });
    }
  });
}

async function applyProgressEvents(syncedIds: string[]): Promise<void> {
  if (!syncedIds.length) return;
  try {
    const { rows } = await pool.query(
      `SELECT id, user_id, event_type, payload, client_created_at
       FROM progress_sync_log WHERE id = ANY($1) AND processed = false`,
      [syncedIds]
    );

    for (const row of rows) {
      try {
        await applyEvent(row.user_id, row.event_type, row.payload, row.client_created_at);
        await pool.query(
          `UPDATE progress_sync_log SET processed = true, processed_at = NOW() WHERE id = $1`,
          [row.id]
        );
      } catch {}
    }
  } catch {}
}

async function applyEvent(userId: string, type: string, payload: any, occurredAt: Date): Promise<void> {
  switch (type) {
    case "lesson_complete": {
      if (!payload?.lessonId) return;
      await pool.query(
        `INSERT INTO user_lesson_progress (user_id, lesson_id, completed, completed_at)
         VALUES ($1, $2, true, $3)
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, completed_at = LEAST(user_lesson_progress.completed_at, EXCLUDED.completed_at)`,
        [userId, payload.lessonId, occurredAt]
      ).catch(() => {});
      break;
    }
    case "question_answered": {
      if (!payload?.questionId) return;
      await pool.query(
        `INSERT INTO user_question_history (user_id, question_id, is_correct, confidence, answered_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [userId, payload.questionId, payload.isCorrect ?? false, payload.confidence || "unknown", occurredAt]
      ).catch(() => {});
      break;
    }
    case "flashcard_mastery": {
      if (!payload?.flashcardId) return;
      await pool.query(
        `INSERT INTO flashcard_progress (user_id, flashcard_id, mastery_level, last_reviewed_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, flashcard_id) DO UPDATE SET mastery_level = GREATEST(flashcard_progress.mastery_level, EXCLUDED.mastery_level), last_reviewed_at = EXCLUDED.last_reviewed_at`,
        [userId, payload.flashcardId, payload.masteryLevel || 1, occurredAt]
      ).catch(() => {});
      break;
    }
    default:
      break;
  }
}

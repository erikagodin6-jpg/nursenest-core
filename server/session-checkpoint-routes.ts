import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";

async function ensureCheckpointTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS session_checkpoints (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        session_type TEXT NOT NULL,
        session_id TEXT NOT NULL,
        checkpoint_data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS platform_incidents (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        incident_id TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        severity TEXT NOT NULL DEFAULT 'warning',
        user_id VARCHAR,
        route TEXT,
        message TEXT NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS provisional_access_grants (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        reason TEXT NOT NULL,
        granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ,
        granted_by TEXT DEFAULT 'system',
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `);
  } catch (e: any) {
    console.error("[SessionCheckpoint] Table creation error:", e.message);
  }
}

let tablesEnsured = false;
async function ensureOnce() {
  if (!tablesEnsured) {
    await ensureCheckpointTables();
    tablesEnsured = true;
  }
}

function generateIncidentId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `INC-${ts}-${rand}`.toUpperCase();
}

export function registerSessionCheckpointRoutes(app: Express) {
  app.post("/api/session-checkpoint/save", async (req: any, res) => {
    try {
      await ensureOnce();
      const user = await resolveAuthUser(req).catch(() => null);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionType, sessionId, checkpointData } = req.body;
      if (!sessionType || !sessionId || !checkpointData) {
        return res.status(400).json({ error: "Missing required fields: sessionType, sessionId, checkpointData" });
      }

      await pool.query(
        `INSERT INTO session_checkpoints (user_id, session_type, session_id, checkpoint_data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT ON CONSTRAINT session_checkpoints_user_session_unique
         DO UPDATE SET checkpoint_data = $4, updated_at = NOW()`,
        [user.id, sessionType, sessionId, JSON.stringify(checkpointData)]
      ).catch(async () => {
        try {
          await pool.query(
            `CREATE UNIQUE INDEX IF NOT EXISTS session_checkpoints_user_session_unique ON session_checkpoints (user_id, session_type, session_id)`
          );
        } catch {}
        await pool.query(
          `INSERT INTO session_checkpoints (user_id, session_type, session_id, checkpoint_data, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (user_id, session_type, session_id)
           DO UPDATE SET checkpoint_data = $4, updated_at = NOW()`,
          [user.id, sessionType, sessionId, JSON.stringify(checkpointData)]
        );
      });

      res.json({ success: true });
    } catch (e: any) {
      console.error("[SessionCheckpoint] Save error:", e.message);
      res.status(500).json({ error: "Failed to save checkpoint" });
    }
  });

  app.get("/api/session-checkpoint/restore", async (req: any, res) => {
    try {
      await ensureOnce();
      const user = await resolveAuthUser(req).catch(() => null);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionType, sessionId } = req.query;
      if (!sessionType) {
        return res.status(400).json({ error: "sessionType is required" });
      }

      let query = `SELECT * FROM session_checkpoints WHERE user_id = $1 AND session_type = $2`;
      const params: any[] = [user.id, sessionType];

      if (sessionId) {
        query += ` AND session_id = $3`;
        params.push(sessionId);
      }

      query += ` ORDER BY updated_at DESC LIMIT 1`;

      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        return res.json({ found: false });
      }

      const row = result.rows[0];
      res.json({
        found: true,
        checkpoint: {
          sessionType: row.session_type,
          sessionId: row.session_id,
          checkpointData: row.checkpoint_data,
          updatedAt: row.updated_at,
        },
      });
    } catch (e: any) {
      console.error("[SessionCheckpoint] Restore error:", e.message);
      res.status(500).json({ error: "Failed to restore checkpoint" });
    }
  });

  app.delete("/api/session-checkpoint/clear", async (req: any, res) => {
    try {
      await ensureOnce();
      const user = await resolveAuthUser(req).catch(() => null);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { sessionType, sessionId } = req.body;
      if (!sessionType || !sessionId) {
        return res.status(400).json({ error: "sessionType and sessionId required" });
      }

      await pool.query(
        `DELETE FROM session_checkpoints WHERE user_id = $1 AND session_type = $2 AND session_id = $3`,
        [user.id, sessionType, sessionId]
      );

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to clear checkpoint" });
    }
  });

  app.get("/api/session-checkpoint/active", async (req: any, res) => {
    try {
      await ensureOnce();
      const user = await resolveAuthUser(req).catch(() => null);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const result = await pool.query(
        `SELECT session_type, session_id, updated_at, checkpoint_data FROM session_checkpoints
         WHERE user_id = $1 AND updated_at > NOW() - INTERVAL '24 hours'
         ORDER BY updated_at DESC LIMIT 10`,
        [user.id]
      );

      res.json({
        sessions: result.rows.map(r => {
          const cpData = r.checkpoint_data || {};
          const inner = cpData.checkpointData || cpData;
          return {
            sessionType: r.session_type,
            sessionId: r.session_id,
            updatedAt: r.updated_at,
            currentIndex: inner.currentIndex ?? 0,
            timeSpent: inner.timeSpent ?? 0,
            answeredCount: inner.answers ? Object.keys(inner.answers).length : 0,
          };
        }),
      });
    } catch (e: any) {
      res.json({ sessions: [] });
    }
  });

  app.post("/api/platform-incident/report", async (req: any, res) => {
    try {
      await ensureOnce();
      const user = await resolveAuthUser(req).catch(() => null);
      const { type, severity, route, message, metadata } = req.body;

      const incidentId = generateIncidentId();

      try {
        await pool.query(
          `INSERT INTO platform_incidents (incident_id, type, severity, user_id, route, message, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            incidentId,
            type || "client_error",
            severity || "warning",
            user?.id || null,
            route || null,
            message || "Unknown error",
            JSON.stringify(metadata || {}),
          ]
        );
      } catch (dbErr: any) {
        console.error("[PlatformIncident] DB error:", dbErr.message);
      }

      res.json({ success: true, incidentId });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to report incident" });
    }
  });

  app.get("/api/platform-incident/:incidentId", async (req: any, res) => {
    try {
      await ensureOnce();
      const result = await pool.query(
        `SELECT * FROM platform_incidents WHERE incident_id = $1`,
        [req.params.incidentId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Incident not found" });
      }
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch incident" });
    }
  });
}

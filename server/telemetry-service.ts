import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import rateLimit from "express-rate-limit";

const ALLOWED_EVENT_TYPES = new Set([
  "retry",
  "fallback_used",
  "drop_off",
  "session_abandon",
  "silent_failure",
  "suppressed_error",
  "swallowed_exception",
  "page_view",
  "click",
  "navigate",
  "error",
  "api_error",
  "render_error",
  "load_error",
  "timeout",
  "form_submit",
  "checkout_start",
  "checkout_complete",
  "checkout_abandon",
  "feature_use",
]);

const ALLOWED_CATEGORIES = new Set([
  "error",
  "behavior",
  "performance",
  "degradation",
  "navigation",
  "engagement",
  "conversion",
  "payment",
  "content",
  "auth",
]);

const ALLOWED_SEVERITIES = new Set(["info", "warning", "error", "critical"]);

const MAX_BATCH_EVENTS = 50;
const MAX_ACTIONS = 500;
const MAX_API_CALLS = 200;
const MAX_STATE_TRANSITIONS = 100;
const MAX_ERRORS = 50;

function sanitizeString(value: unknown, maxLength = 200): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().slice(0, maxLength).replace(/[<>]/g, "");
  return cleaned.length > 0 ? cleaned : null;
}

function sanitizeInteger(value: unknown, min: number, max: number, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(num)));
}

function sanitizeDate(value: unknown): Date | null {
  if (!value) return null;
  const date = new Date(value as any);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function sanitizeEventData(data: unknown): Record<string, string | number | boolean | null> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};

  const sanitized: Record<string, string | number | boolean | null> = {};
  const keys = Object.keys(data as Record<string, unknown>).slice(0, 20);

  for (const key of keys) {
    const safeKey = key.slice(0, 50).replace(/[<>]/g, "");
    const value = (data as Record<string, unknown>)[key];

    if (typeof value === "string") {
      sanitized[safeKey] = value.slice(0, 500);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      sanitized[safeKey] = value;
    } else if (typeof value === "boolean") {
      sanitized[safeKey] = value;
    } else if (value === null) {
      sanitized[safeKey] = null;
    }
  }

  return sanitized;
}

function sanitizeArray<T>(value: unknown, maxItems: number): T[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems);
}

function getSafeSeverity(value: unknown): string {
  const severity = sanitizeString(value, 20);
  return severity && ALLOWED_SEVERITIES.has(severity) ? severity : "info";
}

async function ensureTelemetryTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id TEXT NOT NULL,
        user_id TEXT,
        event_type TEXT NOT NULL,
        event_category TEXT NOT NULL,
        event_data JSONB DEFAULT '{}'::jsonb,
        page TEXT,
        component TEXT,
        severity TEXT DEFAULT 'info',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS session_recordings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id TEXT NOT NULL UNIQUE,
        user_id TEXT,
        actions JSONB DEFAULT '[]'::jsonb,
        api_calls JSONB DEFAULT '[]'::jsonb,
        state_transitions JSONB DEFAULT '[]'::jsonb,
        errors JSONB DEFAULT '[]'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb,
        started_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP,
        duration INTEGER DEFAULT 0
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_events_session ON telemetry_events(session_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_events_user ON telemetry_events(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_events_type ON telemetry_events(event_type)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_events_category ON telemetry_events(event_category)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_telemetry_events_created ON telemetry_events(created_at)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_session_recordings_session ON session_recordings(session_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_session_recordings_user ON session_recordings(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_session_recordings_started_at ON session_recordings(started_at)`);
  } catch (error: any) {
    console.error("[Telemetry] Table init error:", error?.message || error);
  }
}

type InsertableTelemetryEvent = {
  sessionId: string;
  userId: string | null;
  eventType: string;
  eventCategory: string;
  eventData: Record<string, string | number | boolean | null>;
  page: string | null;
  component: string | null;
  severity: string;
};

function normalizeTelemetryEvent(input: any): InsertableTelemetryEvent | null {
  const sessionId = sanitizeString(input?.sessionId, 100);
  const userId = sanitizeString(input?.userId, 100);
  const eventType = sanitizeString(input?.eventType, 50);
  const eventCategory = sanitizeString(input?.eventCategory, 50);
  const page = sanitizeString(input?.page, 300);
  const component = sanitizeString(input?.component, 100);
  const severity = getSafeSeverity(input?.severity);
  const eventData = sanitizeEventData(input?.eventData);

  if (!sessionId || !eventType || !eventCategory) return null;
  if (!ALLOWED_EVENT_TYPES.has(eventType)) return null;
  if (!ALLOWED_CATEGORIES.has(eventCategory)) return null;

  return {
    sessionId,
    userId,
    eventType,
    eventCategory,
    eventData,
    page,
    component,
    severity,
  };
}

async function insertTelemetryEvent(event: InsertableTelemetryEvent): Promise<void> {
  await pool.query(
    `INSERT INTO telemetry_events (
      session_id,
      user_id,
      event_type,
      event_category,
      event_data,
      page,
      component,
      severity,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, NOW())`,
    [
      event.sessionId,
      event.userId,
      event.eventType,
      event.eventCategory,
      JSON.stringify(event.eventData),
      event.page,
      event.component,
      event.severity,
    ],
  );
}

async function requireAdminOrReturn(req: Request, res: Response) {
  const admin = await requireAdmin(req, res);
  if (!admin) return null;
  return admin;
}

export function registerTelemetryRoutes(app: Express): void {
  ensureTelemetryTables().catch(() => {});

  const telemetryRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: { error: "Too many telemetry requests" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.post("/api/telemetry/event", telemetryRateLimiter, async (req: Request, res: Response) => {
    try {
      const event = normalizeTelemetryEvent(req.body);

      if (!event) {
        return res.status(400).json({
          error: "Invalid telemetry payload. sessionId, eventType, and eventCategory are required and must be allowed values.",
        });
      }

      await insertTelemetryEvent(event);
      return res.status(201).json({ success: true });
    } catch (error: any) {
      console.error("[Telemetry] Event record error:", error?.message || error);
      return res.status(500).json({ error: "Failed to record event" });
    }
  });

  app.post("/api/telemetry/event/batch", telemetryRateLimiter, async (req: Request, res: Response) => {
    try {
      const rawEvents = Array.isArray(req.body?.events) ? req.body.events.slice(0, MAX_BATCH_EVENTS) : null;

      if (!rawEvents || rawEvents.length === 0) {
        return res.status(400).json({ error: "events array is required" });
      }

      const validEvents: InsertableTelemetryEvent[] = rawEvents
        .map((e: unknown) => normalizeTelemetryEvent(e))
        .filter(
          (event: InsertableTelemetryEvent | null): event is InsertableTelemetryEvent => Boolean(event),
        );

      if (validEvents.length === 0) {
        return res.status(400).json({ error: "No valid events in batch" });
      }

      for (const event of validEvents) {
        await insertTelemetryEvent(event);
      }

      return res.json({
        success: true,
        received: rawEvents.length,
        recorded: validEvents.length,
        skipped: rawEvents.length - validEvents.length,
      });
    } catch (error: any) {
      console.error("[Telemetry] Batch error:", error?.message || error);
      return res.status(500).json({ error: "Failed to record batch events" });
    }
  });

  app.post("/api/telemetry/session", telemetryRateLimiter, async (req: Request, res: Response) => {
    try {
      const sessionId = sanitizeString(req.body?.sessionId, 100);
      const userId = sanitizeString(req.body?.userId, 100);

      if (!sessionId) {
        return res.status(400).json({ error: "sessionId is required" });
      }

      const safeActions = sanitizeArray(req.body?.actions, MAX_ACTIONS);
      const safeApiCalls = sanitizeArray(req.body?.apiCalls, MAX_API_CALLS);
      const safeStateTransitions = sanitizeArray(req.body?.stateTransitions, MAX_STATE_TRANSITIONS);
      const safeErrors = sanitizeArray(req.body?.errors, MAX_ERRORS);
      const safeMetadata = sanitizeEventData(req.body?.metadata);
      const safeDuration = sanitizeInteger(req.body?.duration, 0, 86400, 0);
      const safeEndedAt = sanitizeDate(req.body?.endedAt);

      await pool.query(
        `INSERT INTO session_recordings (
          session_id,
          user_id,
          actions,
          api_calls,
          state_transitions,
          errors,
          metadata,
          started_at,
          ended_at,
          duration
        )
        VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, NOW(), $8, $9)
        ON CONFLICT (session_id)
        DO UPDATE SET
          user_id = COALESCE(EXCLUDED.user_id, session_recordings.user_id),
          actions = CASE
            WHEN EXCLUDED.actions IS NOT NULL AND EXCLUDED.actions <> '[]'::jsonb THEN EXCLUDED.actions
            ELSE session_recordings.actions
          END,
          api_calls = CASE
            WHEN EXCLUDED.api_calls IS NOT NULL AND EXCLUDED.api_calls <> '[]'::jsonb THEN EXCLUDED.api_calls
            ELSE session_recordings.api_calls
          END,
          state_transitions = CASE
            WHEN EXCLUDED.state_transitions IS NOT NULL AND EXCLUDED.state_transitions <> '[]'::jsonb THEN EXCLUDED.state_transitions
            ELSE session_recordings.state_transitions
          END,
          errors = CASE
            WHEN EXCLUDED.errors IS NOT NULL AND EXCLUDED.errors <> '[]'::jsonb THEN EXCLUDED.errors
            ELSE session_recordings.errors
          END,
          metadata = CASE
            WHEN EXCLUDED.metadata IS NOT NULL AND EXCLUDED.metadata <> '{}'::jsonb THEN EXCLUDED.metadata
            ELSE session_recordings.metadata
          END,
          duration = CASE
            WHEN EXCLUDED.duration IS NOT NULL AND EXCLUDED.duration > 0 THEN EXCLUDED.duration
            ELSE session_recordings.duration
          END,
          ended_at = COALESCE(EXCLUDED.ended_at, session_recordings.ended_at)`,
        [
          sessionId,
          userId,
          JSON.stringify(safeActions),
          JSON.stringify(safeApiCalls),
          JSON.stringify(safeStateTransitions),
          JSON.stringify(safeErrors),
          JSON.stringify(safeMetadata),
          safeEndedAt,
          safeDuration,
        ],
      );

      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Telemetry] Session record error:", error?.message || error);
      return res.status(500).json({ error: "Failed to record session" });
    }
  });

  app.get("/api/admin/telemetry/overview", async (req: Request, res: Response) => {
    const admin = await requireAdminOrReturn(req, res);
    if (!admin) return;

    try {
      const days = sanitizeInteger(req.query.days, 1, 90, 7);

      const [
        retryFrequency,
        fallbackUsage,
        dropOffPoints,
        repeatedFailures,
        problematicContent,
        sessionAbandonment,
        eventsByCategory,
        eventsByType,
        dailyTrend,
        silentFailures,
        totalEvents,
        uniqueSessions,
      ] = await Promise.all([
        pool.query(
          `
          SELECT
            event_data->>'feature' AS feature,
            COUNT(*)::int AS retry_count,
            COUNT(DISTINCT session_id)::int AS unique_sessions
          FROM telemetry_events
          WHERE event_type = 'retry'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'feature'
          ORDER BY retry_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_data->>'fallbackType' AS fallback_type,
            COUNT(*)::int AS usage_count,
            COUNT(DISTINCT user_id)::int AS affected_users
          FROM telemetry_events
          WHERE event_type = 'fallback_used'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'fallbackType'
          ORDER BY usage_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            page,
            COUNT(*)::int AS drop_count
          FROM telemetry_events
          WHERE event_type = 'drop_off'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY page
          ORDER BY drop_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            user_id,
            event_data->>'errorType' AS error_type,
            COUNT(*)::int AS failure_count
          FROM telemetry_events
          WHERE event_category = 'error'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
            AND user_id IS NOT NULL
          GROUP BY user_id, event_data->>'errorType'
          HAVING COUNT(*) >= 3
          ORDER BY failure_count DESC
          LIMIT 30
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_data->>'contentId' AS content_id,
            event_data->>'contentType' AS content_type,
            COUNT(*)::int AS error_count
          FROM telemetry_events
          WHERE event_category = 'error'
            AND event_data->>'contentId' IS NOT NULL
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'contentId', event_data->>'contentType'
          ORDER BY error_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            page,
            COUNT(*)::int AS abandonment_count,
            AVG(NULLIF((event_data->>'duration')::int, 0)) AS avg_duration_before_abandon
          FROM telemetry_events
          WHERE event_type = 'session_abandon'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY page
          ORDER BY abandonment_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_category,
            COUNT(*)::int AS count
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_category
          ORDER BY count DESC
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_type,
            COUNT(*)::int AS count
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_type
          ORDER BY count DESC
          LIMIT 30
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            DATE(created_at) AS day,
            COUNT(*)::int AS total_events,
            COUNT(DISTINCT session_id)::int AS unique_sessions,
            COUNT(CASE WHEN event_category = 'error' THEN 1 END)::int AS errors
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY DATE(created_at)
          ORDER BY day DESC
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_data->>'service' AS service,
            event_data->>'errorCode' AS error_code,
            COUNT(*)::int AS count
          FROM telemetry_events
          WHERE event_type = 'silent_failure'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'service', event_data->>'errorCode'
          ORDER BY count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT COUNT(*)::int AS total
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          `,
          [days],
        ).catch(() => ({ rows: [{ total: 0 }] })),

        pool.query(
          `
          SELECT COUNT(DISTINCT session_id)::int AS total
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          `,
          [days],
        ).catch(() => ({ rows: [{ total: 0 }] })),
      ]);

      return res.json({
        period: { days },
        summary: {
          totalEvents: totalEvents.rows[0]?.total || 0,
          uniqueSessions: uniqueSessions.rows[0]?.total || 0,
        },
        retryFrequency: retryFrequency.rows,
        fallbackUsage: fallbackUsage.rows,
        dropOffPoints: dropOffPoints.rows,
        repeatedFailures: repeatedFailures.rows,
        problematicContent: problematicContent.rows,
        sessionAbandonment: sessionAbandonment.rows,
        eventsByCategory: eventsByCategory.rows,
        eventsByType: eventsByType.rows,
        dailyTrend: dailyTrend.rows,
        silentFailures: silentFailures.rows,
      });
    } catch (error: any) {
      console.error("[Telemetry] Overview error:", error?.message || error);
      return res.status(500).json({ error: "Failed to load telemetry overview" });
    }
  });

  app.get("/api/admin/telemetry/analysis", async (req: Request, res: Response) => {
    const admin = await requireAdminOrReturn(req, res);
    if (!admin) return;

    try {
      const days = sanitizeInteger(req.query.days, 1, 90, 7);

      const [weakAreas, prioritizedFixes, silentFailureDetection] = await Promise.all([
        pool.query(
          `
          SELECT
            COALESCE(page, 'unknown') AS area,
            COUNT(CASE WHEN event_category = 'error' THEN 1 END)::int AS error_count,
            COUNT(CASE WHEN event_type = 'retry' THEN 1 END)::int AS retry_count,
            COUNT(CASE WHEN event_type = 'fallback_used' THEN 1 END)::int AS fallback_count,
            COUNT(CASE WHEN event_type = 'drop_off' THEN 1 END)::int AS drop_off_count,
            COUNT(*)::int AS total_events,
            ROUND(
              COUNT(CASE WHEN event_category = 'error' THEN 1 END)::numeric
              / GREATEST(COUNT(*), 1) * 100,
              2
            ) AS error_rate
          FROM telemetry_events
          WHERE created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY page
          HAVING COUNT(CASE WHEN event_category = 'error' THEN 1 END) > 0
          ORDER BY error_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_data->>'feature' AS feature,
            event_data->>'errorType' AS error_type,
            COUNT(*)::int AS occurrence_count,
            COUNT(DISTINCT user_id)::int AS affected_users,
            COUNT(DISTINCT session_id)::int AS affected_sessions,
            CASE
              WHEN COUNT(DISTINCT user_id) > 10 AND COUNT(*) > 20 THEN 'critical'
              WHEN COUNT(DISTINCT user_id) > 5 AND COUNT(*) > 10 THEN 'high'
              WHEN COUNT(DISTINCT user_id) > 2 THEN 'medium'
              ELSE 'low'
            END AS priority
          FROM telemetry_events
          WHERE event_category = 'error'
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'feature', event_data->>'errorType'
          ORDER BY
            CASE
              WHEN COUNT(DISTINCT user_id) > 10 AND COUNT(*) > 20 THEN 1
              WHEN COUNT(DISTINCT user_id) > 5 AND COUNT(*) > 10 THEN 2
              WHEN COUNT(DISTINCT user_id) > 2 THEN 3
              ELSE 4
            END,
            COUNT(*) DESC
          LIMIT 30
          `,
          [days],
        ).catch(() => ({ rows: [] })),

        pool.query(
          `
          SELECT
            event_data->>'service' AS service,
            COUNT(*)::int AS silent_failure_count,
            COUNT(DISTINCT user_id)::int AS affected_users,
            MAX(created_at) AS last_occurrence,
            CASE
              WHEN COUNT(*) > 50 THEN 'critical'
              WHEN COUNT(*) > 20 THEN 'high'
              WHEN COUNT(*) > 5 THEN 'medium'
              ELSE 'low'
            END AS severity
          FROM telemetry_events
          WHERE event_type IN ('silent_failure', 'suppressed_error', 'swallowed_exception')
            AND created_at > NOW() - ($1::int * INTERVAL '1 day')
          GROUP BY event_data->>'service'
          ORDER BY silent_failure_count DESC
          LIMIT 20
          `,
          [days],
        ).catch(() => ({ rows: [] })),
      ]);

      return res.json({
        period: { days },
        weakAreas: weakAreas.rows,
        prioritizedFixes: prioritizedFixes.rows,
        silentFailureDetection: silentFailureDetection.rows,
      });
    } catch (error: any) {
      console.error("[Telemetry] Analysis error:", error?.message || error);
      return res.status(500).json({ error: "Failed to load telemetry analysis" });
    }
  });

  app.get("/api/admin/telemetry/sessions", async (req: Request, res: Response) => {
    const admin = await requireAdminOrReturn(req, res);
    if (!admin) return;

    try {
      const limit = sanitizeInteger(req.query.limit, 1, 100, 50);
      const offset = sanitizeInteger(req.query.offset, 0, 100000, 0);
      const userId = sanitizeString(req.query.userId, 100);
      const hasErrors = String(req.query.hasErrors || "") === "true";

      const params: any[] = [];
      let paramIndex = 1;
      let whereClause = "WHERE 1=1";

      if (userId) {
        whereClause += ` AND user_id = $${paramIndex++}`;
        params.push(userId);
      }

      if (hasErrors) {
        whereClause += ` AND jsonb_array_length(errors) > 0`;
      }

      const result = await pool.query(
        `
        SELECT
          id,
          session_id,
          user_id,
          metadata,
          started_at,
          ended_at,
          duration,
          jsonb_array_length(actions) AS action_count,
          jsonb_array_length(api_calls) AS api_call_count,
          jsonb_array_length(errors) AS error_count
        FROM session_recordings
        ${whereClause}
        ORDER BY started_at DESC
        LIMIT $${paramIndex++}
        OFFSET $${paramIndex}
        `,
        [...params, limit, offset],
      );

      const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM session_recordings ${whereClause}`,
        params,
      );

      return res.json({
        sessions: result.rows,
        total: countResult.rows[0]?.total || 0,
        limit,
        offset,
      });
    } catch (error: any) {
      console.error("[Telemetry] Sessions list error:", error?.message || error);
      return res.status(500).json({ error: "Failed to load sessions" });
    }
  });

  app.get("/api/admin/telemetry/session/:sessionId", async (req: Request, res: Response) => {
    const admin = await requireAdminOrReturn(req, res);
    if (!admin) return;

    try {
      const sessionId = sanitizeString(req.params.sessionId, 100);

      if (!sessionId) {
        return res.status(400).json({ error: "Invalid sessionId" });
      }

      const recordingResult = await pool.query(
        `SELECT * FROM session_recordings WHERE session_id = $1`,
        [sessionId],
      );

      if (recordingResult.rows.length === 0) {
        return res.status(404).json({ error: "Session not found" });
      }

      const eventsResult = await pool.query(
        `SELECT * FROM telemetry_events WHERE session_id = $1 ORDER BY created_at ASC`,
        [sessionId],
      );

      return res.json({
        recording: recordingResult.rows[0],
        events: eventsResult.rows,
      });
    } catch (error: any) {
      console.error("[Telemetry] Session detail error:", error?.message || error);
      return res.status(500).json({ error: "Failed to load session details" });
    }
  });
}
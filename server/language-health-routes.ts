import type { Express } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "./admin-auth";
import { getEventStats, getRecentEventsPersisted, logLanguageEvent, ensureLanguageEnforcementTable } from "./language-enforcement-logger";
import type { LanguageEnforcementEventType } from "./language-enforcement-logger";
import { pool } from "./storage";

const VALID_EVENT_TYPES: LanguageEnforcementEventType[] = [
  "validation_failure",
  "language_mismatch",
  "fallback_activation",
  "retry",
  "scanner_violation",
  "isolation_enforced",
];

const clientEventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many event reports, slow down" },
});

export function registerLanguageHealthRoutes(app: Express) {
  app.get("/api/admin/language-health/stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const hours = parseInt(req.query.hours as string) || 24;
      const stats = await getEventStats(hours);
      res.json(stats);
    } catch (e: any) {
      console.error("[LanguageHealth] Stats error:", e.message);
      res.status(500).json({ error: "Failed to fetch language health stats" });
    }
  });

  app.get("/api/admin/language-health/events", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const events = await getRecentEventsPersisted(limit);
      res.json({ events });
    } catch (e: any) {
      console.error("[LanguageHealth] Events error:", e.message);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/admin/language-health/translation-coverage", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`
        SELECT
          language_code,
          COUNT(*)::int as total_translations,
          COUNT(CASE WHEN translation_status = 'auto' THEN 1 END)::int as auto_count,
          COUNT(CASE WHEN translation_status = 'reviewed' THEN 1 END)::int as reviewed_count,
          COUNT(CASE WHEN translation_status = 'failed' THEN 1 END)::int as failed_count
        FROM content_translations
        GROUP BY language_code
        ORDER BY total_translations DESC
      `);

      res.json({ coverage: result.rows });
    } catch (e: any) {
      console.error("[LanguageHealth] Coverage error:", e.message);
      res.json({ coverage: [] });
    }
  });

  app.get("/api/admin/language-health/missing-keys-summary", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`
        SELECT
          language,
          COUNT(*)::int as missing_count,
          MAX(last_seen) as last_seen
        FROM i18n_missing_keys
        GROUP BY language
        ORDER BY missing_count DESC
      `);

      res.json({ summary: result.rows });
    } catch (e: any) {
      console.error("[LanguageHealth] Missing keys error:", e.message);
      res.json({ summary: [] });
    }
  });

  app.post("/api/admin/language-health/init", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await ensureLanguageEnforcementTable();
      res.json({ success: true });
    } catch (e: any) {
      console.error("[LanguageHealth] Init error:", e.message);
      res.status(500).json({ error: "Failed to initialize" });
    }
  });

  app.post("/api/language-health/report-event", clientEventLimiter, async (req, res) => {
    try {
      const { eventType, contentType, contentId, expectedLanguage, detectedLanguage, detail } = req.body;
      if (!eventType || !expectedLanguage) {
        return res.status(400).json({ error: "eventType and expectedLanguage required" });
      }

      if (!VALID_EVENT_TYPES.includes(eventType as LanguageEnforcementEventType)) {
        return res.status(400).json({ error: "Invalid eventType" });
      }

      if (typeof expectedLanguage !== "string" || expectedLanguage.length > 10) {
        return res.status(400).json({ error: "Invalid expectedLanguage" });
      }

      const sanitizedDetail = typeof detail === "string" ? detail.slice(0, 500) : undefined;

      logLanguageEvent({
        eventType,
        contentType: typeof contentType === "string" ? contentType.slice(0, 100) : undefined,
        contentId: typeof contentId === "string" ? contentId.slice(0, 100) : undefined,
        expectedLanguage: expectedLanguage.slice(0, 10),
        detectedLanguage: typeof detectedLanguage === "string" ? detectedLanguage.slice(0, 50) : undefined,
        detail: sanitizedDetail,
        source: "client",
      });

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to report event" });
    }
  });
}

import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { getTranslationEventSummary, getTranslationCoverageMetrics } from "./translation-event-logger";
import { runTranslationScan } from "./translation-scanner";
import { pool } from "./storage";

export function registerTranslationHealthRoutes(app: Express) {
  app.get("/api/admin/translation-health/summary", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const rawHours = parseInt(String(req.query.hours || "24"));
      const hours = isNaN(rawHours) || rawHours < 1 ? 24 : Math.min(rawHours, 720);

      const summary = await getTranslationEventSummary(hours);
      res.json(summary);
    } catch (err: any) {
      console.error("[TranslationHealth] Summary error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/translation-health/coverage", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const coverage = await getTranslationCoverageMetrics();
      res.json(coverage);
    } catch (err: any) {
      console.error("[TranslationHealth] Coverage error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/translation-health/scan", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const report = await runTranslationScan();
      res.json(report);
    } catch (err: any) {
      console.error("[TranslationHealth] Scan error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/translation-health/events", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const rawLimit = parseInt(String(req.query.limit || "50"));
      const limit = isNaN(rawLimit) || rawLimit < 1 ? 50 : Math.min(rawLimit, 200);
      const eventType = req.query.eventType as string | undefined;
      const language = req.query.language as string | undefined;
      const severity = req.query.severity as string | undefined;

      let query = `SELECT * FROM translation_events WHERE 1=1`;
      const params: any[] = [];

      if (eventType) {
        params.push(eventType);
        query += ` AND event_type = $${params.length}`;
      }
      if (language) {
        params.push(language);
        query += ` AND language = $${params.length}`;
      }
      if (severity) {
        params.push(severity);
        query += ` AND severity = $${params.length}`;
      }

      params.push(limit);
      query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

      try {
        const result = await pool.query(query, params);
        res.json({ events: result.rows, total: result.rows.length });
      } catch (dbErr: any) {
        if (dbErr.code === "42P01") {
          res.json({ events: [], total: 0 });
        } else {
          throw dbErr;
        }
      }
    } catch (err: any) {
      console.error("[TranslationHealth] Events error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/translation-health/missing-keys", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      try {
        const result = await pool.query(
          `SELECT language, details, created_at
           FROM translation_events
           WHERE event_type = 'missing_key'
           ORDER BY created_at DESC
           LIMIT 100`
        );

        const missingByLanguage: Record<string, { count: number; keys: string[] }> = {};
        for (const row of result.rows) {
          const lang = row.language || "unknown";
          if (!missingByLanguage[lang]) {
            missingByLanguage[lang] = { count: 0, keys: [] };
          }
          missingByLanguage[lang].count++;
          const key = row.details?.key;
          if (key && !missingByLanguage[lang].keys.includes(key)) {
            missingByLanguage[lang].keys.push(key);
          }
        }

        res.json({
          totalMissingKeys: result.rows.length,
          byLanguage: missingByLanguage,
        });
      } catch (dbErr: any) {
        if (dbErr.code === "42P01") {
          res.json({ totalMissingKeys: 0, byLanguage: {} });
        } else {
          throw dbErr;
        }
      }
    } catch (err: any) {
      console.error("[TranslationHealth] Missing keys error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
}

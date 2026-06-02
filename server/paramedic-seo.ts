import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

/* =========================
   CONSTANTS
========================= */

const CONTENT_TYPES = ["topic", "category", "glossary", "comparison", "study-guide"] as const;
type ContentType = typeof CONTENT_TYPES[number];

const TABLE_MAP: Record<ContentType, string> = {
  topic: "paramedic_topic_pages",
  category: "paramedic_category_pages",
  glossary: "paramedic_glossary_entries",
  comparison: "paramedic_comparison_pages",
  "study-guide": "paramedic_study_guides",
};

/* =========================
   HELPERS
========================= */

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (!obj || typeof obj !== "object") return obj;

  const out: any = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = snakeToCamel(v);
  }
  return out;
}

async function adminHandler(req: Request, res: Response, fn: () => Promise<any>) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    const result = await fn();
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

/* =========================
   ROUTES
========================= */

export function registerParamedicSeoRoutes(app: Express) {

  for (const type of CONTENT_TYPES) {
    const table = TABLE_MAP[type];

    /* ===== LIST ===== */
    app.get(`/api/paramedic-seo/${type}`, (req, res) =>
      adminHandler(req, res, async () => {

        const limit = Math.min(Number(req.query.limit) || 50, 200);
        const offset = Number(req.query.offset) || 0;

        const [countRes, dataRes] = await Promise.all([
          pool.query(`SELECT COUNT(*) FROM ${table} WHERE content_domain='paramedic'`),
          pool.query(
            `SELECT * FROM ${table}
             WHERE content_domain='paramedic'
             ORDER BY updated_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
          ),
        ]);

        return {
          items: dataRes.rows.map(snakeToCamel),
          total: Number(countRes.rows[0].count),
          limit,
          offset,
        };
      })
    );

    /* ===== GET ONE ===== */
    app.get(`/api/paramedic-seo/${type}/:id`, (req, res) =>
      adminHandler(req, res, async () => {
        const r = await pool.query(
          `SELECT * FROM ${table} WHERE id=$1`,
          [req.params.id]
        );

        if (!r.rows.length) throw new Error("Not found");

        return snakeToCamel(r.rows[0]);
      })
    );

    /* ===== CREATE ===== */
    app.post(`/api/paramedic-seo/${type}`, (req, res) =>
      adminHandler(req, res, async () => {

        if (!req.body.slug) throw new Error("slug required");

        const exists = await pool.query(
          `SELECT id FROM ${table} WHERE slug=$1`,
          [req.body.slug]
        );

        if (exists.rows.length) throw new Error("Slug exists");

        const result = await pool.query(
          `INSERT INTO ${table} (slug, content_domain, created_at, updated_at)
           VALUES ($1,'paramedic',NOW(),NOW())
           RETURNING *`,
          [req.body.slug]
        );

        return snakeToCamel(result.rows[0]);
      })
    );

    /* ===== DELETE ===== */
    app.delete(`/api/paramedic-seo/${type}/:id`, (req, res) =>
      adminHandler(req, res, async () => {
        await pool.query(`DELETE FROM ${table} WHERE id=$1`, [req.params.id]);
        return { ok: true };
      })
    );

    /* ===== PUBLIC ===== */
    app.get(`/api/paramedic-seo/public/${type}/:slug`, async (req, res) => {
      const r = await pool.query(
        `SELECT * FROM ${table}
         WHERE slug=$1 AND status='published'`,
        [req.params.slug]
      );

      if (!r.rows.length) return res.status(404).json({ error: "Not found" });

      res.json(snakeToCamel(r.rows[0]));
    });
  }

  /* =========================
     STATS (PARALLELIZED)
  ========================= */

  app.get("/api/paramedic-seo/stats", (req, res) =>
    adminHandler(req, res, async () => {

      const results = await Promise.all(
        CONTENT_TYPES.map(type =>
          pool.query(
            `SELECT status, COUNT(*) FROM ${TABLE_MAP[type]}
             WHERE content_domain='paramedic'
             GROUP BY status`
          )
        )
      );

      const stats: any = {};

      CONTENT_TYPES.forEach((type, i) => {
        const obj: any = {};
        for (const row of results[i].rows) {
          obj[row.status] = Number(row.count);
        }
        stats[type] = obj;
      });

      return stats;
    })
  );

}
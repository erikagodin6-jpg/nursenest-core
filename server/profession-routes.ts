import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";

export function registerProfessionRoutes(app: Express) {
  app.get("/api/professions", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM professions WHERE status IN ('active', 'launched') ORDER BY sort_order ASC, name ASC`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/professions/all", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const result = await pool.query(
        `SELECT * FROM professions ORDER BY sort_order ASC, name ASC`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/professions/:slug", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM professions WHERE slug = $1`,
        [req.params.slug]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Profession not found" });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/professions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { name, shortName, slug, description, icon, color, colorAccent, routePrefix, examNames, domains, tiers, modules, pricing, country, status, sortOrder, imageUrl, hubTitle, hubDescription } = req.body;

      if (!name || !slug || !routePrefix) {
        return res.status(400).json({ error: "name, slug, and routePrefix are required" });
      }

      const existing = await pool.query(`SELECT id FROM professions WHERE slug = $1`, [slug]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "A profession with this slug already exists" });
      }

      const result = await pool.query(
        `INSERT INTO professions (name, short_name, slug, description, icon, color, color_accent, route_prefix, exam_names, domains, tiers, modules, pricing, country, status, sort_order, image_url, hub_title, hub_description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         RETURNING *`,
        [
          name, shortName || name, slug, description || "", icon || "BookOpen",
          color || "#6C63FF", colorAccent || "#E8E6FF", routePrefix,
          examNames || [], domains || [],
          JSON.stringify(tiers || []),
          JSON.stringify(modules || { lessons: true, flashcards: true, practiceExams: true, adaptiveExams: true, imageAssets: true, seoPages: true, studyPacks: true }),
          JSON.stringify(pricing || {}),
          country || "ALL", status || "draft", sortOrder || 0,
          imageUrl || null, hubTitle || null, hubDescription || null,
        ]
      );

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/professions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { id } = req.params;
      const fields = req.body;

      const setClauses: string[] = [];
      const values: any[] = [];
      let idx = 1;

      const allowedFields: Record<string, string> = {
        name: "name", shortName: "short_name", slug: "slug",
        description: "description", icon: "icon", color: "color",
        colorAccent: "color_accent", routePrefix: "route_prefix",
        examNames: "exam_names", domains: "domains",
        country: "country", status: "status", sortOrder: "sort_order",
        imageUrl: "image_url", hubTitle: "hub_title", hubDescription: "hub_description",
      };

      const jsonFields: Record<string, string> = {
        tiers: "tiers", modules: "modules", pricing: "pricing",
      };

      for (const [camel, snake] of Object.entries(allowedFields)) {
        if (fields[camel] !== undefined) {
          setClauses.push(`${snake} = $${idx}`);
          values.push(fields[camel]);
          idx++;
        }
      }
      for (const [camel, snake] of Object.entries(jsonFields)) {
        if (fields[camel] !== undefined) {
          setClauses.push(`${snake} = $${idx}`);
          values.push(JSON.stringify(fields[camel]));
          idx++;
        }
      }

      if (setClauses.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      setClauses.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE professions SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Profession not found" });
      }

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/professions/:id/launch", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `UPDATE professions SET status = 'launched', launched_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Profession not found" });
      }

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/professions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `DELETE FROM professions WHERE id = $1 RETURNING id`,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Profession not found" });
      }

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/professions/:id/analytics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const prof = await pool.query(`SELECT * FROM professions WHERE id = $1`, [req.params.id]);
      if (prof.rows.length === 0) return res.status(404).json({ error: "Not found" });

      const p = prof.rows[0];

      const questionsResult = await pool.query(
        `SELECT COUNT(*)::int AS count FROM exam_questions WHERE career_type = $1`,
        [p.slug]
      ).catch(() => ({ rows: [{ count: 0 }] }));

      const importsResult = await pool.query(
        `SELECT COUNT(*)::int AS count, COALESCE(SUM(imported_rows), 0)::int AS imported FROM question_bank_imports WHERE profession_slug = $1`,
        [p.slug]
      ).catch(() => ({ rows: [{ count: 0, imported: 0 }] }));

      res.json({
        profession: snakeToCamel(p),
        questionCount: questionsResult.rows[0]?.count || 0,
        importCount: importsResult.rows[0]?.count || 0,
        totalImported: importsResult.rows[0]?.imported || 0,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/occupational-therapy/stats", async (_req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'occupationalTherapy' AND status IN ('approved', 'pending')) as question_count,
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'occupationalTherapy' AND status IN ('approved', 'pending') AND blueprint_category IS NOT NULL) as lesson_count,
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'occupationalTherapy' AND status IN ('approved', 'pending')) as flashcard_count,
          0 as exam_count
      `);
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.json({ questionCount: 0, lessonCount: 0, flashcardCount: 0, examCount: 0 });
    }
  });

  app.get("/api/physical-therapy/stats", async (_req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'physicalTherapy' AND status IN ('approved', 'pending')) as question_count,
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'physicalTherapy' AND status IN ('approved', 'pending') AND blueprint_category IS NOT NULL) as lesson_count,
          (SELECT COUNT(*) FROM allied_questions WHERE career_type = 'physicalTherapy' AND status IN ('approved', 'pending')) as flashcard_count,
          0 as exam_count
      `);
      res.json(snakeToCamel(rows[0]));
    } catch (e: any) {
      res.json({ questionCount: 0, lessonCount: 0, flashcardCount: 0, examCount: 0 });
    }
  });
}

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

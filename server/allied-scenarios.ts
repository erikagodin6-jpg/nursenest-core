import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function registerScenarioRoutes(app: Express) {
  app.get("/api/allied/scenarios", async (req, res) => {
    try {
      const { category, difficulty, professionTrack, limit, offset } = req.query;
      let query = `SELECT * FROM paramedic_scenarios WHERE content_domain = 'paramedic' AND status = 'published'`;
      const params: any[] = [];
      let idx = 1;

      if (category) {
        query += ` AND category = $${idx++}`;
        params.push(category);
      }
      if (difficulty) {
        query += ` AND difficulty = $${idx++}`;
        params.push(parseInt(difficulty as string));
      }
      if (professionTrack) {
        query += ` AND profession_track = $${idx++}`;
        params.push(professionTrack);
      }

      query += ` ORDER BY created_at DESC`;

      if (limit) {
        query += ` LIMIT $${idx++}`;
        params.push(parseInt(limit as string));
      }
      if (offset) {
        query += ` OFFSET $${idx++}`;
        params.push(parseInt(offset as string));
      }

      const result = await pool.query(query, params);

      let countQuery = `SELECT COUNT(*) as total FROM paramedic_scenarios WHERE content_domain = 'paramedic' AND status = 'published'`;
      const countParams: any[] = [];
      let countIdx = 1;
      if (category) {
        countQuery += ` AND category = $${countIdx++}`;
        countParams.push(category);
      }
      if (difficulty) {
        countQuery += ` AND difficulty = $${countIdx++}`;
        countParams.push(parseInt(difficulty as string));
      }
      if (professionTrack) {
        countQuery += ` AND profession_track = $${countIdx++}`;
        countParams.push(professionTrack);
      }
      const countResult = await pool.query(countQuery, countParams);

      res.json({
        scenarios: result.rows.map(snakeToCamel),
        total: parseInt(countResult.rows[0]?.total || "0"),
      });
    } catch (e: any) {
      console.error("Scenarios list error:", e);
      res.status(500).json({ error: "Failed to retrieve scenarios" });
    }
  });

  app.get("/api/allied/scenarios/by-slug/:slug", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM paramedic_scenarios WHERE slug = $1 AND content_domain = 'paramedic' AND status = 'published'`,
        [req.params.slug]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Get scenario by slug error:", e);
      res.status(500).json({ error: "Failed to retrieve scenario" });
    }
  });

  app.get("/api/allied/scenarios/:id", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM paramedic_scenarios WHERE id = $1 AND content_domain = 'paramedic' AND status = 'published'`,
        [req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Get scenario error:", e);
      res.status(500).json({ error: "Failed to retrieve scenario" });
    }
  });

  app.get("/api/allied/scenarios/categories/list", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT DISTINCT category, COUNT(*) as count FROM paramedic_scenarios WHERE content_domain = 'paramedic' AND status = 'published' GROUP BY category ORDER BY category`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/allied/scenarios", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const {
        title, dispatchInfo, sceneDescription, sceneSafety,
        primaryAssessment, secondaryAssessment, vitalSigns, history,
        decisionPoints, correctInterventions, commonErrors, debrief,
        learningObjectives, category, relatedLessonSlugs,
        professionTrack, region, visibilityTier, difficulty,
        examRelevance, status
      } = req.body;

      if (!title || !dispatchInfo || !sceneDescription || !sceneSafety || !primaryAssessment || !secondaryAssessment) {
        return res.status(400).json({ error: "Missing required fields: title, dispatchInfo, sceneDescription, sceneSafety, primaryAssessment, secondaryAssessment" });
      }

      const slug = slugify(title);

      const existing = await pool.query(`SELECT id FROM paramedic_scenarios WHERE slug = $1`, [slug]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "A scenario with this slug already exists" });
      }

      const result = await pool.query(
        `INSERT INTO paramedic_scenarios (
          id, title, slug, content_domain, profession_track, region, visibility_tier,
          difficulty, exam_relevance, category, dispatch_info, scene_description,
          scene_safety, primary_assessment, secondary_assessment, vital_signs,
          history, decision_points, correct_interventions, common_errors,
          debrief, learning_objectives, related_lesson_slugs, status,
          created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, 'paramedic', $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW(), NOW()
        ) RETURNING *`,
        [
          title, slug, professionTrack || "General", region || "BOTH",
          visibilityTier || "free", difficulty || 3, examRelevance || "medium",
          category || "Medical Emergencies", dispatchInfo, sceneDescription,
          sceneSafety, primaryAssessment, secondaryAssessment,
          JSON.stringify(vitalSigns || {}), JSON.stringify(history || {}),
          JSON.stringify(decisionPoints || []),
          correctInterventions || [], commonErrors || [],
          debrief || "", learningObjectives || [], relatedLessonSlugs || [],
          status || "draft"
        ]
      );

      res.status(201).json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Create scenario error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/allied/scenarios/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const existing = await pool.query(`SELECT * FROM paramedic_scenarios WHERE id = $1 AND content_domain = 'paramedic'`, [req.params.id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ error: "Scenario not found" });
      }

      const {
        title, dispatchInfo, sceneDescription, sceneSafety,
        primaryAssessment, secondaryAssessment, vitalSigns, history,
        decisionPoints, correctInterventions, commonErrors, debrief,
        learningObjectives, category, relatedLessonSlugs,
        professionTrack, region, visibilityTier, difficulty,
        examRelevance, status
      } = req.body;

      const slug = title ? slugify(title) : existing.rows[0].slug;

      const result = await pool.query(
        `UPDATE paramedic_scenarios SET
          title = COALESCE($1, title),
          slug = $2,
          profession_track = COALESCE($3, profession_track),
          region = COALESCE($4, region),
          visibility_tier = COALESCE($5, visibility_tier),
          difficulty = COALESCE($6, difficulty),
          exam_relevance = COALESCE($7, exam_relevance),
          category = COALESCE($8, category),
          dispatch_info = COALESCE($9, dispatch_info),
          scene_description = COALESCE($10, scene_description),
          scene_safety = COALESCE($11, scene_safety),
          primary_assessment = COALESCE($12, primary_assessment),
          secondary_assessment = COALESCE($13, secondary_assessment),
          vital_signs = COALESCE($14, vital_signs),
          history = COALESCE($15, history),
          decision_points = COALESCE($16, decision_points),
          correct_interventions = COALESCE($17, correct_interventions),
          common_errors = COALESCE($18, common_errors),
          debrief = COALESCE($19, debrief),
          learning_objectives = COALESCE($20, learning_objectives),
          related_lesson_slugs = COALESCE($21, related_lesson_slugs),
          status = COALESCE($22, status),
          updated_at = NOW()
        WHERE id = $23
        RETURNING *`,
        [
          title || null, slug, professionTrack || null, region || null,
          visibilityTier || null, difficulty || null, examRelevance || null,
          category || null, dispatchInfo || null, sceneDescription || null,
          sceneSafety || null, primaryAssessment || null, secondaryAssessment || null,
          vitalSigns ? JSON.stringify(vitalSigns) : null,
          history ? JSON.stringify(history) : null,
          decisionPoints ? JSON.stringify(decisionPoints) : null,
          correctInterventions || null, commonErrors || null,
          debrief || null, learningObjectives || null, relatedLessonSlugs || null,
          status || null, req.params.id
        ]
      );

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Update scenario error:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/allied/scenarios/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`DELETE FROM paramedic_scenarios WHERE id = $1 AND content_domain = 'paramedic' RETURNING id`, [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json({ ok: true, deletedId: req.params.id });
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/allied/scenarios/:id/status", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { status } = req.body;
      if (!["draft", "published", "archived"].includes(status)) {
        return res.status(400).json({ error: "Status must be draft, published, or archived" });
      }

      const result = await pool.query(
        `UPDATE paramedic_scenarios SET status = $1, updated_at = NOW() WHERE id = $2 AND content_domain = 'paramedic' RETURNING *`,
        [status, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/allied/scenarios/admin/all", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { status, category, search } = req.query;
      let query = `SELECT * FROM paramedic_scenarios WHERE content_domain = 'paramedic'`;
      const params: any[] = [];
      let idx = 1;

      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }
      if (category) {
        query += ` AND category = $${idx++}`;
        params.push(category);
      }
      if (search) {
        query += ` AND (title ILIKE $${idx} OR dispatch_info ILIKE $${idx} OR scene_description ILIKE $${idx})`;
        params.push(`%${search}%`);
        idx++;
      }

      query += ` ORDER BY updated_at DESC`;

      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
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

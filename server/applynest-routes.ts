import type { Express } from "express";
import { z } from "zod";
import { pool } from "./storage";
import { validateBody } from "./validate-request";

const applynestLeadCaptureSchema = z.object({
  email: z.string().trim().email().max(254),
  profession: z.string().trim().max(200).optional().nullable(),
});

export function registerApplyNestRoutes(app: Express) {
  app.get("/api/applynest/career-profiles", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM applynest_career_profiles WHERE status = 'published' ORDER BY profession_label ASC`
      );
      res.json(result.rows.map(mapCareerProfile));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applynest/career-profiles/:profession", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM applynest_career_profiles WHERE profession = $1 AND status = 'published'`,
        [req.params.profession]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Career profile not found" });
      }
      res.json(mapCareerProfile(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applynest/resume-templates", async (req, res) => {
    try {
      const { category, profession } = req.query;
      let query = `SELECT * FROM applynest_resume_templates WHERE status = 'published'`;
      const params: any[] = [];
      let idx = 1;
      if (category) { query += ` AND category = $${idx++}`; params.push(category); }
      if (profession) { query += ` AND (profession = $${idx++} OR profession IS NULL)`; params.push(profession); }
      query += ` ORDER BY created_at DESC`;
      const result = await pool.query(query, params);
      res.json(result.rows.map(mapResumeTemplate));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applynest/interview-questions", async (req, res) => {
    try {
      const { category, profession, questionType } = req.query;
      let query = `SELECT * FROM applynest_interview_questions WHERE status = 'published'`;
      const params: any[] = [];
      let idx = 1;
      if (category) { query += ` AND category = $${idx++}`; params.push(category); }
      if (profession) { query += ` AND (profession = $${idx++} OR profession IS NULL)`; params.push(profession); }
      if (questionType) { query += ` AND question_type = $${idx++}`; params.push(questionType); }
      query += ` ORDER BY category, difficulty`;
      const result = await pool.query(query, params);
      res.json(result.rows.map(mapInterviewQuestion));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applynest/career-guides", async (req, res) => {
    try {
      const { category } = req.query;
      let query = `SELECT * FROM applynest_career_guides WHERE status = 'published'`;
      const params: any[] = [];
      if (category) { query += ` AND category = $1`; params.push(category); }
      query += ` ORDER BY created_at DESC`;
      const result = await pool.query(query, params);
      res.json(result.rows.map(mapCareerGuide));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/applynest/career-guides/:slug", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM applynest_career_guides WHERE slug = $1 AND status = 'published'`,
        [req.params.slug]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Guide not found" });
      }
      res.json(mapCareerGuide(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/applynest/lead-capture", validateBody(applynestLeadCaptureSchema), async (req, res) => {
    try {
      const { email, profession } = req.body as z.infer<typeof applynestLeadCaptureSchema>;
      const trimmed = email.trim().toLowerCase();
      await pool.query(
        `INSERT INTO applynest_leads (email, profession, source)
         VALUES ($1, $2, 'applynest')
         ON CONFLICT (email) DO UPDATE SET profession = COALESCE($2, applynest_leads.profession)`,
        [trimmed, profession ?? null]
      );
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

function mapCareerProfile(row: any) {
  return {
    id: row.id,
    profession: row.profession,
    professionLabel: row.profession_label,
    jobMarketOverview: row.job_market_overview,
    salaryRangeJson: row.salary_range_json,
    topEmployers: row.top_employers,
    licensingRequirements: row.licensing_requirements,
    resumeTips: row.resume_tips,
    interviewQuestions: row.interview_questions,
    firstJobChecklist: row.first_job_checklist,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapResumeTemplate(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    profession: row.profession,
    description: row.description,
    templateContent: row.template_content,
    tips: row.tips,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInterviewQuestion(row: any) {
  return {
    id: row.id,
    question: row.question,
    category: row.category,
    profession: row.profession,
    sampleAnswer: row.sample_answer,
    tips: row.tips,
    difficulty: row.difficulty,
    questionType: row.question_type,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapCareerGuide(row: any) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    summary: row.summary,
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

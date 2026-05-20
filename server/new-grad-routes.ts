import type { Express, Request, Response } from "express";
import { pool } from "./storage";
import { requireAdmin, resolveAuthUser } from "./admin-auth";
import { generateNewGradGuide } from "./content-generators";
import { checkEntitlement, requireEntitlement } from "./entitlements";
import { logPaywallAudit } from "./admin-auth";

/* =========================
   HELPERS
========================= */

function auditAccess(req: Request, user: any, feature: string, granted: boolean) {
  logPaywallAudit({
    userId: user?.id || "anonymous",
    role: user?.tier || "free",
    tier: user?.tier || "free",
    subscriptionStatus: user?.subscription_status || "none",
    resourcePath: req.originalUrl,
    contentTier: feature,
    granted,
  });
}

function json(res: Response, data: any) {
  res.json(data);
}

function error(res: Response, message: string, code = 500) {
  res.status(code).json({ error: message });
}

/* =========================
   CORE ROUTES
========================= */

export function registerNewGradRoutes(app: Express) {

  /* ===== ADMIN: GENERATE GUIDE ===== */

  app.post("/api/admin/new-grad/generate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { guideType, topic, profession } = req.body;
      if (!guideType || !topic || !profession) {
        return error(res, "Missing required fields", 400);
      }

      const generated = await generateNewGradGuide(
        guideType,
        topic,
        profession,
        topic
      );

      const exists = await pool.query(
        `SELECT id FROM new_grad_guides WHERE slug=$1`,
        [generated.slug]
      );

      if (exists.rows.length) {
        return error(res, "Guide already exists", 409);
      }

      const result = await pool.query(
        `INSERT INTO new_grad_guides
         (id,title,slug,profession,guide_type,category,summary,content,sections,seo_title,seo_description,seo_keywords,status,tags,author_name,created_at)
         VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published',$12,$13,NOW())
         RETURNING *`,
        [
          generated.title,
          generated.slug,
          generated.profession,
          generated.guideType,
          generated.category,
          generated.summary,
          JSON.stringify(generated.content),
          JSON.stringify(generated.sections),
          generated.seoTitle,
          generated.seoDescription,
          generated.seoKeywords,
          generated.tags,
          generated.authorName,
        ]
      );

      json(res, { ok: true, guide: result.rows[0] });

    } catch (e: any) {
      error(res, e.message);
    }
  });

  /* ===== PUBLIC: GET GUIDES ===== */

  app.get("/api/new-grad/guides", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      const hasAccess = user ? checkEntitlement(user, "newgrad_toolkit") : false;

      // List: omit heavy JSON (content, sections, faq); detail lives on GET /guides/:slug.
      // Deferred: ?profession=... is sent by some clients but values may not match DB profession; filter in SQL once mapped.
      const result = await pool.query(
        `SELECT id, title, slug, profession, guide_type, category, summary, is_premium, status, tags, author_name,
                seo_title, seo_description, seo_keywords, published_at, created_at, updated_at
         FROM new_grad_guides
         WHERE status = 'published'
         ORDER BY created_at DESC
         LIMIT 200`,
      );

      const guides = result.rows.map((g: Record<string, unknown>) => {
        if (g.is_premium && !hasAccess) {
          return {
            id: g.id,
            title: g.title,
            slug: g.slug,
            summary: g.summary,
            locked: true,
            is_premium: true,
          };
        }
        return g;
      });

      json(res, guides);

    } catch (e: any) {
      error(res, e.message);
    }
  });

  /* ===== SINGLE GUIDE ===== */

  app.get("/api/new-grad/guides/:slug", async (req, res) => {
    try {
      const user = await resolveAuthUser(req);
      const hasAccess = user ? checkEntitlement(user, "newgrad_toolkit") : false;

      const result = await pool.query(
        `SELECT * FROM new_grad_guides WHERE slug=$1 AND status='published'`,
        [req.params.slug]
      );

      if (!result.rows.length) return error(res, "Not found", 404);

      const guide = result.rows[0];

      if (guide.is_premium && !hasAccess) {
        auditAccess(req, user, "newgrad_toolkit", false);
        return res.status(403).json({
          error: "Premium required",
          locked: true,
          guide: {
            id: guide.id,
            title: guide.title,
            summary: guide.summary,
          },
        });
      }

      auditAccess(req, user, "newgrad_toolkit", true);
      json(res, guide);

    } catch (e: any) {
      error(res, e.message);
    }
  });

  /* ===== LEAD CAPTURE ===== */

  app.post("/api/new-grad/lead", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return error(res, "Email required", 400);

      await pool.query(
        `INSERT INTO email_subscribers (id,email,created_at)
         VALUES (gen_random_uuid(),$1,NOW())
         ON CONFLICT (email) DO NOTHING`,
        [email.toLowerCase()]
      );

      json(res, { ok: true });

    } catch (e: any) {
      error(res, e.message);
    }
  });

  /* ===== PREMIUM CONTENT ===== */

  app.get(
    "/api/new-grad/premium/interview",
    requireEntitlement("newgrad_full_interview_bank"),
    async (_req, res) => {
      try {
        const result = await pool.query(
          `SELECT id, category, question, sample_answer, tips, difficulty, is_premium, status, sort_order, created_at
           FROM new_grad_interview_questions
           WHERE status = 'published'
           ORDER BY sort_order ASC, created_at ASC
           LIMIT 500`,
        );
        json(res, result.rows);
      } catch (e: any) {
        error(res, e.message);
      }
    }
  );
}
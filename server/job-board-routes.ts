import type { Express, Request, Response } from "express";
import { storage, pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import { parseAdminPaginationParams, buildAdminPaginationMeta } from "./pagination-query";

function snakeToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map((item) => snakeToCamel(item));
  if (obj === null || typeof obj !== "object") return obj;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

type AdminJobPreset = { forceFeatured?: boolean; forceExpired?: boolean };

/** Public list/card fields only — omits description, apply URLs, JSON blobs (detail: `/api/jobs/by-slug/:slug`). */
const PUBLIC_JOB_LIST_SQL = `
  SELECT id, slug, title, employer, profession, location, employment_type, experience_level, specialty,
         salary_min, salary_max, salary_currency, status, featured, posted_at, expires_at, created_at
  FROM job_listings`;

async function queryPublicJobListings(params: {
  location?: string;
  profession?: string;
  experienceLevel?: string;
  search?: string;
  limit: number;
  offset: number;
}): Promise<{ rows: unknown[]; total: number }> {
  const conditions: string[] = [`status = 'published'`];
  const qparams: unknown[] = [];
  let p = 1;
  if (params.location) {
    conditions.push(`location = $${p++}`);
    qparams.push(params.location);
  }
  if (params.profession) {
    conditions.push(`profession = $${p++}`);
    qparams.push(params.profession);
  }
  if (params.experienceLevel) {
    conditions.push(`experience_level = $${p++}`);
    qparams.push(params.experienceLevel);
  }
  if (params.search && params.search.trim()) {
    conditions.push(`(title ILIKE $${p} OR description ILIKE $${p} OR employer ILIKE $${p})`);
    qparams.push(`%${params.search.trim()}%`);
    p++;
  }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const countR = await pool.query(`SELECT COUNT(*)::int AS total FROM job_listings ${where}`, qparams);
  const total = countR.rows[0]?.total ?? 0;
  const dataR = await pool.query(
    `${PUBLIC_JOB_LIST_SQL} ${where} ORDER BY featured DESC, posted_at DESC NULLS LAST LIMIT $${p} OFFSET $${p + 1}`,
    [...qparams, params.limit, params.offset],
  );
  return { rows: dataR.rows.map((row) => snakeToCamel(row)), total };
}

async function serveAdminJobListings(req: Request, res: Response, preset: AdminJobPreset) {
  try {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { page, limit, offset } = parseAdminPaginationParams(req.query);
    const conditions: string[] = [];
    const params: unknown[] = [];
    let p = 1;

    if (preset.forceFeatured) {
      conditions.push(`featured = true`);
      conditions.push(`status = 'published'`);
    } else if (req.query.featured === "true") {
      conditions.push(`featured = true`);
    } else if (req.query.featured === "false") {
      conditions.push(`featured = false`);
    }

    if (preset.forceExpired) {
      conditions.push(`expires_at IS NOT NULL AND expires_at < NOW()`);
    } else if (req.query.expired === "true") {
      conditions.push(`expires_at IS NOT NULL AND expires_at < NOW()`);
    }

    if (req.query.status && String(req.query.status).trim().length > 0) {
      conditions.push(`status = $${p++}`);
      params.push(String(req.query.status).trim());
    }

    if (req.query.search && String(req.query.search).trim().length > 0) {
      // Filter in SQL; description is not selected on the list payload (large text).
      conditions.push(
        `(title ILIKE $${p} OR description ILIKE $${p} OR employer ILIKE $${p})`,
      );
      params.push(`%${String(req.query.search).trim()}%`);
      p++;
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countR = await pool.query(`SELECT COUNT(*)::int AS total FROM job_listings ${whereClause}`, params);
    const total = countR.rows[0]?.total ?? 0;

    // Columns aligned with migrations/job_listings (employer, salary_* — not company_name / salary_range).
    const dataR = await pool.query(
      `SELECT id, slug, title, employer, profession, location, employment_type, specialty,
              salary_min, salary_max, salary_currency, status, featured, posted_at, expires_at, created_at
       FROM job_listings ${whereClause}
       ORDER BY featured DESC, posted_at DESC NULLS LAST
       LIMIT $${p} OFFSET $${p + 1}`,
      [...params, limit, offset],
    );

    res.json({
      items: dataR.rows.map((row) => snakeToCamel(row)),
      pagination: buildAdminPaginationMeta(page, limit, total),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[JobBoard] Admin job listings error:", message);
    res.status(500).json({ error: "Failed to fetch job listings" });
  }
}

export function registerJobBoardRoutes(app: Express) {
  app.get("/api/jobs", async (req, res) => {
    try {
      const { location, profession, experienceLevel, search, page, limit: limitParam } = req.query;
      const limit = Math.min(parseInt(String(limitParam || "20")), 50);
      const pageNum = Math.max(parseInt(String(page || "1")), 1);
      const offset = (pageNum - 1) * limit;

      const result = await queryPublicJobListings({
        location: location ? String(location) : undefined,
        profession: profession ? String(profession) : undefined,
        experienceLevel: experienceLevel ? String(experienceLevel) : undefined,
        search: search ? String(search) : undefined,
        limit,
        offset,
      });

      res.json({
        jobs: result.rows,
        total: result.total,
        page: pageNum,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error: any) {
      console.error("[JobBoard] Error fetching jobs:", error.message);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/featured", async (_req, res) => {
    try {
      const featuredR = await pool.query(
        `${PUBLIC_JOB_LIST_SQL} WHERE status = 'published' AND featured = true
         ORDER BY posted_at DESC NULLS LAST LIMIT 6`,
      );
      res.json(featuredR.rows.map((row) => snakeToCamel(row)));
    } catch (error: any) {
      console.error("[JobBoard] Error fetching featured jobs:", error.message);
      res.status(500).json({ error: "Failed to fetch featured jobs" });
    }
  });

  app.get("/api/jobs/filters", async (_req, res) => {
    try {
      const locationsResult = await pool.query(
        `SELECT DISTINCT location FROM job_listings WHERE status = 'published' ORDER BY location`
      );
      const professionsResult = await pool.query(
        `SELECT DISTINCT profession FROM job_listings WHERE status = 'published' ORDER BY profession`
      );
      const specialtiesResult = await pool.query(
        `SELECT DISTINCT specialty FROM job_listings WHERE status = 'published' AND specialty IS NOT NULL ORDER BY specialty`
      );

      res.json({
        locations: locationsResult.rows.map((r: any) => r.location),
        professions: professionsResult.rows.map((r: any) => r.profession),
        specialties: specialtiesResult.rows.map((r: any) => r.specialty),
        experienceLevels: ["new_grad", "entry_level", "1_2_years"],
      });
    } catch (error: any) {
      console.error("[JobBoard] Error fetching filters:", error.message);
      res.status(500).json({ error: "Failed to fetch filters" });
    }
  });

  app.get("/api/jobs/by-slug/:slug", async (req, res) => {
    try {
      const job = await storage.getJobListingBySlug(req.params.slug);
      if (!job || job.status !== "published") {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      console.error("[JobBoard] Error fetching job:", error.message);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.get("/api/jobs/all-slugs", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT slug FROM job_listings WHERE status = 'published' ORDER BY posted_at DESC`
      );
      res.json(result.rows.map((r: any) => r.slug));
    } catch (error: any) {
      console.error("[JobBoard] Error fetching slugs:", error.message);
      res.status(500).json({ error: "Failed to fetch slugs" });
    }
  });

  app.post("/api/jobs/seed", async (req, res) => {
    try {
      if (process.env.NODE_ENV !== "development") {
        return res.status(403).json({ error: "Seed endpoint is only available in development" });
      }
      const { seedJobListings } = await import("./job-board-listings-seed");
      const count = await seedJobListings();
      res.json({ success: true, count });
    } catch (error: any) {
      console.error("[JobBoard] Error seeding jobs:", error.message);
      res.status(500).json({ error: "Failed to seed jobs" });
    }
  });

  // Admin: paginated job listings (filters + LIMIT/OFFSET in SQL). Audit path aliases included.
  app.get("/api/admin/job-listings", (req, res) => serveAdminJobListings(req, res, {}));
  app.get("/api/admin/employer-jobs", (req, res) => serveAdminJobListings(req, res, {}));
  app.get("/api/admin/featured-employers", (req, res) => serveAdminJobListings(req, res, { forceFeatured: true }));
  app.get("/api/admin/expired", (req, res) => serveAdminJobListings(req, res, { forceExpired: true }));
}

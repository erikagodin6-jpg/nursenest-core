import { pool } from "./storage";

/**
 * Development-only seed for `job_listings`.
 * The legacy `job-board-seed.ts` file is a bundle-size audit CLI, not listing data.
 */
export async function seedJobListings(): Promise<number> {
  const rows = [
    {
      slug: "sample-rn-toronto",
      title: "Registered Nurse — Medical Unit (Sample)",
      description: "Sample dev listing for NurseNest job board smoke tests.",
      employer: "Sample Health System",
      profession: "rn",
      location: "Toronto, ON",
      employment_type: "full_time",
      experience_level: "new_grad",
      specialty: "medical",
      salary_min: 85000,
      salary_max: 98000,
      salary_currency: "CAD",
      status: "published",
      featured: true,
    },
  ];

  let inserted = 0;
  for (const r of rows) {
    try {
      const res = await pool.query(
        `INSERT INTO job_listings (
           id, slug, title, description, employer, profession, location, employment_type, experience_level, specialty,
           salary_min, salary_max, salary_currency, status, featured, posted_at, created_at
         ) VALUES (
           gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
         )
         ON CONFLICT (slug) DO NOTHING`,
        [
          r.slug,
          r.title,
          r.description,
          r.employer,
          r.profession,
          r.location,
          r.employment_type,
          r.experience_level,
          r.specialty,
          r.salary_min,
          r.salary_max,
          r.salary_currency,
          r.status,
          r.featured,
        ]
      );
      if (res.rowCount && res.rowCount > 0) inserted += res.rowCount;
    } catch (e) {
      console.warn("[JobBoard] Seed row skipped:", e instanceof Error ? e.message : e);
    }
  }
  return inserted;
}

import fs from "node:fs";
import pg from "pg";

const env = fs.readFileSync(".env", "utf8");
const m = env.match(/^DATABASE_URL=(.+)$/m);
if (!m) throw new Error("DATABASE_URL missing in .env");

const pool = new pg.Pool({
  connectionString: m[1].trim(),
  ssl: { rejectUnauthorized: false },
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS mock_exam_templates (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT NOT NULL UNIQUE,
    exam_code TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    template_name TEXT NOT NULL,
    description TEXT,
    question_count INTEGER NOT NULL,
    time_limit_minutes INTEGER NOT NULL,
    difficulty_distribution JSONB NOT NULL,
    domain_weights JSONB NOT NULL,
    format_mix JSONB NOT NULL,
    passing_standard INTEGER DEFAULT 65,
    seed INTEGER DEFAULT 0,
    tier TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  )
`);

await pool.query(
  `INSERT INTO mock_exam_templates
    (template_id, exam_code, exam_name, template_name, description, question_count, time_limit_minutes, difficulty_distribution, domain_weights, format_mix, passing_standard, seed, tier, active)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
   ON CONFLICT (template_id) DO UPDATE SET active = true, updated_at = NOW()`,
  [
    "local-rn-template-01",
    "RN",
    "NCLEX-RN",
    "Local RN Template",
    "Local dev template",
    25,
    60,
    JSON.stringify({ foundational: 0.3, moderate: 0.5, difficult: 0.2 }),
    JSON.stringify([{ domain: "Management of Care", weight: 0.2 }]),
    JSON.stringify({ mcqSingle: 0.7, selectAllThatApply: 0.2, scenarioBased: 0.1 }),
    65,
    1,
    "rn",
    true,
  ],
);

await pool.end();
console.log("template_upserted:local-rn-template-01");

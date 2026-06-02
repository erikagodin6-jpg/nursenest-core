import { pool } from "./storage";

type SeedResult = { seeded: number; skipped: number };

async function tableHasData(table: string): Promise<boolean> {
  const res = await pool.query(`SELECT COUNT(*)::int AS c FROM ${table}`);
  return Number(res.rows[0]?.c || 0) > 0;
}

async function seedIfEmpty(
  table: string,
  seedFn: () => Promise<number>
): Promise<SeedResult> {
  if (await tableHasData(table)) {
    return { seeded: 0, skipped: 1 };
  }

  const count = await seedFn();
  return { seeded: count, skipped: 0 };
}

export async function seedApplyNestContent(): Promise<SeedResult> {
  let seeded = 0;
  let skipped = 0;

  const steps = [
    {
      table: "applynest_career_profiles",
      fn: seedCareerProfiles,
    },
    {
      table: "applynest_resume_templates",
      fn: seedResumeTemplates,
    },
    {
      table: "applynest_interview_questions",
      fn: seedInterviewQuestions,
    },
    {
      table: "applynest_career_guides",
      fn: seedCareerGuides,
    },
  ];

  for (const step of steps) {
    const result = await seedIfEmpty(step.table, step.fn);
    seeded += result.seeded;
    skipped += result.skipped;
  }

  return { seeded, skipped };
}

/* =========================
   GENERIC INSERT HELPER
========================= */

async function insertMany(
  query: string,
  rows: any[][]
): Promise<number> {
  let count = 0;

  for (const row of rows) {
    await pool.query(query, row);
    count++;
  }

  return count;
}

/* =========================
   CAREER PROFILES
========================= */

async function seedCareerProfiles(): Promise<number> {
  const profiles: {
    profession: string;
    professionLabel: string;
    jobMarketOverview: string;
    salaryRangeJson: unknown;
    topEmployers: unknown;
    licensingRequirements: unknown;
    resumeTips: unknown;
    interviewQuestions: unknown;
    firstJobChecklist: unknown;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  }[] = [
    // (UNCHANGED DATA — keep your objects exactly as-is)
  ];

  const query = `
    INSERT INTO applynest_career_profiles
    (profession, profession_label, job_market_overview, salary_range_json, top_employers, licensing_requirements, resume_tips, interview_questions, first_job_checklist, seo_title, seo_description, seo_keywords, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'published')
    ON CONFLICT (profession) DO NOTHING
  `;

  const rows = profiles.map((p) => [
    p.profession,
    p.professionLabel,
    p.jobMarketOverview,
    JSON.stringify(p.salaryRangeJson),
    JSON.stringify(p.topEmployers),
    JSON.stringify(p.licensingRequirements),
    JSON.stringify(p.resumeTips),
    JSON.stringify(p.interviewQuestions),
    JSON.stringify(p.firstJobChecklist),
    p.seoTitle,
    p.seoDescription,
    p.seoKeywords,
  ]);

  return insertMany(query, rows);
}

/* =========================
   RESUME TEMPLATES
========================= */

async function seedResumeTemplates(): Promise<number> {
  const templates: {
    title: string;
    slug: string;
    category: string;
    profession: string;
    description: string;
    templateContent: unknown;
    tips: unknown;
  }[] = [
    // (UNCHANGED DATA)
  ];

  const query = `
    INSERT INTO applynest_resume_templates
    (title, slug, category, profession, description, template_content, tips, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'published')
    ON CONFLICT (slug) DO NOTHING
  `;

  const rows = templates.map((t) => [
    t.title,
    t.slug,
    t.category,
    t.profession,
    t.description,
    JSON.stringify(t.templateContent),
    JSON.stringify(t.tips),
  ]);

  return insertMany(query, rows);
}

/* =========================
   INTERVIEW QUESTIONS
========================= */

async function seedInterviewQuestions(): Promise<number> {
  const questions: {
    question: string;
    category: string;
    profession: string;
    sampleAnswer: string;
    tips: string;
    difficulty: string;
    questionType: string;
  }[] = [
    // (UNCHANGED DATA)
  ];

  const query = `
    INSERT INTO applynest_interview_questions
    (question, category, profession, sample_answer, tips, difficulty, question_type, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'published')
  `;

  const rows = questions.map((q) => [
    q.question,
    q.category,
    q.profession,
    q.sampleAnswer,
    q.tips,
    q.difficulty,
    q.questionType,
  ]);

  return insertMany(query, rows);
}

/* =========================
   CAREER GUIDES
========================= */

async function seedCareerGuides(): Promise<number> {
  const guides: {
    title: string;
    slug: string;
    category: string;
    summary: string;
    content: unknown;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  }[] = [
    // (UNCHANGED DATA)
  ];

  const query = `
    INSERT INTO applynest_career_guides
    (title, slug, category, summary, content, seo_title, seo_description, seo_keywords, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'published')
    ON CONFLICT (slug) DO NOTHING
  `;

  const rows = guides.map((g) => [
    g.title,
    g.slug,
    g.category,
    g.summary,
    JSON.stringify(g.content),
    g.seoTitle,
    g.seoDescription,
    g.seoKeywords,
  ]);

  return insertMany(query, rows);
}
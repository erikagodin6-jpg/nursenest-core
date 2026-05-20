import OpenAI from "openai";
import type { Pool, QueryResult } from "pg";
import { getProdPool } from "./db";

interface LessonSection {
  type: string;
  content?: string;
  items?: string[];
}

interface LessonRow {
  id: string;
  title: string;
  category: string;
  slug: string;
}

function getOpenAI(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

const MIN_SECTION_COUNT = 10;
const MIN_PARAGRAPH_LENGTH = 120;
const MIN_LIST_ITEMS = 3;
const MAX_RETRIES = 2;
const REQUIRED_SECTIONS = [
  "Overview",
  "Advanced Pathophysiology",
  "Clinical Presentation",
  "Diagnostic Workup",
  "Differential Diagnosis",
  "Management Plan",
  "Prescribing Considerations",
  "Clinical Pearls",
  "Common Exam Pitfalls",
  "Evidence-Based Guidelines",
];

function validateSections(
  sections: LessonSection[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!sections || sections.length < MIN_SECTION_COUNT) {
    errors.push(`Insufficient sections: ${sections?.length || 0}`);
  }

  const headings = sections
    .filter((s) => s.type === "heading")
    .map((s) => (s.content || "").toLowerCase());
  for (const req of REQUIRED_SECTIONS) {
    if (!headings.some((h) => h.includes(req.toLowerCase()))) {
      errors.push(`Missing section: ${req}`);
    }
  }

  for (const s of sections) {
    if (
      s.type === "paragraph" &&
      (!s.content || s.content.length < MIN_PARAGRAPH_LENGTH)
    ) {
      errors.push(`Paragraph too short: ${s.content?.length || 0} chars`);
    }
    if (s.type === "list" && (!s.items || s.items.length < MIN_LIST_ITEMS)) {
      errors.push(`List too short: ${s.items?.length || 0} items`);
    }
  }

  return { valid: errors.length === 0, errors };
}

async function upgradeLesson(
  pool: Pool,
  openai: OpenAI,
  lesson: LessonRow,
  retryCount = 0
): Promise<boolean> {
  const prompt = `You are a Nurse Practitioner educator. Generate rich lesson content for: "${lesson.title}" (Domain: ${lesson.category})

Return JSON with this structure:
{
  "sections": [
    {"type": "heading", "content": "Overview"},
    {"type": "paragraph", "content": "Comprehensive overview 150+ words covering clinical significance, epidemiology, and relevance to NP practice and AANP/ANCC exams."},
    {"type": "heading", "content": "Advanced Pathophysiology"},
    {"type": "paragraph", "content": "Detailed pathophysiology 200+ words at advanced practice level with cellular/molecular mechanisms."},
    {"type": "heading", "content": "Clinical Presentation"},
    {"type": "list", "items": ["6-8 specific signs/symptoms with clinical detail and pathophysiological basis"]},
    {"type": "heading", "content": "Diagnostic Workup"},
    {"type": "list", "items": ["6-8 specific tests with normal values, interpretation, and when to order"]},
    {"type": "heading", "content": "Differential Diagnosis"},
    {"type": "list", "items": ["5-6 differentials with key distinguishing features"]},
    {"type": "heading", "content": "Management Plan"},
    {"type": "paragraph", "content": "200+ words covering first-line treatment, second-line options, non-pharmacologic interventions, and follow-up."},
    {"type": "heading", "content": "Prescribing Considerations"},
    {"type": "list", "items": ["5-6 specific medications with drug name, dose, route, frequency, monitoring parameters, contraindications"]},
    {"type": "heading", "content": "Clinical Pearls"},
    {"type": "list", "items": ["6-8 high-yield exam pearls specific to this topic"]},
    {"type": "heading", "content": "Common Exam Pitfalls"},
    {"type": "list", "items": ["5-6 specific mistakes students make on this topic"]},
    {"type": "heading", "content": "Evidence-Based Guidelines"},
    {"type": "list", "items": ["4-5 specific guideline references with organization name and key recommendations"]}
  ]
}

Include specific drug names/doses (e.g., metoprolol 25-100mg PO BID), lab values with reference ranges, and guideline references (USPSTF, AHA/ACC, ADA, CDC). All content must be clinically accurate.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3500,
    });

    const raw = JSON.parse(response.choices[0]?.message?.content || "{}");
    const validation = validateSections(raw.sections);

    if (!validation.valid) {
      if (retryCount < MAX_RETRIES) {
        console.warn(
          `[Upgrade] Validation failed for "${lesson.title}" (attempt ${retryCount + 1}): ${validation.errors.join("; ")}. Retrying...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return upgradeLesson(pool, openai, lesson, retryCount + 1);
      }
      console.error(
        `[Upgrade] ✗ Rejected "${lesson.title}" after ${MAX_RETRIES + 1} attempts: ${validation.errors.join("; ")}`
      );
      return false;
    }

    const summary =
      raw.sections
        .find((s: LessonSection) => s.type === "paragraph")
        ?.content?.substring(0, 300) || "";

    await pool.query(
      `UPDATE content_items SET content = $1::jsonb, summary = $2, updated_at = NOW(), updated_by_ai = true WHERE id = $3`,
      [JSON.stringify(raw.sections), summary, lesson.id]
    );
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (retryCount < MAX_RETRIES) {
      console.warn(
        `[Upgrade] Error for "${lesson.title}" (attempt ${retryCount + 1}): ${message}. Retrying...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 2000 * (retryCount + 1))
      );
      return upgradeLesson(pool, openai, lesson, retryCount + 1);
    }
    console.error(
      `[Upgrade] Error for "${lesson.title}" after retries:`,
      message
    );
    return false;
  }
}

async function main(): Promise<void> {
  const pool = getProdPool();
  const openai = getOpenAI();
  const args = process.argv.slice(2);
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 50;
  const concurrency = 3;

  const result: QueryResult<LessonRow> = await pool.query(
    `SELECT id, title, category, slug FROM content_items 
     WHERE tier = 'np' AND type = 'lesson' AND status = 'published' AND (updated_by_ai IS NULL OR updated_by_ai = false)
     ORDER BY title LIMIT $1`,
    [limit]
  );

  console.log(`[Upgrade] Found ${result.rows.length} lessons to upgrade`);

  let upgraded = 0;
  let failed = 0;

  for (let i = 0; i < result.rows.length; i += concurrency) {
    const chunk = result.rows.slice(i, i + concurrency);
    const results = await Promise.all(
      chunk.map((l) => upgradeLesson(pool, openai, l))
    );
    for (const ok of results) {
      if (ok) upgraded++;
      else failed++;
    }
    console.log(
      `[Upgrade] Progress: ${upgraded} upgraded, ${failed} failed (${i + chunk.length}/${result.rows.length})`
    );
  }

  console.log(`\n[Upgrade] Complete: ${upgraded} upgraded, ${failed} failed`);
  process.exit(0);
}

main();

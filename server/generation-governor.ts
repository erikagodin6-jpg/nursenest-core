import { pool } from "./storage";
import crypto from "crypto";
import {
  GENERATION_DEFAULTS,
  getTierLabel,
  type ContentTypeId,
} from "./universal-content-registry";

export interface GovernorCheck {
  allowed: boolean;
  reason?: string;
}

export interface GenerationRunLog {
  id: string;
  topic: string;
  tier: string;
  contentType: ContentTypeId;
  batchSize: number;
  generatedCount: number;
  validatedCount: number;
  insertedCount: number;
  rejectedCount: number;
  duplicatesSkipped: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
  status: "running" | "completed" | "failed";
}

export async function ensureGovernorTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS generation_run_logs (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      topic TEXT NOT NULL,
      tier TEXT NOT NULL,
      content_type TEXT NOT NULL,
      batch_size INTEGER DEFAULT 5,
      generated_count INTEGER DEFAULT 0,
      validated_count INTEGER DEFAULT 0,
      inserted_count INTEGER DEFAULT 0,
      rejected_count INTEGER DEFAULT 0,
      duplicates_skipped INTEGER DEFAULT 0,
      errors JSONB DEFAULT '[]',
      status TEXT DEFAULT 'running',
      started_at TIMESTAMP DEFAULT NOW(),
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS generation_daily_counts (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      date_key TEXT NOT NULL,
      tier TEXT NOT NULL,
      content_type TEXT NOT NULL,
      count INTEGER DEFAULT 0,
      UNIQUE(date_key, tier, content_type)
    )
  `);
}

export function enforceBatchSize(requested: number): number {
  const { default: defaultSize, max } = GENERATION_DEFAULTS.batchSize;
  if (!requested || requested < 1) return defaultSize;
  return Math.min(requested, max);
}

export async function checkDailyCap(
  tier: string,
  contentType: ContentTypeId,
): Promise<GovernorCheck> {
  const dateKey = new Date().toISOString().slice(0, 10);
  const cap = GENERATION_DEFAULTS.dailyCaps[contentType] || 100;

  try {
    const r = await pool.query(
      "SELECT count FROM generation_daily_counts WHERE date_key = $1 AND tier = $2 AND content_type = $3",
      [dateKey, tier, contentType],
    );

    const current = r.rows[0]?.count || 0;
    if (current >= cap) {
      return {
        allowed: false,
        reason: `Daily generation cap reached for ${getTierLabel(tier)} ${contentType}: ${current}/${cap}`,
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export async function incrementDailyCount(
  tier: string,
  contentType: ContentTypeId,
  count: number,
): Promise<void> {
  const dateKey = new Date().toISOString().slice(0, 10);
  try {
    await pool.query(
      `INSERT INTO generation_daily_counts (id, date_key, tier, content_type, count)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (date_key, tier, content_type) DO UPDATE SET count = generation_daily_counts.count + $5`,
      [crypto.randomUUID(), dateKey, tier, contentType, count],
    );
  } catch (e) {
    console.warn("[Governor] Failed to increment daily count:", e);
  }
}

export async function checkDuplicateQuestion(stem: string): Promise<boolean> {
  try {
    const normalized = stem.toLowerCase().trim().substring(0, 200);
    const r = await pool.query(
      "SELECT id FROM exam_questions WHERE LOWER(SUBSTRING(stem, 1, 200)) = $1 LIMIT 1",
      [normalized],
    );
    if (r.rows.length > 0) return true;

    const r2 = await pool.query(
      "SELECT id FROM allied_questions WHERE LOWER(SUBSTRING(stem, 1, 200)) = $1 LIMIT 1",
      [normalized],
    );
    return r2.rows.length > 0;
  } catch {
    return false;
  }
}

export async function checkDuplicateFlashcard(front: string): Promise<boolean> {
  try {
    const r = await pool.query(
      "SELECT id FROM flashcard_bank WHERE LOWER(front) = LOWER($1) LIMIT 1",
      [front.trim()],
    );
    return r.rows.length > 0;
  } catch {
    return false;
  }
}

export async function checkDuplicateLesson(title: string): Promise<boolean> {
  try {
    const r = await pool.query(
      "SELECT id FROM lessons WHERE LOWER(title) = LOWER($1) LIMIT 1",
      [title.trim()],
    );
    return r.rows.length > 0;
  } catch {
    return false;
  }
}

export async function checkDuplicateBlogArticle(title: string): Promise<boolean> {
  try {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const r = await pool.query(
      "SELECT id FROM seo_articles WHERE LOWER(title) = LOWER($1) OR slug LIKE $2 LIMIT 1",
      [title.trim(), `%${slug}%`],
    );
    return r.rows.length > 0;
  } catch {
    return false;
  }
}

export interface QualityGateResult {
  passed: boolean;
  issues: string[];
}

export function qualityGateQuestion(item: any): QualityGateResult {
  const issues: string[] = [];

  if (!item.stem || item.stem.length < 40) {
    issues.push("Stem too short (min 40 chars)");
  }

  if (!item.rationale && !item.correctReasoning) {
    issues.push("Missing rationale - no question publishes without a rationale");
  }

  const rationale = typeof item.rationale === "object"
    ? item.rationale?.correctReasoning || ""
    : item.rationale || "";
  if (rationale.length < 10) {
    issues.push("Rationale too short (min 10 chars)");
  }

  if (!Array.isArray(item.choices) && !Array.isArray(item.options)) {
    issues.push("Missing answer choices");
  }

  const choices = item.choices || item.options || [];
  if (choices.length < 4) {
    issues.push("Fewer than 4 answer choices");
  }

  if (!item.correct_answers && !item.correctAnswers && !item.correctAnswer) {
    issues.push("Missing correct answer");
  }

  return { passed: issues.length === 0, issues };
}

export function qualityGateFlashcard(front: string, back: string): QualityGateResult {
  const issues: string[] = [];
  if (!front || front.trim().length < 10) issues.push("Front text too short (min 10 chars)");
  if (!back || back.trim().length < 15) issues.push("Back text too short (min 15 chars)");
  if (front.trim().toLowerCase() === back.trim().toLowerCase()) issues.push("Front and back are identical");
  return { passed: issues.length === 0, issues };
}

export function qualityGateLesson(title: string, content: any): QualityGateResult {
  const issues: string[] = [];
  if (!title || title.trim().length < 5) issues.push("Title too short");
  const sections = content?.sections || content?.blocks || [];
  if (sections.length < 3) issues.push("Too few sections (min 3)");
  return { passed: issues.length === 0, issues };
}

export function qualityGateBlogArticle(title: string, content: string, wordCount: number): QualityGateResult {
  const issues: string[] = [];
  if (!title || title.trim().length < 10) issues.push("Title too short");
  if (wordCount < 1200) issues.push(`Word count too low: ${wordCount} (min 1200)`);
  if (wordCount > 2500) issues.push(`Word count too high: ${wordCount} (max 2500)`);

  const headings = (content || "").match(/^#{1,3}\s+.+$/gm) || [];
  if (headings.length < 3) issues.push("Too few headings (min 3 H2/H3 sections)");

  return { passed: issues.length === 0, issues };
}

export async function createRunLog(params: {
  topic: string;
  tier: string;
  contentType: ContentTypeId;
  batchSize: number;
}): Promise<string> {
  const id = crypto.randomUUID();
  try {
    await pool.query(
      `INSERT INTO generation_run_logs (id, topic, tier, content_type, batch_size, status, started_at)
       VALUES ($1, $2, $3, $4, $5, 'running', NOW())`,
      [id, params.topic, params.tier, params.contentType, params.batchSize],
    );
  } catch (e) {
    console.warn("[Governor] Failed to create run log:", e);
  }
  return id;
}

export async function updateRunLog(
  id: string,
  updates: Partial<{
    generatedCount: number;
    validatedCount: number;
    insertedCount: number;
    rejectedCount: number;
    duplicatesSkipped: number;
    errors: string[];
    status: "running" | "completed" | "failed";
  }>,
): Promise<void> {
  const setClauses: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (updates.generatedCount !== undefined) { setClauses.push(`generated_count = $${idx++}`); params.push(updates.generatedCount); }
  if (updates.validatedCount !== undefined) { setClauses.push(`validated_count = $${idx++}`); params.push(updates.validatedCount); }
  if (updates.insertedCount !== undefined) { setClauses.push(`inserted_count = $${idx++}`); params.push(updates.insertedCount); }
  if (updates.rejectedCount !== undefined) { setClauses.push(`rejected_count = $${idx++}`); params.push(updates.rejectedCount); }
  if (updates.duplicatesSkipped !== undefined) { setClauses.push(`duplicates_skipped = $${idx++}`); params.push(updates.duplicatesSkipped); }
  if (updates.errors !== undefined) { setClauses.push(`errors = $${idx++}`); params.push(JSON.stringify(updates.errors)); }
  if (updates.status !== undefined) {
    setClauses.push(`status = $${idx++}`);
    params.push(updates.status);
    if (updates.status === "completed" || updates.status === "failed") {
      setClauses.push(`completed_at = NOW()`);
    }
  }

  if (setClauses.length === 0) return;

  params.push(id);
  try {
    await pool.query(
      `UPDATE generation_run_logs SET ${setClauses.join(", ")} WHERE id = $${idx}`,
      params,
    );
  } catch (e) {
    console.warn("[Governor] Failed to update run log:", e);
  }
}

export async function getRunLogs(limit: number = 50): Promise<any[]> {
  try {
    const r = await pool.query(
      "SELECT * FROM generation_run_logs ORDER BY started_at DESC LIMIT $1",
      [Math.min(limit, 200)],
    );
    return r.rows.map((row: any) => ({
      id: row.id,
      topic: row.topic,
      tier: row.tier,
      contentType: row.content_type,
      batchSize: row.batch_size,
      generatedCount: row.generated_count,
      validatedCount: row.validated_count,
      insertedCount: row.inserted_count,
      rejectedCount: row.rejected_count,
      duplicatesSkipped: row.duplicates_skipped,
      errors: row.errors || [],
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
    }));
  } catch {
    return [];
  }
}

export async function getDailyCounts(): Promise<any[]> {
  const dateKey = new Date().toISOString().slice(0, 10);
  try {
    const r = await pool.query(
      "SELECT tier, content_type, count FROM generation_daily_counts WHERE date_key = $1",
      [dateKey],
    );
    return r.rows.map((row: any) => ({
      tier: row.tier,
      contentType: row.content_type,
      count: row.count,
    }));
  } catch {
    return [];
  }
}

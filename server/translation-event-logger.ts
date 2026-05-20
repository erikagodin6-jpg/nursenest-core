import { pool } from "./storage";

export type TranslationEventType =
  | "missing_key"
  | "language_mismatch"
  | "language_validated"
  | "fallback_trigger"
  | "ai_generation_failure"
  | "ai_generation_success"
  | "language_rejected"
  | "scanner_run";

export type TranslationEventSeverity = "info" | "warning" | "error" | "critical";

interface LogTranslationEventParams {
  eventType: TranslationEventType;
  contentType?: string;
  contentId?: string;
  language?: string;
  generatorName?: string;
  generationId?: string;
  severity?: TranslationEventSeverity;
  details?: Record<string, any>;
}

let tableEnsured = false;

async function ensureTable(): Promise<void> {
  if (tableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS translation_events (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type TEXT NOT NULL,
        content_type TEXT,
        content_id TEXT,
        language TEXT,
        generator_name TEXT,
        generation_id TEXT,
        severity TEXT DEFAULT 'info',
        details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_events_type ON translation_events(event_type)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_events_created ON translation_events(created_at)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_events_language ON translation_events(language)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_events_generator ON translation_events(generator_name)
    `);
    tableEnsured = true;
  } catch (e: any) {
    if (e.code === "42P07" || e.message?.includes("already exists")) {
      tableEnsured = true;
    } else {
      console.error("[TranslationEventLogger] Failed to ensure table:", e.message);
    }
  }
}

export async function logTranslationEvent(params: LogTranslationEventParams): Promise<void> {
  try {
    await ensureTable();
    await pool.query(
      `INSERT INTO translation_events (event_type, content_type, content_id, language, generator_name, generation_id, severity, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        params.eventType,
        params.contentType || null,
        params.contentId || null,
        params.language || null,
        params.generatorName || null,
        params.generationId || null,
        params.severity || "info",
        JSON.stringify(params.details || {}),
      ]
    );
  } catch (e: any) {
    console.error("[TranslationEventLogger] Failed to log event:", e.message);
  }
}

export async function getTranslationEventSummary(hours: number = 24): Promise<{
  totalEvents: number;
  byType: Record<string, number>;
  byLanguage: Record<string, number>;
  bySeverity: Record<string, number>;
  byGenerator: Record<string, number>;
  recentMismatches: Array<{
    language: string;
    generatorName: string;
    details: any;
    createdAt: string;
  }>;
  mismatchRate: number;
  failureRate: number;
}> {
  await ensureTable();

  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [totals, byType, byLang, bySev, byGen, mismatches, successCount, failureCount] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int as total FROM translation_events WHERE created_at >= $1`,
      [cutoff]
    ),
    pool.query(
      `SELECT event_type, COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 GROUP BY event_type ORDER BY count DESC`,
      [cutoff]
    ),
    pool.query(
      `SELECT language, COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 AND language IS NOT NULL GROUP BY language ORDER BY count DESC`,
      [cutoff]
    ),
    pool.query(
      `SELECT severity, COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 GROUP BY severity ORDER BY count DESC`,
      [cutoff]
    ),
    pool.query(
      `SELECT generator_name, COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 AND generator_name IS NOT NULL GROUP BY generator_name ORDER BY count DESC`,
      [cutoff]
    ),
    pool.query(
      `SELECT language, generator_name, details, created_at FROM translation_events WHERE created_at >= $1 AND event_type IN ('language_mismatch', 'language_rejected') ORDER BY created_at DESC LIMIT 20`,
      [cutoff]
    ),
    pool.query(
      `SELECT COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 AND event_type IN ('ai_generation_success', 'language_validated')`,
      [cutoff]
    ),
    pool.query(
      `SELECT COUNT(*)::int as count FROM translation_events WHERE created_at >= $1 AND event_type IN ('ai_generation_failure', 'language_mismatch', 'language_rejected')`,
      [cutoff]
    ),
  ]);

  const totalEvents = totals.rows[0]?.total || 0;
  const successes = successCount.rows[0]?.count || 0;
  const failures = failureCount.rows[0]?.count || 0;
  const totalAttempts = successes + failures;

  return {
    totalEvents,
    byType: Object.fromEntries(byType.rows.map((r: any) => [r.event_type, r.count])),
    byLanguage: Object.fromEntries(byLang.rows.map((r: any) => [r.language, r.count])),
    bySeverity: Object.fromEntries(bySev.rows.map((r: any) => [r.severity, r.count])),
    byGenerator: Object.fromEntries(byGen.rows.map((r: any) => [r.generator_name, r.count])),
    recentMismatches: mismatches.rows.map((r: any) => ({
      language: r.language,
      generatorName: r.generator_name,
      details: r.details,
      createdAt: r.created_at,
    })),
    mismatchRate: totalAttempts > 0 ? failures / totalAttempts : 0,
    failureRate: totalAttempts > 0 ? failures / totalAttempts : 0,
  };
}

export async function getTranslationCoverageMetrics(): Promise<{
  perLanguage: Record<string, { totalContent: number; translatedContent: number; coveragePct: number }>;
  perContentType: Record<string, { totalContent: number; translatedContent: number; coveragePct: number }>;
}> {
  await ensureTable();

  const langResult = await pool.query(
    `SELECT language_code, COUNT(DISTINCT content_id)::int as translated_count
     FROM content_translations
     GROUP BY language_code`
  );

  const totalResult = await pool.query(
    `SELECT COUNT(*)::int as total FROM (
       SELECT DISTINCT content_id FROM content_translations
       UNION
       SELECT id as content_id FROM exam_questions WHERE status = 'published' LIMIT 1000
     ) t`
  );

  const contentTypeResult = await pool.query(
    `SELECT content_type, COUNT(DISTINCT content_id)::int as translated_count
     FROM content_translations
     GROUP BY content_type`
  );

  const totalContentByType = await pool.query(
    `SELECT 'exam_question' as content_type, COUNT(*)::int as total FROM exam_questions WHERE status = 'published'
     UNION ALL
     SELECT 'content_item' as content_type, COUNT(*)::int as total FROM content_items WHERE status = 'published'`
  );

  const totalByType: Record<string, number> = {};
  for (const r of totalContentByType.rows) {
    totalByType[r.content_type] = r.total;
  }

  const totalContent = totalResult.rows[0]?.total || 1;
  const perLanguage: Record<string, any> = {};
  for (const r of langResult.rows) {
    perLanguage[r.language_code] = {
      totalContent,
      translatedContent: r.translated_count,
      coveragePct: Math.round((r.translated_count / totalContent) * 100 * 10) / 10,
    };
  }

  const perContentType: Record<string, any> = {};
  for (const r of contentTypeResult.rows) {
    const total = totalByType[r.content_type] || 1;
    perContentType[r.content_type] = {
      totalContent: total,
      translatedContent: r.translated_count,
      coveragePct: Math.round((r.translated_count / total) * 100 * 10) / 10,
    };
  }

  return { perLanguage, perContentType };
}

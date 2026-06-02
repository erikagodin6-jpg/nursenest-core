import { pool } from "./storage";

export type LanguageEnforcementEventType =
  | "validation_failure"
  | "language_mismatch"
  | "fallback_activation"
  | "retry"
  | "scanner_violation"
  | "isolation_enforced";

export interface LanguageEnforcementEvent {
  eventType: LanguageEnforcementEventType;
  contentType?: string;
  contentId?: string;
  expectedLanguage: string;
  detectedLanguage?: string;
  detail?: string;
  source?: string;
}

const recentEventsBuffer: Array<LanguageEnforcementEvent & { timestamp: string }> = [];
const MAX_BUFFER = 500;

export function logLanguageEvent(event: LanguageEnforcementEvent) {
  const entry = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  console.log(
    `[LANG-ENFORCE] ${entry.eventType} | expected=${entry.expectedLanguage} detected=${entry.detectedLanguage || "n/a"} | contentType=${entry.contentType || "n/a"} contentId=${entry.contentId || "n/a"} | ${entry.detail || ""} | source=${entry.source || "server"}`
  );

  recentEventsBuffer.push(entry);
  if (recentEventsBuffer.length > MAX_BUFFER) {
    recentEventsBuffer.shift();
  }

  persistEvent(entry).catch((e) => {
    console.error("[LANG-ENFORCE] Failed to persist event:", e.message);
  });
}

async function persistEvent(event: LanguageEnforcementEvent & { timestamp: string }) {
  try {
    await pool.query(
      `INSERT INTO language_enforcement_events
       (id, event_type, content_type, content_id, expected_language, detected_language, detail, source, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        event.eventType,
        event.contentType || null,
        event.contentId || null,
        event.expectedLanguage,
        event.detectedLanguage || null,
        event.detail || null,
        event.source || "server",
        event.timestamp,
      ]
    );
  } catch {
  }
}

export function getRecentEvents(limit = 100): Array<LanguageEnforcementEvent & { timestamp: string }> {
  return recentEventsBuffer.slice(-limit).reverse();
}

export async function getEventStats(hoursBack = 24): Promise<{
  totalEvents: number;
  validationFailures: number;
  languageMismatches: number;
  fallbackActivations: number;
  retries: number;
  scannerViolations: number;
  isolationEnforced: number;
  byHour: Array<{ hour: string; count: number; eventType: string }>;
  topContentTypes: Array<{ contentType: string; count: number }>;
  topLanguages: Array<{ language: string; count: number }>;
}> {
  try {
    const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

    const totalsResult = await pool.query(
      `SELECT event_type, COUNT(*)::int as count
       FROM language_enforcement_events
       WHERE created_at >= $1
       GROUP BY event_type`,
      [cutoff]
    );

    const totalsMap: Record<string, number> = {};
    let totalEvents = 0;
    for (const row of totalsResult.rows) {
      totalsMap[row.event_type] = row.count;
      totalEvents += row.count;
    }

    const byHourResult = await pool.query(
      `SELECT
         to_char(date_trunc('hour', created_at), 'YYYY-MM-DD HH24:00') as hour,
         event_type,
         COUNT(*)::int as count
       FROM language_enforcement_events
       WHERE created_at >= $1
       GROUP BY hour, event_type
       ORDER BY hour DESC`,
      [cutoff]
    );

    const topContentResult = await pool.query(
      `SELECT content_type, COUNT(*)::int as count
       FROM language_enforcement_events
       WHERE created_at >= $1 AND content_type IS NOT NULL
       GROUP BY content_type
       ORDER BY count DESC
       LIMIT 10`,
      [cutoff]
    );

    const topLangResult = await pool.query(
      `SELECT expected_language as language, COUNT(*)::int as count
       FROM language_enforcement_events
       WHERE created_at >= $1
       GROUP BY expected_language
       ORDER BY count DESC
       LIMIT 10`,
      [cutoff]
    );

    return {
      totalEvents,
      validationFailures: totalsMap["validation_failure"] || 0,
      languageMismatches: totalsMap["language_mismatch"] || 0,
      fallbackActivations: totalsMap["fallback_activation"] || 0,
      retries: totalsMap["retry"] || 0,
      scannerViolations: totalsMap["scanner_violation"] || 0,
      isolationEnforced: totalsMap["isolation_enforced"] || 0,
      byHour: byHourResult.rows.map((r: any) => ({
        hour: r.hour,
        count: r.count,
        eventType: r.event_type,
      })),
      topContentTypes: topContentResult.rows.map((r: any) => ({
        contentType: r.content_type,
        count: r.count,
      })),
      topLanguages: topLangResult.rows.map((r: any) => ({
        language: r.language,
        count: r.count,
      })),
    };
  } catch (e: any) {
    console.error("[LANG-ENFORCE] getEventStats error:", e.message);
    return {
      totalEvents: 0,
      validationFailures: 0,
      languageMismatches: 0,
      fallbackActivations: 0,
      retries: 0,
      scannerViolations: 0,
      isolationEnforced: 0,
      byHour: [],
      topContentTypes: [],
      topLanguages: [],
    };
  }
}

export async function getRecentEventsPersisted(limit = 50): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT id, event_type, content_type, content_id, expected_language, detected_language, detail, source, created_at
       FROM language_enforcement_events
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export async function ensureLanguageEnforcementTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS language_enforcement_events (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type TEXT NOT NULL,
        content_type TEXT,
        content_id TEXT,
        expected_language TEXT NOT NULL,
        detected_language TEXT,
        detail TEXT,
        source TEXT DEFAULT 'server',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_lang_enforce_created ON language_enforcement_events (created_at DESC)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_lang_enforce_type ON language_enforcement_events (event_type)
    `);
  } catch (e: any) {
    console.error("[LANG-ENFORCE] Table creation error:", e.message);
  }
}

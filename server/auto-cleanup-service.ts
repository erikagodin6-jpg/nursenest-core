import { pool } from "./storage";

export interface CleanupResult {
  runType: string;
  status: "success" | "partial" | "failed";
  itemsScanned: number;
  itemsCleaned: number;
  itemsFlagged: number;
  details: CleanupDetail[];
  durationMs: number;
  error?: string;
}

export interface CleanupDetail {
  category: string;
  action: "removed" | "flagged" | "repaired" | "skipped";
  entityType: string;
  entityId: string;
  description: string;
}

export interface CleanupReport {
  id: string;
  runType: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  itemsScanned: number;
  itemsCleaned: number;
  itemsFlagged: number;
  details: CleanupDetail[];
  triggeredBy: string;
  errorMessage: string | null;
}

async function ensureCleanupTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cleanup_reports (
      id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
      run_type text NOT NULL,
      status text NOT NULL DEFAULT 'running',
      started_at timestamp NOT NULL DEFAULT NOW(),
      completed_at timestamp,
      duration_ms integer,
      items_scanned integer DEFAULT 0,
      items_cleaned integer DEFAULT 0,
      items_flagged integer DEFAULT 0,
      details jsonb DEFAULT '[]'::jsonb,
      triggered_by text DEFAULT 'system',
      error_message text
    )
  `);
}

export async function getCleanupReports(limit: number = 20): Promise<CleanupReport[]> {
  await ensureCleanupTable();
  const result = await pool.query(
    `SELECT * FROM cleanup_reports ORDER BY started_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows.map((r: any) => ({
    id: r.id,
    runType: r.run_type,
    status: r.status,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    durationMs: r.duration_ms,
    itemsScanned: r.items_scanned,
    itemsCleaned: r.items_cleaned,
    itemsFlagged: r.items_flagged,
    details: r.details || [],
    triggeredBy: r.triggered_by,
    errorMessage: r.error_message,
  }));
}

async function saveCleanupReport(result: CleanupResult, triggeredBy: string): Promise<string> {
  await ensureCleanupTable();
  const res = await pool.query(
    `INSERT INTO cleanup_reports (run_type, status, completed_at, duration_ms, items_scanned, items_cleaned, items_flagged, details, triggered_by, error_message)
     VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [result.runType, result.status, result.durationMs, result.itemsScanned, result.itemsCleaned, result.itemsFlagged, JSON.stringify(result.details), triggeredBy, result.error || null]
  );
  return res.rows[0].id;
}

async function safeCleanupStep(
  label: string,
  fn: () => Promise<{ scanned: number; cleaned: number; flagged: number; details: CleanupDetail[] }>,
  errors: string[]
): Promise<{ scanned: number; cleaned: number; flagged: number; details: CleanupDetail[] }> {
  try {
    return await fn();
  } catch (err: any) {
    errors.push(`[${label}] ${err.message}`);
    return { scanned: 0, cleaned: 0, flagged: 0, details: [] };
  }
}

export async function cleanOrphanedContent(triggeredBy: string = "system"): Promise<CleanupResult> {
  const startTime = Date.now();
  const details: CleanupDetail[] = [];
  let scanned = 0;
  let cleaned = 0;
  let flagged = 0;
  const errors: string[] = [];

  const steps = [
    await safeCleanupStep("orphan_flashcards", async () => {
      const r = await pool.query(
        `SELECT df.id, df.front FROM deck_flashcards df LEFT JOIN flashcard_decks fd ON fd.id = df.deck_id WHERE fd.id IS NULL LIMIT 100`
      );
      const d: CleanupDetail[] = r.rows.map((fc: any) => ({
        category: "orphan_flashcard", action: "flagged" as const, entityType: "deck_flashcards",
        entityId: fc.id, description: `Flashcard "${(fc.front || "").substring(0, 50)}" has no parent deck`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),

    await safeCleanupStep("orphan_submissions", async () => {
      const r = await pool.query(
        `SELECT s.id FROM assignment_submissions s LEFT JOIN assignments a ON a.id = s.assignment_id WHERE a.id IS NULL LIMIT 100`
      );
      if (r.rows.length > 0) {
        const ids = r.rows.map((row: any) => row.id);
        await pool.query(`DELETE FROM assignment_submissions WHERE id = ANY($1)`, [ids]);
        return { scanned: ids.length, cleaned: ids.length, flagged: 0, details: [{
          category: "orphan_submission", action: "removed" as const, entityType: "assignment_submissions",
          entityId: ids.join(","), description: `Removed ${ids.length} orphaned assignment submissions`,
        }] };
      }
      return { scanned: 0, cleaned: 0, flagged: 0, details: [] };
    }, errors),

    await safeCleanupStep("orphan_enrollments", async () => {
      const r = await pool.query(
        `SELECT cs.id FROM classroom_students cs LEFT JOIN classrooms c ON c.id = cs.classroom_id WHERE c.id IS NULL LIMIT 100`
      );
      if (r.rows.length > 0) {
        const ids = r.rows.map((row: any) => row.id);
        await pool.query(`DELETE FROM classroom_students WHERE id = ANY($1)`, [ids]);
        return { scanned: ids.length, cleaned: ids.length, flagged: 0, details: [{
          category: "orphan_enrollment", action: "removed" as const, entityType: "classroom_students",
          entityId: ids.join(","), description: `Removed ${ids.length} orphaned classroom enrollments`,
        }] };
      }
      return { scanned: 0, cleaned: 0, flagged: 0, details: [] };
    }, errors),

    await safeCleanupStep("orphan_audio_links", async () => {
      const r = await pool.query(
        `SELECT lal.id FROM lesson_audio_links lal LEFT JOIN audio_clips ac ON ac.id = lal.audio_clip_id WHERE ac.id IS NULL LIMIT 100`
      );
      if (r.rows.length > 0) {
        const ids = r.rows.map((row: any) => row.id);
        await pool.query(`DELETE FROM lesson_audio_links WHERE id = ANY($1)`, [ids]);
        return { scanned: ids.length, cleaned: ids.length, flagged: 0, details: [{
          category: "orphan_audio_link", action: "removed" as const, entityType: "lesson_audio_links",
          entityId: ids.join(","), description: `Removed ${ids.length} orphaned lesson audio links`,
        }] };
      }
      return { scanned: 0, cleaned: 0, flagged: 0, details: [] };
    }, errors),
  ];

  for (const step of steps) {
    scanned += step.scanned;
    cleaned += step.cleaned;
    flagged += step.flagged;
    details.push(...step.details);
  }

  const status = errors.length > 0 ? (details.length > 0 ? "partial" : "failed") : "success";
  const result: CleanupResult = {
    runType: "orphaned_content",
    status,
    itemsScanned: scanned,
    itemsCleaned: cleaned,
    itemsFlagged: flagged,
    details,
    durationMs: Date.now() - startTime,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
  await saveCleanupReport(result, triggeredBy);
  return result;
}

export async function detectBrokenReferences(triggeredBy: string = "system"): Promise<CleanupResult> {
  const startTime = Date.now();
  const details: CleanupDetail[] = [];
  let scanned = 0;
  let flagged = 0;
  const errors: string[] = [];

  const steps = [
    await safeCleanupStep("broken_lesson_refs", async () => {
      const r = await pool.query(
        `SELECT l.id, l.slug, l.related_lesson_slugs FROM lessons l
         WHERE l.related_lesson_slugs IS NOT NULL AND array_length(l.related_lesson_slugs, 1) > 0 LIMIT 500`
      );
      let s = 0, f = 0;
      const d: CleanupDetail[] = [];
      for (const lesson of r.rows) {
        s++;
        for (const relSlug of (lesson.related_lesson_slugs || [])) {
          const exists = await pool.query(`SELECT id FROM lessons WHERE slug = $1 LIMIT 1`, [relSlug]);
          if (exists.rows.length === 0) {
            f++;
            d.push({ category: "broken_lesson_reference", action: "flagged" as const, entityType: "lessons",
              entityId: lesson.id, description: `Lesson "${lesson.slug}" references non-existent lesson "${relSlug}"` });
          }
        }
      }
      return { scanned: s, cleaned: 0, flagged: f, details: d };
    }, errors),

    await safeCleanupStep("broken_image_refs", async () => {
      const r = await pool.query(
        `SELECT id, lesson_id, object_path FROM lesson_images WHERE lesson_id NOT IN (SELECT slug FROM lessons) LIMIT 100`
      );
      const d: CleanupDetail[] = r.rows.map((img: any) => ({
        category: "broken_image_reference", action: "flagged" as const, entityType: "lesson_images",
        entityId: img.id, description: `Lesson image references non-existent lesson "${img.lesson_id}"`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),

    await safeCleanupStep("broken_alias_refs", async () => {
      const r = await pool.query(
        `SELECT la.id, la.canonical_slug FROM lesson_aliases la WHERE la.canonical_slug NOT IN (SELECT slug FROM lessons) LIMIT 100`
      );
      const d: CleanupDetail[] = r.rows.map((alias: any) => ({
        category: "broken_alias_reference", action: "flagged" as const, entityType: "lesson_aliases",
        entityId: alias.id, description: `Lesson alias points to non-existent slug "${alias.canonical_slug}"`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),
  ];

  for (const step of steps) {
    scanned += step.scanned;
    flagged += step.flagged;
    details.push(...step.details);
  }

  const status = errors.length > 0 ? (details.length > 0 ? "partial" : "failed") : "success";
  const result: CleanupResult = {
    runType: "broken_references", status,
    itemsScanned: scanned, itemsCleaned: 0, itemsFlagged: flagged, details,
    durationMs: Date.now() - startTime,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
  await saveCleanupReport(result, triggeredBy);
  return result;
}

export async function flagStaleBackups(triggeredBy: string = "system"): Promise<CleanupResult> {
  const startTime = Date.now();
  const details: CleanupDetail[] = [];
  let scanned = 0;
  let flagged = 0;
  const errors: string[] = [];

  const steps = [
    await safeCleanupStep("stale_snapshots", async () => {
      const r = await pool.query(
        `SELECT id, content_id, created_at FROM content_snapshots WHERE created_at < NOW() - INTERVAL '90 days' ORDER BY created_at ASC LIMIT 200`
      );
      const d: CleanupDetail[] = r.rows.map((snap: any) => ({
        category: "stale_snapshot", action: "flagged" as const, entityType: "content_snapshots",
        entityId: snap.id, description: `Content snapshot from ${new Date(snap.created_at).toISOString().split("T")[0]} is over 90 days old`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),

    await safeCleanupStep("stale_revisions", async () => {
      const r = await pool.query(
        `SELECT id, content_id, revision_number, created_at FROM content_revisions WHERE created_at < NOW() - INTERVAL '180 days' ORDER BY created_at ASC LIMIT 200`
      );
      const d: CleanupDetail[] = r.rows.map((rev: any) => ({
        category: "stale_revision", action: "flagged" as const, entityType: "content_revisions",
        entityId: rev.id, description: `Content revision #${rev.revision_number} from ${new Date(rev.created_at).toISOString().split("T")[0]} is over 180 days old`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),

    await safeCleanupStep("stale_migration_logs", async () => {
      const r = await pool.query(
        `SELECT id, version, executed_at FROM migration_audit_log WHERE dry_run = true AND executed_at < NOW() - INTERVAL '30 days' LIMIT 100`
      );
      const d: CleanupDetail[] = r.rows.map((log: any) => ({
        category: "stale_dry_run_log", action: "flagged" as const, entityType: "migration_audit_log",
        entityId: log.id, description: `Dry-run log for migration ${log.version} is over 30 days old`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),
  ];

  for (const step of steps) {
    scanned += step.scanned;
    flagged += step.flagged;
    details.push(...step.details);
  }

  const status = errors.length > 0 ? (details.length > 0 ? "partial" : "failed") : "success";
  const result: CleanupResult = {
    runType: "stale_backups", status,
    itemsScanned: scanned, itemsCleaned: 0, itemsFlagged: flagged, details,
    durationMs: Date.now() - startTime,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
  await saveCleanupReport(result, triggeredBy);
  return result;
}

export async function purgeInvalidCache(triggeredBy: string = "system"): Promise<CleanupResult> {
  const startTime = Date.now();
  const details: CleanupDetail[] = [];
  let scanned = 0;
  let cleaned = 0;
  const errors: string[] = [];

  const steps = [
    await safeCleanupStep("abandoned_exams", async () => {
      const r = await pool.query(
        `SELECT id FROM mock_exam_attempts WHERE status = 'in_progress' AND started_at < NOW() - INTERVAL '7 days' LIMIT 100`
      );
      if (r.rows.length > 0) {
        const ids = r.rows.map((row: any) => row.id);
        await pool.query(`UPDATE mock_exam_attempts SET status = 'abandoned' WHERE id = ANY($1) AND status = 'in_progress'`, [ids]);
        return { scanned: ids.length, cleaned: ids.length, flagged: 0, details: [{
          category: "abandoned_exam", action: "repaired" as const, entityType: "mock_exam_attempts",
          entityId: `${ids.length} records`, description: `Marked ${ids.length} stale in-progress exam attempts as abandoned`,
        }] };
      }
      return { scanned: 0, cleaned: 0, flagged: 0, details: [] };
    }, errors),

    await safeCleanupStep("stale_drafts", async () => {
      const r = await pool.query(
        `SELECT id, title FROM content_items WHERE status = 'draft' AND updated_at < NOW() - INTERVAL '365 days' LIMIT 50`
      );
      const d: CleanupDetail[] = r.rows.map((draft: any) => ({
        category: "stale_draft", action: "flagged" as const, entityType: "content_items",
        entityId: draft.id, description: `Draft "${(draft.title || "").substring(0, 50)}" hasn't been updated in over a year`,
      }));
      return { scanned: r.rows.length, cleaned: 0, flagged: r.rows.length, details: d };
    }, errors),

    await safeCleanupStep("old_analytics", async () => {
      const r = await pool.query(`SELECT COUNT(*) as cnt FROM page_views WHERE created_at < NOW() - INTERVAL '180 days'`);
      const count = parseInt(r.rows[0]?.cnt || "0");
      const d: CleanupDetail[] = [];
      if (count > 10000) {
        d.push({ category: "old_analytics", action: "flagged" as const, entityType: "page_views",
          entityId: "aggregate", description: `${count} page view records older than 180 days could be archived` });
      }
      return { scanned: count, cleaned: 0, flagged: d.length, details: d };
    }, errors),
  ];

  for (const step of steps) {
    scanned += step.scanned;
    cleaned += step.cleaned;
    details.push(...step.details);
  }

  const flaggedCount = details.filter(d => d.action === "flagged").length;
  const status = errors.length > 0 ? (details.length > 0 ? "partial" : "failed") : "success";
  const result: CleanupResult = {
    runType: "cache_purge", status,
    itemsScanned: scanned, itemsCleaned: cleaned, itemsFlagged: flaggedCount, details,
    durationMs: Date.now() - startTime,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
  await saveCleanupReport(result, triggeredBy);
  return result;
}

export async function runFullCleanup(triggeredBy: string = "system"): Promise<CleanupResult[]> {
  const results: CleanupResult[] = [];

  results.push(await cleanOrphanedContent(triggeredBy));
  results.push(await detectBrokenReferences(triggeredBy));
  results.push(await flagStaleBackups(triggeredBy));
  results.push(await purgeInvalidCache(triggeredBy));

  return results;
}

let cleanupInterval: NodeJS.Timeout | null = null;

export function startScheduledCleanup(intervalHours: number = 24): void {
  if (cleanupInterval) return;
  console.log(`[AutoCleanup] Scheduled cleanup every ${intervalHours} hours`);
  cleanupInterval = setInterval(async () => {
    try {
      console.log("[AutoCleanup] Running scheduled cleanup...");
      const results = await runFullCleanup("scheduled");
      const total = results.reduce((sum, r) => sum + r.itemsCleaned + r.itemsFlagged, 0);
      console.log(`[AutoCleanup] Completed. Found ${total} items to address.`);
    } catch (err: any) {
      console.error("[AutoCleanup] Scheduled run failed:", err.message);
    }
  }, intervalHours * 60 * 60 * 1000);
}

export function stopScheduledCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

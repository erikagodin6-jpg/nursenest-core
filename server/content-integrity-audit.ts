import { pool } from "./storage";
import { validateForPublish, type ValidationResult } from "./content-integrity-validation";
import { quarantineContentItem } from "./content-versioning-quarantine";

interface AuditResult {
  scanned: number;
  passed: number;
  quarantined: number;
  errors: string[];
  details: Array<{
    contentId: string;
    contentType: string;
    title: string;
    action: string;
    reasons: string[];
  }>;
}

let auditInterval: ReturnType<typeof setInterval> | null = null;
let auditInitialTimeout: ReturnType<typeof setTimeout> | null = null;
const AUDIT_INTERVAL_MS = 60 * 60 * 1000;

export async function runPostPublishIntegrityAudit(): Promise<AuditResult> {
  const result: AuditResult = { scanned: 0, passed: 0, quarantined: 0, errors: [], details: [] };
  console.log("[IntegrityAudit] Starting post-publish integrity audit...");

  try {
    const questions = await pool.query(
      `SELECT id, stem, options, correct_answer as "correctAnswer", rationale, tier, body_system as "bodySystem",
              topic, tags, question_type as "questionType", ngn_payload as "ngnPayload", difficulty, status
       FROM exam_questions WHERE status = 'published' ORDER BY RANDOM() LIMIT 200`
    ).catch(() => ({ rows: [] }));

    for (const q of questions.rows) {
      result.scanned++;
      const validation = validateForPublish("question", q);
      if (validation.valid) {
        result.passed++;
      } else {
        const reasons = validation.errors.map(e => e.message);
        try {
          await quarantineContentItem(q.id, "question", `Post-publish audit failure: ${reasons.join("; ")}`, "post_publish_audit");
          result.quarantined++;
          result.details.push({ contentId: q.id, contentType: "question", title: q.stem?.substring(0, 80) || q.id, action: "quarantined", reasons });
        } catch (qErr: any) {
          result.errors.push(`Failed to quarantine question ${q.id}: ${qErr.message}`);
        }
      }
    }
  } catch (e: any) {
    result.errors.push(`Question scan error: ${e.message}`);
  }

  try {
    const contentItems = await pool.query(
      `SELECT id, title, slug, type, tier, summary, content, status, category, seo_title as "seoTitle", seo_description as "seoDescription"
       FROM content_items WHERE status = 'published' ORDER BY RANDOM() LIMIT 100`
    ).catch(() => ({ rows: [] }));

    for (const item of contentItems.rows) {
      result.scanned++;
      const contentType = item.type === "lesson" ? "lesson" : item.type?.includes("blog") ? "blog" : item.type || "lesson";
      const validation = validateForPublish(contentType, item);
      if (validation.valid) {
        result.passed++;
      } else {
        const reasons = validation.errors.map(e => e.message);
        try {
          await quarantineContentItem(item.id, contentType, `Post-publish audit failure: ${reasons.join("; ")}`, "post_publish_audit");
          result.quarantined++;
          result.details.push({ contentId: item.id, contentType, title: item.title || item.id, action: "quarantined", reasons });
        } catch (qErr: any) {
          result.errors.push(`Failed to quarantine content ${item.id}: ${qErr.message}`);
        }
      }
    }
  } catch (e: any) {
    result.errors.push(`Content item scan error: ${e.message}`);
  }

  try {
    const flashcards = await pool.query(
      `SELECT id, front, back, tier, status, tags_json as tags
       FROM flashcard_bank WHERE status = 'published' ORDER BY RANDOM() LIMIT 100`
    ).catch(() => ({ rows: [] }));

    for (const fc of flashcards.rows) {
      result.scanned++;
      const validation = validateForPublish("flashcard", fc);
      if (validation.valid) {
        result.passed++;
      } else {
        const reasons = validation.errors.map(e => e.message);
        try {
          await quarantineContentItem(fc.id, "flashcard", `Post-publish audit failure: ${reasons.join("; ")}`, "post_publish_audit");
          result.quarantined++;
          result.details.push({ contentId: fc.id, contentType: "flashcard", title: fc.front?.substring(0, 80) || fc.id, action: "quarantined", reasons });
        } catch (qErr: any) {
          result.errors.push(`Failed to quarantine flashcard ${fc.id}: ${qErr.message}`);
        }
      }
    }
  } catch (e: any) {
    result.errors.push(`Flashcard scan error: ${e.message}`);
  }

  try {
    await pool.query(
      `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
       VALUES (gen_random_uuid(), 'system', 'system', 'integrity_audit', 'post_publish', 'post_publish_audit', $1, $2, NOW())`,
      [JSON.stringify(result), result.quarantined > 0 ? "warning" : "info"]
    );
  } catch (e: any) {
    console.error("[IntegrityAudit] Failed to log audit result:", e.message);
  }

  if (result.quarantined > 0) {
    try {
      const { fireAlert } = await import("./alerting-engine");
      await fireAlert(
        pool,
        "quarantine_event",
        result.quarantined >= 5 ? "critical" : "warning",
        `Post-publish audit quarantined ${result.quarantined} items out of ${result.scanned} scanned`,
        { scanned: result.scanned, quarantined: result.quarantined, passed: result.passed, details: result.details.slice(0, 10) }
      );
    } catch {}
  }

  console.log(`[IntegrityAudit] Complete: scanned=${result.scanned}, passed=${result.passed}, quarantined=${result.quarantined}, errors=${result.errors.length}`);
  return result;
}

export function startPostPublishAudit(): void {
  if (auditInterval) return;
  console.log(`[IntegrityAudit] Post-publish audit scheduled (every ${AUDIT_INTERVAL_MS / 1000}s)`);
  auditInitialTimeout = setTimeout(() => {
    auditInitialTimeout = null;
    runPostPublishIntegrityAudit().catch(e => console.error("[IntegrityAudit] Error:", e.message));
  }, 60_000);
  auditInterval = setInterval(() => {
    runPostPublishIntegrityAudit().catch(e => console.error("[IntegrityAudit] Error:", e.message));
  }, AUDIT_INTERVAL_MS);
}

export function stopPostPublishAudit(): void {
  if (auditInitialTimeout) {
    clearTimeout(auditInitialTimeout);
    auditInitialTimeout = null;
  }
  if (auditInterval) {
    clearInterval(auditInterval);
    auditInterval = null;
  }
}

export async function getAuditHistory(limit = 20): Promise<any[]> {
  try {
    const result = await pool.query(
      `SELECT id, action, after_json, severity, created_at FROM audit_logs
       WHERE entity_type = 'integrity_audit' AND action = 'post_publish_audit'
       ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows.map(r => ({
      id: r.id,
      action: r.action,
      result: typeof r.after_json === "string" ? JSON.parse(r.after_json) : r.after_json,
      severity: r.severity,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

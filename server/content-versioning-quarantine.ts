import { pool } from "./storage";
import { validateForPublish, autoRepairContent, type ValidationResult, type ValidationError } from "./content-integrity-validation";
import { generateRenderPayloads } from "./content-failover";
import { checkTranslationCompleteness } from "./translation-helpers";

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

export interface PublishValidationPipelineResult {
  passed: boolean;
  validationResult: ValidationResult;
  validationRecordId: string | null;
  blockedReason?: string;
}

export interface SnapshotResult {
  snapshotId: string;
  version: number;
  isLastKnownGood: boolean;
}

export interface QuarantineResult {
  quarantineId: string;
  contentId: string;
  contentType: string;
  reason: string;
  fallbackContentId: string | null;
}

export async function runPublishValidationPipeline(
  contentType: string,
  contentId: string,
  data: any,
  actorId?: string
): Promise<PublishValidationPipelineResult> {
  const validationResult = validateForPublish(contentType, data);

  const deckErrors = validateDeckStructure(contentType, data);
  validationResult.errors.push(...deckErrors.filter(e => e.severity === "error"));
  validationResult.warnings.push(...deckErrors.filter(e => e.severity === "warning"));

  if (contentType === "lesson" || contentType === "lessons") {
    const lessonStructureErrors = validateLessonStructure(data);
    validationResult.errors.push(...lessonStructureErrors.filter(e => e.severity === "error"));
    validationResult.warnings.push(...lessonStructureErrors.filter(e => e.severity === "warning"));
  }

  try {
    const requiredFields = contentType === "lesson" || contentType === "lessons"
      ? ["title", "summary"]
      : contentType === "question" || contentType === "questions"
      ? ["stem", "rationale"]
      : ["front", "back"];
    const translationCheck = await checkTranslationCompleteness(
      contentType === "question" || contentType === "questions" ? "exam_question" : "content_item",
      contentId,
      requiredFields
    );
    if (!translationCheck.complete) {
      const incompleteLangs = Object.entries(translationCheck.languages)
        .filter(([_, info]) => info.status !== "complete")
        .map(([lang]) => lang);
      if (incompleteLangs.length > 0) {
        validationResult.warnings.push({
          field: "translations",
          message: `Translations incomplete for: ${incompleteLangs.join(", ")}`,
          severity: "warning",
        });
      }
    }
  } catch {
  }

  if (validationResult.errors.length > 0) {
    validationResult.valid = false;
  }

  let validationRecordId: string | null = null;
  try {
    const versionResult = await pool.query(
      "SELECT COALESCE(MAX(version), 0) as max_v FROM content_validation_results WHERE content_id = $1",
      [contentId]
    );
    const nextVersion = parseInt(versionResult.rows[0].max_v) + 1;

    const insertResult = await pool.query(
      `INSERT INTO content_validation_results (id, content_id, content_type, version, valid, errors, warnings, validator_results, triggered_by, actor_id, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'publish', $8, NOW())
       RETURNING id`,
      [
        contentId,
        contentType,
        nextVersion,
        validationResult.valid,
        JSON.stringify(validationResult.errors),
        JSON.stringify(validationResult.warnings),
        JSON.stringify({
          autoRepairs: validationResult.autoRepairs || [],
          languageValidation: validationResult.languageValidation || null,
        }),
        actorId || null,
      ]
    );
    validationRecordId = insertResult.rows[0]?.id || null;
  } catch (err: any) {
    console.error("[ValidationPipeline] Error storing validation result:", err.message);
  }

  return {
    passed: validationResult.valid,
    validationResult,
    validationRecordId,
    blockedReason: !validationResult.valid
      ? validationResult.errors.map(e => e.message).join("; ")
      : undefined,
  };
}

function validateDeckStructure(contentType: string, data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (contentType !== "flashcard" && contentType !== "flashcards" && contentType !== "flashcard-set") {
    return errors;
  }

  if (data.cards && Array.isArray(data.cards)) {
    if (data.cards.length === 0) {
      errors.push({ field: "cards", message: "Deck must contain at least one flashcard", severity: "error" });
    }
    for (let i = 0; i < data.cards.length; i++) {
      const card = data.cards[i];
      if (!card.front || card.front.trim().length < 3) {
        errors.push({ field: `cards[${i}].front`, message: `Card ${i + 1} front is too short`, severity: "error" });
      }
      if (!card.back || card.back.trim().length < 3) {
        errors.push({ field: `cards[${i}].back`, message: `Card ${i + 1} back is too short`, severity: "error" });
      }
    }
  }

  return errors;
}

function validateLessonStructure(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.content && Array.isArray(data.content)) {
    const hasHeading = data.content.some((b: any) => b?.type === "heading");
    if (!hasHeading && data.content.length > 2) {
      errors.push({
        field: "content",
        message: "Lesson should include at least one heading for proper structure",
        severity: "warning",
      });
    }

    const emptyBlocks = data.content.filter((b: any) => {
      if (!b) return true;
      if (b.type === "divider") return false;
      const c = b.content || "";
      return typeof c === "string" && c.trim().length === 0 && (!b.items || b.items.length === 0);
    });
    if (emptyBlocks.length > data.content.length * 0.5 && data.content.length > 3) {
      errors.push({
        field: "content",
        message: `${emptyBlocks.length} of ${data.content.length} content blocks are empty`,
        severity: "warning",
      });
    }
  }

  return errors;
}

export async function createContentSnapshot(
  contentId: string,
  contentType: string,
  data: any,
  snapshotType: string = "publish"
): Promise<SnapshotResult | null> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "SELECT id FROM content_snapshots WHERE content_id = $1 FOR UPDATE",
      [contentId]
    );
    const versionResult = await client.query(
      "SELECT COALESCE(MAX(version), 0) as max_v FROM content_snapshots WHERE content_id = $1",
      [contentId]
    );
    const nextVersion = parseInt(versionResult.rows[0].max_v) + 1;

    await client.query(
      "UPDATE content_snapshots SET is_last_known_good = false WHERE content_id = $1 AND is_last_known_good = true",
      [contentId]
    );

    const verifiedPayload = buildVerifiedPayload(contentType, data);
    const backupPayload = buildBackupPayload(contentType, data);
    let staticFallback: string | null = null;

    if (contentType === "lesson" || contentType === "lessons" || contentType === "blog" || contentType === "blog-post") {
      staticFallback = buildStaticFallback(data);
    }

    const insertResult = await client.query(
      `INSERT INTO content_snapshots (id, content_id, content_type, version, title, slug, content_data, verified_payload, backup_payload, static_fallback, metadata, snapshot_type, is_last_known_good, validated_at, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())
       RETURNING id`,
      [
        contentId,
        contentType,
        nextVersion,
        data.title || null,
        data.slug || null,
        JSON.stringify(data.content || data),
        verifiedPayload ? JSON.stringify(verifiedPayload) : null,
        backupPayload ? JSON.stringify(backupPayload) : null,
        staticFallback,
        JSON.stringify({
          tier: data.tier || null,
          category: data.category || data.bodySystem || null,
          status: data.status || null,
          regionScope: data.regionScope || null,
        }),
        snapshotType,
      ]
    );

    const snapshotId = insertResult.rows[0]?.id;

    const oldSnapshots = await client.query(
      `SELECT id FROM content_snapshots WHERE content_id = $1 AND version < $2 - 20 AND is_last_known_good = false`,
      [contentId, nextVersion]
    );
    if (oldSnapshots.rows.length > 0) {
      const ids = oldSnapshots.rows.map((r: any) => r.id);
      await client.query(`DELETE FROM content_snapshots WHERE id = ANY($1)`, [ids]);
    }

    await client.query("COMMIT");

    return {
      snapshotId,
      version: nextVersion,
      isLastKnownGood: true,
    };
  } catch (err: any) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[ContentVersioning] Error creating snapshot:", err.message);
    return null;
  } finally {
    client.release();
  }
}

function buildVerifiedPayload(contentType: string, data: any): any {
  if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
    return {
      id: data.id,
      stem: data.stem || "",
      options: data.options || [],
      correctAnswer: data.correctAnswer || data.correct_answer || null,
      rationale: data.rationale || "",
      tier: data.tier || "",
      exam: data.exam || "",
      questionType: data.questionType || data.question_type || "MCQ",
      bodySystem: data.bodySystem || data.body_system || null,
      topic: data.topic || null,
      difficulty: data.difficulty || null,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };
  }

  if (contentType === "flashcard" || contentType === "flashcards") {
    return {
      id: data.id,
      front: data.front || "",
      back: data.back || "",
      deckId: data.deckId || data.deck_id || null,
      tags: data.tags || [],
      verified: true,
      verifiedAt: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    title: data.title || "",
    slug: data.slug || "",
    type: data.type || "lesson",
    category: data.category || null,
    tier: data.tier || "free",
    summary: data.summary || "",
    content: data.content || [],
    seoTitle: data.seoTitle || data.seo_title || null,
    seoDescription: data.seoDescription || data.seo_description || null,
    regionScope: data.regionScope || data.region_scope || "BOTH",
    verified: true,
    verifiedAt: new Date().toISOString(),
  };
}

function buildBackupPayload(contentType: string, data: any): any {
  if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
    return {
      id: data.id,
      stem: data.stem || "",
      options: data.options || [],
      correctAnswer: data.correctAnswer || data.correct_answer || null,
      minimal: true,
      createdAt: new Date().toISOString(),
    };
  }

  if (contentType === "flashcard" || contentType === "flashcards") {
    return {
      id: data.id,
      front: data.front || "",
      back: data.back || "",
      minimal: true,
      createdAt: new Date().toISOString(),
    };
  }

  const text = extractText(data.content);
  const truncated = text.length > 2000 ? text.substring(0, 2000) + "..." : text;
  return {
    id: data.id,
    title: data.title || "",
    slug: data.slug || "",
    type: data.type || "lesson",
    tier: data.tier || "free",
    summary: data.summary || truncated.substring(0, 300),
    content: [{ type: "paragraph", content: truncated }],
    minimal: true,
    createdAt: new Date().toISOString(),
  };
}

function extractText(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (typeof block === "string") return block;
        if (block && typeof block.content === "string") return block.content;
        if (block && Array.isArray(block.items)) return block.items.join(" ");
        return "";
      })
      .join(" ");
  }
  return "";
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildStaticFallback(data: any): string {
  const title = data.title || "Content";
  const summary = data.summary || "";
  const contentBlocks = Array.isArray(data.content) ? data.content : [];

  let bodyHtml = "";
  for (const block of contentBlocks) {
    if (!block) continue;
    const type = block.type || "paragraph";
    const content = block.content || "";
    switch (type) {
      case "heading":
        bodyHtml += `<h2>${escapeHtml(content)}</h2>\n`;
        break;
      case "paragraph":
        bodyHtml += `<p>${escapeHtml(content)}</p>\n`;
        break;
      case "list":
      case "bulletList":
        if (Array.isArray(block.items)) {
          bodyHtml += "<ul>\n";
          for (const item of block.items) {
            bodyHtml += `  <li>${escapeHtml(item)}</li>\n`;
          }
          bodyHtml += "</ul>\n";
        }
        break;
      default:
        if (content) bodyHtml += `<p>${escapeHtml(content)}</p>\n`;
    }
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head><body><h1>${escapeHtml(title)}</h1>${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ""}${bodyHtml}<footer><p>Static fallback version.</p></footer></body></html>`;
}

export async function quarantineContentItem(
  contentId: string,
  contentType: string,
  reason: string,
  detectedBy: string = "validation"
): Promise<QuarantineResult | null> {
  try {
    const existing = await pool.query(
      "SELECT * FROM content_quarantine WHERE content_id = $1 AND content_type = $2 AND resolved_at IS NULL",
      [contentId, contentType]
    );
    if (existing.rows.length > 0) {
      return snakeToCamel(existing.rows[0]) as QuarantineResult;
    }

    let previousStatus: string | null = null;
    let table: string | null = null;

    if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
      table = "exam_questions";
      const itemRes = await pool.query("SELECT status FROM exam_questions WHERE id = $1", [contentId]);
      previousStatus = itemRes.rows[0]?.status || null;

      await pool.query(
        "UPDATE exam_questions SET status = 'quarantined', quarantined_at = NOW(), quarantine_reason = $2 WHERE id = $1",
        [contentId, reason]
      );
    } else if (contentType === "flashcard" || contentType === "flashcards") {
      table = "flashcard_bank";
      const itemRes = await pool.query("SELECT status FROM flashcard_bank WHERE id = $1", [contentId]);
      previousStatus = itemRes.rows[0]?.status || null;

      await pool.query(
        "UPDATE flashcard_bank SET status = 'quarantined' WHERE id = $1",
        [contentId]
      );
    } else {
      table = "content_items";
      const itemRes = await pool.query("SELECT status FROM content_items WHERE id = $1", [contentId]);
      previousStatus = itemRes.rows[0]?.status || null;

      await pool.query(
        "UPDATE content_items SET status = 'quarantined' WHERE id = $1",
        [contentId]
      );
    }

    let fallbackContentId: string | null = null;
    try {
      const lastGood = await pool.query(
        "SELECT id, content_id FROM content_snapshots WHERE content_id = $1 AND is_last_known_good = true ORDER BY version DESC LIMIT 1",
        [contentId]
      );
      if (lastGood.rows.length > 0) {
        fallbackContentId = lastGood.rows[0].id;
      }
    } catch {}

    let maxVersion: number | null = null;
    try {
      const currentVersion = await pool.query(
        "SELECT COALESCE(MAX(version), 0) as max_v FROM content_snapshots WHERE content_id = $1",
        [contentId]
      );
      maxVersion = parseInt(currentVersion.rows[0].max_v) || null;
    } catch {}

    const insertResult = await pool.query(
      `INSERT INTO content_quarantine (id, content_id, content_type, reason, detected_by, previous_status, previous_version, affected_users_estimate, fallback_content_id, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 0, $7, NOW())
       RETURNING id`,
      [
        contentId,
        contentType,
        reason,
        detectedBy,
        previousStatus,
        maxVersion,
        fallbackContentId,
      ]
    );

    console.log(`[Quarantine] Content ${contentId} (${contentType}) quarantined: ${reason}`);

    try {
      const { fireQuarantineAlert } = await import("./alerting-engine");
      fireQuarantineAlert(pool, contentId, contentType, reason).catch(() => {});
    } catch {}

    return {
      quarantineId: insertResult.rows[0]?.id,
      contentId,
      contentType,
      reason,
      fallbackContentId,
    };
  } catch (err: any) {
    console.error("[Quarantine] Error quarantining content:", err.message);
    return null;
  }
}

export async function isContentQuarantined(contentId: string, contentType?: string): Promise<boolean> {
  try {
    let query = "SELECT COUNT(*) as cnt FROM content_quarantine WHERE content_id = $1 AND resolved_at IS NULL";
    const params: any[] = [contentId];
    if (contentType) {
      query += " AND content_type = $2";
      params.push(contentType);
    }
    const result = await pool.query(query, params);
    return parseInt(result.rows[0].cnt) > 0;
  } catch {
    return false;
  }
}

export async function getQuarantineInfo(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      "SELECT * FROM content_quarantine WHERE content_id = $1 AND resolved_at IS NULL ORDER BY created_at DESC LIMIT 1",
      [contentId]
    );
    if (result.rows.length === 0) return null;
    return snakeToCamel(result.rows[0]);
  } catch {
    return null;
  }
}

export async function resolveQuarantine(
  contentId: string,
  resolvedBy: string,
  resolutionAction: string
): Promise<boolean> {
  try {
    await pool.query(
      "UPDATE content_quarantine SET resolved_at = NOW(), resolved_by = $2, resolution_action = $3 WHERE content_id = $1 AND resolved_at IS NULL",
      [contentId, resolvedBy, resolutionAction]
    );

    const qRecord = await pool.query(
      "SELECT content_type, previous_status FROM content_quarantine WHERE content_id = $1 ORDER BY created_at DESC LIMIT 1",
      [contentId]
    );

    if (qRecord.rows.length > 0) {
      const contentType = qRecord.rows[0].content_type;
      const restoreStatus = qRecord.rows[0].previous_status || "draft";

      if (resolutionAction === "restore") {
        if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
          await pool.query(
            "UPDATE exam_questions SET quarantined_at = NULL, quarantine_reason = NULL, status = $2 WHERE id = $1",
            [contentId, restoreStatus]
          );
        } else if (contentType === "flashcard" || contentType === "flashcards") {
          await pool.query(
            "UPDATE flashcard_bank SET status = $2 WHERE id = $1",
            [contentId, restoreStatus]
          );
        } else {
          await pool.query(
            "UPDATE content_items SET status = $2 WHERE id = $1",
            [contentId, restoreStatus]
          );
        }
      }
    }

    console.log(`[Quarantine] Content ${contentId} quarantine resolved: ${resolutionAction}`);
    return true;
  } catch (err: any) {
    console.error("[Quarantine] Error resolving quarantine:", err.message);
    return false;
  }
}

export async function getLastKnownGoodSnapshot(contentId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      "SELECT * FROM content_snapshots WHERE content_id = $1 AND is_last_known_good = true ORDER BY version DESC LIMIT 1",
      [contentId]
    );
    if (result.rows.length === 0) {
      const fallback = await pool.query(
        "SELECT * FROM content_snapshots WHERE content_id = $1 ORDER BY version DESC LIMIT 1",
        [contentId]
      );
      if (fallback.rows.length > 0) return snakeToCamel(fallback.rows[0]);
      return null;
    }
    return snakeToCamel(result.rows[0]);
  } catch {
    return null;
  }
}

export async function getContentWithQuarantineCheck(
  contentId: string,
  contentType: string
): Promise<{ quarantined: boolean; data: any | null; fallback: any | null; message?: string }> {
  const quarantined = await isContentQuarantined(contentId, contentType);

  if (!quarantined) {
    return { quarantined: false, data: null, fallback: null };
  }

  const snapshot = await getLastKnownGoodSnapshot(contentId);
  if (snapshot) {
    const payload = snapshot.verifiedPayload || snapshot.backupPayload || snapshot.contentData;
    return {
      quarantined: true,
      data: null,
      fallback: typeof payload === "string" ? JSON.parse(payload) : payload,
      message: "This content is being served from a verified backup while we resolve an issue.",
    };
  }

  return {
    quarantined: true,
    data: null,
    fallback: null,
    message: "This content is temporarily unavailable. We're working to resolve the issue.",
  };
}

export async function scanAndQuarantineInvalidPublishedContent(): Promise<{
  scanned: number;
  quarantined: number;
  items: Array<{ id: string; title: string; type: string; reason: string }>;
}> {
  const { validateZeroValidItems } = await import("./content-integrity-validation");
  const result = { scanned: 0, quarantined: 0, items: [] as Array<{ id: string; title: string; type: string; reason: string }> };

  try {
    const BATCH_SIZE = 500;

    let contentOffset = 0;
    let hasMoreContent = true;
    while (hasMoreContent) {
      const contentItems = await pool.query(`
        SELECT id, title, type, content, summary, status
        FROM content_items
        WHERE status = 'published'
        ORDER BY id
        LIMIT ${BATCH_SIZE} OFFSET ${contentOffset}
      `);
      result.scanned += contentItems.rows.length;
      hasMoreContent = contentItems.rows.length === BATCH_SIZE;
      contentOffset += BATCH_SIZE;

      for (const item of contentItems.rows) {
        const contentType = item.type || "content_item";
        const validationError = validateZeroValidItems(contentType, item);
        if (validationError) {
          const reason = validationError.message;
          const qResult = await quarantineContentItem(item.id, contentType, reason, "startup_scan");
          if (qResult) {
            result.quarantined++;
            result.items.push({ id: item.id, title: item.title || "Untitled", type: contentType, reason });
            console.log(`[StartupScan] Quarantined published content item "${item.title || item.id}" - ${reason}`);
          }
        }
      }
    }

    let questionOffset = 0;
    let hasMore = true;
    while (hasMore) {
      const questions = await pool.query(`
        SELECT id, tier, stem, options, status
        FROM exam_questions
        WHERE status = 'published'
        ORDER BY id
        LIMIT ${BATCH_SIZE} OFFSET ${questionOffset}
      `);
      result.scanned += questions.rows.length;
      hasMore = questions.rows.length === BATCH_SIZE;
      questionOffset += BATCH_SIZE;

      for (const q of questions.rows) {
        const validationError = validateZeroValidItems("exam_question", {
          stem: q.stem,
          options: q.options,
        });
        if (validationError) {
          const reason = validationError.message;
          const qResult = await quarantineContentItem(q.id, "exam_question", reason, "startup_scan");
          if (qResult) {
            result.quarantined++;
            result.items.push({ id: q.id, title: q.stem || "Empty question", type: "exam_question", reason });
            console.log(`[StartupScan] Quarantined invalid published question ${q.id}`);
          }
        }
      }
    }

    if (result.quarantined > 0) {
      console.log(`[StartupScan] Quarantined ${result.quarantined} invalid published content items out of ${result.scanned} scanned`);
    } else {
      console.log(`[StartupScan] Scanned ${result.scanned} items, no invalid published content found`);
    }
  } catch (err: any) {
    console.error("[StartupScan] Error scanning for invalid published content:", err.message);
  }

  return result;
}

const MIN_VALID_ITEMS_THRESHOLD = parseInt(process.env.MIN_VALID_ITEMS_THRESHOLD || "1", 10);

function enforceMinimumValidItems(contentType: string, data: any): { passed: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (contentType === "question" || contentType === "questions" || contentType === "exam_question") {
    if (!data.stem || (typeof data.stem === "string" && data.stem.trim().length < 10)) {
      errors.push({ field: "stem", message: "Question stem is required and must be at least 10 characters (hard gate)", severity: "error" });
    }
    const options = Array.isArray(data.options) ? data.options.filter((o: any) => {
      const text = typeof o === "string" ? o : o?.text;
      return text && text.trim().length > 0;
    }) : [];
    if (options.length < MIN_VALID_ITEMS_THRESHOLD) {
      errors.push({ field: "options", message: `At least ${MIN_VALID_ITEMS_THRESHOLD} valid answer option(s) required (found ${options.length}) (hard gate)`, severity: "error" });
    }
    if (data.correctAnswer === undefined || data.correctAnswer === null) {
      errors.push({ field: "correctAnswer", message: "Correct answer must be specified (hard gate)", severity: "error" });
    }
    if (!data.rationale || (typeof data.rationale === "string" && data.rationale.trim().length < 20)) {
      errors.push({ field: "rationale", message: "Rationale is required (min 20 characters) (hard gate)", severity: "error" });
    }
  }

  if (contentType === "flashcard" || contentType === "flashcards" || contentType === "flashcard-set") {
    if (data.cards && Array.isArray(data.cards)) {
      const validCards = data.cards.filter((c: any) => c.front && c.front.trim().length >= 3 && c.back && c.back.trim().length >= 3);
      if (validCards.length < MIN_VALID_ITEMS_THRESHOLD) {
        errors.push({ field: "cards", message: `At least ${MIN_VALID_ITEMS_THRESHOLD} valid card(s) required (found ${validCards.length}) (hard gate)`, severity: "error" });
      }
    } else {
      if (!data.front || (typeof data.front === "string" && data.front.trim().length < 3)) {
        errors.push({ field: "front", message: "Flashcard front is required (min 3 characters) (hard gate)", severity: "error" });
      }
      if (!data.back || (typeof data.back === "string" && data.back.trim().length < 3)) {
        errors.push({ field: "back", message: "Flashcard back is required (min 3 characters) (hard gate)", severity: "error" });
      }
    }
  }

  if (contentType === "lesson" || contentType === "lessons") {
    if (!data.title || (typeof data.title === "string" && data.title.trim().length < 3)) {
      errors.push({ field: "title", message: "Lesson title is required (min 3 characters) (hard gate)", severity: "error" });
    }
    if (!data.slug || (typeof data.slug === "string" && data.slug.trim().length < 2)) {
      errors.push({ field: "slug", message: "Lesson slug is required (hard gate)", severity: "error" });
    }
  }

  if (contentType === "blog" || contentType === "blog-post" || contentType === "article") {
    if (!data.title || (typeof data.title === "string" && data.title.trim().length < 5)) {
      errors.push({ field: "title", message: "Blog title is required (min 5 characters) (hard gate)", severity: "error" });
    }
    if (!data.content) {
      errors.push({ field: "content", message: "Blog content is required (hard gate)", severity: "error" });
    }
  }

  return { passed: errors.length === 0, errors };
}

export async function publishWithValidation(
  contentType: string,
  contentId: string,
  data: any,
  actorId?: string,
  forcePublish?: boolean
): Promise<{
  allowed: boolean;
  validationResult?: PublishValidationPipelineResult;
  snapshot?: SnapshotResult | null;
  error?: string;
}> {
  const pipelineResult = await runPublishValidationPipeline(contentType, contentId, data, actorId);

  const minValidItemCheck = enforceMinimumValidItems(contentType, data);
  if (!minValidItemCheck.passed) {
    pipelineResult.passed = false;
    pipelineResult.validationResult.valid = false;
    pipelineResult.validationResult.errors.push(...minValidItemCheck.errors);
    pipelineResult.blockedReason = [pipelineResult.blockedReason, ...minValidItemCheck.errors.map(e => e.message)].filter(Boolean).join("; ");
  }

  if (!pipelineResult.passed) {
    return {
      allowed: false,
      validationResult: pipelineResult,
      error: pipelineResult.blockedReason,
    };
  }

  const snapshot = await createContentSnapshot(contentId, contentType, data, "publish");

  try {
    if (contentType === "lesson" || contentType === "lessons" || contentType === "blog" || contentType === "blog-post") {
      await generateRenderPayloads(contentId);
    }
  } catch (err: any) {
    console.error("[PublishValidation] Render payload generation failed:", err.message);
  }

  try {
    const { trackChange } = require("./incident-correlation");
    trackChange({ type: "content_publish" as const, source: "content-versioning", description: `Published ${contentType} "${data?.title || contentId}"`, entityId: contentId, actor: actorId || null, metadata: { contentType, title: data?.title, contentId } });
  } catch {}

  return {
    allowed: true,
    snapshot,
  };
}

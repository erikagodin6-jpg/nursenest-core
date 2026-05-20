import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { pool } from "./storage";

const TRANSLATION_STATUS_VALUES = [
  "missing", "draft", "machine_translated", "human_review_needed",
  "reviewed", "approved", "stale", "rejected",
] as const;

type TranslationStatus = typeof TRANSLATION_STATUS_VALUES[number];

const LEGAL_STATUS_TRANSITIONS: Record<string, string[]> = {
  missing: ["draft", "machine_translated"],
  draft: ["machine_translated", "human_review_needed", "rejected"],
  machine_translated: ["human_review_needed", "reviewed", "rejected"],
  human_review_needed: ["reviewed", "rejected"],
  reviewed: ["approved", "rejected", "human_review_needed"],
  approved: ["stale", "human_review_needed"],
  stale: ["human_review_needed", "draft", "machine_translated"],
  rejected: ["draft", "machine_translated", "human_review_needed"],
};

interface ContentTypeConfig {
  tableName: string;
  sourceTable: string;
  sourceIdColumn: string;
  requiredFields: string[];
  allFields: string[];
  label: string;
}

const CONTENT_TYPE_CONFIGS: Record<string, ContentTypeConfig> = {
  exam_question: {
    tableName: "exam_question_translations",
    sourceTable: "exam_questions",
    sourceIdColumn: "id",
    requiredFields: ["stem", "options", "rationale"],
    allFields: [
      "stem", "scenario", "options", "rationale", "correct_answer_explanation",
      "distractor_rationales", "incorrect_answer_rationale", "clinical_pearl",
      "exam_strategy", "memory_hook", "clinical_trap", "clinical_reasoning",
      "key_takeaway", "mnemonic", "case_context", "hints",
    ],
    label: "Exam Questions",
  },
  content_item: {
    tableName: "content_item_translations",
    sourceTable: "content_items",
    sourceIdColumn: "id",
    requiredFields: ["title", "summary"],
    allFields: ["title", "summary", "content", "seo_title", "seo_description"],
    label: "Content Items",
  },
  flashcard: {
    tableName: "flashcard_translations",
    sourceTable: "flashcard_bank",
    sourceIdColumn: "id",
    requiredFields: ["front", "back"],
    allFields: [
      "front", "back", "rationale_correct", "clinical_takeaway",
      "exam_pearl", "options", "distractor_rationales",
    ],
    label: "Flashcards",
  },
  seo_page: {
    tableName: "seo_page_translations",
    sourceTable: "seo_pages",
    sourceIdColumn: "id",
    requiredFields: ["title", "meta_title", "meta_description"],
    allFields: ["title", "meta_title", "meta_description", "content_html", "toc_json", "faq_json"],
    label: "SEO Pages",
  },
  flashcard_deck: {
    tableName: "flashcard_deck_translations",
    sourceTable: "flashcard_decks",
    sourceIdColumn: "id",
    requiredFields: ["title"],
    allFields: ["title", "description"],
    label: "Flashcard Decks",
  },
  qotd: {
    tableName: "qotd_translations",
    sourceTable: "qotd_history",
    sourceIdColumn: "id",
    requiredFields: ["question_text", "options", "rationale"],
    allFields: ["question_text", "options", "rationale"],
    label: "Question of the Day",
  },
  seo_hub_page: {
    tableName: "seo_hub_page_translations",
    sourceTable: "seo_hub_pages",
    sourceIdColumn: "id",
    requiredFields: ["title", "meta_title"],
    allFields: ["title", "meta_title", "meta_description", "h1", "content_sections", "faq_items"],
    label: "SEO Hub Pages",
  },
  clinical_seo_page: {
    tableName: "clinical_seo_page_translations",
    sourceTable: "clinical_seo_pages",
    sourceIdColumn: "id",
    requiredFields: ["title", "meta_title", "meta_description"],
    allFields: ["title", "meta_title", "meta_description", "summary", "data"],
    label: "Clinical SEO Pages",
  },
};

const TARGET_LOCALES = [
  "fr", "es", "fil", "hi", "zh", "ar", "ko", "pt", "pa", "vi", "ht", "ur", "ja", "fa",
];

function isValidStatus(status: string): status is TranslationStatus {
  return TRANSLATION_STATUS_VALUES.includes(status as TranslationStatus);
}

function isLegalTransition(from: string, to: string): boolean {
  const allowed = LEGAL_STATUS_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export function calculateFieldCompleteness(
  translationRecord: Record<string, any> | null,
  requiredFields: string[],
): { percentage: number; approvedCount: number; totalRequired: number } {
  if (!translationRecord || requiredFields.length === 0) {
    return { percentage: 0, approvedCount: 0, totalRequired: requiredFields.length };
  }

  let approvedCount = 0;
  for (const field of requiredFields) {
    const value = translationRecord[field];
    if (value !== null && value !== undefined && value !== "") {
      if (translationRecord.translation_status === "approved") {
        approvedCount++;
      }
    }
  }

  return {
    percentage: requiredFields.length > 0 ? Math.round((approvedCount / requiredFields.length) * 100 * 10) / 10 : 0,
    approvedCount,
    totalRequired: requiredFields.length,
  };
}

export async function getTranslationCompletenessForContent(
  contentType: string,
  contentId: string,
  locale: string,
): Promise<{ percentage: number; approvedCount: number; totalRequired: number; status: string }> {
  const config = CONTENT_TYPE_CONFIGS[contentType];
  if (!config) {
    return { percentage: 0, approvedCount: 0, totalRequired: 0, status: "unknown" };
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${config.tableName} WHERE content_id = $1 AND locale = $2 LIMIT 1`,
      [contentId, locale],
    );

    if (result.rows.length === 0) {
      return { percentage: 0, approvedCount: 0, totalRequired: config.requiredFields.length, status: "missing" };
    }

    const row = result.rows[0];
    const completeness = calculateFieldCompleteness(row, config.requiredFields);
    return { ...completeness, status: row.translation_status };
  } catch {
    return { percentage: 0, approvedCount: 0, totalRequired: config.requiredFields.length, status: "error" };
  }
}

export async function checkPublishingGate(
  contentType: string,
  contentId: string,
  threshold: number = 100,
): Promise<{ canPublish: boolean; failures: { locale: string; percentage: number }[] }> {
  const config = CONTENT_TYPE_CONFIGS[contentType];
  if (!config) {
    return { canPublish: true, failures: [] };
  }

  const failures: { locale: string; percentage: number }[] = [];

  for (const locale of TARGET_LOCALES) {
    const completeness = await getTranslationCompletenessForContent(contentType, contentId, locale);
    if (completeness.percentage < threshold) {
      failures.push({ locale, percentage: completeness.percentage });
    }
  }

  return { canPublish: failures.length === 0, failures };
}

export function registerTranslationCompletenessRoutes(app: Express) {

  app.get("/api/admin/translation-completeness/summary", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filterContentType = req.query.contentType as string | undefined;
      const filterLocale = req.query.locale as string | undefined;
      const filterStatus = req.query.status as string | undefined;

      const contentTypes = filterContentType && CONTENT_TYPE_CONFIGS[filterContentType]
        ? { [filterContentType]: CONTENT_TYPE_CONFIGS[filterContentType] }
        : CONTENT_TYPE_CONFIGS;

      const locales = filterLocale ? [filterLocale] : TARGET_LOCALES;

      const summaryByContentType: any[] = [];

      for (const [ctKey, config] of Object.entries(contentTypes)) {
        const byLocale: any[] = [];

        for (const locale of locales) {
          try {
            let statusFilter = "";
            const params: any[] = [locale];

            if (filterStatus && isValidStatus(filterStatus)) {
              statusFilter = ` AND t.translation_status = $2`;
              params.push(filterStatus);
            }

            const totalResult = await pool.query(
              `SELECT COUNT(*)::int as total FROM ${config.sourceTable}`,
            );
            const totalItems = totalResult.rows[0]?.total || 0;

            const translatedResult = await pool.query(
              `SELECT
                COUNT(*)::int as total,
                COUNT(*) FILTER (WHERE t.translation_status = 'approved')::int as approved,
                COUNT(*) FILTER (WHERE t.translation_status = 'stale')::int as stale,
                COUNT(*) FILTER (WHERE t.translation_status = 'draft')::int as draft,
                COUNT(*) FILTER (WHERE t.translation_status = 'machine_translated')::int as machine_translated,
                COUNT(*) FILTER (WHERE t.translation_status = 'human_review_needed')::int as human_review_needed,
                COUNT(*) FILTER (WHERE t.translation_status = 'reviewed')::int as reviewed,
                COUNT(*) FILTER (WHERE t.translation_status = 'rejected')::int as rejected,
                COUNT(*) FILTER (WHERE t.translation_status = 'missing')::int as missing_status
              FROM ${config.tableName} t
              WHERE t.locale = $1${statusFilter}`,
              params,
            );

            const stats = translatedResult.rows[0] || {};
            const translatedCount = stats.total || 0;
            const missingCount = totalItems - translatedCount;
            const approvedCount = stats.approved || 0;
            const staleCount = stats.stale || 0;

            byLocale.push({
              locale,
              totalItems,
              translatedCount,
              approvedCount,
              staleCount,
              missingCount: missingCount > 0 ? missingCount : 0,
              draftCount: stats.draft || 0,
              machineTranslatedCount: stats.machine_translated || 0,
              humanReviewNeededCount: stats.human_review_needed || 0,
              reviewedCount: stats.reviewed || 0,
              rejectedCount: stats.rejected || 0,
              completenessPercent: totalItems > 0
                ? Math.round((approvedCount / totalItems) * 1000) / 10
                : 0,
            });
          } catch (dbErr: any) {
            if (dbErr.code === "42P01") {
              byLocale.push({
                locale,
                totalItems: 0, translatedCount: 0, approvedCount: 0, staleCount: 0,
                missingCount: 0, draftCount: 0, machineTranslatedCount: 0,
                humanReviewNeededCount: 0, reviewedCount: 0, rejectedCount: 0,
                completenessPercent: 0,
              });
            } else {
              throw dbErr;
            }
          }
        }

        const totalItems = byLocale.reduce((s, l) => s + l.totalItems, 0);
        const totalApproved = byLocale.reduce((s, l) => s + l.approvedCount, 0);
        const totalStale = byLocale.reduce((s, l) => s + l.staleCount, 0);
        const totalMissing = byLocale.reduce((s, l) => s + l.missingCount, 0);
        const avgCompleteness = byLocale.length > 0
          ? Math.round(byLocale.reduce((s, l) => s + l.completenessPercent, 0) / byLocale.length * 10) / 10
          : 0;

        summaryByContentType.push({
          contentType: ctKey,
          label: config.label,
          totalItems: byLocale[0]?.totalItems || 0,
          totalApproved,
          totalStale,
          totalMissing,
          avgCompleteness,
          byLocale,
        });
      }

      res.json({
        contentTypes: Object.keys(contentTypes).map(k => ({
          key: k,
          label: CONTENT_TYPE_CONFIGS[k].label,
        })),
        targetLocales: TARGET_LOCALES,
        summary: summaryByContentType,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Summary error:", e);
      res.status(500).json({ error: "Failed to load completeness summary" });
    }
  });

  app.get("/api/admin/translation-completeness/stale", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filterLocale = req.query.locale as string | undefined;
      const filterContentType = req.query.contentType as string | undefined;
      const limit = Math.min(parseInt(String(req.query.limit)) || 50, 200);
      const offset = parseInt(String(req.query.offset)) || 0;

      const contentTypes = filterContentType && CONTENT_TYPE_CONFIGS[filterContentType]
        ? { [filterContentType]: CONTENT_TYPE_CONFIGS[filterContentType] }
        : CONTENT_TYPE_CONFIGS;

      const results: any[] = [];
      let totalCount = 0;

      for (const [ctKey, config] of Object.entries(contentTypes)) {
        try {
          let whereClause = `WHERE t.source_version < s.source_version`;
          const params: any[] = [];

          if (filterLocale) {
            params.push(filterLocale);
            whereClause += ` AND t.locale = $${params.length}`;
          }

          params.push(limit);
          params.push(offset);

          const countResult = await pool.query(
            `SELECT COUNT(*)::int as cnt
             FROM ${config.tableName} t
             JOIN ${config.sourceTable} s ON s.${config.sourceIdColumn} = t.content_id
             ${whereClause}`,
            filterLocale ? [filterLocale] : [],
          );
          totalCount += countResult.rows[0]?.cnt || 0;

          const staleResult = await pool.query(
            `SELECT
              t.id, t.content_id, t.locale, t.source_version as translation_source_version,
              s.source_version as current_source_version,
              t.translation_status, t.updated_at,
              '${ctKey}' as content_type
            FROM ${config.tableName} t
            JOIN ${config.sourceTable} s ON s.${config.sourceIdColumn} = t.content_id
            ${whereClause}
            ORDER BY t.updated_at DESC
            LIMIT $${params.length - 1} OFFSET $${params.length}`,
            [...(filterLocale ? [filterLocale] : []), limit, offset],
          );

          results.push(...staleResult.rows.map(row => ({
            ...row,
            contentType: ctKey,
            contentTypeLabel: config.label,
          })));
        } catch (dbErr: any) {
          if (dbErr.code !== "42P01") throw dbErr;
        }
      }

      results.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      res.json({
        staleTranslations: results.slice(0, limit),
        total: totalCount,
        limit,
        offset,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Stale error:", e);
      res.status(500).json({ error: "Failed to load stale translations" });
    }
  });

  app.get("/api/admin/translation-completeness/missing", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const filterLocale = req.query.locale as string | undefined;
      const filterContentType = req.query.contentType as string | undefined;
      const limit = Math.min(parseInt(String(req.query.limit)) || 50, 200);
      const offset = parseInt(String(req.query.offset)) || 0;

      if (!filterLocale) {
        return res.status(400).json({ error: "locale parameter is required" });
      }

      const contentTypes = filterContentType && CONTENT_TYPE_CONFIGS[filterContentType]
        ? { [filterContentType]: CONTENT_TYPE_CONFIGS[filterContentType] }
        : CONTENT_TYPE_CONFIGS;

      const results: any[] = [];
      let totalCount = 0;

      for (const [ctKey, config] of Object.entries(contentTypes)) {
        try {
          const countResult = await pool.query(
            `SELECT COUNT(*)::int as cnt
             FROM ${config.sourceTable} s
             WHERE NOT EXISTS (
               SELECT 1 FROM ${config.tableName} t
               WHERE t.content_id = s.${config.sourceIdColumn} AND t.locale = $1
             )`,
            [filterLocale],
          );
          totalCount += countResult.rows[0]?.cnt || 0;

          const missingResult = await pool.query(
            `SELECT s.${config.sourceIdColumn} as content_id, '${ctKey}' as content_type
             FROM ${config.sourceTable} s
             WHERE NOT EXISTS (
               SELECT 1 FROM ${config.tableName} t
               WHERE t.content_id = s.${config.sourceIdColumn} AND t.locale = $1
             )
             ORDER BY s.${config.sourceIdColumn}
             LIMIT $2 OFFSET $3`,
            [filterLocale, limit, offset],
          );

          results.push(...missingResult.rows.map(row => ({
            contentId: row.content_id,
            contentType: ctKey,
            contentTypeLabel: config.label,
            locale: filterLocale,
          })));
        } catch (dbErr: any) {
          if (dbErr.code !== "42P01") throw dbErr;
        }
      }

      res.json({
        missingTranslations: results.slice(0, limit),
        total: totalCount,
        locale: filterLocale,
        limit,
        offset,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Missing error:", e);
      res.status(500).json({ error: "Failed to load missing translations" });
    }
  });

  app.patch("/api/admin/translation-completeness/edit/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { id } = req.params;
      const { contentType, field, value, status } = req.body;

      if (!contentType || !CONTENT_TYPE_CONFIGS[contentType]) {
        return res.status(400).json({ error: "Invalid or missing contentType" });
      }

      const config = CONTENT_TYPE_CONFIGS[contentType];

      if (field && !config.allFields.includes(field)) {
        return res.status(400).json({ error: `Invalid field: ${field}. Allowed: ${config.allFields.join(", ")}` });
      }

      if (status && !isValidStatus(status)) {
        return res.status(400).json({ error: `Invalid status: ${status}. Allowed: ${TRANSLATION_STATUS_VALUES.join(", ")}` });
      }

      const existingResult = await pool.query(
        `SELECT * FROM ${config.tableName} WHERE id = $1`,
        [id],
      );

      if (existingResult.rows.length === 0) {
        return res.status(404).json({ error: "Translation record not found" });
      }

      const existing = existingResult.rows[0];

      if (status && !isLegalTransition(existing.translation_status, status)) {
        return res.status(400).json({
          error: `Illegal status transition: ${existing.translation_status} → ${status}. Allowed transitions: ${LEGAL_STATUS_TRANSITIONS[existing.translation_status]?.join(", ") || "none"}`,
        });
      }

      const setClauses: string[] = ["updated_at = NOW()"];
      const params: any[] = [];
      let paramIdx = 1;

      if (field && value !== undefined) {
        params.push(value);
        setClauses.push(`${field} = $${paramIdx}`);
        paramIdx++;
      }

      if (status) {
        params.push(status);
        setClauses.push(`translation_status = $${paramIdx}`);
        paramIdx++;

        if (status === "approved" || status === "reviewed") {
          setClauses.push("reviewed_at = NOW()");
        }
        if (status === "machine_translated" || status === "draft") {
          setClauses.push("translated_at = NOW()");
        }
      }

      params.push(id);
      const updateResult = await pool.query(
        `UPDATE ${config.tableName} SET ${setClauses.join(", ")} WHERE id = $${paramIdx} RETURNING *`,
        params,
      );

      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, before_json, after_json, severity, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, 'info', NOW())`,
        [
          admin.id || null,
          admin.username || "admin",
          `${contentType}_translation`,
          id,
          "translation_inline_edit",
          JSON.stringify({ field, oldValue: existing[field], oldStatus: existing.translation_status }),
          JSON.stringify({ field, newValue: value, newStatus: status || existing.translation_status }),
        ],
      );

      res.json({ ok: true, translation: updateResult.rows[0] });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Edit error:", e);
      res.status(500).json({ error: "Failed to edit translation" });
    }
  });

  app.post("/api/admin/translation-completeness/bulk-status", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { ids, contentType, targetStatus } = req.body;

      if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500) {
        return res.status(400).json({ error: "ids must be a non-empty array (max 500)" });
      }

      if (!contentType || !CONTENT_TYPE_CONFIGS[contentType]) {
        return res.status(400).json({ error: "Invalid or missing contentType" });
      }

      if (!targetStatus || !isValidStatus(targetStatus)) {
        return res.status(400).json({ error: `Invalid targetStatus. Allowed: ${TRANSLATION_STATUS_VALUES.join(", ")}` });
      }

      const config = CONTENT_TYPE_CONFIGS[contentType];

      const existingResult = await pool.query(
        `SELECT id, translation_status FROM ${config.tableName} WHERE id = ANY($1)`,
        [ids],
      );

      const illegalTransitions: { id: string; from: string; to: string }[] = [];
      const validIds: string[] = [];

      for (const row of existingResult.rows) {
        if (!isLegalTransition(row.translation_status, targetStatus)) {
          illegalTransitions.push({ id: row.id, from: row.translation_status, to: targetStatus });
        } else {
          validIds.push(row.id);
        }
      }

      let updatedCount = 0;
      if (validIds.length > 0) {
        const extraSets: string[] = [];
        if (targetStatus === "approved" || targetStatus === "reviewed") {
          extraSets.push("reviewed_at = NOW()");
        }
        if (targetStatus === "machine_translated" || targetStatus === "draft") {
          extraSets.push("translated_at = NOW()");
        }

        const setClauses = [
          "translation_status = $1",
          "updated_at = NOW()",
          ...extraSets,
        ].join(", ");

        const result = await pool.query(
          `UPDATE ${config.tableName} SET ${setClauses} WHERE id = ANY($2)`,
          [targetStatus, validIds],
        );
        updatedCount = result.rowCount || 0;
      }

      await pool.query(
        `INSERT INTO audit_logs (id, actor_id, actor_username, entity_type, entity_id, action, after_json, severity, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'info', NOW())`,
        [
          admin.id || null,
          admin.username || "admin",
          `${contentType}_translation`,
          null,
          "translation_bulk_status_update",
          JSON.stringify({ targetStatus, updatedCount, totalRequested: ids.length, illegalCount: illegalTransitions.length }),
        ],
      );

      res.json({
        ok: true,
        updatedCount,
        totalRequested: ids.length,
        illegalTransitions: illegalTransitions.slice(0, 20),
        illegalCount: illegalTransitions.length,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Bulk status error:", e);
      res.status(500).json({ error: "Failed to perform bulk status update" });
    }
  });

  app.get("/api/admin/translation-completeness/item/:contentType/:contentId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, contentId } = req.params;
      const locale = req.query.locale as string | undefined;

      if (!CONTENT_TYPE_CONFIGS[contentType]) {
        return res.status(400).json({ error: "Invalid contentType" });
      }

      const config = CONTENT_TYPE_CONFIGS[contentType];
      const locales = locale ? [locale] : TARGET_LOCALES;
      const completeness: any[] = [];

      for (const loc of locales) {
        const result = await getTranslationCompletenessForContent(contentType, contentId, loc);
        completeness.push({ locale: loc, ...result });
      }

      const overallApproved = completeness.reduce((s, c) => s + c.approvedCount, 0);
      const overallTotal = completeness.reduce((s, c) => s + c.totalRequired, 0);

      res.json({
        contentType,
        contentId,
        requiredFields: config.requiredFields,
        completeness,
        overallPercentage: overallTotal > 0
          ? Math.round((overallApproved / overallTotal) * 1000) / 10
          : 0,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Item error:", e);
      res.status(500).json({ error: "Failed to check item completeness" });
    }
  });

  app.get("/api/admin/translation-completeness/stale-metrics", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const metrics: any[] = [];

      for (const [ctKey, config] of Object.entries(CONTENT_TYPE_CONFIGS)) {
        try {
          const result = await pool.query(
            `SELECT
              t.locale,
              COUNT(*)::int as stale_count
            FROM ${config.tableName} t
            JOIN ${config.sourceTable} s ON s.${config.sourceIdColumn} = t.content_id
            WHERE t.source_version < s.source_version
            GROUP BY t.locale
            ORDER BY stale_count DESC`,
          );

          if (result.rows.length > 0) {
            metrics.push({
              contentType: ctKey,
              label: config.label,
              byLocale: result.rows,
              totalStale: result.rows.reduce((s: number, r: any) => s + r.stale_count, 0),
            });
          }
        } catch (dbErr: any) {
          if (dbErr.code !== "42P01") throw dbErr;
        }
      }

      const totalStale = metrics.reduce((s: number, m: any) => s + m.totalStale, 0);
      const byContentType: Record<string, number> = {};
      const byLocale: Record<string, number> = {};
      for (const m of metrics) {
        byContentType[m.contentType] = m.totalStale;
        for (const row of m.byLocale) {
          byLocale[row.locale] = (byLocale[row.locale] || 0) + row.stale_count;
        }
      }
      res.json({ totalStale, byContentType, byLocale, details: metrics });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Stale metrics error:", e);
      res.status(500).json({ error: "Failed to load stale metrics" });
    }
  });

  app.post("/api/admin/translation-completeness/publishing-gate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, contentId, threshold } = req.body;

      if (!contentType || !CONTENT_TYPE_CONFIGS[contentType]) {
        return res.status(400).json({ error: "Invalid or missing contentType" });
      }

      if (!contentId) {
        return res.status(400).json({ error: "contentId is required" });
      }

      const effectiveThreshold = typeof threshold === "number" ? Math.max(0, Math.min(100, threshold)) : 100;
      const gate = await checkPublishingGate(contentType, contentId, effectiveThreshold);

      res.json({
        contentType,
        contentId,
        threshold: effectiveThreshold,
        canPublish: gate.canPublish,
        failures: gate.failures,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Publishing gate error:", e);
      res.status(500).json({ error: "Failed to check publishing gate" });
    }
  });

  app.get("/api/admin/translation-completeness/config", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      res.json({
        contentTypes: Object.entries(CONTENT_TYPE_CONFIGS).map(([key, config]) => ({
          key,
          label: config.label,
          requiredFields: config.requiredFields,
          allFields: config.allFields,
        })),
        targetLocales: TARGET_LOCALES,
        statusValues: TRANSLATION_STATUS_VALUES,
        legalTransitions: LEGAL_STATUS_TRANSITIONS,
      });
    } catch (e: any) {
      console.error("[TranslationCompleteness] Config error:", e);
      res.status(500).json({ error: "Failed to load config" });
    }
  });
}

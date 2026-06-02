import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const CONTENT_TYPES = ["question", "flashcard", "lesson", "scenario", "glossary", "seo_page", "study_guide", "practice_exam"] as const;
type ContentType = typeof CONTENT_TYPES[number];

const VALID_PROFESSION_TRACKS = ["PCP", "ACP", "General"];
const VALID_REGIONS = ["US", "CA", "BOTH"];
const VALID_VISIBILITY_TIERS = ["free", "pcp", "acp"];
const VALID_STATUSES = ["draft", "published", "archived"];

const CONTENT_TYPE_FIELDS: Record<string, { required: string[]; optional: string[] }> = {
  question: {
    required: ["stem", "options", "correctAnswer", "rationaleLong", "learningObjective", "blueprintCategory", "subtopic", "difficulty", "cognitiveLevel", "questionType"],
    optional: ["examTrap", "clinicalPearls", "safetyNote", "distractorRationales", "isFree", "professionTrack", "region", "visibilityTier"],
  },
  flashcard: {
    required: ["front", "back", "cardType"],
    optional: ["rationale", "blueprintCategory", "subtopic", "professionTrack", "region", "visibilityTier"],
  },
  lesson: {
    required: ["title", "slug", "content"],
    optional: ["moduleId", "orderIndex", "clinicalReasoning", "decisionTree", "commonMistakes", "examTrapWarning", "checkpointQuestions", "professionTrack", "region", "visibilityTier"],
  },
  scenario: {
    required: ["title", "slug", "category", "dispatchInfo", "sceneDescription", "sceneSafety", "primaryAssessment", "secondaryAssessment"],
    optional: ["difficulty", "examRelevance", "vitalSigns", "history", "decisionPoints", "correctInterventions", "commonErrors", "debrief", "learningObjectives", "relatedLessonSlugs", "professionTrack", "region", "visibilityTier"],
  },
  glossary: {
    required: ["term", "definition", "category"],
    optional: ["relatedTerms", "clinicalRelevance", "examTip", "professionTrack", "region", "visibilityTier"],
  },
  seo_page: {
    required: ["title", "slug", "metaDescription", "content"],
    optional: ["keywords", "category", "professionTrack", "region", "visibilityTier"],
  },
  study_guide: {
    required: ["title", "slug", "content"],
    optional: ["category", "difficulty", "estimatedTime", "learningObjectives", "professionTrack", "region", "visibilityTier"],
  },
  practice_exam: {
    required: ["title", "slug", "questions"],
    optional: ["category", "difficulty", "timeLimit", "passingScore", "professionTrack", "region", "visibilityTier"],
  },
};


function normalizeText(text: string): string {
  if (typeof text !== "string") return text;
  return text
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeValue(value: any): any {
  if (typeof value === "string") return normalizeText(value);
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === "object") {
    const result: any = {};
    for (const [k, v] of Object.entries(value)) result[k] = normalizeValue(v);
    return result;
  }
  return value;
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };

  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    rows.push(row);
  }
  return { headers, rows };
}

function parseTabular(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return { headers: [], rows: [] };
  const delimiter = lines[0].includes("\t") ? "\t" : lines[0].includes("|") ? "|" : "\t";
  const headers = lines[0].split(delimiter).map(h => h.trim()).filter(Boolean);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^[-|=+\s]+$/.test(line)) continue;
    const values = line.split(delimiter).map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    rows.push(row);
  }
  return { headers, rows };
}

function detectInputFormat(input: string): "json" | "csv" | "tabular" {
  const trimmed = input.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) return "json";
  const firstLine = trimmed.split("\n")[0];
  if (firstLine.includes(",") && (firstLine.split(",").length > 2 || firstLine.includes('"'))) return "csv";
  return "tabular";
}

function parseInput(input: string, format?: string): { headers: string[]; rows: Record<string, any>[]; detectedFormat: string } {
  const detectedFormat = format || detectInputFormat(input);
  if (detectedFormat === "json") {
    const parsed = JSON.parse(input.trim());
    const items = Array.isArray(parsed) ? parsed : [parsed];
    const headers = items.length > 0 ? Object.keys(items[0]) : [];
    return { headers, rows: items, detectedFormat };
  }
  if (detectedFormat === "csv") {
    const { headers, rows } = parseCSV(input);
    return { headers, rows, detectedFormat };
  }
  const { headers, rows } = parseTabular(input);
  return { headers, rows, detectedFormat };
}

interface ValidationError {
  row: number;
  field: string;
  severity: "error" | "warning";
  message: string;
  suggestedFix?: string;
}

async function validateItem(item: Record<string, any>, contentType: string, rowIndex: number, existingSlugs: Set<string>): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const fieldDefs = CONTENT_TYPE_FIELDS[contentType];
  if (!fieldDefs) {
    errors.push({ row: rowIndex, field: "contentType", severity: "error", message: `Unknown content type: ${contentType}`, suggestedFix: `Use one of: ${CONTENT_TYPES.join(", ")}` });
    return errors;
  }

  if (item.contentDomain && item.contentDomain !== "paramedic") {
    errors.push({ row: rowIndex, field: "contentDomain", severity: "error", message: `contentDomain must be "paramedic", got "${item.contentDomain}"`, suggestedFix: 'Set contentDomain to "paramedic"' });
  }

  for (const field of fieldDefs.required) {
    if (item[field] === undefined || item[field] === null || item[field] === "") {
      errors.push({ row: rowIndex, field, severity: "error", message: `Required field "${field}" is missing`, suggestedFix: `Provide a value for "${field}"` });
    }
  }

  if (item.slug) {
    if (!/^[a-z0-9-]+$/.test(item.slug)) {
      errors.push({ row: rowIndex, field: "slug", severity: "error", message: "Slug must contain only lowercase letters, numbers, and hyphens", suggestedFix: `Convert to: ${String(item.slug).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-")}` });
    }
    if (existingSlugs.has(item.slug)) {
      errors.push({ row: rowIndex, field: "slug", severity: "error", message: `Duplicate slug: "${item.slug}"`, suggestedFix: `Add a unique suffix, e.g., "${item.slug}-2"` });
    }
    existingSlugs.add(item.slug);
  }

  if (item.professionTrack && !VALID_PROFESSION_TRACKS.includes(item.professionTrack)) {
    errors.push({ row: rowIndex, field: "professionTrack", severity: "error", message: `Invalid professionTrack: "${item.professionTrack}"`, suggestedFix: `Use one of: ${VALID_PROFESSION_TRACKS.join(", ")}` });
  }

  if (item.region && !VALID_REGIONS.includes(item.region)) {
    errors.push({ row: rowIndex, field: "region", severity: "error", message: `Invalid region: "${item.region}"`, suggestedFix: `Use one of: ${VALID_REGIONS.join(", ")}` });
  }

  if (item.visibilityTier && !VALID_VISIBILITY_TIERS.includes(item.visibilityTier)) {
    errors.push({ row: rowIndex, field: "visibilityTier", severity: "error", message: `Invalid visibilityTier: "${item.visibilityTier}"`, suggestedFix: `Use one of: ${VALID_VISIBILITY_TIERS.join(", ")}` });
  }

  if (contentType === "question") {
    if (item.options) {
      const opts = typeof item.options === "string" ? tryParseJSON(item.options) : item.options;
      if (!Array.isArray(opts) || opts.length < 4) {
        errors.push({ row: rowIndex, field: "options", severity: "error", message: "Questions must have at least 4 options", suggestedFix: "Provide an array of at least 4 answer options" });
      }
    }
    if (item.difficulty !== undefined) {
      const diff = Number(item.difficulty);
      if (isNaN(diff) || diff < 1 || diff > 5) {
        errors.push({ row: rowIndex, field: "difficulty", severity: "error", message: "Difficulty must be 1-5", suggestedFix: "Set difficulty between 1 and 5" });
      }
    }
    if (item.rationaleLong && typeof item.rationaleLong === "string") {
      const words = item.rationaleLong.trim().split(/\s+/).length;
      if (words < 50) {
        errors.push({ row: rowIndex, field: "rationaleLong", severity: "warning", message: `Rationale is short (${words} words)`, suggestedFix: "Consider expanding the rationale to at least 100 words" });
      }
    }
  }

  if (contentType === "lesson") {
    if (item.content && typeof item.content === "string" && item.content.length < 50) {
      errors.push({ row: rowIndex, field: "content", severity: "warning", message: "Lesson content appears very short", suggestedFix: "Expand with an intro and at least one section" });
    }
  }

  return errors;
}

function tryParseJSON(str: string): any {
  try { return JSON.parse(str); } catch { return str; }
}

function applyMapping(row: Record<string, any>, mappings: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [sourceField, targetField] of Object.entries(mappings)) {
    if (targetField && row[sourceField] !== undefined) {
      let value = row[sourceField];
      if (typeof value === "string" && (value.startsWith("[") || value.startsWith("{"))) {
        value = tryParseJSON(value);
      }
      result[targetField] = value;
    }
  }
  return result;
}

export function registerParamedicBulkUploadRoutes(app: Express) {

  app.post("/api/paramedic/bulk/parse", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { input, format } = req.body;
      if (!input) return res.status(400).json({ error: "Input data required" });

      const { headers, rows, detectedFormat } = parseInput(input, format);
      res.json({ headers, rowCount: rows.length, detectedFormat, sampleRows: rows.slice(0, 5) });
    } catch (e: any) {
      res.status(400).json({ error: `Parse error: ${e.message}` });
    }
  });

  app.get("/api/paramedic/bulk/schema/:contentType", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType } = req.params;
      const fields = CONTENT_TYPE_FIELDS[contentType];
      if (!fields) return res.status(400).json({ error: `Unknown content type: ${contentType}` });
      res.json({ contentType, ...fields });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/import", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { input, format, contentType, mappings } = req.body;
      if (!input || !contentType) return res.status(400).json({ error: "input and contentType required" });
      if (!CONTENT_TYPES.includes(contentType)) return res.status(400).json({ error: `Invalid contentType: ${contentType}` });

      const { rows, detectedFormat } = parseInput(input, format);
      if (rows.length === 0) return res.status(400).json({ error: "No rows found in input" });

      const importRes = await pool.query(
        `INSERT INTO paramedic_bulk_imports (content_type, input_format, total_items, status, admin_id, admin_name)
         VALUES ($1, $2, $3, 'validating', $4, $5) RETURNING *`,
        [contentType, detectedFormat, rows.length, admin.id, admin.username]
      );
      const importId = importRes.rows[0].id;

      const existingSlugs = new Set<string>();
      if (["lesson", "scenario", "seo_page", "study_guide", "practice_exam"].includes(contentType)) {
        const tables: Record<string, string> = {
          lesson: "allied_lessons",
          scenario: "paramedic_scenarios",
          seo_page: "allied_draft_assets",
          study_guide: "allied_draft_assets",
          practice_exam: "allied_draft_assets",
        };
        const table = tables[contentType];
        if (table) {
          try {
            const slugRes = await pool.query(`SELECT slug FROM ${table} WHERE career_type = 'paramedic' OR content_domain = 'paramedic'`);
            slugRes.rows.forEach((r: any) => { if (r.slug) existingSlugs.add(r.slug); });
          } catch {}
        }
      }

      let totalValid = 0;
      let totalErrors = 0;
      const allValidationErrors: ValidationError[] = [];

      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (mappings) row = applyMapping(row, mappings);

        row.contentDomain = "paramedic";
        const normalized = normalizeValue(row);
        const errors = await validateItem(normalized, contentType, i + 1, existingSlugs);

        const hasError = errors.some(e => e.severity === "error");
        if (hasError) totalErrors++;
        else totalValid++;
        allValidationErrors.push(...errors);

        await pool.query(
          `INSERT INTO paramedic_bulk_import_items (import_id, row_index, content_type, content_domain, raw_data, mapped_data, normalized_data, validation_status, validation_errors, status)
           VALUES ($1, $2, $3, 'paramedic', $4, $5, $6, $7, $8, 'draft')`,
          [importId, i + 1, contentType, JSON.stringify(rows[i]), JSON.stringify(row), JSON.stringify(normalized),
           hasError ? "error" : (errors.length > 0 ? "warning" : "pass"),
           errors.length > 0 ? JSON.stringify(errors) : null]
        );
      }

      await pool.query(
        `UPDATE paramedic_bulk_imports SET valid_items = $1, error_items = $2, status = 'validated', validation_results = $3 WHERE id = $4`,
        [totalValid, totalErrors, JSON.stringify({ totalErrors: allValidationErrors.filter(e => e.severity === "error").length, totalWarnings: allValidationErrors.filter(e => e.severity === "warning").length }), importId]
      );

      res.json({
        importId,
        totalItems: rows.length,
        validItems: totalValid,
        errorItems: totalErrors,
        validationErrors: allValidationErrors,
        status: "validated",
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/import/:importId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { importId } = req.params;

      const importRes = await pool.query("SELECT * FROM paramedic_bulk_imports WHERE id = $1", [importId]);
      if (!importRes.rows[0]) return res.status(404).json({ error: "Import not found" });

      const itemsRes = await pool.query(
        "SELECT * FROM paramedic_bulk_import_items WHERE import_id = $1 ORDER BY row_index",
        [importId]
      );

      res.json({ import: importRes.rows[0], items: itemsRes.rows });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/paramedic/bulk/import/:importId/item/:itemId", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { itemId } = req.params;
      const { data } = req.body;

      data.contentDomain = "paramedic";
      const normalized = normalizeValue(data);
      const existingSlugs = new Set<string>();
      const itemRes = await pool.query("SELECT * FROM paramedic_bulk_import_items WHERE id = $1", [itemId]);
      if (!itemRes.rows[0]) return res.status(404).json({ error: "Item not found" });

      const errors = await validateItem(normalized, itemRes.rows[0].content_type, itemRes.rows[0].row_index, existingSlugs);
      const hasError = errors.some(e => e.severity === "error");

      await pool.query(
        `UPDATE paramedic_bulk_import_items SET mapped_data = $1, normalized_data = $2, validation_status = $3, validation_errors = $4 WHERE id = $5`,
        [JSON.stringify(data), JSON.stringify(normalized),
         hasError ? "error" : (errors.length > 0 ? "warning" : "pass"),
         errors.length > 0 ? JSON.stringify(errors) : null, itemId]
      );

      res.json({ itemId, validationStatus: hasError ? "error" : "pass", errors });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/import/:importId/revalidate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { importId } = req.params;

      const itemsRes = await pool.query(
        "SELECT * FROM paramedic_bulk_import_items WHERE import_id = $1 ORDER BY row_index",
        [importId]
      );

      const existingSlugs = new Set<string>();
      let totalValid = 0;
      let totalErrors = 0;
      const allErrors: ValidationError[] = [];

      for (const item of itemsRes.rows) {
        const data = item.normalized_data || item.mapped_data || item.raw_data;
        const errors = await validateItem(data, item.content_type, item.row_index, existingSlugs);
        const hasError = errors.some(e => e.severity === "error");
        if (hasError) totalErrors++;
        else totalValid++;
        allErrors.push(...errors);

        await pool.query(
          `UPDATE paramedic_bulk_import_items SET validation_status = $1, validation_errors = $2 WHERE id = $3`,
          [hasError ? "error" : (errors.length > 0 ? "warning" : "pass"),
           errors.length > 0 ? JSON.stringify(errors) : null, item.id]
        );
      }

      await pool.query(
        `UPDATE paramedic_bulk_imports SET valid_items = $1, error_items = $2, status = 'validated', validation_results = $3 WHERE id = $4`,
        [totalValid, totalErrors, JSON.stringify({ totalErrors: allErrors.filter(e => e.severity === "error").length, totalWarnings: allErrors.filter(e => e.severity === "warning").length }), importId]
      );

      res.json({ totalItems: itemsRes.rows.length, validItems: totalValid, errorItems: totalErrors, validationErrors: allErrors });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/import/:importId/publish", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { importId } = req.params;
      const { itemIds } = req.body;

      const importRes = await pool.query("SELECT * FROM paramedic_bulk_imports WHERE id = $1", [importId]);
      if (!importRes.rows[0]) return res.status(404).json({ error: "Import not found" });
      const contentType = importRes.rows[0].content_type;

      let query = "SELECT * FROM paramedic_bulk_import_items WHERE import_id = $1 AND validation_status != 'error' AND status = 'draft'";
      const params: any[] = [importId];
      if (itemIds && itemIds.length > 0) {
        query += " AND id = ANY($2)";
        params.push(itemIds);
      }
      const itemsRes = await pool.query(query + " ORDER BY row_index", params);

      if (itemsRes.rows.length === 0) return res.status(400).json({ error: "No valid draft items to publish" });

      const publishedIds: string[] = [];
      const rollbackData: any[] = [];
      let published = 0;

      for (const item of itemsRes.rows) {
        const data = item.normalized_data || item.mapped_data;
        if (!data) continue;

        try {
          let publishedId: string | null = null;

          switch (contentType) {
            case "question": {
              const r = await pool.query(
                `INSERT INTO allied_questions (career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status)
                 VALUES ('paramedic', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'published') RETURNING id`,
                [data.stem, JSON.stringify(typeof data.options === "string" ? tryParseJSON(data.options) : data.options),
                 Number(data.correctAnswer), data.rationaleLong, data.learningObjective, data.blueprintCategory,
                 data.subtopic, Number(data.difficulty), data.cognitiveLevel, data.questionType,
                 data.examTrap || null, data.clinicalPearls ? JSON.stringify(typeof data.clinicalPearls === "string" ? tryParseJSON(data.clinicalPearls) : data.clinicalPearls) : null,
                 data.safetyNote || null, data.distractorRationales ? JSON.stringify(typeof data.distractorRationales === "string" ? tryParseJSON(data.distractorRationales) : data.distractorRationales) : null,
                 data.isFree === true || data.isFree === "true"]
              );
              publishedId = r.rows[0].id;
              break;
            }
            case "flashcard": {
              const r = await pool.query(
                `INSERT INTO allied_flashcards (career_type, card_type, front, back, rationale, blueprint_category, subtopic)
                 VALUES ('paramedic', $1, $2, $3, $4, $5, $6) RETURNING id`,
                [data.cardType, data.front, data.back, data.rationale || null, data.blueprintCategory || null, data.subtopic || null]
              );
              publishedId = r.rows[0].id;
              break;
            }
            case "lesson": {
              const r = await pool.query(
                `INSERT INTO allied_lessons (module_id, career_type, slug, title, content, order_index, clinical_reasoning, decision_tree, common_mistakes, exam_trap_warning, checkpoint_questions, status)
                 VALUES ($1, 'paramedic', $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published') RETURNING id`,
                [data.moduleId || "default", data.slug, data.title, data.content, Number(data.orderIndex) || 0,
                 data.clinicalReasoning || null, data.decisionTree || null,
                 data.commonMistakes ? JSON.stringify(typeof data.commonMistakes === "string" ? tryParseJSON(data.commonMistakes) : data.commonMistakes) : null,
                 data.examTrapWarning || null,
                 data.checkpointQuestions ? JSON.stringify(typeof data.checkpointQuestions === "string" ? tryParseJSON(data.checkpointQuestions) : data.checkpointQuestions) : null]
              );
              publishedId = r.rows[0].id;
              break;
            }
            case "scenario": {
              const r = await pool.query(
                `INSERT INTO paramedic_scenarios (title, slug, content_domain, profession_track, region, visibility_tier, difficulty, exam_relevance, category, dispatch_info, scene_description, scene_safety, primary_assessment, secondary_assessment, vital_signs, history, decision_points, correct_interventions, common_errors, debrief, learning_objectives, related_lesson_slugs, status)
                 VALUES ($1, $2, 'paramedic', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, 'published') RETURNING id`,
                [data.title, data.slug, data.professionTrack || "General", data.region || "BOTH", data.visibilityTier || "free",
                 Number(data.difficulty) || 3, data.examRelevance || "medium", data.category,
                 data.dispatchInfo, data.sceneDescription, data.sceneSafety, data.primaryAssessment, data.secondaryAssessment,
                 data.vitalSigns ? JSON.stringify(typeof data.vitalSigns === "string" ? tryParseJSON(data.vitalSigns) : data.vitalSigns) : "{}",
                 data.history ? JSON.stringify(typeof data.history === "string" ? tryParseJSON(data.history) : data.history) : "{}",
                 data.decisionPoints ? JSON.stringify(typeof data.decisionPoints === "string" ? tryParseJSON(data.decisionPoints) : data.decisionPoints) : "[]",
                 data.correctInterventions ? (typeof data.correctInterventions === "string" ? tryParseJSON(data.correctInterventions) : data.correctInterventions) : [],
                 data.commonErrors ? (typeof data.commonErrors === "string" ? tryParseJSON(data.commonErrors) : data.commonErrors) : [],
                 data.debrief || "", data.learningObjectives ? (typeof data.learningObjectives === "string" ? tryParseJSON(data.learningObjectives) : data.learningObjectives) : [],
                 data.relatedLessonSlugs ? (typeof data.relatedLessonSlugs === "string" ? tryParseJSON(data.relatedLessonSlugs) : data.relatedLessonSlugs) : []]
              );
              publishedId = r.rows[0].id;
              break;
            }
            default: {
              const r = await pool.query(
                `INSERT INTO allied_draft_assets (type, status, career_type, domain, subtopic, title, payload, created_by)
                 VALUES ($1, 'published', 'paramedic', $2, $3, $4, $5, 'bulk_import') RETURNING id`,
                [contentType, data.category || data.domain || null, data.subtopic || null,
                 data.title || data.term || `${contentType}-${item.row_index}`,
                 JSON.stringify(data)]
              );
              publishedId = r.rows[0].id;
              break;
            }
          }

          if (publishedId) {
            publishedIds.push(publishedId);
            rollbackData.push({ table: getTableForType(contentType), id: publishedId });
            await pool.query(
              "UPDATE paramedic_bulk_import_items SET status = 'published', published_id = $1 WHERE id = $2",
              [publishedId, item.id]
            );
            published++;
          }
        } catch (err: any) {
          await pool.query(
            "UPDATE paramedic_bulk_import_items SET validation_status = 'error', validation_errors = $1 WHERE id = $2",
            [JSON.stringify([{ row: item.row_index, field: "publish", severity: "error", message: err.message }]), item.id]
          );
        }
      }

      await pool.query(
        `UPDATE paramedic_bulk_imports SET published_items = $1, status = $2, rollback_data = $3, completed_at = NOW() WHERE id = $4`,
        [published, published > 0 ? "published" : "error", JSON.stringify(rollbackData), importId]
      );

      res.json({ published, total: itemsRes.rows.length, publishedIds, status: "published" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/import/:importId/rollback", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { importId } = req.params;

      const importRes = await pool.query("SELECT * FROM paramedic_bulk_imports WHERE id = $1", [importId]);
      if (!importRes.rows[0]) return res.status(404).json({ error: "Import not found" });

      const rollbackData = importRes.rows[0].rollback_data;
      if (!rollbackData || !Array.isArray(rollbackData) || rollbackData.length === 0) {
        return res.status(400).json({ error: "No rollback data available" });
      }

      const ALLOWED_ROLLBACK_TABLES = ["allied_questions", "allied_flashcards", "allied_lessons", "paramedic_scenarios", "allied_draft_assets"];
      let rolled = 0;
      const errors: string[] = [];
      for (const item of rollbackData) {
        if (!ALLOWED_ROLLBACK_TABLES.includes(item.table)) {
          errors.push(`Invalid table "${item.table}" for rollback item ${item.id}`);
          continue;
        }
        try {
          const domainCol = item.table === "paramedic_scenarios" ? "content_domain" : "career_type";
          await pool.query(`DELETE FROM ${item.table} WHERE id = $1 AND ${domainCol} = 'paramedic'`, [item.id]);
          rolled++;
        } catch (err: any) {
          errors.push(`Failed to rollback ${item.id} from ${item.table}: ${err.message}`);
        }
      }

      await pool.query(
        "UPDATE paramedic_bulk_imports SET status = 'rolled_back', published_items = 0 WHERE id = $1",
        [importId]
      );
      await pool.query(
        "UPDATE paramedic_bulk_import_items SET status = 'draft', published_id = NULL WHERE import_id = $1",
        [importId]
      );

      res.json({ rolledBack: rolled, total: rollbackData.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/history", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { page, contentType, status } = req.query;

      const conditions: string[] = [];
      const params: any[] = [];
      let idx = 1;
      if (contentType) { conditions.push(`content_type = $${idx++}`); params.push(contentType); }
      if (status) { conditions.push(`status = $${idx++}`); params.push(status); }
      const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
      const offset = ((parseInt(page as string) || 1) - 1) * 20;
      params.push(20); params.push(offset);

      const countRes = await pool.query(`SELECT COUNT(*) as total FROM paramedic_bulk_imports ${where}`, params.slice(0, -2));
      const r = await pool.query(
        `SELECT * FROM paramedic_bulk_imports ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
        params
      );

      res.json({ imports: r.rows, total: parseInt(countRes.rows[0].total), page: parseInt(page as string) || 1 });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/library", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType, status, category, difficulty, professionTrack, region, visibilityTier, page, search } = req.query;

      const pageNum = parseInt(page as string) || 1;
      const limit = 25;
      const offset = (pageNum - 1) * limit;

      const results: any[] = [];
      let total = 0;

      const tables = contentType
        ? [{ type: contentType as string, table: getTableForType(contentType as string) }]
        : [
            { type: "question", table: "allied_questions" },
            { type: "flashcard", table: "allied_flashcards" },
            { type: "lesson", table: "allied_lessons" },
            { type: "scenario", table: "paramedic_scenarios" },
            { type: "draft_asset", table: "allied_draft_assets" },
          ];

      for (const { type, table } of tables) {
        try {
          const conditions: string[] = [];
          const params: any[] = [];
          let idx = 1;

          if (table === "paramedic_scenarios") {
            conditions.push(`content_domain = 'paramedic'`);
          } else if (table === "allied_draft_assets") {
            conditions.push(`career_type = 'paramedic'`);
          } else {
            conditions.push(`career_type = 'paramedic'`);
          }

          if (status) { conditions.push(`status = $${idx++}`); params.push(status); }

          const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

          const countRes = await pool.query(`SELECT COUNT(*) as cnt FROM ${table} ${where}`, params);
          total += parseInt(countRes.rows[0].cnt);

          if (!contentType) {
            const sampleRes = await pool.query(`SELECT id, '${type}' as content_type, created_at FROM ${table} ${where} ORDER BY created_at DESC LIMIT 5`, params);
            results.push(...sampleRes.rows);
          } else {
            const allParams = [...params, limit, offset];
            const dataRes = await pool.query(
              `SELECT *, '${type}' as content_type FROM ${table} ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
              allParams
            );
            results.push(...dataRes.rows);
          }
        } catch (err: any) {
          console.error(`[paramedic-bulk] Library query error for table ${table}:`, err.message);
        }
      }

      res.json({ items: results, total, page: pageNum });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/library/bulk-action", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { action, contentType, ids } = req.body;

      if (!action || !contentType || !ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "action, contentType, and ids are required" });
      }

      const table = getTableForType(contentType);
      let affected = 0;

      const domainCol = table === "paramedic_scenarios" ? "content_domain" : "career_type";
      const domainFilter = `AND ${domainCol} = 'paramedic'`;

      switch (action) {
        case "publish":
          for (const id of ids) {
            const r = await pool.query(`UPDATE ${table} SET status = 'published' WHERE id = $1 ${domainFilter}`, [id]);
            affected += r.rowCount || 0;
          }
          break;
        case "unpublish":
          for (const id of ids) {
            const r = await pool.query(`UPDATE ${table} SET status = 'draft' WHERE id = $1 ${domainFilter}`, [id]);
            affected += r.rowCount || 0;
          }
          break;
        case "archive":
          for (const id of ids) {
            const r = await pool.query(`UPDATE ${table} SET status = 'archived' WHERE id = $1 ${domainFilter}`, [id]);
            affected += r.rowCount || 0;
          }
          break;
        case "delete":
          for (const id of ids) {
            const r = await pool.query(`DELETE FROM ${table} WHERE id = $1 ${domainFilter}`, [id]);
            affected += r.rowCount || 0;
          }
          break;
        default:
          return res.status(400).json({ error: `Unknown action: ${action}` });
      }

      res.json({ affected, action });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/mapping-templates", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType } = req.query;
      let query = "SELECT * FROM paramedic_field_mapping_templates";
      const params: any[] = [];
      if (contentType) {
        query += " WHERE content_type = $1";
        params.push(contentType);
      }
      query += " ORDER BY created_at DESC";
      const r = await pool.query(query, params);
      res.json(r.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/paramedic/bulk/mapping-templates", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { name, contentType, mappings } = req.body;
      if (!name || !contentType || !mappings) return res.status(400).json({ error: "name, contentType, and mappings required" });

      const r = await pool.query(
        "INSERT INTO paramedic_field_mapping_templates (name, content_type, mappings) VALUES ($1, $2, $3) RETURNING *",
        [name, contentType, JSON.stringify(mappings)]
      );
      res.json(r.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/paramedic/bulk/mapping-templates/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      await pool.query("DELETE FROM paramedic_field_mapping_templates WHERE id = $1", [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/content-types", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      res.json(CONTENT_TYPES.map(t => ({ id: t, fields: CONTENT_TYPE_FIELDS[t] })));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/paramedic/bulk/templates/:contentType", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;
      const { contentType } = req.params;
      const fields = CONTENT_TYPE_FIELDS[contentType];
      if (!fields) return res.status(400).json({ error: `Unknown type: ${contentType}` });

      const template: Record<string, string> = {};
      [...fields.required, ...fields.optional].forEach(f => {
        template[f] = f === "contentDomain" ? "paramedic" : "";
      });
      template.contentDomain = "paramedic";

      res.json({ contentType, template, csvHeaders: Object.keys(template).join(",") });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

function getTableForType(contentType: string): string {
  const map: Record<string, string> = {
    question: "allied_questions",
    flashcard: "allied_flashcards",
    lesson: "allied_lessons",
    scenario: "paramedic_scenarios",
    glossary: "allied_draft_assets",
    seo_page: "allied_draft_assets",
    study_guide: "allied_draft_assets",
    practice_exam: "allied_draft_assets",
  };
  return map[contentType] || "allied_draft_assets";
}

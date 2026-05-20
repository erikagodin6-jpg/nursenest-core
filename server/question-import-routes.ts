import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";
import multer from "multer";
import crypto from "crypto";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const REQUIRED_FIELDS = ["question_text", "correct_answer"];
const VALID_QUESTION_TYPES = ["single_best_answer", "multiple_response", "image_interpretation", "case_based", "comparison", "sequencing", "drag_and_drop"];
const VALID_DIFFICULTIES = [1, 2, 3, 4, 5];

interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
}

interface ValidationIssue {
  row: number;
  field: string;
  type: "error" | "warning";
  message: string;
  suggestedFix?: string;
}

function parseCSV(content: string): ParsedRow[] {
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const data: Record<string, any> = {};
    headers.forEach((h, idx) => {
      data[h.trim().toLowerCase().replace(/\s+/g, "_")] = values[idx]?.trim() || "";
    });
    rows.push({ rowNumber: i + 1, data });
  }
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
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
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseJSON(content: string): ParsedRow[] {
  const data = JSON.parse(content);
  const arr = Array.isArray(data) ? data : (data.questions || data.rows || [data]);
  return arr.map((item: any, idx: number) => {
    const normalized: Record<string, any> = {};
    for (const [key, value] of Object.entries(item)) {
      normalized[key.toLowerCase().replace(/\s+/g, "_").replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`).replace(/^_/, "")] = value;
    }
    return { rowNumber: idx + 2, data: normalized };
  });
}

async function parseXLSX(buffer: Buffer): Promise<ParsedRow[]> {
  try {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

    return jsonData.map((item, idx) => {
      const normalized: Record<string, any> = {};
      for (const [key, value] of Object.entries(item)) {
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, "_");
        normalized[normalizedKey] = typeof value === "string" ? value.trim() : value;
      }
      return { rowNumber: idx + 2, data: normalized };
    });
  } catch (e: any) {
    throw new Error(`Failed to parse XLSX: ${e.message}`);
  }
}

function validateRow(row: ParsedRow, existingIds: Set<string>): { errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const d = row.data;

  if (!d.question_text && !d.questiontext && !d.stem) {
    errors.push({ row: row.rowNumber, field: "question_text", type: "error", message: "Question text is required" });
  }

  if (!d.correct_answer && !d.correctanswer && !d.answer) {
    errors.push({ row: row.rowNumber, field: "correct_answer", type: "error", message: "Correct answer is required" });
  }

  const qText = d.question_text || d.questiontext || d.stem || "";
  if (qText && qText.length < 10) {
    warnings.push({ row: row.rowNumber, field: "question_text", type: "warning", message: "Question text is very short (less than 10 characters)", suggestedFix: "Add more detail to the question" });
  }

  if (!d.option_a && !d.optiona && !d.options) {
    warnings.push({ row: row.rowNumber, field: "option_a", type: "warning", message: "No answer options provided (option_a)", suggestedFix: "Add at least option_a through option_d" });
  }

  const qType = d.question_type || d.questiontype || d.type || "";
  if (qType && !VALID_QUESTION_TYPES.includes(qType.toLowerCase())) {
    warnings.push({ row: row.rowNumber, field: "question_type", type: "warning", message: `Unknown question type: "${qType}"`, suggestedFix: `Use one of: ${VALID_QUESTION_TYPES.join(", ")}` });
  }

  const diff = parseInt(d.difficulty || "0");
  if (d.difficulty && (isNaN(diff) || !VALID_DIFFICULTIES.includes(diff))) {
    warnings.push({ row: row.rowNumber, field: "difficulty", type: "warning", message: `Invalid difficulty: "${d.difficulty}"`, suggestedFix: "Use a value between 1 and 5" });
  }

  const qid = d.question_id || d.questionid || d.id || "";
  if (qid && existingIds.has(qid)) {
    warnings.push({ row: row.rowNumber, field: "question_id", type: "warning", message: `Duplicate question ID: "${qid}"` });
  }

  if (d.image_reference || d.imagereference) {
    const imgRef = d.image_reference || d.imagereference;
    if (imgRef && !imgRef.match(/^https?:\/\//i) && !imgRef.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      warnings.push({ row: row.rowNumber, field: "image_reference", type: "warning", message: "Image reference may be broken or unsupported format", suggestedFix: "Use a URL or filename with a valid image extension" });
    }
  }

  if (!d.rationale && !d.explanation) {
    warnings.push({ row: row.rowNumber, field: "rationale", type: "warning", message: "No rationale provided", suggestedFix: "Add a rationale for better learning outcomes" });
  }

  return { errors, warnings };
}

async function checkDuplicates(rows: ParsedRow[]): Promise<Map<number, string>> {
  const duplicates = new Map<number, string>();

  const stems = rows.map(r => r.data.question_text || r.data.questiontext || r.data.stem || "");
  const stemHashes = stems.map(s => crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex"));

  if (stemHashes.length > 0) {
    const existingResult = await pool.query(
      `SELECT id, stem_hash FROM exam_questions WHERE stem_hash = ANY($1)`,
      [stemHashes]
    ).catch(() => ({ rows: [] }));

    const existingHashes = new Map(existingResult.rows.map((r: any) => [r.stem_hash, r.id]));

    stemHashes.forEach((hash, idx) => {
      if (existingHashes.has(hash)) {
        duplicates.set(rows[idx].rowNumber, existingHashes.get(hash)!);
      }
    });
  }

  return duplicates;
}

export function registerQuestionImportRoutes(app: Express) {
  app.post("/api/admin/imports/upload", upload.single("file"), async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      const ext = file.originalname.split(".").pop()?.toLowerCase() || "";
      if (!["csv", "json", "xlsx", "xls"].includes(ext)) {
        return res.status(400).json({ error: "Unsupported file format. Use CSV, JSON, or XLSX." });
      }

      let parsedRows: ParsedRow[];
      try {
        if (ext === "csv") {
          parsedRows = parseCSV(file.buffer.toString("utf-8"));
        } else if (ext === "json") {
          parsedRows = parseJSON(file.buffer.toString("utf-8"));
        } else {
          parsedRows = await parseXLSX(file.buffer);
        }
      } catch (parseError: any) {
        return res.status(400).json({ error: `Failed to parse file: ${parseError.message}` });
      }

      if (parsedRows.length === 0) {
        return res.status(400).json({ error: "No data rows found in file" });
      }

      const existingIds = new Set<string>();
      const allErrors: ValidationIssue[] = [];
      const allWarnings: ValidationIssue[] = [];
      let validCount = 0;
      let errorCount = 0;
      let warningCount = 0;

      for (const row of parsedRows) {
        const { errors, warnings } = validateRow(row, existingIds);
        allErrors.push(...errors);
        allWarnings.push(...warnings);
        if (errors.length > 0) errorCount++;
        else validCount++;
        if (warnings.length > 0) warningCount++;

        const qid = row.data.question_id || row.data.questionid || row.data.id || "";
        if (qid) existingIds.add(qid);
      }

      const duplicates = await checkDuplicates(parsedRows);
      const duplicateCount = duplicates.size;

      const preview = parsedRows.slice(0, 5).map(r => ({
        rowNumber: r.rowNumber,
        fields: r.data,
      }));

      const topics = [...new Set(parsedRows.map(r => r.data.topic || r.data.category || "").filter(Boolean))];

      const professionSlug = req.body.profession || parsedRows[0]?.data.profession || null;

      const importResult = await pool.query(
        `INSERT INTO question_bank_imports (file_name, file_format, file_size, profession_slug, status, total_rows, valid_rows, error_rows, warning_rows, duplicate_rows, validation_report, preview_data, mapped_topics, imported_by, imported_by_username)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          file.originalname, ext, file.size, professionSlug, "validated",
          parsedRows.length, validCount, errorCount, warningCount, duplicateCount,
          JSON.stringify({ errors: allErrors.slice(0, 200), warnings: allWarnings.slice(0, 200) }),
          JSON.stringify(preview),
          JSON.stringify(topics),
          admin.id, admin.username,
        ]
      );

      const importId = importResult.rows[0].id;

      const insertBatch: string[] = [];
      const insertValues: any[] = [];
      let valIdx = 1;

      for (const row of parsedRows) {
        const d = row.data;
        const duplicateOf = duplicates.get(row.rowNumber) || null;
        const rowErrors = allErrors.filter(e => e.row === row.rowNumber);
        const rowWarnings = allWarnings.filter(w => w.row === row.rowNumber);
        const rowStatus = rowErrors.length > 0 ? "error" : (duplicateOf ? "duplicate" : "valid");

        insertBatch.push(
          `($${valIdx}, $${valIdx + 1}, $${valIdx + 2}, $${valIdx + 3}, $${valIdx + 4}, $${valIdx + 5}, $${valIdx + 6}, $${valIdx + 7}, $${valIdx + 8}, $${valIdx + 9}, $${valIdx + 10}, $${valIdx + 11}, $${valIdx + 12}, $${valIdx + 13}, $${valIdx + 14}, $${valIdx + 15}, $${valIdx + 16}, $${valIdx + 17}, $${valIdx + 18}, $${valIdx + 19}, $${valIdx + 20})`
        );

        insertValues.push(
          importId, row.rowNumber, rowStatus,
          d.question_id || d.questionid || d.id || null,
          d.profession || professionSlug || null,
          d.country || null,
          d.exam_type || d.examtype || null,
          d.topic || d.category || null,
          d.subtopic || null,
          parseInt(d.difficulty) || null,
          d.question_type || d.questiontype || d.type || "single_best_answer",
          d.question_text || d.questiontext || d.stem || null,
          d.option_a || d.optiona || null,
          d.option_b || d.optionb || null,
          d.option_c || d.optionc || null,
          d.option_d || d.optiond || null,
          d.option_e || d.optione || null,
          d.correct_answer || d.correctanswer || d.answer || null,
          d.rationale || d.explanation || null,
          d.image_reference || d.imagereference || null,
          d.tags || null,
        );
        valIdx += 21;
      }

      if (insertBatch.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < insertBatch.length; i += batchSize) {
          const batch = insertBatch.slice(i, i + batchSize);
          const batchVals = insertValues.slice(i * 21, (i + batchSize) * 21);
          await pool.query(
            `INSERT INTO question_bank_import_rows (import_id, row_number, status, question_id, profession, country, exam_type, topic, subtopic, difficulty, question_type, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, rationale, image_reference, tags)
             VALUES ${batch.join(", ")}`,
            batchVals
          );
        }
      }

      res.json({
        import: snakeToCamel(importResult.rows[0]),
        summary: {
          totalRows: parsedRows.length,
          validRows: validCount,
          errorRows: errorCount,
          warningRows: warningCount,
          duplicateRows: duplicateCount,
          topics,
        },
        preview,
        validation: {
          errors: allErrors.slice(0, 50),
          warnings: allWarnings.slice(0, 50),
        },
      });
    } catch (e: any) {
      console.error("Import upload error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imports", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM question_bank_imports ORDER BY created_at DESC LIMIT 50`
      );
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imports/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const importResult = await pool.query(
        `SELECT * FROM question_bank_imports WHERE id = $1`,
        [req.params.id]
      );
      if (importResult.rows.length === 0) return res.status(404).json({ error: "Import not found" });

      const rowsResult = await pool.query(
        `SELECT * FROM question_bank_import_rows WHERE import_id = $1 ORDER BY row_number ASC LIMIT 500`,
        [req.params.id]
      );

      res.json({
        import: snakeToCamel(importResult.rows[0]),
        rows: rowsResult.rows.map(snakeToCamel),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/imports/:id/execute", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { duplicateStrategy } = req.body;
      const strategy = duplicateStrategy || "skip";

      const importResult = await pool.query(
        `SELECT * FROM question_bank_imports WHERE id = $1`,
        [req.params.id]
      );
      if (importResult.rows.length === 0) return res.status(404).json({ error: "Import not found" });

      const imp = importResult.rows[0];
      if (imp.status === "completed") return res.status(400).json({ error: "Import already completed" });
      if (imp.status === "importing") return res.status(400).json({ error: "Import already in progress" });

      await pool.query(
        `UPDATE question_bank_imports SET status = 'importing', duplicate_strategy = $2, started_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [req.params.id, strategy]
      );

      const rowsResult = await pool.query(
        `SELECT * FROM question_bank_import_rows WHERE import_id = $1 AND status IN ('valid', 'duplicate') ORDER BY row_number ASC`,
        [req.params.id]
      );

      let importedCount = 0;
      let skippedCount = 0;

      for (const row of rowsResult.rows) {
        try {
          if (row.status === "duplicate") {
            if (strategy === "skip") {
              skippedCount++;
              await pool.query(`UPDATE question_bank_import_rows SET status = 'skipped' WHERE id = $1`, [row.id]);
              continue;
            } else if (strategy === "replace" && row.duplicate_of) {
              await pool.query(`DELETE FROM exam_questions WHERE id = $1`, [row.duplicate_of]);
            }
          }

          const stemHash = crypto.createHash("md5").update((row.question_text || "").toLowerCase().trim()).digest("hex");
          const options = [
            row.option_a ? { text: row.option_a, label: "A" } : null,
            row.option_b ? { text: row.option_b, label: "B" } : null,
            row.option_c ? { text: row.option_c, label: "C" } : null,
            row.option_d ? { text: row.option_d, label: "D" } : null,
            row.option_e ? { text: row.option_e, label: "E" } : null,
          ].filter(Boolean);

          const correctAnswerArr = (row.correct_answer || "A").split(",").map((a: string) => a.trim());

          const regionVal = row.country === "CA" ? "CAN" : row.country === "US" ? "US" : "BOTH";
          const countryVal = row.country === "CA" ? "CA" : row.country === "US" ? "US" : null;
          const diffVal = row.difficulty || 3;
          const cogLevel = diffVal <= 2 ? "recall" : diffVal === 3 ? "application" : "analysis";

          const insertResult = await pool.query(
            `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, career_type, country_code, language_code, question_format, cognitive_level)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
             RETURNING id`,
            [
              "free",
              row.exam_type || "general",
              row.question_type || "single_best_answer",
              "published",
              row.question_text || "",
              JSON.stringify(options),
              JSON.stringify(correctAnswerArr),
              row.rationale || "",
              diffVal,
              row.tags ? `{${row.tags.split(",").map((t: string) => `"${t.trim()}"`).join(",")}}` : "{}",
              row.topic || null,
              row.topic || null,
              row.subtopic || null,
              regionVal,
              stemHash,
              row.profession || imp.profession_slug || "nursing",
              countryVal,
              "en",
              row.question_type || "single_best_answer",
              cogLevel,
            ]
          );

          await pool.query(
            `UPDATE question_bank_import_rows SET status = 'imported', created_exam_question_id = $2 WHERE id = $1`,
            [row.id, insertResult.rows[0].id]
          );

          importedCount++;
        } catch (rowErr: any) {
          console.error(`Import row ${row.row_number} error:`, rowErr.message);
          await pool.query(
            `UPDATE question_bank_import_rows SET status = 'error', errors = $2 WHERE id = $1`,
            [row.id, JSON.stringify([{ message: rowErr.message }])]
          );
          skippedCount++;
        }
      }

      await pool.query(
        `UPDATE question_bank_imports SET status = 'completed', imported_rows = $2, skipped_rows = $3, completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
        [req.params.id, importedCount, skippedCount]
      );

      if (imp.profession_slug) {
        await pool.query(
          `UPDATE professions SET question_count = (SELECT COUNT(*)::int FROM exam_questions WHERE career_type = $1), updated_at = NOW() WHERE slug = $1`,
          [imp.profession_slug]
        ).catch(() => {});
      }

      res.json({
        ok: true,
        importedRows: importedCount,
        skippedRows: skippedCount,
      });
    } catch (e: any) {
      console.error("Import execute error:", e);
      await pool.query(
        `UPDATE question_bank_imports SET status = 'failed', updated_at = NOW() WHERE id = $1`,
        [req.params.id]
      ).catch(() => {});
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/imports/:id/cancel", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(
        `UPDATE question_bank_imports SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
        [req.params.id]
      );

      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/imports/template/:format", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const format = req.params.format;
      const templateData = {
        headers: [
          "question_id", "profession", "country", "exam_type", "topic", "subtopic",
          "difficulty", "question_type", "question_text", "option_a", "option_b",
          "option_c", "option_d", "option_e", "correct_answer", "rationale",
          "image_reference", "tags", "eligibility_flags"
        ],
        sampleRow: {
          question_id: "Q001",
          profession: "nursing",
          country: "US",
          exam_type: "NCLEX-RN",
          topic: "Cardiovascular",
          subtopic: "Heart Failure",
          difficulty: "3",
          question_type: "single_best_answer",
          question_text: "A patient presents with dyspnea and peripheral edema. Which assessment finding best indicates right-sided heart failure?",
          option_a: "Jugular venous distension",
          option_b: "Pulmonary crackles",
          option_c: "S3 heart sound",
          option_d: "Pink frothy sputum",
          option_e: "",
          correct_answer: "A",
          rationale: "Jugular venous distension (JVD) is a classic sign of right-sided heart failure...",
          image_reference: "",
          tags: "cardiology,heart failure",
          eligibility_flags: "",
        },
      };

      if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", "attachment; filename=import-template.json");
        res.json([templateData.sampleRow]);
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=import-template.csv");
        const csvHeader = templateData.headers.join(",");
        const csvRow = templateData.headers.map(h => `"${(templateData.sampleRow as any)[h] || ""}"`).join(",");
        res.send(`${csvHeader}\n${csvRow}\n`);
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

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

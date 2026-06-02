import type { Express } from "express";
import { pool } from "./storage";
import { requireAdmin } from "./admin-auth";

const MLT_DISCIPLINES = [
  "Hematology", "Clinical Chemistry", "Microbiology", "Blood Banking",
  "Urinalysis", "Immunology/Serology", "Molecular Diagnostics",
  "Lab Operations", "Quality Assurance", "Body Fluids"
];

const MLT_BLUEPRINT_CATEGORIES = [
  "Pre-analytical", "Analytical", "Post-analytical", "Quality Control",
  "Safety & Compliance", "Instrumentation", "Clinical Correlation"
];

const MLT_COGNITIVE_LEVELS = ["recall", "application", "analysis"];
const MLT_DIFFICULTIES = [1, 2, 3, 4, 5];
const MLT_COUNTRIES = ["canada", "usa", "both"];

function parseStructuredText(text: string): any[] {
  const blocks = text.split(/\n(?=Question:)/i).filter(b => b.trim());
  const questions: any[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    const q: any = { options: [] };
    let currentField = "";

    for (const line of lines) {
      if (/^Question:/i.test(line)) {
        q.stem = line.replace(/^Question:\s*/i, "").trim();
        currentField = "stem";
      } else if (/^CountryTrack:/i.test(line)) {
        q.country = line.replace(/^CountryTrack:\s*/i, "").trim().toLowerCase();
      } else if (/^Discipline:/i.test(line)) {
        q.blueprintCategory = line.replace(/^Discipline:\s*/i, "").trim();
      } else if (/^Difficulty:/i.test(line)) {
        q.difficulty = parseInt(line.replace(/^Difficulty:\s*/i, "").trim()) || 3;
      } else if (/^CognitiveLevel:/i.test(line)) {
        q.cognitiveLevel = line.replace(/^CognitiveLevel:\s*/i, "").trim().toLowerCase();
      } else if (/^Option\s*[A-D]:/i.test(line)) {
        q.options.push(line.replace(/^Option\s*[A-D]:\s*/i, "").trim());
      } else if (/^CorrectAnswer:/i.test(line)) {
        const ans = line.replace(/^CorrectAnswer:\s*/i, "").trim().toUpperCase();
        q.correctAnswer = "ABCD".indexOf(ans);
      } else if (/^Rationale:/i.test(line)) {
        q.rationaleLong = line.replace(/^Rationale:\s*/i, "").trim();
        currentField = "rationale";
      } else if (currentField === "rationale") {
        q.rationaleLong = (q.rationaleLong || "") + " " + line;
      } else if (currentField === "stem") {
        q.stem = (q.stem || "") + " " + line;
      }
    }

    if (q.stem && q.options.length >= 2) {
      questions.push({
        stem: q.stem,
        options: q.options.length === 4 ? q.options : [...q.options, ...Array(4 - q.options.length).fill("")].slice(0, 4),
        correctAnswer: q.correctAnswer >= 0 ? q.correctAnswer : 0,
        rationaleLong: q.rationaleLong || "",
        blueprintCategory: q.blueprintCategory || "Hematology",
        difficulty: q.difficulty || 3,
        cognitiveLevel: q.cognitiveLevel || "application",
        country: q.country || "both",
      });
    }
  }
  return questions;
}

function validateImportRow(row: any, index: number): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!row.stem || row.stem.trim().length < 10) {
    errors.push(`Row ${index + 1}: Question stem is missing or too short`);
  }
  if (!row.options || !Array.isArray(row.options) || row.options.length < 2) {
    errors.push(`Row ${index + 1}: Must have at least 2 answer options`);
  }
  if (row.correctAnswer === undefined || row.correctAnswer < 0 || row.correctAnswer >= (row.options?.length || 4)) {
    errors.push(`Row ${index + 1}: Invalid correct answer index`);
  }
  if (!row.rationaleLong || row.rationaleLong.trim().length < 20) {
    errors.push(`Row ${index + 1}: Rationale is missing or too short (minimum 20 chars)`);
  }
  if (row.blueprintCategory && !MLT_DISCIPLINES.includes(row.blueprintCategory) && !MLT_BLUEPRINT_CATEGORIES.includes(row.blueprintCategory)) {
    warnings.push(`Row ${index + 1}: Unknown discipline "${row.blueprintCategory}"`);
  }
  if (row.difficulty && (row.difficulty < 1 || row.difficulty > 5)) {
    warnings.push(`Row ${index + 1}: Difficulty should be 1-5, got ${row.difficulty}`);
  }
  if (row.cognitiveLevel && !MLT_COGNITIVE_LEVELS.includes(row.cognitiveLevel)) {
    warnings.push(`Row ${index + 1}: Unknown cognitive level "${row.cognitiveLevel}"`);
  }

  return { errors, warnings };
}

async function checkDuplicates(questions: any[]): Promise<{ index: number; similarity: string }[]> {
  const duplicates: { index: number; similarity: string }[] = [];
  const existingResult = await pool.query(
    `SELECT id, stem FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived' LIMIT 5000`
  );
  const existingStems = existingResult.rows.map((r: any) => r.stem.toLowerCase().trim());

  for (let i = 0; i < questions.length; i++) {
    const newStem = (questions[i].stem || "").toLowerCase().trim();
    if (!newStem) continue;

    for (const existing of existingStems) {
      const words1 = new Set(newStem.split(/\s+/));
      const words2 = new Set(existing.split(/\s+/));
      const intersection = new Set([...words1].filter(w => words2.has(w)));
      const union = new Set([...words1, ...words2]);
      const jaccard = intersection.size / union.size;

      if (jaccard > 0.7) {
        duplicates.push({ index: i, similarity: `${(jaccard * 100).toFixed(0)}% similar to existing question` });
        break;
      }
    }

    for (let j = 0; j < i; j++) {
      const otherStem = (questions[j].stem || "").toLowerCase().trim();
      if (newStem === otherStem) {
        duplicates.push({ index: i, similarity: `Exact duplicate of row ${j + 1}` });
        break;
      }
    }
  }
  return duplicates;
}

export function registerMltAdminRoutes(app: Express) {
  app.get("/api/admin/mlt/stats", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const [questionsResult, flashcardsResult, lessonsResult, importResult] = await Promise.all([
        pool.query(`
          SELECT
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'published') as published,
            COUNT(*) FILTER (WHERE status = 'draft' OR status = 'pending') as draft,
            COUNT(*) FILTER (WHERE status = 'archived') as archived,
            COUNT(*) FILTER (WHERE flagged = true) as flagged
          FROM allied_questions WHERE career_type = 'mlt'
        `),
        pool.query(`SELECT COUNT(*) as total FROM allied_flashcards WHERE career_type = 'mlt'`),
        pool.query(`SELECT COUNT(*) as total FROM allied_lessons WHERE career_type = 'mlt'`),
        pool.query(`SELECT COUNT(*) as total FROM mlt_import_history WHERE rolled_back = false`),
      ]);

      const qStats = questionsResult.rows[0];
      const distributionResult = await pool.query(`
        SELECT
          blueprint_category as discipline,
          difficulty,
          cognitive_level,
          COUNT(*) as count,
          COUNT(*) FILTER (WHERE status = 'published') as published_count
        FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived'
        GROUP BY blueprint_category, difficulty, cognitive_level
        ORDER BY blueprint_category, difficulty
      `);

      const countryResult = await pool.query(`
        SELECT
          COALESCE(
            CASE
              WHEN subtopic ILIKE '%canada%' OR subtopic ILIKE '%csmls%' THEN 'canada'
              WHEN subtopic ILIKE '%usa%' OR subtopic ILIKE '%ascp%' OR subtopic ILIKE '%amt%' THEN 'usa'
              ELSE 'both'
            END,
            'both'
          ) as country_track,
          COUNT(*) as count
        FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived'
        GROUP BY country_track
      `);

      res.json({
        questions: {
          total: Number(qStats.total),
          published: Number(qStats.published),
          draft: Number(qStats.draft),
          archived: Number(qStats.archived),
          flagged: Number(qStats.flagged),
        },
        flashcards: Number(flashcardsResult.rows[0].total),
        lessons: Number(lessonsResult.rows[0].total),
        imports: Number(importResult.rows[0].total),
        distribution: distributionResult.rows,
        countryBreakdown: countryResult.rows,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { discipline, difficulty, status, cognitive, country, search, page = "1", limit = "50" } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let where = "WHERE career_type = 'mlt'";
      const params: any[] = [];
      let paramIdx = 1;

      if (discipline) { where += ` AND blueprint_category = $${paramIdx++}`; params.push(discipline); }
      if (difficulty) { where += ` AND difficulty = $${paramIdx++}`; params.push(parseInt(difficulty as string)); }
      if (status) { where += ` AND status = $${paramIdx++}`; params.push(status); }
      if (cognitive) { where += ` AND cognitive_level = $${paramIdx++}`; params.push(cognitive); }
      if (search) { where += ` AND (stem ILIKE $${paramIdx++})`; params.push(`%${search}%`); }

      const countResult = await pool.query(`SELECT COUNT(*) as total FROM allied_questions ${where}`, params);
      const dataResult = await pool.query(
        `SELECT * FROM allied_questions ${where} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
        [...params, parseInt(limit as string), offset]
      );

      res.json({
        questions: dataResult.rows,
        total: Number(countResult.rows[0].total),
        page: parseInt(page as string),
        totalPages: Math.ceil(Number(countResult.rows[0].total) / parseInt(limit as string)),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/questions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`SELECT * FROM allied_questions WHERE id = $1 AND career_type = 'mlt'`, [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/questions", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { stem, options, correctAnswer, rationaleLong, blueprintCategory, subtopic, difficulty, cognitiveLevel, questionType, examTrap, safetyNote, isFree, status } = req.body;

      if (!stem || !options || correctAnswer === undefined || !rationaleLong) {
        return res.status(400).json({ error: "Missing required fields: stem, options, correctAnswer, rationaleLong" });
      }

      const result = await pool.query(
        `INSERT INTO allied_questions (id, career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, safety_note, is_free, status, created_at)
         VALUES (gen_random_uuid(), 'mlt', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
         RETURNING *`,
        [stem, JSON.stringify(options), correctAnswer, rationaleLong, req.body.learningObjective || "", blueprintCategory || "Hematology", subtopic || "general", difficulty || 3, cognitiveLevel || "application", questionType || "mcq", examTrap || null, safetyNote || null, isFree || false, status || "draft"]
      );

      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/mlt/questions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const fields = ["stem", "options", "correct_answer", "rationale_long", "learning_objective", "blueprint_category", "subtopic", "difficulty", "cognitive_level", "question_type", "exam_trap", "safety_note", "is_free", "status", "flagged", "flag_reason"];
      const bodyMap: Record<string, string> = {
        stem: "stem", options: "options", correctAnswer: "correct_answer", rationaleLong: "rationale_long",
        learningObjective: "learning_objective", blueprintCategory: "blueprint_category", subtopic: "subtopic",
        difficulty: "difficulty", cognitiveLevel: "cognitive_level", questionType: "question_type",
        examTrap: "exam_trap", safetyNote: "safety_note", isFree: "is_free", status: "status",
        flagged: "flagged", flagReason: "flag_reason"
      };

      const updates: string[] = [];
      const values: any[] = [];
      let idx = 1;

      for (const [bodyKey, dbKey] of Object.entries(bodyMap)) {
        if (req.body[bodyKey] !== undefined) {
          updates.push(`${dbKey} = $${idx++}`);
          values.push(bodyKey === "options" ? JSON.stringify(req.body[bodyKey]) : req.body[bodyKey]);
        }
      }

      if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

      values.push(req.params.id);
      const result = await pool.query(
        `UPDATE allied_questions SET ${updates.join(", ")} WHERE id = $${idx} AND career_type = 'mlt' RETURNING *`,
        values
      );

      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/mlt/questions/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      await pool.query(`DELETE FROM allied_questions WHERE id = $1 AND career_type = 'mlt'`, [req.params.id]);
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/questions/bulk-action", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { ids, action, value } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "No question IDs provided" });

      let query = "";
      switch (action) {
        case "publish":
          query = `UPDATE allied_questions SET status = 'published' WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        case "archive":
          query = `UPDATE allied_questions SET status = 'archived' WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        case "draft":
          query = `UPDATE allied_questions SET status = 'draft' WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        case "tag-discipline":
          query = `UPDATE allied_questions SET blueprint_category = '${value}' WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        case "set-difficulty":
          query = `UPDATE allied_questions SET difficulty = ${parseInt(value)} WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        case "delete":
          query = `DELETE FROM allied_questions WHERE id = ANY($1) AND career_type = 'mlt'`;
          break;
        default:
          return res.status(400).json({ error: "Unknown action" });
      }

      const result = await pool.query(query, [ids]);
      res.json({ ok: true, affected: result.rowCount });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/import/validate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { format, data } = req.body;
      let questions: any[] = [];

      if (format === "json") {
        questions = Array.isArray(data) ? data : JSON.parse(data);
      } else if (format === "csv") {
        const lines = data.split("\n").filter((l: string) => l.trim());
        const headers = lines[0].split(",").map((h: string) => h.trim().replace(/"/g, ""));
        questions = lines.slice(1).map((line: string) => {
          const values = line.match(/(".*?"|[^,]+)/g)?.map((v: string) => v.replace(/^"|"$/g, "").trim()) || [];
          const obj: any = {};
          headers.forEach((h: string, i: number) => { obj[h] = values[i] || ""; });
          if (obj.options && typeof obj.options === "string") {
            try { obj.options = JSON.parse(obj.options); } catch { obj.options = obj.options.split("|"); }
          }
          if (obj.correctAnswer !== undefined) obj.correctAnswer = parseInt(obj.correctAnswer);
          if (obj.difficulty !== undefined) obj.difficulty = parseInt(obj.difficulty);
          return obj;
        });
      } else if (format === "text") {
        questions = parseStructuredText(data);
      } else {
        return res.status(400).json({ error: "Invalid format. Use json, csv, or text" });
      }

      const allErrors: string[] = [];
      const allWarnings: string[] = [];
      const validRows: any[] = [];

      for (let i = 0; i < questions.length; i++) {
        const { errors, warnings } = validateImportRow(questions[i], i);
        allErrors.push(...errors);
        allWarnings.push(...warnings);
        if (errors.length === 0) validRows.push({ ...questions[i], _index: i });
      }

      const duplicates = await checkDuplicates(questions);
      for (const dup of duplicates) {
        allWarnings.push(`Row ${dup.index + 1}: Possible duplicate - ${dup.similarity}`);
      }

      res.json({
        totalRows: questions.length,
        validCount: validRows.length,
        errorCount: allErrors.length,
        warningCount: allWarnings.length,
        duplicateCount: duplicates.length,
        errors: allErrors,
        warnings: allWarnings,
        duplicates,
        preview: validRows.slice(0, 10).map(r => ({
          stem: r.stem?.substring(0, 100),
          discipline: r.blueprintCategory,
          difficulty: r.difficulty,
          optionCount: r.options?.length,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/import/execute", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { format, data, fileName } = req.body;
      let questions: any[] = [];

      if (format === "json") {
        questions = Array.isArray(data) ? data : JSON.parse(data);
      } else if (format === "csv") {
        const lines = data.split("\n").filter((l: string) => l.trim());
        const headers = lines[0].split(",").map((h: string) => h.trim().replace(/"/g, ""));
        questions = lines.slice(1).map((line: string) => {
          const values = line.match(/(".*?"|[^,]+)/g)?.map((v: string) => v.replace(/^"|"$/g, "").trim()) || [];
          const obj: any = {};
          headers.forEach((h: string, i: number) => { obj[h] = values[i] || ""; });
          if (obj.options && typeof obj.options === "string") {
            try { obj.options = JSON.parse(obj.options); } catch { obj.options = obj.options.split("|"); }
          }
          if (obj.correctAnswer !== undefined) obj.correctAnswer = parseInt(obj.correctAnswer);
          if (obj.difficulty !== undefined) obj.difficulty = parseInt(obj.difficulty);
          return obj;
        });
      } else if (format === "text") {
        questions = parseStructuredText(data);
      }

      const importedIds: string[] = [];
      const errors: string[] = [];
      const warnings: string[] = [];
      let successCount = 0;
      let duplicateCount = 0;

      const duplicates = await checkDuplicates(questions);
      const duplicateIndices = new Set(duplicates.map(d => d.index));

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const { errors: rowErrors } = validateImportRow(q, i);
        if (rowErrors.length > 0) {
          errors.push(...rowErrors);
          continue;
        }

        if (duplicateIndices.has(i)) {
          duplicateCount++;
          warnings.push(`Row ${i + 1}: Skipped - ${duplicates.find(d => d.index === i)?.similarity || "duplicate detected"}`);
          continue;
        }

        try {
          const result = await pool.query(
            `INSERT INTO allied_questions (id, career_type, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, status, created_at)
             VALUES (gen_random_uuid(), 'mlt', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'draft', NOW())
             RETURNING id`,
            [q.stem, JSON.stringify(q.options || []), q.correctAnswer || 0, q.rationaleLong || "", q.learningObjective || "", q.blueprintCategory || "Hematology", q.subtopic || "general", q.difficulty || 3, q.cognitiveLevel || "application", q.questionType || "mcq"]
          );
          importedIds.push(result.rows[0].id);
          successCount++;
        } catch (e: any) {
          errors.push(`Row ${i + 1}: Database error - ${e.message}`);
        }
      }

      await pool.query(
        `INSERT INTO mlt_import_history (id, import_type, file_name, total_rows, success_count, error_count, warning_count, duplicate_count, imported_ids, errors, warnings, imported_by, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())`,
        [format, fileName || null, questions.length, successCount, errors.length, warnings.length, duplicateCount, JSON.stringify(importedIds), JSON.stringify(errors), JSON.stringify(warnings), admin.id]
      );

      res.json({
        totalRows: questions.length,
        successCount,
        errorCount: errors.length,
        warningCount: warnings.length,
        duplicateCount,
        importedIds,
        errors,
        warnings,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/import/history", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM mlt_import_history ORDER BY created_at DESC LIMIT 50`
      );
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/import/:id/rollback", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const importRecord = await pool.query(`SELECT * FROM mlt_import_history WHERE id = $1`, [req.params.id]);
      if (!importRecord.rows[0]) return res.status(404).json({ error: "Import not found" });
      if (importRecord.rows[0].rolled_back) return res.status(400).json({ error: "Already rolled back" });

      const importedIds = importRecord.rows[0].imported_ids || [];
      if (importedIds.length > 0) {
        await pool.query(`DELETE FROM allied_questions WHERE id = ANY($1)`, [importedIds]);
      }

      await pool.query(
        `UPDATE mlt_import_history SET rolled_back = true, rolled_back_at = NOW(), status = 'rolled_back' WHERE id = $1`,
        [req.params.id]
      );

      res.json({ ok: true, rolledBackCount: importedIds.length });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/import/templates/:type", async (req, res) => {
    try {
      const { type } = req.params;

      if (type === "questions-json") {
        res.setHeader("Content-Disposition", "attachment; filename=mlt-questions-template.json");
        res.json([
          {
            stem: "A patient's CBC shows an MCV of 110 fL, MCH of 38 pg, and MCHC of 35 g/dL. Which type of anemia is most consistent with these indices?",
            options: ["Iron deficiency anemia", "Megaloblastic anemia", "Sickle cell anemia", "Thalassemia minor"],
            correctAnswer: 1,
            rationaleLong: "An MCV of 110 fL indicates macrocytic anemia. Megaloblastic anemia, caused by vitamin B12 or folate deficiency, is characterized by elevated MCV (>100 fL). Iron deficiency causes microcytic anemia (low MCV). Sickle cell shows normocytic indices. Thalassemia minor causes microcytic, hypochromic anemia.",
            blueprintCategory: "Hematology",
            subtopic: "Red Blood Cell Disorders",
            difficulty: 3,
            cognitiveLevel: "application",
            questionType: "mcq",
            learningObjective: "Interpret CBC indices to classify anemias"
          }
        ]);
      } else if (type === "questions-csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=mlt-questions-template.csv");
        res.send(
          `stem,options,correctAnswer,rationaleLong,blueprintCategory,subtopic,difficulty,cognitiveLevel,questionType,learningObjective\n"A patient's CBC shows an MCV of 110 fL. Which anemia is most consistent?","Iron deficiency anemia|Megaloblastic anemia|Sickle cell anemia|Thalassemia minor",1,"An MCV of 110 fL indicates macrocytic anemia. Megaloblastic anemia is characterized by elevated MCV.",Hematology,Red Blood Cell Disorders,3,application,mcq,"Interpret CBC indices"`
        );
      } else if (type === "flashcards-json") {
        res.setHeader("Content-Disposition", "attachment; filename=mlt-flashcards-template.json");
        res.json([
          {
            front: "What is the normal range for hemoglobin in adult males?",
            back: "13.5–17.5 g/dL",
            rationale: "Hemoglobin carries oxygen. Values below this range indicate anemia; above may indicate polycythemia.",
            blueprintCategory: "Hematology",
            subtopic: "Normal Values"
          }
        ]);
      } else if (type === "lessons-json") {
        res.setHeader("Content-Disposition", "attachment; filename=mlt-lessons-template.json");
        res.json([
          {
            title: "Introduction to Hematology",
            slug: "intro-hematology",
            content: "This lesson covers the fundamentals of hematology including blood cell formation, complete blood count interpretation, and common hematologic disorders.",
            domain: "Hematology",
            orderIndex: 1
          }
        ]);
      } else {
        res.status(404).json({ error: "Unknown template type" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/distribution", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const targets: Record<string, number> = {
        "Hematology": 200, "Clinical Chemistry": 200, "Microbiology": 150,
        "Blood Banking": 100, "Urinalysis": 80, "Immunology/Serology": 80,
        "Molecular Diagnostics": 60, "Lab Operations": 50,
        "Quality Assurance": 50, "Body Fluids": 50,
      };

      const actualResult = await pool.query(`
        SELECT
          blueprint_category as discipline,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'published') as published,
          COUNT(*) FILTER (WHERE difficulty <= 2) as easy,
          COUNT(*) FILTER (WHERE difficulty = 3) as medium,
          COUNT(*) FILTER (WHERE difficulty >= 4) as hard,
          COUNT(*) FILTER (WHERE is_free = true) as adaptive_eligible
        FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived'
        GROUP BY blueprint_category
        ORDER BY blueprint_category
      `);

      const countryResult = await pool.query(`
        SELECT
          CASE
            WHEN subtopic ILIKE '%canada%' OR subtopic ILIKE '%csmls%' THEN 'canada'
            WHEN subtopic ILIKE '%usa%' OR subtopic ILIKE '%ascp%' THEN 'usa'
            ELSE 'both'
          END as country,
          COUNT(*) as count
        FROM allied_questions WHERE career_type = 'mlt' AND status != 'archived'
        GROUP BY country
      `);

      const distribution = MLT_DISCIPLINES.map(d => {
        const actual = actualResult.rows.find((r: any) => r.discipline === d);
        return {
          discipline: d,
          target: targets[d] || 50,
          actual: Number(actual?.total || 0),
          published: Number(actual?.published || 0),
          easy: Number(actual?.easy || 0),
          medium: Number(actual?.medium || 0),
          hard: Number(actual?.hard || 0),
          adaptiveEligible: Number(actual?.adaptive_eligible || 0),
        };
      });

      res.json({
        distribution,
        countryBreakdown: countryResult.rows,
        totalTarget: Object.values(targets).reduce((a, b) => a + b, 0),
        totalActual: distribution.reduce((s, d) => s + d.actual, 0),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/flashcards", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { page = "1", limit = "50", discipline } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      let where = "WHERE career_type = 'mlt'";
      const params: any[] = [];
      let paramIdx = 1;

      if (discipline) { where += ` AND blueprint_category = $${paramIdx++}`; params.push(discipline); }

      const countResult = await pool.query(`SELECT COUNT(*) as total FROM allied_flashcards ${where}`, params);
      const dataResult = await pool.query(
        `SELECT * FROM allied_flashcards ${where} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
        [...params, parseInt(limit as string), offset]
      );

      res.json({
        flashcards: dataResult.rows,
        total: Number(countResult.rows[0].total),
        page: parseInt(page as string),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/flashcards", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { front, back, rationale, blueprintCategory, subtopic } = req.body;
      if (!front || !back) return res.status(400).json({ error: "Front and back are required" });

      const result = await pool.query(
        `INSERT INTO allied_flashcards (id, career_type, card_type, front, back, rationale, blueprint_category, subtopic, created_at)
         VALUES (gen_random_uuid(), 'mlt', 'concept', $1, $2, $3, $4, $5, NOW()) RETURNING *`,
        [front, back, rationale || null, blueprintCategory || "Hematology", subtopic || "general"]
      );

      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/mlt/flashcards/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { front, back, rationale, blueprintCategory, subtopic } = req.body;
      const result = await pool.query(
        `UPDATE allied_flashcards SET front = COALESCE($1, front), back = COALESCE($2, back), rationale = COALESCE($3, rationale), blueprint_category = COALESCE($4, blueprint_category), subtopic = COALESCE($5, subtopic) WHERE id = $6 AND career_type = 'mlt' RETURNING *`,
        [front, back, rationale, blueprintCategory, subtopic, req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/mlt/flashcards/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`DELETE FROM allied_flashcards WHERE id = $1 AND career_type = 'mlt' RETURNING id`, [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/flashcards/bulk-import", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { flashcards } = req.body;
      if (!Array.isArray(flashcards)) return res.status(400).json({ error: "flashcards array required" });

      let successCount = 0;
      for (const fc of flashcards) {
        if (!fc.front || !fc.back) continue;
        await pool.query(
          `INSERT INTO allied_flashcards (id, career_type, card_type, front, back, rationale, blueprint_category, subtopic, created_at)
           VALUES (gen_random_uuid(), 'mlt', 'concept', $1, $2, $3, $4, $5, NOW())`,
          [fc.front, fc.back, fc.rationale || null, fc.blueprintCategory || "Hematology", fc.subtopic || "general"]
        );
        successCount++;
      }

      res.json({ ok: true, imported: successCount });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/lessons", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM allied_lessons WHERE career_type = 'mlt' ORDER BY order_index ASC, created_at DESC`
      );
      res.json(result.rows);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mlt/lessons", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { title, slug, content, moduleId, orderIndex, status } = req.body;
      if (!title) return res.status(400).json({ error: "Title is required" });

      const result = await pool.query(
        `INSERT INTO allied_lessons (id, career_type, module_id, slug, title, content, order_index, status, created_at)
         VALUES (gen_random_uuid(), 'mlt', $1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
        [moduleId || "mlt-default", slug || title.toLowerCase().replace(/\s+/g, "-"), title, content || "", orderIndex || 0, status || "draft"]
      );

      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/mlt/lessons/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { title, content, status, orderIndex } = req.body;
      const updates: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (title !== undefined) { updates.push(`title = $${idx++}`); values.push(title); }
      if (content !== undefined) { updates.push(`content = $${idx++}`); values.push(content); }
      if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
      if (orderIndex !== undefined) { updates.push(`order_index = $${idx++}`); values.push(orderIndex); }

      if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

      values.push(req.params.id);
      const result = await pool.query(
        `UPDATE allied_lessons SET ${updates.join(", ")} WHERE id = $${idx} AND career_type = 'mlt' RETURNING *`,
        values
      );

      if (!result.rows[0]) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/seo", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const pagesResult = await pool.query(`
        SELECT slug, title, status FROM content_items
        WHERE slug LIKE 'mlt-%' OR slug LIKE '%mlt%'
        ORDER BY updated_at DESC
      `);

      const questionsWithSeo = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'published') as published_questions,
          COUNT(*) FILTER (WHERE status = 'draft' OR status = 'pending') as draft_questions,
          COUNT(*) as total_questions
        FROM allied_questions WHERE career_type = 'mlt'
      `);

      res.json({
        pages: pagesResult.rows,
        contentStats: questionsWithSeo.rows[0],
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/publish-status", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'published') as live_count,
          COUNT(*) FILTER (WHERE status = 'draft' OR status = 'pending') as draft_count,
          COUNT(*) FILTER (WHERE status = 'archived') as archived_count,
          COUNT(*) as total
        FROM allied_questions WHERE career_type = 'mlt'
      `);

      const flashcardResult = await pool.query(`SELECT COUNT(*) as total FROM allied_flashcards WHERE career_type = 'mlt'`);
      const lessonResult = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE status = 'published') as live_lessons,
          COUNT(*) FILTER (WHERE status = 'draft') as draft_lessons
        FROM allied_lessons WHERE career_type = 'mlt'
      `);

      res.json({
        questions: result.rows[0],
        flashcards: { total: Number(flashcardResult.rows[0].total) },
        lessons: lessonResult.rows[0],
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/mlt/disciplines", (_req, res) => {
    res.json({ disciplines: MLT_DISCIPLINES, blueprintCategories: MLT_BLUEPRINT_CATEGORIES, cognitiveLabels: MLT_COGNITIVE_LEVELS, countries: MLT_COUNTRIES });
  });
}

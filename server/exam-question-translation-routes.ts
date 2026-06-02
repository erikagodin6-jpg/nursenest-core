import type { Express } from "express";
import { requireAdmin } from "./admin-auth";
import { pool } from "./storage";
import { getTranslatedFields, simpleHash } from "./translation-helpers";
import { getTerminologyPromptBlock } from "./medical-terminology-dictionary";
import OpenAI from "openai";
import {
  getExamQuestionTranslation,
  getBatchExamQuestionTranslations,
  shouldFallbackToEnglish,
  translationMissingError,
  getLocaleConfig,
} from "./locale-content-fetcher";

const SUPPORTED_LANGUAGES = [
  "fr", "es", "zh", "ar", "hi", "pt", "tl", "ko"
];

const LANGUAGE_NAMES: Record<string, string> = {
  fr: "French", es: "Spanish", zh: "Chinese (Simplified)", ar: "Arabic",
  hi: "Hindi", pt: "Portuguese", tl: "Filipino/Tagalog", ko: "Korean",
  ja: "Japanese", de: "German", vi: "Vietnamese", pa: "Punjabi",
  ur: "Urdu", fa: "Farsi/Persian"
};

const ALL_SUPPORTED_LANGUAGES = [
  "fr", "es", "zh", "ar", "hi", "pt", "tl", "ko", "ja",
  "de", "vi", "pa", "ur", "fa"
];

const TRANSLATABLE_FIELDS = [
  "stem", "options", "rationale", "clinicalPearl", "examStrategy",
  "scenario", "memoryHook", "correctAnswerExplanation",
  "incorrectAnswerRationale", "distractorRationales",
  "clinicalReasoning", "keyTakeaway", "mnemonic"
];

const MEDICAL_ABBREVIATIONS = [
  "IV", "BP", "HR", "SpO2", "ECG", "EKG", "ABG", "CBC", "BMP", "CMP",
  "BMI", "GCS", "CPR", "AED", "NPO", "PRN", "BID", "TID", "QID",
  "IM", "SQ", "PO", "INR", "PT", "PTT", "WBC", "RBC", "Hgb", "Hct",
  "BUN", "Na+", "K+", "Ca2+", "Mg2+", "pH", "pCO2", "pO2", "HCO3",
  "ICU", "OR", "ER", "COPD", "CHF", "DVT", "PE", "MI", "CVA", "TIA",
  "UTI", "MRSA", "C.diff", "PICC", "NG", "Foley", "I&O", "ADL",
  "ROM", "DNR", "POLST", "HIPAA", "SBAR", "RACE", "PASS"
];

function getOpenAIClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

function validateTranslationQuality(
  original: Record<string, string>,
  translated: Record<string, any>,
  lang: string
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  for (const abbr of MEDICAL_ABBREVIATIONS) {
    for (const [field, origText] of Object.entries(original)) {
      if (!origText || typeof origText !== "string") continue;
      if (origText.includes(abbr)) {
        const translatedText = translated[field];
        if (translatedText && typeof translatedText === "string" && !translatedText.includes(abbr)) {
          issues.push(`Medical abbreviation "${abbr}" missing in ${field} for ${lang}`);
        }
      }
    }
  }

  for (const [field, origText] of Object.entries(original)) {
    if (!origText) continue;
    const translatedText = translated[field];
    if (!translatedText) {
      issues.push(`Field "${field}" not translated for ${lang}`);
    }
  }

  if (original.options && translated.options) {
    try {
      const origOpts = typeof original.options === "string" ? JSON.parse(original.options) : original.options;
      const transOpts = typeof translated.options === "string" ? JSON.parse(translated.options) : translated.options;
      if (Array.isArray(origOpts) && Array.isArray(transOpts) && origOpts.length !== transOpts.length) {
        issues.push(`Options count mismatch: original ${origOpts.length}, translated ${transOpts.length}`);
      }
    } catch {}
  }

  return { valid: issues.length === 0, issues };
}

export function registerExamQuestionTranslationRoutes(app: Express) {

  app.get("/api/exam-questions/:id/translations/:lang", async (req, res) => {
    try {
      const { id, lang } = req.params;

      if (lang === "en") {
        const qResult = await pool.query(
          `SELECT id, stem, options, rationale, scenario, clinical_pearl, exam_strategy, memory_hook,
                  correct_answer_explanation, incorrect_answer_rationale, distractor_rationales,
                  clinical_reasoning, key_takeaway, mnemonic
           FROM exam_questions WHERE id = $1`,
          [id]
        );
        if (qResult.rows.length === 0) return res.status(404).json({ error: "Question not found" });
        const q = qResult.rows[0];
        return res.json({
          id: q.id,
          stem: q.stem,
          options: q.options,
          rationale: q.rationale,
          scenario: q.scenario,
          clinicalPearl: q.clinical_pearl,
          examStrategy: q.exam_strategy,
          memoryHook: q.memory_hook,
          correctAnswerExplanation: q.correct_answer_explanation,
          incorrectAnswerRationale: q.incorrect_answer_rationale,
          distractorRationales: q.distractor_rationales,
          clinicalReasoning: q.clinical_reasoning,
          keyTakeaway: q.key_takeaway,
          mnemonic: q.mnemonic,
          language: "en",
          translated: false,
          _translationStatus: "source",
        });
      }

      if (!ALL_SUPPORTED_LANGUAGES.includes(lang)) {
        return res.status(400).json({ error: `Unsupported language: ${lang}` });
      }

      const qResult = await pool.query(
        `SELECT id, stem, options, rationale, scenario, clinical_pearl, exam_strategy, memory_hook,
                correct_answer_explanation, incorrect_answer_rationale, distractor_rationales,
                clinical_reasoning, key_takeaway, mnemonic
         FROM exam_questions WHERE id = $1`,
        [id]
      );
      if (qResult.rows.length === 0) return res.status(404).json({ error: "Question not found" });
      const q = qResult.rows[0];

      const translation = await getExamQuestionTranslation(id, lang);

      if (translation) {
        const localeConfig = await getLocaleConfig(lang);
        const useFieldFallback = localeConfig.allowEnglishFallback;

        const fieldOrNull = (translatedVal: any, englishVal: any) =>
          translatedVal != null ? translatedVal : (useFieldFallback ? englishVal : null);

        res.json({
          id: q.id,
          stem: fieldOrNull(translation.stem, q.stem),
          options: fieldOrNull(translation.options, q.options),
          rationale: fieldOrNull(translation.rationale, q.rationale),
          scenario: fieldOrNull(translation.scenario, q.scenario),
          clinicalPearl: fieldOrNull(translation.clinicalPearl, q.clinical_pearl),
          examStrategy: fieldOrNull(translation.examStrategy, q.exam_strategy),
          memoryHook: fieldOrNull(translation.memoryHook, q.memory_hook),
          correctAnswerExplanation: fieldOrNull(translation.correctAnswerExplanation, q.correct_answer_explanation),
          incorrectAnswerRationale: fieldOrNull(translation.incorrectAnswerRationale, q.incorrect_answer_rationale),
          distractorRationales: fieldOrNull(translation.distractorRationales, q.distractor_rationales),
          clinicalReasoning: fieldOrNull(translation.clinicalReasoning, q.clinical_reasoning),
          keyTakeaway: fieldOrNull(translation.keyTakeaway, q.key_takeaway),
          mnemonic: fieldOrNull(translation.mnemonic, q.mnemonic),
          language: lang,
          translated: true,
          _translationStatus: translation.translationStatus,
          _fieldFallback: useFieldFallback,
        });
        return;
      }

      const canFallback = await shouldFallbackToEnglish(lang);
      if (!canFallback) {
        return res.status(404).json(translationMissingError("exam_question", id, lang));
      }

      console.warn(`[ExamTranslation] Falling back to EAV table for question ${id}, locale ${lang}`);
      const translations = await getTranslatedFields("exam_question", id, lang);

      const mergeField = (fieldName: string, dbCol: string) =>
        translations[fieldName]?.text || q[dbCol];

      let translatedOptions = q.options;
      if (translations.options?.text) {
        try { translatedOptions = JSON.parse(translations.options.text); } catch { translatedOptions = q.options; }
      }

      let translatedDistractorRationales = q.distractor_rationales;
      if (translations.distractorRationales?.text) {
        try { translatedDistractorRationales = JSON.parse(translations.distractorRationales.text); } catch {}
      }

      let translatedIncorrectAnswerRationale = q.incorrect_answer_rationale;
      if (translations.incorrectAnswerRationale?.text) {
        try { translatedIncorrectAnswerRationale = JSON.parse(translations.incorrectAnswerRationale.text); } catch {}
      }

      const hasTranslations = Object.keys(translations).length > 0;

      if (!hasTranslations) {
        return res.status(404).json(translationMissingError("exam_question", id, lang));
      }

      res.json({
        id: q.id,
        stem: mergeField("stem", "stem"),
        options: translatedOptions,
        rationale: mergeField("rationale", "rationale"),
        scenario: mergeField("scenario", "scenario"),
        clinicalPearl: mergeField("clinicalPearl", "clinical_pearl"),
        examStrategy: mergeField("examStrategy", "exam_strategy"),
        memoryHook: mergeField("memoryHook", "memory_hook"),
        correctAnswerExplanation: mergeField("correctAnswerExplanation", "correct_answer_explanation"),
        incorrectAnswerRationale: translatedIncorrectAnswerRationale,
        distractorRationales: translatedDistractorRationales,
        clinicalReasoning: mergeField("clinicalReasoning", "clinical_reasoning"),
        keyTakeaway: mergeField("keyTakeaway", "key_takeaway"),
        mnemonic: mergeField("mnemonic", "mnemonic"),
        language: lang,
        translated: hasTranslations,
        _translationStatus: "translated_eav_fallback",
      });
    } catch (e: any) {
      console.error("[ExamTranslation] Error:", e.message);
      res.status(500).json({ error: "Failed to fetch translated question" });
    }
  });

  app.post("/api/exam-questions/translated-batch", async (req, res) => {
    try {
      const { questionIds, lang } = req.body;
      if (!Array.isArray(questionIds) || !lang) {
        return res.status(400).json({ error: "questionIds (array) and lang (string) are required" });
      }

      if (lang === "en" || questionIds.length === 0) {
        return res.json({ translations: {}, language: lang });
      }

      if (!ALL_SUPPORTED_LANGUAGES.includes(lang)) {
        return res.status(400).json({ error: `Unsupported language: ${lang}` });
      }

      const ids = questionIds.slice(0, 200);

      const batchTranslations = await getBatchExamQuestionTranslations(ids, lang);

      const translationMap: Record<string, Record<string, any>> = {};
      for (const [qId, trans] of batchTranslations) {
        translationMap[qId] = {
          stem: trans.stem,
          options: trans.options,
          rationale: trans.rationale,
          scenario: trans.scenario,
          clinicalPearl: trans.clinicalPearl,
          examStrategy: trans.examStrategy,
          memoryHook: trans.memoryHook,
          correctAnswerExplanation: trans.correctAnswerExplanation,
          incorrectAnswerRationale: trans.incorrectAnswerRationale,
          distractorRationales: trans.distractorRationales,
          clinicalReasoning: trans.clinicalReasoning,
          keyTakeaway: trans.keyTakeaway,
          mnemonic: trans.mnemonic,
        };
      }

      if (batchTranslations.size === 0) {
        console.warn(`[ExamTranslation] No translations in new tables for batch, falling back to EAV`);
        const placeholders = ids.map((_: any, i: number) => `$${i + 2}`).join(",");
        const result = await pool.query(
          `SELECT content_id, field_name, translated_text
           FROM content_translations
           WHERE content_type = 'exam_question' AND language_code = $1
           AND content_id IN (${placeholders})`,
          [lang, ...ids]
        );

        for (const row of result.rows) {
          if (!translationMap[row.content_id]) translationMap[row.content_id] = {};
          translationMap[row.content_id][row.field_name] = row.translated_text;
        }
      }

      res.json({ translations: translationMap, language: lang });
    } catch (e: any) {
      console.error("[ExamTranslation] Batch error:", e.message);
      res.status(500).json({ error: "Failed to fetch batch translations" });
    }
  });

  app.post("/api/admin/exam-questions/translate", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { questionIds, languages } = req.body;
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ error: "questionIds array is required" });
      }

      const targetLangs = Array.isArray(languages) && languages.length > 0
        ? languages.filter((l: string) => ALL_SUPPORTED_LANGUAGES.includes(l))
        : SUPPORTED_LANGUAGES;

      if (targetLangs.length === 0) {
        return res.status(400).json({ error: "No valid languages specified" });
      }

      const batchIds = questionIds.slice(0, 50);
      const placeholders = batchIds.map((_: any, i: number) => `$${i + 1}`).join(",");
      const qResult = await pool.query(
        `SELECT id, stem, options, rationale, scenario, clinical_pearl, exam_strategy, memory_hook,
                correct_answer_explanation, incorrect_answer_rationale, distractor_rationales,
                clinical_reasoning, key_takeaway, mnemonic
         FROM exam_questions WHERE id IN (${placeholders})`,
        batchIds
      );

      if (qResult.rows.length === 0) {
        return res.status(404).json({ error: "No questions found" });
      }

      const openai = getOpenAIClient();
      let totalTranslated = 0;
      let totalSkipped = 0;
      const errors: string[] = [];
      const qualityIssues: string[] = [];

      for (const question of qResult.rows) {
        for (const lang of targetLangs) {
          try {
            const result = await translateSingleQuestion(openai, question, lang);
            if (result.skipped) totalSkipped++;
            else totalTranslated++;
            if (result.qualityIssues.length > 0) {
              qualityIssues.push(...result.qualityIssues.map(i => `[${question.id}/${lang}] ${i}`));
            }
          } catch (err: any) {
            errors.push(`Error translating question ${question.id} to ${lang}: ${err.message}`);
          }
        }
      }

      res.json({
        success: true,
        totalQuestions: qResult.rows.length,
        totalLanguages: targetLangs.length,
        totalTranslated,
        totalSkipped,
        qualityIssues: qualityIssues.slice(0, 50),
        errors: errors.slice(0, 20),
      });
    } catch (e: any) {
      console.error("[ExamTranslation] Admin translate error:", e.message);
      res.status(500).json({ error: "Translation failed: " + e.message });
    }
  });

  app.post("/api/admin/exam-questions/translate-batch", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const {
        languages,
        tier,
        exam,
        bodySystem,
        batchSize = 10,
        resumeFromRunId,
      } = req.body;

      const targetLangs = Array.isArray(languages) && languages.length > 0
        ? languages.filter((l: string) => ALL_SUPPORTED_LANGUAGES.includes(l))
        : SUPPORTED_LANGUAGES;

      if (targetLangs.length === 0) {
        return res.status(400).json({ error: "No valid languages specified" });
      }

      let startOffset = 0;
      let runId: string;
      let effectiveLangs = targetLangs;
      let effectiveTier = tier;
      let effectiveExam = exam;
      let effectiveBodySystem = bodySystem;

      if (resumeFromRunId) {
        const existing = await pool.query(
          `SELECT * FROM translation_batch_runs WHERE id = $1`,
          [resumeFromRunId]
        );
        if (existing.rows.length === 0) {
          return res.status(404).json({ error: "Batch run not found" });
        }
        const run = existing.rows[0];
        if (run.status === "completed") {
          return res.json({ success: true, message: "Batch already completed", runId: run.id, done: true });
        }
        startOffset = run.last_processed_offset || 0;
        runId = run.id;

        const savedLangs = Array.isArray(run.target_languages) ? run.target_languages : [];
        if (savedLangs.length > 0) effectiveLangs = savedLangs;
        if (run.filter_tier) effectiveTier = run.filter_tier;
        if (run.filter_exam) effectiveExam = run.filter_exam;
        if (run.filter_body_system) effectiveBodySystem = run.filter_body_system;

        await pool.query(
          `UPDATE translation_batch_runs SET status = 'running' WHERE id = $1`,
          [runId]
        );
      } else {
        let countQuery = `SELECT COUNT(*)::int as count FROM exam_questions WHERE status = 'published'`;
        const countParams: any[] = [];

        if (effectiveTier) {
          countParams.push(effectiveTier);
          countQuery += ` AND tier = $${countParams.length}`;
        }
        if (effectiveExam) {
          countParams.push(effectiveExam);
          countQuery += ` AND exam = $${countParams.length}`;
        }
        if (effectiveBodySystem) {
          countParams.push(effectiveBodySystem);
          countQuery += ` AND body_system = $${countParams.length}`;
        }

        const totalResult = await pool.query(countQuery, countParams);
        const totalQuestions = totalResult.rows[0]?.count || 0;

        const insertResult = await pool.query(
          `INSERT INTO translation_batch_runs (target_languages, filter_tier, filter_exam, filter_body_system, total_questions, status)
           VALUES ($1, $2, $3, $4, $5, 'running')
           RETURNING id`,
          [JSON.stringify(effectiveLangs), effectiveTier || null, effectiveExam || null, effectiveBodySystem || null, totalQuestions]
        );
        runId = insertResult.rows[0].id;
      }

      const limit = Math.min(batchSize, 25);
      let query = `SELECT id, stem, options, rationale, scenario, clinical_pearl, exam_strategy, memory_hook,
                          correct_answer_explanation, incorrect_answer_rationale, distractor_rationales,
                          clinical_reasoning, key_takeaway, mnemonic
                   FROM exam_questions WHERE status = 'published'`;
      const params: any[] = [];

      if (effectiveTier) {
        params.push(effectiveTier);
        query += ` AND tier = $${params.length}`;
      }
      if (effectiveExam) {
        params.push(effectiveExam);
        query += ` AND exam = $${params.length}`;
      }
      if (effectiveBodySystem) {
        params.push(effectiveBodySystem);
        query += ` AND body_system = $${params.length}`;
      }

      params.push(limit);
      query += ` ORDER BY created_at LIMIT $${params.length}`;
      params.push(startOffset);
      query += ` OFFSET $${params.length}`;

      const qResult = await pool.query(query, params);

      if (qResult.rows.length === 0) {
        await pool.query(
          `UPDATE translation_batch_runs SET status = 'completed', completed_at = NOW() WHERE id = $1`,
          [runId]
        );
        return res.json({ success: true, message: "No more questions to translate", done: true, runId, totalProcessed: 0 });
      }

      const openai = getOpenAIClient();
      let translated = 0;
      let skipped = 0;
      let failed = 0;
      const errors: string[] = [];
      const qualityIssues: string[] = [];

      for (const question of qResult.rows) {
        for (const lang of effectiveLangs) {
          try {
            const result = await translateSingleQuestion(openai, question, lang);
            if (result.skipped) skipped++;
            else translated++;
            if (result.qualityIssues.length > 0) {
              qualityIssues.push(...result.qualityIssues.map(i => `[${question.id}/${lang}] ${i}`));
            }
          } catch (err: any) {
            failed++;
            errors.push(`[${question.id}/${lang}] ${err.message}`);
          }
        }
      }

      const newOffset = startOffset + qResult.rows.length;
      const done = qResult.rows.length < limit;

      await pool.query(
        `UPDATE translation_batch_runs
         SET translated_count = translated_count + $1,
             skipped_count = skipped_count + $2,
             failed_count = failed_count + $3,
             last_processed_offset = $4,
             status = $5,
             completed_at = $6,
             errors = COALESCE(errors, '[]'::jsonb) || $7::jsonb,
             quality_report = COALESCE(quality_report, '{}'::jsonb) || $8::jsonb
         WHERE id = $9`,
        [
          translated, skipped, failed, newOffset,
          done ? "completed" : "running",
          done ? new Date() : null,
          JSON.stringify(errors.slice(0, 50)),
          JSON.stringify({ latestIssues: qualityIssues.slice(0, 20) }),
          runId,
        ]
      );

      res.json({
        success: true,
        runId,
        batchTranslated: translated,
        batchSkipped: skipped,
        batchFailed: failed,
        done,
        nextOffset: newOffset,
        qualityIssues: qualityIssues.slice(0, 20),
        errors: errors.slice(0, 10),
      });
    } catch (e: any) {
      console.error("[ExamTranslation] Batch translate error:", e.message);
      res.status(500).json({ error: "Batch translation failed: " + e.message });
    }
  });

  app.get("/api/admin/exam-questions/translation-batch-runs", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM translation_batch_runs ORDER BY started_at DESC LIMIT 50`
      );

      res.json({ runs: result.rows });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch batch runs" });
    }
  });

  app.get("/api/admin/exam-questions/translation-batch-runs/:id", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await pool.query(
        `SELECT * FROM translation_batch_runs WHERE id = $1`,
        [req.params.id]
      );

      if (result.rows.length === 0) return res.status(404).json({ error: "Batch run not found" });
      res.json(result.rows[0]);
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch batch run" });
    }
  });

  app.post("/api/admin/exam-questions/translate-all", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { languages, batchSize = 10, offset = 0 } = req.body;
      const targetLangs = Array.isArray(languages) && languages.length > 0
        ? languages.filter((l: string) => ALL_SUPPORTED_LANGUAGES.includes(l))
        : SUPPORTED_LANGUAGES;

      const limit = Math.min(batchSize, 25);
      const qResult = await pool.query(
        `SELECT id, stem, options, rationale, scenario, clinical_pearl, exam_strategy, memory_hook,
                correct_answer_explanation, incorrect_answer_rationale, distractor_rationales,
                clinical_reasoning, key_takeaway, mnemonic
         FROM exam_questions WHERE status = 'published' ORDER BY created_at LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      if (qResult.rows.length === 0) {
        return res.json({ success: true, message: "No more questions to translate", done: true, totalProcessed: 0 });
      }

      const totalResult = await pool.query(`SELECT COUNT(*)::int as count FROM exam_questions WHERE status = 'published'`);
      const totalQuestions = totalResult.rows[0]?.count || 0;

      const openai = getOpenAIClient();
      let totalTranslated = 0;
      let totalSkipped = 0;
      const errors: string[] = [];

      for (const question of qResult.rows) {
        for (const lang of targetLangs) {
          try {
            const result = await translateSingleQuestion(openai, question, lang);
            if (result.skipped) totalSkipped++;
            else totalTranslated++;
          } catch (err: any) {
            errors.push(`Error translating question ${question.id} to ${lang}: ${err.message}`);
          }
        }
      }

      res.json({
        success: true,
        totalQuestions: qResult.rows.length,
        totalLanguages: targetLangs.length,
        totalTranslated,
        totalSkipped,
        errors: errors.slice(0, 20),
        done: qResult.rows.length < limit,
        nextOffset: offset + qResult.rows.length,
        totalQuestionsInDb: totalQuestions,
        processedSoFar: offset + qResult.rows.length,
      });
    } catch (e: any) {
      console.error("[ExamTranslation] Translate-all error:", e.message);
      res.status(500).json({ error: "Bulk translation failed: " + e.message });
    }
  });

  app.get("/api/admin/exam-questions/translation-coverage", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { tier, exam, bodySystem } = req.query;

      let countQuery = `SELECT COUNT(*)::int as count FROM exam_questions WHERE status = 'published'`;
      const countParams: any[] = [];

      if (tier) {
        countParams.push(tier);
        countQuery += ` AND tier = $${countParams.length}`;
      }
      if (exam) {
        countParams.push(exam);
        countQuery += ` AND exam = $${countParams.length}`;
      }
      if (bodySystem) {
        countParams.push(bodySystem);
        countQuery += ` AND body_system = $${countParams.length}`;
      }

      const totalResult = await pool.query(countQuery, countParams);
      const totalQuestions = totalResult.rows[0]?.count || 0;

      let coverageQuery = `
        SELECT ct.language_code, COUNT(DISTINCT ct.content_id)::int as translated_questions
        FROM content_translations ct
        JOIN exam_questions eq ON ct.content_id = eq.id
        WHERE ct.content_type = 'exam_question' AND eq.status = 'published'`;
      const coverageParams: any[] = [];

      if (tier) {
        coverageParams.push(tier);
        coverageQuery += ` AND eq.tier = $${coverageParams.length}`;
      }
      if (exam) {
        coverageParams.push(exam);
        coverageQuery += ` AND eq.exam = $${coverageParams.length}`;
      }
      if (bodySystem) {
        coverageParams.push(bodySystem);
        coverageQuery += ` AND eq.body_system = $${coverageParams.length}`;
      }
      coverageQuery += ` GROUP BY ct.language_code ORDER BY ct.language_code`;

      const coverageResult = await pool.query(coverageQuery, coverageParams);

      const fieldCoverageQuery = `
        SELECT ct.language_code, ct.field_name, COUNT(*)::int as count
        FROM content_translations ct
        JOIN exam_questions eq ON ct.content_id = eq.id
        WHERE ct.content_type = 'exam_question' AND eq.status = 'published'
        ${tier ? `AND eq.tier = $${coverageParams.length > 0 ? '1' : '1'}` : ''}
        GROUP BY ct.language_code, ct.field_name
        ORDER BY ct.language_code, ct.field_name`;

      let fieldCoverageResult;
      if (tier || exam || bodySystem) {
        const fParams: any[] = [];
        let fQuery = `
          SELECT ct.language_code, ct.field_name, COUNT(*)::int as count
          FROM content_translations ct
          JOIN exam_questions eq ON ct.content_id = eq.id
          WHERE ct.content_type = 'exam_question' AND eq.status = 'published'`;
        if (tier) { fParams.push(tier); fQuery += ` AND eq.tier = $${fParams.length}`; }
        if (exam) { fParams.push(exam); fQuery += ` AND eq.exam = $${fParams.length}`; }
        if (bodySystem) { fParams.push(bodySystem); fQuery += ` AND eq.body_system = $${fParams.length}`; }
        fQuery += ` GROUP BY ct.language_code, ct.field_name ORDER BY ct.language_code, ct.field_name`;
        fieldCoverageResult = await pool.query(fQuery, fParams);
      } else {
        fieldCoverageResult = await pool.query(
          `SELECT language_code, field_name, COUNT(*)::int as count
           FROM content_translations
           WHERE content_type = 'exam_question'
           GROUP BY language_code, field_name
           ORDER BY language_code, field_name`
        );
      }

      const fieldCoverage: Record<string, Record<string, number>> = {};
      for (const row of fieldCoverageResult.rows) {
        if (!fieldCoverage[row.language_code]) fieldCoverage[row.language_code] = {};
        fieldCoverage[row.language_code][row.field_name] = row.count;
      }

      const coverage = ALL_SUPPORTED_LANGUAGES.map(lang => {
        const row = coverageResult.rows.find((r: any) => r.language_code === lang);
        const translatedQuestions = row?.translated_questions || 0;
        const percentage = totalQuestions > 0 ? Math.round((translatedQuestions / totalQuestions) * 100) : 0;
        return {
          language: lang,
          languageName: LANGUAGE_NAMES[lang] || lang,
          totalQuestions,
          translatedQuestions,
          percentage,
          fieldBreakdown: fieldCoverage[lang] || {},
        };
      });

      const overallTranslated = coverageResult.rows.reduce((sum: number, r: any) => sum + r.translated_questions, 0);
      const overallPossible = totalQuestions * ALL_SUPPORTED_LANGUAGES.length;
      const overallPercentage = overallPossible > 0 ? Math.round((overallTranslated / overallPossible) * 100) : 0;

      let tierBreakdown: any[] = [];
      if (!tier) {
        const tierResult = await pool.query(
          `SELECT eq.tier,
                  COUNT(DISTINCT eq.id)::int as total,
                  COUNT(DISTINCT CASE WHEN ct.content_id IS NOT NULL THEN eq.id END)::int as has_any_translation
           FROM exam_questions eq
           LEFT JOIN content_translations ct ON ct.content_id = eq.id AND ct.content_type = 'exam_question'
           WHERE eq.status = 'published'
           GROUP BY eq.tier ORDER BY eq.tier`
        );
        tierBreakdown = tierResult.rows.map(r => ({
          tier: r.tier,
          total: r.total,
          withTranslations: r.has_any_translation,
          percentage: r.total > 0 ? Math.round((r.has_any_translation / r.total) * 100) : 0,
        }));
      }

      let examBreakdown: any[] = [];
      if (!exam) {
        const examResult = await pool.query(
          `SELECT eq.exam,
                  COUNT(DISTINCT eq.id)::int as total,
                  COUNT(DISTINCT CASE WHEN ct.content_id IS NOT NULL THEN eq.id END)::int as has_any_translation
           FROM exam_questions eq
           LEFT JOIN content_translations ct ON ct.content_id = eq.id AND ct.content_type = 'exam_question'
           WHERE eq.status = 'published'
           ${tier ? `AND eq.tier = $1` : ''}
           GROUP BY eq.exam ORDER BY eq.exam`
          , tier ? [tier] : []
        );
        examBreakdown = examResult.rows.map(r => ({
          exam: r.exam,
          total: r.total,
          withTranslations: r.has_any_translation,
          percentage: r.total > 0 ? Math.round((r.has_any_translation / r.total) * 100) : 0,
        }));
      }

      res.json({
        totalQuestions,
        totalLanguages: ALL_SUPPORTED_LANGUAGES.length,
        overallPercentage,
        languages: coverage,
        tierBreakdown,
        examBreakdown,
        filters: { tier: tier || null, exam: exam || null, bodySystem: bodySystem || null },
      });
    } catch (e: any) {
      console.error("[ExamTranslation] Coverage error:", e.message);
      res.status(500).json({ error: "Failed to fetch translation coverage" });
    }
  });

  app.get("/api/admin/exam-questions/translation-filters", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const tiersResult = await pool.query(
        `SELECT DISTINCT tier FROM exam_questions WHERE status = 'published' ORDER BY tier`
      );
      const examsResult = await pool.query(
        `SELECT DISTINCT exam FROM exam_questions WHERE status = 'published' ORDER BY exam`
      );
      const bodySystemsResult = await pool.query(
        `SELECT DISTINCT body_system FROM exam_questions WHERE status = 'published' AND body_system IS NOT NULL ORDER BY body_system`
      );

      res.json({
        tiers: tiersResult.rows.map(r => r.tier),
        exams: examsResult.rows.map(r => r.exam),
        bodySystems: bodySystemsResult.rows.map(r => r.body_system),
        languages: ALL_SUPPORTED_LANGUAGES.map(l => ({ code: l, name: LANGUAGE_NAMES[l] || l })),
      });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to fetch filters" });
    }
  });
}

async function translateSingleQuestion(
  openai: OpenAI,
  question: any,
  lang: string
): Promise<{ skipped: boolean; qualityIssues: string[] }> {
  const existingResult = await pool.query(
    `SELECT field_name FROM content_translations
     WHERE content_type = 'exam_question' AND content_id = $1 AND language_code = $2`,
    [question.id, lang]
  );
  const existingFields = new Set(existingResult.rows.map((r: any) => r.field_name));

  const fieldsToTranslate: Record<string, string> = {};
  const fieldMapping: Record<string, string> = {
    stem: "stem",
    rationale: "rationale",
    scenario: "scenario",
    clinicalPearl: "clinical_pearl",
    examStrategy: "exam_strategy",
    memoryHook: "memory_hook",
    correctAnswerExplanation: "correct_answer_explanation",
    clinicalReasoning: "clinical_reasoning",
    keyTakeaway: "key_takeaway",
    mnemonic: "mnemonic",
  };

  let needsTranslation = false;
  for (const [fieldName, dbCol] of Object.entries(fieldMapping)) {
    if (question[dbCol] && !existingFields.has(fieldName)) {
      fieldsToTranslate[fieldName] = question[dbCol];
      needsTranslation = true;
    }
  }

  let optionsText: string[] = [];
  if (Array.isArray(question.options) && !existingFields.has("options")) {
    optionsText = question.options.map((o: any) =>
      typeof o === "object" ? (o.text || JSON.stringify(o)) : String(o)
    );
    needsTranslation = true;
  }

  let distractorRationales: Record<string, string> | null = null;
  if (question.distractor_rationales && !existingFields.has("distractorRationales")) {
    distractorRationales = typeof question.distractor_rationales === "string"
      ? JSON.parse(question.distractor_rationales)
      : question.distractor_rationales;
    if (distractorRationales && Object.keys(distractorRationales).length > 0) {
      needsTranslation = true;
    } else {
      distractorRationales = null;
    }
  }

  let incorrectAnswerRationale: any = null;
  if (question.incorrect_answer_rationale && !existingFields.has("incorrectAnswerRationale")) {
    incorrectAnswerRationale = typeof question.incorrect_answer_rationale === "string"
      ? JSON.parse(question.incorrect_answer_rationale)
      : question.incorrect_answer_rationale;
    if (incorrectAnswerRationale && (Array.isArray(incorrectAnswerRationale) ? incorrectAnswerRationale.length > 0 : Object.keys(incorrectAnswerRationale).length > 0)) {
      needsTranslation = true;
    } else {
      incorrectAnswerRationale = null;
    }
  }

  if (!needsTranslation) {
    return { skipped: true, qualityIssues: [] };
  }

  const langName = LANGUAGE_NAMES[lang] || lang;
  const prompt = buildTranslationPrompt(fieldsToTranslate, optionsText, langName, distractorRationales, incorrectAnswerRationale);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a medical/nursing exam translator. Translate the given exam question content into ${langName}.
RULES:
- Keep universal medical abbreviations as-is: ${MEDICAL_ABBREVIATIONS.slice(0, 30).join(", ")}
- Translate descriptive medical terms appropriately for the target language
- Preserve clinical accuracy - do not change medical facts
- Keep drug names (generic and brand) in their original form unless the target language has an official equivalent
- Keep lab value units (mmol/L, mg/dL, etc.) unchanged
- Keep option numbering/ordering exactly the same
- Preserve all formatting (bullet points, numbered lists, line breaks)
- Return valid JSON only
${getTerminologyPromptBlock(lang)}`
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 8000,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "";
  let parsed: any;
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

  const qualityCheck = validateTranslationQuality(fieldsToTranslate, parsed, lang);

  for (const [fieldName, originalText] of Object.entries(fieldsToTranslate)) {
    const translatedText = parsed[fieldName];
    if (translatedText && typeof translatedText === "string") {
      await upsertTranslation(
        question.id, fieldName, lang,
        translatedText, simpleHash(String(originalText))
      );
    }
  }

  if (parsed.options && Array.isArray(parsed.options) && optionsText.length > 0) {
    const translatedOptions = question.options.map((original: any, idx: number) => {
      if (typeof original === "object") {
        return { ...original, text: parsed.options[idx] || original.text };
      }
      return parsed.options[idx] || original;
    });
    await upsertTranslation(
      question.id, "options", lang,
      JSON.stringify(translatedOptions),
      simpleHash(JSON.stringify(question.options))
    );
  }

  if (parsed.distractorRationales && distractorRationales) {
    await upsertTranslation(
      question.id, "distractorRationales", lang,
      JSON.stringify(parsed.distractorRationales),
      simpleHash(JSON.stringify(distractorRationales))
    );
  }

  if (parsed.incorrectAnswerRationale && incorrectAnswerRationale) {
    await upsertTranslation(
      question.id, "incorrectAnswerRationale", lang,
      JSON.stringify(parsed.incorrectAnswerRationale),
      simpleHash(JSON.stringify(incorrectAnswerRationale))
    );
  }

  return { skipped: false, qualityIssues: qualityCheck.issues };
}

function buildTranslationPrompt(
  fields: Record<string, string>,
  options: string[],
  langName: string,
  distractorRationales: Record<string, string> | null,
  incorrectAnswerRationale: any
): string {
  let prompt = `Translate the following nursing exam question fields into ${langName}. Return a JSON object with the same field names.\n\n`;

  for (const [key, value] of Object.entries(fields)) {
    prompt += `"${key}": "${value.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n\n`;
  }

  if (options.length > 0) {
    prompt += `"options": ${JSON.stringify(options)}\n\n`;
  }

  if (distractorRationales) {
    prompt += `"distractorRationales": ${JSON.stringify(distractorRationales)}\n\n`;
  }

  if (incorrectAnswerRationale) {
    prompt += `"incorrectAnswerRationale": ${JSON.stringify(incorrectAnswerRationale)}\n\n`;
  }

  prompt += `Return ONLY a JSON object with the translated fields. For "options", return an array of translated option strings in the SAME ORDER as the original. For "distractorRationales" and "incorrectAnswerRationale", preserve the same JSON structure with translated values.`;
  return prompt;
}

async function upsertTranslation(
  contentId: string,
  fieldName: string,
  lang: string,
  translatedText: string,
  sourceHash: string,
  contentType: string = "exam_question"
): Promise<void> {
  await pool.query(
    `INSERT INTO content_translations (id, content_type, content_id, field_name, language_code, translated_text, translation_status, source_hash, last_updated)
     VALUES (gen_random_uuid(), $6, $1, $2, $3, $4, 'auto', $5, NOW())
     ON CONFLICT (content_type, content_id, field_name, language_code)
     DO UPDATE SET translated_text = $4, source_hash = $5, translation_status = 'auto', last_updated = NOW()`,
    [contentId, fieldName, lang, translatedText, sourceHash, contentType]
  );
}

const CONTENT_TYPE_FIELDS: Record<string, { dbFields: Record<string, string>; contentType: string }> = {
  lesson: {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
  "flashcard-set": {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
  blog: {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
  "blog-post": {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
  "career-guide": {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
  exam: {
    dbFields: { title: "title", summary: "summary", seoTitle: "seo_title", seoDescription: "seo_description" },
    contentType: "content_item",
  },
};

export function registerContentTranslationBatchRoutes(app: Express) {
  app.post("/api/admin/content/translate-batch", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { contentType, languages, batchSize = 10, offset = 0 } = req.body;

      if (!contentType || !CONTENT_TYPE_FIELDS[contentType]) {
        return res.status(400).json({
          error: `contentType must be one of: ${Object.keys(CONTENT_TYPE_FIELDS).join(", ")}`,
        });
      }

      const targetLangs = Array.isArray(languages) && languages.length > 0
        ? languages.filter((l: string) => ALL_SUPPORTED_LANGUAGES.includes(l))
        : SUPPORTED_LANGUAGES;

      if (targetLangs.length === 0) {
        return res.status(400).json({ error: "No valid languages specified" });
      }

      const config = CONTENT_TYPE_FIELDS[contentType];
      const limit = Math.min(batchSize, 25);

      const itemsResult = await pool.query(
        `SELECT id, title, summary, seo_title, seo_description FROM content_items
         WHERE status = 'published' AND type = $1
         ORDER BY published_at DESC NULLS LAST LIMIT $2 OFFSET $3`,
        [contentType, limit, offset]
      );

      if (itemsResult.rows.length === 0) {
        return res.json({ success: true, message: "No more items to translate", done: true, totalProcessed: 0 });
      }

      const openai = getOpenAIClient();
      let totalTranslated = 0;
      let totalSkipped = 0;
      const errors: string[] = [];

      for (const item of itemsResult.rows) {
        for (const lang of targetLangs) {
          try {
            const existingResult = await pool.query(
              `SELECT field_name, source_hash FROM content_translations
               WHERE content_type = $1 AND content_id = $2 AND language_code = $3`,
              [config.contentType, item.id, lang]
            );
            const existingByField = new Map(existingResult.rows.map((r: any) => [r.field_name, r.source_hash]));

            const fieldsToTranslate: Record<string, string> = {};
            for (const [fieldName, dbCol] of Object.entries(config.dbFields)) {
              if (!item[dbCol]) continue;
              const existingHash = existingByField.get(fieldName);
              const currentHash = simpleHash(String(item[dbCol]));
              if (!existingHash || existingHash !== currentHash) {
                fieldsToTranslate[fieldName] = item[dbCol];
              }
            }

            if (Object.keys(fieldsToTranslate).length === 0) {
              totalSkipped++;
              continue;
            }

            const langName = LANGUAGE_NAMES[lang] || lang;
            const terminologyBlock = getTerminologyPromptBlock(lang);
            const fieldsPrompt = Object.entries(fieldsToTranslate)
              .map(([key, val]) => `"${key}": "${val.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`)
              .join("\n\n");

            const completion = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "system",
                  content: `You are a medical/nursing content translator. Translate the given content fields into ${langName}.
Keep medical abbreviations unchanged. Preserve clinical accuracy. Return valid JSON only with the same field names.
${terminologyBlock}`,
                },
                {
                  role: "user",
                  content: `Translate these fields into ${langName}:\n\n${fieldsPrompt}\n\nReturn ONLY a JSON object with the translated fields.`,
                },
              ],
              temperature: 0.3,
              max_tokens: 4000,
            });

            const responseText = completion.choices[0]?.message?.content?.trim() || "";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

            for (const [fieldName, originalText] of Object.entries(fieldsToTranslate)) {
              const translatedText = parsed[fieldName];
              if (translatedText && typeof translatedText === "string") {
                await upsertTranslation(
                  item.id, fieldName, lang,
                  translatedText, simpleHash(String(originalText)),
                  config.contentType,
                );
              }
            }

            totalTranslated++;
          } catch (err: any) {
            errors.push(`[${item.id}/${lang}] ${err.message}`);
          }
        }
      }

      const totalResult = await pool.query(
        `SELECT COUNT(*)::int as count FROM content_items WHERE status = 'published' AND type = $1`,
        [contentType]
      );

      res.json({
        success: true,
        contentType,
        totalItems: itemsResult.rows.length,
        totalLanguages: targetLangs.length,
        totalTranslated,
        totalSkipped,
        errors: errors.slice(0, 20),
        done: itemsResult.rows.length < limit,
        nextOffset: offset + itemsResult.rows.length,
        totalInDb: totalResult.rows[0]?.count || 0,
      });
    } catch (e: any) {
      console.error("[ContentTranslation] Batch translate error:", e.message);
      res.status(500).json({ error: "Batch translation failed: " + e.message });
    }
  });

  app.get("/api/admin/content/translation-coverage", async (req, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const contentTypes = Object.keys(CONTENT_TYPE_FIELDS);
      const coverage: Record<string, any> = {};

      for (const type of contentTypes) {
        const config = CONTENT_TYPE_FIELDS[type];
        const totalResult = await pool.query(
          `SELECT COUNT(*)::int as count FROM content_items WHERE status = 'published' AND type = $1`,
          [type]
        );
        const total = totalResult.rows[0]?.count || 0;

        const langResult = await pool.query(
          `SELECT ct.language_code, COUNT(DISTINCT ct.content_id)::int as translated_count
           FROM content_translations ct
           JOIN content_items ci ON ct.content_id = ci.id
           WHERE ct.content_type = $1 AND ci.type = $2 AND ci.status = 'published'
           GROUP BY ct.language_code`,
          [config.contentType, type]
        );

        const byLanguage: Record<string, { count: number; percentage: number }> = {};
        for (const row of langResult.rows) {
          byLanguage[row.language_code] = {
            count: row.translated_count,
            percentage: total > 0 ? Math.round((row.translated_count / total) * 100) : 0,
          };
        }

        coverage[type] = {
          total,
          byLanguage,
          supportedContentType: config.contentType,
        };
      }

      res.json({
        contentTypes: Object.keys(CONTENT_TYPE_FIELDS),
        supportedLanguages: ALL_SUPPORTED_LANGUAGES.map(l => ({ code: l, name: LANGUAGE_NAMES[l] || l })),
        coverage,
      });
    } catch (e: any) {
      console.error("[ContentTranslation] Coverage error:", e.message);
      res.status(500).json({ error: "Failed to fetch translation coverage" });
    }
  });
}

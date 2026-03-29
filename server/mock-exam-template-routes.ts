import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser } from "./admin-auth";
import { assembleExam, computeScoreReport, ensureMockExamTemplatesTable, type AssemblyConfig } from "./mock-exam-assembly";
import { normalizeExamQuestions, isCircuitOpen, recordExamFailure, recordExamSuccess, getLastKnownGoodVersion, getBackupPayload, logExamIncident } from "./exam-resilience-engine";

function sanitizeQuestionsForClient(questions: any[]): any[] {
  return questions.map((q: any) => ({
    id: q.id,
    stem: q.stem,
    options: q.options,
    domain: q.domain,
    difficulty: q.difficulty,
    questionType: q.questionType,
  }));
}

async function createFallbackSession(
  userId: number,
  tier: string,
  questions: any[],
  templateRow: any,
  fallbackSource: string
) {
  const questionIds = questions.map((q: any) => q.id);
  const sessionResult = await pool.query(
    `INSERT INTO mock_exam_attempts
      (user_id, tier, total_questions, status, questions, blueprint_code, blueprint_meta, exam_type)
     VALUES ($1, $2, $3, 'in_progress', $4, $5, $6, 'flagship_mock')
     RETURNING *`,
    [
      userId,
      tier,
      questions.length,
      JSON.stringify(questionIds),
      templateRow.template_id,
      JSON.stringify({
        templateId: templateRow.template_id,
        examCode: templateRow.exam_code,
        examName: templateRow.exam_name,
        templateName: templateRow.template_name,
        passingStandard: templateRow.passing_standard,
        domainWeights: templateRow.domain_weights,
        timeLimitMinutes: templateRow.time_limit_minutes,
        fallbackSource,
      }),
    ]
  );
  return snakeToCamel(sessionResult.rows[0]);
}

function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj === null || typeof obj !== "object") return obj;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = snakeToCamel(value);
  }
  return result;
}

export function registerMockExamTemplateRoutes(app: Express) {
  ensureMockExamTemplatesTable().catch(err => console.error("Mock exam templates table init error:", err));

  app.get("/api/mock-exam-templates", async (req, res) => {
    try {
      const { examCode, tier, active } = req.query;
      let query = `SELECT * FROM mock_exam_templates WHERE 1=1`;
      const params: any[] = [];
      let idx = 1;

      if (examCode) {
        query += ` AND exam_code = $${idx++}`;
        params.push(examCode);
      }
      if (tier) {
        query += ` AND tier = $${idx++}`;
        params.push(tier);
      }
      if (active !== undefined) {
        query += ` AND active = $${idx++}`;
        params.push(active === "true");
      }

      query += ` ORDER BY exam_code, template_name`;

      const result = await pool.query(query, params);
      res.json(result.rows.map(snakeToCamel));
    } catch (e: any) {
      console.error("List mock exam templates error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mock-exam-templates/counts/by-exam", async (_req, res) => {
    try {
      const result = await pool.query(
        `SELECT exam_code, COUNT(*) as count FROM mock_exam_templates WHERE active = true GROUP BY exam_code`
      );
      const counts: Record<string, number> = {};
      for (const row of result.rows) {
        counts[row.exam_code] = parseInt(row.count);
      }
      res.json(counts);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/mock-exam-templates/:templateId", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT * FROM mock_exam_templates WHERE template_id = $1`,
        [req.params.templateId]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Template not found" });
      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mock-exam-templates", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const {
        templateId, examCode, examName, templateName, description,
        questionCount, timeLimitMinutes, difficultyDistribution,
        domainWeights, formatMix, passingStandard, seed, tier, active
      } = req.body;

      if (!templateId || !examCode || !examName || !templateName || !questionCount || !timeLimitMinutes || !tier) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await pool.query(
        `INSERT INTO mock_exam_templates
          (template_id, exam_code, exam_name, template_name, description,
           question_count, time_limit_minutes, difficulty_distribution,
           domain_weights, format_mix, passing_standard, seed, tier, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (template_id) DO UPDATE SET
           exam_code = EXCLUDED.exam_code,
           exam_name = EXCLUDED.exam_name,
           template_name = EXCLUDED.template_name,
           description = EXCLUDED.description,
           question_count = EXCLUDED.question_count,
           time_limit_minutes = EXCLUDED.time_limit_minutes,
           difficulty_distribution = EXCLUDED.difficulty_distribution,
           domain_weights = EXCLUDED.domain_weights,
           format_mix = EXCLUDED.format_mix,
           passing_standard = EXCLUDED.passing_standard,
           seed = EXCLUDED.seed,
           tier = EXCLUDED.tier,
           active = EXCLUDED.active,
           updated_at = NOW()
         RETURNING *`,
        [
          templateId, examCode, examName, templateName, description || null,
          questionCount, timeLimitMinutes,
          JSON.stringify(difficultyDistribution || { foundational: 0.15, moderate: 0.55, difficult: 0.30 }),
          JSON.stringify(domainWeights || []),
          JSON.stringify(formatMix || { mcqSingle: 0.50, selectAllThatApply: 0.20, scenarioBased: 0.15, prioritization: 0.10, delegation: 0.05 }),
          passingStandard || 65, seed || 0, tier, active !== false,
        ]
      );

      res.json(snakeToCamel(result.rows[0]));
    } catch (e: any) {
      console.error("Create/update mock exam template error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/mock-exam-templates/sync", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const { templates } = req.body;
      if (!Array.isArray(templates)) return res.status(400).json({ error: "templates must be an array" });

      let synced = 0;
      for (const t of templates) {
        await pool.query(
          `INSERT INTO mock_exam_templates
            (template_id, exam_code, exam_name, template_name, description,
             question_count, time_limit_minutes, difficulty_distribution,
             domain_weights, format_mix, passing_standard, seed, tier, active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (template_id) DO UPDATE SET
             exam_code = EXCLUDED.exam_code,
             exam_name = EXCLUDED.exam_name,
             template_name = EXCLUDED.template_name,
             description = EXCLUDED.description,
             question_count = EXCLUDED.question_count,
             time_limit_minutes = EXCLUDED.time_limit_minutes,
             difficulty_distribution = EXCLUDED.difficulty_distribution,
             domain_weights = EXCLUDED.domain_weights,
             format_mix = EXCLUDED.format_mix,
             passing_standard = EXCLUDED.passing_standard,
             seed = EXCLUDED.seed,
             tier = EXCLUDED.tier,
             active = EXCLUDED.active,
             updated_at = NOW()`,
          [
            t.templateId, t.examCode, t.examName, t.templateName, t.description || null,
            t.questionCount, t.timeLimitMinutes,
            JSON.stringify(t.difficultyDistribution),
            JSON.stringify(t.domainWeights),
            JSON.stringify(t.formatMix),
            t.passingStandard || 65, t.seed || 0, t.tier, t.active !== false,
          ]
        );
        synced++;
      }

      res.json({ synced, total: templates.length });
    } catch (e: any) {
      console.error("Sync mock exam templates error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/mock-exam-templates/:templateId", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      await pool.query(
        `DELETE FROM mock_exam_templates WHERE template_id = $1`,
        [req.params.templateId]
      );
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mock-exam-templates/:templateId/preview", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user || user.tier !== "admin") return res.status(403).json({ error: "Admin access required" });

      const result = await pool.query(
        `SELECT * FROM mock_exam_templates WHERE template_id = $1`,
        [req.params.templateId]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Template not found" });

      const row = result.rows[0];
      const config: AssemblyConfig = {
        templateId: row.template_id,
        examCode: row.exam_code,
        questionCount: Math.min(row.question_count, 10),
        timeLimitMinutes: row.time_limit_minutes,
        domainWeights: row.domain_weights,
        difficultyDistribution: row.difficulty_distribution,
        formatMix: row.format_mix,
        passingStandard: row.passing_standard,
        seed: row.seed,
        tier: row.tier,
      };

      const questions = await assembleExam(config);

      const domainDistribution: Record<string, number> = {};
      const difficultyDistribution: Record<string, number> = {};
      for (const q of questions) {
        domainDistribution[q.domain] = (domainDistribution[q.domain] || 0) + 1;
        const diffBucket = q.difficulty <= 2 ? "foundational" : q.difficulty <= 3 ? "moderate" : "difficult";
        difficultyDistribution[diffBucket] = (difficultyDistribution[diffBucket] || 0) + 1;
      }

      res.json({
        previewQuestions: questions.slice(0, 5).map(q => ({
          id: q.id,
          stem: q.stem.substring(0, 200) + (q.stem.length > 200 ? "..." : ""),
          domain: q.domain,
          difficulty: q.difficulty,
          questionType: q.questionType,
        })),
        totalAvailable: questions.length,
        domainDistribution,
        difficultyDistribution,
      });
    } catch (e: any) {
      console.error("Preview mock exam template error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mock-exam-templates/:templateId/assemble", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const templateId = req.params.templateId;
      let usedFallback = false;
      let fallbackSource: string | undefined;

      const result = await pool.query(
        `SELECT * FROM mock_exam_templates WHERE template_id = $1 AND active = true`,
        [templateId]
      );
      if (!result.rows.length) return res.status(404).json({ error: "Template not found" });

      if (isCircuitOpen(templateId)) {
        const lastGood = await getLastKnownGoodVersion(templateId);
        if (lastGood) {
          logExamIncident({
            examId: templateId,
            userId: user.id,
            tier: result.rows[0].tier || "unknown",
            severity: "warning",
            reasonCode: "circuit_open",
            reasonDetail: `Circuit open for ${templateId}, serving last known good v${lastGood.version}`,
            endpoint: "/api/mock-exam-templates/assemble",
            fallbackModeTriggered: true,
          });

          const fallbackQuestions = lastGood.questionsPayload;
          const session = await createFallbackSession(user.id, result.rows[0].tier, fallbackQuestions, result.rows[0], "last_known_good_circuit");

          return res.json({
            sessionId: session.id,
            templateId: result.rows[0].template_id,
            examName: result.rows[0].exam_name,
            templateName: result.rows[0].template_name,
            timeLimitMinutes: result.rows[0].time_limit_minutes,
            passingStandard: result.rows[0].passing_standard,
            totalQuestions: fallbackQuestions.length,
            questions: sanitizeQuestionsForClient(fallbackQuestions),
            circuitOpen: true,
            fallbackVersion: lastGood.version,
            fallbackMode: true,
          });
        }

        const backup = await getBackupPayload(templateId);
        if (backup) {
          const backupQuestions = backup.questions || [];
          const session = await createFallbackSession(user.id, result.rows[0].tier, backupQuestions, result.rows[0], "backup_payload");

          return res.json({
            sessionId: session.id,
            templateId: result.rows[0].template_id,
            examName: result.rows[0].exam_name,
            templateName: result.rows[0].template_name,
            timeLimitMinutes: result.rows[0].time_limit_minutes,
            passingStandard: result.rows[0].passing_standard,
            totalQuestions: backupQuestions.length,
            questions: sanitizeQuestionsForClient(backupQuestions),
            circuitOpen: true,
            fallbackMode: true,
            fallbackSource: "backup_payload",
          });
        }
      }

      const row = result.rows[0];
      const config: AssemblyConfig = {
        templateId: row.template_id,
        examCode: row.exam_code,
        questionCount: row.question_count,
        timeLimitMinutes: row.time_limit_minutes,
        domainWeights: row.domain_weights,
        difficultyDistribution: row.difficulty_distribution,
        formatMix: row.format_mix,
        passingStandard: row.passing_standard,
        seed: row.seed + Date.now(),
        tier: row.tier,
      };

      let questions: any[];
      try {
        questions = await assembleExam(config);
      } catch (assemblyError: any) {
        recordExamFailure(templateId, `assembly_error: ${assemblyError.message}`);

        const lastGood = await getLastKnownGoodVersion(templateId);
        if (lastGood) {
          logExamIncident({
            examId: templateId,
            userId: user.id,
            tier: row.tier,
            severity: "warning",
            reasonCode: "last_known_good_served",
            reasonDetail: `Assembly failed, serving last known good v${lastGood.version}`,
            endpoint: "/api/mock-exam-templates/assemble",
            fallbackModeTriggered: true,
          });

          const fallbackQuestions = lastGood.questionsPayload;
          const session = await createFallbackSession(user.id, row.tier, fallbackQuestions, row, "last_known_good_assembly_error");

          return res.json({
            sessionId: session.id,
            templateId: row.template_id,
            examName: row.exam_name,
            templateName: row.template_name,
            timeLimitMinutes: row.time_limit_minutes,
            passingStandard: row.passing_standard,
            totalQuestions: fallbackQuestions.length,
            questions: sanitizeQuestionsForClient(fallbackQuestions),
            fallbackMode: true,
            fallbackVersion: lastGood.version,
          });
        }

        throw assemblyError;
      }

      if (questions.length === 0) {
        recordExamFailure(templateId, "zero_questions_assembled");
        return res.status(400).json({ error: "No questions available for this exam configuration" });
      }

      const normalized = normalizeExamQuestions(questions, templateId);

      if (normalized.fallbackMode) {
        logExamIncident({
          examId: templateId,
          userId: user.id,
          tier: row.tier,
          severity: "warning",
          reasonCode: "normalization_fallback",
          reasonDetail: normalized.fallbackReason || "Too few valid questions after normalization",
          endpoint: "/api/mock-exam-templates/assemble",
          fallbackModeTriggered: true,
        });

        const lastGood = await getLastKnownGoodVersion(templateId);
        if (lastGood) {
          usedFallback = true;
          fallbackSource = "last_known_good";
        }
      }

      const finalQuestions = usedFallback
        ? (await getLastKnownGoodVersion(templateId))?.questionsPayload || normalized.questions
        : normalized.questions;

      const questionIds = finalQuestions.map((q: any) => q.id);
      const sessionResult = await pool.query(
        `INSERT INTO mock_exam_attempts
          (user_id, tier, total_questions, status, questions, blueprint_code, blueprint_meta, exam_type)
         VALUES ($1, $2, $3, 'in_progress', $4, $5, $6, 'flagship_mock')
         RETURNING *`,
        [
          user.id,
          row.tier,
          finalQuestions.length,
          JSON.stringify(questionIds),
          row.template_id,
          JSON.stringify({
            templateId: row.template_id,
            examCode: row.exam_code,
            examName: row.exam_name,
            templateName: row.template_name,
            passingStandard: row.passing_standard,
            domainWeights: row.domain_weights,
            timeLimitMinutes: row.time_limit_minutes,
          }),
        ]
      );

      const session = snakeToCamel(sessionResult.rows[0]);

      if (!usedFallback) {
        recordExamSuccess(templateId);
      }

      res.json({
        sessionId: session.id,
        templateId: row.template_id,
        examName: row.exam_name,
        templateName: row.template_name,
        timeLimitMinutes: row.time_limit_minutes,
        passingStandard: row.passing_standard,
        totalQuestions: finalQuestions.length,
        questions: finalQuestions.map((q: any) => ({
          id: q.id,
          stem: q.stem,
          options: q.options,
          domain: q.domain,
          difficulty: q.difficulty,
          questionType: q.questionType,
        })),
        ...(usedFallback ? { fallbackMode: true, fallbackSource } : {}),
        ...(normalized.removedCount > 0 ? { normalizedRemovedCount: normalized.removedCount } : {}),
      });
    } catch (e: any) {
      console.error("Assemble mock exam error:", e);
      recordExamFailure(req.params.templateId, `unhandled: ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/mock-exam-sessions/:sessionId/score-report", async (req, res) => {
    try {
      const user = await resolveAuthUser(req as any);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { answers } = req.body;
      if (!answers || typeof answers !== "object") {
        return res.status(400).json({ error: "answers is required" });
      }

      const sessionResult = await pool.query(
        `SELECT id, user_id, questions, status, report, exam_type, blueprint_code, answers, flagged, score, started_at, completed_at, tier, blueprint_meta
         FROM mock_exam_attempts WHERE id = $1 AND user_id = $2`,
        [req.params.sessionId, user.id]
      );
      if (!sessionResult.rows.length) return res.status(404).json({ error: "Session not found" });

      const session = sessionResult.rows[0];
      const questionIds: string[] = session.questions || [];
      const blueprintMeta = session.blueprint_meta || {};

      if (questionIds.length === 0) {
        return res.status(400).json({ error: "No questions in session" });
      }

      const qResult = await pool.query(
        `SELECT id, stem, options, correct_answer, rationale, body_system, topic, subtopic, difficulty, question_type
         FROM exam_questions WHERE id = ANY($1::text[])`,
        [questionIds]
      );

      const tier = session.tier || "rn";
      const qMap = new Map(qResult.rows.map((r: any) => [r.id, r]));
      const assembledQuestions = questionIds.map(id => {
        const q = qMap.get(id);
        if (!q) return null;
        const bodySystem = q.body_system || "General";
        let domain = bodySystem;
        if (blueprintMeta.domainWeights) {
          const domainNames = blueprintMeta.domainWeights.map((d: any) => d.domain);
          const mappedDomain = mapBodySystemToDomainForReport(bodySystem, tier);
          if (domainNames.includes(mappedDomain)) {
            domain = mappedDomain;
          } else {
            domain = domainNames[0] || bodySystem;
          }
        }
        return {
          id: q.id,
          stem: q.stem,
          options: q.options || [],
          correctAnswer: Array.isArray(q.correct_answer) ? q.correct_answer[0] : (q.correct_answer || 0),
          rationale: q.rationale || "",
          domain,
          topic: q.topic || bodySystem,
          subtopic: q.subtopic || "",
          difficulty: q.difficulty || 3,
          questionType: q.question_type || "MCQ_SINGLE",
        };
      }).filter(Boolean) as any[];

      const config: AssemblyConfig = {
        templateId: blueprintMeta.templateId || session.blueprint_code || "",
        examCode: blueprintMeta.examCode || "",
        questionCount: assembledQuestions.length,
        timeLimitMinutes: blueprintMeta.timeLimitMinutes || 300,
        domainWeights: blueprintMeta.domainWeights || [],
        difficultyDistribution: { foundational: 0.15, moderate: 0.55, difficult: 0.30 },
        formatMix: { mcqSingle: 0.50, selectAllThatApply: 0.20, scenarioBased: 0.15, prioritization: 0.10, delegation: 0.05 },
        passingStandard: blueprintMeta.passingStandard || 65,
        seed: 0,
        tier,
      };

      const report = computeScoreReport(assembledQuestions, answers, config);

      const score = report.overallScore;
      const totalTime = Object.values(answers).reduce((s: number, a: any) => s + (a.timeSpent || 0), 0);
      await pool.query(
        `UPDATE mock_exam_attempts SET
          status = 'completed', score = $1, time_spent = $2,
          answers = $3, report = $4, completed_at = NOW()
         WHERE id = $5 AND user_id = $6`,
        [
          score, Math.round(totalTime),
          JSON.stringify(answers), JSON.stringify(report),
          req.params.sessionId, user.id,
        ]
      );

      const questionsWithAnswers = assembledQuestions.map(q => ({
        id: q.id,
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        rationale: q.rationale,
        domain: q.domain,
        difficulty: q.difficulty,
        questionType: q.questionType,
        userAnswer: answers[q.id]?.selectedIndex,
        isCorrect: answers[q.id]?.selectedIndex === q.correctAnswer,
        timeSpent: answers[q.id]?.timeSpent || 0,
      }));

      res.json({
        report,
        questions: questionsWithAnswers,
        examName: blueprintMeta.examName || "",
        templateName: blueprintMeta.templateName || "",
      });
    } catch (e: any) {
      console.error("Score report error:", e);
      res.status(500).json({ error: e.message });
    }
  });
}

function mapBodySystemToDomainForReport(bodySystem: string, tier: string): string {
  const BODY_SYSTEM_TO_DOMAIN_RN: Record<string, string> = {
    "Cardiovascular": "Physiological Adaptation",
    "Respiratory": "Physiological Adaptation",
    "Neurological": "Physiological Adaptation",
    "Gastrointestinal": "Physiological Adaptation",
    "Endocrine": "Physiological Adaptation",
    "Pharmacology": "Pharmacological Therapies",
    "Pediatrics": "Health Promotion and Maintenance",
    "Mental Health": "Psychosocial Integrity",
    "Psychiatry & Mental Health": "Psychosocial Integrity",
    "Safety & Ethics": "Safety and Infection Control",
    "Delegation & Prioritization": "Management of Care",
    "Assessment Skills": "Reduction of Risk Potential",
    "Nursing Fundamentals": "Basic Care and Comfort",
  };

  const BODY_SYSTEM_TO_DOMAIN_RPN: Record<string, string> = {
    "Cardiovascular": "Foundations of Practice",
    "Respiratory": "Foundations of Practice",
    "Neurological": "Foundations of Practice",
    "Pharmacology": "Foundations of Practice",
    "Pediatrics": "Collaborative Practice",
    "Mental Health": "Collaborative Practice",
    "Safety & Ethics": "Professional Practice",
    "Palliative & End of Life": "Ethical Practice",
  };

  const BODY_SYSTEM_TO_DOMAIN_NP: Record<string, string> = {
    "Cardiovascular": "Therapeutics",
    "Respiratory": "Therapeutics",
    "Neurological": "Diagnosis",
    "Gastrointestinal": "Diagnosis",
    "Pharmacology": "Therapeutics",
    "Assessment Skills": "Health Assessment",
    "Women's Health": "Health Promotion & Disease Prevention",
    "Safety & Ethics": "Professional Role & Responsibility",
  };

  const map = tier === "np" ? BODY_SYSTEM_TO_DOMAIN_NP
    : tier === "rn" ? BODY_SYSTEM_TO_DOMAIN_RN
    : BODY_SYSTEM_TO_DOMAIN_RPN;
  return map[bodySystem] || bodySystem;
}

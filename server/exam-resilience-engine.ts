import type { Express } from "express";
import { pool } from "./storage";
import { resolveAuthUser, requireAdmin } from "./admin-auth";
import { validateQuestion, addIncident, type ExamIncident } from "./exam-reliability";
import { classifyServerError, type ExamFailureCode, EXAM_FAILURE_CODES } from "../shared/exam-error-codes";
import { BoundedMap } from "./bounded-map";

export interface ExamValidationError {
  field: string;
  message: string;
  questionId?: string | number;
  severity: "error" | "warning";
}

export interface ExamValidationResult {
  valid: boolean;
  errors: ExamValidationError[];
  warnings: ExamValidationError[];
  questionResults: { questionId: string | number; valid: boolean; issues: string[] }[];
}

export interface NormalizedExamData {
  questions: any[];
  validQuestionCount: number;
  totalOriginalCount: number;
  removedCount: number;
  fallbackMode: boolean;
  fallbackReason?: string;
  normalizationLog: string[];
}

export interface ExamSnapshot {
  templateId: string;
  version: number;
  questionsPayload: any;
  metadataPayload: any;
  validationResult: ExamValidationResult;
  createdAt: string;
}

interface CircuitState {
  failures: { timestamp: number; reason: string }[];
  state: "closed" | "open" | "half-open";
  lastStateChange: number;
}

const CIRCUIT_FAILURE_THRESHOLD = 3;
const CIRCUIT_WINDOW_MS = 10 * 60 * 1000;
const CIRCUIT_COOLDOWN_MS = 5 * 60 * 1000;
const MIN_VALID_QUESTIONS_RATIO = 0.3;
const MIN_VALID_QUESTIONS_ABSOLUTE = 5;

const circuitBreakers = new BoundedMap<string, CircuitState>(200, 30 * 60 * 1000);

function getCircuitState(examId: string): CircuitState {
  if (!circuitBreakers.has(examId)) {
    circuitBreakers.set(examId, {
      failures: [],
      state: "closed",
      lastStateChange: Date.now(),
    });
  }
  return circuitBreakers.get(examId)!;
}

function pruneOldFailures(circuit: CircuitState) {
  const cutoff = Date.now() - CIRCUIT_WINDOW_MS;
  circuit.failures = circuit.failures.filter((f) => f.timestamp > cutoff);
}

export function recordExamFailure(examId: string, reason: string): CircuitState {
  const circuit = getCircuitState(examId);
  circuit.failures.push({ timestamp: Date.now(), reason });
  pruneOldFailures(circuit);

  if (circuit.failures.length >= CIRCUIT_FAILURE_THRESHOLD && (circuit.state === "closed" || circuit.state === "half-open")) {
    circuit.state = "open";
    circuit.lastStateChange = Date.now();
    console.log(`[ExamResilience] Circuit OPENED for exam ${examId}: ${circuit.failures.length} failures in window`);
  }

  return circuit;
}

export function recordExamSuccess(examId: string) {
  const circuit = getCircuitState(examId);
  if (circuit.state === "half-open") {
    circuit.state = "closed";
    circuit.failures = [];
    circuit.lastStateChange = Date.now();
    console.log(`[ExamResilience] Circuit CLOSED for exam ${examId} after successful probe`);
  }
}

export function isCircuitOpen(examId: string): boolean {
  const circuit = getCircuitState(examId);
  pruneOldFailures(circuit);

  if (circuit.state === "open") {
    if (Date.now() - circuit.lastStateChange > CIRCUIT_COOLDOWN_MS) {
      circuit.state = "half-open";
      circuit.lastStateChange = Date.now();
      return false;
    }
    return true;
  }

  if (circuit.state === "half-open") {
    return false;
  }

  return false;
}

export function resetCircuit(examId: string) {
  const circuit = getCircuitState(examId);
  circuit.failures = [];
  circuit.state = "closed";
  circuit.lastStateChange = Date.now();
}

export function getCircuitStatus(examId: string): { state: string; recentFailures: number; lastFailureReason?: string } {
  const circuit = getCircuitState(examId);
  pruneOldFailures(circuit);
  return {
    state: circuit.state,
    recentFailures: circuit.failures.length,
    lastFailureReason: circuit.failures.length > 0 ? circuit.failures[circuit.failures.length - 1].reason : undefined,
  };
}

export function getAllCircuitStatuses(): Record<string, { state: string; recentFailures: number }> {
  const result: Record<string, { state: string; recentFailures: number }> = {};
  for (const [examId, circuit] of circuitBreakers) {
    pruneOldFailures(circuit);
    if (circuit.failures.length > 0 || circuit.state !== "closed") {
      result[examId] = { state: circuit.state, recentFailures: circuit.failures.length };
    }
  }
  return result;
}

export function validateExamForPublish(exam: {
  templateId?: string;
  id?: string;
  title?: string;
  examCode?: string;
  questions: any[];
  timeLimitMinutes?: number;
  passingStandard?: number;
  tier?: string;
}): ExamValidationResult {
  const errors: ExamValidationError[] = [];
  const warnings: ExamValidationError[] = [];
  const questionResults: { questionId: string | number; valid: boolean; issues: string[] }[] = [];

  const examId = exam.templateId || exam.id || "unknown";
  if (!examId || examId === "unknown") {
    errors.push({ field: "id", message: "Exam must have a valid identifier", severity: "error" });
  }

  if (!exam.title || exam.title.trim().length < 3) {
    errors.push({ field: "title", message: "Exam must have a title (at least 3 characters)", severity: "error" });
  }

  if (!exam.questions || !Array.isArray(exam.questions)) {
    errors.push({ field: "questions", message: "Exam must have an array of questions", severity: "error" });
    return { valid: false, errors, warnings, questionResults };
  }

  if (exam.questions.length === 0) {
    errors.push({ field: "questions", message: "Exam must have at least one question", severity: "error" });
  }

  if (exam.questions.length < 10) {
    warnings.push({ field: "questions", message: `Exam has only ${exam.questions.length} questions, recommend at least 10`, severity: "warning" });
  }

  for (let i = 0; i < exam.questions.length; i++) {
    const q = exam.questions[i];
    const qId = q.id || q.questionId || `q-${i}`;
    const qIssues: string[] = [];

    if (!q.stem && !q.question) {
      qIssues.push("Missing question stem/text");
    } else {
      const stemText = q.stem || q.question || "";
      if (typeof stemText !== "string") {
        qIssues.push("Question stem must be a string");
      } else if (stemText.trim().length < 10) {
        qIssues.push("Question stem too short (minimum 10 characters)");
      }
    }

    let opts = q.options || q.choices;
    if (typeof opts === "string") {
      try {
        opts = JSON.parse(opts);
      } catch {
        qIssues.push("Question options contain malformed JSON");
      }
    }
    if (!Array.isArray(opts) || opts.length < 2) {
      qIssues.push("Question must have at least 2 answer options");
    } else {
      for (let j = 0; j < opts.length; j++) {
        const opt = opts[j];
        const optText = typeof opt === "string" ? opt : (opt?.text || opt?.content || "");
        if (!optText || optText.trim().length === 0) {
          qIssues.push(`Option ${j} is empty or missing text`);
        }
      }
    }

    const correctAnswer = q.correct_answer ?? q.correctAnswer ?? q.correct;
    if (correctAnswer === null || correctAnswer === undefined) {
      qIssues.push("Missing correct answer");
    } else {
      if (typeof correctAnswer === "string") {
        const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
        try {
          const parsed = JSON.parse(correctAnswer);
          if (typeof parsed !== "number" && !Array.isArray(parsed)) {
            if (typeof parsed === "string" && letterMap[parsed.toUpperCase()] === undefined) {
              qIssues.push("Correct answer cannot be resolved to a valid index");
            }
          }
        } catch {
          if (letterMap[correctAnswer.toUpperCase()] === undefined) {
            qIssues.push("Correct answer cannot be resolved to a valid index");
          }
        }
      }
    }

    if (!q.rationale && !q.rationaleLong && !q.rationale_long) {
      warnings.push({ field: `questions[${i}].rationale`, message: `Question ${qId} has no rationale`, questionId: qId, severity: "warning" });
    }

    if (q.domain !== undefined && typeof q.domain !== "string") {
      qIssues.push("Domain field must be a string");
    }

    if (q.difficulty !== undefined && typeof q.difficulty !== "string") {
      qIssues.push("Difficulty field must be a string");
    }

    if (q.language !== undefined && typeof q.language !== "string") {
      qIssues.push("Language field must be a string");
    }

    const stemForMediaCheck = q.stem || q.question || "";
    if (typeof stemForMediaCheck === "string") {
      const brokenImgPattern = /!\[.*?\]\(\s*\)/;
      const brokenSrcPattern = /src=["']\s*["']/;
      if (brokenImgPattern.test(stemForMediaCheck) || brokenSrcPattern.test(stemForMediaCheck)) {
        qIssues.push("Question stem contains broken media reference (empty image src)");
      }
    }

    if (Array.isArray(opts)) {
      for (let j = 0; j < opts.length; j++) {
        const opt = opts[j];
        const optContent = typeof opt === "string" ? opt : (opt?.text || opt?.content || "");
        if (typeof optContent === "string") {
          const brokenImg = /!\[.*?\]\(\s*\)/;
          const brokenSrc = /src=["']\s*["']/;
          if (brokenImg.test(optContent) || brokenSrc.test(optContent)) {
            qIssues.push(`Option ${j} contains broken media reference`);
          }
        }
      }
    }

    if (qIssues.length > 0) {
      errors.push({
        field: `questions[${i}]`,
        message: `Question ${qId}: ${qIssues.join("; ")}`,
        questionId: qId,
        severity: "error",
      });
    }

    questionResults.push({ questionId: qId, valid: qIssues.length === 0, issues: qIssues });
  }

  if (exam.timeLimitMinutes !== undefined && (exam.timeLimitMinutes < 1 || exam.timeLimitMinutes > 600)) {
    errors.push({ field: "timeLimitMinutes", message: "Time limit must be between 1 and 600 minutes", severity: "error" });
  }

  if (exam.passingStandard !== undefined && (exam.passingStandard < 1 || exam.passingStandard > 100)) {
    errors.push({ field: "passingStandard", message: "Passing standard must be between 1 and 100", severity: "error" });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    questionResults,
  };
}

export function normalizeExamQuestions(questions: any[], examId?: string): NormalizedExamData {
  const normalizationLog: string[] = [];
  const normalizedQuestions: any[] = [];
  let removedCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = { ...questions[i] };
    const qId = q.id || q.questionId || `q-${i}`;
    let valid = true;

    if (!q.stem && q.question) {
      q.stem = q.question;
      normalizationLog.push(`[${qId}] Coerced 'question' field to 'stem'`);
    }

    if (!q.stem || typeof q.stem !== "string" || q.stem.trim().length < 5) {
      normalizationLog.push(`[${qId}] Removed: missing or invalid stem`);
      removedCount++;
      valid = false;
      continue;
    }

    q.stem = q.stem.trim();

    let opts = q.options || q.choices;
    if (typeof opts === "string") {
      try {
        opts = JSON.parse(opts);
        normalizationLog.push(`[${qId}] Parsed string options to JSON`);
      } catch {
        normalizationLog.push(`[${qId}] Removed: unparseable options JSON`);
        removedCount++;
        valid = false;
        continue;
      }
    }

    if (!Array.isArray(opts)) {
      normalizationLog.push(`[${qId}] Removed: options not an array`);
      removedCount++;
      continue;
    }

    const normalizedOpts = opts.map((opt: any) => {
      if (typeof opt === "string") return opt;
      if (opt && typeof opt === "object") return opt.text || opt.content || String(opt);
      return String(opt ?? "");
    }).filter((opt: string) => opt && opt.trim().length > 0);

    if (normalizedOpts.length < 2) {
      normalizationLog.push(`[${qId}] Removed: fewer than 2 valid options after normalization`);
      removedCount++;
      continue;
    }

    q.options = normalizedOpts;

    let correctAnswer = q.correct_answer ?? q.correctAnswer ?? q.correct;
    if (correctAnswer === null || correctAnswer === undefined) {
      normalizationLog.push(`[${qId}] Removed: no correct answer`);
      removedCount++;
      continue;
    }

    if (typeof correctAnswer === "string") {
      const letterMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
      try {
        const parsed = JSON.parse(correctAnswer);
        if (typeof parsed === "number") {
          correctAnswer = [parsed];
        } else if (Array.isArray(parsed)) {
          correctAnswer = parsed;
        } else if (typeof parsed === "string" && letterMap[parsed.toUpperCase()] !== undefined) {
          correctAnswer = [letterMap[parsed.toUpperCase()]];
        } else {
          normalizationLog.push(`[${qId}] Removed: unresolvable correct_answer`);
          removedCount++;
          continue;
        }
      } catch {
        if (letterMap[correctAnswer.toUpperCase()] !== undefined) {
          correctAnswer = [letterMap[correctAnswer.toUpperCase()]];
          normalizationLog.push(`[${qId}] Coerced letter answer to index`);
        } else {
          normalizationLog.push(`[${qId}] Removed: unparseable correct_answer`);
          removedCount++;
          continue;
        }
      }
    }

    if (typeof correctAnswer === "number") {
      correctAnswer = [correctAnswer];
    }

    if (!Array.isArray(correctAnswer)) {
      normalizationLog.push(`[${qId}] Removed: correct_answer not resolvable`);
      removedCount++;
      continue;
    }

    const maxIdx = normalizedOpts.length - 1;
    const validAnswers = correctAnswer.filter((a: any) => typeof a === "number" && a >= 0 && a <= maxIdx);
    if (validAnswers.length === 0) {
      normalizationLog.push(`[${qId}] Removed: correct_answer index out of range`);
      removedCount++;
      continue;
    }

    q.correctAnswer = validAnswers;
    q.correct_answer = validAnswers;

    q.rationale = q.rationale || q.rationaleLong || q.rationale_long || "";
    q.bodySystem = q.bodySystem || q.body_system || "General";
    q.difficulty = typeof q.difficulty === "number" ? q.difficulty : 3;
    q.questionType = q.questionType || q.question_type || "MCQ_SINGLE";

    if (q.quarantined_at || q.quarantinedAt) {
      normalizationLog.push(`[${qId}] Removed: quarantined question`);
      removedCount++;
      continue;
    }

    normalizedQuestions.push(q);
  }

  const totalOriginalCount = questions.length;
  const validQuestionCount = normalizedQuestions.length;

  let fallbackMode = false;
  let fallbackReason: string | undefined;

  if (validQuestionCount < MIN_VALID_QUESTIONS_ABSOLUTE) {
    fallbackMode = true;
    fallbackReason = `Only ${validQuestionCount} valid questions (minimum ${MIN_VALID_QUESTIONS_ABSOLUTE} required)`;
  } else if (totalOriginalCount > 0 && validQuestionCount / totalOriginalCount < MIN_VALID_QUESTIONS_RATIO) {
    fallbackMode = true;
    fallbackReason = `Only ${Math.round((validQuestionCount / totalOriginalCount) * 100)}% of questions are valid (minimum ${MIN_VALID_QUESTIONS_RATIO * 100}% required)`;
  }

  if (fallbackMode && examId) {
    normalizationLog.push(`[FALLBACK] Exam ${examId}: ${fallbackReason}`);
  }

  return {
    questions: normalizedQuestions,
    validQuestionCount,
    totalOriginalCount,
    removedCount,
    fallbackMode,
    fallbackReason,
    normalizationLog,
  };
}

export async function snapshotExamVersion(
  templateId: string,
  questionsPayload: any,
  metadataPayload: any,
  validationResult: ExamValidationResult
): Promise<number> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const versionResult = await client.query(
      `SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM exam_snapshots WHERE template_id = $1 FOR UPDATE`,
      [templateId]
    );
    const version = versionResult.rows[0].next_version;

    await client.query(
      `INSERT INTO exam_snapshots (template_id, version, questions_payload, metadata_payload, validation_result, is_valid, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        templateId,
        version,
        JSON.stringify(questionsPayload),
        JSON.stringify(metadataPayload),
        JSON.stringify(validationResult),
        validationResult.valid,
      ]
    );

    await client.query("COMMIT");
    console.log(`[ExamResilience] Snapshot created for ${templateId} v${version} (valid: ${validationResult.valid})`);
    return version;
  } catch (e: any) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(`[ExamResilience] Failed to snapshot exam ${templateId}:`, e.message);
    return -1;
  } finally {
    client.release();
  }
}

export async function getLastKnownGoodVersion(templateId: string): Promise<{
  version: number;
  questionsPayload: any;
  metadataPayload: any;
} | null> {
  try {
    const result = await pool.query(
      `SELECT version, questions_payload, metadata_payload
       FROM exam_snapshots
       WHERE template_id = $1 AND is_valid = true
       ORDER BY version DESC LIMIT 1`,
      [templateId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      version: row.version,
      questionsPayload: typeof row.questions_payload === "string" ? JSON.parse(row.questions_payload) : row.questions_payload,
      metadataPayload: typeof row.metadata_payload === "string" ? JSON.parse(row.metadata_payload) : row.metadata_payload,
    };
  } catch (e: any) {
    console.error(`[ExamResilience] Failed to get last known good for ${templateId}:`, e.message);
    return null;
  }
}

export async function generateBackupPayload(
  templateId: string,
  questions: any[],
  metadata: any
): Promise<boolean> {
  try {
    const backupPayload = {
      title: metadata.title || metadata.examName || templateId,
      examCode: metadata.examCode || "",
      questions: questions.map((q: any) => ({
        id: q.id,
        stem: q.stem || q.question,
        options: q.options,
        correctAnswer: q.correctAnswer || q.correct_answer,
        rationale: q.rationale || "",
        bodySystem: q.bodySystem || q.body_system || "General",
        difficulty: q.difficulty || 3,
        questionType: q.questionType || q.question_type || "MCQ_SINGLE",
      })),
      questionCount: questions.length,
      generatedAt: new Date().toISOString(),
    };

    await pool.query(
      `INSERT INTO exam_backup_payloads (template_id, payload, question_count, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (template_id) DO UPDATE SET
         payload = EXCLUDED.payload,
         question_count = EXCLUDED.question_count,
         created_at = NOW()`,
      [templateId, JSON.stringify(backupPayload), questions.length]
    );

    console.log(`[ExamResilience] Backup payload cached for ${templateId} (${questions.length} questions)`);
    return true;
  } catch (e: any) {
    console.error(`[ExamResilience] Failed to cache backup for ${templateId}:`, e.message);
    return false;
  }
}

export async function getBackupPayload(templateId: string): Promise<any | null> {
  try {
    const result = await pool.query(
      `SELECT payload FROM exam_backup_payloads WHERE template_id = $1`,
      [templateId]
    );
    if (result.rows.length === 0) return null;
    return typeof result.rows[0].payload === "string"
      ? JSON.parse(result.rows[0].payload)
      : result.rows[0].payload;
  } catch {
    return null;
  }
}

export async function saveSessionState(
  attemptId: string,
  userId: string,
  state: {
    answers: Record<string, any>;
    flagged: string[];
    timeSpent: number;
    currentQuestion: number;
    catState?: any;
    timerState?: any;
  }
): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO exam_session_state (attempt_id, user_id, answers, flagged, time_spent, current_question, cat_state, timer_state, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (attempt_id) DO UPDATE SET
         answers = EXCLUDED.answers,
         flagged = EXCLUDED.flagged,
         time_spent = EXCLUDED.time_spent,
         current_question = EXCLUDED.current_question,
         cat_state = EXCLUDED.cat_state,
         timer_state = EXCLUDED.timer_state,
         updated_at = NOW()`,
      [
        attemptId,
        userId,
        JSON.stringify(state.answers),
        JSON.stringify(state.flagged),
        state.timeSpent,
        state.currentQuestion,
        state.catState ? JSON.stringify(state.catState) : null,
        state.timerState ? JSON.stringify(state.timerState) : null,
      ]
    );
    return true;
  } catch (e: any) {
    console.error(`[ExamResilience] Failed to save session state for ${attemptId}:`, e.message);
    return false;
  }
}

export async function recoverSessionState(attemptId: string, userId: string): Promise<{
  answers: Record<string, any>;
  flagged: string[];
  timeSpent: number;
  currentQuestion: number;
  catState?: any;
  timerState?: any;
  updatedAt: string;
} | null> {
  try {
    const result = await pool.query(
      `SELECT answers, flagged, time_spent, current_question, cat_state, timer_state, updated_at
       FROM exam_session_state
       WHERE attempt_id = $1 AND user_id = $2`,
      [attemptId, userId]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      answers: typeof row.answers === "string" ? JSON.parse(row.answers) : (row.answers || {}),
      flagged: typeof row.flagged === "string" ? JSON.parse(row.flagged) : (row.flagged || []),
      timeSpent: row.time_spent || 0,
      currentQuestion: row.current_question || 0,
      catState: row.cat_state ? (typeof row.cat_state === "string" ? JSON.parse(row.cat_state) : row.cat_state) : undefined,
      timerState: row.timer_state ? (typeof row.timer_state === "string" ? JSON.parse(row.timer_state) : row.timer_state) : undefined,
      updatedAt: row.updated_at?.toISOString?.() || new Date().toISOString(),
    };
  } catch (e: any) {
    console.error(`[ExamResilience] Failed to recover session for ${attemptId}:`, e.message);
    return null;
  }
}

export function logExamIncident(context: {
  examId?: string;
  userId?: string | null;
  tier?: string;
  profession?: string;
  language?: string;
  route?: string;
  fallbackModeTriggered?: boolean;
  questionId?: string;
  severity: "critical" | "warning" | "info";
  reasonCode: string;
  reasonDetail: string;
  endpoint?: string;
  apiResponseStatus?: number;
}) {
  const incident: ExamIncident = {
    userId: context.userId || null,
    examType: context.examId || "unknown",
    tier: context.tier || "unknown",
    reasonCode: context.reasonCode,
    reasonDetail: context.reasonDetail,
    endpoint: context.endpoint || context.route || "unknown",
    requestParams: {
      profession: context.profession,
      language: context.language,
      route: context.route,
      fallbackModeTriggered: context.fallbackModeTriggered || false,
      questionId: context.questionId,
      apiResponseStatus: context.apiResponseStatus,
      timestamp: new Date().toISOString(),
    },
    severity: context.severity,
    createdAt: new Date().toISOString(),
  };

  addIncident(incident);
}

async function getAlertThresholds(): Promise<{
  loadFailures1h: number;
  zeroValidExams: { templateId: string; title: string }[];
  fallbackModeSpike: number;
  circuitOpenExams: string[];
}> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  let loadFailures1h = 0;
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int as cnt FROM exam_incidents
       WHERE created_at > $1 AND reason_code IN ('exam_load_failure', 'normalization_fallback', 'circuit_open')`,
      [oneHourAgo]
    );
    loadFailures1h = result.rows[0]?.cnt || 0;
  } catch {}

  const zeroValidExams: { templateId: string; title: string }[] = [];
  try {
    const result = await pool.query(
      `SELECT template_id, questions_payload FROM exam_snapshots
       WHERE is_valid = false AND created_at > NOW() - INTERVAL '24 hours'
       ORDER BY created_at DESC LIMIT 20`
    );
    for (const row of result.rows) {
      zeroValidExams.push({
        templateId: row.template_id,
        title: row.template_id,
      });
    }
  } catch {}

  let fallbackModeSpike = 0;
  try {
    const result = await pool.query(
      `SELECT COUNT(*)::int as cnt FROM exam_incidents
       WHERE created_at > $1 AND request_params::text LIKE '%"fallbackModeTriggered":true%'`,
      [oneHourAgo]
    );
    fallbackModeSpike = result.rows[0]?.cnt || 0;
  } catch {}

  const circuitOpenExams: string[] = [];
  for (const [examId, circuit] of circuitBreakers) {
    if (circuit.state === "open") {
      circuitOpenExams.push(examId);
    }
  }

  return { loadFailures1h, zeroValidExams, fallbackModeSpike, circuitOpenExams };
}

export async function ensureExamIncidentTables(): Promise<void> {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exam_load_incidents (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
        incident_ref TEXT NOT NULL,
        user_id VARCHAR,
        exam_id VARCHAR,
        attempt_id VARCHAR,
        session_id VARCHAR,
        route TEXT,
        failure_code TEXT NOT NULL,
        failure_message TEXT,
        http_status INTEGER,
        request_summary JSONB DEFAULT '{}'::jsonb,
        recovery_attempts INTEGER DEFAULT 0,
        recovery_stages TEXT[] DEFAULT '{}'::text[],
        final_disposition TEXT,
        browser_info TEXT,
        payload_size INTEGER,
        elapsed_ms INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_exam_load_incidents_ref ON exam_load_incidents(incident_ref);
      CREATE INDEX IF NOT EXISTS idx_exam_load_incidents_user ON exam_load_incidents(user_id);
      CREATE INDEX IF NOT EXISTS idx_exam_load_incidents_attempt ON exam_load_incidents(attempt_id);
      CREATE INDEX IF NOT EXISTS idx_exam_load_incidents_created ON exam_load_incidents(created_at);
      CREATE INDEX IF NOT EXISTS idx_exam_load_incidents_code ON exam_load_incidents(failure_code);
    `);
  } catch (e: any) {
    console.error("[ExamResilience] CRITICAL: Failed to create exam_load_incidents table:", e.message, e.stack);
  }
}

export async function storeExamIncident(params: {
  incidentRef: string;
  userId?: string | null;
  examId?: string | null;
  attemptId?: string | null;
  sessionId?: string | null;
  route?: string;
  failureCode: string;
  failureMessage?: string;
  httpStatus?: number;
  requestSummary?: Record<string, any>;
  recoveryAttempts?: number;
  recoveryStages?: string[];
  finalDisposition?: string;
  browserInfo?: string;
  payloadSize?: number;
  elapsedMs?: number;
}): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO exam_load_incidents
        (incident_ref, user_id, exam_id, attempt_id, session_id, route, failure_code, failure_message,
         http_status, request_summary, recovery_attempts, recovery_stages, final_disposition,
         browser_info, payload_size, elapsed_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        params.incidentRef,
        params.userId || null,
        params.examId || null,
        params.attemptId || null,
        params.sessionId || null,
        params.route || null,
        params.failureCode,
        params.failureMessage || null,
        params.httpStatus || null,
        JSON.stringify(params.requestSummary || {}),
        params.recoveryAttempts || 0,
        params.recoveryStages || [],
        params.finalDisposition || null,
        params.browserInfo || null,
        params.payloadSize || null,
        params.elapsedMs || null,
      ]
    );
    return true;
  } catch (e: any) {
    console.error("[ExamResilience] Failed to store incident:", e.message);
    return false;
  }
}

async function performFullRecovery(attemptId: string, userId: string, options?: {
  clearStaleState?: boolean;
  rebuildQuestions?: boolean;
  batchSize?: number;
}): Promise<{
  recovered: boolean;
  source: string;
  state?: any;
  questions?: any[];
  questionsRecovered?: number;
  questionsSkipped?: number;
  reason?: string;
}> {
  const batchSize = options?.batchSize || 50;

  const attemptResult = await pool.query(
    `SELECT id, user_id, status, questions, answers, flagged, time_spent, cat_state, timer_state, report, total_questions
     FROM mock_exam_attempts WHERE id = $1`,
    [attemptId]
  );

  if (attemptResult.rows.length === 0) {
    return { recovered: false, source: "none", reason: "Exam session not found" };
  }

  const attempt = attemptResult.rows[0];
  if (attempt.user_id !== userId) {
    return { recovered: false, source: "none", reason: "Access denied" };
  }
  if (attempt.status === "completed") {
    return { recovered: false, source: "completed", reason: "Exam already completed" };
  }

  const sessionState = await recoverSessionState(attemptId, userId);

  let rawQuestions = Array.isArray(attempt.questions) ? attempt.questions : [];
  if (typeof attempt.questions === "string") {
    try { rawQuestions = JSON.parse(attempt.questions); } catch { rawQuestions = []; }
  }

  let validQuestions: any[] = [];
  let skippedCount = 0;

  for (let i = 0; i < rawQuestions.length; i += batchSize) {
    const batch = rawQuestions.slice(i, i + batchSize);
    for (const q of batch) {
      if (!q) { skippedCount++; continue; }
      const hasId = q.id !== undefined && q.id !== null;
      const hasStem = typeof q.stem === "string" || typeof q.question === "string";
      let opts = q.options;
      if (typeof opts === "string") {
        try { opts = JSON.parse(opts); } catch { opts = null; }
      }
      const hasOptions = Array.isArray(opts) && opts.length >= 2;

      if (hasId && hasStem && hasOptions) {
        validQuestions.push({ ...q, options: opts });
      } else {
        skippedCount++;
        console.warn(`[ExamRecovery] Skipping invalid question in ${attemptId}: id=${q.id}, hasStem=${hasStem}, hasOptions=${hasOptions}`);
      }
    }
  }

  const recoveredAnswers = sessionState?.answers
    || (typeof attempt.answers === "string" ? JSON.parse(attempt.answers) : attempt.answers)
    || {};
  const recoveredFlagged = sessionState?.flagged
    || (typeof attempt.flagged === "string" ? JSON.parse(attempt.flagged) : attempt.flagged)
    || [];
  const recoveredTimeSpent = sessionState?.timeSpent || attempt.time_spent || 0;
  const recoveredCurrentQ = sessionState?.currentQuestion || Object.keys(recoveredAnswers).length;
  const recoveredCatState = sessionState?.catState
    || (attempt.cat_state ? (typeof attempt.cat_state === "string" ? JSON.parse(attempt.cat_state) : attempt.cat_state) : null);
  const recoveredTimerState = sessionState?.timerState
    || (attempt.timer_state ? (typeof attempt.timer_state === "string" ? JSON.parse(attempt.timer_state) : attempt.timer_state) : null);

  const stateChecksum = `${Object.keys(recoveredAnswers).length}:${validQuestions.length}:${recoveredTimeSpent}`;

  return {
    recovered: validQuestions.length > 0,
    source: sessionState ? "session_state" : "attempt_record",
    state: {
      answers: recoveredAnswers,
      flagged: recoveredFlagged,
      timeSpent: recoveredTimeSpent,
      currentQuestion: recoveredCurrentQ,
      catState: recoveredCatState,
      timerState: recoveredTimerState,
      checksum: stateChecksum,
    },
    questions: validQuestions,
    questionsRecovered: validQuestions.length,
    questionsSkipped: skippedCount,
  };
}

export function registerExamResilienceRoutes(app: Express) {
  ensureExamIncidentTables().catch(() => {});

  app.get("/api/mock-exams/:id/recover", async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Authentication required" });

      const { id } = req.params;
      const result = await performFullRecovery(id, String(user.id));
      res.json(result);
    } catch (e: any) {
      console.error("[ExamResilience] Recovery error:", e.message);
      res.status(500).json({ error: "Failed to recover session" });
    }
  });

  app.post("/api/mock-exams/:id/recover", async (req: any, res) => {
    const startTime = Date.now();
    try {
      const user = await resolveAuthUser(req);
      if (!user) return res.status(401).json({ error: "Authentication required", reasonCode: EXAM_FAILURE_CODES.ENTITLEMENT_FAILURE });

      const { id } = req.params;
      const { incidentRef, failureCode, recoveryAttempt, clearStaleState, browserInfo } = req.body || {};

      console.log(`[ExamRecovery] POST recover attempt=${id} user=${user.id} failureCode=${failureCode} recoveryAttempt=${recoveryAttempt}`);

      const result = await performFullRecovery(id, String(user.id), {
        clearStaleState: clearStaleState === true,
        rebuildQuestions: true,
      });

      const elapsed = Date.now() - startTime;

      if (incidentRef) {
        storeExamIncident({
          incidentRef,
          userId: String(user.id),
          attemptId: id,
          route: `/api/mock-exams/${id}/recover`,
          failureCode: failureCode || "unknown",
          failureMessage: result.reason,
          recoveryAttempts: recoveryAttempt || 1,
          recoveryStages: ["call_recovery"],
          finalDisposition: result.recovered ? "recovered" : "failed",
          browserInfo,
          elapsedMs: elapsed,
          requestSummary: { questionsRecovered: result.questionsRecovered, questionsSkipped: result.questionsSkipped, source: result.source },
        }).catch(() => {});
      }

      console.log(`[ExamRecovery] Result: recovered=${result.recovered} source=${result.source} questions=${result.questionsRecovered} skipped=${result.questionsSkipped} elapsed=${elapsed}ms`);

      res.json({
        ...result,
        elapsedMs: elapsed,
      });
    } catch (e: any) {
      console.error("[ExamResilience] Recovery error:", e.message);
      const classified = classifyServerError(e);
      res.status(500).json({ error: "Failed to recover session", reasonCode: classified.code });
    }
  });

  app.post("/api/exam-load-incidents", async (req: any, res) => {
    try {
      const user = await resolveAuthUser(req).catch(() => null);
      const {
        incidentRef, attemptId, examId, failureCode, failureMessage,
        httpStatus, recoveryAttempts, recoveryStages, finalDisposition,
        browserInfo, payloadSize, elapsedMs, requestSummary,
      } = req.body || {};

      if (!incidentRef || !failureCode) {
        return res.status(400).json({ error: "incidentRef and failureCode are required" });
      }

      await storeExamIncident({
        incidentRef,
        userId: user ? String(user.id) : null,
        examId,
        attemptId,
        route: req.body.route || req.originalUrl,
        failureCode,
        failureMessage,
        httpStatus,
        requestSummary,
        recoveryAttempts,
        recoveryStages,
        finalDisposition,
        browserInfo,
        payloadSize,
        elapsedMs,
      });

      console.log(`[ExamIncident] Stored: ref=${incidentRef} code=${failureCode} user=${user?.id || "anon"} attempt=${attemptId || "none"} disposition=${finalDisposition || "pending"}`);

      res.json({ success: true, incidentRef });
    } catch (e: any) {
      console.error("[ExamIncident] Error storing incident:", e.message);
      res.status(500).json({ error: "Failed to store incident" });
    }
  });

  app.get("/api/admin/exam-load-incidents", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { ref, attemptId, userId, failureCode, limit: limitStr } = req.query;
      const limit = Math.min(parseInt(limitStr as string) || 50, 200);

      let query = `SELECT * FROM exam_load_incidents WHERE 1=1`;
      const params: any[] = [];
      let idx = 1;

      if (ref) {
        query += ` AND incident_ref = $${idx}`;
        params.push(ref);
        idx++;
      }
      if (attemptId) {
        query += ` AND attempt_id = $${idx}`;
        params.push(attemptId);
        idx++;
      }
      if (userId) {
        query += ` AND user_id = $${idx}`;
        params.push(userId);
        idx++;
      }
      if (failureCode) {
        query += ` AND failure_code = $${idx}`;
        params.push(failureCode);
        idx++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx}`;
      params.push(limit);

      const result = await pool.query(query, params);
      res.json({
        incidents: result.rows,
        total: result.rows.length,
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-load-incidents/:ref", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { ref } = req.params;
      const result = await pool.query(
        `SELECT * FROM exam_load_incidents WHERE incident_ref = $1 ORDER BY created_at DESC`,
        [ref]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Incident not found" });
      }

      res.json({ incident: result.rows[0], relatedIncidents: result.rows.slice(1) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/exam-resilience/validate", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { templateId } = req.body;
      if (!templateId) return res.status(400).json({ error: "templateId required" });

      const templateResult = await pool.query(
        `SELECT * FROM mock_exam_templates WHERE template_id = $1`,
        [templateId]
      );

      if (templateResult.rows.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      const template = templateResult.rows[0];

      const { assembleExam } = await import("./mock-exam-assembly");
      const questions = await assembleExam({
        templateId: template.template_id,
        examCode: template.exam_code,
        questionCount: template.question_count,
        timeLimitMinutes: template.time_limit_minutes,
        domainWeights: template.domain_weights,
        difficultyDistribution: template.difficulty_distribution,
        formatMix: template.format_mix,
        passingStandard: template.passing_standard,
        seed: template.seed,
        tier: template.tier,
      });

      const validation = validateExamForPublish({
        templateId: template.template_id,
        title: template.template_name,
        examCode: template.exam_code,
        questions,
        timeLimitMinutes: template.time_limit_minutes,
        passingStandard: template.passing_standard,
        tier: template.tier,
      });

      const normalized = normalizeExamQuestions(questions, template.template_id);

      res.json({
        validation,
        normalization: {
          validQuestionCount: normalized.validQuestionCount,
          totalOriginalCount: normalized.totalOriginalCount,
          removedCount: normalized.removedCount,
          fallbackMode: normalized.fallbackMode,
          fallbackReason: normalized.fallbackReason,
        },
        canPublish: validation.valid && !normalized.fallbackMode,
      });
    } catch (e: any) {
      console.error("[ExamResilience] Validation error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/exam-resilience/publish", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { templateId, force } = req.body;
      if (!templateId) return res.status(400).json({ error: "templateId required" });

      const templateResult = await pool.query(
        `SELECT * FROM mock_exam_templates WHERE template_id = $1`,
        [templateId]
      );

      if (templateResult.rows.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      const template = templateResult.rows[0];

      const { assembleExam } = await import("./mock-exam-assembly");
      const questions = await assembleExam({
        templateId: template.template_id,
        examCode: template.exam_code,
        questionCount: template.question_count,
        timeLimitMinutes: template.time_limit_minutes,
        domainWeights: template.domain_weights,
        difficultyDistribution: template.difficulty_distribution,
        formatMix: template.format_mix,
        passingStandard: template.passing_standard,
        seed: template.seed,
        tier: template.tier,
      });

      const validation = validateExamForPublish({
        templateId: template.template_id,
        title: template.template_name,
        examCode: template.exam_code,
        questions,
        timeLimitMinutes: template.time_limit_minutes,
        passingStandard: template.passing_standard,
        tier: template.tier,
      });

      const normalized = normalizeExamQuestions(questions, templateId);
      const canPublish = validation.valid && !normalized.fallbackMode;

      if (!canPublish && !force) {
        const blockReasons: string[] = [];
        if (!validation.valid) blockReasons.push(`${validation.errors.length} validation errors`);
        if (normalized.fallbackMode) blockReasons.push(`normalization fallback: ${normalized.fallbackReason}`);

        logExamIncident({
          examId: templateId,
          userId: admin.id,
          tier: template.tier,
          severity: "warning",
          reasonCode: "publish_blocked",
          reasonDetail: `Publish blocked: ${blockReasons.join("; ")}`,
          endpoint: "/api/admin/exam-resilience/publish",
        });

        try {
          await pool.query(
            `UPDATE mock_exam_templates SET active = false, updated_at = NOW() WHERE template_id = $1`,
            [templateId]
          );
        } catch (_) {}

        return res.status(422).json({
          published: false,
          reason: "Validation or normalization failed",
          needsRepair: true,
          validation,
          normalization: {
            validQuestionCount: normalized.validQuestionCount,
            totalOriginalCount: normalized.totalOriginalCount,
            removedCount: normalized.removedCount,
            fallbackMode: normalized.fallbackMode,
            fallbackReason: normalized.fallbackReason,
          },
          suggestion: "Fix errors or use force=true to override",
        });
      }

      const metadata = {
        title: template.template_name,
        examCode: template.exam_code,
        examName: template.exam_name,
        tier: template.tier,
        timeLimitMinutes: template.time_limit_minutes,
        passingStandard: template.passing_standard,
      };

      const version = await snapshotExamVersion(templateId, questions, metadata, validation);
      await generateBackupPayload(templateId, questions, metadata);

      if (validation.valid) {
        await pool.query(
          `UPDATE mock_exam_templates SET active = true, updated_at = NOW() WHERE template_id = $1`,
          [templateId]
        );
      } else {
        await pool.query(
          `UPDATE mock_exam_templates SET active = false, updated_at = NOW() WHERE template_id = $1`,
          [templateId]
        );
      }

      logExamIncident({
        examId: templateId,
        userId: admin.id,
        tier: template.tier,
        severity: "info",
        reasonCode: validation.valid ? "exam_published" : "exam_published_forced",
        reasonDetail: `Published version ${version} (valid: ${validation.valid}, forced: ${!!force})`,
        endpoint: "/api/admin/exam-resilience/publish",
      });

      res.json({
        published: true,
        version,
        validation,
        forced: !!force && !validation.valid,
      });
    } catch (e: any) {
      console.error("[ExamResilience] Publish error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-resilience/broken-exams", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const brokenExams: any[] = [];

      try {
        const invalidSnapshots = await pool.query(
          `SELECT DISTINCT ON (template_id) template_id, version, validation_result, created_at
           FROM exam_snapshots
           WHERE is_valid = false
           ORDER BY template_id, version DESC`
        );

        for (const row of invalidSnapshots.rows) {
          brokenExams.push({
            templateId: row.template_id,
            latestVersion: row.version,
            validationResult: row.validation_result,
            lastChecked: row.created_at,
            status: "validation_failed",
          });
        }
      } catch {}

      const circuitStatuses = getAllCircuitStatuses();
      for (const [examId, status] of Object.entries(circuitStatuses)) {
        if (status.state === "open") {
          const existing = brokenExams.find((e) => e.templateId === examId);
          if (existing) {
            existing.circuitOpen = true;
            existing.recentFailures = status.recentFailures;
          } else {
            brokenExams.push({
              templateId: examId,
              status: "circuit_open",
              circuitOpen: true,
              recentFailures: status.recentFailures,
            });
          }
        }
      }

      res.json({ brokenExams, timestamp: new Date().toISOString() });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-resilience/fallback-usage", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const hours = parseInt(req.query.hours as string) || 24;
      const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      let fallbackEvents: any[] = [];
      try {
        const result = await pool.query(
          `SELECT exam_type, reason_code, reason_detail, severity, created_at
           FROM exam_incidents
           WHERE created_at > $1
             AND reason_code IN ('normalization_fallback', 'circuit_open', 'last_known_good_served', 'backup_served')
           ORDER BY created_at DESC LIMIT 200`,
          [since]
        );
        fallbackEvents = result.rows;
      } catch {}

      const byExam: Record<string, number> = {};
      for (const evt of fallbackEvents) {
        byExam[evt.exam_type] = (byExam[evt.exam_type] || 0) + 1;
      }

      res.json({
        totalFallbackEvents: fallbackEvents.length,
        byExam,
        events: fallbackEvents.slice(0, 50),
        periodHours: hours,
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/exam-resilience/disable/:templateId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { templateId } = req.params;
      await pool.query(
        `UPDATE mock_exam_templates SET active = false, updated_at = NOW() WHERE template_id = $1`,
        [templateId]
      );

      logExamIncident({
        examId: templateId,
        userId: admin.id,
        severity: "warning",
        reasonCode: "exam_disabled",
        reasonDetail: `Admin disabled exam template ${templateId}`,
        endpoint: "/api/admin/exam-resilience/disable",
      });

      res.json({ success: true, message: `Template ${templateId} disabled` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/exam-resilience/restore/:templateId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { templateId } = req.params;
      const { version } = req.body;

      let snapshot;
      if (version) {
        const result = await pool.query(
          `SELECT * FROM exam_snapshots WHERE template_id = $1 AND version = $2`,
          [templateId, version]
        );
        snapshot = result.rows[0];
      } else {
        const lastGood = await getLastKnownGoodVersion(templateId);
        if (lastGood) {
          snapshot = lastGood;
        }
      }

      if (!snapshot) {
        return res.status(404).json({ error: "No valid snapshot found to restore" });
      }

      const snapshotQuestions = snapshot.questionsPayload || snapshot.questions_payload;
      const snapshotMeta = snapshot.metadataPayload || snapshot.metadata_payload;
      const snapshotVersion = snapshot.version;

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        resetCircuit(templateId);

        await client.query(
          `UPDATE mock_exam_templates SET active = true, updated_at = NOW() WHERE template_id = $1`,
          [templateId]
        );

        const parsedQuestions = typeof snapshotQuestions === "string" ? JSON.parse(snapshotQuestions) : snapshotQuestions;
        const parsedMeta = typeof snapshotMeta === "string" ? JSON.parse(snapshotMeta) : snapshotMeta;

        await client.query(
          `INSERT INTO exam_backup_payloads (template_id, payload, generated_at, question_count)
           VALUES ($1, $2, NOW(), $3)
           ON CONFLICT (template_id) DO UPDATE SET
             payload = EXCLUDED.payload,
             generated_at = NOW(),
             question_count = EXCLUDED.question_count`,
          [
            templateId,
            JSON.stringify({ questions: parsedQuestions, metadata: parsedMeta, restoredFromVersion: snapshotVersion }),
            Array.isArray(parsedQuestions) ? parsedQuestions.length : 0,
          ]
        );

        await client.query(
          `INSERT INTO exam_snapshots (template_id, version, questions_payload, metadata_payload, validation_result, is_valid, created_at)
           VALUES ($1, (SELECT COALESCE(MAX(version), 0) + 1 FROM exam_snapshots WHERE template_id = $1), $2, $3, $4, true, NOW())`,
          [
            templateId,
            typeof parsedQuestions === "string" ? parsedQuestions : JSON.stringify(parsedQuestions),
            typeof parsedMeta === "string" ? parsedMeta : JSON.stringify(parsedMeta),
            JSON.stringify({ valid: true, restoredFromVersion: snapshotVersion }),
          ]
        );

        await client.query("COMMIT");
      } catch (txErr) {
        await client.query("ROLLBACK").catch(() => {});
        throw txErr;
      } finally {
        client.release();
      }

      logExamIncident({
        examId: templateId,
        userId: admin.id,
        severity: "info",
        reasonCode: "exam_restored",
        reasonDetail: `Admin restored exam to version ${snapshotVersion}, updated backup payload and created new snapshot`,
        endpoint: "/api/admin/exam-resilience/restore",
      });

      res.json({
        success: true,
        message: `Template ${templateId} restored from version ${snapshotVersion}`,
        version: snapshotVersion,
        circuitReset: true,
        backupPayloadUpdated: true,
        newSnapshotCreated: true,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/admin/exam-resilience/reset-circuit/:examId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { examId } = req.params;
      resetCircuit(examId);

      logExamIncident({
        examId,
        userId: admin.id,
        severity: "info",
        reasonCode: "circuit_reset",
        reasonDetail: `Admin manually reset circuit breaker for ${examId}`,
        endpoint: "/api/admin/exam-resilience/reset-circuit",
      });

      res.json({ success: true, message: `Circuit reset for ${examId}` });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-resilience/alerts", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const thresholds = await getAlertThresholds();

      const alerts: { level: string; message: string; metric: string; value: number | string }[] = [];

      if (thresholds.loadFailures1h > 5) {
        alerts.push({
          level: "critical",
          message: `${thresholds.loadFailures1h} exam load failures in the last hour (threshold: 5)`,
          metric: "load_failures_1h",
          value: thresholds.loadFailures1h,
        });
      }

      for (const exam of thresholds.zeroValidExams) {
        alerts.push({
          level: "critical",
          message: `Exam ${exam.templateId} has zero valid questions`,
          metric: "zero_valid_questions",
          value: exam.templateId,
        });
      }

      if (thresholds.fallbackModeSpike > 10) {
        alerts.push({
          level: "warning",
          message: `${thresholds.fallbackModeSpike} fallback mode events in the last hour`,
          metric: "fallback_mode_spike",
          value: thresholds.fallbackModeSpike,
        });
      }

      for (const examId of thresholds.circuitOpenExams) {
        alerts.push({
          level: "critical",
          message: `Circuit breaker OPEN for exam ${examId}`,
          metric: "circuit_open",
          value: examId,
        });
      }

      res.json({
        alerts,
        alertCount: alerts.length,
        hasCritical: alerts.some((a) => a.level === "critical"),
        thresholds: {
          loadFailures1h: thresholds.loadFailures1h,
          zeroValidExamCount: thresholds.zeroValidExams.length,
          fallbackModeSpike: thresholds.fallbackModeSpike,
          circuitOpenCount: thresholds.circuitOpenExams.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-resilience/circuit-status", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { examId } = req.query;
      if (examId) {
        res.json(getCircuitStatus(examId as string));
      } else {
        res.json({
          circuits: getAllCircuitStatuses(),
          timestamp: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/exam-resilience/snapshots/:templateId", async (req: any, res) => {
    try {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { templateId } = req.params;
      const result = await pool.query(
        `SELECT version, is_valid, validation_result, created_at
         FROM exam_snapshots
         WHERE template_id = $1
         ORDER BY version DESC LIMIT 20`,
        [templateId]
      );

      res.json({
        templateId,
        snapshots: result.rows.map((r: any) => ({
          version: r.version,
          isValid: r.is_valid,
          validationSummary: {
            errorCount: r.validation_result?.errors?.length || 0,
            warningCount: r.validation_result?.warnings?.length || 0,
          },
          createdAt: r.created_at,
        })),
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
}

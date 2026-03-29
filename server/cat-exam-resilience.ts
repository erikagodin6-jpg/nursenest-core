import { pool } from "./storage";
import { addAlert } from "./platform-resilience";
import type {
  NormalizedExamStartResponse,
  QuestionPoolDiagnostics,
  ExamStartMode,
  QuestionSource,
} from "@shared/exam-error-codes";

interface EmergencyQuestion {
  id: string;
  stem: string;
  options: string[];
  correct_answer: any;
  body_system: string;
  topic: string;
  difficulty: number;
  question_type: string;
  tier: string;
}

interface FallbackBank {
  tier: string;
  version: number;
  generatedAt: string;
  questions: EmergencyQuestion[];
  checksum: string;
}

const emergencyBanks = new Map<string, FallbackBank>();
const validatedSnapshots = new Map<string, { questions: EmergencyQuestion[]; version: number; generatedAt: string; checksum: string }>();

const SUPPORTED_TIERS = ["rpn", "rn", "np", "allied"];
const MIN_EMERGENCY_QUESTIONS = 25;
const PRACTICE_BLOCK_SIZE = 30;

function computeChecksum(questions: EmergencyQuestion[]): string {
  const data = questions.map(q => q.id).sort().join(",");
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `chk_${Math.abs(hash).toString(36)}_${questions.length}`;
}

function validateQuestion(q: any): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!q.stem && !q.body) reasons.push("missing_stem");
  if (!q.correct_answer && q.correct_answer !== 0) reasons.push("missing_correct_answer");

  let options: any[] = [];
  try {
    options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
  } catch {
    reasons.push("malformed_options");
  }
  if (!Array.isArray(options) || options.length < 4) reasons.push("fewer_than_4_options");
  if (q.difficulty === null || q.difficulty === undefined) reasons.push("missing_difficulty");

  return { valid: reasons.length === 0, reasons };
}

export function runQuestionPoolDiagnostics(
  rawRows: any[],
  tier: string,
  examType: string = "cat",
  filters?: { region?: string; language?: string }
): QuestionPoolDiagnostics {
  const rejectionReasons: Record<string, number> = {};
  const incr = (reason: string) => { rejectionReasons[reason] = (rejectionReasons[reason] || 0) + 1; };

  const rawCandidates = rawRows.length;

  const afterTier = rawRows.filter(q => {
    const match = (q.tier || "").toLowerCase() === tier.toLowerCase();
    if (!match) incr("wrong_tier");
    return match;
  });

  const afterEntitlement = afterTier;

  const afterRegion = filters?.region
    ? afterEntitlement.filter(q => {
        const region = (q.region_scope || q.region || "").toLowerCase();
        if (!region || region === "all" || region === "both") return true;
        const userRegion = filters.region!.toLowerCase();
        if (region === userRegion) return true;
        if (userRegion === "ca" && region === "can") return true;
        if (userRegion === "can" && region === "ca") return true;
        incr("wrong_region");
        return false;
      })
    : afterEntitlement;

  const afterLanguage = filters?.language
    ? afterRegion.filter(q => {
        if (!q.language || q.language === "en") return true;
        const match = q.language.toLowerCase() === filters.language!.toLowerCase();
        if (!match) incr("wrong_language");
        return match;
      })
    : afterRegion;

  const afterActivePublished = afterLanguage.filter(q => {
    const status = (q.status || "").toLowerCase();
    if (status !== "published" && status !== "active") {
      incr(status === "draft" ? "unpublished" : status === "inactive" ? "inactive" : "wrong_status");
      return false;
    }
    return true;
  });

  const afterCatValidation = afterActivePublished.filter(q => {
    const { valid, reasons } = validateQuestion(q);
    if (!valid) {
      for (const r of reasons) incr(r);
    }
    return valid;
  });

  const diagnostics: QuestionPoolDiagnostics = {
    rawCandidates,
    afterTierFilter: afterTier.length,
    afterEntitlementFilter: afterEntitlement.length,
    afterRegionFilter: afterRegion.length,
    afterLanguageFilter: afterLanguage.length,
    afterActivePublishedFilter: afterActivePublished.length,
    afterCatValidation: afterCatValidation.length,
    finalUsableCount: afterCatValidation.length,
    rejectionReasons,
    filterTimestamp: new Date().toISOString(),
    tier,
    examType,
  };

  console.log(`[CATDiagnostics] Pool filter pipeline for tier=${tier}, examType=${examType}:`, {
    raw: rawCandidates,
    afterTier: afterTier.length,
    afterEntitlement: afterEntitlement.length,
    afterRegion: afterRegion.length,
    afterLanguage: afterLanguage.length,
    afterActivePublished: afterActivePublished.length,
    afterCatValidation: afterCatValidation.length,
    final: afterCatValidation.length,
    rejections: rejectionReasons,
  });

  return diagnostics;
}

export async function fetchQuestionsFromPrimaryDb(
  tier: string,
  opts?: { limit?: number; region?: string; language?: string }
): Promise<{ questions: any[]; source: QuestionSource; diagnostics: QuestionPoolDiagnostics }> {
  const limit = opts?.limit || 500;

  const result = await pool.query(
    `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type, tier, status, region_scope, language, is_adaptive_eligible
     FROM exam_questions
     WHERE tier = $1 AND status = 'published'
     ORDER BY RANDOM()
     LIMIT $2`,
    [tier, limit]
  );

  const rawAll = await pool.query(
    `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type, tier, status, region_scope, language, is_adaptive_eligible
     FROM exam_questions
     WHERE tier = $1
     LIMIT 2000`,
    [tier]
  );

  const diagnostics = runQuestionPoolDiagnostics(rawAll.rows, tier, "cat", {
    region: opts?.region,
    language: opts?.language,
  });

  return { questions: result.rows, source: "primary_db", diagnostics };
}

export async function fetchQuestionsFromSnapshot(tier: string): Promise<{ questions: EmergencyQuestion[]; source: QuestionSource } | null> {
  const snapshot = validatedSnapshots.get(tier);
  if (!snapshot || snapshot.questions.length === 0) {
    console.log(`[CATResilience] No validated snapshot for tier=${tier}`);
    return null;
  }

  const currentChecksum = computeChecksum(snapshot.questions);
  if (currentChecksum !== snapshot.checksum) {
    console.error(`[CATResilience] Snapshot integrity check failed for tier=${tier} (expected ${snapshot.checksum}, got ${currentChecksum})`);
    addAlert("warning", "cat_resilience", `Snapshot integrity failure: ${tier}`, `Validated snapshot for ${tier} failed checksum verification`, "cat-exam-resilience");
    return null;
  }

  console.log(`[CATResilience] Using validated snapshot for tier=${tier}, version=${snapshot.version}, questions=${snapshot.questions.length}`);
  return { questions: snapshot.questions, source: "validated_snapshot" };
}

export function getEmergencyBank(tier: string): { questions: EmergencyQuestion[]; source: QuestionSource } | null {
  const bank = emergencyBanks.get(tier);
  if (!bank || bank.questions.length === 0) {
    console.log(`[CATResilience] No emergency bank for tier=${tier}`);
    return null;
  }

  const currentChecksum = computeChecksum(bank.questions);
  if (currentChecksum !== bank.checksum) {
    console.error(`[CATResilience] Emergency bank integrity check failed for tier=${tier}`);
    addAlert("warning", "cat_resilience", `Emergency bank integrity failure: ${tier}`, `Emergency bank for ${tier} failed checksum verification`, "cat-exam-resilience");
    return null;
  }

  console.log(`[CATResilience] Using emergency fallback bank for tier=${tier}, version=${bank.version}, questions=${bank.questions.length}`);
  return { questions: bank.questions, source: "emergency_fallback_bank" };
}

function mapTierToStream(tier: string): string {
  const mapping: Record<string, string> = {
    rpn: "RPN",
    rn: "RN",
    np: "NP",
    allied: "Allied",
  };
  return mapping[tier.toLowerCase()] || tier.toUpperCase();
}

export async function refreshEmergencyBanks(): Promise<{ tier: string; count: number; success: boolean }[]> {
  const results: { tier: string; count: number; success: boolean }[] = [];

  for (const tier of SUPPORTED_TIERS) {
    try {
      const result = await pool.query(
        `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type, tier
         FROM exam_questions
         WHERE tier = $1 AND status = 'published'
         ORDER BY RANDOM()
         LIMIT 50`,
        [tier]
      );

      const validated = result.rows.filter(q => {
        const { valid } = validateQuestion(q);
        return valid;
      });

      if (validated.length >= MIN_EMERGENCY_QUESTIONS) {
        const bank: FallbackBank = {
          tier,
          version: Date.now(),
          generatedAt: new Date().toISOString(),
          questions: validated.map(q => ({
            ...q,
            options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
          })),
          checksum: computeChecksum(validated),
        };
        emergencyBanks.set(tier, bank);

        validatedSnapshots.set(tier, {
          questions: bank.questions,
          version: bank.version,
          generatedAt: bank.generatedAt,
          checksum: bank.checksum,
        });

        persistBankToDb(bank).catch(() => {});

        console.log(`[CATResilience] Emergency bank refreshed for ${mapTierToStream(tier)}: ${validated.length} questions, version=${bank.version}`);
        results.push({ tier, count: validated.length, success: true });
      } else {
        console.warn(`[CATResilience] Insufficient questions for ${mapTierToStream(tier)} emergency bank: ${validated.length}/${MIN_EMERGENCY_QUESTIONS}`);
        results.push({ tier, count: validated.length, success: false });
      }
    } catch (e: any) {
      console.error(`[CATResilience] Failed to refresh emergency bank for ${tier}:`, e.message);
      results.push({ tier, count: 0, success: false });
    }
  }

  return results;
}

export async function attemptFallbackChain(
  userId: string,
  tier: string,
  maxQuestions: number,
  failureReason: string,
  opts?: { region?: string; language?: string; blueprintCode?: string }
): Promise<NormalizedExamStartResponse> {
  const incidentId = `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[CATResilience] Starting fallback chain for user=${userId}, tier=${tier}, reason=${failureReason}, incident=${incidentId}`);

  const fallbackSteps: { mode: ExamStartMode; attempt: () => Promise<NormalizedExamStartResponse | null> }[] = [
    {
      mode: "fallback_standard_exam",
      attempt: async () => {
        try {
          console.log(`[CATResilience][${incidentId}] Step 1: Attempting standard exam fallback`);
          const result = await pool.query(
            `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type
             FROM exam_questions
             WHERE tier = $1 AND status = 'published'
             ORDER BY RANDOM()
             LIMIT $2`,
            [tier, maxQuestions]
          );

          const validQuestions = result.rows.filter(q => validateQuestion(q).valid);
          if (validQuestions.length < 10) {
            console.log(`[CATResilience][${incidentId}] Standard fallback insufficient: ${validQuestions.length} valid questions`);
            return null;
          }

          const sessionId = `fallback_std_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const questionData = buildMockExamQuestionData(validQuestions, tier);
          const attemptResult = await pool.query(
            `INSERT INTO mock_exam_attempts (id, user_id, tier, total_questions, status, exam_type, questions, cat_state, started_at)
             VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', 'practice', $4, $5, NOW())
             RETURNING id`,
            [userId, tier, validQuestions.length, JSON.stringify(questionData), JSON.stringify({ sessionId, source: "fallback_standard_exam", fallbackReason: failureReason, examMode: "fallback_standard_exam" })]
          );

          const attemptId = attemptResult.rows[0].id;

          console.log(`[CATResilience][${incidentId}] Standard fallback succeeded: ${validQuestions.length} questions, attemptId=${attemptId}`);
          logExamSource(attemptId, "primary_db", "fallback_standard_exam", tier);

          return {
            ok: true,
            mode: "fallback_standard_exam",
            attemptId,
            sessionId,
            questions: questionData,
            progress: { questionNumber: 1, totalQuestions: validQuestions.length, questionsAnswered: 0 },
            meta: {
              tier,
              source: "primary_db",
              fallbackReason: sanitizeFallbackReason(failureReason),
              fallbackMessage: "Adaptive mode is temporarily unavailable. We've started a standard exam instead.",
              degradedMode: true,
            },
          };
        } catch (e: any) {
          console.error(`[CATResilience][${incidentId}] Standard fallback failed:`, e.message);
          return null;
        }
      },
    },
    {
      mode: "fallback_practice_block",
      attempt: async () => {
        try {
          console.log(`[CATResilience][${incidentId}] Step 2: Attempting practice block fallback`);
          let questions: any[] = [];
          let source: QuestionSource = "primary_db";

          try {
            const result = await pool.query(
              `SELECT id, stem, options, correct_answer, body_system, topic, difficulty, question_type
               FROM exam_questions
               WHERE tier = $1 AND status = 'published'
               ORDER BY RANDOM()
               LIMIT $2`,
              [tier, PRACTICE_BLOCK_SIZE]
            );
            questions = result.rows.filter(q => validateQuestion(q).valid);
          } catch {
            questions = [];
          }

          if (questions.length < 5) {
            console.log(`[CATResilience][${incidentId}] Primary DB insufficient for practice block (${questions.length}), trying snapshot`);
            const snapshot = await fetchQuestionsFromSnapshot(tier);
            if (snapshot && snapshot.questions.length >= 5) {
              questions = snapshot.questions.slice(0, PRACTICE_BLOCK_SIZE);
              source = "validated_snapshot";
            }
          }

          if (questions.length < 5) {
            console.log(`[CATResilience][${incidentId}] Practice block insufficient: ${questions.length} questions`);
            return null;
          }

          const sessionId = `fallback_pb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const questionData = buildMockExamQuestionData(questions, tier);
          const attemptResult = await pool.query(
            `INSERT INTO mock_exam_attempts (id, user_id, tier, total_questions, status, exam_type, questions, cat_state, started_at)
             VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', 'practice', $4, $5, NOW())
             RETURNING id`,
            [userId, tier, questions.length, JSON.stringify(questionData), JSON.stringify({ sessionId, source: "fallback_practice_block", fallbackReason: failureReason, examMode: "fallback_practice_block" })]
          );

          const attemptId = attemptResult.rows[0].id;

          console.log(`[CATResilience][${incidentId}] Practice block fallback succeeded: ${questions.length} questions, source=${source}`);
          logExamSource(attemptId, source, "fallback_practice_block", tier);

          return {
            ok: true,
            mode: "fallback_practice_block",
            attemptId,
            sessionId,
            questions: questionData,
            progress: { questionNumber: 1, totalQuestions: questions.length, questionsAnswered: 0 },
            meta: {
              tier,
              source,
              fallbackReason: sanitizeFallbackReason(failureReason),
              fallbackMessage: "Adaptive mode is temporarily unavailable. We've prepared a practice block for you.",
              degradedMode: true,
            },
          };
        } catch (e: any) {
          console.error(`[CATResilience][${incidentId}] Practice block fallback failed:`, e.message);
          return null;
        }
      },
    },
    {
      mode: "fallback_emergency_bank",
      attempt: async () => {
        try {
          console.log(`[CATResilience][${incidentId}] Step 3: Attempting emergency bank fallback`);
          const bank = getEmergencyBank(tier);
          if (!bank || bank.questions.length === 0) {
            console.log(`[CATResilience][${incidentId}] No emergency bank available for tier=${tier}`);
            return null;
          }

          const sessionId = `fallback_emg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          const questionData = buildMockExamQuestionData(bank.questions, tier);
          const attemptResult = await pool.query(
            `INSERT INTO mock_exam_attempts (id, user_id, tier, total_questions, status, exam_type, questions, cat_state, started_at)
             VALUES (gen_random_uuid(), $1, $2, $3, 'in_progress', 'practice', $4, $5, NOW())
             RETURNING id`,
            [userId, tier, bank.questions.length, JSON.stringify(questionData), JSON.stringify({ sessionId, source: "fallback_emergency_bank", fallbackReason: failureReason, examMode: "fallback_emergency_bank" })]
          );

          const attemptId = attemptResult.rows[0].id;

          console.log(`[CATResilience][${incidentId}] Emergency bank fallback succeeded: ${bank.questions.length} questions`);
          logExamSource(attemptId, "emergency_fallback_bank", "fallback_emergency_bank", tier);

          return {
            ok: true,
            mode: "fallback_emergency_bank",
            attemptId,
            sessionId,
            questions: questionData,
            progress: { questionNumber: 1, totalQuestions: bank.questions.length, questionsAnswered: 0 },
            meta: {
              tier,
              source: "emergency_fallback_bank",
              fallbackReason: sanitizeFallbackReason(failureReason),
              fallbackMessage: "Adaptive mode is temporarily unavailable. We've started a standard exam instead.",
              degradedMode: true,
            },
          };
        } catch (e: any) {
          console.error(`[CATResilience][${incidentId}] Emergency bank fallback failed:`, e.message);
          return null;
        }
      },
    },
  ];

  for (const step of fallbackSteps) {
    try {
      const result = await step.attempt();
      if (result) return result;
    } catch (e: any) {
      console.error(`[CATResilience][${incidentId}] Fallback step ${step.mode} threw:`, e.message);
    }
  }

  console.error(`[CATResilience][${incidentId}] All fallback steps exhausted — returning unavailable`);
  addAlert(
    "critical",
    "cat_resilience",
    `CAT Exam Unavailable: ${tier}`,
    `All fallback options exhausted for tier=${tier}, user=${userId}, reason=${failureReason}`,
    "cat-exam-resilience",
    { incidentId, tier, userId, failureReason }
  );

  return {
    ok: false,
    mode: "unavailable",
    errorCode: "all_fallbacks_exhausted",
    message: "Exams are temporarily unavailable. Our team has been notified and is working to resolve this.",
    retryable: true,
    meta: {
      tier,
      source: "primary_db",
      incidentId,
      fallbackReason: sanitizeFallbackReason(failureReason),
    },
  };
}

function sanitizeFallbackReason(reason: string): string {
  const safeReasons: Record<string, string> = {
    pool_empty: "No questions available for this configuration",
    cat_select_returned_null: "Unable to select a suitable question",
    start_exception: "An unexpected error occurred during exam setup",
  };
  for (const [key, msg] of Object.entries(safeReasons)) {
    if (reason.startsWith(key)) return msg;
  }
  return "Exam preparation encountered an issue";
}

function formatQuestion(q: any): any {
  let options: any[];
  try {
    options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
  } catch {
    options = [];
  }
  return {
    id: q.id,
    stem: q.stem,
    options,
    bodySystem: q.body_system || q.bodySystem,
    topic: q.topic,
    difficulty: q.difficulty,
    questionType: q.question_type || q.questionType,
  };
}

function buildMockExamQuestionData(questions: any[], tier: string): any[] {
  return questions.map(q => {
    let options: any[];
    try {
      options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
    } catch {
      options = [];
    }
    return {
      id: q.id,
      question: q.stem,
      options,
      correct: q.correct_answer,
      bodySystem: q.body_system || q.bodySystem,
      tier,
      lessonId: "mock-exam",
      source: "quiz",
      topic: q.topic,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      questionType: q.question_type || q.questionType,
    };
  });
}

function logExamSource(attemptId: string, source: QuestionSource, mode: ExamStartMode, tier: string): void {
  console.log(`[CATResilience][ExamSource] attemptId=${attemptId}, source=${source}, mode=${mode}, tier=${tier}`);
  pool.query(
    `UPDATE mock_exam_attempts SET cat_state = COALESCE(cat_state, '{}'::jsonb) || $1::jsonb WHERE id = $2`,
    [JSON.stringify({ examSource: source, examMode: mode }), attemptId]
  ).catch(e => console.error("[CATResilience] Failed to log exam source:", e.message));
}

export function buildNormalizedCatSuccess(
  attemptId: string,
  sessionId: string,
  question: any,
  tier: string,
  maxQuestions: number,
  catState: { currentAbility: number; standardError: number; questionCount: number },
  source: QuestionSource = "primary_db"
): NormalizedExamStartResponse {
  return {
    ok: true,
    mode: "cat",
    attemptId,
    sessionId,
    question,
    progress: {
      questionNumber: catState.questionCount + 1,
      totalQuestions: maxQuestions,
      questionsAnswered: catState.questionCount,
    },
    meta: {
      tier,
      source,
      catState,
    },
  };
}

export function buildNormalizedError(
  errorCode: string,
  message: string,
  retryable: boolean,
  tier: string,
  incidentId?: string
): NormalizedExamStartResponse {
  return {
    ok: false,
    mode: "unavailable",
    errorCode,
    message,
    retryable,
    meta: {
      tier,
      source: "primary_db",
      incidentId,
    },
  };
}

export async function safeNonEssential<T>(
  label: string,
  fn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    console.warn(`[CATResilience][NonEssential] ${label} failed (non-blocking):`, e.message);
    return fallbackValue;
  }
}

export function getEmergencyBankStatus(): { tier: string; available: boolean; questionCount: number; version: number; generatedAt: string }[] {
  return SUPPORTED_TIERS.map(tier => {
    const bank = emergencyBanks.get(tier);
    return {
      tier,
      available: !!bank && bank.questions.length >= MIN_EMERGENCY_QUESTIONS,
      questionCount: bank?.questions.length || 0,
      version: bank?.version || 0,
      generatedAt: bank?.generatedAt || "never",
    };
  });
}

async function ensureFallbackBankTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cat_emergency_fallback_banks (
      tier TEXT PRIMARY KEY,
      version BIGINT NOT NULL,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      checksum TEXT NOT NULL,
      questions JSONB NOT NULL,
      question_count INTEGER NOT NULL
    )
  `);
}

async function persistBankToDb(bank: FallbackBank): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO cat_emergency_fallback_banks (tier, version, generated_at, checksum, questions, question_count)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (tier) DO UPDATE SET version = $2, generated_at = $3, checksum = $4, questions = $5, question_count = $6`,
      [bank.tier, bank.version, bank.generatedAt, bank.checksum, JSON.stringify(bank.questions), bank.questions.length]
    );
  } catch (e: any) {
    console.error(`[CATResilience] Failed to persist bank for ${bank.tier}:`, e.message);
  }
}

async function loadBanksFromDb(): Promise<number> {
  let loaded = 0;
  try {
    const result = await pool.query(
      `SELECT tier, version, generated_at, checksum, questions, question_count FROM cat_emergency_fallback_banks`
    );
    for (const row of result.rows) {
      if (!emergencyBanks.has(row.tier) && row.question_count >= MIN_EMERGENCY_QUESTIONS) {
        const bank: FallbackBank = {
          tier: row.tier,
          version: Number(row.version),
          generatedAt: row.generated_at,
          questions: typeof row.questions === "string" ? JSON.parse(row.questions) : row.questions,
          checksum: row.checksum,
        };
        emergencyBanks.set(row.tier, bank);
        validatedSnapshots.set(row.tier, {
          questions: bank.questions,
          version: bank.version,
          generatedAt: bank.generatedAt,
          checksum: bank.checksum,
        });
        loaded++;
        console.log(`[CATResilience] Loaded persisted bank for ${mapTierToStream(row.tier)}: ${row.question_count} questions`);
      }
    }
  } catch (e: any) {
    console.error("[CATResilience] Failed to load banks from DB:", e.message);
  }
  return loaded;
}

export async function initCatResilience(): Promise<void> {
  console.log("[CATResilience] Initializing emergency fallback banks...");
  try {
    await ensureFallbackBankTable();
    const results = await refreshEmergencyBanks();
    const successCount = results.filter(r => r.success).length;

    if (successCount < SUPPORTED_TIERS.length) {
      const dbLoaded = await loadBanksFromDb();
      if (dbLoaded > 0) {
        console.log(`[CATResilience] Loaded ${dbLoaded} additional banks from persisted storage`);
      }
    }

    console.log(`[CATResilience] Emergency banks initialized: ${emergencyBanks.size}/${SUPPORTED_TIERS.length} tiers ready`);
    for (const r of results) {
      if (!r.success && !emergencyBanks.has(r.tier)) {
        console.warn(`[CATResilience] Bank for ${r.tier} not ready (${r.count} questions)`);
      }
    }
  } catch (e: any) {
    console.error("[CATResilience] Failed to initialize emergency banks:", e.message);
  }
}

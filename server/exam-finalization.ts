import { pool } from "./storage";

export interface FinalizationResult {
  success: boolean;
  score: number;
  report: any;
  error?: string;
}

export async function finalizeExamAttempt(attemptId: string, userId: string): Promise<FinalizationResult> {
  const startTime = Date.now();
  console.log(`[ExamFinalization] Starting finalization for attempt=${attemptId} user=${userId}`);

  try {
    const attemptResult = await pool.query(
      `SELECT id, user_id, questions, answers, flagged, cat_state, time_spent,
              exam_type, blueprint_code, blueprint_meta, status, stopping_rule_status
       FROM mock_exam_attempts WHERE id = $1`,
      [attemptId]
    );

    if (attemptResult.rows.length === 0) {
      return { success: false, score: 0, report: null, error: "Attempt not found" };
    }

    const attempt = attemptResult.rows[0];

    if (attempt.user_id !== userId) {
      return { success: false, score: 0, report: null, error: "Access denied" };
    }

    if (attempt.status === "completed") {
      console.log(`[ExamFinalization] Attempt ${attemptId} already completed, returning existing report`);
      return { success: true, score: attempt.score || 0, report: attempt.report || {} };
    }

    const transitionResult = await pool.query(
      `UPDATE mock_exam_attempts SET status = 'processing' WHERE id = $1 AND status IN ('completion_requested', 'in_progress')`,
      [attemptId]
    );
    if (transitionResult.rowCount === 0 && attempt.status !== "processing") {
      console.warn(`[ExamFinalization] Could not transition attempt=${attemptId} (status=${attempt.status}), skipping`);
      return { success: false, score: 0, report: null, error: "State transition failed" };
    }

    const answers = attempt.answers || {};
    const flaggedIds = attempt.flagged || [];
    const rawQuestions = attempt.questions || [];

    const allQuestionIds: string[] = rawQuestions.map((q: any) =>
      typeof q === "string" ? q : (q?.id || q?.questionId)
    ).filter(Boolean);

    const correctAnswerMap = new Map<string, number>();
    const questionMetaMap = new Map<string, { bodySystem: string; topic: string }>();

    if (allQuestionIds.length > 0) {
      const batchSize = 200;
      for (let i = 0; i < allQuestionIds.length; i += batchSize) {
        const batch = allQuestionIds.slice(i, i + batchSize);
        const placeholders = batch.map((_: any, idx: number) => `$${idx + 1}`).join(",");
        const qResult = await pool.query(
          `SELECT id, body_system, topic, correct_answer FROM exam_questions WHERE id IN (${placeholders})`,
          batch
        );
        for (const row of qResult.rows) {
          questionMetaMap.set(row.id, {
            bodySystem: row.body_system || "General",
            topic: row.topic || "General",
          });
          if (row.correct_answer !== null && row.correct_answer !== undefined) {
            let ca = row.correct_answer;
            if (typeof ca === "string") { try { ca = JSON.parse(ca); } catch {} }
            if (Array.isArray(ca) && ca.length > 0) {
              correctAnswerMap.set(row.id, ca[0]);
            } else if (typeof ca === "number") {
              correctAnswerMap.set(row.id, ca);
            }
          }
        }
      }
    }

    const domainBreakdown: Record<string, { total: number; correct: number; percentage: number; avgTimeMs: number }> = {};
    let totalTimeMs = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;

    for (const qId of allQuestionIds) {
      const answer = answers[qId];
      const meta = questionMetaMap.get(qId);
      const domain = meta?.bodySystem || meta?.topic || "General";

      let isCorrect = false;
      if (answer && correctAnswerMap.has(qId)) {
        isCorrect = answer.selectedOption === correctAnswerMap.get(qId);
      } else if (answer?.isCorrect !== undefined) {
        isCorrect = !!answer.isCorrect;
      }

      const timeMs = answer?.responseTimeMs || answer?.timeSpent || 0;

      if (!domainBreakdown[domain]) {
        domainBreakdown[domain] = { total: 0, correct: 0, percentage: 0, avgTimeMs: 0 };
      }
      domainBreakdown[domain].total++;
      if (isCorrect) domainBreakdown[domain].correct++;
      domainBreakdown[domain].avgTimeMs += timeMs;

      totalTimeMs += timeMs;
      totalQuestions++;
      if (isCorrect) totalCorrect++;
    }

    for (const domain of Object.keys(domainBreakdown)) {
      const d = domainBreakdown[domain];
      d.percentage = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
      d.avgTimeMs = d.total > 0 ? Math.round(d.avgTimeMs / d.total) : 0;
    }

    const avgTimePerQuestion = totalQuestions > 0 ? Math.round(totalTimeMs / totalQuestions) : 0;
    const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    let comparison: any = null;
    try {
      const previousResult = await pool.query(
        `SELECT id, score, time_spent FROM mock_exam_attempts
         WHERE user_id = $1 AND status = 'completed' AND id != $2
         ORDER BY completed_at DESC LIMIT 1`,
        [userId, attemptId]
      );
      if (previousResult.rows.length > 0) {
        const prev = previousResult.rows[0];
        comparison = {
          previousAttemptId: prev.id,
          previousScore: prev.score,
          scoreDelta: score - (prev.score || 0),
          improved: score > (prev.score || 0),
        };
      }
    } catch (e: any) {
      console.warn(`[ExamFinalization] Non-critical: comparison query failed: ${e.message}`);
    }

    const enhancedReport = {
      score,
      totalQuestions,
      totalCorrect,
      domainBreakdown,
      avgTimePerQuestion,
      flaggedSummary: { count: flaggedIds.length, questionIds: flaggedIds },
      comparison,
      passPrediction: score >= 65 ? "likely_pass" : "needs_improvement",
      finalizedAt: new Date().toISOString(),
      finalizationTimeMs: Date.now() - startTime,
    };

    await pool.query(
      `UPDATE mock_exam_attempts
       SET status = 'completed',
           report = $1,
           score = $2,
           completed_at = NOW(),
           review_unlocked = true
       WHERE id = $3 AND status = 'processing'`,
      [JSON.stringify(enhancedReport), score, attemptId]
    );

    console.log(`[ExamFinalization] Completed attempt=${attemptId} score=${score} time=${Date.now() - startTime}ms`);

    try {
      const { logCriticalError } = await import("./backend-resilience");
    } catch {}

    return { success: true, score, report: enhancedReport };
  } catch (e: any) {
    console.error(`[ExamFinalization] Failed attempt=${attemptId}: ${e.message}`);

    try {
      await pool.query(
        `UPDATE mock_exam_attempts SET status = 'failed' WHERE id = $1 AND status = 'processing'`,
        [attemptId]
      );
    } catch {}

    return { success: false, score: 0, report: null, error: e.message };
  }
}

export async function retryFailedFinalization(attemptId: string, userId: string): Promise<FinalizationResult> {
  const check = await pool.query(
    `SELECT status FROM mock_exam_attempts WHERE id = $1 AND user_id = $2`,
    [attemptId, userId]
  );

  if (check.rows.length === 0) {
    return { success: false, score: 0, report: null, error: "Attempt not found" };
  }

  const status = check.rows[0].status;
  if (status === "completed") {
    const full = await pool.query(
      `SELECT score, report FROM mock_exam_attempts WHERE id = $1`,
      [attemptId]
    );
    return { success: true, score: full.rows[0]?.score || 0, report: full.rows[0]?.report || {} };
  }

  if (status === "failed" || status === "completion_requested") {
    await pool.query(
      `UPDATE mock_exam_attempts SET status = 'completion_requested' WHERE id = $1`,
      [attemptId]
    );
    return finalizeExamAttempt(attemptId, userId);
  }

  return { success: false, score: 0, report: null, error: `Cannot retry from status: ${status}` };
}

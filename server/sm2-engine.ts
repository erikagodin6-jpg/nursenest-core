import { pool } from "./storage";
import crypto from "crypto";
import { checkAiLimits, recordAiUsage } from "./ai-safety";
import { emitStructuredLog } from "./log-sink";

export type SM2Rating = "again" | "hard" | "good" | "easy";
export type SM2CardState = "new" | "learning" | "review" | "mastered";

export interface SM2ReviewInput {
  userId: string;
  cardId: string;
  deckId?: string;
  rating: SM2Rating;
  responseTimeMs?: number;
}

export interface SM2ReviewResult {
  cardState: SM2CardState;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
}

const SM2_INTERVALS: Record<SM2Rating, number[]> = {
  again: [0.007],
  hard: [0.042, 1, 3],
  good: [0.042, 1, 3, 7, 14, 30],
  easy: [1, 3, 7, 14, 30, 60],
};

const RATING_QUALITY: Record<SM2Rating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

function computeEaseFactor(oldEF: number, quality: number): number {
  const newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(1.3, newEF);
}

function computeInterval(repetitions: number, easeFactor: number, rating: SM2Rating): number {
  if (rating === "again") return 0.007;

  if (repetitions <= 1) return 1;
  if (repetitions === 2) return 6;

  const intervals = SM2_INTERVALS[rating];
  if (repetitions < intervals.length) return intervals[repetitions];

  const baseInterval = intervals[intervals.length - 1];
  const multiplier = rating === "easy" ? easeFactor * 1.3 : easeFactor;
  return Math.min(
    Math.round(baseInterval * Math.pow(multiplier, repetitions - intervals.length + 1)),
    180
  );
}

function computeCardState(repetitions: number, interval: number, rating: SM2Rating): SM2CardState {
  if (rating === "again") return "learning";
  if (repetitions <= 1) return "learning";
  if (interval >= 21 && repetitions >= 5) return "mastered";
  return "review";
}

export async function processSM2Review(input: SM2ReviewInput): Promise<SM2ReviewResult> {
  const existing = await pool.query(
    `SELECT * FROM spaced_repetition_cards WHERE user_id = $1 AND card_id = $2`,
    [input.userId, input.cardId]
  );

  let oldEF = 2.5;
  let oldReps = 0;

  if (existing.rows.length > 0) {
    const row = existing.rows[0];
    oldEF = row.ease_factor || 2.5;
    oldReps = row.repetitions || 0;
  }

  const quality = RATING_QUALITY[input.rating];
  const newEF = computeEaseFactor(oldEF, quality);
  const newReps = input.rating === "again" ? 0 : oldReps + 1;
  const newInterval = computeInterval(newReps, newEF, input.rating);
  const cardState = computeCardState(newReps, newInterval, input.rating);

  const nextReviewAt = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

  if (existing.rows.length > 0) {
    await pool.query(
      `UPDATE spaced_repetition_cards SET
        ease_factor = $1, interval = $2, repetitions = $3,
        next_review_at = $4, last_reviewed_at = NOW(), status = $5, updated_at = NOW()
       WHERE user_id = $6 AND card_id = $7`,
      [
        newEF,
        Math.round(newInterval * 100) / 100,
        newReps,
        nextReviewAt,
        cardState,
        input.userId,
        input.cardId,
      ]
    );
  } else {
    await pool.query(
      `INSERT INTO spaced_repetition_cards (id, user_id, card_id, deck_id, ease_factor, interval, repetitions, next_review_at, last_reviewed_at, status, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), $8, NOW())`,
      [
        input.userId,
        input.cardId,
        input.deckId || null,
        newEF,
        Math.round(newInterval * 100) / 100,
        newReps,
        nextReviewAt,
        cardState,
      ]
    );
  }

  await pool.query(
    `INSERT INTO flashcard_reviews (id, user_id, card_id, deck_id, response, interval, ease_factor, repetitions, confidence, next_review_date, reviewed_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
    [
      input.userId,
      input.cardId,
      input.deckId || "default",
      input.rating,
      Math.round(newInterval * 100) / 100,
      newEF,
      newReps,
      input.rating === "easy" ? "confident" : input.rating === "good" ? "unsure" : "guess",
      nextReviewAt.toISOString(),
    ]
  );

  const isCorrect = input.rating !== "again";
  const confMap: Record<SM2Rating, string> = {
    again: "guess",
    hard: "unsure",
    good: "unsure",
    easy: "confident",
  };

  const { recordCardResponse } = await import("./adaptive-engine");
  await recordCardResponse({
    userId: input.userId,
    cardId: input.cardId,
    isCorrect,
    confidence: confMap[input.rating] as any,
    timeSpent: input.responseTimeMs ? Math.round(input.responseTimeMs / 1000) : undefined,
    studyMode: "spaced",
  });

  return {
    cardState,
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewAt,
  };
}

export async function getCardsDueForReview(userId: string, limit = 20): Promise<any[]> {
  const result = await pool.query(
    `SELECT src.card_id, src.ease_factor, src.interval, src.repetitions, src.status as sr_status, src.next_review_at,
            fb.front, fb.back, fb.tier, fb.topic, fb.subtopic, fb.body_system, fb.difficulty,
            fb.question_type, fb.options, fb.correct_answer, fb.rationale_correct,
            fb.clinical_takeaway, fb.exam_pearl, fb.category, fb.rationale_media, fb.lesson_links
     FROM spaced_repetition_cards src
     JOIN flashcard_bank fb ON fb.id = src.card_id
     WHERE src.user_id = $1 AND src.next_review_at <= NOW() AND fb.status = 'published'
     ORDER BY src.next_review_at ASC
     LIMIT $2`,
    [userId, limit]
  );

  return result.rows.map(snakeToCamel);
}

export async function getSM2Dashboard(userId: string): Promise<{
  cardsDueToday: number;
  cardsLearned: number;
  streakDays: number;
  masteryPercentage: number;
  totalCards: number;
  byState: Record<SM2CardState, number>;
  reviewsToday: number;
  averageEaseFactor: number;
}> {
  const [dueResult, stateResult, reviewsTodayResult, streakResult] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) as cnt FROM spaced_repetition_cards WHERE user_id = $1 AND next_review_at <= NOW()`,
      [userId]
    ),
    pool.query(
      `SELECT status, COUNT(*) as cnt FROM spaced_repetition_cards WHERE user_id = $1 GROUP BY status`,
      [userId]
    ),
    pool.query(
      `SELECT COUNT(*) as cnt FROM flashcard_reviews WHERE user_id = $1 AND reviewed_at >= CURRENT_DATE`,
      [userId]
    ),
    pool.query(
      `SELECT DISTINCT DATE(reviewed_at) as d FROM flashcard_reviews WHERE user_id = $1 ORDER BY d DESC LIMIT 60`,
      [userId]
    ),
  ]);

  const byState: Record<SM2CardState, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
  let totalCards = 0;
  let masteredCount = 0;

  for (const row of stateResult.rows) {
    const state = (row.status || "new") as SM2CardState;
    const count = parseInt(row.cnt);
    if (Object.prototype.hasOwnProperty.call(byState, state)) {
      byState[state] = count;
    }
    totalCards += count;
    if (state === "mastered") masteredCount = count;
  }

  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const row of streakResult.rows) {
    const d = new Date(row.d);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === streakDays) streakDays++;
    else break;
  }

  return {
    cardsDueToday: parseInt(dueResult.rows[0]?.cnt || "0"),
    cardsLearned: totalCards,
    streakDays,
    masteryPercentage: totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0,
    totalCards,
    byState,
    reviewsToday: parseInt(reviewsTodayResult.rows[0]?.cnt || "0"),
    averageEaseFactor: 2.5,
  };
}

export async function getFlashcardAnalytics(userId: string): Promise<{
  reviewFrequency: { date: string; count: number }[];
  difficultyDistribution: { rating: string; count: number }[];
  retentionRate: { week: string; retention: number }[];
  topicMastery: { topic: string; mastered: number; total: number; percentage: number }[];
}> {
  const [freqResult, diffResult, retentionResult, topicResult] = await Promise.all([
    pool.query(
      `SELECT DATE(reviewed_at) as date, COUNT(*) as cnt
       FROM flashcard_reviews WHERE user_id = $1 AND reviewed_at > NOW() - INTERVAL '30 days'
       GROUP BY DATE(reviewed_at) ORDER BY date`,
      [userId]
    ),
    pool.query(
      `SELECT response as rating, COUNT(*) as cnt
       FROM flashcard_reviews WHERE user_id = $1
       GROUP BY response ORDER BY cnt DESC`,
      [userId]
    ),
    pool.query(
      `SELECT DATE_TRUNC('week', reviewed_at) as week,
              ROUND(100.0 * SUM(CASE WHEN response IN ('good', 'easy') THEN 1 ELSE 0 END) / COUNT(*), 1) as retention
       FROM flashcard_reviews WHERE user_id = $1 AND reviewed_at > NOW() - INTERVAL '12 weeks'
       GROUP BY DATE_TRUNC('week', reviewed_at) ORDER BY week`,
      [userId]
    ),
    pool.query(
      `SELECT fb.topic,
              SUM(CASE WHEN src.status = 'mastered' THEN 1 ELSE 0 END) as mastered,
              COUNT(*) as total
       FROM spaced_repetition_cards src
       JOIN flashcard_bank fb ON fb.id = src.card_id
       WHERE src.user_id = $1 AND fb.topic IS NOT NULL
       GROUP BY fb.topic ORDER BY total DESC`,
      [userId]
    ),
  ]);

  return {
    reviewFrequency: freqResult.rows.map((r: any) => ({
      date: r.date,
      count: parseInt(r.cnt),
    })),
    difficultyDistribution: diffResult.rows.map((r: any) => ({
      rating: r.rating,
      count: parseInt(r.cnt),
    })),
    retentionRate: retentionResult.rows.map((r: any) => ({
      week: r.week,
      retention: parseFloat(r.retention || "0"),
    })),
    topicMastery: topicResult.rows.map((r: any) => {
      const total = parseInt(r.total);
      const mastered = parseInt(r.mastered);
      return {
        topic: r.topic,
        mastered,
        total,
        percentage: total > 0 ? Math.round((mastered / total) * 100) : 0,
      };
    }),
  };
}

export async function getAdminFlashcardAnalytics(): Promise<{
  totalCards: number;
  totalReviews: number;
  activeUsers: number;
  duplicateCount: number;
  lowQualityCount: number;
  generationStats: { source: string; count: number }[];
  stateDistribution: { state: string; count: number }[];
}> {
  const [totalResult, reviewResult, usersResult, dupResult, lowQResult, genResult, stateResult] = await Promise.all([
    pool.query(`SELECT COUNT(*) as cnt FROM flashcard_bank WHERE status IN ('published', 'approved')`),
    pool.query(`SELECT COUNT(*) as cnt FROM flashcard_reviews`),
    pool.query(`SELECT COUNT(DISTINCT user_id) as cnt FROM flashcard_reviews`),
    pool.query(
      `SELECT COUNT(*) as cnt FROM (
        SELECT content_hash FROM flashcard_bank WHERE content_hash IS NOT NULL
        GROUP BY content_hash HAVING COUNT(*) > 1
      ) dupes`
    ),
    pool.query(
      `SELECT COUNT(*) as cnt FROM flashcard_bank
       WHERE status IN ('published', 'approved')
       AND (LENGTH(front) < 10 OR LENGTH(back) < 10)`
    ),
    pool.query(
      `SELECT COALESCE(source_type, 'manual') as source, COUNT(*) as cnt
       FROM flashcard_bank GROUP BY source_type ORDER BY cnt DESC`
    ),
    pool.query(
      `SELECT status, COUNT(*) as cnt FROM spaced_repetition_cards GROUP BY status`
    ),
  ]);

  return {
    totalCards: parseInt(totalResult.rows[0]?.cnt || "0"),
    totalReviews: parseInt(reviewResult.rows[0]?.cnt || "0"),
    activeUsers: parseInt(usersResult.rows[0]?.cnt || "0"),
    duplicateCount: parseInt(dupResult.rows[0]?.cnt || "0"),
    lowQualityCount: parseInt(lowQResult.rows[0]?.cnt || "0"),
    generationStats: genResult.rows.map((r: any) => ({
      source: r.source,
      count: parseInt(r.cnt),
    })),
    stateDistribution: stateResult.rows.map((r: any) => ({
      state: r.status,
      count: parseInt(r.cnt),
    })),
  };
}

export async function detectDuplicates(): Promise<{ hash: string; count: number; ids: string[] }[]> {
  const result = await pool.query(
    `SELECT content_hash, COUNT(*) as cnt, array_agg(id) as ids
     FROM flashcard_bank WHERE content_hash IS NOT NULL
     GROUP BY content_hash HAVING COUNT(*) > 1
     ORDER BY cnt DESC LIMIT 50`
  );

  return result.rows.map((r: any) => ({
    hash: r.content_hash,
    count: parseInt(r.cnt),
    ids: r.ids,
  }));
}

export async function flagLowQualityCards(): Promise<number> {
  const result = await pool.query(
    `UPDATE flashcard_bank SET status = 'needs_review', quality_feedback = jsonb_build_object('reason', 'auto_flagged_low_quality', 'flaggedAt', NOW()::text)
     WHERE status IN ('published', 'approved', 'draft')
     AND (LENGTH(front) < 10 OR LENGTH(back) < 10 OR front = back)
     AND (quality_feedback IS NULL OR quality_feedback->>'reason' != 'auto_flagged_low_quality')`
  );
  return result.rowCount || 0;
}

export async function bulkGenerateFromContent(
  sourceType: "study_guides" | "question_explanations" | "topic_summaries",
  tier: string,
  limit = 50
): Promise<{ generated: number; skipped: number }> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  let sourceQuery: string;
  if (sourceType === "question_explanations") {
    sourceQuery = `SELECT id, stem as content, rationale as extra, topic, subtopic, body_system, difficulty
                   FROM exam_questions WHERE tier = $1 AND status = 'published'
                   AND id NOT IN (SELECT source_question_id FROM flashcard_bank WHERE source_question_id IS NOT NULL)
                   ORDER BY RANDOM() LIMIT $2`;
  } else {
    sourceQuery = `SELECT id, title as content, description as extra, topic_tag as topic, NULL as subtopic, NULL as body_system, 3 as difficulty
                   FROM content_items WHERE tier = $1 AND status = 'published'
                   ORDER BY RANDOM() LIMIT $2`;
  }

  const sources = await pool.query(sourceQuery, [tier, limit]);
  let generated = 0;
  let skipped = 0;

  for (const source of sources.rows) {
    try {
      const prompt = `Generate a flashcard from this nursing content. Return JSON with "front" (question/term, max 200 chars), "back" (answer/definition, max 500 chars), "clinicalPearl" (optional mnemonic or clinical tip), "examPearl" (optional exam strategy tip).

Content: ${source.content}
${source.extra ? `Additional context: ${source.extra}` : ""}`;

      const check = await checkAiLimits({ userId: "system_flashcard_generator" });
      if (!check.allowed) {
        throw new Error(`AI limit reached: ${check.reason}`);
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const tokensUsed =
        completion.usage?.total_tokens ||
        Math.ceil((completion.choices?.[0]?.message?.content?.length || 200) / 4);

      await recordAiUsage(1, tokensUsed, {
        userId: "system_flashcard_generator",
        endpoint: "flashcard-generation",
      }).catch((err: unknown) => {
        emitStructuredLog(
          {
            level: "error",
            type: "ai_usage_record_failed",
            provider: "openai",
            route: "sm2-engine",
            job: "flashcard-generation",
            userId: "system_flashcard_generator",
            msg: err instanceof Error ? err.message : String(err),
          },
          "error",
        );
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      if (!parsed.front || !parsed.back) {
        skipped++;
        continue;
      }

      const contentHash = crypto
        .createHash("sha256")
        .update((parsed.front + parsed.back).toLowerCase().trim())
        .digest("hex");

      const dupCheck = await pool.query(
        `SELECT id FROM flashcard_bank WHERE content_hash = $1`,
        [contentHash]
      );
      if (dupCheck.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO flashcard_bank (id, tier, front, back, topic, subtopic, body_system, difficulty, source_type, source_question_id, content_hash, clinical_takeaway, exam_pearl, status, flashcard_enabled, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'needs_review', false, NOW(), NOW())`,
        [
          tier,
          parsed.front,
          parsed.back,
          source.topic || null,
          source.subtopic || null,
          source.body_system || null,
          source.difficulty || 3,
          `ai_${sourceType}`,
          source.id,
          contentHash,
          parsed.clinicalPearl || null,
          parsed.examPearl || null,
        ]
      );

      generated++;
    } catch {
      skipped++;
    }
  }

  return { generated, skipped };
}

function snakeToCamel(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);

  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

export const ACTIVE_BUILD_PRIORITY = "SMART_FLASHCARD_ENGINE";

export const CONTENT_EXPANSION_ROADMAP = [
  { rank: 1, name: "Exam Readiness Predictor", status: "planned" },
  { rank: 2, name: "AI Tutoring Assistant", status: "planned" },
  { rank: 3, name: "Student Leaderboards", status: "planned" },
  { rank: 4, name: "Benchmark Performance", status: "planned" },
];
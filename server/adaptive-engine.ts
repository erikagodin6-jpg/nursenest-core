import { pool } from "./storage";
import { shuffleOptions } from "../shared/shuffle";

/* =========================
   CONSTANTS
========================= */

const CONFIDENCE_MULTIPLIER = {
  confident: 1,
  unsure: 0.6,
  guess: 0.3,
};

const DEFAULT_CONFIG = {
  weights: {
    weakTopic: 4,
    incorrect: 5,
    lowConfidence: 4,
    flagged: 3,
    notSeen: 2,
    masteredPenalty: -5,
    streakPenalty: -4,
  },
  intervals: {
    incorrect: 1,
    unsure: 3,
    confident: 10,
    mastered: 30,
  },
};

/* =========================
   HELPERS
========================= */

function toCamel(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((x) => toCamel(x));

  return Object.fromEntries(
    Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
      v,
    ])
  );
}

function allowedFlashcardTiers(userTier: string): string[] {
  const tiers = new Set<string>(["free"]);
  if (userTier === "rpn" || userTier === "rn" || userTier === "np" || userTier === "admin") {
    tiers.add(userTier);
    if (userTier === "admin") {
      tiers.add("rpn");
      tiers.add("rn");
      tiers.add("np");
    }
  }
  return [...tiers];
}

/* =========================
   CONFIG
========================= */

async function getConfig() {
  try {
    const r = await pool.query(`SELECT * FROM adaptive_config WHERE config_key='default'`);
    if (!r.rows[0]) return DEFAULT_CONFIG;

    return {
      weights: {
        weakTopic: r.rows[0].weak_topic_weight ?? 4,
        incorrect: r.rows[0].incorrect_history_weight ?? 5,
        lowConfidence: r.rows[0].low_confidence_weight ?? 4,
        flagged: r.rows[0].flagged_weight ?? 3,
        notSeen: r.rows[0].not_seen_weight ?? 2,
        masteredPenalty: r.rows[0].mastered_penalty ?? -5,
        streakPenalty: r.rows[0].correct_streak_penalty ?? -4,
      },
      intervals: {
        incorrect: r.rows[0].interval_incorrect ?? 1,
        unsure: r.rows[0].interval_unsure ?? 3,
        confident: r.rows[0].interval_confident ?? 10,
        mastered: r.rows[0].interval_mastered ?? 30,
      },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

/* =========================
   PRIORITY ENGINE
========================= */

function calculatePriority(card: Record<string, unknown>, weights: typeof DEFAULT_CONFIG.weights, weakTopics: Set<string>) {
  let score = 0;
  const topic = card.topic as string | undefined;

  if (topic && weakTopics.has(topic)) score += weights.weakTopic;
  if ((card._incorrect_count as number) > 0) score += weights.incorrect;
  if ((card._avg_confidence as number) < 0.5) score += weights.lowConfidence;
  if (card._flagged) score += weights.flagged;

  if (!card._last_seen_at) score += weights.notSeen;

  if (card._mastered) score += weights.masteredPenalty;
  if ((card._streak_correct as number) >= 3) score += weights.streakPenalty;

  return score;
}

/* =========================
   CORE: GET NEXT CARDS
========================= */

export async function getNextCards(
  userId: string,
  tier: string,
  _mode?: string,
  limit = 20,
  filters?: {
    topic?: string;
    bodySystem?: string;
    difficulty?: number;
    blueprintCategory?: string;
    questionType?: string;
    flaggedOnly?: boolean;
    missedOnly?: boolean;
  }
) {
  const config = await getConfig();
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const tiers = allowedFlashcardTiers(tier);
  const fetchLimit = safeLimit * 3;

  const extra: string[] = [];
  const params: unknown[] = [userId, tiers, fetchLimit];
  let p = 4;

  if (filters?.topic) {
    extra.push(`fb.topic = $${p++}`);
    params.push(filters.topic);
  }
  if (filters?.bodySystem) {
    extra.push(`fb.body_system = $${p++}`);
    params.push(filters.bodySystem);
  }
  if (filters?.difficulty != null) {
    extra.push(`fb.difficulty = $${p++}`);
    params.push(filters.difficulty);
  }
  if (filters?.flaggedOnly) {
    extra.push(`COALESCE(ucs.flagged,false) = true`);
  }
  if (filters?.missedOnly) {
    extra.push(`COALESCE(ucs.times_incorrect,0) > 0`);
  }

  const whereExtra = extra.length ? ` AND ${extra.join(" AND ")}` : "";

  const [cardsRes, weakTopicsRes] = await Promise.all([
    pool.query(
      `
      SELECT fb.*, 
        COALESCE(ucs.times_incorrect,0) _incorrect_count,
        COALESCE(ucs.flagged,false) _flagged,
        COALESCE(ucs.mastered,false) _mastered,
        COALESCE(ucs.streak_correct,0) _streak_correct,
        ucs.last_seen_at _last_seen_at,
        COALESCE(
          CASE ucs.confidence_rating
            WHEN 'confident' THEN 1
            WHEN 'unsure' THEN 0.6
            ELSE 0.3
          END, 0.5
        ) _avg_confidence
      FROM flashcard_bank fb
      LEFT JOIN user_card_stats ucs 
        ON ucs.card_id = fb.id AND ucs.user_id = $1
      WHERE fb.status='published' AND fb.tier = ANY($2::text[])
      ${whereExtra}
      ORDER BY RANDOM()
      LIMIT $3
    `,
      params
    ),

    pool.query(
      `
      SELECT topic FROM user_mastery_profiles
      WHERE user_id=$1 AND mastery_level < 0.6
    `,
      [userId]
    ),
  ]);

  const weakTopics = new Set(weakTopicsRes.rows.map((r: { topic: string }) => r.topic).filter(Boolean));

  const cards = cardsRes.rows as Record<string, unknown>[];

  cards.forEach((c) => {
    c._priority = calculatePriority(c, config.weights, weakTopics);
  });

  cards.sort((a, b) => (b._priority as number) - (a._priority as number));

  return cards.slice(0, safeLimit).map((card) => {
    const clean = toCamel(card) as Record<string, unknown>;

    if (clean.options && clean.correctAnswer !== undefined) {
      const { shuffledOptions, newCorrectIndex } = shuffleOptions(
        clean.options as string[],
        clean.correctAnswer as number
      );
      clean.options = shuffledOptions;
      clean.correctAnswer = newCorrectIndex;
    }

    return clean;
  });
}

/* =========================
   RECORD RESPONSE
========================= */

export interface RecordCardResponseInput {
  userId: string;
  cardId: string;
  isCorrect: boolean;
  confidence: string;
  selectedOption?: number;
  timeSpent?: number;
  studyMode?: string;
  sessionId?: string;
}

export async function recordCardResponse({
  userId,
  cardId,
  isCorrect,
  confidence,
  selectedOption,
  timeSpent,
  studyMode,
}: RecordCardResponseInput) {
  const config = await getConfig();
  const intervalKey =
    confidence === "confident" ? "confident" : confidence === "unsure" ? "unsure" : "incorrect";
  const intervalDays = Number(isCorrect ? config.intervals[intervalKey] : config.intervals.incorrect) || 1;

  await pool.query(
    `INSERT INTO user_card_responses 
     (id,user_id,card_id,is_correct,confidence,selected_option,time_spent,study_mode,reviewed_at)
     VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,NOW())`,
    [userId, cardId, isCorrect, confidence, selectedOption ?? null, timeSpent ?? null, studyMode ?? "learn"]
  );

  const correctInc = isCorrect ? 1 : 0;
  const incorrectInc = isCorrect ? 0 : 1;

  const upd = await pool.query(
    `UPDATE user_card_stats SET
       times_seen = times_seen + 1,
       times_correct = times_correct + $3,
       times_incorrect = times_incorrect + $4,
       last_seen_at = NOW(),
       last_answered_at = NOW(),
       confidence_rating = $5,
       streak_correct = CASE WHEN $3 = 1 THEN streak_correct + 1 ELSE 0 END,
       streak_incorrect = CASE WHEN $4 = 1 THEN streak_incorrect + 1 ELSE 0 END,
       mastery_state = CASE
         WHEN mastered THEN 'mastered'
         WHEN (times_correct + $3) >= 3 AND (times_correct + $3)::float / GREATEST(times_seen + 1, 1) >= 0.75 THEN 'strong'
         WHEN times_seen + 1 >= 2 THEN 'learning'
         ELSE 'new'
       END,
       next_review_at = NOW() + ($6::double precision * INTERVAL '1 day'),
       updated_at = NOW()
     WHERE user_id = $1 AND card_id = $2
     RETURNING mastery_state, next_review_at`,
    [userId, cardId, correctInc, incorrectInc, confidence, intervalDays]
  );

  let row = upd.rows[0] as { mastery_state: string; next_review_at: Date | null } | undefined;
  if (!row) {
    const ins = await pool.query(
      `INSERT INTO user_card_stats (
         id, user_id, card_id, times_seen, times_correct, times_incorrect,
         last_seen_at, last_answered_at, confidence_rating,
         streak_correct, streak_incorrect, mastery_state, next_review_at, updated_at
       ) VALUES (
         gen_random_uuid(), $1, $2, 1, $3, $4, NOW(), NOW(), $5, $6, $7, $8,
         NOW() + ($9::double precision * INTERVAL '1 day'), NOW()
       )
       RETURNING mastery_state, next_review_at`,
      [
        userId,
        cardId,
        correctInc,
        incorrectInc,
        confidence,
        isCorrect ? 1 : 0,
        isCorrect ? 0 : 1,
        isCorrect ? "learning" : "new",
        intervalDays,
      ]
    );
    row = ins.rows[0] as { mastery_state: string; next_review_at: Date | null };
  }

  return {
    success: true as const,
    masteryState: row?.mastery_state ?? "new",
    nextReviewAt: row?.next_review_at ?? null,
  };
}

/* =========================
   MASTERY & DASHBOARD
========================= */

export async function getMasteryProfile(userId: string) {
  const r = await pool.query(
    `SELECT * FROM user_mastery_profiles WHERE user_id = $1 ORDER BY mastery_level ASC`,
    [userId]
  );
  return { profiles: r.rows.map(toCamel) };
}

export async function getWeakAreas(userId: string) {
  const r = await pool.query(
    `SELECT topic, subtopic, mastery_level, total_attempts, correct_count
     FROM user_mastery_profiles
     WHERE user_id = $1 AND mastery_level < 0.6
     ORDER BY mastery_level ASC`,
    [userId]
  );
  return { areas: r.rows.map(toCamel) };
}

export async function getDashboard(userId: string) {
  const [stats, profiles] = await Promise.all([
    pool.query(
      `SELECT 
         COUNT(*)::int AS total_cards_touched,
         SUM(times_correct)::int AS total_correct,
         SUM(times_incorrect)::int AS total_incorrect,
         SUM(CASE WHEN flagged THEN 1 ELSE 0 END)::int AS flagged_count,
         SUM(CASE WHEN mastered THEN 1 ELSE 0 END)::int AS mastered_count
       FROM user_card_stats WHERE user_id = $1`,
      [userId]
    ),
    pool.query(
      `SELECT COUNT(*)::int AS weak_topics FROM user_mastery_profiles WHERE user_id = $1 AND mastery_level < 0.6`,
      [userId]
    ),
  ]);
  return {
    summary: toCamel(stats.rows[0] || {}),
    weakTopicCount: profiles.rows[0]?.weak_topics ?? 0,
  };
}

export async function getSessionTypes() {
  return {
    types: [
      { id: "recommended", label: "Recommended", description: "Balanced mix based on your history" },
      { id: "learn", label: "Learn", description: "Focus on new and weak cards" },
      { id: "test", label: "Test", description: "Simulated exam-style review" },
      { id: "rapid-review", label: "Rapid review", description: "Quick refresher" },
      { id: "weak-areas", label: "Weak areas", description: "Target low mastery topics" },
    ],
  };
}

export async function createStudySession(userId: string, sessionType: string, tier?: string) {
  const r = await pool.query(
    `INSERT INTO study_session_stats (id, user_id, session_type, tier, started_at)
     VALUES (gen_random_uuid(), $1, $2, $3, NOW())
     RETURNING id`,
    [userId, sessionType || "recommended", tier ?? null]
  );
  return r.rows[0]?.id as string;
}

export async function completeStudySession(
  sessionId: string,
  payload: {
    accuracy: number;
    topics: unknown[];
    duration: number;
    cardsReviewed: number;
    weakCards: number;
    masteryChanges: unknown[];
  }
) {
  await pool.query(
    `UPDATE study_session_stats SET
       session_accuracy = $2,
       session_topics = $3::jsonb,
       session_duration = $4,
       cards_reviewed = $5,
       weak_cards_encountered = $6,
       mastery_changes = $7::jsonb,
       completed_at = NOW()
     WHERE id = $1`,
    [
      sessionId,
      payload.accuracy,
      JSON.stringify(payload.topics || []),
      payload.duration,
      payload.cardsReviewed,
      payload.weakCards,
      JSON.stringify(payload.masteryChanges || []),
    ]
  );
}

export async function flagCard(userId: string, cardId: string, flagged: boolean) {
  await pool.query(
    `UPDATE user_card_stats SET flagged = $3, updated_at = NOW() WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId, flagged]
  );
}

export async function markCardMastered(userId: string, cardId: string, mastered: boolean) {
  await pool.query(
    `UPDATE user_card_stats SET mastered = $3, mastery_state = CASE WHEN $3 THEN 'mastered' ELSE mastery_state END, updated_at = NOW()
     WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId, mastered]
  );
}

export async function requestStudyAgainSoon(userId: string, cardId: string) {
  await pool.query(
    `UPDATE user_card_stats SET next_review_at = NOW() + INTERVAL '4 hours', updated_at = NOW()
     WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId]
  );
}

export async function getCardStats(userId: string, cardId: string) {
  const r = await pool.query(`SELECT * FROM user_card_stats WHERE user_id = $1 AND card_id = $2`, [userId, cardId]);
  if (!r.rows[0]) return null;
  return toCamel(r.rows[0]);
}

export async function getAdminAnalytics() {
  const [users, responses, flagged] = await Promise.all([
    pool.query(`SELECT COUNT(DISTINCT user_id)::int AS c FROM user_card_stats`),
    pool.query(`SELECT COUNT(*)::int AS c FROM user_card_responses WHERE reviewed_at > NOW() - INTERVAL '7 days'`),
    pool.query(`SELECT COUNT(*)::int AS c FROM user_card_stats WHERE flagged = true`),
  ]);
  return {
    usersWithStats: users.rows[0]?.c ?? 0,
    responsesLast7Days: responses.rows[0]?.c ?? 0,
    flaggedCards: flagged.rows[0]?.c ?? 0,
  };
}

export async function getAdaptiveConfigData() {
  const r = await pool.query(`SELECT * FROM adaptive_config WHERE config_key = 'default' LIMIT 1`);
  return r.rows[0] ? toCamel(r.rows[0]) : toCamel(DEFAULT_CONFIG);
}

export async function updateAdaptiveConfig(body: Record<string, unknown>) {
  const allowed = [
    "weakTopicWeight",
    "incorrectHistoryWeight",
    "lowConfidenceWeight",
    "flaggedWeight",
    "notSeenWeight",
    "masteredPenalty",
    "correctStreakPenalty",
    "intervalIncorrect",
    "intervalUnsure",
    "intervalConfident",
    "intervalMastered",
  ] as const;

  const snakeMap: Record<string, string> = {
    weakTopicWeight: "weak_topic_weight",
    incorrectHistoryWeight: "incorrect_history_weight",
    lowConfidenceWeight: "low_confidence_weight",
    flaggedWeight: "flagged_weight",
    notSeenWeight: "not_seen_weight",
    masteredPenalty: "mastered_penalty",
    correctStreakPenalty: "correct_streak_penalty",
    intervalIncorrect: "interval_incorrect",
    intervalUnsure: "interval_unsure",
    intervalConfident: "interval_confident",
    intervalMastered: "interval_mastered",
  };

  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  for (const key of allowed) {
    if (body[key] !== undefined) {
      sets.push(`${snakeMap[key]} = $${i++}`);
      vals.push(body[key]);
    }
  }
  if (sets.length === 0) {
    return getAdaptiveConfigData();
  }
  vals.push("default");
  await pool.query(
    `UPDATE adaptive_config SET ${sets.join(", ")}, updated_at = NOW() WHERE config_key = $${i}`,
    vals
  );
  return getAdaptiveConfigData();
}

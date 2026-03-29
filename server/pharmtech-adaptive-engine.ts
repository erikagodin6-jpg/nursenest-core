import { pool } from "./storage";

const DIFFICULTY_LABELS: Record<number, string> = { 1: "easy", 2: "easy", 3: "medium", 4: "hard", 5: "hard" };
const ANSWER_LETTERS = ["A", "B", "C", "D"];
const MASTERY_THRESHOLDS = { beginner: 50, developing: 70, proficient: 85 };

export function getMasteryLevel(accuracy: number): string {
  if (accuracy >= MASTERY_THRESHOLDS.proficient) return "Advanced";
  if (accuracy >= MASTERY_THRESHOLDS.developing) return "Proficient";
  if (accuracy >= MASTERY_THRESHOLDS.beginner) return "Developing";
  return "Beginner";
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

export function transformPharmtechQuestion(row: any): any {
  const options = row.options || [];
  return {
    id: row.id,
    question: row.stem || "",
    optionA: typeof options[0] === "string" ? options[0] : options[0]?.text || "",
    optionB: typeof options[1] === "string" ? options[1] : options[1]?.text || "",
    optionC: typeof options[2] === "string" ? options[2] : options[2]?.text || "",
    optionD: typeof options[3] === "string" ? options[3] : options[3]?.text || "",
    category: row.category || "General",
    difficulty: DIFFICULTY_LABELS[row.difficulty] || "medium",
    difficultyNum: row.difficulty || 3,
    correctAnswer: ANSWER_LETTERS[row.correct_index] || "A",
    rationale: row.rationale || "",
    lessonSlug: row.lesson_slug || null,
    certContext: row.cert_context || "PTCB",
  };
}

export function selectNextDifficulty(currentDifficulty: number, isCorrect: boolean): number {
  if (isCorrect) {
    return Math.min(5, currentDifficulty + 1);
  } else {
    return Math.max(1, currentDifficulty - 1);
  }
}

export async function getAdaptiveQuestion(
  sessionId: string,
  currentDifficulty: number,
  usedIds: string[],
  weakCategories: string[],
  categoryWeights: Record<string, number> | null,
  certContext?: string
): Promise<any | null> {
  const params: any[] = [];
  let idx = 1;

  let diffRange = [
    Math.max(1, currentDifficulty - 1),
    currentDifficulty,
    Math.min(5, currentDifficulty + 1),
  ];

  let query = `SELECT * FROM pharmtech_questions WHERE published = true AND difficulty = ANY($${idx})`;
  params.push(diffRange);
  idx++;

  if (certContext) {
    query += ` AND cert_context IN ($${idx}, 'BOTH')`;
    params.push(certContext);
    idx++;
  }

  if (usedIds.length > 0) {
    query += ` AND id != ALL($${idx})`;
    params.push(usedIds);
    idx++;
  }

  if (weakCategories.length > 0 && Math.random() < 0.6) {
    query += ` AND category = ANY($${idx})`;
    params.push(weakCategories);
    idx++;
  }

  query += ` ORDER BY RANDOM() LIMIT 1`;

  let result = await pool.query(query, params);

  if (result.rows.length === 0 && weakCategories.length > 0) {
    let fallbackQuery = `SELECT * FROM pharmtech_questions WHERE published = true`;
    const fallbackParams: any[] = [];
    let fIdx = 1;

    if (certContext) {
      fallbackQuery += ` AND cert_context IN ($${fIdx}, 'BOTH')`;
      fallbackParams.push(certContext);
      fIdx++;
    }

    if (usedIds.length > 0) {
      fallbackQuery += ` AND id != ALL($${fIdx})`;
      fallbackParams.push(usedIds);
      fIdx++;
    }

    fallbackQuery += ` ORDER BY RANDOM() LIMIT 1`;
    result = await pool.query(fallbackQuery, fallbackParams);
  }

  if (result.rows.length === 0) return null;

  return transformPharmtechQuestion(result.rows[0]);
}

export function computeCategoryStats(responses: any[]): Record<string, { total: number; correct: number; accuracy: number }> {
  const stats: Record<string, { total: number; correct: number; accuracy: number }> = {};
  for (const r of responses) {
    if (!stats[r.category]) stats[r.category] = { total: 0, correct: 0, accuracy: 0 };
    stats[r.category].total++;
    if (r.isCorrect) stats[r.category].correct++;
  }
  for (const cat of Object.keys(stats)) {
    stats[cat].accuracy = stats[cat].total > 0 ? Math.round((stats[cat].correct / stats[cat].total) * 100) : 0;
  }
  return stats;
}

export function detectWeakAreas(categoryStats: Record<string, { total: number; correct: number; accuracy: number }>, threshold: number = 70): string[] {
  return Object.entries(categoryStats)
    .filter(([_, s]) => s.total >= 2 && s.accuracy < threshold)
    .map(([cat]) => cat);
}

export function computeMasteryLevels(categoryStats: Record<string, { total: number; correct: number; accuracy: number }>): Record<string, { level: string; accuracy: number }> {
  const levels: Record<string, { level: string; accuracy: number }> = {};
  for (const [cat, s] of Object.entries(categoryStats)) {
    if (s.total >= 1) {
      levels[cat] = { level: getMasteryLevel(s.accuracy), accuracy: s.accuracy };
    }
  }
  return levels;
}

export async function getStudyRecommendations(weakCategories: string[]): Promise<any[]> {
  if (weakCategories.length === 0) return [];

  const recommendations: any[] = [];

  try {
    const { rows: lessons } = await pool.query(
      `SELECT slug, title, category FROM pharmtech_lessons WHERE published = true AND category = ANY($1) LIMIT 10`,
      [weakCategories]
    );
    for (const l of lessons) {
      recommendations.push({ type: "lesson", slug: l.slug, title: l.title, category: l.category, path: `/pharmacy-technician/lessons/${l.slug}` });
    }
  } catch (_) {}

  try {
    const { rows: decks } = await pool.query(
      `SELECT slug, title, category FROM pharmtech_flashcard_decks WHERE published = true AND category = ANY($1) LIMIT 10`,
      [weakCategories]
    );
    for (const d of decks) {
      recommendations.push({ type: "flashcard", slug: d.slug, title: d.title, category: d.category, path: `/pharmacy-technician/flashcards/${d.slug}` });
    }
  } catch (_) {}

  try {
    const { rows: exams } = await pool.query(
      `SELECT slug, title FROM pharmtech_exams WHERE published = true LIMIT 3`
    );
    for (const e of exams) {
      recommendations.push({ type: "exam", slug: e.slug, title: e.title, path: `/pharmacy-technician/exams/${e.slug}` });
    }
  } catch (_) {}

  return recommendations;
}

export async function updateMasteryHistory(userId: string | null, sessionId: string, categoryStats: Record<string, { total: number; correct: number; accuracy: number }>): Promise<void> {
  for (const [category, stats] of Object.entries(categoryStats)) {
    if (stats.total === 0) continue;
    const level = getMasteryLevel(stats.accuracy);
    const coalesceUserId = userId || '';

    const { rows: existing } = await pool.query(
      `SELECT id, total_attempted, total_correct FROM pharmtech_mastery_history WHERE COALESCE(user_id, '') = $1 AND category = $2`,
      [coalesceUserId, category]
    );

    if (existing.length > 0) {
      const newTotal = (existing[0].total_attempted || 0) + stats.total;
      const newCorrect = (existing[0].total_correct || 0) + stats.correct;
      const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
      const newLevel = getMasteryLevel(newAccuracy);

      await pool.query(
        `UPDATE pharmtech_mastery_history SET total_attempted = $1, total_correct = $2, accuracy = $3, mastery_level = $4, last_session_id = $5, updated_at = NOW() WHERE id = $6`,
        [newTotal, newCorrect, newAccuracy, newLevel, sessionId, existing[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO pharmtech_mastery_history (user_id, category, total_attempted, total_correct, accuracy, mastery_level, last_session_id, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [userId, category, stats.total, stats.correct, stats.accuracy, level, sessionId]
      );
    }
  }
}

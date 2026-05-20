import { pool } from "./storage";

export interface RelevanceWeights {
  exactTopic: number;
  sameDiscipline: number;
  sameSubtopic: number;
  sameBlueprintCategory: number;
  sameExamTrack: number;
  sameCountryTrack: number;
  tagOverlap: number;
  difficultyProximity: number;
}

export const DEFAULT_RELEVANCE_WEIGHTS: RelevanceWeights = {
  exactTopic: 40,
  sameDiscipline: 25,
  sameSubtopic: 20,
  sameBlueprintCategory: 15,
  sameExamTrack: 10,
  sameCountryTrack: 8,
  tagOverlap: 12,
  difficultyProximity: 5,
};

export interface ContentMatch {
  id: string;
  type: "lesson" | "flashcard" | "question";
  title: string;
  score: number;
  matchReasons: string[];
  discipline?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: number;
}

export interface RemediationResult {
  questionId: string;
  bestLesson: ContentMatch | null;
  bestDeck: ContentMatch | null;
  relatedQuestions: ContentMatch[];
  allLessons: ContentMatch[];
  allDecks: ContentMatch[];
  autoLinkScore: number;
  manuallyCurated: boolean;
}

interface QuestionContext {
  id: string;
  discipline: string;
  topic: string;
  subtopic: string;
  blueprintCategory: string;
  difficulty: number;
  tags: string[];
  countryTrack?: string;
  examTrack?: string;
}

function normalizeStr(s: string): string {
  return (s || "").toLowerCase().trim();
}

function computeTagOverlap(tags1: string[], tags2: string[]): number {
  if (!tags1.length || !tags2.length) return 0;
  const set1 = new Set(tags1.map(normalizeStr));
  const set2 = new Set(tags2.map(normalizeStr));
  const intersection = [...set1].filter(t => set2.has(t));
  const union = new Set([...set1, ...set2]);
  return union.size > 0 ? intersection.length / union.size : 0;
}

function computeDifficultyScore(d1: number, d2: number): number {
  const diff = Math.abs((d1 || 3) - (d2 || 3));
  return Math.max(0, 1 - diff * 0.25);
}

export function scoreRelevance(
  question: QuestionContext,
  candidate: {
    discipline?: string;
    topic?: string;
    subtopic?: string;
    blueprintCategory?: string;
    tags?: string[];
    difficulty?: number;
    countryTrack?: string;
    examTrack?: string;
  },
  weights: RelevanceWeights = DEFAULT_RELEVANCE_WEIGHTS
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (normalizeStr(question.topic) && normalizeStr(candidate.topic || "") &&
      normalizeStr(question.topic) === normalizeStr(candidate.topic || "")) {
    score += weights.exactTopic;
    reasons.push("exact_topic_match");
  } else if (normalizeStr(question.topic) && normalizeStr(candidate.topic || "") &&
             normalizeStr(candidate.topic || "").includes(normalizeStr(question.topic))) {
    score += weights.exactTopic * 0.6;
    reasons.push("partial_topic_match");
  }

  if (normalizeStr(question.discipline) && normalizeStr(candidate.discipline || "") &&
      normalizeStr(question.discipline) === normalizeStr(candidate.discipline || "")) {
    score += weights.sameDiscipline;
    reasons.push("same_discipline");
  }

  if (normalizeStr(question.subtopic) && normalizeStr(candidate.subtopic || "") &&
      normalizeStr(question.subtopic) === normalizeStr(candidate.subtopic || "")) {
    score += weights.sameSubtopic;
    reasons.push("same_subtopic");
  } else if (normalizeStr(question.subtopic) && normalizeStr(candidate.subtopic || "") &&
             normalizeStr(candidate.subtopic || "").includes(normalizeStr(question.subtopic))) {
    score += weights.sameSubtopic * 0.5;
    reasons.push("partial_subtopic_match");
  }

  if (normalizeStr(question.blueprintCategory) && normalizeStr(candidate.blueprintCategory || "") &&
      normalizeStr(question.blueprintCategory) === normalizeStr(candidate.blueprintCategory || "")) {
    score += weights.sameBlueprintCategory;
    reasons.push("same_blueprint_category");
  }

  if (question.examTrack && candidate.examTrack &&
      normalizeStr(question.examTrack) === normalizeStr(candidate.examTrack)) {
    score += weights.sameExamTrack;
    reasons.push("same_exam_track");
  }

  if (question.countryTrack && candidate.countryTrack &&
      (normalizeStr(question.countryTrack) === normalizeStr(candidate.countryTrack) ||
       normalizeStr(candidate.countryTrack) === "both")) {
    score += weights.sameCountryTrack;
    reasons.push("same_country_track");
  }

  const tagScore = computeTagOverlap(question.tags || [], candidate.tags || []);
  if (tagScore > 0) {
    score += weights.tagOverlap * tagScore;
    reasons.push(`tag_overlap_${Math.round(tagScore * 100)}pct`);
  }

  const diffScore = computeDifficultyScore(question.difficulty, candidate.difficulty || 3);
  score += weights.difficultyProximity * diffScore;

  return { score, reasons };
}

export async function findRemediationContent(
  questionId: string,
  weights: RelevanceWeights = DEFAULT_RELEVANCE_WEIGHTS
): Promise<RemediationResult> {
  const manualResult = await pool.query(
    `SELECT * FROM mlt_content_links WHERE question_id = $1 AND manually_curated = true`,
    [questionId]
  );

  if (manualResult.rows.length > 0) {
    const link = manualResult.rows[0];
    const result: RemediationResult = {
      questionId,
      bestLesson: null,
      bestDeck: null,
      relatedQuestions: [],
      allLessons: [],
      allDecks: [],
      autoLinkScore: link.auto_link_score || 100,
      manuallyCurated: true,
    };

    if (link.primary_lesson_id) {
      const lessonRes = await pool.query(
        `SELECT id, title, career_type FROM allied_lessons WHERE id = $1`,
        [link.primary_lesson_id]
      );
      if (lessonRes.rows[0]) {
        result.bestLesson = {
          id: lessonRes.rows[0].id,
          type: "lesson",
          title: lessonRes.rows[0].title,
          score: 100,
          matchReasons: ["manually_curated"],
        };
      }
    }

    if (link.primary_deck_id) {
      const deckRes = await pool.query(
        `SELECT id, title FROM flashcard_decks WHERE id = $1`,
        [link.primary_deck_id]
      );
      if (deckRes.rows[0]) {
        result.bestDeck = {
          id: deckRes.rows[0].id,
          type: "flashcard",
          title: deckRes.rows[0].title,
          score: 100,
          matchReasons: ["manually_curated"],
        };
      }
    }

    return result;
  }

  const qResult = await pool.query(
    `SELECT id, blueprint_category, subtopic, difficulty, stem, cognitive_level
     FROM allied_questions WHERE id = $1`,
    [questionId]
  );

  if (qResult.rows.length === 0) {
    return {
      questionId,
      bestLesson: null,
      bestDeck: null,
      relatedQuestions: [],
      allLessons: [],
      allDecks: [],
      autoLinkScore: 0,
      manuallyCurated: false,
    };
  }

  const q = qResult.rows[0];
  const context: QuestionContext = {
    id: q.id,
    discipline: q.blueprint_category || "",
    topic: q.subtopic || "",
    subtopic: q.subtopic || "",
    blueprintCategory: q.blueprint_category || "",
    difficulty: q.difficulty || 3,
    tags: [],
  };

  const [lessonsResult, flashcardsResult, questionsResult] = await Promise.all([
    pool.query(
      `SELECT l.id, l.title, l.slug, m.domain as discipline, l.career_type
       FROM allied_lessons l
       LEFT JOIN allied_modules m ON l.module_id = m.id
       WHERE l.career_type = 'mlt' AND l.status != 'archived'
       LIMIT 200`
    ),
    pool.query(
      `SELECT id, blueprint_category, subtopic, card_type, front
       FROM allied_flashcards
       WHERE career_type = 'mlt'
       LIMIT 500`
    ),
    pool.query(
      `SELECT id, blueprint_category, subtopic, difficulty, stem
       FROM allied_questions
       WHERE career_type ILIKE '%mlt%' AND status = 'active' AND id != $1
       ORDER BY RANDOM() LIMIT 200`,
      [questionId]
    ),
  ]);

  const scoredLessons: ContentMatch[] = lessonsResult.rows.map((l: any) => {
    const { score, reasons } = scoreRelevance(context, {
      discipline: l.discipline || "",
      topic: l.title || "",
      subtopic: "",
      blueprintCategory: l.discipline || "",
      tags: [],
    }, weights);
    return {
      id: l.id,
      type: "lesson" as const,
      title: l.title,
      score,
      matchReasons: reasons,
      discipline: l.discipline,
    };
  }).sort((a: ContentMatch, b: ContentMatch) => b.score - a.score);

  const deckMap = new Map<string, { cards: any[]; totalScore: number; reasons: Set<string>; discipline: string; subtopic: string }>();

  for (const fc of flashcardsResult.rows) {
    const discipline = fc.blueprint_category || "General";
    const key = `${discipline}__${fc.subtopic || "general"}`;

    if (!deckMap.has(key)) {
      deckMap.set(key, {
        cards: [],
        totalScore: 0,
        reasons: new Set(),
        discipline,
        subtopic: fc.subtopic || "",
      });
    }

    const { score, reasons } = scoreRelevance(context, {
      discipline,
      topic: fc.subtopic || "",
      subtopic: fc.subtopic || "",
      blueprintCategory: discipline,
    }, weights);

    const entry = deckMap.get(key)!;
    entry.cards.push(fc);
    entry.totalScore = Math.max(entry.totalScore, score);
    reasons.forEach(r => entry.reasons.add(r));
  }

  const scoredDecks: ContentMatch[] = Array.from(deckMap.entries()).map(([key, val]) => ({
    id: key,
    type: "flashcard" as const,
    title: `${val.discipline} — ${val.subtopic || "General"}`,
    score: val.totalScore,
    matchReasons: Array.from(val.reasons),
    discipline: val.discipline,
    subtopic: val.subtopic,
  })).sort((a, b) => b.score - a.score);

  const scoredQuestions: ContentMatch[] = questionsResult.rows.map((rq: any) => {
    const { score, reasons } = scoreRelevance(context, {
      discipline: rq.blueprint_category || "",
      topic: rq.subtopic || "",
      subtopic: rq.subtopic || "",
      blueprintCategory: rq.blueprint_category || "",
      difficulty: rq.difficulty,
    }, weights);
    return {
      id: rq.id,
      type: "question" as const,
      title: (rq.stem || "").substring(0, 100),
      score,
      matchReasons: reasons,
      discipline: rq.blueprint_category,
      topic: rq.subtopic,
      difficulty: rq.difficulty,
    };
  }).sort((a: ContentMatch, b: ContentMatch) => b.score - a.score);

  const bestLesson = scoredLessons.length > 0 && scoredLessons[0].score > 10 ? scoredLessons[0] : null;
  const bestDeck = scoredDecks.length > 0 && scoredDecks[0].score > 10 ? scoredDecks[0] : null;
  const topScore = Math.max(bestLesson?.score || 0, bestDeck?.score || 0);

  return {
    questionId,
    bestLesson,
    bestDeck,
    relatedQuestions: scoredQuestions.filter(q => q.score > 15).slice(0, 5),
    allLessons: scoredLessons.slice(0, 10),
    allDecks: scoredDecks.slice(0, 10),
    autoLinkScore: Math.round(topScore),
    manuallyCurated: false,
  };
}

export async function getDashboardRecommendations(userId: string): Promise<{
  recommendedLesson: ContentMatch | null;
  reviewFlashcards: ContentMatch[];
  retryWeakTopics: { topic: string; accuracy: number; questionCount: number }[];
  basedOnLastExam: ContentMatch[];
}> {
  const examResult = await pool.query(
    `SELECT weak_area_map, strong_area_map, response_history, score
     FROM mlt_exam_sessions
     WHERE user_id = $1 AND status = 'completed'
     ORDER BY completed_at DESC LIMIT 3`,
    [userId]
  );

  const weakTopics: Record<string, { total: number; wrong: number }> = {};

  for (const exam of examResult.rows) {
    const weakMap = typeof exam.weak_area_map === "string" ? JSON.parse(exam.weak_area_map) : (exam.weak_area_map || {});
    const responses = typeof exam.response_history === "string" ? JSON.parse(exam.response_history) : (exam.response_history || []);

    for (const [topic, weakness] of Object.entries(weakMap as Record<string, number>)) {
      if (!weakTopics[topic]) weakTopics[topic] = { total: 0, wrong: 0 };
      weakTopics[topic].wrong += weakness;
      weakTopics[topic].total += 100;
    }

    for (const r of responses) {
      const cat = (r as any).category || "General";
      if (!weakTopics[cat]) weakTopics[cat] = { total: 0, wrong: 0 };
      weakTopics[cat].total++;
      if (!(r as any).isCorrect) weakTopics[cat].wrong++;
    }
  }

  const sortedWeakTopics = Object.entries(weakTopics)
    .map(([topic, stats]) => ({
      topic,
      accuracy: stats.total > 0 ? Math.round(((stats.total - stats.wrong) / stats.total) * 100) : 0,
      questionCount: stats.total,
    }))
    .filter(t => t.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);

  const topWeakDiscipline = sortedWeakTopics[0]?.topic || "Hematology";

  const lessonsResult = await pool.query(
    `SELECT l.id, l.title, l.slug, m.domain as discipline
     FROM allied_lessons l
     LEFT JOIN allied_modules m ON l.module_id = m.id
     WHERE l.career_type = 'mlt' AND l.status != 'archived'
     ORDER BY CASE WHEN m.domain ILIKE $1 THEN 0 ELSE 1 END, l.order_index
     LIMIT 10`,
    [`%${topWeakDiscipline}%`]
  );

  const recommendedLesson = lessonsResult.rows.length > 0 ? {
    id: lessonsResult.rows[0].id,
    type: "lesson" as const,
    title: lessonsResult.rows[0].title,
    score: 80,
    matchReasons: ["weak_area_targeted"],
    discipline: lessonsResult.rows[0].discipline,
  } : null;

  const flashcardsResult = await pool.query(
    `SELECT blueprint_category, subtopic, COUNT(*) as card_count
     FROM allied_flashcards
     WHERE career_type = 'mlt'
     GROUP BY blueprint_category, subtopic
     ORDER BY COUNT(*) DESC
     LIMIT 20`
  );

  const reviewFlashcards: ContentMatch[] = [];
  for (const fc of flashcardsResult.rows) {
    const isWeakTopic = sortedWeakTopics.some(w =>
      normalizeStr(w.topic) === normalizeStr(fc.blueprint_category || "")
    );
    if (isWeakTopic || reviewFlashcards.length < 3) {
      reviewFlashcards.push({
        id: `${fc.blueprint_category}__${fc.subtopic || "general"}`,
        type: "flashcard",
        title: `${fc.blueprint_category} — ${fc.subtopic || "General"} (${fc.card_count} cards)`,
        score: isWeakTopic ? 90 : 50,
        matchReasons: isWeakTopic ? ["weak_area_targeted"] : ["general_review"],
        discipline: fc.blueprint_category,
        subtopic: fc.subtopic,
      });
    }
  }

  const basedOnLastExam: ContentMatch[] = [];
  if (examResult.rows.length > 0) {
    const lastExam = examResult.rows[0];
    const weakMap = typeof lastExam.weak_area_map === "string" ? JSON.parse(lastExam.weak_area_map) : (lastExam.weak_area_map || {});
    const weakAreas = Object.keys(weakMap).slice(0, 3);

    for (const area of weakAreas) {
      const lessonMatch = lessonsResult.rows.find((l: any) =>
        normalizeStr(l.discipline || "").includes(normalizeStr(area))
      );
      if (lessonMatch) {
        basedOnLastExam.push({
          id: lessonMatch.id,
          type: "lesson",
          title: `Review: ${lessonMatch.title}`,
          score: 75,
          matchReasons: ["last_exam_weak_area"],
          discipline: area,
        });
      }
    }
  }

  return {
    recommendedLesson,
    reviewFlashcards: reviewFlashcards.slice(0, 5),
    retryWeakTopics: sortedWeakTopics.slice(0, 5),
    basedOnLastExam: basedOnLastExam.slice(0, 5),
  };
}

export async function trackRemediationClick(
  userId: string,
  questionId: string,
  contentType: string,
  contentId: string,
  action: string
): Promise<void> {
  await pool.query(
    `INSERT INTO mlt_remediation_analytics
     (id, user_id, question_id, content_type, content_id, action, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
    [userId, questionId, contentType, contentId, action]
  );
}

export async function getRemediationAnalytics(): Promise<{
  totalClicks: number;
  clicksByType: Record<string, number>;
  clicksByAction: Record<string, number>;
  topClickedLessons: { contentId: string; clicks: number }[];
  topClickedDecks: { contentId: string; clicks: number }[];
  improvementRate: number;
}> {
  const [totalResult, typeResult, actionResult, topLessonsResult, topDecksResult] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int as total FROM mlt_remediation_analytics`),
    pool.query(
      `SELECT content_type, COUNT(*)::int as count
       FROM mlt_remediation_analytics
       GROUP BY content_type`
    ),
    pool.query(
      `SELECT action, COUNT(*)::int as count
       FROM mlt_remediation_analytics
       GROUP BY action`
    ),
    pool.query(
      `SELECT content_id, COUNT(*)::int as clicks
       FROM mlt_remediation_analytics
       WHERE content_type = 'lesson'
       GROUP BY content_id
       ORDER BY clicks DESC LIMIT 10`
    ),
    pool.query(
      `SELECT content_id, COUNT(*)::int as clicks
       FROM mlt_remediation_analytics
       WHERE content_type = 'flashcard'
       GROUP BY content_id
       ORDER BY clicks DESC LIMIT 10`
    ),
  ]);

  const clicksByType: Record<string, number> = {};
  for (const row of typeResult.rows) {
    clicksByType[row.content_type] = row.count;
  }

  const clicksByAction: Record<string, number> = {};
  for (const row of actionResult.rows) {
    clicksByAction[row.action] = row.count;
  }

  return {
    totalClicks: totalResult.rows[0]?.total || 0,
    clicksByType,
    clicksByAction,
    topClickedLessons: topLessonsResult.rows,
    topClickedDecks: topDecksResult.rows,
    improvementRate: 0,
  };
}

import { pool } from "./storage";

export interface TopicMastery {
  topic: string;
  subtopic?: string;
  totalAttempts: number;
  correctCount: number;
  masteryPercent: number;
  masteryLabel: "weak" | "developing" | "proficient" | "mastery";
  recentAccuracy: number;
  avgTimeSeconds: number;
}

export interface ReadinessResult {
  score: number;
  level: "not_ready" | "developing" | "nearly_ready" | "exam_ready";
  passProbability: number;
  factors: {
    overallAccuracy: number;
    recentPerformance: number;
    topicCoverage: number;
    practiceExamScore: number;
    timeManagement: number;
    flashcardRetention?: number;
    difficultyProgression?: number;
  };
}

export interface StudyRecommendation {
  type: "lesson" | "flashcard" | "practice_set" | "mock_exam" | "review";
  topic: string;
  priority: "high" | "medium" | "low";
  reason: string;
  resourceId?: string;
  resourceTitle?: string;
}

export interface WeeklyScheduleDay {
  date: string;
  dayOfWeek: string;
  phase: string;
  tasks: {
    type: string;
    topic: string;
    duration: number;
    description: string;
  }[];
  totalMinutes: number;
}

function getMasteryLabel(percent: number): "weak" | "developing" | "proficient" | "mastery" {
  if (percent <= 40) return "weak";
  if (percent <= 65) return "developing";
  if (percent <= 85) return "proficient";
  return "mastery";
}

function getReadinessLevel(score: number): "not_ready" | "developing" | "nearly_ready" | "exam_ready" {
  if (score < 40) return "not_ready";
  if (score < 65) return "developing";
  if (score < 85) return "nearly_ready";
  return "exam_ready";
}

export async function ensureStudyCoachingTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS student_study_profiles (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL UNIQUE,
      total_questions_answered INTEGER DEFAULT 0,
      total_correct INTEGER DEFAULT 0,
      total_incorrect INTEGER DEFAULT 0,
      avg_time_per_question INTEGER DEFAULT 0,
      flashcards_studied INTEGER DEFAULT 0,
      lessons_viewed INTEGER DEFAULT 0,
      practice_exams_completed INTEGER DEFAULT 0,
      adaptive_exams_completed INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_study_date TEXT,
      weekly_goal_hours INTEGER DEFAULT 10,
      weekly_hours_logged DOUBLE PRECISION DEFAULT 0,
      weekly_goal_reset_date TEXT,
      total_study_minutes INTEGER DEFAULT 0,
      exam_date TIMESTAMP,
      hours_per_week INTEGER DEFAULT 10,
      readiness_score INTEGER DEFAULT 0,
      readiness_level TEXT DEFAULT 'not_ready',
      pass_probability INTEGER DEFAULT 0,
      exam_prep_mode_active BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS topic_mastery_scores (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      topic TEXT NOT NULL,
      subtopic TEXT,
      total_attempts INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      mastery_percent DOUBLE PRECISION DEFAULT 0,
      mastery_label TEXT DEFAULT 'weak',
      recent_accuracy DOUBLE PRECISION DEFAULT 0,
      avg_time_seconds INTEGER DEFAULT 0,
      last_attempt_at TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS spaced_repetition_cards (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      card_id VARCHAR NOT NULL,
      deck_id VARCHAR,
      ease_factor DOUBLE PRECISION DEFAULT 2.5,
      interval INTEGER DEFAULT 1,
      repetitions INTEGER DEFAULT 0,
      next_review_at TIMESTAMP DEFAULT NOW() NOT NULL,
      last_reviewed_at TIMESTAMP,
      status TEXT DEFAULT 'new',
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weak_area_alerts (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      topic TEXT NOT NULL,
      alert_type TEXT NOT NULL DEFAULT 'repeated_struggle',
      message TEXT NOT NULL,
      dismissed BOOLEAN DEFAULT false,
      recommended_actions JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS study_milestones (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      milestone_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      earned_at TIMESTAMP DEFAULT NOW() NOT NULL,
      seen BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS generated_courses (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      blueprint_id VARCHAR,
      exam_code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      structure JSONB DEFAULT '[]'::jsonb,
      total_lessons INTEGER DEFAULT 0,
      total_flashcards INTEGER DEFAULT 0,
      total_questions INTEGER DEFAULT 0,
      seo_pages JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accuracy_trends (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      date TEXT NOT NULL,
      questions_answered INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      accuracy DOUBLE PRECISION DEFAULT 0,
      study_minutes INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS study_plan_schedule (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      date TEXT NOT NULL,
      phase TEXT,
      tasks JSONB DEFAULT '[]'::jsonb,
      completed BOOLEAN DEFAULT false,
      completion_rate INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_practice_sessions (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      status TEXT DEFAULT 'pending',
      total_questions INTEGER DEFAULT 20,
      weak_topic_count INTEGER DEFAULT 0,
      moderate_topic_count INTEGER DEFAULT 0,
      strong_topic_count INTEGER DEFAULT 0,
      includes_images BOOLEAN DEFAULT false,
      questions JSONB DEFAULT '[]'::jsonb,
      score INTEGER,
      completed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_followup_responses (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL UNIQUE,
      exam_result_status TEXT NOT NULL,
      exam_weak_areas JSONB DEFAULT '[]'::jsonb,
      exam_result_date TIMESTAMP DEFAULT NOW() NOT NULL,
      coupon_code TEXT,
      coupon_expires_at TIMESTAMP,
      new_exam_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
}

export async function getOrCreateStudentProfile(userId: string) {
  const existing = await pool.query(
    `SELECT * FROM student_study_profiles WHERE user_id = $1`,
    [userId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO student_study_profiles (id, user_id) VALUES (gen_random_uuid(), $1) RETURNING *`,
    [userId]
  );
  return result.rows[0];
}

export async function recordQuestionAnswer(
  userId: string,
  topic: string,
  subtopic: string | null,
  isCorrect: boolean,
  timeSeconds: number
): Promise<void> {
  await getOrCreateStudentProfile(userId);

  await pool.query(
    `UPDATE student_study_profiles SET
      total_questions_answered = total_questions_answered + 1,
      total_correct = total_correct + CASE WHEN $2 THEN 1 ELSE 0 END,
      total_incorrect = total_incorrect + CASE WHEN $2 THEN 0 ELSE 1 END,
      updated_at = NOW()
    WHERE user_id = $1`,
    [userId, isCorrect]
  );

  const existingTopic = await pool.query(
    `SELECT * FROM topic_mastery_scores WHERE user_id = $1 AND topic = $2 AND (subtopic = $3 OR ($3 IS NULL AND subtopic IS NULL))`,
    [userId, topic, subtopic]
  );

  if (existingTopic.rows.length > 0) {
    const row = existingTopic.rows[0];
    const newTotal = (row.total_attempts || 0) + 1;
    const newCorrect = (row.correct_count || 0) + (isCorrect ? 1 : 0);
    const masteryPercent = Math.round((newCorrect / newTotal) * 100);
    const masteryLabel = getMasteryLabel(masteryPercent);

    const recentWindow = 10;
    const recentResult = await pool.query(
      `SELECT is_correct FROM (
        SELECT CASE WHEN $3 THEN true ELSE false END as is_correct
        UNION ALL
        SELECT NULL
      ) sub LIMIT 1`,
      [userId, topic, isCorrect]
    );

    await pool.query(
      `UPDATE topic_mastery_scores SET
        total_attempts = $2, correct_count = $3,
        mastery_percent = $4, mastery_label = $5,
        recent_accuracy = $4, avg_time_seconds = COALESCE(($6 + avg_time_seconds * (total_attempts - 1)) / total_attempts, $6),
        last_attempt_at = NOW(), updated_at = NOW()
      WHERE user_id = $1 AND topic = $7 AND (subtopic = $8 OR ($8 IS NULL AND subtopic IS NULL))`,
      [userId, newTotal, newCorrect, masteryPercent, masteryLabel, timeSeconds, topic, subtopic]
    );
  } else {
    const masteryPercent = isCorrect ? 100 : 0;
    const masteryLabel = getMasteryLabel(masteryPercent);
    await pool.query(
      `INSERT INTO topic_mastery_scores (id, user_id, topic, subtopic, total_attempts, correct_count, mastery_percent, mastery_label, recent_accuracy, avg_time_seconds, last_attempt_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 1, $4, $5, $6, $5, $7, NOW())`,
      [userId, topic, subtopic, isCorrect ? 1 : 0, masteryPercent, masteryLabel, timeSeconds]
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const trendExists = await pool.query(
    `SELECT * FROM accuracy_trends WHERE user_id = $1 AND date = $2`,
    [userId, today]
  );

  if (trendExists.rows.length > 0) {
    const row = trendExists.rows[0];
    const newAnswered = (row.questions_answered || 0) + 1;
    const newCorrectT = (row.correct_count || 0) + (isCorrect ? 1 : 0);
    await pool.query(
      `UPDATE accuracy_trends SET questions_answered = $2, correct_count = $3, accuracy = $4 WHERE user_id = $1 AND date = $5`,
      [userId, newAnswered, newCorrectT, Math.round((newCorrectT / newAnswered) * 100), today]
    );
  } else {
    await pool.query(
      `INSERT INTO accuracy_trends (id, user_id, date, questions_answered, correct_count, accuracy)
       VALUES (gen_random_uuid(), $1, $2, 1, $3, $4)`,
      [userId, today, isCorrect ? 1 : 0, isCorrect ? 100 : 0]
    );
  }

  await updateStreakAndCheckMilestones(userId);
  await checkWeakAreaAlerts(userId, topic);
}

async function updateStreakAndCheckMilestones(userId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const profile = await pool.query(`SELECT * FROM student_study_profiles WHERE user_id = $1`, [userId]);
  if (profile.rows.length === 0) return;

  const p = profile.rows[0];
  const lastDate = p.last_study_date;

  let newStreak = p.current_streak || 0;
  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastDate === yesterdayStr) {
      newStreak += 1;
    } else if (lastDate !== today) {
      newStreak = 1;
    }
  }

  const longestStreak = Math.max(newStreak, p.longest_streak || 0);

  await pool.query(
    `UPDATE student_study_profiles SET
      current_streak = $2, longest_streak = $3, last_study_date = $4, updated_at = NOW()
    WHERE user_id = $1`,
    [userId, newStreak, longestStreak, today]
  );

  const milestoneChecks = [
    { threshold: 7, type: "streak_7", title: "7-Day Streak!", description: "You've studied 7 days in a row!" },
    { threshold: 14, type: "streak_14", title: "14-Day Streak!", description: "Two weeks of consistent study!" },
    { threshold: 30, type: "streak_30", title: "30-Day Streak!", description: "A full month of dedication!" },
  ];

  for (const m of milestoneChecks) {
    if (newStreak >= m.threshold) {
      const exists = await pool.query(
        `SELECT id FROM study_milestones WHERE user_id = $1 AND milestone_type = $2`,
        [userId, m.type]
      );
      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO study_milestones (id, user_id, milestone_type, title, description)
           VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
          [userId, m.type, m.title, m.description]
        );
      }
    }
  }

  const totalQ = (p.total_questions_answered || 0) + 1;
  const questionMilestones = [
    { threshold: 100, type: "questions_100", title: "Century!", description: "You've answered 100 questions!" },
    { threshold: 500, type: "questions_500", title: "500 Club!", description: "500 questions answered!" },
    { threshold: 1000, type: "questions_1000", title: "1K Master!", description: "1,000 questions answered!" },
  ];

  for (const m of questionMilestones) {
    if (totalQ >= m.threshold) {
      const exists = await pool.query(
        `SELECT id FROM study_milestones WHERE user_id = $1 AND milestone_type = $2`,
        [userId, m.type]
      );
      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO study_milestones (id, user_id, milestone_type, title, description)
           VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
          [userId, m.type, m.title, m.description]
        );
      }
    }
  }
}

async function checkWeakAreaAlerts(userId: string, topic: string): Promise<void> {
  const topicData = await pool.query(
    `SELECT * FROM topic_mastery_scores WHERE user_id = $1 AND topic = $2`,
    [userId, topic]
  );
  if (topicData.rows.length === 0) return;

  const row = topicData.rows[0];
  if (row.total_attempts >= 5 && row.mastery_percent <= 40) {
    const recentAlert = await pool.query(
      `SELECT id FROM weak_area_alerts WHERE user_id = $1 AND topic = $2 AND dismissed = false
       AND created_at > NOW() - INTERVAL '7 days'`,
      [userId, topic]
    );
    if (recentAlert.rows.length === 0) {
      await pool.query(
        `INSERT INTO weak_area_alerts (id, user_id, topic, alert_type, message, recommended_actions)
         VALUES (gen_random_uuid(), $1, $2, 'repeated_struggle', $3, $4)`,
        [
          userId, topic,
          `You're struggling with "${topic}". Consider reviewing the lessons and flashcards for this topic.`,
          JSON.stringify([
            { type: "lesson", label: `Review ${topic} lessons` },
            { type: "flashcard", label: `Practice ${topic} flashcards` },
            { type: "practice", label: `Try a focused practice set on ${topic}` },
          ]),
        ]
      );
    }
  }
}

export async function getTopicMasteryScores(userId: string): Promise<TopicMastery[]> {
  const result = await pool.query(
    `SELECT * FROM topic_mastery_scores WHERE user_id = $1 ORDER BY mastery_percent ASC`,
    [userId]
  );
  return result.rows.map((r: any) => ({
    topic: r.topic,
    subtopic: r.subtopic,
    totalAttempts: r.total_attempts || 0,
    correctCount: r.correct_count || 0,
    masteryPercent: r.mastery_percent || 0,
    masteryLabel: getMasteryLabel(r.mastery_percent || 0),
    recentAccuracy: r.recent_accuracy || 0,
    avgTimeSeconds: r.avg_time_seconds || 0,
  }));
}

export async function calculateReadiness(userId: string): Promise<ReadinessResult> {
  const profile = await getOrCreateStudentProfile(userId);
  const masteryScores = await getTopicMasteryScores(userId);

  const totalQ = profile.total_questions_answered || 0;
  const totalCorrect = profile.total_correct || 0;
  const overallAccuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

  const recentResult = await pool.query(
    `SELECT * FROM accuracy_trends WHERE user_id = $1 ORDER BY date DESC LIMIT 7`,
    [userId]
  );
  const recentDays = recentResult.rows;
  let recentPerformance = 0;
  if (recentDays.length > 0) {
    const totalRecent = recentDays.reduce((s: number, d: any) => s + (d.questions_answered || 0), 0);
    const correctRecent = recentDays.reduce((s: number, d: any) => s + (d.correct_count || 0), 0);
    recentPerformance = totalRecent > 0 ? Math.round((correctRecent / totalRecent) * 100) : 0;
  }

  const totalTopics = masteryScores.length;
  const proficientTopics = masteryScores.filter(t => t.masteryPercent >= 66).length;
  const topicCoverage = totalTopics > 0 ? Math.round((proficientTopics / totalTopics) * 100) : 0;

  const examResult = await pool.query(
    `SELECT score, total_questions FROM mock_exam_attempts WHERE user_id = $1 AND status = 'completed' ORDER BY completed_at DESC LIMIT 5`,
    [userId]
  );
  let practiceExamScore = 0;
  if (examResult.rows.length > 0) {
    const totalExamQ = examResult.rows.reduce((s: number, r: any) => s + (r.total_questions || 0), 0);
    const totalExamScore = examResult.rows.reduce((s: number, r: any) => s + (r.score || 0), 0);
    practiceExamScore = totalExamQ > 0 ? Math.round((totalExamScore / totalExamQ) * 100) : 0;
  }

  const avgTime = profile.avg_time_per_question || 0;
  const timeManagement = avgTime > 0 && avgTime <= 90 ? Math.min(100, Math.round((90 / avgTime) * 80)) : avgTime === 0 ? 0 : 50;

  let flashcardRetention = 0;
  try {
    const srResult = await pool.query(
      `SELECT AVG(CASE WHEN ucs.times_seen > 0 THEN ucs.times_correct::float / ucs.times_seen ELSE 0 END) as avg_retention
       FROM user_card_stats ucs WHERE ucs.user_id = $1 AND ucs.times_seen > 0`,
      [userId]
    );
    if (srResult.rows[0] && srResult.rows[0].avg_retention) {
      flashcardRetention = Math.round(parseFloat(srResult.rows[0].avg_retention) * 100);
    }
  } catch { flashcardRetention = 0; }

  let difficultyProgression = 0;
  try {
    const diffResult = await pool.query(
      `SELECT AVG(mastery_level) as avg_mastery FROM user_mastery_profiles WHERE user_id = $1 AND total_attempts >= 3`,
      [userId]
    );
    if (diffResult.rows[0] && diffResult.rows[0].avg_mastery) {
      difficultyProgression = Math.round(parseFloat(diffResult.rows[0].avg_mastery) * 100);
    }
  } catch { difficultyProgression = 0; }

  const score = Math.round(
    overallAccuracy * 0.20 +
    recentPerformance * 0.20 +
    topicCoverage * 0.15 +
    practiceExamScore * 0.20 +
    timeManagement * 0.05 +
    flashcardRetention * 0.10 +
    difficultyProgression * 0.10
  );

  const level = getReadinessLevel(score);

  const weakCount = masteryScores.filter(t => t.masteryLabel === "weak").length;
  const developingCount = masteryScores.filter(t => t.masteryLabel === "developing").length;
  const profCount = masteryScores.filter(t => t.masteryLabel === "proficient").length;
  const masteryCount = masteryScores.filter(t => t.masteryLabel === "mastery").length;

  let passProbability = Math.round(
    score * 0.4 +
    (totalTopics > 0 ? (masteryCount + profCount * 0.7) / totalTopics * 100 * 0.3 : 0) +
    practiceExamScore * 0.2 +
    recentPerformance * 0.1
  );
  passProbability = Math.max(0, Math.min(100, passProbability));

  await pool.query(
    `UPDATE student_study_profiles SET
      readiness_score = $2, readiness_level = $3, pass_probability = $4, updated_at = NOW()
    WHERE user_id = $1`,
    [userId, score, level, passProbability]
  );

  return {
    score,
    level,
    passProbability,
    factors: { overallAccuracy, recentPerformance, topicCoverage, practiceExamScore, timeManagement, flashcardRetention, difficultyProgression },
  };
}

export async function getStudyRecommendations(userId: string): Promise<StudyRecommendation[]> {
  const masteryScores = await getTopicMasteryScores(userId);
  const recommendations: StudyRecommendation[] = [];

  const weakTopics = masteryScores.filter(t => t.masteryLabel === "weak");
  const developingTopics = masteryScores.filter(t => t.masteryLabel === "developing");
  const proficientTopics = masteryScores.filter(t => t.masteryLabel === "proficient");

  for (const topic of weakTopics.slice(0, 3)) {
    recommendations.push({
      type: "lesson",
      topic: topic.topic,
      priority: "high",
      reason: `Your mastery of "${topic.topic}" is only ${Math.round(topic.masteryPercent)}%. Review the fundamentals.`,
    });
    recommendations.push({
      type: "flashcard",
      topic: topic.topic,
      priority: "high",
      reason: `Reinforce "${topic.topic}" with flashcard practice to build recall.`,
    });
  }

  for (const topic of developingTopics.slice(0, 2)) {
    recommendations.push({
      type: "practice_set",
      topic: topic.topic,
      priority: "medium",
      reason: `You're developing in "${topic.topic}" at ${Math.round(topic.masteryPercent)}%. Practice questions will solidify understanding.`,
    });
  }

  for (const topic of proficientTopics.slice(0, 1)) {
    recommendations.push({
      type: "review",
      topic: topic.topic,
      priority: "low",
      reason: `Maintain your proficiency in "${topic.topic}" with periodic review.`,
    });
  }

  if (masteryScores.length > 0) {
    const avgMastery = masteryScores.reduce((s, t) => s + t.masteryPercent, 0) / masteryScores.length;
    if (avgMastery >= 60) {
      recommendations.push({
        type: "mock_exam",
        topic: "All Topics",
        priority: "medium",
        reason: "Take a practice exam to test your overall readiness and identify remaining gaps.",
      });
    }
  }

  return recommendations;
}

export async function generateCustomPracticeSession(
  userId: string,
  totalQuestions: number = 20
): Promise<any> {
  const masteryScores = await getTopicMasteryScores(userId);

  const weakTopics = masteryScores.filter(t => t.masteryLabel === "weak");
  const developingTopics = masteryScores.filter(t => t.masteryLabel === "developing");
  const strongTopics = masteryScores.filter(t => t.masteryLabel === "proficient" || t.masteryLabel === "mastery");

  const weakCount = Math.round(totalQuestions * 0.5);
  const moderateCount = Math.round(totalQuestions * 0.3);
  const strongCount = totalQuestions - weakCount - moderateCount;

  const selectedTopics: string[] = [];
  const addTopics = (topics: TopicMastery[], count: number) => {
    if (topics.length === 0) return;
    for (let i = 0; i < count; i++) {
      selectedTopics.push(topics[i % topics.length].topic);
    }
  };

  addTopics(weakTopics, weakCount);
  addTopics(developingTopics, moderateCount);
  addTopics(strongTopics, strongCount);

  if (selectedTopics.length === 0) {
    const allTopics = [...weakTopics, ...developingTopics, ...strongTopics];
    if (allTopics.length > 0) {
      for (let i = 0; i < totalQuestions; i++) {
        selectedTopics.push(allTopics[i % allTopics.length].topic);
      }
    }
  }

  let questions: any[] = [];
  for (const topic of selectedTopics) {
    const q = await pool.query(
      `SELECT id, stem, options, correct_answer, topic, subtopic, difficulty, body_system
       FROM exam_questions
       WHERE topic = $1 AND status = 'published'
       ORDER BY RANDOM() LIMIT 1`,
      [topic]
    );
    if (q.rows.length > 0) {
      questions.push(q.rows[0]);
    }
  }

  if (questions.length < totalQuestions) {
    const remaining = totalQuestions - questions.length;
    const existingIds = questions.map(q => q.id);
    const filler = await pool.query(
      `SELECT id, stem, options, correct_answer, topic, subtopic, difficulty, body_system
       FROM exam_questions
       WHERE status = 'published' ${existingIds.length > 0 ? `AND id != ALL($2)` : ""}
       ORDER BY RANDOM() LIMIT $1`,
      existingIds.length > 0 ? [remaining, existingIds] : [remaining]
    );
    questions = questions.concat(filler.rows);
  }

  const result = await pool.query(
    `INSERT INTO custom_practice_sessions (id, user_id, total_questions, weak_topic_count, moderate_topic_count, strong_topic_count, questions)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, questions.length, weakCount, moderateCount, strongCount, JSON.stringify(questions)]
  );

  return result.rows[0];
}

export async function generateStudyPlan(
  userId: string,
  examDateStr: string | null,
  hoursPerWeek: number = 10
): Promise<WeeklyScheduleDay[]> {
  const masteryScores = await getTopicMasteryScores(userId);
  const readiness = await calculateReadiness(userId);

  const now = new Date();
  const examDate = examDateStr ? new Date(examDateStr) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const daysUntilExam = Math.max(1, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const weeksUntilExam = Math.ceil(daysUntilExam / 7);

  const minutesPerWeek = hoursPerWeek * 60;
  const minutesPerDay = Math.round(minutesPerWeek / 5);

  const weakTopics = masteryScores.filter(t => t.masteryLabel === "weak").map(t => t.topic);
  const developingTopics = masteryScores.filter(t => t.masteryLabel === "developing").map(t => t.topic);
  const strongTopics = masteryScores.filter(t => t.masteryLabel === "proficient" || t.masteryLabel === "mastery").map(t => t.topic);

  let phase: string;
  if (daysUntilExam > 21) {
    phase = "foundation";
  } else if (daysUntilExam > 7) {
    phase = "strengthening";
  } else {
    phase = "exam_prep";
  }

  const schedule: WeeklyScheduleDay[] = [];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  for (let d = 0; d < Math.min(daysUntilExam, 14); d++) {
    const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().slice(0, 10);
    const dayOfWeek = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];

    if (date.getDay() === 0 || date.getDay() === 6) {
      if (phase === "exam_prep") {
        schedule.push({
          date: dateStr,
          dayOfWeek,
          phase,
          tasks: [{
            type: "mock_exam",
            topic: "Full Practice Exam",
            duration: 120,
            description: "Take a full-length practice exam under timed conditions",
          }],
          totalMinutes: 120,
        });
      }
      continue;
    }

    const tasks: WeeklyScheduleDay["tasks"] = [];
    let remainingMinutes = minutesPerDay;

    if (phase === "foundation") {
      const topicIdx = d % Math.max(1, weakTopics.length + developingTopics.length);
      const topic = topicIdx < weakTopics.length
        ? weakTopics[topicIdx]
        : developingTopics[topicIdx - weakTopics.length] || weakTopics[0] || "General Review";

      tasks.push({
        type: "lesson",
        topic,
        duration: Math.min(30, remainingMinutes),
        description: `Study lesson: ${topic}`,
      });
      remainingMinutes -= 30;

      if (remainingMinutes > 0) {
        tasks.push({
          type: "flashcard",
          topic,
          duration: Math.min(20, remainingMinutes),
          description: `Review flashcards: ${topic}`,
        });
        remainingMinutes -= 20;
      }

      if (remainingMinutes > 0) {
        tasks.push({
          type: "practice",
          topic,
          duration: Math.min(remainingMinutes, 30),
          description: `Practice questions: ${topic}`,
        });
      }
    } else if (phase === "strengthening") {
      const allTopics = [...weakTopics, ...developingTopics, ...strongTopics];
      const topic = allTopics[d % Math.max(1, allTopics.length)] || "Mixed Topics";

      tasks.push({
        type: "practice",
        topic,
        duration: Math.min(40, remainingMinutes),
        description: `Focused practice: ${topic}`,
      });
      remainingMinutes -= 40;

      if (remainingMinutes > 0) {
        tasks.push({
          type: "flashcard",
          topic: "Mixed Review",
          duration: Math.min(20, remainingMinutes),
          description: "Spaced repetition flashcard review",
        });
        remainingMinutes -= 20;
      }

      if (d % 3 === 0 && remainingMinutes > 0) {
        tasks.push({
          type: "mock_exam",
          topic: "Mini Practice Exam",
          duration: Math.min(remainingMinutes, 60),
          description: "Short practice exam (20 questions)",
        });
      }
    } else {
      tasks.push({
        type: "mock_exam",
        topic: "Full Practice Exam",
        duration: Math.min(90, remainingMinutes),
        description: "Full-length timed practice exam",
      });
      remainingMinutes -= 90;

      if (remainingMinutes > 0) {
        const weakTopic = weakTopics[d % Math.max(1, weakTopics.length)] || "Review";
        tasks.push({
          type: "review",
          topic: weakTopic,
          duration: Math.min(remainingMinutes, 30),
          description: `Quick review of weak area: ${weakTopic}`,
        });
      }
    }

    schedule.push({
      date: dateStr,
      dayOfWeek,
      phase,
      tasks,
      totalMinutes: tasks.reduce((s, t) => s + t.duration, 0),
    });
  }

  await pool.query(`DELETE FROM study_plan_schedule WHERE user_id = $1`, [userId]);
  for (const day of schedule) {
    await pool.query(
      `INSERT INTO study_plan_schedule (id, user_id, date, phase, tasks, completed, completion_rate)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, false, 0)`,
      [userId, day.date, day.phase, JSON.stringify(day.tasks)]
    );
  }

  if (examDateStr) {
    await pool.query(
      `UPDATE student_study_profiles SET exam_date = $2, hours_per_week = $3, updated_at = NOW() WHERE user_id = $1`,
      [userId, examDateStr, hoursPerWeek]
    );
  }

  return schedule;
}

export async function processSpacedRepetition(
  userId: string,
  cardId: string,
  quality: number
): Promise<any> {
  let card = await pool.query(
    `SELECT * FROM spaced_repetition_cards WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId]
  );

  if (card.rows.length === 0) {
    await pool.query(
      `INSERT INTO spaced_repetition_cards (id, user_id, card_id, ease_factor, interval, repetitions, next_review_at, status)
       VALUES (gen_random_uuid(), $1, $2, 2.5, 1, 0, NOW(), 'new')`,
      [userId, cardId]
    );
    card = await pool.query(
      `SELECT * FROM spaced_repetition_cards WHERE user_id = $1 AND card_id = $2`,
      [userId, cardId]
    );
  }

  const c = card.rows[0];
  let easeFactor = c.ease_factor || 2.5;
  let interval = c.interval || 1;
  let repetitions = c.repetitions || 0;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  const status = quality >= 4 ? "mastered" : quality >= 3 ? "learning" : "difficult";

  await pool.query(
    `UPDATE spaced_repetition_cards SET
      ease_factor = $3, interval = $4, repetitions = $5,
      next_review_at = $6, last_reviewed_at = NOW(), status = $7, updated_at = NOW()
    WHERE user_id = $1 AND card_id = $2`,
    [userId, cardId, easeFactor, interval, repetitions, nextReview.toISOString(), status]
  );

  return { easeFactor, interval, repetitions, nextReviewAt: nextReview.toISOString(), status };
}

export async function getDueFlashcards(userId: string, limit: number = 20): Promise<any[]> {
  const result = await pool.query(
    `SELECT src.*, df.front, df.back, df.rationale, df.tags, df.difficulty
     FROM spaced_repetition_cards src
     LEFT JOIN deck_flashcards df ON df.id = src.card_id
     WHERE src.user_id = $1 AND src.next_review_at <= NOW()
     ORDER BY
       CASE src.status WHEN 'difficult' THEN 0 WHEN 'new' THEN 1 WHEN 'learning' THEN 2 ELSE 3 END,
       src.next_review_at ASC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

export async function checkExamPrepMode(userId: string): Promise<boolean> {
  const profile = await getOrCreateStudentProfile(userId);
  if (!profile.exam_date) return false;

  const daysUntilExam = Math.ceil(
    (new Date(profile.exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const shouldActivate = daysUntilExam <= 7 && daysUntilExam > 0;

  if (shouldActivate !== profile.exam_prep_mode_active) {
    await pool.query(
      `UPDATE student_study_profiles SET exam_prep_mode_active = $2, updated_at = NOW() WHERE user_id = $1`,
      [userId, shouldActivate]
    );
  }

  return shouldActivate;
}

export async function generateCourseFromBlueprint(blueprintId: string): Promise<any> {
  const bp = await pool.query(`SELECT * FROM exam_blueprints WHERE id = $1`, [blueprintId]);
  if (bp.rows.length === 0) throw new Error("Blueprint not found");

  const blueprint = bp.rows[0];
  const domains = (blueprint.domains || []) as any[];

  const structure = domains.map((domain: any, idx: number) => {
    const topics = (domain.topics || domain.subcategories || [domain.name]) as string[];
    return {
      moduleNumber: idx + 1,
      title: domain.name || domain.domain || `Module ${idx + 1}`,
      weight: domain.weight || domain.percentage || 0,
      lessons: topics.map((topic: string, tIdx: number) => ({
        lessonNumber: tIdx + 1,
        title: `${topic} - Fundamentals`,
        topic,
        type: "lesson",
        estimatedMinutes: 30,
      })),
      flashcardSets: topics.map((topic: string) => ({
        title: `${topic} Flashcards`,
        topic,
        estimatedCards: 20,
      })),
      practiceQuestions: topics.map((topic: string) => ({
        title: `${topic} Practice`,
        topic,
        estimatedQuestions: 10,
      })),
      drills: topics.length > 0 ? [{
        title: `${domain.name || "Module"} Drill`,
        topics,
        type: "mixed",
      }] : [],
    };
  });

  const totalLessons = structure.reduce((s: number, m: any) => s + m.lessons.length, 0);
  const totalFlashcards = structure.reduce((s: number, m: any) => s + m.flashcardSets.reduce((fs: number, f: any) => fs + f.estimatedCards, 0), 0);
  const totalQuestions = structure.reduce((s: number, m: any) => s + m.practiceQuestions.reduce((qs: number, q: any) => qs + q.estimatedQuestions, 0), 0);

  const result = await pool.query(
    `INSERT INTO generated_courses (id, blueprint_id, exam_code, title, description, status, structure, total_lessons, total_flashcards, total_questions)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, 'generated', $5, $6, $7, $8) RETURNING *`,
    [
      blueprintId,
      blueprint.exam_code,
      `${blueprint.exam_name} Preparation Course`,
      `Complete preparation course for ${blueprint.exam_name} covering all ${domains.length} domains`,
      JSON.stringify(structure),
      totalLessons,
      totalFlashcards,
      totalQuestions,
    ]
  );

  return result.rows[0];
}

export async function getAdminAggregateAnalytics(): Promise<any> {
  const totalStudents = await pool.query(`SELECT COUNT(DISTINCT user_id)::int as count FROM student_study_profiles`);

  const avgReadiness = await pool.query(
    `SELECT AVG(readiness_score)::int as avg_readiness, AVG(pass_probability)::int as avg_probability FROM student_study_profiles WHERE readiness_score > 0`
  );

  const readinessDistribution = await pool.query(
    `SELECT readiness_level, COUNT(*)::int as count FROM student_study_profiles GROUP BY readiness_level ORDER BY count DESC`
  );

  const topWeakTopics = await pool.query(
    `SELECT topic, COUNT(*)::int as student_count, AVG(mastery_percent)::int as avg_mastery
     FROM topic_mastery_scores WHERE mastery_label = 'weak'
     GROUP BY topic ORDER BY student_count DESC LIMIT 10`
  );

  const topStrongTopics = await pool.query(
    `SELECT topic, COUNT(*)::int as student_count, AVG(mastery_percent)::int as avg_mastery
     FROM topic_mastery_scores WHERE mastery_label IN ('proficient', 'mastery')
     GROUP BY topic ORDER BY student_count DESC LIMIT 10`
  );

  const dailyActivity = await pool.query(
    `SELECT date, SUM(questions_answered)::int as total_questions, AVG(accuracy)::int as avg_accuracy, COUNT(DISTINCT user_id)::int as active_students
     FROM accuracy_trends WHERE date >= (CURRENT_DATE - INTERVAL '30 days')::text
     GROUP BY date ORDER BY date DESC`
  );

  const streakDistribution = await pool.query(
    `SELECT
       CASE
         WHEN current_streak = 0 THEN '0 days'
         WHEN current_streak BETWEEN 1 AND 3 THEN '1-3 days'
         WHEN current_streak BETWEEN 4 AND 7 THEN '4-7 days'
         WHEN current_streak BETWEEN 8 AND 14 THEN '8-14 days'
         WHEN current_streak BETWEEN 15 AND 30 THEN '15-30 days'
         ELSE '30+ days'
       END as range,
       COUNT(*)::int as count
     FROM student_study_profiles GROUP BY range ORDER BY count DESC`
  );

  const practiceSessionStats = await pool.query(
    `SELECT COUNT(*)::int as total_sessions, AVG(score)::int as avg_score
     FROM custom_practice_sessions WHERE status = 'completed'`
  );

  return {
    totalStudents: totalStudents.rows[0]?.count || 0,
    avgReadinessScore: avgReadiness.rows[0]?.avg_readiness || 0,
    avgPassProbability: avgReadiness.rows[0]?.avg_probability || 0,
    readinessDistribution: readinessDistribution.rows,
    topWeakTopics: topWeakTopics.rows,
    topStrongTopics: topStrongTopics.rows,
    dailyActivity: dailyActivity.rows,
    streakDistribution: streakDistribution.rows,
    practiceSessionStats: practiceSessionStats.rows[0] || { total_sessions: 0, avg_score: 0 },
  };
}

export async function logStudyTime(userId: string, minutes: number): Promise<void> {
  await getOrCreateStudentProfile(userId);
  const today = new Date().toISOString().slice(0, 10);

  await pool.query(
    `UPDATE student_study_profiles SET
      total_study_minutes = total_study_minutes + $2,
      weekly_hours_logged = weekly_hours_logged + ($2::double precision / 60),
      updated_at = NOW()
    WHERE user_id = $1`,
    [userId, minutes]
  );

  const trendExists = await pool.query(
    `SELECT * FROM accuracy_trends WHERE user_id = $1 AND date = $2`,
    [userId, today]
  );
  if (trendExists.rows.length > 0) {
    await pool.query(
      `UPDATE accuracy_trends SET study_minutes = study_minutes + $3 WHERE user_id = $1 AND date = $2`,
      [userId, today, minutes]
    );
  } else {
    await pool.query(
      `INSERT INTO accuracy_trends (id, user_id, date, study_minutes) VALUES (gen_random_uuid(), $1, $2, $3)`,
      [userId, today, minutes]
    );
  }
}

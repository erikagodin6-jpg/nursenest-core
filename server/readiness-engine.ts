import { pool } from "./storage";

export type ReadinessTier = "early_preparation" | "developing" | "almost_ready" | "exam_ready";

export interface EnhancedReadinessResult {
  readinessScore: number;
  readinessTier: ReadinessTier;
  tierLabel: string;
  passProbability: number;
  passProbabilityMessage: string;
  factors: {
    overallAccuracy: number;
    recentPerformance: number;
    topicCoverage: number;
    practiceExamScore: number;
    timeManagement: number;
    flashcardRetention: number;
    difficultyProgression: number;
  };
  examType: string;
}

export interface PercentileResult {
  percentileRank: number;
  examType: string;
  comparisonStats: {
    avgReadinessScore: number;
    avgPassProbability: number;
    avgAccuracy: number;
    totalUsersCompared: number;
    userScore: number;
  };
}

export interface WeakTopicDetail {
  topic: string;
  accuracy: number;
  totalAttempts: number;
  masteryLevel: number;
  recommendedResources: {
    type: string;
    title: string;
    url: string;
  }[];
}

export interface PracticeRecommendationItem {
  type: "question_practice" | "study_guide" | "flashcard_review" | "mock_exam" | "topic_review";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
  metadata?: Record<string, any>;
}

const EXAM_PASSING_THRESHOLDS: Record<string, number> = {
  RN: 65,
  RPN: 60,
  LVN: 60,
  NP: 70,
  NCLEX: 65,
  certification: 70,
};

const TIER_LABELS: Record<ReadinessTier, string> = {
  early_preparation: "Early Preparation",
  developing: "Developing",
  almost_ready: "Almost Ready",
  exam_ready: "Exam Ready",
};

function getReadinessTier(score: number): ReadinessTier {
  if (score < 40) return "early_preparation";
  if (score < 65) return "developing";
  if (score < 85) return "almost_ready";
  return "exam_ready";
}

function getPassProbabilityMessage(probability: number): string {
  if (probability >= 90) return `You have a ${probability}% probability of passing the exam. Excellent preparation!`;
  if (probability >= 75) return `You have a ${probability}% probability of passing the exam. You're well-prepared!`;
  if (probability >= 60) return `You have a ${probability}% probability of passing the exam. Keep studying to improve your chances.`;
  if (probability >= 40) return `You have a ${probability}% probability of passing the exam. Focus on your weak areas to improve.`;
  return `You have a ${probability}% probability of passing the exam. More preparation is recommended before attempting the exam.`;
}

async function getUserExamType(userId: string): Promise<string> {
  const userResult = await pool.query(
    `SELECT tier FROM users WHERE id = $1`,
    [userId]
  );
  if (userResult.rows.length === 0) return "RN";
  const tier = userResult.rows[0].tier || "free";
  const tierToExam: Record<string, string> = {
    rpn: "RPN",
    rn: "RN",
    np: "NP",
    admin: "RN",
    free: "RN",
  };
  return tierToExam[tier] || "RN";
}

export async function calculateEnhancedReadiness(userId: string): Promise<EnhancedReadinessResult> {
  const examType = await getUserExamType(userId);

  const profileResult = await pool.query(
    `SELECT * FROM student_study_profiles WHERE user_id = $1`,
    [userId]
  );
  const profile = profileResult.rows[0] || {};

  const totalQ = profile.total_questions_answered || 0;
  const totalCorrect = profile.total_correct || 0;
  const overallAccuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;

  const recentResult = await pool.query(
    `SELECT * FROM accuracy_trends WHERE user_id = $1 ORDER BY date DESC LIMIT 7`,
    [userId]
  );
  let recentPerformance = 0;
  if (recentResult.rows.length > 0) {
    const totalRecent = recentResult.rows.reduce((s: number, d: any) => s + (d.questions_answered || 0), 0);
    const correctRecent = recentResult.rows.reduce((s: number, d: any) => s + (d.correct_count || 0), 0);
    recentPerformance = totalRecent > 0 ? Math.round((correctRecent / totalRecent) * 100) : 0;
  }

  const masteryResult = await pool.query(
    `SELECT * FROM topic_mastery_scores WHERE user_id = $1`,
    [userId]
  );
  const masteryScores = masteryResult.rows;
  const totalTopics = masteryScores.length;
  const proficientTopics = masteryScores.filter((t: any) => (t.mastery_percent || 0) >= 66).length;
  const topicCoverage = totalTopics > 0 ? Math.round((proficientTopics / totalTopics) * 100) : 0;

  const examResult = await pool.query(
    `SELECT score, total_questions, exam_type, report FROM mock_exam_attempts WHERE user_id = $1 AND status = 'completed' ORDER BY completed_at DESC LIMIT 10`,
    [userId]
  );
  let practiceExamScore = 0;
  if (examResult.rows.length > 0) {
    const flagshipExams = examResult.rows.filter((r: any) => r.exam_type === "flagship_mock");
    const regularExams = examResult.rows.filter((r: any) => r.exam_type !== "flagship_mock");

    let flagshipScore = 0;
    if (flagshipExams.length > 0) {
      const recent5 = flagshipExams.slice(0, 5);
      const totalScore = recent5.reduce((s: number, r: any) => s + (r.score || 0), 0);
      flagshipScore = Math.round(totalScore / recent5.length);
    }

    let regularScore = 0;
    if (regularExams.length > 0) {
      const recent5 = regularExams.slice(0, 5);
      const totalQ = recent5.reduce((s: number, r: any) => s + (r.total_questions || 0), 0);
      const totalS = recent5.reduce((s: number, r: any) => s + (r.score || 0), 0);
      regularScore = totalQ > 0 ? Math.round((totalS / totalQ) * 100) : 0;
    }

    if (flagshipExams.length > 0 && regularExams.length > 0) {
      practiceExamScore = Math.round(flagshipScore * 0.7 + regularScore * 0.3);
    } else if (flagshipExams.length > 0) {
      practiceExamScore = flagshipScore;
    } else {
      practiceExamScore = regularScore;
    }
  }

  const avgTime = profile.avg_time_per_question || 0;
  const timeManagement = avgTime > 0 && avgTime <= 90 ? Math.min(100, Math.round((90 / avgTime) * 80)) : avgTime === 0 ? 0 : 50;

  let flashcardRetention = 0;
  try {
    const srResult = await pool.query(
      `SELECT COUNT(*) as total, SUM(CASE WHEN ucs.mastered = true THEN 1 ELSE 0 END) as mastered_count,
              AVG(CASE WHEN ucs.times_seen > 0 THEN ucs.times_correct::float / ucs.times_seen ELSE 0 END) as avg_retention
       FROM user_card_stats ucs WHERE ucs.user_id = $1 AND ucs.times_seen > 0`,
      [userId]
    );
    if (srResult.rows[0] && parseInt(srResult.rows[0].total) > 0) {
      flashcardRetention = Math.round((parseFloat(srResult.rows[0].avg_retention) || 0) * 100);
    }
  } catch { flashcardRetention = 0; }

  let difficultyProgression = 0;
  try {
    const diffResult = await pool.query(
      `SELECT mastery_level, total_attempts, correct_count FROM user_mastery_profiles WHERE user_id = $1 AND total_attempts >= 3`,
      [userId]
    );
    if (diffResult.rows.length > 0) {
      const avgMastery = diffResult.rows.reduce((s: number, r: any) => s + (r.mastery_level || 0), 0) / diffResult.rows.length;
      difficultyProgression = Math.round(avgMastery * 100);
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

  const readinessTier = getReadinessTier(score);

  const weakCount = masteryScores.filter((t: any) => (t.mastery_percent || 0) <= 40).length;
  const developingCount = masteryScores.filter((t: any) => {
    const p = t.mastery_percent || 0;
    return p > 40 && p <= 65;
  }).length;
  const profCount = masteryScores.filter((t: any) => {
    const p = t.mastery_percent || 0;
    return p > 65 && p < 85;
  }).length;
  const masteryCount = masteryScores.filter((t: any) => (t.mastery_percent || 0) >= 85).length;

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
    [userId, score, readinessTier, passProbability]
  );

  return {
    readinessScore: score,
    readinessTier,
    tierLabel: TIER_LABELS[readinessTier],
    passProbability,
    passProbabilityMessage: getPassProbabilityMessage(passProbability),
    factors: {
      overallAccuracy,
      recentPerformance,
      topicCoverage,
      practiceExamScore,
      timeManagement,
      flashcardRetention,
      difficultyProgression,
    },
    examType,
  };
}

export async function calculatePassProbability(userId: string): Promise<{
  passProbability: number;
  message: string;
  examType: string;
  factors: Record<string, number>;
}> {
  const readiness = await calculateEnhancedReadiness(userId);
  return {
    passProbability: readiness.passProbability,
    message: readiness.passProbabilityMessage,
    examType: readiness.examType,
    factors: readiness.factors,
  };
}

export async function calculatePercentileRank(userId: string): Promise<PercentileResult> {
  const readiness = await calculateEnhancedReadiness(userId);
  const examType = readiness.examType;

  const benchmarkResult = await pool.query(
    `SELECT * FROM benchmark_profiles WHERE exam_type = $1`,
    [examType]
  );

  if (benchmarkResult.rows.length === 0) {
    return {
      percentileRank: 50,
      examType,
      comparisonStats: {
        avgReadinessScore: 50,
        avgPassProbability: 50,
        avgAccuracy: 50,
        totalUsersCompared: 0,
        userScore: readiness.readinessScore,
      },
    };
  }

  const benchmark = benchmarkResult.rows[0];
  const breakpoints = (benchmark.percentile_breakpoints || []) as number[];

  let percentileRank = 50;
  if (breakpoints.length > 0) {
    const belowCount = breakpoints.filter((bp: number) => readiness.readinessScore > bp).length;
    percentileRank = Math.round((belowCount / breakpoints.length) * 100);
  } else if (benchmark.avg_readiness_score > 0) {
    const ratio = readiness.readinessScore / benchmark.avg_readiness_score;
    percentileRank = Math.min(99, Math.max(1, Math.round(ratio * 50)));
  }

  return {
    percentileRank,
    examType,
    comparisonStats: {
      avgReadinessScore: Math.round(benchmark.avg_readiness_score || 0),
      avgPassProbability: Math.round(benchmark.avg_pass_probability || 0),
      avgAccuracy: Math.round(benchmark.avg_accuracy || 0),
      totalUsersCompared: benchmark.total_users || 0,
      userScore: readiness.readinessScore,
    },
  };
}

export async function detectWeakTopics(userId: string): Promise<WeakTopicDetail[]> {
  const masteryResult = await pool.query(
    `SELECT topic, subtopic, total_attempts, correct_count, mastery_percent, mastery_label
     FROM topic_mastery_scores WHERE user_id = $1 AND total_attempts >= 2
     ORDER BY mastery_percent ASC LIMIT 5`,
    [userId]
  );

  const weakTopics: WeakTopicDetail[] = [];

  for (const row of masteryResult.rows) {
    const accuracy = row.total_attempts > 0
      ? Math.round((row.correct_count / row.total_attempts) * 100)
      : 0;

    const topicSlug = (row.topic || "general").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    weakTopics.push({
      topic: row.topic,
      accuracy,
      totalAttempts: row.total_attempts,
      masteryLevel: row.mastery_percent || 0,
      recommendedResources: [
        {
          type: "study_guide",
          title: `${row.topic} Study Guide`,
          url: `/lessons?topic=${encodeURIComponent(row.topic)}`,
        },
        {
          type: "question_bank",
          title: `${row.topic} Practice Questions`,
          url: `/test-bank?topic=${encodeURIComponent(row.topic)}`,
        },
        {
          type: "flashcards",
          title: `${row.topic} Flashcards`,
          url: `/flashcard-study?topic=${encodeURIComponent(row.topic)}`,
        },
      ],
    });
  }

  if (weakTopics.length === 0) {
    const umpResult = await pool.query(
      `SELECT topic, total_attempts, correct_count, mastery_level
       FROM user_mastery_profiles WHERE user_id = $1 AND total_attempts >= 2
       ORDER BY mastery_level ASC LIMIT 5`,
      [userId]
    );
    for (const row of umpResult.rows) {
      const accuracy = row.total_attempts > 0
        ? Math.round((row.correct_count / row.total_attempts) * 100)
        : 0;
      weakTopics.push({
        topic: row.topic,
        accuracy,
        totalAttempts: row.total_attempts,
        masteryLevel: Math.round((row.mastery_level || 0) * 100),
        recommendedResources: [
          {
            type: "study_guide",
            title: `${row.topic} Study Guide`,
            url: `/lessons?topic=${encodeURIComponent(row.topic)}`,
          },
          {
            type: "question_bank",
            title: `${row.topic} Practice Questions`,
            url: `/test-bank?topic=${encodeURIComponent(row.topic)}`,
          },
        ],
      });
    }
  }

  return weakTopics;
}

export async function generateRecommendations(userId: string): Promise<PracticeRecommendationItem[]> {
  const recommendations: PracticeRecommendationItem[] = [];

  const weakTopics = await detectWeakTopics(userId);
  const readiness = await calculateEnhancedReadiness(userId);

  if (weakTopics.length > 0) {
    const top = weakTopics[0];
    recommendations.push({
      type: "question_practice",
      title: `Practice 50 ${top.topic} questions`,
      description: `Your accuracy in ${top.topic} is ${top.accuracy}%. Focused practice will strengthen this area.`,
      priority: "high",
      actionUrl: `/test-bank?topic=${encodeURIComponent(top.topic)}`,
      metadata: { topic: top.topic, questionCount: 50 },
    });
  }

  if (weakTopics.length > 1) {
    const second = weakTopics[1];
    recommendations.push({
      type: "study_guide",
      title: `Review ${second.topic} study guide`,
      description: `Reviewing the fundamentals of ${second.topic} will help improve your ${second.accuracy}% accuracy.`,
      priority: "high",
      actionUrl: `/lessons?topic=${encodeURIComponent(second.topic)}`,
      metadata: { topic: second.topic },
    });
  }

  if (readiness.factors.flashcardRetention < 60) {
    recommendations.push({
      type: "flashcard_review",
      title: "Review due flashcards",
      description: `Your flashcard retention is at ${readiness.factors.flashcardRetention}%. Daily flashcard review builds long-term recall.`,
      priority: "medium",
      actionUrl: "/flashcard-study",
    });
  }

  if (readiness.factors.practiceExamScore < 65) {
    recommendations.push({
      type: "mock_exam",
      title: "Take a practice exam",
      description: "Practice exams simulate real test conditions and help identify gaps in your preparation.",
      priority: "medium",
      actionUrl: "/mock-exams",
    });
  }

  if (readiness.readinessScore >= 70 && weakTopics.length > 0) {
    recommendations.push({
      type: "topic_review",
      title: `Final review: ${weakTopics.map(t => t.topic).slice(0, 3).join(", ")}`,
      description: "You're almost ready! A targeted review of your remaining weak areas will boost your confidence.",
      priority: "low",
      actionUrl: "/lessons",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: "question_practice",
      title: "Start practicing questions",
      description: "Begin your exam preparation by answering practice questions across all topics.",
      priority: "high",
      actionUrl: "/test-bank",
    });
    recommendations.push({
      type: "study_guide",
      title: "Review study materials",
      description: "Build a strong foundation by reviewing lesson content and study guides.",
      priority: "medium",
      actionUrl: "/lessons",
    });
  }

  const cacheExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO practice_recommendations (id, user_id, recommendations, generated_at, expires_at)
     VALUES (gen_random_uuid(), $1, $2, NOW(), $3)
     ON CONFLICT (user_id) DO UPDATE SET recommendations = $2, generated_at = NOW(), expires_at = $3`,
    [userId, JSON.stringify(recommendations.slice(0, 5)), cacheExpiry]
  );

  return recommendations.slice(0, 5);
}

export async function createReadinessSnapshot(userId: string): Promise<{
  readinessScore: number;
  passProbability: number;
  readinessTier: string;
  snapshotWeek: string;
}> {
  const readiness = await calculateEnhancedReadiness(userId);

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const snapshotWeek = `${now.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;

  await pool.query(
    `INSERT INTO readiness_history (id, user_id, readiness_score, pass_probability, readiness_tier, exam_type, factors, snapshot_week, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (user_id, snapshot_week) DO UPDATE SET
       readiness_score = $2, pass_probability = $3, readiness_tier = $4, exam_type = $5, factors = $6, created_at = NOW()`,
    [userId, readiness.readinessScore, readiness.passProbability, readiness.readinessTier, readiness.examType, JSON.stringify(readiness.factors), snapshotWeek]
  );

  return {
    readinessScore: readiness.readinessScore,
    passProbability: readiness.passProbability,
    readinessTier: readiness.readinessTier,
    snapshotWeek,
  };
}

export async function getReadinessHistory(userId: string, limit = 52): Promise<any[]> {
  const result = await pool.query(
    `SELECT * FROM readiness_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows.map((r: any) => ({
    readinessScore: r.readiness_score,
    passProbability: r.pass_probability,
    readinessTier: r.readiness_tier,
    examType: r.exam_type,
    factors: r.factors,
    snapshotWeek: r.snapshot_week,
    createdAt: r.created_at,
  })).reverse();
}

export async function recomputeBenchmarkProfiles(): Promise<{ examType: string; totalUsers: number }[]> {
  const examTypes = ["RN", "RPN", "LVN", "NP", "certification"];
  const results: { examType: string; totalUsers: number }[] = [];

  for (const examType of examTypes) {
    const tierMapping: Record<string, string[]> = {
      RN: ["rn", "admin"],
      RPN: ["rpn"],
      LVN: ["rpn"],
      NP: ["np"],
      certification: ["rn", "rpn", "np"],
    };
    const tiers = tierMapping[examType] || ["rn"];

    const statsResult = await pool.query(
      `SELECT
        COUNT(DISTINCT ssp.user_id) as total_users,
        AVG(ssp.readiness_score) as avg_readiness,
        AVG(ssp.pass_probability) as avg_pass_prob,
        AVG(CASE WHEN ssp.total_questions_answered > 0
          THEN ssp.total_correct::float / ssp.total_questions_answered * 100
          ELSE 0 END) as avg_accuracy,
        AVG(ssp.total_questions_answered) as avg_questions
       FROM student_study_profiles ssp
       JOIN users u ON u.id = ssp.user_id
       WHERE u.tier = ANY($1) AND ssp.total_questions_answered >= 10`,
      [tiers]
    );

    const stats = statsResult.rows[0];
    const totalUsers = parseInt(stats.total_users) || 0;

    const scoresResult = await pool.query(
      `SELECT ssp.readiness_score
       FROM student_study_profiles ssp
       JOIN users u ON u.id = ssp.user_id
       WHERE u.tier = ANY($1) AND ssp.total_questions_answered >= 10
       ORDER BY ssp.readiness_score ASC`,
      [tiers]
    );
    const scores = scoresResult.rows.map((r: any) => r.readiness_score || 0);

    const distribution: Record<string, number> = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
    for (const s of scores) {
      if (s <= 20) distribution["0-20"]++;
      else if (s <= 40) distribution["21-40"]++;
      else if (s <= 60) distribution["41-60"]++;
      else if (s <= 80) distribution["61-80"]++;
      else distribution["81-100"]++;
    }

    const masteryResult = await pool.query(
      `SELECT COUNT(DISTINCT tms.topic) as avg_topic_count
       FROM topic_mastery_scores tms
       JOIN users u ON u.id = tms.user_id
       WHERE u.tier = ANY($1) AND tms.mastery_percent >= 66`,
      [tiers]
    );
    const avgTopicCoverage = parseFloat(masteryResult.rows[0]?.avg_topic_count) || 0;

    const passingThreshold = EXAM_PASSING_THRESHOLDS[examType] || 65;

    await pool.query(
      `INSERT INTO benchmark_profiles (id, exam_type, total_users, avg_readiness_score, avg_pass_probability, avg_accuracy, avg_questions_answered, avg_topic_coverage, passing_threshold, score_distribution, percentile_breakpoints, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (exam_type) DO UPDATE SET
         total_users = $2, avg_readiness_score = $3, avg_pass_probability = $4,
         avg_accuracy = $5, avg_questions_answered = $6, avg_topic_coverage = $7,
         passing_threshold = $8, score_distribution = $9, percentile_breakpoints = $10, updated_at = NOW()`,
      [examType, totalUsers, parseFloat(stats.avg_readiness) || 0, parseFloat(stats.avg_pass_prob) || 0, parseFloat(stats.avg_accuracy) || 0, parseFloat(stats.avg_questions) || 0, avgTopicCoverage, passingThreshold, JSON.stringify(distribution), JSON.stringify(scores)]
    );

    results.push({ examType, totalUsers });
  }

  return results;
}

export async function getAdminReadinessAnalytics(): Promise<{
  totalStudents: number;
  avgReadinessScore: number;
  distribution: Record<string, number>;
  tierDistribution: Record<string, number>;
  trends: { week: string; avgScore: number; count: number }[];
  topicDifficulty: { topic: string; avgAccuracy: number; totalAttempts: number }[];
  predictionAccuracy: number;
}> {
  const totalResult = await pool.query(
    `SELECT COUNT(*) as total, AVG(readiness_score) as avg_score FROM student_study_profiles WHERE total_questions_answered >= 5`
  );
  const totalStudents = parseInt(totalResult.rows[0].total) || 0;
  const avgReadinessScore = Math.round(parseFloat(totalResult.rows[0].avg_score) || 0);

  const distResult = await pool.query(
    `SELECT
      SUM(CASE WHEN readiness_score < 40 THEN 1 ELSE 0 END) as early_preparation,
      SUM(CASE WHEN readiness_score >= 40 AND readiness_score < 65 THEN 1 ELSE 0 END) as developing,
      SUM(CASE WHEN readiness_score >= 65 AND readiness_score < 85 THEN 1 ELSE 0 END) as almost_ready,
      SUM(CASE WHEN readiness_score >= 85 THEN 1 ELSE 0 END) as exam_ready
     FROM student_study_profiles WHERE total_questions_answered >= 5`
  );
  const distribution: Record<string, number> = {
    early_preparation: parseInt(distResult.rows[0]?.early_preparation) || 0,
    developing: parseInt(distResult.rows[0]?.developing) || 0,
    almost_ready: parseInt(distResult.rows[0]?.almost_ready) || 0,
    exam_ready: parseInt(distResult.rows[0]?.exam_ready) || 0,
  };

  const tierDistribution = distribution;

  const trendsResult = await pool.query(
    `SELECT snapshot_week, AVG(readiness_score) as avg_score, COUNT(*) as cnt
     FROM readiness_history
     GROUP BY snapshot_week ORDER BY snapshot_week DESC LIMIT 12`
  );
  const trends = trendsResult.rows.map((r: any) => ({
    week: r.snapshot_week,
    avgScore: Math.round(parseFloat(r.avg_score) || 0),
    count: parseInt(r.cnt) || 0,
  })).reverse();

  const topicResult = await pool.query(
    `SELECT topic, AVG(mastery_percent) as avg_accuracy, SUM(total_attempts) as total_attempts
     FROM topic_mastery_scores WHERE total_attempts >= 5
     GROUP BY topic ORDER BY avg_accuracy ASC LIMIT 20`
  );
  const topicDifficulty = topicResult.rows.map((r: any) => ({
    topic: r.topic,
    avgAccuracy: Math.round(parseFloat(r.avg_accuracy) || 0),
    totalAttempts: parseInt(r.total_attempts) || 0,
  }));

  return {
    totalStudents,
    avgReadinessScore,
    distribution,
    tierDistribution,
    trends,
    topicDifficulty,
    predictionAccuracy: 0,
  };
}

export const ACTIVE_BUILD_PRIORITY = {
  current: "readiness_prediction_engine",
  version: "1.0.0",
  features: [
    "enhanced_readiness_scoring",
    "pass_probability_estimation",
    "percentile_benchmarking",
    "weak_topic_detection",
    "personalized_recommendations",
    "historical_tracking",
    "multi_tier_calibration",
  ],
};

export const CONTENT_EXPANSION_ROADMAP = {
  phase1: {
    name: "Readiness Intelligence",
    status: "active",
    items: [
      "Enhanced readiness scoring with flashcard retention",
      "Pass probability with multi-factor model",
      "Percentile benchmarking per exam type",
      "Weak topic detection with resource linking",
      "Weekly readiness snapshots",
    ],
  },
  phase2: {
    name: "Advanced Analytics",
    status: "planned",
    items: [
      "AI-powered study recommendations",
      "Predictive exam date optimization",
      "Peer comparison dashboards",
      "Custom study plan generation from readiness gaps",
    ],
  },
  phase3: {
    name: "Social & Competitive",
    status: "future",
    items: [
      "Study group readiness tracking",
      "Leaderboards by exam type",
      "Challenge mode between peers",
      "Institutional readiness dashboards",
    ],
  },
};

export async function ensureReadinessTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS readiness_history (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      readiness_score INTEGER DEFAULT 0 NOT NULL,
      pass_probability INTEGER DEFAULT 0 NOT NULL,
      readiness_tier TEXT DEFAULT 'early_preparation' NOT NULL,
      exam_type TEXT DEFAULT 'RN' NOT NULL,
      factors JSONB DEFAULT '{}'::jsonb,
      snapshot_week TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      UNIQUE(user_id, snapshot_week)
    );

    CREATE TABLE IF NOT EXISTS benchmark_profiles (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      exam_type TEXT NOT NULL UNIQUE,
      total_users INTEGER DEFAULT 0 NOT NULL,
      avg_readiness_score DOUBLE PRECISION DEFAULT 0 NOT NULL,
      avg_pass_probability DOUBLE PRECISION DEFAULT 0 NOT NULL,
      avg_accuracy DOUBLE PRECISION DEFAULT 0 NOT NULL,
      avg_questions_answered DOUBLE PRECISION DEFAULT 0 NOT NULL,
      avg_topic_coverage DOUBLE PRECISION DEFAULT 0 NOT NULL,
      passing_threshold INTEGER DEFAULT 65 NOT NULL,
      score_distribution JSONB DEFAULT '{}'::jsonb,
      percentile_breakpoints JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS practice_recommendations (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL UNIQUE,
      recommendations JSONB DEFAULT '[]'::jsonb NOT NULL,
      generated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      expires_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_readiness_history_user ON readiness_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_readiness_history_week ON readiness_history(snapshot_week);
    CREATE INDEX IF NOT EXISTS idx_benchmark_profiles_exam ON benchmark_profiles(exam_type);
    CREATE INDEX IF NOT EXISTS idx_practice_recommendations_user ON practice_recommendations(user_id);
  `);
}

import { pool } from "./storage";
import { getTierConfig } from "../shared/tier-config";

export type StudyPhase = "foundation" | "practice" | "timed_review" | "final_review";
export type Intensity = "light" | "balanced" | "intensive";

export interface StudyPhaseInfo {
  phase: StudyPhase;
  label: string;
  description: string;
  daysRemaining: number;
  color: string;
  icon: string;
  contentPriority: string[];
  ctaFocus: string;
}

export interface PacingTargets {
  questionsPerDay: number;
  flashcardsPerWeek: number;
  mocksToTake: number;
  weakAreasToReview: number;
  lessonsPerWeek: number;
  studyMinutesPerDay: number;
}

export interface WeeklyPlanTargets {
  weekNumber: number;
  phase: StudyPhase;
  questionsTarget: number;
  flashcardsTarget: number;
  lessonsTarget: number;
  mockExamsTarget: number;
  focusAreas: string[];
  studyRhythm: string;
  recommendations: string[];
}

export interface StudyPlanRecommendation {
  type: "next_action" | "area_focus" | "content_mix" | "intensity_tip";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
  actionLabel?: string;
}

export interface GeneratedStudyPlan {
  phase: StudyPhaseInfo;
  pacingTargets: PacingTargets;
  weeklyPlan: WeeklyPlanTargets[];
  recommendations: StudyPlanRecommendation[];
  onTrackStatus: "ahead" | "on_track" | "slightly_behind" | "needs_attention";
  onTrackMessage: string;
  strongestAreas: string[];
  weakestAreas: string[];
  contentMix: { type: string; percentage: number }[];
  generatedAt: string;
}

export function getStudyPhase(daysRemaining: number): StudyPhaseInfo {
  if (daysRemaining >= 90) {
    return {
      phase: "foundation",
      label: "Foundation Building",
      description: "Focus on understanding core concepts and building a strong knowledge base.",
      daysRemaining,
      color: "blue",
      icon: "BookOpen",
      contentPriority: ["lessons", "flashcards", "practice_questions", "review"],
      ctaFocus: "Start with lessons and flashcards to build your foundation",
    };
  }
  if (daysRemaining >= 45) {
    return {
      phase: "practice",
      label: "Active Practice",
      description: "Apply your knowledge through focused practice and identify gaps.",
      daysRemaining,
      color: "purple",
      icon: "Target",
      contentPriority: ["practice_questions", "flashcards", "mock_exams", "lessons"],
      ctaFocus: "Focus on practice questions and targeted review",
    };
  }
  if (daysRemaining >= 14) {
    return {
      phase: "timed_review",
      label: "Timed Review",
      description: "Simulate exam conditions and sharpen your timing and test-taking strategy.",
      daysRemaining,
      color: "amber",
      icon: "Clock",
      contentPriority: ["mock_exams", "practice_questions", "flashcards", "review"],
      ctaFocus: "Take timed practice exams and review weak areas",
    };
  }
  return {
    phase: "final_review",
    label: "Final Review",
    description: "Light review and confidence building. Trust your preparation!",
    daysRemaining,
    color: "emerald",
    icon: "CheckCircle",
    contentPriority: ["review", "flashcards", "mock_exams"],
    ctaFocus: "Do light review and trust your preparation",
  };
}

const INTENSITY_MULTIPLIERS: Record<Intensity, number> = {
  light: 0.7,
  balanced: 1.0,
  intensive: 1.4,
};

const INTENSITY_MINUTES: Record<Intensity, number> = {
  light: 45,
  balanced: 75,
  intensive: 120,
};

export function calculatePacingTargets(
  daysRemaining: number,
  intensity: Intensity,
  phase: StudyPhase,
  progressData: {
    questionsCompleted: number;
    totalAvailable: number;
    flashcardsStudied: number;
    mocksCompleted: number;
    weakAreaCount: number;
  }
): PacingTargets {
  const multiplier = INTENSITY_MULTIPLIERS[intensity];
  const minutesPerDay = INTENSITY_MINUTES[intensity];
  const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));

  const remainingQuestions = Math.max(0, progressData.totalAvailable - progressData.questionsCompleted);
  const baseQuestionsPerDay = daysRemaining > 0 ? Math.ceil(remainingQuestions / daysRemaining * 0.6) : 20;

  let questionsPerDay: number;
  let flashcardsPerWeek: number;
  let mocksToTake: number;
  let lessonsPerWeek: number;

  switch (phase) {
    case "foundation":
      questionsPerDay = Math.round(Math.max(10, baseQuestionsPerDay * 0.6) * multiplier);
      flashcardsPerWeek = Math.round(50 * multiplier);
      mocksToTake = Math.round(Math.max(1, weeksRemaining * 0.3) * multiplier);
      lessonsPerWeek = Math.round(5 * multiplier);
      break;
    case "practice":
      questionsPerDay = Math.round(Math.max(15, baseQuestionsPerDay * 0.8) * multiplier);
      flashcardsPerWeek = Math.round(40 * multiplier);
      mocksToTake = Math.round(Math.max(1, weeksRemaining * 0.5) * multiplier);
      lessonsPerWeek = Math.round(3 * multiplier);
      break;
    case "timed_review":
      questionsPerDay = Math.round(Math.max(20, baseQuestionsPerDay) * multiplier);
      flashcardsPerWeek = Math.round(30 * multiplier);
      mocksToTake = Math.round(Math.max(2, weeksRemaining * 0.8) * multiplier);
      lessonsPerWeek = Math.round(2 * multiplier);
      break;
    case "final_review":
      questionsPerDay = Math.round(Math.max(10, baseQuestionsPerDay * 0.5) * multiplier);
      flashcardsPerWeek = Math.round(20 * multiplier);
      mocksToTake = Math.round(Math.max(1, Math.min(3, weeksRemaining)) * multiplier);
      lessonsPerWeek = Math.round(1 * multiplier);
      break;
  }

  return {
    questionsPerDay: Math.min(questionsPerDay, 80),
    flashcardsPerWeek: Math.min(flashcardsPerWeek, 100),
    mocksToTake: Math.min(mocksToTake, 10),
    weakAreasToReview: Math.min(progressData.weakAreaCount, 5),
    lessonsPerWeek: Math.min(lessonsPerWeek, 10),
    studyMinutesPerDay: minutesPerDay,
  };
}

export function generateWeeklyPlan(
  daysRemaining: number,
  intensity: Intensity,
  weakAreas: string[],
  strongAreas: string[],
  tierBlueprintCategories: { id: string; label: string; weight: number }[],
  weeksToGenerate: number = 4
): WeeklyPlanTargets[] {
  const multiplier = INTENSITY_MULTIPLIERS[intensity];
  const weeks: WeeklyPlanTargets[] = [];

  for (let w = 1; w <= weeksToGenerate; w++) {
    const weekDaysRemaining = Math.max(0, daysRemaining - (w - 1) * 7);
    const phase = getStudyPhase(weekDaysRemaining).phase;

    const focusAreas: string[] = [];
    if (weakAreas.length > 0) {
      focusAreas.push(...weakAreas.slice(0, Math.min(3, weakAreas.length)));
    }
    if (focusAreas.length < 3 && tierBlueprintCategories.length > 0) {
      const topCategories = tierBlueprintCategories
        .sort((a, b) => b.weight - a.weight)
        .map(c => c.label)
        .filter(l => !focusAreas.includes(l));
      focusAreas.push(...topCategories.slice(0, 3 - focusAreas.length));
    }

    let questionsTarget: number;
    let flashcardsTarget: number;
    let lessonsTarget: number;
    let mockExamsTarget: number;
    let studyRhythm: string;
    const recommendations: string[] = [];

    switch (phase) {
      case "foundation":
        questionsTarget = Math.round(50 * multiplier);
        flashcardsTarget = Math.round(50 * multiplier);
        lessonsTarget = Math.round(5 * multiplier);
        mockExamsTarget = 0;
        studyRhythm = "Study 5 days, rest 2 days. Focus on learning new concepts.";
        recommendations.push("Start each day with a lesson, then reinforce with flashcards");
        recommendations.push("End sessions with 10 practice questions to test understanding");
        break;
      case "practice":
        questionsTarget = Math.round(80 * multiplier);
        flashcardsTarget = Math.round(40 * multiplier);
        lessonsTarget = Math.round(3 * multiplier);
        mockExamsTarget = Math.round(1 * multiplier);
        studyRhythm = "Study 5-6 days. Mix practice with targeted review.";
        recommendations.push("Prioritize practice questions in your weak areas");
        recommendations.push("Review incorrect answers thoroughly before moving on");
        break;
      case "timed_review":
        questionsTarget = Math.round(100 * multiplier);
        flashcardsTarget = Math.round(30 * multiplier);
        lessonsTarget = Math.round(2 * multiplier);
        mockExamsTarget = Math.round(2 * multiplier);
        studyRhythm = "Study 6 days. Simulate exam conditions regularly.";
        recommendations.push("Take at least one full-length practice exam this week");
        recommendations.push("Time yourself on practice questions to build speed");
        break;
      case "final_review":
        questionsTarget = Math.round(40 * multiplier);
        flashcardsTarget = Math.round(20 * multiplier);
        lessonsTarget = Math.round(1 * multiplier);
        mockExamsTarget = 1;
        studyRhythm = "Study 4-5 days with lighter sessions. Rest is important now.";
        recommendations.push("Focus on high-yield topics and your strongest areas");
        recommendations.push("Get plenty of rest - you've put in the work!");
        break;
    }

    if (weakAreas.length > 0) {
      recommendations.push(`Give extra attention to: ${weakAreas.slice(0, 2).join(", ")}`);
    }
    if (strongAreas.length > 0) {
      recommendations.push(`Great progress in: ${strongAreas.slice(0, 2).join(", ")} - keep it up!`);
    }

    weeks.push({
      weekNumber: w,
      phase,
      questionsTarget,
      flashcardsTarget,
      lessonsTarget,
      mockExamsTarget,
      focusAreas,
      studyRhythm,
      recommendations,
    });
  }

  return weeks;
}

export function generateRecommendations(
  phase: StudyPhaseInfo,
  intensity: Intensity,
  progressData: {
    questionsCompleted: number;
    totalAvailable: number;
    flashcardsStudied: number;
    mocksCompleted: number;
    weakAreaCount: number;
    readinessScore: number;
    overallAccuracy: number;
    lessonsViewed: number;
  },
  weakAreas: string[],
  strongAreas: string[],
  tierConfig: ReturnType<typeof getTierConfig>
): StudyPlanRecommendation[] {
  const recommendations: StudyPlanRecommendation[] = [];

  if (weakAreas.length > 0) {
    recommendations.push({
      type: "next_action",
      title: `Review ${weakAreas[0]}`,
      description: `This area needs some attention. A focused study session will help strengthen your understanding.`,
      priority: "high",
      actionUrl: "/lessons",
      actionLabel: "Start Review",
    });
  }

  if (progressData.mocksCompleted === 0 && phase.phase !== "foundation") {
    recommendations.push({
      type: "next_action",
      title: "Take Your First Practice Exam",
      description: "Practice exams are a great way to gauge your readiness and identify areas to focus on.",
      priority: "high",
      actionUrl: "/mock-exams",
      actionLabel: "Start Practice Exam",
    });
  }

  if (progressData.flashcardsStudied < 20) {
    recommendations.push({
      type: "next_action",
      title: "Build Your Flashcard Habit",
      description: "Flashcards are excellent for retention. Try reviewing 10-20 cards daily.",
      priority: "medium",
      actionUrl: "/flashcard-study",
      actionLabel: "Study Flashcards",
    });
  }

  const qCompletion = progressData.totalAvailable > 0
    ? (progressData.questionsCompleted / progressData.totalAvailable) * 100
    : 0;
  if (qCompletion < 30) {
    recommendations.push({
      type: "content_mix",
      title: "Increase Question Practice",
      description: `You've completed ${Math.round(qCompletion)}% of available questions. Consistent practice builds confidence.`,
      priority: "medium",
      actionUrl: "/test-bank",
      actionLabel: "Practice Questions",
    });
  }

  if (progressData.overallAccuracy > 0 && progressData.overallAccuracy < 60) {
    recommendations.push({
      type: "area_focus",
      title: "Strengthen Your Foundation",
      description: "Your accuracy shows room for growth. Focus on understanding concepts before speed.",
      priority: "high",
      actionUrl: "/lessons",
      actionLabel: "Review Lessons",
    });
  }

  if (strongAreas.length > 0) {
    recommendations.push({
      type: "intensity_tip",
      title: `You're excelling in ${strongAreas[0]}!`,
      description: "Keep up the great work. Periodic review will help maintain this strength.",
      priority: "low",
    });
  }

  switch (phase.phase) {
    case "foundation":
      recommendations.push({
        type: "intensity_tip",
        title: "You Have Time - Build Steadily",
        description: "With plenty of time remaining, focus on thorough understanding rather than rushing.",
        priority: "low",
      });
      break;
    case "practice":
      recommendations.push({
        type: "content_mix",
        title: "Diversify Your Practice",
        description: "Mix question types and topics to build well-rounded preparation.",
        priority: "medium",
        actionUrl: "/test-bank",
        actionLabel: "Mixed Practice",
      });
      break;
    case "timed_review":
      recommendations.push({
        type: "intensity_tip",
        title: "Focus on Exam Strategy",
        description: "Practice time management and question prioritization alongside content review.",
        priority: "medium",
      });
      break;
    case "final_review":
      recommendations.push({
        type: "intensity_tip",
        title: "You've Done the Work!",
        description: "Trust your preparation. Light review and rest will serve you well now.",
        priority: "low",
      });
      break;
  }

  return recommendations.slice(0, 6);
}

function getOnTrackStatus(
  progressData: {
    questionsCompleted: number;
    totalAvailable: number;
    readinessScore: number;
    overallAccuracy: number;
  },
  daysRemaining: number
): { status: "ahead" | "on_track" | "slightly_behind" | "needs_attention"; message: string } {
  const qCompletion = progressData.totalAvailable > 0
    ? (progressData.questionsCompleted / progressData.totalAvailable) * 100
    : 0;

  const expectedCompletion = daysRemaining > 0
    ? Math.max(0, 100 - (daysRemaining / 120) * 100)
    : 100;

  const diff = qCompletion - expectedCompletion;

  if (diff >= 15 || progressData.readinessScore >= 80) {
    return {
      status: "ahead",
      message: "You're ahead of schedule! Your consistent effort is paying off. Keep up the great momentum!",
    };
  }
  if (diff >= -5 || progressData.readinessScore >= 60) {
    return {
      status: "on_track",
      message: "You're right on track with your preparation. Stay consistent and you'll be well-prepared!",
    };
  }
  if (diff >= -20 || progressData.readinessScore >= 40) {
    return {
      status: "slightly_behind",
      message: "You're a bit behind your target pace, but there's plenty of time to catch up. A little extra focus this week will make a difference!",
    };
  }
  return {
    status: "needs_attention",
    message: "Your preparation could use a boost. Consider increasing your daily study time or adjusting your intensity level. You've got this!",
  };
}

export async function ensureExamPlannerTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS exam_planner_settings (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL UNIQUE,
      exam_date TIMESTAMP,
      exam_date_type TEXT DEFAULT 'target',
      exam_countdown_hidden BOOLEAN DEFAULT false,
      study_planner_hidden BOOLEAN DEFAULT false,
      study_plan_intensity TEXT DEFAULT 'balanced',
      plan_without_date BOOLEAN DEFAULT false,
      plan_without_date_weeks INTEGER,
      tier TEXT DEFAULT 'rn',
      career_type TEXT DEFAULT 'nursing',
      generated_plan JSONB,
      planner_last_updated TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
}

export async function getOrCreatePlannerSettings(userId: string, userTier?: string, careerType?: string) {
  const existing = await pool.query(
    `SELECT * FROM exam_planner_settings WHERE user_id = $1`,
    [userId]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  const result = await pool.query(
    `INSERT INTO exam_planner_settings (id, user_id, tier, career_type)
     VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *`,
    [userId, userTier || "rn", careerType || "nursing"]
  );
  return result.rows[0];
}

export async function updatePlannerSettings(userId: string, updates: Record<string, any>) {
  await getOrCreatePlannerSettings(userId);

  const allowedFields: Record<string, string> = {
    examDate: "exam_date",
    examDateType: "exam_date_type",
    examCountdownHidden: "exam_countdown_hidden",
    studyPlannerHidden: "study_planner_hidden",
    studyPlanIntensity: "study_plan_intensity",
    planWithoutDate: "plan_without_date",
    planWithoutDateWeeks: "plan_without_date_weeks",
  };

  const setClauses: string[] = [];
  const params: any[] = [userId];
  let paramIdx = 2;

  for (const [key, value] of Object.entries(updates)) {
    const dbField = allowedFields[key];
    if (dbField && value !== undefined) {
      setClauses.push(`${dbField} = $${paramIdx}`);
      params.push(value);
      paramIdx++;
    }
  }

  if (setClauses.length === 0) return getOrCreatePlannerSettings(userId);

  setClauses.push("updated_at = NOW()");

  await pool.query(
    `UPDATE exam_planner_settings SET ${setClauses.join(", ")} WHERE user_id = $1`,
    params
  );

  return getOrCreatePlannerSettings(userId);
}

export async function generateFullStudyPlan(
  userId: string,
  userTier: string,
  careerType: string
): Promise<GeneratedStudyPlan> {
  const settings = await getOrCreatePlannerSettings(userId, userTier, careerType);
  const tierConfig = getTierConfig(userTier);

  let daysRemaining: number;
  if (settings.plan_without_date && settings.plan_without_date_weeks) {
    daysRemaining = settings.plan_without_date_weeks * 7;
  } else if (settings.exam_date) {
    const examDate = new Date(settings.exam_date);
    const now = new Date();
    daysRemaining = Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  } else {
    daysRemaining = 56;
  }

  const intensity: Intensity = (settings.study_plan_intensity as Intensity) || "balanced";

  const profileResult = await pool.query(
    `SELECT * FROM student_study_profiles WHERE user_id = $1`,
    [userId]
  );
  const profile = profileResult.rows[0] || {};

  const masteryResult = await pool.query(
    `SELECT * FROM topic_mastery_scores WHERE user_id = $1 ORDER BY mastery_percent ASC`,
    [userId]
  );
  const masteryScores = masteryResult.rows;

  const weakAreas = masteryScores
    .filter((m: any) => m.mastery_percent <= 40)
    .map((m: any) => m.topic)
    .slice(0, 5);
  const strongAreas = masteryScores
    .filter((m: any) => m.mastery_percent >= 75)
    .map((m: any) => m.topic)
    .slice(0, 5);

  const questionCountResult = await pool.query(
    `SELECT COUNT(*)::int as count FROM exam_questions WHERE status = 'published'`
  ).catch(() => ({ rows: [{ count: 1500 }] }));
  const totalAvailable = questionCountResult.rows[0]?.count || 1500;

  const progressData = {
    questionsCompleted: profile.total_questions_answered || 0,
    totalAvailable,
    flashcardsStudied: profile.flashcards_studied || 0,
    mocksCompleted: profile.practice_exams_completed || 0,
    weakAreaCount: weakAreas.length,
    readinessScore: profile.readiness_score || 0,
    overallAccuracy: profile.total_questions_answered > 0
      ? Math.round((profile.total_correct || 0) / profile.total_questions_answered * 100)
      : 0,
    lessonsViewed: profile.lessons_viewed || 0,
  };

  const phase = getStudyPhase(daysRemaining);
  const pacingTargets = calculatePacingTargets(daysRemaining, intensity, phase.phase, progressData);
  const weeksToGenerate = Math.min(8, Math.ceil(daysRemaining / 7));
  const weeklyPlan = generateWeeklyPlan(
    daysRemaining,
    intensity,
    weakAreas,
    strongAreas,
    tierConfig.blueprintCategories,
    Math.max(1, weeksToGenerate)
  );
  const recommendations = generateRecommendations(
    phase,
    intensity,
    progressData,
    weakAreas,
    strongAreas,
    tierConfig
  );
  const { status: onTrackStatus, message: onTrackMessage } = getOnTrackStatus(
    progressData,
    daysRemaining
  );

  const contentMix = getContentMix(phase.phase, intensity);

  const plan: GeneratedStudyPlan = {
    phase,
    pacingTargets,
    weeklyPlan,
    recommendations,
    onTrackStatus,
    onTrackMessage,
    strongestAreas: strongAreas,
    weakestAreas: weakAreas,
    contentMix,
    generatedAt: new Date().toISOString(),
  };

  await pool.query(
    `UPDATE exam_planner_settings SET generated_plan = $2, planner_last_updated = NOW(), updated_at = NOW() WHERE user_id = $1`,
    [userId, JSON.stringify(plan)]
  );

  return plan;
}

function getContentMix(phase: StudyPhase, intensity: Intensity): { type: string; percentage: number }[] {
  switch (phase) {
    case "foundation":
      return [
        { type: "Lessons", percentage: 35 },
        { type: "Flashcards", percentage: 25 },
        { type: "Questions", percentage: 30 },
        { type: "Mock Exams", percentage: 10 },
      ];
    case "practice":
      return [
        { type: "Questions", percentage: 40 },
        { type: "Flashcards", percentage: 20 },
        { type: "Lessons", percentage: 20 },
        { type: "Mock Exams", percentage: 20 },
      ];
    case "timed_review":
      return [
        { type: "Mock Exams", percentage: 35 },
        { type: "Questions", percentage: 35 },
        { type: "Flashcards", percentage: 15 },
        { type: "Review", percentage: 15 },
      ];
    case "final_review":
      return [
        { type: "Review", percentage: 35 },
        { type: "Flashcards", percentage: 25 },
        { type: "Mock Exams", percentage: 25 },
        { type: "Light Practice", percentage: 15 },
      ];
  }
}

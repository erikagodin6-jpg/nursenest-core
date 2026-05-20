import { pool } from "./storage";
import { getUserEntitlements } from "./entitlements";

type TrialUsage = {
  questionsUsed: number;
  flashcardsUsed: number;
  catExamsUsed: number;
};

const DEFAULT_USAGE: TrialUsage = {
  questionsUsed: 0,
  flashcardsUsed: 0,
  catExamsUsed: 0,
};

function pick<T = any>(...values: T[]): T | null {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return null;
}

function pickOrDefault<T = any>(fallback: T, ...values: T[]): T {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return fallback;
}

async function getFreeTrialUsage(userId: string): Promise<TrialUsage> {
  try {
    const result = await pool.query(
      `SELECT questions_used, flashcards_used, cat_exams_used
       FROM free_trial_usage
       WHERE user_id = $1
       LIMIT 1`,
      [userId]
    );

    const row = result.rows[0];
    if (!row) {
      return DEFAULT_USAGE;
    }

    return {
      questionsUsed: Number(row.questions_used ?? 0),
      flashcardsUsed: Number(row.flashcards_used ?? 0),
      catExamsUsed: Number(row.cat_exams_used ?? 0),
    };
  } catch {
    return DEFAULT_USAGE;
  }
}

export async function buildAuthUserResponse(user: any): Promise<Record<string, any>> {
  const entitlements = getUserEntitlements(user);
  const usage = await getFreeTrialUsage(String(user.id));

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: pick(user.display_name, user.displayName),
    role: pick(user.role),
    country: pick(user.country),
    examTrack: pick(user.exam_track, user.examTrack),
    careerType: pickOrDefault("nursing", user.career_type, user.careerType),
    region: pickOrDefault("US", user.region),
    onboardingCompleted: pickOrDefault(false, user.onboarding_completed, user.onboardingCompleted),
    onboardingComplete: pickOrDefault(false, user.onboarding_complete, user.onboardingComplete),
    studyGoal: pick(user.study_goal, user.studyGoal),
    dailyStudyTime: pick(user.daily_study_time, user.dailyStudyTime),
    examType: pick(user.exam_type, user.examType),
    tier: pickOrDefault("free", user.tier),
    subscriptionStatus: pickOrDefault("inactive", user.subscription_status, user.subscriptionStatus),
    isLifetime: pickOrDefault(false, user.is_lifetime, user.isLifetime),
    planExpiresAt: pick(user.plan_expires_at, user.planExpiresAt),
    testerAccess: pickOrDefault(false, user.tester_access, user.testerAccess),
    testerExpiry: pick(user.tester_expiry, user.testerExpiry),
    preferredTheme: pick(user.preferred_theme, user.preferredTheme),
    entitlements,
    usage,
  };
}
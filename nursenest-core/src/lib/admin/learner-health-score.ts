import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

// ── Score weights ────────────────────────────────────────────────────────────
// Total: 100 points
const W = {
  studyFrequency: 25,    // active days in last 30 d
  consistency: 20,       // regularity (days-between-sessions variance)
  activityDiversity: 15, // distinct activity types used
  retention: 20,         // exam / practice score trends
  lessonEngagement: 10,  // lessons viewed + completed
  catParticipation: 10,  // CAT exams taken
} as const;

export type LearnerHealthBand = "power_user" | "healthy" | "moderate_risk" | "at_risk";

export type LearnerHealthScore = {
  userId: string;
  score: number;           // 0–100
  band: LearnerHealthBand;
  bandLabel: string;
  components: {
    studyFrequency: number;
    consistency: number;
    activityDiversity: number;
    retention: number;
    lessonEngagement: number;
    catParticipation: number;
  };
  signals: string[];       // human-readable explanation bullets
  computedAt: string;
};

function band(score: number): { band: LearnerHealthBand; label: string } {
  if (score >= 80) return { band: "power_user", label: "Power User" };
  if (score >= 60) return { band: "healthy", label: "Healthy" };
  if (score >= 40) return { band: "moderate_risk", label: "Moderate Risk" };
  return { band: "at_risk", label: "At Risk" };
}

function clamp(v: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(v)));
}

export async function computeLearnerHealthScore(userId: string): Promise<LearnerHealthScore | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 86_400_000);
  const d7 = new Date(now.getTime() - 7 * 86_400_000);

  const [events30d, recentExams, allExamsSessions] = await Promise.all([
    prisma.learnerActivityEvent.findMany({
      where: { userId, createdAt: { gte: d30 } },
      select: { activityType: true, lifecycle: true, score: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 500,
    }),
    prisma.examAttempt.findMany({
      where: { userId, createdAt: { gte: d30 } },
      select: { score: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.practiceTest.findMany({
      where: { userId, completedAt: { not: null } },
      select: { completedAt: true },
      orderBy: { completedAt: "desc" },
      take: 10,
    }),
  ]);

  if (events30d.length === 0 && recentExams.length === 0) {
    const { band: b, label } = band(0);
    return {
      userId,
      score: 0,
      band: b,
      bandLabel: label,
      components: { studyFrequency: 0, consistency: 0, activityDiversity: 0, retention: 0, lessonEngagement: 0, catParticipation: 0 },
      signals: ["No recorded activity in the past 30 days."],
      computedAt: now.toISOString(),
    };
  }

  // ── Study Frequency (25 pts) ─────────────────────────────────────────────
  const activeDaySet = new Set(events30d.map((e) => e.createdAt.toISOString().slice(0, 10)));
  const activeDays = activeDaySet.size;
  // 20+ active days = full score, linear below
  const studyFrequency = clamp((activeDays / 20) * W.studyFrequency, W.studyFrequency);

  // ── Consistency (20 pts) ─────────────────────────────────────────────────
  // Measure variance in gaps between active days — lower variance = more consistent
  let consistency = 0;
  const sortedDays = [...activeDaySet].sort();
  if (sortedDays.length >= 3) {
    const gaps: number[] = [];
    for (let i = 1; i < sortedDays.length; i++) {
      const a = new Date(sortedDays[i - 1]).getTime();
      const b = new Date(sortedDays[i]).getTime();
      gaps.push((b - a) / 86_400_000);
    }
    const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    const variance = gaps.reduce((s, g) => s + Math.pow(g - avgGap, 2), 0) / gaps.length;
    // Low variance + low average gap = high consistency
    // avgGap <= 2 days and variance <= 2: full score
    const gapScore = Math.max(0, 1 - avgGap / 7);    // 0–1 (lower avg gap = better)
    const varScore = Math.max(0, 1 - Math.sqrt(variance) / 7); // 0–1 (lower variance = better)
    consistency = clamp(((gapScore + varScore) / 2) * W.consistency, W.consistency);
  } else if (sortedDays.length >= 1) {
    // Some activity but not enough to measure consistency
    consistency = clamp((sortedDays.length / 3) * (W.consistency * 0.5), W.consistency);
  }

  // ── Activity Diversity (15 pts) ──────────────────────────────────────────
  const activityTypes = new Set(events30d.map((e) => e.activityType));
  // 5+ distinct activity types = full score
  const activityDiversity = clamp((activityTypes.size / 5) * W.activityDiversity, W.activityDiversity);

  // ── Retention / Exam Performance (20 pts) ────────────────────────────────
  let retention = 0;
  if (recentExams.length > 0) {
    const avgScore = recentExams.reduce((s, e) => s + (e.score ?? 50), 0) / recentExams.length;
    // Normalise: 50% avg = 10/20, 80%+ avg = 20/20
    const normalised = Math.max(0, (avgScore - 40) / 40); // 40–80% → 0–1
    retention = clamp(normalised * W.retention, W.retention);

    // Bonus: improving trend (last 5 vs previous 5)
    if (recentExams.length >= 6) {
      const recent5 = recentExams.slice(0, 5).reduce((s, e) => s + (e.score ?? 50), 0) / 5;
      const older5 = recentExams.slice(5).slice(0, 5).reduce((s, e) => s + (e.score ?? 50), 0) /
        Math.min(5, recentExams.slice(5).length || 1);
      if (recent5 > older5 + 3) retention = Math.min(W.retention, retention + 3);
    }
  } else {
    // No exam data — award partial credit for any activity
    retention = events30d.length > 0 ? clamp(W.retention * 0.35, W.retention) : 0;
  }

  // ── Lesson Engagement (10 pts) ───────────────────────────────────────────
  const lessonEvents = events30d.filter((e) => e.activityType === "lessons" || e.activityType === "lesson");
  const lessonsCompleted = lessonEvents.filter((e) => e.lifecycle === "completed").length;
  const lessonsViewed = lessonEvents.length;
  // 5+ completed = full score; partial credit for viewed
  const lessonEngagement = clamp(
    Math.min(W.lessonEngagement, (lessonsCompleted / 5) * W.lessonEngagement + (lessonsViewed > 0 ? 2 : 0)),
    W.lessonEngagement,
  );

  // ── CAT Participation (10 pts) ───────────────────────────────────────────
  const catEvents = events30d.filter((e) => e.activityType === "cat" && e.lifecycle === "completed");
  const catCount = catEvents.length + allExamsSessions.length;
  // 2+ CAT exams = full score
  const catParticipation = clamp((catCount / 2) * W.catParticipation, W.catParticipation);

  // ── Total ─────────────────────────────────────────────────────────────────
  const total = studyFrequency + consistency + activityDiversity + retention + lessonEngagement + catParticipation;
  const { band: b, label } = band(total);

  // ── Signals ───────────────────────────────────────────────────────────────
  const signals: string[] = [];
  if (activeDays >= 20) signals.push(`Studies most days — ${activeDays} active days in the past 30.`);
  else if (activeDays >= 10) signals.push(`Moderate study frequency — ${activeDays} active days in the past 30.`);
  else if (activeDays > 0) signals.push(`Infrequent activity — only ${activeDays} active ${activeDays === 1 ? "day" : "days"} in the past 30.`);

  if (activityTypes.size >= 5) signals.push(`High diversity — using ${activityTypes.size} activity types.`);
  else if (activityTypes.size <= 1) signals.push(`Low diversity — only ${activityTypes.size} activity type recorded.`);

  if (catCount >= 2) signals.push(`Strong CAT participation — ${catCount} completed exam${catCount === 1 ? "" : "s"}.`);
  else if (catCount === 0) signals.push("No CAT exams completed in this period.");

  if (recentExams.length > 0) {
    const avg = Math.round(recentExams.reduce((s, e) => s + (e.score ?? 50), 0) / recentExams.length);
    signals.push(`Average exam score: ${avg}%.`);
  }

  if (total < 40) signals.push("⚠️ At risk — consider proactive outreach or support check-in.");

  return {
    userId,
    score: total,
    band: b,
    bandLabel: label,
    components: { studyFrequency, consistency, activityDiversity, retention, lessonEngagement, catParticipation },
    signals,
    computedAt: now.toISOString(),
  };
}

/** Compute health scores for a batch of users. Returns a map userId → score. */
export async function computeLearnerHealthScoreBatch(
  userIds: string[],
): Promise<Map<string, LearnerHealthScore>> {
  const results = await Promise.all(
    userIds.map(async (id) => {
      const score = await computeLearnerHealthScore(id);
      return [id, score] as const;
    }),
  );
  const map = new Map<string, LearnerHealthScore>();
  for (const [id, s] of results) {
    if (s) map.set(id, s);
  }
  return map;
}

export function healthBandColor(band: LearnerHealthBand): string {
  switch (band) {
    case "power_user":    return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "healthy":       return "text-green-700 bg-green-50 border-green-200";
    case "moderate_risk": return "text-amber-700 bg-amber-50 border-amber-200";
    case "at_risk":       return "text-red-700 bg-red-50 border-red-200";
  }
}

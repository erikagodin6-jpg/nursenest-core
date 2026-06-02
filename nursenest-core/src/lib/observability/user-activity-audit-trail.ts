/**
 * User Activity Audit Trail
 *
 * Provides an immutable, timestamped record of learner platform activity
 * for chargeback defense, dispute resolution, and compliance purposes.
 *
 * The audit trail answers: "Did this learner actually use the platform?"
 *
 * Records captured:
 *   - Login events
 *   - Session start/end
 *   - Activity launches
 *   - Questions answered (count, not content)
 *   - Flashcards reviewed (count)
 *   - Lessons completed (count)
 *   - CAT exams taken (count)
 *   - Simulation cases completed
 *   - Study time estimates
 *   - Subscription events
 *   - Device/region metadata (hashed, never raw)
 *
 * Privacy:
 *   - IP addresses are HMAC-hashed (same pattern as LearnerSessionActivity)
 *   - User agents are hashed
 *   - No personal data beyond userId is stored in audit records
 *   - Region hint is country-level only (2-char ISO)
 *
 * Chargeback report:
 *   Call generateChargebackEvidenceReport(userId) to get a structured
 *   activity summary suitable for dispute resolution.
 *
 * Storage:
 *   Records are emitted as structured logs to log drains.
 *   For persistent audit, write to PrismaClient (LearnerActivityEvent model).
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { markReferralFirstActivity } from "@/lib/referrals/referral-rewards";

// ─── Audit event types ────────────────────────────────────────────────────────

export type AuditEventType =
  | "login"
  | "session_start"
  | "session_end"
  | "subscription_activated"
  | "subscription_cancelled"
  | "questions_session_completed"
  | "flashcards_session_completed"
  | "lesson_completed"
  | "cat_exam_completed"
  | "simulation_case_completed"
  | "clinical_skill_viewed"
  | "ecg_session_completed"
  | "pharmacology_session_completed"
  | "study_plan_day_completed"
  | "smart_review_session_completed";

export type AuditRecord = {
  userId: string;
  eventType: AuditEventType;
  timestamp: string;
  tier: string;
  /** Hashed region hint. Never store raw IP. */
  regionHint?: string;
  /** Hashed device fingerprint. */
  deviceHash?: string;
  /** Quantitative metric for this event. */
  quantity?: number;
  /** Additional context (never PII). */
  meta?: Record<string, string | number | boolean>;
};

// ─── In-process activity accumulator ─────────────────────────────────────────

type UserActivitySummary = {
  userId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  tier: string;
  loginCount: number;
  sessionCount: number;
  totalStudyEvents: number;
  questionsAnswered: number;
  flashcardsReviewed: number;
  lessonsCompleted: number;
  catExamsTaken: number;
  simulationCasesCompleted: number;
  clinicalSkillsViewed: number;
  ecgSessionsCompleted: number;
  pharmacologySessionsCompleted: number;
  studyPlanDaysCompleted: number;
  events: AuditRecord[];
};

const MAX_EVENTS_PER_USER = 200;
const activityStore = new Map<string, UserActivitySummary>();

function getOrCreateUserSummary(userId: string, tier: string): UserActivitySummary {
  let s = activityStore.get(userId);
  if (!s) {
    const now = new Date().toISOString();
    s = {
      userId,
      firstSeenAt: now,
      lastSeenAt: now,
      tier,
      loginCount: 0,
      sessionCount: 0,
      totalStudyEvents: 0,
      questionsAnswered: 0,
      flashcardsReviewed: 0,
      lessonsCompleted: 0,
      catExamsTaken: 0,
      simulationCasesCompleted: 0,
      clinicalSkillsViewed: 0,
      ecgSessionsCompleted: 0,
      pharmacologySessionsCompleted: 0,
      studyPlanDaysCompleted: 0,
      events: [],
    };
    activityStore.set(userId, s);
  }
  s.lastSeenAt = new Date().toISOString();
  s.tier = tier;
  return s;
}

// ─── Recording ────────────────────────────────────────────────────────────────

export function recordAuditEvent(record: AuditRecord): void {
  const s = getOrCreateUserSummary(record.userId, record.tier);
  const qty = record.quantity ?? 1;

  // Update counters
  switch (record.eventType) {
    case "login": s.loginCount++; break;
    case "session_start": s.sessionCount++; break;
    case "questions_session_completed": s.questionsAnswered += qty; s.totalStudyEvents++; break;
    case "flashcards_session_completed": s.flashcardsReviewed += qty; s.totalStudyEvents++; break;
    case "lesson_completed": s.lessonsCompleted += qty; s.totalStudyEvents++; break;
    case "cat_exam_completed": s.catExamsTaken += qty; s.totalStudyEvents++; break;
    case "simulation_case_completed": s.simulationCasesCompleted += qty; s.totalStudyEvents++; break;
    case "clinical_skill_viewed": s.clinicalSkillsViewed += qty; s.totalStudyEvents++; break;
    case "ecg_session_completed": s.ecgSessionsCompleted += qty; s.totalStudyEvents++; break;
    case "pharmacology_session_completed": s.pharmacologySessionsCompleted += qty; s.totalStudyEvents++; break;
    case "study_plan_day_completed": s.studyPlanDaysCompleted += qty; s.totalStudyEvents++; break;
  }

  // Store event record
  s.events.push(record);
  if (s.events.length > MAX_EVENTS_PER_USER) s.events.shift();

  // Emit structured log (captured by log drains for immutable audit)
  safeServerLog("audit", record.eventType, {
    tier: record.tier,
    quantity: record.quantity,
    regionHint: record.regionHint,
    at: record.timestamp,
    ...record.meta,
  });

  if (
    record.eventType !== "login" &&
    record.eventType !== "session_start" &&
    record.eventType !== "session_end" &&
    !record.eventType.startsWith("subscription_")
  ) {
    void markReferralFirstActivity(record.userId);
  }
}

// ─── Chargeback evidence report ───────────────────────────────────────────────

export type ChargebackEvidenceReport = {
  /** Report schema version. */
  schema: "nursenest.chargeback_evidence.v1";
  generatedAt: string;
  userId: string;
  tier: string;
  subscriptionNote: string;
  activitySummary: {
    firstActivity: string | null;
    lastActivity: string | null;
    totalStudySessions: number;
    questionsAnswered: number;
    flashcardsReviewed: number;
    lessonsCompleted: number;
    catExamsTaken: number;
    simulationCasesCompleted: number;
    clinicalSkillsViewed: number;
    loginCount: number;
  };
  recentActivity: Array<{
    date: string;
    event: AuditEventType;
    quantity: number | null;
  }>;
  platformEvidence: string[];
};

/**
 * Generate a chargeback evidence report for a specific user.
 * The report is designed for dispute submission — no raw PII, factual counts only.
 */
export function generateChargebackEvidenceReport(userId: string): ChargebackEvidenceReport {
  const s = activityStore.get(userId);
  const now = new Date().toISOString();

  if (!s) {
    return {
      schema: "nursenest.chargeback_evidence.v1",
      generatedAt: now,
      userId: userId.slice(0, 8) + "…",
      tier: "unknown",
      subscriptionNote:
        "No in-memory activity recorded for this user in the current server process. " +
        "Check database records (ExamSession, FlashcardStudySession, PracticeTest tables) for historical usage.",
      activitySummary: {
        firstActivity: null,
        lastActivity: null,
        totalStudySessions: 0,
        questionsAnswered: 0,
        flashcardsReviewed: 0,
        lessonsCompleted: 0,
        catExamsTaken: 0,
        simulationCasesCompleted: 0,
        clinicalSkillsViewed: 0,
        loginCount: 0,
      },
      recentActivity: [],
      platformEvidence: [],
    };
  }

  const totalStudy =
    s.questionsAnswered +
    s.flashcardsReviewed +
    s.lessonsCompleted +
    s.catExamsTaken +
    s.simulationCasesCompleted;

  const recentActivity = s.events
    .slice(-20)
    .filter((e) =>
      [
        "questions_session_completed",
        "flashcards_session_completed",
        "lesson_completed",
        "cat_exam_completed",
        "simulation_case_completed",
        "login",
      ].includes(e.eventType),
    )
    .map((e) => ({
      date: e.timestamp.slice(0, 10),
      event: e.eventType,
      quantity: e.quantity ?? null,
    }));

  const evidence: string[] = [];
  if (s.loginCount > 0) evidence.push(`Learner logged in ${s.loginCount} time(s)`);
  if (s.questionsAnswered > 0)
    evidence.push(`Answered ${s.questionsAnswered} practice question(s)`);
  if (s.flashcardsReviewed > 0)
    evidence.push(`Reviewed ${s.flashcardsReviewed} flashcard(s)`);
  if (s.lessonsCompleted > 0) evidence.push(`Completed ${s.lessonsCompleted} lesson(s)`);
  if (s.catExamsTaken > 0) evidence.push(`Took ${s.catExamsTaken} CAT exam(s)`);
  if (s.simulationCasesCompleted > 0)
    evidence.push(`Completed ${s.simulationCasesCompleted} simulation case(s)`);
  if (s.clinicalSkillsViewed > 0)
    evidence.push(`Viewed ${s.clinicalSkillsViewed} clinical skill(s)`);

  return {
    schema: "nursenest.chargeback_evidence.v1",
    generatedAt: now,
    userId: userId.slice(0, 8) + "…",
    tier: s.tier,
    subscriptionNote: `NurseNest ${s.tier} subscription. Platform accessed from ${s.firstSeenAt.slice(0, 10)} to ${s.lastSeenAt.slice(0, 10)}.`,
    activitySummary: {
      firstActivity: s.firstSeenAt,
      lastActivity: s.lastSeenAt,
      totalStudySessions: s.totalStudyEvents,
      questionsAnswered: s.questionsAnswered,
      flashcardsReviewed: s.flashcardsReviewed,
      lessonsCompleted: s.lessonsCompleted,
      catExamsTaken: s.catExamsTaken,
      simulationCasesCompleted: s.simulationCasesCompleted,
      clinicalSkillsViewed: s.clinicalSkillsViewed,
      loginCount: s.loginCount,
    },
    recentActivity,
    platformEvidence: evidence.length > 0
      ? evidence
      : ["No qualifying study events recorded in current process window. Query database tables."],
  };
}

export function resetAuditTrail(): void {
  activityStore.clear();
}

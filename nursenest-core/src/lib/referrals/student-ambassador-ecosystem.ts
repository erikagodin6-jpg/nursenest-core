export type ReferralRewardMilestone = {
  referralsRequired: number;
  title: string;
  rewardSummary: string;
  rewardKind: "FEATURE_UNLOCK" | "FREE_DAYS" | "FREE_MONTH" | "AMBASSADOR_STATUS";
  featureKeys?: readonly string[];
  durationDays?: number;
  ambassadorStatus?: "AMBASSADOR" | "ELITE_AMBASSADOR";
};

export type AmbassadorProfession =
  | "Nursing"
  | "RPN"
  | "NP"
  | "Respiratory Therapy"
  | "Paramedicine"
  | "Occupational Therapy"
  | "Physiotherapy"
  | "Medical Laboratory Technology"
  | "PSW";

export type ShareableMilestoneKind =
  | "readiness"
  | "study_streak"
  | "questions_completed"
  | "flashcards_mastered"
  | "clinical_skills_completed"
  | "simulation_achievement"
  | "ecg_achievement"
  | "medication_math_achievement";

export type ShareableMilestoneTemplate = {
  kind: ShareableMilestoneKind;
  title: string;
  shareText: string;
  graphicHeadline: string;
  graphicSubline: string;
};

export type CampusChallengeTemplate = {
  id: string;
  title: string;
  audience: "school" | "program" | "class";
  supportedProfessions: readonly AmbassadorProfession[];
  metric: "study_streak" | "questions_completed" | "flashcards_reviewed" | "simulation_progress";
  prompt: string;
};

export type SuccessStoryPrompt = {
  id: string;
  title: string;
  category:
    | "passed_nclex"
    | "passed_rex_pn"
    | "passed_cnple"
    | "accepted_nursing_school"
    | "accepted_rt_program"
    | "completed_clinical_placement"
    | "first_job";
  prompt: string;
};

export type ReferralShareAssets = {
  referralLink: string;
  referralCode: string;
  qrCodeUrl: string;
  shareCardTitle: string;
  shareCardBody: string;
  shareText: string;
};

export type ReferralGrowthSummary = {
  paidReferrals: number;
  qualifiedReferrals: number;
  accountsCreated: number;
  nextMilestone: ReferralRewardMilestone | null;
  nextMilestoneProgressPct: number;
  ambassadorStatus: "NONE" | "AMBASSADOR" | "ELITE_AMBASSADOR";
};

export type ReferralAnalyticsRow = {
  source: string;
  clicks: number;
  accountsCreated: number;
  trialsStarted: number;
  subscriptions: number;
  revenueCents: number;
  ambassadorUserId?: string | null;
  campusKey?: string | null;
  socialShares?: number | null;
};

export type ReferralAnalyticsSummary = {
  totalClicks: number;
  totalAccountsCreated: number;
  totalTrialsStarted: number;
  totalSubscriptions: number;
  totalRevenueCents: number;
  conversionRate: number;
  topSources: Array<ReferralAnalyticsRow & { conversionRate: number }>;
  topAmbassadors: Array<{ ambassadorUserId: string; subscriptions: number; revenueCents: number }>;
  topCampusPrograms: Array<{ campusKey: string; subscriptions: number; revenueCents: number }>;
  socialSharingPerformance: Array<{ source: string; socialShares: number; subscriptions: number }>;
};

export const REFERRAL_REWARD_MILESTONES: readonly ReferralRewardMilestone[] = [
  {
    referralsRequired: 1,
    title: "First Successful Referral",
    rewardSummary: "Bonus flashcards and bonus practice questions",
    rewardKind: "FEATURE_UNLOCK",
    featureKeys: ["bonus_flashcards", "bonus_practice_questions"],
  },
  {
    referralsRequired: 3,
    title: "Study Circle Builder",
    rewardSummary: "Additional study time and premium extension",
    rewardKind: "FREE_DAYS",
    durationDays: 7,
  },
  {
    referralsRequired: 5,
    title: "Community Growth Reward",
    rewardSummary: "Free month",
    rewardKind: "FREE_MONTH",
    durationDays: 30,
  },
  {
    referralsRequired: 10,
    title: "Campus Ambassador",
    rewardSummary: "Ambassador status",
    rewardKind: "AMBASSADOR_STATUS",
    ambassadorStatus: "AMBASSADOR",
  },
  {
    referralsRequired: 20,
    title: "Elite Ambassador",
    rewardSummary: "Elite ambassador status",
    rewardKind: "AMBASSADOR_STATUS",
    ambassadorStatus: "ELITE_AMBASSADOR",
  },
] as const;

export const STUDENT_AMBASSADOR_PROFESSIONS: readonly AmbassadorProfession[] = [
  "Nursing",
  "RPN",
  "NP",
  "Respiratory Therapy",
  "Paramedicine",
  "Occupational Therapy",
  "Physiotherapy",
  "Medical Laboratory Technology",
  "PSW",
] as const;

export const SHAREABLE_MILESTONE_TEMPLATES: readonly ShareableMilestoneTemplate[] = [
  {
    kind: "questions_completed",
    title: "Questions Completed",
    shareText: "I completed 1,000 exam-style questions on NurseNest.",
    graphicHeadline: "Completed 1,000 NCLEX Questions",
    graphicSubline: "Practice questions with rationales, pearls, and weak-area review.",
  },
  {
    kind: "readiness",
    title: "Readiness Milestone",
    shareText: "I reached a new readiness milestone on NurseNest.",
    graphicHeadline: "Achieved 82% Readiness",
    graphicSubline: "Readiness built through questions, CAT, flashcards, and remediation.",
  },
  {
    kind: "ecg_achievement",
    title: "ECG Achievement",
    shareText: "I mastered an ECG milestone on NurseNest.",
    graphicHeadline: "Mastered ECG Foundations",
    graphicSubline: "Rhythm recognition, clinical significance, and escalation practice.",
  },
  {
    kind: "clinical_skills_completed",
    title: "Clinical Skills Achievement",
    shareText: "I completed clinical skills activities on NurseNest.",
    graphicHeadline: "Completed 100 Clinical Skills Activities",
    graphicSubline: "Safety checks, procedures, documentation, and bedside reasoning.",
  },
  {
    kind: "study_streak",
    title: "Study Streak",
    shareText: "I protected my study streak on NurseNest.",
    graphicHeadline: "Built A 30-Day Study Streak",
    graphicSubline: "Consistent study, active recall, and readiness progress.",
  },
  {
    kind: "flashcards_mastered",
    title: "Flashcards Mastered",
    shareText: "I mastered flashcards on NurseNest.",
    graphicHeadline: "Mastered 500 Flashcards",
    graphicSubline: "Spaced repetition for clinical cues and exam recall.",
  },
  {
    kind: "simulation_achievement",
    title: "Simulation Achievement",
    shareText: "I completed clinical simulations on NurseNest.",
    graphicHeadline: "Completed Patient Deterioration Simulations",
    graphicSubline: "Decision-making practice with consequences and debriefs.",
  },
  {
    kind: "medication_math_achievement",
    title: "Medication Math Achievement",
    shareText: "I completed medication math practice on NurseNest.",
    graphicHeadline: "Completed Medication Math Drills",
    graphicSubline: "Dose, rate, safe-range, and high-alert medication practice.",
  },
] as const;

export const CAMPUS_CHALLENGE_TEMPLATES: readonly CampusChallengeTemplate[] = [
  {
    id: "rn-cohort-question-sprint",
    title: "RN Cohort Question Sprint",
    audience: "class",
    supportedProfessions: ["Nursing"],
    metric: "questions_completed",
    prompt: "Complete the most exam-style questions as a cohort this week.",
  },
  {
    id: "rt-abg-flashcard-challenge",
    title: "RT ABG Flashcard Challenge",
    audience: "program",
    supportedProfessions: ["Respiratory Therapy"],
    metric: "flashcards_reviewed",
    prompt: "Review respiratory and ABG flashcards as a program challenge.",
  },
  {
    id: "paramedic-simulation-run",
    title: "Paramedic Simulation Run",
    audience: "program",
    supportedProfessions: ["Paramedicine"],
    metric: "simulation_progress",
    prompt: "Complete emergency decision simulations with your study group.",
  },
  {
    id: "allied-study-streak",
    title: "Allied Health Study Streak",
    audience: "school",
    supportedProfessions: STUDENT_AMBASSADOR_PROFESSIONS,
    metric: "study_streak",
    prompt: "Protect a 7-day study streak across programs.",
  },
] as const;

export const SUCCESS_STORY_PROMPTS: readonly SuccessStoryPrompt[] = [
  { id: "passed-nclex", title: "Passed NCLEX", category: "passed_nclex", prompt: "Tell us how NurseNest helped you prepare and what changed your confidence." },
  { id: "passed-rex-pn", title: "Passed REx-PN", category: "passed_rex_pn", prompt: "Share what helped most during practical nursing exam preparation." },
  { id: "passed-cnple", title: "Passed CNPLE", category: "passed_cnple", prompt: "Share how your NP readiness improved and what tools mattered most." },
  { id: "accepted-nursing-school", title: "Accepted Into Nursing School", category: "accepted_nursing_school", prompt: "Share how admissions prep supported your application journey." },
  { id: "accepted-rt-program", title: "Accepted Into RT Program", category: "accepted_rt_program", prompt: "Share how you prepared for respiratory therapy admissions or interviews." },
  { id: "completed-placement", title: "Completed Clinical Placement", category: "completed_clinical_placement", prompt: "Share a placement success story and what helped you feel prepared." },
  { id: "first-job", title: "Obtained First Job", category: "first_job", prompt: "Share how NurseNest helped you move from learner to professional practice." },
] as const;

export function buildReferralShareAssets(args: {
  referralLink: string;
  referralCode: string;
  learnerName?: string | null;
}): ReferralShareAssets {
  const encodedLink = encodeURIComponent(args.referralLink);
  const learner = args.learnerName?.trim() || "A NurseNest learner";
  return {
    referralLink: args.referralLink,
    referralCode: args.referralCode,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=10&data=${encodedLink}`,
    shareCardTitle: "Study With Me On NurseNest",
    shareCardBody: `${learner} invited you to try NurseNest for nursing and healthcare exam prep.`,
    shareText: `${learner} invited you to NurseNest. Use code ${args.referralCode}: ${args.referralLink}`,
  };
}

export function buildReferralGrowthSummary(input: {
  paidReferrals: number;
  qualifiedReferrals: number;
  accountsCreated: number;
}): ReferralGrowthSummary {
  const nextMilestone = REFERRAL_REWARD_MILESTONES.find((milestone) => input.paidReferrals < milestone.referralsRequired) ?? null;
  const nextRequirement = nextMilestone?.referralsRequired ?? input.paidReferrals;
  const nextMilestoneProgressPct = nextRequirement > 0 ? Math.min(100, Math.round((input.paidReferrals / nextRequirement) * 100)) : 100;
  return {
    paidReferrals: input.paidReferrals,
    qualifiedReferrals: input.qualifiedReferrals,
    accountsCreated: input.accountsCreated,
    nextMilestone,
    nextMilestoneProgressPct,
    ambassadorStatus: input.paidReferrals >= 20 ? "ELITE_AMBASSADOR" : input.paidReferrals >= 10 ? "AMBASSADOR" : "NONE",
  };
}

export function buildReferralAnalyticsSummary(rows: readonly ReferralAnalyticsRow[]): ReferralAnalyticsSummary {
  const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const totalAccountsCreated = rows.reduce((sum, row) => sum + row.accountsCreated, 0);
  const totalTrialsStarted = rows.reduce((sum, row) => sum + row.trialsStarted, 0);
  const totalSubscriptions = rows.reduce((sum, row) => sum + row.subscriptions, 0);
  const totalRevenueCents = rows.reduce((sum, row) => sum + row.revenueCents, 0);
  return {
    totalClicks,
    totalAccountsCreated,
    totalTrialsStarted,
    totalSubscriptions,
    totalRevenueCents,
    conversionRate: percent(totalSubscriptions, totalClicks),
    topSources: [...rows]
      .map((row) => ({ ...row, conversionRate: percent(row.subscriptions, row.clicks) }))
      .sort((a, b) => b.subscriptions - a.subscriptions || b.conversionRate - a.conversionRate)
      .slice(0, 10),
    topAmbassadors: rankGrouped(rows, "ambassadorUserId"),
    topCampusPrograms: rankGrouped(rows, "campusKey"),
    socialSharingPerformance: rows
      .filter((row) => (row.socialShares ?? 0) > 0)
      .map((row) => ({ source: row.source, socialShares: row.socialShares ?? 0, subscriptions: row.subscriptions }))
      .sort((a, b) => b.subscriptions - a.subscriptions || b.socialShares - a.socialShares)
      .slice(0, 10),
  };
}

function rankGrouped<K extends "ambassadorUserId" | "campusKey">(
  rows: readonly ReferralAnalyticsRow[],
  key: K,
): K extends "ambassadorUserId"
  ? Array<{ ambassadorUserId: string; subscriptions: number; revenueCents: number }>
  : Array<{ campusKey: string; subscriptions: number; revenueCents: number }> {
  const grouped = new Map<string, { subscriptions: number; revenueCents: number }>();
  for (const row of rows) {
    const id = row[key]?.trim();
    if (!id) continue;
    const current = grouped.get(id) ?? { subscriptions: 0, revenueCents: 0 };
    grouped.set(id, {
      subscriptions: current.subscriptions + row.subscriptions,
      revenueCents: current.revenueCents + row.revenueCents,
    });
  }
  return [...grouped.entries()]
    .map(([id, value]) => ({ [key]: id, ...value }))
    .sort((a, b) => b.subscriptions - a.subscriptions || b.revenueCents - a.revenueCents)
    .slice(0, 10) as K extends "ambassadorUserId"
      ? Array<{ ambassadorUserId: string; subscriptions: number; revenueCents: number }>
      : Array<{ campusKey: string; subscriptions: number; revenueCents: number }>;
}

function percent(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

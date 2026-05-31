import assert from "node:assert/strict";
import test from "node:test";

import {
  CAMPUS_CHALLENGE_TEMPLATES,
  REFERRAL_REWARD_MILESTONES,
  SHAREABLE_MILESTONE_TEMPLATES,
  STUDENT_AMBASSADOR_PROFESSIONS,
  SUCCESS_STORY_PROMPTS,
  buildReferralAnalyticsSummary,
  buildReferralGrowthSummary,
  buildReferralShareAssets,
} from "@/lib/referrals/student-ambassador-ecosystem";

test("student referral program defines the requested reward ladder", () => {
  assert.deepEqual(
    REFERRAL_REWARD_MILESTONES.map((milestone) => milestone.referralsRequired),
    [1, 3, 5, 10, 20],
  );
  assert.equal(REFERRAL_REWARD_MILESTONES[0]?.rewardKind, "FEATURE_UNLOCK");
  assert.equal(REFERRAL_REWARD_MILESTONES[2]?.rewardKind, "FREE_MONTH");
  assert.equal(REFERRAL_REWARD_MILESTONES[3]?.ambassadorStatus, "AMBASSADOR");
  assert.equal(REFERRAL_REWARD_MILESTONES[4]?.ambassadorStatus, "ELITE_AMBASSADOR");
});

test("ambassador program supports nursing and allied health professions", () => {
  for (const profession of ["Nursing", "RPN", "NP", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology", "PSW"] as const) {
    assert.ok(STUDENT_AMBASSADOR_PROFESSIONS.includes(profession));
  }
});

test("share system covers readiness, streaks, questions, flashcards, simulations, ECG, skills, and med math", () => {
  const kinds = new Set(SHAREABLE_MILESTONE_TEMPLATES.map((template) => template.kind));
  for (const kind of [
    "readiness",
    "study_streak",
    "questions_completed",
    "flashcards_mastered",
    "clinical_skills_completed",
    "simulation_achievement",
    "ecg_achievement",
    "medication_math_achievement",
  ] as const) {
    assert.ok(kinds.has(kind), `${kind} should be shareable`);
  }
});

test("referral share assets include link, code, QR URL, and share card copy", () => {
  const assets = buildReferralShareAssets({
    referralLink: "https://nursenest.ca/signup?ref=NNTEST",
    referralCode: "NNTEST",
    learnerName: "Maya",
  });

  assert.equal(assets.referralCode, "NNTEST");
  assert.match(assets.qrCodeUrl, /create-qr-code/);
  assert.match(assets.qrCodeUrl, /NNTEST/);
  assert.match(assets.shareText, /NNTEST/);
  assert.match(assets.shareCardTitle, /NurseNest/);
});

test("growth summary reports next milestone and ambassador state", () => {
  const early = buildReferralGrowthSummary({ paidReferrals: 4, qualifiedReferrals: 6, accountsCreated: 8 });
  assert.equal(early.nextMilestone?.referralsRequired, 5);
  assert.equal(early.ambassadorStatus, "NONE");

  const ambassador = buildReferralGrowthSummary({ paidReferrals: 12, qualifiedReferrals: 14, accountsCreated: 20 });
  assert.equal(ambassador.nextMilestone?.referralsRequired, 20);
  assert.equal(ambassador.ambassadorStatus, "AMBASSADOR");

  const elite = buildReferralGrowthSummary({ paidReferrals: 21, qualifiedReferrals: 24, accountsCreated: 30 });
  assert.equal(elite.nextMilestone, null);
  assert.equal(elite.ambassadorStatus, "ELITE_AMBASSADOR");
});

test("campus challenges and success stories are available as marketing growth assets", () => {
  assert.ok(CAMPUS_CHALLENGE_TEMPLATES.some((challenge) => challenge.title.includes("RN Cohort")));
  assert.ok(CAMPUS_CHALLENGE_TEMPLATES.some((challenge) => challenge.supportedProfessions.includes("Respiratory Therapy")));
  assert.ok(SUCCESS_STORY_PROMPTS.some((story) => story.category === "passed_nclex"));
  assert.ok(SUCCESS_STORY_PROMPTS.some((story) => story.category === "completed_clinical_placement"));
  assert.ok(SUCCESS_STORY_PROMPTS.some((story) => story.category === "first_job"));
});

test("referral analytics summarize source, ambassador, sharing, campus, and revenue performance", () => {
  const summary = buildReferralAnalyticsSummary([
    {
      source: "instagram",
      clicks: 100,
      accountsCreated: 20,
      trialsStarted: 8,
      subscriptions: 5,
      revenueCents: 25000,
      ambassadorUserId: "ambassador-1",
      campusKey: "rn-class-2028",
      socialShares: 12,
    },
    {
      source: "campus-qr",
      clicks: 50,
      accountsCreated: 15,
      trialsStarted: 6,
      subscriptions: 6,
      revenueCents: 30000,
      ambassadorUserId: "ambassador-2",
      campusKey: "rn-class-2028",
      socialShares: 4,
    },
  ]);

  assert.equal(summary.totalClicks, 150);
  assert.equal(summary.totalSubscriptions, 11);
  assert.equal(summary.totalRevenueCents, 55000);
  assert.equal(summary.conversionRate, 7);
  assert.equal(summary.topSources[0]?.source, "campus-qr");
  assert.equal(summary.topAmbassadors[0]?.ambassadorUserId, "ambassador-2");
  assert.equal(summary.topCampusPrograms[0]?.campusKey, "rn-class-2028");
  assert.equal(summary.socialSharingPerformance[0]?.source, "campus-qr");
});

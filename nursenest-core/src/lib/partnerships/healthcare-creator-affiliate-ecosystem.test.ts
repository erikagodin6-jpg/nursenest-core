import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTENT_COLLABORATION_OPPORTUNITIES,
  CREATOR_RESOURCE_CENTER,
  SOCIAL_CONTENT_LIBRARY,
  buildAffiliateAssets,
  buildPartnershipDashboard,
  buildReviewRequestCandidate,
  prioritizeBacklinkProspects,
  rankSchoolPartnershipPipeline,
  scoreCreatorApplication,
  type BacklinkProspect,
  type CreatorApplication,
  type PartnershipAnalyticsRow,
  type SchoolPartnershipPipelineRow,
} from "@/lib/partnerships/healthcare-creator-affiliate-ecosystem";

const application: CreatorApplication = {
  id: "creator-1",
  name: "Maya Chen",
  profession: "Nursing",
  platforms: ["TikTok", "Instagram"],
  followerCount: 42_000,
  audienceType: "students",
  country: "Canada",
  provinceOrState: "Ontario",
  program: "BScN",
  school: "Northern College",
  engagementRatePct: 5.8,
  monthlyViews: 180_000,
  contentExamples: ["NCLEX study routine", "Clinical placement tips", "Nursing school exam prep"],
  status: "submitted",
  submittedAt: "2026-05-01T12:00:00.000Z",
};

test("scoreCreatorApplication recommends creator tiers from reach, engagement, and fit", () => {
  const score = scoreCreatorApplication(application);

  assert.ok(score.total >= 80);
  assert.equal(score.recommendedTier, "Partner Creator");
  assert.deepEqual(score.reviewFlags, []);

  const small = scoreCreatorApplication({
    ...application,
    id: "small",
    followerCount: 250,
    school: null,
    contentExamples: [],
    engagementRatePct: null,
  });
  assert.equal(small.recommendedTier, "Student Creator");
  assert.ok(small.reviewFlags.length >= 2);
});

test("buildAffiliateAssets creates deterministic affiliate links, coupon codes, and QR payloads", () => {
  const assets = buildAffiliateAssets({
    creatorId: "creator-1",
    creatorName: "Maya Chen",
    origin: "https://nursenest.ca/",
    campaign: "NCLEX Spring Creator Push",
  });

  assert.equal(assets.creatorId, "creator-1");
  assert.equal(assets.couponCode, "NNMAYACHEN");
  assert.match(assets.affiliateLink, /^https:\/\/nursenest\.ca\/signup\?ref=NNMAYACHEN/);
  assert.match(assets.affiliateLink, /utm_campaign=nclex-spring-creator-push/);
  assert.equal(assets.qrCodePayload, assets.affiliateLink);
  assert.equal(assets.lifetimeReferralTracking, true);
});

test("buildPartnershipDashboard tracks clicks, trials, subscriptions, revenue, schools, and backlinks", () => {
  const rows: PartnershipAnalyticsRow[] = [
    {
      partnerId: "creator-1",
      partnerName: "Maya Chen",
      tier: "Partner Creator",
      profession: "Nursing",
      school: "Northern College",
      program: "BScN",
      clicks: 1000,
      trials: 110,
      subscriptions: 40,
      revenueCents: 20_000,
      commissionCents: 4_000,
      backlinks: 2,
      socialShares: 9,
    },
    {
      partnerId: "creator-2",
      partnerName: "RT Study Lab",
      tier: "Verified Creator",
      profession: "Respiratory Therapy",
      school: "Ontario Health College",
      program: "Respiratory Therapy",
      clicks: 300,
      trials: 25,
      subscriptions: 8,
      revenueCents: 5_000,
      commissionCents: 1_000,
      backlinks: 4,
      socialShares: 4,
    },
  ];

  const dashboard = buildPartnershipDashboard(rows);
  assert.equal(dashboard.totalClicks, 1300);
  assert.equal(dashboard.totalTrials, 135);
  assert.equal(dashboard.totalSubscriptions, 48);
  assert.equal(dashboard.totalRevenueCents, 25_000);
  assert.equal(dashboard.totalCommissionCents, 5_000);
  assert.equal(dashboard.backlinkGrowth, 6);
  assert.equal(dashboard.topCreators[0]?.partnerName, "Maya Chen");
  assert.equal(dashboard.topSchools[0]?.school, "Northern College");
  assert.equal(dashboard.topPrograms.some((row) => row.program === "Respiratory Therapy"), true);
});

test("collaboration and social libraries cover awareness, backlinks, trials, and creator sharing", () => {
  assert.equal(CONTENT_COLLABORATION_OPPORTUNITIES.some((item) => item.kind === "Guest Article" && item.goal === "backlinks"), true);
  assert.equal(CONTENT_COLLABORATION_OPPORTUNITIES.some((item) => item.kind === "Webinar" && item.goal === "subscriptions"), true);
  assert.equal(SOCIAL_CONTENT_LIBRARY.some((item) => item.theme === "placement_achievement"), true);
  assert.equal(CREATOR_RESOURCE_CENTER.brandAssets.includes("/brand/logos"), true);
});

test("prioritizeBacklinkProspects ranks authority and relevance opportunities", () => {
  const prospects: BacklinkProspect[] = [
    {
      id: "low",
      kind: "Student Association",
      name: "Small Club",
      url: "https://example.com/small",
      professionFocus: ["Nursing"],
      authorityScore: 35,
      relevanceScore: 70,
      outreachAngle: "Student discount",
      status: "prospect",
    },
    {
      id: "high",
      kind: "Healthcare School",
      name: "College Nursing Program",
      url: "https://example.edu/nursing",
      professionFocus: ["Nursing", "Pre-Nursing"],
      authorityScore: 82,
      relevanceScore: 92,
      outreachAngle: "NCLEX and placement resources",
      status: "responded",
    },
  ];

  const ranked = prioritizeBacklinkProspects(prospects);
  assert.equal(ranked[0]?.id, "high");
  assert.ok((ranked[0]?.opportunityScore ?? 0) > (ranked[1]?.opportunityScore ?? 0));
});

test("rankSchoolPartnershipPipeline and review prompts support institutional and testimonial growth", () => {
  const rows: SchoolPartnershipPipelineRow[] = [
    {
      id: "early",
      schoolName: "Early College",
      program: "RPN",
      status: "outreach",
      meetingCount: 0,
      opportunities: ["Student creator program"],
      institutionalInterest: "medium",
    },
    {
      id: "pilot",
      schoolName: "Northern College",
      program: "BScN",
      status: "pilot_discussion",
      meetingCount: 2,
      opportunities: ["Clinical placement dashboard", "Readiness reporting"],
      institutionalInterest: "high",
    },
  ];

  const ranked = rankSchoolPartnershipPipeline(rows);
  assert.equal(ranked[0]?.id, "pilot");
  assert.ok((ranked[0]?.opportunityScore ?? 0) > 90);

  const prompt = buildReviewRequestCandidate({ learnerId: "learner-1", reason: "passed_exam", profession: "Nursing" });
  assert.equal(prompt.preferredChannels.includes("success-story"), true);
  assert.match(prompt.prompt, /Congratulations/);
});


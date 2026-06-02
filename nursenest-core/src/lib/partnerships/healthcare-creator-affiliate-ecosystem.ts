import type { SuccessProfession } from "@/lib/success/healthcare-student-success-engine";

export type CreatorProfession =
  | "Nursing"
  | "NP"
  | "Respiratory Therapy"
  | "Paramedicine"
  | "Occupational Therapy"
  | "Physiotherapy"
  | "Medical Laboratory Technology"
  | "Pre-Nursing"
  | "HESI"
  | "TEAS";

export type CreatorPlatform = "TikTok" | "Instagram" | "YouTube" | "Podcast" | "Blog" | "LinkedIn" | "Newsletter" | "Campus";

export type CreatorTier =
  | "Student Creator"
  | "Emerging Creator"
  | "Verified Creator"
  | "Partner Creator"
  | "Elite Creator"
  | "Institutional Partner";

export type CreatorApplicationStatus = "submitted" | "review" | "approved" | "waitlisted" | "rejected";

export type CreatorApplication = {
  id: string;
  name: string;
  profession: CreatorProfession;
  platforms: readonly CreatorPlatform[];
  followerCount: number;
  audienceType: "students" | "new-grads" | "practicing-clinicians" | "pre-health" | "mixed";
  country: string;
  provinceOrState?: string | null;
  program?: string | null;
  school?: string | null;
  engagementRatePct?: number | null;
  monthlyViews?: number | null;
  contentExamples: readonly string[];
  status: CreatorApplicationStatus;
  submittedAt: string;
};

export type CreatorApplicationScore = {
  audienceFit: number;
  engagementStrength: number;
  reach: number;
  contentQuality: number;
  strategicFit: number;
  total: number;
  recommendedTier: CreatorTier;
  reviewFlags: readonly string[];
};

export type AffiliateAsset = {
  creatorId: string;
  affiliateLink: string;
  couponCode: string;
  qrCodePayload: string;
  qrCodeFileName: string;
  utmCampaign: string;
  lifetimeReferralTracking: boolean;
};

export type PartnershipAnalyticsRow = {
  partnerId: string;
  partnerName: string;
  tier: CreatorTier;
  profession: CreatorProfession | SuccessProfession;
  school?: string | null;
  program?: string | null;
  clicks: number;
  trials: number;
  subscriptions: number;
  revenueCents: number;
  commissionCents: number;
  backlinks: number;
  socialShares: number;
};

export type PartnershipDashboard = {
  totalClicks: number;
  totalTrials: number;
  totalSubscriptions: number;
  totalRevenueCents: number;
  totalCommissionCents: number;
  averageConversionRate: number;
  topCreators: readonly Array<PartnershipAnalyticsRow & { conversionRate: number }>;
  topSchools: readonly Array<{ school: string; clicks: number; subscriptions: number; revenueCents: number }>;
  topPrograms: readonly Array<{ program: string; subscriptions: number; revenueCents: number }>;
  backlinkGrowth: number;
  activeCreators: number;
  activeAffiliates: number;
};

export type CollaborationKind =
  | "Guest Article"
  | "Guest Lesson"
  | "Interview Feature"
  | "Podcast Feature"
  | "YouTube Collaboration"
  | "Instagram Collaboration"
  | "TikTok Collaboration"
  | "Live Event"
  | "Study Session"
  | "Webinar";

export type CollaborationOpportunity = {
  id: string;
  kind: CollaborationKind;
  title: string;
  idealProfessions: readonly CreatorProfession[];
  goal: "awareness" | "backlinks" | "trials" | "subscriptions" | "authority" | "community";
  deliverables: readonly string[];
  priority: "low" | "medium" | "high";
};

export type BacklinkProspectKind =
  | "Nursing Blog"
  | "RT Blog"
  | "Paramedic Blog"
  | "OT/PT Blog"
  | "MLT Organization"
  | "Student Association"
  | "Healthcare School"
  | "Professional Organization";

export type BacklinkProspect = {
  id: string;
  kind: BacklinkProspectKind;
  name: string;
  url: string;
  professionFocus: readonly CreatorProfession[];
  authorityScore: number;
  relevanceScore: number;
  outreachAngle: string;
  status: "prospect" | "contacted" | "responded" | "won" | "lost";
};

export type CampusRepresentativeProgram = {
  id: string;
  school: string;
  program: string;
  profession: CreatorProfession;
  representativeSlots: number;
  goals: readonly string[];
  rewardModel: readonly string[];
};

export type SchoolPartnershipPipelineRow = {
  id: string;
  schoolName: string;
  program: string;
  contactName?: string | null;
  status: "prospect" | "outreach" | "meeting_scheduled" | "pilot_discussion" | "proposal" | "partnered" | "not_now";
  meetingCount: number;
  opportunities: readonly string[];
  institutionalInterest: "low" | "medium" | "high";
};

export type ReviewRequestCandidate = {
  learnerId: string;
  reason: "high_engagement" | "passed_exam" | "graduated" | "subscriber" | "placement_success";
  profession: SuccessProfession;
  prompt: string;
  preferredChannels: readonly ("google-review" | "testimonial" | "success-story" | "case-study")[];
};

export type SocialContentAsset = {
  id: string;
  title: string;
  theme:
    | "study_milestone"
    | "exam_readiness"
    | "question_milestone"
    | "ecg_achievement"
    | "simulation_achievement"
    | "placement_achievement"
    | "success_story";
  headline: string;
  caption: string;
  recommendedPlatforms: readonly CreatorPlatform[];
};

export type CreatorResourceCenter = {
  mediaKit: string;
  brandAssets: readonly string[];
  productTours: readonly string[];
  referralGuides: readonly string[];
  affiliateMaterials: readonly string[];
  partnershipMaterials: readonly string[];
};

const strategicProfessions = new Set<CreatorProfession>([
  "Nursing",
  "NP",
  "Respiratory Therapy",
  "Paramedicine",
  "Pre-Nursing",
  "HESI",
  "TEAS",
]);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeCoupon(value: string): string {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return cleaned.slice(0, 14) || "NURSENEST";
}

function tierForScore(score: number, application: CreatorApplication): CreatorTier {
  if (application.school && application.platforms.includes("Campus") && application.followerCount >= 0) return "Institutional Partner";
  if (application.followerCount < 500 && !application.school) return "Student Creator";
  if (score >= 92 && application.followerCount >= 100_000) return "Elite Creator";
  if (score >= 84 && application.followerCount >= 35_000) return "Partner Creator";
  if (score >= 74 && application.followerCount >= 8_000) return "Verified Creator";
  if (score >= 60) return "Emerging Creator";
  return "Student Creator";
}

export function scoreCreatorApplication(application: CreatorApplication): CreatorApplicationScore {
  const engagement = application.engagementRatePct ?? 0;
  const examples = application.contentExamples.filter((example) => example.trim()).length;
  const audienceFit = application.audienceType === "students" || application.audienceType === "pre-health" ? 95 : application.audienceType === "mixed" ? 78 : 66;
  const engagementStrength = Math.min(100, Math.round(45 + engagement * 10 + Math.min(15, examples * 3)));
  const reach = Math.min(100, Math.round(35 + Math.log10(Math.max(10, application.followerCount)) * 14 + Math.min(15, (application.monthlyViews ?? 0) / 20_000)));
  const contentQuality = Math.min(100, 45 + Math.min(35, examples * 7) + (application.platforms.includes("YouTube") || application.platforms.includes("Blog") ? 10 : 0) + (application.contentExamples.some((example) => /education|study|clinical|exam|nursing|health/i.test(example)) ? 10 : 0));
  const strategicFit = Math.min(100, 55 + (strategicProfessions.has(application.profession) ? 20 : 10) + (application.school ? 10 : 0) + (application.country.toLowerCase().includes("canada") ? 10 : 0) + (application.platforms.includes("Campus") ? 5 : 0));
  const total = Math.round(audienceFit * 0.22 + engagementStrength * 0.22 + reach * 0.18 + contentQuality * 0.2 + strategicFit * 0.18);
  const reviewFlags = [
    application.contentExamples.length === 0 ? "Needs content examples before approval." : null,
    application.engagementRatePct == null ? "Engagement metrics missing." : null,
    application.followerCount < 500 && !application.school ? "Very small audience; route to student creator review." : null,
  ].filter(Boolean) as string[];

  return {
    audienceFit,
    engagementStrength,
    reach,
    contentQuality,
    strategicFit,
    total,
    recommendedTier: tierForScore(total, application),
    reviewFlags,
  };
}

export function buildAffiliateAssets(args: {
  creatorId: string;
  creatorName: string;
  origin: string;
  campaign?: string;
}): AffiliateAsset {
  const base = args.origin.replace(/\/$/, "");
  const couponCode = sanitizeCoupon(`NN${args.creatorName}`);
  const campaign = slugify(args.campaign ?? `creator-${args.creatorName}`);
  const affiliateLink = `${base}/signup?ref=${encodeURIComponent(couponCode)}&utm_source=creator&utm_medium=affiliate&utm_campaign=${encodeURIComponent(campaign)}`;

  return {
    creatorId: args.creatorId,
    affiliateLink,
    couponCode,
    qrCodePayload: affiliateLink,
    qrCodeFileName: `${slugify(args.creatorName)}-${couponCode.toLowerCase()}-qr.svg`,
    utmCampaign: campaign,
    lifetimeReferralTracking: true,
  };
}

export function buildPartnershipDashboard(rows: readonly PartnershipAnalyticsRow[]): PartnershipDashboard {
  const totalClicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const totalTrials = rows.reduce((sum, row) => sum + row.trials, 0);
  const totalSubscriptions = rows.reduce((sum, row) => sum + row.subscriptions, 0);
  const totalRevenueCents = rows.reduce((sum, row) => sum + row.revenueCents, 0);
  const totalCommissionCents = rows.reduce((sum, row) => sum + row.commissionCents, 0);

  const topCreators = rows
    .map((row) => ({ ...row, conversionRate: row.clicks > 0 ? row.subscriptions / row.clicks : 0 }))
    .sort((a, b) => b.revenueCents - a.revenueCents || b.subscriptions - a.subscriptions)
    .slice(0, 10);

  const topSchools = Array.from(new Set(rows.map((row) => row.school).filter(Boolean) as string[]))
    .map((school) => {
      const schoolRows = rows.filter((row) => row.school === school);
      return {
        school,
        clicks: schoolRows.reduce((sum, row) => sum + row.clicks, 0),
        subscriptions: schoolRows.reduce((sum, row) => sum + row.subscriptions, 0),
        revenueCents: schoolRows.reduce((sum, row) => sum + row.revenueCents, 0),
      };
    })
    .sort((a, b) => b.revenueCents - a.revenueCents);

  const topPrograms = Array.from(new Set(rows.map((row) => row.program).filter(Boolean) as string[]))
    .map((program) => {
      const programRows = rows.filter((row) => row.program === program);
      return {
        program,
        subscriptions: programRows.reduce((sum, row) => sum + row.subscriptions, 0),
        revenueCents: programRows.reduce((sum, row) => sum + row.revenueCents, 0),
      };
    })
    .sort((a, b) => b.revenueCents - a.revenueCents);

  return {
    totalClicks,
    totalTrials,
    totalSubscriptions,
    totalRevenueCents,
    totalCommissionCents,
    averageConversionRate: totalClicks > 0 ? totalSubscriptions / totalClicks : 0,
    topCreators,
    topSchools,
    topPrograms,
    backlinkGrowth: rows.reduce((sum, row) => sum + row.backlinks, 0),
    activeCreators: rows.filter((row) => row.clicks > 0 || row.socialShares > 0).length,
    activeAffiliates: rows.filter((row) => row.subscriptions > 0 || row.trials > 0).length,
  };
}

export const CONTENT_COLLABORATION_OPPORTUNITIES: readonly CollaborationOpportunity[] = [
  {
    id: "nclex-study-session",
    kind: "Live Event",
    title: "NCLEX Readiness Study Session",
    idealProfessions: ["Nursing", "Pre-Nursing"],
    goal: "trials",
    deliverables: ["Live review", "Creator link", "Replay clip", "Related NurseNest study plan"],
    priority: "high",
  },
  {
    id: "rt-abg-guest-guide",
    kind: "Guest Article",
    title: "ABG Interpretation Guide With RT Creator",
    idealProfessions: ["Respiratory Therapy"],
    goal: "backlinks",
    deliverables: ["Guest guide", "Author bio", "Backlink", "Related flashcards"],
    priority: "high",
  },
  {
    id: "teas-admissions-webinar",
    kind: "Webinar",
    title: "ATI TEAS Admissions Strategy Webinar",
    idealProfessions: ["TEAS", "Pre-Nursing"],
    goal: "subscriptions",
    deliverables: ["Webinar", "Coupon code", "Shareable checklist", "Follow-up email"],
    priority: "high",
  },
  {
    id: "paramedic-scenario-collab",
    kind: "YouTube Collaboration",
    title: "Paramedic Scenario Breakdown",
    idealProfessions: ["Paramedicine"],
    goal: "authority",
    deliverables: ["Scenario walkthrough", "Short clips", "Affiliate link", "Related emergency content"],
    priority: "medium",
  },
  {
    id: "placement-confidence-series",
    kind: "Instagram Collaboration",
    title: "Clinical Placement Confidence Series",
    idealProfessions: ["Nursing", "Respiratory Therapy", "Paramedicine", "Occupational Therapy", "Physiotherapy", "Medical Laboratory Technology"],
    goal: "community",
    deliverables: ["Carousel", "Story templates", "Placement checklist", "Success story prompt"],
    priority: "medium",
  },
] as const;

export const SOCIAL_CONTENT_LIBRARY: readonly SocialContentAsset[] = [
  {
    id: "readiness-82",
    title: "Exam Readiness Milestone",
    theme: "exam_readiness",
    headline: "Achieved 82% Readiness",
    caption: "Readiness built through questions, flashcards, CAT exams, and weak-area review.",
    recommendedPlatforms: ["Instagram", "TikTok", "LinkedIn"],
  },
  {
    id: "questions-1000",
    title: "Question Milestone",
    theme: "question_milestone",
    headline: "Completed 1,000 Practice Questions",
    caption: "Practice with rationales, clinical pearls, and topic-based remediation.",
    recommendedPlatforms: ["Instagram", "TikTok"],
  },
  {
    id: "ecg-foundations",
    title: "ECG Achievement",
    theme: "ecg_achievement",
    headline: "Mastered ECG Foundations",
    caption: "Rhythm recognition, clinical significance, and escalation practice.",
    recommendedPlatforms: ["Instagram", "YouTube", "LinkedIn"],
  },
  {
    id: "placement-complete",
    title: "Placement Achievement",
    theme: "placement_achievement",
    headline: "Completed Clinical Placement",
    caption: "Clinical growth, skills practice, and professional confidence.",
    recommendedPlatforms: ["LinkedIn", "Instagram"],
  },
] as const;

export const CREATOR_RESOURCE_CENTER: CreatorResourceCenter = {
  mediaKit: "/partners/media-kit",
  brandAssets: ["/brand/logos", "/brand/colors", "/public/images/marketing"],
  productTours: ["/pricing", "/app/learning-ecosystem", "/success-stories"],
  referralGuides: ["/partners/referral-guide", "/partners/affiliate-faq"],
  affiliateMaterials: ["/partners/coupon-guide", "/partners/qr-assets", "/partners/revenue-attribution"],
  partnershipMaterials: ["/for-institutions", "/partners/school-pilot", "/partners/webinar-kit"],
};

export function prioritizeBacklinkProspects(prospects: readonly BacklinkProspect[]): readonly Array<BacklinkProspect & { opportunityScore: number }> {
  return prospects
    .map((prospect) => ({
      ...prospect,
      opportunityScore: Math.round(prospect.authorityScore * 0.45 + prospect.relevanceScore * 0.45 + (prospect.status === "responded" ? 10 : prospect.status === "prospect" ? 5 : 0)),
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function rankSchoolPartnershipPipeline(rows: readonly SchoolPartnershipPipelineRow[]): readonly Array<SchoolPartnershipPipelineRow & { opportunityScore: number }> {
  const statusWeight: Record<SchoolPartnershipPipelineRow["status"], number> = {
    prospect: 20,
    outreach: 35,
    meeting_scheduled: 55,
    pilot_discussion: 75,
    proposal: 85,
    partnered: 100,
    not_now: 10,
  };
  const interestWeight = { low: 10, medium: 25, high: 40 } satisfies Record<SchoolPartnershipPipelineRow["institutionalInterest"], number>;
  return rows
    .map((row) => ({
      ...row,
      opportunityScore: Math.min(100, statusWeight[row.status] + interestWeight[row.institutionalInterest] + Math.min(15, row.meetingCount * 5) + Math.min(10, row.opportunities.length * 2)),
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function buildReviewRequestCandidate(args: {
  learnerId: string;
  reason: ReviewRequestCandidate["reason"];
  profession: SuccessProfession;
}): ReviewRequestCandidate {
  const promptByReason: Record<ReviewRequestCandidate["reason"], string> = {
    high_engagement: "You have been putting in serious study time. Would you share a quick review about what NurseNest has helped you with so far?",
    passed_exam: "Congratulations on your pass. Your story could help the next learner prepare with more confidence.",
    graduated: "Your program milestone matters. Share what helped you stay ready through school and clinical learning.",
    subscriber: "Thanks for being part of NurseNest. A short review helps other healthcare learners decide whether it is right for them.",
    placement_success: "Your clinical placement experience could help another student walk into placement more prepared.",
  };
  return {
    learnerId: args.learnerId,
    reason: args.reason,
    profession: args.profession,
    prompt: promptByReason[args.reason],
    preferredChannels: args.reason === "passed_exam" ? ["success-story", "testimonial", "google-review", "case-study"] : ["testimonial", "google-review"],
  };
}

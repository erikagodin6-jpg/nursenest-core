import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  CONTENT_COLLABORATION_OPPORTUNITIES,
  CREATOR_RESOURCE_CENTER,
  SOCIAL_CONTENT_LIBRARY,
  buildAffiliateAssets,
  buildPartnershipDashboard,
  prioritizeBacklinkProspects,
  rankSchoolPartnershipPipeline,
  scoreCreatorApplication,
  type BacklinkProspect,
  type CreatorApplication,
  type PartnershipAnalyticsRow,
  type SchoolPartnershipPipelineRow,
} from "../src/lib/partnerships/healthcare-creator-affiliate-ecosystem";

const demoApplication: CreatorApplication = {
  id: "creator-demo-1",
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

const analyticsRows: PartnershipAnalyticsRow[] = [
  {
    partnerId: "creator-demo-1",
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
    partnerId: "creator-demo-2",
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

const backlinkProspects: BacklinkProspect[] = [
  {
    id: "healthcare-school-nursing",
    kind: "Healthcare School",
    name: "College Nursing Program Resource Page",
    url: "https://example.edu/nursing/resources",
    professionFocus: ["Nursing", "Pre-Nursing"],
    authorityScore: 82,
    relevanceScore: 92,
    outreachAngle: "Offer NCLEX, placement, and admissions resource links for students.",
    status: "responded",
  },
  {
    id: "rt-student-blog",
    kind: "RT Blog",
    name: "Respiratory Student Notes",
    url: "https://example.com/rt-students",
    professionFocus: ["Respiratory Therapy"],
    authorityScore: 64,
    relevanceScore: 88,
    outreachAngle: "Collaborate on ABG interpretation and ventilator basics resources.",
    status: "prospect",
  },
];

const schoolPipeline: SchoolPartnershipPipelineRow[] = [
  {
    id: "northern-bscn",
    schoolName: "Northern College",
    program: "BScN",
    status: "pilot_discussion",
    meetingCount: 2,
    opportunities: ["Clinical placement dashboard", "Readiness reporting", "Campus representative program"],
    institutionalInterest: "high",
  },
  {
    id: "early-rpn",
    schoolName: "Early College",
    program: "RPN",
    status: "outreach",
    meetingCount: 0,
    opportunities: ["Student creator program"],
    institutionalInterest: "medium",
  },
];

const score = scoreCreatorApplication(demoApplication);
const assets = buildAffiliateAssets({
  creatorId: demoApplication.id,
  creatorName: demoApplication.name,
  origin: "https://nursenest.ca",
  campaign: "NCLEX Spring Creator Push",
});
const dashboard = buildPartnershipDashboard(analyticsRows);
const backlinks = prioritizeBacklinkProspects(backlinkProspects);
const schools = rankSchoolPartnershipPipeline(schoolPipeline);

const report = `# Healthcare Creator, Influencer & Affiliate Ecosystem

Generated: ${new Date().toISOString()}

## Implementation Summary

The creator and affiliate foundation is implemented in \`src/lib/partnerships/healthcare-creator-affiliate-ecosystem.ts\`.

It supports:

- Creator applications across nursing, NP, RT, paramedic, OT, PT, MLT, pre-nursing, HESI, and TEAS audiences.
- Tier recommendations for Student Creator, Emerging Creator, Verified Creator, Partner Creator, Elite Creator, and Institutional Partner.
- Affiliate links, coupon codes, QR payloads, UTM campaigns, and lifetime referral tracking contracts.
- Partnership dashboard aggregation for clicks, trials, subscriptions, revenue, commissions, conversion rates, creators, schools, programs, backlinks, and active affiliates.
- Content collaboration opportunities for guest articles, interviews, podcasts, YouTube, Instagram, TikTok, live events, study sessions, and webinars.
- Backlink prospect prioritization for blogs, schools, associations, and professional organizations.
- Campus representative and school partnership pipeline models.
- Review request prompts for high-engagement learners, exam passes, graduates, subscribers, and placement successes.
- Creator resource center metadata for media kits, brand assets, screenshots, tours, guides, and partnership materials.

## Demo Creator Intake

- Creator: ${demoApplication.name}
- Profession: ${demoApplication.profession}
- Platforms: ${demoApplication.platforms.join(", ")}
- Score: ${score.total}/100
- Recommended tier: ${score.recommendedTier}
- Review flags: ${score.reviewFlags.length ? score.reviewFlags.join("; ") : "None"}

## Affiliate Asset Contract

- Coupon code: ${assets.couponCode}
- UTM campaign: ${assets.utmCampaign}
- Lifetime tracking: ${assets.lifetimeReferralTracking ? "Yes" : "No"}
- QR file name: ${assets.qrCodeFileName}

## Partnership Dashboard Signals

- Clicks: ${dashboard.totalClicks}
- Trials: ${dashboard.totalTrials}
- Subscriptions: ${dashboard.totalSubscriptions}
- Revenue: $${(dashboard.totalRevenueCents / 100).toFixed(2)}
- Commissions: $${(dashboard.totalCommissionCents / 100).toFixed(2)}
- Average conversion rate: ${(dashboard.averageConversionRate * 100).toFixed(1)}%
- Backlink growth: ${dashboard.backlinkGrowth}
- Active creators: ${dashboard.activeCreators}
- Active affiliates: ${dashboard.activeAffiliates}

## Top Opportunities

- Top creator: ${dashboard.topCreators[0]?.partnerName ?? "None"}
- Top school: ${dashboard.topSchools[0]?.school ?? "None"}
- Highest backlink prospect: ${backlinks[0]?.name ?? "None"} (${backlinks[0]?.opportunityScore ?? 0}/100)
- Highest school pipeline opportunity: ${schools[0]?.schoolName ?? "None"} (${schools[0]?.opportunityScore ?? 0}/100)

## Collaboration Coverage

- Collaboration templates: ${CONTENT_COLLABORATION_OPPORTUNITIES.length}
- Social content assets: ${SOCIAL_CONTENT_LIBRARY.length}
- Resource center media kit: ${CREATOR_RESOURCE_CENTER.mediaKit}

## Next Integration Points

1. Persist creator applications, affiliate assets, and partnership analytics in the existing referrals/attribution data model or a dedicated reviewed partner table.
2. Add admin-only application review and partner dashboard surfaces.
3. Connect Stripe revenue and referral attribution to partner commission summaries.
4. Generate QR assets from \`qrCodePayload\` during the marketing asset build step.
5. Feed review prompts into the Healthcare Student Success Stories & Outcomes Engine.
6. Track backlinks/referring domains through the SEO command center once GSC/analytics data is wired.
`;

const reportPath = path.join(process.cwd(), "docs/reports/healthcare-creator-affiliate-ecosystem.md");
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, report);
console.log(`Wrote ${reportPath}`);


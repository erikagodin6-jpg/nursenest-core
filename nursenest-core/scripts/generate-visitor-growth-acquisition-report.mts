import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  acquisitionPriorityScore,
  buildExecutiveGrowthDashboard,
  buildVisitorGrowthAcquisitionPlan,
  type RevenueAttributionRow,
} from "../src/lib/seo/visitor-growth-acquisition-engine";

const outPath = join(process.cwd(), "docs", "reports", "seo-traffic-acquisition-master-sprint.md");

const plan = buildVisitorGrowthAcquisitionPlan();
const rows: RevenueAttributionRow[] = [
  row("how to become a nurse in ontario", "/careers/how-to-become-a-nurse-in-ontario", "organic", "RN", "Nursing Careers", 120, 50, 20, 12, 58000),
  row("respiratory therapist salary canada", "/rt/respiratory-therapist-salary-canada", "organic", "RT", "RT Careers", 60, 20, 8, 4, 39200),
  row("nclex rn guide", "/certification/nclex-rn-ultimate-guide", "referral", "RN", "NCLEX", 80, 40, 16, 10, 46400),
  row("paramedic programs ontario", "/schools/best-paramedic-programs-in-ontario", "organic", "Paramedic", "Paramedic Schools", 45, 14, 5, 2, 24500),
];

const dashboard = buildExecutiveGrowthDashboard({
  organicTraffic: 10000,
  emailSubscribers: 900,
  accountsCreated: 500,
  trialsStarted: 200,
  subscriptions: 60,
  revenueCents: 174000,
  attributionRows: rows,
});

const priorityExamples = [
  ["Healthcare Career Authority", acquisitionPriorityScore({ trafficOpportunity: 95, conversionOpportunity: 78, backlinkOpportunity: 70, authorityOpportunity: 86, productionEffort: 45 })],
  ["Certification Guide Domination", acquisitionPriorityScore({ trafficOpportunity: 88, conversionOpportunity: 92, backlinkOpportunity: 55, authorityOpportunity: 82, productionEffort: 40 })],
  ["Free Resource Library", acquisitionPriorityScore({ trafficOpportunity: 75, conversionOpportunity: 80, backlinkOpportunity: 90, authorityOpportunity: 72, productionEffort: 30 })],
  ["Scholarship & PR", acquisitionPriorityScore({ trafficOpportunity: 50, conversionOpportunity: 45, backlinkOpportunity: 95, authorityOpportunity: 84, productionEffort: 35 })],
] as const;

const markdown = `# SEO & Traffic Acquisition Master Sprint

Generated: ${new Date().toISOString()}

## Objective

Increase organic traffic, email subscribers, account registrations, free trial starts, and paid subscriptions while building long-term healthcare authority.

Primary filter: every initiative should bring new people to NurseNest or convert acquired visitors into leads, accounts, trials, or subscribers.

## Acquisition Projects

${plan.projects.map((project, index) => `${index + 1}. ${project}`).join("\n")}

## Project 1: Healthcare Career Authority Engine

Seed pages: ${plan.careerAuthoritySeeds.length}

| Page | Profession | Province Specific | School Expansion |
| --- | --- | --- | --- |
${plan.careerAuthoritySeeds.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.provinceSpecific ? "Yes" : "No"} | ${seed.schoolSpecificExpansion ? "Yes" : "No"} |`).join("\n")}

## Project 2: Certification Guide Domination

| Guide | Profession | Required Blocks |
| --- | --- | --- |
${plan.certificationGuideSeeds.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.includes.join(", ")} |`).join("\n")}

## Project 3: School & Program Directory Engine

| Page | Profession | Geography | Required Blocks |
| --- | --- | --- | --- |
${plan.schoolDirectorySeeds.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.geography} | ${seed.requiredBlocks.join(", ")} |`).join("\n")}

## Project 4: Comparison Page Engine

| Page | Intent | Conversion Intent |
| --- | --- | --- |
${plan.comparisonPageSeeds.map((seed) => `| ${seed.title} | ${seed.intent} | ${seed.conversionIntent} |`).join("\n")}

## Project 5: Free Resource Library

| Resource | Profession | Format | Email Capture | Backlink Potential |
| --- | --- | --- | --- | --- |
${plan.freeResourceSeeds.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.format} | Required | ${seed.backlinkPotential} |`).join("\n")}

## Project 6: Email Lead Magnet System

| Lead Magnet | Profession | Includes |
| --- | --- | --- |
${plan.emailLeadMagnets.map((seed) => `| ${seed.title} | ${seed.profession} | ${seed.includes.join(", ")} |`).join("\n")}

## Project 7: CTA Optimization Engine

Every audited public page family requires: primary CTA, secondary CTA, related resource CTA, trial CTA, and account creation CTA.

Surfaces covered: ${plan.ctaRequirements.map((item) => item.surface).join(", ")}

## Project 8: Backlink Magnet System

| Asset | Outputs | Audiences |
| --- | --- | --- |
${plan.backlinkMagnets.map((seed) => `| ${seed.title} | ${seed.outputs.join(", ")} | ${seed.backlinkAudience.join(", ")} |`).join("\n")}

## Project 9: Scholarship & PR Program

| Program | Audience | Authority Benefits |
| --- | --- | --- |
${plan.scholarshipPrograms.map((seed) => `| ${seed.title} | ${seed.audience} | ${seed.authorityBenefits.join(", ")} |`).join("\n")}

## Project 10: Content To Account Conversion System

Account-required actions: ${plan.contentToAccountActions.join(", ")}

## Project 11: Revenue Attribution Engine

Tracks keyword, landing page, traffic source, account creation, trial start, subscription, renewal, and revenue.

### Sample Revenue Attribution

#### Top Subscriber Pages
${dashboard.revenueAttribution.topSubscriberPages.map((item) => `- ${item.page}: ${item.subscriptions} subscriptions, $${(item.revenueCents / 100).toFixed(2)}`).join("\n")}

#### Professions By Revenue
${dashboard.revenueAttribution.professionsByRevenue.map((item) => `- ${item.profession}: $${(item.revenueCents / 100).toFixed(2)}`).join("\n")}

#### Traffic Sources By Revenue
${dashboard.revenueAttribution.trafficSourcesByRevenue.map((item) => `- ${item.trafficSource}: $${(item.revenueCents / 100).toFixed(2)}`).join("\n")}

## Project 12: Executive SEO & Growth Dashboard

| Metric | Sample Value |
| --- | ---: |
| Organic Traffic | ${dashboard.organicTraffic.toLocaleString()} |
| Email Subscribers | ${dashboard.emailSubscribers.toLocaleString()} |
| Accounts Created | ${dashboard.accountsCreated.toLocaleString()} |
| Trials Started | ${dashboard.trialsStarted.toLocaleString()} |
| Subscriptions | ${dashboard.subscriptions.toLocaleString()} |
| Revenue | $${(dashboard.revenueCents / 100).toFixed(2)} |
| Visitor To Account | ${(dashboard.visitorToAccountRate * 100).toFixed(1)}% |
| Account To Trial | ${(dashboard.accountToTrialRate * 100).toFixed(1)}% |
| Trial To Paid | ${(dashboard.trialToPaidRate * 100).toFixed(1)}% |

Top landing pages: ${dashboard.topLandingPages.join(", ")}

Top keywords: ${dashboard.topKeywords.join(", ")}

Top allied health pages: ${dashboard.topAlliedHealthPages.join(", ")}

Top career pages: ${dashboard.topCareerPages.join(", ")}

Top certification pages: ${dashboard.topCertificationPages.join(", ")}

## Acquisition Priority Examples

${priorityExamples.map(([label, score]) => `- ${label}: ${score}/100`).join("\n")}

## Success Targets

- Thousands of indexed acquisition pages.
- Significant organic traffic growth.
- Large email subscriber base.
- Improved trial starts.
- Improved subscription conversion.
- Stronger backlinks and healthcare authority.
- Meaningful allied health traffic before learners are actively searching for exam prep.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);

function row(
  keyword: RevenueAttributionRow["keyword"],
  landingPage: RevenueAttributionRow["landingPage"],
  trafficSource: RevenueAttributionRow["trafficSource"],
  profession: RevenueAttributionRow["profession"],
  cluster: RevenueAttributionRow["cluster"],
  accountsCreated: number,
  trialStarts: number,
  subscriptions: number,
  renewals: number,
  revenueCents: number,
): RevenueAttributionRow {
  return { keyword, landingPage, trafficSource, profession, cluster, accountsCreated, trialStarts, subscriptions, renewals, revenueCents };
}

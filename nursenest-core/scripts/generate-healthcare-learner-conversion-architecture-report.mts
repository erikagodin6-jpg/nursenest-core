import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  ACCOUNT_CREATION_TRIGGERS,
  CONTENT_CONVERSION_PATHS,
  INTELLIGENT_PAYWALL_RULES,
  LEAD_MAGNETS,
  PROFESSION_FUNNELS,
  SUBSCRIPTION_VALUE_COMMUNICATION,
  buildConversionAttributionSummary,
  buildExecutiveConversionDashboard,
  buildSocialProofLines,
  type ConversionAttributionEvent,
} from "../src/lib/conversion/healthcare-learner-conversion-architecture";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-learner-conversion-architecture.md");

const sampleEvents: ConversionAttributionEvent[] = [
  event("visitor-rn-1", "user-rn-1", "account_creation", "/conditions/heart-failure", "Disease Page", "Heart Failure", "RN", "Questions", 0),
  event("visitor-rn-1", "user-rn-1", "trial", "/conditions/heart-failure", "Disease Page", "Heart Failure", "RN", "Readiness", 0),
  event("visitor-rn-1", "user-rn-1", "subscription", "/conditions/heart-failure", "Disease Page", "Heart Failure", "RN", "Questions", 2900),
  event("visitor-rt-1", "user-rt-1", "account_creation", "/rt/abg-interpretation-guide", "Lab Page", "ABG Interpretation", "RT", "Labs", 0),
  event("visitor-rt-1", "user-rt-1", "trial", "/rt/abg-interpretation-guide", "Lab Page", "ABG Interpretation", "RT", "Labs", 0),
  event("visitor-rt-1", "user-rt-1", "subscription", "/rt/abg-interpretation-guide", "Lab Page", "ABG Interpretation", "RT", "Labs", 4900),
  event("visitor-adm-1", "user-adm-1", "subscription", "/admissions/hesi-a2-study-guide", "Certification Guide", "HESI A2", "Admissions", "Study Plans", 3900),
];

const attribution = buildConversionAttributionSummary(sampleEvents);
const dashboard = buildExecutiveConversionDashboard({
  visitors: 2500,
  accounts: 310,
  trials: 142,
  paid: 37,
  renewals: 29,
  attribution,
  events: sampleEvents,
});

const markdown = `# Healthcare Learner Conversion Architecture

Generated: ${new Date().toISOString()}

## Objective

Transform anonymous healthcare education visitors into registered users, trial users, paid subscribers, and long-term members without weakening SEO, EEAT, or learner trust.

## Conversion Model

NurseNest public content should educate first, then invite account creation for useful actions, then offer bounded trials, then communicate premium subscription value.

| Stage | Purpose |
| --- | --- |
| Free Value | Let visitors understand the topic, profession, exam, or clinical skill. |
| Account Creation | Trigger when the learner wants to save, track, calculate, plan, or personalize. |
| Trial | Let qualified learners experience premium training in a bounded way. |
| Subscription | Unlock full practice, readiness analytics, simulations, and adaptive study loops. |
| Long-Term Member | Reinforce progress, retained value, feature discovery, and renewal trust. |

## Public Content Conversion Paths

| Surface | Free CTA | Account CTA | Trial CTA | Subscription CTA | Preview Cards |
| --- | --- | --- | --- | --- | --- |
${CONTENT_CONVERSION_PATHS.map((path) => `| ${path.surface} | ${path.freeValueCta} | ${path.accountCta} | ${path.trialCta} | ${path.subscriptionCta} | ${path.relatedPremiumPreviewCards.join(", ")} |`).join("\n")}

## Account Creation Triggers

${ACCOUNT_CREATION_TRIGGERS.map((trigger) => `- ${trigger}`).join("\n")}

## Lead Magnets

| Lead Magnet | Profession | Questions | Flashcards | Mini Lessons | Requires Account |
| --- | --- | ---: | ---: | ---: | --- |
${LEAD_MAGNETS.map((lead) => `| ${lead.title} | ${lead.profession} | ${lead.included.questions} | ${lead.included.flashcards} | ${lead.included.miniLessons} | ${lead.requiresAccount ? "Yes" : "No"} |`).join("\n")}

## Intelligent Paywall Rules

| Feature | Free Use Threshold | Prompt | Upgrade CTA |
| --- | ---: | --- | --- |
${INTELLIGENT_PAYWALL_RULES.map((rule) => `| ${rule.feature} | ${rule.freeUsageThreshold} ${rule.thresholdUnit} | ${rule.promptTitle} | ${rule.upgradeCta} |`).join("\n")}

## Profession-Specific Funnels

| Profession | Entry Surfaces | Lead Magnets | Discovery Features | Profession-Specific Proof |
| --- | --- | --- | --- | --- |
${PROFESSION_FUNNELS.map((funnel) => `| ${funnel.profession} | ${funnel.entrySurfaces.join(", ")} | ${funnel.leadMagnets.join(", ") || "None"} | ${funnel.discoveryFeatures.join(", ")} | ${funnel.professionSpecificProof.join(", ")} |`).join("\n")}

## Subscription Value Communication

### Free Includes
${SUBSCRIPTION_VALUE_COMMUNICATION.freeIncludes.map((item) => `- ${item}`).join("\n")}

### Premium Includes
${SUBSCRIPTION_VALUE_COMMUNICATION.premiumIncludes.map((item) => `- ${item}`).join("\n")}

### Problems Solved
${SUBSCRIPTION_VALUE_COMMUNICATION.problemsSolved.map((item) => `- ${item}`).join("\n")}

### Differentiators
${SUBSCRIPTION_VALUE_COMMUNICATION.differentiators.map((item) => `- ${item}`).join("\n")}

## Executive Dashboard Contract

| Metric | Sample Value |
| --- | ---: |
| Visitor To Account | ${(dashboard.visitorToAccountRate * 100).toFixed(1)}% |
| Account To Trial | ${(dashboard.accountToTrialRate * 100).toFixed(1)}% |
| Trial To Paid | ${(dashboard.trialToPaidRate * 100).toFixed(1)}% |
| Paid To Renewal | ${(dashboard.paidToRenewalRate * 100).toFixed(1)}% |

## Revenue Attribution Contract

### By Profession
${Object.entries(dashboard.revenueByProfession).map(([profession, cents]) => `- ${profession}: $${(cents / 100).toFixed(2)}`).join("\n")}

### By Cluster
${Object.entries(dashboard.revenueByCluster).map(([cluster, cents]) => `- ${cluster}: $${(cents / 100).toFixed(2)}`).join("\n")}

### By Feature
${Object.entries(dashboard.revenueByFeature).map(([feature, cents]) => `- ${feature}: $${((cents ?? 0) / 100).toFixed(2)}`).join("\n")}

## Social Proof Surfaces

${buildSocialProofLines({
  questionsCompleted: 1287000,
  learnersServed: 42000,
  hoursStudied: 91000,
  successStories: 375,
  certificationSuccesses: 220,
  programAdmissions: 160,
  clinicalPlacementOutcomes: 90,
}).map((line) => `- ${line}`).join("\n")}

## Guardrails

- Public pages answer what the topic is and why it matters.
- Premium experiences answer whether the learner can perform, reason, and improve.
- Account prompts are tied to useful saved state or personalization.
- Trial prompts appear after meaningful free use, not on first contact.
- Allied health funnels use profession-specific proof instead of nursing copy with renamed labels.
- Attribution must connect page, cluster, profession, feature, account, trial, subscription, renewal, and revenue.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);

function event(
  visitorId: string,
  userId: string,
  stage: ConversionAttributionEvent["stage"],
  sourcePage: string,
  sourceSurface: ConversionAttributionEvent["sourceSurface"],
  cluster: string,
  profession: ConversionAttributionEvent["profession"],
  feature: ConversionAttributionEvent["feature"],
  revenueCents: number,
): ConversionAttributionEvent {
  return {
    visitorId,
    userId,
    stage,
    sourcePage,
    sourceSurface,
    cluster,
    profession,
    feature,
    contentType: sourceSurface,
    occurredAt: "2026-05-31T00:00:00.000Z",
    revenueCents,
  };
}

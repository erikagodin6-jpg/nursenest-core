#!/usr/bin/env node
/**
 * Idempotent merge: add REQUIRED_PAGE_KEYS + conversionClarity strings missing from
 * `public/i18n/en/pages.json` so validate-marketing-production-surface + pricing UI
 * never fall through to missing-key sentinels. FAQ headings in `forceHeadingKeys`
 * are always overwritten to match `pricing-marketing-polish.contract.test.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES_EN = path.join(pkgRoot, "public", "i18n", "en", "pages.json");

const additions = {
  "pages.home.hero.subheading2":
    "Designed for busy schedules with clinically grounded practice and progress you can trust.",
  "pages.home.hero.scanItem1": "Adaptive question banks with rationales you can revisit anytime.",
  "pages.home.hero.scanItem2": "Pathway lessons and drills that respect how nursing exams actually read.",
  "pages.home.hero.scanItem3": "Flashcards and quick sets for high-yield topics between shifts.",
  "pages.home.hero.scanItem4": "Progress signals so you know what to study next—not just how many items you clicked.",
  "pages.home.carouselHandoff.kicker": "See the study experience",
  "pages.home.carouselHandoff.lead":
    "Swipe through lessons, questions, and flashcards so you know what you are getting before you start.",
  "pages.home.howItWorks.kicker": "How NurseNest works",
  "pages.home.globalRegions.expansionFootnote":
    "More regions may roll out over time. Taxes and local pricing rules may still apply at checkout.",

  "pages.pricing.rowPlansLoading": "Loading plans…",
  "pages.pricing.plan.durationNotOffered": "Not offered for this plan on this track.",
  "pages.pricing.error.pricingTemporarilyUnavailable":
    "Pricing is temporarily unavailable. Please try again in a moment.",
  "pages.pricing.error.trackTemporarilyUnavailable":
    "That track is temporarily unavailable. Pick another track or refresh the page.",
  "pages.pricing.checkout.unavailableBody":
    "Checkout is not available for this selection right now. Try another plan or refresh.",
  "pages.pricing.plan.rowDataIncomplete":
    "Some plan details are incomplete. Refresh the page or choose another option.",
  "pages.pricing.globalContext.northAmericaStripeScope":
    "NurseNest checkout currently supports United States and Canada billing addresses for these pathways.",
  "pages.pricing.globalContext.northAmericaStripeScopeAria": "North America billing region notice",
  "pages.pricing.globalContext.ackNorthAmericaBillingLabel":
    "I understand my card may be billed in USD or CAD for North America pathways.",
  "pages.pricing.globalContext.mustAckBeforeCheckout":
    "Confirm North America billing above to continue to checkout.",
  "pages.pricing.checkout.ctaJoinNorthAmericaPathways": "Join with North America checkout",
  "pages.pricing.checkout.northAmericaBillingSubcopy":
    "Prices may display in CAD with taxes finalized at checkout.",
  "pages.pricing.checkout.continueToSecureCheckout": "Continue to secure checkout",
  "pages.pricing.checkout.continueToNorthAmericaCheckout": "Continue to North America checkout",

  "pages.pricing.conversionClarity.eyebrow": "Pricing clarity",
  "pages.pricing.conversionClarity.heading": "Straight Answers Before You Subscribe",
  "pages.pricing.conversionClarity.intro":
    "Understand what you are buying before checkout—what is included, what is not, and how billing works across regions.",
  "pages.pricing.conversionClarity.value1Title": "Built for exam-day readiness",
  "pages.pricing.conversionClarity.value1Body":
    "Structured practice with explanations you can revisit, plus sets that mirror high-stakes item styles.",
  "pages.pricing.conversionClarity.value2Title": "Designed for busy student schedules",
  "pages.pricing.conversionClarity.value2Body":
    "Short study blocks, saved progress, and layouts that work on phones between shifts.",
  "pages.pricing.conversionClarity.value3Title": "Regional pathways where we support them",
  "pages.pricing.conversionClarity.value3Body":
    "Pick the pathway that matches your license goal—offers adapt to what is available in your region.",
  "pages.pricing.conversionClarity.included1": "Practice questions with explanations",
  "pages.pricing.conversionClarity.included2": "Lessons and guided study paths where available",
  "pages.pricing.conversionClarity.included3": "Progress tracking for your current access window",
  "pages.pricing.conversionClarity.included4": "Secure billing through Stripe",
  "pages.pricing.conversionClarity.included5": "Account access during your active subscription window",
  "pages.pricing.conversionClarity.notIncluded1": "Guaranteed passing scores or exam outcomes",
  "pages.pricing.conversionClarity.notIncluded2": "Clinical placement or employer verification services",
  "pages.pricing.conversionClarity.notIncluded3": "Offline-only delivery outside NurseNest apps",
  "pages.pricing.conversionClarity.includedHeading": "What memberships commonly include",
  "pages.pricing.conversionClarity.notIncludedHeading": "What we do not promise",
  "pages.pricing.conversionClarity.notIncludedLead":
    "Educational products cannot replace clinical judgment, faculty guidance, or your board’s rules.",
  "pages.pricing.conversionClarity.reassureCancelTitle": "Cancellation and renewals",
  "pages.pricing.conversionClarity.reassureCancelBody":
    "Manage renewal from your account. If you cancel, access continues through the end of the paid period unless your plan states otherwise.",
  "pages.pricing.conversionClarity.reassureFeesTitle": "Fees and taxes",
  "pages.pricing.conversionClarity.reassureFeesBody":
    "Displayed prices may exclude applicable taxes. Final totals appear at checkout before you pay.",
  "pages.pricing.conversionClarity.reassureSecureTitle": "Secure checkout",
  "pages.pricing.conversionClarity.reassureSecureBody":
    "Payments are processed with industry-standard encryption. We avoid storing full card numbers on NurseNest servers.",
  "pages.pricing.conversionClarity.worthItQuestion": "Is this worth it if I am tight on time?",
  "pages.pricing.conversionClarity.worthItAnswer":
    "Most learners pick a focus track and follow short drills. If you will not open the app weekly, wait until you can commit a few focused sessions.",
  "pages.pricing.conversionClarity.afterPayQuestion": "What happens right after I pay?",
  "pages.pricing.conversionClarity.afterPayAnswer":
    "You should land in-account quickly. If anything looks off, contact support with your receipt email and we will help.",
  "pages.pricing.conversionClarity.afterPayRefundLink": "Refund policy",
  "pages.pricing.conversionClarity.afterPayRefundSuffix": " is linked from checkout and your receipt email.",
  "pages.pricing.conversionClarity.afterPayTermsLink": "Terms",
  "pages.pricing.conversionClarity.afterPayTermsSuffix": " apply to access and acceptable use.",

  /** Aligns with `pricing-marketing-polish.contract.test.ts` title-case contract. */
  "pages.pricing.regionFaq.heading": "Which Country and Exam Is This For?",
  "pages.pricing.reliabilityFaq.heading": "Can I Count on NurseNest While I Study?",
  "pages.pricing.learnerFaq.heading":
    "If You Are Worried About Money, Readiness, or Whether This Is for You",
};

const pages = JSON.parse(fs.readFileSync(PAGES_EN, "utf8"));
/** Title-case headings locked by `pricing-marketing-polish.contract.test.ts`. */
const forceHeadingKeys = new Set([
  "pages.pricing.regionFaq.heading",
  "pages.pricing.reliabilityFaq.heading",
  "pages.pricing.learnerFaq.heading",
]);
for (const [k, v] of Object.entries(additions)) {
  if (!forceHeadingKeys.has(k) && typeof pages[k] === "string" && pages[k].trim().length > 0) {
    console.warn("[patch-en-pages] skip existing non-empty:", k);
    continue;
  }
  pages[k] = v;
}
fs.writeFileSync(PAGES_EN, JSON.stringify(pages));
console.log("[patch-en-pages] merged", Object.keys(additions).length, "keys into", path.relative(pkgRoot, PAGES_EN));

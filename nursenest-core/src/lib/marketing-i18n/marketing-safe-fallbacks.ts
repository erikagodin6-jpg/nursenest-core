/**
 * Deliberate, brand-safe fallback strings for public marketing when i18n is missing or unsafe.
 * Never use generic placeholders ("Title", "Description", "Button"). Never derive from message keys.
 *
 * Region-specific SEO defaults for hubs live in {@link @/lib/marketing/nursing-tier-public-labels}
 * and are passed into strict metadata helpers at call sites.
 */

/** Short brand line for emergencies (Open Graph / Twitter when nothing else is safe). */
export const DEFAULT_SITE_BRAND_TITLE = "NurseNest";

/** One-paragraph NurseNest positioning — used only as a last-resort metadata description. */
export const DEFAULT_SITE_PRIMARY_DESCRIPTION =
  "Canada-first nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams — built for nurses worldwide.";

/** Pricing hero H1 when required i18n keys are absent (production continuity only). */
export const MARKETING_PRICING_CONVERSION_H1_FALLBACK = "Plans by exam pathway";

/** Pricing trust line under the hero when the canonical key is missing. */
export const MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK =
  "Prices in CAD or USD for your selected region. No surprise charges at checkout.";

/** Pricing hero supporting paragraph when the canonical key is missing. */
export const MARKETING_PRICING_CONVERSION_LEAD_FALLBACK =
  "Choose your exam track, country, and billing term. Totals are shown before you pay; longer terms usually lower your effective monthly cost.";

/** Per-tier narrative subhead when a tier’s narrative key is missing. */
export const MARKETING_PRICING_TIER_SUBHEAD_FALLBACK =
  "Pick a billing cadence that fits your study plan and exam date.";

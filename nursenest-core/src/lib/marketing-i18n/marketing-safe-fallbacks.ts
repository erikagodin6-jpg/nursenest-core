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

/** Allied health hub index — production metadata continuity when required keys are absent. */
export const MARKETING_ALLIED_HUB_META_TITLE_FALLBACK = "Allied health exam prep hub | NurseNest";
export const MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK =
  "Browse allied health professions, lessons, and practice questions for Canada and United States exam tracks on NurseNest.";

/** Public flashcard slug route — when the deck/topic cannot be resolved (metadata only). */
export const MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK = "Nursing exam flashcards | NurseNest";

/** Public flashcard slug route — production continuity when interpolated meta keys fail validation. */
export const MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK =
  "Study nursing and allied health flashcards on NurseNest — preview decks on the web; unlock full decks with a plan that includes flashcards.";

/**
 * Brand-safe fallback strings for public marketing.
 *
 * HARD GUARANTEES:
 * - Never empty
 * - Never placeholder-like
 * - Always safe for SEO + Open Graph
 * - Always trimmed and validated at load time
 */

function assertValidFallback(value: string, label: string): string {
  const v = value.trim();

  if (!v) {
    throw new Error(`[marketing-fallback] "${label}" is empty`);
  }

  if (v.length < 3) {
    throw new Error(`[marketing-fallback] "${label}" too short to be meaningful`);
  }

  // Guard against accidental placeholder leakage
  const lower = v.toLowerCase();
  const forbidden = ["title", "description", "placeholder", "todo", "tbd"];

  for (const bad of forbidden) {
    if (lower === bad) {
      throw new Error(`[marketing-fallback] "${label}" is invalid placeholder value "${value}"`);
    }
  }

  return v;
}

/* =========================
   CORE BRAND FALLBACKS
   ========================= */

export const DEFAULT_SITE_BRAND_TITLE = assertValidFallback(
  "NurseNest",
  "DEFAULT_SITE_BRAND_TITLE",
);

export const DEFAULT_SITE_PRIMARY_DESCRIPTION = assertValidFallback(
  "Canada-first nursing and allied health exam prep with practice questions, clinical lessons, flashcards, and mock exams — built for nurses worldwide.",
  "DEFAULT_SITE_PRIMARY_DESCRIPTION",
);

/* =========================
   PRICING FALLBACKS
   ========================= */

export const MARKETING_PRICING_CONVERSION_H1_FALLBACK = assertValidFallback(
  "Plans by exam pathway",
  "MARKETING_PRICING_CONVERSION_H1_FALLBACK",
);

export const MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK = assertValidFallback(
  "Prices in CAD or USD for your selected region. No surprise charges at checkout.",
  "MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK",
);

export const MARKETING_PRICING_CONVERSION_LEAD_FALLBACK = assertValidFallback(
  "Choose your exam track, country, and billing term. Totals are shown before you pay; longer terms usually lower your effective monthly cost.",
  "MARKETING_PRICING_CONVERSION_LEAD_FALLBACK",
);

export const MARKETING_PRICING_TIER_SUBHEAD_FALLBACK = assertValidFallback(
  "Pick a billing cadence that fits your study plan and exam date.",
  "MARKETING_PRICING_TIER_SUBHEAD_FALLBACK",
);

/* =========================
   ALLIED HUB FALLBACKS
   ========================= */

export const MARKETING_ALLIED_HUB_META_TITLE_FALLBACK = assertValidFallback(
  "Allied health exam prep hub | NurseNest",
  "MARKETING_ALLIED_HUB_META_TITLE_FALLBACK",
);

export const MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK = assertValidFallback(
  "Browse allied health professions, lessons, and practice questions for Canada and United States exam tracks on NurseNest.",
  "MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK",
);

/* =========================
   FLASHCARD FALLBACKS
   ========================= */

export const MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK = assertValidFallback(
  "Nursing exam flashcards | NurseNest",
  "MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK",
);

export const MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK =
  assertValidFallback(
    "Study nursing and allied health flashcards on NurseNest — preview decks on the web; unlock full decks with a plan that includes flashcards.",
    "MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK",
  );

/* =========================
   GLOBAL SAFETY CHECK (DEV)
   ========================= */

if (process.env.NODE_ENV !== "production") {
  const all = [
    DEFAULT_SITE_BRAND_TITLE,
    DEFAULT_SITE_PRIMARY_DESCRIPTION,
    MARKETING_PRICING_CONVERSION_H1_FALLBACK,
    MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK,
    MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
    MARKETING_PRICING_TIER_SUBHEAD_FALLBACK,
    MARKETING_ALLIED_HUB_META_TITLE_FALLBACK,
    MARKETING_ALLIED_HUB_META_DESCRIPTION_FALLBACK,
    MARKETING_PUBLIC_FLASHCARD_SLUG_NOT_FOUND_TITLE_FALLBACK,
    MARKETING_PUBLIC_FLASHCARD_SLUG_META_DESCRIPTION_GENERIC_FALLBACK,
  ];

  for (const val of all) {
    if (!val || val.trim().length === 0) {
      throw new Error("[marketing-fallback] Empty fallback detected during development");
    }
  }
}
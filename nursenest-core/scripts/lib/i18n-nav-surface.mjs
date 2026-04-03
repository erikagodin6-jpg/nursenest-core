/**
 * Navigation / shell / footer surface keys for i18n audit & targeted MT patch.
 * Keep in sync with global-nav-config, site-header, site-footer, learner shell.
 */

/** Keys whose English value must remain unchanged (product names). */
export const NAV_PATCH_SKIP_KEYS = new Set([
  "brand.nurseNest",
  "brand.applyNest",
]);

/** Whole-string English values to never machine-translate (proper nouns). */
export const NAV_PATCH_SKIP_VALUES = new Set(["NurseNest", "ApplyNest"]);

/**
 * Exam / region strip labels (NCLEX-RN, REx-PN, etc.) — keep English; do not MT.
 * @param {string} key
 */
export function isNavExamStripKey(key) {
  return typeof key === "string" && key.startsWith("nav.examStrip.");
}

/**
 * @param {string} key — flat i18n key
 * @returns {boolean}
 */
export function isNavAuditedKey(key) {
  if (typeof key !== "string" || !key.length) return false;
  if (
    key.startsWith("nav.") ||
    key.startsWith("footer.") ||
    key.startsWith("components.footer.") ||
    key.startsWith("brand.") ||
    key.startsWith("dashboard.breadcrumb") ||
    key.startsWith("home.region.")
  ) {
    return true;
  }
  return false;
}

/**
 * Identical (locale === en) is acceptable for audit verification — not a defect.
 * @param {string} key
 * @param {string} enVal
 * @param {string} locVal
 */
/**
 * Short nav/footer labels often match English across locales (loanwords, ISO country names,
 * Denglish/Spanglish product UI). OK for automated audit; humans can still refine tone later.
 */
const NAV_IDENTICAL_VALUE_ALLOWLIST = new Set([
  "Blog",
  "Flashcards",
  "FAQ",
  "Legal",
  "Pricing",
  "Region",
  "Certifications",
  "Canada",
  "United States",
]);

export function isNavIdenticalAllowlisted(key, enVal, locVal) {
  if (String(enVal) !== String(locVal)) return false;
  if (NAV_PATCH_SKIP_KEYS.has(key)) return true;
  if (NAV_PATCH_SKIP_VALUES.has(String(locVal).trim())) return true;
  if (isNavExamStripKey(key)) return true;
  if (key === "components.footer.applynest") return true;
  const v = String(locVal).trim();
  if (NAV_IDENTICAL_VALUE_ALLOWLIST.has(v)) return true;
  return false;
}

/** Google Translate `to` targets (see `google-translate-api-x` / ISO conventions). */
export const GOOGLE_TRANSLATE_TO = {
  ar: "ar",
  de: "de",
  es: "es",
  fa: "fa",
  hi: "hi",
  ht: "ht",
  id: "id",
  ja: "ja",
  ko: "ko",
  pa: "pa",
  pt: "pt",
  th: "th",
  tl: "tl",
  tr: "tr",
  ur: "ur",
  vi: "vi",
  zh: "zh-CN",
  "zh-tw": "zh-TW",
  fr: "fr-CA",
};

export const SUPPORTED_NON_EN_LOCALES = Object.keys(GOOGLE_TRANSLATE_TO);

/**
 * @param {string} enText
 * @param {string} locText
 * @returns {{ ok: boolean, enCount: number, locCount: number }}
 */
export function placeholderBalance(enText, locText) {
  const re = /\{\{[^}]+\}\}/g;
  const enM = String(enText).match(re);
  const locM = String(locText).match(re);
  const enCount = enM ? enM.length : 0;
  const locCount = locM ? locM.length : 0;
  return { ok: enCount === locCount, enCount, locCount };
}

/**
 * Pure nav/footer/breadcrumb/shell i18n audit rules (no MT deps).
 * Used by `nav-i18n-parity.mjs` and `validate-nav-i18n.mjs`.
 */

/** Non-default marketing locales (see `src/lib/i18n/marketing-languages.ts`). */
export const MARKETING_LOCALE_CODES = [
  "fr",
  "tl",
  "hi",
  "es",
  "zh",
  "zh-tw",
  "ar",
  "ko",
  "pt",
  "pa",
  "vi",
  "ht",
  "ur",
  "ja",
  "fa",
  "de",
  "th",
  "tr",
  "id",
];

export function isAuditedNavKey(key) {
  if (key.startsWith("nav.")) return true;
  if (key.startsWith("footer.")) return true;
  if (key.startsWith("components.footer.")) return true;
  if (key.startsWith("dashboard.breadcrumb")) return true;
  if (key === "brand.nurseNest" || key === "brand.applyNest" || key === "brand.homeAriaLabel") return true;
  if (key.startsWith("home.region.")) return true;
  return false;
}

export function getAuditedKeys(en) {
  return Object.keys(en).filter(isAuditedNavKey).sort();
}

export function mustachePlaceholders(s) {
  const m = String(s).match(/\{\{[^}]+\}\}/g);
  return m ? m.sort().join("|") : "";
}

/** True if `{{` / `}}` counts are unbalanced (broken mustache / copy-paste corruption). */
export function hasMalformedMustacheStructure(s) {
  const str = String(s ?? "");
  const open = (str.match(/\{\{/g) || []).length;
  const close = (str.match(/\}\}/g) || []).length;
  return open !== close;
}

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

/**
 * English carryover is allowed (do not MT replace) for product brand keys only.
 */
export function isEnglishCarryoverAllowlisted(key) {
  return key === "brand.nurseNest" || key === "brand.applyNest";
}

/**
 * When locale string equals English, that is acceptable for verify if true:
 * exam strip codes, NurseNest/ApplyNest/NCLEX lines, and common loanwords (Blog, FAQ).
 */
export function allowsEnglishParity(key, enVal) {
  if (isEnglishCarryoverAllowlisted(key)) return true;
  const v = String(enVal ?? "").trim();
  if (key.startsWith("nav.examStrip.")) return true;
  if (v.startsWith("ApplyNest")) return true;
  if (v.includes("NurseNest")) return true;
  if (/\b(NCLEX|REx-PN|CNPLE)\b/i.test(v) || v.includes("NP (CNPLE)")) return true;
  if (v === "Blog" || v === "FAQ" || v === "Canada" || v === "US") return true;
  if (key === "dashboard.breadcrumbDashboard" && v === "Dashboard") return true;
  if (/\bSI\b.*\bConventional\b/i.test(v) || v.includes("↔")) return true;
  const loan = new Set([
    "Flashcards",
    "Pricing",
    "Region",
    "Nursing",
    "Legal",
    "Ecosystem",
    "Analytics",
    "Certifications",
    "Psychotherapy",
    "Paramedic",
    "Diagnostic Imaging",
    "Occupational Therapy",
    "Physical Therapy",
    "Social Work",
    "Pharmacy Technician",
    "Respiratory therapy",
    "Medical Lab Tech",
    "International Recruitment",
    "Regulatory Changes",
    "Survival Guides",
    "Clinical Simulators",
    "OSCE Skills Practice",
    "Policy & Updates Hub",
    "Burnout Prevention",
    "Exam Format Updates",
    "Healthcare Policy",
    "Licensing Policy Changes",
    "Clinical References",
    "Allied Careers",
    "Allied Pricing",
    "Preview Mode",
    "Product Builder",
    "Screenshot Studio",
    "SEO Dashboard",
    "SEO Performance",
    "Revenue Intelligence",
    "CAT Analytics",
    "Mock Exams",
    "Case Sims",
    "Test Bank",
    "Med Math Lab",
    "Nursing (RPN/RN)",
    "NP/Advanced",
    "Pre-Nursing",
    "ApplyNest Career Tools",
    "Mental Health Nursing Guide",
    "NP exam prep hub",
    "Safety Hazard Simulator",
    "Paramedic / EMT",
    "Respiratory Therapy",
    "NP Certification Prep",
    "Allied Health Guides",
    "Feedback",
    "Nephrology Nursing Guide",
    "Trauma Nursing Guide",
    "Anatomy",
    "Blog Manager",
    "Clinical Skill Lab",
    "Content Intelligence",
    "Practical Nursing Exam Prep",
    "Pre-Nursing Foundations",
    "Registered Nursing Exam Prep",
    "Safety Hazard Detection",
  ]);
  if (loan.has(v)) return true;
  if (v.includes("Electrolyte") && v.includes("ABG") && v.includes("Simulator")) return true;
  return false;
}

export function auditOneLocale(code, en, locMap) {
  const auditedKeys = getAuditedKeys(en);
  const missing = [];
  const empty = [];
  const englishCarryover = [];
  const allowlistedCarryover = [];
  const placeholderMismatch = [];
  const malformed = [];

  for (const k of auditedKeys) {
    const enVal = en[k];
    if (typeof enVal !== "string") continue;
    const cur = locMap[k];
    if (!(k in locMap)) {
      missing.push(k);
      continue;
    }
    if (isEmpty(cur)) {
      empty.push(k);
      continue;
    }
    if (hasMalformedMustacheStructure(cur)) {
      malformed.push(k);
    }
    if (String(cur) === String(enVal)) {
      if (isEnglishCarryoverAllowlisted(k) || allowsEnglishParity(k, enVal)) {
        allowlistedCarryover.push(k);
      } else {
        englishCarryover.push(k);
      }
    }
    const enP = mustachePlaceholders(enVal);
    const curP = mustachePlaceholders(String(cur));
    if (enP !== curP) {
      placeholderMismatch.push({ key: k, en: enP, locale: curP });
    }
  }

  return {
    code,
    auditedKeyCount: auditedKeys.length,
    missing,
    empty,
    englishCarryover,
    allowlistedCarryover,
    placeholderMismatch,
    malformed,
  };
}

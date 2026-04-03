#!/usr/bin/env node
/**
 * Navigation / footer / shell menu i18n audit and MT fill (idempotent).
 *
 * ## Audited key patterns (subset of `en.json`; ~265 keys)
 * - `nav.*` — header, mobile drawer, exam strip, theme, etc.
 * - `footer.*` — footer columns, legal, resources, email banner
 * - `components.footer.*` — ecosystem / exam prep lines in `site-footer.tsx`
 * - `dashboard.breadcrumb*` — learner shell breadcrumbs
 * - `brand.nurseNest`, `brand.applyNest`, `brand.homeAriaLabel`
 * - `home.region.*` — region chrome in header / mobile menu
 *
 * Does **not** include lesson/exam/question bodies, `home.hero.*`, or allied page copy.
 *
 * ## English parity allowlist (`allowsEnglishParity`)
 * Product names (NurseNest, ApplyNest, NCLEX*, REx-PN, CNPLE), `nav.examStrip.*` codes,
 * intentional loanwords (Blog, FAQ, Canada, US, Flashcards, Pricing, …), and `brand.*` keys.
 * Keys where locale text still matches English after MT are reported as “allowlisted”, not errors.
 *
 * ## `fill` behavior
 * Strings containing `{{…}}` use per-string shielded translation (batch MT drops placeholders).
 *
 * Usage (from nursenest-core/):
 *   node scripts/nav-i18n-parity.mjs audit [--json]
 *   node scripts/nav-i18n-parity.mjs fill
 *   node scripts/nav-i18n-parity.mjs verify
 *
 * See `patch-global-nav-i18n-keys.mjs` for the earlier 4-key learner nav pass.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translate, batchTranslate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n", "en.json");
const I18N_DIR = path.join(ROOT, "public", "i18n");

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

const LANG_OPTS = {
  fr: { to: "fr-CA", forceTo: true },
  es: { to: "es" },
  tl: { to: "tl" },
  hi: { to: "hi" },
  ar: { to: "ar" },
  zh: { to: "zh-CN" },
  "zh-tw": { to: "zh-TW" },
  ko: { to: "ko" },
  pt: { to: "pt" },
  pa: { to: "pa" },
  vi: { to: "vi" },
  ht: { to: "ht" },
  ur: { to: "ur" },
  ja: { to: "ja" },
  fa: { to: "fa" },
  de: { to: "de" },
  th: { to: "th" },
  tr: { to: "tr" },
  id: { to: "id" },
};

const BATCH = 72;
const BATCH_GAP_MS = 120;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function shield(enText) {
  const orig = [];
  const t = String(enText).replace(/\{\{([^}]*)\}\}/g, (_, inner) => {
    const i = orig.length;
    orig.push(`{{${inner}}}`);
    return `⟦${i}⟧`;
  });
  return { t, orig };
}

function unshield(translated, orig) {
  let s = translated;
  for (let i = 0; i < orig.length; i++) {
    s = s.split(`⟦${i}⟧`).join(orig[i]);
  }
  return s;
}

function mustachePlaceholders(s) {
  const m = String(s).match(/\{\{[^}]+\}\}/g);
  return m ? m.sort().join("|") : "";
}

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

function isReviewTagged(v) {
  return /^\[REVIEW\s*·/i.test(String(v ?? ""));
}

/**
 * English carryover is allowed (do not MT replace) for product brand keys only.
 * Report these explicitly in audit/fill output.
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
  };
}

export function runAudit(jsonMode) {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const auditedKeys = getAuditedKeys(en);
  const byLocale = {};
  let totalMissing = 0;
  let totalEmpty = 0;
  let totalCarryover = 0;

  for (const code of MARKETING_LOCALE_CODES) {
    const p = path.join(I18N_DIR, `${code}.json`);
    if (!fs.existsSync(p)) {
      byLocale[code] = { error: "file_missing" };
      continue;
    }
    const locMap = JSON.parse(fs.readFileSync(p, "utf8"));
    const r = auditOneLocale(code, en, locMap);
    byLocale[code] = r;
    totalMissing += r.missing.length;
    totalEmpty += r.empty.length;
    totalCarryover += r.englishCarryover.length;
  }

  const summary = {
    enAuditedKeyCount: auditedKeys.length,
    locales: MARKETING_LOCALE_CODES.length,
    totalMissingKeys: totalMissing,
    totalEmptyValues: totalEmpty,
    totalEnglishCarryover: totalCarryover,
  };

  if (jsonMode) {
    console.log(JSON.stringify({ summary, byLocale }, null, 2));
  } else {
    console.log("=== Nav i18n audit (vs en.json) ===\n");
    console.log(`Audited key patterns in en.json: ${auditedKeys.length} keys`);
    console.log(`Locales: ${MARKETING_LOCALE_CODES.join(", ")}\n`);
    console.log(
      `Totals: missing=${totalMissing} empty=${totalEmpty} englishCarryover=${totalCarryover} (excludes brand allowlist)\n`,
    );
    for (const code of MARKETING_LOCALE_CODES) {
      const r = byLocale[code];
      if (r.error) {
        console.log(`[${code}] ERROR: ${r.error}`);
        continue;
      }
      const m = r.missing.length;
      const e = r.empty.length;
      const c = r.englishCarryover.length;
      const a = r.allowlistedCarryover.length;
      const ph = r.placeholderMismatch.length;
      if (m + e + c === 0 && ph === 0) {
        console.log(`[${code}] OK (allowlisted EN: ${a})`);
      } else {
        console.log(`[${code}] missing=${m} empty=${e} englishCarryover=${c} allowlisted=${a} placeholderMismatch=${ph}`);
        if (m && m.length <= 15) console.log(`  missing: ${m.join(", ")}`);
        if (e && e.length <= 15) console.log(`  empty: ${e.join(", ")}`);
        if (c && c.length <= 20) console.log(`  englishCarryover: ${c.slice(0, 20).join(", ")}${c.length > 20 ? " …" : ""}`);
        if (ph && ph.length <= 8) {
          for (const x of ph.slice(0, 8)) {
            console.log(`  placeholder: ${x.key} en=${x.en} loc=${x.locale}`);
          }
        }
      }
    }
  }

  return { summary, byLocale, auditedKeys };
}

async function translateOneSafe(text, opts) {
  const { t, orig } = shield(text);
  const res = await translate(t, { from: "en", to: opts.to, forceTo: opts.forceTo || false });
  return unshield(res.text, orig);
}

async function translateBatchSafe(texts, opts) {
  const shields = texts.map((s) => shield(s));
  const inputs = shields.map((x) => x.t);
  try {
    const results = await batchTranslate(inputs, {
      from: "en",
      to: opts.to,
      forceTo: opts.forceTo || false,
      rejectOnPartialFail: false,
    });
    if (!Array.isArray(results) || results.length !== texts.length) return null;
    return results.map((piece, i) => {
      if (!piece || piece.text == null || String(piece.text).trim() === "") return null;
      return unshield(piece.text, shields[i].orig);
    });
  } catch {
    return null;
  }
}

function needsFillForKey(key, enVal, cur) {
  if (typeof enVal !== "string") return false;
  if (isEnglishCarryoverAllowlisted(key)) return false;
  if (isReviewTagged(cur)) return false;
  if (cur === undefined) return true;
  if (isEmpty(cur)) return true;
  if (String(cur) === String(enVal)) return true;
  return false;
}

async function fillLocale(code) {
  const opts = LANG_OPTS[code];
  if (!opts) throw new Error(`No LANG_OPTS for ${code}`);

  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const auditedKeys = getAuditedKeys(en);
  const p = path.join(I18N_DIR, `${code}.json`);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));

  const work = [];
  for (const k of auditedKeys) {
    const enVal = en[k];
    if (typeof enVal !== "string") continue;
    const cur = j[k];
    if (!needsFillForKey(k, enVal, cur)) continue;
    work.push(k);
  }

  console.log(`[${code}] filling ${work.length} keys…`);

  let done = 0;
  for (let i = 0; i < work.length; i += BATCH) {
    const slice = work.slice(i, i + BATCH);
    const batchTexts = [];
    const batchKeys = [];

    for (const k of slice) {
      const enVal = String(en[k]);
      if (/\{\{[^}]+\}\}/.test(enVal)) {
        try {
          j[k] = await translateOneSafe(enVal, opts);
        } catch {
          j[k] = en[k];
        }
        await sleep(80);
        done += 1;
      } else {
        batchTexts.push(enVal);
        batchKeys.push(k);
      }
    }

    if (batchTexts.length) {
      let batch = await translateBatchSafe(batchTexts, opts);
      if (!batch) {
        batch = new Array(batchTexts.length).fill(null);
      }
      for (let b = 0; b < batchTexts.length; b++) {
        const k = batchKeys[b];
        let v = batch[b];
        if (v != null && String(v).trim() !== "") {
          j[k] = v;
        } else {
          try {
            j[k] = await translateOneSafe(batchTexts[b], opts);
          } catch {
            j[k] = en[k];
          }
        }
        done += 1;
      }
    }

    process.stdout.write(` ${done}/${work.length}`);
    await sleep(BATCH_GAP_MS);
  }

  fs.writeFileSync(p, JSON.stringify(j));
  console.log(`\n[${code}] wrote ${p}`);
}

async function runFill() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const n = getAuditedKeys(en).length;
  console.log(`Fill: ${n} audited keys per locale (from en.json), ${MARKETING_LOCALE_CODES.length} locales\n`);

  for (const code of MARKETING_LOCALE_CODES) {
    await fillLocale(code);
  }
  console.log("\nFill done. Run: node scripts/nav-i18n-parity.mjs verify");
}

function runVerify() {
  let failed = false;
  for (const code of MARKETING_LOCALE_CODES) {
    const p = path.join(I18N_DIR, `${code}.json`);
    try {
      JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      console.error(`[${code}] JSON parse failed: ${p}`, e);
      failed = true;
    }
  }
  try {
    JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  } catch (e) {
    console.error("en.json parse failed", e);
    failed = true;
  }

  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const auditedKeys = getAuditedKeys(en);
  for (const code of MARKETING_LOCALE_CODES) {
    const locMap = JSON.parse(fs.readFileSync(path.join(I18N_DIR, `${code}.json`), "utf8"));
    const r = auditOneLocale(code, en, locMap);
    const bad =
      r.missing.length + r.empty.length + r.englishCarryover.length + r.placeholderMismatch.length;
    if (bad > 0) {
      console.log(
        `[${code}] VERIFY FAIL: missing=${r.missing.length} empty=${r.empty.length} englishCarryover=${r.englishCarryover.length} placeholderMismatch=${r.placeholderMismatch.length}`,
      );
      failed = true;
    } else {
      const n = r.allowlistedCarryover.length;
      const sample = r.allowlistedCarryover.slice(0, 5).join(", ");
      console.log(
        `[${code}] VERIFY OK (English parity allowlisted: ${n} keys${sample ? `; e.g. ${sample}${n > 5 ? " …" : ""}` : ""})`,
      );
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log("\nAll verification checks passed.");
}

const cmd = process.argv[2] || "audit";
const jsonMode = process.argv.includes("--json");

if (cmd === "audit") {
  runAudit(jsonMode);
} else if (cmd === "fill") {
  runFill().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (cmd === "verify") {
  runVerify();
} else {
  console.error("Usage: node scripts/nav-i18n-parity.mjs [audit|fill|verify] [--json]");
  process.exit(1);
}

#!/usr/bin/env node
/**
 * Navigation / footer / shell menu i18n audit and MT fill (idempotent).
 *
 * ## Audited key patterns (subset of `en.json`; ~270 keys; see `lib/ensure-en-nav-keys.mjs`)
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
import {
  MARKETING_LOCALE_CODES,
  auditOneLocale,
  getAuditedKeys,
  isAuditedNavKey,
  allowsEnglishParity,
  isEnglishCarryoverAllowlisted,
  mustachePlaceholders,
} from "./lib/nav-i18n-audit.mjs";
import { ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";

export {
  MARKETING_LOCALE_CODES,
  auditOneLocale,
  getAuditedKeys,
  isAuditedNavKey,
  allowsEnglishParity,
  isEnglishCarryoverAllowlisted,
  mustachePlaceholders,
} from "./lib/nav-i18n-audit.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");
/** True when executed as CLI (`node scripts/nav-i18n-parity.mjs …`), not when imported. */
const isMainModule =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === path.resolve(__filename);
const EN_PATH = path.join(ROOT, "public/i18n", "en.json");
const I18N_DIR = path.join(ROOT, "public", "i18n");

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

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

function isReviewTagged(v) {
  return /^\[REVIEW\s*·/i.test(String(v ?? ""));
}

export function runAudit(jsonMode) {
  ensureRequiredEnNavKeys();
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
      const mf = r.malformed.length;
      if (m + e + c === 0 && ph === 0 && mf === 0) {
        console.log(`[${code}] OK (allowlisted EN: ${a})`);
      } else {
        console.log(
          `[${code}] missing=${m} empty=${e} englishCarryover=${c} allowlisted=${a} placeholderMismatch=${ph} malformed=${mf}`,
        );
        if (m && m.length <= 15) console.log(`  missing: ${m.join(", ")}`);
        if (e && e.length <= 15) console.log(`  empty: ${e.join(", ")}`);
        if (c && c.length <= 20) console.log(`  englishCarryover: ${c.slice(0, 20).join(", ")}${c.length > 20 ? " …" : ""}`);
        if (ph && ph.length <= 8) {
          for (const x of ph.slice(0, 8)) {
            console.log(`  placeholder: ${x.key} en=${x.en} loc=${x.locale}`);
          }
        }
        if (r.malformed.length && r.malformed.length <= 15)
          console.log(`  malformed: ${r.malformed.join(", ")}`);
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

  ensureRequiredEnNavKeys();
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
        const enP = mustachePlaceholders(enVal);
        let best = en[k];
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const t = await translateOneSafe(enVal, opts);
            if (mustachePlaceholders(t) === enP) {
              best = t;
              break;
            }
            best = t;
          } catch {
            best = en[k];
            break;
          }
          await sleep(80);
        }
        j[k] = mustachePlaceholders(best) === enP ? best : en[k];
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

  /** Safety net: never leave audited string keys missing or empty after batch MT. */
  for (const k of auditedKeys) {
    const enVal = en[k];
    if (typeof enVal !== "string") continue;
    const cur = j[k];
    if (cur !== undefined && !isEmpty(cur)) continue;
    try {
      j[k] = await translateOneSafe(enVal, opts);
    } catch {
      j[k] = enVal;
    }
    await sleep(40);
  }

  /** Re-sync any audited string whose locale lost `{{…}}` vs English (e.g. batch MT drift). */
  for (const k of auditedKeys) {
    const enVal = en[k];
    if (typeof enVal !== "string" || !/\{\{[^}]+\}\}/.test(enVal)) continue;
    const enP = mustachePlaceholders(enVal);
    if (!enP) continue;
    const cur = j[k];
    if (typeof cur !== "string") continue;
    if (mustachePlaceholders(cur) === enP) continue;
    try {
      const t = await translateOneSafe(enVal, opts);
      j[k] = mustachePlaceholders(t) === enP ? t : en[k];
    } catch {
      j[k] = en[k];
    }
    await sleep(40);
  }

  fs.writeFileSync(p, JSON.stringify(j));
  console.log(`\n[${code}] wrote ${p}`);
}

async function runFill() {
  ensureRequiredEnNavKeys();
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const n = getAuditedKeys(en).length;
  console.log(`Fill: ${n} audited keys per locale (from en.json), ${MARKETING_LOCALE_CODES.length} locales\n`);

  for (const code of MARKETING_LOCALE_CODES) {
    await fillLocale(code);
  }
  console.log("\nFill done. Run: node scripts/nav-i18n-parity.mjs verify");
}

function runVerify() {
  ensureRequiredEnNavKeys();
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
      r.missing.length +
      r.empty.length +
      r.englishCarryover.length +
      r.placeholderMismatch.length +
      r.malformed.length;
    if (bad > 0) {
      console.log(
        `[${code}] VERIFY FAIL: missing=${r.missing.length} empty=${r.empty.length} englishCarryover=${r.englishCarryover.length} placeholderMismatch=${r.placeholderMismatch.length} malformed=${r.malformed.length}`,
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

if (isMainModule) {
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
}

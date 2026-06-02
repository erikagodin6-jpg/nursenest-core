#!/usr/bin/env node
/**
 * Fills missing / English-carryover / placeholder-mismatched audited nav/footer keys
 * into `tools/i18n/marketing/locale/marketing-{lang}.json` without touching `learner.*`.
 *
 * Audited patterns: nav.*, footer.*, components.footer.*, dashboard.breadcrumb*,
 * brand.nurseNest|applyNest|homeAriaLabel, home.region.* — see `lib/nav-i18n-audit.mjs`.
 *
 * Merge order is monolith → marketing-en → overlay; overlays override marketing-en English.
 *
 * **Always run `npm run i18n:compile` from the repo root immediately before this script**
 * so `public/i18n/*.json` matches the current marketing overlays (otherwise audit/fix can be wrong).
 *
 * Typical pipeline (repo root):
 *   npm run i18n:compile && cd nursenest-core && npm run i18n:sync-audited-to-marketing-en && cd .. && npm run i18n:compile && cd nursenest-core && npm run i18n:fill-marketing-nav-footer-overlays && cd .. && npm run i18n:compile
 * Then: `npm run i18n:compile` (from repo root) and `npm run i18n:validate-nav`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";
import {
  MARKETING_LOCALE_CODES,
  auditOneLocale,
  mustachePlaceholders,
} from "./lib/nav-i18n-audit.mjs";
import { ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEST_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(NEST_ROOT, "..");
const EN_PATH = path.join(NEST_ROOT, "public", "i18n", "en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

const LANG_OPTS = {
  fr: { to: "fr-CA", forceTo: true },
  tl: { to: "tl" },
  hi: { to: "hi" },
  es: { to: "es" },
  zh: { to: "zh-CN" },
  "zh-tw": { to: "zh-TW" },
  ar: { to: "ar" },
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

const BATCH = 48;
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

function keysNeedingOverlayFix(r) {
  const set = new Set([
    ...r.missing,
    ...r.empty,
    ...r.englishCarryover,
    ...r.placeholderMismatch.map((x) => x.key),
  ]);
  return [...set].filter((k) => !k.startsWith("learner.")).sort();
}

async function fillLocale(code) {
  const opts = LANG_OPTS[code];
  if (!opts) throw new Error(`No LANG_OPTS for ${code}`);

  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const mergedPath = path.join(NEST_ROOT, "public", "i18n", `${code}.json`);
  if (!fs.existsSync(mergedPath)) {
    console.warn(`[${code}] skip: missing ${mergedPath}`);
    return 0;
  }
  const locMap = JSON.parse(fs.readFileSync(mergedPath, "utf8"));
  const r = auditOneLocale(code, en, locMap);
  const work = keysNeedingOverlayFix(r);

  if (work.length === 0) {
    console.log(`[${code}] nav/footer audit OK, no overlay writes`);
    return 0;
  }

  const overlayPath = path.join(LOCALE_DIR, `marketing-${code}.json`);
  const overlay = JSON.parse(fs.readFileSync(overlayPath, "utf8"));

  console.log(`[${code}] fixing ${work.length} keys (missing/empty/carryover/placeholder)…`);

  let done = 0;
  for (let i = 0; i < work.length; i += BATCH) {
    const slice = work.slice(i, i + BATCH);
    const batchTexts = [];
    const batchKeys = [];

    for (const k of slice) {
      const enVal = en[k];
      if (typeof enVal !== "string") continue;
      if (/\{\{[^}]+\}\}/.test(enVal)) {
        const enP = mustachePlaceholders(enVal);
        let best = enVal;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const t = await translateOneSafe(enVal, opts);
            if (mustachePlaceholders(t) === enP) {
              best = t;
              break;
            }
            best = t;
          } catch {
            best = enVal;
            break;
          }
          await sleep(80);
        }
        overlay[k] = mustachePlaceholders(best) === enP ? best : enVal;
        done += 1;
        await sleep(80);
      } else {
        batchTexts.push(enVal);
        batchKeys.push(k);
      }
    }

    if (batchTexts.length) {
      let batch = await translateBatchSafe(batchTexts, opts);
      if (!batch) batch = new Array(batchTexts.length).fill(null);
      for (let b = 0; b < batchTexts.length; b++) {
        const k = batchKeys[b];
        let v = batch[b];
        if (v != null && String(v).trim() !== "") {
          overlay[k] = v;
        } else {
          try {
            overlay[k] = await translateOneSafe(batchTexts[b], opts);
          } catch {
            overlay[k] = en[k];
          }
        }
        done += 1;
      }
    }

    process.stdout.write(` ${Math.min(i + slice.length, work.length)}/${work.length}`);
    await sleep(BATCH_GAP_MS);
  }

  fs.writeFileSync(overlayPath, JSON.stringify(overlay, null, 2) + "\n");
  console.log(`\n[${code}] wrote ${overlayPath}`);
  return work.length;
}

async function main() {
  ensureRequiredEnNavKeys();
  if (!fs.existsSync(EN_PATH)) {
    console.error(`Missing ${EN_PATH} — run: npm run i18n:compile (repo root)`);
    process.exit(1);
  }

  let total = 0;
  for (const code of MARKETING_LOCALE_CODES) {
    total += await fillLocale(code);
  }
  console.log(`\nDone. Total overlay key updates: ${total}`);
  console.log("Next: cd .. && npm run i18n:compile && cd nursenest-core && npm run i18n:validate-nav");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

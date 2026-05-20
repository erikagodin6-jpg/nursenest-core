#!/usr/bin/env node
/**
 * Fills missing `learner.*` keys in tools/i18n/marketing/locale/marketing-{lang}.json
 * from tools/i18n/marketing/marketing-en.json using google-translate-api-x.
 * Preserves {{mustache}} placeholders (shield/unshield).
 *
 * Run from repo root: node nursenest-core/scripts/fill-marketing-learner-overlays.mjs
 * Or from nursenest-core/: node scripts/fill-marketing-learner-overlays.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEST_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(NEST_ROOT, "..");

const MARKETING_EN = path.join(REPO_ROOT, "tools/i18n/marketing/marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools/i18n/marketing/locale");

/** Locales with marketing overlays (non-en). fr is usually complete — script skips if nothing missing. */
const LANGS = [
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

/** Google Translate targets (align with generate-locales-from-en.mjs where applicable). */
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

async function translateOne(text, opts) {
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

async function fillLocale(lang) {
  const opts = LANG_OPTS[lang];
  if (!opts) throw new Error(`No LANG_OPTS for ${lang}`);

  const en = JSON.parse(fs.readFileSync(MARKETING_EN, "utf8"));
  const learnerKeys = Object.keys(en)
    .filter((k) => k.startsWith("learner."))
    .sort();

  const overlayPath = path.join(LOCALE_DIR, `marketing-${lang}.json`);
  const overlay = JSON.parse(fs.readFileSync(overlayPath, "utf8"));

  const toFill = learnerKeys.filter((k) => !(k in overlay) || String(overlay[k]).trim() === "");
  if (toFill.length === 0) {
    console.log(`[${lang}] learner keys complete, skip`);
    return;
  }

  console.log(`[${lang}] translating ${toFill.length} learner keys…`);

  for (let i = 0; i < toFill.length; i += BATCH) {
    const slice = toFill.slice(i, i + BATCH);
    const texts = slice.map((k) => en[k]);
    let batch = await translateBatchSafe(texts, opts);
    if (!batch) batch = new Array(slice.length).fill(null);

    for (let j = 0; j < slice.length; j++) {
      const key = slice[j];
      let v = batch[j];
      if (v != null && String(v).trim() !== "") {
        overlay[key] = v;
        continue;
      }
      try {
        overlay[key] = await translateOne(texts[j], opts);
      } catch {
        overlay[key] = String(en[key]);
      }
    }
    process.stdout.write(` ${Math.min(i + slice.length, toFill.length)}/${toFill.length}`);
    await sleep(BATCH_GAP_MS);
  }

  fs.writeFileSync(overlayPath, JSON.stringify(overlay, null, 2) + "\n");
  console.log(`\n[${lang}] wrote ${overlayPath}`);
}

async function main() {
  if (!fs.existsSync(MARKETING_EN)) throw new Error(`Missing ${MARKETING_EN}`);
  for (const lang of LANGS) {
    await fillLocale(lang);
  }
  console.log("\nDone. Run from repo root: npm run i18n:compile && npm run i18n:validate");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

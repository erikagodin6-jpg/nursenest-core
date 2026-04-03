#!/usr/bin/env node
/**
 * Fills **only** high-frequency shell keys (nav + compact auth CTAs) for low-coverage locales.
 * Does not touch home/pricing/paywall body copy. Skips keys that already differ from English (human edits).
 *
 * Run from nursenest-core/: `node scripts/fill-shell-ui-placeholders.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..");
const EN_PATH = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

/** Locales with `tier: incomplete` in marketing-languages.ts — shell-placeholder coverage. */
const SHELL_LOCALE_CODES = [
  "hi",
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

const GOOGLE_LANG = {
  de: "de",
  ja: "ja",
  zh: "zh-CN",
  "zh-tw": "zh-TW",
  ar: "ar",
  ko: "ko",
  pt: "pt",
  pa: "pa",
  vi: "vi",
  ht: "ht",
  ur: "ur",
  fa: "fa",
  hi: "hi",
  th: "th",
  tr: "tr",
  id: "id",
};

function buildAllowlist(en) {
  const keys = new Set();
  for (const k of Object.keys(en)) {
    if (k.startsWith("nav.")) keys.add(k);
  }
  for (const k of [
    "auth.login",
    "auth.signup",
    "auth.forgotPassword",
    "auth.resetPassword",
    "pages.login.title",
    "pages.login.submit",
    "pages.login.welcome",
    "pages.login.fieldIdentifierLabel",
    "pages.login.placeholderPassword",
    "pages.login.forgotPasswordLink",
    "pages.login.errorGeneric",
    "pages.login.errorInvalid",
    "pages.signup.title",
    "pages.signup.h1",
    "pages.signup.createAccount",
    "pages.signup.errorGeneric",
  ]) {
    if (k in en) keys.add(k);
  }
  return [...keys].sort();
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

const BATCH = 40;
const BATCH_GAP_MS = 100;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateBatchSafe(texts, to) {
  const shields = texts.map((s) => shield(s));
  const inputs = shields.map((x) => x.t);
  try {
    const results = await batchTranslate(inputs, { from: "en", to, rejectOnPartialFail: false });
    if (!Array.isArray(results) || results.length !== texts.length) return null;
    return results.map((piece, i) => {
      if (!piece || piece.text == null || String(piece.text).trim() === "") return null;
      return unshield(piece.text, shields[i].orig);
    });
  } catch {
    return null;
  }
}

async function translateOne(text, to) {
  const { t, orig } = shield(text);
  const res = await translate(t, { from: "en", to });
  return unshield(res.text, orig);
}

async function run() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const allowlist = buildAllowlist(en);
  console.log(`Allowlist: ${allowlist.length} keys (nav.* + compact auth CTAs)`);

  for (const code of SHELL_LOCALE_CODES) {
    const to = GOOGLE_LANG[code];
    if (!to) {
      console.warn(`Skip ${code}: no Google mapping`);
      continue;
    }
    const fp = path.join(LOCALE_DIR, `marketing-${code}.json`);
    if (!fs.existsSync(fp)) {
      console.warn(`Skip ${code}: missing ${fp}`);
      continue;
    }
    const loc = JSON.parse(fs.readFileSync(fp, "utf8"));
    const work = [];
    for (const k of allowlist) {
      const ev = en[k];
      if (ev === undefined) continue;
      const cur = loc[k];
      if (cur === undefined || String(cur) === String(ev)) work.push(k);
    }
    if (!work.length) {
      console.log(`[${code}] nothing to fill`);
      continue;
    }
    console.log(`[${code}] filling ${work.length} keys → ${to}`);

    for (let i = 0; i < work.length; i += BATCH) {
      const slice = work.slice(i, i + BATCH);
      const texts = slice.map((k) => en[k]);
      let batch = await translateBatchSafe(texts, to);
      if (!batch) batch = new Array(slice.length).fill(null);
      for (let j = 0; j < slice.length; j++) {
        let v = batch[j];
        if (v != null && String(v).trim() !== "") {
          loc[slice[j]] = v;
          continue;
        }
        try {
          loc[slice[j]] = await translateOne(texts[j], to);
        } catch {
          /* keep existing */
        }
      }
      await sleep(BATCH_GAP_MS);
    }

    fs.writeFileSync(fp, JSON.stringify(loc, null, 2) + "\n");
    console.log(`[${code}] wrote ${fp}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

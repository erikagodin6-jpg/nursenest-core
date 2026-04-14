#!/usr/bin/env node
/**
 * One-shot: ensure `REQUIRED_EN_NAV_STRINGS` exist in every marketing locale (MT).
 * Idempotent. Run: node scripts/sync-required-nav-keys-all-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translate } from "google-translate-api-x";
import { MARKETING_LOCALE_CODES } from "./lib/nav-i18n-audit.mjs";
import { REQUIRED_EN_NAV_STRINGS, ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  ensureRequiredEnNavKeys();
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const keys = Object.keys(REQUIRED_EN_NAV_STRINGS);

  for (const code of MARKETING_LOCALE_CODES) {
    const opts = LANG_OPTS[code];
    if (!opts) continue;
    const p = path.join(I18N_DIR, `${code}.json`);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    let n = 0;
    for (const k of keys) {
      const src = String(en[k] ?? REQUIRED_EN_NAV_STRINGS[k]);
      try {
        const res = await translate(src, { from: "en", to: opts.to, forceTo: opts.forceTo || false });
        j[k] = res.text;
      } catch {
        j[k] = src;
      }
      n += 1;
      await sleep(80);
    }
    fs.writeFileSync(p, JSON.stringify(j));
    console.log(`[${code}] wrote ${n} required nav keys`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

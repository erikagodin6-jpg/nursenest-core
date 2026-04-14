#!/usr/bin/env node
/**
 * Fills {@link GLOBAL_NAV_KEYS} in each marketing locale JSON when missing, empty, or still English.
 * Run from nursenest-core/: `node scripts/patch-global-nav-i18n-keys.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

/** Must match keys referenced in `src/config/global-nav-config.ts`. */
const GLOBAL_NAV_KEYS = [
  "nav.topicAdaptiveTests",
  "nav.studyPlanShort",
  "nav.articlesAndTips",
  "nav.caseStudiesShort",
];

/** Same targets as `generate-locales-from-en.mjs` where applicable + remaining marketing locales. */
const LANG_TARGETS = {
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

function isEmpty(v) {
  return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
}

async function main() {
  const enPath = path.join(ROOT, "public/i18n/en.json");
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  for (const k of GLOBAL_NAV_KEYS) {
    if (isEmpty(en[k])) throw new Error(`en.json missing ${k}`);
  }

  for (const [code, opts] of Object.entries(LANG_TARGETS)) {
    const p = path.join(ROOT, "public/i18n", `${code}.json`);
    if (!fs.existsSync(p)) {
      console.warn(`[${code}] skip: file missing`);
      continue;
    }
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    let changed = false;
    for (const k of GLOBAL_NAV_KEYS) {
      const source = String(en[k]);
      const cur = j[k];
      const needsFill = isEmpty(cur) || cur === source;
      if (!needsFill) continue;
      const res = await translate(source, { from: "en", to: opts.to, forceTo: opts.forceTo || false });
      j[k] = res.text;
      changed = true;
      await sleep(120);
    }
    if (changed) {
      fs.writeFileSync(p, JSON.stringify(j));
      console.log(`[${code}] wrote ${p}`);
    } else {
      console.log(`[${code}] no changes`);
    }
  }
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

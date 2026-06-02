#!/usr/bin/env node
/**
 * Fills missing / English-identical strings for priority marketing namespaces:
 * nav.*, footer.*, pages.pricing.*, paywall.*, pages.login.*, pages.signup.*, home.*
 *
 * Uses google-translate-api-x. fr → fr-CA; es → es; tl → Filipino (tl).
 *
 * Usage (from nursenest-core/): node scripts/fill-priority-marketing-locales.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** app (nursenest-core/) → git root */
const REPO_ROOT = path.join(__dirname, "..", "..");
const EN_PATH = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");

const PREFIXES = ["nav.", "footer.", "pages.pricing.", "paywall.", "pages.login.", "pages.signup.", "home."];

const LANGS = {
  fr: { to: "fr-CA", forceTo: true, file: "marketing-fr.json" },
  es: { to: "es", forceTo: false, file: "marketing-es.json" },
  tl: { to: "tl", forceTo: false, file: "marketing-tl.json" },
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

function translateBatchSafe(texts, opts) {
  const shields = texts.map((s) => shield(s));
  const inputs = shields.map((x) => x.t);
  return batchTranslate(inputs, {
    from: "en",
    to: opts.to,
    forceTo: opts.forceTo || false,
    rejectOnPartialFail: false,
  })
    .then((results) => {
      if (!Array.isArray(results) || results.length !== texts.length) return null;
      return results.map((piece, i) => {
        if (!piece || piece.text == null || String(piece.text).trim() === "") return null;
        return unshield(piece.text, shields[i].orig);
      });
    })
    .catch(() => null);
}

async function translateOne(text, opts) {
  const { t, orig } = shield(text);
  const res = await translate(t, { from: "en", to: opts.to, forceTo: opts.forceTo || false });
  return unshield(res.text, orig);
}

function inScope(key) {
  return PREFIXES.some((p) => key.startsWith(p));
}

function keysToProcess(en, existing) {
  const work = [];
  for (const k of Object.keys(en)) {
    if (!inScope(k)) continue;
    const ev = en[k];
    const xv = existing[k];
    if (xv === undefined) {
      work.push(k);
      continue;
    }
    if (String(xv) === String(ev)) work.push(k);
  }
  return work;
}

async function runLang(code) {
  const opts = LANGS[code];
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const localePath = path.join(LOCALE_DIR, opts.file);
  const existing = JSON.parse(fs.readFileSync(localePath, "utf8"));
  const work = keysToProcess(en, existing);
  const out = { ...existing };

  console.log(`\n[${code}] ${opts.file}: translating ${work.length} keys in priority namespaces`);

  for (let i = 0; i < work.length; i += BATCH) {
    const slice = work.slice(i, i + BATCH);
    const texts = slice.map((k) => en[k]);
    let batch = await translateBatchSafe(texts, opts);
    if (!batch) batch = new Array(slice.length).fill(null);
    for (let j = 0; j < slice.length; j++) {
      let v = batch[j];
      if (v != null && String(v).trim() !== "") {
        out[slice[j]] = v;
        continue;
      }
      try {
        out[slice[j]] = await translateOne(texts[j], opts);
      } catch (e) {
        console.error(`\n[${code}] fail ${slice[j]}:`, e?.message || e);
        out[slice[j]] = existing[slice[j]] ?? en[slice[j]];
      }
    }
    process.stdout.write(`\r[${code}] ${Math.min(i + slice.length, work.length)}/${work.length}`);
    await sleep(BATCH_GAP_MS);
  }

  fs.writeFileSync(localePath, JSON.stringify(out, null, 2) + "\n");
  console.log(`\n[${code}] wrote ${localePath}`);
}

async function main() {
  for (const code of Object.keys(LANGS)) {
    await runLang(code);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

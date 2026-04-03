#!/usr/bin/env node
/**
 * Build public/i18n/{fr,es,tl,ar,hi}.json from public/i18n/en.json.
 * - Preserves exact key set and key order from en.json.
 * - Keeps existing locale values when they differ from English (assumed human/MT reviewed).
 * - Re-translates missing keys, English-identical copies, and strings marked with [REVIEW · …].
 * - On API failure per string: value = "[REVIEW · XX] " + English (explicit human-review fallback).
 * - Shields {{mustache}} placeholders so batch translate does not reorder them.
 *
 * **Clinical / medical copy:** outputs are machine-translated (Google via `google-translate-api-x`).
 * Have fluent reviewers validate terminology before treating any locale as production-final.
 *
 * Usage (from nursenest-core/): `npm run i18n:generate-from-en` or `node scripts/generate-locales-from-en.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n/en.json");
const I18N_DIR = path.join(ROOT, "public/i18n");
/** Monorepo: `nursenest-core/` (this app) is a sibling of `client/` under the git root. */
const CLIENT_I18N = path.join(ROOT, "..", "client", "public", "i18n");
/** Git root (parent of this Next app folder). */
const REPO_ROOT = path.join(ROOT, "..");

/** fr-CA per product preference; others use standard ISO codes (tl = Filipino/Tagalog in Google). */
const LANGS = {
  fr: { to: "fr-CA", forceTo: true },
  es: { to: "es" },
  tl: { to: "tl" },
  ar: { to: "ar" },
  hi: { to: "hi" },
};

const BATCH = 72;
const BATCH_GAP_MS = 100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Same extraction as `script/i18n-validate.ts` — fills keys that exist in locale TS but not in merged `en.json`. */
function extractTranslationsFromSource(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const source = fs.readFileSync(filePath, "utf8");
  const objectRegex =
    /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;
  const body = match[1];
  const result = {};
  const entryRegex = /["']([^"']+)["']\s*:\s*["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
  let m;
  while ((m = entryRegex.exec(body)) !== null) {
    result[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  return result;
}

/** Append keys from `tools/i18n/source/i18n-{code}.ts` missing from the en-derived map (passes `i18n:validate`). */
function mergeLocaleSourceExtras(orderedFromEn, code, enKeyOrder) {
  const tsPath = path.join(REPO_ROOT, "tools", "i18n", "source", `i18n-${code}.ts`);
  const tsMap = extractTranslationsFromSource(tsPath);
  const out = {};
  for (const k of enKeyOrder) {
    out[k] = orderedFromEn[k];
  }
  if (!tsMap) return out;
  const extraKeys = Object.keys(tsMap).filter((k) => !(k in out)).sort();
  for (const k of extraKeys) {
    out[k] = tsMap[k];
  }
  if (extraKeys.length) {
    console.log(`\n[${code}] merged +${extraKeys.length} keys from tools/i18n/source/i18n-${code}.ts`);
  }
  return out;
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

function needsTranslate(enVal, existingVal) {
  if (existingVal === undefined) return true;
  if (String(existingVal) === String(enVal)) return true;
  if (/^\[REVIEW\s*·/i.test(String(existingVal))) return true;
  return false;
}

function reviewPrefix(code) {
  return `[REVIEW · ${code.toUpperCase()}] `;
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

async function processLang(code) {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const opts = LANGS[code];
  const existingPath = path.join(I18N_DIR, `${code}.json`);
  const existing = fs.existsSync(existingPath) ? JSON.parse(fs.readFileSync(existingPath, "utf8")) : {};
  const keys = Object.keys(en);
  const out = {};
  const work = [];
  for (const k of keys) {
    if (needsTranslate(en[k], existing[k])) {
      work.push(k);
    } else {
      out[k] = existing[k];
    }
  }
  const rp = reviewPrefix(code);
  console.log(`\n[${code}] keep ${keys.length - work.length} / translate ${work.length}`);

  for (let i = 0; i < work.length; i += BATCH) {
    const slice = work.slice(i, i + BATCH);
    const texts = slice.map((k) => en[k]);
    let batch = await translateBatchSafe(texts, opts);
    if (!batch) {
      batch = new Array(slice.length).fill(null);
    }
    for (let j = 0; j < slice.length; j++) {
      let v = batch[j];
      if (v != null && String(v).trim() !== "") {
        out[slice[j]] = v;
        continue;
      }
      try {
        out[slice[j]] = await translateOne(texts[j], opts);
      } catch {
        out[slice[j]] = en[slice[j]] === "" ? "" : rp + String(en[slice[j]]);
      }
    }
    process.stdout.write(` ${i + slice.length}/${work.length}`);
    await sleep(BATCH_GAP_MS);
  }

  const ordered = {};
  for (const k of keys) {
    if (!(k in out)) {
      throw new Error(`[${code}] internal error: missing key ${k}`);
    }
    ordered[k] = out[k];
  }

  if (Object.keys(ordered).length !== keys.length) {
    throw new Error(`[${code}] key count mismatch`);
  }

  const merged = mergeLocaleSourceExtras(ordered, code, keys);

  const json = JSON.stringify(merged);
  fs.writeFileSync(path.join(I18N_DIR, `${code}.json`), json);
  if (fs.existsSync(CLIENT_I18N)) {
    fs.writeFileSync(path.join(CLIENT_I18N, `${code}.json`), json);
  }
  console.log(`\n[${code}] wrote ${path.join(I18N_DIR, `${code}.json`)}`);
}

function mergeTsOnlyForAll() {
  const en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  const keys = Object.keys(en);
  for (const code of Object.keys(LANGS)) {
    const p = path.join(I18N_DIR, `${code}.json`);
    const cur = JSON.parse(fs.readFileSync(p, "utf8"));
    const base = {};
    for (const k of keys) {
      if (!(k in cur)) {
        throw new Error(`[${code}] missing en key ${k} in ${p} — run full generate first`);
      }
      base[k] = cur[k];
    }
    const merged = mergeLocaleSourceExtras(base, code, keys);
    const json = JSON.stringify(merged);
    fs.writeFileSync(p, json);
    if (fs.existsSync(CLIENT_I18N)) {
      fs.writeFileSync(path.join(CLIENT_I18N, `${code}.json`), json);
    }
    console.log(`[${code}] total keys ${Object.keys(merged).length}`);
  }
}

async function main() {
  if (process.argv.includes("--merge-ts-only")) {
    mergeTsOnlyForAll();
    console.log("\nDone (--merge-ts-only).");
    return;
  }
  for (const code of Object.keys(LANGS)) {
    await processLang(code);
  }
  console.log("\nDone. Run: node -e \"const e=require('./public/i18n/en.json');['fr','es','tl','ar','hi'].forEach(l=>{const x=require('./public/i18n/'+l+'.json');console.log(l,Object.keys(x).length,Object.keys(e).length);});\"");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Full key parity es.json from en.json via MyMemory translate API (free tier).
 * Caches in .cache/translate-es-mymemory-cache.json — safe to re-run.
 * Falls back to English on quota / errors.
 *
 * Usage: node script/build-es-i18n-mymemory.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const enPath = path.join(root, "nursenest-core/public/i18n/en.json");
const esPath = path.join(root, "nursenest-core/public/i18n/es.json");
const clientEsPath = path.join(root, "client/public/i18n/es.json");
const cacheDir = path.join(root, ".cache");
const cachePath = path.join(cacheDir, "translate-es-mymemory-cache.json");

const TERMS = ["NCLEX-RN", "NCLEX-PN", "NCLEX", "REx-PN", "RExPN", "FNP", "NP", "RN", "PN"];
const DELAY_MS = Math.max(200, parseInt(process.env.MYMEMORY_DELAY_MS || "450", 10));
const MAX_Q = 2000;

function mask(s) {
  const mustache = [];
  let out = s.replace(/\{\{[^}]+\}\}/g, (m) => {
    const ph = `<<<M${mustache.length}>>>`;
    mustache.push(m);
    return ph;
  });
  for (let i = 0; i < TERMS.length; i++) {
    const term = TERMS[i];
    const ph = `<<<T${i}>>>`;
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.split(new RegExp(esc, "g")).join(ph);
  }
  return { masked: out, mustache };
}

function unmask(translated, mustache) {
  let out = translated;
  for (let i = 0; i < TERMS.length; i++) {
    out = out.split(`<<<T${i}>>>`).join(TERMS[i]);
  }
  for (let i = 0; i < mustache.length; i++) {
    out = out.split(`<<<M${i}>>>`).join(mustache[i]);
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function mymemoryTranslate(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.quotaFinished) throw new Error("quotaFinished");
  if (data.responseStatus !== 200) throw new Error(data.responseDetails || String(data.responseStatus));
  const tr = data.responseData?.translatedText;
  if (typeof tr !== "string") throw new Error("no translation");
  if (tr.includes("MYMEMORY WARNING")) throw new Error("quota warning in body");
  return tr;
}

async function translateString(full) {
  if (full === "") return "";
  const { masked, mustache } = mask(full);
  if (encodeURIComponent(masked).length <= 7500) {
    const tr = await mymemoryTranslate(masked);
    await sleep(DELAY_MS);
    return unmask(tr, mustache);
  }
  const parts = [];
  for (let i = 0; i < masked.length; i += MAX_Q) {
    const chunk = masked.slice(i, i + MAX_Q);
    parts.push(await mymemoryTranslate(chunk));
    await sleep(DELAY_MS);
  }
  return unmask(parts.join(""), mustache);
}

function loadJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

async function main() {
  mkdirSync(cacheDir, { recursive: true });
  const en = loadJson(enPath);
  const esPartial = existsSync(esPath) ? loadJson(esPath) : {};
  const enKeys = Object.keys(en);

  let cache = {};
  if (existsSync(cachePath)) {
    try {
      cache = JSON.parse(readFileSync(cachePath, "utf8"));
    } catch {
      cache = {};
    }
  }

  const need = new Set();
  for (const k of enKeys) {
    const ev = en[k];
    const sv = esPartial[k];
    if (sv !== undefined && sv !== ev) continue;
    if (cache[ev] != null) continue;
    need.add(ev);
  }
  const toTranslate = [...need];

  const limit = process.env.TRANSLATE_LIMIT ? parseInt(process.env.TRANSLATE_LIMIT, 10) : toTranslate.length;
  const batch = toTranslate.slice(0, Math.min(limit, toTranslate.length));
  console.log(`To translate (unique strings): ${batch.length}/${toTranslate.length}, cached: ${Object.keys(cache).length}`);

  for (let i = 0; i < batch.length; i++) {
    const text = batch[i];
    try {
      cache[text] = await translateString(text);
    } catch (e) {
      console.error(`FAIL [${i}]:`, text.slice(0, 70), e.message);
      cache[text] = text;
    }
    if (i % 50 === 0) writeFileSync(cachePath, JSON.stringify(cache));
    if ((i + 1) % 100 === 0) console.log(`Progress ${i + 1}/${batch.length}`);
  }
  writeFileSync(cachePath, JSON.stringify(cache));

  const out = {};
  for (const k of enKeys) {
    const ev = en[k];
    const sv = esPartial[k];
    if (sv !== undefined && sv !== ev) out[k] = sv;
    else if (cache[ev] != null) out[k] = cache[ev];
    else out[k] = ev;
  }

  const json = JSON.stringify(out);
  JSON.parse(json);
  writeFileSync(esPath, json);
  writeFileSync(clientEsPath, json);
  console.log(`Wrote ${esPath} (${enKeys.length} keys)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

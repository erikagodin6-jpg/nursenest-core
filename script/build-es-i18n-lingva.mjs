/**
 * Build nursenest-core/public/i18n/es.json (and client copy) with full key parity to en.json.
 * Uses Lingva translate proxy (no API key). Resumes from .cache/translate-es-lingva-cache.json.
 *
 * Usage: node script/build-es-i18n-lingva.mjs
 * Env: LINGVA_CONCURRENCY (default 2), LINGVA_DELAY_MS (default 350)
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
const cachePath = path.join(cacheDir, "translate-es-lingva-cache.json");

const TERMS = ["NCLEX-RN", "NCLEX-PN", "NCLEX", "REx-PN", "RExPN", "FNP", "NP", "RN", "PN"];
const CONCURRENCY = Math.max(1, parseInt(process.env.LINGVA_CONCURRENCY || "2", 10));
const DELAY_MS = Math.max(0, parseInt(process.env.LINGVA_DELAY_MS || "350", 10));
/** Encoded URL length budget (browser/server limits vary). */
const MAX_ENCODED_CHUNK = 3800;

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

function lineToUrlPieces(line) {
  if (encodeURIComponent(line).length <= MAX_ENCODED_CHUNK) return [line];
  const pieces = [];
  const words = line.split(/(\s+)/);
  let acc = "";
  for (const w of words) {
    const next = acc + w;
    if (encodeURIComponent(next).length > MAX_ENCODED_CHUNK) {
      if (acc.length) pieces.push(acc);
      if (encodeURIComponent(w).length > MAX_ENCODED_CHUNK) {
        let start = 0;
        while (start < w.length) {
          let end = w.length;
          while (end > start && encodeURIComponent(w.slice(start, end)).length > MAX_ENCODED_CHUNK) end--;
          if (end === start) end = start + 1;
          pieces.push(w.slice(start, end));
          start = end;
        }
        acc = "";
      } else acc = w;
    } else acc = next;
  }
  if (acc.length) pieces.push(acc);
  return pieces;
}

const SLASH_TOKEN = "⟨SL⟩";

async function fetchLingvaChunk(chunk) {
  /** Lingva route treats `/` as a path segment — mask before URL encoding. */
  const pathSafe = chunk.split("/").join(SLASH_TOKEN);
  const url = `https://lingva.ml/api/v1/en/es/${encodeURIComponent(pathSafe)}`;
  let lastErr;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (typeof data.translation !== "string") throw new Error(JSON.stringify(data).slice(0, 200));
      return data.translation.split(SLASH_TOKEN).join("/");
    } catch (e) {
      lastErr = e;
      await sleep(Math.min(30_000, 800 * 2 ** attempt));
    }
  }
  throw lastErr;
}

async function translateString(full) {
  if (full === "") return "";
  const { masked, mustache } = mask(full);
  const maskedLines = masked.split("\n");
  const translatedLines = [];
  for (const line of maskedLines) {
    const pieces = lineToUrlPieces(line);
    const trParts = [];
    for (const p of pieces) {
      trParts.push(await fetchLingvaChunk(p));
      if (DELAY_MS) await sleep(DELAY_MS);
    }
    translatedLines.push(trParts.join(""));
  }
  return unmask(translatedLines.join("\n"), mustache);
}

async function poolMap(items, limit, fn) {
  const ret = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      ret[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return ret;
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

  const toTranslate = new Set();
  for (const k of enKeys) {
    const ev = en[k];
    const sv = esPartial[k];
    if (sv !== undefined && sv !== ev) continue;
    if (cache[ev] != null) continue;
    toTranslate.add(ev);
  }

  const list = [...toTranslate];
  const cap = process.env.TRANSLATE_LIMIT ? parseInt(process.env.TRANSLATE_LIMIT, 10) : list.length;
  const capped = list.slice(0, Math.min(cap, list.length));
  console.log(
    `Keys: ${enKeys.length}, unique strings to translate: ${capped.length}/${list.length}, cached: ${Object.keys(cache).length}`,
  );

  const CHUNK = 200;
  let done = 0;
  for (let c = 0; c < capped.length; c += CHUNK) {
    const batch = capped.slice(c, c + CHUNK);
    await poolMap(batch, CONCURRENCY, async (text) => {
      try {
        const tr = await translateString(text);
        cache[text] = tr;
      } catch (e) {
        console.error("FAIL:", text.slice(0, 80), e.message);
        cache[text] = text;
      }
    });
    done += batch.length;
    writeFileSync(cachePath, JSON.stringify(cache));
    console.log(`Progress ${done}/${capped.length}`);
  }

  const out = {};
  for (const k of enKeys) {
    const ev = en[k];
    const sv = esPartial[k];
    if (sv !== undefined && sv !== ev) out[k] = sv;
    else if (cache[ev] != null) out[k] = cache[ev];
    else out[k] = ev;
  }

  if (Object.keys(out).length !== enKeys.length) throw new Error("key count mismatch");
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

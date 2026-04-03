#!/usr/bin/env node
/**
 * Machine-translate nav/footer/shell keys that are still identical to English
 * (temporary baseline). Does not touch non-nav keys.
 *
 * Usage (from nursenest-core/):
 *   node scripts/i18n-nav-patch-carryover.mjs
 *   node scripts/i18n-nav-patch-carryover.mjs --dry-run
 *   node scripts/i18n-nav-patch-carryover.mjs --locale=fr
 *
 * Requires network (Google via `google-translate-api-x`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { batchTranslate, translate } from "google-translate-api-x";
import {
  GOOGLE_TRANSLATE_TO,
  isNavAuditedKey,
  isNavExamStripKey,
  NAV_PATCH_SKIP_KEYS,
  NAV_PATCH_SKIP_VALUES,
} from "./lib/i18n-nav-surface.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n/en.json");
const I18N_DIR = path.join(ROOT, "public/i18n");
const CLIENT_I18N = path.join(ROOT, "..", "client", "public", "i18n");

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

async function translateOne(text, to) {
  const { t, orig } = shield(text);
  const forceTo = to === "fr-CA";
  const res = await translate(t, { from: "en", to, forceTo });
  return unshield(res.text, orig);
}

async function translateBatchSafe(texts, to) {
  const shields = texts.map((s) => shield(s));
  const inputs = shields.map((x) => x.t);
  const forceTo = to === "fr-CA";
  try {
    const results = await batchTranslate(inputs, {
      from: "en",
      to,
      forceTo,
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

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeLocale(code, obj) {
  const json = JSON.stringify(obj);
  const p = path.join(I18N_DIR, `${code}.json`);
  fs.writeFileSync(p, json);
  if (fs.existsSync(CLIENT_I18N)) {
    fs.writeFileSync(path.join(CLIENT_I18N, `${code}.json`), json);
  }
  return p;
}

async function patchLocale(code, en, dryRun) {
  const to = GOOGLE_TRANSLATE_TO[code];
  if (!to) {
    console.log(`[${code}] skip — no GOOGLE_TRANSLATE_TO mapping`);
    return { patched: 0, added: 0, skipped: 0 };
  }

  const p = path.join(I18N_DIR, `${code}.json`);
  if (!fs.existsSync(p)) {
    console.log(`[${code}] skip — file missing`);
    return { patched: 0, added: 0, skipped: 0 };
  }

  const locale = loadJson(p);
  const enNavKeys = Object.keys(en).filter(isNavAuditedKey);

  let added = 0;
  for (const k of enNavKeys) {
    if (!(k in locale)) {
      locale[k] = en[k];
      added += 1;
    }
  }

  const work = [];
  for (const k of enNavKeys) {
    const ev = String(en[k] ?? "");
    const lv = String(locale[k] ?? "");
    if (NAV_PATCH_SKIP_KEYS.has(k) || isNavExamStripKey(k)) {
      continue;
    }
    if (NAV_PATCH_SKIP_VALUES.has(lv.trim()) && ev === lv) {
      continue;
    }
    if (ev === lv && ev.trim() !== "") {
      work.push(k);
    }
  }

  if (dryRun) {
    console.log(`[${code}] dry-run: would translate ${work.length} keys, add ${added} missing nav keys`);
    return { patched: work.length, added, skipped: 0 };
  }

  let patched = 0;
  for (let i = 0; i < work.length; i += BATCH) {
    const slice = work.slice(i, i + BATCH);
    const texts = slice.map((k) => String(en[k]));
    let batch = await translateBatchSafe(texts, to);
    if (!batch) batch = new Array(slice.length).fill(null);
    for (let j = 0; j < slice.length; j++) {
      const k = slice[j];
      let v = batch[j];
      if (v == null || String(v).trim() === "") {
        try {
          v = await translateOne(texts[j], to);
        } catch {
          v = String(en[k]);
        }
      }
      locale[k] = v;
      patched += 1;
    }
    process.stdout.write(` [${code}] ${Math.min(i + slice.length, work.length)}/${work.length}`);
    await sleep(BATCH_GAP_MS);
  }

  /** Persist merged keys even when `work` is empty (e.g. only missing-key backfill). */
  writeLocale(code, locale);
  console.log(`\n[${code}] wrote ${patched} translated + ${added} keys added from en (missing)`);
  return { patched, added, skipped: work.length - patched };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const locArg = process.argv.find((a) => a.startsWith("--locale="));
  const only = locArg ? locArg.split("=")[1]?.trim() : null;

  const en = loadJson(EN_PATH);
  const codes = only
    ? [only]
    : Object.keys(GOOGLE_TRANSLATE_TO).sort();

  const summary = [];
  for (const code of codes) {
    const r = await patchLocale(code, en, dryRun);
    summary.push({ code, ...r });
  }

  console.log("\n--- Summary ---");
  for (const s of summary) {
    console.log(`${s.code}: patched=${s.patched} added_missing=${s.added}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

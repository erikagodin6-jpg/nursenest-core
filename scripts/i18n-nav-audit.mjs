#!/usr/bin/env node
/**
 * Idempotent audit: compare each non-English `public/i18n/{locale}.json` to `en.json`
 * for navigation-related keys only.
 *
 * Usage (from nursenest-core/): `node scripts/i18n-nav-audit.mjs`
 *
 * @see scripts/lib/i18n-nav-surface.mjs for which keys are audited.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isNavAuditedKey,
  isNavIdenticalAllowlisted,
  placeholderBalance,
  SUPPORTED_NON_EN_LOCALES,
  TAGALOG_NAV_IDENTICAL_ENGLISH_OK,
} from "./lib/i18n-nav-surface.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n/en.json");
const I18N_DIR = path.join(ROOT, "public/i18n");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function auditedKeysFromEn(en) {
  return Object.keys(en).filter(isNavAuditedKey);
}

function auditLocale(code, en, locale, enNavKeys) {
  const issues = {
    missing: [],
    empty: [],
    identicalToEn: [],
    identicalAllowlisted: [],
    placeholderMismatch: [],
    suspicious: [],
  };

  for (const key of enNavKeys) {
    if (!(key in locale)) {
      issues.missing.push(key);
      continue;
    }
    const ev = en[key];
    const lv = locale[key];
    if (lv === undefined || lv === null) {
      issues.missing.push(key);
      continue;
    }
    const lStr = String(lv);
    if (lStr.trim() === "") {
      issues.empty.push(key);
      continue;
    }
    if (String(ev) === lStr) {
      if (
        isNavIdenticalAllowlisted(key, String(ev), lStr) ||
        (code === "tl" && TAGALOG_NAV_IDENTICAL_ENGLISH_OK.has(key))
      ) {
        issues.identicalAllowlisted.push(key);
      } else {
        issues.identicalToEn.push(key);
      }
    }
    const ph = placeholderBalance(ev, lStr);
    if (!ph.ok) {
      issues.placeholderMismatch.push({ key, enPlaceholders: ph.enCount, locPlaceholders: ph.locCount });
    }
    if (/^\[REVIEW\s*·/i.test(lStr)) {
      issues.suspicious.push({ key, note: "review_prefix" });
    }
  }

  return issues;
}

function printReport(code, issues) {
  console.log(`\n${"=".repeat(72)}\nLOCALE: ${code}\n${"=".repeat(72)}`);

  const sections = [
    ["MISSING_KEYS", issues.missing],
    ["EMPTY_VALUES", issues.empty],
    ["IDENTICAL_TO_ENGLISH_REVIEW", issues.identicalToEn],
    ["IDENTICAL_ALLOWLISTED_OK", issues.identicalAllowlisted],
    ["PLACEHOLDER_MISMATCH", issues.placeholderMismatch],
    ["SUSPICIOUS", issues.suspicious],
  ];

  for (const [title, arr] of sections) {
    if (!arr.length) continue;
    console.log(`\n--- ${title} (${arr.length}) ---`);
    if (typeof arr[0] === "string") {
      for (const k of arr.sort()) console.log(`  ${k}`);
    } else {
      for (const row of arr) {
        console.log(`  ${JSON.stringify(row)}`);
      }
    }
  }

  if (
    !issues.missing.length &&
    !issues.empty.length &&
    !issues.identicalToEn.length &&
    !issues.placeholderMismatch.length &&
    !issues.suspicious.length
  ) {
    console.log("\n  (clean: no missing/empty/review-identical/placeholder issues)");
  }
}

function main() {
  const en = loadJson(EN_PATH);
  const enNavKeys = auditedKeysFromEn(en);
  console.log(`Audited nav-related keys in en.json: ${enNavKeys.length}`);

  const locales = fs
    .readdirSync(I18N_DIR)
    .filter((f) => f.endsWith(".json") && f !== "en.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();

  for (const code of locales) {
    if (code === "en") continue;
    const p = path.join(I18N_DIR, `${code}.json`);
    let locale;
    try {
      locale = loadJson(p);
    } catch (e) {
      console.error(`\n[ERROR] ${code}: cannot parse ${p}: ${e.message}`);
      continue;
    }
    const issues = auditLocale(code, en, locale, enNavKeys);
    printReport(code, issues);
  }

  console.log(`\n${"=".repeat(72)}\nSupported MT targets (reference): ${SUPPORTED_NON_EN_LOCALES.join(", ")}\n`);
}

main();

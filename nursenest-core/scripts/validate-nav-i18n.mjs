#!/usr/bin/env node
/**
 * CI-friendly guard: nav / footer nav / breadcrumbs / learner-shell labels in marketing locales
 * must match `en.json` for audited keys (no missing keys, no empty values, no raw English carryover
 * except allowlist, mustache placeholders must match).
 *
 * Uses `scripts/lib/nav-i18n-audit.mjs` (no translation deps).
 *
 * Usage (from nursenest-core/):
 *   node scripts/validate-nav-i18n.mjs
 *   node scripts/validate-nav-i18n.mjs --json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_LOCALE_CODES, auditOneLocale, getAuditedKeys } from "./lib/nav-i18n-audit.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(ROOT, "public/i18n", "en.json");
const I18N_DIR = path.join(ROOT, "public", "i18n");

const jsonMode = process.argv.includes("--json");

function main() {
  let en;
  try {
    en = JSON.parse(fs.readFileSync(EN_PATH, "utf8"));
  } catch (e) {
    console.error(`FATAL: cannot parse ${EN_PATH}`, e.message);
    process.exit(1);
  }

  const auditedCount = getAuditedKeys(en).length;
  const failures = [];
  const byLocale = {};

  for (const code of MARKETING_LOCALE_CODES) {
    const p = path.join(I18N_DIR, `${code}.json`);
    if (!fs.existsSync(p)) {
      failures.push({ code, kind: "file_missing", path: p });
      byLocale[code] = { error: "file_missing", path: p };
      continue;
    }
    let locMap;
    try {
      locMap = JSON.parse(fs.readFileSync(p, "utf8"));
    } catch (e) {
      failures.push({ code, kind: "json_parse", path: p, message: e.message });
      byLocale[code] = { error: "json_parse", path: p, message: e.message };
      continue;
    }

    const r = auditOneLocale(code, en, locMap);
    byLocale[code] = r;
    const bad =
      r.missing.length + r.empty.length + r.englishCarryover.length + r.placeholderMismatch.length;
    if (bad > 0) {
      for (const k of r.missing) failures.push({ code, kind: "missing", key: k });
      for (const k of r.empty) failures.push({ code, kind: "empty", key: k });
      for (const k of r.englishCarryover) {
        failures.push({ code, kind: "english_carryover", key: k, en: en[k] });
      }
      for (const ph of r.placeholderMismatch) {
        failures.push({
          code,
          kind: "placeholder_mismatch",
          key: ph.key,
          expectedPlaceholders: ph.en || "(none)",
          actualPlaceholders: ph.locale || "(none)",
        });
      }
    }
  }

  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          ok: failures.length === 0,
          auditedKeyCount: auditedCount,
          localeCount: MARKETING_LOCALE_CODES.length,
          failureCount: failures.length,
          failures,
          byLocale,
        },
        null,
        2,
      ),
    );
    process.exit(failures.length === 0 ? 0 : 1);
    return;
  }

  console.log("Nav i18n validation (audited keys vs public/i18n/en.json)\n");
  console.log(`Audited string keys: ${auditedCount} | Locales: ${MARKETING_LOCALE_CODES.join(", ")}\n`);

  if (failures.length === 0) {
    console.log("OK — all marketing locales pass nav/footer/breadcrumb/shell label checks.\n");
    process.exit(0);
  }

  console.error(`FAILED (${failures.length} issue(s))\n`);
  const byKind = {};
  for (const f of failures) {
    byKind[f.kind] = byKind[f.kind] || [];
    byKind[f.kind].push(f);
  }
  const order = ["file_missing", "json_parse", "missing", "empty", "english_carryover", "placeholder_mismatch"];
  for (const kind of order) {
    const list = byKind[kind];
    if (!list?.length) continue;
    console.error(`--- ${kind.replace(/_/g, " ").toUpperCase()} (${list.length}) ---`);
    for (const f of list) {
      if (kind === "file_missing") console.error(`  [${f.code}] missing file: ${f.path}`);
      else if (kind === "json_parse") console.error(`  [${f.code}] ${f.path}: ${f.message}`);
      else if (kind === "missing") console.error(`  [${f.code}] ${f.key}`);
      else if (kind === "empty") console.error(`  [${f.code}] ${f.key} (empty string)`);
      else if (kind === "english_carryover")
        console.error(`  [${f.code}] ${f.key}\n      en: ${JSON.stringify(f.en)}`);
      else if (kind === "placeholder_mismatch")
        console.error(
          `  [${f.code}] ${f.key}\n      expected placeholders: ${f.expectedPlaceholders}\n      actual: ${f.actualPlaceholders}`,
        );
    }
    console.error("");
  }

  console.error("Fix: add/translate keys in public/i18n/<locale>.json, or run:");
  console.error("  npm run i18n:nav-parity-fill");
  console.error("Allowlisted English matches: brand.nurseNest/applyNest, nav.examStrip.*, loanwords — see scripts/lib/nav-i18n-audit.mjs (allowsEnglishParity).");
  process.exit(1);
}

main();

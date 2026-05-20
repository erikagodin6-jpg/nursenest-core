#!/usr/bin/env node
/**
 * CI-friendly guard: nav / footer nav / breadcrumbs / learner-shell labels in marketing locales
 * must match English for audited keys (no missing keys, no empty values, no raw English carryover
 * except allowlist, mustache placeholders must match).
 *
 * Uses `scripts/lib/nav-i18n-audit.mjs` (no translation deps).
 * Resolves app root: monorepo `nursenest-core/` or legacy repo root; loads flat `en.json` or merged shards.
 *
 * Usage (from repo root):
 *   node scripts/validate-nav-i18n.mjs
 *   node scripts/validate-nav-i18n.mjs --json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_LOCALE_CODES, auditOneLocale, getAuditedKeys } from "./lib/nav-i18n-audit.mjs";
import { ensureRequiredEnNavKeys } from "./lib/ensure-en-nav-keys.mjs";
import { loadLocaleFlatMarketingMap, resolveMarketingI18nAppRoot } from "./lib/i18n-app-root.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const jsonMode = process.argv.includes("--json");

function localeSourcePath(appRoot, code) {
  const flat = path.join(appRoot, "public", "i18n", `${code}.json`);
  if (fs.existsSync(flat)) return flat;
  return path.join(appRoot, "public", "i18n", code);
}

function navAuditLocaleCodes(appRoot) {
  const sourcePath = path.join(appRoot, "src", "lib", "i18n", "marketing-languages.ts");
  if (!fs.existsSync(sourcePath)) return MARKETING_LOCALE_CODES;
  const source = fs.readFileSync(sourcePath, "utf8");
  const codes = [];
  const seen = new Set();
  /** Per-entry tier: non-greedy `code…tier` can span objects and mis-associate `ta` with a later `full`. */
  const codeStarts = [...source.matchAll(/\{\s*code:\s*"([^"]+)"/g)];
  for (let i = 0; i < codeStarts.length; i++) {
    const code = codeStarts[i][1];
    const from = codeStarts[i].index;
    const to = i + 1 < codeStarts.length ? codeStarts[i + 1].index : source.length;
    const slice = source.slice(from, to);
    const tierM = slice.match(/\btier:\s*"(full|partial|incomplete)"/);
    const tier = tierM?.[1];
    if (!tier) continue;
    if (code === "en" || seen.has(code)) continue;
    if (tier === "full" || tier === "partial") {
      seen.add(code);
      codes.push(code);
    }
  }
  return codes.length > 0 ? codes : MARKETING_LOCALE_CODES;
}

function main() {
  ensureRequiredEnNavKeys();
  const appRoot = resolveMarketingI18nAppRoot(REPO_ROOT);
  const locales = navAuditLocaleCodes(appRoot);
  const en = loadLocaleFlatMarketingMap(appRoot, "en");
  if (!en || typeof en !== "object") {
    console.error(
      `FATAL: cannot load English marketing i18n under ${path.join(appRoot, "public", "i18n")} (en.json or en/*.json)`,
    );
    process.exit(1);
  }

  const auditedCount = getAuditedKeys(en).length;
  const failures = [];
  const byLocale = {};

  for (const code of locales) {
    const srcPath = localeSourcePath(appRoot, code);
    const flatExists = fs.existsSync(srcPath) && fs.statSync(srcPath).isFile();
    const dirExists = fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory();
    if (!flatExists && !dirExists) {
      failures.push({ code, kind: "file_missing", path: srcPath });
      byLocale[code] = { error: "file_missing", path: srcPath };
      continue;
    }
    const locMap = loadLocaleFlatMarketingMap(appRoot, code);
    if (!locMap || typeof locMap !== "object") {
      failures.push({ code, kind: "json_parse", path: String(srcPath), message: "empty or invalid locale map" });
      byLocale[code] = { error: "json_parse", path: String(srcPath), message: "empty or invalid locale map" };
      continue;
    }

    const r = auditOneLocale(code, en, locMap);
    byLocale[code] = r;
    const bad =
      r.missing.length +
      r.empty.length +
      r.englishCarryover.length +
      r.placeholderMismatch.length +
      r.malformed.length;
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
      for (const k of r.malformed) {
        failures.push({ code, kind: "malformed", key: k });
      }
    }
  }

  if (jsonMode) {
    console.log(
      JSON.stringify(
        {
          ok: failures.length === 0,
          appRoot,
          auditedKeyCount: auditedCount,
          localeCount: locales.length,
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

  console.log(`Nav i18n validation (appRoot=${appRoot}, audited keys vs English)\n`);
  console.log(`Audited string keys: ${auditedCount} | Locales: ${locales.join(", ")}\n`);

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
  const order = [
    "file_missing",
    "json_parse",
    "missing",
    "empty",
    "english_carryover",
    "placeholder_mismatch",
    "malformed",
  ];
  for (const kind of order) {
    const list = byKind[kind];
    if (!list?.length) continue;
    console.error(`--- ${kind.replace(/_/g, " ").toUpperCase()} (${list.length}) ---`);
    for (const f of list) {
      if (kind === "file_missing") console.error(`  [${f.code}] missing file/dir: ${f.path}`);
      else if (kind === "json_parse") console.error(`  [${f.code}] ${f.path}: ${f.message}`);
      else if (kind === "missing") console.error(`  [${f.code}] ${f.key}`);
      else if (kind === "empty") console.error(`  [${f.code}] ${f.key} (empty string)`);
      else if (kind === "english_carryover")
        console.error(`  [${f.code}] ${f.key}\n      en: ${JSON.stringify(f.en)}`);
      else if (kind === "placeholder_mismatch")
        console.error(
          `  [${f.code}] ${f.key}\n      expected placeholders: ${f.expectedPlaceholders}\n      actual: ${f.actualPlaceholders}`,
        );
      else if (kind === "malformed")
        console.error(`  [${f.code}] ${f.key} (unbalanced {{ }} in locale string)`);
    }
    console.error("");
  }

  console.error("Fix: add/translate keys under public/i18n/<locale>/ or public/i18n/<locale>.json, or run:");
  console.error("  npm run i18n:nav-parity-fill");
  console.error("Allowlisted English matches: brand.nurseNest/applyNest, nav.examStrip.*, loanwords — see scripts/lib/nav-i18n-audit.mjs (allowsEnglishParity).");
  process.exit(1);
}

main();

#!/usr/bin/env node
/**
 * Storage guardrails: flag oversized static assets under public/ that should live on Spaces/CDN.
 *
 * - Non-i18n files: fail in --strict if any file exceeds PUBLIC_NON_I18N_MAX_BYTES (default 512 KiB).
 * - public/i18n: informational warnings only (bundles are large until MARKETING_I18N_CDN_BASE migration).
 *
 * Usage: npm run storage:check [--strict]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const pkgRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(pkgRoot, "public");

const PUBLIC_NON_I18N_MAX_BYTES = 512 * 1024;
const I18N_WARN_PER_FILE_BYTES = 2 * 1024 * 1024;
const I18N_TOTAL_WARN_BYTES = 15 * 1024 * 1024;

const strict = process.argv.includes("--strict");

function walk(dir, acc) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.isFile()) acc.push(full);
  }
}

function rel(p) {
  return path.relative(pkgRoot, p);
}

const files = [];
if (fs.existsSync(publicRoot)) walk(publicRoot, files);

const violations = [];
const i18nWarnings = [];
let i18nTotal = 0;

for (const fp of files) {
  const st = fs.statSync(fp);
  const r = rel(fp).replace(/\\/g, "/");
  const inI18n = r.startsWith("public/i18n/");

  if (inI18n) {
    i18nTotal += st.size;
    if (st.size > I18N_WARN_PER_FILE_BYTES) {
      i18nWarnings.push({ path: r, bytes: st.size });
    }
    continue;
  }

  if (st.size > PUBLIC_NON_I18N_MAX_BYTES) {
    violations.push({ path: r, bytes: st.size, limit: PUBLIC_NON_I18N_MAX_BYTES });
  }
}

console.log("=== storage:check (public/) ===\n");
console.log(`strict=${strict}  non-i18n max=${PUBLIC_NON_I18N_MAX_BYTES} bytes\n`);

if (violations.length) {
  console.log("OVERSIZED non-i18n files (should move to Spaces/CDN or shrink):\n");
  for (const v of violations) {
    console.log(`  ${v.path}  (${v.bytes} bytes > ${v.limit})`);
  }
  console.log("");
} else {
  console.log("No non-i18n public files over limit.\n");
}

if (i18nWarnings.length) {
  console.log("i18n per-file warnings (consider MARKETING_I18N_CDN_BASE):\n");
  for (const w of i18nWarnings) {
    console.log(`  ${w.path}  (${w.bytes} bytes)`);
  }
  console.log("");
}

console.log(`public/i18n total: ${i18nTotal} bytes${i18nTotal > I18N_TOTAL_WARN_BYTES ? "  (warn: consider CDN offload)" : ""}\n`);

if (strict && violations.length) {
  console.error("storage:check FAILED (--strict): move large non-i18n assets out of public/.\n");
  process.exit(1);
}

process.exit(0);

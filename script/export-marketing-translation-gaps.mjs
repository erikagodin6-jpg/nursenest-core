#!/usr/bin/env node
/**
 * Export translator-ready CSV reports for marketing locale overlays vs English.
 *
 * Usage (repo root):
 *   npm run i18n:report:marketing
 *   npm run i18n:report:marketing -- fr
 *   npm run i18n:report:marketing -- --all
 *   npm run i18n:report:marketing -- fr --all
 *
 * Output: tools/i18n/reports/marketing-<locale>-missing.csv (gap rows by default)
 *         tools/i18n/reports/marketing-<locale>-all-keys.csv  (with --all)
 *
 * Does not modify the i18n merge pipeline or routing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const EN_PATH = path.join(REPO_ROOT, "tools", "i18n", "marketing", "marketing-en.json");
const LOCALE_DIR = path.join(REPO_ROOT, "tools", "i18n", "marketing", "locale");
const OUT_DIR = path.join(REPO_ROOT, "tools", "i18n", "reports");

/** @returns {{ section: string, priorityRank: number }} */
function sectionAndPriority(key) {
  if (key.startsWith("pages.pricing.")) return { section: "pricing", priorityRank: 1 };
  if (key.startsWith("paywall.")) return { section: "paywall", priorityRank: 2 };
  if (key.startsWith("home.") || key.startsWith("pages.home.")) return { section: "home", priorityRank: 3 };
  if (key.startsWith("footer.")) return { section: "footer", priorityRank: 4 };
  if (key.startsWith("nav.")) return { section: "nav", priorityRank: 5 };
  if (
    key.startsWith("pages.login.") ||
    key.startsWith("pages.signup.") ||
    key.startsWith("pages.forgotPassword.") ||
    key.startsWith("pages.resetPassword.") ||
    key.startsWith("auth.")
  ) {
    return { section: "auth", priorityRank: 6 };
  }
  return { section: "other", priorityRank: 7 };
}

function overlayStatus(enVal, localeObj, key) {
  if (!(key in localeObj) || localeObj[key] === undefined) return "missing_in_overlay";
  const lv = localeObj[key];
  if (String(lv) === String(enVal)) return "identical_to_english";
  return "present_and_translated";
}

function csvEscape(value) {
  const s = value == null ? "" : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function parseArgs(argv) {
  const all = argv.includes("--all");
  const locales = argv.filter((a) => a !== "--all" && !a.startsWith("-"));
  return { all, singleLocale: locales[0] ?? null };
}

function writeCsv(rows, outPath) {
  const header = [
    "locale",
    "key",
    "englishValue",
    "overlayValue",
    "overlayStatus",
    "section",
    "priorityRank",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.locale),
        csvEscape(r.key),
        csvEscape(r.englishValue),
        csvEscape(r.overlayValue),
        csvEscape(r.overlayStatus),
        csvEscape(r.section),
        csvEscape(String(r.priorityRank)),
      ].join(","),
    );
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const argv = process.argv.slice(2);
  const { all, singleLocale } = parseArgs(argv);

  if (!fs.existsSync(EN_PATH)) {
    console.error(`Missing ${EN_PATH}`);
    process.exit(1);
  }
  const en = loadJson(EN_PATH);
  const enKeys = Object.keys(en).sort();

  const localeFiles = fs
    .readdirSync(LOCALE_DIR)
    .filter((f) => /^marketing-[a-z0-9-]+\.json$/i.test(f))
    .sort();

  const codes = localeFiles
    .map((f) => f.replace(/^marketing-|.json$/gi, ""))
    .filter((code) => {
      if (!singleLocale) return true;
      return code === singleLocale;
    });

  if (singleLocale && codes.length === 0) {
    console.error(`No locale file for "${singleLocale}" under ${LOCALE_DIR}`);
    process.exit(1);
  }

  let totalFiles = 0;
  for (const code of codes) {
    const fp = path.join(LOCALE_DIR, `marketing-${code}.json`);
    const localeObj = loadJson(fp);
    const rows = [];

    for (const key of enKeys) {
      const enVal = en[key];
      const status = overlayStatus(enVal, localeObj, key);
      const { section, priorityRank } = sectionAndPriority(key);
      const overlayVal = key in localeObj ? localeObj[key] : "";
      if (!all && status === "present_and_translated") continue;

      rows.push({
        locale: code,
        key,
        englishValue: enVal,
        overlayValue: overlayVal,
        overlayStatus: status,
        section,
        priorityRank,
      });
    }

    rows.sort((a, b) => {
      if (a.priorityRank !== b.priorityRank) return a.priorityRank - b.priorityRank;
      return a.key.localeCompare(b.key);
    });

    const suffix = all ? "all-keys" : "missing";
    const outPath = path.join(OUT_DIR, `marketing-${code}-${suffix}.csv`);
    writeCsv(rows, outPath);
    console.log(`Wrote ${outPath} (${rows.length} rows)`);
    totalFiles++;
  }

  console.log(`Done. ${totalFiles} CSV file(s) → ${OUT_DIR}`);
}

main();

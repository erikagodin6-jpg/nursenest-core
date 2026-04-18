#!/usr/bin/env npx tsx
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MARKETING_LOCALE_CODES } from "../src/lib/i18n/marketing-locale-policy";

type Messages = Record<string, string>;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.join(__dirname, "..");
const REPO_ROOT = path.join(PKG_ROOT, "..");
const I18N_ROOT = path.join(REPO_ROOT, "client", "public", "i18n");
const thresholdRaw = process.env.MARKETING_I18N_MISSING_KEY_THRESHOLD?.trim();
const threshold = thresholdRaw ? Number(thresholdRaw) : Number.POSITIVE_INFINITY;

function loadLocale(locale: string): Messages | null {
  const file = path.join(I18N_ROOT, `${locale}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8")) as Messages;
}

function isMissingValue(v: unknown): boolean {
  return typeof v !== "string" || v.trim() === "";
}

function groupForKey(key: string): string {
  const parts = key.split(".");
  if (parts[0] === "pages" && parts.length >= 2) return `pages.${parts[1]}`;
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
  return parts[0] ?? "unknown";
}

function main(): void {
  const en = loadLocale("en");
  if (!en) {
    console.error("[i18n:marketing-missing-report] Missing client/public/i18n/en.json");
    process.exit(1);
  }

  const baselineKeys = Object.keys(en).filter((key) => typeof en[key] === "string" && en[key].trim() !== "");
  const failures: string[] = [];

  for (const locale of MARKETING_LOCALE_CODES) {
    if (locale === "en") continue;
    const bundle = loadLocale(locale);
    if (!bundle) {
      console.log(`[i18n:marketing-missing-report] locale=${locale} status=missing_bundle`);
      failures.push(`${locale}:missing_bundle`);
      continue;
    }

    const missingKeys = baselineKeys.filter((key) => isMissingValue(bundle[key]));
    const grouped = new Map<string, number>();
    for (const key of missingKeys) {
      const group = groupForKey(key);
      grouped.set(group, (grouped.get(group) ?? 0) + 1);
    }

    const topGroups = [...grouped.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([group, count]) => `${group}:${count}`)
      .join(",");

    console.log(
      `[i18n:marketing-missing-report] locale=${locale} missing=${missingKeys.length} groups=${topGroups || "none"}`,
    );

    if (missingKeys.length > threshold) {
      failures.push(`${locale}:${missingKeys.length}`);
    }
  }

  if (Number.isFinite(threshold) && failures.length > 0) {
    console.error(
      `[i18n:marketing-missing-report] FAILED threshold=${threshold} offenders=${failures.join(" ")}`,
    );
    process.exit(1);
  }
}

main();

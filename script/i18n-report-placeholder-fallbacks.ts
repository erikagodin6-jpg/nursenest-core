#!/usr/bin/env npx tsx
/**
 * Prints a short summary of the last placeholder-enforcement audit from merge.
 * Full detail: tools/i18n/reports/placeholder-fallbacks.json (written by merge-marketing-i18n).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { PLACEHOLDER_FALLBACK_REPORT_PATH } from "./merge-marketing-i18n";
import { REPO_ROOT } from "./repo-root";

export type PlaceholderFallbackReport = {
  generatedAt: string;
  totalFallbacks: number;
  byLocale: Record<string, number>;
  events: Array<{
    locale: string;
    key: string;
    localizedValue: string;
    englishValue: string;
    placeholdersInEnglish: string[];
    placeholdersInLocalized: string[];
  }>;
};

type FallbackCategory = "criticalSeoLeakage" | "blockedLocaleCandidate" | "acceptableFallback";

export type PlaceholderFallbackAudit = {
  generatedAt: string;
  sourceReport: string;
  totalFallbacks: number;
  byLocale: Record<string, number>;
  blockedLocaleCandidates: string[];
  categories: Record<
    FallbackCategory,
    {
      count: number;
      events: PlaceholderFallbackReport["events"];
    }
  >;
};

export const PLACEHOLDER_FALLBACK_AUDIT_PATH = path.join(
  REPO_ROOT,
  "tools/i18n/reports/placeholder-fallback-audit.json",
);

function isSeoSensitiveKey(key: string): boolean {
  return /(^|\.)(hub|public|marketing)(\.|$)/i.test(key);
}

function isLearnerCriticalKey(key: string): boolean {
  return /^(learner\.practiceTests\.|examFirst\.|hub\.)/i.test(key);
}

function classifyFallbackEvent(event: PlaceholderFallbackReport["events"][number]): FallbackCategory {
  if (isSeoSensitiveKey(event.key)) return "criticalSeoLeakage";
  if (isLearnerCriticalKey(event.key)) return "blockedLocaleCandidate";
  return "acceptableFallback";
}

export function buildPlaceholderFallbackAudit(report: PlaceholderFallbackReport): PlaceholderFallbackAudit {
  const categories: PlaceholderFallbackAudit["categories"] = {
    criticalSeoLeakage: { count: 0, events: [] },
    blockedLocaleCandidate: { count: 0, events: [] },
    acceptableFallback: { count: 0, events: [] },
  };
  for (const event of report.events) {
    const category = classifyFallbackEvent(event);
    categories[category].events.push(event);
    categories[category].count += 1;
  }

  const blockedLocaleCandidates = [
    ...new Set(categories.blockedLocaleCandidate.events.map((event) => event.locale)),
  ].sort();

  return {
    generatedAt: new Date().toISOString(),
    sourceReport: path.relative(REPO_ROOT, PLACEHOLDER_FALLBACK_REPORT_PATH),
    totalFallbacks: report.totalFallbacks,
    byLocale: report.byLocale,
    blockedLocaleCandidates,
    categories,
  };
}

export function shouldFailPlaceholderFallbackThresholds(
  audit: PlaceholderFallbackAudit,
  thresholds: {
    total?: number;
    seo?: number;
  },
): { failed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (thresholds.total !== undefined && audit.totalFallbacks > thresholds.total) {
    reasons.push(
      `totalFallbacks ${audit.totalFallbacks} exceeded NN_I18N_PLACEHOLDER_FAIL_THRESHOLD ${thresholds.total}`,
    );
  }
  if (thresholds.seo !== undefined && audit.categories.criticalSeoLeakage.count > thresholds.seo) {
    reasons.push(
      `criticalSeoLeakage ${audit.categories.criticalSeoLeakage.count} exceeded NN_I18N_PLACEHOLDER_SEO_FAIL_THRESHOLD ${thresholds.seo}`,
    );
  }
  return {
    failed: reasons.length > 0,
    reasons,
  };
}

function parseOptionalThreshold(name: string): number | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`[i18n] ${name} must be a non-negative number`);
  }
  return parsed;
}

function main(): void {
  const verbose = process.argv.includes("--verbose");
  const relFromRepo = path.relative(REPO_ROOT, PLACEHOLDER_FALLBACK_REPORT_PATH);

  if (!existsSync(PLACEHOLDER_FALLBACK_REPORT_PATH)) {
    console.log(`[i18n] placeholder fallbacks: no report file (run npm run i18n:compile) — ${relFromRepo}`);
    process.exit(0);
  }

  const raw = readFileSync(PLACEHOLDER_FALLBACK_REPORT_PATH, "utf8");
  const r = JSON.parse(raw) as PlaceholderFallbackReport;
  const audit = buildPlaceholderFallbackAudit(r);
  mkdirSync(path.dirname(PLACEHOLDER_FALLBACK_AUDIT_PATH), { recursive: true });
  writeFileSync(PLACEHOLDER_FALLBACK_AUDIT_PATH, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  const auditRel = path.relative(REPO_ROOT, PLACEHOLDER_FALLBACK_AUDIT_PATH);

  if (r.totalFallbacks === 0) {
    console.log(`[i18n] placeholder fallbacks: 0 — ${relFromRepo}; audit=${auditRel}`);
    return;
  }

  const locales = Object.keys(r.byLocale)
    .sort()
    .map((loc) => `${loc}=${r.byLocale[loc]}`)
    .join(", ");
  console.log(
    `[i18n] placeholder fallbacks: ${r.totalFallbacks} (${locales}) — ${relFromRepo} @ ${r.generatedAt}; audit=${auditRel} criticalSeo=${audit.categories.criticalSeoLeakage.count} blockedLocaleCandidates=${audit.blockedLocaleCandidates.length}`,
  );

  if (verbose) {
    const cap = 50;
    for (let i = 0; i < Math.min(cap, r.events.length); i++) {
      const e = r.events[i];
      console.log(
        `  ${e.locale}\t${e.key}\ten:[${e.placeholdersInEnglish.join(", ")}]\tloc:[${e.placeholdersInLocalized.join(", ")}]`,
      );
    }
    if (r.events.length > cap) {
      console.log(`  … ${r.events.length - cap} more rows in JSON`);
    }
  }

  const thresholdResult = shouldFailPlaceholderFallbackThresholds(audit, {
    total: parseOptionalThreshold("NN_I18N_PLACEHOLDER_FAIL_THRESHOLD"),
    seo: parseOptionalThreshold("NN_I18N_PLACEHOLDER_SEO_FAIL_THRESHOLD"),
  });
  if (thresholdResult.failed) {
    for (const reason of thresholdResult.reasons) {
      console.error(`[i18n] placeholder threshold failed: ${reason}`);
    }
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

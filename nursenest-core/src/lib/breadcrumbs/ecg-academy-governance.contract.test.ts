import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { pageOwnsBreadcrumbSchema } from "@/lib/breadcrumbs/schema-ownership";
import { shouldEmitMarketingLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/layout-fallback-policy";

const MARKETING_DEFAULT = join(process.cwd(), "src/app/(marketing)/(default)");

const ECG_PREFIXES = [
  "/ecg",
  "/advanced-ecg-nursing",
  "/ecg-interpretation",
  "/ecg-telemetry-mastery",
  "/ecg-practice-questions",
  "/pals-rhythms",
  "/acls-rhythms",
  "/telemetry-nursing",
  "/pediatric-ecg",
];

function walkPages(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkPages(p, acc);
    else if (name === "page.tsx") acc.push(p);
  }
  return acc;
}

function isEcgAcademyPage(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  return (
    normalized.includes("/ecg") ||
    normalized.includes("advanced-ecg-nursing") ||
    normalized.includes("ecg-interpretation") ||
    normalized.includes("ecg-telemetry") ||
    normalized.includes("ecg-practice-questions") ||
    normalized.includes("pals-rhythms") ||
    normalized.includes("acls-rhythms") ||
    normalized.includes("telemetry-nursing") ||
    normalized.includes("pediatric-ecg")
  );
}

test("ECG academy routes own breadcrumb schema and suppress layout fallback", () => {
  for (const prefix of ECG_PREFIXES) {
    assert.equal(pageOwnsBreadcrumbSchema(prefix), true, prefix);
    assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback(prefix), false, prefix);
  }
});

test("ECG marketing page.tsx files use AcademyBreadcrumbBar without inline BreadcrumbList", () => {
  const pages = walkPages(MARKETING_DEFAULT).filter(isEcgAcademyPage);
  assert.ok(pages.length >= 5, "expected ECG academy pages");
  for (const page of pages) {
    const src = readFileSync(page, "utf8");
    assert.ok(
      src.includes("AcademyBreadcrumbBar"),
      `${page} must use AcademyBreadcrumbBar`,
    );
    assert.equal(
      src.includes('"@type": "BreadcrumbList"'),
      false,
      `${page} must not embed inline BreadcrumbList`,
    );
  }
});

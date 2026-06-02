/**
 * E2E-style contract: ≤1 BreadcrumbList per indexable page source; learner routes emit none.
 */
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { shouldEmitMarketingLayoutBreadcrumbFallback as layoutFallback } from "@/lib/breadcrumbs/layout-fallback-policy";
import { pageOwnsBreadcrumbSchema } from "@/lib/breadcrumbs/schema-ownership";
import { auditPageStructuredDataEmissions } from "@/lib/breadcrumbs/structured-data-governance";

const MARKETING_DEFAULT = join(process.cwd(), "src/app/(marketing)/(default)");
const LEARNER_APP = join(process.cwd(), "src/app/(app)/app/(learner)");

function walkPages(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkPages(p, acc);
    else if (name === "page.tsx") acc.push(p);
  }
  return acc;
}

function countBreadcrumbListInSource(src: string): number {
  return (src.match(/@type"\s*:\s*"BreadcrumbList"/g) ?? []).length;
}

function countNestedGraphBreadcrumbList(src: string): number {
  return (src.match(/@graph"[\s\S]*?BreadcrumbList/g) ?? []).length;
}

function isLearnerPage(path: string): boolean {
  return path.includes("(app)/app/(learner)");
}

function isEcgOrAcademyPage(path: string): boolean {
  const n = path.replace(/\\/g, "/");
  return (
    n.includes("/ecg") ||
    n.includes("advanced-ecg-nursing") ||
    n.includes("ecg-interpretation") ||
    n.includes("labs-interpretation") ||
    n.includes("clinical-modules") ||
    n.includes("clinical-interpretation") ||
    n.includes("nursing-glossary")
  );
}

test("learner app pages emit zero inline BreadcrumbList", () => {
  const pages = walkPages(LEARNER_APP);
  assert.ok(pages.length >= 10);
  for (const page of pages) {
    const src = readFileSync(page, "utf8");
    assert.equal(
      countBreadcrumbListInSource(src),
      0,
      `${page} must not embed BreadcrumbList JSON-LD`,
    );
  }
});

test("ECG and academy pages use AcademyBreadcrumbBar without inline BreadcrumbList", () => {
  const pages = walkPages(MARKETING_DEFAULT).filter(isEcgOrAcademyPage);
  assert.ok(pages.length >= 5);
  for (const page of pages) {
    const src = readFileSync(page, "utf8");
    if (src.includes("AcademyBreadcrumbBar") || src.includes("BreadcrumbsFromResolution")) {
      assert.equal(
        countBreadcrumbListInSource(src),
        0,
        `${page} must not inline BreadcrumbList when using governed components`,
      );
      assert.equal(
        countNestedGraphBreadcrumbList(src),
        0,
        `${page} must not nest BreadcrumbList inside @graph`,
      );
    }
  }
});

test("page-owned marketing routes suppress layout breadcrumb fallback", () => {
  const owned = [
    "/ecg",
    "/advanced-ecg-nursing",
    "/clinical-interpretation",
    "/nursing-glossary",
    "/canada/rn/nclex-rn/lessons",
  ];
  for (const path of owned) {
    assert.equal(pageOwnsBreadcrumbSchema(path), true, path);
    assert.equal(layoutFallback(path), false, path);
  }
});

test("learner routes forbid BreadcrumbList schema ownership", () => {
  assert.equal(pageOwnsBreadcrumbSchema("/app/labs"), false);
  const issues = auditPageStructuredDataEmissions("/app/labs", { BreadcrumbList: true }, false);
  assert.ok(issues.some((i) => i.code === "forbidden_schema"));
});

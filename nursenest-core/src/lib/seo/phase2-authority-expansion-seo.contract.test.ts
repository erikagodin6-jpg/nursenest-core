import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { listAuthorityComparisonPages, listAuthorityComparisonPaths } from "@/lib/seo/authority-comparison-pages";
import { listAuthorityClusterPages, listAuthorityClusterPaths } from "@/lib/seo/authority-cluster-pages";
import { listAuthorityResourcePages, listAuthorityResourcePaths } from "@/lib/seo/authority-resource-pages";

const MONEY_PAGE_PATHS = [
  "/canada/np/cnple/practice-questions",
  "/canada/np/cnple/case-based-questions",
  "/canada/np/cnple/pharmacology-questions",
  "/canada/np/cnple/study-plan",
  "/canada/np/cnple/exam-format",
  "/canada/np/cnple/soap-note-scenarios",
  "/canada/pn/rex-pn/practice-questions",
  "/canada/pn/rex-pn/delegation-questions",
  "/canada/pn/rex-pn/priority-questions",
  "/canada/pn/rex-pn/pharmacology-questions",
  "/canada/pn/rex-pn/study-plan",
  "/canada/pn/rex-pn/cat-simulation",
  "/allied-health/respiratory-therapy/abg-practice-questions",
  "/allied-health/respiratory-therapy/mechanical-ventilation-questions",
  "/allied-health/respiratory-therapy/oxygen-therapy-questions",
  "/allied-health/respiratory-therapy/ventilator-modes",
  "/allied-health/respiratory-therapy/ards-review",
  "/allied-health/respiratory-therapy/airway-management-scenarios",
] as const;

const COMPARISON_PATHS = [
  "/compare/cnple-vs-nclex",
  "/compare/rex-pn-vs-nclex-pn",
  "/compare/nursenest-vs-uworld",
  "/compare/nursenest-vs-archer",
  "/compare/best-rex-pn-question-banks",
  "/compare/best-cnple-prep-resources",
] as const;

const RESOURCE_PATHS = [
  "/resources/cnple-study-checklist",
  "/resources/rex-pn-study-plan",
  "/resources/abg-interpretation-cheat-sheet",
  "/resources/ventilator-modes-quick-reference",
  "/resources/ecg-interpretation-quick-guide",
  "/resources/pharmacology-mnemonic-sheet",
] as const;

test("phase 2 money pages are registry backed and indexable", () => {
  const paths = new Set(listAuthorityClusterPaths());
  for (const pagePath of MONEY_PAGE_PATHS) {
    assert.ok(paths.has(pagePath), `missing money page ${pagePath}`);
  }
  for (const page of listAuthorityClusterPages().filter((candidate) => MONEY_PAGE_PATHS.includes(candidate.path as (typeof MONEY_PAGE_PATHS)[number]))) {
    assert.ok(page.faq.length >= 8, `${page.path} should include expanded PAA/FAQ coverage`);
    assert.ok(page.ctas.length >= 4, `${page.path} should include conversion CTAs`);
    assert.ok(page.table.rows.length >= 3, `${page.path} should include a useful table`);
    assert.ok(page.title.includes("NurseNest"), `${page.path} should include branded title`);
  }
});

test("comparison pages have balanced metadata, tables, FAQs, and authority links", () => {
  assert.deepEqual(listAuthorityComparisonPaths().sort(), [...COMPARISON_PATHS].sort());
  for (const page of listAuthorityComparisonPages()) {
    assert.ok(page.title.includes("NurseNest"), `${page.path} should include NurseNest title`);
    assert.ok(page.description.length >= 120, `${page.path} should have useful meta description`);
    assert.ok(page.comparison.rows.length >= 3, `${page.path} should have comparison rows`);
    assert.ok(page.balancedNotes.length >= 3, `${page.path} should avoid deceptive claims`);
    assert.ok(page.internalLinks.length >= 3, `${page.path} should link into authority hubs`);
    assert.ok(page.faq.length >= 3, `${page.path} should include FAQ schema data`);
  }
});

test("downloadable resource pages have print-friendly data and authority links", () => {
  assert.deepEqual(listAuthorityResourcePaths().sort(), [...RESOURCE_PATHS].sort());
  for (const page of listAuthorityResourcePages()) {
    assert.ok(page.title.includes("NurseNest"), `${page.path} should include NurseNest title`);
    assert.ok(page.sections.length >= 2, `${page.path} should not be a thin asset shell`);
    assert.ok(page.table.rows.length >= 3, `${page.path} should include a crawlable visual table`);
    assert.ok(page.internalLinks.length >= 3, `${page.path} should link back to money pages`);
    assert.ok(page.faq.length >= 2, `${page.path} should include visible FAQ content`);
  }
});

test("phase 2 sitemap route includes clusters, comparisons, and resources", () => {
  const src = fs.readFileSync(path.join(process.cwd(), "src/app/sitemap-authority-clusters.xml/route.ts"), "utf8");
  assert.match(src, /listAuthorityClusterPaths/);
  assert.match(src, /listAuthorityComparisonPaths/);
  assert.match(src, /listAuthorityResourcePaths/);
});

test("authority renderer links assets, comparisons, and visual authority panels", () => {
  const src = fs.readFileSync(path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"), "utf8");
  assert.match(src, /Related study system/);
  assert.match(src, /listAuthorityResourcePages/);
  assert.match(src, /listAuthorityComparisonPages/);
  assert.match(src, /Quick clinical reference/);
});

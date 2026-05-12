import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";
import {
  listAuthorityClusterPages,
  listAuthorityClusterPaths,
  listAuthorityClusterSiblings,
} from "@/lib/seo/authority-cluster-pages";
import { buildSitemapIndexXmlForOrigin } from "@/lib/seo/sitemap-index-children";

const REQUIRED_PATHS = [
  "/canada/np/cnple",
  "/canada/np/cnple/questions",
  "/canada/np/cnple/study-guide",
  "/canada/np/cnple/case-based-questions",
  "/canada/np/cnple/provisional-registration",
  "/canada/np/cnple/loft-exam",
  "/canada/np/cnple/pharmacology",
  "/canada/np/cnple/clinical-judgment",
  "/canada/rpn/rex-pn",
  "/canada/rpn/rex-pn/questions",
  "/canada/rpn/rex-pn/study-guide",
  "/canada/rpn/rex-pn/cat",
  "/canada/rpn/rex-pn/pharmacology",
  "/canada/rpn/rex-pn/client-needs",
  "/canada/rpn/rex-pn/practice-exam",
  "/canada/rpn/rex-pn/test-plan",
  "/allied-health/respiratory-therapy",
  "/allied-health/respiratory-therapy/exam-prep",
  "/allied-health/respiratory-therapy/practice-questions",
  "/allied-health/respiratory-therapy/abgs",
  "/allied-health/respiratory-therapy/mechanical-ventilation",
  "/allied-health/respiratory-therapy/oxygen-therapy",
  "/allied-health/respiratory-therapy/airway-management",
  "/allied-health/respiratory-therapy/pulmonary-function-testing",
] as const;

function wordCount(page: ReturnType<typeof listAuthorityClusterPages>[number]): number {
  const text = [
    page.title,
    page.description,
    page.h1,
    page.lead,
    ...page.sections.flatMap((section) => [section.heading, ...section.body]),
    ...page.mistakes,
    ...page.examDay,
    ...page.faq.flatMap((item) => [item.question, item.answer]),
    ...page.table.rows.flat(),
  ].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

test("authority cluster registry covers every requested route with unique SEO fields", () => {
  const pages = listAuthorityClusterPages();
  const paths = listAuthorityClusterPaths();
  assert.deepEqual([...paths].sort(), [...REQUIRED_PATHS].sort());
  assert.equal(new Set(paths).size, REQUIRED_PATHS.length, "authority cluster paths must be unique");
  assert.equal(new Set(pages.map((page) => page.title)).size, pages.length, "title tags must be unique");
  assert.equal(new Set(pages.map((page) => page.description)).size, pages.length, "meta descriptions must be unique");
  assert.equal(new Set(pages.map((page) => page.h1)).size, pages.length, "H1s must be unique");

  for (const page of pages) {
    assert.ok(page.title.includes("NurseNest"), `${page.path} title should include NurseNest`);
    assert.ok(page.description.length >= 140 && page.description.length <= 220, `${page.path} meta description length`);
    assert.ok(page.faq.length >= 4, `${page.path} should have visible FAQ data`);
    assert.ok(page.ctas.length >= 4, `${page.path} should have study CTAs`);
    assert.ok(page.table.rows.length >= 3, `${page.path} should have a useful comparison table`);
    assert.ok(wordCount(page) >= 500, `${page.path} content should not be thin`);
    assert.ok(listAuthorityClusterSiblings(page).length >= 7, `${page.path} should internally link to sibling pages`);
  }
});

test("authority cluster sitemap is referenced by the sitemap index", () => {
  const xml = buildSitemapIndexXmlForOrigin(CANONICAL_PRODUCTION_ORIGIN);
  assert.match(xml, /https:\/\/www\.nursenest\.ca\/sitemap-authority-clusters\.xml/);
});

test("authority cluster renderer emits required SEO structured-data components", () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), "src/components/seo/authority-cluster-page.tsx"),
    "utf8",
  );
  assert.match(src, /<WebPageJsonLd\b/);
  assert.match(src, /<BreadcrumbJsonLd\b/);
  assert.match(src, /<FaqJsonLd\b/);
  assert.match(src, /listAuthorityClusterSiblings/);
});

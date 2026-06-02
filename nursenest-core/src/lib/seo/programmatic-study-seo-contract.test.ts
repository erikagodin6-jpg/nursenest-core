import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { marketingProgrammaticStudySeoPath } from "@/lib/lessons/lesson-routes";
import {
  getProgrammaticStudySeoRegistry,
  MAX_PROGRAMMATIC_STUDY_SEO_SITEMAP_URLS,
  programmaticStudySeoRegistryKey,
} from "@/lib/seo/programmatic-study-seo-registry";

test("programmatic study SEO registry has unique pathway+lesson keys and fits sitemap cap", () => {
  const rows = getProgrammaticStudySeoRegistry();
  assert.ok(rows.length > 0);
  assert.ok(rows.length <= MAX_PROGRAMMATIC_STUDY_SEO_SITEMAP_URLS);
  const keys = new Set<string>();
  for (const r of rows) {
    const k = programmaticStudySeoRegistryKey(r);
    assert.ok(!keys.has(k), `duplicate registry key: ${k}`);
    keys.add(k);
  }
});

test("marketingProgrammaticStudySeoPath matches exam hub segment shape", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  const p = marketingProgrammaticStudySeoPath(pathway, "ace-inhibitors-nclex-rn");
  assert.equal(p, "/us/rn/nclex-rn/study/ace-inhibitors-nclex-rn");
});

test("marketingProgrammaticStudySeoPath returns null for empty slug", () => {
  const pathway = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(pathway);
  assert.equal(marketingProgrammaticStudySeoPath(pathway, "   "), null);
});

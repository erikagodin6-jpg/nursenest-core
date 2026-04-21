import assert from "node:assert/strict";
import test from "node:test";
import { PROGRAMMATIC_SLUG_TO_PATHWAY_PATH } from "@/lib/exam-pathways/programmatic-slug-redirects";
import { getAllProgrammaticSlugs } from "@/lib/seo/programmatic-registry-slugs";

test("no programmatic slug redirects to a single exam hub (multi-audience slugs stay on /{slug})", () => {
  assert.equal(Object.keys(PROGRAMMATIC_SLUG_TO_PATHWAY_PATH).length, 0);
});

test("shared PN and RN practice slugs are not redirected away from SEO pages", () => {
  const slugs = new Set(getAllProgrammaticSlugs());
  for (const slug of ["rex-pn-practice-questions", "rex-pn-exam-prep", "nclex-rn-practice-questions", "np-exam-practice-questions"]) {
    assert.ok(slugs.has(slug), `${slug} remains a programmatic page`);
    assert.ok(!(slug in PROGRAMMATIC_SLUG_TO_PATHWAY_PATH));
  }
});

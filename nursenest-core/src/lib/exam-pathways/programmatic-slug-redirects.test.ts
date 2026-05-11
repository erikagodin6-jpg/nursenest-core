import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLegacyProgrammaticSeoRedirectsToPathwayHubs,
  LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT,
} from "@/lib/marketing/canonical-pathway-hubs";
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

test("shared NP discovery slugs are never treated as active legacy hub redirects", () => {
  const redirects = new Map(buildLegacyProgrammaticSeoRedirectsToPathwayHubs(["fr"]).map((entry) => [entry.sourcePath, entry.targetPath]));
  for (const slug of [
    "np-exam-practice-questions",
    "np-exam-prep",
    "np-clinical-cases",
    "cnple-practice-questions",
    "canada-np-exam-prep",
    "np-study-guide-canada",
  ]) {
    assert.equal(LEGACY_PROGRAMMATIC_SLUGS_WITH_HUB_REDIRECT.has(slug), false, slug);
    assert.equal(redirects.has(`/${slug}`), false, slug);
    assert.equal(redirects.has(`/fr/${slug}`), false, `fr/${slug}`);
  }
});

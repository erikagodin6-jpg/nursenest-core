import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";
import { getPathwayProgrammaticSeoLanding } from "@/lib/seo/pathway-programmatic-seo";

function expectLanding(pathway: ExamPathwayDefinition, expectedSlug: string) {
  const page = getProgrammaticSeoPage(expectedSlug);
  assert.ok(page, `registry has slug ${expectedSlug}`);
  const land = getPathwayProgrammaticSeoLanding(pathway);
  assert.ok(land);
  assert.equal(land.path, `/${expectedSlug}`);
  assert.equal(land.label, page.h1);
}

test("Canada RN → nclex-rn-practice-questions label matches h1", () => {
  const p = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(p);
  expectLanding(p, "nclex-rn-practice-questions");
});

test("US RN → nclex-rn-practice-questions label matches h1", () => {
  const p = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(p);
  expectLanding(p, "nclex-rn-practice-questions");
});

test("Canada PN (REx-PN) → rex-pn-practice-questions label matches h1", () => {
  const p = getExamPathwayById("ca-rpn-rex-pn");
  assert.ok(p);
  expectLanding(p, "rex-pn-practice-questions");
});

test("US PN (NCLEX-PN) → rex-pn-practice-questions label matches h1", () => {
  const p = getExamPathwayById("us-lpn-nclex-pn");
  assert.ok(p);
  expectLanding(p, "rex-pn-practice-questions");
});

test("US NP FNP → np-exam-practice-questions label matches h1", () => {
  const p = getExamPathwayById("us-np-fnp");
  assert.ok(p);
  expectLanding(p, "np-exam-practice-questions");
});

test("US NP AGPCNP shares NP programmatic umbrella slug", () => {
  const p = getExamPathwayById("us-np-agpcnp");
  assert.ok(p);
  expectLanding(p, "np-exam-practice-questions");
});

test("Canada CNPLE → np-exam-practice-questions label matches h1", () => {
  const p = getExamPathwayById("ca-np-cnple");
  assert.ok(p);
  expectLanding(p, "np-exam-practice-questions");
});

test("Canada allied → allied-health-career-guides label matches h1", () => {
  const p = getExamPathwayById("ca-allied-core");
  assert.ok(p);
  expectLanding(p, "allied-health-career-guides");
});

test("US allied → allied-health-career-guides label matches h1", () => {
  const p = getExamPathwayById("us-allied-core");
  assert.ok(p);
  expectLanding(p, "allied-health-career-guides");
});

test("unmapped pathway id returns null", () => {
  const p = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(p);
  const synthetic: ExamPathwayDefinition = { ...p, id: "__no_such_pathway__" };
  assert.equal(getPathwayProgrammaticSeoLanding(synthetic), null);
});

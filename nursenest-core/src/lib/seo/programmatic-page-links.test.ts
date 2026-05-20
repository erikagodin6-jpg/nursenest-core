import assert from "node:assert/strict";
import test from "node:test";
import { getProgrammaticSeoPage } from "@/lib/seo/programmatic-registry";
import { resolveProgrammaticProductLinks } from "@/lib/seo/programmatic-page-links";

test("generic US NP programmatic pages route core CTAs through specialty-neutral discovery hubs", async () => {
  const page = await getProgrammaticSeoPage("np-exam-prep");
  assert.ok(page);
  const links = resolveProgrammaticProductLinks(page, "en", "US");
  assert.equal(links.lessons, "/np-exam-prep");
  assert.equal(links.questions, "/np-exam-practice-questions");
  assert.equal(links.cat, "/np-clinical-cases");
});

test("generic Canada NP programmatic pages route core CTAs through Canadian discovery hubs", async () => {
  const page = await getProgrammaticSeoPage("canada-np-exam-prep");
  assert.ok(page);
  const links = resolveProgrammaticProductLinks(page, "en", "CA");
  assert.equal(links.lessons, "/canada-np-exam-prep");
  assert.equal(links.questions, "/cnple-practice-questions");
  assert.equal(links.cat, "/canada-np-exam-prep");
});

test("generic NP link-pack pages no longer default the public marketing shell to FNP", async () => {
  const page = await getProgrammaticSeoPage("np-clinical-cases");
  assert.ok(page);
  const us = resolveProgrammaticProductLinks(page, "en", "US");
  const ca = resolveProgrammaticProductLinks(page, "en", "CA");
  assert.equal(us.lessons, "/np-exam-prep");
  assert.equal(ca.lessons, "/canada-np-exam-prep");
});

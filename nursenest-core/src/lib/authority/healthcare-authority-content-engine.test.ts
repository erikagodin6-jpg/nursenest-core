import assert from "node:assert/strict";
import test from "node:test";
import {
  AUTHORITY_CATEGORY_META,
  buildAuthorityJsonLd,
  getAuthorityPage,
  getAuthorityPages,
  searchAuthorityContent,
  validateAuthorityPage,
} from "@/lib/authority/healthcare-authority-content-engine";

test("authority content engine exposes every required library category", () => {
  assert.deepEqual(Object.keys(AUTHORITY_CATEGORY_META).sort(), [
    "care-plans",
    "clinical-skills",
    "conditions",
    "labs",
    "medications",
  ]);
});

test("authority pages include EEAT governance and pass the quality gate", () => {
  const pages = getAuthorityPages();
  assert.ok(pages.length >= 5);

  for (const page of pages) {
    assert.ok(page.reviewer.name);
    assert.ok(page.reviewer.credentials);
    assert.ok(page.governance.updatedAt);
    assert.ok(page.governance.reviewCycleDue);
    assert.ok(page.references.length >= 2);
    assert.ok(page.related.length >= 3);

    const quality = validateAuthorityPage(page);
    assert.equal(quality.publishReady, true, `${page.slug}: ${quality.issues.join(", ")}`);
    assert.ok(quality.score >= 85);
  }
});

test("authority search supports synonyms and medical shorthand", () => {
  assert.equal(searchAuthorityContent("CHF")[0]?.slug, "heart-failure");
  assert.equal(searchAuthorityContent("Lasix")[0]?.slug, "furosemide");
  assert.equal(searchAuthorityContent("K+")[0]?.slug, "potassium");
});

test("authority detail pages can emit MedicalWebPage and FAQ schema", () => {
  const page = getAuthorityPage("conditions", "heart-failure");
  assert.ok(page);

  const graph = buildAuthorityJsonLd(page);
  assert.equal(graph[0]["@type"], "MedicalWebPage");
  assert.equal(graph[1]["@type"], "FAQPage");
  assert.match(JSON.stringify(graph), /Heart Failure/);
  assert.match(JSON.stringify(graph), /NurseNest/);
});

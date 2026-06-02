import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateSeo } from "@/lib/seo/seo-generator";
import { SeoTaxonomyMismatchError } from "@/lib/seo/seo-taxonomy-align";

describe("generateSeo", () => {
  it("builds aligned clinical SEO for cardiovascular", () => {
    const r = generateSeo({
      title: "Heart failure pathophysiology",
      category: "cardiovascular",
      domain: "CLINICAL",
      tier: "RN",
      keywords: ["heart failure"],
    });
    assert.ok(r.slug.length >= 3);
    assert.ok(r.metaTitle.length >= 55 && r.metaTitle.length <= 65);
    assert.ok(r.metaDescription.length >= 140 && r.metaDescription.length <= 155);
    assert.ok(r.h1.toLowerCase() !== r.metaTitle.toLowerCase());
    assert.equal(r.breadcrumb[0], "Home");
    assert.ok(r.breadcrumb.length >= 5);
    assert.ok(r.faq.length >= 3);
  });

  it("throws when domain does not match taxonomy category", () => {
    assert.throws(
      () =>
        generateSeo({
          title: "Delegation in nursing",
          category: "delegation_supervision",
          domain: "CLINICAL",
          tier: "RN",
        }),
      (e) => e instanceof SeoTaxonomyMismatchError,
    );
  });
});

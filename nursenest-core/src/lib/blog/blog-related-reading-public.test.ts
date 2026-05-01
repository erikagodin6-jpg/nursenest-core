import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterRelatedBlogReadingForParentExam } from "@/lib/blog/blog-related-reading-public";

describe("filterRelatedBlogReadingForParentExam", () => {
  it("drops REx-PN flavored slugs for NCLEX-RN parent exam", () => {
    const out = filterRelatedBlogReadingForParentExam("NCLEX-RN", [
      { slug: "nclex-rn-study-tips", title: "RN tips", excerpt: "x" },
      { slug: "rex-pn-pharmacology-traps", title: "PN traps", excerpt: "y" },
    ]);
    assert.equal(out.length, 1);
    assert.equal(out[0]?.slug, "nclex-rn-study-tips");
  });

  it("keeps MLT posts from linking paramedic slugs in related titles", () => {
    const out = filterRelatedBlogReadingForParentExam("MLT", [
      { slug: "cbc-panel-qc-basics-mlt", title: "CBC QC for MLT students", excerpt: "lab" },
      { slug: "paramedic-airway-drill", title: "Paramedic airway drill", excerpt: "ems" },
    ]);
    assert.equal(out.length, 1);
    assert.ok(out[0]?.slug.includes("mlt"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostTemplate } from "@prisma/client";
import { normalizeBlogControlPanelGenerateRequestBody } from "@/lib/blog/blog-admin-control-panel-generate-body";

describe("normalizeBlogControlPanelGenerateRequestBody", () => {
  it("joins string[] topic and exam", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({
      topic: ["a", "b"],
      exam: ["nclex"],
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.data.topic, "a, b");
    assert.equal(r.data.exam, "nclex");
  });

  it("coerces number/boolean to string for topic", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({ topic: 42, exam: true });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.data.topic, "42");
    assert.equal(r.data.exam, "true");
  });

  it("rejects object for topic", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({ topic: { x: 1 }, exam: "nclex" });
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.equal(r.code, "FIELD_TYPE");
    assert.equal(r.path, "topic");
  });

  it("defaults template, tone, country when missing or invalid", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({
      topic: "Fluid balance for exams",
      exam: "NCLEX",
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.data.template, BlogPostTemplate.TOPIC_EXPLAINED);
    assert.equal(r.data.tone, "professional");
    assert.equal(r.data.country, "unspecified");
  });

  it("normalizes invalid template string to default", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({
      topic: "Enough length here",
      exam: "NCLEX",
      template: "not_a_real_template",
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.data.template, BlogPostTemplate.TOPIC_EXPLAINED);
  });

  it("returns INVALID_SLUG for unusable fixedSlug", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({
      topic: "Enough length here for topic xx",
      exam: "NCLEX",
      fixedSlug: "###",
    });
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.equal(r.code, "INVALID_SLUG");
  });

  it("normalizes fixedSlug to kebab-case", () => {
    const r = normalizeBlogControlPanelGenerateRequestBody({
      topic: "Enough length here for topic xx",
      exam: "NCLEX",
      fixedSlug: "  Hello World  ",
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.data.fixedSlug, "hello-world");
  });
});

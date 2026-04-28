import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BLOG_BODY_REPAIR_WORD_BUFFER,
  classifyBlogPipelineFailureForRepair,
  formatBlogBatchItemFailureMessage,
  MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS,
  parseBlogBatchItemRepairMeta,
} from "@/lib/blog/blog-generation-repair-classifier";

describe("blog-generation-repair-classifier", () => {
  it("classifies short body as recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "Article body too short after generation (1168 words; minimum 1200).",
    });
    assert.equal(r.recoverable, true);
  });

  it("classifies long-form enforcement as recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "body",
      error: "body_outline_mismatch: 1 planned H2(s) missing",
      code: "BODY_LONGFORM_ENFORCEMENT",
    });
    assert.equal(r.recoverable, true);
  });

  it("classifies SEO duplicate as recoverable", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "persist",
      error: 'H1/title is too similar (>=85%) to existing post "foo".',
      code: "SEO_DUPLICATE_BLOCKED",
    });
    assert.equal(r.recoverable, true);
  });

  it("classifies insufficient citations as terminal", () => {
    const r = classifyBlogPipelineFailureForRepair({
      stage: "citations",
      error: "Citations required",
      code: "INSUFFICIENT_CITATIONS",
    });
    assert.equal(r.recoverable, false);
    assert.equal(r.terminalReason, "citations");
  });

  it("round-trips batch failure message for admin parsing", () => {
    const raw = formatBlogBatchItemFailureMessage({
      originalError: "too short",
      repairAttempts: 3,
      terminal: true,
    });
    const parsed = parseBlogBatchItemRepairMeta(raw);
    assert.equal(parsed.repairAttempts, 3);
    assert.equal(parsed.terminal, true);
    assert.equal(parsed.message, "too short");
  });

  it("exposes repair constants", () => {
    assert.equal(MAX_BLOG_ARTICLE_REPAIR_ATTEMPTS, 3);
    assert.ok(BLOG_BODY_REPAIR_WORD_BUFFER >= 100);
  });
});

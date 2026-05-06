import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import {
  classifyBlogRowForRecoveryAudit,
  recoveryAuditSlugValid,
  RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
} from "./blog-recovery-audit";
import type { PrePublishValidationResult } from "./blog-pre-publish-validation";

const now = new Date("2026-05-01T12:00:00Z");

function okPre(): PrePublishValidationResult {
  return {
    issues: [],
    blocking: [],
    warnings: [],
    okToPublish: true,
    hasWarnings: false,
  };
}

function baseRow(over: Partial<Parameters<typeof classifyBlogRowForRecoveryAudit>[0]["row"]> = {}) {
  const body = `<p>${Array.from({ length: 950 }, () => "word").join(" ")}</p>`;
  return {
    id: "id1",
    slug: "sample-recovery-slug",
    title: "Sample title for recovery audit",
    excerpt: "Excerpt with enough substance for marketing surfaces.",
    body,
    postStatus: BlogPostStatus.PUBLISHED,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    publishAt: null,
    scheduledAt: null,
    seoTitle: "SEO title",
    seoDescription: "Meta description with enough words for recovery audit classification path.",
    category: "cardiovascular",
    legacySource: null,
    ...over,
  };
}

describe("blog-recovery-audit", () => {
  it("recoveryAuditSlugValid rejects invalid slug", () => {
    assert.equal(recoveryAuditSlugValid("Bad_Slug"), false);
    assert.equal(recoveryAuditSlugValid("good-slug-here"), true);
  });

  it("classifies LIVE when blogPostIsLive passes", () => {
    const r = classifyBlogRowForRecoveryAudit({
      row: baseRow(),
      duplicateSlug: false,
      prePublish: okPre(),
      now,
      minWordFloor: RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
    });
    assert.equal(r.bucket, "LIVE");
  });

  it("READY when pre-publish ok but workflow blocks public live", () => {
    const r = classifyBlogRowForRecoveryAudit({
      row: baseRow({
        workflowStatus: BlogWorkflowStatus.GENERATED,
      }),
      duplicateSlug: false,
      prePublish: okPre(),
      now,
      minWordFloor: RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
    });
    assert.equal(r.bucket, "READY_TO_PUBLISH");
  });

  it("BLOCKED on duplicate slug", () => {
    const r = classifyBlogRowForRecoveryAudit({
      row: baseRow({
        workflowStatus: BlogWorkflowStatus.GENERATED,
      }),
      duplicateSlug: true,
      prePublish: okPre(),
      now,
      minWordFloor: RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
    });
    assert.equal(r.bucket, "BLOCKED");
  });

  it("NEEDS_REVIEW when below min words", () => {
    const r = classifyBlogRowForRecoveryAudit({
      row: baseRow({
        workflowStatus: BlogWorkflowStatus.GENERATED,
        body: "<p>short</p>",
      }),
      duplicateSlug: false,
      prePublish: okPre(),
      now,
      minWordFloor: RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
    });
    assert.equal(r.bucket, "NEEDS_REVIEW");
  });

  it("NEEDS_REVIEW when pre-publish blocks", () => {
    const badPre: PrePublishValidationResult = {
      issues: [{ id: "slug", severity: "block", message: "m", fix: "f" }],
      blocking: [{ id: "slug", severity: "block", message: "m", fix: "f" }],
      warnings: [],
      okToPublish: false,
      hasWarnings: false,
    };
    const r = classifyBlogRowForRecoveryAudit({
      row: baseRow({ workflowStatus: BlogWorkflowStatus.GENERATED }),
      duplicateSlug: false,
      prePublish: badPre,
      now,
      minWordFloor: RECOVERY_AUDIT_DEFAULT_MIN_WORDS,
    });
    assert.equal(r.bucket, "NEEDS_REVIEW");
  });
});

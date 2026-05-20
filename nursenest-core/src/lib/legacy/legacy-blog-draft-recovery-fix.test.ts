import assert from "node:assert/strict";
import test from "node:test";

import { BlogImageStatus, BlogPostStatus, CountryCode } from "@prisma/client";

import type { BlogPostPrePublishPayload } from "@/lib/blog/blog-pre-publish-validation";
import { buildBlogRecoveryAutoFix } from "@/lib/legacy/legacy-blog-draft-recovery-fix";

function longBody(words: number): string {
  return `<p>${Array.from({ length: words }, (_, i) => `w${i}`).join(" ")}</p>`;
}

function minimalRow(overrides: Partial<BlogPostPrePublishPayload> = {}): BlogPostPrePublishPayload {
  const slug = "recovery-fix-test-slug";
  const body = longBody(350);
  return {
    id: "recovery_fix_test_id",
    slug,
    title: "Test title for recovery SEO autofill",
    excerpt: "Short",
    body,
    exam: "NCLEX-RN",
    category: "Clinical",
    tags: ["nclex"],
    seoTitle: null,
    seoDescription: null,
    metaTitleVariant: null,
    metaDescriptionVariant: null,
    requiresReferences: false,
    apaReferences: [],
    sourcesJson: [],
    internalLinkPlan: {},
    outlineJson: {},
    faqBlock: {},
    schemaSummary: null,
    coverImage: null,
    coverImageAlt: null,
    coverImageCaption: null,
    coverImagePrompt: null,
    imageStatus: BlogImageStatus.NONE,
    countryTarget: CountryCode.CA,
    postStatus: BlogPostStatus.DRAFT,
    postTemplate: "TOPIC_EXPLAINED",
    targetKeyword: null,
    medicalRiskFlags: [],
    ...overrides,
  } as BlogPostPrePublishPayload;
}

test("auto-fix fills seo title and meta description when missing", () => {
  const row = minimalRow({ seoTitle: null, seoDescription: null });
  const { mergedForValidation } = buildBlogRecoveryAutoFix(row, { overwriteBlogBody: false });
  assert.ok((mergedForValidation.seoTitle ?? "").trim().length >= 3);
  assert.ok((mergedForValidation.seoDescription ?? "").trim().length >= 50);
});

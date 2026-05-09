import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus } from "@prisma/client";
import { mergeBlogIndexRows, staticRecordToBlogIndexMergeRow } from "./blog-public-merge";

test("mergeBlogIndexRows: CMS slug wins; static duplicate dropped before merge", () => {
  const cms = [
    {
      slug: "shared",
      title: "CMS",
      excerpt: "e",
      category: null,
      createdAt: new Date("2025-01-01T12:00:00Z"),
      updatedAt: new Date("2026-01-02T12:00:00Z"),
      publishAt: null,
      postStatus: BlogPostStatus.PUBLISHED,
    },
    {
      slug: "older",
      title: "Old",
      excerpt: "e",
      category: null,
      createdAt: new Date("2024-06-01T12:00:00Z"),
      updatedAt: new Date("2024-06-01T12:00:00Z"),
      publishAt: null,
      postStatus: BlogPostStatus.PUBLISHED,
    },
  ];
  const staticOnly = [
    staticRecordToBlogIndexMergeRow({
      slug: "static-only",
      title: "S",
      excerpt: "e",
      category: "C",
      createdAt: "2026-05-01",
      tags: [],
      bodyHtml: "<p>x</p>",
    }),
  ];
  const merged = mergeBlogIndexRows(cms, staticOnly);
  assert.equal(merged[0].slug, "static-only");
  assert.equal(merged[1].slug, "shared");
  assert.equal(merged[2].slug, "older");
});

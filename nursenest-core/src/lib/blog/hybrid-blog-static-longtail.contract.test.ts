import assert from "node:assert/strict";
import test from "node:test";
import { BlogPostStatus } from "@prisma/client";

import { mergeBlogIndexRows } from "@/lib/blog/blog-public-merge";
import {
  allSupplementSlugsForOverlapQuery,
  buildSupplementBlogIndexRowsExcludingLiveSlugs,
  supplementBlogIndexMergeRowsForCategory,
  supplementBlogIndexMergeRowsForTag,
} from "@/lib/blog/blog-static-supplement";
import { listBlogStaticLongtailRecords } from "@/lib/blog/blog-static-longtail-load";
import { mergeBlogSitemapRowsDbPrimary, staticBlogSitemapSlugRows } from "@/lib/blog/safe-blog-queries";

test("long-tail folder loads repo-backed slugs (unique + batch1 slugs present)", () => {
  const slugs = listBlogStaticLongtailRecords()
    .map((r) => r.slug.trim())
    .filter(Boolean);
  assert.equal(new Set(slugs).size, slugs.length, "long-tail slugs must be unique");
  assert.ok(slugs.includes("hyperkalemia-ecg-changes-nursing-students"));
  assert.ok(slugs.includes("hypokalemia-pathophysiology-nursing-priorities"));
});

test("mergeBlogIndexRows: DB slug wins over supplement with same slug", () => {
  const db = [
    {
      slug: "dup",
      title: "DB",
      excerpt: "e",
      category: "c",
      createdAt: new Date("2026-01-01T12:00:00Z"),
      updatedAt: new Date("2026-01-02T12:00:00Z"),
      publishAt: null,
      postStatus: BlogPostStatus.PUBLISHED,
    },
  ];
  const sup = [
    {
      slug: "dup",
      title: "STATIC",
      excerpt: "e2",
      category: "c",
      createdAt: new Date("2020-01-01T12:00:00Z"),
      updatedAt: new Date("2020-01-01T12:00:00Z"),
      publishAt: null,
      postStatus: BlogPostStatus.PUBLISHED,
    },
  ];
  const merged = mergeBlogIndexRows(db, sup);
  assert.equal(merged.filter((r) => r.slug === "dup").length, 1);
  assert.equal(merged.find((r) => r.slug === "dup")?.title, "DB");
});

test("buildSupplement excludes slugs that overlap live CMS set", () => {
  /** First entry in `src/content/blog-static-posts.ts` bundled corpus (stable slug). */
  const knownBundledSlug = "clinical-judgment-on-exam-day";
  const overlap = new Set([knownBundledSlug]);
  const rows = buildSupplementBlogIndexRowsExcludingLiveSlugs(overlap);
  assert.ok(!rows.some((r) => r.slug.trim() === knownBundledSlug));
});

test("overlap slug list includes long-tail slugs for bounded IN queries", () => {
  const slugs = allSupplementSlugsForOverlapQuery();
  const lt = listBlogStaticLongtailRecords().map((r) => r.slug.trim());
  for (const s of lt) {
    assert.ok(slugs.includes(s), `expected long-tail slug in overlap union: ${s}`);
  }
});

test("staticBlogSitemapSlugRows includes each long-tail slug once", () => {
  const rows = staticBlogSitemapSlugRows();
  const lt = listBlogStaticLongtailRecords().map((r) => r.slug.trim());
  for (const s of lt) {
    const hits = rows.filter((r) => r.slug.trim() === s);
    assert.equal(hits.length, 1, `expected exactly one sitemap row for long-tail slug: ${s}`);
  }
});

test("mergeBlogSitemapRowsDbPrimary: DB slug wins; extra supplement slugs appended", () => {
  const dbUpdated = new Date("2026-02-01T12:00:00Z");
  const db = [{ slug: "dup", careerSlug: null, updatedAt: dbUpdated }];
  const sup = [
    { slug: "dup", careerSlug: null, updatedAt: new Date("2020-01-01T12:00:00Z") },
    { slug: "only-supplement", careerSlug: null, updatedAt: new Date("2021-06-01T12:00:00Z") },
  ];
  const merged = mergeBlogSitemapRowsDbPrimary(db, sup);
  assert.equal(merged.length, 2);
  const dup = merged.find((r) => r.slug === "dup");
  assert.ok(dup);
  assert.equal(dup!.updatedAt.getTime(), dbUpdated.getTime());
  assert.ok(merged.some((r) => r.slug === "only-supplement"));
});

test("tag supplement merge includes long-tail slug when tag matches", () => {
  const rows = supplementBlogIndexMergeRowsForTag("potassium", new Set());
  assert.ok(
    rows.some((r) => r.slug === "why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams"),
    "expected potassium long-tail in tag supplement rows",
  );
});

test("category supplement merge includes long-tail slug when category matches", () => {
  const rows = supplementBlogIndexMergeRowsForCategory("Pathophysiology", new Set());
  assert.ok(
    rows.some((r) => r.slug === "why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams"),
    "expected AKI potassium long-tail in Pathophysiology supplement rows",
  );
});

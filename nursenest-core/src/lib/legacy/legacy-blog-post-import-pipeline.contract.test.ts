/**
 * Legacy blog import: merge rules, dry-run vs apply, slug vs title-hash matching, patho/pharm classification.
 */
import assert from "node:assert/strict";
import test from "node:test";

import type { PrismaClient } from "@prisma/client";
import { BlogPostStatus, BlogPostTemplate } from "@prisma/client";

import type { LegacyBlogPostExportV1 } from "@/lib/legacy/legacy-blog-post-export-types";
import {
  legacyBlogPostTitleHash,
  mergePostStatusForUpdate,
  pickBlogBodyForImport,
} from "@/lib/legacy/legacy-blog-post-import-merge";
import {
  buildMergedBlogPostPreview,
  importLegacyBlogPosts,
} from "@/lib/legacy/legacy-blog-post-import-pipeline";

const richBody = `<p>${"word ".repeat(120)}</p>`;
const legacyBody = "<p>Legacy replacement body</p>";

test("pickBlogBodyForImport keeps rich existing body unless overwrite flag", () => {
  assert.equal(
    pickBlogBodyForImport({
      existingBody: richBody,
      legacyBody,
      legacyImportOverwriteBody: false,
    }),
    richBody,
  );
  assert.equal(
    pickBlogBodyForImport({
      existingBody: richBody,
      legacyBody,
      legacyImportOverwriteBody: true,
    }),
    legacyBody,
  );
});

test("pickBlogBodyForImport uses legacy when existing body is thin", () => {
  assert.equal(
    pickBlogBodyForImport({
      existingBody: "<p>short</p>",
      legacyBody,
      legacyImportOverwriteBody: false,
    }),
    legacyBody,
  );
});

test("mergePostStatusForUpdate publishes legacy live posts unless row is NEEDS_REVIEW", () => {
  const pub = mergePostStatusForUpdate({
    existingStatus: BlogPostStatus.DRAFT,
    existingPublishAt: null,
    legacyStatus: "published",
    legacyPublishAtRaw: "2020-01-15T12:00:00.000Z",
  });
  assert.equal(pub.postStatus, BlogPostStatus.PUBLISHED);
  assert.equal(pub.publishAt?.toISOString(), "2020-01-15T12:00:00.000Z");

  const blocked = mergePostStatusForUpdate({
    existingStatus: BlogPostStatus.NEEDS_REVIEW,
    existingPublishAt: null,
    legacyStatus: "published",
    legacyPublishAtRaw: "2020-01-15T12:00:00.000Z",
  });
  assert.equal(blocked.postStatus, BlogPostStatus.NEEDS_REVIEW);
});

test("buildMergedBlogPostPreview applies patho/pharm template and tags when clinical signal present", () => {
  const preview = buildMergedBlogPostPreview({
    legacy: {
      legacyId: "1",
      title: "Sepsis overview",
      slug: "sepsis-overview",
      body: "<p>Discuss pathophysiology and nursing assessment for sepsis.</p>",
      excerpt: "",
      category: "General",
      tags: [],
      template: "TOPIC_EXPLAINED",
      legacySource: "export",
      legacyUrl: null,
      status: "draft",
      publishAt: null,
    },
    existing: null,
    legacyImportOverwriteBody: false,
  });
  assert.equal(preview.postTemplate, BlogPostTemplate.DISEASE_PROCESS_EXPLAINER);
  assert.ok(preview.category?.includes("Patho") || preview.category?.toLowerCase().includes("patho"));
  assert.ok(preview.tags.some((t) => /pathophys/i.test(t)));
});

test("importLegacyBlogPosts dry-run performs no prisma writes", async () => {
  let updates = 0;
  let creates = 0;
  const prisma = {
    blogPost: {
      findMany: async () => [
        {
          id: "db-1",
          slug: "alpha-post",
          title: "Alpha",
          excerpt: "e",
          body: richBody,
          category: null,
          tags: [],
          postTemplate: null,
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          legacySource: null,
          legacyUrl: null,
        },
      ],
      update: async () => {
        updates += 1;
        return {};
      },
      create: async () => {
        creates += 1;
        return { id: "x" };
      },
    },
  } as unknown as PrismaClient;

  const doc: LegacyBlogPostExportV1 = {
    version: 1,
    blogPosts: [
      {
        legacyId: "L1",
        title: "Alpha",
        slug: "different-slug",
        body: legacyBody,
        excerpt: "ex",
        category: "Cat",
        tags: ["nursing"],
        template: null,
        legacySource: "legacy",
        legacyUrl: "https://old.example/a",
        status: "published",
        publishAt: "2021-06-01T00:00:00.000Z",
      },
    ],
  };

  const summary = await importLegacyBlogPosts(prisma, doc, {
    apply: false,
    legacyImportOverwriteBody: false,
  });
  assert.equal(updates, 0);
  assert.equal(creates, 0);
  assert.equal(summary.wouldUpdate, 1);
  assert.equal(summary.wouldCreate, 0);
});

test("slug match wins over title-hash collision", async () => {
  const calls: Array<{ op: "update" | "create"; slug?: string; id?: string }> = [];
  const prisma = {
    blogPost: {
      findMany: async () => [
        {
          id: "by-slug",
          slug: "correct-slug",
          title: "Other title",
          excerpt: "e",
          body: "<p>thin</p>",
          category: null,
          tags: [],
          postTemplate: null,
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          legacySource: null,
          legacyUrl: null,
        },
        {
          id: "by-title",
          slug: "other-slug",
          title: "Same Title",
          excerpt: "e",
          body: "<p>thin2</p>",
          category: null,
          tags: [],
          postTemplate: null,
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          legacySource: null,
          legacyUrl: null,
        },
      ],
      update: async (args: { where: { id: string } }) => {
        calls.push({ op: "update", id: args.where.id });
        return args;
      },
      create: async () => {
        calls.push({ op: "create" });
        return { id: "new" };
      },
    },
  } as unknown as PrismaClient;

  const doc: LegacyBlogPostExportV1 = {
    version: 1,
    blogPosts: [
      {
        legacyId: "L1",
        title: "Same Title",
        slug: "correct-slug",
        body: "<p>new body</p>",
        excerpt: "",
        category: null,
        tags: [],
        template: null,
        legacySource: null,
        legacyUrl: null,
        status: "draft",
        publishAt: null,
      },
    ],
  };

  await importLegacyBlogPosts(prisma, doc, { apply: true, legacyImportOverwriteBody: false });
  assert.deepEqual(calls, [{ op: "update", id: "by-slug" }]);
});

test("title-hash fallback updates when slug differs but title matches", async () => {
  const title = "Unique Title For Hash";
  assert.ok(legacyBlogPostTitleHash(title).length > 0);

  const calls: string[] = [];
  const prisma = {
    blogPost: {
      findMany: async () => [
        {
          id: "row-a",
          slug: "stored-slug",
          title,
          excerpt: "e",
          body: "<p>x</p>",
          category: null,
          tags: [],
          postTemplate: null,
          postStatus: BlogPostStatus.DRAFT,
          publishAt: null,
          scheduledAt: null,
          legacySource: null,
          legacyUrl: null,
        },
      ],
      update: async (args: { where: { id: string } }) => {
        calls.push(args.where.id);
        return args;
      },
      create: async () => {
        calls.push("create");
        return { id: "n" };
      },
    },
  } as unknown as PrismaClient;

  const doc: LegacyBlogPostExportV1 = {
    version: 1,
    blogPosts: [
      {
        legacyId: "L1",
        title,
        slug: "new-export-slug",
        body: "<p>incoming</p>",
        excerpt: "",
        category: null,
        tags: [],
        template: null,
        legacySource: null,
        legacyUrl: null,
        status: "draft",
        publishAt: null,
      },
    ],
  };

  await importLegacyBlogPosts(prisma, doc, { apply: true, legacyImportOverwriteBody: false });
  assert.deepEqual(calls, ["row-a"]);
});

test("APPLY_LEGACY_CONTENT_IMPORT path creates when no match and body present", async () => {
  const prisma = {
    blogPost: {
      findMany: async () => [],
      update: async () => ({}),
      create: async (args: { data: { slug: string } }) => ({
        id: "created",
        slug: args.data.slug,
        title: args.data.title,
        excerpt: args.data.excerpt,
        body: args.data.body,
        category: args.data.category,
        tags: args.data.tags,
        postTemplate: args.data.postTemplate,
        postStatus: args.data.postStatus,
        publishAt: args.data.publishAt,
        scheduledAt: null,
        legacySource: args.data.legacySource,
        legacyUrl: args.data.legacyUrl,
      }),
    },
  } as unknown as PrismaClient;

  const doc: LegacyBlogPostExportV1 = {
    version: 1,
    blogPosts: [
      {
        legacyId: "L-new",
        title: "Fresh",
        slug: "fresh-slug",
        body: "<p>content here</p>",
        excerpt: "",
        category: null,
        tags: [],
        template: null,
        legacySource: null,
        legacyUrl: null,
        status: "published",
        publishAt: "2019-01-01T00:00:00.000Z",
      },
    ],
  };

  const summary = await importLegacyBlogPosts(prisma, doc, { apply: true, legacyImportOverwriteBody: false });
  assert.equal(summary.created, 1);
  assert.equal(summary.updated, 0);
});

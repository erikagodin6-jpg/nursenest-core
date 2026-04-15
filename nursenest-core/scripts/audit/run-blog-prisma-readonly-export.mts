#!/usr/bin/env npx tsx
/**
 * Read-only Prisma export of live/publishable blog rows. No writes.
 * Outputs shapes consumed by `reconcile-blog-live-corpus.mts`.
 *
 *   cd nursenest-core && npx tsx scripts/audit/run-blog-prisma-readonly-export.mts
 *   npx tsx scripts/audit/reconcile-blog-live-corpus.mts
 */
import "../../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LocalizedBlogStatus, Prisma } from "@prisma/client";
import { prisma } from "../../src/lib/db";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..", "..", "..");
const AUDIT_DIR = path.join(REPO_ROOT, "data/audit");

const BATCH = 500;

function localizedLiveWhere(now: Date): Prisma.LocalizedBlogArticleWhereInput {
  return {
    OR: [
      { contentStatus: LocalizedBlogStatus.PUBLISHED },
      {
        AND: [{ contentStatus: LocalizedBlogStatus.SCHEDULED }, { scheduledAt: { lte: now } }],
      },
    ],
  };
}

async function main(): Promise<void> {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  const now = new Date();
  const baseMeta = {
    generatedAt: now.toISOString(),
    readOnly: true,
    /** Aligns with reconcile-blog-live-corpus.mts */
    databaseAvailable: isDatabaseUrlConfigured(),
    databaseUrlConfigured: isDatabaseUrlConfigured(),
    queryFailed: false,
    queryError: null as string | null,
    note: "SELECT-only prisma.blogPost.findMany / prisma.localizedBlogArticle.findMany; no mutations.",
  };

  if (!isDatabaseUrlConfigured()) {
    baseMeta.queryFailed = true;
    baseMeta.queryError = "DATABASE_URL (or PROD_DATABASE_URL in production) not set.";
    fs.writeFileSync(
      path.join(AUDIT_DIR, "blog-published-export.json"),
      JSON.stringify({ ...baseMeta, posts: [], counts: { blogPost: 0 } }, null, 2),
      "utf8",
    );
    fs.writeFileSync(
      path.join(AUDIT_DIR, "blog-localized-export.json"),
      JSON.stringify({ ...baseMeta, articles: [], counts: { localizedBlogArticle: 0 } }, null, 2),
      "utf8",
    );
    console.log(JSON.stringify({ ok: false, ...baseMeta }, null, 2));
    await prisma.$disconnect().catch(() => {});
    return;
  }

  const posts: Array<{
    id: string;
    slug: string;
    title: string;
    locale: string;
    sourceModel: "BlogPost";
    publishedStatus: string;
    bodyLengthEstimate: number;
    bodyPresent: boolean;
    postStatus: string;
    publishAt: string | null;
    scheduledAt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    translationGroupId: string | null;
    canonicalPostId: string | null;
    exam: string | null;
    careerSlug: string | null;
    createdAt: string;
    updatedAt: string;
  }> = [];

  const articles: Array<{
    id: string;
    slug: string;
    title: string;
    locale: string;
    region: string;
    profession: string | null;
    exam: string | null;
    sourceModel: "LocalizedBlogArticle";
    publishedStatus: string;
    bodyLengthEstimate: number;
    bodyPresent: boolean;
    contentStatus: string;
    canonicalArticleId: string;
    canonicalSlug: string;
    createdAt: string;
    updatedAt: string;
  }> = [];

  try {
    let offset = 0;
    for (;;) {
      const page = await prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        take: BATCH,
        skip: offset,
        orderBy: { id: "asc" },
        select: {
          id: true,
          slug: true,
          title: true,
          locale: true,
          body: true,
          postStatus: true,
          publishAt: true,
          scheduledAt: true,
          seoTitle: true,
          seoDescription: true,
          translationGroupId: true,
          canonicalPostId: true,
          exam: true,
          careerSlug: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (page.length === 0) break;
      for (const r of page) {
        const len = r.body?.length ?? 0;
        posts.push({
          id: r.id,
          slug: r.slug,
          title: r.title,
          locale: r.locale,
          sourceModel: "BlogPost",
          publishedStatus: r.postStatus,
          bodyLengthEstimate: len,
          bodyPresent: len > 0,
          postStatus: r.postStatus,
          publishAt: r.publishAt?.toISOString() ?? null,
          scheduledAt: r.scheduledAt?.toISOString() ?? null,
          seoTitle: r.seoTitle ?? null,
          seoDescription: r.seoDescription ?? null,
          translationGroupId: r.translationGroupId ?? null,
          canonicalPostId: r.canonicalPostId ?? null,
          exam: r.exam ?? null,
          careerSlug: r.careerSlug ?? null,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        });
      }
      offset += page.length;
      if (page.length < BATCH) break;
    }

    offset = 0;
    for (;;) {
      const page = await prisma.localizedBlogArticle.findMany({
        where: localizedLiveWhere(now),
        take: BATCH,
        skip: offset,
        orderBy: { id: "asc" },
        select: {
          id: true,
          localizedSlug: true,
          localizedTitle: true,
          locale: true,
          region: true,
          profession: true,
          exam: true,
          localizedBody: true,
          contentStatus: true,
          canonicalArticleId: true,
          canonicalSlug: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (page.length === 0) break;
      for (const r of page) {
        const len = r.localizedBody?.length ?? 0;
        articles.push({
          id: r.id,
          slug: r.localizedSlug,
          title: r.localizedTitle,
          locale: r.locale,
          region: r.region,
          profession: r.profession,
          exam: r.exam,
          sourceModel: "LocalizedBlogArticle",
          publishedStatus: r.contentStatus,
          bodyLengthEstimate: len,
          bodyPresent: len > 0,
          contentStatus: r.contentStatus,
          canonicalArticleId: r.canonicalArticleId,
          canonicalSlug: r.canonicalSlug,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        });
      }
      offset += page.length;
      if (page.length < BATCH) break;
    }
  } catch (e) {
    baseMeta.queryFailed = true;
    baseMeta.queryError = e instanceof Error ? e.message : String(e);
    posts.length = 0;
    articles.length = 0;
  }

  fs.writeFileSync(
    path.join(AUDIT_DIR, "blog-published-export.json"),
    JSON.stringify(
      {
        ...baseMeta,
        counts: { blogPost: posts.length },
        posts: baseMeta.queryFailed ? [] : posts,
      },
      null,
      2,
    ),
    "utf8",
  );
  fs.writeFileSync(
    path.join(AUDIT_DIR, "blog-localized-export.json"),
    JSON.stringify(
      {
        ...baseMeta,
        counts: { localizedBlogArticle: articles.length },
        articles: baseMeta.queryFailed ? [] : articles,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        ok: !baseMeta.queryFailed,
        queryError: baseMeta.queryError,
        blogPostCount: posts.length,
        localizedCount: articles.length,
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect().catch(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

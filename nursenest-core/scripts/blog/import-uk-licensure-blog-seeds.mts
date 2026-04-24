#!/usr/bin/env npx tsx
/**
 * Upserts 50 UK licensure blog posts (English) from `uk-licensure-blog-seed-catalog.ts`.
 *
 * Requires DATABASE_URL. Safe to re-run: upserts by slug.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/import-uk-licensure-blog-seeds.mts
 *   npx tsx scripts/blog/import-uk-licensure-blog-seeds.mts --dry-run
 */
import { BlogPostStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import "../../src/lib/db/script-env-bootstrap";

import {
  UK_LICENSURE_BLOG_TOPICS,
  buildUkBlogBody,
  excerptFromBody,
} from "./uk-licensure-blog-seed-catalog";

const dryRun = process.argv.includes("--dry-run");

const prisma = new PrismaClient();

const TAG_PRIMARY = "uk-nursing";

function tagsFor(topic: (typeof UK_LICENSURE_BLOG_TOPICS)[number]): string[] {
  const base = [TAG_PRIMARY, topic.keyword, topic.angle];
  const uniq = Array.from(new Set(base.filter(Boolean)));
  return uniq;
}

async function main() {
  if (!dryRun && !process.env.DATABASE_URL) {
    console.error("[uk-blog-seed] DATABASE_URL is not set. Export it or use .env before importing.");
    process.exit(1);
  }

  let n = 0;
  for (const topic of UK_LICENSURE_BLOG_TOPICS) {
    const body = buildUkBlogBody(topic);
    const excerpt = excerptFromBody(body);
    const seoDescription = excerpt.slice(0, 160);
    const data = {
      title: topic.title,
      excerpt,
      body,
      tags: tagsFor(topic),
      category: "UK licensure",
      locale: "en",
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: new Date(),
      seoTitle: topic.title,
      seoDescription,
      targetKeyword: topic.keyword,
      legacySource: "uk-licensure-blog-seed",
      exam: null,
    };

    if (dryRun) {
      console.log("[dry-run]", topic.slug, topic.title);
      n += 1;
      continue;
    }

    await prisma.blogPost.upsert({
      where: { slug: topic.slug },
      create: {
        slug: topic.slug,
        ...data,
      },
      update: {
        ...data,
      },
    });
    n += 1;
  }

  console.log(`[uk-blog-seed] ${dryRun ? "would upsert" : "upserted"} ${n} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

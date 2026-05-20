#!/usr/bin/env npx tsx
/**
 * Upserts 200 Philippines NLE context blog posts (English) from `philippines-nle-blog-seed-catalog.ts`.
 *
 * Requires DATABASE_URL for live import. Safe to re-run: upserts by slug.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/import-philippines-nle-blog-seeds.mts
 *   npx tsx scripts/blog/import-philippines-nle-blog-seeds.mts --dry-run
 */
import { BlogPostStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import "../../src/lib/db/script-env-bootstrap";

import {
  PHILIPPINES_NLE_BLOG_TOPICS,
  buildPhilippinesBlogBody,
  excerptFromBody,
} from "./philippines-nle-blog-seed-catalog";

const dryRun = process.argv.includes("--dry-run");

const prisma = new PrismaClient();

const TAG_PRIMARY = "philippines-nle";

function tagsFor(topic: (typeof PHILIPPINES_NLE_BLOG_TOPICS)[number]): string[] {
  const base = [TAG_PRIMARY, topic.keyword, topic.angle, topic.domain];
  const uniq = Array.from(new Set(base.filter(Boolean)));
  return uniq;
}

async function main() {
  if (!dryRun && !process.env.DATABASE_URL) {
    console.error("[ph-nle-blog-seed] DATABASE_URL is not set. Export it or use .env before importing.");
    process.exit(1);
  }

  let n = 0;
  for (const topic of PHILIPPINES_NLE_BLOG_TOPICS) {
    const body = buildPhilippinesBlogBody(topic);
    const excerpt = excerptFromBody(body);
    const seoDescription = excerpt.slice(0, 160);
    const data = {
      title: topic.title,
      excerpt,
      body,
      tags: tagsFor(topic),
      category: "Philippines NLE",
      locale: "en",
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: new Date(),
      seoTitle: topic.title,
      seoDescription,
      targetKeyword: topic.keyword,
      legacySource: "philippines-nle-blog-seed",
      exam: null,
    };

    if (dryRun) {
      console.log("[dry-run]", topic.slug, topic.title.slice(0, 72) + (topic.title.length > 72 ? "…" : ""));
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

  console.log(`[ph-nle-blog-seed] ${dryRun ? "would upsert" : "upserted"} ${n} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

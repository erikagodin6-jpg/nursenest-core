#!/usr/bin/env npx tsx
/**
 * Upserts 500 published pathophysiology blog posts (English, RN / NCLEX-RN framing) for public `/blog`.
 *
 * Requires DATABASE_URL. Safe to re-run: upserts by slug. Use chunked commits to avoid huge transactions.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/import-pathophysiology-nursing-blog-seeds.mts --dry-run
 *   npx tsx scripts/blog/import-pathophysiology-nursing-blog-seeds.mts
 *   npx tsx scripts/blog/import-pathophysiology-nursing-blog-seeds.mts --limit=50
 */
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import "../../src/lib/db/env-bootstrap";
import {
  buildPathophysiologyBlogBody,
  enumeratePathophysiologySeeds,
  excerptFromBody,
} from "./pathophysiology-nursing-blog-seed-catalog";

const dryRun = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Math.max(1, Math.min(2000, parseInt(limitArg.split("=")[1] ?? "500", 10) || 500)) : 500;

const prisma = new PrismaClient();

const TAG_PRIMARY = "pathophysiology";
const CATEGORY = "Pathophysiology";

function tagsFor(topic: ReturnType<typeof enumeratePathophysiologySeeds>[number]): string[] {
  const base = [TAG_PRIMARY, "nursing", "nclex-rn", topic.system, topic.condition].map((s) => s.toLowerCase().trim());
  return Array.from(new Set(base.filter(Boolean)));
}

async function main() {
  if (!dryRun && !process.env.DATABASE_URL) {
    console.error("[pathophysiology-blog-seed] DATABASE_URL is not set.");
    process.exit(1);
  }

  const topics = enumeratePathophysiologySeeds(limit);
  if (topics.length < limit) {
    console.warn(
      `[pathophysiology-blog-seed] catalog produced ${topics.length} topics (requested ${limit}); expand SYSTEMS/CONDITIONS/MECHANISMS.`,
    );
  }

  let n = 0;
  for (const topic of topics) {
    const body = buildPathophysiologyBlogBody(topic);
    const excerpt = excerptFromBody(body);
    const seoDescription = excerpt.slice(0, 160);
    const data = {
      title: topic.title.slice(0, 200),
      excerpt,
      body,
      tags: tagsFor(topic),
      category: CATEGORY,
      locale: "en",
      careerSlug: "rn",
      exam: "NCLEX_RN",
      postStatus: BlogPostStatus.PUBLISHED,
      publishAt: new Date(),
      seoTitle: topic.title.slice(0, 200),
      seoDescription,
      targetKeyword: topic.keyword.slice(0, 200),
      keywordCluster: "pathophysiology-long-tail",
      legacySource: "pathophysiology-nursing-blog-seed",
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
    };

    if (dryRun) {
      console.log("[dry-run]", topic.slug);
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
    if (n % 50 === 0) {
      console.log(`[pathophysiology-blog-seed] upserted ${n}/${topics.length}…`);
    }
  }

  console.log(`[pathophysiology-blog-seed] ${dryRun ? "would upsert" : "upserted"} ${n} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

#!/usr/bin/env npx tsx
import "../../src/lib/db/script-env-bootstrap";

import { BlogPostStatus } from "@prisma/client";
import { prisma } from "../lib/prisma-script-client";

const minArg = process.argv.find((a) => a.startsWith("--min="));
const min = minArg ? Math.max(0, Number(minArg.split("=")[1]) || 0) : 0;
const keywordCluster = "year-long-nursenest-seo-2026-v2";

async function main(): Promise<void> {
  const now = new Date();
  const where = { keywordCluster };
  const total = await prisma.blogPost.count({ where });
  const scheduledFuture = await prisma.blogPost.count({
    where: {
      ...where,
      postStatus: BlogPostStatus.SCHEDULED,
      OR: [{ publishAt: { gt: now } }, { scheduledAt: { gt: now } }],
    },
  });
  const published = await prisma.blogPost.count({ where: { ...where, postStatus: BlogPostStatus.PUBLISHED } });
  const nextPosts = await prisma.blogPost.findMany({
    where,
    select: {
      slug: true,
      title: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
      careerSlug: true,
      exam: true,
      category: true,
    },
    orderBy: [{ publishAt: "asc" }, { scheduledAt: "asc" }],
    take: 15,
  });

  const summary = {
    ok: total >= min,
    keywordCluster,
    minExpected: min,
    total,
    scheduledFuture,
    published,
    nextPosts: nextPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      status: p.postStatus,
      publishAt: p.publishAt?.toISOString() ?? null,
      scheduledAt: p.scheduledAt?.toISOString() ?? null,
      careerSlug: p.careerSlug,
      exam: p.exam,
      category: p.category,
    })),
  };

  console.log(JSON.stringify(summary, null, 2));

  if (total < min) {
    console.error(`[blog:verify-year-seo] Expected at least ${min} rows, found ${total}.`);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });

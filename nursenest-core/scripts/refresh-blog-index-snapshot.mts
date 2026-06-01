#!/usr/bin/env tsx
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import { blogLiveWhere } from "../src/lib/blog/blog-visibility";
import {
  buildSupplementBlogIndexRowsExcludingLiveSlugs,
  allSupplementSlugsForOverlapQuery,
} from "../src/lib/blog/blog-static-supplement";

for (const name of [".env", ".env.local", ".env.production"]) {
  const file = resolve(process.cwd(), name);
  if (!existsSync(file)) continue;
  const parsed = parseDotenv(readFileSync(file, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

const snapshotPath = resolve(
  process.cwd(),
  process.env.BLOG_INDEX_SNAPSHOT_PATH ?? "data/snapshots/blog_index_snapshot.json",
);

const prisma = new PrismaClient();
try {
  const now = new Date();
  const [liveCount, overlapRows] = await Promise.all([
    prisma.blogPost.count({ where: blogLiveWhere(now) }),
    prisma.blogPost.findMany({
      where: {
        ...blogLiveWhere(now),
        slug: { in: allSupplementSlugsForOverlapQuery() },
      },
      select: { slug: true },
    }),
  ]);
  const overlap = new Set(overlapRows.map((row) => row.slug));
  const staticOnly = buildSupplementBlogIndexRowsExcludingLiveSlugs(overlap).length;
  const payload = {
    schema: "blog_index_snapshot.v1",
    generatedAt: now.toISOString(),
    liveCount,
    staticOnly,
    totalPublished: liveCount + staticOnly,
  };
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(payload, null, 2));
} finally {
  await prisma.$disconnect();
}

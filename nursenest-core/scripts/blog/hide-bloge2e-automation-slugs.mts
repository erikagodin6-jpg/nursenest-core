#!/usr/bin/env npx tsx
/**
 * Optional DB cleanup: moves `bloge2e*` slug rows out of editorial “live” paths by setting `DRAFT`.
 *
 * Public `/blog` is already guarded in `src/lib/blog/blog-visibility.ts` (`blogLiveWhere` + slug helpers).
 * Run this only if you want Postgres rows to stop matching internal “live” counts or admin list noise.
 *
 * Requires: `DATABASE_URL`
 *
 *   npx tsx scripts/blog/hide-bloge2e-automation-slugs.mts --dry-run
 *   npx tsx scripts/blog/hide-bloge2e-automation-slugs.mts --write
 */
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { BLOG_PUBLIC_AUTOMATION_SLUG_PREFIX } from "@/lib/blog/blog-visibility";

const dry = !process.argv.includes("--write");

async function main(): Promise<void> {
  const rows = await prisma.blogPost.findMany({
    where: { slug: { startsWith: BLOG_PUBLIC_AUTOMATION_SLUG_PREFIX, mode: "insensitive" } },
    select: { id: true, slug: true, postStatus: true },
    take: 200,
  });
  console.log(`[bloge2e-cleanup] matched ${rows.length} rows (cap 200)`);
  for (const r of rows) console.log(`  - ${r.slug} (${r.postStatus})`);
  if (dry) {
    console.log("[bloge2e-cleanup] dry-run only; pass --write to set DRAFT");
    return;
  }
  const res = await prisma.blogPost.updateMany({
    where: { slug: { startsWith: BLOG_PUBLIC_AUTOMATION_SLUG_PREFIX, mode: "insensitive" } },
    data: { postStatus: BlogPostStatus.DRAFT },
  });
  console.log(`[bloge2e-cleanup] updated ${res.count} rows → DRAFT`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

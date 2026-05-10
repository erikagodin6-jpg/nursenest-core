/**
 * Reports slug collisions between live public BlogPost rows and static + long-tail supplements.
 * Run from package root: `npx tsx scripts/blog/diagnose-blog-slug-collisions.mts`
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { listBlogStaticLongtailRecords } from "../../src/lib/blog/blog-static-longtail-load";
import { listStaticBlogPostsForIndex } from "../../src/lib/blog/static-blog-posts";
import { prisma } from "../../src/lib/db";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const reportPath = join(__dirname, "..", "..", "docs", "reports", "blog-slug-collision-diagnostic.txt");

function section(title: string, lines: string[]): string {
  return [`\n## ${title}`, ...lines.map((l) => (l ? ` - ${l}` : " - (none)"))].join("\n");
}

async function main(): Promise<void> {
  const now = new Date();
  const staticSlugs = listStaticBlogPostsForIndex()
    .map((p) => p.slug.trim())
    .filter(Boolean);
  const longSlugs = listBlogStaticLongtailRecords()
    .map((r) => r.slug.trim())
    .filter(Boolean);
  const staticSet = new Set(staticSlugs);
  const liveRows = await prisma.blogPost.findMany({
    where: blogLiveWhere(now),
    select: { slug: true },
    take: 5000,
  });
  const live = liveRows.map((r) => r.slug.trim()).filter(Boolean);
  const liveSet = new Set(live);

  const dbVsLong = longSlugs.filter((s) => liveSet.has(s));
  const dbVsStatic = staticSlugs.filter((s) => liveSet.has(s));
  const staticVsLong = longSlugs.filter((s) => staticSet.has(s));

  const out: string[] = [];
  out.push("Blog slug collision diagnostic");
  out.push(`Generated: ${now.toISOString()}`);
  out.push(`Live slugs sampled (bounded take=5000): ${live.length}`);
  out.push(`Static corpus: ${staticSlugs.length}, Long-tail: ${longSlugs.length}`);
  out.push(section("DB live vs long-tail (DB should win at runtime)", dbVsLong));
  out.push(section("DB live vs bundled static (DB should win)", dbVsStatic));
  out.push(section("Bundled static vs long-tail (long-tail loader should skip static slugs)", staticVsLong));

  const text = out.join("\n");
  console.log(text);
  try {
    writeFileSync(reportPath, text, "utf8");
    console.log(`\nWrote: ${reportPath}`);
  } catch {
    console.warn("(optional report file not written — docs/reports may be missing)");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

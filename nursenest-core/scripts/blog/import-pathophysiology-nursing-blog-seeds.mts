#!/usr/bin/env npx tsx
/**
 * Upserts 500 published pathophysiology blog posts (English, RN / NCLEX-RN framing) for public `/blog`.
 *
 * Requires DATABASE_URL. Safe to re-run: upserts by slug. Use chunked commits to avoid huge transactions.
 *
 * Usage (from nursenest-core/):
 *   npm run blog:import-pathophysiology-seeds:dry-run
 *   npm run blog:import-pathophysiology-seeds
 *   npx tsx scripts/blog/import-pathophysiology-nursing-blog-seeds.mts --limit=50
 *
 * After import, `/blog` may be cached up to ~1h (see `revalidate` on the blog index route). Optional immediate refresh:
 *   NURSENEST_ORIGIN=https://www.your-domain.com CRON_SECRET=… npm run blog:import-pathophysiology-seeds
 *   (POSTs `/api/cron/blog-publish`, which always revalidates `/blog` even when nothing is promoted.)
 *
 * If the index still looks empty, run: `npm run blog:visibility-diagnostics`
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

  const CHUNK = 20;
  let n = 0;

  for (let i = 0; i < topics.length; i += CHUNK) {
    const slice = topics.slice(i, i + CHUNK);
    if (dryRun) {
      for (const topic of slice) {
        console.log("[dry-run]", topic.slug);
        n += 1;
      }
      continue;
    }

    await prisma.$transaction(
      slice.map((topic) => {
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
        return prisma.blogPost.upsert({
          where: { slug: topic.slug },
          create: { slug: topic.slug, ...data },
          update: { ...data },
        });
      }),
    );
    n += slice.length;
    if (n % 100 === 0 || n === topics.length) {
      console.log(`[pathophysiology-blog-seed] upserted ${n}/${topics.length}…`);
    }
  }

  console.log(`[pathophysiology-blog-seed] ${dryRun ? "would upsert" : "upserted"} ${n} posts.`);
  if (!dryRun) {
    const live = await prisma.blogPost.count({
      where: {
        legacySource: "pathophysiology-nursing-blog-seed",
        postStatus: BlogPostStatus.PUBLISHED,
      },
    });
    console.log(
      `[pathophysiology-blog-seed] DB verification: ${live} rows with legacySource=pathophysiology-nursing-blog-seed and PUBLISHED.`,
    );
    console.log(
      "[pathophysiology-blog-seed] Next: `/blog` ISR cache is ~1h unless you revalidate. Static fallback only applies when the DB has zero live posts — seeded rows are always read from Postgres when live.",
    );
    const origin = process.env.NURSENEST_ORIGIN?.trim().replace(/\/$/, "");
    const cron = process.env.CRON_SECRET?.trim();
    if (origin && cron) {
      try {
        const res = await fetch(`${origin}/api/cron/blog-publish`, {
          method: "POST",
          headers: { Authorization: `Bearer ${cron}` },
        });
        const body = await res.text();
        console.log(
          `[pathophysiology-blog-seed] on-demand revalidate via /api/cron/blog-publish → HTTP ${res.status} ${body.slice(0, 240)}`,
        );
      } catch (e) {
        console.warn("[pathophysiology-blog-seed] on-demand revalidate failed (non-fatal):", e);
      }
    } else {
      console.log(
        "[pathophysiology-blog-seed] Tip: set NURSENEST_ORIGIN + CRON_SECRET on the next run to POST /api/cron/blog-publish and flush `/blog` ISR immediately.",
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

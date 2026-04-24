#!/usr/bin/env npx tsx
/**
 * Ops script: scan marketing-critical blog rows + Canada RN pathway lessons + public flashcard tag inventory.
 *
 * - **Default: dry-run** — prints proposed fixes only.
 * - **Writes:** `APPLY_PUBLIC_CONTENT_INTEGRITY=1` (requires `DATABASE_URL`).
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/fix-public-content-integrity.mts
 *   APPLY_PUBLIC_CONTENT_INTEGRITY=1 npx tsx scripts/fix-public-content-integrity.mts
 */
import { ContentStatus, PrismaClient } from "@prisma/client";

import { blogPostIsLive } from "../src/lib/blog/blog-visibility";
import { PATHOPHYSIOLOGY_SEED_LEGACY_SOURCE } from "../src/lib/blog/safe-blog-queries";
import { ensurePublicBlogPostVisibilityForSeed } from "../src/lib/content/ensure-public-visibility";
import "../src/lib/db/script-env-bootstrap";
import { publicMarketingFlashcardDeckWhere } from "../src/lib/entitlements/content-access-scope";

const CANADA_RN_NCLEX_PATHWAY_ID = "ca-rn-nclex-rn" as const;

const prisma = new PrismaClient();

const apply = process.env.APPLY_PUBLIC_CONTENT_INTEGRITY?.trim() === "1";

type Tallies = { fixed: number; skipped: number; failed: number };

function emptyTallies(): Tallies {
  return { fixed: 0, skipped: 0, failed: 0 };
}

async function repairBlogSeeds(t: Tallies): Promise<void> {
  const rows = await prisma.blogPost.findMany({
    where: {
      OR: [
        { legacySource: PATHOPHYSIOLOGY_SEED_LEGACY_SOURCE },
        { slug: { startsWith: "pp-" } },
        { legacySource: { endsWith: "-blog-seed" } },
      ],
    },
    take: 800,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
      workflowStatus: true,
    },
  });

  for (const row of rows) {
    try {
      const now = new Date();
      if (blogPostIsLive(row, now)) {
        t.skipped += 1;
        continue;
      }
      const next = ensurePublicBlogPostVisibilityForSeed({
        ...row,
        slug: row.slug,
        title: row.title,
      });
      const changed =
        next.slug !== row.slug ||
        next.postStatus !== row.postStatus ||
        (next.publishAt?.getTime() ?? 0) !== (row.publishAt?.getTime() ?? 0) ||
        (next.scheduledAt?.getTime() ?? 0) !== (row.scheduledAt?.getTime() ?? 0) ||
        next.workflowStatus !== row.workflowStatus;
      if (!changed) {
        t.skipped += 1;
        continue;
      }
      if (!apply) {
        console.log(`[dry-run][blog] ${row.slug} -> status=${next.postStatus} publishAt=${next.publishAt.toISOString()}`);
        t.fixed += 1;
        continue;
      }
      await prisma.blogPost.update({
        where: { id: row.id },
        data: {
          slug: next.slug,
          postStatus: next.postStatus,
          publishAt: next.publishAt,
          scheduledAt: next.scheduledAt,
          workflowStatus: next.workflowStatus,
        },
      });
      t.fixed += 1;
    } catch {
      t.failed += 1;
    }
  }
}

/**
 * Backfill: pathway lessons that are structurally complete and already timestamped as published
 * but still carry non-`PUBLISHED` status (import drift).
 */
async function repairCanadaRnLessons(t: Tallies): Promise<void> {
  const rows = await prisma.pathwayLesson.findMany({
    where: {
      pathwayId: CANADA_RN_NCLEX_PATHWAY_ID,
      structuralPublicComplete: true,
      status: { not: ContentStatus.PUBLISHED },
      published_at: { not: null },
    },
    take: 400,
    select: { id: true, slug: true, status: true },
  });
  for (const row of rows) {
    try {
      if (!apply) {
        console.log(`[dry-run][lesson] ${row.slug} status ${row.status} -> PUBLISHED`);
        t.fixed += 1;
        continue;
      }
      await prisma.pathwayLesson.update({
        where: { id: row.id },
        data: { status: ContentStatus.PUBLISHED },
      });
      t.fixed += 1;
    } catch {
      t.failed += 1;
    }
  }
}

async function auditFlashcardTags(t: Tallies): Promise<void> {
  try {
    const deckWhere = publicMarketingFlashcardDeckWhere();
    const n = await prisma.flashcardTag.count({
      where: { decks: { some: { deck: deckWhere } } },
    });
    if (n < 1) {
      console.error(
        "[fix-public-content-integrity] flashcard_tags: zero public tags for marketing decks — run deck/tag seeding or repair relations (not auto-created here).",
      );
      t.failed += 1;
    } else {
      t.skipped += 1;
    }
  } catch {
    t.failed += 1;
  }
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[fix-public-content-integrity] DATABASE_URL is not set.");
    process.exit(1);
  }
  const blog = emptyTallies();
  const lessons = emptyTallies();
  const flash = emptyTallies();

  console.log(`[fix-public-content-integrity] mode=${apply ? "APPLY" : "dry-run"}`);
  await repairBlogSeeds(blog);
  await repairCanadaRnLessons(lessons);
  await auditFlashcardTags(flash);

  console.log(
    JSON.stringify(
      {
        blog,
        lessons,
        flashcard_tags_audit: flash,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

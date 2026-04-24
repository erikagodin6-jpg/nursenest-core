#!/usr/bin/env npx tsx
/**
 * Normalize safe rows to PUBLISHED with a concrete publishAt (SEO / list consistency).
 *
 * Default DRY_RUN=true (no writes). Set DRY_RUN=false to apply.
 *
 * Same SCHEDULED “go live” gate as `blogLiveWhere(now)` in `src/lib/blog/blog-visibility.ts`:
 * `publishAt <= now OR scheduledAt <= now`.
 *
 * Recovers only:
 * - APPROVED
 * - SCHEDULED with publishAt <= now OR scheduledAt <= now
 * - PUBLISHED with publishAt null
 *
 * Never touches: DRAFT, NEEDS_REVIEW (REVIEW_REQUIRED), FAILED.
 *
 *   npm run blog:recover-publishable
 *   DRY_RUN=false npm run blog:recover-publishable
 */
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, type Prisma, PrismaClient } from "@prisma/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env.local") });

import "../../src/lib/db/env-bootstrap";

const prisma = new PrismaClient();

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name]?.trim().toLowerCase();
  if (v === undefined || v === "") return defaultValue;
  if (["1", "true", "yes", "on"].includes(v)) return true;
  if (["0", "false", "no", "off"].includes(v)) return false;
  return defaultValue;
}

function coalescePublishAt(
  publishAt: Date | null,
  scheduledAt: Date | null,
  now: Date,
): Date {
  return publishAt ?? scheduledAt ?? now;
}

/** Full histogram (zeros for missing statuses) — same enum ordering as inventory diagnostics. */
async function countsByPostStatus(): Promise<Record<string, number>> {
  const grouped = await prisma.blogPost.groupBy({
    by: ["postStatus"],
    _count: { _all: true },
  });
  const out: Record<string, number> = {};
  for (const s of Object.values(BlogPostStatus)) {
    out[s] = 0;
  }
  for (const row of grouped) {
    out[row.postStatus] = row._count._all;
  }
  return out;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[recover-all-publishable-blog-posts] DATABASE_URL is not set.");
    process.exit(1);
  }

  const dryRun = envBool("DRY_RUN", true);
  const now = new Date();

  const scheduledLiveOr: Prisma.BlogPostWhereInput["OR"] = [
    { publishAt: { lte: now } },
    { scheduledAt: { lte: now } },
  ];

  const where: Prisma.BlogPostWhereInput = {
    OR: [
      { postStatus: BlogPostStatus.APPROVED },
      {
        postStatus: BlogPostStatus.PUBLISHED,
        publishAt: null,
      },
      {
        postStatus: BlogPostStatus.SCHEDULED,
        OR: scheduledLiveOr,
      },
    ],
  };

  const beforeCountsByPostStatus = await countsByPostStatus();

  const candidates = await prisma.blogPost.findMany({
    where,
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
    },
  });

  const forbidden = new Set<BlogPostStatus>([
    BlogPostStatus.DRAFT,
    BlogPostStatus.NEEDS_REVIEW,
    BlogPostStatus.FAILED,
  ]);
  const safeCandidates = candidates.filter((c) => !forbidden.has(c.postStatus));

  type PlannedRow = {
    id: string;
    slug: string;
    title: string;
    fromStatus: BlogPostStatus;
    fromPublishAt: string | null;
    fromScheduledAt: string | null;
    toStatus: typeof BlogPostStatus.PUBLISHED;
    toPublishAt: string;
  };

  const plannedRows: PlannedRow[] = [];
  const breakdown: Record<string, number> = {};

  for (const row of safeCandidates) {
    const nextPublishAt = coalescePublishAt(row.publishAt, row.scheduledAt, now);
    const becomesPublished = row.postStatus !== BlogPostStatus.PUBLISHED;
    const fillsPublishAt = row.publishAt == null;
    if (!becomesPublished && !fillsPublishAt) continue;

    const key = row.postStatus;
    breakdown[key] = (breakdown[key] ?? 0) + 1;

    plannedRows.push({
      id: row.id,
      slug: row.slug,
      title: row.title.slice(0, 200),
      fromStatus: row.postStatus,
      fromPublishAt: row.publishAt?.toISOString() ?? null,
      fromScheduledAt: row.scheduledAt?.toISOString() ?? null,
      toStatus: BlogPostStatus.PUBLISHED,
      toPublishAt: nextPublishAt.toISOString(),
    });
  }

  const updates: Array<ReturnType<typeof prisma.blogPost.update>> = [];
  if (!dryRun) {
    for (const p of plannedRows) {
      updates.push(
        prisma.blogPost.update({
          where: { id: p.id },
          data: {
            postStatus: BlogPostStatus.PUBLISHED,
            publishAt: new Date(p.toPublishAt),
          },
        }),
      );
    }
    const chunk = 40;
    for (let i = 0; i < updates.length; i += chunk) {
      await prisma.$transaction(updates.slice(i, i + chunk));
    }
  }

  const afterCountsByPostStatus = dryRun ? null : await countsByPostStatus();

  const report = {
    dryRun,
    generatedAt: now.toISOString(),
    beforeCountsByPostStatus,
    plannedUpdateCount: plannedRows.length,
    plannedUpdateBreakdown: breakdown,
    samplePlannedRows: plannedRows.slice(0, 25),
    afterCountsByPostStatus,
  };

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

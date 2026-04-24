#!/usr/bin/env npx tsx
/**
 * Promote control-panel AI drafts to PUBLISHED when they pass the same pre-publish checks as the live generator.
 *
 * Default: dry-run (prints only). With `--apply`, updates rows that pass validation.
 *
 * Criteria (strict):
 * - `postStatus` is DRAFT
 * - `adminPublishLog` contains `draft_created` + message mentioning "control panel" (same seed as control panel pipeline)
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/blog/blog-promote-control-panel-drafts.mts --limit 50
 *   npx tsx scripts/blog/blog-promote-control-panel-drafts.mts --limit 20 --apply
 */
import { BlogPostStatus } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";

import { prisma } from "../../src/lib/db";
import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
} from "../../src/lib/blog/blog-pre-publish-validation";
import { publishBlogPostCanonical } from "../../src/lib/blog/publish-blog-post-canonical";

function isControlPanelAiDraftLog(adminPublishLog: unknown): boolean {
  if (!Array.isArray(adminPublishLog)) return false;
  for (const e of adminPublishLog) {
    if (!e || typeof e !== "object") continue;
    const r = e as Record<string, unknown>;
    if (r.event === "draft_created" && typeof r.message === "string" && r.message.includes("control panel")) {
      return true;
    }
  }
  return false;
}

function parseArgs(argv: string[]): { limit: number; apply: boolean } {
  let limit = 50;
  let apply = false;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--limit" && argv[i + 1]) {
      limit = Math.max(1, Math.min(500, parseInt(argv[i + 1]!, 10) || 50));
      i++;
    } else if (argv[i] === "--apply") {
      apply = true;
    }
  }
  return { limit, apply };
}

async function main(): Promise<void> {
  const { limit, apply } = parseArgs(process.argv);

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  try {
    const candidates = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.DRAFT },
      orderBy: { createdAt: "desc" },
      take: 2000,
      select: { id: true, slug: true, title: true, adminPublishLog: true, postStatus: true },
    });

    const filtered = candidates.filter((c) => isControlPanelAiDraftLog(c.adminPublishLog)).slice(0, limit);

    console.log(
      JSON.stringify(
        {
          mode: apply ? "apply" : "dry-run",
          scannedDrafts: candidates.length,
          candidateCap: limit,
          candidates: filtered.map((c) => ({ id: c.id, slug: c.slug, title: c.title.slice(0, 100) })),
        },
        null,
        2,
      ),
    );

    const results: { id: string; slug: string; action: "would_publish" | "published" | "skipped"; reason?: string }[] = [];

    for (const c of filtered) {
      const row = await prisma.blogPost.findUnique({
        where: { id: c.id },
        select: blogPrePublishValidationSelect,
      });
      if (!row) {
        results.push({ id: c.id, slug: c.slug, action: "skipped", reason: "row_missing" });
        continue;
      }
      const pre = await validateBlogPrePublish(row, c.id);
      if (!pre.okToPublish) {
        results.push({
          id: c.id,
          slug: c.slug,
          action: "skipped",
          reason: `pre_publish: ${pre.blocking.map((b) => b.message).join("; ")}`,
        });
        continue;
      }

      if (!apply) {
        results.push({ id: c.id, slug: c.slug, action: "would_publish" });
        continue;
      }

      const stillDraft = await prisma.blogPost.findUnique({
        where: { id: c.id },
        select: { postStatus: true },
      });
      if (stillDraft?.postStatus !== BlogPostStatus.DRAFT) {
        results.push({ id: c.id, slug: c.slug, action: "skipped", reason: "no_longer_draft" });
        continue;
      }

      const publishedNow = new Date();
      await publishBlogPostCanonical({
        postId: c.id,
        publishAt: publishedNow,
        clearScheduledAt: true,
        context: "script_promote_control_panel_drafts",
        acknowledgePrePublishWarnings: true,
        skipRevalidate: true,
        setLegacySourceIfEmpty: "control_panel_ai",
        extraLogEntries: [
          {
            level: "info",
            event: "published_backfill_script",
            message: "Promoted from DRAFT via blog-promote-control-panel-drafts.mts (canonical publish).",
            detail: { publishAt: publishedNow.toISOString() },
          },
        ],
      });
      results.push({ id: c.id, slug: c.slug, action: "published" });
    }

    console.log(JSON.stringify({ results }, null, 2));
    if (!apply) {
      console.log("\nDry-run only. Re-run with --apply to perform updates.");
    } else if (results.some((r) => r.action === "published")) {
      console.log(
        "\nNote: production /blog may be ISR-cached (e.g. revalidate=3600). After bulk publish, trigger on-demand revalidation or wait for TTL.",
      );
    }
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

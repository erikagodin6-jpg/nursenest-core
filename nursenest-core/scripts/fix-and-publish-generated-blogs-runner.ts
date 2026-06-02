/**
 * Recover BlogPost rows that are not public under {@link blogPostIsLive} / {@link blogLiveWhere},
 * using {@link publishBlogPostCanonical} only (no deletes, no ad-hoc status hacks).
 *
 * Primary cohort: `postStatus=PUBLISHED` but `workflowStatus !== PUBLISHED` (and not failed).
 * Optional: `--include-drafts` for DRAFT rows still in the generator pipeline (strict generated gates).
 */
import "../src/lib/db/script-env-bootstrap";

import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";

import {
  blogPrePublishValidationSelect,
  mergeBlogPostForPrePublishPatch,
  type PrePublishPatch,
  validateBlogPrePublish,
} from "@/lib/blog/blog-pre-publish-validation";
import { BLOG_SLUG_FORMAT_RE, generateBlogSlugBaseFromTitle } from "@/lib/blog/blog-optional-slug";
import { ensureUniqueBlogPostSlugExcluding } from "@/lib/blog/blog-optional-slug.server";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
import { validateGeneratedBlogPublishEligibility } from "@/lib/blog/publish-generated-blog-article";
import { blogPostIsLive } from "@/lib/blog/blog-visibility";
import { prisma } from "@/lib/db";

const WORKFLOW_FAILED: BlogWorkflowStatus[] = [BlogWorkflowStatus.FAILED_GENERATION, BlogWorkflowStatus.FAILED_IMAGE];

const DRAFT_RECOVERY_WORKFLOWS: BlogWorkflowStatus[] = [
  BlogWorkflowStatus.GENERATED,
  BlogWorkflowStatus.OUTLINE_READY,
  BlogWorkflowStatus.NEEDS_SOURCE_REVIEW,
  BlogWorkflowStatus.NEEDS_MEDICAL_REVIEW,
  BlogWorkflowStatus.NEEDS_SEO_REVIEW,
  BlogWorkflowStatus.NEEDS_METADATA,
  BlogWorkflowStatus.NEEDS_REFERENCES,
];

function parseArgs(argv: string[]) {
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1] && !argv[idx + 1].startsWith("--")) return argv[idx + 1];
    return undefined;
  };

  const publish = argv.includes("--publish");
  const dryRun = argv.includes("--dry-run");
  const mutate = publish && !dryRun;
  const acceptWarnings = argv.includes("--accept-warnings");
  const includeDrafts = argv.includes("--include-drafts");
  const strictGeneratedGates = argv.includes("--strict-generated-gates");
  const slugFilter = (get("slug") ?? "").trim();
  const limit = Math.min(500, Math.max(1, Number(get("limit") ?? "100") || 100));

  return { mutate, acceptWarnings, includeDrafts, strictGeneratedGates, slugFilter, limit, dryRun: !mutate };
}

function looksPlaceholderBody(html: string): boolean {
  const t = String(html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length < 24) return true;
  if (/^(lorem ipsum|todo|tbd|placeholder|coming soon)\b/i.test(t)) return true;
  return false;
}

/** Tight heuristic so editorial-stage PUBLISHED rows (e.g. NEEDS_SEO_REVIEW) are not blocked by generated article gates. */
function looksAiOrGeneratedRow(row: { workflowStatus: BlogWorkflowStatus; legacySource: string | null }): boolean {
  const ls = (row.legacySource ?? "").toLowerCase();
  if (ls.includes("control_panel") || ls.includes("generation") || ls.includes("ai")) return true;
  return (
    row.workflowStatus === BlogWorkflowStatus.GENERATED || row.workflowStatus === BlogWorkflowStatus.OUTLINE_READY
  );
}

function buildCandidateWhere(args: { slugFilter: string; includeDrafts: boolean }): Prisma.BlogPostWhereInput {
  const publishedWorkflowMismatch: Prisma.BlogPostWhereInput = {
    AND: [
      { postStatus: BlogPostStatus.PUBLISHED },
      { workflowStatus: { not: BlogWorkflowStatus.PUBLISHED } },
      { workflowStatus: { notIn: WORKFLOW_FAILED } },
    ],
  };

  const parts: Prisma.BlogPostWhereInput[] = [publishedWorkflowMismatch];

  if (args.includeDrafts) {
    parts.push({
      AND: [{ postStatus: BlogPostStatus.DRAFT }, { workflowStatus: { in: DRAFT_RECOVERY_WORKFLOWS } }],
    });
  }

  const orBlock: Prisma.BlogPostWhereInput = parts.length > 1 ? { OR: parts } : publishedWorkflowMismatch;

  if (args.slugFilter) {
    return { AND: [orBlock, { slug: args.slugFilter }] };
  }
  return orBlock;
}

const runnerSelect = {
  ...blogPrePublishValidationSelect,
  workflowStatus: true,
  publishAt: true,
  scheduledAt: true,
  legacySource: true,
} as const;

type RunnerRow = Prisma.BlogPostGetPayload<{ select: typeof runnerSelect }>;

async function buildPrePublishMerge(row: RunnerRow): Promise<{ patch: PrePublishPatch; notes: string[] }> {
  const notes: string[] = [];
  const patch: PrePublishPatch = {};
  const slug = (row.slug ?? "").trim();
  if (!slug || slug.length < 3 || !BLOG_SLUG_FORMAT_RE.test(slug)) {
    const base = generateBlogSlugBaseFromTitle(row.title);
    const next = await ensureUniqueBlogPostSlugExcluding(base, row.id);
    patch.slug = next;
    notes.push(`slug_repaired:${next}`);
  }
  return { patch, notes };
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[fix-and-publish-generated-blogs] DATABASE_URL is not set.");
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  const now = new Date();
  const where = buildCandidateWhere({ slugFilter: args.slugFilter, includeDrafts: args.includeDrafts });

  const raw = await prisma.blogPost.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: Math.min(args.limit * 4, 800),
    select: runnerSelect,
  });

  /** Not already public (idempotent). */
  const candidates = raw.filter(
    (r) =>
      !blogPostIsLive(
        {
          postStatus: r.postStatus,
          publishAt: r.publishAt,
          scheduledAt: r.scheduledAt,
          workflowStatus: r.workflowStatus,
        },
        now,
      ),
  );

  const report: {
    mode: string;
    scanned: number;
    candidatesAfterLiveFilter: number;
    processed: number;
    published: number;
    skipped: number;
    rows: Array<Record<string, unknown>>;
  } = {
    mode: args.mutate ? "publish" : "dry-run",
    scanned: raw.length,
    candidatesAfterLiveFilter: candidates.length,
    processed: 0,
    published: 0,
    skipped: 0,
    rows: [],
  };

  const promotedSlugs: string[] = [];

  for (const row of candidates.slice(0, args.limit)) {
    report.processed++;
    const baseLog = { id: row.id, slug: row.slug, title: row.title.slice(0, 120), postStatus: row.postStatus, workflowStatus: row.workflowStatus };

    if (row.postStatus === BlogPostStatus.PUBLISHED && row.publishAt && row.publishAt.getTime() > now.getTime()) {
      report.skipped++;
      report.rows.push({ ...baseLog, action: "skipped", reason: "future_publish_at" });
      continue;
    }

    const bodyText = String(row.body ?? "").trim();
    if (!bodyText || bodyText.length < 20) {
      report.skipped++;
      report.rows.push({ ...baseLog, action: "skipped", reason: "empty_or_missing_body" });
      continue;
    }

    if (looksPlaceholderBody(row.body)) {
      report.skipped++;
      report.rows.push({ ...baseLog, action: "skipped", reason: "placeholder_body" });
      continue;
    }

    const { patch: slugPatch, notes: slugNotes } = await buildPrePublishMerge(row);
    const merged = mergeBlogPostForPrePublishPatch(row, slugPatch);

    const pre = await validateBlogPrePublish(merged, row.id);
    if (!pre.okToPublish) {
      report.skipped++;
      report.rows.push({
        ...baseLog,
        action: "skipped",
        reason: "pre_publish_blocked",
        blocking: pre.blocking.map((b) => b.message),
      });
      continue;
    }

    if (pre.hasWarnings && !args.acceptWarnings) {
      report.skipped++;
      report.rows.push({
        ...baseLog,
        action: "skipped",
        reason: "pre_publish_warnings_unacknowledged",
        warnings: pre.warnings.map((w) => w.message),
      });
      continue;
    }

    const runGeneratedGate =
      args.strictGeneratedGates ||
      row.postStatus === BlogPostStatus.DRAFT ||
      (row.postStatus === BlogPostStatus.PUBLISHED && looksAiOrGeneratedRow(row));

    if (runGeneratedGate) {
      const elig = await validateGeneratedBlogPublishEligibility(merged, row.id, { skipRevalidate: true });
      if (!elig.ok) {
        report.skipped++;
        report.rows.push({
          ...baseLog,
          action: "skipped",
          reason: "generated_publish_gates_failed",
          gateReasons: elig.reasons.slice(0, 12),
        });
        continue;
      }
    }

    const publishAt = row.publishAt && row.publishAt.getTime() <= now.getTime() ? row.publishAt : now;

    if (!args.mutate) {
      report.rows.push({
        ...baseLog,
        action: "would_publish",
        publishAt: publishAt.toISOString(),
        slugNotes,
      });
      continue;
    }

    try {
      const out = await publishBlogPostCanonical({
        postId: row.id,
        publishAt,
        clearScheduledAt: true,
        context: "recover_generated_blog_script",
        acknowledgePrePublishWarnings: pre.hasWarnings,
        prePublishMerge: Object.keys(slugPatch).length ? slugPatch : undefined,
        skipRevalidate: true,
        extraLogEntries: [
          {
            level: "info",
            event: "recover_generated_blog_script",
            message: `fix-and-publish-generated-blogs-runner.ts (${slugNotes.join(",") || "no_slug_changes"})`,
            detail: { publishAt: publishAt.toISOString(), dryRun: false },
          },
        ],
      });
      promotedSlugs.push(out.slug);
      report.published++;
      console.log(
        "[BLOG_RECOVER_MUTATION]",
        JSON.stringify({ ...baseLog, action: "published", newSlug: out.slug, publishAt: out.publishAt?.toISOString() ?? null }),
      );
      report.rows.push({ ...baseLog, action: "published", newSlug: out.slug, slugNotes });
    } catch (e) {
      report.skipped++;
      report.rows.push({
        ...baseLog,
        action: "error",
        reason: e instanceof Error ? e.message : String(e),
      });
    }
  }

  if (args.mutate && promotedSlugs.length) {
    try {
      revalidateBlogPublishingSurfaces({ promotedSlugs });
    } catch (e) {
      console.log(
        "[BLOG_RECOVER_REVALIDATE_DEFERRED]",
        JSON.stringify({ error: e instanceof Error ? e.message : String(e), promotedCount: promotedSlugs.length }),
      );
    }
  }

  console.log(JSON.stringify(report, null, 2));
  if (!args.mutate) {
    console.log("\nDry-run only. Re-run with `--publish` to apply (omit `--dry-run`).");
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

/**
 * Audit public blog pipeline vs Prisma BlogPost rows, optionally recover hidden "published" rows
 * (same cohort as fix-and-publish-generated-blogs-runner.ts).
 *
 * Run from nursenest-core/: npx tsx scripts/audit-and-publish-blogs-runner.ts --dry-run --limit=20
 */
import "../src/lib/db/script-env-bootstrap";

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";
import { blogLiveWhere, blogPostIsLive } from "@/lib/blog/blog-visibility";
import { prisma } from "@/lib/db";

const LIVE_BLOG_SOURCE_OF_TRUTH = {
  blogIndex: {
    route: "/blog",
    file: "src/app/(marketing)/(default)/blog/page.tsx",
    dataSource: "Prisma model BlogPost via getPublishedBlogPostsPage → blogLiveWhere + buildBlogPublicListWhere",
    filters:
      "postStatus PUBLISHED requires workflowStatus PUBLISHED and publishAt null or <= now; APPROVED (non-failed workflow); SCHEDULED with publishAt|scheduledAt <= now and workflow past pipeline; excludes FAILED_* workflows on timed posts",
  },
  blogDetail: {
    route: "/blog/[slug]",
    file: "src/app/(marketing)/(default)/blog/[slug]/page.tsx",
    dataSource: "getPublishedBlogPostBySlug → blogPostIsLive on resolved row",
    filters: "Same live gate as index; unique slug; body from BlogPost.body",
  },
  sitemap: {
    route: "/sitemap.xml (blog slice)",
    file: "src/lib/seo/sitemap-blog-xml.ts → getSitemapPublishedBlogSlugsStrict",
    dataSource: "Prisma BlogPost where blogLiveWhere(now)",
    filters: "Identical live visibility as index",
  },
} as const;

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
  const limit = Math.min(500, Math.max(1, Number(get("limit") ?? "20") || 20));
  const slug = (get("slug") ?? "").trim();
  if (publish && dryRun) {
    console.error("[audit-and-publish-blogs] Use either --dry-run or --publish, not both.");
    process.exit(2);
  }
  return { publish, dryRun, limit, slug };
}

async function main(): Promise<void> {
  console.log("[LIVE_BLOG_SOURCE_OF_TRUTH]", JSON.stringify(LIVE_BLOG_SOURCE_OF_TRUTH, null, 2));

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[audit-and-publish-blogs] DATABASE_URL is not set.");
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  const now = new Date();

  const [total, byStatus, liveCount, publishedButHidden] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
    prisma.blogPost.count({ where: blogLiveWhere(now) }),
    prisma.blogPost.count({
      where: {
        AND: [
          { postStatus: BlogPostStatus.PUBLISHED },
          { workflowStatus: { not: BlogWorkflowStatus.PUBLISHED } },
          { workflowStatus: { notIn: [BlogWorkflowStatus.FAILED_GENERATION, BlogWorkflowStatus.FAILED_IMAGE] } },
        ],
      },
    }),
  ]);

  const hiddenSample = await prisma.blogPost.findMany({
    where: {
      AND: [
        { postStatus: BlogPostStatus.PUBLISHED },
        { workflowStatus: { not: BlogWorkflowStatus.PUBLISHED } },
        { workflowStatus: { notIn: [BlogWorkflowStatus.FAILED_GENERATION, BlogWorkflowStatus.FAILED_IMAGE] } },
        ...(args.slug ? [{ slug: args.slug }] : []),
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: args.limit,
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      workflowStatus: true,
      publishAt: true,
      legacySource: true,
    },
  });

  console.log(
    "[BLOG_AUDIT_COUNTS]",
    JSON.stringify(
      {
        totalBlogPosts: total,
        liveUnderBlogLiveWhere: liveCount,
        publishedPostStatusButWorkflowNotPublished: publishedButHidden,
        byPostStatus: Object.fromEntries(byStatus.map((r) => [r.postStatus, r._count._all])),
      },
      null,
      2,
    ),
  );

  for (const row of hiddenSample) {
    const live = blogPostIsLive(
      {
        postStatus: row.postStatus,
        publishAt: row.publishAt,
        workflowStatus: row.workflowStatus,
      },
      now,
    );
    const origin = (process.env.PUBLIC_SITE_ORIGIN ?? process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
    const publicUrl = origin ? `${origin}/blog/${encodeURIComponent(row.slug)}` : `/blog/${row.slug}`;
    console.log(
      "[HIDDEN_GENERATED_POST]",
      JSON.stringify({
        id: row.id,
        slug: row.slug,
        title: row.title.slice(0, 120),
        postStatus: row.postStatus,
        workflowStatus: row.workflowStatus,
        blogPostIsLive: live,
        blockerReason: live ? "none" : "published_requires_workflow_published_or_future_publish_at",
        legacySource: row.legacySource,
        publicUrl,
      }),
    );
  }

  if (args.publish) {
    await prisma.$disconnect().catch(() => undefined);
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const fixRunner = path.join(__dirname, "fix-and-publish-generated-blogs-runner.ts");
    const passArgs = ["tsx", fixRunner, "--publish", `--limit=${String(args.limit)}`];
    if (args.slug) passArgs.push(`--slug=${args.slug}`);
    const r = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", passArgs, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
      env: process.env,
    });
    process.exit(r.status ?? 1);
  }
  console.log(
    "\n[audit-and-publish-blogs] Dry run complete. To recover eligible rows via canonical publish, run:\n  node scripts/audit-and-publish-blogs.mjs --publish --limit=" +
      String(args.limit) +
      (args.slug ? ` --slug=${args.slug}` : "") +
      "\n(or from nursenest-core/: npx tsx scripts/fix-and-publish-generated-blogs-runner.ts --publish ...)\n",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });

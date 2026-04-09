import Link from "next/link";
import { BlogPostStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { AdminBlogSchedulerPanel } from "@/components/admin/admin-blog-scheduler-panel";

export const dynamic = "force-dynamic";

export default async function AdminBlogSchedulerPage() {
  await requireAdmin();
  const [
    draftBlogPosts,
    needsReviewBlogPosts,
    approvedBlogPosts,
    publishedBlogPosts,
    scheduledBlogPosts,
    failedBlogPosts,
    nextScheduledBlog,
    blogRows,
  ] = await Promise.all([
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.NEEDS_REVIEW } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.APPROVED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.FAILED } }),
    prisma.blogPost.findFirst({
      where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { not: null } },
      orderBy: { publishAt: "asc" },
      select: { publishAt: true },
    }),
    prisma.blogPost.findMany({
      orderBy: [{ publishAt: "asc" }, { updatedAt: "desc" }],
      take: 120,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        exam: true,
        category: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        workflowStatus: true,
        requiresReferences: true,
        apaReferences: true,
        coverImage: true,
        coverImageAlt: true,
        imageStatus: true,
        postStatus: true,
        publishAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const missingBlogSeoCount = blogRows.filter((p) => !p.seoTitle?.trim() || !p.seoDescription?.trim() || !p.excerpt.trim()).length;
  const missingReferencesCount = blogRows.filter((p) => p.requiresReferences && p.apaReferences.length === 0).length;
  const missingImageAltCount = blogRows.filter((p) => p.coverImage && !p.coverImageAlt?.trim()).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Scheduler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publishing workflow: <code className="rounded bg-muted px-1">promoteScheduledBlogPosts()</code> and cron{" "}
            <code className="rounded bg-muted px-1">/api/cron/blog-publish</code>.
          </p>
        </div>
        <Link href="/admin/blog" className="text-sm font-semibold text-primary underline">
          ← Blog hub
        </Link>
      </div>

      <div className="mt-8">
        <AdminBlogSchedulerPanel
          initialPosts={blogRows.map((p) => ({
            ...p,
            publishAt: p.publishAt ? p.publishAt.toISOString() : null,
            updatedAt: p.updatedAt.toISOString(),
          }))}
          counts={{
            draft: draftBlogPosts,
            needsReview: needsReviewBlogPosts,
            approved: approvedBlogPosts,
            scheduled: scheduledBlogPosts,
            published: publishedBlogPosts,
            failed: failedBlogPosts,
          }}
          nextScheduledAt={nextScheduledBlog?.publishAt ? nextScheduledBlog.publishAt.toISOString() : null}
          missingSeoCount={missingBlogSeoCount}
          missingReferencesCount={missingReferencesCount}
          missingImageAltCount={missingImageAltCount}
        />
      </div>
    </main>
  );
}

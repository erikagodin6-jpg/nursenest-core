import Link from "next/link";
import { BlogCampaignItemStatus, BlogPostStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function statusBadgeClass(status: BlogPostStatus) {
  switch (status) {
    case BlogPostStatus.PUBLISHED:
      return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-100";
    case BlogPostStatus.SCHEDULED:
      return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
    case BlogPostStatus.APPROVED:
      return "bg-sky-500/15 text-sky-950 dark:text-sky-100";
    case BlogPostStatus.NEEDS_REVIEW:
      return "bg-orange-500/15 text-orange-950 dark:text-orange-100";
    case BlogPostStatus.FAILED:
      return "bg-red-500/15 text-red-950 dark:text-red-100";
    default:
      return "bg-muted text-foreground";
  }
}

export default async function AdminBlogHubPage() {
  await requireAdmin();
  const [
    draft,
    needsReview,
    approved,
    scheduled,
    published,
    failedPosts,
    recent,
    next,
    campaignCount,
    queuedItems,
    failedItems,
  ] = await Promise.all([
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.NEEDS_REVIEW } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.APPROVED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.FAILED } }),
    prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: { id: true, slug: true, title: true, postStatus: true, publishAt: true, updatedAt: true },
    }),
    prisma.blogPost.findFirst({
      where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { gte: new Date() } },
      orderBy: { publishAt: "asc" },
      select: { title: true, publishAt: true, slug: true },
    }),
    prisma.blogCampaign.count(),
    prisma.blogCampaignItem.count({ where: { status: { in: [BlogCampaignItemStatus.QUEUED, BlogCampaignItemStatus.GENERATING] } } }),
    prisma.blogCampaignItem.count({ where: { status: BlogCampaignItemStatus.FAILED } }),
  ]);

  const missingSeo = await prisma.blogPost.count({
    where: {
      OR: [{ seoTitle: null }, { seoDescription: null }, { seoTitle: "" }, { seoDescription: "" }],
    },
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Blog operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft → review → approved → scheduled / published. Slugs stay unique; non-public statuses never hit the live blog.
          </p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-border/70 bg-gradient-to-br from-slate-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Drafts</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{draft}</p>
        </div>
        <div className="rounded-xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Needs review</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{needsReview}</p>
        </div>
        <div className="rounded-xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Approved</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{approved}</p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/12 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Scheduled</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{scheduled}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Published</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{published}</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Failed</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{failedPosts}</p>
        </div>
      </section>

      <section className="mt-4">
        <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-5 sm:inline-block sm:min-w-[14rem]">
          <p className="text-xs font-medium uppercase text-muted-foreground">Missing SEO (all posts)</p>
          <p className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">{missingSeo}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/blog/library"
          className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/12 to-sky-500/10 p-6 text-center font-semibold text-primary hover:bg-primary/18"
        >
          Blog library →
        </Link>
        <Link
          href="/admin/blog/control-panel"
          className="rounded-xl border border-primary/35 bg-gradient-to-br from-primary/15 to-emerald-500/10 p-6 text-center font-semibold text-primary hover:bg-primary/20"
        >
          AI control panel →
        </Link>
        <Link
          href="/admin/blog/generate"
          className="rounded-xl border border-primary/30 bg-primary/10 p-6 text-center font-semibold text-primary hover:bg-primary/15"
        >
          Legacy generator →
        </Link>
        <Link
          href="/admin/blog/campaigns"
          className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-6 text-center font-semibold hover:bg-muted/40"
        >
          Campaigns →
        </Link>
        <Link
          href="/admin/blog/scheduler"
          className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-6 text-center font-semibold hover:bg-muted/40"
        >
          Scheduler →
        </Link>
        <Link
          href="/admin/blog/topic-batch"
          className="rounded-xl border border-primary/25 bg-primary/8 p-6 text-center font-semibold text-primary hover:bg-primary/12"
        >
          Topic batch schedule →
        </Link>
        <Link
          href="/admin/seo"
          className="rounded-xl border border-border/80 bg-[var(--theme-card-bg)] p-6 text-center font-semibold hover:bg-muted/40"
        >
          SEO backlog →
        </Link>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Campaigns: {campaignCount} · Queue pending: {queuedItems} · Queue failed: {failedItems}
      </p>

      {next ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Next scheduled: <strong>{next.title}</strong> at {next.publishAt?.toISOString()} ({next.slug})
        </p>
      ) : null}

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Recently updated</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {recent.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 py-2">
              <Link
                href={`/admin/blog/control-panel?id=${encodeURIComponent(p.id)}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {p.title}
              </Link>
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(p.postStatus)}`}>{p.postStatus}</span>
                <span>{p.updatedAt.toISOString().slice(0, 10)}</span>
                <span className="font-mono text-[10px] opacity-80">{p.slug}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

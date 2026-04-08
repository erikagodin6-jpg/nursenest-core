import Link from "next/link";
import { BlogCampaignItemStatus, BlogPostStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBlogHubPage() {
  await requireAdmin();
  const [draft, scheduled, published, recent, next, campaignCount, queuedItems, failedItems] = await Promise.all([
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: { slug: true, title: true, postStatus: true, publishAt: true, updatedAt: true },
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
          <p className="mt-1 text-sm text-muted-foreground">SEO engine: drafts, scheduling, and bulk shells.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-gradient-to-br from-slate-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Drafts</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{draft}</p>
        </div>
        <div className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/12 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Scheduled</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{scheduled}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/12 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Published</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{published}</p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-5">
          <p className="text-xs font-medium uppercase text-muted-foreground">Missing SEO</p>
          <p className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">{missingSeo}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <li key={p.slug} className="flex flex-wrap justify-between gap-2 border-b border-border/40 py-2">
              <span className="font-medium">{p.title}</span>
              <span className="text-xs text-muted-foreground">
                {p.postStatus} · {p.updatedAt.toISOString().slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

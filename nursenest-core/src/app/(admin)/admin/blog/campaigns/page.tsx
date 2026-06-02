import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { AdminBlogCampaignsClient } from "@/components/admin/admin-blog-campaigns-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogCampaignsPage() {
  await requireAdmin();
  const campaigns = await prisma.blogCampaign.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      _count: { select: { items: true, posts: true } },
      items: { select: { status: true }, take: 500 },
    },
  });
  const initialCampaigns = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    keywordCluster: c.keywordCluster,
    desiredPostCount: c.desiredPostCount,
    status: c.status,
    postsPerWeek: c.postsPerWeek,
    startDate: c.startDate ? c.startDate.toISOString() : null,
    counts: c.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {}),
    postsLinked: c._count.posts,
    queueItems: c._count.items,
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">SEO Campaigns</h1>
        </div>
        <Link href="/admin/blog" className="text-sm font-semibold text-primary underline">
          ← Blog hub
        </Link>
      </div>
      <div className="mt-8">
        <AdminBlogCampaignsClient initialCampaigns={initialCampaigns} />
      </div>
    </main>
  );
}

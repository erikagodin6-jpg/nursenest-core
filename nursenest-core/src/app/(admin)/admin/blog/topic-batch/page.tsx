import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { AdminBlogTopicBatchClient } from "@/components/admin/admin-blog-topic-batch-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogTopicBatchPage() {
  await requireAdmin();

  const rows = await prisma.blogBatchSchedule.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
    select: {
      id: true,
      status: true,
      cadencePerDay: true,
      startAt: true,
      nextRunAt: true,
      lastRunAt: true,
      totalItems: true,
      publishedCount: true,
      failedCount: true,
      skippedCount: true,
      exam: true,
      country: true,
      defaultTemplate: true,
      publishMode: true,
      createdAt: true,
    },
  });

  const initialSchedules = rows.map((r) => ({
    ...r,
    startAt: r.startAt.toISOString(),
    nextRunAt: r.nextRunAt?.toISOString() ?? null,
    lastRunAt: r.lastRunAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Topic batch scheduler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste many topics once; staggered slots; AI generation reuses <code className="rounded bg-muted px-1">generateBlogAiDraft</code>{" "}
            and canonical intent dedupe.
          </p>
        </div>
        <Link href="/admin/blog" className="text-sm font-semibold text-primary underline">
          ← Blog hub
        </Link>
      </div>

      <div className="mt-8">
        <AdminBlogTopicBatchClient initialSchedules={initialSchedules} />
      </div>
    </main>
  );
}

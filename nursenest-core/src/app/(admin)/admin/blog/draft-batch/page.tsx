import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogDraftBatchClient } from "@/components/admin/admin-blog-draft-batch-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogDraftBatchPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Batch draft generation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Queue many topics, reuse template / exam / country settings, and process with resilient per-item status. For timed
            publishing cadence, use topic batch schedule instead.
          </p>
        </div>
        <Link href="/admin/blog" className="text-sm font-semibold text-primary underline">
          ← Blog hub
        </Link>
      </div>

      <div className="mt-8">
        <AdminBlogDraftBatchClient />
      </div>
    </main>
  );
}

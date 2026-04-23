import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminContentBulkClient } from "@/components/admin/admin-content-bulk-client";

export const dynamic = "force-dynamic";

export default async function AdminContentBulkPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Bulk content automation</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Queue-safe batch tools for blog SEO, taxonomy, light metadata, publishing flags, sitemap revalidation, and
            question stem-hash backfill. Flashcards and full AI generation batches stay on their dedicated admin pages
            for now.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/automation-logs" className="text-primary underline">
            Automation logs
          </Link>
          <Link href="/admin/blog/studio" className="text-primary underline">
            Article studio
          </Link>
          <Link href="/admin" className="text-primary underline">
            Admin home
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminContentBulkClient />
      </div>
    </main>
  );
}

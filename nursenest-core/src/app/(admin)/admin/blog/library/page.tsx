import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogLibraryClient } from "@/components/admin/blog/admin-blog-library-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogLibraryPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Blog library</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Every post and AI draft in one place — filter by status, pathway, country, or topic; edit, preview, publish, or duplicate.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog" className="text-primary underline">
            ← Blog hub
          </Link>
          <Link href="/admin/blog/control-panel" className="text-primary underline">
            AI control panel
          </Link>
          <Link href="/admin/blog/scheduler" className="text-muted-foreground underline">
            Scheduler
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminBlogLibraryClient />
      </div>
    </main>
  );
}

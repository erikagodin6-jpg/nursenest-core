import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminSeoHubClient } from "@/components/admin/seo/admin-seo-hub-client";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Growth</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">SEO & internal linking</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Operational audits: metadata gaps, slug collisions across blogs and app lessons, internal link strength, broken
            hrefs in recent content, and suggested link opportunities. Use{" "}
            <strong className="text-foreground">Validate URL</strong> to check a path against inventories.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin" className="text-primary underline">
            ← Overview
          </Link>
          <Link href="/admin/blog" className="text-muted-foreground underline">
            Blog library
          </Link>
          <Link href="/admin/lessons" className="text-muted-foreground underline">
            Lessons
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <Suspense
          fallback={<p className="text-sm text-muted-foreground">Loading SEO tools…</p>}
        >
          <AdminSeoHubClient />
        </Suspense>
      </div>
    </main>
  );
}

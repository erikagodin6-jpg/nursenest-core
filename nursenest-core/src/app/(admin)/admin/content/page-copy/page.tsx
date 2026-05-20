import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminPageCopyEditorClient } from "@/components/admin/admin-page-copy-editor-client";

export const dynamic = "force-dynamic";

export default async function AdminPageCopyEditorPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Page copy editor</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Edit allowlisted marketing message keys per locale. Drafts stay private until you publish; published values
            override catalog copy on the live site without redeploying. Revert removes the override row and restores
            defaults.
          </p>
        </div>
        <Link href="/admin/content-coverage" className="text-sm font-semibold text-primary underline">
          ← Content coverage
        </Link>
      </div>

      <div className="mt-8">
        <AdminPageCopyEditorClient />
      </div>
    </main>
  );
}

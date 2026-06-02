import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminQuestionBulkImportClient } from "@/components/admin/admin-question-bulk-import-client";

export const dynamic = "force-dynamic";

export default async function AdminQuestionBulkImportPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Questions</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Bulk JSON import</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Validate structure, deduplicate by stem hash, optionally insert drafts (gated).
          </p>
        </div>
        <Link href="/admin/questions" className="text-sm font-semibold text-primary underline">
          ← Question list
        </Link>
      </div>
      <div className="mt-8">
        <AdminQuestionBulkImportClient />
      </div>
    </main>
  );
}

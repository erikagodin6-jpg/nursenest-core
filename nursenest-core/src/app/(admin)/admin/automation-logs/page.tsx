import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminAutomationLogsClient } from "@/components/admin/admin-automation-logs-client";

export const dynamic = "force-dynamic";

export default async function AdminAutomationLogsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Automation logs</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Blog AI generation, batch queue items, publish gates, reference/citation blocks, and internal link verification.
            Retries are limited to safe paths (failed simple AI drafts with stored payload, failed batch items reset to the
            queue).
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog" className="text-primary underline">
            Blog hub
          </Link>
          <Link href="/admin" className="text-primary underline">
            Admin home
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminAutomationLogsClient />
      </div>
    </main>
  );
}

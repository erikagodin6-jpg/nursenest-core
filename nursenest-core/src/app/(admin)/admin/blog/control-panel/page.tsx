import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogControlPanelClient } from "@/components/admin/admin-blog-control-panel-client";
import type { ContentAutomationLogStatus } from "@prisma/client";
import { getAdminBlogOperationsStatus } from "@/lib/blog/admin-blog-operations-status";

export const dynamic = "force-dynamic";

function formatStatusBadge(status: ContentAutomationLogStatus): string {
  if (status === "SUCCEEDED") return "bg-emerald-500/15 text-emerald-950 dark:text-emerald-100";
  if (status === "FAILED") return "bg-rose-500/15 text-rose-950 dark:text-rose-100";
  if (status === "SKIPPED") return "bg-zinc-500/15 text-zinc-900 dark:text-zinc-100";
  return "bg-amber-500/15 text-amber-950 dark:text-amber-100";
}

function renderActivityRow(
  label: string,
  item: { createdAt: Date; status: ContentAutomationLogStatus; summary: string | null; error: string | null } | null,
) {
  if (!item) {
    return (
      <li className="flex items-center justify-between gap-3 border-b border-border/40 py-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">No data</span>
      </li>
    );
  }
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 py-2 text-sm">
      <span className="font-medium">{label}</span>
      <span className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-semibold ${formatStatusBadge(item.status)}`}>{item.status}</span>
        <span className="text-muted-foreground">{item.createdAt.toISOString()}</span>
        <span className="text-muted-foreground">{item.summary ?? item.error ?? "—"}</span>
      </span>
    </li>
  );
}

export default async function AdminBlogControlPanelPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; preview?: string }>;
}) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const initialPostId = typeof sp.id === "string" && sp.id.length > 0 ? sp.id : null;
  const initialPreviewOpen = sp.preview === "1" || sp.preview === "true";
  const opsStatus = await getAdminBlogOperationsStatus();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">AI generation control panel</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Structured editorial plan plus full HTML draft, saved as a real <code className="rounded bg-muted px-1">DRAFT</code> post.
            Regenerate sections, edit in place, save, then publish when ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog" className="text-primary underline">
            ← Blog hub
          </Link>
          <Link href="/admin/blog/generate" className="text-muted-foreground underline">
            Legacy generator
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <section className="mb-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">Blog operations status</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Canonical posts</p>
              <p className="mt-1 text-2xl font-bold">{opsStatus.canonicalBlogPostCount}</p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Localized variants</p>
              <p className="mt-1 text-2xl font-bold">
                {opsStatus.localizedVariantCount === null ? "Unavailable" : opsStatus.localizedVariantCount}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Static fallback enabled</p>
              <p className="mt-1 text-lg font-semibold">{opsStatus.staticFallbackEnabled ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Production mode</p>
              <p className="mt-1 text-lg font-semibold">{opsStatus.productionMode ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">Translation generation available</p>
              <p className="mt-1 text-lg font-semibold">{opsStatus.translationGenerationAvailable ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">Recent activity</h3>
            <ul className="mt-2">
              {renderActivityRow("Last generation attempt", opsStatus.recentActivity.lastGenerationAttempt)}
              {renderActivityRow("Last generation success", opsStatus.recentActivity.lastGenerationSuccess)}
              {renderActivityRow("Last generation failure", opsStatus.recentActivity.lastGenerationFailure)}
              {renderActivityRow("Last weak-upgrade run", opsStatus.recentActivity.lastWeakUpgradeRun)}
            </ul>
          </div>
        </section>
        <AdminBlogControlPanelClient initialPostId={initialPostId} initialPreviewOpen={initialPreviewOpen} />
      </div>
    </main>
  );
}

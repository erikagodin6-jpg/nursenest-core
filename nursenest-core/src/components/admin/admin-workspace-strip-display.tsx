import Link from "next/link";
import type { AdminWorkspaceStripData } from "@/lib/admin/load-admin-workspace-strip";

function jobTone(status: AdminWorkspaceStripData["recentJobs"][0]["status"]) {
  if (status === "COMPLETED") return "text-emerald-700 dark:text-emerald-300";
  if (status === "FAILED") return "text-rose-700 dark:text-rose-300";
  if (status === "RUNNING") return "text-sky-700 dark:text-sky-300";
  if (status === "CANCELLED") return "text-muted-foreground";
  return "text-amber-800 dark:text-amber-200";
}

export function AdminWorkspaceStripDisplay({ data }: { data: AdminWorkspaceStripData }) {
  const pendingAi =
    data.aiDraftsPending.questions + data.aiDraftsPending.flashcards + data.aiDraftsPending.lessons;
  const genBusy = data.blog.campaignQueuedOrGenerating > 0 || pendingAi > 0;

  return (
    <div className="border-b border-border/80 bg-gradient-to-r from-slate-950/[0.04] via-primary/[0.04] to-emerald-950/[0.04] px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold ${
              data.dbOk
                ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                : "bg-rose-500/15 text-rose-900 dark:text-rose-100"
            }`}
          >
            DB {data.dbOk ? "OK" : "check"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
              genBusy ? "bg-amber-500/15 text-amber-950 dark:text-amber-100" : "bg-muted/80 text-muted-foreground"
            }`}
          >
            Generation {genBusy ? "active" : "idle"}
            {data.blog.campaignQueuedOrGenerating > 0
              ? ` · blog queue ${data.blog.campaignQueuedOrGenerating}`
              : ""}
            {pendingAi > 0 ? ` · AI drafts ${pendingAi}` : ""}
          </span>
          {data.blog.overdueScheduled > 0 ? (
            <Link
              href="/admin/blog/scheduler"
              className="rounded-full bg-rose-500/15 px-2.5 py-1 font-semibold text-rose-900 hover:bg-rose-500/25 dark:text-rose-100"
            >
              {data.blog.overdueScheduled} overdue scheduled post{data.blog.overdueScheduled === 1 ? "" : "s"}
            </Link>
          ) : null}
          {data.blog.nextScheduledAt ? (
            <span className="text-muted-foreground">
              Next: <span className="font-medium text-foreground">{data.blog.nextScheduledTitle ?? "(untitled)"}</span> ·{" "}
              {new Date(data.blog.nextScheduledAt).toLocaleString()}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1 lg:max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Recent jobs</p>
          <ul className="mt-1 flex gap-2 overflow-x-auto pb-1 font-mono text-[11px] text-foreground/90">
            {data.recentJobs.length === 0 ? (
              <li className="text-muted-foreground">No background jobs yet.</li>
            ) : (
              data.recentJobs.map((j) => (
                <li
                  key={j.id}
                  className="shrink-0 rounded-md border border-border/60 bg-[var(--theme-card-bg)] px-2 py-1"
                  title={j.lastError ?? undefined}
                >
                  <span className="max-w-[140px] truncate">{j.type}</span>{" "}
                  <span className={jobTone(j.status)}>{j.status}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/admin/queue"
            className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted"
          >
            Full queue →
          </Link>
          <Link
            href="/admin/generation"
            className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted"
          >
            Generation hub →
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminWorkspaceStripFallback() {
  return (
    <div className="border-b border-border/80 bg-muted/30 px-4 py-2 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
      Live job &amp; generation status unavailable (safe mode, offline DB, or load error).{" "}
      <Link className="font-semibold text-primary underline" href="/admin/operations">
        Operations
      </Link>
    </div>
  );
}

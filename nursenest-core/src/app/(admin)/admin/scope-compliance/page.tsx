import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadScopeComplianceDashboard,
  type ScopeComplianceDashboard,
} from "@/lib/content-scope/load-scope-compliance-dashboard.server";
import type { ContentScopeFinding } from "@/lib/content-scope/content-scope-auditor";

export const dynamic = "force-dynamic";

function severityClass(severity: ContentScopeFinding["severity"]): string {
  switch (severity) {
    case "critical":
      return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200";
    case "high":
      return "border-orange-500/30 bg-orange-500/10 text-orange-800 dark:text-orange-200";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200";
    default:
      return "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200";
  }
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}

function SurfaceHeatmap({ data }: { data: ScopeComplianceDashboard }) {
  return (
    <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Coverage heatmap</h2>
          <p className="text-sm text-muted-foreground">Audited samples by learner surface. Flagged counts indicate scope, exam, or country drift.</p>
        </div>
        <p className="text-xs text-muted-foreground">Generated {new Date(data.generatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.summary.bySurface).map(([surface, row]) => {
          const rate = row.audited > 0 ? Math.round((row.flagged / row.audited) * 100) : 0;
          return (
            <div key={surface} className="rounded-lg border border-border/60 bg-muted/15 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold capitalize text-[var(--theme-heading-text)]">{surface.replaceAll("_", " ")}</p>
                <span className="rounded-full border border-border/70 bg-background px-2 py-0.5 text-[11px] font-bold tabular-nums">{rate}%</span>
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums">{row.flagged.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">flagged of {row.audited.toLocaleString()} audited</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AlignmentSummary({ data }: { data: ScopeComplianceDashboard }) {
  const pathwayRows = Object.entries(data.alignment.byPathway)
    .sort((a, b) => a[1].averageScore - b[1].averageScore)
    .slice(0, 6);
  const topicRows = Object.entries(data.alignment.byTopic)
    .sort((a, b) => b[1].flagged - a[1].flagged || a[1].averageScore - b[1].averageScore)
    .slice(0, 6);
  const priorityRows = Object.entries(data.alignment.reviewQueues).map(([priority, queue]) => ({ priority, queue }));
  const topQueueItems = [...data.alignment.reviewQueues.Critical, ...data.alignment.reviewQueues.High].slice(0, 5);

  return (
    <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Scope alignment intelligence</h2>
          <p className="text-sm text-muted-foreground">
            Classification and scoring by pathway, topic, and content type. Lower scores indicate likely profession or specialty leakage.
          </p>
        </div>
        <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-bold tabular-nums">
          {data.alignment.overallScore}/100 overall
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lowest pathway scores</p>
          <div className="mt-3 space-y-2">
            {pathwayRows.map(([pathway, row]) => (
              <div key={pathway} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-[var(--theme-heading-text)]">{pathway}</span>
                <span className="shrink-0 font-bold tabular-nums">{row.averageScore}/100</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Topics needing review</p>
          <div className="mt-3 space-y-2">
            {topicRows.map(([topic, row]) => (
              <div key={topic} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-[var(--theme-heading-text)]">{topic}</span>
                <span className="shrink-0 font-bold tabular-nums">{row.flagged} flagged</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content type scores</p>
          <div className="mt-3 space-y-2">
            {Object.entries(data.alignment.byContentType).map(([surface, row]) => (
              <div key={surface} className="flex items-center justify-between gap-3 text-sm">
                <span className="capitalize text-[var(--theme-heading-text)]">{surface.replaceAll("_", " ")}</span>
                <span className="shrink-0 font-bold tabular-nums">{row.averageScore}/100</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Review queues</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {priorityRows.map(({ priority, queue }) => (
              <div key={priority} className="rounded-md border border-border/50 bg-background px-3 py-2">
                <p className="text-xs text-muted-foreground">{priority}</p>
                <p className="text-lg font-bold tabular-nums text-[var(--theme-heading-text)]">{queue.length}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highest priority items</p>
          <div className="mt-3 space-y-2">
            {topQueueItems.map((item) => (
              <div key={`${item.priority}-${item.itemId}-${item.reason}`} className="flex items-start justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--theme-heading-text)]">{item.itemId}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.pathway} · {item.topic} · {item.reason}</p>
                </div>
                <span className="shrink-0 font-bold tabular-nums">{item.score}/100</span>
              </div>
            ))}
            {topQueueItems.length === 0 ? <p className="text-sm text-muted-foreground">No critical or high-priority alignment issues in this audit window.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function FindingRow({ finding }: { finding: ContentScopeFinding }) {
  return (
    <article className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${severityClass(finding.severity)}`}>
              {finding.severity}
            </span>
            <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {finding.surface.replaceAll("_", " ")} · {finding.issueType.replaceAll("_", " ")}
            </span>
            <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {finding.tier ?? "unscoped"} · {finding.exam ?? "no exam"} · {finding.country ?? "no country"}
            </span>
          </div>
          <h3 className="mt-3 text-sm font-semibold leading-relaxed text-[var(--theme-heading-text)]">{finding.title}</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Content ID: <code className="rounded bg-muted px-1">{finding.itemId}</code>
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidence</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {finding.evidence.map((evidence) => (
              <span key={evidence} className="rounded-full border border-border/70 bg-background px-2 py-0.5 text-[11px] font-medium">
                {evidence}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suggested correction</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--theme-heading-text)]">{finding.suggestedCorrection}</p>
        </div>
      </div>
    </article>
  );
}

export default async function AdminScopeCompliancePage() {
  await requireAdmin();
  const data = await loadScopeComplianceDashboard({ limit: 900 });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content governance</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Scope compliance auditor</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Automated scope checks for profession, exam, country, and acuity alignment across questions, lessons, flashcards,
            clinical skills, pharmacology, ECG, and simulations. Use this queue before publishing or widening entitlements.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/api/admin/scope-compliance" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Raw queue
          </Link>
          <Link href="/admin/content-quality" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Content quality
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Compliance score" value={`${data.summary.complianceScore}/100`} hint="Weighted by critical, high, medium, and low scope findings." />
        <SummaryCard label="Audited samples" value={data.auditedSamples.toLocaleString()} hint="Bounded sample across every learner content surface." />
        <SummaryCard label="Flagged content" value={data.summary.flaggedItems.toLocaleString()} hint="Unique items requiring educator or pathway-owner review." />
        <SummaryCard label="Critical/high" value={(data.summary.criticalFindings + data.summary.highFindings).toLocaleString()} hint="Items most likely to leak wrong-scope content to learners." />
      </section>

      <div className="mt-6">
        <SurfaceHeatmap data={data} />
      </div>

      <div className="mt-6">
        <AlignmentSummary data={data} />
      </div>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Issue mix</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.summary.byIssueType).map(([issue, count]) => (
            <div key={issue} className="rounded-lg border border-border/60 bg-muted/15 p-3">
              <p className="text-xs font-semibold text-[var(--theme-heading-text)]">{issue.replaceAll("_", " ")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{count.toLocaleString()}</p>
            </div>
          ))}
          {Object.keys(data.summary.byIssueType).length === 0 ? (
            <p className="text-sm text-muted-foreground">No scope drift detected in the current sample.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Flagged content queue</h2>
            <p className="text-sm text-muted-foreground">Sorted by severity so unsafe learner-scope leaks are reviewed first.</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Critical {data.summary.criticalFindings} · High {data.summary.highFindings} · Medium {data.summary.mediumFindings} · Low {data.summary.lowFindings}
          </p>
        </div>
        <div className="space-y-4">
          {data.queue.length > 0 ? (
            data.queue.map((finding, index) => <FindingRow key={`${finding.itemId}-${finding.issueType}-${index}`} finding={finding} />)
          ) : (
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6 text-sm text-muted-foreground">
              No scope compliance findings are available for the current sample.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

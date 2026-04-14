"use client";

import { useCallback, useMemo, useState } from "react";

import type { EeatEditorialDashboardVm, EeatEditorialRow } from "@/lib/admin/eeat-editorial-dashboard";
import { rowsToCsv } from "@/lib/admin/eeat-editorial-csv";

type Props = {
  vm: EeatEditorialDashboardVm;
};

function priorityBadgeClass(p: EeatEditorialRow["priority"]): string {
  switch (p) {
    case "critical":
      return "bg-rose-500/15 text-rose-900 dark:text-rose-100 border-rose-500/30";
    case "high":
      return "bg-amber-500/15 text-amber-900 dark:text-amber-100 border-amber-500/30";
    case "medium":
      return "bg-sky-500/10 text-sky-900 dark:text-sky-100 border-sky-500/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function EeatEditorialDashboardClient({ vm }: Props) {
  const [contentType, setContentType] = useState<string>("all");
  const [pathway, setPathway] = useState<string>("all");
  const [scoreBand, setScoreBand] = useState<string>("all");
  const [staleOnly, setStaleOnly] = useState(false);
  const [thinOnly, setThinOnly] = useState(false);
  const [missingLinks, setMissingLinks] = useState(false);
  const [missingAttr, setMissingAttr] = useState(false);

  const pathwayOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of vm.rows) s.add(r.pathwayKey);
    return [...s].sort();
  }, [vm.rows]);

  const filtered = useMemo(() => {
    return vm.rows.filter((r) => {
      if (contentType !== "all" && r.contentType !== contentType) return false;
      if (pathway !== "all" && r.pathwayKey !== pathway) return false;
      if (staleOnly && !r.staleContent) return false;
      if (thinOnly && !r.thinProgrammatic) return false;
      if (missingLinks && !r.missingInternalLinks) return false;
      if (missingAttr && !r.missingAttribution) return false;
      if (scoreBand !== "all") {
        if (scoreBand === "below70" && r.eeatScore >= 70) return false;
        if (scoreBand !== "below70" && r.priority !== scoreBand) return false;
      }
      return true;
    });
  }, [vm.rows, contentType, pathway, staleOnly, thinOnly, missingLinks, missingAttr, scoreBand]);

  const downloadCsv = useCallback(() => {
    const blob = new Blob([rowsToCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eeat-editorial-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const minPass = vm.thresholds?.minimumPassingEeatScore ?? 70;
  const minLinks = vm.thresholds?.minimumInternalLinks ?? 3;

  return (
    <div className="space-y-10">
      {vm.loadWarnings.length > 0 ? (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/[0.07] p-4 text-sm">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Audit file warnings</p>
          <ul className="mt-2 list-inside list-disc text-amber-900/90 dark:text-amber-100/90">
            {vm.loadWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Pages scored" value={String(vm.overview.totalPages)} hint="From eeat-page-scores.json" />
        <SummaryCard
          label="Average E-E-A-T"
          value={String(vm.overview.averageScore)}
          hint={`Target ≥ ${minPass}`}
        />
        <SummaryCard
          label="Below threshold"
          value={String(vm.overview.belowThreshold)}
          hint={`Score below ${minPass}`}
        />
        <SummaryCard
          label="Internal link gaps"
          value={String(vm.overview.internalLinkGaps)}
          hint={`Fewer than ${minLinks} internal links`}
        />
        <SummaryCard label="Thin programmatic" value={String(vm.overview.thinProgrammaticCount)} hint="SEO shells" />
        <SummaryCard label="Stale flagged" value={String(vm.overview.staleFlaggedCount)} hint="Catalog / blog policy" />
        <SummaryCard label="Missing attribution" value={String(vm.overview.missingAttributionCount)} hint="Blog author" />
        <SummaryCard
          label="Structure gaps"
          value={String(vm.overview.structureIncompleteCount)}
          hint="Spine / checklist"
        />
      </section>

      {vm.completionQueuePreview.length > 0 ? (
        <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Audit completion queue (top of prioritized list)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Order from eeat-completion-queue.json — use alongside score-sorted tables.
          </p>
          <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
            {vm.completionQueuePreview.map((q) => (
              <li key={q.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-md bg-muted/35 px-2 py-1.5">
                <span className="font-mono text-[11px] leading-snug text-muted-foreground">{q.id}</span>
                <span className="shrink-0 tabular-nums font-semibold">{q.score}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {vm.finalStatusSummary ? (
        <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Final status snapshot</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Generated {vm.generatedAtFinalStatus ? new Date(vm.generatedAtFinalStatus).toLocaleString() : "—"} ·{" "}
            {String((vm.finalStatusSummary.rankingReadiness as string) ?? "")}
          </p>
          {Array.isArray(vm.finalStatusSummary.prioritizedActions) ? (
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              {(vm.finalStatusSummary.prioritizedActions as string[]).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Filters</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Narrow the main table. Default sort remains lowest E-E-A-T score first.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Export filtered CSV
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Content type
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
            >
              <option value="all">All</option>
              <option value="pathway_lesson">Pathway lesson</option>
              <option value="blog">Blog</option>
              <option value="programmatic_seo">Programmatic SEO</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Pathway / bucket
            <select
              value={pathway}
              onChange={(e) => setPathway(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
            >
              <option value="all">All</option>
              {pathwayOptions.map((pk) => (
                <option key={pk} value={pk}>
                  {pk}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Score / priority
            <select
              value={scoreBand}
              onChange={(e) => setScoreBand(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground"
            >
              <option value="all">All</option>
              <option value="below70">Below 70 only</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <div className="flex flex-col gap-2 text-xs font-medium text-muted-foreground">
            <span>Quick flags</span>
            <label className="flex items-center gap-2 font-normal">
              <input type="checkbox" checked={staleOnly} onChange={(e) => setStaleOnly(e.target.checked)} />
              Stale only
            </label>
            <label className="flex items-center gap-2 font-normal">
              <input type="checkbox" checked={thinOnly} onChange={(e) => setThinOnly(e.target.checked)} />
              Thin programmatic only
            </label>
            <label className="flex items-center gap-2 font-normal">
              <input type="checkbox" checked={missingLinks} onChange={(e) => setMissingLinks(e.target.checked)} />
              Missing internal links
            </label>
            <label className="flex items-center gap-2 font-normal">
              <input type="checkbox" checked={missingAttr} onChange={(e) => setMissingAttr(e.target.checked)} />
              Missing attribution
            </label>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> of {vm.rows.length} rows
        </p>
      </section>

      <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Pathways by lowest average score</h2>
        <p className="mt-1 text-sm text-muted-foreground">Grouped from scored pages (lessons + blog + programmatic buckets).</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4">Pathway</th>
                <th className="py-2 pr-4">Pages</th>
                <th className="py-2 pr-4">Avg score</th>
                <th className="py-2">Min score</th>
              </tr>
            </thead>
            <tbody>
              {vm.pathwayRollups.slice(0, 40).map((p) => (
                <tr key={p.pathwayKey} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-mono text-xs">{p.pathwayKey}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.pageCount}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.averageScore}</td>
                  <td className="py-2 tabular-nums text-rose-700 dark:text-rose-300">{p.minScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <QueueSection title="Programmatic SEO — thin pages" rows={vm.thinProgrammaticRows} emptyHint="No thin_programmatic flags in current audit." />

      <QueueSection title="Stale content queue" rows={vm.staleQueueRows} emptyHint="No stale flags on scored pages." />

      {vm.freshnessMeta.staleBlogPostsSample.length > 0 ? (
        <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Stale blog sample (DB)</h2>
          <p className="mt-1 text-sm text-muted-foreground">From content-freshness.json when audit ran with DATABASE_URL.</p>
          <ul className="mt-3 max-h-48 space-y-1 overflow-auto text-sm">
            {vm.freshnessMeta.staleBlogPostsSample.map((b) => (
              <li key={b.slug} className="flex justify-between gap-2 rounded bg-muted/30 px-2 py-1">
                <span className="font-mono text-xs">{b.slug}</span>
                <span className="text-xs text-muted-foreground">{new Date(b.updatedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <QueueSection
        title="Missing attribution queue"
        rows={vm.attributionQueueRows}
        emptyHint="No author_missing flags (blogs may use institutional JSON-LD only)."
      />

      <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">All scored pages (filtered)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Lowest score first · topical clusters: {vm.topicalClusterCount} (see topical-clusters.json)
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-3">Score</th>
                <th className="py-2 pr-3">Priority</th>
                <th className="py-2 pr-3">Pathway</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Links</th>
                <th className="py-2 pr-3">Structure</th>
                <th className="py-2 pr-3">Flags</th>
                <th className="py-2 pr-3">Actions</th>
                <th className="py-2">Copy</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border/50 align-top">
                  <td className="py-2 pr-3 tabular-nums font-medium">{r.eeatScore}</td>
                  <td className="py-2 pr-3">
                    <span className={`inline-block rounded border px-2 py-0.5 text-[11px] font-medium ${priorityBadgeClass(r.priority)}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{r.pathwayKey}</td>
                  <td className="py-2 pr-3 text-xs">{r.contentType.replace(/_/g, " ")}</td>
                  <td className="py-2 pr-3 tabular-nums">{r.internalLinksCount}</td>
                  <td className="py-2 pr-3 tabular-nums">{Math.round(r.sectionCompleteness * 100)}%</td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground">{r.flags.join(", ")}</td>
                  <td className="py-2 pr-3 text-xs">{r.recommendedActions.join(" · ") || "—"}</td>
                  <td className="py-2">
                    <CopyFixesButton text={r.recommendedFixesCopy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function QueueSection({ title, rows, emptyHint }: { title: string; rows: EeatEditorialRow[]; emptyHint: string }) {
  return (
    <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{rows.length ? `${rows.length} items` : emptyHint}</p>
      {rows.length > 0 ? (
        <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-sm">
          {rows.slice(0, 50).map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5">
              <span className="font-mono text-[11px] text-muted-foreground">{r.id}</span>
              <span className="tabular-nums font-medium">{r.eeatScore}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function CopyFixesButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="whitespace-nowrap rounded border border-border px-2 py-1 text-[11px] hover:bg-muted"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* ignore */
        }
      }}
    >
      {done ? "Copied" : "Copy fixes"}
    </button>
  );
}

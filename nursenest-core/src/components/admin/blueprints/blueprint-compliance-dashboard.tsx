"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileSearch, Flame, Target, TrendingDown, TrendingUp } from "lucide-react";
import type {
  AdminBlueprintComplianceDashboard,
  PathwayBlueprintComplianceReport,
} from "@/lib/blueprints/blueprint-compliance-types";
import { Progress } from "@/components/ui/progress";

function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-700 dark:text-emerald-200";
  if (score >= 70) return "text-sky-700 dark:text-sky-200";
  if (score >= 50) return "text-amber-700 dark:text-amber-200";
  return "text-rose-700 dark:text-rose-200";
}

function statusBadge(status: string) {
  if (status === "aligned") return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200";
  if (status === "overrepresented") return "bg-sky-500/10 text-sky-700 dark:text-sky-200";
  if (status === "underrepresented") return "bg-amber-500/10 text-amber-800 dark:text-amber-100";
  return "bg-rose-500/10 text-rose-700 dark:text-rose-200";
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function Heatmap({ selected }: { selected: PathwayBlueprintComplianceReport }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {selected.report.rows.map((row) => {
        const intensity = Math.min(100, Math.abs(row.variancePercent) * 8 + (row.status === "missing" ? 35 : 0));
        const bg =
          row.status === "aligned"
            ? "bg-emerald-500/10"
            : row.status === "overrepresented"
              ? "bg-sky-500/10"
              : row.status === "underrepresented"
                ? "bg-amber-500/10"
                : "bg-rose-500/10";
        return (
          <div key={row.domainId} className={`rounded-2xl border border-border/70 p-4 ${bg}`} style={{ boxShadow: `inset 0 0 0 ${Math.round(intensity / 18)}px rgba(0,0,0,0.02)` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--theme-heading-text)]">{row.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Target {row.targetPercent}% · Actual {row.actualPercent}% · Variance {row.variancePercent > 0 ? "+" : ""}{row.variancePercent}%
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(row.status)}`}>
                {row.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[11px] text-muted-foreground">
              <span>Q {row.questions}</span>
              <span>F {row.flashcards}</span>
              <span>L {row.lessons}</span>
              <span>S {row.simulations}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function BlueprintComplianceDashboard({
  data,
  selectedPathwayId,
  pathwayOptions,
}: {
  data: AdminBlueprintComplianceDashboard | null;
  selectedPathwayId: string | null;
  pathwayOptions: Array<{ id: string; label: string; examKey: string }>;
}) {
  const router = useRouter();
  const options = useMemo(() => pathwayOptions, [pathwayOptions]);

  if (!data) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm">
        <p className="font-semibold text-[var(--theme-heading-text)]">Blueprint compliance unavailable</p>
        <p className="mt-2 text-muted-foreground">Database access is not configured or runtime safe mode is enabled.</p>
      </div>
    );
  }

  const selected = data.selected;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
        <label className="flex min-w-[18rem] flex-col gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Pathway
          <select
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground"
            value={selectedPathwayId ?? data.selectedPathwayId}
            onChange={(event) => router.push(`/admin/blueprint-compliance?pathwayId=${event.target.value}`)}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-muted-foreground">Generated {new Date(data.generatedAt).toLocaleString()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pathways audited" value={String(data.summary.pathwaysAudited)} detail="Selected pathway plus comparison sample." />
        <StatCard label="Average score" value={data.summary.averageComplianceScore == null ? "—" : `${data.summary.averageComplianceScore}%`} detail="Blueprint compliance across audited pathways." />
        <StatCard label="Critical gaps" value={String(data.summary.criticalGaps)} detail="Missing or high-variance domains." />
        <StatCard label="Mapped items" value={String(data.summary.totalItems)} detail="Questions, flashcards, lessons, simulations." />
      </div>

      {data.degraded ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Partial data: at least one pathway aggregate failed.
        </p>
      ) : null}

      {!selected ? (
        <div className="rounded-2xl border border-dashed border-border bg-[var(--theme-card-bg)] p-8 text-center">
          <FileSearch className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-[var(--theme-heading-text)]">No blueprint report available</h2>
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Blueprint compliance</p>
                <h2 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">{selected.pathwayName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.blueprint.label} · {selected.blueprint.sourceLabel} · reviewed {selected.blueprint.reviewedAt}
                </p>
                <Link href={selected.blueprint.sourceUrl} className="mt-2 inline-block text-xs font-semibold text-primary underline">
                  Blueprint source
                </Link>
              </div>
              <div className="min-w-[16rem] rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Compliance score</p>
                <p className={`mt-2 text-5xl font-bold tabular-nums ${scoreTone(selected.report.complianceScore)}`}>
                  {selected.report.complianceScore}%
                </p>
                <Progress value={selected.report.complianceScore} className="mt-3 h-3" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {selected.report.alignedDomains}/{selected.report.rows.length} domains within ±2 percentage points.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {Object.entries(selected.contentTotals).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-border/60 bg-background/60 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <Target className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Coverage heatmap</h3>
                <p className="text-sm text-muted-foreground">Target vs actual domain distribution across learner content.</p>
              </div>
            </div>
            <Heatmap selected={selected} />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Content creation priorities</h3>
              </div>
              <div className="space-y-3">
                {selected.report.underrepresentedDomains.map((row) => (
                  <div key={row.domainId} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[var(--theme-heading-text)]">{row.label}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(row.status)}`}>
                        {row.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{row.suggestedAction}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Gap: {row.variancePercent}% · Target {row.targetPercent}% · Actual {row.actualPercent}%</p>
                  </div>
                ))}
                {selected.report.underrepresentedDomains.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No underrepresented domains in the selected pathway.</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Missing objectives</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {selected.report.missingObjectives.map((objective) => (
                  <li key={objective} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">{objective}</li>
                ))}
              </ul>
              {selected.report.missingObjectives.length === 0 ? (
                <p className="text-sm text-muted-foreground">No missing objectives detected.</p>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Domain table</h3>
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="py-2">Domain</th>
                    <th className="py-2 text-right">Target</th>
                    <th className="py-2 text-right">Actual</th>
                    <th className="py-2 text-right">Variance</th>
                    <th className="py-2 text-right">Questions</th>
                    <th className="py-2 text-right">Flashcards</th>
                    <th className="py-2 text-right">Lessons</th>
                    <th className="py-2 text-right">Simulations</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.report.rows.map((row) => (
                    <tr key={row.domainId} className="border-b border-border/50">
                      <td className="py-3 font-medium text-[var(--theme-heading-text)]">{row.label}</td>
                      <td className="py-3 text-right tabular-nums">{row.targetPercent}%</td>
                      <td className="py-3 text-right tabular-nums">{row.actualPercent}%</td>
                      <td className="py-3 text-right tabular-nums">{row.variancePercent > 0 ? "+" : ""}{row.variancePercent}%</td>
                      <td className="py-3 text-right tabular-nums">{row.questions}</td>
                      <td className="py-3 text-right tabular-nums">{row.flashcards}</td>
                      <td className="py-3 text-right tabular-nums">{row.lessons}</td>
                      <td className="py-3 text-right tabular-nums">{row.simulations}</td>
                      <td className="py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(row.status)}`}>{row.status.replace(/_/g, " ")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sky-600" />
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Overrepresented domains</h3>
              </div>
              <div className="space-y-3">
                {selected.report.overrepresentedDomains.map((row) => (
                  <p key={row.domainId} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                    {row.label}: {row.actualPercent}% actual vs {row.targetPercent}% target. {row.suggestedAction}
                  </p>
                ))}
                {selected.report.overrepresentedDomains.length === 0 ? <p className="text-sm text-muted-foreground">No overrepresented domains.</p> : null}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-[var(--theme-heading-text)]">Unmapped taxonomy cleanup</h3>
              </div>
              <div className="max-h-80 space-y-2 overflow-auto">
                {selected.unmappedSignals.map((item) => (
                  <p key={`${item.contentType}-${item.label}`} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                    {item.contentType}: {item.label} ({item.count})
                  </p>
                ))}
                {selected.unmappedSignals.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> All sampled taxonomy signals mapped.</p>
                ) : null}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-border/70 bg-[var(--theme-card-bg)] p-5 text-sm text-muted-foreground shadow-sm">
        <h3 className="font-semibold text-[var(--theme-heading-text)]">Governance notes</h3>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {data.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </section>
    </div>
  );
}

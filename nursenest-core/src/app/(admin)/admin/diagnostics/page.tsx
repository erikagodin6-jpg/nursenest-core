import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  buildAdminDiagnosticsOperationsLayer,
  type OperationsScoreDriver,
} from "@/lib/admin/build-admin-diagnostics-operations-layer";
import { readPriorReadinessScore, writePriorReadinessScore } from "@/lib/admin/readiness-prior-score-cache";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { loadCatBlueprintDiagnosticsSummary } from "@/lib/admin/load-cat-blueprint-diagnostics-summary";
import { loadQuestionBankRemediationIntelligence } from "@/lib/questions/load-question-bank-remediation-intelligence";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return n.toLocaleString();
}

function questionsHrefTopic(topic: string | null): string {
  const t = (topic ?? "").trim();
  if (!t) return "/admin/questions";
  return `/admin/questions?topic=${encodeURIComponent(t)}`;
}

function severityStyles(sev: "critical" | "high" | "medium") {
  if (sev === "critical") {
    return "border-red-500/40 bg-red-500/[0.07] text-red-950 dark:text-red-50";
  }
  if (sev === "high") {
    return "border-amber-500/40 bg-amber-500/[0.08] text-amber-950 dark:text-amber-50";
  }
  return "border-border/80 bg-muted/30 text-foreground";
}

function driverSeverityPill(sev: OperationsScoreDriver["severity"]) {
  if (sev === "critical") return "bg-red-500/15 text-red-900 dark:text-red-100";
  if (sev === "high") return "bg-amber-500/15 text-amber-900 dark:text-amber-100";
  if (sev === "medium") return "bg-muted text-muted-foreground";
  return "bg-emerald-500/10 text-emerald-900 dark:text-emerald-100";
}

function trendStyles(direction: "improving" | "stable" | "worsening") {
  if (direction === "improving") return "text-emerald-700 dark:text-emerald-300";
  if (direction === "worsening") return "text-rose-700 dark:text-rose-300";
  return "text-muted-foreground";
}

export default async function AdminDiagnosticsPage() {
  await requireAdmin();
  const [diagnostics, remediation, catBlueprintSummary] = await Promise.all([
    loadAdminDiagnostics(),
    loadQuestionBankRemediationIntelligence(),
    loadCatBlueprintDiagnosticsSummary(),
  ]);
  const priorReadiness = readPriorReadinessScore();
  const ops = buildAdminDiagnosticsOperationsLayer(diagnostics, remediation, { priorReadiness });
  writePriorReadinessScore(ops.readinessScore);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Operations</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Diagnostics dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Prioritized actions and readiness on top; full system snapshot below (unchanged fields).
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-lg border border-border px-3 py-2 font-medium text-foreground hover:bg-muted"
          >
            ← Command center
          </Link>
          <Link
            href="/api/admin/diagnostics"
            className="rounded-lg border border-border px-3 py-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            JSON API
          </Link>
          <Link
            href="/admin/diagnostics/cat-blueprint-sessions"
            className="rounded-lg border border-border px-3 py-2 font-medium text-foreground hover:bg-muted"
          >
            CAT blueprint sessions
          </Link>
          <Link
            href="/admin/diagnostics/theme-qa"
            className="rounded-lg border border-border px-3 py-2 font-medium text-foreground hover:bg-muted"
          >
            Theme & logo QA
          </Link>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">CAT blueprint quality</h2>
            <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
              Based on the {catBlueprintSummary.recentCompletedCatSessions} most recent{" "}
              <span className="font-medium text-foreground">completed</span> CAT practice tests (by last update). Averages
              include only sessions that have the corresponding stored mapping fraction (pool vs delivered/session).
              Low-quality count uses the same rules as the CAT sessions filter (
              <span className="font-mono">lowQualityOnly=1</span>
              ): exam simulation pool &lt;{" "}
              {catBlueprintSummary.qualityThresholds.poolMappedFractionWarning * 100}% or delivered mapping &lt;{" "}
              {catBlueprintSummary.qualityThresholds.sessionMappedFractionWarning * 100}% when scored.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              href="/admin/diagnostics/cat-blueprint-sessions"
              className="rounded-lg border border-border px-3 py-2 font-medium text-foreground hover:bg-muted"
            >
              CAT blueprint sessions
            </Link>
            <Link
              href="/admin/questions/nclex-mapping"
              className="rounded-lg border border-border px-3 py-2 font-medium text-primary underline-offset-4 hover:underline"
            >
              NCLEX mapping remediation
            </Link>
          </div>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Avg pool mapped (recent completed, with pool %)</dt>
            <dd className="font-semibold tabular-nums">
              {catBlueprintSummary.avgPoolMappedPct != null ? `${catBlueprintSummary.avgPoolMappedPct}%` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Avg delivered mapped (recent completed, with session %)</dt>
            <dd className="font-semibold tabular-nums">
              {catBlueprintSummary.avgSessionMappedPct != null ? `${catBlueprintSummary.avgSessionMappedPct}%` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sessions with blueprint diagnostics in window</dt>
            <dd className="font-semibold tabular-nums">{catBlueprintSummary.sessionsWithBlueprintDiagnostics}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Low-quality sessions (same thresholds)</dt>
            <dd className="font-semibold tabular-nums text-amber-900 dark:text-amber-100">
              {catBlueprintSummary.lowQualitySessionCount}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-[var(--theme-card-bg)] to-[var(--theme-card-bg)] p-5 lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content readiness</p>
          <p className="mt-2 text-4xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {ops.readinessScore}
            <span className="text-lg font-semibold text-muted-foreground">/100</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{ops.readinessSummary}</p>
          <p className="mt-3 text-sm font-medium leading-snug text-[var(--theme-heading-text)]">{ops.readinessExplanation}</p>
          {ops.readinessTrend.available ? (
            <p className={`mt-2 text-sm font-medium ${trendStyles(ops.readinessTrend.direction)}`}>
              Trend: {ops.readinessTrend.direction}
              {ops.readinessTrend.delta === 0
                ? " (unchanged)"
                : ` (${ops.readinessTrend.delta > 0 ? "+" : ""}${ops.readinessTrend.delta} vs prior ${ops.readinessTrend.priorScore})`}
              <span className="ml-1 font-normal text-muted-foreground">
                · prior {new Date(ops.readinessTrend.priorRecordedAt).toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">{ops.readinessTrend.reason}</p>
          )}
          <p className="mt-4 text-[11px] text-muted-foreground">
            Generated {new Date(diagnostics.generatedAt).toLocaleString()} · heuristic score from diagnostics + bank intel
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Top priority issues</h2>
            <span className="text-xs text-muted-foreground">Up to 5 · severity order: critical → high → medium</span>
          </div>
          {ops.priorityIssues.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No automated priority flags right now.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {ops.priorityIssues.map((issue) => (
                <li
                  key={issue.id}
                  className={`flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${severityStyles(issue.severity)}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        {issue.severity}
                      </span>
                      {issue.conversionRisk ? (
                        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-200">
                          Conversion / trust risk
                        </span>
                      ) : null}
                      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {issue.category.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-[var(--theme-heading-text)]">{issue.title}</p>
                    {issue.detail ? <p className="mt-1 text-sm opacity-90">{issue.detail}</p> : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                    <Link
                      href={issue.action.href}
                      className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      {issue.action.label}
                    </Link>
                    {issue.secondaryAction ? (
                      <Link
                        href={issue.secondaryAction.href}
                        className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        {issue.secondaryAction.label}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Score drivers</h2>
          <p className="text-xs text-muted-foreground">
            Negative weights = points deducted from 100; positive ranks strengths (1–10, not added to score).
          </p>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-rose-800 dark:text-rose-200">Top negative contributors</h3>
            {ops.scoreDrivers.negative.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">None. No automated deductions on this snapshot.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {ops.scoreDrivers.negative.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] px-3 py-2"
                  >
                    <span className="min-w-0 font-medium text-[var(--theme-heading-text)]">{d.label}</span>
                    <span className="flex shrink-0 items-center gap-2 tabular-nums">
                      <span className="text-muted-foreground">−{d.weight} pts</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${driverSeverityPill(d.severity)}`}>
                        {d.severity}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Top positive signals</h3>
            {ops.scoreDrivers.positive.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No standout positive flags from heuristics.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {ops.scoreDrivers.positive.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] px-3 py-2"
                  >
                    <span className="min-w-0 font-medium text-[var(--theme-heading-text)]">{d.label}</span>
                    <span className="flex shrink-0 items-center gap-2 tabular-nums">
                      <span className="text-muted-foreground">weight {d.weight}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${driverSeverityPill(d.severity)}`}>
                        {d.severity}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Database</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Configured</dt>
            <dd className="font-semibold">{diagnostics.dbHealth.configured ? "yes" : "no"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-semibold">{diagnostics.dbHealth.status}</dd>
          </div>
          {diagnostics.dbHealth.latencyMs != null ? (
            <div>
              <dt className="text-muted-foreground">Latency</dt>
              <dd className="font-semibold">{diagnostics.dbHealth.latencyMs} ms</dd>
            </div>
          ) : null}
          {diagnostics.dbHealth.error ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Error</dt>
              <dd className="font-mono text-xs">{diagnostics.dbHealth.error}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">API probes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {diagnostics.apiHealth.probed
            ? `Base URL: ${diagnostics.apiHealth.baseUrl}`
            : "No public base URL configured; probes skipped."}
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{diagnostics.apiHealth.liveness.path}</dt>
            <dd className="font-semibold">
              {diagnostics.apiHealth.liveness.ok ? "ok" : "fail"}{" "}
              {diagnostics.apiHealth.liveness.status != null ? `(${diagnostics.apiHealth.liveness.status})` : ""}
            </dd>
            {diagnostics.apiHealth.liveness.error ? (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{diagnostics.apiHealth.liveness.error}</p>
            ) : null}
          </div>
          <div>
            <dt className="text-muted-foreground">{diagnostics.apiHealth.readiness.path}</dt>
            <dd className="font-semibold">
              {diagnostics.apiHealth.readiness.ok ? "ok" : "fail"}{" "}
              {diagnostics.apiHealth.readiness.status != null ? `(${diagnostics.apiHealth.readiness.status})` : ""}
            </dd>
            {diagnostics.apiHealth.readiness.error ? (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{diagnostics.apiHealth.readiness.error}</p>
            ) : null}
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Counts</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Questions (total / published / draft)</dt>
            <dd className="font-semibold tabular-nums">
              {fmt(diagnostics.counts.questionsTotal)} / {fmt(diagnostics.counts.questionsPublished)} /{" "}
              {fmt(diagnostics.counts.questionsDraft)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Published missing rationale</dt>
            <dd className="font-semibold tabular-nums">{fmt(diagnostics.counts.questionsPublishedMissingRationale)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Published missing key takeaway</dt>
            <dd className="font-semibold tabular-nums">{fmt(diagnostics.counts.questionsPublishedMissingKeyTakeaway)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Lessons (content items all / published)</dt>
            <dd className="font-semibold tabular-nums">
              {fmt(diagnostics.counts.lessonsContentItemsAll)} / {fmt(diagnostics.counts.lessonsContentItemsPublished)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pathway lessons (published / draft)</dt>
            <dd className="font-semibold tabular-nums">
              {fmt(diagnostics.counts.pathwayLessonsPublished)} / {fmt(diagnostics.counts.pathwayLessonsDraft)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Flashcards (published) / decks</dt>
            <dd className="font-semibold tabular-nums">
              {fmt(diagnostics.counts.flashcardsPublished)} / {fmt(diagnostics.counts.flashcardDecksPublished)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Blog posts (total / published)</dt>
            <dd className="font-semibold tabular-nums">
              {fmt(diagnostics.counts.blogPostsTotal)} / {fmt(diagnostics.counts.blogPostsPublished)}
            </dd>
          </div>
        </dl>
        {diagnostics.countWarnings.length > 0 ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
            {diagnostics.countWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Pathway lesson counts</h2>
        {diagnostics.pathwayWarnings.length > 0 ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
            {diagnostics.pathwayWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Pathway</th>
                <th className="py-2 text-right">Published</th>
                <th className="py-2 text-right">Draft</th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.pathwayCounts.map((p) => (
                <tr key={p.pathwayId} className="border-b border-border/40">
                  <td className="py-2">
                    <span className="font-medium">{p.displayName}</span>
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground">{p.pathwayId}</span>
                  </td>
                  <td className="py-2 text-right tabular-nums">{fmt(p.published)}</td>
                  <td className="py-2 text-right tabular-nums">{fmt(p.draft)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Weak topic coverage (&lt; {diagnostics.weakCoverageThreshold} published)
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Topics with fewer than the threshold of published questions (capped list).
        </p>
        {diagnostics.weakCoverage.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">None in sample.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {diagnostics.weakCoverage.map((w) => (
              <li key={`${w.topic ?? "null"}-${w.publishedQuestions}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <span>{w.topic ?? "(null topic)"}</span>
                <span className="tabular-nums text-muted-foreground">{w.publishedQuestions} published</span>
                <Link className="text-primary underline" href={questionsHrefTopic(w.topic)}>
                  Question queue
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Missing / gap signals</h2>
        {diagnostics.missingData.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">None flagged.</p>
        ) : (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            {diagnostics.missingData.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Question bank diagnostic notes</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {diagnostics.questionDiagNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

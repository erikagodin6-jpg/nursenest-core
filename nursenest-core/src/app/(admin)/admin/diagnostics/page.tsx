import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";
import { loadExamPlanAdoptionStats } from "@/lib/admin/load-exam-plan-adoption";
import { loadQuestionBankRemediationIntelligence } from "@/lib/questions/load-question-bank-remediation-intelligence";
import { QuestionQualityQueueTable } from "@/components/admin/question-quality-queue-table";
import { buildNpCanadaCoverageReport } from "@/lib/np/build-np-canada-coverage-report";

export const dynamic = "force-dynamic";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        ok ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"
      }`}
    >
      {label}
    </span>
  );
}

export default async function AdminDiagnosticsPage() {
  await requireAdmin();
  const [d, examPlan, qbIntel, npCoverage] = await Promise.all([
    loadAdminDiagnostics(),
    loadExamPlanAdoptionStats(),
    loadQuestionBankRemediationIntelligence(),
    buildNpCanadaCoverageReport().catch(() => null),
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/admin" className="text-primary underline hover:opacity-90">
          ← Admin operations
        </Link>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Diagnostics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Content inventory, weak coverage, and platform health. Loads safely when individual tables are missing.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Generated {new Date(d.generatedAt).toLocaleString()}</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Questions (total)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{d.counts.questionsTotal}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Published: {d.counts.questionsPublished} · Missing takeaway: {d.counts.questionsPublishedMissingKeyTakeaway}
          </p>
        </article>
        <article className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Lessons</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{d.counts.lessonsContentItemsPublished}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Content items (pub.) · Pathway pub.: {d.counts.pathwayLessonsPublished}
          </p>
        </article>
        <article className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Flashcards</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{d.counts.flashcardsPublished}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Decks (pub.): {d.counts.flashcardDecksPublished}</p>
        </article>
        <article className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blog</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{d.counts.blogPostsTotal}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Published: {d.counts.blogPostsPublished}</p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Database health</h2>
          <p className="mt-1 text-sm text-muted-foreground">Prisma probe (same logic as readiness checks).</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-muted-foreground">Configured</dt>
              <dd>{d.dbHealth.configured ? "yes" : "no"}</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="flex items-center gap-2">
                <StatusPill
                  ok={d.dbHealth.status === "ok" || d.dbHealth.status === "skipped"}
                  label={d.dbHealth.status}
                />
                {d.dbHealth.latencyMs != null ? (
                  <span className="text-xs text-muted-foreground">{d.dbHealth.latencyMs} ms</span>
                ) : null}
              </dd>
            </div>
            {d.dbHealth.error ? (
              <div>
                <dt className="text-muted-foreground">Error</dt>
                <dd className="mt-1 font-mono text-xs text-rose-700">{d.dbHealth.error}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">API health</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {d.apiHealth.probed
              ? `Probed via ${d.apiHealth.baseUrl}`
              : "Set NEXT_PUBLIC_APP_URL (or deploy on Vercel) to probe liveness/readiness over HTTP."}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs">{d.apiHealth.liveness.path}</span>
              <StatusPill ok={d.apiHealth.liveness.ok} label={d.apiHealth.liveness.ok ? "ok" : "fail"} />
            </li>
            {d.apiHealth.liveness.error ? (
              <li className="font-mono text-xs text-rose-700">{d.apiHealth.liveness.error}</li>
            ) : null}
            <li className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs">{d.apiHealth.readiness.path}</span>
              <StatusPill ok={d.apiHealth.readiness.ok} label={d.apiHealth.readiness.ok ? "ok" : "fail"} />
            </li>
            {d.apiHealth.readiness.error ? (
              <li className="font-mono text-xs text-rose-700">{d.apiHealth.readiness.error}</li>
            ) : null}
          </ul>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Missing or weak data</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">Signals</h3>
            {d.missingData.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No threshold-based gaps flagged.</p>
            ) : (
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {d.missingData.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            )}
            <h3 className="mt-4 text-sm font-semibold text-muted-foreground">Query warnings</h3>
            {[...d.countWarnings, ...d.pathwayWarnings].length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">None (or database not configured).</p>
            ) : (
              <ul className="mt-2 space-y-1 font-mono text-[11px] text-amber-900">
                {[...d.countWarnings, ...d.pathwayWarnings].map((w) => (
                  <li key={w} className="rounded bg-amber-50 px-2 py-1">
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">
              Weak topic coverage (&lt; {d.weakCoverageThreshold} published questions)
            </h3>
            {d.weakCoverage.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">None in sample, or query unavailable.</p>
            ) : (
              <ul className="mt-2 max-h-64 space-y-1 overflow-auto text-sm">
                {d.weakCoverage.map((row) => (
                  <li key={row.topic ?? "null"} className="flex justify-between gap-2 rounded bg-muted/50 px-2 py-1">
                    <span className="truncate">{row.topic ?? "(no topic)"}</span>
                    <span className="shrink-0 tabular-nums">{row.publishedQuestions}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{d.questionDiagNotes.join(" ")}</p>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Pathway lesson counts</h2>
        <p className="mt-1 text-sm text-muted-foreground">From pathway_lessons grouped by pathway (published vs draft).</p>
        <div className="mt-4 max-h-80 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-2">Pathway</th>
                <th className="py-2 text-right">Published</th>
                <th className="py-2 text-right">Draft</th>
              </tr>
            </thead>
            <tbody>
              {d.pathwayCounts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-muted-foreground">
                    No rows (table missing, empty, or query failed — see warnings).
                  </td>
                </tr>
              ) : (
                d.pathwayCounts.map((r) => (
                  <tr key={r.pathwayId} className="border-b border-border/40">
                    <td className="py-2 pr-2">{r.displayName}</td>
                    <td className="py-2 text-right tabular-nums">{r.published}</td>
                    <td className="py-2 text-right tabular-nums">{r.draft}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {examPlan ? (
        <section className="mt-8 nn-card p-6">
          <h2 className="text-lg font-semibold">Exam plan adoption</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Learner exam-date intent, cadence, and urgency (UTC dates). For product and retention — not clinical.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Snapshot {new Date(examPlan.generatedAt).toLocaleString()}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total users</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.totalUsers}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Unsure / no date</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.unsure}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Proposed</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.proposed}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Confirmed</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.confirmed}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Exam ≤30d</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.examWithin30Days}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Overdue date</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.overdueExamDate}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Plan missing date</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{examPlan.datedPlanMissingDate}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Cadence L / S / I / unset</p>
              <p className="mt-1 text-sm font-semibold tabular-nums">
                {examPlan.cadenceLight} · {examPlan.cadenceSteady} · {examPlan.cadenceIntensive} · {examPlan.cadenceUnset}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {qbIntel ? (
        <section className="mt-8 nn-card p-6">
          <h2 className="text-lg font-semibold">Question-bank remediation intelligence</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actionable banking signals: strongest/weakest pools, below-floor pathways, uncategorized risk, and Allied CA classification checks.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">NP published</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{qbIntel.np.published}</p>
              <p className="text-xs text-muted-foreground">Uncategorized {qbIntel.np.uncategorizedPct}%</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Allied CA rows</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{qbIntel.alliedCanada.publishedCA}</p>
              <p className="text-xs text-muted-foreground">US/null {qbIntel.alliedCanada.publishedUSOrNull}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Allied assessment</p>
              <p className="mt-1 text-sm font-semibold">{qbIntel.alliedCanada.assessment.replaceAll("_", " ")}</p>
              <p className="text-xs text-muted-foreground">
                shared rows {qbIntel.alliedCanada.sharedRegionRows}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Below-floor banks</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{qbIntel.belowFloorBanks.length}</p>
              <p className="text-xs text-muted-foreground">threshold misses</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Strongest banks</p>
              <ul className="mt-2 space-y-1 text-sm">
                {qbIntel.strongestBanks.map((r) => (
                  <li key={r.label} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                    <span className="truncate pr-2">{r.label}</span>
                    <span className="tabular-nums">{r.published}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weakest banks</p>
              <ul className="mt-2 space-y-1 text-sm">
                {qbIntel.weakestBanks.map((r) => (
                  <li key={r.label} className="flex justify-between rounded bg-amber-50 px-2 py-1 dark:bg-amber-950/30">
                    <span className="truncate pr-2">{r.label}</span>
                    <span className="tabular-nums">{r.missingPct}% miss · {r.thinPct}% thin</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-border/60 bg-muted/15 p-3 text-sm">
            <p className="font-medium">Allied Canada status: {qbIntel.alliedCanada.assessment.replaceAll("_", " ")}</p>
            <p className="mt-1 text-muted-foreground">
              {qbIntel.alliedCanada.assessment === "classification_gap"
                ? "Likely classification issue: CA appears sparse while US/null and shared-region rows are high. Prioritize country/tag remapping before net-new writing."
                : qbIntel.alliedCanada.assessment === "true_inventory_gap"
                  ? "Likely true inventory gap: CA-tagged allied rows are genuinely low. Plan content recovery/import."
                  : "No acute classification-only issue detected; treat as mixed/healthy inventory."}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <Link href="/admin/questions?exam=ALLIED" className="text-primary underline">
                Open Allied question queue
              </Link>
              <Link href="/api/admin/question-bank-remediation" className="text-primary underline">
                JSON remediation intelligence
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {npCoverage ? (
        <section className="mt-8 nn-card p-6">
          <h2 className="text-lg font-semibold">NP Canada triage actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reporting-only prioritization from published NP CA rows. Use this to queue writing/upgrades, not to auto-generate filler.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">NP published</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{npCoverage.totals.published}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">HTTPS images</p>
              <p className="mt-1 text-xl font-bold tabular-nums">
                {npCoverage.totals.withHttpsImages} / {npCoverage.totals.withoutHttpsImages}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Topics below floor</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{npCoverage.deficits.topicsBelowThreshold.length}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Highest-risk topic gaps</p>
              <ul className="mt-2 space-y-1 text-sm">
                {npCoverage.nextActions.highestRiskTopicGaps.slice(0, 8).map((r) => (
                  <li key={r.topic} className="flex justify-between rounded bg-rose-50 px-2 py-1 dark:bg-rose-950/20">
                    <span className="truncate pr-2">{r.topic}</span>
                    <span className="tabular-nums">-{r.deficit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Weakest stem coverage</p>
              <ul className="mt-2 space-y-1 text-sm">
                {npCoverage.nextActions.weakestStemTypeCoverage.slice(0, 8).map((r) => (
                  <li key={r.stemType} className="flex justify-between rounded bg-amber-50 px-2 py-1 dark:bg-amber-950/20">
                    <span className="truncate pr-2">{r.stemType}</span>
                    <span className="tabular-nums">{r.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Depth upgrades (enough volume)</p>
              <ul className="mt-2 space-y-1 text-sm">
                {npCoverage.nextActions.weakTeachingDepthWithVolume.slice(0, 8).map((r) => (
                  <li key={r.topic} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                    <span className="truncate pr-2">{r.topic}</span>
                    <span className="tabular-nums">{Math.round(r.lackingRate * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/admin/questions?exam=NP" className="text-primary underline">
              Open NP question editor queue
            </Link>
            <Link href="/api/admin/np-coverage" className="text-primary underline">
              JSON NP coverage payload
            </Link>
          </div>
        </section>
      ) : null}

      <QuestionQualityQueueTable />

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Related</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>
            <Link className="text-primary underline" href="/api/admin/diagnostics">
              GET /api/admin/diagnostics
            </Link>{" "}
            (JSON, admin session required)
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/gaps">
              GET /api/admin/gaps
            </Link>{" "}
            — extended coverage gaps
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/np-coverage">
              GET /api/admin/np-coverage
            </Link>{" "}
            — NP Canada triage signals + prioritized next actions
          </li>
          <li>
            <Link className="text-primary underline" href="/admin">
              Admin operations dashboard
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Database, Flame, ShieldAlert } from "lucide-react";
import type { AdminCommandCenterData } from "@/lib/admin/load-admin-command-center";
import type { ContentQualityCorpusPayload } from "@/lib/admin/content-quality-corpus-refresh";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import { AdminSimpleBarChart } from "@/components/admin/admin-simple-bar-chart";
import { RATIONALE_MIN_WORDS } from "@/lib/content-quality/standards";

function fmt(n: number) {
  return n.toLocaleString();
}

function examTierBar(
  corpus: ContentQualityCorpusPayload | null,
  snapshotEq: AdminCommandCenterData["contentQuality"]["snapshot"]["examQuestionsPublished"],
) {
  if (corpus) {
    const t = corpus.examQuestions.totals;
    const sum = t.missing + t.thin + t.acceptable + t.strong;
    if (sum <= 0) return null;
    const pct = (n: number) => (n / sum) * 100;
    return (
      <div className="flex h-3 w-full max-w-xl overflow-hidden rounded-full bg-muted" role="img" aria-label="Exam rationale tier distribution">
        <span className="bg-rose-500/85" style={{ width: `${pct(t.missing)}%` }} title="Missing" />
        <span className="bg-amber-500/85" style={{ width: `${pct(t.thin)}%` }} title="Thin" />
        <span className="bg-sky-600/75" style={{ width: `${pct(t.acceptable)}%` }} title="Acceptable" />
        <span className="bg-emerald-600/90" style={{ width: `${pct(t.strong)}%` }} title="Strong" />
      </div>
    );
  }
  const total = snapshotEq.total;
  if (total <= 0) return null;
  const pct = (n: number) => (n / total) * 100;
  return (
    <div className="flex h-3 w-full max-w-xl overflow-hidden rounded-full bg-muted" role="img" aria-label="Exam rationale depth (snapshot)">
      <span className="bg-rose-500/85" style={{ width: `${pct(snapshotEq.rationaleMissingOrEmpty)}%` }} title="Missing" />
      <span className="bg-amber-500/85" style={{ width: `${pct(snapshotEq.rationaleThinWords)}%` }} title="Thin" />
      <span className="bg-emerald-600/90" style={{ width: `${pct(snapshotEq.rationaleAcceptableOrStrong)}%` }} title="Acceptable or strong" />
    </div>
  );
}

function severityIcon(sev: AdminCommandCenterData["needsAttention"][0]["severity"]) {
  if (sev === "critical") return <ShieldAlert className="h-4 w-4 text-rose-600" aria-hidden />;
  if (sev === "warning") return <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />;
  return <CheckCircle2 className="h-4 w-4 text-sky-600" aria-hidden />;
}

function MetricTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm ${accent ?? ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function AdminCommandCenter({ data }: { data: AdminCommandCenterData }) {
  const t = data.stats?.totals;
  const dbOk = data.diagnostics?.dbHealth.status === "ok";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.12] via-[var(--theme-card-bg)] to-emerald-500/[0.08] p-6 shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/90">NurseNest command center</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
              Platform health & growth
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Live database metrics, subscription signals, content pipeline, and SEO backlog — one surface for daily ops.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                dbOk ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100" : "bg-rose-500/15 text-rose-900 dark:text-rose-100"
              }`}
            >
              <Database className="h-3.5 w-3.5" aria-hidden />
              DB {dbOk ? "connected" : "check"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-black/5 px-3 py-1.5 text-xs font-medium dark:bg-white/10">
              <Activity className="h-3.5 w-3.5" aria-hidden />
              Updated {new Date(data.generatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <MetricTile
            label="Total users"
            value={fmt(data.users.total)}
            hint={`${fmt(data.users.learners)} learners`}
            accent="ring-1 ring-cyan-500/15"
          />
          <MetricTile
            label="Daily active (24h)"
            value={fmt(t?.dailyActiveUsers ?? 0)}
            hint="Attempts, sessions, or progress"
            accent="ring-1 ring-emerald-500/15"
          />
          <MetricTile label="New today" value={fmt(data.users.newToday)} hint="UTC day boundary" />
          <MetricTile label="New this week" value={fmt(data.users.newThisWeek)} />
          <MetricTile label="Active subscriptions" value={fmt(data.subscriptions.active + data.subscriptions.grace)} hint="ACTIVE + GRACE" />
          <MetricTile
            label="Past-due subs"
            value={fmt(data.subscriptions.pastDue)}
            hint={data.subscriptions.pastDue > 0 ? "Review billing" : "None"}
            accent={data.subscriptions.pastDue > 0 ? "ring-1 ring-amber-500/25" : undefined}
          />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Conversion (learners → ever subscribed):{" "}
          {t?.conversionRatePct != null ? `${t.conversionRatePct}%` : "—"} · Trial active: {fmt(data.users.trialActive)}
        </p>
      </section>

      <AdminQuickActions />

      {data.needsAttention.length > 0 ? (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-600" aria-hidden />
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Needs attention</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Ranked by severity — tackle critical items first.</p>
          <ul className="mt-4 space-y-3">
            {data.needsAttention.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-border/60 bg-[var(--theme-card-bg)] p-3"
              >
                <span className="mt-0.5">{severityIcon(item.severity)}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                  {item.href ? (
                    <Link href={item.href} className="mt-2 inline-block text-sm font-semibold text-primary underline">
                      Open
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <AdminSimpleBarChart
          title="Signups (14d)"
          subtitle="New user registrations per day"
          points={data.charts.signupsByDay}
          accentClass="bg-gradient-to-t from-cyan-600/90 to-primary/70"
        />
        <AdminSimpleBarChart
          title="New subscriptions (14d)"
          subtitle="Stripe subscription rows created"
          points={data.charts.subscriptionsByDay}
          accentClass="bg-gradient-to-t from-emerald-600/90 to-teal-500/70"
        />
      </section>

      <section className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.05] via-[var(--theme-card-bg)] to-rose-500/[0.06] p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Content quality & editorial</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Publish rules require ≥{RATIONALE_MIN_WORDS} words of rationale (and lesson depth targets) before going live.
              Run a full corpus snapshot off-peak for worst exams and pathways.
            </p>
          </div>
          <Link
            href="/admin/content-quality"
            className="shrink-0 rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
          >
            Workbench →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exam bank — rationale tiers</p>
            {examTierBar(data.contentQuality.corpus, data.contentQuality.snapshot.examQuestionsPublished) ?? (
              <p className="mt-2 text-sm text-muted-foreground">No published exam questions in scope.</p>
            )}
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              {data.contentQuality.corpus ? (
                <>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-500/85 align-middle" /> Missing{" "}
                    {fmt(data.contentQuality.corpus.examQuestions.totals.missing)}
                  </li>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500/85 align-middle" /> Thin{" "}
                    {fmt(data.contentQuality.corpus.examQuestions.totals.thin)}
                  </li>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-sky-600/75 align-middle" /> OK{" "}
                    {fmt(data.contentQuality.corpus.examQuestions.totals.acceptable)}
                  </li>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600/90 align-middle" /> Strong{" "}
                    {fmt(data.contentQuality.corpus.examQuestions.totals.strong)}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-rose-500/85 align-middle" /> Missing{" "}
                    {fmt(data.contentQuality.snapshot.examQuestionsPublished.rationaleMissingOrEmpty)}
                  </li>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500/85 align-middle" /> Thin{" "}
                    {fmt(data.contentQuality.snapshot.examQuestionsPublished.rationaleThinWords)}
                  </li>
                  <li>
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-600/90 align-middle" /> ≥{RATIONALE_MIN_WORDS}w{" "}
                    {fmt(data.contentQuality.snapshot.examQuestionsPublished.rationaleAcceptableOrStrong)}
                  </li>
                  <li className="text-amber-800 dark:text-amber-200">Full tier split — refresh corpus snapshot in workbench.</li>
                </>
              )}
            </ul>
            {data.contentQuality.corpus ? (
              <p className="mt-2 text-[11px] text-muted-foreground">
                Corpus scanned {fmt(data.contentQuality.corpus.examQuestions.scanned)} published rows · updated{" "}
                {new Date(data.contentQuality.corpus.generatedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Urgent fixes (thin + missing)</p>
            {data.contentQuality.corpus ? (
              <ul className="mt-2 space-y-2 text-sm">
                {data.contentQuality.corpus.examQuestions.worstExams.slice(0, 5).map((r) => (
                  <li key={r.exam} className="flex justify-between gap-2 rounded-lg border border-border/50 bg-[var(--theme-card-bg)] px-2 py-1.5">
                    <span className="truncate font-mono text-xs">{r.exam}</span>
                    <span className="shrink-0 tabular-nums text-amber-900 dark:text-amber-100">
                      {r.thin + r.missing} / {r.total}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Run corpus refresh to rank exams and pathways.</p>
            )}
          </div>
        </div>

        {data.contentQuality.corpus ? (
          <div className="mt-6 border-t border-border/60 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pathway lessons — worst rollups</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.contentQuality.corpus.pathwayLessons.byPathway.slice(0, 6).map((r) => (
                <li key={`${r.pathwayId}|${r.countryCode ?? "—"}|${r.tier ?? "—"}`} className="rounded-lg border border-border/50 bg-[var(--theme-card-bg)] px-2 py-1.5 text-xs">
                  <p className="truncate font-mono">{r.pathwayId}</p>
                  <p className="text-muted-foreground">
                    {r.countryCode ?? "—"} · {r.tier ?? "—"}
                  </p>
                  <p className="mt-1 tabular-nums font-medium text-amber-900 dark:text-amber-100">
                    thin {fmt(r.thin)} · miss {fmt(r.missing)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Users & roles</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">By country</p>
              <ul className="mt-2 space-y-1 text-sm">
                {data.users.byCountry.slice(0, 6).map((r) => (
                  <li key={r.country} className="flex justify-between">
                    <span>{r.country}</span>
                    <span className="tabular-nums">{fmt(r.count)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">By tier</p>
              <ul className="mt-2 space-y-1 text-sm">
                {data.users.byTier.slice(0, 8).map((r) => (
                  <li key={r.tier} className="flex justify-between">
                    <span>{r.tier}</span>
                    <span className="tabular-nums">{fmt(r.count)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Onboarding incomplete (learners): {fmt(data.users.onboardingIncomplete)} ·{" "}
            <Link className="font-medium text-primary underline" href="/admin/users">
              full user tables
            </Link>
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Stripe pricing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.stripe.configuredCells}/{data.stripe.totalCells} plan cells have{" "}
            <code className="rounded bg-muted px-1">STRIPE_PRICE_*</code> set.
          </p>
          {data.stripe.missingPriceEnvKeys.length > 0 ? (
            <ul className="mt-3 max-h-40 overflow-auto text-xs font-mono text-amber-900 dark:text-amber-100">
              {data.stripe.missingPriceEnvKeys.slice(0, 12).map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">All catalog cells configured.</p>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Content snapshot</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Pathway lessons (pub)</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.content.pathwayLessonsPublished)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">App lessons (pub)</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.content.lessonsContentItemsPublished)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Questions published</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.content.questionsPublished)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Blog posts</dt>
              <dd className="font-semibold tabular-nums">
                {fmt(data.content.blogPublished)} pub / {fmt(data.content.blogDraft)} draft / {fmt(data.content.blogScheduled)} sched
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Flashcards (pub)</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.content.flashcardsPublished)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Practice tests (all)</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.content.practiceTestsTotal)}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Learner activity (7d)</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Exam attempts</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.activity.examAttemptsLast7d)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Exam sessions</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.activity.examSessionsLast7d)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">CAT / adaptive sessions</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.activity.catSessionsLast7d)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Practice tests completed</dt>
              <dd className="font-semibold tabular-nums">{fmt(data.activity.practiceTestsCompletedLast7d)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">SEO & blog</h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span>
            Blog posts missing meta: <strong>{fmt(data.seo.blogMissingSeoFields)}</strong>
          </span>
          <span>
            Pathway lessons with empty SEO (sample query): <strong>{fmt(data.seo.pathwayLessonsWeakSeoSample)}</strong>
          </span>
          <span>
            App lessons missing SEO fields: <strong>{fmt(data.seo.contentLessonsWeakSeoSample)}</strong>
          </span>
          <span>
            Est. public lesson routes: <strong>{fmt(data.seo.estimatedPublicLessonRoutes)}</strong>
          </span>
        </div>
        {data.blog.overdueScheduled > 0 ? (
          <p className="mt-3 text-sm text-amber-800 dark:text-amber-200">
            {data.blog.overdueScheduled} scheduled post(s) past <code className="rounded bg-muted px-1">publishAt</code> — run{" "}
            <code className="rounded bg-muted px-1">promoteScheduledBlogPosts</code> or cron.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Pathway coverage (US sample)</h2>
          <Link href="/admin/content" className="text-sm font-semibold text-primary underline">
            Full coverage →
          </Link>
        </div>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Pathway</th>
                <th className="py-2 text-right">Lessons</th>
                <th className="py-2 text-right">Questions</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.pathwayCoveragePreview.map((row) => (
                <tr key={row.pathwayId} className="border-b border-border/40">
                  <td className="py-2 pr-2">{row.displayName}</td>
                  <td className="py-2 text-right tabular-nums">{fmt(row.lessonsPublished)}</td>
                  <td className="py-2 text-right tabular-nums">{fmt(row.questionsMatched)}</td>
                  <td className="py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        row.readiness === "ready"
                          ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                          : row.readiness === "partial"
                            ? "bg-amber-500/15 text-amber-900 dark:text-amber-100"
                            : "bg-rose-500/15 text-rose-900 dark:text-rose-100"
                      }`}
                    >
                      {row.readiness}
                    </span>
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

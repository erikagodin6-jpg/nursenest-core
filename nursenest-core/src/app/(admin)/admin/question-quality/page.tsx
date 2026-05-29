import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadQuestionQualityDashboard,
  type QuestionQualityDashboardRow,
} from "@/lib/questions/load-question-quality-dashboard.server";

export const dynamic = "force-dynamic";

function pct(value: number | null): string {
  if (value == null) return "—";
  return `${Math.round(value * 100)}%`;
}

function seconds(ms: number | null): string {
  if (ms == null) return "—";
  return `${Math.round(ms / 100) / 10}s`;
}

function severityClass(severity: QuestionQualityDashboardRow["severity"]): string {
  switch (severity) {
    case "critical":
      return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200";
    case "high":
      return "border-orange-500/30 bg-orange-500/10 text-orange-800 dark:text-orange-200";
    case "medium":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200";
    case "low":
      return "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200";
    default:
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
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

function FlagPill({ flag }: { flag: string }) {
  return (
    <span className="rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {flag.replaceAll("_", " ")}
    </span>
  );
}

function QuestionRow({ row }: { row: QuestionQualityDashboardRow }) {
  const strongestDistractor = row.distractors
    .filter((d) => !d.isCorrectOption)
    .sort((a, b) => b.selectionRate - a.selectionRate)[0];

  return (
    <article className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase ${severityClass(row.severity)}`}>
              {row.severity === "none" ? "healthy" : row.severity}
            </span>
            <span className="rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              {row.exam} · {row.tier} · {row.questionType}
            </span>
            {row.retirementCandidate ? (
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-200">
                retirement candidate
              </span>
            ) : null}
          </div>
          <h2 className="mt-3 text-sm font-semibold leading-relaxed text-[var(--theme-heading-text)]">{row.stem}</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            {row.bodySystem ?? "Unmapped body system"} · {row.topic ?? "Unmapped topic"} · {row.totalAttempts.toLocaleString()} attempts
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Health</p>
          <p className="text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{row.healthScore}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Correct response" value={pct(row.correctResponseRate)} />
        <Metric label="Difficulty index" value={pct(row.difficultyIndex)} />
        <Metric label="Discrimination" value={row.discriminationIndex == null ? "—" : row.discriminationIndex.toFixed(2)} />
        <Metric label="Avg response" value={seconds(row.averageResponseTimeMs)} />
        <Metric label="Reports" value={row.reportFrequency.toLocaleString()} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3 text-xs">
          <p className="font-semibold text-[var(--theme-heading-text)]">Distractor performance</p>
          <p className="mt-1 text-muted-foreground">
            Most selected wrong answer:{" "}
            <strong className="text-foreground">
              {row.mostSelectedWrongAnswer ?? "—"} {row.mostSelectedWrongAnswerRate == null ? "" : `(${pct(row.mostSelectedWrongAnswerRate)})`}
            </strong>
          </p>
          {strongestDistractor ? (
            <p className="mt-1 text-muted-foreground">
              Strongest distractor status: <strong className="text-foreground">{strongestDistractor.status.replaceAll("_", " ")}</strong>
            </p>
          ) : null}
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/15 p-3 text-xs">
          <p className="font-semibold text-[var(--theme-heading-text)]">Review signal</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {row.flags.length > 0 ? row.flags.map((flag) => <FlagPill key={flag} flag={flag} />) : <span className="text-muted-foreground">No active flags</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
    </div>
  );
}

export default async function AdminQuestionQualityPage() {
  await requireAdmin();
  const data = await loadQuestionQualityDashboard({ limit: 300 });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content analytics</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Question quality analytics</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Continuous psychometric monitoring from learner attempts, distractor selections, response time, and confusing-question reports.
            Use this queue to improve, retire, or temporarily remove weak items from adaptive and mock exam pools.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/api/admin/question-quality?limit=100" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Raw review queue
          </Link>
          <Link href="/admin/content-quality" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Content quality
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Analyzed questions" value={data.summary.analyzedQuestions.toLocaleString()} hint="Questions with learner performance aggregates." />
        <SummaryCard label="Question health" value={`${data.summary.averageHealthScore}/100`} hint="Composite of difficulty, discrimination, reports, and distractor performance." />
        <SummaryCard label="Flagged questions" value={data.summary.flaggedQuestions.toLocaleString()} hint="Items needing educator or psychometric review." />
        <SummaryCard label="Retirement candidates" value={data.summary.retirementCandidates.toLocaleString()} hint="Critical items to remove from CAT/mock pools until reviewed." />
      </section>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Flag heatmap</h2>
            <p className="text-sm text-muted-foreground">High counts show where content creation, distractor revision, or item retirement should start.</p>
          </div>
          <p className="text-xs text-muted-foreground">Generated {new Date(data.generatedAt).toLocaleString()}</p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(data.flagCounts).map(([flag, count]) => (
            <div key={flag} className="rounded-lg border border-border/60 bg-muted/15 p-3">
              <p className="text-xs font-semibold text-[var(--theme-heading-text)]">{flag.replaceAll("_", " ")}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{count.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">Review queue</h2>
            <p className="text-sm text-muted-foreground">Sorted by lowest health score and highest learner exposure.</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Avg correct response: {data.summary.averageCorrectResponseRate == null ? "—" : `${data.summary.averageCorrectResponseRate}%`} · Avg discrimination:{" "}
            {data.summary.averageDiscriminationIndex ?? "—"}
          </p>
        </div>
        <div className="space-y-4">
          {data.reviewQueue.length > 0 ? (
            data.reviewQueue.map((row) => <QuestionRow key={row.id} row={row} />)
          ) : (
            <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-6 text-sm text-muted-foreground">
              No flagged learner-performance issues are available yet. The queue will populate as attempt aggregates reach sample thresholds.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


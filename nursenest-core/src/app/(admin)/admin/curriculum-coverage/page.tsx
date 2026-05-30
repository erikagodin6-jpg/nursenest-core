import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadCurriculumCoverageDashboard } from "@/lib/curriculum-coverage/load-curriculum-coverage-dashboard.server";
import type {
  CurriculumContentType,
  CurriculumCoverageReport,
  CurriculumCoverageTopicRow,
} from "@/lib/curriculum-coverage/curriculum-coverage-intelligence";

export const dynamic = "force-dynamic";

const CONTENT_LABELS: Record<CurriculumContentType, string> = {
  questions: "Questions",
  flashcards: "Flashcards",
  lessons: "Lessons",
  simulations: "Simulations",
  ecg: "ECG",
  pharmacology: "Pharmacology",
  clinical_skills: "Clinical Skills",
};

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p>
    </div>
  );
}

function statusClass(status: CurriculumCoverageTopicRow["status"]) {
  switch (status) {
    case "missing":
      return "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200";
    case "weak":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200";
    case "overrepresented":
      return "border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-200";
    default:
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
  }
}

function HeatCell({ row }: { row: CurriculumCoverageTopicRow }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/15 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[var(--theme-heading-text)]">{row.label}</p>
          <p className="text-xs text-muted-foreground">
            {row.actualPercent}% actual · {row.targetPercent}% target
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusClass(row.status)}`}>
          {row.status}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, row.densityScore)}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
        <span>Density: {row.densityScore}/100</span>
        <span className="text-right">Items: {row.totalItems.toLocaleString()}</span>
      </div>
    </div>
  );
}

function CurriculumPanel({ report }: { report: CurriculumCoverageReport }) {
  const priorityRows = [...report.missingTopics, ...report.weakTopicAreas]
    .filter((row, index, arr) => arr.findIndex((candidate) => candidate.topicId === row.topicId) === index)
    .slice(0, 5);

  return (
    <section className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{report.audience}</p>
          <h2 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">{report.label}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {report.totalItems.toLocaleString()} mapped items · {report.weakTopicAreas.length} weak topic areas ·{" "}
            {report.overrepresentedTopics.length} overrepresented topics
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Coverage</p>
            <p className="text-lg font-bold tabular-nums">{report.coverageScore}/100</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">Density</p>
            <p className="text-lg font-bold tabular-nums">{report.densityScore}/100</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {report.heatMap.map((row) => (
          <HeatCell key={row.topicId} row={row} />
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-lg border border-border/60 bg-muted/15 p-4">
          <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Content density by activity</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(report.contentDensityScores).map(([type, score]) => (
              <div key={type} className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm">
                <span>{CONTENT_LABELS[type as CurriculumContentType]}</span>
                <span className="font-bold tabular-nums">{score}/100</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/60 bg-muted/15 p-4">
          <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Content creation priorities</h3>
          <div className="mt-3 space-y-2">
            {priorityRows.map((row) => (
              <div key={row.topicId} className="rounded-md bg-background px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{row.label}</p>
                  <span className="text-xs font-bold tabular-nums">{row.densityScore}/100</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{row.recommendation}</p>
              </div>
            ))}
            {priorityRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No missing or weak topics in this curriculum map.</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function AdminCurriculumCoveragePage() {
  await requireAdmin();
  const data = await loadCurriculumCoverageDashboard();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Curriculum intelligence</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Curriculum coverage intelligence</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Map learner-accessible questions, flashcards, lessons, simulations, ECG, pharmacology, and clinical-skill
            assets to exam and competency curricula so content development priorities are visible before gaps reach learners.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blueprint-compliance" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
            Blueprint compliance
          </Link>
          <Link href="/admin/scope-compliance" className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">
            Scope compliance
          </Link>
        </div>
      </div>

      {data.degraded ? (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-100">
          Database coverage signals were unavailable, so the report is using static pharmacology and clinical-skill maps only.
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Curricula audited" value={data.summary.curriculaAudited.toLocaleString()} hint="NCLEX, REx-PN, CNPLE, HESI, TEAS, RT, and New Grad." />
        <SummaryCard label="Mapped items" value={data.summary.totalMappedItems.toLocaleString()} hint="Total content-to-curriculum mappings in this run." />
        <SummaryCard label="Coverage score" value={`${data.summary.averageCoverageScore}/100`} hint="Average distribution score across all curricula." />
        <SummaryCard label="Weak topics" value={data.summary.weakTopicAreas.toLocaleString()} hint="Topics below density or target representation." />
        <SummaryCard label="Overrepresented" value={data.summary.overrepresentedTopics.toLocaleString()} hint="Topics that may be crowding out weaker areas." />
      </section>

      <div className="mt-6 space-y-6">
        {data.reports.map((report) => (
          <CurriculumPanel key={report.curriculumKey} report={report} />
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
        <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Unmapped taxonomy signals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These rows had content but could not be mapped confidently. Use them to clean topic tags, pathway IDs, and category labels.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.unmappedSignals.slice(0, 18).map((signal) => (
            <div key={`${signal.contentType}-${signal.label}`} className="rounded-lg border border-border/60 bg-muted/15 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {CONTENT_LABELS[signal.contentType]} · {signal.count.toLocaleString()}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--theme-heading-text)]">{signal.label}</p>
            </div>
          ))}
          {data.unmappedSignals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No unmapped signals in this audit window.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}

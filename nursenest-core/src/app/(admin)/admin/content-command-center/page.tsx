import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import {
  loadContentQualityCommandCenter,
  type ContentQualityCommandCenter,
} from "@/lib/content-quality/load-content-quality-command-center.server";
import type { ContentReviewQueueItem, ReviewQueuePriority } from "@/lib/content-quality/content-quality-intelligence-engine";

export const dynamic = "force-dynamic";

function scoreTone(score: number): string {
  if (score >= 85) return "text-[var(--semantic-success)]";
  if (score >= 70) return "text-[var(--semantic-warning)]";
  return "text-[var(--semantic-danger)]";
}

function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className={`mt-3 text-3xl font-bold ${tone ?? "text-[var(--semantic-text-primary)]"}`}>{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{detail}</p>
    </div>
  );
}

function QualityPanels({ data }: { data: ContentQualityCommandCenter }) {
  return (
    <section className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Quality engines</h2>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">
            Question, rationale, scope, curriculum, lesson, flashcard, pharmacology, and clinical-skill quality.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--semantic-brand)] underline" href="/admin/content-quality">
          Open remediation audit
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {data.qualityPanels.map((panel) => (
          <div key={panel.id} className="rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{panel.label}</p>
            <p className={`mt-2 text-2xl font-bold ${scoreTone(panel.score)}`}>{formatScore(panel.score)}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">
              {panel.count.toLocaleString()} items scanned, {panel.critical.toLocaleString()} poor or critical.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewQueueTable({
  title,
  priority,
  rows,
}: {
  title: string;
  priority: ReviewQueuePriority;
  rows: ContentReviewQueueItem[];
}) {
  return (
    <section className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{title}</h2>
          <p className="text-sm text-[var(--semantic-text-secondary)]">{priority} priority review queue</p>
        </div>
        <span className="rounded-full bg-[var(--semantic-surface-subtle)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
          {rows.length.toLocaleString()} items
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[var(--semantic-text-muted)]">
            <tr>
              <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Item</th>
              <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Type</th>
              <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Pathway</th>
              <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Topic</th>
              <th className="border-b border-[var(--semantic-border)] py-3 pr-4">Score</th>
              <th className="border-b border-[var(--semantic-border)] py-3">Reason</th>
            </tr>
          </thead>
          <tbody className="text-[var(--semantic-text-secondary)]">
            {rows.slice(0, 12).map((row) => (
              <tr key={`${priority}-${row.itemId}-${row.reason}`}>
                <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4 font-mono text-xs">
                  {row.itemId}
                </td>
                <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{row.contentType}</td>
                <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{row.pathway}</td>
                <td className="border-b border-[var(--semantic-border-muted)] py-3 pr-4">{row.topic}</td>
                <td className={`border-b border-[var(--semantic-border-muted)] py-3 pr-4 font-semibold ${scoreTone(row.qualityScore)}`}>
                  {formatScore(row.qualityScore)}
                </td>
                <td className="border-b border-[var(--semantic-border-muted)] py-3">{row.reason}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="py-5 text-[var(--semantic-text-muted)]" colSpan={6}>
                  No items currently assigned to this queue.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CoveragePanel({ data }: { data: ContentQualityCommandCenter }) {
  const coverage = Object.entries(data.report.curriculumCoverage).sort((a, b) => b[1].contentCount - a[1].contentCount);

  return (
    <section className="rounded-2xl border border-[var(--semantic-border)] bg-[var(--semantic-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Curriculum coverage</h2>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">
            Lightweight CQIE target mapping for NCLEX, REx-PN, CNPLE, RT, TEAS, HESI, and New Grad competencies.
          </p>
        </div>
        <Link className="text-sm font-semibold text-[var(--semantic-brand)] underline" href="/admin/curriculum-coverage">
          Open coverage intelligence
        </Link>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {coverage.slice(0, 8).map(([target, row]) => (
          <div key={target} className="rounded-xl border border-[var(--semantic-border)] bg-[var(--semantic-surface-subtle)] p-4">
            <p className="font-semibold text-[var(--semantic-text-primary)]">{target}</p>
            <p className="mt-2 text-2xl font-bold text-[var(--semantic-brand)]">{row.contentCount.toLocaleString()}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--semantic-text-muted)]">
              {row.topics.slice(0, 3).join(", ") || "No topics mapped yet"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ContentCommandCenterPage() {
  await requireAdmin();
  const data = await loadContentQualityCommandCenter();
  const critical = data.report.reviewQueues.Critical.length;
  const high = data.report.reviewQueues.High.length;
  const needsReview = data.report.items.filter((item) => item.qualityBand === "Needs Review").length;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8" data-testid="content-command-center">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Content governance</p>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] md:text-3xl">
            Content Quality Intelligence Engine
          </h1>
          <p className="text-sm leading-7 text-[var(--semantic-text-secondary)]">
            Automated quality scoring and review queues across questions, flashcards, lessons, clinical skills,
            pharmacology, ECG, simulations, CAT, LOFT, study plans, and remediation content.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-full border border-[var(--semantic-border)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]" href="/admin/question-quality">
            Question analytics
          </Link>
          <Link className="rounded-full border border-[var(--semantic-border)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]" href="/admin/scope-compliance">
            Scope compliance
          </Link>
        </div>
      </header>

      {data.degraded ? (
        <div className="rounded-2xl border border-[var(--semantic-warning)] bg-[var(--semantic-surface)] p-4 text-sm text-[var(--semantic-warning-contrast)]" role="status">
          CQIE is running in degraded mode. {data.notes.join(" ")}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" aria-label="CQIE scorecard">
        <MetricCard
          label="Overall quality"
          value={formatScore(data.report.overallQualityScore)}
          detail={`${data.report.totalItems.toLocaleString()} content objects scanned`}
          tone={scoreTone(data.report.overallQualityScore)}
        />
        <MetricCard
          label="Scope alignment"
          value={formatScore(data.report.scopeAlignmentScore)}
          detail="Entry-to-practice and specialty leakage checks"
          tone={scoreTone(data.report.scopeAlignmentScore)}
        />
        <MetricCard label="Critical queue" value={critical.toLocaleString()} detail="Immediate content review items" tone={scoreTone(critical === 0 ? 100 : 45)} />
        <MetricCard label="High queue" value={high.toLocaleString()} detail="High-impact rationale, scope, or quality issues" tone={scoreTone(high === 0 ? 100 : 65)} />
        <MetricCard label="Needs review" value={needsReview.toLocaleString()} detail="Moderate quality-risk items" tone={scoreTone(needsReview === 0 ? 100 : 72)} />
      </section>

      <QualityPanels data={data} />
      <CoveragePanel data={data} />

      <section className="grid gap-4 lg:grid-cols-2">
        <ReviewQueueTable title="Critical Queue" priority="Critical" rows={data.report.reviewQueues.Critical} />
        <ReviewQueueTable title="High Priority Queue" priority="High" rows={data.report.reviewQueues.High} />
        <ReviewQueueTable title="Medium Priority Queue" priority="Medium" rows={data.report.reviewQueues.Medium} />
        <ReviewQueueTable title="Low Priority Queue" priority="Low" rows={data.report.reviewQueues.Low} />
      </section>
    </main>
  );
}

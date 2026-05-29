import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { loadContentQualityReport } from "@/lib/admin/content-quality-intelligence";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Content Quality Intelligence · Admin" };

function pct(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</h2>
  );
}

function IssueTag({ severity }: { severity: "high" | "medium" | "low" }) {
  const cls =
    severity === "high"
      ? "bg-red-50 text-red-700 border-red-200"
      : severity === "medium"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${cls}`}>
      {severity}
    </span>
  );
}

export default async function ContentQualityPage() {
  await requireAdmin();

  const report = isDatabaseUrlConfigured() ? await loadContentQualityReport() : null;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Content Quality Intelligence</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Identifies flashcards and questions with unusually high miss rates, slow answer times, or low confidence —
            potential indicators of content issues. Based on the last 30 days.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/analytics" className="text-muted-foreground underline">← Analytics</Link>
          <a href="/api/admin/analytics/content-quality" className="text-primary underline" target="_blank">Raw JSON</a>
        </div>
      </div>

      {!report ? (
        <div className="mt-8 rounded-xl border border-border px-5 py-10 text-center text-sm text-muted-foreground">
          Content quality data unavailable. Ensure the database is connected and activity data exists.
        </div>
      ) : (
        <div className="mt-8 space-y-10">

          {/* Potential issue flags */}
          {report.potentialIssueFlags.length > 0 && (
            <section>
              <SectionHead>⚠️ Potential Content Issues ({report.potentialIssueFlags.length})</SectionHead>
              <div className="rounded-2xl border border-border overflow-hidden">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 text-left">Severity</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Topic</th>
                      <th className="px-4 py-3 text-left">Issue</th>
                      <th className="px-4 py-3 text-left">Metric</th>
                      <th className="px-4 py-3 text-left">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {report.potentialIssueFlags.map((flag) => (
                      <tr key={flag.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3"><IssueTag severity={flag.severity} /></td>
                        <td className="px-4 py-3 text-xs uppercase text-muted-foreground">{flag.kind}</td>
                        <td className="px-4 py-3 text-xs text-[var(--theme-heading-text)]">{flag.topic ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[260px]">{flag.issue}</td>
                        <td className="px-4 py-3 text-xs font-semibold tabular-nums text-[var(--theme-heading-text)]">{flag.metric}</td>
                        <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{flag.id.slice(0, 14)}…</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Most missed questions */}
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <SectionHead>Most Missed Questions (30d)</SectionHead>
              <ContentTable
                items={report.mostMissedQuestions}
                metricLabel="Miss rate"
                metricFn={(i) => pct(i.incorrectRate)}
                attemptsFn={(i) => i.totalAttempts}
              />
            </section>

            <section>
              <SectionHead>Most Missed Flashcards</SectionHead>
              <ContentTable
                items={report.mostMissedFlashcards}
                metricLabel="Miss rate"
                metricFn={(i) => pct(i.incorrectRate)}
                attemptsFn={(i) => i.totalAttempts}
              />
            </section>
          </div>

          {/* Topic performance */}
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <SectionHead>Lowest Correct-Rate Topics (30d)</SectionHead>
              <ConfidenceTable items={report.lowestConfidenceTopics} />
            </section>
            <section>
              <SectionHead>Highest Correct-Rate Topics (30d)</SectionHead>
              <ConfidenceTable items={report.highestConfidenceTopics} />
            </section>
          </div>

          <p className="text-right text-xs text-muted-foreground">
            Generated {new Date(report.generatedAt).toLocaleString()} · 30-day window · min 10 attempts per item
          </p>
        </div>
      )}
    </main>
  );
}

type MissedItem = { id: string; topic: string | null; incorrectCount: number; totalAttempts: number; incorrectRate: number };

function ContentTable({
  items,
  metricLabel,
  metricFn,
  attemptsFn,
}: {
  items: MissedItem[];
  metricLabel: string;
  metricFn: (i: MissedItem) => string;
  attemptsFn: (i: MissedItem) => number;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">No items above threshold.</p>;
  }
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5 text-left">Topic</th>
            <th className="px-4 py-2.5 text-left">{metricLabel}</th>
            <th className="px-4 py-2.5 text-left">Attempts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/20">
              <td className="px-4 py-2.5 text-xs">{item.topic ?? "—"}</td>
              <td className="px-4 py-2.5 text-xs font-semibold tabular-nums text-red-600">{metricFn(item)}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{attemptsFn(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ConfidenceItem = { topic: string; avgCorrectRate: number; totalAttempts: number };

function ConfidenceTable({ items }: { items: ConfidenceItem[] }) {
  if (items.length === 0) return <p className="text-xs text-muted-foreground">No data available yet.</p>;
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2.5 text-left">Topic</th>
            <th className="px-4 py-2.5 text-left">Correct rate</th>
            <th className="px-4 py-2.5 text-left">Attempts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.topic} className="hover:bg-muted/20">
              <td className="px-4 py-2.5 text-xs">{item.topic}</td>
              <td className="px-4 py-2.5 text-xs font-semibold tabular-nums">{pct(item.avgCorrectRate)}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{item.totalAttempts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

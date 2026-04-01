import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";
import { loadContentQualityCorpusPayload } from "@/lib/admin/content-quality-corpus-refresh";
import { loadRemediationReport } from "@/lib/admin/content-quality-remediation";
import { RATIONALE_MIN_WORDS, LESSON_MIN_WORDS } from "@/lib/content-quality/standards";
import { ContentQualityRefreshButton } from "@/components/admin/content-quality-refresh-button";

export const dynamic = "force-dynamic";

export default async function AdminContentQualityPage() {
  await requireAdmin();
  const [snapshot, corpus, remediation] = await Promise.all([
    loadContentQualitySnapshot(),
    loadContentQualityCorpusPayload(),
    loadRemediationReport(),
  ]);

  const eq = snapshot.examQuestionsPublished;
  const strongPct =
    eq.total > 0 ? Math.round((eq.rationaleAcceptableOrStrong / eq.total) * 1000) / 10 : 0;
  const thinPct = eq.total > 0 ? Math.round((eq.rationaleThinWords / eq.total) * 1000) / 10 : 0;
  const missingPct = eq.total > 0 ? Math.round((eq.rationaleMissingOrEmpty / eq.total) * 1000) / 10 : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Editorial governance</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">Content quality workbench</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Thin rationales and lessons hurt SEO and conversion. Publish rules block low-quality releases unless you
            explicitly override; use this page to prioritize fixes by exam and recency.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ContentQualityRefreshButton />
          <Link
            href="/admin"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            ← Command center
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-medium text-muted-foreground">Published questions</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{eq.total}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Strong/acceptable (≥{RATIONALE_MIN_WORDS}w): <strong>{strongPct}%</strong>
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
          <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Thin rationale</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{eq.rationaleThinWords}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {thinPct}% of bank · <span className="font-medium text-foreground">Urgent SEO risk</span>
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4">
          <p className="text-xs font-medium text-rose-900 dark:text-rose-100">Missing rationale</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{eq.rationaleMissingOrEmpty}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{missingPct}% · blocks publish by default</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-medium text-muted-foreground">Pathway lessons (total)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{snapshot.pathwayLessonsPublished.total}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Target depth ≥{LESSON_MIN_WORDS} words · full scan in corpus snapshot
          </p>
        </div>
      </section>

      {corpus ? (
        <section className="mt-8 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Full-corpus snapshot</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Updated {new Date(corpus.generatedAt).toLocaleString()} — pathway lessons scanned {corpus.pathwayLessons.scanned},
            content items {corpus.contentItemLessons.scanned}, exam rows {corpus.examQuestions.scanned}.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Worst exams (thin + missing)</p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-sm">
                {corpus.examQuestions.worstExams.slice(0, 12).map((r) => (
                  <li key={r.exam} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                    <span className="font-mono text-xs">{r.exam}</span>
                    <span className="tabular-nums text-amber-800 dark:text-amber-200">
                      {r.thin + r.missing} / {r.total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pathway rollups (most thin)</p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-sm">
                {corpus.pathwayLessons.byPathway.slice(0, 12).map((r) => (
                  <li key={r.pathwayId + String(r.countryCode)} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                    <span className="truncate pr-2 font-mono text-xs">{r.pathwayId}</span>
                    <span className="tabular-nums">
                      thin {r.thin} · miss {r.missing}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
          No corpus snapshot yet. Click <strong>Refresh corpus snapshot</strong> to run a full scan (safe to run off-peak).
        </section>
      )}

      {remediation ? (
        <section className="mt-8 space-y-8">
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Thin or missing rationales — by exam</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sorted by count of items below {RATIONALE_MIN_WORDS} words (or empty). Cross-check with corpus “worst exams” after refresh.
            </p>
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-2">Exam</th>
                    <th className="py-2 text-right">Thin / missing</th>
                    <th className="py-2 text-right">Total pub.</th>
                  </tr>
                </thead>
                <tbody>
                  {remediation.thinQuestionsByExam.slice(0, 20).map((r) => (
                    <tr key={r.exam} className="border-b border-border/40">
                      <td className="py-2 font-mono text-xs">{r.exam}</td>
                      <td className="py-2 text-right tabular-nums text-amber-900 dark:text-amber-100">{r.thinOrMissing}</td>
                      <td className="py-2 text-right tabular-nums">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Thin rationales — sample (lowest word count)</h2>
            <p className="mt-1 text-sm text-muted-foreground">{remediation.priorityMessage}</p>
            <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
              {remediation.thinQuestionsSample.map((r) => (
                <li key={r.id} className="rounded border border-border/50 px-2 py-1.5">
                  <div className="flex flex-wrap justify-between gap-1">
                    <span className="font-mono text-xs">{r.id.slice(0, 8)}…</span>
                    <span className="text-xs text-muted-foreground">{r.wordCount}w</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{r.topic ?? "—"} · {r.exam}</p>
                  <a
                    className="text-xs font-semibold text-primary underline"
                    href={`/api/admin/questions/${r.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    JSON (admin)
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Newest low-quality edits</h2>
            <ul className="mt-3 max-h-64 space-y-2 overflow-auto text-sm">
              {remediation.newestPoorQuestions.map((r) => (
                <li key={r.id} className="rounded border border-border/50 px-2 py-1.5">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{r.tier}</span>
                  <div className="flex justify-between gap-2">
                    <span className="font-mono text-xs">{r.id.slice(0, 8)}…</span>
                    <span className="text-xs">{r.wordCount}w</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.exam}</p>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <a className="text-xs font-semibold text-primary underline" href={`/admin/questions?focus=${r.id}`}>
                      Review queue
                    </a>
                    <a
                      className="text-xs font-semibold text-primary underline"
                      href={`/api/admin/questions/${r.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      JSON (admin)
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Weak stems by exam (published)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Calm writing-quality signal. Short stems can still pass structure checks but often underperform editorially.
            </p>
            <div className="mt-4 overflow-auto">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-2">Exam</th>
                    <th className="py-2 text-right">Weak stems</th>
                    <th className="py-2 text-right">Total</th>
                    <th className="py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {remediation.weakStemByExam.slice(0, 16).map((r) => (
                    <tr key={r.exam} className="border-b border-border/40">
                      <td className="py-2 font-mono text-xs">{r.exam}</td>
                      <td className="py-2 text-right tabular-nums">{r.weakStem}</td>
                      <td className="py-2 text-right tabular-nums">{r.total}</td>
                      <td className="py-2 text-right">
                        <a className="text-xs font-semibold text-primary underline" href={`/admin/questions?exam=${encodeURIComponent(r.exam)}`}>
                          Open exam queue
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Top weak topic clusters</h2>
            <p className="mt-1 text-sm text-muted-foreground">Grouped by exam + topic for targeted remediation batches.</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {remediation.weakByTopic.slice(0, 20).map((r) => (
                <li key={`${r.exam}|${r.topic}`} className="rounded border border-border/50 px-3 py-2 text-sm">
                  <p className="font-medium">{r.topic}</p>
                  <p className="text-xs text-muted-foreground">{r.exam} · weak {r.weakCount}</p>
                  <a
                    className="mt-1 inline-block text-xs font-semibold text-primary underline"
                    href={`/admin/questions?exam=${encodeURIComponent(r.exam)}&topic=${encodeURIComponent(r.topic)}`}
                  >
                    Open topic queue
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-5 lg:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Thin content-item lessons (recent)</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {remediation.thinContentLessonsSample.map((r) => (
                <li key={r.id} className="rounded border border-border/50 px-3 py-2 text-sm">
                  <span className="line-clamp-2 font-medium">{r.title}</span>
                  <p className="text-xs text-muted-foreground">{r.wordCount} words · {new Date(r.updatedAt).toLocaleDateString()}</p>
                  <a
                    className="mt-1 inline-block text-xs font-semibold text-primary underline"
                    href={`/api/admin/lessons/${r.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    JSON + quality (admin)
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </section>
      ) : null}

      <section className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.04] p-5 text-sm">
        <h2 className="font-semibold text-[var(--theme-heading-text)]">Publish rules (active)</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
          <li>
            Exam questions: publishing requires ≥{RATIONALE_MIN_WORDS} words in combined rationale + key teaching fields unless{" "}
            <code className="rounded bg-muted px-1">acknowledgeBelowQualityBar: true</code> on POST/PATCH.
          </li>
          <li>
            Missing rationale is treated as severe incompleteness and requires explicit opt-in{" "}
            <code className="rounded bg-muted px-1">acknowledgeSevereQualityIssue: true</code> if you must publish anyway.
          </li>
          <li>Content-item lessons: same pattern for body depth vs tier thresholds.</li>
          <li>Bulk publish to PUBLISHED skips rows that fail the bar — fix individually or use overrides.</li>
          <li>AI draft promotion to the bank is blocked until the draft meets the bar (promotes as DRAFT only).</li>
        </ul>
      </section>
    </main>
  );
}

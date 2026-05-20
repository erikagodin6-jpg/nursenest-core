import Link from "next/link";
import type { AdminObservabilityHub } from "@/lib/admin/load-admin-observability-hub";

function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

function Tile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-[var(--semantic-text-secondary)]">{hint}</p> : null}
    </div>
  );
}

export function AdminObservabilityHubMetrics({ hub }: { hub: AdminObservabilityHub }) {
  const s = hub.studySystemsLast7d;
  const f = hub.flashcardHealth;
  const sub = hub.subscriptions;
  const pr = hub.pathwayReadiness;
  const c = hub.contentSignals;
  const tools = hub.deepTools;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Study systems (last 7 days)</h2>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Real learner activity (demo users excluded where relations exist). CAT-like = exam sessions with adaptive state.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Tile label="Exam attempts" value={fmt(s.examAttempts)} hint="Graded attempts" />
          <Tile label="Exam sessions" value={fmt(s.examSessions)} hint="Session rows touched" />
          <Tile label="CAT / adaptive sessions" value={fmt(s.catLikeAdaptiveSessions)} hint="adaptive_state set" />
          <Tile label="Flashcard sessions" value={fmt(s.flashcardStudySessions)} hint="Deck study rows updated" />
          <Tile label="Practice tests done" value={fmt(s.practiceTestsCompleted)} hint="Completed status" />
          <Tile label="ECG practice attempts" value={fmt(s.ecgPracticeAttempts)} hint="Video question attempts" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)]/25 p-5">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Subscriptions &amp; trials</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Active subs</dt>
              <dd className="font-semibold tabular-nums">{fmt(sub.active)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Grace</dt>
              <dd className="font-semibold tabular-nums">{fmt(sub.grace)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Past due</dt>
              <dd className="font-semibold tabular-nums">{fmt(sub.pastDue)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Trials active</dt>
              <dd className="font-semibold tabular-nums">{fmt(sub.trialActiveLearners)}</dd>
            </div>
            <div className="flex justify-between gap-3 sm:col-span-2">
              <dt className="text-[var(--semantic-text-secondary)]">Learners (excl. demo)</dt>
              <dd className="font-semibold tabular-nums">{fmt(sub.learnersTotal)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <Link className="text-[var(--semantic-brand)] underline" href="/admin/analytics/subscriptions">
              Subscription analytics
            </Link>
            <span className="text-[var(--semantic-text-muted)]">·</span>
            <Link className="text-[var(--semantic-brand)] underline" href="/admin/subscriptions">
              Revenue &amp; subs
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)]/20 p-5">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Premium &amp; gating</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">
            Deterrence rollups and availability live on dedicated admin pages — avoid duplicating sensitive payloads here.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            <li>
              <Link href="/admin/premium-protection" className="font-semibold text-[var(--semantic-brand)] underline">
                Premium protection
              </Link>
            </li>
            <li>
              <Link href="/admin/product-availability" className="font-semibold text-[var(--semantic-brand)] underline">
                Product availability
              </Link>
            </li>
            <li>
              <Link href="/admin/analytics/users" className="font-semibold text-[var(--semantic-brand)] underline">
                User analytics (cohorts)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Flashcard pool health</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Tile label="Published decks &lt; 3 cards" value={fmt(f.publishedDecksWithCardCountUnder3)} hint="Thin decks" />
          <Tile label="Orphan published cards" value={fmt(f.publishedOrphanCards)} hint="No deck" />
          <Tile label="Cards missing topic code" value={fmt(f.publishedCardsMissingTopicCode)} hint="Taxonomy gap" />
        </div>
        <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
          JSON detail:{" "}
          <Link href={tools.flashcardSummaryApi} className="font-semibold text-[var(--semantic-brand)] underline">
            {tools.flashcardSummaryApi}
          </Link>
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Pathway readiness (US sample)</h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Heuristic: ≥10 published pathway lessons ⇒ ready slice for ops triage (not a product guarantee).
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[var(--semantic-text-muted)]">Sampled</dt>
              <dd className="font-semibold tabular-nums">{pr.usPathwaysSampled}</dd>
            </div>
            <div>
              <dt className="text-[var(--semantic-text-muted)]">Ready</dt>
              <dd className="font-semibold text-[var(--semantic-success)] tabular-nums">{pr.ready}</dd>
            </div>
            <div>
              <dt className="text-[var(--semantic-text-muted)]">Partial / empty</dt>
              <dd className="font-semibold tabular-nums">
                {pr.partial} / {pr.notReady}
              </dd>
            </div>
          </dl>
          <Link href="/admin/content-coverage" className="mt-4 inline-block text-sm font-semibold text-[var(--semantic-brand)] underline">
            Open content coverage
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
          <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Lab &amp; allied surfaces</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Lab preview modules</dt>
              <dd className="font-semibold tabular-nums">{hub.alliedAndLab.labPreviewModuleCount}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--semantic-text-secondary)]">Allied-scoped pathway lessons (pub.)</dt>
              <dd className="font-semibold tabular-nums">{fmt(hub.alliedAndLab.publishedPathwayLessonsWithAlliedKey)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href={hub.alliedAndLab.labAdminHref} className="text-[var(--semantic-brand)] underline">
              Lab values preview
            </Link>
            <Link href={hub.alliedAndLab.alliedAdminHref} className="text-[var(--semantic-brand)] underline">
              Allied module preview
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)]">Content signals</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Tile label="Pathway lessons (pub.)" value={fmt(c.pathwayLessonsPublished)} />
          <Tile label="Weak SEO (pub. pathway)" value={fmt(c.pathwayLessonsWeakSeo)} hint="Empty title/description" />
          <Tile label="Questions missing rationale" value={fmt(c.questionsPublishedMissingRationale)} hint="Published rows" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/pathway-lessons" className="text-[var(--semantic-brand)] underline">
            Pathway lessons
          </Link>
          <a href={tools.lessonQuestionLinkCoverageApi} className="font-mono text-xs text-[var(--semantic-info)] underline">
            Lesson ↔ bank link scan (API)
          </a>
          <Link href={tools.studyPerformance} className="text-[var(--semantic-brand)] underline">
            Study &amp; CAT performance
          </Link>
          <Link href="/admin/operations" className="text-[var(--semantic-brand)] underline">
            Operations
          </Link>
          <a href={tools.operationsDashboardApi} className="font-mono text-xs text-[var(--semantic-info)] underline">
            operations-dashboard
          </a>
        </div>
      </section>

      <p className="text-xs text-[var(--semantic-text-muted)]">Generated {new Date(hub.generatedAt).toLocaleString()}</p>
    </div>
  );
}

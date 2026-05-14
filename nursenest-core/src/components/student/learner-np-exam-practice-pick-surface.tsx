import Link from "next/link";
import { isCnplePathway } from "@/lib/exam-pathways/cnple-pathway";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

export type NpExamPracticePickRow = {
  id: string;
  title: string;
  subtitle: string;
};

/**
 * NP-only practice entry: explicit exam cards (FNP, PMHNP, CNPLE, …) with separate deep links to the
 * practice-tests hub and the question bank — avoids a single generic "NP practice" destination.
 *
 * CNPLE uses LOFT simulation (linear on-the-fly testing), not CAT adaptive.
 * Its practice tile links to /app/cases/cnple instead of the CAT-launch route.
 */
export function LearnerNpExamPracticePickSurface({
  title,
  subtitle,
  pathways,
}: {
  title: string;
  subtitle: string;
  pathways: NpExamPracticePickRow[];
}) {
  return (
    <div
      className="nn-practice-tests-hub-premium mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6"
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="practice-tests"
      data-nn-practice-exam-hub-convergence=""
    >
      <header className="nn-learner-page-hero space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
          Practice exams
        </p>
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{subtitle}</p>
      </header>

      {pathways.length === 0 ? (
        <p className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
          No NP exam tracks are available on this account yet. Update study preferences after your subscription syncs.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {pathways.map((p) => {
            const isCnple = isCnplePathway(p.id);
            // CNPLE: LOFT simulation via /app/cases/cnple instead of CAT adaptive
            const practiceHref = isCnple
              ? "/app/cases/cnple"
              : `/app/practice-tests?pathwayId=${encodeURIComponent(p.id)}`;
            const questionsHref = pathwayHubAppQuestionsHref(p.id);
            return (
              <li
                key={p.id}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4 shadow-[var(--semantic-shadow-soft)]"
              >
                <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">{p.title}</h2>
                <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{p.subtitle}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Link
                    href={practiceHref}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] transition-colors hover:border-[var(--semantic-info)]"
                  >
                    {isCnple ? "LOFT Simulation" : "Practice exams & CAT"}
                  </Link>
                  <Link
                    href={questionsHref}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] transition-colors hover:border-[var(--semantic-chart-2)]"
                  >
                    Question bank
                  </Link>
                  {isCnple ? (
                    <Link
                      href="/canada/np/cnple/lessons"
                      className="inline-flex items-center justify-center rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] transition-colors hover:border-[var(--semantic-success)]"
                    >
                      Lessons
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="text-xs text-[var(--semantic-text-secondary)]">
        <Link href="/app/account/study-preferences" className="font-medium text-[var(--semantic-brand)] underline underline-offset-2">
          Study preferences
        </Link>{" "}
        — set a default NP track for quicker entry next time.
      </p>
    </div>
  );
}

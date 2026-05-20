import Link from "next/link";

/**
 * When a subscriber has multiple entitled pathways but no `pathwayId` in the URL and no single
 * `learnerPath` lock-in, show explicit track links instead of redirecting in a loop.
 */
export function FlashcardsPathwayPickSurface({
  title,
  subtitle,
  pathways,
  /** Learner surface to open after picking a track (defaults to flashcards hub). */
  baseAppPath = "/app/flashcards",
}: {
  title: string;
  subtitle: string;
  pathways: { id: string; label: string }[];
  baseAppPath?: string;
}) {
  const base = baseAppPath.replace(/\/$/, "") || "/app/flashcards";
  const isPracticeExamSurface = base.includes("/practice-tests");
  const moduleName = isPracticeExamSurface ? "practice-tests" : "flashcards";
  return (
    <div
      className={[
        "mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6",
        isPracticeExamSurface ? "nn-practice-tests-hub-premium" : "nn-flashcards-hub-premium",
      ].join(" ")}
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module={moduleName}
      data-nn-premium-flashcard-convergence={isPracticeExamSurface ? undefined : ""}
      data-nn-practice-exam-hub-convergence={isPracticeExamSurface ? "" : undefined}
    >
      <header className="nn-learner-page-hero space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
          {isPracticeExamSurface ? "Practice exams" : "Flashcards"}
        </p>
        <h1 className="text-2xl font-semibold text-[var(--theme-fg)]">{title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--theme-muted-text)]">{subtitle}</p>
      </header>

      {pathways.length === 0 ? (
        <p className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-muted-text)] shadow-[var(--semantic-shadow-soft)]">
          No exam tracks are available on this account yet. Try again after your subscription syncs, or update study
          preferences.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {pathways.map((p) => (
            <li key={p.id}>
              <Link
                href={`${base}?pathwayId=${encodeURIComponent(p.id)}`}
                className="block min-h-[4.75rem] rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm font-medium text-[var(--theme-fg)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[var(--semantic-info)]"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[var(--theme-muted-text)]">
        <Link href="/app/account/study-preferences" className="text-primary underline underline-offset-2">
          Study preferences
        </Link>{" "}
        — set a default track for questions, CAT, flashcards, and practice exams.
      </p>
    </div>
  );
}

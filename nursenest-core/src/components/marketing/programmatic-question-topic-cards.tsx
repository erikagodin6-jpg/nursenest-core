import Link from "next/link";
import type { ProgrammaticQuestionTopicRow } from "@/lib/seo/load-programmatic-question-topic-page";

/**
 * Public preview: stem + choices only (no correct answer or rationale on the marketing surface).
 */
export function ProgrammaticQuestionTopicCards({
  rows,
  signupHref,
}: {
  rows: ProgrammaticQuestionTopicRow[];
  signupHref: string;
}) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm text-[var(--theme-body-text)]"
        style={{
          borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
          background: "color-mix(in srgb, var(--semantic-panel-cool) 12%, var(--semantic-surface))",
        }}
      >
        <p className="font-medium text-[var(--theme-heading-text)]">No matching preview items right now.</p>
        <p className="mt-2 text-[var(--theme-muted-text)]">
          The bank is still growing for this filter. Open the question bank in the app after sign-in for the full rotating pool.
        </p>
        <Link
          href={signupHref}
          className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Create a free account
        </Link>
      </div>
    );
  }

  return (
    <ol className="space-y-8">
      {rows.map((q, qi) => (
        <li key={q.id}>
          <article
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-4 sm:p-5"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-chart-3) 18%, var(--semantic-border-soft))",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              Question {qi + 1}
            </p>
            <h2 className="nn-marketing-body mt-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
              {q.stem}
            </h2>
            {q.optionsText.length > 0 ? (
              <ul className="mt-4 space-y-2" role="list">
                {q.optionsText.map((opt, i) => (
                  <li
                    key={`${q.id}-opt-${i}`}
                    className="flex gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)] px-3 py-2.5 text-sm leading-relaxed text-[var(--theme-body-text)]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] text-xs font-bold text-[var(--theme-muted-text)]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-4 text-xs text-[var(--theme-muted-text)]">
              Answers and rationales unlock after sign-in — public pages show difficulty and reading load only.
            </p>
          </article>
        </li>
      ))}
    </ol>
  );
}

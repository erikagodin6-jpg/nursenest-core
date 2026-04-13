import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

function QuizList({
  title,
  items,
  showAnswers,
}: {
  title: string;
  items: PathwayLessonQuizItem[] | undefined;
  showAnswers: boolean;
}) {
  if (!items?.length) return null;
  return (
    <section className="border-b border-[color-mix(in_srgb,var(--border-subtle)_88%,var(--theme-primary))] pb-8 last:border-b-0 last:pb-0">
      <h2 className="nn-marketing-h3 text-[var(--theme-heading-text)]">{title}</h2>
      <ol className="mt-5 space-y-7 pl-0 list-none">
        {items.map((q, i) => (
          <li key={i}>
            <p className="text-[0.9375rem] font-semibold leading-snug text-[var(--theme-heading-text)]">
              <span className="mr-2 text-[var(--semantic-text-secondary)]">{i + 1}.</span>
              {q.question}
            </p>
            <ul className="mt-3 space-y-2 pl-0 list-none">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  className={`flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed transition-colors ${
                    showAnswers && j === q.correct
                      ? "bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)] text-[var(--semantic-success-contrast)] font-medium"
                      : "text-[var(--theme-body-text)]"
                  }`}
                >
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider ${
                      showAnswers && j === q.correct
                        ? "bg-[var(--semantic-success)] text-white"
                        : "bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--bg-card))] text-[var(--semantic-text-secondary)]"
                    }`}
                  >
                    {OPTION_LETTERS[j] ?? String(j + 1)}
                  </span>
                  <span>{opt}</span>
                </li>
              ))}
            </ul>
            {showAnswers && q.rationale ? (
              <div className="nn-lesson-rationale mt-3">
                <p className="text-[0.675rem] font-bold uppercase tracking-widest text-[var(--semantic-success-contrast)]">
                  Rationale
                </p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-[var(--semantic-text-secondary)] whitespace-pre-wrap">
                  {q.rationale}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PathwayLessonQuizzes({
  preTest,
  postTest,
  fullAccess,
}: {
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  fullAccess: boolean;
}) {
  if (!preTest?.length && !postTest?.length) return null;
  return (
    <div className="nn-study-card nn-study-card--wash mt-10 space-y-8 p-5 sm:p-6">
      {!fullAccess ? (
        <aside className="nn-study-callout p-4 text-sm text-[var(--theme-body-text)]">
          <span className="font-medium text-foreground">Preview mode: </span>
          Pre/post questions are shown without highlighted answers or rationales. Full lesson access unlocks scoring-style
          review aligned with your plan.
        </aside>
      ) : null}
      <QuizList title="Pre-test" items={preTest} showAnswers={fullAccess} />
      <QuizList title="Post-test" items={postTest} showAnswers={fullAccess} />
    </div>
  );
}

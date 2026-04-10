import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

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
      <ol className="mt-4 list-decimal space-y-5 pl-5 nn-marketing-body-sm text-[var(--theme-body-text)] marker:font-semibold marker:text-[var(--theme-heading-text)]">
        {items.map((q, i) => (
          <li key={i} className="marker:font-semibold">
            <p className="font-medium text-foreground">{q.question}</p>
            <ul className="mt-2 list-inside list-[circle] space-y-1 text-muted-foreground">
              {q.options.map((opt, j) => (
                <li key={j}>
                  {showAnswers && j === q.correct ? (
                    <strong className="text-foreground">{opt}</strong>
                  ) : (
                    opt
                  )}
                </li>
              ))}
            </ul>
            {showAnswers && q.rationale ? (
              <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Rationale: </span>
                {q.rationale}
              </p>
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

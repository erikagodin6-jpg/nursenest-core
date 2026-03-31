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
    <section className="border-b border-[var(--theme-separator)] pb-8">
      <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">{title}</h2>
      <ol className="mt-3 list-decimal space-y-4 pl-5 text-sm text-[var(--theme-body-text)]">
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
    <div className="mt-10 space-y-8">
      {!fullAccess ? (
        <aside className="nn-card rounded-lg border border-border bg-[var(--theme-muted-surface)]/50 p-3 text-sm text-muted-foreground">
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

import type { CasperResponseEvaluation } from "@/lib/casper/casper-feedback";

type CasperAiFeedbackCardProps = {
  evaluation: CasperResponseEvaluation;
};

export function CasperAiFeedbackCard({
  evaluation,
}: CasperAiFeedbackCardProps) {
  return (
    <article className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
            AI-guided response analysis
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[var(--semantic-text-primary)]">
            {evaluation.category.replace(/-/g, " ")} scenario
          </h2>
        </div>

        <div className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
          {evaluation.wordCount} words
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(evaluation.domains).map(([domain, rating]) => (
          <div
            key={domain}
            className="rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-5"
          >
            <p className="text-sm font-medium capitalize text-[var(--semantic-text-secondary)]">
              {domain.replace(/-/g, " ")}
            </p>

            <p className="mt-2 text-xl font-semibold capitalize text-[var(--semantic-text-primary)]">
              {rating.replace(/-/g, " ")}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Strengths
          </h3>

          <ul className="mt-4 space-y-3 text-base leading-8 text-[var(--semantic-text-secondary)]">
            {evaluation.strengths.map((strength) => (
              <li key={strength}>• {strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Improvement targets
          </h3>

          <ul className="mt-4 space-y-3 text-base leading-8 text-[var(--semantic-text-secondary)]">
            {evaluation.improvementTargets.map((target) => (
              <li key={target}>• {target}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
        <h3 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
          Suggested rewrite approach
        </h3>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-text-secondary)]">
          {evaluation.suggestedRewrite}
        </p>
      </section>
    </article>
  );
}

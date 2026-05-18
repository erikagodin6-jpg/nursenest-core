"use client";

export type PreNursingRemediationInsightCardProps = {
  title: string;
  weakArea: string;
  explanation: string;
  recommendedActions: string[];
  relatedConcepts?: string[];
  encouragement?: string;
};

export function PreNursingRemediationInsightCard({
  title,
  weakArea,
  explanation,
  recommendedActions,
  relatedConcepts,
  encouragement = "Struggling with a concept early is normal. Focus on pattern recognition and repeated exposure rather than perfection.",
}: PreNursingRemediationInsightCardProps) {
  return (
    <section
      className="rounded-[1.4rem] border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_5%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]"
      data-prenursing-remediation-insight=""
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-warning)]">
            Adaptive remediation
          </p>
          <h3 className="m-0 text-[1.05rem] font-bold tracking-[-0.02em] text-[var(--theme-heading-text)] sm:text-[1.18rem]">
            {title}
          </h3>
        </div>

        <span
          className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-warning) 24%, var(--semantic-border-soft))",
            color: "var(--semantic-warning)",
            background:
              "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
          }}
        >
          Focus area
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
            Weak area identified
          </p>
          <p className="m-0 text-sm leading-[1.7] text-[var(--semantic-text-primary)]">
            {weakArea}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
            Why learners struggle here
          </p>
          <p className="m-0 text-sm leading-[1.7] text-[var(--semantic-text-secondary)]">
            {explanation}
          </p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
            Recommended next steps
          </p>

          <ul className="space-y-2 pl-5 text-sm leading-[1.65] text-[var(--semantic-text-primary)] marker:text-[var(--semantic-warning)]">
            {recommendedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

        {relatedConcepts?.length ? (
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
              Related concepts to revisit
            </p>

            <div className="flex flex-wrap gap-2">
              {relatedConcepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    borderColor: "var(--semantic-border-soft)",
                    background:
                      "color-mix(in srgb, var(--semantic-panel-muted) 18%, var(--semantic-surface))",
                    color: "var(--semantic-text-secondary)",
                  }}
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
          <p className="m-0 text-sm leading-[1.7] text-[var(--semantic-text-secondary)]">
            {encouragement}
          </p>
        </div>
      </div>
    </section>
  );
}

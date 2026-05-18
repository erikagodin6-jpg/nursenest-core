import type { CasperSessionRecord } from "@/lib/casper/casper-session-types";

type CasperReviewReplayProps = {
  session: CasperSessionRecord;
};

export function CasperReviewReplay({
  session,
}: CasperReviewReplayProps) {
  return (
    <section className="grid gap-6">
      {session.responses.map((response, index) => (
        <article
          key={`${response.scenarioId}_${index}`}
          className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
                Response replay
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">
                Scenario {index + 1}
              </h2>
            </div>

            <div className="rounded-full bg-[var(--semantic-surface-secondary)] px-4 py-2 text-sm font-medium text-[var(--semantic-text-primary)]">
              {response.responseText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-6">
            <p className="text-base leading-8 text-[var(--semantic-text-secondary)] whitespace-pre-wrap">
              {response.responseText || "No response saved yet."}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}

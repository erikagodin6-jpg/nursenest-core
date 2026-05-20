type Props = {
  focusArea: string;
  readinessMessage: string;
  nextAction: string;
  estimatedMinutes?: number;
};

export function GuidedStudyFocusHeader({
  focusArea,
  readinessMessage,
  nextAction,
  estimatedMinutes,
}: Props) {
  return (
    <section className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-5 shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--semantic-text-muted)]">
            Today's focus
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
            {focusArea}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
            {readinessMessage}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-secondary)] px-5 py-4 lg:max-w-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--semantic-text-muted)]">
            Next recommended step
          </p>

          <p className="mt-2 text-sm font-medium leading-6 text-[var(--semantic-text-primary)]">
            {nextAction}
          </p>

          {estimatedMinutes ? (
            <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
              Estimated study time: {estimatedMinutes} min
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

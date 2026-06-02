type Props = {
  streakDays: number;
  completedToday: boolean;
  weeklyProgress: number;
};

export function LearnerStudyMomentum({
  streakDays,
  completedToday,
  weeklyProgress,
}: Props) {
  return (
    <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-secondary)] p-5">
      <h2 className="text-sm font-semibold tracking-tight text-[var(--semantic-text-primary)]">
        Study momentum
      </h2>

      <div className="mt-4 space-y-3 text-sm text-[var(--semantic-text-secondary)]">
        <div>
          <span className="font-medium text-[var(--semantic-text-primary)]">
            {streakDays} consecutive study days
          </span>
        </div>

        <div>
          Weekly consistency: {weeklyProgress}%
        </div>

        <div>
          {completedToday
            ? "Your guided study plan is complete for today."
            : "Your guided study plan is still active."}
        </div>
      </div>
    </section>
  );
}

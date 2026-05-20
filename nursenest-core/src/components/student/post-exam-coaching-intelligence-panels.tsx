import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";

export function PostExamCoachingIntelligencePanels({
  coaching,
}: {
  coaching: PostExamCoachingReport | null | undefined;
}) {
  if (!coaching) return null;
  return (
    <section className="rounded-2xl border border-[var(--semantic-border-soft)] p-4">
      <h2 className="text-sm font-semibold text-[var(--theme-heading-text)]">Coaching signals</h2>
      <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
        {coaching.readinessReliability.guidance}
      </p>
    </section>
  );
}

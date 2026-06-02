import { AdaptiveReviewQueue } from "@/components/learning-science/adaptive-review-queue";
import { buildRetentionDemoStates } from "@/lib/learning-science/retention-demo-data";

function MetricCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{subtitle}</p>
    </article>
  );
}

export function LearningScienceDashboardPreview() {
  const states = buildRetentionDemoStates();

  const critical = states.filter((state) => state.priority === "critical").length;
  const unstable = states.filter((state) => state.memoryStrength < 0.55).length;
  const overconfidence = states.reduce((sum, state) => sum + state.overconfidenceMisses, 0);

  return (
    <section className="space-y-6" data-testid="learning-science-dashboard-preview">
      <div className="rounded-3xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_38%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)]">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]">
          Cognitive learning system
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          Your brain is the product now
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          NurseNest should not feel like a static question bank. The platform should continuously model memory strength, misconception risk, confidence calibration, and clinical transfer readiness.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Critical misconceptions"
          value={String(critical)}
          subtitle="High-confidence misses that require urgent remediation before the learner continues."
        />
        <MetricCard
          label="Unstable concepts"
          value={String(unstable)}
          subtitle="Knowledge that is fragile and likely to decay without retrieval practice."
        />
        <MetricCard
          label="Overconfidence events"
          value={String(overconfidence)}
          subtitle="Moments where the learner felt certain but answered incorrectly."
        />
      </div>

      <AdaptiveReviewQueue states={states} />
    </section>
  );
}

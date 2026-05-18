import {
  calculateOverallCompetency,
  determineProgressionTier
} from "@/src/lib/prescribing/competency-tracker";

const metrics = [
  {
    domain: "stewardship" as const,
    score: 84,
    attempts: 18,
    lastUpdatedIso: new Date().toISOString()
  },
  {
    domain: "organism-coverage" as const,
    score: 78,
    attempts: 12,
    lastUpdatedIso: new Date().toISOString()
  },
  {
    domain: "renal-dosing" as const,
    score: 66,
    attempts: 7,
    lastUpdatedIso: new Date().toISOString()
  },
  {
    domain: "documentation" as const,
    score: 88,
    attempts: 10,
    lastUpdatedIso: new Date().toISOString()
  }
];

const overall = calculateOverallCompetency(metrics);
const tier = determineProgressionTier(overall);

export function CompetencyDashboard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-violet-100">
            Prescribing Competency Tracking
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-tight">
            Measure clinical prescribing progression.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--semantic-muted-foreground)]">
            Track stewardship, escalation recognition, organism targeting,
            documentation quality, and prescribing safety longitudinally.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-100">
            Overall Competency
          </div>

          <div className="mt-3 text-5xl font-black text-emerald-50">
            {overall}
          </div>

          <div className="mt-2 text-sm font-semibold capitalize text-emerald-100">
            {tier.replaceAll("-", " ")}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article
            key={metric.domain}
            className="rounded-3xl border border-white/10 bg-black/10 p-6"
          >
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
              {metric.domain.replaceAll("-", " ")}
            </div>

            <div className="mt-3 text-4xl font-black">
              {metric.score}
            </div>

            <div className="mt-2 text-sm text-[var(--semantic-muted-foreground)]">
              {metric.attempts} attempts completed
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

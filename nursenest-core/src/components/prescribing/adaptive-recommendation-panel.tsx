import {
  buildAdaptiveRecommendations
} from "@/src/lib/prescribing/adaptive-sequencing-engine";

const recommendations = buildAdaptiveRecommendations([
  {
    id: "attempt-1",
    learnerId: "demo-learner",
    activityType: "coverage-drill",
    domain: "antibiotic-stewardship",
    score: 62,
    stewardshipScore: 42,
    safetyMisses: 2,
    completedAtIso: new Date().toISOString()
  },
  {
    id: "attempt-2",
    learnerId: "demo-learner",
    activityType: "renal-dosing",
    domain: "renal-dosing",
    score: 58,
    stewardshipScore: 74,
    safetyMisses: 1,
    completedAtIso: new Date().toISOString()
  }
]);

export function AdaptiveRecommendationPanel() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-100">
          Adaptive Prescribing Sequencing
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Dynamically adapt prescribing education.
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          The platform now recommends next learning activities based on
          stewardship performance, safety misses, escalation recognition, and
          prescribing competency.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {recommendations.map((recommendation) => (
          <article
            key={recommendation.title}
            className="rounded-3xl border border-white/10 bg-black/10 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                  Recommended Activity
                </div>

                <h3 className="mt-2 text-2xl font-bold">
                  {recommendation.title}
                </h3>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  recommendation.priority === "high"
                    ? "bg-rose-500/20 text-rose-100"
                    : recommendation.priority === "moderate"
                    ? "bg-amber-500/20 text-amber-100"
                    : "bg-emerald-500/20 text-emerald-100"
                }`}
              >
                {recommendation.priority}
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
              {recommendation.rationale}
            </p>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100">
              {recommendation.href}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

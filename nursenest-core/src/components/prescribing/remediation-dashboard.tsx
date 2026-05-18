import {
  buildPrescribingRemediationPlan
} from "@/src/lib/prescribing/remediation-engine";

const remediation = buildPrescribingRemediationPlan([
  {
    topic: "antibiotic-stewardship",
    misses: 4,
    stewardshipPenalty: -14
  },
  {
    topic: "organism-coverage",
    misses: 2,
    stewardshipPenalty: -4
  }
]);

export function RemediationDashboard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-amber-100">
          Adaptive Remediation
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Personalized prescribing remediation.
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          Identify weak prescribing patterns before they become unsafe clinical
          habits.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {remediation.map((item) => (
          <article
            key={item.topic}
            className="rounded-3xl border border-white/10 bg-black/10 p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                  Topic
                </div>

                <h3 className="mt-2 text-2xl font-bold capitalize">
                  {item.topic.replaceAll("-", " ")}
                </h3>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  item.priority === "high"
                    ? "bg-rose-500/20 text-rose-100"
                    : item.priority === "moderate"
                    ? "bg-amber-500/20 text-amber-100"
                    : "bg-emerald-500/20 text-emerald-100"
                }`}
              >
                {item.priority}
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
              {item.recommendation}
            </p>

            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                Recommended Modules
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {item.recommendedModules.map((module) => (
                  <span
                    key={module}
                    className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                  >
                    {module.replaceAll("-", " ")}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

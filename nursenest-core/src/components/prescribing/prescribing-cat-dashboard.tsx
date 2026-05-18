import {
  selectNextPrescribingCatItem
} from "@/src/lib/prescribing/prescribing-cat-engine";

const selection = selectNextPrescribingCatItem({
  learnerId: "demo-learner",
  answeredItemIds: [],
  estimatedAbility: 3,
  weakDomains: ["renal-dosing"]
});

export function PrescribingCatDashboard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
          Adaptive Prescribing CAT Engine
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Dynamically personalized prescribing assessment.
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          The CAT engine now adapts prescribing difficulty and remediation focus
          based on stewardship performance, safety misses, and longitudinal
          competency patterns.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Selected Adaptive Item
          </div>

          <h3 className="mt-4 text-2xl font-bold leading-tight">
            {selection.item.prompt}
          </h3>

          <div className="mt-8 grid gap-3">
            {selection.item.optionIds.map((option) => (
              <div
                key={option}
                className="rounded-2xl border border-white/10 bg-black/10 p-4"
              >
                <div className="font-medium capitalize">
                  {option.replaceAll("-", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-100">
              Selection Logic
            </div>

            <p className="mt-4 text-sm leading-7 text-emerald-50">
              {selection.reason}
            </p>
          </div>

          <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-violet-100">
              Remediation Target
            </div>

            <div className="mt-4 text-lg font-semibold text-violet-50 capitalize">
              {selection.item.domain.replaceAll("-", " ")}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
              Suggested Review Module
            </div>

            <div className="mt-4 text-lg font-semibold text-amber-50 capitalize">
              {selection.item.remediationModule.replaceAll("-", " ")}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

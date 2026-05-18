import { buildRenalDosingResult } from "@/src/lib/prescribing/renal-dosing-engine";

const SAMPLE_INPUT = {
  age: 72,
  weightKg: 68,
  serumCreatinine: 1.8,
  sex: "female" as const
};

export function RenalDosingPanel() {
  const result = buildRenalDosingResult(SAMPLE_INPUT);

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
            Renal Dosing Simulator
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight">
            Adjust prescribing decisions before harm happens.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
            This module teaches learners to identify renal impairment, adjust
            high-risk antimicrobials, and monitor therapy during acute illness.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/10 p-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Estimated CrCl
          </div>
          <div className="mt-2 text-5xl font-black">
            {result.creatinineClearance}
          </div>
          <div className="mt-1 text-sm text-[var(--semantic-muted-foreground)]">
            mL/min
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Category
          </div>
          <div className="mt-2 text-lg font-semibold capitalize">
            {result.category.replaceAll("-", " ")}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-5 lg:col-span-2">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Prescribing Recommendations
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--semantic-muted-foreground)]">
            {result.recommendations.map((recommendation) => (
              <li key={recommendation}>• {recommendation}</li>
            ))}
          </ul>
        </div>
      </div>

      {result.warnings.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-50">
          <div className="text-xs font-bold uppercase tracking-wide">
            Safety Warnings
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {result.warnings.map((warning) => (
              <li key={warning}>• {warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

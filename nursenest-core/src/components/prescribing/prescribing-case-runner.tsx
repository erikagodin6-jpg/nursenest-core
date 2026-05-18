import { INFECTIOUS_DISEASE_CASES } from "@/src/lib/prescribing/infectious-disease-cases";
import { scorePrescribingCase } from "@/src/lib/prescribing/prescribing-case-scoring";

const CASE = INFECTIOUS_DISEASE_CASES[0];

export function PrescribingCaseRunner() {
  const score = scorePrescribingCase(CASE, ["mrsa", "tmp-smx"]);

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-rose-100">
          Infectious Disease Case
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          {CASE.title}
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          {CASE.patientSummary}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          {CASE.steps.map((step, index) => (
            <article
              key={step.id}
              className="rounded-3xl border border-white/10 bg-black/10 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                    Step {index + 1}
                  </div>

                  <h3 className="mt-2 text-xl font-bold">
                    {step.title}
                  </h3>
                </div>

                <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {step.type}
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
                {step.prompt}
              </p>

              <div className="mt-6 space-y-3">
                {step.options.map((option) => (
                  <div
                    key={option.id}
                    className={`rounded-2xl border p-4 ${
                      option.correct
                        ? "border-emerald-400/20 bg-emerald-500/10"
                        : "border-white/10 bg-black/10"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>

                    <p className="mt-2 text-sm leading-6 text-[var(--semantic-muted-foreground)]">
                      {option.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-100">
              Stewardship Score
            </div>

            <div className="mt-3 text-5xl font-black text-emerald-50">
              {score.stewardshipScore}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
              Clinical Pearls
            </div>

            <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
              {CASE.clinicalPearls.map((pearl) => (
                <li key={pearl}>• {pearl}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
              NCLEX / CNPLE Trap
            </div>

            <p className="mt-4 text-sm leading-7 text-amber-50">
              {CASE.nclexTrap}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

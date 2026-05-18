import {
  ORGANISM_COVERAGE_TARGETS,
  ORGANISM_MATCH_PROMPTS
} from "@/src/lib/prescribing/organism-coverage-registry";

import {
  evaluateOrganismMatch
} from "@/src/lib/prescribing/organism-match-engine";

const prompt = ORGANISM_MATCH_PROMPTS[0];

const evaluation = evaluateOrganismMatch(prompt, "tmp-smx");

export function OrganismMatchDrill() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-100">
          Organism Matching Drill
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Coverage-Based Prescribing Practice
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          Learn to connect likely organisms to appropriate therapy without
          reflexively escalating to unnecessarily broad-spectrum antibiotics.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Clinical Prompt
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--semantic-foreground)]">
            {prompt.prompt}
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "tmp-smx",
              "amoxicillin",
              "cefepime",
              "vancomycin"
            ].map((option) => (
              <div
                key={option}
                className={`rounded-2xl border p-4 ${
                  option === "tmp-smx"
                    ? "border-emerald-400/20 bg-emerald-500/10"
                    : "border-white/10 bg-black/10"
                }`}
              >
                <div className="font-medium capitalize">
                  {option.replaceAll("-", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div
            className={`rounded-3xl border p-6 ${
              evaluation.correct
                ? "border-emerald-400/20 bg-emerald-500/10"
                : "border-rose-400/20 bg-rose-500/10"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wide">
              Evaluation
            </div>

            <div className="mt-3 text-3xl font-black">
              {evaluation.correct ? "CORRECT" : "INCORRECT"}
            </div>

            <p className="mt-4 text-sm leading-7 opacity-90">
              {evaluation.rationale}
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
              Organism Coverage Pearls
            </div>

            <div className="mt-5 space-y-4">
              {ORGANISM_COVERAGE_TARGETS.map((target) => (
                <div
                  key={target.id}
                  className="rounded-2xl border border-cyan-400/10 bg-black/10 p-4"
                >
                  <div className="font-semibold text-cyan-50">
                    {target.name}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                    {target.coveragePearl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

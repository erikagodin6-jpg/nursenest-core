import {
  CULTURE_SCENARIOS,
  interpretCultureScenario
} from "@/src/lib/prescribing/culture-sensitivity-engine";

export function CultureSensitivityPanel() {
  const scenario = CULTURE_SCENARIOS[0];
  const interpretation = interpretCultureScenario(scenario);

  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-100">
          Culture & Sensitivity Interpretation
        </div>

        <h2 className="mt-5 text-3xl font-bold tracking-tight">
          Learn when to narrow therapy — not just escalate it.
        </h2>

        <p className="mt-4 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
          Advanced NP learners must recognize resistant organisms, interpret
          susceptibility data, and de-escalate appropriately.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Organism
          </div>

          <div className="mt-2 text-2xl font-bold">
            {scenario.organism}
          </div>

          <div className="mt-1 text-sm text-[var(--semantic-muted-foreground)]">
            {scenario.specimen}
          </div>

          <div className="mt-6 space-y-3">
            {scenario.entries.map((entry) => (
              <div
                key={entry.antibiotic}
                className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
              >
                <span className="font-medium">{entry.antibiotic}</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    entry.interpretation === "S"
                      ? "bg-emerald-500/20 text-emerald-100"
                      : entry.interpretation === "R"
                      ? "bg-rose-500/20 text-rose-100"
                      : "bg-amber-500/20 text-amber-100"
                  }`}
                >
                  {entry.interpretation}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-100">
              Recommended Agents
            </div>

            <ul className="mt-3 space-y-2 text-sm text-emerald-50">
              {interpretation.recommendedAgents.map((agent) => (
                <li key={agent}>• {agent}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-rose-100">
              Avoid
            </div>

            <ul className="mt-3 space-y-2 text-sm text-rose-50">
              {interpretation.avoidAgents.map((agent) => (
                <li key={agent}>• {agent}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-5">
            <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
              Clinical Reasoning
            </div>

            <ul className="mt-3 space-y-2 text-sm leading-7 text-cyan-50">
              {interpretation.reasoning.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

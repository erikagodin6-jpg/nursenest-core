import {
  PRESCRIBING_SOAP_SCENARIOS
} from "@/src/lib/prescribing/soap-note-scenarios";

import {
  evaluateSoapNote
} from "@/src/lib/prescribing/soap-note-engine";

const scenario = PRESCRIBING_SOAP_SCENARIOS[0];

const evaluation = evaluateSoapNote(
  scenario,
  scenario.exemplarNote
);

export function SoapNoteWorkflow() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-100">
          SOAP Documentation Workflow
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          Clinical documentation and prescribing synthesis.
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          Integrate assessment, prescribing, escalation recognition, and follow-up
          into structured NP clinical documentation.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5">
          {[
            ["Subjective", scenario.exemplarNote.subjective],
            ["Objective", scenario.exemplarNote.objective],
            ["Assessment", scenario.exemplarNote.assessment],
            ["Plan", scenario.exemplarNote.plan]
          ].map(([title, items]) => (
            <article
              key={String(title)}
              className="rounded-3xl border border-white/10 bg-black/10 p-6"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                {title}
              </div>

              <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
                {(items as string[]).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside className="space-y-5">
          <div
            className={`rounded-3xl border p-6 ${
              evaluation.complete
                ? "border-emerald-400/20 bg-emerald-500/10"
                : "border-rose-400/20 bg-rose-500/10"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wide">
              Documentation Evaluation
            </div>

            <div className="mt-3 text-3xl font-black">
              {evaluation.complete ? "COMPLETE" : "INCOMPLETE"}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
              Required Plan Elements
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-cyan-50">
              {scenario.requiredPlanElements.map((element) => (
                <li key={element}>• {element}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
              Escalation Red Flags
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-amber-50">
              {scenario.redFlags.map((flag) => (
                <li key={flag}>• {flag}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

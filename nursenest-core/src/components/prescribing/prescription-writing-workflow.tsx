import {
  PRESCRIPTION_WRITING_SCENARIOS
} from "@/src/lib/prescribing/prescription-writing-scenarios";

import {
  evaluatePrescriptionOrder
} from "@/src/lib/prescribing/prescription-writing-engine";

const scenario = PRESCRIPTION_WRITING_SCENARIOS[0];

const evaluation = evaluatePrescriptionOrder(
  scenario,
  scenario.acceptableOrders[0],
  ["pregnancy assessment", "allergy review", "renal function review"]
);

export function PrescriptionWritingWorkflow() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[var(--semantic-card-background)] p-8 shadow-2xl">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-violet-100">
          Prescription Writing Simulation
        </div>

        <h2 className="mt-5 text-4xl font-black tracking-tight">
          {scenario.title}
        </h2>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-muted-foreground)]">
          {scenario.patientSummary}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/10 p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
            Prescription Order
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                Medication
              </div>
              <div className="mt-1 text-xl font-semibold">
                {scenario.acceptableOrders[0].medication}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                  Dose
                </div>
                <div className="mt-1 font-medium">
                  {scenario.acceptableOrders[0].dose}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                  Frequency
                </div>
                <div className="mt-1 font-medium">
                  {scenario.acceptableOrders[0].frequency}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--semantic-muted-foreground)]">
                Patient Instructions
              </div>

              <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--semantic-muted-foreground)]">
                {scenario.acceptableOrders[0].patientInstructions.map(
                  (instruction) => (
                    <li key={instruction}>• {instruction}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div
            className={`rounded-3xl border p-6 ${
              evaluation.safe
                ? "border-emerald-400/20 bg-emerald-500/10"
                : "border-rose-400/20 bg-rose-500/10"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wide">
              Safety Evaluation
            </div>

            <div className="mt-3 text-3xl font-black">
              {evaluation.safe ? "SAFE" : "UNSAFE"}
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-cyan-100">
              Required Safety Checks
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-cyan-50">
              {scenario.requiredSafetyChecks.map((check) => (
                <li key={check}>• {check}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-6">
            <div className="text-xs font-bold uppercase tracking-wide text-amber-100">
              Teaching Points
            </div>

            <ul className="mt-4 space-y-2 text-sm leading-7 text-amber-50">
              {evaluation.teachingPoints.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

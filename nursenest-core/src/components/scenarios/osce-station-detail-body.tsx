import type { OSCESkillStation } from "@/lib/scenarios/osce-station-types";
import { OsceChecklist } from "@/components/scenarios/OsceChecklist";
import { ScenarioRationalePanel } from "@/components/scenarios/ScenarioRationalePanel";

export function OsceStationDetailBody({ station }: { station: OSCESkillStation }) {
  const stepItems = station.steps.map((st) => ({
    id: st.id,
    label: st.criticalStep ? `${st.instruction} (critical)` : st.instruction,
  }));

  const examinerItems =
    station.examinerChecklist?.map((row, i) => ({
      id: `examiner-${i}`,
      label: `${row.action} (${row.marks} marks)`,
    })) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <header className="space-y-2 border-b border-[var(--semantic-border-soft)] pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">OSCE station</p>
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">{station.title}</h1>
        <p className="text-sm text-[var(--theme-body-text)]">
          {station.category} · {station.difficulty}
          {station.timeLimit ? ` · ${station.timeLimit}` : ""}
        </p>
        {station.description ? (
          <p className="text-sm leading-relaxed text-[var(--semantic-text-primary)]">{station.description}</p>
        ) : null}
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Scenario</h2>
        <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{station.scenarioIntro}</p>
      </section>

      {station.candidateInstructions ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Candidate instructions</h2>
          <p className="text-sm leading-relaxed text-[var(--theme-body-text)] whitespace-pre-wrap">{station.candidateInstructions}</p>
        </section>
      ) : null}

      {station.patientActorScript ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Patient / standardized patient script</h2>
          <p className="text-sm leading-relaxed text-[var(--theme-body-text)] whitespace-pre-wrap">{station.patientActorScript}</p>
        </section>
      ) : null}

      {station.equipment?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Equipment</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
            {station.equipment.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <OsceChecklist title="Expected actions (with critical flags)" items={stepItems} />

      <div className="grid gap-4 md:grid-cols-2">
        {station.steps.map((st) => (
          <ScenarioRationalePanel key={st.id} title={st.instruction} body={st.rationale} />
        ))}
      </div>

      {examinerItems.length > 0 ? <OsceChecklist title="Examiner checklist (marks)" items={examinerItems} /> : null}

      {station.criticalFailCriteria?.length ? (
        <section className="space-y-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--bg-card))] p-4">
          <h2 className="text-lg font-semibold text-[var(--semantic-danger)]">Critical fails</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-primary)]">
            {station.criticalFailCriteria.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {station.commonErrors?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Common errors</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
            {station.commonErrors.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {station.passingCriteria ? <ScenarioRationalePanel title="Passing criteria" body={station.passingCriteria} /> : null}

      {station.clinicalPearls?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Clinical pearls</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
            {station.clinicalPearls.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {station.examinerQuestions?.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Examiner questions</h2>
          {station.examinerQuestions.map((q, i) => (
            <ScenarioRationalePanel key={i} title={q.question} body={q.expectedAnswer ?? q.rationale ?? ""} />
          ))}
        </section>
      ) : null}

      {station.teachingPoints?.length ? (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Teaching points</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--theme-body-text)]">
            {station.teachingPoints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

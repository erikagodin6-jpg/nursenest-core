import type { EmsScenarioRuntime } from "@/lib/paramedic/runtime/scenario-runtime";
import { calculateScenarioOperationalRisk } from "@/lib/paramedic/runtime/scenario-runtime";

function formatLabel(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function operationalRiskLabel(risk: number): string {
  if (risk >= 85) return "Immediate";
  if (risk >= 70) return "Critical";
  if (risk >= 45) return "Escalating";
  return "Stable";
}

function VitalsPanel({ scenario }: { scenario: EmsScenarioRuntime }) {
  const { vitals } = scenario.patient;
  const vitalsRows = [
    ["HR", String(vitals.hr)],
    ["BP", vitals.bp],
    ["RR", String(vitals.rr)],
    ["SpO₂", `${vitals.spo2}%`],
    ["EtCO₂", vitals.etco2 === undefined ? "—" : String(vitals.etco2)],
    ["GCS", vitals.gcs === undefined ? "—" : String(vitals.gcs)],
  ] as const;

  return (
    <section className="rounded-[24px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-surface-raised))] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Live vitals</h2>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_12%,transparent)] px-3 py-1 text-xs font-bold text-[var(--semantic-danger)]">
          {formatLabel(scenario.patient.instabilityLevel)}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {vitalsRows.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[color-mix(in_srgb,var(--semantic-surface-raised)_88%,transparent)] p-3">
            <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--theme-muted-text)]">{label}</dt>
            <dd className="mt-1 text-xl font-black text-[var(--theme-heading-text)]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-text)]">{scenario.patient.findings.pulseQuality}</p>
    </section>
  );
}

function EcgPanel({ scenario }: { scenario: EmsScenarioRuntime }) {
  const ecg = scenario.ecg;
  if (!ecg) return null;

  return (
    <section className="rounded-[24px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-surface-raised))] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">ECG signal</h2>
        {ecg.requiresImmediateAction ? (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_12%,transparent)] px-3 py-1 text-xs font-bold text-[var(--semantic-danger)]">Immediate action</span>
        ) : null}
      </div>
      <div className="mt-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--theme-card-bg))] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--theme-muted-text)]">Rhythm</p>
        <p className="mt-1 text-lg font-black text-[var(--theme-heading-text)]">{formatLabel(ecg.rhythm)}</p>
        {ecg.stemiTerritory ? <p className="mt-2 text-sm font-semibold text-[var(--semantic-danger)]">{formatLabel(ecg.stemiTerritory)} STEMI pattern</p> : null}
      </div>
      <ul className="mt-4 space-y-3">
        {ecg.findings.map((finding) => (
          <li key={finding.label} className="rounded-2xl bg-[color-mix(in_srgb,var(--semantic-surface-raised)_88%,transparent)] p-4">
            <p className="font-bold text-[var(--theme-heading-text)]">{finding.label}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--theme-muted-text)]">{finding.clinicalMeaning}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TransportPanel({ scenario }: { scenario: EmsScenarioRuntime }) {
  const { transport } = scenario;
  return (
    <section className="rounded-[24px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-surface-raised))] p-5 shadow-sm">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Transport status</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[color-mix(in_srgb,var(--semantic-surface-raised)_88%,transparent)] p-3">
          <dt className="font-semibold text-[var(--theme-muted-text)]">Destination</dt>
          <dd className="font-black text-[var(--theme-heading-text)]">{formatLabel(transport.destination)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[color-mix(in_srgb,var(--semantic-surface-raised)_88%,transparent)] p-3">
          <dt className="font-semibold text-[var(--theme-muted-text)]">ETA</dt>
          <dd className="font-black text-[var(--theme-heading-text)]">{transport.etaMinutes} min</dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-[color-mix(in_srgb,var(--semantic-surface-raised)_88%,transparent)] p-3">
          <dt className="font-semibold text-[var(--theme-muted-text)]">Activation</dt>
          <dd className="font-black text-[var(--theme-heading-text)]">{formatLabel(transport.activation ?? "none")}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm leading-6 text-[var(--theme-muted-text)]">{transport.rationale}</p>
    </section>
  );
}

function TimelinePanel({ scenario }: { scenario: EmsScenarioRuntime }) {
  return (
    <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-surface-raised))] p-6 shadow-sm">
      <h2 className="text-lg font-black text-[var(--theme-heading-text)]">Scenario timeline</h2>
      <ol className="mt-5 space-y-4">
        {scenario.timeline.map((event) => (
          <li key={`${event.timestampSeconds}-${event.title}`} className="grid gap-3 sm:grid-cols-[5.5rem_1fr]">
            <div className="text-xs font-black uppercase tracking-[0.14em] text-[var(--theme-muted-text)]">{Math.round(event.timestampSeconds / 60)} min</div>
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] bg-[color-mix(in_srgb,var(--semantic-surface-raised)_82%,transparent)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--semantic-info)]">{formatLabel(event.type)}</span>
                <h3 className="font-black text-[var(--theme-heading-text)]">{event.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--theme-body-text)]">{event.description}</p>
              {event.physiologicImpact ? <p className="mt-3 rounded-xl bg-[color-mix(in_srgb,var(--semantic-warning)_10%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--theme-body-text)]">{event.physiologicImpact}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DebriefPanel({ scenario }: { scenario: EmsScenarioRuntime }) {
  const debrief = scenario.debrief;
  if (!debrief) return null;

  return (
    <section className="rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_94%,var(--semantic-surface-raised))] p-6 shadow-sm">
      <h2 className="text-lg font-black text-[var(--theme-heading-text)]">Operational debrief targets</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Key strengths</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--theme-body-text)]">
            {debrief.strengths.map((item) => (
              <li key={item} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-success)]" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Watch points</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--theme-body-text)]">
            {debrief.improvementAreas.map((item) => (
              <li key={item} className="flex gap-2"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-warning)]" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function ParamedicScenarioPlayer({ scenario }: { scenario: EmsScenarioRuntime }) {
  const operationalRisk = calculateScenarioOperationalRisk(scenario);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="overflow-hidden rounded-[32px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_78%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-info)_14%,var(--theme-card-bg)),color-mix(in_srgb,var(--semantic-danger)_10%,var(--theme-card-bg)))] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_14%,transparent)] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[var(--semantic-danger)]">{operationalRiskLabel(operationalRisk)} operational risk</span>
          <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-surface-raised)_80%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--theme-muted-text)]">{formatLabel(scenario.category)} scenario</span>
          <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--semantic-warning)]">{scenario.transport.etaMinutes} min to destination</span>
        </div>
        <h1 className="mt-5 max-w-4xl text-3xl font-black tracking-tight text-[var(--theme-heading-text)] sm:text-5xl">{scenario.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--theme-muted-text)]">Manage the call like a prehospital clinician: recognize instability, reassess perfusion, protect transport time, and connect ECG findings to operational decisions.</p>
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-[22rem_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <VitalsPanel scenario={scenario} />
          <EcgPanel scenario={scenario} />
          <TransportPanel scenario={scenario} />
        </aside>
        <div className="space-y-6">
          <TimelinePanel scenario={scenario} />
          <DebriefPanel scenario={scenario} />
        </div>
      </div>
    </main>
  );
}

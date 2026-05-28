import { ECG_FOUNDATIONAL_LESSON_EXPANSION } from "@/lib/ecg-module/ecg-foundational-lessons-expansion";

function BulletList({ title, items }: { title: string; items: readonly string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</h4>
      <ul className="mt-2 space-y-1.5 text-sm text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-2)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EcgFoundationalUnitsPanel() {
  return (
    <section className="space-y-6" aria-label="University-level ECG foundations">
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_05%,var(--semantic-surface))] p-7">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
          Before rhythm recognition
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--semantic-text-primary)]">
          Electrophysiology & waveform foundations
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Rigorous interval lessons cover physiology, measurement technique, normal and abnormal values, bedside significance, nursing implications, and escalation triggers — each paired with animated telemetry and measurement practice below.
        </p>
      </div>

      {ECG_FOUNDATIONAL_LESSON_EXPANSION.map((unit) => (
        <article
          key={unit.id}
          id={unit.id}
          className="scroll-mt-24 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">{unit.category}</p>
          <h3 className="mt-1 text-xl font-bold text-[var(--semantic-text-primary)]">{unit.title}</h3>
          {"objectives" in unit && unit.objectives ? <BulletList title="Objectives" items={unit.objectives} /> : null}
          {"interpretationFramework" in unit && unit.interpretationFramework ? (
            <div className="mt-4">
              <BulletList title="Systematic framework" items={unit.interpretationFramework} />
            </div>
          ) : null}
          {"teachingPoints" in unit && unit.teachingPoints ? (
            <div className="mt-4">
              <BulletList title="Teaching points" items={unit.teachingPoints} />
            </div>
          ) : null}
          {"measurementTechnique" in unit && unit.measurementTechnique ? (
            <div className="mt-4">
              <BulletList title="How to measure" items={unit.measurementTechnique} />
            </div>
          ) : null}
          {"clinicalCorrelation" in unit && unit.clinicalCorrelation ? (
            <div className="mt-4">
              <BulletList title="Clinical correlation" items={unit.clinicalCorrelation} />
            </div>
          ) : null}
          {"normalValues" in unit && unit.normalValues ? (
            <dl className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(unit.normalValues).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-[var(--semantic-border-soft)] px-3 py-2">
                  <dt className="text-[10px] font-bold uppercase text-[var(--semantic-text-muted)]">{k}</dt>
                  <dd className="text-sm font-semibold text-[var(--semantic-text-primary)]">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </article>
      ))}
    </section>
  );
}

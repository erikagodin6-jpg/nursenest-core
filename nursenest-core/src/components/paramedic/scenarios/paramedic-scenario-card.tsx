import Link from "next/link";
import type { ParamedicScenarioCatalogEntry } from "@/lib/paramedic/scenarios/paramedic-scenario-catalog";
import { calculateScenarioOperationalRisk } from "@/lib/paramedic/runtime/scenario-runtime";

function formatReadinessDomain(domain: ParamedicScenarioCatalogEntry["readinessDomains"][number]): string {
  return domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function riskLabel(risk: number): string {
  if (risk >= 85) return "Immediate";
  if (risk >= 70) return "Critical";
  if (risk >= 45) return "Escalating";
  return "Stable";
}

export function ParamedicScenarioCard({
  entry,
  href,
}: {
  entry: ParamedicScenarioCatalogEntry;
  href: string;
}) {
  const { scenario } = entry;
  const risk = calculateScenarioOperationalRisk(scenario);
  const primaryEvent = scenario.timeline[0];
  const ecgFinding = scenario.ecg?.findings[0];

  return (
    <article className="overflow-hidden rounded-[28px] border border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_92%,var(--semantic-surface-raised))] shadow-sm">
      <div className="border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--semantic-info)_12%,transparent),color-mix(in_srgb,var(--semantic-danger)_8%,transparent))] px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_32%,transparent)] bg-[color-mix(in_srgb,var(--semantic-danger)_12%,transparent)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--semantic-danger)]">
            {riskLabel(risk)} risk
          </span>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] bg-[color-mix(in_srgb,var(--theme-card-bg)_80%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--theme-muted-text)]">
            {scenario.category}
          </span>
          {entry.premium ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,transparent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--semantic-warning)]">
              Premium scenario
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-2xl font-black tracking-tight text-[var(--theme-heading-text)]">
          {scenario.title}
        </h3>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--theme-muted-text)]">
          {primaryEvent?.description ?? entry.seo.description}
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5 px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">
              Operational focus
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.readinessDomains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-[color-mix(in_srgb,var(--theme-muted-bg)_80%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]"
                >
                  {formatReadinessDomain(domain)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">
              Active risks
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-[var(--theme-body-text)]">
              {scenario.activeRisks.slice(0, 4).map((riskItem) => (
                <li key={riskItem} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-danger)]" />
                  <span>{riskItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[color-mix(in_srgb,var(--semantic-surface-raised)_85%,transparent)] px-6 py-6 md:border-l md:border-t-0">
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Vitals</dt>
              <dd className="mt-2 font-semibold text-[var(--theme-heading-text)]">
                HR {scenario.patient.vitals.hr} · BP {scenario.patient.vitals.bp} · SpO₂ {scenario.patient.vitals.spo2}%
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">Transport</dt>
              <dd className="mt-2 font-semibold text-[var(--theme-heading-text)]">
                {scenario.transport.activation ?? "none"} · {scenario.transport.etaMinutes} min ETA
              </dd>
            </div>
            {ecgFinding ? (
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--theme-muted-text)]">ECG signal</dt>
                <dd className="mt-2 text-[var(--theme-body-text)]">{ecgFinding.label}</dd>
              </div>
            ) : null}
          </dl>

          <Link
            href={href}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-2xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-black text-[var(--theme-primary-contrast)] shadow-sm transition hover:translate-y-[-1px] hover:shadow-md"
          >
            Open scenario
          </Link>
        </aside>
      </div>
    </article>
  );
}

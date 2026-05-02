import Link from "next/link";
import type { OsceStationFamily } from "@/lib/scenarios/osce-station-kinds";

const FAMILY_LABEL: Record<OsceStationFamily, string> = {
  assessment_history: "Assessment / history",
  communication: "Communication",
  prioritization_delegation: "Prioritization / delegation",
  medication_safety: "Medication safety",
  documentation_sbar: "Documentation / SBAR",
  patient_teaching: "Patient teaching",
  clinical_judgment: "Clinical judgment",
};

export function OsceStationCard({
  title,
  family,
  minutes,
  meta,
  href,
}: {
  title: string;
  family: OsceStationFamily;
  minutes?: number;
  meta?: string;
  /** When set, the whole card links to the station detail route (learner or marketing). */
  href?: string;
}) {
  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">{FAMILY_LABEL[family]}</p>
      <h3 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--theme-body-text)]">
        {typeof minutes === "number" ? (
          <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--bg-card))] px-2 py-0.5 font-medium text-[var(--semantic-info)]">
            {minutes} min station
          </span>
        ) : null}
        <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5">Checklist + rationales</span>
      </div>
      {meta ? <p className="mt-2 text-sm text-[var(--theme-body-text)]">{meta}</p> : null}
    </>
  );

  const articleClass =
    "rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--bg-card))] p-4";

  if (href) {
    return (
      <Link href={href} className={`${articleClass} block transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)]`}>
        {inner}
      </Link>
    );
  }

  return <article className={articleClass}>{inner}</article>;
}

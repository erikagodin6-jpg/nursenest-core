import type { Metadata } from "next";
import Link from "next/link";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayAndProfessionQuery } from "@/lib/scenarios/scenario-routes";
import { VentRtSimulationPlayer } from "@/components/rt-ventilator/vent-rt-simulation-player";
import { VentAdvancedSimulationPlayer } from "@/components/rt-ventilator/vent-advanced-simulation-player";

export const metadata: Metadata = {
  title: "RT Ventilator Simulations | NurseNest",
  description:
    "Best-in-class RT simulation ecosystem — ventilator emergencies, NICU/PICU respiratory, ECMO, and transport. " +
    "Live waveforms, branching pathways, consequence of inaction panels, and Hamilton/SickKids–level clinical accuracy.",
  robots: { index: false, follow: true },
};

const PATHWAY = "us-allied-core";

export default async function RtVentilatorScenariosPage() {
  const { t } = await getLearnerMarketingBundle();
  const practiceHref = `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY)}&alliedProfession=${encodeURIComponent("respiratory")}`;
  const scenariosHref = withScenarioPathwayAndProfessionQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, PATHWAY, "respiratory");

  return (
    <div className="space-y-10" data-nn-rt-ventilator-scenarios="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">RT Simulation Ecosystem</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          The most comprehensive respiratory therapy simulation platform — ventilator emergencies, NICU, PICU,
          ECMO, and transport RT. Every simulation uses live-generated waveforms, branching clinical pathways,
          and mandatory "What happens if you do nothing?" consequence analysis.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
          {[
            ["🚨", "15 ventilator emergencies"],
            ["👶", "9 neonatal (NICU)"],
            ["🧒", "8 pediatric (PICU)"],
            ["❤", "8 ECMO simulations"],
            ["🚁", "6 transport RT"],
          ].map(([icon, label]) => (
            <span key={label} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 font-semibold text-[var(--semantic-text-secondary)]">
              {icon} {label}
            </span>
          ))}
        </div>
      </header>

      {/* Phase 3B-F: Advanced simulations (all categories) */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--semantic-text-primary)]">
          Advanced Clinical Simulations
        </h3>
        <VentAdvancedSimulationPlayer />
      </section>

      {/* Foundational RT simulations (original Phase 3 core cases) */}
      <section>
        <h3 className="mb-1 text-base font-bold text-[var(--semantic-text-primary)]">
          Foundational RT Cases
        </h3>
        <p className="mb-4 text-sm text-[var(--semantic-text-secondary)]">
          ARDS management, weaning trials, bronchospasm, and flow starvation — the core RT competency cases.
        </p>
        <VentRtSimulationPlayer />
      </section>

      {/* Bridge to broader study */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5">
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">Continue your RT prep</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Supplement simulations with pathway-scoped practice questions and clinical scenarios.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href={scenariosHref}
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm font-semibold text-[var(--semantic-brand)] shadow-sm hover:bg-[var(--semantic-surface-alt)]"
            data-nn-rt-vent-link-scenarios=""
          >
            {t("rtVentilator.scenarios.linkClinical")}
          </Link>
          <Link
            href={practiceHref}
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm font-semibold text-[var(--semantic-brand)] shadow-sm hover:bg-[var(--semantic-surface-alt)]"
            data-nn-rt-vent-link-practice=""
          >
            {t("rtVentilator.scenarios.linkPractice")}
          </Link>
        </div>
      </section>
    </div>
  );
}

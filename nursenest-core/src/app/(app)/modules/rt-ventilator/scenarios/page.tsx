import type { Metadata } from "next";
import Link from "next/link";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayAndProfessionQuery } from "@/lib/scenarios/scenario-routes";
import { VentRtSimulationPlayer } from "@/components/rt-ventilator/vent-rt-simulation-player";

export const metadata: Metadata = {
  title: "RT Ventilator Simulations | NurseNest",
  description:
    "Case-based ventilator simulations for respiratory therapists — ARDS management, bronchospasm troubleshooting, " +
    "weaning protocols, asynchrony recognition, and emergency escalation with live waveform graphics.",
  robots: { index: false, follow: true },
};

const PATHWAY = "us-allied-core";

export default async function RtVentilatorScenariosPage() {
  const { t } = await getLearnerMarketingBundle();
  const practiceHref = `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY)}&alliedProfession=${encodeURIComponent("respiratory")}`;
  const scenariosHref = withScenarioPathwayAndProfessionQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, PATHWAY, "respiratory");

  return (
    <div className="space-y-8" data-nn-rt-ventilator-scenarios="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">Ventilator Simulations</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Case-based RT simulations with live-generated waveforms. Diagnose ventilator problems, manage
          asynchrony, conduct weaning trials, and respond to emergencies — all with real clinical decision
          points and immediate feedback.
        </p>
      </header>

      {/* RT simulation player — the main feature */}
      <VentRtSimulationPlayer />

      {/* Bridge links to broader study modes */}
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

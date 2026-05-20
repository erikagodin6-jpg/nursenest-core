import type { Metadata } from "next";
import Link from "next/link";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayAndProfessionQuery } from "@/lib/scenarios/scenario-routes";

export const metadata: Metadata = {
  title: "Ventilator scenarios | NurseNest",
  robots: { index: false, follow: true },
};

const PATHWAY = "us-allied-core";

export default async function RtVentilatorScenariosPage() {
  const { t } = await getLearnerMarketingBundle();
  const practiceHref = `/app/practice-tests?pathwayId=${encodeURIComponent(PATHWAY)}&alliedProfession=${encodeURIComponent("respiratory")}`;
  const scenariosHref = withScenarioPathwayAndProfessionQuery(SCENARIO_LEARNER_ROUTES.clinicalScenarios, PATHWAY, "respiratory");

  return (
    <div className="space-y-6" data-nn-rt-ventilator-scenarios="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.scenarios.title")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.scenarios.intro")}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={scenariosHref}
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm font-semibold text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] hover:bg-[var(--semantic-surface-alt)]"
          data-nn-rt-vent-link-scenarios=""
        >
          {t("rtVentilator.scenarios.linkClinical")}
        </Link>
        <Link
          href={practiceHref}
          className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm font-semibold text-[var(--semantic-brand)] shadow-[var(--semantic-shadow-soft)] hover:bg-[var(--semantic-surface-alt)]"
          data-nn-rt-vent-link-practice=""
        >
          {t("rtVentilator.scenarios.linkPractice")}
        </Link>
      </div>
    </div>
  );
}

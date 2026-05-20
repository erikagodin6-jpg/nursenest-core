import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { MechanicalVentWaveformPanel } from "@/components/rt-ventilator/mechanical-vent-waveform-panel";

const ALLIED_PATHWAY_ID = "us-allied-core";

export function RtVentilatorModuleHub({ t }: { t: LearnerMarketingT }) {
  const practiceHref = `/app/practice-tests?pathwayId=${encodeURIComponent(ALLIED_PATHWAY_ID)}&alliedProfession=${encodeURIComponent("respiratory")}`;
  const flashHref = `/app/flashcards?pathwayId=${encodeURIComponent(ALLIED_PATHWAY_ID)}&alliedProfession=${encodeURIComponent("respiratory")}`;
  const lessonsHref = `/app/lessons`;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-3">
        <Link
          href="/modules/rt-ventilator/waveforms"
          className="group rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none"
          data-nn-rt-vent-nav-waveforms=""
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-info)]">
            {t("rtVentilator.hub.navWaveformsEyebrow")}
          </p>
          <h2 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.hub.navWaveformsTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.hub.navWaveformsDesc")}</p>
          <span className="mt-4 inline-flex text-xs font-semibold text-[var(--semantic-info)] group-hover:underline">
            {t("rtVentilator.hub.navWaveformsCta")}
          </span>
        </Link>

        <Link
          href="/modules/rt-ventilator/scenarios"
          className="group rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_07%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none"
          data-nn-rt-vent-nav-scenarios=""
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-4)_90%,var(--semantic-text-primary))]">
            {t("rtVentilator.hub.navScenariosEyebrow")}
          </p>
          <h2 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.hub.navScenariosTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.hub.navScenariosDesc")}</p>
          <span className="mt-4 inline-flex text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-4)_88%,var(--semantic-text-primary))] group-hover:underline">
            {t("rtVentilator.hub.navScenariosCta")}
          </span>
        </Link>

        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">{t("rtVentilator.hub.linkedLoopsEyebrow")}</p>
          <h2 className="mt-2 text-lg font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.hub.linkedLoopsTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.hub.linkedLoopsDesc")}</p>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            <li>
              <Link className="text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={lessonsHref}>
                {t("rtVentilator.hub.linkLessons")}
              </Link>
            </li>
            <li>
              <Link className="text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={flashHref}>
                {t("rtVentilator.hub.linkFlashcards")}
              </Link>
            </li>
            <li>
              <Link className="text-[var(--semantic-brand)] underline-offset-2 hover:underline" href={practiceHref}>
                {t("rtVentilator.hub.linkPractice")}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <MechanicalVentWaveformPanel label={t("rtVentilator.hub.sampleWaveformLabel")} />

      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-5 sm:px-6">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.hub.catPracticeTitle")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.hub.catPracticeBody")}</p>
        <Link
          href={`/app/practice-tests?pathwayId=${encodeURIComponent(ALLIED_PATHWAY_ID)}&alliedProfession=${encodeURIComponent("respiratory")}&cat=1`}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[var(--semantic-surface-alt)]"
          data-nn-rt-vent-open-cat=""
        >
          {t("rtVentilator.hub.catPracticeCta")}
        </Link>
      </section>
    </div>
  );
}

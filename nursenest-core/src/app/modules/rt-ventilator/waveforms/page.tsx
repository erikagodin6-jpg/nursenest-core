import type { Metadata } from "next";
import { MechanicalVentWaveformPanel } from "@/components/rt-ventilator/mechanical-vent-waveform-panel";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export const metadata: Metadata = {
  title: "Ventilator waveforms | NurseNest",
  robots: { index: false, follow: true },
};

export default async function RtVentilatorWaveformsPage() {
  const { t } = await getLearnerMarketingBundle();
  return (
    <div className="space-y-6" data-nn-rt-ventilator-waveforms="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">{t("rtVentilator.waveforms.title")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("rtVentilator.waveforms.intro")}</p>
      </header>
      <MechanicalVentWaveformPanel label={t("rtVentilator.hub.sampleWaveformLabel")} />
    </div>
  );
}

import type { Metadata } from "next";
import { VentWaveformWorkspace } from "@/components/rt-ventilator/vent-waveform-workspace";
import { VentWaveformDetectivePlayer } from "@/components/rt-ventilator/vent-waveform-detective-player";

export const metadata: Metadata = {
  title: "Ventilator waveform interpretation | NurseNest",
  description:
    "Clinically accurate ventilator waveform engine — pressure, flow, and volume traces for all modes. " +
    "Phase 3A: 15-case Waveform Detective mode for active identification practice with P-V and F-V loops, " +
    "consequence of inaction analysis, and HFOV support.",
  robots: { index: false, follow: true },
};

export default function RtVentilatorWaveformsPage() {
  return (
    <div className="space-y-10" data-nn-rt-ventilator-waveforms="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">
          Waveform Interpretation
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Clinically accurate pressure, flow, and volume traces for every ventilator mode — including HFOV,
          neonatal physiology, P-V loops, and F-V loops. Study normal waveforms, identify pathological patterns,
          and test your skills with the Waveform Detective active-identification mode.
        </p>
      </header>

      {/* Phase 3A: Waveform Detective Mode */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--semantic-text-primary)]">🔍 Waveform Detective</h3>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              15 cases — identify the abnormality, explain the physiology, select the intervention.
              Live-generated waveforms with P-V and F-V loops. Consequence of inaction on every case.
            </p>
          </div>
        </div>
        <VentWaveformDetectivePlayer />
      </section>

      {/* Divider */}
      <div className="border-t border-[var(--semantic-border-soft)]" />

      {/* Waveform library + settings visualizer */}
      <section>
        <h3 className="mb-4 text-base font-bold text-[var(--semantic-text-primary)]">
          Waveform Library &amp; Settings Visualizer
        </h3>
        <VentWaveformWorkspace />
      </section>
    </div>
  );
}

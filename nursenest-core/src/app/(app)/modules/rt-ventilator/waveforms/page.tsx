import type { Metadata } from "next";
import { VentWaveformWorkspace } from "@/components/rt-ventilator/vent-waveform-workspace";

export const metadata: Metadata = {
  title: "Ventilator waveform interpretation | NurseNest",
  description:
    "Clinically accurate ventilator waveform engine — pressure, flow, and volume traces for Volume Control, Pressure Control, Pressure Support, SIMV, CPAP, BiPAP, and APRV. Includes patient-ventilator asynchrony library and interactive settings visualizer.",
  robots: { index: false, follow: true },
};

export default function RtVentilatorWaveformsPage() {
  return (
    <div className="space-y-6" data-nn-rt-ventilator-waveforms="">
      <header>
        <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">
          Waveform Interpretation
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Clinically accurate pressure, flow, and volume traces for every ventilator mode. Study normal
          waveforms, pathophysiology, and patient-ventilator asynchrony — then use the Settings Visualizer
          to see how each parameter changes the waveform in real time.
        </p>
      </header>
      <VentWaveformWorkspace />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { EcgEducationalDisclaimer } from "@/components/ecg/ecg-educational-disclaimer";
import { EcgRhythmStrip } from "@/components/ecg/ecg-rhythm-strip";

export function EcgTelemetryClient() {
  const [mode, setMode] = useState<"nsr" | "afib" | "vt">("nsr");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 900);
    return () => window.clearInterval(id);
  }, []);

  const jitter = mode === "afib" ? (tick % 3) * 2 : 0;

  return (
    <div className="space-y-4" data-nn-ecg-telemetry>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-brand)]">RN telemetry lab</p>
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Telemetry simulator</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Switch modes to rehearse prioritization language. Waveforms remain educational schematics.
        </p>
        <EcgEducationalDisclaimer />
      </header>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["nsr", "NSR"],
            ["afib", "AFib"],
            ["vt", "Wide-complex tach"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              mode === id
                ? "border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                : "border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-muted)] text-[var(--semantic-text-secondary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ transform: `translateX(-${jitter}px)` }} className="transition-transform">
        <EcgRhythmStrip rhythmId={mode} />
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
        <li>Call out rate, rhythm regularity, P-wave organization, QRS width, and perfusion cues.</li>
        <li>Escalate per unit policy — this UI does not issue medical orders.</li>
      </ul>
    </div>
  );
}

"use client";

/**
 * VentHubPreview — compact live-generated waveform panel for the module hub.
 * Renders a 3-panel VC square-flow waveform as a teaser. No props needed — uses
 * default config and runs entirely client-side.
 */

import { useMemo } from "react";
import { VentScalarDisplayCompact } from "@/components/rt-ventilator/vent-scalar-display";
import { generateVentWaveform, defaultVentConfigForMode } from "@/lib/rt-ventilator/vent-waveform-generator";

export function VentHubPreview({ label }: { label?: string }) {
  const result = useMemo(
    () =>
      generateVentWaveform(
        { ...defaultVentConfigForMode("volume_control"), tidalVolume: 500, peep: 5, rr: 12 },
        { breathCount: 3, sampleRate: 80 },
      ),
    [],
  );

  return <VentScalarDisplayCompact result={result} label={label ?? "Live ventilator scalar waveforms"} />;
}

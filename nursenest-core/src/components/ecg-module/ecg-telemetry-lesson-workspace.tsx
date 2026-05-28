"use client";

import { useCallback, useState, type ReactNode } from "react";
import { EcgLiveStrip } from "@/components/study/ecg-live-strip";
import { EcgStripMeasurementLab } from "@/components/ecg-module/ecg-strip-measurement-lab";
import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import {
  readEcgTelemetryCompetency,
  writeEcgTelemetryCompetency,
} from "@/lib/ecg-module/ecg-telemetry-competency.client";
import { cn } from "@/lib/utils";

export function EcgTelemetryLessonWorkspace({
  lessonId,
  title,
  stripConfig,
  interpretationMode = "guided",
  children,
}: {
  lessonId: string;
  title: string;
  stripConfig: EcgStripMediaConfig | null;
  interpretationMode?: "guided" | "independent";
  children: ReactNode;
}) {
  const [mode, setMode] = useState<"guided" | "independent">(interpretationMode);

  const recordMeasurement = useCallback(
    (correct: boolean) => {
      const c = readEcgTelemetryCompetency();
      writeEcgTelemetryCompetency("core", {
        ...c,
        measurementAttempts: c.measurementAttempts + 1,
        measurementCorrect: c.measurementCorrect + (correct ? 1 : 0),
        lessonsReviewed: c.lessonsReviewed.includes(lessonId) ? c.lessonsReviewed : [...c.lessonsReviewed, lessonId],
      });
    },
    [lessonId],
  );

  return (
    <div className="nn-ecg-telemetry-lesson">
      {stripConfig ? (
        <div className="nn-ecg-telemetry-lesson__strip-stage">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_90%,var(--semantic-text-primary))]">
              Live telemetry strip
            </p>
            <div className="flex gap-1">
              {(["guided", "independent"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                    mode === m
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
                      : "border-[var(--semantic-border-soft)]",
                  )}
                >
                  {m} mode
                </button>
              ))}
            </div>
          </div>
          <EcgLiveStrip
            config={stripConfig}
            mode="live"
            title={`${title} — ${mode === "guided" ? "annotated review" : "independent interpretation"}`}
            leadLabel="Lead II"
            showMeasurements
            showCaliper
            zoomable
            playbackSpeeds
            frameStep
            themeAwareGrid
          />
          <EcgStripMeasurementLab onMeasured={recordMeasurement} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

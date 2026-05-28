"use client";

import { useEffect, useState } from "react";
import {
  readEcgTelemetryCompetency,
  telemetryReadinessPct,
  type EcgTelemetryCompetency,
} from "@/lib/ecg-module/ecg-telemetry-competency.client";
import { cn } from "@/lib/utils";

export function EcgTelemetryReadinessBand({ tierLabel = "Telemetry readiness" }: { tierLabel?: string }) {
  const [competency, setCompetency] = useState<EcgTelemetryCompetency>(() => readEcgTelemetryCompetency());
  const pct = telemetryReadinessPct(competency);

  useEffect(() => {
    const sync = () => setCompetency(readEcgTelemetryCompetency());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const fill =
    pct >= 80 ? "nn-progress-fill-semantic-success" : pct >= 55 ? "nn-progress-fill-semantic-info" : "nn-progress-fill-semantic-warning";

  return (
    <section className="nn-ecg-readiness-band">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">{tierLabel}</p>
          <p className="text-2xl font-bold text-[var(--semantic-text-primary)]">{pct}%</p>
        </div>
        <span className="nn-badge-semantic-info rounded-full px-2 py-0.5 text-[10px] font-semibold">ECG lab</span>
      </div>
      <div className="nn-progress-track-semantic mt-3 h-2.5 overflow-hidden rounded-full">
        <div className={cn("h-full rounded-full transition-[width]", fill)} style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-3 grid gap-1 text-xs text-[var(--semantic-text-secondary)] sm:grid-cols-2">
        <li>Lessons engaged: {competency.lessonsReviewed.length}</li>
        <li>
          Measurement accuracy:{" "}
          {competency.measurementAttempts
            ? `${Math.round((competency.measurementCorrect / competency.measurementAttempts) * 100)}%`
            : "—"}
        </li>
      </ul>
    </section>
  );
}

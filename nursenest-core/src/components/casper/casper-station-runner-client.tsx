"use client";

import { useEffect, useMemo, useState } from "react";

import { buildCasperFullLengthSessionPlan } from "@/lib/casper/casper-full-length-engine";

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function CasperStationRunnerClient() {
  const plan = useMemo(() => buildCasperFullLengthSessionPlan(), []);
  const [stationIndex, setStationIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [lockedStations, setLockedStations] = useState<Record<string, boolean>>({});

  const station = plan.stations[stationIndex];

  const [remainingSeconds, setRemainingSeconds] = useState(
    station?.responseTimeSeconds ?? 0,
  );

  useEffect(() => {
    setRemainingSeconds(station?.responseTimeSeconds ?? 0);
  }, [station?.id, station?.responseTimeSeconds]);

  useEffect(() => {
    if (!station) return;
    if (lockedStations[station.id]) return;

    if (remainingSeconds <= 0) {
      setLockedStations((current) => ({
        ...current,
        [station.id]: true,
      }));

      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [lockedStations, remainingSeconds, station]);

  const isFinalStation = stationIndex === plan.stations.length - 1;

  if (!station) {
    return (
      <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
          Full-length simulation complete
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">
          Your responses are ready for review.
        </h2>
      </section>
    );
  }

  const stationLocked = Boolean(lockedStations[station.id]);

  return (
    <section className="rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-8 lg:p-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--semantic-text-secondary)]">
            Station {station.stationNumber} of {plan.totalScenarios}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--semantic-text-primary)]">
            {station.sectionKind === "video" ? "Video response station" : "Typed response station"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {stationLocked ? (
            <div className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
              Station locked
            </div>
          ) : null}

          <div className="rounded-full border border-[var(--semantic-border-primary)] px-5 py-3 text-sm font-semibold text-[var(--semantic-text-secondary)]">
            {formatSeconds(remainingSeconds)} remaining
          </div>
        </div>
      </div>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-[var(--semantic-surface-secondary)]">
        <div
          className="h-full rounded-full bg-[var(--theme-primary)]"
          style={{ width: `${Math.round(((stationIndex + 1) / plan.stations.length) * 100)}%` }}
        />
      </div>

      <article className="mt-10 rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
          {station.sectionKey.replace(/-/g, " ")}
        </p>

        <h3 className="mt-3 text-2xl font-semibold text-[var(--semantic-text-primary)]">
          Practice prompt placeholder
        </h3>

        <p className="mt-5 text-base leading-8 text-[var(--semantic-text-secondary)]">
          This runner uses official-style section timing and station order. Scenario prompt injection will connect this station to the CASPer scenario registry and future video prompt assets.
        </p>
      </article>

      {station.sectionKind === "video" ? (
        <div className="mt-10 rounded-[2rem] border border-dashed border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-secondary)] p-8 text-center">
          <h3 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">
            Video recording placeholder
          </h3>
          <p className="mt-4 text-base leading-8 text-[var(--semantic-text-secondary)]">
            Webcam and microphone capture will attach here. For now, this preserves accurate one-minute video-response pacing and section flow.
          </p>
        </div>
      ) : (
        <textarea
          disabled={stationLocked}
          value={responses[station.id] ?? ""}
          onChange={(event) =>
            setResponses((current) => ({
              ...current,
              [station.id]: event.target.value,
            }))
          }
          placeholder="Type your response to both questions in this 3.5-minute practice window..."
          className="mt-10 min-h-[280px] w-full rounded-[2rem] border border-[var(--semantic-border-primary)] bg-[var(--semantic-surface-primary)] p-6 text-base leading-8 text-[var(--semantic-text-primary)] outline-none focus:border-[var(--theme-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        />
      )}

      {stationLocked ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          Time has expired for this station. Responses are now locked to simulate official Casper pacing.
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={() => setStationIndex((current) => current + 1)}
          className="rounded-2xl bg-[var(--theme-primary)] px-6 py-4 font-semibold text-white shadow-sm hover:opacity-90"
        >
          {isFinalStation ? "Finish simulation" : "Next station"}
        </button>
      </div>
    </section>
  );
}

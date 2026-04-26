"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";

const BODY_SYSTEMS = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Renal",
  "Endocrine",
  "Gastrointestinal",
  "Maternity",
  "Pediatrics",
] as const;

const QUESTION_COUNTS = [5, 10, 20, 50] as const;

/**
 * Compact practice exam launcher: question count + body systems → same `/api/practice-tests`
 * contract as the legacy setup flow, without the extra builder surfaces.
 */
export function PracticeExamLauncherClient({ pathwayId }: { pathwayId: string | null }) {
  const [questionCount, setQuestionCount] = useState<(typeof QUESTION_COUNTS)[number]>(10);
  const [selectedSystems, setSelectedSystems] = useState<string[]>(() => [...BODY_SYSTEMS]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allSelected = useMemo(
    () => BODY_SYSTEMS.length > 0 && BODY_SYSTEMS.every((s) => selectedSystems.includes(s)),
    [selectedSystems],
  );

  function toggleSystem(system: string) {
    setSelectedSystems((prev) =>
      prev.includes(system) ? prev.filter((x) => x !== system) : [...prev, system],
    );
  }

  function selectAllSystems() {
    setSelectedSystems([...BODY_SYSTEMS]);
  }

  function clearAllSystems() {
    setSelectedSystems([]);
  }

  async function handleStart() {
    setError(null);
    setIsSubmitting(true);
    try {
      const targeted = selectedSystems.length > 0;
      const payload = buildPracticeExamStartPayload({
        title: "Practice exam",
        questionCount,
        selectionMode: targeted ? "targeted" : "random",
        topicNames: targeted ? selectedSystems : [],
        pathwayId: pathwayId ?? null,
        timedMode: false,
        timeLimitSec: null,
        difficultyMin: null,
        difficultyMax: null,
        sessionMode: "tutor",
        rationaleVisibilityMode: "immediate",
      });

      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-nn-study-launch-surface": "practice_exams",
        },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not start practice right now.");
        return;
      }
      if (data.id) {
        window.location.href = `/app/practice-tests/${data.id}`;
      }
    } catch {
      setError("Could not start practice right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="nn-card max-w-3xl space-y-5 p-5 sm:p-6">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-[var(--semantic-text-primary)] sm:text-2xl">Practice exam</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Pick how many items to run and which body systems to pull from. During the session you will see the same
          exam-style layout as adaptive practice; after each answer you will get rationales before continuing.
        </p>
      </header>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">Question count</p>
        <div className="flex flex-wrap gap-2">
          {QUESTION_COUNTS.map((count) => {
            const active = questionCount === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                aria-pressed={active}
                className={`min-h-10 min-w-[2.75rem] rounded-full border px-3 text-sm font-semibold transition ${
                  active
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Body systems
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAllSystems}
              disabled={allSelected}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-45"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearAllSystems}
              disabled={selectedSystems.length === 0}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-45"
            >
              Clear all
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {BODY_SYSTEMS.map((system) => {
            const active = selectedSystems.includes(system);
            return (
              <button
                key={system}
                type="button"
                onClick={() => toggleSystem(system)}
                aria-pressed={active}
                className={`min-h-10 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                  active
                    ? "border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
                }`}
              >
                {system}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--semantic-text-muted)]">
          Clear all systems to practice across the full eligible pool for your track.
        </p>
      </div>

      {error ? (
        <p className="text-sm font-medium text-[var(--semantic-warning-contrast)]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => void handleStart()}
          disabled={isSubmitting}
          className="nn-btn-primary inline-flex min-h-11 min-w-[12rem] items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Starting…" : "Start practice exam"}
        </button>
        <Link
          href="/app/questions/bank"
          className="text-center text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline sm:text-right"
        >
          Advanced filters and question bank
        </Link>
      </div>
    </section>
  );
}

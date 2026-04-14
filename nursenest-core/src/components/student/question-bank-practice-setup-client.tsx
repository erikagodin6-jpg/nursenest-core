"use client";

import { useMemo, useState } from "react";

type PracticeModeId = "weak_areas" | "by_system" | "random_mix" | "custom_quiz" | "review_incorrect";

const PRACTICE_MODES: Array<{ id: PracticeModeId; label: string; description: string }> = [
  { id: "weak_areas", label: "Weak areas", description: "Focus on topics where your performance is lowest." },
  { id: "by_system", label: "By body system", description: "Practice questions from specific systems only." },
  { id: "random_mix", label: "Random mix", description: "Get a mixed set across your pathway." },
  { id: "review_incorrect", label: "Review incorrect answers", description: "Retry questions you previously missed." },
  { id: "custom_quiz", label: "Custom quiz", description: "Build a quiz with your own filters." },
];

const SYSTEM_OPTIONS = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Renal",
  "Endocrine",
  "Gastrointestinal",
  "Maternity",
  "Pediatrics",
];

export function QuestionBankPracticeSetupClient({ pathwayId }: { pathwayId: string | null }) {
  const [selectedMode, setSelectedMode] = useState<PracticeModeId | null>(null);
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20 | 50 | "custom">(10);
  const [customQuestionCount, setCustomQuestionCount] = useState("20");
  const [timedMode, setTimedMode] = useState(false);
  const [tutorMode, setTutorMode] = useState(true);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [customWeakOnly, setCustomWeakOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBySystem = selectedMode === "by_system";
  const isCustomQuiz = selectedMode === "custom_quiz";
  const reviewIncorrectUnsupported = selectedMode === "review_incorrect";
  const needsSystemSelector = isBySystem || isCustomQuiz;

  const resolvedQuestionCount = useMemo(() => {
    if (questionCount !== "custom") return questionCount;
    const parsed = Number.parseInt(customQuestionCount, 10);
    if (!Number.isFinite(parsed)) return 20;
    return Math.max(5, Math.min(100, parsed));
  }, [customQuestionCount, questionCount]);

  function toggleSystem(system: string) {
    setSelectedSystems((prev) =>
      prev.includes(system) ? prev.filter((entry) => entry !== system) : [...prev, system],
    );
  }

  async function handleStartPractice() {
    if (!selectedMode) {
      setError("Select a practice mode to continue.");
      return;
    }
    if (reviewIncorrectUnsupported) {
      setError("Review incorrect answers is not supported by the current start-practice API yet.");
      return;
    }
    if (needsSystemSelector && selectedSystems.length === 0) {
      setError("Select at least one system for this mode.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      let selectionMode: "random" | "targeted" | "weak" = "random";
      if (selectedMode === "weak_areas") selectionMode = "weak";
      if (selectedMode === "by_system") selectionMode = "targeted";
      if (selectedMode === "custom_quiz") selectionMode = customWeakOnly ? "weak" : "targeted";

      const topicNames = needsSystemSelector ? selectedSystems : [];
      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectionMode,
          questionCount: resolvedQuestionCount,
          timedMode,
          topicNames,
          pathwayId: pathwayId ?? null,
          linearDeliveryMode: tutorMode ? "practice" : "exam",
          difficultyMin: null,
          difficultyMax: null,
        }),
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
    <section className="nn-card space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Question Bank</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Choose how you want your practice questions delivered.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRACTICE_MODES.map((mode) => {
          const active = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSelectedMode(mode.id)}
              aria-pressed={active}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[var(--semantic-panel-muted)]"
              }`}
            >
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{mode.label}</p>
              <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{mode.description}</p>
            </button>
          );
        })}
      </div>

      {selectedMode ? (
        <div className="space-y-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
          <div className="space-y-2">
            <p className="text-sm text-[var(--semantic-text-secondary)]">Question count</p>
            <div className="flex flex-wrap gap-2">
              {([5, 10, 20, 50] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    questionCount === count
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  {count}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setQuestionCount("custom")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  questionCount === "custom"
                    ? "border-[color-mix(in_srgb,var(--semantic-brand)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                }`}
              >
                Custom
              </button>
            </div>
            {questionCount === "custom" ? (
              <label className="text-sm">
                <span className="text-[var(--semantic-text-secondary)]">Custom Count</span>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={customQuestionCount}
                  onChange={(event) => setCustomQuestionCount(event.target.value)}
                  className="mt-1 block min-h-11 w-28 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                />
              </label>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-[var(--semantic-text-secondary)]">Timing</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTimedMode(false)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    !timedMode
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Untimed
                </button>
                <button
                  type="button"
                  onClick={() => setTimedMode(true)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    timedMode
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Timed
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--semantic-text-secondary)]">Session mode</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTutorMode(true)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    tutorMode
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Tutor mode
                </button>
                <button
                  type="button"
                  onClick={() => setTutorMode(false)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    !tutorMode
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Exam mode
                </button>
              </div>
            </div>
          </div>

          {needsSystemSelector ? (
            <div className="space-y-2">
              <p className="text-sm text-[var(--semantic-text-secondary)]">Select Systems</p>
              <div className="flex flex-wrap gap-2">
                {SYSTEM_OPTIONS.map((system) => {
                  const active = selectedSystems.includes(system);
                  return (
                    <button
                      key={system}
                      type="button"
                      onClick={() => toggleSystem(system)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        active
                          ? "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {system}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          {isCustomQuiz ? (
            <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                checked={customWeakOnly}
                onChange={(event) => setCustomWeakOnly(event.target.checked)}
              />
              Weak-only focus
            </label>
          ) : null}
          {reviewIncorrectUnsupported ? (
            <p className="text-xs text-[var(--semantic-warning-contrast)]">
              This mode is shown for transparency, but direct incorrect-only session creation is not currently supported
              by the existing start-practice API.
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-sm text-[var(--semantic-warning-contrast)]">{error}</p> : null}

      <button
        type="button"
        onClick={() => void handleStartPractice()}
        disabled={!selectedMode || isSubmitting || reviewIncorrectUnsupported}
        className="nn-btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
      >
        {isSubmitting ? "Starting..." : "Start Practice"}
      </button>
    </section>
  );
}

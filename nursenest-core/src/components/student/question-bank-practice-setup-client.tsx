"use client";

import { useMemo, useState } from "react";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";

type PracticeModeId = "weak_areas" | "by_system" | "mixed_all_categories";
type SessionMode = "tutor" | "exam";
type RationaleVisibilityMode = "immediate" | "review";

const PRACTICE_MODES: Array<{ id: PracticeModeId; label: string; description: string }> = [
  {
    id: "mixed_all_categories",
    label: "Mixed all categories",
    description: "Build a balanced exam across all available systems.",
  },
  {
    id: "by_system",
    label: "By category/system",
    description: "Restrict the exam to selected systems.",
  },
  {
    id: "weak_areas",
    label: "Target weak areas",
    description: "Use your low-performing topics for focused remediation.",
  },
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
  const [sessionMode, setSessionMode] = useState<SessionMode>("tutor");
  const [rationaleVisibility, setRationaleVisibility] = useState<RationaleVisibilityMode>("immediate");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [timeLimitMin, setTimeLimitMin] = useState("30");
  const [difficultyMin, setDifficultyMin] = useState("");
  const [difficultyMax, setDifficultyMax] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const needsSystemSelector = selectedMode === "by_system";

  const resolvedQuestionCount = useMemo(() => {
    if (questionCount !== "custom") return questionCount;
    const parsed = Number.parseInt(customQuestionCount, 10);
    if (!Number.isFinite(parsed)) return 20;
    return Math.max(5, Math.min(100, parsed));
  }, [customQuestionCount, questionCount]);

  const resolvedTimeLimitSec = useMemo(() => {
    if (!timedMode) return null;
    const parsed = Number.parseInt(timeLimitMin, 10);
    if (!Number.isFinite(parsed)) return 30 * 60;
    return Math.max(2 * 60, Math.min(240 * 60, parsed * 60));
  }, [timeLimitMin, timedMode]);

  function setSessionModeWithRationale(mode: SessionMode) {
    setSessionMode(mode);
    setRationaleVisibility(mode === "tutor" ? "immediate" : "review");
  }

  function toggleSystem(system: string) {
    setSelectedSystems((prev) =>
      prev.includes(system) ? prev.filter((entry) => entry !== system) : [...prev, system],
    );
  }

  async function handleStartPractice() {
    if (!selectedMode) {
      setError("Choose a practice exam mode to continue.");
      return;
    }
    if (needsSystemSelector && selectedSystems.length === 0) {
      setError("Select at least one category/system.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const selectionMode =
        selectedMode === "weak_areas" ? "weak" : selectedMode === "by_system" ? "targeted" : "random";

      const min = difficultyMin.trim();
      const max = difficultyMax.trim();
      const parsedMin = min ? Number.parseInt(min, 10) : null;
      const parsedMax = max ? Number.parseInt(max, 10) : null;

      const payload = buildPracticeExamStartPayload({
        questionCount: resolvedQuestionCount,
        selectionMode,
        topicNames: needsSystemSelector ? selectedSystems : [],
        pathwayId: pathwayId ?? null,
        timedMode,
        timeLimitSec: resolvedTimeLimitSec,
        difficultyMin: Number.isFinite(parsedMin ?? NaN) ? Math.min(5, Math.max(1, parsedMin!)) : null,
        difficultyMax: Number.isFinite(parsedMax ?? NaN) ? Math.min(5, Math.max(1, parsedMax!)) : null,
        sessionMode,
        rationaleVisibilityMode: rationaleVisibility,
      });

      const res = await fetch("/api/practice-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <section className="nn-card space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Build Practice Exam</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Use CAT-grade session plumbing with your own fixed exam settings, mode, and rationale timing.
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
              {timedMode ? (
                <label className="text-sm">
                  <span className="text-[var(--semantic-text-secondary)]">Time limit (minutes)</span>
                  <input
                    type="number"
                    min={2}
                    max={240}
                    value={timeLimitMin}
                    onChange={(event) => setTimeLimitMin(event.target.value)}
                    className="mt-1 block min-h-11 w-32 rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                  />
                </label>
              ) : null}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--semantic-text-secondary)]">Session mode</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSessionModeWithRationale("tutor")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    sessionMode === "tutor"
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Tutor mode
                </button>
                <button
                  type="button"
                  onClick={() => setSessionModeWithRationale("exam")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    sessionMode === "exam"
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  }`}
                >
                  Exam mode
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-[var(--semantic-text-secondary)]">Rationale visibility</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRationaleVisibility("immediate")}
                  disabled={sessionMode === "exam"}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    rationaleVisibility === "immediate"
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  } disabled:opacity-55`}
                >
                  Immediate after each question
                </button>
                <button
                  type="button"
                  onClick={() => setRationaleVisibility("review")}
                  disabled={sessionMode === "tutor"}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    rationaleVisibility === "review"
                      ? "border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
                  } disabled:opacity-55`}
                >
                  End/review only
                </button>
              </div>
              <p className="text-xs text-[var(--semantic-text-secondary)]">
                Tutor mode enforces immediate rationales; Exam mode keeps rationales for review/results.
              </p>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="text-[var(--semantic-text-secondary)]">Difficulty min (optional)</span>
              <input
                type="number"
                min={1}
                max={5}
                value={difficultyMin}
                onChange={(event) => setDifficultyMin(event.target.value)}
                className="mt-1 block min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                placeholder="1-5"
              />
            </label>
            <label className="text-sm">
              <span className="text-[var(--semantic-text-secondary)]">Difficulty max (optional)</span>
              <input
                type="number"
                min={1}
                max={5}
                value={difficultyMax}
                onChange={(event) => setDifficultyMax(event.target.value)}
                className="mt-1 block min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                placeholder="1-5"
              />
            </label>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-[var(--semantic-warning-contrast)]">{error}</p> : null}

      <button
        type="button"
        onClick={() => void handleStartPractice()}
        disabled={!selectedMode || isSubmitting}
        className="nn-btn-primary inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
      >
        {isSubmitting ? "Starting..." : "Start Practice Exam"}
      </button>
    </section>
  );
}

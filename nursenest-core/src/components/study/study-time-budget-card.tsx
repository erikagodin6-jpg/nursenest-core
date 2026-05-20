"use client";

/**
 * StudyTimeBudgetCard
 *
 * Interactive card for viewing and editing the learner's daily study budget.
 * Shows the activity breakdown and weekly targets.
 *
 * Saves to PATCH /api/learner/study-budget then triggers router.refresh()
 * so the server-rendered plan updates with the new allocation.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, ChevronRight, Pencil, Check } from "lucide-react";
import type { StudyTimeBudget } from "@/lib/study/adaptive-engine/study-time-budget";

interface StudyTimeBudgetCardProps {
  timeBudget: StudyTimeBudget;
  currentDailyMinutes: number | null;
  currentCadence: string | null;
}

const CADENCE_OPTIONS = [
  { value: "light", label: "Light", sub: "~4 days/week" },
  { value: "steady", label: "Steady", sub: "~6 days/week" },
  { value: "intensive", label: "Intensive", sub: "Every day" },
] as const;

const ACTIVITY_COLORS: Record<string, string> = {
  lesson: "var(--semantic-info)",
  practice: "var(--accent-primary)",
  review: "var(--semantic-warning)",
  flashcard: "var(--semantic-success)",
};

const ACTIVITY_LABELS: Record<string, string> = {
  lesson: "Lesson",
  practice: "Practice",
  review: "Review",
  flashcard: "Flashcard",
};

function ActivityBar({
  label,
  minutes,
  total,
  color,
}: {
  label: string;
  minutes: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.max(2, Math.round((minutes / total) * 100)) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--theme-body-text, var(--semantic-text-secondary))",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color,
          }}
        >
          {minutes} min
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 99,
          background: `color-mix(in srgb, ${color} 12%, var(--border-subtle))`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

export function StudyTimeBudgetCard({
  timeBudget,
  currentDailyMinutes,
  currentCadence,
}: StudyTimeBudgetCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [minutes, setMinutes] = useState(currentDailyMinutes ?? timeBudget.daily.totalMinutes);
  const [cadence, setCadence] = useState<string>(currentCadence ?? "steady");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { daily, weekly } = timeBudget;

  async function handleSave() {
    setError(null);
    try {
      const res = await fetch("/api/learner/study-budget", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyStudyMinutes: minutes, studyCadencePreference: cadence }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Unable to save. Try again.");
        return;
      }
      setEditing(false);
      startTransition(() => { router.refresh(); });
    } catch {
      setError("Network error. Check your connection and try again.");
    }
  }

  return (
    <div
      style={{
        borderRadius: "1rem",
        border: `1px solid color-mix(in srgb, var(--semantic-info) 18%, var(--border-subtle))`,
        background: `color-mix(in srgb, var(--semantic-info) 6%, var(--bg-card))`,
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid color-mix(in srgb, var(--semantic-info) 14%, var(--border-subtle))`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: `color-mix(in srgb, var(--semantic-info) 14%, var(--bg-card))`,
              border: `1px solid color-mix(in srgb, var(--semantic-info) 26%, var(--border-subtle))`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock className="h-3.5 w-3.5" style={{ color: "var(--semantic-info)" }} aria-hidden />
          </span>
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 700,
              color: "var(--theme-heading-text, var(--semantic-text-primary))",
            }}
          >
            Daily Study Budget
          </span>
          {!daily.isCustom && (
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                padding: "2px 8px",
                borderRadius: 99,
                background: `color-mix(in srgb, var(--semantic-info) 12%, var(--bg-card))`,
                border: `1px solid color-mix(in srgb, var(--semantic-info) 22%, var(--border-subtle))`,
                color: "var(--semantic-info)",
              }}
            >
              Default
            </span>
          )}
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          aria-label={editing ? "Cancel editing" : "Edit study budget"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 10px",
            borderRadius: "0.5rem",
            border: "none",
            background: editing
              ? `color-mix(in srgb, var(--semantic-info) 14%, var(--bg-card))`
              : "transparent",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--semantic-info)",
          }}
        >
          <Pencil className="h-3 w-3" aria-hidden />
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Summary */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              color: "var(--semantic-info)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {daily.totalMinutes}
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--semantic-text-muted)",
            }}
          >
            min / day
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.8125rem",
              color: "var(--semantic-text-muted)",
            }}
          >
            ~{weekly.daysPerWeek}d/wk ·{" "}
            <strong style={{ color: "var(--semantic-info)" }}>
              {weekly.totalMinutesPerWeek}m total
            </strong>
          </span>
        </div>

        {/* Activity bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(["practice", "lesson", "review", "flashcard"] as const).map((act) => (
            <ActivityBar
              key={act}
              label={ACTIVITY_LABELS[act]!}
              minutes={daily.breakdown[act]}
              total={daily.totalMinutes}
              color={ACTIVITY_COLORS[act]!}
            />
          ))}
        </div>

        {/* Session suggestion */}
        <p
          style={{
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            color: "var(--semantic-text-muted)",
            fontStyle: "italic",
          }}
        >
          {daily.sessionSuggestion}
        </p>

        {/* Weekly targets */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {[
            { label: "Questions/wk", value: weekly.questionTarget },
            { label: "Lessons/wk", value: weekly.lessonModuleTarget },
            { label: "Flash sessions", value: weekly.flashcardSessionTarget },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 14px",
                borderRadius: "0.625rem",
                background: `color-mix(in srgb, var(--semantic-info) 8%, var(--bg-card))`,
                border: `1px solid color-mix(in srgb, var(--semantic-info) 16%, var(--border-subtle))`,
                flex: "1 1 80px",
              }}
            >
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--semantic-text-muted)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "var(--semantic-info)",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Editor panel */}
        {editing && (
          <div
            style={{
              borderTop: `1px solid color-mix(in srgb, var(--semantic-info) 14%, var(--border-subtle))`,
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {/* Minutes slider */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Daily study time: {minutes} minutes
              </span>
              <input
                type="range"
                min={10}
                max={180}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                aria-label="Daily study minutes"
                style={{ accentColor: "var(--semantic-info)", width: "100%" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.6875rem",
                  color: "var(--semantic-text-muted)",
                }}
              >
                <span>10 min</span>
                <span>1 hr</span>
                <span>3 hr</span>
              </div>
            </label>

            {/* Cadence picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--semantic-text-secondary)",
                }}
              >
                Study cadence
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {CADENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCadence(opt.value)}
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: "0.625rem",
                      border: `1.5px solid ${cadence === opt.value ? "var(--semantic-info)" : "var(--border-subtle)"}`,
                      background:
                        cadence === opt.value
                          ? `color-mix(in srgb, var(--semantic-info) 12%, var(--bg-card))`
                          : "var(--bg-card)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color:
                          cadence === opt.value
                            ? "var(--semantic-info)"
                            : "var(--semantic-text-secondary)",
                      }}
                    >
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "0.6875rem", color: "var(--semantic-text-muted)" }}>
                      {opt.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ fontSize: "0.8125rem", color: "var(--semantic-danger)" }}>{error}</p>
            )}

            <button
              onClick={handleSave}
              disabled={isPending}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                minHeight: "2.25rem",
                borderRadius: "0.625rem",
                border: "none",
                background: "var(--semantic-info)",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 700,
                cursor: isPending ? "wait" : "pointer",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <Check className="h-4 w-4" aria-hidden />
              {isPending ? "Saving…" : "Save plan"}
              {!isPending && <ChevronRight className="h-3.5 w-3.5 ml-auto" aria-hidden />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

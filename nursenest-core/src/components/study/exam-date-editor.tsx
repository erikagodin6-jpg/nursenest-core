"use client";

/**
 * ExamDateEditor
 *
 * Thin client component for setting, editing, or removing an exam date.
 * Uses the existing /api/learner/exam-plan PATCH endpoint.
 *
 * Design surface: --surface-soft-a with warning accent when date is set
 *
 * Features:
 *   - Show current exam date or "No exam date set"
 *   - Edit date inline (date input)
 *   - Mark as unsure/proposed/confirmed
 *   - Remove date
 *   - Auto-recalculate (page refresh on save)
 */

import { useCallback, useEffect, useRef, useState } from "react";

type DateStatus = "unsure" | "proposed" | "confirmed";

type ExamPlanPayload = {
  examDate: string | null;
  examDatePlanType: string | null;
};

function ymdFromIso(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatDisplayDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (isNaN(target.getTime())) return null;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function ExamDateEditor({ initialData }: { initialData?: ExamPlanPayload | null }) {
  const [loaded, setLoaded] = useState(!!initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [examDate, setExamDate] = useState(ymdFromIso(initialData?.examDate ?? null));
  const [planType, setPlanType] = useState<DateStatus>(
    (initialData?.examDatePlanType as DateStatus) ?? "unsure",
  );

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // If no initialData, fetch from API
  useEffect(() => {
    if (initialData !== undefined) return;
    void (async () => {
      try {
        const res = await fetch("/api/learner/exam-plan");
        if (!res.ok) return;
        const data = (await res.json()) as ExamPlanPayload;
        setExamDate(ymdFromIso(data.examDate));
        setPlanType((data.examDatePlanType as DateStatus) ?? "unsure");
      } catch {
        // non-fatal
      } finally {
        setLoaded(true);
      }
    })();
  }, [initialData]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, string | null> = { examDatePlanType: planType };
      if (planType !== "unsure") {
        if (!examDate) {
          setError("Please enter an exam date.");
          setSaving(false);
          return;
        }
        body.examDate = examDate;
      }
      const res = await fetch("/api/learner/exam-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setError(json.error ?? "Could not save exam plan.");
      } else {
        setEditing(false);
        setSuccess(true);
        // Refresh page so coach page recomputes plan
        setTimeout(() => window.location.reload(), 800);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [examDate, planType]);

  const handleRemove = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/learner/exam-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examDatePlanType: "unsure" }),
      });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setError(json.error ?? "Could not remove exam date.");
      } else {
        setExamDate("");
        setPlanType("unsure");
        setEditing(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 600);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  const hasDate = planType !== "unsure" && examDate;
  const days = hasDate ? daysUntil(examDate) : null;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: hasDate
          ? "color-mix(in srgb, var(--semantic-warning) 7%, var(--bg-page))"
          : "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 4%, var(--bg-page)))",
        border: hasDate
          ? "1px solid color-mix(in srgb, var(--semantic-warning) 20%, transparent)"
          : "1px solid var(--semantic-border-soft)",
      }}
    >
      <div className="px-5 py-4">
        <p
          className="mb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Exam date
        </p>

        {!editing ? (
          /* Display mode */
          <div className="flex items-center justify-between gap-3">
            <div>
              {hasDate ? (
                <div className="space-y-0.5">
                  <p
                    className="text-base font-semibold"
                    style={{ color: "var(--semantic-text-primary)" }}
                  >
                    {formatDisplayDate(examDate)}
                  </p>
                  {days !== null && (
                    <p
                      className="text-xs font-medium"
                      style={{
                        color:
                          days <= 14
                            ? "var(--semantic-danger)"
                            : days <= 28
                              ? "var(--semantic-warning)"
                              : "var(--semantic-info)",
                      }}
                    >
                      {days < 0
                        ? "Exam date passed"
                        : days === 0
                          ? "Exam today"
                          : `${days} day${days !== 1 ? "s" : ""} away`}
                    </p>
                  )}
                  <p
                    className="text-[10px] capitalize"
                    style={{ color: "var(--semantic-text-muted)" }}
                  >
                    {planType} date
                  </p>
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--semantic-text-muted)" }}>
                  No exam date set. Setting one helps tailor your plan.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{
                  background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
                  color: "var(--semantic-brand)",
                  border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
                }}
              >
                {hasDate ? "Edit" : "Set date"}
              </button>
              {hasDate && (
                <button
                  onClick={handleRemove}
                  disabled={saving}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))",
                    color: "var(--semantic-danger)",
                    border: "1px solid color-mix(in srgb, var(--semantic-danger) 18%, transparent)",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Edit mode */
          <div className="space-y-3">
            {/* Plan type selector */}
            <div className="flex gap-2">
              {(["proposed", "confirmed", "unsure"] as DateStatus[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setPlanType(t)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all"
                  style={{
                    background:
                      planType === t
                        ? "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))"
                        : "transparent",
                    color:
                      planType === t ? "var(--semantic-brand)" : "var(--semantic-text-muted)",
                    border:
                      planType === t
                        ? "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)"
                        : "1px solid var(--semantic-border-soft)",
                  }}
                >
                  {t === "unsure" ? "Not sure" : t}
                </button>
              ))}
            </div>

            {/* Date input */}
            {planType !== "unsure" && (
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm"
                style={{
                  background: "var(--semantic-surface)",
                  color: "var(--semantic-text-primary)",
                  border: "1px solid var(--semantic-border-soft)",
                }}
                min={new Date().toISOString().slice(0, 10)}
              />
            )}

            {error && (
              <p className="text-xs" style={{ color: "var(--semantic-danger)" }}>
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg px-4 py-1.5 text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{
                  background: "var(--semantic-brand)",
                  color: "var(--semantic-surface, white)",
                }}
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{ color: "var(--semantic-text-muted)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {success && (
          <p className="mt-2 text-xs font-semibold" style={{ color: "var(--semantic-success)" }}>
            Saved — updating your plan…
          </p>
        )}
      </div>
    </div>
  );
}

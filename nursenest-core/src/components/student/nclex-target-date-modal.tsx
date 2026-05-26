"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";

const STORAGE_KEY = "nursenest:nclex-target-date:v1";
const DISMISSED_KEY = "nursenest:nclex-target-date-dismissed:v1";

type ExamDatePlanType = "unsure" | "proposed" | "confirmed";

export type NclexTargetDateState = {
  examDate: string | null;
  examDatePlanType: ExamDatePlanType | null;
  examGoalSetAt: string | null;
};

type StoredTargetDateState = {
  savedDate: string | null;
  dismissed: boolean;
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function isValidYmdDate(dateValue: string | null | undefined): boolean {
  if (!dateValue || !/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return false;
  const [year, month, day] = dateValue.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function ymdFromIso(iso: string | null | undefined): string {
  if (!iso) return "";
  const ymd = iso.slice(0, 10);
  return isValidYmdDate(ymd) ? ymd : "";
}

function daysUntil(dateValue: string): number | null {
  const target = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function shouldPromptForNclexTargetDate(
  profileState: NclexTargetDateState | null | undefined,
  storedState: StoredTargetDateState = { savedDate: null, dismissed: false },
): boolean {
  const profileDate = ymdFromIso(profileState?.examDate);
  if (profileDate) return false;

  if (profileState?.examDatePlanType === "unsure" && profileState.examGoalSetAt) {
    return false;
  }

  if (storedState.savedDate && isValidYmdDate(storedState.savedDate)) {
    return false;
  }

  if (storedState.dismissed) {
    return false;
  }

  return true;
}

export function buildNclexTargetDatePatchBody(targetDate: string): {
  examDatePlanType: ExamDatePlanType;
  examDate: string;
} {
  return {
    examDatePlanType: "proposed",
    examDate: targetDate,
  };
}

export function shouldSyncStoredNclexTargetDate(
  profileState: NclexTargetDateState | null | undefined,
  storedState: StoredTargetDateState,
): boolean {
  if (!storedState.savedDate || !isValidYmdDate(storedState.savedDate)) return false;
  if (ymdFromIso(profileState?.examDate)) return false;
  return !(profileState?.examDatePlanType === "unsure" && profileState.examGoalSetAt);
}

export function NclexTargetDateModal({
  enabled = true,
  initialExamDateState,
}: {
  enabled?: boolean;
  initialExamDateState?: NclexTargetDateState | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(todayIsoDate());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setMounted(true);
    if (!enabled) return;

    const readStoredState = (): StoredTargetDateState => {
      try {
        const savedDate = window.localStorage.getItem(STORAGE_KEY);
        const dismissed = window.localStorage.getItem(DISMISSED_KEY) === "true";
        return { savedDate, dismissed };
      } catch {
        return { savedDate: null, dismissed: false };
      }
    };

    const syncStoredDateToProfile = (storedDate: string) => {
      void fetch("/api/learner/exam-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildNclexTargetDatePatchBody(storedDate)),
      }).catch(() => {
        // The server-hydrated profile state remains the source of truth on future loads.
      });
    };

    const applyProfileState = (profileState: NclexTargetDateState | null | undefined) => {
      const stored = readStoredState();
      const profileDate = ymdFromIso(profileState?.examDate);
      if (profileDate) {
        setTargetDate(profileDate);
      } else if (stored.savedDate && isValidYmdDate(stored.savedDate)) {
        setTargetDate(stored.savedDate);
        if (shouldSyncStoredNclexTargetDate(profileState, stored)) {
          syncStoredDateToProfile(stored.savedDate);
        }
      }
      setOpen(shouldPromptForNclexTargetDate(profileState, stored));
    };

    if (initialExamDateState !== undefined) {
      applyProfileState(initialExamDateState);
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/learner/exam-plan", { method: "GET" });
        if (!response.ok) {
          if (!cancelled) setOpen(false);
          return;
        }
        const profileState = (await response.json()) as NclexTargetDateState;
        if (!cancelled) applyProfileState(profileState);
      } catch {
        if (!cancelled) setOpen(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, initialExamDateState]);

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      setError(null);
    }
  }, [enabled]);

  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  useEffect(() => {
    if (!isValidYmdDate(targetDate)) {
      setTargetDate(todayIsoDate());
    }
  }, [targetDate]);

  useEffect(() => {
    if (!mounted) return;
    try {
      const profileDate = ymdFromIso(initialExamDateState?.examDate);
      if (profileDate) {
        window.localStorage.setItem(STORAGE_KEY, profileDate);
        window.localStorage.removeItem(DISMISSED_KEY);
      }
    } catch {
      // Non-critical preference storage.
    }
  }, [initialExamDateState?.examDate, mounted]);

  const remainingDays = useMemo(() => daysUntil(targetDate), [targetDate]);
  const pacingCopy = useMemo(() => {
    if (remainingDays == null) return "We will tune your plan once your date is saved.";
    if (remainingDays < 0) return "Choose your next target date when you are ready.";
    if (remainingDays <= 30) return "Short runway: prioritize CAT practice, weak areas, and high-yield rationales.";
    if (remainingDays <= 90) return "Steady runway: balance lessons, flashcards, and timed exam blocks.";
    return "Long runway: build foundation now, then tighten exam stamina closer to test day.";
  }, [remainingDays]);

  if (!mounted || !enabled || !open) return null;

  function closeWithoutSaving() {
    try {
      window.localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // Non-critical preference storage.
    }
    setOpen(false);
  }

  async function saveTargetDate() {
    if (!isValidYmdDate(targetDate)) {
      setError("Enter a valid exam date.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/learner/exam-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildNclexTargetDatePatchBody(targetDate)),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
        setError(payload.message ?? payload.error ?? "Unable to save your exam date.");
        return;
      }
    } catch {
      setError("Unable to save your exam date. Check your connection and try again.");
      return;
    } finally {
      setSaving(false);
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, targetDate);
      window.localStorage.removeItem(DISMISSED_KEY);
    } catch {
      // Non-critical preference storage.
    }
    setOpen(false);
  }

  return (
    <div className="nn-nclex-target-date-modal" role="dialog" aria-modal="true" aria-labelledby="nclex-target-date-title">
      <div className="nn-nclex-target-date-modal__backdrop" onClick={closeWithoutSaving} aria-hidden="true" />
      <section className="nn-nclex-target-date-modal__card">
        <button
          type="button"
          className="nn-nclex-target-date-modal__close"
          onClick={closeWithoutSaving}
          aria-label="Close target date setup"
        >
          <X size={16} />
        </button>
        <div className="nn-nclex-target-date-modal__icon" aria-hidden="true">
          <CalendarDays size={22} />
        </div>
        <p className="nn-nclex-target-date-modal__eyebrow">NCLEX Readiness</p>
        <h2 id="nclex-target-date-title" className="nn-nclex-target-date-modal__title">
          When are you planning to take your NCLEX?
        </h2>
        <p className="nn-nclex-target-date-modal__copy">
          We will personalize your study rhythm around your target date.
        </p>
        <label className="nn-nclex-target-date-modal__date-label">
          Target exam date
          <input
            type="date"
            min={todayIsoDate()}
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className="nn-nclex-target-date-modal__date-input"
          />
        </label>
        {error ? (
          <p className="nn-nclex-target-date-modal__copy" role="alert">
            {error}
          </p>
        ) : null}
        <div className="nn-nclex-target-date-modal__insight" aria-live="polite">
          <span>{remainingDays != null && remainingDays >= 0 ? `${remainingDays} days` : "Target plan"}</span>
          <p>{pacingCopy}</p>
        </div>
        <button type="button" className="nn-nclex-target-date-modal__save" onClick={saveTargetDate} disabled={saving}>
          {saving ? "Saving..." : "Save Date"}
        </button>
      </section>
    </div>
  );
}

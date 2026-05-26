"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, X } from "lucide-react";

const STORAGE_KEY = "nursenest:nclex-target-date:v1";
const DISMISSED_KEY = "nursenest:nclex-target-date-dismissed:v1";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(dateValue: string): number | null {
  const target = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function NclexTargetDateModal({ enabled = true }: { enabled?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [targetDate, setTargetDate] = useState(todayIsoDate());

  useEffect(() => {
    setMounted(true);
    if (!enabled) return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const dismissed = window.localStorage.getItem(DISMISSED_KEY);
      if (saved) setTargetDate(saved);
      setOpen(!saved && !dismissed);
    } catch {
      setOpen(false);
    }
  }, [enabled]);

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

  function saveTargetDate() {
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
        <div className="nn-nclex-target-date-modal__insight" aria-live="polite">
          <span>{remainingDays != null && remainingDays >= 0 ? `${remainingDays} days` : "Target plan"}</span>
          <p>{pacingCopy}</p>
        </div>
        <button type="button" className="nn-nclex-target-date-modal__save" onClick={saveTargetDate}>
          Save Date
        </button>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

/* ── Session mastery tracker (pure functions) ────────────────────── */

export type MasteryStreakMap = Map<string, number>;

export function updateMasteryStreak(
  map: MasteryStreakMap,
  topic: string | null | undefined,
  isCorrect: boolean,
): MasteryStreakMap {
  if (!topic?.trim()) return map;
  const next = new Map(map);
  const current = next.get(topic) ?? 0;
  next.set(topic, isCorrect ? current + 1 : 0);
  return next;
}

export function detectMasteredTopics(
  map: MasteryStreakMap,
  streakThreshold = 5,
): string[] {
  const mastered: string[] = [];
  for (const [topic, streak] of map) {
    if (streak >= streakThreshold) mastered.push(topic);
  }
  return mastered;
}

/* ── Component ──────────────────────────────────────────────────── */

export function MasteryMoment({
  topic,
  streakCount,
  onDismiss,
}: {
  topic: string;
  streakCount: number;
  onDismiss?: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (onDismiss) {
      timerRef.current = setTimeout(onDismiss, 4000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onDismiss, topic]);

  return (
    <div className="nn-mastery-moment" role="status" aria-live="polite">
      <div className="nn-mastery-moment__icon">
        <CheckCircle2 className="h-5 w-5" aria-hidden />
      </div>
      <div className="nn-mastery-moment__body">
        <strong className="nn-mastery-moment__heading">Topic Mastered</strong>
        <p className="nn-mastery-moment__topic">{topic}</p>
        <p className="nn-mastery-moment__detail">
          {streakCount} consecutive correct answers · Excellent retention
        </p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="nn-mastery-moment__dismiss"
          aria-label="Dismiss mastery notification"
          onClick={onDismiss}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

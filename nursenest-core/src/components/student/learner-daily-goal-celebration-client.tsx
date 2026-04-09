"use client";

import { useEffect, useState } from "react";

/**
 * One-time subtle acknowledgment when today's goal completes (sessionStorage per UTC day).
 */
export function LearnerDailyGoalCelebrationClient({
  utcDate,
  complete,
  message,
}: {
  utcDate: string;
  complete: boolean;
  message: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!complete || typeof window === "undefined") return;
    const key = `nn_daily_goal_celebration_${utcDate}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      setVisible(true);
      const id = window.setTimeout(() => setVisible(false), 8000);
      return () => window.clearTimeout(id);
    } catch {
      /* private mode */
    }
  }, [complete, utcDate]);

  if (!visible) return null;

  return (
    <p className="text-xs font-medium text-[var(--semantic-success-contrast)]" role="status" aria-live="polite">
      {message}
    </p>
  );
}

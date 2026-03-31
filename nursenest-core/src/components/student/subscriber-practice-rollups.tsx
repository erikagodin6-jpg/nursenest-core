"use client";

import { useEffect, useState } from "react";

/**
 * Reads lightweight question-bank grading history from localStorage (same device/browser).
 * Not a server-backed metric — copy makes that explicit.
 */
export function SubscriberPracticeRollups({ userId }: { userId: string }) {
  const [line, setLine] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`nn_qbank_rollups_${userId}`);
      if (!raw) {
        setLine(null);
        return;
      }
      const data = JSON.parse(raw) as { events?: Array<{ correct: boolean; at: string }> };
      const events = data.events ?? [];
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recent = events.filter((e) => new Date(e.at).getTime() > weekAgo);
      if (recent.length === 0) {
        setLine(null);
        return;
      }
      const right = recent.filter((e) => e.correct).length;
      setLine(
        `Question bank (this browser): ${right}/${recent.length} graded items correct in the last 7 days.`,
      );
    } catch {
      setLine(null);
    }
  }, [userId]);

  return (
    <p className="mt-2 text-sm text-muted" data-testid="subscriber-qbank-rollups">
      {line ??
        "No graded bank activity in this browser in the last 7 days yet. Use the question bank here and the Topic performance card will reflect account-wide stats."}
    </p>
  );
}

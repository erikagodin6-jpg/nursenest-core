"use client";

import { useMemo, useState } from "react";

export function PathwayLessonQuickReview({ bullets }: { bullets: string[] }) {
  const [on, setOn] = useState(false);
  const safe = useMemo(() => bullets.filter(Boolean), [bullets]);
  if (safe.length === 0) return null;

  return (
    <div className="nn-card border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Quick review (condensed)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Short revision bullets only — not a replacement for the full lesson sections below.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium hover:bg-muted"
        >
          {on ? "Show full lesson" : "Show condensed review"}
        </button>
      </div>
      {on ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--theme-body-text)]">
          {safe.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">Toggle for a short revision list before a mock or question block.</p>
      )}
    </div>
  );
}

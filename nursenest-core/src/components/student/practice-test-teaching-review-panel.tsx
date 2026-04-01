"use client";

import { useState } from "react";
import type { PracticeTestTeachingItem } from "@/lib/practice-tests/build-teaching-review";
import { TeachingBreakdown } from "@/components/student/teaching-breakdown";

export function PracticeTestTeachingReviewPanel({
  items,
  modeLabel = "Post-exam review",
}: {
  items: PracticeTestTeachingItem[];
  modeLabel?: string;
}) {
  const [i, setI] = useState(0);
  const cur = items[i];
  const total = items.length;

  if (!cur || total === 0) return null;

  return (
    <div className="nn-card border-primary/25 bg-[var(--theme-muted-surface)]/60 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{modeLabel}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            Question {i + 1} of {total}
            <span className={`ml-2 ${cur.correct ? "text-emerald-600" : "text-amber-700"}`}>
              {cur.correct ? "· Correct" : "· Incorrect"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={i === 0}
            className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-40"
            onClick={() => setI((x) => Math.max(0, x - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={i >= total - 1}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            onClick={() => setI((x) => Math.min(total - 1, x + 1))}
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Exam mode hid rationales; this is review mode.</p>
      <article className="mt-4 space-y-4">
        <section aria-labelledby="rev-stem">
          <h3 id="rev-stem" className="text-xs font-semibold uppercase tracking-wide text-primary">
            Stem
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{cur.stem}</p>
        </section>
        <TeachingBreakdown teaching={cur.teaching} teachingMedia={cur.media} variant="card" />
      </article>
    </div>
  );
}

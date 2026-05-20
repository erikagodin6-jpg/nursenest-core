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
    <div className="nn-card nn-student-card-lift border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-6 shadow-[var(--semantic-shadow-soft)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">{modeLabel}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">
            Question {i + 1} of {total}
            <span
              className={`ml-2 font-semibold ${cur.correct ? "text-[var(--semantic-success)]" : "text-[var(--semantic-warning)]"}`}
            >
              {cur.correct ? "· Correct" : "· Incorrect"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={i === 0}
            className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-sm text-[var(--semantic-text-primary)] disabled:opacity-40"
            onClick={() => setI((x) => Math.max(0, x - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={i >= total - 1}
            className="rounded-lg bg-role-cta px-3 py-1.5 text-sm font-semibold text-role-cta-foreground disabled:opacity-40"
            onClick={() => setI((x) => Math.min(total - 1, x + 1))}
          >
            Next
          </button>
        </div>
      </div>
      <p className="text-xs uppercase tracking-wide text-[var(--semantic-text-muted)]">Exam mode hid rationales; this is review mode.</p>
      <article className="mt-4 space-y-4">
        <section aria-labelledby="rev-stem">
          <h3 id="rev-stem" className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            Stem
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{cur.stem}</p>
        </section>
        <TeachingBreakdown teaching={cur.teaching} teachingMedia={cur.media} variant="card" />
      </article>
    </div>
  );
}

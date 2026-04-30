"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

type PlanItem = {
  id: string;
  topic: string | null;
  bodySystem: string | null;
  priorityScore: number;
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  retestQuestionsHref: string | null;
};

type StudyPlanPayload = {
  enabled: boolean;
  remediationDue: PlanItem[];
};

/**
 * Lightweight “Focus Today” band — data loads client-side so the dashboard shell stays cache-friendly.
 * Hidden when remediation engine is off or the learner has no due items.
 */
export function FocusTodayStrip(_props: { pathwayId?: string | null }) {
  const [plan, setPlan] = useState<StudyPlanPayload | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/study-plan", { method: "GET", credentials: "same-origin" });
      const data = (await res.json()) as StudyPlanPayload;
      if (!res.ok) {
        setPlan({ enabled: false, remediationDue: [] });
        return;
      }
      setPlan(data);
    } catch {
      setPlan({ enabled: false, remediationDue: [] });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patchOutcome = async (id: string, wellPerformed: boolean) => {
    setBusyId(id);
    try {
      await fetch(`/api/study-plan/queue/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ wellPerformed }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (!plan?.enabled || plan.remediationDue.length === 0) return null;

  const items = plan.remediationDue.slice(0, 5);

  return (
    <section
      className="nn-dash-section"
      aria-label="Focus today"
    >
      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-info)]">Focus Today</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
          Short remediation pulls from your recent question misses and low-confidence hits.
        </p>
        <ul className="mt-4 space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 sm:p-4"
            >
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                {it.topic?.trim() || it.bodySystem?.trim() || "Review topic"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {it.lessonHref ? (
                  <Link
                    href={it.lessonHref}
                    className="inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
                  >
                    Review lesson
                  </Link>
                ) : null}
                {it.flashcardsHref ? (
                  <Link
                    href={it.flashcardsHref}
                    className="inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] hover:bg-[var(--semantic-panel-muted)]"
                  >
                    Do flashcards
                  </Link>
                ) : null}
                {it.retestQuestionsHref || it.practiceQuestionsHref ? (
                  <Link
                    href={it.retestQuestionsHref ?? it.practiceQuestionsHref ?? "/app/questions"}
                    className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-[var(--role-cta-foreground)]"
                    style={{ background: "var(--role-cta)" }}
                  >
                    Retry questions
                  </Link>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-3">
                <button
                  type="button"
                  disabled={busyId === it.id}
                  className="nn-btn-secondary min-h-9 rounded-full px-3 text-xs font-semibold disabled:opacity-50"
                  onClick={() => void patchOutcome(it.id, true)}
                >
                  Done — felt solid
                </button>
                <button
                  type="button"
                  disabled={busyId === it.id}
                  className="inline-flex min-h-9 items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] disabled:opacity-50"
                  onClick={() => void patchOutcome(it.id, false)}
                >
                  Still shaky
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

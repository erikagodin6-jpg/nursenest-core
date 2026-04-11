/**
 * PlanRegenerateControl
 *
 * Allows the user to refresh/recalculate their adaptive study plan.
 * On click, triggers a full page reload so the RSC re-runs with latest data.
 *
 * Copy is calm and trustworthy — does not imply randomization or instability.
 * This is especially useful after a new CAT, practice session, or exam date change.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PlanRegenerateControl() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleRefresh() {
    setLoading(true);
    router.refresh();
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl px-5 py-3"
      style={{
        background: "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--bg-page))",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <div>
        <p className="text-xs font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
          Update my plan
        </p>
        <p className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
          Recalculates based on your latest practice, CAT results, and exam timeline.
        </p>
      </div>
      <button
        onClick={handleRefresh}
        disabled={loading}
        className="inline-flex rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90 disabled:opacity-50"
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
          color: "var(--semantic-brand)",
          border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
        }}
        aria-label="Recalculate study plan"
      >
        {loading ? "Updating…" : "Recalculate plan"}
      </button>
    </div>
  );
}

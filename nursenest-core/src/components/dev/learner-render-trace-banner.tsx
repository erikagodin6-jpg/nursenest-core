"use client";

import { useEffect } from "react";
import { shouldShowLearnerRenderTrace } from "@/lib/dev/learner-render-trace";

export function LearnerRenderTraceBanner({
  label,
  "data-route": dataRoute,
}: {
  label: string;
  "data-route": "flashcards" | "practice-tests";
}) {
  useEffect(() => {
    if (!shouldShowLearnerRenderTrace()) return;
    if (label.includes("NN_RENDER_TRACE:")) {
      console.info(label);
    }
  }, [label]);

  if (!shouldShowLearnerRenderTrace()) return null;
  return (
    <p
      className="mb-2 rounded-md border border-[color-mix(in_srgb,var(--semantic-info)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] px-3 py-2 font-mono text-xs text-[var(--semantic-text-primary)]"
      data-nn-render-trace={dataRoute}
      suppressHydrationWarning
    >
      {label}
    </p>
  );
}

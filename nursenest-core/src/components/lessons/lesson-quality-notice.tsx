import * as React from "react";
import type { ContentQualityTier } from "@/lib/content-quality/standards";

/** `hidden`: learners and anonymous visitors never see depth diagnostics. `staff_qa`: internal copy only. */
export type LessonQualityNoticeMode = "hidden" | "staff_qa";

/**
 * Teaching-depth diagnostics for pathway lessons. Customer-facing routes should default to `hidden`.
 * Use `staff_qa` only for staff sessions or local development.
 */
export function LessonQualityNotice({
  tier,
  wordCount,
  mode = "hidden",
}: {
  tier: ContentQualityTier;
  wordCount: number;
  mode?: LessonQualityNoticeMode;
}) {
  if (mode === "hidden") return null;
  if (tier !== "thin" && tier !== "missing") return null;

  const isDev = process.env.NODE_ENV === "development";
  return (
    <aside
      data-testid="lesson-quality-notice-internal"
      className="rounded-xl border border-dashed px-4 py-3.5 text-xs font-medium leading-relaxed"
      style={{
        background: "color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))",
        borderColor: "color-mix(in srgb, var(--semantic-warning) 28%, var(--border-subtle))",
        color: "var(--semantic-text-secondary)",
      }}
    >
      {tier === "missing" ? (
        <p>Internal QA: lesson body registers as empty in the quality scan — verify publishing and spine blocks.</p>
      ) : (
        <p>
          Internal QA: teaching depth is below our preferred range for this surface. Published learner copy is
          unchanged.
          {isDev && wordCount > 0 ? ` Word-count signal: ~${wordCount}.` : null}
        </p>
      )}
    </aside>
  );
}

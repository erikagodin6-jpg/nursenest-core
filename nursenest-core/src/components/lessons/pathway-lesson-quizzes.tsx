"use client";

import { useState } from "react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonQuizSet, itemsResetKey } from "@/components/lessons/pathway-lesson-quiz-set";

export { itemsResetKey };

/**
 * Marketing pathway pre/post quizzes — immediate per-question feedback when `fullAccess`,
 * preview-safe when locked. Post-test supports practice vs exam-style (shared implementation).
 */
export function PathwayLessonQuizzes({
  preTest,
  postTest,
  fullAccess,
}: {
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  fullAccess: boolean;
}) {
  const [postTestMode, setPostTestMode] = useState<"practice" | "exam">("practice");

  if (!preTest?.length && !postTest?.length) return null;
  const panelFrame =
    "rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-info)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-cool)_4%)] p-4 shadow-[var(--shadow-card)] sm:p-5";
  return (
    <div className="mt-10 space-y-6">
      {!fullAccess ? (
        <aside className="nn-study-callout rounded-xl border border-[var(--semantic-border-soft)] p-4 text-sm text-[var(--theme-body-text)]">
          <span className="font-medium text-foreground">Preview mode: </span>
          Pre/post questions are shown without highlighted answers or rationales. Full lesson access unlocks scoring-style
          review aligned with your plan.
        </aside>
      ) : null}
      {preTest?.length ? (
        <section className={panelFrame} aria-label="Pre-test: before you read">
          <PathwayLessonQuizSet
            key={`pre-${itemsResetKey(preTest)}`}
            variant="pre"
            title="Pre-test"
            subtitle="Before you read"
            items={preTest}
            fullAccess={fullAccess}
            className="border-0 pb-0"
          />
        </section>
      ) : null}
      {postTest?.length ? (
        <section className={panelFrame} aria-label="Post-test: after the lesson">
          <PathwayLessonQuizSet
            key={`post-${itemsResetKey(postTest)}-${postTestMode}`}
            variant="post"
            title="Post-test"
            subtitle="After the lesson"
            items={postTest}
            fullAccess={fullAccess}
            postMode={postTestMode}
            onPostModeChange={setPostTestMode}
            className="border-0 pb-0"
          />
        </section>
      ) : null}
    </div>
  );
}

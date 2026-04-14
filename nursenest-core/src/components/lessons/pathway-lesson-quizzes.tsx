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
  return (
    <div className="nn-study-card nn-study-card--wash mt-10 space-y-8 p-5 sm:p-6">
      {!fullAccess ? (
        <aside className="nn-study-callout p-4 text-sm text-[var(--theme-body-text)]">
          <span className="font-medium text-foreground">Preview mode: </span>
          Pre/post questions are shown without highlighted answers or rationales. Full lesson access unlocks scoring-style
          review aligned with your plan.
        </aside>
      ) : null}
      <PathwayLessonQuizSet
        key={`pre-${itemsResetKey(preTest)}`}
        variant="pre"
        title="Pre-test"
        subtitle="Practice"
        items={preTest}
        fullAccess={fullAccess}
      />
      <PathwayLessonQuizSet
        key={`post-${itemsResetKey(postTest)}-${postTestMode}`}
        variant="post"
        title="Post-test"
        items={postTest}
        fullAccess={fullAccess}
        postMode={postTestMode}
        onPostModeChange={setPostTestMode}
      />
    </div>
  );
}

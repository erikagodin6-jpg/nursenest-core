"use client";

import { CatResultsCoachPanel } from "@/components/student/cat-results-coach-panel";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { CatExamFeedbackMode } from "@/lib/practice-tests/types";

export function CatResultsCoachSection({
  coach,
  catExamFeedbackMode,
  pathwayId = null,
}: {
  coach: CatResultsCoachSnapshot | null | undefined;
  catExamFeedbackMode?: CatExamFeedbackMode | null;
  pathwayId?: string | null;
}) {
  const missingPersistedCoach = coach == null;

  return (
    <div className="space-y-3">
      {missingPersistedCoach ? (
        <div className="rounded-xl border border-dashed border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]/40 px-4 py-3 text-sm text-muted-foreground">
          Detailed CAT coaching was not stored for this session. We are showing a safe fallback summary instead.
        </div>
      ) : null}
      <CatResultsCoachPanel coach={coach} catExamFeedbackMode={catExamFeedbackMode} pathwayId={pathwayId} />
    </div>
  );
}

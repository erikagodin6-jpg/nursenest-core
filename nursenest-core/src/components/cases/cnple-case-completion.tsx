"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CaseStepAdvanceResult } from "@/lib/cases/longitudinal-case-types";
import { buildPostExamPerformanceReportFromCase } from "@/lib/learner/post-exam-performance-report";
import { PostExamAdaptiveReport } from "@/components/student/post-exam-adaptive-report";

// ─────────────────────────────────────────────────────────────────────────────
// CNPLE Case Completion — unified post-exam performance report (LOFT simulation / practice)
// ─────────────────────────────────────────────────────────────────────────────

export function CnpleCaseCompletion({
  result,
  caseTitle,
  sessionId,
  mode = "SIMULATION",
  onReview,
}: {
  result: CaseStepAdvanceResult;
  caseTitle: string;
  sessionId: string;
  mode?: "PRACTICE" | "SIMULATION";
  onReview: () => void;
}) {
  const score = result.score;
  if (!score) return null;

  const report = useMemo(
    () =>
      buildPostExamPerformanceReportFromCase({
        score,
        caseTitle,
        mode,
      }),
    [score, caseTitle, mode],
  );

  return (
    <div className="space-y-6" data-cnple-case="completion">
      <PostExamAdaptiveReport
        report={report}
        testId={sessionId}
        hideExamReview
        isEntitled
      />

      <div
        className="mx-auto flex max-w-[900px] flex-wrap gap-3 px-4 sm:px-6"
        style={{ paddingBottom: "2rem" }}
      >
        <button
          type="button"
          onClick={onReview}
          className="nn-btn-primary inline-flex min-h-[3rem] items-center rounded-lg px-5 text-sm font-bold shadow-none"
        >
          Full review with rationale
        </button>
        <Link
          href="/app/cases/cnple"
          className="nn-btn-secondary inline-flex min-h-[3rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Back to case catalog
        </Link>
      </div>

      <p className="mx-auto max-w-[900px] px-4 text-center text-[13px] sm:px-6" style={{ color: "var(--semantic-text-muted)" }}>
        For self-assessment only. Not affiliated with CCRNR or official CNPLE.
      </p>
    </div>
  );
}

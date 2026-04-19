"use client";

import dynamic from "next/dynamic";

const ExamSelectorGate = dynamic(
  () => import("@/components/onboarding/exam-selector-gate").then((mod) => mod.ExamSelectorGate),
  {
    loading: () => null,
    ssr: false,
  },
);

/** Homepage-only deferred wrapper so anonymous selector logic stays out of the shared server graph. */
export function ExamSelectorGateLazy() {
  return <ExamSelectorGate />;
}

"use client";

import dynamic from "next/dynamic";

const ExamQuestionsTool = dynamic(() => import("./exam-questions-tool").then((m) => m.ExamQuestionsTool), {
  loading: () => <p className="text-sm text-muted">Loading…</p>,
  ssr: false,
});

export function ExamQuestionsGateway() {
  return <ExamQuestionsTool />;
}

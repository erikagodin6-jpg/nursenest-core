"use client";

import type { ReactNode } from "react";
import { ExamStudyThemeProvider } from "@/components/exam/exam-study-theme-context";
import { ExamStudyThemeModal } from "@/components/exam/exam-study-theme-modal";

/** Wraps learner app content: session-scoped exam theme + theme picker modal. */
export function LearnerExamStudyProviders({ children }: { children: ReactNode }) {
  return (
    <ExamStudyThemeProvider>
      {children}
      <ExamStudyThemeModal />
    </ExamStudyThemeProvider>
  );
}

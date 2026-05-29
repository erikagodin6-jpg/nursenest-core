"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { ExamStudyThemeProvider } from "@/components/exam/exam-study-theme-context";

/**
 * Lazy-load the theme picker modal (399 lines, only needed during exam sessions).
 * This removes ~8 KB from the initial learner shell bundle on every non-exam page.
 */
const ExamStudyThemeModal = dynamic(
  () =>
    import("@/components/exam/exam-study-theme-modal").then((m) => ({
      default: m.ExamStudyThemeModal,
    })),
  { ssr: false },
);

/** Wraps learner app content: session-scoped exam theme + theme picker modal. */
export function LearnerExamStudyProviders({ children }: { children: ReactNode }) {
  return (
    <ExamStudyThemeProvider>
      {children}
      <ExamStudyThemeModal />
    </ExamStudyThemeProvider>
  );
}

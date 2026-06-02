"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  LabsWorkstationMobileStrip,
  LabsWorkstationSidebar,
  type LabsWorkstationNavCategory,
} from "@/components/labs/labs-workstation-sidebar";
import { LearningModuleShell } from "@/components/learner-modules/learning-module-shell";

export type LabsWorkstationShellProps = {
  children: ReactNode;
  categories: LabsWorkstationNavCategory[];
  hasAccess: boolean;
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

export function LabsWorkstationShell({
  children,
  categories,
  hasAccess,
  continueHref,
  continueTitle,
  progressMap = {},
}: LabsWorkstationShellProps) {
  return (
    <LearningModuleShell
      className="nn-labs-workstation"
      legacyRootDataAttribute="data-nn-labs-workstation"
      moduleKey="labs"
      sidebar={
        <LabsWorkstationSidebar
          categories={categories}
          hasAccess={hasAccess}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
        />
      }
      mobileStrip={<LabsWorkstationMobileStrip categories={categories} />}
    >
      {children}
    </LearningModuleShell>
  );
}

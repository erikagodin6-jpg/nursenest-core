"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  MedCalcWorkstationMobileStrip,
  MedCalcWorkstationSidebar,
  type MedCalcWorkstationNavCategory,
} from "@/components/med-calculations/med-calc-workstation-sidebar";
import { LearningModuleShell } from "@/components/learner-modules/learning-module-shell";

export type MedCalcWorkstationShellProps = {
  children: ReactNode;
  categories: MedCalcWorkstationNavCategory[];
  hasAccess: boolean;
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

export function MedCalcWorkstationShell({
  children,
  categories,
  hasAccess,
  continueHref,
  continueTitle,
  progressMap = {},
}: MedCalcWorkstationShellProps) {
  return (
    <LearningModuleShell
      className="nn-med-calc-workstation"
      legacyRootDataAttribute="data-nn-med-calc-workstation"
      moduleKey="med-calculations"
      sidebar={
        <MedCalcWorkstationSidebar
          categories={categories}
          hasAccess={hasAccess}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
        />
      }
      mobileStrip={<MedCalcWorkstationMobileStrip categories={categories} />}
    >
      {children}
    </LearningModuleShell>
  );
}

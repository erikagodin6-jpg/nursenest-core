"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  MedCalcWorkstationMobileStrip,
  MedCalcWorkstationSidebar,
  type MedCalcWorkstationNavCategory,
} from "@/components/med-calculations/med-calc-workstation-sidebar";

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
    <div className="nn-med-calc-workstation" data-nn-med-calc-workstation="">
      <div className="nn-med-calc-workstation__frame">
        <MedCalcWorkstationSidebar
          categories={categories}
          hasAccess={hasAccess}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
        />
        <div className="nn-med-calc-workstation__main">
          <MedCalcWorkstationMobileStrip categories={categories} />
          {children}
        </div>
      </div>
    </div>
  );
}

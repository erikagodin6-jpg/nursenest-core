"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  LabsWorkstationMobileStrip,
  LabsWorkstationSidebar,
  type LabsWorkstationNavCategory,
} from "@/components/labs/labs-workstation-sidebar";

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
    <div className="nn-labs-workstation" data-nn-labs-workstation="">
      <div className="nn-labs-workstation__frame">
        <LabsWorkstationSidebar
          categories={categories}
          hasAccess={hasAccess}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
        />
        <div className="nn-labs-workstation__main">
          <LabsWorkstationMobileStrip categories={categories} />
          {children}
        </div>
      </div>
    </div>
  );
}

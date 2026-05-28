"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  ClinicalSkillsWorkstationMobileStrip,
  ClinicalSkillsWorkstationSidebar,
  type ClinicalSkillsWorkstationNavCategory,
} from "@/components/clinical-skills/clinical-skills-workstation-sidebar";

export function ClinicalSkillsWorkstationShell({
  children,
  categories,
  continueHref,
  continueTitle,
  progressMap = {},
  pathwayQuery = "",
}: {
  children: ReactNode;
  categories: ClinicalSkillsWorkstationNavCategory[];
  continueHref: string;
  continueTitle: string;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  pathwayQuery?: string;
}) {
  return (
    <div className="nn-clinical-skills-workstation" data-nn-clinical-skills-workstation="">
      <div className="nn-clinical-skills-workstation__frame">
        <ClinicalSkillsWorkstationSidebar
          categories={categories}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
          pathwayQuery={pathwayQuery}
        />
        <div className="nn-clinical-skills-workstation__main">
          <ClinicalSkillsWorkstationMobileStrip categories={categories} pathwayQuery={pathwayQuery} />
          {children}
        </div>
      </div>
    </div>
  );
}

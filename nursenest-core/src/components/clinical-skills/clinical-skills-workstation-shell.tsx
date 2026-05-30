"use client";

import type { ReactNode } from "react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  ClinicalSkillsWorkstationMobileStrip,
  ClinicalSkillsWorkstationSidebar,
  type ClinicalSkillsWorkstationNavCategory,
} from "@/components/clinical-skills/clinical-skills-workstation-sidebar";
import { LearningModuleShell } from "@/components/learner-modules/learning-module-shell";

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
    <LearningModuleShell
      className="nn-clinical-skills-workstation"
      legacyRootDataAttribute="data-nn-clinical-skills-workstation"
      moduleKey="clinical-skills"
      sidebar={
        <ClinicalSkillsWorkstationSidebar
          categories={categories}
          continueHref={continueHref}
          continueTitle={continueTitle}
          progressMap={progressMap}
          pathwayQuery={pathwayQuery}
        />
      }
      mobileStrip={<ClinicalSkillsWorkstationMobileStrip categories={categories} pathwayQuery={pathwayQuery} />}
    >
      {children}
    </LearningModuleShell>
  );
}

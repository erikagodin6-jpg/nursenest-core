"use client";

import dynamic from "next/dynamic";
import type { MarketingPathwayLessonAssessmentShellProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

const PathwayLessonAssessmentExperienceClient = dynamic(
  () =>
    import("@/components/lessons/pathway-lesson-assessment-experience").then((mod) => ({
      default: mod.PathwayLessonAssessmentExperience,
    })),
  { ssr: true },
);

export function PathwayLessonAssessmentExperienceLazy(
  props: MarketingPathwayLessonAssessmentShellProps,
) {
  return <PathwayLessonAssessmentExperienceClient {...props} />;
}

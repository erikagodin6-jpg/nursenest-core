import { ExamFamily, type ExamFamily as ExamFamilyType } from "@prisma/client";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";

/**
 * Pathways that use the v2.7 premium lesson reading workspace:
 * left contents rail + clinical pearls, full-width progress strip, flat section cards.
 */
export function usesPremiumLessonReadingV2Layout(args: {
  pathwayId: string;
  examFamily?: ExamFamilyType | null;
  roleTrack?: RoleTrackSlug | null;
}): boolean {
  const { pathwayId, examFamily, roleTrack } = args;
  if (examFamily === ExamFamily.NP) return true;
  if (roleTrack === "allied" || roleTrack === "rn" || roleTrack === "rpn") return true;
  if (pathwayId === "ca-rn-nclex-rn" || pathwayId === "us-rn-nclex-rn") return true;
  if (pathwayId === "ca-rpn-rex-pn") return true;
  return false;
}

export const PREMIUM_LESSON_READING_V2_SHELL_CLASS = "nn-lesson-page-shell--reading-v2";

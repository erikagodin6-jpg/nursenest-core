/**
 * Pathway-scoped headings for the in-app flashcards hub (`/app/flashcards?pathwayId=`).
 * Mirrors {@link pathwayLessonHubH1} structure so RN/PN/NP/allied tracks read distinctly per exam + region.
 */
import { ExamFamily } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import {
  pathwayCountryLabel,
  pathwayRegionAwareExamName,
} from "@/lib/lessons/pathway-lesson-hub-seo";

export function pathwayFlashcardsHubH1(pathway: ExamPathwayDefinition): string {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const country = pathway.countrySlug === "canada" ? "CA" : pathway.countrySlug === "us" ? "US" : "US";
  if (pathway.examFamily === ExamFamily.GENERIC && pathway.roleTrack === "rn") {
    return `${examName} flashcards · ${place}`;
  }
  switch (pathway.roleTrack) {
    case "rn":
      return `${examName} flashcards for ${place}`;
    case "lpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) flashcards for ${place}`;
    case "rpn":
      return `${examName} (${getNursingRoleLabel({ country, role: "PN" })}) flashcards for ${place}`;
    case "np":
      return `${examName} exam prep flashcards for ${place}`;
    case "allied":
      return `Allied health flashcards for ${place}`;
    default:
      return `Flashcards for ${pathway.displayName}`;
  }
}

export function pathwayFlashcardsHubLead(pathway: ExamPathwayDefinition): string {
  const examName = pathwayRegionAwareExamName(pathway);
  return `Spaced repetition and deck study scoped to your ${examName} question pool — same pathway as Lessons and practice.`;
}

export function pathwayFlashcardsHubMetaTitle(pathway: ExamPathwayDefinition): string {
  return `${pathwayFlashcardsHubH1(pathway)} | NurseNest`;
}

/**
 * Resolve a catalog pathway from a raw `?pathwayId=` for tab titles / metadata only.
 * Tries direct id, then normalized ids for US and CA (covers `allied-health` and short NP aliases).
 */
export function tryResolveExamPathwayForFlashcardsMetadataQuery(
  raw: string | null | undefined,
): ExamPathwayDefinition | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length < 3) return null;
  const direct = getExamPathwayById(trimmed);
  if (direct) return direct;
  const us = getExamPathwayById(normalizeLearnerFlashcardsPathwayQueryId(trimmed, "US"));
  if (us) return us;
  const ca = getExamPathwayById(normalizeLearnerFlashcardsPathwayQueryId(trimmed, "CA"));
  return ca ?? null;
}

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type LessonExamCode = "REX_PN" | "NCLEX_PN" | "NCLEX_RN" | "NP" | "ALLIED" | "NCLEX";
export type LessonCountryCode = "CA" | "US" | "GLOBAL";
export type LessonPriority = "high" | "medium" | "low";

type LessonContext = {
  exam: LessonExamCode;
  country: LessonCountryCode;
};

/**
 * Route/pathway-aware mapping used for lesson filtering and labels.
 * Defaults to NCLEX naming when region data is missing.
 */
export function resolveLessonContextForPathway(pathway: Pick<ExamPathwayDefinition, "countrySlug" | "roleTrack">): LessonContext {
  const country: LessonCountryCode = pathway.countrySlug === "canada" ? "CA" : pathway.countrySlug === "us" ? "US" : "GLOBAL";
  if (pathway.roleTrack === "rn") return { exam: "NCLEX_RN", country };
  if (pathway.roleTrack === "lpn" || pathway.roleTrack === "rpn") {
    return { exam: country === "CA" ? "REX_PN" : "NCLEX_PN", country };
  }
  if (pathway.roleTrack === "np") return { exam: "NP", country };
  if (pathway.roleTrack === "allied") return { exam: "ALLIED", country };
  return { exam: "NCLEX", country };
}

/**
 * Same mapping as {@link resolveLessonContextForPathway}, but based on pathway id
 * for low-level data loaders that only have `pathwayId`.
 */
export function resolveLessonContextForPathwayId(pathwayId: string): LessonContext {
  const country: LessonCountryCode = pathwayId.startsWith("ca-") ? "CA" : pathwayId.startsWith("us-") ? "US" : "GLOBAL";
  if (pathwayId.includes("-rpn-rex-pn")) return { exam: "REX_PN", country };
  if (pathwayId.includes("-lpn-nclex-pn")) return { exam: "NCLEX_PN", country };
  if (pathwayId.includes("-rn-nclex-rn")) return { exam: "NCLEX_RN", country };
  if (pathwayId.includes("-np-")) return { exam: "NP", country };
  if (pathwayId.includes("-allied-")) return { exam: "ALLIED", country };
  return { exam: "NCLEX", country };
}


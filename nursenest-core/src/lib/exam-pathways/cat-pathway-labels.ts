/**
 * Shared, user-facing labels for CAT (computer-adaptive testing) surfaces.
 * Keeps country + exam/tier wording aligned with {@link ExamPathwayDefinition} registry data.
 */
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** "US RN", "Canada RPN", "US NP", etc. */
export function catPathwayRegionRoleLabel(pathway: ExamPathwayDefinition): string {
  const country = pathway.countrySlug === "canada" ? "Canada" : "US";
  const role =
    pathway.roleTrack === "rpn"
      ? "RPN"
      : pathway.roleTrack === "rn"
        ? "RN"
        : pathway.roleTrack === "np"
          ? "NP"
          : pathway.roleTrack === "lpn"
            ? "LPN"
            : pathway.roleTrack === "allied"
              ? "Allied"
              : pathway.roleTrack;
  return `${country} ${role}`;
}

/** Exam code / board shorthand from registry — NCLEX-RN, REx-PN, FNP, CNPLE */
export function catPathwayExamCodeLabel(pathway: ExamPathwayDefinition): string {
  return pathway.shortName.trim();
}

/**
 * Full disambiguation line for subtitles and helper copy.
 * Example: `US RN · NCLEX-RN`, `Canada RPN · REx-PN`
 */
export function catPathwayRegionalExamLine(pathway: ExamPathwayDefinition): string {
  return `${catPathwayRegionRoleLabel(pathway)} · ${catPathwayExamCodeLabel(pathway)}`;
}

/** Compact CTA product string: "NCLEX-RN CAT", "FNP CAT" */
export function catPathwayShortCatLabel(pathway: ExamPathwayDefinition): string {
  return `${catPathwayExamCodeLabel(pathway)} CAT`;
}


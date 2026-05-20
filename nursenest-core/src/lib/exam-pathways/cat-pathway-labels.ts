/**
 * Shared, user-facing labels for CAT (computer-adaptive testing) surfaces.
 * Keeps country + exam/tier wording aligned with {@link ExamPathwayDefinition} registry data.
 */
/** Structural shape so learner shells (plain strings) work without importing full pathway types client-side. */
export type CatPathwayLabelSource = {
  countrySlug: string;
  roleTrack: string;
  shortName: string;
};

/** "US RN", "Canada RPN", "US NP", etc. */
export function catPathwayRegionRoleLabel(pathway: CatPathwayLabelSource): string {
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
export function catPathwayExamCodeLabel(pathway: CatPathwayLabelSource): string {
  return pathway.shortName.trim();
}

/**
 * Full disambiguation line for subtitles and helper copy.
 * Example: `US RN · NCLEX-RN`, `Canada RPN · REx-PN`
 */
export function catPathwayRegionalExamLine(pathway: CatPathwayLabelSource): string {
  return `${catPathwayRegionRoleLabel(pathway)} · ${catPathwayExamCodeLabel(pathway)}`;
}

/** Compact CTA product string: "NCLEX-RN CAT", "FNP CAT" */
export function catPathwayShortCatLabel(pathway: CatPathwayLabelSource): string {
  return `${catPathwayExamCodeLabel(pathway)} CAT`;
}


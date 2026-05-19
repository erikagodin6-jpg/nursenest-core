export const PRIMARY_CTA = "Start studying";
export const SECONDARY_CTA = "Practice free questions";
export const TERTIARY_CTA = "Review lessons";

export const BROWSE_LESSONS_CTA = "Browse lessons";
export const BROWSE_QUESTIONS_CTA = "Browse questions";
export const VIEW_PRICING_CTA = "View pricing";
export const COMPARE_PLANS_CTA = "Compare plans";
export const OPEN_STUDY_HUB_CTA = "Open study hub";

export const SIGN_IN_CTA = "Sign in";
export const GET_STARTED_CTA = "Start studying";
export const START_FREE_CTA = "Start free access";
export const RESUME_STUDYING_CTA = "Resume study";
export const CONTINUE_STUDYING_CTA = "Continue study";

export function getPathwayHubCta(pathwayLabel: string): string {
  const compact = pathwayLabel.replace(/\s+/g, " ").trim();
  if (!compact) return "Open pathway hub";
  if (compact.toLowerCase() === "allied") return "Open allied health hub";
  return `Open ${compact} hub`;
}

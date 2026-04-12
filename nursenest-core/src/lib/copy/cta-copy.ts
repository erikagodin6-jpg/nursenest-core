import { formatTitleCase } from "@/lib/format/text-case";

export const PRIMARY_CTA = "Start Practicing";
export const SECONDARY_CTA = "Try Free Questions";
export const TERTIARY_CTA = "Explore Lessons";

export const BROWSE_LESSONS_CTA = "Browse Lessons";
export const BROWSE_QUESTIONS_CTA = "Browse Questions";
export const VIEW_PRICING_CTA = "View Pricing";
export const COMPARE_PLANS_CTA = "Compare Plans";
export const OPEN_STUDY_HUB_CTA = "Open Study Hub";

export const SIGN_IN_CTA = "Sign In";
export const GET_STARTED_CTA = "Get Started";
export const START_FREE_CTA = "Start Free";

export function getPathwayHubCta(pathwayLabel: string): string {
  const compact = pathwayLabel.replace(/\s+/g, " ").trim();
  if (!compact) return "Open Pathway Hub";
  if (compact.toLowerCase() === "allied") return "Open Allied Health Hub";
  return `Open ${formatTitleCase(compact)} Hub`;
}

import type { CountryCode } from "@prisma/client";
import { canonicalCanadianContextMarkdown, canonicalTierRelevanceMarkdown } from "@/lib/lessons/canonical-pathway-lesson-sections";
import { pathwayLicenseBandFromPathwayId } from "@/lib/lessons/pathway-lesson-license-band";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

export function pathwayLessonSectionSurfaceHeading(
  section: PathwayLessonSection,
  pathwayCountry: CountryCode | undefined,
  t: (key: string) => string,
): string {
  const raw = section.heading?.trim() ?? "";
  if (section.kind === "related_next_steps") return t("learner.lessons.detail.nextStepsHeading");
  if (section.kind === "tier_specific_relevance") return t("learner.lessons.detail.tierRelevanceHeading");
  if (section.kind === "country_specific_notes" && pathwayCountry === "CA") {
    return t("learner.lessons.detail.countryContextHeading");
  }
  return raw || t("learner.lessons.detail.sectionFallback");
}

export function pathwayLessonPremiumSectionBodyText(
  section: PathwayLessonSection,
  pathwayId: string,
  pathwayCountry: CountryCode,
): string {
  const body = typeof section.body === "string" ? section.body : "";
  if (section.kind === "tier_specific_relevance") {
    return canonicalTierRelevanceMarkdown(pathwayLicenseBandFromPathwayId(pathwayId));
  }
  if (section.kind === "country_specific_notes" && pathwayCountry === "CA") {
    return canonicalCanadianContextMarkdown("CA") ?? body;
  }
  return body;
}

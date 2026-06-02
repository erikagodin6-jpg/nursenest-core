import { isUnifiedPracticeSlug } from "@/lib/seo/programmatic-practice-hub";

/**
 * i18n key prefix (dot-suffixed: `.heading`, `.lead`, `.questionBankTitle`, …) per unified practice slug.
 * Mirrors {@link isUnifiedPracticeSlug} so marketing pages stay aligned with {@link buildPracticeHubContext}.
 */
export function programmaticStudyModesI18nPrefix(slug: string): string | null {
  if (!isUnifiedPracticeSlug(slug)) return null;
  switch (slug) {
    case "nclex-rn-practice-questions":
      return "programmatic.nclexRnHub";
    case "nclex-pn-practice-questions":
      return "programmatic.studyModes.nclexPnUs";
    case "rex-pn-practice-questions":
      return "programmatic.studyModes.rexPn";
    case "np-exam-practice-questions":
      return "programmatic.studyModes.npUs";
    case "cnple-practice-questions":
      return "programmatic.studyModes.cnple";
    default:
      return null;
  }
}

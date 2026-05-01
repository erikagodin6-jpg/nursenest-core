/**
 * Source-of-truth strings for UK / Australia / Philippines RN foundation marketing hubs.
 * Used by hub headlines, audit scripts, and contract tests — avoid scattering duplicates.
 */
export type IntlRnLintMarket = "gb" | "au" | "ph";

export type IntlRnCountrySiteMatrixRow = {
  pathwayId: string;
  countrySlug: "uk" | "australia" | "philippines";
  countryCode: "GB" | "AU" | "PH";
  lintMarket: IntlRnLintMarket;
  countryLabel: string;
  examLabel: string;
  /** Marketing `<title>` stem before ` | NurseNest` (must match pathway `seoTitle` prefix). */
  titlePhrase: string;
  /** Public hub `<h1>` (via {@link nursingTierMarketingHeadline}). */
  h1Phrase: string;
  /** Required `marketing.json` keys for intl hub sections + disclaimer. */
  requiredMarketingKeys: readonly string[];
};

export const INTL_RN_COUNTRY_SITE_MATRIX: readonly IntlRnCountrySiteMatrixRow[] = [
  {
    pathwayId: "uk-rn-nmc-test-of-competence",
    countrySlug: "uk",
    countryCode: "GB",
    lintMarket: "gb",
    countryLabel: "United Kingdom",
    examLabel: "NMC CBT + OSCE",
    titlePhrase: "UK NMC CBT & OSCE RN Exam Prep",
    h1Phrase: "Prepare for UK RN registration with NMC CBT & OSCE practice",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.uk.regionalHubLabel",
      "intlNursing.intlRn.uk.overview",
      "intlNursing.intlRn.uk.whatYouStudy",
      "intlNursing.intlRn.uk.practicePreview",
      "intlNursing.intlRn.uk.flashcardsPreview",
      "intlNursing.intlRn.uk.catNote",
    ],
  },
  {
    pathwayId: "au-rn-iqnm-pathway",
    countrySlug: "australia",
    countryCode: "AU",
    lintMarket: "au",
    countryLabel: "Australia",
    examLabel: "NMBA/AHPRA IQNM pathway",
    titlePhrase: "Australia RN Registration Exam Prep",
    h1Phrase: "Prepare for Australian RN registration with NurseNest",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.au.regionalHubLabel",
      "intlNursing.intlRn.au.overview",
      "intlNursing.intlRn.au.whatYouStudy",
      "intlNursing.intlRn.au.practicePreview",
      "intlNursing.intlRn.au.flashcardsPreview",
      "intlNursing.intlRn.au.catNote",
    ],
  },
  {
    pathwayId: "ph-rn-prc-pnle",
    countrySlug: "philippines",
    countryCode: "PH",
    lintMarket: "ph",
    countryLabel: "Philippines",
    examLabel: "PRC Nurses Licensure Examination / PNLE",
    titlePhrase: "Philippines PNLE Nursing Board Exam Prep",
    h1Phrase: "Prepare for the PNLE with NurseNest",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.ph.regionalHubLabel",
      "intlNursing.intlRn.ph.overview",
      "intlNursing.intlRn.ph.whatYouStudy",
      "intlNursing.intlRn.ph.practicePreview",
      "intlNursing.intlRn.ph.flashcardsPreview",
      "intlNursing.intlRn.ph.catNote",
    ],
  },
] as const;

const byPathwayId = new Map<string, IntlRnCountrySiteMatrixRow>(
  INTL_RN_COUNTRY_SITE_MATRIX.map((row) => [row.pathwayId, row]),
);

export function getIntlRnCountrySiteMatrixRow(pathwayId: string): IntlRnCountrySiteMatrixRow | undefined {
  return byPathwayId.get(pathwayId);
}

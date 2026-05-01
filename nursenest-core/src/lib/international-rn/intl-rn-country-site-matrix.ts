/**
 * Source-of-truth strings for international RN foundation marketing hubs.
 * Used by hub headlines, audit scripts, and contract tests — avoid scattering duplicates.
 */
export type IntlRnLintMarket = "gb" | "au" | "ph" | "in" | "ng" | "sa";

export type IntlRnCountrySiteMatrixRow = {
  pathwayId: string;
  countrySlug: "uk" | "australia" | "philippines" | "india" | "nigeria" | "saudi-arabia";
  countryCode: "GB" | "AU" | "PH" | "IN" | "NG" | "SA";
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
  {
    pathwayId: "in-rn-state-nursing-council-registration",
    countrySlug: "india",
    countryCode: "IN",
    lintMarket: "in",
    countryLabel: "India",
    examLabel: "State Nursing Council Registration (INC aligned)",
    titlePhrase: "India RN Registration Exam Prep",
    h1Phrase: "Prepare for RN registration in India",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.in.regionalHubLabel",
      "intlNursing.intlRn.in.overview",
      "intlNursing.intlRn.in.whatYouStudy",
      "intlNursing.intlRn.in.practicePreview",
      "intlNursing.intlRn.in.flashcardsPreview",
      "intlNursing.intlRn.in.catNote",
    ],
  },
  {
    pathwayId: "ng-rn-nmcn-licensure",
    countrySlug: "nigeria",
    countryCode: "NG",
    lintMarket: "ng",
    countryLabel: "Nigeria",
    examLabel: "NMCN RN Licensure",
    titlePhrase: "Nigeria RN Licensure Exam Prep",
    h1Phrase: "Prepare for RN licensure in Nigeria",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.ng.regionalHubLabel",
      "intlNursing.intlRn.ng.overview",
      "intlNursing.intlRn.ng.whatYouStudy",
      "intlNursing.intlRn.ng.practicePreview",
      "intlNursing.intlRn.ng.flashcardsPreview",
      "intlNursing.intlRn.ng.catNote",
    ],
  },
  {
    pathwayId: "sa-rn-scfhs-licensure",
    countrySlug: "saudi-arabia",
    countryCode: "SA",
    lintMarket: "sa",
    countryLabel: "Saudi Arabia",
    examLabel: "Saudi Commission for Health Specialties (SCFHS)",
    titlePhrase: "Saudi RN Licensure Exam Prep",
    h1Phrase: "Prepare for RN licensure in Saudi Arabia",
    requiredMarketingKeys: [
      "intlNursing.intlRn.disclaimer",
      "intlNursing.intlRn.sa.regionalHubLabel",
      "intlNursing.intlRn.sa.overview",
      "intlNursing.intlRn.sa.whatYouStudy",
      "intlNursing.intlRn.sa.practicePreview",
      "intlNursing.intlRn.sa.flashcardsPreview",
      "intlNursing.intlRn.sa.catNote",
    ],
  },
] as const;

const byPathwayId = new Map<string, IntlRnCountrySiteMatrixRow>(
  INTL_RN_COUNTRY_SITE_MATRIX.map((row) => [row.pathwayId, row]),
);

export function getIntlRnCountrySiteMatrixRow(pathwayId: string): IntlRnCountrySiteMatrixRow | undefined {
  return byPathwayId.get(pathwayId);
}

import type { CountryFeaturedContentEntry, PilotCountrySlug } from "./country-localization-types";

export const COUNTRY_FEATURED_CONTENT_MAP: Record<PilotCountrySlug, CountryFeaturedContentEntry> = {
  india: {
    countrySlug: "india",
    slots: [
      { id: "registration-nclex", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad-jobs", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  "middle-east": {
    countrySlug: "middle-east",
    slots: [
      { id: "prometric-gulf", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "dataflow-expat", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  australia: {
    countrySlug: "australia",
    slots: [
      { id: "ahpra-oba", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "international-rn", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
};

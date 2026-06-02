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
  china: {
    countrySlug: "china",
    slots: [
      { id: "nnqe", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  korea: {
    countrySlug: "korea",
    slots: [
      { id: "kle", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  japan: {
    countrySlug: "japan",
    slots: [
      { id: "national-exam", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  germany: {
    countrySlug: "germany",
    slots: [
      { id: "recognition", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  france: {
    countrySlug: "france",
    slots: [
      { id: "dreets", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  italy: {
    countrySlug: "italy",
    slots: [
      { id: "ordinamento", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  hungary: {
    countrySlug: "hungary",
    slots: [
      { id: "recognition", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  portugal: {
    countrySlug: "portugal",
    slots: [
      { id: "ordem", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  mexico: {
    countrySlug: "mexico",
    slots: [
      { id: "tmsp", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "abroad", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
  philippines: {
    countrySlug: "philippines",
    slots: [
      { id: "nle", titleKey: "card1Title", bodyKey: "card1Body" },
      { id: "nclex", titleKey: "card2Title", bodyKey: "card2Body" },
    ],
  },
};

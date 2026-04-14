import type { CountryRouteEntry, PilotCountrySlug } from "./country-localization-types";

export const PILOT_COUNTRY_SLUGS: readonly PilotCountrySlug[] = ["india", "middle-east", "australia"];

export const COUNTRY_ROUTE_MAP: Record<PilotCountrySlug, CountryRouteEntry> = {
  india: {
    countrySlug: "india",
    examsHubPath: "/exams/india",
    registrationPath: "/india/nursing-registration",
    howToPath: "/india/nursing-exams",
    workAbroadPath: "/exams/india#india-intl",
    extraTopicPaths: ["/india/aiims-nursing", "/india/nursing-exams"],
  },
  "middle-east": {
    countrySlug: "middle-east",
    examsHubPath: "/exams/middle-east",
    extraTopicPaths: [
      "/middle-east/prometric-nursing-exam",
      "/middle-east/dha-exam",
      "/middle-east/haad-exam",
      "/middle-east/dataflow-guide",
    ],
  },
  australia: {
    countrySlug: "australia",
    examsHubPath: "/exams/australia",
    registrationPath: "/australia/ahpra-registration",
    howToPath: "/australia/nursing-pathway",
    workAbroadPath: "/exams/australia#au-international",
    extraTopicPaths: ["/australia/osce-nursing", "/australia/oba-nursing"],
  },
};

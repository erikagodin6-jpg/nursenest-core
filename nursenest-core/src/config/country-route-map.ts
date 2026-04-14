import type { CountryRouteEntry, PilotCountrySlug } from "./country-localization-types";

export const PILOT_COUNTRY_SLUGS: readonly PilotCountrySlug[] = [
  "india",
  "middle-east",
  "australia",
  "china",
  "korea",
  "japan",
  "germany",
  "france",
  "italy",
  "hungary",
  "portugal",
  "mexico",
  "philippines",
];

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
  china: {
    countrySlug: "china",
    examsHubPath: "/exams/china",
    howToPath: "/china/how-to-become-a-nurse",
    workAbroadPath: "/china/work-abroad",
    extraTopicPaths: ["/china/nursing-exam", "/china/nclex-for-chinese-nurses"],
  },
  korea: {
    countrySlug: "korea",
    examsHubPath: "/exams/korea",
    extraTopicPaths: ["/korea/nursing-exam", "/korea/work-abroad", "/korea/nclex-for-korean-nurses"],
  },
  japan: {
    countrySlug: "japan",
    examsHubPath: "/exams/japan",
    extraTopicPaths: ["/japan/nursing-exam", "/japan/work-abroad"],
  },
  germany: {
    countrySlug: "germany",
    examsHubPath: "/exams/germany",
    extraTopicPaths: ["/germany/nursing-exam", "/germany/work-abroad"],
  },
  france: {
    countrySlug: "france",
    examsHubPath: "/exams/france",
    extraTopicPaths: ["/france/nursing-exam", "/france/work-abroad"],
  },
  italy: {
    countrySlug: "italy",
    examsHubPath: "/exams/italy",
    extraTopicPaths: ["/italy/nursing-exam", "/italy/work-abroad"],
  },
  hungary: {
    countrySlug: "hungary",
    examsHubPath: "/exams/hungary",
    extraTopicPaths: ["/hungary/nursing-exam", "/hungary/work-abroad"],
  },
  portugal: {
    countrySlug: "portugal",
    examsHubPath: "/exams/portugal",
    extraTopicPaths: ["/portugal/nursing-exam", "/portugal/work-abroad"],
  },
  mexico: {
    countrySlug: "mexico",
    examsHubPath: "/exams/mexico",
    extraTopicPaths: ["/mexico/nursing-exam", "/mexico/work-abroad"],
  },
  philippines: {
    countrySlug: "philippines",
    examsHubPath: "/exams/philippines",
    workAbroadPath: "/exams/philippines#migration",
    extraTopicPaths: [],
  },
};

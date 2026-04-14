import type { CountryExamMapEntry, PilotCountrySlug } from "./country-localization-types";

/**
 * Exam / scope coverage per pilot — avoids a single flattened “nursing exam” label.
 * Paths are marketing routes; authoritative rules stay on regulator sites.
 */
export const COUNTRY_EXAM_MAP: Record<PilotCountrySlug, CountryExamMapEntry> = {
  india: {
    countrySlug: "india",
    examsHubPath: "/exams/india",
    topicPaths: ["/india/nursing-exams", "/india/aiims-nursing", "/india/nursing-registration"],
    nursingScopes: ["RN", "PN", "NP"],
    alliedHealthScopes: [],
  },
  "middle-east": {
    countrySlug: "middle-east",
    examsHubPath: "/exams/middle-east",
    topicPaths: [
      "/middle-east/prometric-nursing-exam",
      "/middle-east/dha-exam",
      "/middle-east/haad-exam",
      "/middle-east/dataflow-guide",
    ],
    nursingScopes: ["RN", "PN"],
    alliedHealthScopes: [],
  },
  australia: {
    countrySlug: "australia",
    examsHubPath: "/exams/australia",
    topicPaths: ["/australia/ahpra-registration", "/australia/osce-nursing", "/australia/oba-nursing"],
    nursingScopes: ["EN", "RN", "NP"],
    alliedHealthScopes: ["physiotherapy", "occupational-therapy"],
  },
  china: {
    countrySlug: "china",
    examsHubPath: "/exams/china",
    topicPaths: ["/china/how-to-become-a-nurse", "/china/nursing-exam", "/china/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  korea: {
    countrySlug: "korea",
    examsHubPath: "/exams/korea",
    topicPaths: ["/korea/nursing-exam", "/korea/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  japan: {
    countrySlug: "japan",
    examsHubPath: "/exams/japan",
    topicPaths: ["/japan/nursing-exam", "/japan/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  germany: {
    countrySlug: "germany",
    examsHubPath: "/exams/germany",
    topicPaths: ["/germany/nursing-exam", "/germany/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  france: {
    countrySlug: "france",
    examsHubPath: "/exams/france",
    topicPaths: ["/france/nursing-exam", "/france/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  italy: {
    countrySlug: "italy",
    examsHubPath: "/exams/italy",
    topicPaths: ["/italy/nursing-exam", "/italy/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  hungary: {
    countrySlug: "hungary",
    examsHubPath: "/exams/hungary",
    topicPaths: ["/hungary/nursing-exam", "/hungary/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  portugal: {
    countrySlug: "portugal",
    examsHubPath: "/exams/portugal",
    topicPaths: ["/portugal/nursing-exam", "/portugal/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  mexico: {
    countrySlug: "mexico",
    examsHubPath: "/exams/mexico",
    topicPaths: ["/mexico/nursing-exam", "/mexico/work-abroad"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
  philippines: {
    countrySlug: "philippines",
    examsHubPath: "/exams/philippines",
    topicPaths: ["/exams/philippines"],
    nursingScopes: ["RN"],
    alliedHealthScopes: [],
  },
};

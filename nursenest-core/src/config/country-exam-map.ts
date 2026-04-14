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
};

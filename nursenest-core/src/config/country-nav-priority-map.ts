import type { NavPriorityEntry, PilotCountrySlug } from "./country-localization-types";

/** Logical ordering keys — components map these to `nav.*` / country strip links. */
export const COUNTRY_NAV_PRIORITY_MAP: Record<PilotCountrySlug, NavPriorityEntry> = {
  india: {
    countrySlug: "india",
    navOrdering: ["examsHub", "nursingRegistration", "aiims", "stateExams", "workAbroad", "nclexPrepUs", "blogTag"],
  },
  "middle-east": {
    countrySlug: "middle-east",
    navOrdering: ["examsHub", "prometric", "dha", "haad", "dataflow", "nclexPrepUs", "blogTag"],
  },
  australia: {
    countrySlug: "australia",
    navOrdering: ["examsHub", "ahpra", "osce", "oba", "pathway", "workAu", "blogTag"],
  },
  china: {
    countrySlug: "china",
    navOrdering: ["examsHub", "howTo", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  korea: {
    countrySlug: "korea",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  japan: {
    countrySlug: "japan",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  germany: {
    countrySlug: "germany",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  france: {
    countrySlug: "france",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  italy: {
    countrySlug: "italy",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  hungary: {
    countrySlug: "hungary",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  portugal: {
    countrySlug: "portugal",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  mexico: {
    countrySlug: "mexico",
    navOrdering: ["examsHub", "nursingExam", "workAbroad", "nclexTopic", "blogTag", "usLessons"],
  },
  philippines: {
    countrySlug: "philippines",
    navOrdering: ["examsHub", "nleContext", "nclexPath", "migration", "blogTag", "usLessons"],
  },
};

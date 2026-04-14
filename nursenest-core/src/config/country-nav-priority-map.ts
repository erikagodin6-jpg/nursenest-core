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
};

import type { ImportCountry, NormalizedExamQuestion, ProductTrack } from "./replit-question-types";

function normTrack(s: string): string {
  return s
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_")
    .replace(/NCLEX_PN/g, "PN")
    .replace(/NCLEX_RN/g, "RN");
}

/**
 * Map high-level product track + country to `exam_questions` tier/exam/region (aligned with seed + pathway keys).
 */
export function mapTrackAndCountryToExamFields(
  track: ProductTrack,
  country: ImportCountry,
): Pick<NormalizedExamQuestion, "tier" | "exam" | "regionScope" | "countryCode" | "careerType"> {
  const cc = country === "CA" ? "CA" : "US";
  const regionScope = country === "CA" ? "CA_ONLY" : "US_ONLY";

  switch (track) {
    case "ALLIED":
      return {
        tier: "allied",
        exam: "ALLIED",
        regionScope,
        countryCode: cc,
        careerType: "allied",
      };
    case "NP":
      return {
        tier: "np",
        exam: "NP",
        regionScope,
        countryCode: cc,
        careerType: "nursing",
      };
    case "RN":
      return {
        tier: "rn",
        exam: "NCLEX-RN",
        regionScope,
        countryCode: cc,
        careerType: "nursing",
      };
    case "PN":
      return {
        tier: country === "CA" ? "rpn" : "lvn",
        exam: "NCLEX-PN",
        regionScope,
        countryCode: cc,
        careerType: "nursing",
      };
    default:
      return {
        tier: "rn",
        exam: "NCLEX-RN",
        regionScope,
        countryCode: cc,
        careerType: "nursing",
      };
  }
}

/** Infer {@link ProductTrack} from loose export strings. */
export function inferTrackFromRaw(raw: Record<string, unknown>, fallback: ProductTrack): ProductTrack {
  const candidates = [
    raw.track,
    raw.examTrack,
    raw.product,
    raw.level,
    raw.pathway,
    raw.pathwayKey,
    raw.examFamily,
    raw.exam_family,
    raw.tier,
  ]
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => normTrack(x));

  for (const c of candidates) {
    if (c.includes("ALLIED") || c.includes("CAREER") || c.includes("CERT")) return "ALLIED";
    if (c.includes("NP") || c.includes("FNP") || c.includes("PMHNP")) return "NP";
    if (c.includes("RN") || c.includes("NCLEX_RN") || c === "NCLEX-RN") return "RN";
    if (
      c.includes("PN") ||
      c.includes("LVN") ||
      c.includes("LPN") ||
      c.includes("RPN") ||
      c.includes("NCLEX_PN") ||
      c.includes("REX")
    ) {
      return "PN";
    }
  }
  return fallback;
}

export function inferCountryFromRaw(raw: Record<string, unknown>, fallback: ImportCountry): ImportCountry {
  const v = raw.country ?? raw.countryCode ?? raw.region ?? raw.locale;
  if (typeof v !== "string") return fallback;
  const s = v.trim().toLowerCase();
  if (s === "ca" || s === "can" || s === "canada" || s === "cdn") return "CA";
  if (s === "us" || s === "usa" || s === "united states" || s === "america") return "US";
  return fallback;
}

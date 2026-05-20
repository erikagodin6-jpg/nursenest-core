import type { CountryCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

/**
 * Resolves marketing / short `pathwayId` values to catalog ids so exam registry,
 * question bank scoping, and flashcards/practice hubs stay aligned.
 */
export function normalizePathwayIdForStudySurfaces(
  raw: string | null | undefined,
  country: CountryCode | string | null | undefined,
): string {
  const id = raw?.trim() ?? "";
  if (!id) return id;
  const countryIsCa = String(country ?? "").toUpperCase() === "CA";
  /** Marketing + hubs use stable `pre-nursing`; catalog rows are country-scoped like NCLEX tracks. */
  if (id.toLowerCase() === "pre-nursing") {
    return countryIsCa ? "pre-nursing-ca" : "pre-nursing";
  }
  if (getExamPathwayById(id)) return id;

  const key = id.toLowerCase();

  const aliases: Record<string, string> = {
    "ca-np": "ca-np-cnple",
    "new-grad": "us-rn-new-grad-transition",
    "default-new-grad": "us-rn-new-grad-transition",
    "allied-health": countryIsCa ? "ca-allied-core" : "us-allied-core",
    "default-allied": countryIsCa ? "ca-allied-core" : "us-allied-core",
    /** Common exam labels → canonical pathway ids */
    "nclex-rn": countryIsCa ? "ca-rn-nclex-rn" : "us-rn-nclex-rn",
    "nclex_rn": countryIsCa ? "ca-rn-nclex-rn" : "us-rn-nclex-rn",
    "nclex-pn": countryIsCa ? "ca-rpn-rex-pn" : "us-lpn-nclex-pn",
    "nclex_pn": countryIsCa ? "ca-rpn-rex-pn" : "us-lpn-nclex-pn",
    "nclex-pn-us": "us-lpn-nclex-pn",
    "rex-pn": "ca-rpn-rex-pn",
    "rpn": "ca-rpn-rex-pn",
    "pn": countryIsCa ? "ca-rpn-rex-pn" : "us-lpn-nclex-pn",
    "lpn": "us-lpn-nclex-pn",
    "lvn": "us-lpn-nclex-pn",
  };

  return aliases[key] ?? id;
}

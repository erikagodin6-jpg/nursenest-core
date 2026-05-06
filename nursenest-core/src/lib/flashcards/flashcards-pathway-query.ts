import type { CountryCode } from "@prisma/client";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";

/**
 * Maps short or marketing-style `pathwayId` query values to canonical exam-pathway ids
 * (catalog keys, entitlements, SQL scopes).
 *
 * Use for **every** tier-scoped learner surface that reads `?pathwayId=` — flashcards hub,
 * practice-tests hub, question bank entry, and APIs that accept the same query param — so
 * marketing/deep links (`ca-np`, `allied-health`, …) stay aligned with `/app/flashcards`.
 */
export function normalizeLearnerFlashcardsPathwayQueryId(
  raw: string,
  country: CountryCode | string | null | undefined,
): string {
  const id = raw.trim();
  if (!id) return id;
  const key = id.toLowerCase();
  const countryIsCa = String(country ?? "").toUpperCase() === "CA";

  const aliases: Record<string, string> = {
    /** Short NP slug used in deep links — canonical id is CNPLE. */
    "ca-np": "ca-np-cnple",
    /** Hub-style slugs → bundled catalog pathway ids. */
    "new-grad": "us-rn-new-grad-transition",
    "default-new-grad": "us-rn-new-grad-transition",
    "allied-health": countryIsCa ? "ca-allied-core" : "us-allied-core",
    "default-allied": countryIsCa ? "ca-allied-core" : "us-allied-core",
  };

  return normalizePathwayIdForStudySurfaces(aliases[key] ?? id, country);
}

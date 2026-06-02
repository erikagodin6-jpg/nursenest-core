import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";

export type DashboardIdentity = {
  /** Short label for the pill: "RN", "PN", "NP", "MLT", "PTA", etc. */
  pill: string;
  /** Longer subtitle: "Preparing for NCLEX-RN", "Medical Laboratory exam prep", etc. */
  subtitle: string;
};

const TIER_PILL_MAP: Record<string, string> = {
  RN: "RN",
  RPN: "RPN",
  LVN_LPN: "PN",
  NP: "NP",
  ALLIED: "Allied",
};

/**
 * Build the identity label and subtitle shown in the dashboard hero and nav pill.
 * Never throws — returns a safe fallback on any unknown input.
 */
export function resolveDashboardIdentity(options: {
  tier?: string | null;
  learnerPathId?: string | null;
  alliedProfessionKey?: string | null;
}): DashboardIdentity {
  const { tier, learnerPathId, alliedProfessionKey } = options;

  // ── Allied career path ────────────────────────────────────────────────
  if (tier === "ALLIED") {
    if (alliedProfessionKey) {
      const prof = getAlliedProfessionByProfessionKey(alliedProfessionKey);
      if (prof) {
        // Extract acronym from h1 like "Physical therapist assistant (PTA)" → "PTA"
        const acronymMatch = prof.h1.match(/\(([A-Z/]+)\)/);
        const pill = acronymMatch ? acronymMatch[1] : alliedProfessionKey.toUpperCase();
        // Short exam-prep subtitle from h1 minus " exam prep" suffix
        const shortName = prof.h1.replace(/ exam prep$/i, "").replace(/ \(.*\)$/, "").trim();
        return { pill, subtitle: `${shortName} exam prep` };
      }
    }
    return { pill: "Allied", subtitle: "Allied health exam prep" };
  }

  // ── Nursing pathway path ──────────────────────────────────────────────
  if (learnerPathId) {
    const pathway = getExamPathwayById(learnerPathId);
    if (pathway) {
      const pill = TIER_PILL_MAP[tier ?? ""] ?? tier ?? "Learner";
      const examName = pathway.shortName ?? pathway.displayName;
      return {
        pill,
        subtitle: `Preparing for ${examName}`,
      };
    }
  }

  // ── Tier-only fallback (no pathway selected yet) ──────────────────────
  if (tier) {
    const pill = TIER_PILL_MAP[tier] ?? tier;
    const subtitleMap: Record<string, string> = {
      RN: "Preparing for NCLEX-RN",
      RPN: "Preparing for REx-PN",
      LVN_LPN: "Preparing for NCLEX-PN",
      NP: "Nurse Practitioner exam prep",
      ALLIED: "Allied health exam prep",
    };
    return { pill, subtitle: subtitleMap[tier] ?? "Exam prep" };
  }

  return { pill: "Learner", subtitle: "Study dashboard" };
}

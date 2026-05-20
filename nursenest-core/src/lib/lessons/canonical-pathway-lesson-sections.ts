import type { PathwayLicenseBand } from "@/lib/lessons/pathway-lesson-license-band";
import type { CountryCode } from "@prisma/client";

/**
 * Single-tier, scan-first bullets for the tier relevance slot (replaces cross-tier catalog prose at render time).
 */
export function canonicalTierRelevanceMarkdown(band: PathwayLicenseBand): string {
  switch (band) {
    case "rn":
      return [
        "- Anchor every option in **clinical judgment**: unstable versus stable, trajectory, and what changes first.",
        "- **Prioritize** life threats, acute change, and safe sequencing before routine or comfort-only moves.",
        "- **Escalate** with clear, concise reporting when data cross implied instability thresholds.",
        "- Stay inside the **RN authority** the stem names—orders, scope, and interprofessional handoffs.",
        "- **Exam execution**: read the role line first; eliminate options that expand scope or delay needed action.",
      ].join("\n");
    case "pn":
      return [
        "- Execute **within orders and employer policy**; reinforce teaching and report changes promptly.",
        "- Choose **timely escalation** when findings exceed stable monitoring—avoid silent fixes.",
        "- Keep actions **scope-safe**: no independent prescribing, diagnosing beyond assessment data, or delayed handoff.",
        "- **Prioritize** client safety, objective reporting, and the next prudent check the stem allows.",
        "- **Exam execution**: match the **practical nurse** role line before you eliminate distractors.",
      ].join("\n");
    case "np":
      return [
        "- Lead with **cannot-miss** recognition, risk-appropriate **site-of-care**, and specific follow-up.",
        "- Use **diagnostic discipline**: problem definition, differentials that fit the data, and what you ruled out.",
        "- Prefer answers that **close risk fastest** with clear monitoring and safety netting.",
        "- Respect **collaboration cues** in the vignette—who initiates orders, referrals, and transfers.",
        "- **Exam execution**: name the risk pattern first, then lock scope to the **NP** role the item assigns.",
      ].join("\n");
    default:
      return canonicalTierRelevanceMarkdown("rn");
  }
}

/** Short CA-only line for the country-specific slot (replaces long regional essays at render time). */
export function canonicalCanadianContextMarkdown(countryCode: CountryCode | string | null | undefined): string | null {
  if (countryCode !== "CA") return null;
  return "Canadian items use SI units and Canadian facility/role labels; prioritization is the same—life threats, acute change, safe sequencing, and timely escalation when scope requires it.";
}

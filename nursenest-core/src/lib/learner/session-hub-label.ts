/**
 * Centralised session hub label resolver.
 *
 * Converts a learner tier (from session.user.tier) to the correct
 * "← Return to X Hub" label shown in focused study/exam sessions.
 *
 * Single source of truth — do NOT duplicate this mapping in components.
 */
export function getSessionHubLabel(tier: string | null | undefined): string {
  switch ((tier ?? "").toUpperCase()) {
    case "RN":
      return "RN Hub";
    case "RPN":
      return "RPN Hub";
    case "NP":
      return "NP Hub";
    case "LVN_LPN":
      return "LPN Hub";
    case "ALLIED":
      return "Allied Hub";
    default:
      return "Hub";
  }
}

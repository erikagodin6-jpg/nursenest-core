/**
 * Follow-up interval intelligence.
 *
 * Assesses whether a follow-up interval is clinically appropriate
 * given the urgency of the patient's condition.
 * Inappropriate timing penalises the trajectory score.
 */
import type { FollowUpInterval, FollowUpAppropriateness } from "@/lib/cases/longitudinal-case-types";

// ── Urgency levels ────────────────────────────────────────────────────────────

/**
 * Clinical urgency of a patient's condition at a given step.
 * Derived from the step's clinical update direction and safety flags.
 */
export type ClinicalUrgencyLevel =
  | "emergency"       // Immediate transfer or 911 — hours matter
  | "urgent"          // Same-day or next-day assessment required
  | "semi_urgent"     // Within 1–2 weeks
  | "routine"         // Weeks to months acceptable
  | "preventive";     // Annual or longer intervals appropriate

/** Acceptable follow-up windows (in days) by urgency level. */
const URGENCY_WINDOWS: Record<ClinicalUrgencyLevel, { minDays: number; maxDays: number }> = {
  emergency:   { minDays: 0,    maxDays: 0    }, // Immediate
  urgent:      { minDays: 1,    maxDays: 3    },
  semi_urgent: { minDays: 7,    maxDays: 21   },
  routine:     { minDays: 28,   maxDays: 180  },
  preventive:  { minDays: 180,  maxDays: 730  },
};

// ── Interval to days ──────────────────────────────────────────────────────────

/** Converts a FollowUpInterval to total days. */
export function intervalToDays(interval: FollowUpInterval): number {
  const multipliers: Record<FollowUpInterval["unit"], number> = {
    hours:  1 / 24,
    days:   1,
    weeks:  7,
    months: 30,
  };
  return interval.value * multipliers[interval.unit];
}

// ── Appropriateness scoring ───────────────────────────────────────────────────

/**
 * Scores the appropriateness of a follow-up interval given clinical urgency.
 *
 * Returns:
 * - "appropriate"          — within acceptable window
 * - "too_early"            — unnecessarily frequent (efficiency concern, not safety)
 * - "too_late"             — delayed beyond acceptable window (safety concern)
 * - "dangerous_delay"      — critically delayed for urgent/emergency urgency
 * - "excessive_escalation" — emergency escalation for a routine-urgency issue
 * - "not_applicable"       — no interval to assess (first step)
 */
export function assessFollowUpAppropriateness(
  interval: FollowUpInterval | null,
  urgency: ClinicalUrgencyLevel,
): FollowUpAppropriateness {
  if (interval === null) return "not_applicable";

  const days = intervalToDays(interval);
  const { minDays, maxDays } = URGENCY_WINDOWS[urgency];

  // Emergency urgency — any delay beyond same-visit is dangerous
  if (urgency === "emergency") {
    if (days === 0) return "appropriate";
    if (days <= 1) return "too_late";
    return "dangerous_delay";
  }

  // Routine/preventive urgency — escalating to emergency is excessive
  if ((urgency === "routine" || urgency === "preventive") && days === 0) {
    return "excessive_escalation";
  }

  if (days < minDays) return "too_early";
  if (days > maxDays && urgency === "urgent") return "dangerous_delay";
  if (days > maxDays) return "too_late";
  return "appropriate";
}

// ── Trajectory penalty ────────────────────────────────────────────────────────

/**
 * Returns additional trajectory debt for inappropriate follow-up timing.
 * Dangerous delays add the most debt; excessive escalation adds moderate.
 */
export function followUpPenaltyDebt(appropriateness: FollowUpAppropriateness): number {
  const penalties: Record<FollowUpAppropriateness, number> = {
    appropriate:          0,
    not_applicable:       0,
    too_early:            3,   // Minor efficiency concern
    too_late:             10,  // Clinical safety concern
    dangerous_delay:      25,  // Serious safety concern — equivalent to suboptimal decision
    excessive_escalation: 8,   // Overuse of resources but not a safety issue
  };
  return penalties[appropriateness];
}

// ── Urgency inference ─────────────────────────────────────────────────────────

/**
 * Infers clinical urgency from a case step's direction and domain context.
 * Used when an explicit urgency is not authored into the step.
 */
export function inferClinicalUrgency(
  direction: "improving" | "stable" | "worsening" | "critical",
  domain: string,
): ClinicalUrgencyLevel {
  if (direction === "critical") return "emergency";
  if (direction === "worsening") {
    if (domain === "acute-urgent-care") return "urgent";
    if (domain === "chronic-disease-management") return "semi_urgent";
    return "semi_urgent";
  }
  if (direction === "stable") return "routine";
  if (direction === "improving") return "routine";
  return "routine";
}

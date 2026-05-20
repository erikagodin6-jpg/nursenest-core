/**
 * Occupation-aware gates for allied marketing hubs: polish “locked” cards where a tool
 * is a weak fit, without changing routes or entitlements (learners still resolve in-app).
 */

type PremiumStudyToolKey = string;

const LAB_DIAGNOSTICS_LOCKED = new Set<string>([
  "social-work",
  "psychotherapy",
  "mental-health-addictions",
  "community-health-worker",
  "psw-hca",
]);

const MED_CALC_LOCKED = new Set<string>([
  "social-work",
  "psychotherapy",
  "mental-health-addictions",
  "community-health-worker",
  "psw-hca",
  "dental-assistant",
  "ota",
]);

/** Medication drill refreshers — weak fit where calculation/med-admin lanes are de-emphasized (same cohort as med calc). */
const MEDICATION_DRILLS_LOCKED = MED_CALC_LOCKED;

const PHARMACOLOGY_LOCKED = new Set<string>([
  "social-work",
  "psychotherapy",
  "mental-health-addictions",
  "community-health-worker",
  "psw-hca",
  "lab-assistant",
]);

/** Tracks where long adaptive CAT / simulation marketing emphasis is de-emphasized in favor of scenarios + banks. */
const ADAPTIVE_CAT_LOCKED = new Set<string>([
  "social-work",
  "psychotherapy",
  "mental-health-addictions",
  "community-health-worker",
  "psw-hca",
]);

function normProfessionKey(key: string | null | undefined): string | null {
  const k = key?.trim().toLowerCase();
  return k && k.length > 0 ? k : null;
}

export function alliedHubCatSurfaceUnlocked(professionKey: string | null | undefined): boolean {
  const k = normProfessionKey(professionKey);
  if (!k) return true;
  return !ADAPTIVE_CAT_LOCKED.has(k);
}

function shouldLockModule(professionKey: string, moduleKey: PremiumStudyToolKey): boolean {
  switch (moduleKey) {
    case "labs":
      return LAB_DIAGNOSTICS_LOCKED.has(professionKey);
    case "med_calc":
      return MED_CALC_LOCKED.has(professionKey);
    case "skills_refresher":
      return MEDICATION_DRILLS_LOCKED.has(professionKey);
    case "pharmacology":
      return PHARMACOLOGY_LOCKED.has(professionKey);
    default:
      return false;
  }
}

/**
 * Apply occupation-scoped locks to premium study-tool cards on allied hubs.
 * Preserves existing `locked` (e.g. OSCE off) — stays locked if either applies.
 */
export function applyAlliedOccupationPremiumModuleLocks(
  professionKey: string | null | undefined,
  studyTools: { key: PremiumStudyToolKey; locked?: boolean }[],
): void {
  const k = normProfessionKey(professionKey);
  if (!k) return;
  for (const card of studyTools) {
    if (!shouldLockModule(k, card.key)) continue;
    card.locked = true;
  }
}

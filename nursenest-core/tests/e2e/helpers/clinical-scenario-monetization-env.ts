/**
 * Env fixtures for clinical scenario monetization E2E (see `clinical-scenario-monetization.spec.ts`).
 *
 * - `E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID` — **required** for happy-path flows: `isPremium`, ≥2 stages, `pathwayId=us-rn-nclex-rn`, APPROVED (or staff-visible draft when staff runs catalog).
 * - `E2E_CLINICAL_NP_PREMIUM_SCENARIO_ID` — NP pathway premium row for cross-tier mismatch test (RN session + this id in RN pathway URL → 404).
 * - `E2E_FREE_RN_EMAIL` / `E2E_FREE_RN_PASSWORD` — RN learner **without** subscription (optional; unpaid suite skips if unset).
 * - `E2E_STAFF_EMAIL` / `E2E_STAFF_PASSWORD` / `E2E_STAFF_USER_ID` — staff account + DB user id for signed QA cookie (`sub` must match session user id).
 */

export function getRnPremiumClinicalScenarioId(): string | null {
  const id = process.env.E2E_CLINICAL_RN_PREMIUM_SCENARIO_ID?.trim();
  return id || null;
}

export function getNpPremiumClinicalScenarioIdForCrossTier(): string | null {
  const id = process.env.E2E_CLINICAL_NP_PREMIUM_SCENARIO_ID?.trim();
  return id || null;
}

export function getFreeRnTestCredentials(): { email: string; password: string } | null {
  const email = process.env.E2E_FREE_RN_EMAIL?.trim();
  const password = process.env.E2E_FREE_RN_PASSWORD;
  if (!email || password === undefined || String(password).length === 0) return null;
  return { email, password: String(password) };
}

export function getStaffClinicalTestContext(): { email: string; password: string; userId: string } | null {
  const email = process.env.E2E_STAFF_EMAIL?.trim();
  const password = process.env.E2E_STAFF_PASSWORD;
  const userId = process.env.E2E_STAFF_USER_ID?.trim();
  if (!email || password === undefined || String(password).length === 0 || !userId) return null;
  return { email, password: String(password), userId };
}

/**
 * Subset of `/api/auth/session` user object after NurseNest `session` callback.
 * Keep optional fields tolerant — server is source of truth.
 */
export type NurseNestSessionUser = {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  country?: string;
  tier?: string;
  alliedProfessionKey?: string | null;
  /** Snapshot hint only — entitlements always re-fetched from APIs. */
  subscriptionStatus?: string;
  credentialVersion?: number;
};

export type NurseNestSession = {
  user?: NurseNestSessionUser;
  expires?: string;
};

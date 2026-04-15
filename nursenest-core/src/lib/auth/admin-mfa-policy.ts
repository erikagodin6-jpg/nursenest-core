import "server-only";

/**
 * Hook point for future staff MFA (TOTP/WebAuthn/step-up). When `NN_ADMIN_MFA_REQUIRED=1`,
 * implementations should verify a second factor before destructive admin actions.
 *
 * Not enforced by default — avoids locking out staff until MFA is wired end-to-end.
 */
export function isAdminMfaPolicyEnforced(): boolean {
  return process.env.NN_ADMIN_MFA_REQUIRED === "1" || process.env.NN_ADMIN_MFA_REQUIRED === "true";
}

/** Reserved for future: e.g. `x-nn-step-up` header or AMR claim after IdP MFA. */
export function hasAdminStepUpProof(_req: Request): boolean {
  return false;
}

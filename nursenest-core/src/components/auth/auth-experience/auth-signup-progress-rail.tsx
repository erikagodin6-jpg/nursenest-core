/**
 * Figma auth/sign-up (87:15) — onboarding progress rail (steps 1–2 active).
 */
export function AuthSignupProgressRail() {
  return (
    <div
      className="nn-premium-auth-signup-progress"
      data-nn-auth-signup-progress
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={4}
      aria-valuenow={2}
      aria-label="Account setup progress"
    >
      <span className="nn-premium-auth-signup-progress__dot is-on" aria-hidden />
      <span className="nn-premium-auth-signup-progress__dot is-on" aria-hidden />
      <span className="nn-premium-auth-signup-progress__dot" aria-hidden />
      <span className="nn-premium-auth-signup-progress__dot" aria-hidden />
    </div>
  );
}

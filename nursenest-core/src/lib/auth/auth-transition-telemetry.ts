import type { AuthTransitionLayout, AuthTransitionPresentation } from "@/lib/auth/auth-transition-types";

export type AuthTransitionTelemetryProps = Record<string, string | undefined>;

/**
 * Stable SSR-safe data attributes for auth transition shells (Playwright, analytics, QA).
 * Keeps legacy `data-nn-auth-transition*` hooks during migration.
 */
export function authTransitionTelemetryProps(
  presentation: Pick<AuthTransitionPresentation, "kind" | "tone" | "motionPreset">,
  layout: AuthTransitionLayout,
): AuthTransitionTelemetryProps {
  return {
    "data-auth-transition-kind": presentation.kind,
    "data-auth-transition-tone": presentation.tone,
    "data-auth-transition-layout": layout,
    "data-auth-transition-motion": presentation.motionPreset,
    "data-nn-auth-transition": presentation.kind,
    "data-nn-auth-transition-layout": layout,
  };
}

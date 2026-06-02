import type { ReactNode } from "react";
import { AuthExperienceShell } from "@/components/auth/auth-experience/auth-experience-shell";
import type { AuthExperienceLayout, AuthExperienceShellVariant } from "@/components/auth/auth-experience/auth-experience-types";

export { AUTH_EDUCATIONAL_DISCLAIMER } from "@/components/auth/auth-experience/constants";

export type PremiumAuthShellProps = {
  variant: AuthExperienceShellVariant;
  /** Override the layout — defaults to the mode-derived layout if omitted. */
  layout?: AuthExperienceLayout;
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  termsHref: string;
  privacyHref: string;
  contactHref: string;
  stateSurface?: ReactNode;
  pathwayRail?: ReactNode;
  visualPanel?: ReactNode;
  mobileEyebrow?: string;
};

/** @deprecated Prefer AuthExperienceShell — retained for existing imports. */
export function PremiumAuthShell(props: PremiumAuthShellProps) {
  return <AuthExperienceShell {...props} />;
}

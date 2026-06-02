"use client";

import { Suspense, useState } from "react";
import { AuthSignupPathwayPanel } from "@/components/auth/auth-experience/auth-signup-pathway-panel";
import { AuthExperienceShell } from "@/components/auth/auth-experience/auth-experience-shell";
import { AuthStateSurface } from "@/components/auth/auth-experience/auth-state-surface";
import { SignupForm } from "@/components/auth/signup-form";
import type { SignupTierValue } from "@/lib/marketing/signup-exam-focus-options";

export type SignupExperienceClientProps = {
  title: string;
  subtitle: string;
  termsHref: string;
  privacyHref: string;
  contactHref: string;
  forgotPasswordHref: string;
  mobileEyebrow?: string;
};

/**
 * Figma 87:15 — shared pathway state between aspirational panel and signup form.
 */
export function SignupExperienceClient({
  title,
  subtitle,
  termsHref,
  privacyHref,
  contactHref,
  forgotPasswordHref,
  mobileEyebrow = "NurseNest · Sea Glass",
}: SignupExperienceClientProps) {
  const [tier, setTier] = useState<SignupTierValue>("RN");

  return (
    <AuthExperienceShell
      mode="signup"
      layout="signup-aspirational"
      theme="blossom"
      state="default"
      title={title}
      subtitle={subtitle}
      termsHref={termsHref}
      privacyHref={privacyHref}
      contactHref={contactHref}
      mobileEyebrow={mobileEyebrow}
      stateSurface={
        <Suspense>
          <AuthStateSurface />
        </Suspense>
      }
      visualPanel={<AuthSignupPathwayPanel tier={tier} onTierSelect={setTier} />}
    >
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-xl bg-muted/40" aria-hidden />}>
        <SignupForm
          tier={tier}
          onTierChange={setTier}
          termsHref={termsHref}
          privacyHref={privacyHref}
          contactHref={contactHref}
          forgotPasswordHref={forgotPasswordHref}
        />
      </Suspense>
    </AuthExperienceShell>
  );
}

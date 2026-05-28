"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { TrialOnboardingFlow } from "@/components/onboarding/trial-onboarding-flow";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import { PH } from "@/lib/observability/posthog-conversion-events";

export function OnboardingPageClient({
  userId,
  accountCountry,
  resumeAfterOnboarding,
}: {
  userId: string;
  accountCountry: string;
  resumeAfterOnboarding?: string | null;
}) {
  const router = useRouter();
  const resumeTrackedRef = useRef(false);
  const afterOnboarding =
    resumeAfterOnboarding && resumeAfterOnboarding.startsWith("/")
      ? resumeAfterOnboarding
      : "/app/start-studying";

  useEffect(() => {
    router.prefetch(afterOnboarding);
  }, [router, afterOnboarding]);

  const handleComplete = (destination?: string) => {
    if (!resumeTrackedRef.current) {
      resumeTrackedRef.current = true;
      trackProductEvent(PH.onboardingResumeSuccess, {
        actor: "learner",
        has_custom_resume: Boolean(resumeAfterOnboarding),
      });
    }
    try {
      router.replace(destination && destination.startsWith("/") ? destination : afterOnboarding);
    } catch {
      trackProductEvent(PH.onboardingResumeFailure, { actor: "learner" });
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <p
          className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
          style={{
            background: "color-mix(in srgb, var(--theme-primary) 10%, var(--semantic-surface))",
            border: "1px solid color-mix(in srgb, var(--theme-primary) 22%, var(--semantic-border-soft))",
            color: "var(--semantic-text-muted)",
          }}
        >
          Welcome to NurseNest
        </p>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--semantic-text-primary)" }}>
          Let's set up your study system
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--semantic-text-muted)" }}>
          Takes less than a minute
        </p>
      </div>

      <TrialOnboardingFlow
        userId={userId}
        accountCountry={accountCountry}
        onComplete={handleComplete}
      />
    </div>
  );
}

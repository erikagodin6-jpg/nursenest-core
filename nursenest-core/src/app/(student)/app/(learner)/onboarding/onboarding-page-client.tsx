"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrialOnboardingFlow } from "@/components/onboarding/trial-onboarding-flow";

export function OnboardingPageClient({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/app/start-studying");
  }, [router]);

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
        onComplete={() => router.replace("/app/start-studying")}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type ProgressApi = { authenticated: boolean };

export function PreNursingAccountCapture({
  sourceSurface,
}: {
  sourceSurface: "hub" | "module" | "study_plan";
}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/learner/pre-nursing-progress", { method: "GET" });
        if (!res.ok) {
          setSignedIn(false);
          return;
        }
        const data = (await res.json()) as ProgressApi;
        setSignedIn(data.authenticated === true);
      } catch {
        setSignedIn(false);
      }
    })();
  }, []);

  if (signedIn === true) {
    return (
      <section className="nn-card mt-6 p-5">
        <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Personalize your pathway</h3>
        <p className="mt-2 text-sm text-muted">
          Your progress can sync across devices. Add your likely RN, LPN / LVN, RPN, or NP direction to sharpen recommendations while
          keeping Pre-Nursing free.
        </p>
        <Link href="/pre-nursing/study-plan" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Update personalization
        </Link>
      </section>
    );
  }

  return (
    <section className="nn-card mt-6 p-5">
      <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Save your progress across devices</h3>
      <p className="mt-2 text-sm text-muted">
        Guest access stays fully free. Create a free account to keep module completion and study preferences synced on every
        device. No paid subscription is required for Pre-Nursing.
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline"
          onClick={() =>
            trackClientEvent(PH.preNursingSignupCtaClicked, {
              source_surface: sourceSurface,
              cta_type: "save_progress",
            })
          }
        >
          Create free account
        </Link>
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
          onClick={() =>
            trackClientEvent(PH.preNursingSigninCtaClicked, {
              source_surface: sourceSurface,
              cta_type: "save_progress",
            })
          }
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}


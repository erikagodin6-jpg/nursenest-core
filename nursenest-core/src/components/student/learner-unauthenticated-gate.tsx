"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { buildLearnerResumePathFromParts } from "@/lib/auth/auth-flow-governance";

export function LearnerUnauthenticatedGate() {
  const pathname = usePathname() ?? "/app";
  const searchParams = useSearchParams();
  const resume = buildLearnerResumePathFromParts(pathname, searchParams.toString() ? `?${searchParams.toString()}` : "", "");

  return (
    <>
      <SiteHeader />
      <div data-nn-learner-auth-gate className="mx-auto w-full max-w-6xl px-6 py-8">
        <p className="text-sm text-[var(--theme-muted-text)]">
          We are checking your learner session.{" "}
          <Link className="font-medium text-primary underline" href={resume || "/app"}>
            Return to NurseNest
          </Link>
          {" "}if this does not refresh.
        </p>
      </div>
    </>
  );
}

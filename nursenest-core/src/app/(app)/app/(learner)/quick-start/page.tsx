import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { QuickStartFlowClient } from "./quick-start-flow-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quick Start Assessment",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ diagnostic?: string }> };

const QUICK_START_DB_TIMEOUT_MS = 1500;

export default async function QuickStartPage({ searchParams }: Props) {
  const sp = await searchParams;
  const diagnostic = sp.diagnostic === "1" || sp.diagnostic === "true";

  const session = await getProtectedRouteSession("(student).app.(learner).quick-start");
  const userId = (session?.user as { id?: string })?.id;

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect(loginWithCallback("/app/quick-start"));
  }

  const user = await withDatabaseFallbackTimeout(
    () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          baselineAssessmentCompletedAt: true,
          baselineAssessmentSummary: true,
        },
      }),
    null,
    QUICK_START_DB_TIMEOUT_MS,
    { scope: "quick_start", label: "baseline_user" },
  );

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
          <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">Quick Start Assessment</h1>
          <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
            Quick Start is temporarily unavailable while your learner profile reloads. Open your dashboard or try again shortly.
          </p>
          <p className="mt-4 text-sm">
            <Link className="font-medium text-primary underline" href="/app">
              Back to dashboard
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (user?.baselineAssessmentCompletedAt) {
    redirect("/app/start-studying");
  }

  if (!diagnostic) {
    redirect("/app/start-studying");
  }

  return <QuickStartFlowClient />;
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { QuickStartFlowClient } from "./quick-start-flow-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quick Start Assessment",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ diagnostic?: string }> };

export default async function QuickStartPage({ searchParams }: Props) {
  const sp = await searchParams;
  const diagnostic = sp.diagnostic === "1" || sp.diagnostic === "true";

  const session = await getProtectedRouteSession("(student).app.(learner).quick-start");
  const userId = (session?.user as { id?: string })?.id;

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect(loginWithCallback("/app/quick-start"));
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      baselineAssessmentCompletedAt: true,
      baselineAssessmentSummary: true,
    },
  });

  if (user?.baselineAssessmentCompletedAt) {
    redirect("/app/start-studying");
  }

  if (!diagnostic) {
    redirect("/app/start-studying");
  }

  return <QuickStartFlowClient />;
}

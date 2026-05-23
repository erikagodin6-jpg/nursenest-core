import { redirect } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { OnboardingPageClient } from "./onboarding-page-client";

export const metadata = {
  title: "Get Started — NurseNest",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const sp = await searchParams;
  const resumeAfterOnboarding =
    typeof sp.callbackUrl === "string" && sp.callbackUrl.startsWith("/") ? sp.callbackUrl : null;
  const session = await getProtectedRouteSession("(student).app.(learner).onboarding");
  const userId = (session?.user as { id?: string })?.id;

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect("/login?callbackUrl=/app/onboarding");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true, country: true },
  });

  if (!user) {
    redirect("/login?callbackUrl=/app/onboarding");
  }

  if (user.onboardingCompletedAt) {
    redirect("/app/start-studying");
  }

  return (
    <OnboardingPageClient
      userId={userId}
      accountCountry={user.country}
      resumeAfterOnboarding={resumeAfterOnboarding}
    />
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { OnboardingPageClient } from "./onboarding-page-client";

export const metadata = {
  title: "Get Started — NurseNest",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;

  if (!userId || !isDatabaseUrlConfigured()) {
    redirect("/login?callbackUrl=/app/onboarding");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true },
  });

  if (user?.onboardingCompletedAt) {
    redirect("/app");
  }

  return <OnboardingPageClient userId={userId} />;
}

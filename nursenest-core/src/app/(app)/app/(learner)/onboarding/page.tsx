import { redirect } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
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

  if (!userId) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        We are checking your learner session. Refresh this page if onboarding does not load.
      </div>
    );
  }

  if (!isDatabaseUrlConfigured()) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        Onboarding is temporarily unavailable. Please try again shortly.
      </div>
    );
  }

  const user = await loadLearnerRequestUser(userId);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
        We could not load your learner profile. Please refresh this page.
      </div>
    );
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

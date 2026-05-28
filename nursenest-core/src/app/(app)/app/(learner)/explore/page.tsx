import type { Metadata } from "next";
import { ClinicalReadinessHub } from "@/components/discovery/clinical-readiness-discovery";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type PageProps = {
  searchParams: Promise<{ pathwayId?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Explore NurseNest | Clinical Readiness Hub",
      description: "Discover NurseNest simulations, telemetry tools, adaptive remediation, readiness analytics, and retention-focused learning experiences.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/explore", routeGroup: "student.learner.explore" },
  );
}

function readQueryPathway(raw: string | string[] | undefined): string | null {
  if (typeof raw === "string" && raw.trim().length > 2) return raw.trim();
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].trim().length > 2) return raw[0].trim();
  return null;
}

export default async function ExploreNurseNestPage({ searchParams }: PageProps) {
  const session = await getProtectedRouteSession("(student).app.(learner).explore");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="nn-card rounded-2xl border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
          Explore NurseNest is temporarily unavailable while we verify your access. Please refresh or try again shortly.
        </div>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            Explore NurseNest
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            Clinical readiness simulations and advanced interactive learning tools are part of the premium NurseNest experience.
          </p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const sp = await searchParams;
  return <ClinicalReadinessHub pathwayId={readQueryPathway(sp.pathwayId)} />;
}

import type { Metadata } from "next";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PharmacologyHubClient } from "@/components/pharmacology/pharmacology-hub-client";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const DEFAULT_PHARMACOLOGY_PATHWAY_ID = "ca-rn-nclex-rn";
const PHARMACOLOGY_PATHWAY_BOOTSTRAP_DB_TIMEOUT_MS = 650;

type PageProps = {
  searchParams: Promise<{ pathwayId?: string | string[] }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Pharmacology Practice | NurseNest",
      description: "Adaptive nursing pharmacology flashcards, lessons, medication safety review, and NCLEX-style medication reasoning.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/pharmacology", routeGroup: "student.learner.pharmacology" },
  );
}

function readQueryPathway(raw: string | string[] | undefined): string | null {
  if (typeof raw === "string" && raw.trim().length > 2) return raw.trim();
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].trim().length > 2) return raw[0].trim();
  return null;
}

export default async function PharmacologyPage({ searchParams }: PageProps) {
  const session = await getProtectedRouteSession("(student).app.(learner).pharmacology");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="nn-card rounded-2xl border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 text-sm leading-relaxed text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]">
          Pharmacology Practice is temporarily unavailable while we verify your access. Please refresh or try again shortly.
        </div>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.75rem]">
            Pharmacology Practice
          </h1>
          <p className="mt-2.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:mt-3">
            Medication safety mastery is part of the premium NurseNest study experience.
          </p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const sp = await searchParams;
  const requestedPathwayId = readQueryPathway(sp.pathwayId);
  let pathwayId = requestedPathwayId ?? DEFAULT_PHARMACOLOGY_PATHWAY_ID;

  if (userId && isDatabaseUrlConfigured()) {
    const [compatible, user] = await Promise.all([
      listPathwaysCompatibleWithSubscription(entitlement).catch(() => []),
      withDatabaseFallbackTimeout(
        () => prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } }),
        null,
        PHARMACOLOGY_PATHWAY_BOOTSTRAP_DB_TIMEOUT_MS,
        { scope: "pharmacology_page", label: "learner_path" },
      ),
    ]);
    const compatibleIds = new Set(compatible.map((pathway) => pathway.id));
    const learnerPath = user?.learnerPath?.trim();
    if (requestedPathwayId && compatibleIds.has(requestedPathwayId)) pathwayId = requestedPathwayId;
    else if (learnerPath && compatibleIds.has(learnerPath)) pathwayId = learnerPath;
    else if (compatible[0]?.id) pathwayId = compatible[0].id;
  }

  const pathway = getExamPathwayById(pathwayId);
  const pathwayDisplayName = pathway?.displayName ?? pathway?.shortName ?? "Nursing";

  return <PharmacologyHubClient pathwayId={pathwayId} pathwayDisplayName={pathwayDisplayName} />;
}

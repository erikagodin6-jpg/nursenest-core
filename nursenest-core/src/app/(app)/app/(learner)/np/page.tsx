import type { Metadata } from "next";
import { cookies } from "next/headers";
import { NpCertificationSelector } from "@/components/np/np-certification-selector";
import { LearnerDashboardPageShell } from "@/components/student/learner-dashboard-page-shell";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { listNpCertificationPathways } from "@/lib/np/np-certification-pathways";
import { selectedNpCertificationPathwayIdFromCookieStore } from "@/lib/np/np-certification-selection";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "NP Certification Pathway | NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/np", routeGroup: "student.learner.np_certification" },
  );
}

export default async function NpCertificationPathwayPage({
  searchParams,
}: {
  searchParams?: Promise<{ returnTo?: string | string[] }>;
}) {
  await getProtectedRouteSession("(student).app.(learner).np");
  const { t } = await getLearnerMarketingBundle();
  const params = (await searchParams) ?? {};
  const rawReturnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const returnTo = rawReturnTo?.startsWith("/app") ? rawReturnTo : "/app";
  const cookieStore = await cookies();
  const selectedPathwayId = selectedNpCertificationPathwayIdFromCookieStore(cookieStore);

  return (
    <LearnerDashboardPageShell t={t} heroHeading="NP Certification Pathway">
      <NpCertificationSelector
        pathways={listNpCertificationPathways()}
        selectedPathwayId={selectedPathwayId}
        returnTo={returnTo}
      />
    </LearnerDashboardPageShell>
  );
}

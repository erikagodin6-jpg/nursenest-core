import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import { AlliedHealthSubdomainHomepage } from "@/components/marketing/allied-health-subdomain-homepage";
import { AlliedMarketingPathwayMissing } from "@/components/marketing/allied-marketing-pathway-missing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { getCanonicalAlliedPathway, ALLIED_GLOBAL_HUB_PATH, buildAlliedGlobalHubPath } from "@/lib/allied/allied-global-pathway";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  fallbackAlliedPathwayHubOverview,
  loadAlliedPathwayHubOverview,
} from "@/lib/marketing/allied-pathway-hub-overview";
import {
  parseMeasurementPreference,
  readMeasurementPreferenceFromCookieStore,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { resolveMarketingHubEcgModulePublic } from "@/lib/ecg-module/ecg-marketing-hub-surface.server";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingTierHubStudyActionHref } from "@/lib/navigation/marketing-tier-hub-study-hrefs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const pathway = getCanonicalAlliedPathway();
      if (!pathway) return {};
      return {
        title: "Allied Health Exam Prep | NurseNest",
        description: "Profession-specific allied health exam prep with lessons, flashcards, practice questions, and certification-focused study pathways.",
        alternates: { canonical: absoluteUrl(ALLIED_GLOBAL_HUB_PATH) },
        openGraph: {
          title: "Allied Health Exam Prep | NurseNest",
          description: "Profession-specific allied health exam prep with lessons, flashcards, practice questions, and certification-focused study pathways.",
          url: absoluteUrl(ALLIED_GLOBAL_HUB_PATH),
          type: "website",
        },
      };
    },
    { pathname: ALLIED_GLOBAL_HUB_PATH, routeGroup: "marketing.default.allied.global_hub" },
  );
}

export default async function GlobalAlliedHealthHubPage() {
  const pathway = getCanonicalAlliedPathway();
  if (!pathway) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AlliedMarketingPathwayMissing pathname={ALLIED_GLOBAL_HUB_PATH} />
      </div>
    );
  }

  let alliedInitialMeasurement: MeasurementPreference | null = null;
  let alliedMeasurementSync = false;
  try {
    const fromCookie = readMeasurementPreferenceFromCookieStore(await cookies());
    if (fromCookie) alliedInitialMeasurement = fromCookie;
  } catch {
    // ignore
  }
  try {
    const session = await getOptionalPublicSession({
      pathname: ALLIED_GLOBAL_HUB_PATH,
      surface: "marketing.default.allied.global_hub",
    });
    const userId = (session?.user as { id?: string } | undefined)?.id ?? "";
    if (userId && isDatabaseUrlConfigured()) {
      alliedMeasurementSync = true;
      const row = await prisma.user.findUnique({
        where: { id: userId },
        select: { measurementPreference: true },
      });
      const fromDb = parseMeasurementPreference(row?.measurementPreference ?? null);
      if (fromDb) alliedInitialMeasurement = fromDb;
    }
  } catch {
    // ignore
  }

  let overview;
  try {
    overview = await loadAlliedPathwayHubOverview(pathway, {
      pathname: ALLIED_GLOBAL_HUB_PATH,
      locale: "en",
      examCode: "allied-health",
      roleTrack: "allied",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    safeServerLog("exam_pathway_hub", "allied_hub_overview_failed", {
      pathname: ALLIED_GLOBAL_HUB_PATH,
      pathway_id: pathway.id,
      error_message: message.slice(0, 500),
    });
    overview = fallbackAlliedPathwayHubOverview();
  }

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Allied Health", href: ALLIED_GLOBAL_HUB_PATH },
  ];
  const schemaItems = crumbs.map((item) => ({ name: item.name, item: absoluteUrl(item.href) }));
  const ecgModulePublicForHub = await resolveMarketingHubEcgModulePublic();

  const lessonsHref = buildAlliedGlobalHubPath("lessons");
  const questionsHref = buildAlliedGlobalHubPath("questions");
  const flashcardsHref = marketingTierHubStudyActionHref(pathway, "flashcards");
  const pricingHref = buildExamPathwayPath(pathway, "pricing");

  return (
    <div className="nn-marketing-surface mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <WebPageJsonLd
        title="Allied Health Exam Prep | NurseNest"
        description="Profession-specific allied health exam prep with lessons, flashcards, practice questions, and certification-focused study pathways."
        path={ALLIED_GLOBAL_HUB_PATH}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />

      <AlliedHealthSubdomainHomepage
        pathway={pathway}
        overview={overview}
        pricingHref={pricingHref}
        lessonsHref={lessonsHref}
        questionsHref={questionsHref}
        flashcardsHref={flashcardsHref}
      />

      <div className="mt-16">
        <AlliedHealthPathwayHub
          pathway={pathway}
          hubPath={ALLIED_GLOBAL_HUB_PATH}
          overview={overview}
          initialMeasurementPreference={alliedInitialMeasurement}
          syncMeasurementPreferenceToProfile={alliedMeasurementSync}
          ecgModulePublic={ecgModulePublicForHub}
        />
      </div>
    </div>
  );
}

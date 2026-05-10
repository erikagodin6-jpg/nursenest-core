import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import { AlliedMarketingPathwayMissing } from "@/components/marketing/allied-marketing-pathway-missing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { getCanonicalAlliedPathway, ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";
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

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const pathway = getCanonicalAlliedPathway();
      if (!pathway) return {};
      return {
        title: "Allied Health | NurseNest",
        description: "Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching.",
        alternates: { canonical: absoluteUrl(ALLIED_GLOBAL_HUB_PATH) },
        openGraph: {
          title: "Allied Health | NurseNest",
          description: "Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching.",
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

  if (process.env.VITEST === "true" || process.env.NODE_ENV !== "production") {
    safeServerLog("exam_pathway_hub", "allied_hub_route_diagnostic", {
      pathname: ALLIED_GLOBAL_HUB_PATH,
      country: "global",
      role_track: "allied",
      pathway_id: pathway.id,
      exam_slug: "allied-health",
      loader_result: JSON.stringify({
        lessonCount: overview.lessonCount,
        questionSnapshotStatus: overview.questionSnapshot.status,
        flashcardDeckCount: overview.flashcardDeckCount,
        moduleCardCount: overview.moduleCards.length,
      }),
    });
  }

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Allied Health", href: ALLIED_GLOBAL_HUB_PATH },
  ];
  const schemaItems = crumbs.map((item) => ({ name: item.name, item: absoluteUrl(item.href) }));
  const ecgModulePublicForHub = await resolveMarketingHubEcgModulePublic();

  return (
    <div className="nn-marketing-surface mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <WebPageJsonLd
        title="Allied Health | NurseNest"
        description="Global Allied Health pathway with occupation-based study routes, paid/free study entry points, and unit switching."
        path={ALLIED_GLOBAL_HUB_PATH}
      />
      <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
      <AlliedHealthPathwayHub
        pathway={pathway}
        hubPath={ALLIED_GLOBAL_HUB_PATH}
        overview={overview}
        initialMeasurementPreference={alliedInitialMeasurement}
        syncMeasurementPreferenceToProfile={alliedMeasurementSync}
        ecgModulePublic={ecgModulePublicForHub}
      />
    </div>
  );
}

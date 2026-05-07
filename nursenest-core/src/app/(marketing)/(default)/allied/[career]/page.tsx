import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AlliedHealthPathwayHub } from "@/components/marketing/allied-health-pathway-hub";
import { AlliedMarketingPathwayMissing } from "@/components/marketing/allied-marketing-pathway-missing";
import { BreadcrumbBar } from "@/components/seo/breadcrumb-bar";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getOptionalPublicSession } from "@/lib/auth/optional-public-session";
import { ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-pathway";
import {
  ALLIED_HUB_CATEGORY_META,
  getPathwayOrThrow,
  resolveAlliedProfessionFromRouteSlug,
} from "@/lib/allied/allied-professions-registry";
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
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const revalidate = 86400;
export const dynamicParams = true;

type Props = { params: Promise<{ career: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { career } = await params;
  return safeGenerateMetadata(
    async () => {
      const prof = resolveAlliedProfessionFromRouteSlug(career);
      if (!prof) return { title: "Not found" };
      const path = `/allied/${prof.professionKey}`;
      return {
        title: `${prof.h1} | Allied Health | NurseNest`,
        description: prof.description,
        alternates: { canonical: absoluteUrl(path) },
        openGraph: {
          title: prof.h1,
          description: prof.description,
          url: absoluteUrl(path),
          type: "website",
        },
      };
    },
    { pathname: `/allied/${career}`, routeGroup: "marketing.default.allied.career" },
  );
}

export default async function AlliedCareerHubPage({ params }: Props) {
  const { career } = await params;
  const prof = resolveAlliedProfessionFromRouteSlug(career);
  if (!prof) notFound();

  const hubPath = `/allied/${prof.professionKey}`;
  const pathway = getPathwayOrThrow(prof.pathwayId);
  if (!pathway) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <AlliedMarketingPathwayMissing pathname={hubPath} />
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
      pathname: hubPath,
      surface: "marketing.default.allied.career",
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
      pathname: hubPath,
      locale: "en",
      examCode: "allied-health",
      roleTrack: "allied",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    safeServerLog("exam_pathway_hub", "allied_hub_overview_failed", {
      pathname: hubPath,
      pathway_id: pathway.id,
      error_message: message.slice(0, 500),
    });
    overview = fallbackAlliedPathwayHubOverview();
  }

  let sampleStem: string | null = null;
  if (isDatabaseUrlConfigured()) {
    try {
      const row = await prisma.examQuestion.findFirst({
        where: {
          status: "published",
          careerType: "allied",
          exam: "ALLIED",
        },
        select: { stem: true },
      });
      sampleStem = row?.stem ? row.stem.slice(0, 280) + (row.stem.length > 280 ? "…" : "") : null;
    } catch {
      sampleStem = null;
    }
  }

  const categoryMeta = ALLIED_HUB_CATEGORY_META[prof.hubCategory] ?? ALLIED_HUB_CATEGORY_META.clinical;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Allied Health", href: ALLIED_GLOBAL_HUB_PATH },
    { name: prof.h1, href: undefined },
  ];
  const schemaItems = [
    { name: "Home", item: absoluteUrl("/") },
    { name: "Allied Health", item: absoluteUrl(ALLIED_GLOBAL_HUB_PATH) },
    { name: prof.h1, item: absoluteUrl(hubPath) },
  ];

  return (
    <div className="nn-marketing-surface">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <WebPageJsonLd title={prof.title} description={prof.description} path={hubPath} />
        <BreadcrumbBar crumbs={crumbs} schemaItems={schemaItems} />
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--semantic-brand)]">
          Allied Health · {categoryMeta.label}
        </p>
        <AlliedHealthPathwayHub
          pathway={pathway}
          hubPath={hubPath}
          profession={prof}
          sampleQuestionStem={sampleStem}
          overview={overview}
          initialMeasurementPreference={alliedInitialMeasurement}
          syncMeasurementPreferenceToProfile={alliedMeasurementSync}
        />
      </div>
    </div>
  );
}

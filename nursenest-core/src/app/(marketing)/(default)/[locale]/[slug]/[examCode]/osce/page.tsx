import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OscePrepSurfaceClient } from "@/components/scenarios/osce-prep-surface-client";
import { OsceScenariosDevGate } from "@/components/scenarios/osce-scenarios-dev-gate";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { getOsceHubListItemsResolved } from "@/lib/scenarios/osce-stations-resolve.server";
import { resolveOsceScenarioRouteAccessMode } from "@/lib/scenarios/scenario-access";
import { osceScenariosRobotsMetadata } from "@/lib/scenarios/scenario-seo-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/osce`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway || pathway.roleTrack === "allied") {
        return { robots: osceScenariosRobotsMetadata() };
      }
      const canonicalPath = buildExamPathwayPath(pathway, "osce");
      const title = `OSCE prep · ${pathway.displayName} | NurseNest`;
      const description = `Structured OSCE prep for ${pathway.shortName} — station library ships progressively.`;
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        robots: osceScenariosRobotsMetadata(),
        openGraph: { title, description, url: absoluteUrl(canonicalPath), type: "website" },
      };
    },
    { pathname, locale, routeGroup: "marketing.exam_hub.osce" },
  );
}

export default async function MarketingOscePage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/osce`;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();
  if (pathway.roleTrack === "allied") notFound();
  const mode = resolveOsceScenarioRouteAccessMode();
  if (mode === "production_blocked") notFound();
  if (mode === "dev_preview") {
    return <OsceScenariosDevGate surface="osce" pathwayId={pathway.id} />;
  }
  const showDevSamples = process.env.NODE_ENV !== "production" && isOsceScenariosPubliclyEnabled();
  const legacyListItems = isOsceScenariosPubliclyEnabled()
    ? (await getOsceHubListItemsResolved()).items
    : [];
  const stationDetailHrefPrefix = `/${locale}/${slug}/${examCode}/osce/`;
  return (
    <OscePrepSurfaceClient
      pathwayId={pathway.id}
      showDevSamples={showDevSamples}
      legacyListItems={legacyListItems}
      stationDetailHrefPrefix={stationDetailHrefPrefix}
      appendPathwayQueryOnDetailLinks={false}
    />
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OscePrepSurfaceClient } from "@/components/scenarios/osce-prep-surface-client";
import { OsceScenariosDevGate } from "@/components/scenarios/osce-scenarios-dev-gate";
import { isOsceScenariosPubliclyEnabled } from "@/lib/scenarios/osce-scenarios-feature-flag";
import { getOsceHubListItemsResolved } from "@/lib/scenarios/osce-stations-resolve.server";
import { resolveOsceScenarioRouteAccessMode } from "@/lib/scenarios/scenario-access";
import { pathwayIdFromScenarioSearchParams } from "@/lib/scenarios/scenario-search-params";
import { osceScenariosRobotsMetadata } from "@/lib/scenarios/scenario-seo-metadata";

type PageProps = { searchParams: Promise<{ pathwayId?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "OSCE prep · NurseNest",
    robots: osceScenariosRobotsMetadata(),
  };
}

export default async function OscePrepPage({ searchParams }: PageProps) {
  const mode = resolveOsceScenarioRouteAccessMode();
  if (mode === "production_blocked") notFound();
  const pathwayId = await pathwayIdFromScenarioSearchParams(searchParams);
  if (mode === "dev_preview") {
    return <OsceScenariosDevGate surface="osce" pathwayId={pathwayId} />;
  }
  const showDevSamples = process.env.NODE_ENV !== "production" && isOsceScenariosPubliclyEnabled();
  const legacyListItems = isOsceScenariosPubliclyEnabled()
    ? (await getOsceHubListItemsResolved()).items
    : [];
  return (
    <OscePrepSurfaceClient
      pathwayId={pathwayId}
      showDevSamples={showDevSamples}
      legacyListItems={legacyListItems}
      stationDetailHrefPrefix="/app/osce/"
      appendPathwayQueryOnDetailLinks
    />
  );
}

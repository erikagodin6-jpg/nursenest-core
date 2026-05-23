import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OsceStationDetailBody } from "@/components/scenarios/osce-station-detail-body";
import { OsceScenariosDevGate } from "@/components/scenarios/osce-scenarios-dev-gate";
import { getOsceSkillStationResolved } from "@/lib/scenarios/osce-stations-resolve.server";
import { resolveOsceScenarioRouteAccessMode } from "@/lib/scenarios/scenario-access";
import { pathwayIdFromScenarioSearchParams } from "@/lib/scenarios/scenario-search-params";
import { SCENARIO_LEARNER_ROUTES, withScenarioPathwayQuery } from "@/lib/scenarios/scenario-routes";
import { osceScenariosRobotsMetadata } from "@/lib/scenarios/scenario-seo-metadata";

type PageProps = {
  params: Promise<{ stationId: string }>;
  searchParams: Promise<{ pathwayId?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stationId } = await params;
  const { station } = await getOsceSkillStationResolved(decodeURIComponent(stationId));
  return {
    title: station ? `${station.title} · OSCE` : "OSCE station",
    robots: osceScenariosRobotsMetadata(),
  };
}

export default async function OsceStationDetailPage({ params, searchParams }: PageProps) {
  const mode = resolveOsceScenarioRouteAccessMode();
  if (mode === "production_blocked") notFound();
  const pathwayId = await pathwayIdFromScenarioSearchParams(searchParams);
  if (mode === "dev_preview") {
    return <OsceScenariosDevGate surface="osce" pathwayId={pathwayId} />;
  }

  const { stationId: rawId } = await params;
  const { station } = await getOsceSkillStationResolved(decodeURIComponent(rawId));
  if (!station) notFound();

  const hubHref = withScenarioPathwayQuery(SCENARIO_LEARNER_ROUTES.osce, pathwayId);

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="border-b border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-4 py-3">
        <Link href={hubHref} className="text-sm font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline">
          ← Back to OSCE hub
        </Link>
      </div>
      <OsceStationDetailBody station={station} />
    </div>
  );
}

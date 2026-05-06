import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OsceStationDetailBody } from "@/components/scenarios/osce-station-detail-body";
import { OsceScenariosDevGate } from "@/components/scenarios/osce-scenarios-dev-gate";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { getOsceSkillStationResolved } from "@/lib/scenarios/osce-stations-resolve.server";
import { resolveOsceScenarioRouteAccessMode } from "@/lib/scenarios/scenario-access";
import { osceScenariosRobotsMetadata } from "@/lib/scenarios/scenario-seo-metadata";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string; stationId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode, stationId } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/osce/${stationId}`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      const { station } = await getOsceSkillStationResolved(decodeURIComponent(stationId));
      if (!pathway || pathway.roleTrack === "allied" || !station) {
        return { robots: osceScenariosRobotsMetadata() };
      }
      const canonicalPath = `${buildExamPathwayPath(pathway, "osce")}/${encodeURIComponent(station.id)}`;
      const title = `${station.title} · OSCE prep · ${pathway.displayName} | NurseNest`;
      const description = (station.description ?? station.scenarioIntro ?? station.title).slice(0, 160);
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        robots: osceScenariosRobotsMetadata(),
        openGraph: { title, description, url: absoluteUrl(canonicalPath), type: "article" },
      };
    },
    { pathname, locale, routeGroup: "marketing.exam_hub.osce_station" },
  );
}

export default async function MarketingOsceStationPage({ params }: Props) {
  const { locale, slug, examCode, stationId: rawStationId } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/osce/${rawStationId}`;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();
  if (pathway.roleTrack === "allied") notFound();
  const mode = resolveOsceScenarioRouteAccessMode();
  if (mode === "production_blocked") notFound();
  if (mode === "dev_preview") {
    return <OsceScenariosDevGate surface="osce" pathwayId={pathway.id} />;
  }

  const { station } = await getOsceSkillStationResolved(decodeURIComponent(rawStationId));
  if (!station) notFound();

  const hubPath = buildExamPathwayPath(pathway, "osce");

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="border-b border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-4 py-3">
        <Link href={hubPath} className="text-sm font-medium text-[var(--semantic-brand)] underline-offset-4 hover:underline">
          ← Back to OSCE hub
        </Link>
      </div>
      <OsceStationDetailBody station={station} />
    </div>
  );
}

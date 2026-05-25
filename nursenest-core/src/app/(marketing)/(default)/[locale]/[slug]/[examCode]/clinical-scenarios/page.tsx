import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClinicalScenariosSurfaceClient } from "@/components/scenarios/clinical-scenarios-surface-client";
import { OsceScenariosDevGate } from "@/components/scenarios/osce-scenarios-dev-gate";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";
import { clinicalScenarioMarketingPageBlocked } from "@/lib/clinical-scenarios/clinical-scenario-marketing-access";
import { clinicalScenariosRobotsMetadata } from "@/lib/clinical-scenarios/clinical-scenarios-metadata";
import { isClinicalScenariosPubliclyEnabled } from "@/lib/clinical-scenarios/clinical-scenarios-feature-flag";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

// 🧊 ISR: revalidate: 86400 already set below
export const dynamicParams = true;
export const revalidate = 86400;

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/clinical-scenarios`;
  return safeGenerateMetadata(
    async () => {
      const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
      if (!pathway || pathway.roleTrack === "allied") {
        return { robots: clinicalScenariosRobotsMetadata() };
      }
      const canonicalPath = buildExamPathwayPath(pathway, "clinical-scenarios");
      const title = `Clinical scenarios · ${pathway.displayName} | NurseNest`;
      const description = `Case-based clinical scenarios for ${pathway.shortName} — unfolding cases ship progressively.`;
      return {
        title,
        description,
        alternates: { canonical: absoluteUrl(canonicalPath) },
        robots: clinicalScenariosRobotsMetadata(),
        openGraph: { title, description, url: absoluteUrl(canonicalPath), type: "website" },
      };
    },
    { pathname, locale, routeGroup: "marketing.exam_hub.clinical_scenarios" },
  );
}

export default async function MarketingClinicalScenariosPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathname = `/${locale}/${slug}/${examCode}/clinical-scenarios`;
  const pathway = await resolveExamPathwaySafe(locale, slug, examCode, { pathname });
  if (!pathway) notFound();
  if (pathway.roleTrack === "allied") notFound();
  if (clinicalScenarioMarketingPageBlocked()) notFound();
  if (!isClinicalScenariosPubliclyEnabled()) {
    return <OsceScenariosDevGate surface="clinical_scenarios" pathwayId={pathway.id} />;
  }
  return <ClinicalScenariosSurfaceClient pathwayId={pathway.id} showDevSamples={false} />;
}

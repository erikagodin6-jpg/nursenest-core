import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParamedicScenarioPlayer } from "@/components/paramedic/scenarios/paramedic-scenario-player";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { getParamedicScenarioBySlug } from "@/lib/paramedic/scenarios/paramedic-scenario-catalog";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

const PARAMEDIC_SCENARIOS_BASE = "/allied-health/paramedic/scenarios";

function scenarioPath(slug: string): string {
  return `${PARAMEDIC_SCENARIOS_BASE}/${encodeURIComponent(slug)}`;
}

function buildBreadcrumbs(slug: string, title: string) {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Allied Health", href: "/allied-health" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: "Scenarios", href: PARAMEDIC_SCENARIOS_BASE },
    { label: title, href: scenarioPath(slug) },
  ];

  const schemaItems = crumbs.map((crumb, index) => ({
    name: crumb.label,
    item: absoluteUrl(crumb.href),
    position: index + 1,
  }));

  return { crumbs, schemaItems };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getParamedicScenarioBySlug(slug);
  if (!entry) {
    return safeGenerateMetadata(
      async () => ({
        title: "Paramedic Scenario Not Found | NurseNest",
        robots: { index: false, follow: false },
      }),
      { pathname: scenarioPath(slug), routeGroup: "marketing.paramedic.scenario" },
    );
  }

  const path = scenarioPath(slug);
  return safeGenerateMetadata(
    async () => ({
      title: entry.seo.title,
      description: entry.seo.description,
      alternates: { canonical: absoluteUrl(path) },
      openGraph: {
        title: entry.seo.title,
        description: entry.seo.description,
        url: absoluteUrl(path),
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: entry.seo.title,
        description: entry.seo.description,
      },
      keywords: entry.seo.keywords,
    }),
    { pathname: path, routeGroup: "marketing.paramedic.scenario" },
  );
}

export default async function ParamedicScenarioDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getParamedicScenarioBySlug(slug);
  if (!entry) notFound();

  const path = scenarioPath(slug);
  const { crumbs, schemaItems } = buildBreadcrumbs(slug, entry.scenario.title);

  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <WebPageJsonLd
        title={entry.seo.title}
        description={entry.seo.description}
        path={path}
      />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <ParamedicScenarioPlayer scenario={entry.scenario} />
    </>
  );
}

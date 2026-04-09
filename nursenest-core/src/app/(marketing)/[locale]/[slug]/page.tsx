import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS } from "@/lib/seo/programmatic-registry";
import { resolveProgrammaticSeoForLocale } from "@/lib/seo/resolve-programmatic-seo";

/**
 * Canonical English programmatic pages live under `/seo/[slug]`; localized URLs use this route.
 * A full locale×slug matrix at build time inflates `.next` and can hit disk limits in CI.
 * `generateStaticParams` is empty: each locale+slug is generated on first request and cached (ISR).
 */
export const dynamicParams = true;
export const revalidate = PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS;

export function generateStaticParams(): { locale: string; slug: string }[] {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = resolveProgrammaticSeoForLocale(slug, locale);
  if (!resolved) return {};
  return buildProgrammaticMetadata(resolved.page, locale);
}

export default async function ProgrammaticSeoLocaleRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const marketingRegion = await getMarketingRegionFromCookies();
  const resolved = resolveProgrammaticSeoForLocale(slug, locale);
  if (!resolved) notFound();
  return (
    <ProgrammaticSeoPage
      page={resolved.page}
      locale={locale}
      related={resolved.related}
      cross={resolved.cross}
      marketingRegion={marketingRegion}
      localizedUrl
    />
  );
}

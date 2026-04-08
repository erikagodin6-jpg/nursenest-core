import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { resolveProgrammaticSeoForLocale } from "@/lib/seo/resolve-programmatic-seo";

/**
 * English canonical programmatic URLs are fully prerendered at build under `/seo/[slug]`.
 * A full locale×slug matrix here (~19 locales × ~23 slugs) dominated `.next` artifact size and
 * contributed to ENOSPC in disk-limited CI. Non-default locales are generated on first request
 * and cached (ISR); URLs and metadata are unchanged, only build-time static output is reduced.
 */
export const dynamicParams = true;
export const revalidate = 86400;

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

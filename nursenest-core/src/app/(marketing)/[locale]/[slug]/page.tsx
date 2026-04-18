import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { resolveProgrammaticSeoForLocale } from "@/lib/seo/resolve-programmatic-seo";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

/**
 * Canonical English programmatic pages live under `/seo/[slug]`; localized URLs use this route.
 * `generateStaticParams` is empty: each locale+slug is generated on first request and cached (ISR).
 */
export const dynamicParams = true;
/** Keep in sync with `PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS` — literal required for Next segment config parsing. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return safeGenerateMetadata(
    async () => {
      const resolved = resolveProgrammaticSeoForLocale(slug, locale);
      if (!resolved) return {};
      return buildProgrammaticMetadata(resolved.page, locale);
    },
    { pathname: `/${locale}/${slug}`, locale, routeGroup: "marketing.locale.programmatic_seo" },
  );
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgrammaticSeoPage } from "@/components/seo/programmatic-seo-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { buildProgrammaticMetadata } from "@/lib/seo/programmatic-metadata";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { resolveProgrammaticSeoForLocale } from "@/lib/seo/resolve-programmatic-seo";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

/** Build-time prerender disabled: full slug list inflates `.next` on disk-limited hosts; pages are ISR on demand. */
export const dynamicParams = true;
/** Keep in sync with `PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS` — literal required for Next segment config parsing. */
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/seo/${slug}`;
  return safeGenerateMetadata(
    async () => {
      const resolved = resolveProgrammaticSeoForLocale(slug, DEFAULT_MARKETING_LOCALE);
      if (!resolved) return {};
      return buildProgrammaticMetadata(resolved.page, DEFAULT_MARKETING_LOCALE);
    },
    { pathname, routeGroup: "marketing.default.programmatic_seo" },
  );
}

export default async function ProgrammaticSeoRewriteTarget({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getMarketingLocaleForDefaultRoute();
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
    />
  );
}

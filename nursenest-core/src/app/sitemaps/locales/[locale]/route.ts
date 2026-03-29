import {
  DEFAULT_MARKETING_LOCALE,
  isMarketingLocaleCode,
} from "@/lib/i18n/marketing-locale-policy";
import { buildLocaleSitemapXml, minimalUrlsetSingleHome } from "@/lib/seo/sitemap-static-xml";
import { sitemapXmlResponse } from "@/lib/seo/sitemap-xml-http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  try {
    const { locale } = await context.params;
    if (!locale || !isMarketingLocaleCode(locale) || locale === DEFAULT_MARKETING_LOCALE) {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    const xml = buildLocaleSitemapXml(locale);
    if (!xml || typeof xml !== "string" || xml.length < 50) {
      return sitemapXmlResponse(minimalUrlsetSingleHome());
    }
    return sitemapXmlResponse(xml);
  } catch {
    return sitemapXmlResponse(minimalUrlsetSingleHome());
  }
}

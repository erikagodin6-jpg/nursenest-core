import { isLocaleSitemapIncluded } from "@/lib/i18n/language-readiness";
import { absoluteLanguageUrl } from "@/lib/i18n/language-subdomains";
import { collectCoreUrls, normalizeOrigin } from "@/lib/seo/sitemap-static-xml";
import { buildSitemapUrlsetFromAbsoluteUrls, type SitemapUrlEntry } from "@/lib/seo/sitemap-urlset-build";

export function buildEmptySitemapUrlsetXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
`;
}

export async function buildLanguageSitemapXml(locale: string): Promise<string> {
  if (locale !== "en" && !isLocaleSitemapIncluded(locale)) {
    return buildEmptySitemapUrlsetXml();
  }

  if (locale === "en") {
    const urls = await collectCoreUrls("https://nursenest.ca", {
      productionSafeStatic: true,
      omitLocalizedMarketingUrls: true,
      omitPathwayLessonSeoUrls: true,
      omitExamPathwayAndTopicProgrammaticUrls: true,
    });
    const unique = [...new Set(urls.map((url) => normalizeOrigin(url)))].map((loc): SitemapUrlEntry => ({ loc }));
    return buildSitemapUrlsetFromAbsoluteUrls(unique);
  }

  const urls = [
    absoluteLanguageUrl(locale, "/"),
    absoluteLanguageUrl(locale, "/pricing"),
    absoluteLanguageUrl(locale, "/lessons"),
    absoluteLanguageUrl(locale, "/question-bank"),
    absoluteLanguageUrl(locale, "/practice-exams"),
  ];
  return buildSitemapUrlsetFromAbsoluteUrls(urls.map((loc) => ({ loc })));
}

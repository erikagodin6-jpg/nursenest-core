import { buildLanguageSitemapXml } from "@/lib/seo/language-sitemap-xml";
import { etagForXml, xmlResponseHeaders } from "@/lib/seo/sitemap-response-cache";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const xml = await buildLanguageSitemapXml("zh-tw");
  return new Response(xml, { headers: xmlResponseHeaders(etagForXml(xml)) });
}


import "server-only";

import { buildPublicResponseEtag } from "@/lib/http/public-response-cache";
import { SITEMAP_XML_HEADERS } from "@/lib/seo/sitemap-xml-http";

export function etagForXml(xml: string): string {
  return buildPublicResponseEtag(xml);
}

export function xmlResponseHeaders(etag: string): Headers {
  const headers = new Headers(SITEMAP_XML_HEADERS);
  headers.set("ETag", etag);
  return headers;
}

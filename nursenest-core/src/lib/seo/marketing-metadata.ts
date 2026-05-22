import type { Metadata } from "next";
import { normalizeMarketingPageTitle } from "@/lib/seo/normalize-page-title";
import { absoluteUrl } from "@/lib/seo/site-origin";

type OgType = "website" | "article";

/**
 * Consistent title, description, absolute canonical, and Open Graph for marketing routes.
 */
export function seoPageMetadata(args: {
  title: string;
  description: string;
  path: string;
  ogType?: OgType;
  robots?: Metadata["robots"];
}): Metadata {
  const canonical = absoluteUrl(args.path);
  const title = normalizeMarketingPageTitle(args.title);
  return {
    title,
    description: args.description,
    alternates: { canonical },
    robots: args.robots,
    openGraph: {
      title,
      description: args.description,
      url: canonical,
      type: args.ogType ?? "website",
    },
  };
}

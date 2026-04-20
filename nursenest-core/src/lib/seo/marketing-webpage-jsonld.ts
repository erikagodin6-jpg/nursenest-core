import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";

export type MarketingWebPageJsonLdProps = {
  title: string;
  description: string;
  path: string;
  inLanguage: string;
};

/**
 * Build stable page-level WebPage JSON-LD props for marketing routes.
 * Keeps canonical path shaping and locale signaling aligned in one place.
 */
export function buildMarketingWebPageJsonLdProps(args: {
  locale: string;
  enPath: string;
  title: string;
  description: string;
  /** BCP 47 tag for JSON-LD (e.g. en-CA for Canada-first default marketing `/`). */
  inLanguage?: string;
}): MarketingWebPageJsonLdProps {
  return {
    title: args.title,
    description: args.description,
    path: marketingCanonicalPathForLocale(args.locale, args.enPath),
    inLanguage: args.inLanguage ?? args.locale,
  };
}

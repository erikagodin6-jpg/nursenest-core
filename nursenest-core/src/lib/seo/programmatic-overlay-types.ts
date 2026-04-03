import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/**
 * Partial overlay for programmatic SEO pages. Merged onto {@link SeoPageDefinition}
 * when `public/i18n/programmatic-overlays/{locale}.json` (or per-slug files) exists.
 * Slugs are unchanged; only display strings are overridden per locale.
 */
export type ProgrammaticPageOverlay = {
  title?: string;
  description?: string;
  h1?: string;
  /** Localize hub labels in breadcrumbs; `midPath` stays from registry (URLs unchanged). */
  breadcrumb?: { midLabel?: string; currentLabel?: string };
  sections?: Array<{
    heading?: string;
    level?: 2 | 3;
    body?: string[];
  }>;
  faq?: Array<{ question?: string; answer?: string }>;
};

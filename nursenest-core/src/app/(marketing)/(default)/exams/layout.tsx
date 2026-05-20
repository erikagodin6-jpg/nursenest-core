/**
 * Request-time render trims build-time prerender volume for the default public exams family while
 * keeping page-level SEO metadata, canonicals, hreflang, and robots logic unchanged.
 */
export const dynamic = "force-dynamic";

export default function MarketingExamsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

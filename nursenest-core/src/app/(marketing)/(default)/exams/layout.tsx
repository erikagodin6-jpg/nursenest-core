/**
 * Request-time render trims build-time prerender volume for the default public exams family while
 * keeping page-level SEO metadata, canonicals, hreflang, and robots logic unchanged.
 */
export const dynamic = "force-dynamic";

import { traceLayout } from "@/build/tracing";

const MarketingExamsLayout = traceLayout(
  import.meta,
  function MarketingExamsLayout({ children }: { children: React.ReactNode }) {
    return children;
  },
  { name: "MarketingExamsLayout" },
);

export default MarketingExamsLayout;

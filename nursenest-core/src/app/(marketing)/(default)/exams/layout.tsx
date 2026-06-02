/**
 * ISR-compatible: This layout performs no dynamic work.
 * Child routes can specify their own revalidate settings.
 * Removing force-dynamic allows ISR caching for exam routes.
 */

import { traceLayout } from "@/build/tracing";

const MarketingExamsLayout = traceLayout(
  import.meta,
  function MarketingExamsLayout({ children }: { children: React.ReactNode }) {
    return children;
  },
  { name: "MarketingExamsLayout" },
);

export default MarketingExamsLayout;

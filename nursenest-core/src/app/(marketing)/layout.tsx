import { traceLayout } from "@/build/tracing";

import "./marketing-styles.css";

const MarketingGroupLayout = traceLayout(
  import.meta,
  function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
    return children;
  },
  { name: "MarketingGroupLayout" },
);

export default MarketingGroupLayout;

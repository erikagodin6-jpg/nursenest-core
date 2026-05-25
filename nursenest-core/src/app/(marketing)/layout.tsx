import { traceLayout } from "@/build/tracing";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";

import "./marketing-styles.css";

const MarketingGroupLayout = traceLayout(
  import.meta,
  function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
    return (
      <AuthSessionProvider session={null} runtimeBoundary="public">
        {children}
      </AuthSessionProvider>
    );
  },
  { name: "MarketingGroupLayout" },
);

export default MarketingGroupLayout;

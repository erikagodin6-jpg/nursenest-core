import { traceLayout } from "@/build/tracing";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { ReferralAttributionTracker } from "@/components/referrals/referral-attribution-tracker";

import "./marketing-styles.css";

/**
 * Root marketing layout — fully static, no server-side cookie or auth reads.
 *
 * Auth state is resolved client-side by AuthSessionProvider (via useSession()
 * calling /api/auth/session). The MarketingHeaderAuthDesktop/Mobile components
 * already render a pulse skeleton while status === "loading", so there is no
 * visible layout shift for anonymous users and only a brief (~100–150ms) skeleton
 * for signed-in users before their account menu appears.
 *
 * Removing the server-side getMarketingInitialSession() call (which read cookies
 * to detect a session and called auth()) eliminates the only cookies() dependency
 * in this layout, making every marketing route eligible for CDN edge caching.
 *
 * Previous behaviour and why it was removed:
 *   - cookies() read → Next.js opts the response into dynamic rendering (Cache-Control: private)
 *   - auth() call → up to 500ms added to every marketing page server render
 *   - No ISR edge caching possible while this read existed
 *
 * The trade-off is a ~100ms pulse on the auth chrome for signed-in users.
 * For anonymous users (>95% of marketing traffic) there is no visible change.
 */
const MarketingGroupLayout = traceLayout(
  import.meta,
  function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
    return (
      <AuthSessionProvider runtimeBoundary="public">
        <ReferralAttributionTracker />
        {children}
      </AuthSessionProvider>
    );
  },
  { name: "MarketingGroupLayout" },
);

export default MarketingGroupLayout;

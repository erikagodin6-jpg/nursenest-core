"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import type { NursenestRegion } from "@/lib/region/use-nursenest-region";

export type MarketingRegionToggleAnalytics = {
  /** Current region before click (from `useNursenestRegion().region`). */
  currentRegion: NursenestRegion;
  /** Where the toggle lives (hero, site_header, utility_strip, mobile_drawer, …). */
  surface: string;
};

/**
 * Region preference is stored in localStorage + cookie; marketing server components read the cookie.
 * After toggling: if the user is on an exam hub (`/us/...` or `/canada/...`), navigate to the equivalent hub
 * in the other country; otherwise refresh the RSC tree so `/lessons` and other cookie-driven pages update.
 */
export function useMarketingRegionToggleWithRefresh(
  setRegion: (next: NursenestRegion) => void,
  analytics?: MarketingRegionToggleAnalytics,
) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  return useCallback(
    (next: NursenestRegion) => {
      if (analytics && next !== analytics.currentRegion) {
        trackClientEvent(PH.marketingRegionToggled, {
          actor: "anonymous",
          from_region: analytics.currentRegion,
          to_region: next,
          surface: analytics.surface,
        });
      }
      setRegion(next);
      const { pathname: bare } = stripMarketingLocalePrefix(pathname);
      const eq = equivalentExamHubUrlAfterRegionToggle(bare, next);
      if (eq) {
        router.replace(eq);
      } else {
        router.refresh();
      }
    },
    [setRegion, router, pathname, analytics?.currentRegion, analytics?.surface],
  );
}

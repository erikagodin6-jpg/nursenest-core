"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useMarketingLocale } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { buildActiveContext, type ActiveContext } from "@/lib/navigation/active-context";

/**
 * Client hook: session + marketing region + locale → {@link ActiveContext}.
 * Use in `SiteHeader` and any client nav that must stay in sync with subscriptions.
 */
export function useActiveNavContext(): ActiveContext {
  const { data: session, status } = useSession();
  const { region } = useNursenestRegion();
  const globalRegion = useClientGlobalRegionCookie();
  const locale = useMarketingLocale();
  const stableSession = status === "authenticated" ? session : null;

  return useMemo(
    () =>
      buildActiveContext({
        locale,
        examRegion: region,
        globalRegion,
        session: stableSession,
      }),
    [locale, region, globalRegion, stableSession],
  );
}

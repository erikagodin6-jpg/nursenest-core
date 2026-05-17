"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { Session } from "next-auth";
import { useMarketingLocale } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useClientGlobalRegionCookie } from "@/lib/region/use-client-global-region";
import { buildActiveContext, type ActiveContext } from "@/lib/navigation/active-context";

export type ActiveNavSessionInput = {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
};

/**
 * Client hook: session + marketing region + locale → {@link ActiveContext}.
 * Accepts an optional existing session snapshot so high-traffic chrome like
 * SiteHeader does not subscribe to NextAuth twice during hydration.
 */
export function useActiveNavContext(existingSession?: ActiveNavSessionInput): ActiveContext {
  const ownSession = useSession();
  const sessionSource = existingSession ?? ownSession;
  const { region } = useNursenestRegion();
  const globalRegion = useClientGlobalRegionCookie();
  const locale = useMarketingLocale();
  const stableSession = sessionSource.status === "authenticated" ? sessionSource.session : null;

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

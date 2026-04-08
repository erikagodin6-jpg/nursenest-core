"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { equivalentExamHubUrlAfterRegionToggle } from "@/lib/marketing/marketing-region-equivalent-hub";
import type { NursenestRegion } from "@/lib/region/use-nursenest-region";

/**
 * Region preference is stored in localStorage + cookie; marketing server components read the cookie.
 * After toggling: if the user is on an exam hub (`/us/...` or `/canada/...`), navigate to the equivalent hub
 * in the other country; otherwise refresh the RSC tree so `/lessons` and other cookie-driven pages update.
 */
export function useMarketingRegionToggleWithRefresh(setRegion: (next: NursenestRegion) => void) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  return useCallback(
    (next: NursenestRegion) => {
      setRegion(next);
      const { pathname: bare } = stripMarketingLocalePrefix(pathname);
      const eq = equivalentExamHubUrlAfterRegionToggle(bare, next);
      if (eq) {
        router.replace(eq);
      } else {
        router.refresh();
      }
    },
    [setRegion, router, pathname],
  );
}

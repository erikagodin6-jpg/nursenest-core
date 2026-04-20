import "server-only";

import { cookies } from "next/headers";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GLOBAL_REGION_COOKIE, parseGlobalRegionCookie } from "@/lib/region/global-region-cookie";

const STATIC_GENERATION_PHASE = "phase-production-build";

/** Server read of `nn_global_region` so client hooks can match the first paint (no null-then-cookie flash). */
export async function readOptionalGlobalRegionSlugFromCookie(): Promise<GlobalRegionSlug | null> {
  if (process.env.NEXT_PHASE === STATIC_GENERATION_PHASE) return null;
  const jar = await cookies();
  const raw = jar.get(GLOBAL_REGION_COOKIE)?.value;
  const parsed = parseGlobalRegionCookie(raw);
  return parsed ?? null;
}

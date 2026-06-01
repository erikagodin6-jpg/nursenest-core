import "server-only";

import { cookies } from "next/headers";
import { COUNTRY_PREFERENCE_COOKIE, parseCountryPreference, type CountryPreference } from "@/lib/region/country-preference";

const STATIC_GENERATION_PHASE = "phase-production-build";

/** Server read of `nn_country_preference` so the CountryPreferenceRoot initial state matches SSR. */
export async function readOptionalCountryPreferenceFromCookie(): Promise<CountryPreference | null> {
  if (process.env.NEXT_PHASE === STATIC_GENERATION_PHASE) return null;
  try {
    const jar = await cookies();
    const raw = jar.get(COUNTRY_PREFERENCE_COOKIE)?.value;
    return parseCountryPreference(raw);
  } catch {
    return null;
  }
}

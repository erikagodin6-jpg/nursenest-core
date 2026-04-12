/**
 * Server-side gate for the smart exam selector.
 *
 * Reads cookies and auth state to determine if the selector should render.
 * Passes geo-detection data to the client component.
 *
 * Rendering this component is safe on any page — it renders nothing if the
 * user already has preferences or is logged in.
 */

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { parseGlobalRegionCookie, GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";
import { geoCountryToRegion } from "@/lib/context/resolve-initial-context";
import { ExamSelector } from "./exam-selector";

export async function ExamSelectorGate() {
  const [jar, hdrs, session] = await Promise.all([
    cookies(),
    headers(),
    auth(),
  ]);

  // Suppress for logged-in users
  if (session?.user) return null;

  // Suppress if user already has a global region cookie
  const regionCookie = jar.get(GLOBAL_REGION_COOKIE)?.value;
  if (parseGlobalRegionCookie(regionCookie)) return null;

  // Suppress if user has the legacy marketing region cookie set with intent
  const legacyRegion = jar.get("nn_marketing_region")?.value;
  if (legacyRegion) return null;

  // Suppress if profession cookie exists
  const profCookie = jar.get("nn_preferred_profession")?.value;
  if (profCookie) return null;

  // Geo-detect for pre-selecting country
  const geoCountryCode =
    hdrs.get("x-vercel-ip-country") ??
    hdrs.get("cf-ipcountry") ??
    null;

  const geoRegion = geoCountryToRegion(geoCountryCode);

  // Render the client component — it does its own localStorage check
  // for the dismissed flag (not accessible on the server)
  return <ExamSelector geoRegion={geoRegion} />;
}

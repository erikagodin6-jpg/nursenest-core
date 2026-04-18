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
import { safeAwait } from "@/lib/async/safe-await";
import { parseGlobalRegionCookie, GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";
import { geoCountryToRegion } from "@/lib/context/resolve-initial-context";
import { renderTrace } from "@/lib/observability/render-trace";
import { ExamSelector } from "./exam-selector";

const EXAM_SELECTOR_AUTH_TIMEOUT_MS = 1000;

export async function ExamSelectorGate() {
  renderTrace("exam selector gate start", { route: "/" });
  const [jar, hdrs, session] = await Promise.all([
    cookies(),
    headers(),
    safeAwait(auth(), "exam_selector_gate.auth", EXAM_SELECTOR_AUTH_TIMEOUT_MS),
  ]);
  renderTrace("exam selector gate after auth", {
    route: "/",
    hasSessionUser: Boolean(session?.user),
  });
  if (!session && process.env.NODE_ENV === "production") {
    return null;
  }

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

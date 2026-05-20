"use client";

import { MARKETING_REGION_COOKIE, parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";

/** Country/region hint from the same cookie marketing + learner surfaces use (`useNursenestRegion`). */
export function readMarketingRegionFromDocument(): "US" | "CA" {
  if (typeof document === "undefined") return "US";
  const needle = `; ${document.cookie}`.split(`; ${MARKETING_REGION_COOKIE}=`);
  const raw = needle.length === 2 ? needle.pop()?.split(";").shift() : undefined;
  return parseMarketingRegionCookieValue(raw === undefined ? undefined : decodeURIComponent(raw));
}

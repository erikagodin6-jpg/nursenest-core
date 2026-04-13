import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

/** Absolute URL for public schema.org `item` fields. */
export function toAbsoluteSiteUrl(pathOrUrl: string): string {
  const raw = pathOrUrl.trim();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const origin = resolveCanonicalSiteOrigin().replace(/\/$/, "");
  if (!raw || raw === "/") return `${origin}/`;
  return `${origin}${raw.startsWith("/") ? "" : "/"}${raw}`;
}

export function countryLabelFromSlug(countrySlug: string): string {
  if (countrySlug === "canada") return "Canada";
  if (countrySlug === "us") return "United States";
  return countrySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Short label for role track segment (matches URL segment; wording is country-aware where needed).
 * US practical/vocational nursing uses LPN / LVN; Canada PN track uses RPN.
 */
export function formatRoleTrackLabel(roleTrack: string, countrySlug?: string): string {
  const t = roleTrack.toLowerCase();
  const country = countrySlug?.toLowerCase() ?? "";
  if (t === "rpn") return "RPN";
  if (t === "rn") return "RN";
  if (t === "np") return "NP";
  if (t === "lpn") return getNursingRoleLabel({ country: country === "us" ? "US" : "CA", role: "PN" });
  if (t === "allied") return "Allied health";
  return roleTrack.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

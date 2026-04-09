import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/**
 * Guards nav and CTAs: marketing exam hubs must be `/{us|canada}/{role}/{exam}[/…]`.
 * Invalid strings fall back to RN hub for the region so the shell never emits broken hrefs.
 */
export function isWellFormedExamHubPath(href: string): boolean {
  const parts = href.trim().split("/").filter(Boolean);
  if (parts.length < 3) return false;
  const country = parts[0]!.toLowerCase();
  return country === "us" || country === "canada";
}

export function fallbackNursingExamHubForRegion(region: MarketingRegionToggle): string {
  return region === "CA" ? CANONICAL_PATHWAY_HUB.caRn : CANONICAL_PATHWAY_HUB.usRn;
}

export function ensureMarketingExamHubPath(region: MarketingRegionToggle, href: string): string {
  return isWellFormedExamHubPath(href) ? href : fallbackNursingExamHubForRegion(region);
}

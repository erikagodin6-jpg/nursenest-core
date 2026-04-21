import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const KNOWN_SHORT_MARKETING_DESTINATIONS = new Set([
  "/lessons",
  "/question-bank",
  "/practice-exams",
  "/flashcards",
  "/tools",
  "/pricing",
]);

/**
 * Guards nav and CTAs: marketing exam hubs are `/{us|canada}/{role}/{exam}[/…]`, or known short canonical routes.
 * Invalid strings fall back to `/lessons` so the shell never emits broken hrefs.
 */
export function isWellFormedExamHubPath(href: string): boolean {
  const raw = href.trim().split("?")[0]?.split("#")[0] ?? href.trim();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  if (KNOWN_SHORT_MARKETING_DESTINATIONS.has(path)) return true;
  const parts = path.split("/").filter(Boolean);
  if (parts.length < 3) return false;
  const country = parts[0]!.toLowerCase();
  return country === "us" || country === "canada";
}

export function fallbackNursingExamHubForRegion(_region: MarketingRegionToggle): string {
  return CANONICAL_PATHWAY_HUB.usRn;
}

export function ensureMarketingExamHubPath(region: MarketingRegionToggle, href: string): string {
  if (isWellFormedExamHubPath(href)) return href;
  safeServerLog("exam_pathway_hub", "invalid_exam_path_detected", {
    event: "invalid_exam_path_detected",
    region,
    href: href.slice(0, 200),
    fallback: fallbackNursingExamHubForRegion(region),
  });
  return fallbackNursingExamHubForRegion(region);
}

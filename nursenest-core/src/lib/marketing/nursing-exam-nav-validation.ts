import { CANONICAL_PATHWAY_HUB } from "@/lib/marketing/canonical-pathway-hubs";
import { ALLIED_GLOBAL_HUB_PATH } from "@/lib/allied/allied-global-hub-path";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const KNOWN_SHORT_MARKETING_DESTINATIONS = new Set([
  "/lessons",
  "/question-bank",
  "/practice-exams",
  "/flashcards",
  "/tools",
  "/pricing",
  "/np-exam-practice-questions",
  "/np-exam-prep",
  "/np-clinical-cases",
  "/cnple-practice-questions",
  "/canada-np-exam-prep",
  "/np-study-guide-canada",
  ALLIED_GLOBAL_HUB_PATH,
]);

/**
 * Guards nav and CTAs: marketing exam hubs are `/{us|canada}/{role}/{exam}[/…]`, or known short canonical routes.
 * Invalid strings fall back to the region’s canonical RN pathway hub so the shell never emits broken hrefs.
 * Allied occupation URLs (`/allied/...`) are accepted so nav validation cannot silently rewrite them to RN.
 */
export function isWellFormedExamHubPath(href: string): boolean {
  const raw = href.trim().split("?")[0]?.split("#")[0] ?? href.trim();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  if (KNOWN_SHORT_MARKETING_DESTINATIONS.has(path)) return true;
  if (path === `${ALLIED_GLOBAL_HUB_PATH}/lessons` || path === `${ALLIED_GLOBAL_HUB_PATH}/questions` || path === `${ALLIED_GLOBAL_HUB_PATH}/cat` || path === `${ALLIED_GLOBAL_HUB_PATH}/pricing` || path === `${ALLIED_GLOBAL_HUB_PATH}/clinical-scenarios`) {
    return true;
  }
  const parts = path.split("/").filter(Boolean);
  /** Occupation hubs `/allied/{professionKey}` — never coerce these to RN via {@link ensureMarketingExamHubPath}. */
  if (parts[0] === "allied" && parts.length >= 2) return true;
  if (parts.length < 3) return false;
  const country = parts[0]!.toLowerCase();
  return country === "us" || country === "canada";
}

export function fallbackNursingExamHubForRegion(region: MarketingRegionToggle): string {
  return region === "US" ? CANONICAL_PATHWAY_HUB.usRn : CANONICAL_PATHWAY_HUB.caRn;
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

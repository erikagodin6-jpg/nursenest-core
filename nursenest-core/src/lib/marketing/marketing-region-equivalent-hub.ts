import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import {
  buildExamPathwayPath,
  getExamPathwayById,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";
import { RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT, isRnNclexMarketingPathwayId } from "@/lib/exam-pathways/rn-nclex-public-hub-policy";
import { isExamPathwayCountrySlug } from "@/lib/i18n/exam-hub-path";

/**
 * When toggling US ↔ Canada on a marketing exam hub, map to the closest pathway in the other country.
 * NP US tracks (FNP, AGPCNP, PMHNP) map to Canadian CNPLE; CNPLE maps back to US FNP as the default NP hub.
 */
const CROSS_BORDER_PEER: Record<string, string> = {
  "us-rn-nclex-rn": "ca-rn-nclex-rn",
  "ca-rn-nclex-rn": "us-rn-nclex-rn",
  "us-lpn-nclex-pn": "ca-rpn-rex-pn",
  "ca-rpn-rex-pn": "us-lpn-nclex-pn",
  "us-np-fnp": "ca-np-cnple",
  "us-np-agpcnp": "ca-np-cnple",
  "us-np-pmhnp": "ca-np-cnple",
  "us-np-whnp": "ca-np-cnple",
  "us-np-pnp-pc": "ca-np-cnple",
  "ca-np-cnple": "us-np-fnp",
  "us-allied-core": "ca-allied-core",
  "ca-allied-core": "us-allied-core",
};

/**
 * If `pathname` is under `/us/...` or `/canada/...`, returns the equivalent hub URL in `nextRegion`
 * (including trailing subpaths like `/lessons/foo`). Otherwise returns `null` (caller should `router.refresh()` only).
 */
export function equivalentExamHubUrlAfterRegionToggle(pathname: string, nextRegion: MarketingRegionToggle): string | null {
  const clean = (pathname.split("?")[0] ?? pathname).split("#")[0] ?? pathname;
  const parts = clean.split("/").filter(Boolean);
  if (parts.length < 3) return null;
  const country = parts[0]!;
  const role = parts[1]!;
  const examSeg = parts[2]!;
  if (!isExamPathwayCountrySlug(country)) return null;
  const isUsPath = country === "us";
  const wantUs = nextRegion === "US";
  if (isUsPath === wantUs) return null;

  const pathway = resolveExamPathwayFromMarketingHubSegment(country, role, examSeg);
  if (!pathway) return null;
  if (isRnNclexMarketingPathwayId(pathway.id) && parts.length === 3) {
    return RN_NCLEX_EXAM_HUB_OVERVIEW_REDIRECT;
  }
  const peerId = CROSS_BORDER_PEER[pathway.id];
  if (!peerId) return null;
  const peer = getExamPathwayById(peerId);
  if (!peer) return null;
  const tail = parts.slice(3).join("/");
  const base = buildExamPathwayPath(peer);
  return tail ? `${base}/${tail}` : base;
}

/**
 * Pathway-aware **public marketing CAT** URLs for `/practice-exams` and related CTAs.
 *
 * Exam hub routes (`/us/...`, `/canada/...`) are not prefixed with UI locale per {@link withMarketingLocale}
 * policy — use {@link buildExamPathwayPath} directly for CAT landings.
 *
 * In-app session start remains {@link appPathwayCatSessionStartPath} (`/app/practice-tests/start?pathwayId=…`).
 */
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import type { CountryExamOfferingId } from "@/lib/marketing/country-exam-offerings";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

const RN_PATHWAY_ID_BY_REGION: Record<MarketingRegionToggle, string> = {
  US: "us-rn-nclex-rn",
  CA: "ca-rn-nclex-rn",
};

const DEFAULT_PATHWAY_ID_BY_OFFERING: Record<MarketingRegionToggle, Record<CountryExamOfferingId, string>> = {
  US: {
    rn: "us-rn-nclex-rn",
    pn: "us-lpn-nclex-pn",
    np: "us-np-fnp",
    allied: "us-allied-core",
  },
  CA: {
    rn: "ca-rn-nclex-rn",
    pn: "ca-rpn-rex-pn",
    np: "ca-np-cnple",
    allied: "ca-allied-core",
  },
};

/** Region’s NCLEX-RN pathway id (single-link RN defaults). */
export function defaultRnPathwayIdForMarketingRegion(region: MarketingRegionToggle): string {
  return RN_PATHWAY_ID_BY_REGION[region];
}

/** Canonical pathway id per region and marketing offering (matches `EXAM_PATHWAYS`). */
export function defaultPathwayIdForMarketingOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  return DEFAULT_PATHWAY_ID_BY_OFFERING[region][offering];
}

/** Public marketing CAT path: `/us/rn/nclex-rn/cat`, `/canada/np/cnple/cat`, etc. */
export function marketingCatPathForPathway(pathway: ExamPathwayDefinition): string {
  return buildExamPathwayPath(pathway, "cat");
}

export function marketingCatPathForPathwayId(pathwayId: string): string | null {
  const p = getExamPathwayById(pathwayId.trim());
  return p ? marketingCatPathForPathway(p) : null;
}

export type PracticeExamsCatStartMeta = {
  pathwayId: string;
  /** Root-relative public CAT landing (no locale prefix). */
  marketingCatPath: string;
  /** Deep link into app after user is signed in and eligible. */
  appCatStartPath: string;
  /** `login?callbackUrl=` for flows that must authenticate before returning to the marketing CAT page. */
  loginCallbackMarketingCatHref: string;
};

export function practiceExamsCatStartMetaForOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): PracticeExamsCatStartMeta | null {
  const pathwayId = defaultPathwayIdForMarketingOffering(region, offering);
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return null;
  const marketingCatPath = marketingCatPathForPathway(pathway);
  return {
    pathwayId: pathway.id,
    marketingCatPath,
    appCatStartPath: appPathwayCatSessionStartPath(pathway.id),
    loginCallbackMarketingCatHref: loginWithCallback(marketingCatPath),
  };
}

/** Direct href for practice-exams hub tiles (anonymous or signed-in): public CAT explainer page. */
export function publicMarketingCatHrefForOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  return practiceExamsCatStartMetaForOffering(region, offering)?.marketingCatPath ?? "/practice-exams";
}

/**
 * Sign-in → return to the **marketing** CAT page for the selected offering (not `/app/practice-tests/start`).
 * Use when the UX should land on the public CAT explainer first.
 */
export function loginCallbackMarketingCatForOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  return practiceExamsCatStartMetaForOffering(region, offering)?.loginCallbackMarketingCatHref ?? loginWithCallback("/practice-exams");
}

/** Sign-in → app CAT builder with correct `pathwayId` (legacy “start immediately in app” flows). */
export function loginCallbackAppCatStartForOffering(region: MarketingRegionToggle, offering: CountryExamOfferingId): string {
  const id = defaultPathwayIdForMarketingOffering(region, offering);
  return loginWithCallback(appPathwayCatSessionStartPath(id));
}

export function loginCallbackAppCatStartForPathwayId(pathwayId: string): string {
  const trimmed = pathwayId.trim();
  if (!getExamPathwayById(trimmed)) return loginWithCallback("/app/practice-tests/start");
  return loginWithCallback(appPathwayCatSessionStartPath(trimmed));
}

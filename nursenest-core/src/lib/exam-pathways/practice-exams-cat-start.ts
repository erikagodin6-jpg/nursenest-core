/**
 * Pathway-aware **public marketing CAT** URLs for `/practice-exams` and related CTAs.
 *
 * Exam hub routes (`/us/...`, `/canada/...`) are not prefixed with UI locale per {@link withMarketingLocale}
 * policy — use {@link buildExamPathwayPath} directly for CAT landings.
 *
 * In-app session start remains {@link appPathwayCatSessionStartPath} (`/app/practice-tests/start?pathwayId=…`).
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import {
  defaultPathwayIdForMarketingOffering,
  type CountryExamOfferingId,
} from "@/lib/marketing/country-exam-offerings";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { HUB, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export { defaultPathwayIdForMarketingOffering } from "@/lib/marketing/country-exam-offerings";

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
  const meta = practiceExamsCatStartMetaForOffering(region, offering);
  if (!meta) {
    safeServerLog("practice_exams_cat", "CAT_MARKETING_PATHWAY_MISSING", { region, offering });
    return HUB.practiceExams;
  }
  return meta.marketingCatPath;
}

/**
 * Sign-in → return to the **marketing** CAT page for the selected offering (not `/app/practice-tests/start`).
 * Use when the UX should land on the public CAT explainer first.
 */
export function loginCallbackMarketingCatForOffering(
  region: MarketingRegionToggle,
  offering: CountryExamOfferingId,
): string {
  const meta = practiceExamsCatStartMetaForOffering(region, offering);
  if (!meta) {
    safeServerLog("practice_exams_cat", "CAT_MARKETING_LOGIN_CALLBACK_MISSING", { region, offering });
    return loginWithCallback(HUB.practiceExams);
  }
  return meta.loginCallbackMarketingCatHref;
}

/** Sign-in → app CAT builder with correct `pathwayId` (legacy “start immediately in app” flows). */
export function loginCallbackAppCatStartForOffering(region: MarketingRegionToggle, offering: CountryExamOfferingId): string {
  const id = defaultPathwayIdForMarketingOffering(region, offering);
  return loginWithCallback(appPathwayCatSessionStartPath(id));
}

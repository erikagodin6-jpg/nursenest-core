import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { npNpQuestionsForRegion, pnQuestions, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/** Default question bank entry by SEO cluster (used when `linkPack` is omitted). */
export function clusterQuestionBankHref(
  locale: string,
  cluster: SeoPageDefinition["cluster"],
  marketingRegion: MarketingRegionToggle = "US",
): string {
  const loc = (p: string) => withMarketingLocale(locale, p);
  if (cluster === "exam-nclex") return loc(rnQuestions(marketingRegion));
  if (cluster === "exam-pn") return loc(pnQuestions(marketingRegion));
  if (cluster === "exam-np") return loc(npNpQuestionsForRegion(marketingRegion));
  return loc("/question-bank");
}

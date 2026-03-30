import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { NP, PN, RN } from "@/lib/marketing/marketing-entry-routes";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/** Default question bank entry by SEO cluster (used when `linkPack` is omitted). */
export function clusterQuestionBankHref(locale: string, cluster: SeoPageDefinition["cluster"]): string {
  const loc = (p: string) => withMarketingLocale(locale, p);
  if (cluster === "exam-nclex") return loc(RN.usQuestions);
  if (cluster === "exam-pn") return loc(PN.usQuestions);
  if (cluster === "exam-np") return loc(NP.fnpQuestions);
  return loc("/test-bank");
}

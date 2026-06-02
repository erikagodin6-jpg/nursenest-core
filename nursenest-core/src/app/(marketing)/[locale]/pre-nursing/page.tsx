import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { PreNursingMarketingHubMain } from "@/components/pre-nursing/pre-nursing-marketing-hub-main";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

const EN_TITLE = "Free Pre-Nursing foundations for nursing school | NurseNest";
const EN_DESCRIPTION =
  "Free interactive Pre-Nursing modules: anatomy, chemistry, infection control, communication & more. No subscription required. Optional readiness target and a clear path to paid NCLEX/RPN/NP prep when you're ready.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  return safeGenerateMetadata(
    async () => {
      let msgs: Record<string, string> = {};
      try {
        msgs = await loadMarketingMessages(locale);
      } catch {
        /* fallback to English below */
      }
      const title = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
      const description = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;
      const alt = marketingAlternatesSharedPage(locale, "/pre-nursing");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
    },
    { pathname: `/${locale}/pre-nursing`, locale, routeGroup: "marketing.locale.pre_nursing" },
  );
}

export default async function LocalizedPreNursingPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();

  let msgs: Record<string, string> = {};
  try {
    msgs = await loadMarketingMessages(locale);
  } catch {
    /* fallback to English strings below */
  }

  const pageTitle = msgs["preNursing.hub.metaTitle"] ?? EN_TITLE;
  const pageDescription = msgs["preNursing.hub.metaDescription"] ?? EN_DESCRIPTION;

  const l = (href: string) => withMarketingLocale(locale, href);

  return (
    <div className="nn-marketing-surface">
      <WebPageJsonLd
        title={pageTitle}
        description={pageDescription}
        path={`/${locale}/pre-nursing`}
        inLanguage={locale}
      />
      <PreNursingMarketingHubMain
        heroTitle={msgs["preNursing.hub.heroLabel"] ?? "Pre-Nursing"}
        heroSubtitle={msgs["preNursing.hub.heroSubtitle"] ?? "Choose how you want to study today."}
        linkHref={(p) => l(p)}
        marketingLocale={locale}
      />
    </div>
  );
}

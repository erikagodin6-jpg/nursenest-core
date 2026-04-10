import type { Metadata } from "next";
import { MarketingResetPasswordPage } from "@/components/marketing/marketing-reset-password-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(locale);
      const title = m["pages.resetPassword.metaTitle"] ?? "Reset password";
      const description = m["pages.resetPassword.metaDescription"] ?? "Set a new NurseNest password";
      const alt = marketingAlternatesSharedPage(locale, "/reset-password");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: false, follow: true },
        openGraph: { title, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/reset-password`, locale, routeGroup: "marketing.locale.auth" },
  );
}

export default async function LocalizedResetPasswordPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";
  return <MarketingResetPasswordPage locale={locale} token={token} />;
}

import { VerifyEmailExperienceClient } from "@/components/auth/verify-email-experience-client";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

export async function MarketingVerifyEmailPage({ locale }: { locale: string }) {
  return (
    <VerifyEmailExperienceClient
      termsHref={withMarketingLocale(locale, "/terms")}
      privacyHref={withMarketingLocale(locale, "/privacy")}
      contactHref={withMarketingLocale(locale, "/contact")}
    />
  );
}

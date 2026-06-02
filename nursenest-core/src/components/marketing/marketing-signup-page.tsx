import { SignupExperienceClient } from "@/components/auth/signup-experience-client";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

export async function MarketingSignupPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS);
  const termsHref = withMarketingLocale(locale, "/terms");
  const privacyHref = withMarketingLocale(locale, "/privacy");
  const contactHref = withMarketingLocale(locale, "/contact");

  return (
    <SignupExperienceClient
      title={m["pages.signup.h1"] ?? "Create account"}
      subtitle={
        m["pages.signup.subtitle"] ??
        "Choose your pathway and start a connected NurseNest study plan."
      }
      termsHref={termsHref}
      privacyHref={privacyHref}
      contactHref={contactHref}
      forgotPasswordHref={withMarketingLocale(locale, "/forgot-password")}
      mobileEyebrow="NurseNest · Sea Glass"
    />
  );
}

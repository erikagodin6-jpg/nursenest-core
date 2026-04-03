import { SignupForm } from "@/components/auth/signup-form";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingSignupPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <div className="nn-card p-8">
        <div className="mb-6 flex justify-center bg-transparent">
          <SiteBrandLogoMark />
        </div>
        <h1 className="text-3xl font-bold">{m["pages.signup.h1"]}</h1>
        <p className="mt-2 text-sm text-muted">{m["pages.signup.subtitle"]}</p>
        <SignupForm
          termsHref={withMarketingLocale(locale, "/terms")}
          privacyHref={withMarketingLocale(locale, "/privacy")}
        />
      </div>
    </main>
  );
}

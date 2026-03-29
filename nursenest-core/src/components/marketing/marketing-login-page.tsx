import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingLoginPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const forgotHref = withMarketingLocale(locale, "/forgot-password");
  return (
    <main className="mx-auto w-full max-w-md px-6 py-16">
      <div className="nn-card p-8">
        <div className="mb-6 flex justify-center">
          <SiteBrandLogoMark className="h-10 w-auto max-w-[12rem] object-contain md:h-12" />
        </div>
        <h1 className="text-3xl font-bold">{m["pages.login.welcome"]}</h1>
        <p className="mt-2 text-sm text-muted">{m["pages.login.subtitle"]}</p>
        <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-xl bg-border/40" aria-hidden />}>
          <LoginForm forgotPasswordHref={forgotHref} forgotPasswordLabel="Forgot password?" />
        </Suspense>
      </div>
    </main>
  );
}

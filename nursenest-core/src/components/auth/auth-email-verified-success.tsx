"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { AuthLeafBackground } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingAuthMintBlossomTheme } from "@/components/auth/marketing-auth-mint-blossom-theme";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import {
  resolveAuthTransitionFromCallback,
  resolveEmailVerifiedPresentation,
} from "@/lib/auth/auth-transition-governance";
import { readAuthCallbackFromSearchParams } from "@/lib/auth/auth-flow-governance";

export function AuthEmailVerifiedSuccess() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale } = useMarketingI18n();

  const callbackUrl = readAuthCallbackFromSearchParams(searchParams);
  const { pathwayId, whatsNext } = resolveAuthTransitionFromCallback("email-verified", callbackUrl);
  const copy = resolveEmailVerifiedPresentation(pathwayId);

  const signInHref = (() => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.delete("verify");
    const qs = sp.toString();
    const base = pathname?.split("?")[0] ?? "/login";
    return qs ? `${base}?${qs}` : base;
  })();

  const primaryContinueHref = callbackUrl
    ? `${signInHref}${signInHref.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`
    : `${signInHref}${signInHref.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent("/app/start-studying")}`;

  const lessonsHref = withMarketingLocale(locale, "/rn");
  const firstStep = whatsNext[0];

  return (
    <MarketingAuthMintBlossomTheme>
      <main
        className="nn-premium-auth-verified nn-marketing-x nn-rhythm-page"
        data-nn-premium-auth-verified=""
        data-nn-premium-color-depth=""
        data-nn-premium-full-platform-convergence=""
        data-nn-auth-transition="email-verified"
      >
        <AuthLeafBackground placement="page-ambient" />
        <div className="nn-premium-auth-verified__brand">
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-10 !max-h-10" />
          <span className="nn-premium-auth-theme-pill">Mint Blossom · Premium study</span>
        </div>

        <section className="nn-premium-auth-verified__layout" aria-labelledby="auth-verified-heading">
          <div className="nn-premium-auth-verified__celebrate">
            <AuthLeafBackground placement="panel-hero" />
            <div className="relative z-[1]">
              <div className="nn-premium-auth-verified__success-ring nn-auth-transition-success-ring" aria-hidden>
                <Check className="h-12 w-12 text-[var(--nn-auth-accent-success,#6ec9a0)]" strokeWidth={2.5} />
              </div>
              <p className="nn-premium-auth-eyebrow">{copy.eyebrow}</p>
              <h1 id="auth-verified-heading">{copy.title}</h1>
              <p className="nn-premium-auth-verified__lead">{copy.message}</p>
              {copy.help ? <p className="nn-premium-auth-verified__hint">{copy.help}</p> : null}
            </div>
          </div>

          <div className="nn-premium-auth-verified__next">
            <div className="relative z-[1]">
              <p className="nn-premium-auth-eyebrow">{copy.whatsNextEyebrow}</p>
              <h2 className="nn-premium-auth-verified__next-title">{copy.whatsNextTitle}</h2>
              <ol className="nn-premium-auth-verified__steps">
                {whatsNext.map((step, index) => (
                  <li key={step.title}>
                    <span className="nn-premium-auth-verified__step-num" aria-hidden>
                      {index + 1}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="nn-premium-auth-verified__actions">
                <Link
                  href={primaryContinueHref}
                  className="nn-premium-auth-primary-button inline-flex w-full items-center justify-center no-underline"
                >
                  {firstStep ? `Sign in · ${firstStep.title}` : "Sign in to continue studying"}
                </Link>
                <Link
                  href={lessonsHref}
                  className="nn-premium-auth-verified__secondary-btn inline-flex w-full items-center justify-center no-underline"
                >
                  Explore lessons
                </Link>
              </div>
              <p className="nn-premium-auth-verified__signin-hint">
                Already signed in on another device?{" "}
                <Link href={signInHref} className="font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline">
                  Go to sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </MarketingAuthMintBlossomTheme>
  );
}

/** True when the login surface should show the full verified celebration (not the compact banner). */
export function useShowAuthEmailVerifiedSuccess(): boolean {
  const params = useSearchParams();
  return params.get("verify") === "success";
}

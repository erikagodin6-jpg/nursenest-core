import type { ReactNode } from "react";
import Link from "next/link";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthStoryPanel } from "@/components/auth/auth-experience/auth-story-panel";
import { AuthSignupProgressRail } from "@/components/auth/auth-experience/auth-signup-progress-rail";
import { AuthSupportFooter } from "@/components/auth/auth-experience/auth-support-footer";
import { MarketingAuthMintBlossomTheme } from "@/components/auth/marketing-auth-mint-blossom-theme";
import {
  authLayoutForMode,
  authModeFromVariant,
  type AuthExperienceContinuation,
  type AuthExperienceLayout,
  type AuthExperienceMode,
  type AuthExperienceShellVariant,
  type AuthExperienceState,
  type AuthExperienceTheme,
} from "@/components/auth/auth-experience/auth-experience-types";

export type AuthExperienceShellProps = {
  /** Canonical mode (Figma program route family). */
  mode?: AuthExperienceMode;
  /** @deprecated Use `mode` — kept for existing marketing pages. */
  variant?: AuthExperienceShellVariant;
  layout?: AuthExperienceLayout;
  state?: AuthExperienceState;
  theme?: AuthExperienceTheme;
  continuation?: AuthExperienceContinuation;
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  termsHref: string;
  privacyHref: string;
  contactHref: string;
  stateSurface?: ReactNode;
  /** Signup aspirational left column (Figma 87:15); defaults to pathway panel from parent. */
  visualPanel?: ReactNode;
  mobileEyebrow?: string;
  /** Hide default header eyebrow/title block (centered-glass supplies its own). */
  hideHeader?: boolean;
  /** Skip default legal footer when page provides AuthSupportFooter in children. */
  hideLegalFooter?: boolean;
};

function headerEyebrowForMode(mode: AuthExperienceMode): string {
  if (mode === "signup") return "Account setup";
  if (mode === "login") return "Welcome back";
  if (mode === "verify") return "Account setup";
  return "Account Recovery";
}

/**
 * Slot-based premium auth shell — Figma Blossom Auth Premium baseline.
 */
export function AuthExperienceShell({
  mode: modeProp,
  variant,
  layout: layoutProp,
  state: _state = "default",
  theme: _theme = "blossom",
  continuation: _continuation,
  title,
  subtitle,
  children,
  termsHref,
  privacyHref,
  contactHref,
  stateSurface = null,
  visualPanel,
  mobileEyebrow,
  hideHeader = false,
  hideLegalFooter = false,
}: AuthExperienceShellProps) {
  const mode = modeProp ?? (variant ? authModeFromVariant(variant) : "login");
  const layout = layoutProp ?? authLayoutForMode(mode);
  const headerEyebrow = headerEyebrowForMode(mode);

  const cardInner = (
    <>
      <AuthLeafWatermark />
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <div className="nn-premium-auth-mobile-brand">
          <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
          {mobileEyebrow ? <p className="nn-premium-auth-mobile-eyebrow">{mobileEyebrow}</p> : null}
        </div>

        {!hideHeader ? (
          <header className="nn-premium-auth-header" data-nn-premium-auth-header>
            <p className="nn-premium-auth-eyebrow">{headerEyebrow}</p>
            <h1 id="premium-auth-heading">{title}</h1>
            <p>{subtitle}</p>
          </header>
        ) : null}

        {stateSurface ? <div data-nn-auth-state-surface>{stateSurface}</div> : null}

        <div className="nn-premium-auth-form-region flex-1">{children}</div>

        {!hideLegalFooter ? (
          <AuthSupportFooter termsHref={termsHref} privacyHref={privacyHref} contactHref={contactHref} />
        ) : null}
      </div>
    </>
  );

  if (layout === "signup-aspirational") {
    return (
      <MarketingAuthMintBlossomTheme>
        <main
          className="nn-premium-auth-system nn-premium-auth-system--signup-aspirational nn-marketing-x nn-rhythm-page"
          data-nn-premium-auth-system={mode}
          data-nn-auth-experience-shell
          data-nn-auth-layout={layout}
          data-nn-auth-state={_state}
          data-nn-auth-theme={_theme}
          data-nn-auth-branding-revamp=""
          data-nn-premium-color-depth=""
          data-nn-premium-full-platform-convergence=""
        >
          <AuthSignupProgressRail />
          <section
            className="nn-premium-auth-signup-hero"
            aria-labelledby={hideHeader ? undefined : "premium-auth-heading"}
          >
            {visualPanel}
            <section
              className="nn-premium-auth-card nn-premium-auth-card--signup"
              data-nn-premium-auth-card
              data-nn-auth-branding-revamp=""
            >
              {cardInner}
            </section>
          </section>
        </main>
      </MarketingAuthMintBlossomTheme>
    );
  }

  if (layout === "centered-glass") {
    return (
      <MarketingAuthMintBlossomTheme>
        <main
          className="nn-premium-auth-system nn-premium-auth-system--centered-glass nn-marketing-x nn-rhythm-page"
          data-nn-premium-auth-system={mode}
          data-nn-auth-experience-shell
          data-nn-auth-layout={layout}
          data-nn-auth-state={_state}
          data-nn-auth-theme={_theme}
          data-nn-auth-branding-revamp=""
          data-nn-premium-color-depth=""
          data-nn-premium-full-platform-convergence=""
        >
          <section className="nn-premium-auth-centered" aria-labelledby="premium-auth-heading">
            <section
              className="nn-premium-auth-card nn-premium-auth-card--centered"
              data-nn-premium-auth-card
              data-nn-auth-branding-revamp=""
            >
              {cardInner}
            </section>
          </section>
        </main>
      </MarketingAuthMintBlossomTheme>
    );
  }

  if (layout === "verified-split") {
    return (
      <MarketingAuthMintBlossomTheme>
        <main
          className="nn-premium-auth-system nn-marketing-x nn-rhythm-page"
          data-nn-premium-auth-system={mode}
          data-nn-auth-experience-shell
          data-nn-auth-layout={layout}
          data-nn-auth-state={_state}
          data-nn-auth-theme={_theme}
          data-nn-auth-branding-revamp=""
        >
          {children}
        </main>
      </MarketingAuthMintBlossomTheme>
    );
  }

  const storyPanel = visualPanel ?? (mode === "login" ? <AuthStoryPanel /> : null);

  return (
    <MarketingAuthMintBlossomTheme>
      <main
        className="nn-premium-auth-system nn-marketing-x nn-rhythm-page"
        data-nn-premium-auth-system={mode}
        data-nn-auth-experience-shell
        data-nn-auth-layout={layout}
        data-nn-auth-state={_state}
        data-nn-auth-theme={_theme}
        data-nn-auth-branding-revamp=""
        data-nn-premium-color-depth=""
        data-nn-premium-full-platform-convergence=""
      >
        <section className="nn-premium-auth-layout" aria-labelledby="premium-auth-heading">
          {storyPanel}
          <section className="nn-premium-auth-card" data-nn-premium-auth-card data-nn-auth-branding-revamp="">
            {cardInner}
          </section>
        </section>
      </main>
    </MarketingAuthMintBlossomTheme>
  );
}

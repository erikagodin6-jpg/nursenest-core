import type { ReactNode } from "react";
import Link from "next/link";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { AuthStoryPanel } from "@/components/auth/auth-experience/auth-story-panel";
import { AuthStoryPanelLegacy } from "@/components/auth/auth-experience/auth-story-panel-legacy";
import { MarketingAuthMintBlossomTheme } from "@/components/auth/marketing-auth-mint-blossom-theme";
import { AUTH_EDUCATIONAL_DISCLAIMER } from "@/components/auth/auth-experience/constants";

export type AuthExperienceShellVariant = "login" | "signup" | "recovery" | "reset";

export type AuthExperienceShellProps = {
  variant: AuthExperienceShellVariant;
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  termsHref: string;
  privacyHref: string;
  contactHref: string;
  /** URL-driven banners (session expired, OAuth, errors) */
  stateSurface?: ReactNode;
  /** Optional pathway rail (signup) */
  pathwayRail?: ReactNode;
  /** Override desktop story column */
  visualPanel?: ReactNode;
  /** Mobile-only brand strip above form */
  mobileEyebrow?: string;
};

const pathwayItems = [
  "RN / NCLEX-RN",
  "RPN / REx-PN",
  "LPN / NCLEX-PN",
  "NP",
  "Allied Health",
  "New Grad",
  "Pre-Nursing",
] as const;

function defaultPathwayRail() {
  return (
    <div className="nn-premium-auth-pathway-rail" data-nn-premium-auth-pathways aria-label="Supported Pathways">
      {pathwayItems.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

/**
 * Slot-based premium auth shell — Figma Blossom Auth Premium baseline.
 */
export function AuthExperienceShell({
  variant,
  title,
  subtitle,
  children,
  termsHref,
  privacyHref,
  contactHref,
  stateSurface = null,
  pathwayRail,
  visualPanel,
  mobileEyebrow,
}: AuthExperienceShellProps) {
  const isSignup = variant === "signup";
  const headerEyebrow = isSignup
    ? "Choose Your Pathway"
    : variant === "login"
      ? "Welcome back"
      : "Account Recovery";

  return (
    <MarketingAuthMintBlossomTheme>
      <main
        className="nn-premium-auth-system nn-marketing-x nn-rhythm-page"
        data-nn-premium-auth-system={variant}
        data-nn-auth-experience-shell
        data-nn-premium-color-depth=""
        data-nn-premium-full-platform-convergence=""
      >
        <section className="nn-premium-auth-layout" aria-labelledby="premium-auth-heading">
          {visualPanel ?? (variant === "login" ? <AuthStoryPanel /> : <AuthStoryPanelLegacy />)}

          <section className="nn-premium-auth-card" data-nn-premium-auth-card>
            <AuthLeafWatermark />
            <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
              <div className="nn-premium-auth-mobile-brand">
                <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
                {mobileEyebrow ? <p className="nn-premium-auth-mobile-eyebrow">{mobileEyebrow}</p> : null}
              </div>

              <header className="nn-premium-auth-header" data-nn-premium-auth-header>
                <p className="nn-premium-auth-eyebrow">{headerEyebrow}</p>
                <h1 id="premium-auth-heading">{title}</h1>
                <p>{subtitle}</p>
              </header>

              {isSignup ? (pathwayRail ?? defaultPathwayRail()) : null}

              {stateSurface ? <div data-nn-auth-state-surface>{stateSurface}</div> : null}

              <div className="nn-premium-auth-form-region flex-1">{children}</div>

              <footer className="nn-premium-auth-legal mt-auto" data-nn-premium-auth-legal>
                <p>{AUTH_EDUCATIONAL_DISCLAIMER}</p>
                <p>
                  By continuing, you agree to the <Link href={termsHref}>Terms Of Service</Link> and acknowledge the{" "}
                  <Link href={privacyHref}>Privacy Policy</Link>. Need help? <Link href={contactHref}>Contact Support</Link>.
                </p>
              </footer>
            </div>
          </section>
        </section>
      </main>
    </MarketingAuthMintBlossomTheme>
  );
}

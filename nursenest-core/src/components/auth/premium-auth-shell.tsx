import type { ReactNode } from "react";
import Link from "next/link";
import { AuthLeafWatermark } from "@/components/brand/auth-leaf-watermark";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { MarketingAuthMintBlossomTheme } from "@/components/auth/marketing-auth-mint-blossom-theme";

type PremiumAuthShellVariant = "login" | "signup" | "recovery" | "reset";

const ecosystemItems = [
  "Lessons",
  "Flashcards",
  "Practice Exams",
  "CAT Readiness",
  "Report Cards",
] as const;

const pathwayItems = [
  "RN / NCLEX-RN",
  "RPN / REx-PN",
  "LPN / NCLEX-PN",
  "NP",
  "Allied Health",
  "New Grad",
  "Pre-Nursing",
] as const;

export const AUTH_EDUCATIONAL_DISCLAIMER =
  "NurseNest is an educational platform and does not provide medical advice, diagnosis, or treatment.";

export function PremiumAuthShell({
  variant,
  title,
  subtitle,
  children,
  termsHref,
  privacyHref,
  contactHref,
}: {
  variant: PremiumAuthShellVariant;
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  termsHref: string;
  privacyHref: string;
  contactHref: string;
}) {
  const isSignup = variant === "signup";

  return (
    <MarketingAuthMintBlossomTheme>
    <main
      className="nn-premium-auth-system nn-marketing-x nn-rhythm-page"
      data-nn-premium-auth-system={variant}
      data-nn-premium-color-depth=""
      data-nn-premium-full-platform-convergence=""
    >
      <section className="nn-premium-auth-layout" aria-labelledby="premium-auth-heading">
        <aside className="nn-premium-auth-story" data-nn-premium-auth-story aria-label="NurseNest Study Ecosystem">
          <div className="nn-premium-auth-brand-row">
            <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
            <span className="nn-premium-auth-theme-pill">Mint Blossom · Premium study</span>
          </div>
          <div className="nn-premium-auth-story-copy">
            <p className="nn-premium-auth-eyebrow">Trusted by nursing students</p>
            <h2>Calm, focused access to adaptive NCLEX readiness</h2>
            <p>
              Sign in once and return to the same premium study loop—lessons, flashcards, practice exams, and CAT
              sessions—without losing your pathway or momentum.
            </p>
          </div>
          <div className="nn-premium-auth-ecosystem-grid" data-nn-premium-auth-ecosystem>
            {ecosystemItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="nn-premium-auth-disclaimer">{AUTH_EDUCATIONAL_DISCLAIMER}</p>
          <p className="nn-premium-auth-account-link">
            Account deletion is available after sign in from{" "}
            <Link href="/app/account/settings">Account Settings</Link>.
          </p>
        </aside>

        <section className="nn-premium-auth-card" data-nn-premium-auth-card>
          <AuthLeafWatermark />
          <div className="relative z-[1]">
            <div className="nn-premium-auth-mobile-brand">
              <SiteBrandLogoMark variant="auth" logoVariant="leaf" className="!h-11 !max-h-11 sm:!h-12 sm:!max-h-12" />
            </div>
            <header className="nn-premium-auth-header" data-nn-premium-auth-header>
              <p className="nn-premium-auth-eyebrow">
                {isSignup ? "Choose Your Pathway" : variant === "login" ? "Welcome Back" : "Account Recovery"}
              </p>
              <h1 id="premium-auth-heading">{title}</h1>
              <p>{subtitle}</p>
            </header>
            {isSignup ? (
              <div className="nn-premium-auth-pathway-rail" data-nn-premium-auth-pathways aria-label="Supported Pathways">
                {pathwayItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            ) : null}
            {children}
            <footer className="nn-premium-auth-legal" data-nn-premium-auth-legal>
              <p>{AUTH_EDUCATIONAL_DISCLAIMER}</p>
              <p>
                By continuing, you agree to the{" "}
                <Link href={termsHref}>Terms Of Service</Link>
                {" "}and acknowledge the{" "}
                <Link href={privacyHref}>Privacy Policy</Link>. Need help?{" "}
                <Link href={contactHref}>Contact Support</Link>.
              </p>
            </footer>
          </div>
        </section>
      </section>
    </main>
    </MarketingAuthMintBlossomTheme>
  );
}

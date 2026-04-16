"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getNavChromeStyle } from "@/lib/theme/nav-chrome";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import {
  learnerMarketingPathwayIdFromSession,
  publicExamPrepHubDestinations,
  publicMarketingExploreDestinations,
} from "@/lib/navigation/canonical-destinations";
import { isStaffRole } from "@/lib/auth/staff-roles";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { CONTINUE_STUDYING_CTA, PRIMARY_CTA } from "@/lib/copy/cta-copy";
import { formatTitleCase } from "@/lib/format/text-case";
import { SiteFooterFeedbackTrigger } from "@/components/layout/site-footer-feedback-trigger";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import { useActiveNavContext } from "@/lib/navigation/use-active-nav-context";

function formatFooterNode(children: React.ReactNode, locale: string): React.ReactNode {
  return typeof children === "string" ? formatTitleCase(children, locale) : children;
}

function FLink({
  href,
  children,
  className = "nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { locale } = useMarketingI18n();
  const to = href.startsWith("http") ? href : resolveMarketingHref(href);
  const external = to.startsWith("http");
  if (external) {
    return (
      <a href={to} className={className} rel="noopener noreferrer">
        {formatFooterNode(children, locale)}
      </a>
    );
  }
  const path = to.startsWith("/") ? to : `/${to}`;
  return (
    <Link href={withMarketingLocale(locale, path)} className={className}>
      {formatFooterNode(children, locale)}
    </Link>
  );
}

export function SiteFooter() {
  const { t, locale } = useMarketingI18n();
  const { data: session } = useSession();
  const activeNav = useActiveNavContext();
  const { theme } = useTheme();
  const navChromeStyle = getNavChromeStyle(theme);
  const { region } = useNursenestRegion();
  const examHubs = publicExamPrepHubDestinations(region);
  const explore = publicMarketingExploreDestinations(region);
  const pnRoleLabel = getNursingRoleLabel({ country: region, role: "PN" });
  const user = session?.user;
  const isSignedIn = Boolean(user);
  const isAdmin = Boolean(user?.role && isStaffRole(user.role));
  const isEntitledLearner =
    Boolean(user?.role && !isStaffRole(user.role)) && activeNav.entitlement === "entitled";
  const learnerPathwayId = learnerMarketingPathwayIdFromSession(session?.user ?? null);
  const learnerSignInHref = withMarketingLocale(locale, loginWithCallback("/app"));
  const startPracticingHref = withMarketingLocale(locale, "/signup?callbackUrl=%2Fapp");
  const learnerContinueHref =
    learnerPathwayId != null
      ? `/app/lessons?pathwayId=${encodeURIComponent(learnerPathwayId)}`
      : "/app";

  return (
    <footer
      style={navChromeStyle}
      className="mt-auto border-t border-[var(--footer-border)] py-[var(--nn-rhythm-footer-y)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell">
        <div className="mb-6 sm:mb-8">
          <EmailSignupBanner />
        </div>

        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_4%,var(--footer-bg))] px-5 py-6 sm:px-6 sm:py-7">
          <div
            className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="absolute left-[8%] top-1/2 -translate-y-1/2 whitespace-nowrap font-semibold tracking-tight text-[var(--footer-fg)] opacity-[0.028] sm:left-[12%] sm:opacity-[0.042] md:opacity-[0.048]"
              style={{ fontSize: "clamp(2.75rem, 14vw, 9.5rem)" }}
            >
              {t("brand.nurseNest")}
            </span>
          </div>

          <div className="relative z-[1] space-y-6">
            <div className="border-b border-[color-mix(in_srgb,var(--footer-fg)_10%,transparent)] pb-4">
              <p className="text-lg font-semibold tracking-[0.14em] text-[color-mix(in_srgb,var(--footer-fg)_92%,transparent)] sm:text-xl">
                {t("brand.nurseNest")}
              </p>
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center bg-transparent">
                  <SiteBrandLogoMark variant="footer" logoVariant="leaf" />
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--footer-muted)]">
                  Exam-focused prep for RN, LPN/LVN, NP, and Allied Health learners worldwide.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-[var(--footer-fg)]">{formatTitleCase("Exam Pathways", locale)}</h3>
                <ul className="space-y-2 text-sm text-[var(--footer-fg)]">
                  <li>
                    <FLink href={examHubs.rn}>RN</FLink>
                  </li>
                  <li>
                    <FLink href={examHubs.pn}>{pnRoleLabel}</FLink>
                  </li>
                  <li>
                    <FLink href={examHubs.np}>NP</FLink>
                  </li>
                  <li>
                    <FLink href={examHubs.allied}>Allied Health</FLink>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-[var(--footer-fg)]">{formatTitleCase("Explore", locale)}</h3>
                <ul className="space-y-2 text-sm text-[var(--footer-fg)]">
                  <li>
                    <FLink href={explore.pricing}>Pricing</FLink>
                  </li>
                  <li>
                    <FLink href={explore.lessons}>Lessons</FLink>
                  </li>
                  <li>
                    <FLink href={explore.practiceQuestions}>Practice Questions</FLink>
                  </li>
                  <li>
                    <FLink href={explore.blog}>Blog</FLink>
                  </li>
                  <li>
                    <FLink href={explore.tools}>Tools</FLink>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium text-[var(--footer-fg)]">{formatTitleCase("Account", locale)}</h3>
                <ul className="space-y-2 text-sm text-[var(--footer-fg)]">
                  {!isSignedIn ? (
                    <>
                      <li>
                        <FLink href={learnerSignInHref}>Login</FLink>
                      </li>
                      <li>
                        <FLink href="/contact">Contact Support</FLink>
                      </li>
                      <SiteFooterFeedbackTrigger />
                      <li className="pt-1">
                        <Link
                          href={startPracticingHref}
                          className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium sm:w-fit"
                        >
                          {formatTitleCase(PRIMARY_CTA, locale)}
                        </Link>
                      </li>
                    </>
                  ) : isAdmin ? (
                    <>
                      <li>
                        <Link
                          href="/admin"
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                        >
                          {formatTitleCase("Admin", locale)}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/app"
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                        >
                          {formatTitleCase("Dashboard", locale)}
                        </Link>
                      </li>
                      <li>
                        <FLink href="/contact">Contact Support</FLink>
                      </li>
                      <SiteFooterFeedbackTrigger />
                    </>
                  ) : isEntitledLearner ? (
                    <>
                      <li>
                        <Link
                          href="/app"
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                        >
                          {formatTitleCase("Dashboard", locale)}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/app/account/overview"
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                        >
                          {formatTitleCase("Account", locale)}
                        </Link>
                      </li>
                      <li>
                        <FLink href="/contact">Contact Support</FLink>
                      </li>
                      <SiteFooterFeedbackTrigger />
                      <li className="pt-1">
                        <Link
                          href={learnerContinueHref}
                          className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium sm:w-fit"
                        >
                          {formatTitleCase(CONTINUE_STUDYING_CTA, locale)}
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/app"
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                        >
                          {formatTitleCase("Dashboard", locale)}
                        </Link>
                      </li>
                      <li>
                        <FLink href={explore.pricing}>{formatTitleCase("Pricing", locale)}</FLink>
                      </li>
                      <li>
                        <FLink href="/contact">Contact Support</FLink>
                      </li>
                      <SiteFooterFeedbackTrigger />
                      <li className="pt-1">
                        <Link
                          href={startPracticingHref}
                          className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium sm:w-fit"
                        >
                          {formatTitleCase(PRIMARY_CTA, locale)}
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_4%,var(--footer-bg))] px-4 pb-6 pt-6">
          <h3 className="mb-3 break-words text-sm font-medium text-[var(--footer-fg)]">
            {formatTitleCase(t("footer.studyInYourLanguage"), locale)}
          </h3>
          <div className="mb-3 flex flex-wrap gap-2">
            <MarketingLanguagePreferenceList
              renderItem={({ code, name, flag, disabled, onSelect }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onSelect}
                  className={`inline-flex items-center gap-1 text-xs transition-colors hover:text-[var(--footer-fg)] ${
                    code === locale ? "font-medium text-[var(--footer-fg)]" : "text-[var(--footer-muted)]"
                  }`}
                >
                  <span>{flag}</span>
                  <span>{name}</span>
                </button>
              )}
            />
          </div>
          <Link href={mapLegacyMarketingHref("/languages")} className="nn-footer-link text-xs">
            {formatTitleCase(t("footer.viewAllLanguages"), locale)}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_5%,var(--footer-bg))] px-4 py-5 md:flex-row">
          <div className="text-sm text-[var(--footer-muted)]">
            © {new Date().getFullYear()} {t("brand.nurseNest")}. {t("footer.rights")}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-[var(--footer-muted)]">
          {t("footer.legalDisclaimer")}
        </div>
      </div>
    </footer>
  );
}

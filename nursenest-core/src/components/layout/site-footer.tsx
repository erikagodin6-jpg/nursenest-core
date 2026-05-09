"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getNavChromeStyle } from "@/lib/theme/nav-chrome";
import { resolveMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { externalMarketingLanguagesHref } from "@/lib/marketing/marketing-public-site-origin";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useThemeLogo } from "@/lib/theme/use-theme-logo";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import {
  learnerMarketingPathwayIdFromSession,
  publicExamPrepHubDestinations,
  publicMarketingExploreDestinations,
} from "@/lib/navigation/canonical-destinations";
import { ADMIN_DASHBOARD_HREF, navigateAdminDashboardHard } from "@/lib/auth/admin-dashboard-link";
import { isStaffRole, shouldShowAdminDashboardNav } from "@/lib/auth/staff-roles";
import { HUB, loginWithCallback, signupWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { resolveMarketingAuthRedirectTarget } from "@/lib/auth/post-login-resume-path";
import { CONTINUE_STUDYING_CTA, PRIMARY_CTA } from "@/lib/copy/cta-copy";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { SUPPORT_RESPONSE_TIME_COPY, supportMailtoHref } from "@/lib/support/support-policy";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import { useActiveNavContext } from "@/lib/navigation/use-active-nav-context";
import { useMarketingChromeCountry } from "@/components/marketing/marketing-country-chrome-context";
import { getCountryNavConfig } from "@/lib/marketing/countries/registry";

function formatFooterNode(children: React.ReactNode, locale: string): React.ReactNode {
  return typeof children === "string" ? formatTitleCase(children, locale) : children;
}

function footerCopyWithFallback(value: string, fallback: string): string {
  const trimmed = value.trim();
  return !trimmed || trimmed.startsWith("footer.") ? fallback : trimmed;
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

function FooterAccountSupportEmailBlock() {
  return (
    <li>
      <a
        href={supportMailtoHref()}
        className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
      >
        Email support
      </a>
      <span className="mt-1 block max-w-[18rem] text-xs leading-snug text-[var(--footer-muted)]">
        {SUPPORT_RESPONSE_TIME_COPY}
      </span>
    </li>
  );
}

function FooterLeafWatermark() {
  const { url, kind } = useThemeLogo("leaf");
  const leafUrl = kind === "local" && typeof url === "string" && url.trim().length > 0 ? url : null;
  if (!leafUrl) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none" aria-hidden>
      <Image
        src={leafUrl}
        alt=""
        width={420}
        height={420}
        sizes="420px"
        unoptimized
        className="max-h-[min(48vw,18rem)] w-auto opacity-[0.055] grayscale sm:max-h-[min(40vw,20rem)] sm:opacity-[0.065]"
        draggable={false}
      />
    </div>
  );
}

type SiteFooterProps = {
  /** Same DB-backed hint as {@link SiteHeader} — JWT role can lag after role changes. */
  serverHasStaffSession?: boolean;
};

export function SiteFooter({ serverHasStaffSession }: SiteFooterProps = {}) {
  const { t, locale } = useMarketingI18n();
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const authResumePath = useMemo(
    () => resolveMarketingAuthRedirectTarget(pathname, searchParams, locale),
    [pathname, searchParams, locale],
  );
  const { data: session } = useSession();
  const activeNav = useActiveNavContext();
  const { theme } = useTheme();
  const navChromeStyle = getNavChromeStyle(theme);
  const { region } = useNursenestRegion();
  const marketingChromeCountry = useMarketingChromeCountry();
  const countryNav = getCountryNavConfig(marketingChromeCountry);
  const examHubs = publicExamPrepHubDestinations(region);
  const explore = publicMarketingExploreDestinations(region);
  const pnRoleLabel = getNursingRoleLabel({ country: region, role: "PN" });
  const user = session?.user;
  const isSignedIn = Boolean(user);
  const isAdmin = shouldShowAdminDashboardNav({ serverHasStaffSession, sessionRole: user?.role });
  const isEntitledLearner =
    Boolean(user?.role && !isStaffRole(user.role)) && activeNav.entitlement === "entitled";
  const learnerPathwayId = learnerMarketingPathwayIdFromSession(session?.user ?? null);
  const learnerSignInHref = withMarketingLocale(locale, loginWithCallback(authResumePath));
  /** Primary footer CTA — resume marketing question bank after signup (matches post-login resume rules). */
  const startPracticingHref = withMarketingLocale(locale, signupWithCallback(HUB.questionBank));
  const learnerContinueHref =
    learnerPathwayId != null
      ? `/app/lessons?pathwayId=${encodeURIComponent(learnerPathwayId)}`
      : "/app";
  const regionalHubLinksLabel = footerCopyWithFallback(t("footer.regionalHubLinks"), "Regional hubs");

  return (
    <footer
      data-nn-footer-layout="marketing"
      style={navChromeStyle}
      className="nn-footer-marketing-chrome mt-auto border-t border-[var(--footer-border)] py-[var(--nn-rhythm-footer-y)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell nn-footer-marketing-shell">
        <div className="nn-footer-panel nn-footer-panel--main relative mb-8 overflow-hidden px-5 py-6 sm:px-6 sm:py-7">
          <FooterLeafWatermark />

          <div className="relative z-[1] space-y-6 md:space-y-7">
            <div className="nn-footer-columns grid md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 bg-transparent">
                  <SiteBrandLogoMark variant="footer" logoVariant="leaf" />
                  <span className="text-lg font-semibold tracking-tight text-[var(--footer-fg)]">NurseNest</span>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--footer-muted)]">
                  {formatTitleCase(t("footer.supportingNursesGlobally"), locale)}
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--footer-muted)]">
                  {formatSentenceCase(t("footer.brandTagline"), locale)}
                </p>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-[var(--footer-muted)]">
                  {formatSentenceCase(t("footer.globalPathwaysLine"), locale)}
                </p>
              </div>

              <div className="nn-footer-col">
                <h3 className="nn-footer-col-heading">{formatTitleCase("Exam Pathways", locale)}</h3>
                <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
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

              <div className="nn-footer-col">
                <h3 className="nn-footer-col-heading">{formatTitleCase("Explore", locale)}</h3>
                <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                  <li>
                    <FLink href={explore.pricing}>Pricing</FLink>
                  </li>
                  <li>
                    <FLink href="/for-institutions">{formatTitleCase(t("footer.forSchools"), locale)}</FLink>
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

              <div className="nn-footer-col">
                <h3 className="nn-footer-col-heading">{formatTitleCase(regionalHubLinksLabel, locale)}</h3>
                <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                  {countryNav.footerFeatured.map((item) => (
                    <li key={item.href}>
                      <FLink href={item.href}>{item.label}</FLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nn-footer-col">
                <h3 className="nn-footer-col-heading">{formatTitleCase("Account", locale)}</h3>
                <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                  {!isSignedIn ? (
                    <>
                      <li>
                        <FLink href={learnerSignInHref}>{formatTitleCase(t("nav.logIn"), locale)}</FLink>
                      </li>
                      <FooterAccountSupportEmailBlock />
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
                          href={ADMIN_DASHBOARD_HREF}
                          prefetch={false}
                          className="nn-footer-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
                          onClick={navigateAdminDashboardHard}
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
                      <FooterAccountSupportEmailBlock />
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
                      <FooterAccountSupportEmailBlock />
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
                      <FooterAccountSupportEmailBlock />
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

        <div className="nn-footer-panel nn-footer-panel--language mb-6 px-4 pb-6 pt-6 sm:px-5 sm:pt-7 sm:pb-7">
          <h3 className="nn-footer-col-heading break-words">{formatTitleCase(t("footer.studyInYourLanguage"), locale)}</h3>
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
          <Link href={externalMarketingLanguagesHref()} className="nn-footer-link text-xs">
            {formatTitleCase(t("footer.viewAllLanguages"), locale)}
          </Link>
        </div>

        <div className="nn-footer-panel nn-footer-panel--email mb-6 p-4 sm:mb-8 sm:p-5">
          <EmailSignupBanner className="rounded-xl border-0 bg-transparent p-0 shadow-none sm:p-0" />
        </div>

        <div className="nn-footer-panel nn-footer-panel--legal flex flex-col items-center justify-center gap-3 px-4 py-5 md:flex-row md:justify-between md:gap-4 sm:px-5">
          <div className="text-sm text-[var(--footer-muted)]">
            © {new Date().getFullYear()} {t("brand.nurseNest")}. {t("footer.rights")}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-[var(--footer-muted)]">
            <FLink href="/terms">{formatTitleCase(t("footer.terms"), locale)}</FLink>
            <span className="select-none text-[var(--footer-muted)]" aria-hidden="true">
              ·
            </span>
            <FLink href="/privacy">{formatTitleCase(t("footer.privacy"), locale)}</FLink>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-[var(--footer-muted)]">
          {t("footer.legalDisclaimer")}
        </div>
      </div>
    </footer>
  );
}

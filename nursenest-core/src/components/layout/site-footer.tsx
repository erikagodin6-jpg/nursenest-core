"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { resolveMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { externalMarketingLanguagesHref } from "@/lib/marketing/marketing-public-site-origin";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { FooterBrandLockup } from "@/components/brand/footer-brand-lockup";
import { LeafWatermark } from "@/components/brand/leaf-watermark";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import {
  learnerMarketingPathwayIdFromSession,
  publicMarketingExploreDestinations,
} from "@/lib/navigation/canonical-destinations";
import { footerMarketingNav } from "@/lib/navigation/footer-marketing-nav";
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
import { REX_PN_CAT, REX_PN_PHARMACOLOGY } from "@/lib/seo/rex-pn-seo-cluster";
import { RT_OXYGEN_THERAPY, RT_VENTILATION } from "@/lib/seo/rt-seo-cluster";
import { ThemePicker } from "@/components/theme/theme-picker";
import { publicMarketingThemeChoiceCount } from "@/lib/theme/theme-registry";

function formatFooterNode(children: React.ReactNode, locale: string): React.ReactNode {
  return typeof children === "string" ? formatTitleCase(children, locale) : children;
}

function footerCopyWithFallback(value: string, fallback: string): string {
  const trimmed = value.trim();
  return !trimmed || trimmed.startsWith("footer.") ? fallback : trimmed;
}

/**
 * Mobile: `<details>` one-tap expand (links always in DOM for SEO).
 * Desktop (`md+`): static heading; panel forced visible via scoped CSS (no SSR/client mismatch).
 */
function FooterPremiumNavColumn({
  id,
  title,
  className,
  children,
}: {
  id: string;
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const colClass = ["nn-footer-premium-col", "nn-footer-col", "min-w-0", className].filter(Boolean).join(" ");
  return (
    <div id={id} className={colClass}>
      <h3 className="nn-footer-col-heading hidden md:block">{title}</h3>
      <details className="nn-footer-premium-accordion">
        <summary className="nn-footer-premium-accordion-summary md:hidden">
          <span className="nn-footer-premium-accordion-title">{title}</span>
          <span className="nn-footer-premium-accordion-icon" aria-hidden />
        </summary>
        <div className="nn-footer-premium-accordion-panel">{children}</div>
      </details>
    </div>
  );
}

function FLink({
  href,
  children,
  className = "nn-footer-link nn-footer-premium-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]",
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
        className="nn-footer-link nn-footer-premium-link break-words text-sm leading-relaxed [overflow-wrap:anywhere]"
      >
        Email Support
      </a>
      <span className="mt-1 block max-w-[18rem] text-xs leading-snug text-[var(--footer-muted)]">
        {SUPPORT_RESPONSE_TIME_COPY}
      </span>
    </li>
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
  const sessionState = useSession();
  const session = sessionState?.data ?? null;
  const activeNav = useActiveNavContext();
  const { region } = useNursenestRegion();
  const marketingChromeCountry = useMarketingChromeCountry();
  const countryNav = getCountryNavConfig(marketingChromeCountry);
  const footerNav = footerMarketingNav(region);
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
  const regionLabel = region === "US" ? "United States" : "Canada";
  const showThemePicker = publicMarketingThemeChoiceCount() > 1;

  return (
    <footer
      data-nn-footer-layout="marketing"
      data-nn-footer-premium="1"
      data-nn-footer-root
      className="nn-footer-premium-root nn-footer-marketing-chrome nn-footer-marketing-chrome--surface mt-auto border-t border-[var(--footer-border)] py-[var(--nn-rhythm-footer-y)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell nn-footer-marketing-shell">
        <div className="nn-footer-panel nn-footer-panel--main relative overflow-hidden px-5 py-6 sm:px-6 sm:py-7">
          <LeafWatermark
            className="inset-0 flex items-center justify-center"
            imageClassName="max-h-[min(48vw,18rem)] opacity-[0.055] sm:max-h-[min(40vw,20rem)] sm:opacity-[0.065]"
          />

          <div className="relative z-[1] space-y-8 md:space-y-9">
            <div className="nn-footer-premium-top nn-footer-columns grid grid-cols-1 gap-x-10 gap-y-10 xl:grid-cols-12">
              <div className="space-y-3 xl:col-span-4" data-nn-footer-brand>
                <FooterBrandLockup brandName={formatTitleCase(t("brand.nurseNest"), locale)} />
                <p className="max-w-md text-sm font-semibold leading-relaxed text-[var(--footer-fg)]">
                  {formatSentenceCase(
                    footerCopyWithFallback(
                      t("footer.brandTagline"),
                      "Adaptive nursing education built for modern clinical learners.",
                    ),
                    locale,
                  )}
                </p>
                <p className="max-w-md text-xs leading-relaxed text-[var(--footer-muted)]">
                  {formatSentenceCase(t("footer.supportingNursesGlobally"), locale)}
                </p>
              </div>

              <div className="nn-footer-premium-nav-grid grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-8">
                <FooterPremiumNavColumn
                  id="nn-footer-col-company"
                  title={formatTitleCase("Company", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href="/about">About</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.contact}>Contact</FLink>
                    </li>
                    <li>
                      <FLink href="/careers">Careers</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.resources.blog}>Blog</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn
                  id="nn-footer-col-legal"
                  title={formatTitleCase("Legal", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href="/privacy">Privacy Policy</FLink>
                    </li>
                    <li>
                      <FLink href="/terms">Terms of Service</FLink>
                    </li>
                    <li>
                      <FLink href="/cookie-policy">Cookie Policy</FLink>
                    </li>
                    <li>
                      <FLink href="/privacy#security">Security</FLink>
                    </li>
                    <li>
                      <FLink href="/privacy#health-privacy">Health Privacy</FLink>
                    </li>
                    <li>
                      <FLink href="/disclaimer">Disclaimer</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn
                  id="nn-footer-col-platform"
                  title={formatTitleCase("Platform", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={footerNav.platform.lessons}>Lessons</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.flashcards}>Flashcards</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.practiceExams}>Practice Exams</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.cat}>CAT Exams</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.ecg}>ECG</FLink>
                    </li>
                    <li>
                      <FLink href="/clinical-modules">Clinical Tools</FLink>
                    </li>
                    <li>
                      <FLink href="/labs-interpretation">Lab Interpretation</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.readinessAnalytics}>Readiness Analytics</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.pricing}>Pricing</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.features}>Features</FLink>
                    </li>
                    <li>
                      <FLink href="/membership-tiers">Membership Tiers</FLink>
                    </li>
                    <li>
                      <FLink href="/for-institutions">Institutional Pricing</FLink>
                    </li>
                    <li>
                      <FLink href="/enterprise-solutions">Enterprise Solutions</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn id="nn-footer-col-exams" title={formatTitleCase("Exams", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={footerNav.exams.rn}>RN</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.exams.pn}>{pnRoleLabel}</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.exams.np}>NP</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.exams.allied}>
                        {formatTitleCase(t("footer.alliedHealth"), locale)}
                      </FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.exams.preNursing}>Pre-Nursing</FLink>
                    </li>
                  </ul>
                  <div className="nn-footer-premium-regional mt-6">
                    <h3 className="nn-footer-col-heading mt-0 md:mt-2">
                      {formatTitleCase(regionalHubLinksLabel, locale)}
                    </h3>
                    <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                      {countryNav.footerFeatured.map((item) => (
                        <li key={item.href}>
                          <FLink href={item.href}>{item.label}</FLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-bg)_88%,var(--semantic-brand))] px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--footer-muted)]">
                      Exam authority guides
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      <li>
                        <FLink
                          href="/canada/np/cnple/study-guide"
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          CNPLE study guide
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href="/canada/np/cnple/loft-exam"
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          CNPLE LOFT format
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href="/canada/rn/nclex-rn"
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          NCLEX-RN Canada hub
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href="/canada/rn/nclex-rn/guide/clinical-judgment"
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          NCLEX clinical judgment guide
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href={REX_PN_CAT}
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          REx-PN CAT exam
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href={REX_PN_PHARMACOLOGY}
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          REx-PN pharmacology
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href={RT_VENTILATION}
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          RT ventilation
                        </FLink>
                      </li>
                      <li>
                        <FLink
                          href={RT_OXYGEN_THERAPY}
                          className="nn-footer-link nn-footer-premium-link text-xs leading-relaxed"
                        >
                          Oxygen therapy
                        </FLink>
                      </li>
                    </ul>
                  </div>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn
                  id="nn-footer-col-resources"
                  title={formatTitleCase("Resources", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={footerNav.resources.nclexStudyGuides}>NCLEX Study Guides</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.resources.clinicalReasoning}>Clinical Reasoning</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.resources.testTakingStrategies}>Test-Taking Strategies</FLink>
                    </li>
                    <li>
                      <FLink href="/clinical-interpretation">Clinical References</FLink>
                    </li>
                    <li>
                      <FLink href="/question-bank">Question Bank</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.resources.faq}>FAQ</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.resources.blog}>Blog</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn
                  id="nn-footer-col-support"
                  title={formatTitleCase("Support", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={footerNav.support.contact}>Contact</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.helpCenter}>Help Center</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.accessibility}>Accessibility</FLink>
                    </li>
                    <li>
                      <FLink href="/support#system-status">System Status</FLink>
                    </li>
                    <li>
                      <FLink href="/support#contact">Contact Support</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.providerLinks}>Provider Links</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.findCare}>Find Care</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.howItWorks}>How It Works</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>
              </div>
            </div>

            <div
              className="border-t border-[color-mix(in_srgb,var(--footer-border)_82%,var(--semantic-border-soft))] pt-6"
              data-nn-footer-account
            >
              <h3 className="nn-footer-col-heading">{formatTitleCase("Account", locale)}</h3>
              <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                {!isSignedIn ? (
                  <>
                    <li>
                      <FLink href={learnerSignInHref}>{formatTitleCase(t("nav.logIn"), locale)}</FLink>
                    </li>
                    <FooterAccountSupportEmailBlock />
                    <li className="w-full pt-1 sm:w-auto">
                      <Link
                        href={startPracticingHref}
                        className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-full px-4 py-2 text-sm font-medium sm:w-fit"
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
                    <li className="w-full pt-1 sm:w-auto">
                      <Link
                        href={learnerContinueHref}
                        className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-full px-4 py-2 text-sm font-medium sm:w-fit"
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
                    <li className="w-full pt-1 sm:w-auto">
                      <Link
                        href={startPracticingHref}
                        className="nn-nav-cta inline-flex min-h-[40px] w-full max-w-[16rem] items-center justify-center rounded-full px-4 py-2 text-sm font-medium sm:w-fit"
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

        <div className="nn-footer-panel nn-footer-panel--email p-4 sm:p-5">
          <EmailSignupBanner className="rounded-xl border-0 bg-transparent p-0 shadow-none sm:p-0" />
        </div>

        <div className="nn-footer-panel nn-footer-panel--legal nn-footer-panel--bottom-meta px-4 py-5 sm:px-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
            <div className="min-w-0 text-center text-sm text-[var(--footer-muted)] lg:max-w-[min(100%,22rem)] lg:text-left">
              © {new Date().getFullYear()} {t("brand.nurseNest")}. {t("footer.rights")}
              <span className="mx-2 select-none opacity-60" aria-hidden="true">
                ·
              </span>
              <span className="whitespace-nowrap">{regionLabel}</span>
            </div>

            <div className="min-w-0 flex-1 lg:max-w-[28rem]">
              <h3 className="nn-footer-col-heading">{formatTitleCase(t("footer.studyInYourLanguage"), locale)}</h3>
              <div className="mb-2 flex flex-wrap justify-center gap-2 lg:justify-start">
                <MarketingLanguagePreferenceList
                  renderItem={({ code, name, flag, disabled, onSelect }) => (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={onSelect}
                      className={
                        code === locale
                          ? "nn-footer-premium-lang-btn nn-footer-premium-lang-btn--active"
                          : "nn-footer-premium-lang-btn"
                      }
                    >
                      <span>{flag}</span>
                      <span>{name}</span>
                    </button>
                  )}
                />
              </div>
              <Link
                href={externalMarketingLanguagesHref()}
                className="nn-footer-link nn-footer-premium-link nn-footer-premium-lang-all text-xs"
              >
                {formatTitleCase(t("footer.viewAllLanguages"), locale)}
              </Link>
            </div>

            {showThemePicker ? (
              <div className="nn-footer-premium-theme-rail flex min-w-0 shrink-0 flex-col gap-2 pt-4 lg:pt-0">
                <h3 className="nn-footer-col-heading text-center lg:text-left">{formatTitleCase(t("nav.theme"), locale)}</h3>
                <div className="flex justify-center lg:justify-start">
                  <ThemePicker
                    className="shrink-0"
                    dropdownPortal
                    pickerScope="publicMarketing"
                    labels={{
                      navTheme: t("nav.theme"),
                      themeGroupLight: t("nav.themeGroupLight"),
                      themeGroupDark: t("nav.themeGroupDark"),
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="nn-footer-premium-legal-disclaimer mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-[var(--footer-muted)]">
          {t("footer.legalDisclaimer")}
        </div>
      </div>
    </footer>
  );
}

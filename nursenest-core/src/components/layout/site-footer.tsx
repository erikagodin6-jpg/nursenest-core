"use client";

import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { resolveMarketingHref } from "@/lib/marketing/marketing-chrome-href";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { FooterBrandLockup } from "@/components/brand/footer-brand-lockup";
import { LeafWatermark } from "@/components/brand/leaf-watermark";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { publicMarketingExploreDestinations } from "@/lib/navigation/canonical-destinations";
import { footerMarketingNav } from "@/lib/navigation/footer-marketing-nav";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { SUPPORT_RESPONSE_TIME_COPY, supportMailtoHref } from "@/lib/support/support-policy";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";
import { ThemePicker } from "@/components/theme/theme-picker";
import { publicMarketingThemeChoiceCount } from "@/lib/theme/theme-registry";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { externalMarketingLanguagesHref } from "@/lib/marketing/marketing-public-site-origin";

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

export function SiteFooter() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const footerNav = footerMarketingNav(region);
  const explore = publicMarketingExploreDestinations(region);
  const pnRoleLabel = getNursingRoleLabel({ country: region, role: "PN" });
  const regionLabel = region === "US" ? "United States" : "Canada";
  const showThemePicker = publicMarketingThemeChoiceCount() > 1;

  return (
    <footer
      data-nn-footer-layout="marketing"
      data-nn-footer-premium="1"
      data-nn-footer-root
      className="nn-footer-premium-root nn-footer-marketing-chrome nn-footer-marketing-chrome--surface nn-footer-landing mt-auto border-t border-[var(--footer-border)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell nn-footer-marketing-shell">
        <div className="nn-footer-panel nn-footer-panel--main relative overflow-hidden px-5 py-7 sm:px-6 sm:py-8">
          <LeafWatermark
            className="inset-0 flex items-center justify-center"
            imageClassName="max-h-[min(48vw,18rem)] opacity-[0.055] sm:max-h-[min(40vw,20rem)] sm:opacity-[0.065]"
          />

          <div className="relative z-[1] space-y-8 md:space-y-9">
            <div className="nn-footer-premium-top nn-footer-columns grid grid-cols-1 gap-x-10 gap-y-10 xl:grid-cols-12">
              <div className="space-y-3 xl:col-span-3" data-nn-footer-brand>
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
                <p className="max-w-xs text-xs leading-relaxed text-[var(--footer-muted)]">
                  {formatSentenceCase(t("footer.supportingNursesGlobally"), locale)}
                </p>
              </div>

              <div className="nn-footer-premium-nav-grid grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:col-span-9">
                {/* COMPANY */}
                <FooterPremiumNavColumn
                  id="nn-footer-col-company"
                  title={formatTitleCase("Company", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href="/about">About</FLink>
                    </li>
                    <li>
                      <FLink href="/blog">Blog</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.contact}>Contact</FLink>
                    </li>
                    <li>
                      <FLink href="/careers">Careers</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                {/* EXAMS */}
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
                      <FLink href="/new-grad">New Grad</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.exams.allied}>
                        {formatTitleCase(t("footer.alliedHealth"), locale)}
                      </FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                {/* STUDY TOOLS */}
                <FooterPremiumNavColumn
                  id="nn-footer-col-study-tools"
                  title={formatTitleCase("Study Tools", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={explore.flashcards}>Flashcards</FLink>
                    </li>
                    <li>
                      <FLink href={explore.lessons}>Clinical Lessons</FLink>
                    </li>
                    <li>
                      <FLink href={explore.practiceQuestions}>Practice Questions</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.platform.cat}>CAT Exams</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                {/* SUPPORT */}
                <FooterPremiumNavColumn
                  id="nn-footer-col-support"
                  title={formatTitleCase("Support", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href={footerNav.resources.faq}>FAQ</FLink>
                    </li>
                    <li>
                      <FLink href={footerNav.support.helpCenter}>Help Center</FLink>
                    </li>
                    <FooterAccountSupportEmailBlock />
                    <li>
                      <FLink href="/support#account">Account Support</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>

                {/* LEGAL */}
                <FooterPremiumNavColumn
                  id="nn-footer-col-legal"
                  title={formatTitleCase("Legal", locale)}
                >
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    <li>
                      <FLink href="/privacy">Privacy</FLink>
                    </li>
                    <li>
                      <FLink href="/terms">Terms</FLink>
                    </li>
                    <li>
                      <FLink href="/disclaimer">Disclaimer</FLink>
                    </li>
                    <li>
                      <FLink href="/editorial-policy">Editorial Policy</FLink>
                    </li>
                  </ul>
                </FooterPremiumNavColumn>
              </div>
            </div>
          </div>
        </div>

        <div className="nn-footer-panel nn-footer-panel--legal nn-footer-panel--bottom-meta px-5 py-6 sm:px-6">
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
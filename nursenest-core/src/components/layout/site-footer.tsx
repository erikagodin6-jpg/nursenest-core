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
      <details className="nn-footer-premium-accordion" open>
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
  const regionLabel = region === "US" ? "United States" : "Canada";
  const showThemePicker = publicMarketingThemeChoiceCount() > 1;
  const newsletterAction = withMarketingLocale(locale, "/sign-up");
  const nursingExamLinks =
    region === "US"
      ? [
          { href: "/us/rn/nclex-rn", label: "United States RN NCLEX-RN" },
          { href: "/lvn-nclex-prep", label: "LVN / LPN NCLEX-PN" },
          { href: "/nclex-question-bank", label: "NCLEX Question Bank" },
          { href: "/cat-nclex-simulator", label: "NCLEX CAT Simulator" },
          { href: "/practice-exams", label: "Practice Exams" },
          { href: "/canada/rpn/rex-pn", label: "REx-PN Canada" },
          { href: "/canada/np/cnple", label: "Canadian NP CNPLE" },
        ]
      : [
          { href: "/canada/rn/nclex-rn", label: "Canadian NCLEX-RN" },
          { href: "/canada/rpn/rex-pn", label: "REx-PN for RPN" },
          { href: "/canada/np/cnple", label: "CNPLE for NP" },
          { href: "/nclex-question-bank", label: "NCLEX Question Bank" },
          { href: "/cat-nclex-simulator", label: "NCLEX CAT Simulator" },
          { href: "/practice-exams", label: "Practice Exams" },
          { href: "/us/rn/nclex-rn", label: "United States RN NCLEX-RN" },
        ];
  const studyResourceLinks = [
    { href: explore.lessons, label: "Lessons" },
    { href: explore.flashcards, label: "Flashcards" },
    { href: "/question-bank", label: "Question Bank" },
    { href: "/nclex-study-plan", label: "Study Plans" },
    { href: "/adaptive-nclex-testing", label: "Adaptive CAT" },
    { href: "/case-studies", label: "NGN Case Studies" },
    { href: "/labs-interpretation", label: "Lab Interpretation" },
    { href: "/ecg-telemetry-mastery", label: "ECG & Telemetry" },
  ];
  const alliedHealthLinks = [
    { href: footerNav.exams.allied, label: "Allied Health Programs" },
    { href: "/allied-health/respiratory-therapy", label: "Respiratory Therapy" },
    { href: "/medical-laboratory-technology/specialty-modules", label: "Medical Laboratory Technology" },
    { href: "/pre-nursing", label: "Pre-Nursing" },
    { href: "/pre-nursing", label: "ATI TEAS + HESI A2" },
  ];
  const studentResourceLinks = [
    { href: "/new-grad", label: "New Graduate Support" },
    { href: "/nclex-study-plan", label: "NCLEX Study Plan" },
    { href: "/blog", label: "Nursing Blog" },
    { href: "/nursing-glossary", label: "Nursing Glossary" },
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support" },
  ];
  const institutionLinks = [
    { href: "/for-institutions", label: "For Institutions" },
    { href: "/enterprise-solutions", label: "Enterprise Solutions" },
    { href: "/for-institutions", label: "Cohort Reporting" },
    { href: "/for-institutions", label: "Faculty Tools" },
    { href: "/pricing", label: "Pricing" },
  ];
  const socialLinks = [
    { href: "https://www.linkedin.com/company/nursenest", label: "LinkedIn" },
    { href: "https://www.instagram.com/nursenest", label: "Instagram" },
    { href: "https://www.youtube.com/@nursenest", label: "YouTube" },
  ];

  return (
    <footer
      data-nn-footer-layout="marketing"
      data-nn-footer-premium="1"
      data-nn-footer-root
      className="nn-footer-premium-root nn-footer-marketing-chrome nn-footer-marketing-chrome--surface nn-footer-landing mt-auto border-t border-[var(--footer-border)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell nn-footer-marketing-shell">
        <section className="nn-footer-newsletter relative overflow-hidden px-5 py-7 sm:px-8 sm:py-8" aria-labelledby="nn-footer-newsletter-heading">
          <div className="relative z-[1] grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="nn-footer-kicker">Clinical study notes</p>
              <h2 id="nn-footer-newsletter-heading" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--footer-fg)] sm:text-3xl">
                Build smarter study habits before your next exam window.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--footer-muted)]">
                Get concise nursing study updates, exam pathway notes, and new clinical resources from NurseNest.
              </p>
            </div>
            <form action={newsletterAction} method="get" className="nn-footer-newsletter-form" aria-label="Join the NurseNest study newsletter">
              <label htmlFor="nn-footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="nn-footer-newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="nn-footer-newsletter-input"
              />
              <button type="submit" className="nn-footer-newsletter-button">
                Start free
              </button>
            </form>
          </div>
        </section>

        <div className="nn-footer-panel nn-footer-panel--main relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
          <LeafWatermark
            className="inset-0 flex items-center justify-center"
            imageClassName="max-h-[min(48vw,18rem)] opacity-[0.055] sm:max-h-[min(40vw,20rem)] sm:opacity-[0.065]"
          />

          <div className="relative z-[1] space-y-10">
            <div className="nn-footer-premium-top grid grid-cols-1 gap-10 xl:grid-cols-[minmax(15rem,0.8fr)_minmax(0,2.4fr)]">
              <div className="space-y-5" data-nn-footer-brand>
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
                <div className="nn-footer-trust-stack">
                  <span>{regionLabel} learners</span>
                  <span>NCLEX + REx-PN aligned</span>
                  <span>Clinical reasoning first</span>
                </div>
                <div className="flex flex-wrap gap-2" aria-label="NurseNest social links">
                  {socialLinks.map((link) => (
                    <FLink key={link.label} href={link.href} className="nn-footer-social-link">
                      {link.label}
                    </FLink>
                  ))}
                </div>
              </div>

              <div className="nn-footer-premium-nav-grid grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <FooterPremiumNavColumn id="nn-footer-col-nursing-exams" title={formatTitleCase("Nursing Exams", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    {nursingExamLinks.map((link) => (
                      <li key={link.href}>
                        <FLink href={link.href}>{link.label}</FLink>
                      </li>
                    ))}
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn id="nn-footer-col-study-resources" title={formatTitleCase("Study Resources", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    {studyResourceLinks.map((link) => (
                      <li key={link.href}>
                        <FLink href={link.href}>{link.label}</FLink>
                      </li>
                    ))}
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn id="nn-footer-col-allied-health" title={formatTitleCase("Allied Health", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    {alliedHealthLinks.map((link) => (
                      <li key={link.href}>
                        <FLink href={link.href}>{link.label}</FLink>
                      </li>
                    ))}
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn id="nn-footer-col-student-resources" title={formatTitleCase("Student Resources", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    {studentResourceLinks.map((link) => (
                      <li key={link.href}>
                        <FLink href={link.href}>{link.label}</FLink>
                      </li>
                    ))}
                  </ul>
                </FooterPremiumNavColumn>

                <FooterPremiumNavColumn id="nn-footer-col-institutions" title={formatTitleCase("Institutions", locale)}>
                  <ul className="nn-footer-link-list text-sm text-[var(--footer-fg)]">
                    {institutionLinks.map((link) => (
                      <li key={link.label}>
                        <FLink href={link.href}>{link.label}</FLink>
                      </li>
                    ))}
                    <FooterAccountSupportEmailBlock />
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

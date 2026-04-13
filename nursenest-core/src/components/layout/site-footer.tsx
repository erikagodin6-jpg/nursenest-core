"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getNavChromeStyle } from "@/lib/theme/nav-chrome";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { marketingExamPrepHubs } from "@/lib/marketing/marketing-exam-navigation";
import { loginWithCallback, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import { PRIMARY_CTA } from "@/lib/copy/cta-copy";
import { formatTitleCase } from "@/lib/format/text-case";
import { SiteFooterFeedbackTrigger } from "@/components/layout/site-footer-feedback-trigger";
import { getNursingRoleLabel } from "@/lib/labels/nursing-role-labels";

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
  const { theme } = useTheme();
  const navChromeStyle = getNavChromeStyle(theme);
  const { region } = useNursenestRegion();
  const examHubs = marketingExamPrepHubs(region);
  const pnRoleLabel = getNursingRoleLabel({ country: region, role: "PN" });
  const learnerSignInHref = withMarketingLocale(locale, loginWithCallback("/app"));
  const startPracticingHref = withMarketingLocale(locale, "/signup?callbackUrl=%2Fapp");

  return (
    <footer
      style={navChromeStyle}
      className="mt-auto border-t border-[var(--footer-border)] py-[var(--nn-rhythm-footer-y)] shadow-[inset_0_1px_0_0_color-mix(in_srgb,var(--footer-fg)_6%,transparent)]"
    >
      <div className="nn-section-shell">
        <div className="mb-6 sm:mb-8">
          <EmailSignupBanner />
        </div>

        <div className="mb-6 rounded-2xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_4%,var(--footer-bg))] px-5 py-6 sm:px-6 sm:py-7">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center bg-transparent">
                <SiteBrandLogoMark variant="footer" logoVariant="leaf" />
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-[var(--footer-muted)]">
                Exam-focused prep for RN, {pnRoleLabel}, NP, and Allied Health learners across the United States and Canada.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--footer-fg)]">{formatTitleCase("Exam Pathways", locale)}</h3>
              <ul className="space-y-2.5 text-sm text-[var(--footer-fg)]">
                <li><FLink href={examHubs.rn}>RN</FLink></li>
                <li><FLink href={examHubs.pn}>{pnRoleLabel}</FLink></li>
                <li><FLink href={examHubs.np}>NP</FLink></li>
                <li><FLink href={examHubs.allied}>Allied Health</FLink></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--footer-fg)]">{formatTitleCase("Explore", locale)}</h3>
              <ul className="space-y-2.5 text-sm text-[var(--footer-fg)]">
                <li><FLink href="/pricing">Pricing</FLink></li>
                <li><FLink href="/lessons">Lessons</FLink></li>
                <li><FLink href={rnQuestions(region)}>Practice Questions</FLink></li>
                <li><FLink href="/blog">Blog</FLink></li>
                <li><FLink href="/tools">Tools</FLink></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--footer-fg)]">{formatTitleCase("Account", locale)}</h3>
              <ul className="space-y-2.5 text-sm text-[var(--footer-fg)]">
                <li><FLink href={learnerSignInHref}>Login</FLink></li>
                <li>
                  <Link
                    href={startPracticingHref}
                    className="nn-nav-cta inline-flex min-h-[40px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {formatTitleCase(PRIMARY_CTA, locale)}
                  </Link>
                </li>
                <li><FLink href="/contact">Contact Support</FLink></li>
                <SiteFooterFeedbackTrigger />
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_6%,var(--footer-bg))] px-5 py-5 sm:px-6 sm:py-6">
          <h3 className="mb-3 break-words text-base font-semibold leading-tight text-[var(--footer-fg)]">
            {formatTitleCase(t("footer.studyInYourLanguage"), locale)}
          </h3>
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <MarketingLanguagePreferenceList
              renderItem={({ code, name, flag, disabled, onSelect }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onSelect}
                  className={`inline-flex min-h-[34px] items-center rounded-full border px-3 py-1.5 text-sm leading-none transition-colors ${
                    code === locale
                      ? "border-[color-mix(in_srgb,var(--footer-fg)_42%,transparent)] bg-[color-mix(in_srgb,var(--footer-fg)_16%,transparent)] font-semibold text-[var(--footer-fg)]"
                      : "border-[color-mix(in_srgb,var(--footer-fg)_24%,transparent)] bg-[color-mix(in_srgb,var(--footer-fg)_8%,transparent)] text-[color-mix(in_srgb,var(--footer-fg)_90%,var(--footer-bg))] hover:border-[color-mix(in_srgb,var(--footer-fg)_36%,transparent)] hover:text-[var(--footer-fg)]"
                  }`}
                >
                  <span aria-hidden>{flag}</span>
                  <span className="whitespace-nowrap">{name}</span>
                </button>
              )}
            />
          </div>
          <Link
            href={mapLegacyMarketingHref("/languages")}
            className="inline-flex min-h-[36px] items-center rounded-full border border-[color-mix(in_srgb,var(--footer-fg)_30%,transparent)] bg-[color-mix(in_srgb,var(--footer-fg)_10%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--footer-fg)] transition-colors hover:bg-[color-mix(in_srgb,var(--footer-fg)_18%,transparent)]"
          >
            {formatTitleCase(t("footer.viewAllLanguages"), locale)}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[var(--footer-border)] bg-[color-mix(in_srgb,var(--footer-fg)_5%,var(--footer-bg))] px-5 py-5 sm:px-6 md:flex-row">
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

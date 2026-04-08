"use client";

import Link from "next/link";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MarketingLanguagePreferenceList } from "@/components/i18n/marketing-language-preference";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { marketingExamPrepHubs } from "@/lib/marketing/marketing-exam-navigation";
import { rnQuestions } from "@/lib/marketing/marketing-entry-routes";

function FLink({
  href,
  children,
  className = "break-words leading-snug transition-colors [overflow-wrap:anywhere] hover:text-primary",
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
        {children}
      </a>
    );
  }
  const path = to.startsWith("/") ? to : `/${to}`;
  return (
    <Link href={withMarketingLocale(locale, path)} className={className}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const examHubs = marketingExamPrepHubs(region);

  return (
    <footer className="mt-auto border-t border-[var(--divider,var(--theme-nav-border))] bg-[var(--bg-section,var(--theme-card-bg))] py-[var(--nn-rhythm-footer-y)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <EmailSignupBanner />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 sm:mb-8">
          <div>
            <h3 className="mb-3 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.studyTools")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/lessons">{t("footer.clinicalLessons")}</FLink>
              </li>
              <li>
                <FLink href="/flashcards">{t("nav.flashcards")}</FLink>
              </li>
              <li>
                <FLink href="/pre-nursing">{t("footer.preNursing")}</FLink>
              </li>
              <li>
                <FLink href="/med-math">{t("footer.medMath")}</FLink>
              </li>
              <li>
                <FLink href="/anatomy">{t("footer.anatomyExplorer")}</FLink>
              </li>
              <li>
                <FLink href="/practice-exams">{t("footer.mockExams")}</FLink>
              </li>
              <li>
                <FLink href={rnQuestions(region)}>{t("footer.testBank")}</FLink>
              </li>
              <li>
                <FLink href="/case-studies">{t("footer.caseStudies")}</FLink>
              </li>
              <li>
                <FLink href="/tools">{t("footer.clinicalTools")}</FLink>
              </li>
              <li>
                <FLink href="/blog">{t("footer.blog")}</FLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.examPrep")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/exam-prep">{t("footer.linkNursingExamPrepHub")}</FLink>
              </li>
              <li>
                <FLink href={examHubs.rn}>{t("footer.linkNclexRnPrep")}</FLink>
              </li>
              <li>
                <FLink href={examHubs.pn}>
                  {region === "US" ? t("footer.linkPnExamPrepUs") : t("footer.linkPnExamPrepCa")}
                </FLink>
              </li>
              <li>
                <FLink href={examHubs.np}>
                  {region === "US" ? t("footer.linkNpExamPrepUs") : t("footer.linkNpExamPrepCa")}
                </FLink>
              </li>
              <li>
                <FLink href="/question-of-the-day">{t("footer.questionOfTheDay")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.newGradSupportSection")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/newgrad">{t("footer.newGradHub")}</FLink>
              </li>
              <li>
                <FLink href="/new-grad/nursing">{t("footer.nursing")}</FLink>
              </li>
              <li>
                <FLink href="/new-grad/paramedic">{t("footer.paramedic")}</FLink>
              </li>
              <li>
                <FLink href="/new-grad/respiratory-therapy">{t("footer.respiratoryTherapy")}</FLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.resources")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/shop">{t("nav.store")}</FLink>
              </li>
              <li>
                <FLink href="/pricing">{t("footer.pricing")}</FLink>
              </li>
              <li>
                <FLink href="/faq">{t("footer.faq")}</FLink>
              </li>
              <li>
                <FLink href="/contact">{t("footer.contact")}</FLink>
              </li>
              <li>
                <FLink href="/about">{t("footer.about")}</FLink>
              </li>
              <li>
                <FLink href="/for-institutions">{t("footer.forSchools")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.nursingSpecialties")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/nursing-specialties">{t("footer.allSpecialties")}</FLink>
              </li>
              <li>
                <FLink href="/guides/icu-nursing-ultimate-guide">{t("footer.icuGuide")}</FLink>
              </li>
              <li>
                <FLink href="/guides/nicu-nursing-ultimate-guide">{t("footer.nicuGuide")}</FLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/terms">{t("footer.terms")}</FLink>
              </li>
              <li>
                <FLink href="/privacy">{t("footer.privacy")}</FLink>
              </li>
              <li>
                <FLink href="/disclaimer">{t("footer.disclaimer")}</FLink>
              </li>
              <li>
                <FLink href="/refund-policy">{t("footer.refundPolicy")}</FLink>
              </li>
              <li>
                <FLink href="/acceptable-use">{t("footer.acceptableUse")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.alliedHealth")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/allied-health">{t("footer.alliedHealthExamPrep")}</FLink>
              </li>
              <li>
                <FLink href="/allied-health/rrt-exam-prep">{t("footer.linkAlliedRespiratoryTherapy")}</FLink>
              </li>
              <li>
                <FLink href="/allied-health/paramedic-exam-prep">{t("footer.linkAlliedParamedic")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.educationEcosystem")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/">{t("footer.linkEcosystemNursenest")}</FLink>
              </li>
              <li>
                <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                  {t("footer.linkEcosystemApplynest")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6 border-t border-[var(--theme-separator)] pb-6 pt-6">
          <h3 className="mb-3 break-words text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.studyInYourLanguage")}</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            <MarketingLanguagePreferenceList
              renderItem={({ code, name, flag, disabled, onSelect }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={onSelect}
                  className={`inline-flex items-center gap-1 text-xs hover:text-primary ${
                    code === locale ? "font-semibold text-primary" : "text-[var(--theme-muted-text)]"
                  }`}
                >
                  <span>{flag}</span>
                  <span>{name}</span>
                </button>
              )}
            />
          </div>
          <Link href={mapLegacyMarketingHref("/languages")} className="text-xs text-primary hover:underline">
            {t("footer.viewAllLanguages")}
          </Link>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--theme-separator)] pt-6 md:flex-row">
          <div className="flex items-center gap-2 bg-transparent">
            <SiteBrandLogoMark variant="footer" />
          </div>
          <div className="text-sm text-[var(--theme-muted-text)]">
            © {new Date().getFullYear()} {t("brand.nurseNest")}. {t("footer.rights")}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-[var(--theme-muted-text)] opacity-70">
          {t("footer.legalDisclaimer")}
        </div>
      </div>
    </footer>
  );
}

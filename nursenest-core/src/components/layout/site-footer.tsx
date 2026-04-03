"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";
import { EmailSignupBanner } from "@/components/marketing/email-signup-banner";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { stripMarketingLocalePrefix, withMarketingLocale } from "@/lib/i18n/marketing-path";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { npPracticeProgrammatic, pnPracticeProgrammatic } from "@/lib/marketing/marketing-entry-routes";

function FLink({
  href,
  children,
  className = "transition-colors hover:text-primary",
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
  const localized = withMarketingLocale(locale, to);
  return (
    <Link href={localized} className={className}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const { pathname: pathWithoutLocale } = stripMarketingLocalePrefix(pathname);
  const pathForLanguageSwitch = pathWithoutLocale || "/";
  const { t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const pnPrepHref = pnPracticeProgrammatic(region);
  const npPrepHref = npPracticeProgrammatic(region);

  return (
    <footer className="mt-auto border-t border-[var(--divider,var(--theme-nav-border))] bg-[var(--bg-section,var(--theme-card-bg))] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <EmailSignupBanner />
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.studyTools")}</h3>
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
                <FLink href="/mock-exams">{t("footer.mockExams")}</FLink>
              </li>
              <li>
                <FLink href="/free-practice">{t("footer.testBank")}</FLink>
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
            <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.examPrep")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/exam-prep">{t("components.footer.nursingExamPrepHub")}</FLink>
              </li>
              <li>
                <FLink href="/nclex-rn">{t("components.footer.nclexrnPrep")}</FLink>
              </li>
              <li>
                <FLink href={pnPrepHref}>
                  {region === "US" ? t("components.footer.pnExamPrepUs") : t("components.footer.pnExamPrepCa")}
                </FLink>
              </li>
              <li>
                <FLink href={npPrepHref}>
                  {region === "US" ? t("components.footer.npExamPrepUs") : t("components.footer.npExamPrepCa")}
                </FLink>
              </li>
              <li>
                <FLink href="/question-of-the-day">{t("footer.questionOfTheDay")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.newGradSupportSection")}</h3>
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
            <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.resources")}</h3>
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
            <h3 className="mb-3 mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.nursingSpecialties")}</h3>
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
            <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.legal")}</h3>
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
            <h3 className="mb-3 mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.alliedHealth")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/allied-health">{t("footer.alliedHealthExamPrep")}</FLink>
              </li>
              <li>
                <FLink href="/allied-health/rrt-exam-prep">{t("components.footer.respiratoryTherapist")}</FLink>
              </li>
              <li>
                <FLink href="/allied-health/paramedic-exam-prep">{t("components.footer.paramedic")}</FLink>
              </li>
            </ul>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.educationEcosystem")}</h3>
            <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
              <li>
                <FLink href="/">{t("components.footer.nursenestNursingAndHealthcareExam")}</FLink>
              </li>
              <li>
                <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                  {t("components.footer.applynestHealthcareProgramApplicationsAnd")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6 border-t border-[var(--theme-separator)] pb-6 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("footer.studyInYourLanguage")}</h3>
          <div className="mb-3 flex flex-wrap gap-2">
            {MARKETING_LANGUAGES.map(({ code, flag, name }) => (
              <Link
                key={code}
                href={
                  code === DEFAULT_MARKETING_LOCALE
                    ? pathForLanguageSwitch
                    : withMarketingLocale(code, pathForLanguageSwitch)
                }
                className="inline-flex items-center gap-1 text-xs text-[var(--theme-muted-text)] hover:text-primary"
              >
                <span>{flag}</span>
                <span>{name}</span>
              </Link>
            ))}
          </div>
          <Link href={mapLegacyMarketingHref("/languages")} className="text-xs text-primary hover:underline">
            {t("footer.viewAllLanguages")}
          </Link>
        </div>

        <div className="mb-6 border-t border-[var(--theme-separator)] pb-6 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--theme-heading-text)]">{t("components.footer.ourEducationEcosystem")}</h3>
          <ul className="space-y-2 text-sm text-[var(--theme-muted-text)]">
            <li>
              <FLink href="/" className="font-medium transition-colors hover:text-primary">
                NurseNest
              </FLink>
              <span className="ml-1">{t("components.footer.nursingExamPrepClinicalTools")}</span>
            </li>
            <li>
              <a href="https://applynest.ca" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:text-primary">
                ApplyNest
              </a>
              <span className="ml-1">{t("components.footer.healthcareProgramApplicationsAdmissionsAnd")}</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--theme-separator)] pt-6 md:flex-row">
          <div className="flex items-center gap-2 bg-transparent">
            <SiteBrandLogoMark />
          </div>
          <div className="text-sm text-[var(--theme-muted-text)]">
            © {new Date().getFullYear()} NurseNest. {t("footer.rights")}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-[var(--theme-muted-text)] opacity-70">
          {t("footer.legalDisclaimer")}
        </div>
      </div>
    </footer>
  );
}

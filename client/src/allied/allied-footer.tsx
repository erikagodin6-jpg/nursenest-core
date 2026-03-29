import { Link } from "wouter";
import { GraduationCap, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getMainSiteUrl } from "@/lib/locale-utils";

function useLocaleCode(): string | undefined {
  const { language } = useI18n();
  return language === "en" ? undefined : language;
}

export function AlliedFooter() {
  const { t } = useI18n();
  const locale = useLocaleCode();

  const mainSiteHome = getMainSiteUrl("/", locale);
  const mainSitePricing = getMainSiteUrl("/pricing", locale);
  const mainSiteNewGrad = getMainSiteUrl("/new-grad", locale);
  const mainSiteCareerTools = getMainSiteUrl("/new-grad#career-tools", locale);
  const mainSiteFaq = getMainSiteUrl("/faq", locale);

  return (
    <footer className="bg-white border-t border-teal-100 py-12 mt-auto" data-testid="allied-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.careers")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/allied-health/rrt" className="hover:text-teal-600 transition-colors" data-testid="link-footer-rrt">{t("allied.alliedFooter.respiratoryTherapist")}</Link></li>
              <li><Link href="/allied-health/paramedic" className="hover:text-teal-600 transition-colors" data-testid="link-footer-paramedic">{t("allied.alliedFooter.paramedic")}</Link></li>
              <li><Link href="/allied-health/pharmacy-technician" className="hover:text-teal-600 transition-colors" data-testid="link-footer-pharmacy-tech">{t("allied.alliedFooter.pharmacyTechnician")}</Link></li>
              <li><Link href="/allied-health/mlt" className="hover:text-teal-600 transition-colors" data-testid="link-footer-mlt">{t("allied.alliedFooter.medicalLabTech")}</Link></li>
              <li><Link href="/allied-health/imaging" className="hover:text-teal-600 transition-colors" data-testid="link-footer-imaging">{t("allied.alliedFooter.diagnosticImaging")}</Link></li>
              <li><Link href="/allied-health/occupational-therapy" className="hover:text-teal-600 transition-colors" data-testid="link-footer-occupational-therapy">{t("allied.alliedFooter.occupationalTherapy")}</Link></li>
              <li><Link href="/allied-health/physical-therapy" className="hover:text-teal-600 transition-colors" data-testid="link-footer-physical-therapy">{t("allied.alliedFooter.physicalTherapy")}</Link></li>
              <li><Link href="/allied-health/social-work" className="hover:text-teal-600 transition-colors" data-testid="link-footer-social-work">{t("allied.alliedFooter.socialWork")}</Link></li>
              <li><Link href="/allied-health/psychotherapy" className="hover:text-teal-600 transition-colors" data-testid="link-footer-psychotherapy">{t("allied.alliedFooter.psychotherapy")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.studyTools")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/careers" className="hover:text-teal-600 transition-colors" data-testid="link-footer-careers">{t("allied.alliedFooter.careerDirectory")}</Link></li>
              <li><Link href="/pricing/allied" className="hover:text-teal-600 transition-colors" data-testid="link-footer-pricing">{t("allied.alliedFooter.pricing")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.nursenestMainSite")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href={mainSiteHome} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-main-home">
                  Homepage <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={mainSitePricing} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-main-pricing">
                  Pricing <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={mainSiteHome} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-exam-prep">
                  Exam Prep (Nursing) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={mainSiteNewGrad} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-new-grad-support">
                  New Grad Support <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={mainSiteFaq} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-main-faq">
                  FAQ <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.nursenestEcosystem")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href={mainSiteCareerTools} className="hover:text-teal-600 transition-colors flex items-center gap-1" data-testid="link-footer-healthcare-jobs">
                  Healthcare Jobs (ApplyNest) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.legal")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="https://www.nursenest.ca/en/terms" className="hover:text-teal-600 transition-colors" data-testid="link-footer-terms">{t("allied.alliedFooter.terms")}</a></li>
              <li><a href="https://www.nursenest.ca/en/privacy" className="hover:text-teal-600 transition-colors" data-testid="link-footer-privacy">{t("allied.alliedFooter.privacy")}</a></li>
              <li><a href="https://www.nursenest.ca/en/disclaimer" className="hover:text-teal-600 transition-colors" data-testid="link-footer-disclaimer">{t("allied.alliedFooter.disclaimer")}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 pb-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t("allied.alliedFooter.studyNursingInYourLanguage")}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { locale: "en", flag: "\ud83c\uddec\ud83c\udde7", name: "English" },
              { locale: "fr", flag: "\ud83c\uddeb\ud83c\uddf7", name: "Fran\u00e7ais" },
              { locale: "es", flag: "\ud83c\uddea\ud83c\uddf8", name: "Espa\u00f1ol" },
              { locale: "fil", flag: "\ud83c\uddf5\ud83c\udded", name: "Tagalog" },
              { locale: "hi", flag: "\ud83c\uddee\ud83c\uddf3", name: "\u0939\u093f\u0928\u094d\u0926\u0940" },
              { locale: "zh", flag: "\ud83c\udde8\ud83c\uddf3", name: "\u4e2d\u6587" },
              { locale: "zh-tw", flag: "\ud83c\uddf9\ud83c\uddfc", name: "\u7e41\u9ad4\u4e2d\u6587" },
              { locale: "ar", flag: "\ud83c\uddf8\ud83c\udde6", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629" },
              { locale: "ko", flag: "\ud83c\uddf0\ud83c\uddf7", name: "\ud55c\uad6d\uc5b4" },
              { locale: "pt", flag: "\ud83c\udde7\ud83c\uddf7", name: "Portugu\u00eas" },
              { locale: "pa", flag: "\ud83c\udde8\ud83c\udde6", name: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40" },
              { locale: "vi", flag: "\ud83c\uddfb\ud83c\uddf3", name: "Ti\u1ebfng Vi\u1ec7t" },
              { locale: "ht", flag: "\ud83c\udded\ud83c\uddf9", name: "Krey\u00f2l" },
              { locale: "ur", flag: "\ud83c\uddf5\ud83c\uddf0", name: "\u0627\u0631\u062f\u0648" },
              { locale: "ja", flag: "\ud83c\uddef\ud83c\uddf5", name: "\u65e5\u672c\u8a9e" },
              { locale: "fa", flag: "\ud83c\uddee\ud83c\uddf7", name: "\u0641\u0627\u0631\u0633\u06cc" },
              { locale: "de", flag: "\ud83c\udde9\ud83c\uddea", name: "Deutsch" },
              { locale: "th", flag: "\ud83c\uddf9\ud83c\udded", name: "\u0e44\u0e17\u0e22" },
              { locale: "tr", flag: "\ud83c\uddf9\ud83c\uddf7", name: "T\u00fcrk\u00e7e" },
              { locale: "id", flag: "\ud83c\uddee\ud83c\udde9", name: "Indonesia" },
            ].map(({ locale, flag, name }) => (
              <a
                key={locale}
                href={`https://www.nursenest.ca/${locale}`}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-teal-600 transition-colors"
                data-testid={`link-footer-lang-${locale}`}
              >
                <span>{flag}</span>
                <span>{name}</span>
              </a>
            ))}
          </div>
          <a href="https://www.nursenest.ca/en/languages" className="text-xs text-teal-600 hover:underline" data-testid="link-footer-all-languages">
            View all languages &rarr;
          </a>
        </div>
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">{t("allied.alliedFooter.nursenestAllied")}</span>
            <span className="text-xs text-gray-400">{t("allied.alliedFooter.healthcareExamAcademy")}</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} NurseNest Allied. All rights reserved.
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Educational tool only. Not affiliated with official licensing bodies. Always follow your facility policies, educator guidance, and provider orders.
        </div>
      </div>
    </footer>
  );
}

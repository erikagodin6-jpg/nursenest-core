import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
export default function DisclaimerPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-warmwhite flex flex-col" data-testid="disclaimer-page">
      <SEO title={t("pages.disclaimer.disclaimerNursenest")} description={t("pages.disclaimer.importantDisclaimersAboutNursenestEducational")} canonicalPath="/disclaimer" />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav />
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-disclaimer-title"
          >
            Disclaimer
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-disclaimer-subtitle"
          >
            Important information about the nature and limitations of NurseNest.
          </p>
          <p className="text-sm text-gray-400 mt-2" data-testid="text-disclaimer-effective-date">
            Effective Date: February 20, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6 sm:p-10 space-y-10">

          <section data-testid="section-educational-only">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.educationalPurposesOnly")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest is an educational platform designed to support nursing students and professionals in their studies and exam preparation. All content: including lessons, practice questions, rationales, flashcards, and supplementary materials: is provided strictly for educational and informational purposes. NurseNest is intended to complement, not replace, formal nursing education, clinical training, or supervised clinical practice.
            </p>
          </section>

          <section data-testid="section-not-medical-advice">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.notMedicalOrClinicalAdvice")}</h2>
            <p className="text-gray-700 leading-relaxed">
              The content on NurseNest does not constitute medical advice, clinical guidance, or professional healthcare recommendations. The information presented should not be used to diagnose, treat, or manage any medical condition. Always consult with qualified healthcare professionals and rely on your clinical training and institutional protocols when making clinical decisions.
            </p>
          </section>

          <section data-testid="section-no-relationship">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.noProviderpatientRelationship")}</h2>
            <p className="text-gray-700 leading-relaxed">
              Use of NurseNest does not create a provider-patient, clinician-client, or any other professional healthcare relationship between you and NurseNest, its creators, contributors, or affiliates. The Platform is a learning tool and should be treated as such.
            </p>
          </section>

          <section data-testid="section-no-guarantee">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.noGuaranteeOfOutcomes")}</h2>
            <p className="text-gray-700 leading-relaxed">
              While NurseNest strives to provide high-quality, accurate, and up-to-date educational content, we make no guarantees regarding exam results, academic performance, clinical competency, or career outcomes. Success on licensing examinations and in clinical practice depends on many factors beyond the scope of any single educational resource. NurseNest is one tool among many in your professional development.
            </p>
          </section>

          <section data-testid="section-institutional-policies">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.followInstitutionalPolicies")}</h2>
            <p className="text-gray-700 leading-relaxed">
              Users are responsible for adhering to the policies, procedures, and standards established by their educational institutions, clinical placement sites, employers, and applicable nursing regulatory bodies. In the event of any discrepancy between NurseNest content and the guidelines of your institution or regulatory body, you must follow your institution's or regulatory body's guidance.
            </p>
          </section>

          <section data-testid="section-no-exam-affiliation">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.disclaimer.notAffiliatedWithAnyExam")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest is an independent educational platform. We are not affiliated with, endorsed by, or officially connected to the National Council Licensure Examination (NCLEX), the National Council of State Boards of Nursing (NCSBN), the College of Nurses of Ontario (CNO), or any other nursing regulatory authority or examination body. All practice questions and educational content are original works created by our team. References to exam formats, nursing standards, or regulatory frameworks are included for educational context only.
            </p>
          </section>

          <section data-testid="section-disclaimer-contact" className="border-t border-primary/10 pt-6">
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this disclaimer, please contact us at{" "}
              <a
                href="mailto:support@nursenest.com"
                className="text-primary underline hover:text-primary/80"
                data-testid="link-disclaimer-contact-email"
              >
                support@nursenest.com
              </a>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              See also our{" "}
              <LocaleLink href="/terms" className="text-primary underline hover:text-primary/80" data-testid="link-terms">
                Terms of Use
              </LocaleLink>{" "}
              and{" "}
              <LocaleLink href="/privacy" className="text-primary underline hover:text-primary/80" data-testid="link-privacy">
                Privacy Policy
              </LocaleLink>.
            </p>
          </section>

        </div>
      </div>
      <AdminEditButton pageName="disclaimer" />
      <Footer />
    </div>
  );
}
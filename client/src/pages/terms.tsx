import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
export default function TermsPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-warmwhite flex flex-col" data-testid="terms-page">
      <SEO title={t("pages.terms.termsOfServiceNursenest")} description={t("pages.terms.nursenestTermsOfServiceReview")} canonicalPath="/terms" />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav />
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-terms-title"
          >
            Terms of Use
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-terms-subtitle"
          >
            Please read these terms carefully before using NurseNest.
          </p>
          <p className="text-sm text-gray-400 mt-2" data-testid="text-terms-effective-date">
            Effective Date: February 20, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6 sm:p-10 space-y-10">

          <section data-testid="section-acceptance">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.1AcceptanceOfTerms")}</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using NurseNest (the "Platform"), including any content, features, or services offered through the Platform, you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, you must not access or use the Platform. Your continued use of NurseNest constitutes your acceptance of these Terms and any future modifications.
            </p>
          </section>

          <section data-testid="section-educational-purpose">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.2EducationalPurposeOnly")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              NurseNest is an educational resource designed to support nursing students and professionals in their learning journey. The content provided on this Platform is intended solely for educational and informational purposes.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.nursenestDoesNotProvideMedical")}</li>
              <li>{t("pages.terms.thePlatformIsNotA")}</li>
              <li>{t("pages.terms.noProviderpatientRelationshipIsCreated")}</li>
              <li>{t("pages.terms.usersMustAlwaysFollowThe")}</li>
              <li>{t("pages.terms.contentOnNursenestDoesNot")}</li>
            </ul>
          </section>

          <section data-testid="section-no-affiliation">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.3NoExamBodyAffiliation")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest is an independent educational platform. We are not affiliated with, endorsed by, or representative of the National Council Licensure Examination (NCLEX), the National Council of State Boards of Nursing (NCSBN), the College of Nurses of Ontario (CNO), or any other nursing regulatory body or examination authority. All questions, content, and educational materials on NurseNest are original works created by our team. Any references to exam formats or nursing standards are for educational context only and do not imply any official connection or endorsement.
            </p>
          </section>

          <section data-testid="section-account-terms">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.4AccountTerms")}</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.eachIndividualMayMaintainOnly")}</li>
              <li>{t("pages.terms.accountCredentialsArePersonalAnd")}</li>
              <li>{t("pages.terms.youAreFullyResponsibleFor")}</li>
              <li>{t("pages.terms.youMustBeAtLeast")}</li>
              <li>{t("pages.terms.youAgreeToProvideAccurate")}</li>
            </ul>
          </section>

          <section data-testid="section-subscription-billing">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.5SubscriptionBilling")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              NurseNest offers subscription-based access to premium content and features. By subscribing, you agree to the following:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.subscriptionsAreBilledOnA")}</li>
              <li>{t("pages.terms.yourSubscriptionWillAutomaticallyRenew")}</li>
              <li>{t("pages.terms.youWillBeNotifiedBefore")}</li>
              <li>{t("pages.terms.cancellationOfYourSubscriptionWill")}</li>
              <li>{t("pages.terms.allPaymentsAreProcessedSecurely")}</li>
            </ul>
          </section>

          <section data-testid="section-refund-policy">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.6RefundCancellationPolicy")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Due to the digital nature of the Platform and immediate access granted upon subscription:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.subscriptionFeesAreGenerallyNonrefundable")}</li>
              <li>{t("pages.terms.firsttimeSubscribersAreEligibleFor")}</li>
              <li>{t("pages.terms.noPartialperiodRefundsWillBe")}</li>
              <li>{t("pages.terms.purchasesOfTrialPassesOr")}</li>
              <li>{t("pages.terms.exceptionsToThisPolicyMay")}</li>
            </ul>
          </section>

          <section data-testid="section-intellectual-property">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.7IntellectualProperty")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              All content available on NurseNest: including but not limited to lessons, practice questions, answer rationales, graphics, illustrations, interface design, educational frameworks, software code, and branding: is the intellectual property of NurseNest and is protected by applicable copyright, trademark, and intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your subscription grants you a limited, non-transferable, non-exclusive, revocable license to access and use the Platform's content for your personal educational purposes only. This license does not transfer any ownership rights to you.
            </p>
          </section>

          <section data-testid="section-prohibited-conduct">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.8ProhibitedConduct")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to engage in any of the following activities:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.copyingDownloadingOrScreenshottingContent")}</li>
              <li>{t("pages.terms.scrapingCrawlingOrUsingAutomated")}</li>
              <li>{t("pages.terms.sharingYourAccountCredentialsWith")}</li>
              <li>{t("pages.terms.usingAnyNursenestContentFor")}</li>
              <li>{t("pages.terms.republishingOrDistributingPracticeQuestions")}</li>
              <li>{t("pages.terms.attemptingToReverseengineerDecompileOr")}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3 font-medium">
              Violation of any of the above may result in immediate termination of your account without refund.
            </p>
          </section>

          <section data-testid="section-content-usage">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.9ContentUsageRestrictions")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Your access to NurseNest content is subject to the following restrictions:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.youAreGrantedALimited")}</li>
              <li>{t("pages.terms.youMayNotRedistributePublish")}</li>
              <li>{t("pages.terms.youMayNotUseNursenest")}</li>
              <li>{t("pages.terms.youMayNotCreateDerivative")}</li>
            </ul>
          </section>

          <section data-testid="section-liability">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.10LimitationOfLiability")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              The Platform and all content are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.nursenestDoesNotGuaranteeExam")}</li>
              <li>{t("pages.terms.nursenestIsNotLiableFor")}</li>
              <li>{t("pages.terms.toTheMaximumExtentPermitted")}</li>
            </ul>
          </section>

          <section data-testid="section-clinical-responsibility">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.11ClinicalResponsibility")}</h2>
            <p className="text-gray-700 leading-relaxed">
              You acknowledge and agree that you are solely responsible for your own clinical decisions and professional conduct. NurseNest is an educational tool and does not replace clinical training, supervision, or professional judgment. You must always follow the standards, protocols, and guidelines established by your employer, educational institution, and applicable regulatory bodies. NurseNest assumes no responsibility for clinical actions taken by users.
            </p>
          </section>

          <section data-testid="section-termination">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.12AccountTermination")}</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li>{t("pages.terms.nursenestReservesTheRightTo")}</li>
              <li>{t("pages.terms.youMayDeleteYourAccount")}</li>
            </ul>
          </section>

          <section data-testid="section-privacy">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.13Privacy")}</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <LocaleLink href="/privacy" className="text-primary underline hover:text-primary/80" data-testid="link-privacy-policy">
                Privacy Policy
              </LocaleLink>{" "}
              to understand how we collect, use, and protect your personal information. By using NurseNest, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section data-testid="section-governing-law">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.14GoverningLaw")}</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Ontario, Canada.
            </p>
          </section>

          <section data-testid="section-changes">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.15ChangesToTerms")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest reserves the right to update or modify these Terms at any time. When we make changes, we will update the effective date at the top of this page. Your continued use of the Platform following the posting of revised Terms constitutes your acceptance of those changes. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section data-testid="section-contact">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.terms.16Contact")}</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about these Terms of Use, please contact us at{" "}
              <a
                href="mailto:support@nursenest.ca"
                className="text-primary underline hover:text-primary/80"
                data-testid="link-contact-email"
              >
                support@nursenest.ca
              </a>.
            </p>
          </section>

        </div>
      </div>
      <AdminEditButton pageName="terms" />
      <Footer />
    </div>
  );
}
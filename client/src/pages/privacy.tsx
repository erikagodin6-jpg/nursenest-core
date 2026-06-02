import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { SEO } from "@/components/seo";

import { useI18n } from "@/lib/i18n";
export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-warmwhite flex flex-col" data-testid="privacy-page">
      <SEO title={t("pages.privacy.privacyPolicyNursenest")} description={t("pages.privacy.nursenestPrivacyPolicyLearnHow")} canonicalPath="/privacy" />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav />
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-privacy-title"
          >
            Privacy Policy
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-privacy-subtitle"
          >
            How NurseNest collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-gray-400 mt-2" data-testid="text-privacy-effective-date">
            Effective Date: February 20, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-6 sm:p-10 space-y-10">

          <section data-testid="section-data-collected">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.1InformationWeCollect")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect the following types of information when you use NurseNest:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>{t("pages.privacy.accountInformation")}</strong> {t("pages.privacy.yourEmailAddressUsernameAnd")}</li>
              <li><strong>{t("pages.privacy.paymentInformation")}</strong> {t("pages.privacy.paymentDetailsAreCollectedAnd")}</li>
              <li><strong>{t("pages.privacy.usageAnalytics")}</strong> {t("pages.privacy.informationAboutHowYouInteract")}</li>
              <li><strong>{t("pages.privacy.deviceBrowserInformation")}</strong> {t("pages.privacy.basicTechnicalInformationSuchAs")}</li>
            </ul>
          </section>

          <section data-testid="section-data-usage">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.2HowWeUseYour")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>{t("pages.privacy.accountManagement")}</strong> {t("pages.privacy.toCreateAndManageYour")}</li>
              <li><strong>{t("pages.privacy.paymentProcessing")}</strong> {t("pages.privacy.toProcessSubscriptionPaymentsManage")}</li>
              <li><strong>{t("pages.privacy.serviceImprovement")}</strong> {t("pages.privacy.toAnalyzeUsagePatternsIdentify")}</li>
              <li><strong>{t("pages.privacy.communication")}</strong> {t("pages.privacy.toSendYouImportantAccount")}</li>
              <li><strong>{t("pages.privacy.security")}</strong> {t("pages.privacy.toDetectAndPreventFraud")}</li>
            </ul>
          </section>

          <section data-testid="section-third-party">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.3ThirdpartyServiceProviders")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We work with trusted third-party service providers to operate the Platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>{t("pages.privacy.stripe")}</strong> Handles all payment processing. Stripe's use of your personal data is governed by their own{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{t("pages.privacy.privacyPolicy")}</a>.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section data-testid="section-cookies">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.4CookiesTracking")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest uses minimal, functional cookies that are essential for the operation of the Platform. These cookies are used to maintain your session, remember your preferences (such as region and theme settings), and ensure the Platform functions correctly. We do not use third-party advertising or tracking cookies. We do not engage in cross-site tracking.
            </p>
          </section>

          <section data-testid="section-data-retention">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.5DataRetention")}</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you with our services. If you delete your account, we will remove your personal data from our active systems within a reasonable timeframe, except where retention is required by law (for example, for tax or legal compliance purposes). Anonymized usage data may be retained indefinitely for analytics and service improvement.
            </p>
          </section>

          <section data-testid="section-user-rights">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.6YourRights")}</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
              <li><strong>{t("pages.privacy.access")}</strong> {t("pages.privacy.youMayRequestACopy")}</li>
              <li><strong>{t("pages.privacy.correction")}</strong> {t("pages.privacy.youMayUpdateOrCorrect")}</li>
              <li><strong>{t("pages.privacy.deletion")}</strong> You may request the deletion of your account and associated personal data by contacting our support team at{" "}
                <a href="mailto:support@nursenest.ca" className="text-primary underline hover:text-primary/80">{t("pages.privacy.supportnursenestca")}</a>.
              </li>
              <li><strong>{t("pages.privacy.dataPortability")}</strong> {t("pages.privacy.whereTechnicallyFeasibleYouMay")}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:support@nursenest.ca" className="text-primary underline hover:text-primary/80">{t("pages.privacy.supportnursenestca2")}</a>.
            </p>
          </section>

          <section data-testid="section-children-privacy">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.7ChildrensPrivacy")}</h2>
            <p className="text-gray-700 leading-relaxed">
              NurseNest is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have inadvertently collected personal data from a minor without appropriate parental consent, we will take steps to delete that information promptly. If you believe a child under 18 has provided us with personal information, please contact us at{" "}
              <a href="mailto:support@nursenest.ca" className="text-primary underline hover:text-primary/80">{t("pages.privacy.supportnursenestca3")}</a>.
            </p>
          </section>

          <section data-testid="section-policy-changes">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.8ChangesToThisPolicy")}</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make significant changes, we will update the effective date at the top of this page and, where appropriate, notify you via email or through the Platform. Your continued use of NurseNest after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section data-testid="section-privacy-contact">
            <h2 className="text-2xl font-semibold text-primary mb-4">{t("pages.privacy.9ContactUs")}</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
              <a
                href="mailto:support@nursenest.ca"
                className="text-primary underline hover:text-primary/80"
                data-testid="link-privacy-contact-email"
              >
                support@nursenest.ca
              </a>.
            </p>
          </section>

          <section data-testid="section-related-links" className="border-t border-primary/10 pt-6">
            <p className="text-gray-700 leading-relaxed">
              See also our{" "}
              <LocaleLink href="/terms" className="text-primary underline hover:text-primary/80" data-testid="link-terms-of-use">
                Terms of Use
              </LocaleLink>{" "}
              and{" "}
              <LocaleLink href="/disclaimer" className="text-primary underline hover:text-primary/80" data-testid="link-disclaimer">
                Disclaimer
              </LocaleLink>.
            </p>
          </section>

        </div>
      </div>
      <AdminEditButton pageName="privacy" />
      <Footer />
    </div>
  );
}
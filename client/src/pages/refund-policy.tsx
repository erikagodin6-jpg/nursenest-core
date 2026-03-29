import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, Mail, Heart } from "lucide-react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
export default function RefundPolicyPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col bg-warmwhite font-sans" data-testid="refund-policy-page">
      <SEO
        title={t("pages.refundPolicy.refundPolicy30daySatisfactionGuarantee")}
        description={t("pages.refundPolicy.nursenestOffersA30daySatisfaction")}
        keywords="refund policy, satisfaction guarantee, NurseNest refund, nursing education refund, 30-day guarantee"
        canonicalPath="/refund-policy"
      />
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BreadcrumbNav />
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4"
            data-testid="text-refund-policy-title"
          >
            Refund Policy & 30-Day Satisfaction Guarantee
          </h1>
          <p
            className="text-lg text-softgray max-w-2xl mx-auto"
            data-testid="text-refund-policy-subtitle"
          >
            Designed to ensure fairness for all learners.
          </p>
          <p className="text-sm text-gray-400 mt-2" data-testid="text-refund-policy-effective-date">
            Effective Date: February 20, 2026
          </p>
        </div>

        <div className="space-y-6">

          <Card className="border-primary/10 shadow-sm" data-testid="section-satisfaction-guarantee">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.130daySatisfactionGuarantee")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                NurseNest offers a 30-day satisfaction guarantee to give first-time subscribers confidence in their investment. This guarantee applies exclusively to first-time subscriptions purchased directly through our website at nursenest.ca.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                The 30-day guarantee period is calculated from the date of your initial purchase and does not reset upon renewal or upgrade. If you are not satisfied with your experience within the first 30 calendar days, you may request a full refund subject to the eligibility conditions outlined below.
              </p>
              <p className="text-gray-600 text-sm italic">
                This guarantee reflects our confidence in the quality of NurseNest's educational content and our commitment to supporting your learning journey.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-eligibility-conditions">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.2EligibilityConditions")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                To be eligible for a refund under our 30-day satisfaction guarantee, all of the following conditions must be met:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2 mb-4">
                <li>{t("pages.refundPolicy.yourRefundRequestIsSubmitted")}</li>
                <li>{t("pages.refundPolicy.theSubscriptionIsYourFirstever")}</li>
                <li>{t("pages.refundPolicy.theSubscriptionWasPurchasedDirectly")}</li>
                <li>{t("pages.refundPolicy.yourAccountUsageFallsWithin")}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed font-medium mb-2">
                The following are explicitly excluded from refund eligibility:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
                <li>{t("pages.refundPolicy.subscriptionRenewalsMonthlyOrOtherwise")}</li>
                <li>{t("pages.refundPolicy.repeatRefundRequestsFromUsers")}</li>
                <li>{t("pages.refundPolicy.purchasesMadeThroughThirdpartyPlatforms")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-usage-safeguards">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.3UsagebasedSafeguards")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                To protect the integrity of our content and ensure fairness for all subscribers, refund eligibility may be denied if your account shows substantial consumption of paid content during the guarantee period.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2 font-medium">
                Examples of substantial usage that may affect refund eligibility include, but are not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2 mb-4">
                <li>{t("pages.refundPolicy.completionOfMoreThan25")}</li>
                <li>{t("pages.refundPolicy.excessiveAccessToPremiumLessons")}</li>
                <li>{t("pages.refundPolicy.behaviorPatternsConsistentWithContent")}</li>
              </ul>
              <p className="text-gray-600 text-sm italic">
                These safeguards exist to maintain a fair environment for all learners and are applied thoughtfully on a case-by-case basis.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-non-refundable">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.4NonrefundableCircumstances")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                The following circumstances are not eligible for a refund under any conditions:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2">
                <li>{t("pages.refundPolicy.changeOfMindAfterSubstantial")}</li>
                <li>{t("pages.refundPolicy.dissatisfactionRelatedToExamOutcomes")}</li>
                <li>{t("pages.refundPolicy.purchasesMadeAtPromotionalDiscounted")}</li>
                <li>{t("pages.refundPolicy.subscriptionRenewalsWhetherAutomaticOr")}</li>
                <li>{t("pages.refundPolicy.accountsThatHaveBeenSuspended")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-effect-of-refund">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.5EffectOfRefund")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                If your refund request is approved, the following will take effect:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2 mb-4">
                <li>{t("pages.refundPolicy.immediateTerminationOfYourAccess")}</li>
                <li>{t("pages.refundPolicy.revocationOfYourLicenseTo")}</li>
                <li>{t("pages.refundPolicy.yourAccountMayBeFlagged")}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Refunds are typically processed within 5-10 business days and will be returned to the original payment method used at the time of purchase.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-refund-process">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.6RefundRequestProcess")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                To request a refund, please contact our support team via email at{" "}
                <a
                  href="mailto:support@nursenest.ca"
                  className="text-primary underline hover:text-primary/80"
                  data-testid="link-support-email"
                >
                  support@nursenest.ca
                </a>. Please include the following details in your request:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 ml-2 mb-4">
                <li>{t("pages.refundPolicy.yourFullNameAndThe")}</li>
                <li>{t("pages.refundPolicy.yourDateOfPurchaseAnd")}</li>
                <li>{t("pages.refundPolicy.aBriefExplanationOfThe")}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our team will review your request and respond within 2-3 business days. We are committed to handling all requests with care and transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm" data-testid="section-our-commitment">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Heart className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <h2 className="text-2xl font-semibold text-primary">{t("pages.refundPolicy.7OurCommitment")}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                At NurseNest, we believe in the quality of our educational content and the value it brings to nursing students and professionals. Our 30-day satisfaction guarantee reflects that belief: we want you to feel confident in choosing NurseNest as your study companion.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                We are committed to treating every learner with fairness, respect, and transparency. If something isn't working for you, we genuinely want to hear about it. Your feedback helps us improve the platform for everyone.
              </p>
              <p className="text-gray-600 text-sm italic">
                This policy is designed to balance the needs of all our learners: protecting the investment of dedicated students while ensuring that new subscribers can explore NurseNest with peace of mind.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
      <AdminEditButton pageName="refund-policy" />
      <Footer />
    </div>
  );
}

import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, BookOpen, BarChart3, ClipboardList, Shield, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const valueProps = [
  {
    id: "qbank",
    icon: BookOpen,
    title: "Unlimited Test Bank",
    description: "Access 2,000+ questions with full rationales covering every exam blueprint domain. Practice until you feel confident.",
  },
  {
    id: "adaptive",
    icon: BarChart3,
    title: "Adaptive Readiness Testing",
    description: "Measure your readiness with adaptive measurement principles that adjust to your performance level and identify gaps.",
  },
  {
    id: "resources",
    icon: ClipboardList,
    title: "Complete Study Resources",
    description: "Flashcards, study plans, and performance tracking tools designed to maximize your exam preparation efficiency.",
  },
];

const comparisonRows = [
  { feature: "Practice Questions", free: "50 questions (one-time)", premium: "2,000+ questions" },
  { feature: "Readiness Report", free: true, premium: true },
  { feature: "Domain Breakdown", free: true, premium: true },
  { feature: "Detailed Rationales", free: false, premium: true },
  { feature: "Adaptive Difficulty", free: false, premium: true },
  { feature: "Performance Tracking", free: false, premium: true },
  { feature: "Flashcards", free: false, premium: true },
  { feature: "Study Plans", free: false, premium: true },
  { feature: "Mock Exams", free: false, premium: true },
  { feature: "Clinical Lessons", free: false, premium: true },
];

export default function TrialUpgradePage() {
  const { t } = useI18n();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={t("pages.trialUpgrade.upgradeYourExamPrepNursenest")}
        description={t("pages.trialUpgrade.unlockFullAccessToNursenest")}
        canonicalPath="/trial/upgrade"
      />
      <Navigation />
      <main className="flex-1 px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary mb-4 px-4 py-1.5" data-testid="badge-upgrade-header">
              Upgrade Your Preparation
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-upgrade-title">
              Ready to Pass With Confidence?
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto" data-testid="text-upgrade-subtitle">
              Your free trial showed you where you stand. Now unlock everything you need to get exam-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {valueProps.map((prop) => {
              const Icon = prop.icon;
              return (
                <Card
                  key={prop.id}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-value-${prop.id}`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 rounded-full p-4 mb-3 w-fit">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold" data-testid={`text-value-title-${prop.id}`}>
                      {prop.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 text-center" data-testid={`text-value-desc-${prop.id}`}>
                      {prop.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center mb-2" data-testid="text-comparison-title">
              Free Trial vs Premium
            </h2>
            <p className="text-gray-500 text-center mb-6">
              See what you unlock with a premium subscription.
            </p>
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto" data-testid="table-comparison">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("pages.trialUpgrade.feature")}</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-500">{t("pages.trialUpgrade.freeTrial")}</th>
                        <th className="text-center py-3 px-4 font-bold text-primary bg-primary/5">{t("pages.trialUpgrade.premium")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0" data-testid={`row-comparison-${idx}`}>
                          <td className="py-3 px-4 font-medium text-gray-700">{row.feature}</td>
                          <td className="py-3 px-4 text-center">
                            {typeof row.free === "boolean" ? (
                              row.free ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="text-gray-500">{row.free}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center bg-primary/5">
                            {typeof row.premium === "boolean" ? (
                              row.premium ? (
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                              )
                            ) : (
                              <span className="font-semibold text-primary">{row.premium}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="py-10 text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-4 mb-4 w-fit">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-cta-title">
                  Unlock Your Full Potential
                </h2>
                <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                  Join thousands of nursing students who passed their exams with NurseNest. Choose a plan that fits your timeline and budget.
                </p>
                <Button
                  size="lg"
                  className="rounded-full px-8 font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
                  onClick={() => navigate("/pricing")}
                  data-testid="button-upgrade-now"
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">{t("pages.trialUpgrade.30dayMoneybackGuarantee")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary font-semibold hover:underline"
                data-testid="link-sign-in"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

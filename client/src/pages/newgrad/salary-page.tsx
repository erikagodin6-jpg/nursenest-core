import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PremiumUpgradeCTA, useNewGradAccess } from "./premium-cta";
import { useI18n } from "@/lib/i18n";
import {
  ChevronRight, ArrowRight, DollarSign, Lock, CheckCircle2,
  TrendingUp, Sparkles
} from "lucide-react";

export default function SalaryPage() {
  const { hasAccess } = useNewGradAccess();
  const { t } = useI18n();

  const FREE_SALARY_TIPS = [
    { title: t("newGrad.salary.tip1Title"), desc: t("newGrad.salary.tip1Desc") },
    { title: t("newGrad.salary.tip2Title"), desc: t("newGrad.salary.tip2Desc") },
    { title: t("newGrad.salary.tip3Title"), desc: t("newGrad.salary.tip3Desc") },
    { title: t("newGrad.salary.tip4Title"), desc: t("newGrad.salary.tip4Desc") },
    { title: t("newGrad.salary.tip5Title"), desc: t("newGrad.salary.tip5Desc") },
    { title: t("newGrad.salary.tip6Title"), desc: t("newGrad.salary.tip6Desc") },
  ];

  const SALARY_RANGES = [
    { specialty: t("newGrad.salary.specMedSurg"), range: "$55,000 - $72,000", notes: t("newGrad.salary.specMedSurgNote") },
    { specialty: t("newGrad.salary.specICU"), range: "$60,000 - $80,000", notes: t("newGrad.salary.specICUNote") },
    { specialty: t("newGrad.salary.specER"), range: "$58,000 - $78,000", notes: t("newGrad.salary.specERNote") },
    { specialty: t("newGrad.salary.specLD"), range: "$58,000 - $76,000", notes: t("newGrad.salary.specLDNote") },
    { specialty: t("newGrad.salary.specPeds"), range: "$55,000 - $73,000", notes: t("newGrad.salary.specPedsNote") },
    { specialty: t("newGrad.salary.specHomeHealth"), range: "$52,000 - $68,000", notes: t("newGrad.salary.specHomeHealthNote") },
  ];

  const PREMIUM_ITEMS = [
    t("newGrad.salary.premiumItem1"),
    t("newGrad.salary.premiumItem2"),
    t("newGrad.salary.premiumItem3"),
    t("newGrad.salary.premiumItem4"),
    t("newGrad.salary.premiumItem5"),
  ];

  return (
    <div data-testid="newgrad-salary-page">
      <Navigation />
      <SEO
        title={t("newGrad.salary.seoTitle")}
        description={t("newGrad.salary.seoDescription")}
        keywords="new grad nurse salary, nursing salary negotiation, new nurse pay, nursing salary by specialty, nurse compensation, nursing benefits negotiation"
        canonicalPath="/newgrad/salary"
        breadcrumbs={[
          { name: t("newGrad.common.home"), url: "https://www.nursenest.ca" },
          { name: t("newGrad.common.newGradCareerHub"), url: "https://www.nursenest.ca/newgrad" },
          { name: t("newGrad.salary.badge"), url: "https://www.nursenest.ca/newgrad/salary" },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50/30 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-blue-600">{t("newGrad.common.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("newGrad.common.newGradCareerHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-green-700 font-medium">{t("newGrad.salary.badge")}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-green-100 text-green-700">
            <DollarSign className="w-4 h-4" /> {t("newGrad.salary.badge")}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-title">
            {t("newGrad.salary.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("newGrad.salary.subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16" data-testid="section-salary-ranges">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("newGrad.salary.rangesTitle")}</h2>
          <p className="text-gray-600 mb-6">{t("newGrad.salary.rangesDesc")}</p>
          <div className="space-y-3">
            {SALARY_RANGES.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between" data-testid={`salary-range-${i}`}>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.specialty}</h3>
                  <p className="text-xs text-gray-500">{s.notes}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-green-700">{s.range}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-free-tips">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">{t("newGrad.salary.freeTipsTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FREE_SALARY_TIPS.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`tip-${i}`}>
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!hasAccess && (
        <section className="py-16" data-testid="section-premium-preview">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-900">{t("newGrad.salary.premiumTitle")}</h2>
            </div>
            <div className="space-y-3 mb-6">
              {PREMIUM_ITEMS.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 opacity-60" data-testid={`preview-strategy-${i}`}>
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <PremiumUpgradeCTA requiredEntitlement="toolkit" context="Unlock negotiation scripts, salary comparison tools, counter-offer templates, and regional salary data to maximize your compensation." />
          </div>
        </section>
      )}

      <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50" data-testid="section-bottom-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{t("newGrad.salary.completeToolkit")}</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/newgrad/resume" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors border border-green-200" data-testid="link-resume">
              {t("newGrad.common.resumeTools")}
            </Link>
            <Link href="/newgrad/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors border border-green-200" data-testid="link-interview">
              {t("newGrad.common.interviewPrep")}
            </Link>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors border border-green-200" data-testid="link-certifications">
              {t("newGrad.common.certifications")}
            </Link>
            <Link href="/newgrad/clinical-references" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-colors border border-green-200" data-testid="link-clinical-refs">
              {t("newGrad.common.clinicalReferences")}
            </Link>
            <Link href="/newgrad" className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors" data-testid="link-hub">
              {t("newGrad.common.careerHub")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

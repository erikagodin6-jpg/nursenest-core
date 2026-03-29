import { useState } from "react";
import { CheckCircle2, Star, Zap, ArrowRight, Shield, Clock, CreditCard, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlliedSEO } from "@/allied/allied-seo";
import { pricingConfig, durationLabels, durationMonths, type DurationKey } from "@shared/pricing-config";

import { useI18n } from "@/lib/i18n";
const ALLIED_FEATURES = [
  "Question Bank with detailed rationales",
  "Flashcards with spaced repetition",
  "Clinical Lessons library",
  "Performance Analytics dashboard",
  "Adaptive mock exams",
  "Exam simulations",
];

const DURATION_ORDER: DurationKey[] = ["monthly", "3-month", "6-month", "yearly"];

function formatPrice(cents: number): string {

  return `$${(cents / 100).toFixed(2)}`;
}

function getMonthlyEquivalent(cents: number, duration: DurationKey): string {
  const months = durationMonths[duration];
  if (months === 1) return "";
  const monthly = cents / months;
  return `$${(monthly / 100).toFixed(2)}/mo`;
}

function getSavingsPercent(duration: DurationKey): string | null {
  const monthly = pricingConfig.allied.cad.monthly;
  const totalMonths = durationMonths[duration];
  if (totalMonths === 1) return null;
  const fullPrice = monthly * totalMonths;
  const discountedPrice = pricingConfig.allied.cad[duration];
  const percent = Math.round(((fullPrice - discountedPrice) / fullPrice) * 100);
  return percent > 0 ? `Save ${percent}%` : null;
}

export default function AlliedPricingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (duration: DurationKey) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe.", variant: "destructive" });
      return;
    }
    setLoading(duration);
    try {
      const res = await apiRequest("POST", "/api/allied/checkout", { planType: duration, userId: user.id });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: "Checkout unavailable", description: data.message || "Please try again later.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Could not start checkout. Please try again.", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" data-testid="allied-pricing-page">
      <AlliedSEO
        title={t("allied.alliedPricing.alliedHealthPlansExamPrep")}
        description={t("allied.alliedPricing.chooseYourAlliedHealthExam")}
        keywords="allied health exam prep pricing, healthcare certification cost, RRT exam prep price, paramedic exam prep price, pharmacy tech exam prep price"
        canonicalPath="/allied-health/pricing"
      />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-teal-100/80 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Star className="w-4 h-4" />
          Allied Health Exam Prep
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-pricing-title">
          Allied Health Plans
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-testid="text-pricing-subtitle">
          Get full access to exam-style questions, flashcards, clinical lessons, and performance tools to prepare for your allied health certification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {DURATION_ORDER.map((duration) => {
          const price = pricingConfig.allied.cad[duration];
          const label = durationLabels[duration];
          const isPopular = duration === "6-month";
          const monthlyEquiv = getMonthlyEquivalent(price, duration);
          const savings = getSavingsPercent(duration);

          return (
            <div
              key={duration}
              className={`bg-white rounded-2xl border-2 p-6 flex flex-col relative ${
                isPopular
                  ? "border-teal-400 shadow-xl shadow-teal-100/50 scale-[1.02]"
                  : "border-gray-100"
              }`}
              data-testid={`plan-card-${duration}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold rounded-full whitespace-nowrap" data-testid="badge-most-popular">
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1" data-testid={`text-plan-name-${duration}`}>{label}</h3>
                {savings && (
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold rounded-full px-2.5 py-0.5 mb-2" data-testid={`badge-savings-${duration}`}>
                    {savings}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900" data-testid={`text-price-${duration}`}>{formatPrice(price)}</span>
                  <span className="text-gray-500 text-sm">CAD</span>
                </div>
                {monthlyEquiv && (
                  <div className="mt-1 text-sm text-teal-600 font-medium" data-testid={`text-monthly-equiv-${duration}`}>
                    {monthlyEquiv}
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {ALLIED_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(duration)}
                disabled={loading === duration}
                className={`w-full px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${
                  isPopular
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
                data-testid={`button-checkout-${duration}`}
              >
                {loading === duration ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Get Started <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.alliedPricing.nursenestAlliedVsGenericTest")}</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 px-6 py-3">
            <div className="text-sm font-semibold text-gray-700">{t("allied.alliedPricing.feature")}</div>
            <div className="text-sm font-semibold text-teal-700 text-center">{t("allied.alliedPricing.nursenestAllied")}</div>
            <div className="text-sm font-semibold text-gray-500 text-center">{t("allied.alliedPricing.genericBanks")}</div>
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-3 px-6 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`} data-testid={`comparison-row-${i}`}>
              <div className="text-sm text-gray-700">{row.feature}</div>
              <div className="flex justify-center">
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
              </div>
              <div className="flex justify-center">
                {row.generic ? <CheckCircle2 className="w-5 h-5 text-gray-300" /> : <XCircle className="w-5 h-5 text-gray-300" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.alliedPricing.whyProfessionalsChooseNursenestAllied")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: BookOpen, label: "600+ Word Rationales", desc: "Every question includes step-by-step clinical reasoning" },
            { icon: Target, label: "Adaptive CAT Engine", desc: "Simulates real exam difficulty adjustment" },
            { icon: TrendingUp, label: "Readiness Predictor", desc: "Know exactly when you're exam-ready" },
            { icon: Brain, label: "AI Study Tools", desc: "Career-specific simulators and planners" },
          ].map(item => (
            <div key={item.label} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100 text-center" data-testid={`value-prop-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <item.icon className="w-7 h-7 text-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h3>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.alliedPricing.frequentlyAskedQuestions")}</h2>
        <div className="space-y-4">
          {[
            { q: "Can I switch between careers?", a: "Yes, one subscription gives you full access to all allied health careers. Study for multiple certifications simultaneously." },
            { q: "What makes your rationales different?", a: "Every question includes a minimum 600-word rationale with step-by-step reasoning, distractor analysis, exam trap explanations, clinical pearls, and safety reinforcement. No other platform provides this depth." },
            { q: "How does the adaptive exam work?", a: "Our CAT-style engine starts at medium difficulty and adjusts based on your performance, similar to real certification exams. It tracks blueprint coverage and avoids repeating recent questions." },
            { q: "Is there a money-back guarantee?", a: "We offer a 7-day satisfaction guarantee. If you're not happy, contact us for a full refund." },
            { q: "Are these real exam questions?", a: "All questions are original, exam-authentic items aligned to published exam blueprints. We do not reproduce copyrighted exam content." },
            { q: "How often is content updated?", a: "New questions, case sims, and flashcards are added weekly. Blueprint weightings are updated as exam specifications change. We're targeting 4,000+ questions per career." },
          ].map(faq => (
            <div key={faq.q} className="bg-white rounded-xl p-4 border border-gray-100" data-testid={`faq-${faq.q.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}>
              <h3 className="font-medium text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

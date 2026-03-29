import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle2,
  Shield,
  HelpCircle,
  ArrowRight,
  Clock,
  Brain,
  TrendingUp,
} from "lucide-react";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
const EXAM_OPTIONS = [
  { value: "rex-pn", label: "REx-PN (Canada)" },
  { value: "nclex-pn", label: "NCLEX-PN (US)" },
  { value: "nclex-rn", label: "NCLEX-RN (US)" },
  { value: "np-canada", label: "NP Canada" },
  { value: "aanp-fnp", label: "AANP FNP (US)" },
];

function generateFingerprint(): string {
  const { t } = useI18n();
  const nav = window.navigator;
  const screen = window.screen;
  const raw = [
    nav.userAgent,
    nav.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join("|");
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export default function TrialLandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedExam, setSelectedExam] = useState("rex-pn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartTrial = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/trial/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examKey: selectedExam,
          userId: user?.id,
          deviceFingerprint: generateFingerprint(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ||
            "You've already taken a trial for this exam. Upgrade to unlock unlimited practice."
        );
        return;
      }
      navigate(`/trial/session/${data.sessionId}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <SEO
        title={t("pages.trialLanding.free50questionTrialNursenest")}
        description={t("pages.trialLanding.getAReadinessSnapshotIn")}
        canonicalPath="/trial"
      />
      <Navigation />

      <main className="flex-1">
        <BreadcrumbNav />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border-0"
            data-testid="badge-free-trial"
          >
            Free -- No Credit Card Required
          </Badge>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            data-testid="text-trial-headline"
          >
            Get a Readiness Snapshot in One Sitting
          </h1>
          <p
            className="text-gray-500 text-lg max-w-2xl mx-auto mb-8"
            data-testid="text-trial-subheadline"
          >
            50 questions built to the exam blueprint. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Select
              value={selectedExam}
              onValueChange={setSelectedExam}
              data-testid="select-exam"
            >
              <SelectTrigger
                className="w-full sm:w-64 rounded-full bg-white shadow-sm"
                data-testid="select-exam-trigger"
              >
                <SelectValue placeholder={t("pages.trialLanding.chooseYourExam")} />
              </SelectTrigger>
              <SelectContent>
                {EXAM_OPTIONS.map((exam) => (
                  <SelectItem
                    key={exam.value}
                    value={exam.value}
                    data-testid={`select-exam-option-${exam.value}`}
                  >
                    {exam.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="lg"
              className="rounded-full px-8 font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
              onClick={handleStartTrial}
              disabled={loading}
              data-testid="button-start-trial"
            >
              {loading ? "Starting..." : "Start Free Trial"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          {error && (
            <div
              className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
              data-testid="text-trial-error"
            >
              {error}
            </div>
          )}
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-10"
            data-testid="text-what-you-get"
          >
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="border-none shadow-sm hover:shadow-md transition-shadow"
              data-testid="card-readiness-band"
            >
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Readiness Band + Stability
                </h3>
                <p className="text-gray-500 text-sm">
                  Know exactly where you stand with a clear readiness
                  classification and stability assessment based on your
                  performance.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-none shadow-sm hover:shadow-md transition-shadow"
              data-testid="card-domain-breakdown"
            >
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Domain Breakdown by Blueprint
                </h3>
                <p className="text-gray-500 text-sm">
                  See your accuracy across every exam domain so you know exactly
                  which areas need more focus.
                </p>
              </CardContent>
            </Card>

            <Card
              className="border-none shadow-sm hover:shadow-md transition-shadow"
              data-testid="card-study-recommendations"
            >
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-violet-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  Personalized Study Recommendations
                </h3>
                <p className="text-gray-500 text-sm">
                  Get a tailored study plan based on your weak areas and
                  readiness level to guide your preparation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl sm:text-3xl font-bold text-center mb-10"
              data-testid="text-how-it-works"
            >
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: 1,
                  icon: ClipboardList,
                  title: "Choose Your Exam",
                  desc: "Select your target certification exam from the dropdown above.",
                },
                {
                  step: 2,
                  icon: Brain,
                  title: "Answer 50 Questions",
                  desc: "15 diagnostic questions plus 35 simulation questions calibrated to your exam blueprint.",
                },
                {
                  step: 3,
                  icon: FileText,
                  title: "Get Your Readiness Report",
                  desc: "Receive a detailed breakdown of your performance across all exam domains.",
                },
                {
                  step: 4,
                  icon: TrendingUp,
                  title: "See Your Study Plan",
                  desc: "Get personalized recommendations based on your strengths and weak areas.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="text-center"
                  data-testid={`card-step-${item.step}`}
                >
                  <div className="relative mx-auto mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2
                  className="text-xl font-bold mb-3"
                  data-testid="text-trust-heading"
                >
                  How Scoring Works
                </h2>
                <p
                  className="text-gray-600 text-sm leading-relaxed mb-4"
                  data-testid="text-trust-body"
                >
                  Our readiness assessment uses adaptive measurement principles
                  to evaluate your exam preparedness. Questions are mapped to
                  official exam blueprint domains and weighted accordingly. Your
                  readiness band reflects your overall performance across all
                  tested domains.
                </p>
                <p className="text-gray-500 text-xs italic">
                  This assessment is a study tool and does not replicate or
                  guarantee results on any official licensing examination.
                  NurseNest is not affiliated with any regulatory body. No pass
                  guarantees are made or implied.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-8"
            data-testid="text-faq-heading"
          >
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            data-testid="accordion-faq"
          >
            {[
              {
                q: "Is the trial really free?",
                a: "Yes. You get 50 questions and a full readiness report with no credit card required. There are no hidden fees.",
              },
              {
                q: "How many times can I take the trial?",
                a: "The free trial is available once per exam per device. This ensures everyone gets a fair and accurate baseline assessment.",
              },
              {
                q: "What types of questions are included?",
                a: "The trial includes a mix of 15 diagnostic questions and 35 simulation questions drawn from the official exam blueprint domains for your selected certification.",
              },
              {
                q: "How is my readiness band calculated?",
                a: "Your readiness band is based on your overall score and domain-level performance. We use adaptive measurement principles to classify your preparedness as Very Low, Borderline, Moderate, or Exam Ready.",
              },
              {
                q: "Can I go back to previous questions?",
                a: "Yes. Unlike some exam simulations, the trial allows you to navigate back to previous questions and change your answers before submitting.",
              },
              {
                q: "How long do I have to complete the trial?",
                a: "Your trial session remains active for 7 days after starting. You can close your browser and resume where you left off within that window.",
              },
              {
                q: "What happens after I complete the trial?",
                a: "You receive a detailed readiness report showing your score, domain breakdown, time management analysis, and personalized study recommendations. You can then choose to upgrade for full access to our question bank and study resources.",
              },
              {
                q: "Does this replace official exam preparation?",
                a: "No. The trial is a readiness snapshot designed to help you identify strengths and weak areas. It is a study tool and does not replicate or guarantee results on any official licensing examination.",
              },
            ].map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-white rounded-xl border-none shadow-sm px-6"
                data-testid={`accordion-faq-item-${idx}`}
              >
                <AccordionTrigger
                  className="text-left font-semibold text-gray-900 hover:no-underline py-5"
                  data-testid={`accordion-faq-trigger-${idx}`}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="bg-gradient-to-b from-primary/5 to-warmwhite py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              data-testid="text-bottom-cta-heading"
            >
              Ready to See Where You Stand?
            </h2>
            <p className="text-gray-500 mb-8">
              Take 50 questions and get your personalized readiness report. No
              credit card. No commitment.
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 py-6 text-lg font-semibold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all"
              onClick={handleStartTrial}
              disabled={loading}
              data-testid="button-start-trial-bottom"
            >
              {loading ? "Starting..." : "Start Free Trial"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

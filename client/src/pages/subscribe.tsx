import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getPracticalNurseExamName, type Region } from "@shared/constants";
import { useI18n } from "@/lib/i18n";
const lessonCount = 867;
const questionCount = 4200;
import {
  Check, Shield, BookOpen, Brain, FileText, BarChart3, Stethoscope,
  GraduationCap, Target, Zap, Clock, Award, ArrowRight, Star,
  CreditCard, ChevronDown, ChevronUp, Sparkles, Layers, Users,
  Microscope, HeartPulse, Pill, Activity, ClipboardList
} from "lucide-react";

type Duration = "monthly" | "3-month" | "6-month" | "yearly";

const tierData: Record<string, {
  name: string;
  tagline: string;
  examNames: string[];
  heroColor: string;
  prices: Record<Duration, { CAD: number; USD: number }>;
  features: { icon: any; title: string; description: string }[];
  contentNumbers: { label: string; value: string }[];
  domains: string[];
  whoFor: string;
  guarantee: string;
}> = {
  rpn: {
    name: "RPN / LVN",
    tagline: "Everything you need to pass the {examName} on your first attempt",
    examNames: ["NCLEX-PN (US)", "REx-PN (Canada)"],
    heroColor: "from-teal-600 to-emerald-600",
    prices: {
      monthly: { CAD: 29.99, USD: 21.99 },
      "3-month": { CAD: 74.99, USD: 54.99 },
      "6-month": { CAD: 134.99, USD: 99.99 },
      yearly: { CAD: 239.99, USD: 179.99 },
    },
    features: [
      { icon: BookOpen, title: "Comprehensive Lesson Library", description: "Structured lessons covering fundamentals, pharmacology, safety, infection control, and all core RPN competencies with clinical pearls." },
      { icon: Brain, title: "Adaptive Test Bank", description: "Thousands of practice questions mirroring the {examName} format with detailed rationales and domain-based performance tracking." },
      { icon: FileText, title: "Flashcard System", description: "Create, study, and master key concepts with up to 300 flashcards per deck. Build from notes or create manually." },
      { icon: BarChart3, title: "Mock Exams with Analytics", description: "Full-length timed practice exams with score breakdowns, domain analysis, and pass probability estimation." },
      { icon: Target, title: "Personalized Study Plan", description: "AI-powered onboarding assessment builds a week-by-week study path tailored to your strengths and weaknesses." },
      { icon: Stethoscope, title: "Clinical Simulations", description: "Interactive case scenarios, first-action simulators, and patient deterioration exercises to build clinical judgment." },
      { icon: Pill, title: "Medication Mastery", description: "Dedicated pharmacology modules with drug cards, side effects, contraindications, and nursing considerations." },
      { icon: ClipboardList, title: "Printable Study Packs", description: "Download and print study materials, drug cards, and review sheets for offline studying." },
    ],
    contentNumbers: [
      { label: "Lessons", value: "80+" },
      { label: "Practice Questions", value: `${Math.floor(questionCount / 100) * 100}+` },
      { label: "Flashcard Capacity", value: "300/deck" },
      { label: "Clinical Simulations", value: "6 Types" },
    ],
    domains: ["Fundamentals & Safety", "Infection Control", "Pharmacology Basics", "Fluid & Electrolytes", "Cardiovascular", "Respiratory", "Neurological", "Renal & GI", "Endocrine", "Maternity & Neonatal", "Pediatrics", "Mental Health", "Wound Care", "Delegation & Prioritization"],
    whoFor: "Practical nursing students and internationally educated nurses preparing for the NCLEX-PN or REx-PN licensing exam.",
    guarantee: "7-day money-back guarantee. If NurseNest does not meet your expectations, contact us for a full refund.",
  },
  rn: {
    name: "RN",
    tagline: "The most complete NCLEX-RN preparation platform available",
    examNames: ["NCLEX-RN (US)", "REx-RN (Canada)"],
    heroColor: "from-blue-600 to-indigo-600",
    prices: {
      monthly: { CAD: 39.99, USD: 29.99 },
      "3-month": { CAD: 99.99, USD: 74.99 },
      "6-month": { CAD: 179.99, USD: 134.99 },
      yearly: { CAD: 319.99, USD: 239.99 },
    },
    features: [
      { icon: BookOpen, title: "Complete RN Lesson Library", description: "In-depth lessons spanning all NCLEX-RN domains: complex care, leadership, delegation, advanced pharmacology, and critical thinking frameworks." },
      { icon: Brain, title: "Advanced Test Bank", description: "Higher-order thinking questions, select-all-that-apply, priority and delegation questions with step-by-step rationales." },
      { icon: FileText, title: "Enhanced Flashcard System", description: "Up to 300 cards per deck with note-based generation. Master pharmacology, lab values, and clinical concepts." },
      { icon: BarChart3, title: "Comprehensive Mock Exams", description: "CAT-style adaptive exams that simulate the real NCLEX-RN experience with detailed performance analytics." },
      { icon: Target, title: "Personalized Study Plan", description: "Onboarding assessment identifies your weak areas and generates a customized study schedule with daily tasks." },
      { icon: Stethoscope, title: "Clinical Judgment Simulators", description: "Patient deterioration, blood transfusion, IV complications, electrolyte/ABG interpretation, and safety hazard scenarios." },
      { icon: Activity, title: "ECG & Lab Interpretation", description: "Dedicated modules for arrhythmia recognition, lab value analysis, and ABG interpretation with practice exercises." },
      { icon: GraduationCap, title: "Leadership & Delegation", description: "Comprehensive modules on RN scope of practice, delegation frameworks, triage, and management principles." },
    ],
    contentNumbers: [
      { label: "Lessons", value: "120+" },
      { label: "Practice Questions", value: `${Math.floor(questionCount / 100) * 100}+` },
      { label: "Flashcard Capacity", value: "300/deck" },
      { label: "Clinical Simulations", value: "6 Types" },
    ],
    domains: ["Fundamentals & Safety", "Infection Control", "Advanced Pharmacology", "Fluid & Electrolytes", "Cardiovascular & ECG", "Respiratory & ABGs", "Neurological", "Renal & GI", "Endocrine & Immune", "Maternity & Neonatal", "Pediatrics", "Mental Health", "Leadership & Management", "Complex Care", "Delegation & Prioritization", "Community Health"],
    whoFor: "Registered nursing students and internationally educated nurses preparing for the NCLEX-RN or REx-RN licensing exam.",
    guarantee: "7-day money-back guarantee. If NurseNest does not meet your expectations, contact us for a full refund.",
  },
  np: {
    name: "NP Advanced",
    tagline: "Master-level preparation for Nurse Practitioner certification exams",
    examNames: ["AANP-FNP", "ANCC-FNP", "AGPCNP", "PMHNP"],
    heroColor: "from-purple-600 to-violet-600",
    prices: {
      monthly: { CAD: 49.99, USD: 36.99 },
      "3-month": { CAD: 124.99, USD: 94.99 },
      "6-month": { CAD: 224.99, USD: 169.99 },
      yearly: { CAD: 399.99, USD: 299.99 },
    },
    features: [
      { icon: BookOpen, title: "NP-Level Lesson Library", description: "Advanced pathophysiology, diagnostic reasoning, guideline-based management, and prescribing safety across all body systems." },
      { icon: Brain, title: "NP Certification Test Bank", description: "Questions formatted for AANP and ANCC exams: clinical vignettes, differential diagnosis, treatment selection, and prescribing scenarios." },
      { icon: Microscope, title: "Labs & Diagnostics Deep Dive", description: "Comprehensive lab interpretation, imaging orders, screening guidelines, and diagnostic decision-making modules." },
      { icon: Pill, title: "Advanced Pharmacology", description: "Four dedicated pharmacology modules covering cardiovascular/respiratory/endocrine, infectious/psychiatric, GI/renal/specialty, and NP prescribing safety." },
      { icon: Target, title: "Personalized Study Plan", description: "Tailored onboarding identifies your clinical knowledge gaps and builds a structured path through NP-specific domains." },
      { icon: HeartPulse, title: "Critical Care & Emergency", description: "Advanced cardiac/respiratory critical care, hemodynamic monitoring, ventilator management, and emergency protocols." },
      { icon: Users, title: "Population Health & Screening", description: "USPSTF guidelines, health promotion, disease prevention, immunization schedules, and public health leadership." },
      { icon: Layers, title: "Everything in RN Tier, Plus More", description: "Full access to all RPN and RN content, plus NP-exclusive advanced modules, clinical units, and prescribing guides." },
    ],
    contentNumbers: [
      { label: "Lessons", value: "180+" },
      { label: "Practice Questions", value: `${Math.floor(questionCount / 100) * 100}+` },
      { label: "Pharmacology Modules", value: "4 Dedicated" },
      { label: "Clinical Simulations", value: "6 Types" },
    ],
    domains: ["Advanced Pathophysiology", "Diagnostic Reasoning", "Pharmacology & Prescribing", "Cardiovascular", "Respiratory", "Neurological", "Endocrine & Metabolic", "Renal & GI", "Hematology & Oncology", "Maternity & Women's Health", "Pediatrics & Adolescent", "Psychiatric & Mental Health", "Dermatology & HEENT", "Musculoskeletal & Rheumatology", "Infectious Disease", "Health Promotion & Screening", "Leadership & Health Systems", "Cultural Safety & Ethics"],
    whoFor: "Nurse Practitioner students and practicing NPs preparing for AANP, ANCC, or specialty certification exams.",
    guarantee: "7-day money-back guarantee. If NurseNest does not meet your expectations, contact us for a full refund.",
  },
};

const testimonials = [
  { name: "Sarah M.", role: "RPN Graduate", text: "I passed my practical nursing exam on the first try. The practice questions were incredibly similar to the real exam.", rating: 5 },
  { name: "James K.", role: "RN Student", text: "The study plan kept me on track. I knew exactly what to study each day instead of feeling overwhelmed.", rating: 5 },
  { name: "Dr. Priya L.", role: "FNP Student", text: "The NP pharmacology modules are outstanding. Four dedicated drug banks with black box warnings and prescribing pearls.", rating: 5 },
];

export default function SubscribePage() {
  const { t } = useI18n();
  const [, params] = useRoute("/subscribe/:tier");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const tierId = params?.tier || "rn";
  const tier = tierData[tierId] || tierData.rn;

  const [duration, setDuration] = useState<Duration>("monthly");
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [region] = useState<"US" | "CA">(() =>
    (localStorage.getItem("nursenest-region") as "US" | "CA") || "US"
  );

  const isCAD = region === "CA";
  const examName = tierId === "rpn" ? getPracticalNurseExamName(region as Region) : "";
  const resolveExamName = (text: string) => text.replace(/\{examName\}/g, examName);
  const price = isCAD ? tier.prices[duration].CAD : tier.prices[duration].USD;
  const currency = isCAD ? "CAD" : "USD";
  const savingsMap: Record<Duration, number> = { monthly: 0, "3-month": 17, "6-month": 25, yearly: 33 };
  const savings = savingsMap[duration];

  const periodLabel: Record<Duration, string> = {
    monthly: "/mo",
    "3-month": "/3 mo",
    "6-month": "/6 mo",
    yearly: "/yr",
  };

  async function handleSubscribe() {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, tier: tierId, duration, region }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create checkout session");
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast({ title: "Checkout Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const faqs = [
    { q: "Can I switch tiers later?", a: "Yes. You can upgrade or downgrade your subscription at any time. When upgrading, you get immediate access to the new tier. When downgrading, the change takes effect at your next billing cycle." },
    { q: "Is there a free trial?", a: "We offer affordable 1-day and 3-day trial passes so you can experience the platform before committing to a subscription. Visit our pricing page for details." },
    { q: "What happens if I cancel?", a: "You keep access until the end of your current billing period. Your study progress and flashcard decks are preserved if you re-subscribe later." },
    { q: "How is the study plan personalized?", a: "After subscribing, you complete a short onboarding assessment (about 2-4 minutes). Based on your self-rated comfort in each domain and a brief knowledge quiz, we generate a week-by-week study schedule tailored to your weak areas." },
    { q: "Can I access content offline?", a: "Printable study packs and drug cards can be downloaded as PDFs for offline use. The interactive features require an internet connection." },
  ];

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <main className="flex-1">
        <section className={`bg-gradient-to-br ${tier.heroColor} text-white py-16 sm:py-20 px-4`}>
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1" data-testid="badge-tier-label">
              {tier.name} Subscription
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight" data-testid="text-subscribe-title">
              {resolveExamName(tier.tagline)}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-6 max-w-2xl mx-auto" data-testid="text-subscribe-subtitle">
              Preparing for {tier.examNames.join(" or ")}? Get structured, expert-curated content with a personalized study plan built around your schedule.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {tier.examNames.map((exam) => (
                <Badge key={exam} className="bg-white/15 text-white border-white/25 px-3 py-1" data-testid={`badge-exam-${exam}`}>
                  {exam}
                </Badge>
              ))}
            </div>
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl sm:text-6xl font-bold" data-testid="text-hero-price">${price.toFixed(2)}</span>
              <span className="text-xl text-white/70">{currency}{periodLabel[duration]}</span>
            </div>
            {savings > 0 && (
              <p className="mt-2 text-white/80 text-sm">Save {savings}% compared to monthly billing</p>
            )}
            <div className="mt-6">
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
                data-testid="button-subscribe-hero"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {loading ? "Processing..." : "Start Learning Now"}
              </Button>
            </div>
            <p className="mt-3 text-white/60 text-sm flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4" /> {tier.guarantee}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-white/40 text-[10px]">{t("pages.subscribe.alsoAccepted")}</span>
              <span className="text-[11px] font-semibold text-[#FFB3C7]">{t("pages.subscribe.klarna")}</span>
              <span className="text-white/20">|</span>
              <span className="text-[11px] font-semibold text-[#B2FCE4]">{t("pages.subscribe.afterpay")}</span>
              <span className="text-white/20">|</span>
              <span className="text-[11px] font-semibold text-[#9D9DFF]">{t("pages.subscribe.affirm")}</span>
              <span className="text-white/20">|</span>
              <span className="text-[11px] font-semibold text-[#0070ba]">{t("pages.subscribe.paypal")}</span>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-white border-b">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-full p-1" data-testid="toggle-subscribe-duration">
                {(["monthly", "3-month", "6-month", "yearly"] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      duration === d ? "bg-primary text-white shadow-md" : "text-gray-600 hover:text-gray-900"
                    }`}
                    data-testid={`button-sub-duration-${d}`}
                  >
                    {d === "monthly" ? "Monthly" : d === "3-month" ? "3 Months" : d === "6-month" ? "6 Months" : "Yearly"}
                    {savingsMap[d] > 0 && <span className="ml-1 text-xs opacity-75">(-{savingsMap[d]}%)</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {tier.contentNumbers.map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl" data-testid={`stat-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{item.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-features-heading">
                Everything Included in Your {tier.name} Subscription
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                A complete exam preparation toolkit designed by nursing educators and built for how you actually study.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tier.features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow" data-testid={`card-feature-${idx}`}>
                    <CardContent className="p-6 flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{resolveExamName(feature.description)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-domains-heading">
                {tier.domains.length} Clinical Domains Covered
              </h2>
              <p className="text-gray-500">{t("pages.subscribe.structuredContentAlignedToYour")}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {tier.domains.map((domain, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors"
                  data-testid={`badge-domain-${idx}`}
                >
                  <Check className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-how-it-works-heading">
                How Your Study Plan Works
              </h2>
              <p className="text-gray-500">{t("pages.subscribe.fromSignupToExamDay")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "1", icon: ClipboardList, title: "Quick Assessment", desc: "Rate your comfort in each domain and answer 12 targeted questions (takes about 3 minutes)." },
                { step: "2", icon: Target, title: "Plan Generated", desc: "We build a week-by-week schedule mixing lessons, practice questions, flashcards, and review days." },
                { step: "3", icon: Clock, title: "Daily Tasks", desc: "Open your dashboard each day to see exactly what to study, matched to your available time (15-90 min)." },
                { step: "4", icon: Award, title: "Track Progress", desc: "Check off tasks, watch your progress grow, and see weak areas strengthen through spaced repetition." },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="text-center" data-testid={`step-${item.step}`}>
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-xs font-bold text-primary mb-1">STEP {item.step}</div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-testimonials-heading">
                Trusted by Nursing Students
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <Card key={idx} className="border-none shadow-md" data-testid={`card-testimonial-${idx}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 italic">"{t.text}"</p>
                    <div className="text-sm">
                      <span className="font-semibold">{t.name}</span>
                      <span className="text-gray-400 ml-2">{t.role}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-faq-heading">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                  data-testid={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-gray-50 transition-colors"
                    data-testid={`button-faq-${idx}`}
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed" data-testid={`text-faq-answer-${idx}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`bg-gradient-to-br ${tier.heroColor} text-white py-16 px-4`}>
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-white/80" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-cta-heading">
              Ready to Start Your {tier.name} Journey?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Join thousands of nursing students who chose NurseNest to prepare for their licensing exams. Your personalized study plan is waiting.
            </p>
            <div className="inline-flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${price.toFixed(2)}</span>
              <span className="text-white/70">{currency}{periodLabel[duration]}</span>
            </div>
            <div>
              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={loading}
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-full shadow-xl"
                data-testid="button-subscribe-bottom"
              >
                {loading ? "Processing..." : "Subscribe Now"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <p className="mt-4 text-white/60 text-sm flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4" /> 7-day money-back guarantee
            </p>
            <p className="mt-2 text-white/50 text-xs">{tier.whoFor}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Brain,
  Target,
  BookOpen,
  Layers,
  BarChart3,
  Star,
  Zap,
  Award,
  Monitor,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useRegion } from "@/hooks/use-region";

import { useI18n } from "@/lib/i18n";
const testimonials = [
  {
    name: "Sarah M.",
    role: "RN Graduate, Ontario",
    quote: "NurseNest questions were the closest thing to the real NCLEX. The adaptive format helped me feel prepared on exam day.",
    rating: 5,
  },
  {
    name: "James T.",
    role: "LPN, Texas",
    quote: "After failing once I used NurseNest and passed. The detailed rationales helped me understand not just the what, but the why.",
    rating: 5,
  },
  {
    name: "Priya K.",
    role: "NP Student, California",
    quote: "The flashcards and practice exams are top-notch. I studied for 3 weeks and passed on my first attempt!",
    rating: 5,
  },
  {
    name: "Emily R.",
    role: "RN Graduate, British Columbia",
    quote: "I tried three other platforms before NurseNest. Nothing comes close to the quality of the rationales and the exam simulation.",
    rating: 5,
  },
  {
    name: "Marcus D.",
    role: "RPN, Alberta",
    quote: "The CAT-style exams were a game changer. I walked into my REX-PN feeling confident because I'd already experienced the format.",
    rating: 5,
  },
];

const features = [
  {
    icon: Brain,
    title: "Adaptive CAT Exams",
    description: "Experience real NCLEX-style computerized adaptive testing that adjusts to your ability level in real time.",
  },
  {
    icon: Target,
    title: "13,000+ Practice Questions",
    description: "Comprehensive question bank covering all NCLEX categories with regularly updated content.",
  },
  {
    icon: BookOpen,
    title: "Detailed Rationales",
    description: "Every question includes thorough explanations for both correct and incorrect answers to deepen your understanding.",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description: "Reinforce key concepts with spaced-repetition flashcards designed for nursing exam preparation.",
  },
  {
    icon: BarChart3,
    title: "Real Exam Difficulty",
    description: "Questions calibrated to match actual NCLEX difficulty levels so you're never caught off guard.",
  },
  {
    icon: Zap,
    title: "Performance Analytics",
    description: "Track your progress with detailed reports showing strengths, weaknesses, and readiness scores.",
  },
];

const screenshots = [
  { label: "Exam Interface", description: "Practice with an interface designed to mirror the real NCLEX experience." },
  { label: "Report Card", description: "See detailed performance breakdowns by topic and question type." },
  { label: "Flashcards", description: "Study on the go with beautifully designed digital flashcards." },
  { label: "Lesson Pages", description: "Learn key concepts through structured, easy-to-follow lessons." },
];

const pricingTiers = [
  {
    id: "rpn",
    name: "RPN / LPN",
    monthlyCAD: 29.99,
    monthlyUSD: 21.99,
    features: [
      "REX-PN style practice exams",
      "4,200+ practical nursing questions",
      "Detailed answer rationales",
      "Flashcard decks",
      "Progress tracking",
      "Mobile-friendly access",
    ],
    popular: false,
  },
  {
    id: "rn",
    name: "RN",
    monthlyCAD: 39.99,
    monthlyUSD: 29.99,
    features: [
      "NCLEX-RN adaptive exams",
      "3,900+ registered nursing questions",
      "Clinical judgment scenarios",
      "Detailed answer rationales",
      "Flashcard decks",
      "Performance analytics",
    ],
    popular: true,
  },
  {
    id: "np",
    name: "NP",
    monthlyCAD: 49.99,
    monthlyUSD: 36.99,
    features: [
      "NP certification prep exams",
      "Advanced practice questions",
      "Diagnostic reasoning cases",
      "Detailed answer rationales",
      "Flashcard decks",
      "Performance analytics",
    ],
    popular: false,
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Pass the NCLEX on Your First Attempt | NurseNest",
  description: "Thousands of exam-style questions, adaptive testing, and detailed rationales designed for nursing students preparing for the NCLEX exam.",
  url: "https://www.nursenest.ca/pass-nclex-first-time",
  provider: {
    "@type": "Organization",
    name: "NurseNest",
    url: "https://www.nursenest.ca",
  },
  about: {
    "@type": "Thing",
    name: "NCLEX Exam Preparation",
  },
  keywords: "NCLEX practice questions, NCLEX study platform, nursing exam prep",
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How many NCLEX practice questions does NurseNest offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NurseNest offers over 13,000 practice questions covering all exam categories, with new questions added regularly.",
      },
    },
    {
      "@type": "Question",
      name: "Does NurseNest use adaptive testing like the real NCLEX?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, NurseNest uses computerized adaptive testing (CAT) that mirrors the real NCLEX exam format, adjusting question difficulty based on your performance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I try NurseNest before subscribing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, NurseNest offers a free demo exam so you can experience the platform before committing to a subscription.",
      },
    },
  ],
};

export default function NclexLandingPage() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const region = useRegion();
  const isCAD = region === "CA";

  return (
    <div className="min-h-screen bg-warmwhite font-sans" style={{ color: "#2E3A59" }}>
      <SEO
        title={t("pages.marketing.NclexLandingPage.passTheNclexOnYour")}
        description={t("pages.marketing.NclexLandingPage.thousandsOfExamstyleQuestionsAdaptive")}
        keywords="NCLEX practice questions, NCLEX study platform, NCLEX prep, nursing exam questions, NCLEX-RN prep, NCLEX review"
        canonicalPath="/pass-nclex-first-time"
        structuredData={structuredData}
        additionalStructuredData={[faqStructuredData]}
      />

      <Navigation />

      <HeroSection onNavigate={setLocation} />

      <TrustStrip />

      <TestimonialsSection />

      <FeaturesSection />

      <ScreenshotsCarousel />

      <PricingSection isCAD={isCAD} onNavigate={setLocation} />

      <FinalCta onNavigate={setLocation} />

      <Footer />
    </div>
  );
}

function HeroSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-[#BFA6F6]/5 via-white to-[#AEE3E1]/5"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#BFA6F6]/8 rounded-full blur-3xl hidden md:block" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-[#AEE3E1]/10 rounded-full blur-3xl hidden md:block" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <Badge variant="outline" className="mb-6 border-[#BFA6F6]/40 text-[#BFA6F6] bg-[#BFA6F6]/5 text-xs font-medium px-3 py-1" data-testid="badge-nclex-prep">
          NCLEX Exam Prep
        </Badge>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto"
          data-testid="hero-headline"
        >
          Pass the NCLEX on your first attempt.
        </h1>

        <p className="text-lg md:text-xl text-[#2E3A59]/65 max-w-3xl mx-auto mb-10 leading-relaxed" data-testid="hero-subheadline">
          Thousands of exam-style questions, adaptive testing, and detailed rationales designed for nursing students.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Button
            size="lg"
            onClick={() => onNavigate("/demo-exam")}
            className="bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none px-8 h-12 rounded-full text-base font-medium shadow-lg shadow-[#BFA6F6]/20"
            data-testid="hero-primary-cta"
          >
            Start Free Demo Exam
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-[#BFA6F6]/30 text-[#2E3A59] px-8 h-12 rounded-full text-base hover:bg-[#BFA6F6]/5"
            data-testid="hero-secondary-cta"
          >
            View Plans
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "13,000+", label: "Practice Questions" },
            { value: "95%", label: "Pass Rate" },
            { value: "CAT", label: "Adaptive Testing" },
            { value: "24/7", label: "Access Anytime" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl bg-white/70 border border-[#BFA6F6]/15 backdrop-blur-sm"
              data-testid={`hero-stat-${i}`}
            >
              <div className="text-2xl font-bold text-[#BFA6F6]">{stat.value}</div>
              <div className="text-xs text-[#2E3A59]/50 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    "Trusted by thousands of nursing students",
    "Updated for the latest NCLEX test plan",
    "Created by nursing educators",
    "Mobile-friendly platform",
  ];

  return (
    <section className="py-6 border-y border-gray-100 bg-white/50" data-testid="trust-strip">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#2E3A59]/60" data-testid={`trust-item-${i}`}>
              <Check className="w-4 h-4 text-[#AEE3E1] flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="testimonials-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#BFA6F6]/40 text-[#BFA6F6] bg-[#BFA6F6]/5 text-xs px-3 py-1">
            Student Success Stories
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="testimonials-headline">
            Hear from students who passed
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            Join thousands of nursing students who used NurseNest to ace their NCLEX exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <Card
              key={i}
              className="border-gray-200/80 bg-white hover:shadow-lg transition-shadow"
              data-testid={`testimonial-card-${i}`}
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FFD6A5] text-[#FFD6A5]" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#BFA6F6]/30 mb-3" />
                <p className="text-sm text-[#2E3A59]/70 leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#2E3A59]">{t.name}</p>
                  <p className="text-xs text-[#2E3A59]/50">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-3xl mx-auto">
          {testimonials.slice(3).map((t, i) => (
            <Card
              key={i + 3}
              className="border-gray-200/80 bg-white hover:shadow-lg transition-shadow"
              data-testid={`testimonial-card-${i + 3}`}
            >
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FFD6A5] text-[#FFD6A5]" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#BFA6F6]/30 mb-3" />
                <p className="text-sm text-[#2E3A59]/70 leading-relaxed mb-4 italic">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-semibold text-[#2E3A59]">{t.name}</p>
                  <p className="text-xs text-[#2E3A59]/50">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-16 md:py-24" data-testid="features-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#AEE3E1]/40 text-teal-600 bg-[#AEE3E1]/10 text-xs px-3 py-1">
            Study Tools
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="features-headline">
            Everything you need to pass
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            Purpose-built study tools designed specifically for NCLEX exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="text-center p-6 rounded-xl border border-[#BFA6F6]/15 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                data-testid={`feature-card-${i}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#BFA6F6]/10 mb-4">
                  <Icon className="w-6 h-6 text-[#BFA6F6]" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#2E3A59]/60 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ScreenshotsCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screenshots.length);
    }, 4000);
  };

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
    startAutoplay();
  };

  const prev = () => goTo((current - 1 + screenshots.length) % screenshots.length);
  const next = () => goTo((current + 1) % screenshots.length);

  const colorMap = ["bg-[#BFA6F6]/15", "bg-[#AEE3E1]/15", "bg-[#FFD6A5]/15", "bg-[#FFF3B0]/15"];
  const iconMap = [Monitor, BarChart3, Layers, BookOpen];

  return (
    <section className="py-16 md:py-24 bg-gray-50/50" data-testid="screenshots-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#BFA6F6]/40 text-[#BFA6F6] bg-[#BFA6F6]/5 text-xs px-3 py-1">
            Platform Preview
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="screenshots-headline">
            See NurseNest in action
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            Explore the tools and interfaces that will help you prepare.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className={`rounded-2xl ${colorMap[current]} border border-gray-200/50 p-8 md:p-12 min-h-[280px] md:min-h-[360px] flex flex-col items-center justify-center transition-all duration-500`}>
            {(() => {
              const Icon = iconMap[current];
              return <Icon className="w-16 h-16 md:w-24 md:h-24 text-[#BFA6F6]/40 mb-6" />;
            })()}
            <h3 className="text-xl md:text-2xl font-bold text-[#2E3A59] mb-2" data-testid={`screenshot-title-${current}`}>
              {screenshots[current].label}
            </h3>
            <p className="text-sm md:text-base text-[#2E3A59]/60 text-center max-w-md">
              {screenshots[current].description}
            </p>
          </div>

          <button
            onClick={prev}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label={t("pages.marketing.NclexLandingPage.previousScreenshot")}
            data-testid="button-screenshot-prev"
          >
            <ChevronLeft className="w-5 h-5 text-[#2E3A59]/60" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label={t("pages.marketing.NclexLandingPage.nextScreenshot")}
            data-testid="button-screenshot-next"
          >
            <ChevronRight className="w-5 h-5 text-[#2E3A59]/60" />
          </button>

          <div className="flex items-center justify-center gap-2 mt-6">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-[#BFA6F6] w-6" : "bg-[#BFA6F6]/25 hover:bg-[#BFA6F6]/40"
                }`}
                aria-label={`Go to screenshot ${i + 1}`}
                data-testid={`button-screenshot-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection({ isCAD, onNavigate }: { isCAD: boolean; onNavigate: (path: string) => void }) {
  return (
    <section className="py-16 md:py-24" id="pricing-section" data-testid="pricing-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-[#BFA6F6]/40 text-[#BFA6F6] bg-[#BFA6F6]/5 text-xs px-3 py-1">
            Simple Pricing
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="pricing-headline">
            Choose your path
          </h2>
          <p className="text-[#2E3A59]/60 max-w-2xl mx-auto text-lg">
            Pick the plan that matches your nursing track. All plans include a free demo exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier, i) => (
            <Card
              key={tier.id}
              className={`relative border-gray-200/80 bg-white hover:shadow-lg transition-shadow ${
                tier.popular ? "ring-2 ring-[#BFA6F6] shadow-lg" : ""
              }`}
              data-testid={`pricing-card-${tier.id}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#BFA6F6] text-white text-xs px-3 py-0.5" data-testid="badge-most-popular">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 pt-8">
                <h3 className="text-lg font-bold mb-1" data-testid={`pricing-name-${tier.id}`}>{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#BFA6F6]" data-testid={`pricing-price-${tier.id}`}>
                    {isCAD ? `$${tier.monthlyCAD}` : `$${tier.monthlyUSD}`}
                  </span>
                  <span className="text-sm text-[#2E3A59]/50 ml-1">/{isCAD ? "mo CAD" : "mo USD"}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[#2E3A59]/70">
                      <Check className="w-4 h-4 text-[#AEE3E1] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full ${
                    tier.popular
                      ? "bg-[#BFA6F6] hover:bg-[#a98cf0] text-white"
                      : "bg-white border border-[#BFA6F6]/30 text-[#2E3A59] hover:bg-[#BFA6F6]/5"
                  }`}
                  onClick={() => onNavigate("/demo-exam")}
                  data-testid={`button-pricing-cta-${tier.id}`}
                >
                  Try free exam first
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" data-testid="pricing-comparison-table">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-[#2E3A59]">{t("pages.marketing.NclexLandingPage.feature")}</th>
                {pricingTiers.map((tier) => (
                  <th key={tier.id} className="text-center py-3 px-4 font-semibold text-[#2E3A59]">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Adaptive CAT Exams", rpn: true, rn: true, np: true },
                { feature: "Practice Questions", rpn: "4,200+", rn: "3,900+", np: "2,800+" },
                { feature: "Detailed Rationales", rpn: true, rn: true, np: true },
                { feature: "Flashcards", rpn: true, rn: true, np: true },
                { feature: "Performance Analytics", rpn: true, rn: true, np: true },
                { feature: "Clinical Judgment Scenarios", rpn: false, rn: true, np: true },
                { feature: "Diagnostic Reasoning Cases", rpn: false, rn: false, np: true },
                { feature: "Monthly Price (CAD)", rpn: "$29.99", rn: "$39.99", np: "$49.99" },
                { feature: "Monthly Price (USD)", rpn: "$21.99", rn: "$29.99", np: "$36.99" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-100" data-testid={`comparison-row-${i}`}>
                  <td className="py-3 px-4 text-[#2E3A59]/70 font-medium">{row.feature}</td>
                  {(["rpn", "rn", "np"] as const).map((tier) => (
                    <td key={tier} className="text-center py-3 px-4">
                      {typeof row[tier] === "boolean" ? (
                        row[tier] ? (
                          <Check className="w-4 h-4 text-[#AEE3E1] mx-auto" />
                        ) : (
                          <span className="text-[#2E3A59]/20">—</span>
                        )
                      ) : (
                        <span className="text-sm text-[#2E3A59]/70">{row[tier]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#BFA6F6]/5 to-[#AEE3E1]/5" data-testid="final-cta-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Award className="w-12 h-12 text-[#BFA6F6] mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4" data-testid="final-cta-headline">
          Ready to pass the NCLEX?
        </h2>
        <p className="text-lg text-[#2E3A59]/60 mb-8 max-w-xl mx-auto">
          Start with a free demo exam and see why thousands of nursing students trust NurseNest for their exam preparation.
        </p>
        <Button
          size="lg"
          onClick={() => onNavigate("/demo-exam")}
          className="bg-[#BFA6F6] hover:bg-[#a98cf0] text-white border-none px-8 h-12 rounded-full text-base font-medium shadow-lg shadow-[#BFA6F6]/20"
          data-testid="final-cta-button"
        >
          Start Free Demo Exam
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
}

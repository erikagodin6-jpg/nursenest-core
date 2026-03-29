import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { getExamConstants, type Region as ConstRegion } from "@shared/constants";
const LazyNavigation = lazy(() => import("@/components/navigation").then(m => ({ default: m.Navigation })));
import { SEO } from "@/components/seo";
import { useAuth } from "@/lib/auth";

const AdminEditButton = lazy(() => import("@/components/admin-edit-button").then(m => ({ default: m.AdminEditButton })));
const Footer = lazy(() => import("@/components/footer").then(m => ({ default: m.Footer })));
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LazySection } from "@/components/lazy-section";
import {
  ArrowRight,
  Shield,
  BookOpen,
  CheckCircle2,
  MapPin,
  Trophy,
  HelpCircle,
  Layers,
  Users,
  Brain,
  Target,
  ClipboardList,
  Stethoscope,
  GraduationCap,
  Heart,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";
import { getEnabledCareers } from "@shared/careers";

import { useQuery } from "@tanstack/react-query";
import type { HeroStats, PlatformProof } from "@shared/lesson-stats";

function NavPlaceholder() {
  return (
    <nav className="h-11 sm:h-16 bg-white border-b border-transparent sticky top-0 z-50" aria-hidden="true" />
  );
}

const HomeHeroFeatures = lazy(() => import("@/components/home-hero-features"));
const HomeConversionSections = lazy(() => import("@/components/home-conversion-sections"));
const HomeBottomSections = lazy(() => import("@/components/home-bottom-sections"));
const HomeChoosePath = lazy(() => import("@/components/home-choose-path"));
const HomeCareerCta = lazy(() => import("@/components/home-career-cta"));
const HeroPlatformStats = lazy(() => import("@/components/hero-platform-stats"));
const HeroFeatureStrip = lazy(() => import("@/components/hero-feature-strip"));
const HeroTrustIndicator = lazy(() => import("@/components/hero-trust-indicator"));
const HeroFeaturesGrid = lazy(() => import("@/components/hero-features-grid"));
const HeroGlobalCoverage = lazy(() => import("@/components/hero-global-coverage"));
const HeroNursingTiers = lazy(() => import("@/components/hero-nursing-tiers"));
const HeroCertifications = lazy(() => import("@/components/hero-certifications"));
const HeroAlliedHealth = lazy(() => import("@/components/hero-allied-health"));
const HeroExpansionTracker = lazy(() => import("@/components/hero-expansion-tracker"));
const HomeDifferentiation = lazy(() => import("@/components/competitive-differentiation").then(m => ({
  default: () => (
    <>
      <m.WhyNurseNestGrid />
      <m.ComparisonTable />
    </>
  )
})));

const heroCarouselSlides = [
  {
    srcSet: "/screenshots/screenshottest_1773379293573-480w.webp 480w, /screenshots/screenshottest_1773379293573-768w.webp 768w, /screenshots/screenshottest_1773379293573-1200w.webp 1200w",
    fallback: "/screenshots/screenshottest_1773379293573-768w.webp",
    alt: "NurseNest question interface",
  },
  {
    srcSet: "/screenshots/screenshot6_1773379293573-480w.webp 480w, /screenshots/screenshot6_1773379293573-768w.webp 768w, /screenshots/screenshot6_1773379293573-1200w.webp 1200w",
    fallback: "/screenshots/screenshot6_1773379293573-768w.webp",
    alt: "NurseNest flashcard deck",
  },
  {
    srcSet: "/screenshots/screenshot5_1773379293573-480w.webp 480w, /screenshots/screenshot5_1773379293573-768w.webp 768w, /screenshots/screenshot5_1773379293573-1200w.webp 1200w",
    fallback: "/screenshots/screenshot5_1773379293573-768w.webp",
    alt: "NurseNest mock exam report",
  },
  {
    srcSet: "/screenshots/screenshot2_1773379293573-480w.webp 480w, /screenshots/screenshot2_1773379293573-768w.webp 768w, /screenshots/screenshot2_1773379293573-1200w.webp 1200w",
    fallback: "/screenshots/screenshot2_1773379293573-768w.webp",
    alt: "NurseNest progress analytics dashboard",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroCarouselSlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!isHovered) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, startTimer]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="hero-carousel"
    >
      <div className="rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)] border border-gray-100/80 bg-white relative aspect-[16/10]" style={{ overflowAnchor: "none" }}>
        {heroCarouselSlides.map((slide, index) => (
          <img
            key={index}
            srcSet={slide.srcSet}
            sizes="(max-width: 768px) 480px, 600px"
            src={slide.fallback}
            alt={slide.alt}
            width={1200}
            height={750}
            decoding={index === 0 ? "sync" : "async"}
            className={`absolute inset-0 w-full h-full object-cover will-change-[opacity] transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            data-testid={`img-hero-slide-${index}`}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-3" data-testid="hero-carousel-dots">
        {heroCarouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

function formatCount(n: number | undefined): string {
  if (n === undefined || n === 0) return "---";
  if (n < 10) return `${n}`;
  if (n >= 1000) {
    const hundreds = Math.floor(n / 100) * 100;
    return `${hundreds.toLocaleString()}+`;
  }
  const tens = Math.floor(n / 10) * 10;
  return `${tens}+`;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { t, language } = useI18n();
  const [email, setEmail] = useState("");
  const [emailFrequency, setEmailFrequency] = useState("weekly");

  const { user } = useAuth();
  const isAdmin = user?.tier === "admin";

  const { data: heroStats } = useQuery<HeroStats>({
    queryKey: ["/api/hero-stats"],
    staleTime: 10 * 60 * 1000,
  });

  const { data: platformProof } = useQuery<PlatformProof>({
    queryKey: ["/api/public/platform-proof"],
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });

  const lessonCount = platformProof?.totalLessons ?? heroStats?.totalLessons ?? 0;
  const questionCount = platformProof?.totalQuestions ?? heroStats?.questionCount ?? 0;
  const flashcardCount = platformProof?.totalFlashcards ?? 10000;
  const deckCount = platformProof?.totalDecks ?? 140;
  const storeProductCount = heroStats?.storeProductCount ?? 0;
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [region, setRegionState] = useState<"US" | "CA">(() => {
    return (localStorage.getItem("nursenest-region") as "US" | "CA") || "US";
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const handler = () => setRegionState((localStorage.getItem("nursenest-region") as "US" | "CA") || "US");
    window.addEventListener("regionChange", handler);
    return () => window.removeEventListener("regionChange", handler);
  }, []);

  const setRegion = (newRegion: "US" | "CA") => {
    setRegionState(newRegion);
    localStorage.setItem("nursenest-region", newRegion);
    window.dispatchEvent(new Event("regionChange"));
  };

  const regionConst = getExamConstants(region as ConstRegion);
  const examLabel = regionConst.practicalNurse.examName;
  const rpnLabel = regionConst.practicalNurse.designation;
  const altExam = region === "CA" ? "NCLEX-PN" : "REx-PN";
  const enabledCareers = getEnabledCareers();

  async function handleEmailSubscribe() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailStatus("error");
      setEmailMessage(t("home.email.invalidEmail"));
      return;
    }
    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, frequency: emailFrequency }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || t("home.email.subscriptionFailed"));
      }
      setEmailStatus("success");
      setEmailMessage(t("home.email.success"));
      setEmail("");
    } catch (e: any) {
      setEmailStatus("error");
      setEmailMessage(e.message || t("home.email.somethingWrong"));
    }
  }

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans md:animate-page-enter overflow-x-hidden">
      <SEO
        title={`NurseNest - Healthcare Exam Prep | Nursing, NP, Allied Health & Certifications | ${examLabel} & NCLEX Test Bank`}
        description={`Prepare for nursing, NP certification, and allied health exams with NurseNest. Access ${formatCount(questionCount)} practice questions, ${flashcardCount > 0 ? `${formatCount(flashcardCount)} flashcards across ${formatCount(deckCount)} decks, ` : ""}adaptive CAT exams, clinical case simulations, and ${formatCount(lessonCount)} lessons. Built for ${rpnLabel}, RN, NP, allied health students, and new graduates in Canada and the US. Start free.`}
        keywords={`healthcare exam prep, nursing exam prep, NCLEX practice questions, ${examLabel} exam preparation, nursing question bank, clinical simulations, pharmacology flashcards, pathophysiology lessons, RPN study guide, RN exam review, NP exam prep, NP certification exam, AANP exam prep, ANCC certification review, FNP-BC exam questions, AGPCNP-BC study guide, AGACNP-BC practice test, PMHNP-BC exam prep, PNP-BC certification review, NNP-BC exam questions, ENP-C exam prep, nurse practitioner board exam, Next Generation NCLEX, NCLEX-RN practice questions, allied health exam prep, respiratory therapy RRT exam, paramedic NREMT exam prep, MLT exam prep, pharmacy technician PTCB, diagnostic imaging exam, social work ASWB exam, occupational therapy NBCOT, new grad nurse resources, nursing specialty certification, CCRN exam prep, CEN exam prep, nursing clinical reasoning, med-surg nursing review, nursing licensure exam, clinical judgment, nursing study tools, nursing board exam prep, pre-nursing program`}
        canonicalPath="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NurseNest",
          "url": "https://www.nursenest.ca/en",
          "description": `Comprehensive healthcare exam preparation platform with ${formatCount(questionCount)} practice questions, clinical case simulations, and ${formatCount(lessonCount)} lessons for nursing, NP, and allied health exams. New content added weekly.`,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.nursenest.ca/lessons?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": t("home.faq.q1"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a1") } },
              { "@type": "Question", "name": t("home.faq.q2"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a2") } },
              { "@type": "Question", "name": t("home.faq.q3"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a3") } },
              { "@type": "Question", "name": t("home.faq.q4"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a4") } },
              { "@type": "Question", "name": t("home.faq.q5"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a5") } },
              { "@type": "Question", "name": t("home.faq.q6"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a6") } },
              { "@type": "Question", "name": t("home.faq.q7"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a7") } },
              { "@type": "Question", "name": t("home.faq.q8"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a8") } },
              { "@type": "Question", "name": t("home.faq.q9"), "acceptedAnswer": { "@type": "Answer", "text": `${t("home.faq.a9prefix")} ${t("home.faq.a9suffix")}` } },
              { "@type": "Question", "name": t("home.faq.q10"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a10") } },
              { "@type": "Question", "name": t("home.faq.q11"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a11") } },
              { "@type": "Question", "name": t("home.faq.q12"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a12") } },
              { "@type": "Question", "name": t("home.faq.q13"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a13") } },
              { "@type": "Question", "name": t("home.faq.q14"), "acceptedAnswer": { "@type": "Answer", "text": t("home.faq.a14") } },
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca/en",
            "description": "Premier nursing and allied health education platform for RPN/LVN, RN/NCLEX, NP, RRT, MLT, paramedic, social work, psychotherapy, addictions counselling, and occupational therapy students.",
            "educationalCredentialAwarded": "Healthcare Exam Preparation — Nursing, NP, Allied Health & Certifications",
            "sameAs": [
              "https://www.instagram.com/nursenest.ca",
              "https://www.tiktok.com/@nursenest.ca",
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1240",
              "bestRating": "5"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "NurseNest Course Catalog",
              "itemListElement": [
                { "@type": "Course", "name": "NCLEX-RN Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "REx-PN / NCLEX-PN Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "NP Certification Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "RRT Respiratory Therapy Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "MLT Medical Lab Technologist Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "Paramedic NREMT Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "Social Work ASWB Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "Psychotherapy CRPO Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "Addictions Counselling Exam Prep", "courseMode": "online" },
                { "@type": "Course", "name": "Occupational Therapy NBCOT Exam Prep", "courseMode": "online" },
              ],
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "NCLEX-RN Exam Preparation",
            "description": "Comprehensive NCLEX-RN exam preparation with adaptive question banks, clinical simulations, and pharmacology review.",
            "url": "https://www.nursenest.ca/en/nclex-rn",
            "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca/en" },
            "courseMode": "online",
            "isAccessibleForFree": false,
            "offers": { "@type": "Offer", "price": "39.99", "priceCurrency": "CAD", "availability": "https://schema.org/InStock" }
          },
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "NCLEX-PN / REx-PN Exam Preparation",
            "description": "Dedicated NCLEX-PN and REx-PN exam preparation for practical nursing students with practice questions and clinical reasoning exercises.",
            "url": "https://www.nursenest.ca/en/rex-pn",
            "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca/en" },
            "courseMode": "online",
            "isAccessibleForFree": false,
            "offers": { "@type": "Offer", "price": "29.99", "priceCurrency": "CAD", "availability": "https://schema.org/InStock" }
          },
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "NP Certification Exam Preparation",
            "description": "Advanced nurse practitioner certification exam preparation covering AANP, ANCC, FNP-BC, AGPCNP-BC, AGACNP-BC, PMHNP-BC, PNP-BC, NNP-BC, and ENP-C exams.",
            "url": "https://www.nursenest.ca/en/np-exam-practice-questions",
            "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca/en" },
            "courseMode": "online",
            "isAccessibleForFree": false,
            "offers": { "@type": "Offer", "price": "49.99", "priceCurrency": "CAD", "availability": "https://schema.org/InStock" }
          }
        ]}
      />
      <Suspense fallback={<NavPlaceholder />}>
        <LazyNavigation />
      </Suspense>
      
      <main className="flex-grow overflow-x-hidden">
        <section className="relative overflow-hidden" style={{ paddingTop: 'var(--space-hero-top)', paddingBottom: 'var(--space-hero-bottom)' }} data-testid="hero-section">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none hidden md:block will-change-transform" aria-hidden="true">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[80px]" style={{ transform: 'translateZ(0)' }} />
            <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[100px]" style={{ transform: 'translateZ(0)' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center lg:items-start">
              <div className="space-y-6 lg:space-y-5 md:animate-in md:fade-in md:slide-in-from-bottom-8 md:duration-700">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/5 border border-primary/15" data-testid="badge-trust-micro">
                    <Award className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-primary">{t("home.hero.trustMicroBadge")}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100" data-testid="badge-authority">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-700">{t("home.hero.authorityBadge")}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-bold tracking-tight text-gray-900 leading-[1.08]" style={{ fontSize: 'var(--text-hero)' }} data-testid="text-hero-heading">
                    {t("home.hero.mainTitle")}
                  </h1>
                  
                  <p className="text-base lg:text-lg text-gray-700 leading-relaxed max-w-xl" data-testid="text-hero-subheading">
                    {t("home.hero.newSubheadline")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3" data-testid="hero-feature-strip">
                  {[
                    { icon: Brain, key: "featureActiveRecall", descKey: "featureActiveRecallDesc", color: "text-violet-600", bg: "bg-violet-50" },
                    { icon: ClipboardList, key: "featureNGN", descKey: "featureNGNDesc", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: Target, key: "featureBlueprint", descKey: "featureBlueprintDesc", color: "text-amber-600", bg: "bg-amber-50" },
                    { icon: Stethoscope, key: "featureClinicalDecision", descKey: "featureClinicalDecisionDesc", color: "text-emerald-600", bg: "bg-emerald-50" },
                  ].map((feat) => (
                    <div key={feat.key} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-gray-100 shadow-[var(--shadow-card)]" data-testid={`feature-${feat.key}`}>
                      <div className={`w-8 h-8 rounded-lg ${feat.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <feat.icon className={`w-4 h-4 ${feat.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{t(`home.hero.${feat.key}`)}</p>
                        <p className="text-[11px] text-gray-600 leading-snug mt-0.5 hidden sm:block">{t(`home.hero.${feat.descKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="rounded-2xl border border-gray-200 bg-white shadow-[var(--shadow-card)] overflow-hidden" data-testid="region-toggle-hero">
                  <div className="flex">
                    <button
                      onClick={() => setRegion("US")}
                      className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 relative ${
                        region === "US"
                          ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-b-2 border-transparent"
                      }`}
                      data-testid="button-region-us"
                    >
                      <span className="text-xl" role="img" aria-label={t("pages.home.usFlag")}>🇺🇸</span>
                      <span>{t("home.region.us")}</span>
                      {region === "US" && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                    <div className="w-px bg-gray-200" />
                    <button
                      onClick={() => setRegion("CA")}
                      className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-200 relative ${
                        region === "CA"
                          ? "bg-red-50 text-red-700 border-b-2 border-red-600"
                          : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 border-b-2 border-transparent"
                      }`}
                      data-testid="button-region-ca"
                    >
                      <span className="text-xl" role="img" aria-label={t("pages.home.canadianFlag")}>🇨🇦</span>
                      <span>{t("home.region.ca")}</span>
                      {region === "CA" && <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />}
                    </button>
                  </div>
                  <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {region === "US" ? t("home.region.usDesc") : t("home.region.caDesc")}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button 
                    size="lg" 
                    className="h-13 sm:h-14 px-7 sm:px-9 text-base sm:text-lg rounded-full bg-primary hover:brightness-110 shadow-[var(--shadow-elevated)] shadow-primary/25 transition-transform hover:-translate-y-0.5 text-white w-full sm:w-auto font-semibold" 
                    onClick={() => setLocation("/register")}
                    data-testid="button-hero-start-free"
                  >
                    {t("home.hero.ctaPrimary")}
                    <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-13 sm:h-14 px-7 sm:px-9 text-base sm:text-lg rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 bg-white w-full sm:w-auto font-medium" 
                    onClick={() => setLocation("/exam-prep")}
                    data-testid="button-hero-browse"
                  >
                    <BookOpen className="mr-2 w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                    {t("home.hero.ctaSecondary")}
                  </Button>
                </div>

                <p className="text-xs text-gray-600 text-center sm:text-left" data-testid="text-urgency-microcopy">
                  {t("home.hero.urgencyMicrocopy")}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("home.hero.noCreditCard")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("home.hero.guarantee")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t("home.hero.cancelAnytime")}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-gray-700" data-testid="hero-trust-indicators">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 shrink-0" />
                    <span data-testid="text-trust-pass-rate">{t("home.hero.trustPassRate")}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-400" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span data-testid="text-trust-questions">{questionCount > 0 ? `${formatCount(questionCount)} ${t("home.hero.trustQuestionsLabel")}` : t("home.hero.trustQuestions")}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-400" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span data-testid="text-trust-flashcards">{flashcardCount > 0 ? `${formatCount(flashcardCount)} ${t("home.hero.trustFlashcardsLabel")}` : t("home.hero.trustFlashcards")}</span>
                  </div>
                  <span className="hidden sm:inline text-gray-400" aria-hidden="true">·</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span data-testid="text-trust-students">{t("home.hero.trustStudents")}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white/60 shadow-[var(--shadow-card)] p-4" data-testid="hero-built-for-bar">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-2.5">{t("home.hero.builtForLabel")}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: GraduationCap, key: "builtForNursingStudents" },
                      { icon: Heart, key: "builtForPracticalNurses" },
                      { icon: Stethoscope, key: "builtForRegisteredNurses" },
                      { icon: Briefcase, key: "builtForNursePractitioners" },
                      { icon: Users, key: "builtForAlliedHealth" },
                    ].map((seg) => (
                      <span key={seg.key} className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] sm:text-xs font-medium text-gray-700" data-testid={`built-for-${seg.key}`}>
                        <seg.icon className="w-3 h-3 text-gray-500 shrink-0" />
                        {t(`home.hero.${seg.key}`)}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">{t("home.hero.builtForMicrocopy")}</p>
                </div>
              </div>

              <div className="relative hidden lg:block" style={{ overflowAnchor: "none" }}>
                <HeroCarousel />
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-[var(--shadow-card-hover)] border border-gray-100/80 px-5 py-3.5 flex items-center gap-3 z-10">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t("home.hero.passRate")}</div>
                    <div className="text-xs text-gray-600">{t("home.hero.firstAttempt")}</div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-[var(--shadow-card-hover)] border border-gray-100/80 px-4 py-2.5 flex items-center gap-2 z-10">
                  <div className="flex -space-x-1.5">
                    {["bg-blue-400", "bg-emerald-400", "bg-purple-400"].map((bg, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}>
                        {["P", "J", "A"][i]}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{t("home.hero.studentCount")}</span>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 flex items-center gap-2 z-10 shadow-sm pointer-events-none" data-testid="badge-students-studying">
                  <div className="flex -space-x-1">
                    {["bg-blue-400", "bg-pink-400", "bg-amber-400"].map((bg, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full ${bg} border-[1.5px] border-white`} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-emerald-700">{t("home.hero.studentsStudying")}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-12" data-testid="section-careers-supported">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                {t("home.hero.examPrepFor", { region: region === "CA" ? t("home.region.ca") : t("home.region.us") })}
              </p>
              <div className="flex flex-wrap gap-2">
                {enabledCareers.slice(0, 8).map((career) => (
                  <span
                    key={career.id}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-gray-150 text-xs font-medium text-gray-600 shadow-sm"
                  >
                    {career.shortName}
                  </span>
                ))}
                {enabledCareers.length > 8 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-xs font-semibold text-primary">
                    {t("home.hero.moreCount", { count: String(enabledCareers.length - 8) })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-gray-50/80 to-white border-t border-gray-100" style={{ paddingTop: 'var(--space-block)', paddingBottom: 'var(--space-block)' }} data-testid="section-hero-benefits">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-6" data-testid="text-benefits-heading">
              {t("home.hero.benefitsHeading")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: "benefit1", icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
                { key: "benefit2", icon: Brain, color: "text-violet-600", bg: "bg-violet-50" },
                { key: "benefit3", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
                { key: "benefit4", icon: Target, color: "text-amber-600", bg: "bg-amber-50" },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-gray-100 shadow-[var(--shadow-card)]" data-testid={`hero-${item.key}`}>
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{t(`home.hero.${item.key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LazySection minHeight="60px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[60px]" />}>
            <HeroFeatureStrip />
          </Suspense>
        </LazySection>
        <LazySection minHeight="50px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[50px]" />}>
            <HeroTrustIndicator />
          </Suspense>
        </LazySection>

        <LazySection minHeight="200px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <HomeHeroFeatures />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroPlatformStats />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="200px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HomeChoosePath />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroFeaturesGrid />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroGlobalCoverage />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroNursingTiers />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroCertifications />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HeroAlliedHealth />
          </Suspense>
        </LazySection>

        <LazySection minHeight="300px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[300px]" />}>
            <HeroExpansionTracker />
          </Suspense>
        </LazySection>

        <LazySection minHeight="600px" rootMargin="300px">
          <Suspense fallback={<div className="min-h-[600px]" />}>
            <HomeDifferentiation />
          </Suspense>
        </LazySection>

        <LazySection minHeight="400px" rootMargin="200px">
          <Suspense fallback={<div className="min-h-[400px]" />}>
            <HomeConversionSections
              lessonCount={lessonCount}
              questionCount={questionCount}
            />
          </Suspense>
        </LazySection>

        <LazySection minHeight="200px" rootMargin="200px">
          <Suspense fallback={<div className="min-h-[200px]" />}>
            <HomeCareerCta />
          </Suspense>
        </LazySection>

        <LazySection minHeight="800px" rootMargin="400px">
          <Suspense fallback={<div className="min-h-[800px]" />}>
            <HomeBottomSections
              region={region}
              heroStats={heroStats}
              featuredProducts={[]}
              lessonCount={lessonCount}
              questionCount={questionCount}
              storeProductCount={storeProductCount}
              email={email}
              setEmail={setEmail}
              emailFrequency={emailFrequency}
              setEmailFrequency={setEmailFrequency}
              emailStatus={emailStatus}
              emailMessage={emailMessage}
              setEmailStatus={setEmailStatus}
              handleEmailSubscribe={handleEmailSubscribe}
            />
          </Suspense>
        </LazySection>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <a href="/languages" className="inline-flex items-center gap-2 text-sm text-[var(--theme-muted-text)] hover:text-primary transition-colors" data-testid="link-home-languages">
            <span>🌐</span>
            <span>{t("pages.home.availableIn20LanguagesStudy")}</span>
            <span>{t("pages.home.rarr")}</span>
          </a>
        </div>

      </main>

      {isAdmin && heroStats?.breakdown && (
        <div className="max-w-4xl mx-auto px-4 py-6" data-testid="section-admin-hero-debug">
          <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <summary className="text-sm font-bold text-gray-600 cursor-pointer">{t("pages.home.adminLessonCountBreakdown")}</summary>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {(["rpn", "rn", "np", "free"] as const).map(tier => (
                <div key={tier} className="bg-white p-3 rounded border">
                  <p className="font-bold text-gray-900 uppercase">{tier}</p>
                  <p>Static: {heroStats.breakdown![`${tier}Static` as keyof typeof heroStats.breakdown]}</p>
                  <p>DB: {heroStats.breakdown![`${tier}Db` as keyof typeof heroStats.breakdown]}</p>
                  <p className="font-bold mt-1">Total: {heroStats[`${tier}Lessons` as keyof typeof heroStats]}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded border">
                <p className="font-bold text-gray-900">{t("pages.home.totalLessons")}</p>
                <p className="text-lg font-bold">{heroStats.totalLessons}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-bold text-gray-900">{t("pages.home.totalQuestions")}</p>
                <p className="text-lg font-bold">{heroStats.questionCount}</p>
                <p className="text-gray-500">incl. {heroStats.storeQuestionCount || 0} store</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-bold text-gray-900">{t("pages.home.storeProducts")}</p>
                <p className="text-lg font-bold">{heroStats.storeProductCount || 0}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Last updated: {heroStats.lastUpdatedISO}</p>
          </details>
        </div>
      )}

      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
      {isAdmin && (
        <Suspense fallback={null}>
          <AdminEditButton />
        </Suspense>
      )}
    </div>
  );
}

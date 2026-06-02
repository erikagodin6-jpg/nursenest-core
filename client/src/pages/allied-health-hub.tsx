import { Link } from "wouter";
import { useEffect } from "react";
import HeroFeatureStrip from "@/components/hero-feature-strip";
import HeroTrustIndicator from "@/components/hero-trust-indicator";
import {
  ALLIED_HEALTH_PROFESSIONS,
  ALLIED_HEALTH_PROFESSION_SLUGS,
} from "@/allied/data/allied-health-professions";
import { WhyNurseNestGrid, DifferentiatorCTA } from "@/components/competitive-differentiation";
import { useI18n } from "@/lib/i18n";
import {
  Wind, Ambulance, Pill, Microscope, ScanLine, Monitor, HeartPulse,
  Hand, Activity, Scissors, ArrowRight, BookOpen, GraduationCap,
  TrendingUp, Users, Award, ChevronRight
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Wind, Ambulance, Pill, Microscope, ScanLine, Monitor, HeartPulse,
  Hand, Activity, Scissors,
};

function setMetaTags() {
  const { t } = useI18n();
  document.title = "Allied Health Careers & Study Resources | NurseNest";
  const setMeta = (attr: string, name: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.content = content;
  };
  setMeta("name", "description", "Explore 10 allied health career paths with comprehensive study resources, certification guides, question banks, mock exams, and career information for healthcare professionals.");
  setMeta("property", "og:title", "Allied Health Careers & Study Resources | NurseNest");
  setMeta("property", "og:description", "Explore 10 allied health career paths with comprehensive study resources, certification guides, and exam prep tools.");
  setMeta("property", "og:type", "website");
  setMeta("property", "og:url", "https://www.nursenest.ca/allied-health");
  setMeta("name", "twitter:title", "Allied Health Careers & Study Resources | NurseNest");
  setMeta("name", "twitter:description", "Explore 10 allied health career paths with study resources and certification guides.");
  setMeta("name", "twitter:card", "summary_large_image");

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = "https://www.nursenest.ca/allied-health";

  const existingLd = document.getElementById("allied-health-hub-ld");
  if (existingLd) existingLd.remove();

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Allied Health Careers & Study Resources",
    "description": "Comprehensive resource hub for 10 allied health professions with study tools, certification guides, and career information.",
    "url": "https://www.nursenest.ca/allied-health",
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca" },
        { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" }
      ]
    }
  };
  const script = document.createElement("script");
  script.id = "allied-health-hub-ld";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ldJson);
  document.head.appendChild(script);
}

export default function AlliedHealthHub() {
  useEffect(() => {
    setMetaTags();
    return () => {
      const el = document.getElementById("allied-health-hub-ld");
      if (el) el.remove();
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.remove();
    };
  }, []);

  const professions = ALLIED_HEALTH_PROFESSION_SLUGS.map(
    (slug) => ALLIED_HEALTH_PROFESSIONS[slug]
  );

  return (
    <div className="min-h-screen bg-white" data-testid="allied-health-hub-page">
      <nav className="bg-gray-50 border-b border-gray-100 py-3 px-4" data-testid="breadcrumb-nav">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-teal-600 transition-colors" data-testid="breadcrumb-home">{t("pages.alliedHealthHub.home")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium" data-testid="breadcrumb-current">{t("pages.alliedHealthHub.alliedHealth")}</span>
        </div>
      </nav>

      <section className="relative overflow-hidden py-16 sm:py-24" data-testid="hub-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-100/80 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6" data-testid="badge-hub">
              <GraduationCap className="w-4 h-4" />
              Allied Health Career Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid="text-hub-title">
              Learn It Once. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">{t("pages.alliedHealthHub.rememberItForYourExam")}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto" data-testid="text-hub-subtitle">
              Our retention-focused healthcare exam preparation system uses active recall and spaced repetition across 6,500+ practice questions and blueprint-aligned mock exams for 10 allied health professions.
            </p>
            <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 inline-block mb-3" data-testid="text-hub-loss-aversion">
              Don't risk failing your certification exam — start building confidence today
            </p>
            <p className="text-sm text-gray-500 italic mb-6 max-w-xl mx-auto" data-testid="text-hub-future-self">
              Walk into your certification exam knowing exactly what to expect and how to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-600 text-white rounded-xl text-base font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200" data-testid="button-start-free-hub">
                Start Practicing Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/allied-health/careers" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-teal-700 rounded-xl text-base font-semibold hover:bg-teal-50 transition-all border border-teal-200" data-testid="button-view-pricing-hub">
                Explore Career Paths
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-6" data-testid="hub-trust-badges">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-500" />
                <span>{t("pages.alliedHealthHub.noCreditCardRequired")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-teal-500" />
                <span>{t("pages.alliedHealthHub.blueprintalignedContent")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                <span>{t("pages.alliedHealthHub.cancelAnytime")}</span>
              </div>
            </div>
            <div className="max-w-lg mx-auto p-4 rounded-xl bg-white/70 border border-teal-100 backdrop-blur-sm" data-testid="hub-clarity-block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">{t("pages.alliedHealthHub.whatYouGet")}</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>{t("pages.alliedHealthHub.careerspecificQuestionBanksWithDetailed")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>{t("pages.alliedHealthHub.blueprintweightedMockExamsThatMirror")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span>{t("pages.alliedHealthHub.aipoweredStudyPlansAndReadiness")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroFeatureStrip />
      <HeroTrustIndicator />

      <section className="py-6 bg-white border-b border-gray-100" data-testid="hub-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: "10", label: "Career Paths" },
              { icon: BookOpen, value: "6,500+", label: "Practice Questions" },
              { icon: Award, value: "25+", label: "Certifications Covered" },
              { icon: TrendingUp, value: "15%+", label: "Avg Job Growth" },
            ].map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <stat.icon className="w-5 h-5 text-teal-500 mx-auto mb-1.5" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" data-testid="hub-professions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-professions-heading">
              Choose Your Career Path
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Each profession includes career guides, certification information, study tools, and exam preparation resources.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professions.map((profession) => {
              const Icon = ICON_MAP[profession.icon] || BookOpen;
              return (
                <Link
                  key={profession.slug}
                  href={`/allied-health/${profession.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                  data-testid={`card-profession-${profession.slug}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: profession.colorAccent }}
                  >
                    <Icon className="w-6 h-6" style={{ color: profession.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors" data-testid={`text-profession-name-${profession.slug}`}>
                    {profession.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {profession.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profession.examNames.slice(0, 3).map((exam) => (
                      <span
                        key={exam}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                      >
                        {exam}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{profession.salaryRange}</span>
                    <span className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <WhyNurseNestGrid
        headline="Why NurseNest for Allied Health Exam Prep"
        subtitle="NurseNest provides exam-aligned test banks, adaptive practice engines, and clinical lessons built specifically for allied health certification exams."
        context="allied"
      />

      <section className="py-8 bg-white" data-testid="hub-faq-link">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-2">{t("pages.alliedHealthHub.haveQuestionsAboutAlliedHealth")}</p>
          <Link
            href="/allied-health/faq"
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            data-testid="link-allied-health-faq"
          >
            View Allied Health FAQ <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 border-t border-gray-100" data-testid="section-new-grad-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-100 text-indigo-700">
            <GraduationCap className="w-4 h-4" /> Graduating Soon?
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid="text-allied-new-grad-cta">{t("pages.alliedHealthHub.careerReadinessForNewHealthcare")}</h2>
          <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
            Finishing your program? Our New Grad Career Hub helps you prepare for interviews, build your resume, negotiate salary, and thrive in your first year of practice.
          </p>
          <Link href="/newgrad" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200" data-testid="link-allied-new-grad">
            Explore New Grad Career Hub <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <DifferentiatorCTA
        headline="Ready to Start Your Healthcare Career?"
        subtitle="Choose your profession above to access career guides, certification info, and free study tools. Start preparing for your certification exam today."
        primaryHref="/register"
        primaryLabel="Get Started"
        secondaryHref="/pricing"
        secondaryLabel="View Plans"
      />
    </div>
  );
}

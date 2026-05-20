import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { ImagingUpgradeCTA } from "@/components/imaging-paywall";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, FileText, Zap, Brain, Star, ArrowRight,
  CheckCircle2, Radio, BarChart3, Lock, Target, TrendingUp,
  GraduationCap, Image, Lightbulb, Award, Newspaper, CreditCard, ShoppingBag
} from "lucide-react";

interface CountryConfig {
  name: string;
  flag: string;
  exam: string;
  examFull: string;
  color: string;
  gradient: string;
  accentBg: string;
  description: string;
  sections: { title: string; description: string; icon: typeof BookOpen; href: string; available: boolean }[];
  quickStart: { title: string; description: string }[];
  seoKeywords: string;
}

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  canada: {
    name: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    exam: "CAMRT",
    examFull: "Canadian Association of Medical Radiation Technologists",
    color: "text-red-600",
    gradient: "from-red-500 to-red-600",
    accentBg: "bg-red-50",
    description: "Prepare for the CAMRT certification exam with Canada-specific radiographic positioning, radiation safety regulations (CNSC guidelines), patient care protocols, and image evaluation criteria aligned with Canadian practice standards.",
    sections: [
      { title: "Lessons & Study Guides", description: "Comprehensive lessons covering all CAMRT exam domains including radiographic procedures, radiation protection, patient care, and equipment operation.", icon: BookOpen, href: "/medical-imaging/canada/lessons", available: true },
      { title: "Flashcards", description: "Spaced-repetition flashcards for anatomy landmarks, positioning criteria, physics formulas, and radiation safety standards.", icon: Zap, href: "/medical-imaging/canada/flashcards", available: true },
      { title: "Practice Exams", description: "Timed practice exams weighted to the CAMRT blueprint with detailed rationales and performance analytics.", icon: FileText, href: "/medical-imaging/canada/practice-exams", available: true },
      { title: "Exam Simulator", description: "Adaptive certification exam simulator with realistic testing interface, timed sessions, and detailed score reports.", icon: Target, href: "/medical-imaging/canada/exam-simulator", available: true },
      { title: "Positioning Guide", description: "Complete radiographic positioning reference with patient positions, central ray directions, and critical anatomy for every projection.", icon: Radio, href: "/medical-imaging/canada/positioning", available: true },
      { title: "Physics Review", description: "Radiation physics topics covering X-ray production, interactions, image quality, and safety with key formulas.", icon: Brain, href: "/medical-imaging/canada/physics", available: true },
      { title: "Progress Tracker", description: "Track your readiness across all exam domains with predicted pass probability and personalized study recommendations.", icon: BarChart3, href: "/medical-imaging/canada/progress", available: false },
    ],
    quickStart: [
      { title: "Take Diagnostic", description: "Identify your strengths and gaps with a free 30-question diagnostic assessment." },
      { title: "Review Weak Areas", description: "Focus on your lowest-scoring domains with targeted lessons and flashcards." },
      { title: "Practice Under Pressure", description: "Take timed practice exams to build test-taking stamina and confidence." },
      { title: "Track Progress", description: "Monitor your improvement and get a predicted pass probability score." },
    ],
    seoKeywords: "CAMRT exam prep, Canadian radiography certification, CAMRT practice questions, radiologic technologist Canada, medical radiation technologist exam, CAMRT study guide",
  },
  usa: {
    name: "USA",
    flag: "\u{1F1FA}\u{1F1F8}",
    exam: "ARRT",
    examFull: "American Registry of Radiologic Technologists",
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    accentBg: "bg-blue-50",
    description: "Prepare for the ARRT certification exam with USA-specific radiographic positioning, NRC radiation safety regulations, patient care standards, and image evaluation criteria aligned with ASRT practice standards.",
    sections: [
      { title: "Lessons & Study Guides", description: "Comprehensive lessons covering all ARRT exam content specifications including image production, procedures, patient care, and safety.", icon: BookOpen, href: "/medical-imaging/usa/lessons", available: true },
      { title: "Flashcards", description: "Spaced-repetition flashcards for anatomy, positioning, physics concepts, and radiation protection standards.", icon: Zap, href: "/medical-imaging/usa/flashcards", available: true },
      { title: "Practice Exams", description: "Timed practice exams weighted to the ARRT content specifications with detailed rationales and score breakdowns.", icon: FileText, href: "/medical-imaging/usa/practice-exams", available: true },
      { title: "Exam Simulator", description: "Adaptive certification exam simulator with realistic testing interface, timed sessions, and detailed score reports.", icon: Target, href: "/medical-imaging/usa/exam-simulator", available: true },
      { title: "Positioning Guide", description: "Complete radiographic positioning reference with patient positions, central ray directions, and critical anatomy for every projection.", icon: Radio, href: "/medical-imaging/usa/positioning", available: true },
      { title: "Physics Review", description: "Radiation physics topics covering X-ray production, interactions, image quality, and safety with key formulas.", icon: Brain, href: "/medical-imaging/usa/physics", available: true },
      { title: "Progress Tracker", description: "Dashboard tracking your mastery across all ARRT content categories with readiness prediction.", icon: BarChart3, href: "/medical-imaging/usa/progress", available: false },
    ],
    quickStart: [
      { title: "Free Diagnostic", description: "Start with a 30-question assessment to benchmark your current knowledge." },
      { title: "Study Weak Domains", description: "Targeted lessons and drills for your lowest-performing content areas." },
      { title: "Simulate the Exam", description: "Full-length timed exams matching the ARRT format and difficulty." },
      { title: "Monitor Readiness", description: "Get a predicted pass score based on your rolling performance data." },
    ],
    seoKeywords: "ARRT exam prep, radiography certification USA, ARRT practice questions, radiologic technologist exam, X-ray tech certification, ARRT study guide, radiography board exam",
  },
};

function DiscoveryModules({ country, config }: { country: string; config: CountryConfig }) {
  const { t } = useI18n();
  const { data: discovery } = useQuery({
    queryKey: ["/api/imaging-seo/discovery", country],
    queryFn: async () => {
      const res = await fetch(`/api/imaging-seo/discovery/${country}`);
      return res.json();
    },
  });

  const modules = [
    {
      key: "popular",
      title: "Most Popular Topics",
      icon: TrendingUp,
      items: discovery?.popularTopics || [],
      renderItem: (item: any) => (
        <Link href={`/medical-imaging/${country}/seo/${item.slug}`} className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-indigo-600" data-testid={`link-popular-${item.slug}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "beginner",
      title: "Recommended for Beginners",
      icon: GraduationCap,
      items: discovery?.beginnerResources || [],
      renderItem: (item: any) => (
        <Link href={`/medical-imaging/${country}/seo/${item.slug}`} className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-green-600" data-testid={`link-beginner-${item.slug}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "articles",
      title: "Study Guides & Articles",
      icon: Newspaper,
      items: discovery?.latestArticles || [],
      renderItem: (item: any) => (
        <Link href={`/medical-imaging/blog/${item.slug}`} className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all" data-testid={`link-article-${item.slug}`}>
          <span className="text-sm font-medium text-gray-700 hover:text-blue-600">{item.title}</span>
          {item.readTimeMinutes && <span className="block text-xs text-gray-400 mt-0.5">{item.readTimeMinutes} min read</span>}
        </Link>
      ),
    },
    {
      key: "exam",
      title: "Exam Readiness Tools",
      icon: Award,
      items: discovery?.examReadiness || [],
      renderItem: (item: any) => (
        <Link href={`/medical-imaging/${country}/seo/${item.slug}`} className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-purple-600" data-testid={`link-exam-${item.slug}`}>
          {item.title}
        </Link>
      ),
    },
  ];

  const hasContent = modules.some(m => m.items.length > 0);
  const stats = discovery?.stats;

  return (
    <section className="py-14 bg-gray-50" data-testid={`${country}-discovery`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingCountry.discoverExplore")}</h2>
          <p className="text-gray-600">Find the right study resources for your {config.exam} preparation</p>
        </div>

        {stats && (stats.positioningGuides > 0 || stats.practiceQuestions > 0 || stats.flashcards > 0) && (
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
            <div className="text-center bg-white rounded-xl border border-gray-100 p-4" data-testid="stat-positioning">
              <div className="text-2xl font-bold text-indigo-600">{stats.positioningGuides}</div>
              <div className="text-xs text-gray-500">{t("pages.medicalImagingCountry.positioningGuides")}</div>
            </div>
            <div className="text-center bg-white rounded-xl border border-gray-100 p-4" data-testid="stat-questions">
              <div className="text-2xl font-bold text-indigo-600">{stats.practiceQuestions}</div>
              <div className="text-xs text-gray-500">{t("pages.medicalImagingCountry.practiceQuestions")}</div>
            </div>
            <div className="text-center bg-white rounded-xl border border-gray-100 p-4" data-testid="stat-flashcards">
              <div className="text-2xl font-bold text-indigo-600">{stats.flashcards}</div>
              <div className="text-xs text-gray-500">{t("pages.medicalImagingCountry.flashcards")}</div>
            </div>
          </div>
        )}

        {hasContent ? (
          <div className="grid md:grid-cols-2 gap-6">
            {modules.filter(m => m.items.length > 0).map(mod => {
              const Icon = mod.icon;
              return (
                <div key={mod.key} className="bg-white rounded-2xl border border-gray-100 p-6" data-testid={`discovery-${mod.key}`}>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                    <Icon className="w-5 h-5 text-indigo-500" /> {mod.title}
                  </h3>
                  <div className="space-y-2">
                    {mod.items.slice(0, 4).map((item: any, i: number) => (
                      <div key={i}>{mod.renderItem(item)}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href={`/medical-imaging/${country}/practice-exams`} className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-practice">
              <FileText className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.practiceQuestions2")}</span>
            </Link>
            <Link href={`/medical-imaging/${country}/positioning`} className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-positioning">
              <Radio className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.positioningGuide")}</span>
            </Link>
            <Link href={`/medical-imaging/${country}/flashcards`} className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-flashcards">
              <Zap className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.flashcards2")}</span>
            </Link>
            <Link href={`/medical-imaging/${country}/physics`} className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-physics">
              <Brain className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.physicsReview")}</span>
            </Link>
            <Link href="/medical-imaging/blog" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-blog">
              <Newspaper className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.studyGuides")}</span>
            </Link>
            <Link href="/radiography-practice-questions" className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-center" data-testid="link-discover-free">
              <Lightbulb className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">{t("pages.medicalImagingCountry.freeResources")}</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function MedicalImagingCanada() {
  return <MedicalImagingCountryPage country="canada" />;
}

export function MedicalImagingUSA() {
  return <MedicalImagingCountryPage country="usa" />;
}

function MedicalImagingCountryPage({ country }: { country: string }) {
  const config = COUNTRY_CONFIGS[country];
  if (!config) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.medicalImagingCountry.countryNotFound")}</h1>
        <p className="text-gray-600">{t("pages.medicalImagingCountry.theCountryPathwayYoureLooking")}</p>
        <Link href="/medical-imaging" className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700" data-testid="link-back-imaging">
          Back to Medical Imaging
        </Link>
      </div>
    );
  }

  return (
    <div data-testid={`medical-imaging-${country}-page`}>
      <SEO
        title={`${config.exam} Radiography Exam Prep - ${config.name} | NurseNest`}
        description={config.description}
        keywords={config.seoKeywords}
        canonicalPath={`/medical-imaging/${country}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": `${config.exam} Radiography Exam Prep`,
          "description": config.description,
          "provider": {
            "@type": "Organization",
            "name": "NurseNest",
            "url": "https://www.nursenest.ca"
          },
          "educationalLevel": "Professional Certification",
          "about": {
            "@type": "Thing",
            "name": `${config.examFull} Certification`
          },
          "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": "PT8W"
          }
        }}
        additionalStructuredData={[{
          "@context": "https://schema.org",
          "@type": "PracticeExam",
          "name": `${config.exam} Practice Exam`,
          "description": `Practice exam for the ${config.examFull} certification`,
          "provider": { "@type": "Organization", "name": "NurseNest" },
          "educationalLevel": "Professional Certification"
        }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Medical Imaging", url: "https://www.nursenest.ca/medical-imaging" },
          { name: `${config.name} (${config.exam})`, url: `https://www.nursenest.ca/medical-imaging/${country}` },
        ]} />
      </div>

      <section className="relative overflow-hidden py-14 sm:py-20" data-testid={`${country}-hero`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${config.accentBg} via-white/50 to-white`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-gray-700" data-testid={`badge-${country}`}>
              <span className="text-lg">{config.flag}</span>
              {config.examFull}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" data-testid={`text-${country}-title`}>
              <span className={config.color}>{config.exam}</span> Radiography Exam Prep
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" data-testid={`text-${country}-description`}>
              {config.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16" data-testid={`${country}-sections`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingCountry.studyResources")}</h2>
            <p className="text-gray-600">Everything you need to pass the {config.exam} exam</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.sections.map(section => (
              <div
                key={section.title}
                className={`bg-white rounded-2xl border border-gray-100 p-6 transition-all ${section.available ? "hover:shadow-lg hover:border-indigo-200 cursor-pointer" : "opacity-80"}`}
                data-testid={`section-${section.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  {!section.available && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
                      <Lock className="w-3 h-3" /> Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{section.description}</p>
                {section.available ? (
                  <Link href={section.href} className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium hover:text-indigo-700">
                    Start Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">{t("pages.medicalImagingCountry.availableSoon")}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-gradient-to-b from-gray-50 to-white" data-testid={`${country}-quickstart`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("pages.medicalImagingCountry.quickStartPath")}</h2>
            <p className="text-gray-600">{t("pages.medicalImagingCountry.followThese4StepsTo")}</p>
          </div>
          <div className="space-y-4">
            {config.quickStart.map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-5" data-testid={`quickstart-step-${i + 1}`}>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiscoveryModules country={country} config={config} />

      <section className="py-10 bg-white" data-testid={`${country}-pricing-cta`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ImagingUpgradeCTA country={country} variant="banner" />
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href={`/medical-imaging/${country}/pricing`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors" data-testid={`link-${country}-pricing`}>
              <CreditCard className="w-4 h-4" /> View {config.exam} Pricing
            </Link>
            <Link href="/medical-imaging/store" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors" data-testid={`link-${country}-store`}>
              <ShoppingBag className="w-4 h-4" /> Browse Study Packs
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white" data-testid={`${country}-progress-placeholder`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className={`${config.accentBg} rounded-2xl p-8 sm:p-12 border border-gray-100`}>
            <BarChart3 className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid={`text-${country}-progress-title`}>
              Progress Tracker
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Sign in to track your progress across all {config.exam} exam domains, view your readiness score, and get personalized study recommendations.
            </p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors" data-testid={`button-${country}-signin`}>
              Sign In to Track Progress <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedicalImagingCountryPage;

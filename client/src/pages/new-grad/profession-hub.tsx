import { useState } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { ChecklistGate, FlashcardCTA, PracticeQuestionCTA } from "@/components/marketing-cta";
import { getProfessionBySlug, PROFESSION_LIST } from "./profession-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, ChevronRight, ChevronDown, HelpCircle,
  GraduationCap, DollarSign, TrendingUp, MapPin, Award,
  CheckCircle2, BookOpen, Shield, Star,
} from "lucide-react";

const HERO_BG_MAP: Record<string, string> = {
  blue: "bg-gradient-to-br from-blue-50 via-blue-50/30 to-white",
  red: "bg-gradient-to-br from-red-50 via-red-50/30 to-white",
  teal: "bg-gradient-to-br from-teal-50 via-teal-50/30 to-white",
  purple: "bg-gradient-to-br from-purple-50 via-purple-50/30 to-white",
  amber: "bg-gradient-to-br from-amber-50 via-amber-50/30 to-white",
  green: "bg-gradient-to-br from-green-50 via-green-50/30 to-white",
};

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? 'text-blue-500' : 'text-gray-400'}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function NewGradProfessionHub() {
  const { t } = useI18n();
  const params = useParams<{ profession: string }>();
  const profession = getProfessionBySlug(params.profession || "");

  if (!profession) {
    return (
      <div data-testid="profession-hub-not-found">
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.newGrad.professionHub.professionNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.newGrad.professionHub.theProfessionHubYoureLooking")}</p>
            <Link href="/new-grad" className="text-blue-600 hover:underline">{t("pages.newGrad.professionHub.backToNewGradHub")}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(
    (profession.faqs || []).map(f => ({ question: f.question, answer: f.answer }))
  );

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${profession.fullTitle} Transition Hub`,
    "description": profession.seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "educationalLevel": profession.fullTitle,
    "about": `${profession.name} Career Transition`,
    "inLanguage": "en",
    "url": `https://www.nursenest.ca/new-grad/${profession.slug}`,
  };

  const IconComp = profession.icon;

  return (
    <div data-testid={`profession-hub-${profession.slug}`}>
      <Navigation />
      <SEO
        title={profession.seoTitle}
        description={profession.seoDescription}
        keywords={profession.seoKeywords}
        canonicalPath={`/new-grad/${profession.slug}`}
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: `${profession.name}`, url: `https://www.nursenest.ca/new-grad/${profession.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 ${HERO_BG_MAP[profession.color] || HERO_BG_MAP.blue}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-blue-600">{t("pages.newGrad.professionHub.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/new-grad" className="hover:text-blue-600">{t("pages.newGrad.professionHub.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">{profession.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${profession.badgeColor}`} data-testid="badge-profession">
              <IconComp className="w-4 h-4" />
              {profession.fullTitle}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hero-title">
              {profession.heroTitle} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${profession.gradient}`}>{profession.heroHighlight}</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8" data-testid="text-hero-subtitle">
              {profession.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${profession.survivalGuideSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200" data-testid="button-survival-guide">
                First Year Survival Guide <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/new-grad" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-all-professions">
                All Professions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-salary">
              <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{profession.salaryRange}</div>
              <div className="text-sm text-gray-500">{t("pages.newGrad.professionHub.salaryRange")}</div>
            </div>
            <div data-testid="stat-growth">
              <TrendingUp className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{profession.jobGrowth}</div>
              <div className="text-sm text-gray-500">{t("pages.newGrad.professionHub.jobGrowth")}</div>
            </div>
            <div data-testid="stat-settings">
              <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{profession.settingsCount}</div>
              <div className="text-sm text-gray-500">{t("pages.newGrad.professionHub.workSettings")}</div>
            </div>
            <div data-testid="stat-certs">
              <Award className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-900">{(profession.certifications || []).length}</div>
              <div className="text-sm text-gray-500">{t("pages.newGrad.professionHub.keyCertifications")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-career-overview">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" data-testid="text-overview-title">{t("pages.newGrad.professionHub.careerOverview")}</h2>
          <p className="text-gray-600 leading-relaxed mb-6" data-testid="text-overview-body">{profession.careerOverview}</p>
          <div className="flex flex-wrap gap-2">
            {(profession.certifications || []).map((cert, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${profession.badgeColor}`} data-testid={`badge-cert-${i}`}>
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-first-year">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-first-year-title">{t("pages.newGrad.professionHub.whatToExpectInYour")}</h2>
          <p className="text-gray-600 mb-8">{t("pages.newGrad.professionHub.keyMilestonesAndExpectationsDuring")}</p>
          <div className="space-y-4">
            {(profession.firstYearExpectations || []).map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4" data-testid={`expectation-${i}`}>
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-challenges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-challenges-title">{t("pages.newGrad.professionHub.commonNewGradChallenges")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every new {profession.name.toLowerCase()} professional faces these hurdles. Knowing what to expect helps you prepare.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(profession.challenges || []).map((challenge, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-200 transition-all" data-testid={`card-challenge-${i}`}>
                <challenge.icon className="w-7 h-7 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">{challenge.title}</h3>
                <p className="text-sm text-gray-500">{challenge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ChecklistGate
          title={`Download Your ${profession.name} Shift Survival Checklist`}
          description={`A printable day-by-day checklist for your first 90 days as a new ${profession.name.toLowerCase()} professional. Enter your email to get instant access.`}
          checklistName={`${profession.slug}-survival-checklist`}
        />
      </div>

      <section className="py-16 bg-gray-50" data-testid="section-clinical-tips">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-tips-title">{t("pages.newGrad.professionHub.clinicalTipsForNewGraduates")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Practical advice from experienced {profession.name.toLowerCase()} professionals to help you succeed.</p>
          </div>
          <div className="space-y-5">
            {(profession.clinicalTips || []).map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-6" data-testid={`card-tip-${i}`}>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {tip.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-9">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="section-resources">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-resources-title">{t("pages.newGrad.professionHub.learningResources")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t("pages.newGrad.professionHub.toolsAndResourcesToHelp")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(profession.resources || []).map((resource, i) => (
              <Link key={i} href={resource.href} className="group" data-testid={`card-resource-${i}`}>
                <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all h-full">
                  <BookOpen className="w-7 h-7 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{resource.title}</h3>
                  <p className="text-sm text-gray-500">{resource.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium mt-3">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FlashcardCTA profession={profession.name.toLowerCase()} href={profession.resources?.[1]?.href || "/flashcards"} variant="sidebar" />
          <PracticeQuestionCTA profession={profession.name.toLowerCase()} href={profession.resources?.[0]?.href || "/free-practice"} variant="sidebar" />
        </div>
      </div>

      <section className="py-16 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3" data-testid="text-faq-title">{t("pages.newGrad.professionHub.frequentlyAskedQuestions")}</h2>
            <p className="text-gray-600">Common questions from new {profession.name.toLowerCase()} graduates</p>
          </div>
          <div className="space-y-3">
            {(profession.faqs || []).map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700" data-testid="section-conversion">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-conversion-title">
            Launch Your {profession.name} Career with Confidence
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Everything you need for exam prep, clinical confidence, and career development in {profession.name.toLowerCase()}.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`/${profession.survivalGuideSlug}`} className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-400 transition-colors border border-blue-400" data-testid="button-cta-guide">
              First Year Guide
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-blue-200 text-sm">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> {t("pages.newGrad.professionHub.14dayGuarantee")}</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {t("pages.newGrad.professionHub.cancelAnytime")}</span>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-other-professions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("pages.newGrad.professionHub.exploreOtherProfessions")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PROFESSION_LIST.filter(p => p.slug !== profession.slug).map((p) => {
              const PIcon = p.icon;
              return (
                <Link key={p.slug} href={`/new-grad/${p.slug}`} className="group" data-testid={`link-profession-${p.slug}`}>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md hover:border-blue-200 transition-all">
                    <PIcon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{p.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

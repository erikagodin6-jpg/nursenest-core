import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { EXAM_BLUEPRINTS } from "@/lib/question-pool";
import {
  NP_EXAM_HUB_CARDS,
  AANP_PAGE_DATA,
  ANCC_PAGE_DATA,
  UPCOMING_CANADA_NP_DATA,
  AGPCNP_PAGE_DATA,
  AGACNP_PAGE_DATA,
  PMHNP_PAGE_DATA,
  PNP_PAGE_DATA,
  WHNP_PAGE_DATA,
  ENP_PAGE_DATA,
  NP_LESSON_DOMAIN_MAP,
  type NpExamPageData,
} from "@/lib/np-exam-ecosystem";
import { useState } from "react";
import {
  BookOpen, Target, Layers, Stethoscope, ChevronRight, ArrowRight,
  Award, Brain, GraduationCap, BarChart, Shield, Clock, FileText,
  CheckCircle, MapPin, Pill, ChevronDown, Calendar, Lightbulb,
  Globe, Users, Star, HelpCircle, Sparkles, Flag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`button-faq-${i}`}
          >
            <span className="font-medium text-sm text-gray-900 pr-4">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
};

export function NpExamHubPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "NP Exam Preparation Hub",
    description: "Central hub for Nurse Practitioner exam preparation covering AANP, ANCC, Canadian CNPLE, and upcoming Canadian NP exam pathways.",
    provider: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
    hasPart: NP_EXAM_HUB_CARDS.map(card => ({
      "@type": "Course",
      name: card.title,
      description: card.description,
      url: `https://www.nursenest.ca${card.href}`,
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.npExamPages.npExamPreparationHubAanp")}
        description={t("pages.npExamPages.chooseYourNpCertificationExam")}
        keywords="NP exam prep, AANP exam, ANCC exam, CNPLE exam, nurse practitioner certification, NP practice questions, NP mock exam"
        canonicalPath="/np/exams"
        ogType="website"
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP", url: "https://www.nursenest.ca/np" },
          { name: "NP Exam Hub", url: "https://www.nursenest.ca/np/exams" },
        ]}
      />
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-[#2E3A59] to-[#3d4d73] text-white py-16 md:py-20" data-testid="np-exam-hub-hero">
          <div className="max-w-5xl mx-auto px-4">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "/" },
                { name: "NP Exam Prep", url: "/np-exam-prep" },
                { name: "NP Exam Hub", url: "/np/exams" },
              ]}
              className="mb-6 text-white/60"
            />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#BFA6F6]/20 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#BFA6F6]" />
              </div>
              <Badge className="bg-[#BFA6F6]/20 text-[#BFA6F6] border-0 text-xs">{t("pages.npExamPages.npTier")}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-np-exam-hub-title">
              NP Exam Preparation Hub
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl" data-testid="text-np-exam-hub-intro">
              Select your Nurse Practitioner certification exam below. Each pathway provides exam-specific practice questions, mock exams with authentic scoring, domain-matched study guides, and performance analytics tailored to your exam blueprint.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#2E3A59] mb-2" data-testid="text-us-pathways-heading">{t("pages.npExamPages.unitedStatesNpCertification")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("pages.npExamPages.chooseYourUsNpCertifying")}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {NP_EXAM_HUB_CARDS.filter(c => c.region === "US").map(card => {
                const colors = COLOR_MAP[card.color] || COLOR_MAP.blue;
                return (
                  <LocaleLink key={card.examCode} href={card.href} data-testid={`card-exam-${card.examCode.toLowerCase()}`}>
                    <Card className={`h-full hover:shadow-lg transition-all duration-200 border-2 ${colors.border} hover:border-[#BFA6F6] group cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>{card.badge}</span>
                          <Flag className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <h3 className="text-lg font-bold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors mb-1" data-testid={`text-exam-title-${card.examCode.toLowerCase()}`}>
                          {card.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{card.subtitle}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.description}</p>
                        <div className="flex items-center gap-2 text-[#BFA6F6] text-sm font-semibold group-hover:gap-3 transition-all">
                          Start Preparation <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#2E3A59] mb-2" data-testid="text-ca-pathways-heading">{t("pages.npExamPages.canadianNpLicensing")}</h2>
            <p className="text-sm text-gray-500 mb-4">{t("pages.npExamPages.canadianNpExamPathways")}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {NP_EXAM_HUB_CARDS.filter(c => c.region === "CA").map(card => {
                const colors = COLOR_MAP[card.color] || COLOR_MAP.red;
                return (
                  <LocaleLink key={card.examCode} href={card.href} data-testid={`card-exam-${card.examCode.toLowerCase().replace("_", "-")}`}>
                    <Card className={`h-full hover:shadow-lg transition-all duration-200 border-2 ${colors.border} hover:border-[#BFA6F6] group cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>{card.badge}</span>
                          <Globe className={`w-4 h-4 ${colors.text}`} />
                        </div>
                        <h3 className="text-lg font-bold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors mb-1" data-testid={`text-exam-title-${card.examCode.toLowerCase().replace("_", "-")}`}>
                          {card.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{card.subtitle}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.description}</p>
                        <div className="flex items-center gap-2 text-[#BFA6F6] text-sm font-semibold group-hover:gap-3 transition-all">
                          {card.examCode === "UPCOMING_CANADA_NP" ? "Learn More" : "Start Preparation"} <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8" data-testid="section-question-pools">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2E3A59]">{t("pages.npExamPages.examspecificQuestionBanks")}</h2>
                <p className="text-xs text-gray-500">{t("pages.npExamPages.questionsAreTaggedAndSeparated")}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-blue-800 mb-1">{t("pages.npExamPages.aanpQuestionBank")}</h3>
                <p className="text-xs text-blue-600">{t("pages.npExamPages.usspecificQuestionsAlignedToAanp")}</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-indigo-800 mb-1">{t("pages.npExamPages.anccQuestionBank")}</h3>
                <p className="text-xs text-indigo-600">{t("pages.npExamPages.usspecificQuestionsIncludingProfessionalRole")}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-red-800 mb-1">{t("pages.npExamPages.canadianNpBank")}</h3>
                <p className="text-xs text-red-600">{t("pages.npExamPages.canadianQuestionsWithSiUnits")}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-sm text-gray-800 mb-1">{t("pages.npExamPages.npCoreBank")}</h3>
                <p className="text-xs text-gray-600">{t("pages.npExamPages.sharedFoundationalNpQuestionsApplicable")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8" data-testid="section-quick-links">
            <h2 className="text-lg font-bold text-[#2E3A59] mb-4">{t("pages.npExamPages.quickAccess")}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon: Target, label: "NP Practice Questions", href: "/np-exam-practice-questions", desc: "Browse NP question bank" },
                { icon: Stethoscope, label: "NP Mock Exams", href: "/mock-exams", desc: "Full-length practice exams" },
                { icon: BookOpen, label: "NP Lessons", href: "/lessons?tier=np", desc: "Clinical study guides" },
                { icon: Layers, label: "NP Flashcards", href: "/flashcards", desc: "High-yield review cards" },
                { icon: Pill, label: "Pharmacology", href: "/medication-mastery", desc: "NP prescribing review" },
                { icon: BarChart, label: "Analytics", href: "/reports", desc: "Performance tracking" },
              ].map((link, i) => (
                <LocaleLink key={i} href={link.href} data-testid={`link-quick-${i}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#BFA6F6]/5 hover:border-[#BFA6F6]/20 border border-transparent transition-all group">
                    <div className="w-9 h-9 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center shrink-0">
                      <link.icon className="w-4 h-4 text-[#BFA6F6]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{link.label}</p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </div>

          <EndOfContentLeadCapture
            leadMagnetType="study_guide"
            professionContext="np"
            source="np_exam_hub"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

function NpExamDetailPage({ data }: { data: NpExamPageData }) {
  const blueprint = EXAM_BLUEPRINTS[data.examCode === "UPCOMING_CANADA_NP" ? "CNPLE" : data.examCode];
  const domains = blueprint?.domains || [];

  const faqStructuredData = buildFaqStructuredData(data.faqs.map(f => ({ question: f.q, answer: f.a })));
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: data.title,
    description: data.seoDescription,
    provider: { "@type": "EducationalOrganization", name: "NurseNest", url: "https://www.nursenest.ca" },
    url: `https://www.nursenest.ca/${data.slug}`,
    courseCode: data.examCode,
    educationalLevel: "Graduate",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "12 weeks",
    },
  };
  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: data.title,
    credentialCategory: "Professional Certification Examination",
    educationalLevel: "Graduate",
    recognizedBy: {
      "@type": "Organization",
      name: data.examCode === "AANP" ? "AANPCB" : data.examCode === "ANCC" ? "ANCC" : "CCRNR",
    },
  };

  return (
    <>
      <SEO
        title={data.seoTitle}
        description={data.seoDescription}
        keywords={data.keywords.join(", ")}
        canonicalPath={`/${data.slug}`}
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData, credentialSchema]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "NP Exam Prep", url: "https://www.nursenest.ca/np-exam-prep" },
          { name: data.title, url: `https://www.nursenest.ca/${data.slug}` },
        ]}
      />
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-[#2E3A59] to-[#3d4d73] text-white py-16 md:py-20" data-testid="exam-detail-hero">
          <div className="max-w-4xl mx-auto px-4">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "/" },
                { name: "NP Exam Prep", url: "/np-exam-prep" },
                { name: data.title, url: `/${data.slug}` },
              ]}
              className="mb-6 text-white/60"
            />
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-[#BFA6F6]/20 text-[#BFA6F6] border-0 text-xs">{data.examCode === "UPCOMING_CANADA_NP" ? "Coming Soon" : data.examCode}</Badge>
              <Badge className="bg-white/10 text-white/70 border-0 text-xs">{data.region === "CA" ? "Canada" : "United States"}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-exam-detail-title">
              {data.h1}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl" data-testid="text-exam-detail-intro">
              {data.heroIntro}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
          <section data-testid="section-exam-overview">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#BFA6F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.examOverview")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">{data.overview}</p>
            </div>
          </section>

          <section data-testid="section-who-is-it-for">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.whoIsThisExamFor")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{data.whoIsItFor}</p>
            </div>
          </section>

          <section data-testid="section-exam-format">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.examFormat")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <p className="text-gray-700 leading-relaxed">{data.formatExplanation}</p>
              {blueprint && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div data-testid="stat-total-questions">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.npExamPages.questions")}</p>
                    <p className="text-lg font-bold text-[#2E3A59]">{blueprint.totalQuestions}</p>
                  </div>
                  <div data-testid="stat-time-limit">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.npExamPages.timeLimit")}</p>
                    <p className="text-lg font-bold text-[#2E3A59]">{Math.floor(blueprint.timeLimit / 60)}h {blueprint.timeLimit % 60 > 0 ? `${blueprint.timeLimit % 60}m` : ""}</p>
                  </div>
                  <div data-testid="stat-exam-type">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.npExamPages.format")}</p>
                    <p className="text-lg font-bold text-[#2E3A59]">{t("pages.npExamPages.linearScaled")}</p>
                  </div>
                  {blueprint.scaledScoreRange && (
                    <div data-testid="stat-passing-score">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.npExamPages.passScore")}</p>
                      <p className="text-lg font-bold text-[#2E3A59]">{blueprint.scaledScoreRange.passScore}/{blueprint.scaledScoreRange.max}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section data-testid="section-scoring">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BarChart className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.scoring")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{data.scoringInfo}</p>
            </div>
          </section>

          {domains.length > 0 && (
            <section data-testid="section-domains">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.examDomains")}</h2>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="space-y-3">
                  {domains.map((domain, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`domain-${i}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center text-sm font-bold text-[#BFA6F6]">
                          {i + 1}
                        </div>
                        <span className="font-medium text-[#2E3A59]">{domain.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#BFA6F6] rounded-full" style={{ width: `${domain.weight * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 w-10 text-right">{Math.round(domain.weight * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section data-testid="section-lesson-mapping">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.recommendedNursenestLessonsByDomain")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                {NP_LESSON_DOMAIN_MAP.map((mapping, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4" data-testid={`lesson-domain-${i}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-[#BFA6F6]" />
                      <h3 className="font-semibold text-[#2E3A59]">{mapping.domain}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{mapping.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {mapping.lessonCategories.slice(0, 6).map((cat, j) => (
                        <LocaleLink key={j} href={`/lessons?tier=np`}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer" data-testid={`lesson-cat-${i}-${j}`}>
                            <BookOpen className="w-3 h-3" />
                            {cat}
                          </span>
                        </LocaleLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <LocaleLink href="/lessons?tier=np">
                  <Button variant="outline" size="sm" className="gap-1" data-testid="button-view-all-np-lessons">
                    View All NP Lessons <ArrowRight className="w-3 h-3" />
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </section>

          <section data-testid="section-study-roadmap">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.studyRoadmap")}</h2>
            </div>
            <div className="space-y-3">
              {data.studyRoadmap.map((phase, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4" data-testid={`roadmap-phase-${i}`}>
                  <div className="w-10 h-10 rounded-full bg-[#BFA6F6]/10 flex items-center justify-center text-[#BFA6F6] font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#2E3A59]">{phase.phase}</h3>
                      <span className="text-xs text-gray-400">({phase.weeks})</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section data-testid="section-exam-strategy">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.examStrategyTips")}</h2>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-3">
                {data.examStrategy.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`strategy-tip-${i}`}>
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {(data.examCode === "AANP" || data.examCode === "ANCC") && (
            <section className="bg-white border border-gray-200 rounded-xl p-6" data-testid="section-compare-exams">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#BFA6F6]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2E3A59]">
                  {data.examCode === "AANP" ? "Considering the ANCC Instead?" : "Considering the AANP Instead?"}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {data.examCode === "AANP"
                  ? "The ANCC certification exam includes more questions about professional role, research methodology, and evidence-based practice. It is often preferred by academic medical centers and VA hospitals. Both certifications carry equal weight for licensure."
                  : "The AANP certification exam focuses more heavily on clinical management scenarios and diagnosis. It is a strong choice for NPs who prefer patient-centered, scenario-based questions. Both certifications carry equal weight for licensure."
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <LocaleLink href={data.examCode === "AANP" ? "/np/ancc-exam" : "/np/aanp-exam"} data-testid="link-compare-other-exam">
                  <Button variant="outline" className="gap-2">
                    View {data.examCode === "AANP" ? "ANCC" : "AANP"} Exam Details <ArrowRight className="w-4 h-4" />
                  </Button>
                </LocaleLink>
                <LocaleLink href="/np-exam-prep#section-aanp-vs-ancc" data-testid="link-full-comparison">
                  <Button variant="ghost" className="gap-2 text-[#BFA6F6]">
                    Full AANP vs ANCC Comparison
                  </Button>
                </LocaleLink>
              </div>
            </section>
          )}

          <section className="bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-8 text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">Start Your {data.title} Preparation</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Access {data.examCode === "UPCOMING_CANADA_NP" ? "Canadian NP" : data.examCode}-specific practice questions, mock exams with domain analytics, and personalized study recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <LocaleLink href="/np-exam-practice-questions" data-testid="link-start-practice">
                <Button className="bg-[#BFA6F6] hover:bg-[#a88de8] text-white gap-2">
                  Practice Questions <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/mock-exams" data-testid="link-mock-exam">
                <Button variant="outline" className="gap-2">
                  Take Mock Exam <Target className="w-4 h-4" />
                </Button>
              </LocaleLink>
              <LocaleLink href="/np-exam-prep" data-testid="link-back-to-hub">
                <Button variant="ghost" className="gap-2 text-gray-600">
                  ← NP Exam Prep Hub
                </Button>
              </LocaleLink>
            </div>
          </section>

          <section data-testid="section-resource-links">
            <h2 className="text-lg font-bold text-[#2E3A59] mb-4">{t("pages.npExamPages.relatedResources")}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "NP Exam Prep Hub", href: "/np-exam-prep", desc: "All exam pathways" },
                { label: "NP Practice Questions", href: "/np-exam-practice-questions", desc: "Exam-specific questions" },
                { label: "NP Lessons", href: "/lessons?tier=np", desc: "Clinical guides" },
                { label: "Flashcards", href: "/flashcards", desc: "Quick review" },
                { label: "Mock Exams", href: "/mock-exams", desc: "Timed practice" },
                { label: "Pharmacology", href: "/medication-mastery", desc: "Drug review" },
              ].map((link, i) => (
                <LocaleLink key={i} href={link.href} data-testid={`link-resource-${i}`}>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors text-sm">{link.label}</p>
                        <p className="text-xs text-gray-500">{link.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                    </div>
                  </div>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.npExamPages.frequentlyAskedQuestions")}</h2>
            </div>
            <FAQAccordion faqs={data.faqs} />
          </section>

          <EndOfContentLeadCapture
            leadMagnetType="practice_questions"
            professionContext="np"
            source={`np_${data.examCode.toLowerCase()}_page`}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export function AanpExamPage() {
  return <NpExamDetailPage data={AANP_PAGE_DATA} />;
}

export function AnccExamPage() {
  return <NpExamDetailPage data={ANCC_PAGE_DATA} />;
}

export function UpcomingCanadaNpExamPage() {
  return <NpExamDetailPage data={UPCOMING_CANADA_NP_DATA} />;
}

export function AgpcnpExamPage() {
  return <NpExamDetailPage data={AGPCNP_PAGE_DATA} />;
}

export function AgacnpExamPage() {
  return <NpExamDetailPage data={AGACNP_PAGE_DATA} />;
}

export function PmhnpExamPage() {
  return <NpExamDetailPage data={PMHNP_PAGE_DATA} />;
}

export function PnpExamPage() {
  return <NpExamDetailPage data={PNP_PAGE_DATA} />;
}

export function WhnpExamPage() {
  return <NpExamDetailPage data={WHNP_PAGE_DATA} />;
}

export function EnpExamPage() {
  return <NpExamDetailPage data={ENP_PAGE_DATA} />;
}

export default NpExamHubPage;

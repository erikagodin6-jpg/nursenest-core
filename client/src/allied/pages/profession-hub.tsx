import { Link } from "wouter";
import {
  ArrowRight, BookOpen, FileText, Brain, Zap, Target, GraduationCap,
  CheckCircle2, HelpCircle, ChevronRight, ChevronDown, Award, BarChart3,
  DollarSign, TrendingUp, Briefcase, Users, ExternalLink, ClipboardList,
  Lock, Star, Calendar, UserCheck
} from "lucide-react";
import { useState } from "react";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { AlliedSEO } from "@/allied/allied-seo";
import { type ProfessionHubData } from "@/allied/data/profession-hub-data";
import { buildJobTrainingStructuredData } from "@/lib/structured-data";
import { getQuestionCountDisplay } from "@/data/career-questions/question-counts";

import { useI18n } from "@/lib/i18n";
const FEATURE_ICONS = [BookOpen, Brain, Zap, FileText, GraduationCap, Target];
const AUDIENCE_ICONS = [GraduationCap, UserCheck, Star, Briefcase];

interface ProfessionHubPageProps {
  data: ProfessionHubData;
}

export default function ProfessionHubPage({ data }: ProfessionHubPageProps) {
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${data.name} Exam Prep`,
    "description": data.seo.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest Allied",
      "url": "https://www.nursenest.ca/allied-health",
    },
    "courseMode": "online",
    "isAccessibleForFree": false,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 2, "name": "Careers", "item": "https://www.nursenest.ca/allied-health/careers" },
      { "@type": "ListItem", "position": 3, "name": `${data.shortName} Exam Prep`, "item": `https://www.nursenest.ca${data.seo.canonicalPath}` },
    ],
  };

  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "NurseNest Allied",
    "url": "https://www.nursenest.ca/allied-health",
    "description": "Allied health professional exam preparation platform offering courses for respiratory therapy, medical lab technology, social work, psychotherapy, addictions counselling, occupational therapy, and more.",
    "sameAs": [
      "https://www.instagram.com/nursenest.ca",
      "https://www.tiktok.com/@nursenest.ca",
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Allied Health Exam Prep Courses",
      "itemListElement": [
        {
          "@type": "Course",
          "name": `${data.name} Certification Prep`,
          "description": data.seo.description,
          "courseMode": "online",
          "provider": { "@type": "EducationalOrganization", "name": "NurseNest Allied" },
        },
        ...data.studyFeatures.map((f) => ({
          "@type": "Course",
          "name": `${data.shortName} – ${f.label}`,
          "description": f.description,
          "courseMode": "online",
          "provider": { "@type": "EducationalOrganization", "name": "NurseNest Allied" },
        })),
      ],
    },
  };

  return (
    <div data-testid={`profession-hub-${data.professionSlug}`}>
      <AlliedSEO
        title={data.seo.title}
        description={data.seo.description}
        keywords={data.seo.keywords}
        canonicalPath={data.seo.canonicalPath}
        structuredData={courseStructuredData}
        additionalStructuredData={[faqStructuredData, breadcrumbStructuredData, orgStructuredData, buildJobTrainingStructuredData({
          name: `${data.name} Certification Prep`,
          description: data.seo.description,
          url: `https://www.nursenest.ca${data.seo.canonicalPath}`,
          occupationalCategory: data.name,
          educationRequirements: data.examInfo?.examNames?.[0] ?? data.name,
          timeToComplete: "P12W",
        })]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50/30" style={{ background: `linear-gradient(135deg, ${data.colorAccent}40, white, ${data.colorAccent}20)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="hub-breadcrumbs">
            <Link href="/allied-health" className="hover:text-gray-700">{t("allied.professionHub.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/allied-health/careers" className="hover:text-gray-700">{t("allied.professionHub.careers")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: data.color }}>{data.shortName}</span>
          </div>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: data.colorAccent, color: data.color }}>
              <GraduationCap className="w-4 h-4" />
              {data.shortName} Exam Academy
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-hub-title">
              {data.shortName} Exam Prep
            </h1>
            <p className="text-lg text-gray-600 mb-6" data-testid="text-hub-tagline">{data.tagline}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                <span className="text-sm text-gray-700"><strong>{t("allied.professionHub.600WordRationales")}</strong> {t("allied.professionHub.explainingTheWhyBehindEvery")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                <span className="text-sm text-gray-700"><strong>{t("allied.professionHub.blueprintaligned")}</strong> {t("allied.professionHub.questionsMappedToOfficialExam")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                <span className="text-sm text-gray-700"><strong>{t("allied.professionHub.weakareaTargeting")}</strong> {t("allied.professionHub.soYouStudyWhatMatters")}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                <span className="text-sm text-gray-700"><strong>{t("allied.professionHub.adaptiveMockExams")}</strong> {t("allied.professionHub.simulatingRealCertificationConditions")}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`${data.contentClusterBase}/lessons`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: data.color }} data-testid="button-start-learning">
                <BookOpen className="w-4 h-4" /> Start Learning
              </Link>
              <Link href={`/qbank?career=${data.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" style={{ color: data.color }} data-testid="button-practice-questions">
                <Target className="w-4 h-4" /> Practice Questions
              </Link>
              <Link href={`${data.contentClusterBase}/study-guide`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" style={{ color: data.color }} data-testid="button-view-study-plan">
                <ClipboardList className="w-4 h-4" /> View Study Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-100" data-testid="section-stats">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-lessons">
              <div className="text-2xl font-bold text-gray-900">{data.studyResourceLinks?.length || data.studyFeatures.length}</div>
              <div className="text-sm text-gray-500">{t("allied.professionHub.lessons")}</div>
            </div>
            <div data-testid="stat-questions">
              <div className="text-2xl font-bold text-gray-900">{(() => { const display = getQuestionCountDisplay(data.careerSlug); return display === "Coming Soon" ? data.questionCountDisplay : display; })()}</div>
              <div className="text-sm text-gray-500">{t("allied.professionHub.practiceQuestions")}</div>
            </div>
            <div data-testid="stat-topics">
              <div className="text-2xl font-bold text-gray-900">{data.domains.length}</div>
              <div className="text-sm text-gray-500">{t("allied.professionHub.clinicalTopics")}</div>
            </div>
            <div data-testid="stat-features">
              <div className="text-2xl font-bold text-gray-900">{data.studyFeatures.length}</div>
              <div className="text-sm text-gray-500">{t("allied.professionHub.studyTools")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-exam-info">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">About the {data.shortName} Licensing Exam</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{data.examInfo.examDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: data.color }} />
                Exam Format
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{data.examInfo.examFormat}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: data.color }} />
                Certifying Bodies
              </h3>
              <ul className="space-y-2">
                {data.examInfo.certifyingBodies.map((body, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                    {body}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: data.color }} />
              Certification Exam Names
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.examInfo.examNames.map(name => (
                <span key={name} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: data.colorAccent, color: data.color }}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-career">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{data.shortName} Career Overview</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 mb-8">
            <p className="text-gray-600 leading-relaxed mb-6">{data.careerDescription}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <DollarSign className="w-5 h-5 flex-shrink-0" style={{ color: data.color }} />
                <div>
                  <div className="text-xs text-gray-500 font-medium">{t("allied.professionHub.salaryRange")}</div>
                  <div className="text-sm font-semibold text-gray-900">{data.salaryRange}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: data.color }} />
                <div>
                  <div className="text-xs text-gray-500 font-medium">{t("allied.professionHub.jobOutlook")}</div>
                  <div className="text-sm font-semibold text-gray-900">{data.jobOutlook}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-domains">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.professionHub.examBlueprintDomains")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.domains.map((domain, i) => (
              <div key={domain} className="bg-white rounded-lg border border-gray-100 px-4 py-3 flex items-center gap-3" data-testid={`domain-${i}`}>
                <Target className="w-4 h-4 flex-shrink-0" style={{ color: data.color }} />
                <span className="text-sm text-gray-700">{domain}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-study-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">{t("allied.professionHub.whatsIncluded")}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">Everything you need to prepare for your {data.shortName} certification exam, from practice questions to mock exams.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.studyFeatures.map((feature, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
              return (
                <div key={feature.label} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all" data-testid={`card-feature-${i}`}>
                  <Icon className="w-7 h-7 mb-3" style={{ color: data.color }} />
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.label}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {data.whoThisIsFor && data.whoThisIsFor.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-who-this-is-for">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.professionHub.whoThisIsFor")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Our {data.shortName} exam prep is designed for learners at every stage of their certification journey.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.whoThisIsFor.map((item, i) => {
                const Icon = AUDIENCE_ICONS[i % AUDIENCE_ICONS.length];
                return (
                  <div key={item.audience} className="bg-gray-50 rounded-xl p-5 border border-gray-100" data-testid={`card-audience-${i}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: data.colorAccent }}>
                        <Icon className="w-5 h-5" style={{ color: data.color }} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{item.audience}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {data.howBankWorks && data.howBankWorks.length > 0 && (
        <section className="py-16 bg-gray-50" data-testid="section-how-bank-works">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("allied.professionHub.howTheQuestionBankWorks")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">A structured, blueprint-driven approach to {data.shortName} exam preparation.</p>
            </div>
            <div className="space-y-4">
              {data.howBankWorks.map((step) => (
                <div key={step.step} className="bg-white rounded-xl p-5 border border-gray-100 flex items-start gap-4" data-testid={`step-bank-${step.step}`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: data.color }}>
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href={`/qbank?career=${data.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: data.color }} data-testid="button-try-question-bank">
                <Target className="w-4 h-4" /> Try the Question Bank Free
              </Link>
            </div>
          </div>
        </section>
      )}

      {data.practiceStrategy && data.practiceStrategy.length > 0 && (
        <section className="py-16 bg-white" data-testid="section-practice-strategy">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{data.shortName} Practice Strategy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t("allied.professionHub.followThisProvenStudyTimeline")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.practiceStrategy.map((phase, i) => (
                <div key={phase.week} className="rounded-xl border border-gray-100 overflow-hidden" data-testid={`card-strategy-${i}`}>
                  <div className="px-5 py-3 font-semibold text-white text-sm flex items-center gap-2" style={{ backgroundColor: data.color }}>
                    <Calendar className="w-4 h-4" />
                    {phase.week}: {phase.focus}
                  </div>
                  <div className="p-5 bg-white">
                    <ul className="space-y-2">
                      {phase.activities.map((activity, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100 text-center" data-testid="premium-strategy-cta">
              <Lock className="w-6 h-6 mx-auto mb-2" style={{ color: data.color }} />
              <h3 className="font-semibold text-gray-900 mb-1">{t("allied.professionHub.unlockYourFullStudyPlan")}</h3>
              <p className="text-sm text-gray-600 mb-4">{t("allied.professionHub.premiumMembersGetPersonalizedStudy")}</p>
              <Link href="/allied-health/pricing" className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors" style={{ backgroundColor: data.color }} data-testid="button-upgrade-strategy">
                <Star className="w-4 h-4" /> View Premium Plans
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white" data-testid="section-content-clusters">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore {data.shortName} Study Resources</h2>
            <p className="text-gray-600">{t("allied.professionHub.organizedStudyMaterialsToHelp")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.studyResourceLinks ? (
              data.studyResourceLinks.map((item, idx) => {
                const icons = [BookOpen, Brain, Target, GraduationCap, FileText];
                const Icon = icons[idx % icons.length];
                return (
                  <Link key={item.label} href={item.href} className="group" data-testid={`link-cluster-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: data.colorAccent }}>
                        <Icon className="w-5 h-5" style={{ color: data.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.label}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform mt-1" />
                    </div>
                  </Link>
                );
              })
            ) : (
              [
                { label: "Lessons", href: `${data.contentClusterBase}/lessons`, icon: BookOpen, desc: "In-depth lessons covering all exam domains" },
                { label: "Practice Questions", href: `${data.contentClusterBase}/practice-questions`, icon: Target, desc: "Exam-authentic questions with detailed rationales" },
                { label: "Flashcards", href: `${data.contentClusterBase}/flashcards`, icon: Brain, desc: "Spaced repetition cards for key concepts" },
                { label: "Mock Exam", href: `${data.contentClusterBase}/mock-exam`, icon: FileText, desc: "Full-length blueprint-weighted practice exams" },
                { label: "Study Guide", href: `${data.contentClusterBase}/study-guide`, icon: GraduationCap, desc: "Comprehensive study guide and planning tools" },
              ].map(item => (
                <Link key={item.label} href={item.href} className="group" data-testid={`link-cluster-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: data.colorAccent }}>
                      <item.icon className="w-5 h-5" style={{ color: data.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{item.label}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform mt-1" />
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-8" data-testid="section-topic-lessons">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.professionHub.studyByTopicArea")}</h3>
            <div className="flex flex-wrap gap-2">
              {data.domains.map((domain) => {
                const slug = domain.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                return (
                  <Link
                    key={domain}
                    href={`${data.contentClusterBase}/lessons?topic=${slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:shadow-sm transition-all border border-gray-200 bg-white"
                    style={{ color: data.color }}
                    data-testid={`link-topic-${slug}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {domain}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t("allied.professionHub.frequentlyAskedQuestions")}</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${i}`}
                >
                  <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: data.color }} />
                  <span className="font-medium text-gray-900 flex-1">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pl-13 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${i}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-cross-links">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">{t("allied.professionHub.relatedProfessions")}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">{t("allied.professionHub.exploreExamPrepResourcesFor")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.crossLinks.map(link => (
              <Link key={link.href} href={link.href} className="group" data-testid={`link-cross-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all h-full">
                  <ExternalLink className="w-5 h-5 text-gray-400 mb-2 group-hover:text-gray-600" />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-teal-700 transition-colors">{link.label}</h3>
                  <p className="text-xs text-gray-500">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100" data-testid="section-articles">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{t("allied.professionHub.careerStudyArticles")}</h2>
              <p className="text-gray-600 text-sm">{t("allied.professionHub.expertGuidesCoveringCertificationSalary")}</p>
            </div>
            <Link
              href={`/allied-health/${data.professionSlug}/articles`}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              style={{ color: data.color }}
              data-testid="link-all-articles"
            >
              View All Articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "How to Become", desc: `Step-by-step career guide for becoming a ${data.shortName}`, type: "how-to-become" },
              { label: "Salary Guide", desc: `${data.shortName} salary data, factors, and earning potential`, type: "salary-guide" },
              { label: "Exam Prep Tips", desc: `Strategies and tips for ${data.shortName} certification exams`, type: "exam-prep-tips" },
            ].map((item) => (
              <Link
                key={item.type}
                href={`/allied-health/${data.professionSlug}/articles`}
                className="bg-gray-50 rounded-xl p-4 hover:shadow-md hover:border-teal-200 border border-transparent transition-all"
                data-testid={`link-article-${item.type}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" style={{ color: data.color }} />
                  <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: `linear-gradient(to bottom, ${data.colorAccent}40, white)` }} data-testid="section-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your {data.shortName} Exam Prep?</h2>
          <p className="text-gray-600 mb-8">{t("allied.professionHub.takeAFreeDiagnosticTo")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={`${data.contentClusterBase}/lessons`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: data.color }} data-testid="button-cta-start-learning">
              <BookOpen className="w-4 h-4" /> Start Learning
            </Link>
            <Link href={`/qbank?career=${data.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" style={{ color: data.color }} data-testid="button-cta-practice-questions">
              <Target className="w-4 h-4" /> Practice Questions
            </Link>
            <Link href={`${data.contentClusterBase}/study-guide`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" style={{ color: data.color }} data-testid="button-cta-study-plan">
              <ClipboardList className="w-4 h-4" /> View Study Plan
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100" data-testid="section-related-resources">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("allied.professionHub.relatedResources")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.studyResourceLinks ? (
              data.studyResourceLinks.slice(0, 3).map(item => (
                <Link key={item.label} href={item.href} className="text-sm hover:underline" style={{ color: data.color }} data-testid={`link-resource-${item.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {data.shortName} {item.label} →
                </Link>
              ))
            ) : (
              <>
                <Link href={`/${data.contentClusterBase ? data.contentClusterBase.replace(/^\//, '') : data.careerSlug}`} className="text-sm hover:underline" style={{ color: data.color }} data-testid="link-career-overview">
                  {data.shortName} Career Overview →
                </Link>
                <Link href={`${data.contentClusterBase}/practice-questions`} className="text-sm hover:underline" style={{ color: data.color }} data-testid="link-practice-questions">
                  {data.shortName} Practice Questions →
                </Link>
                <Link href={`${data.contentClusterBase}/study-guide`} className="text-sm hover:underline" style={{ color: data.color }} data-testid="link-study-guide">
                  {data.shortName} Study Guide →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 gap-6">
          <MedicalReviewBadge />
          <MedicalReferences lessonId={data.professionSlug} pageType="allied-health" />
        </div>
      </div>

      <MedicalReviewJsonLd
        title={data.seo.title}
        slug={data.professionSlug}
        description={data.seo.description}
        pageUrl={`https://www.nursenest.ca${data.seo.canonicalPath}`}
      />
    </div>
  );
}

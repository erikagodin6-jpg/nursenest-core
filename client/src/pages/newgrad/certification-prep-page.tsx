import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContentGate } from "@/components/content-gate";
import { buildFaqStructuredData } from "@/lib/structured-data";
import type { CertPrepContent } from "./certification-prep-data";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, BookOpen, ChevronRight, Check, GraduationCap,
  ClipboardList, Layers, Award, HelpCircle, Target, Users,
  Calendar, Lightbulb, BarChart3, Crown, FileText, Zap,
  Heart, Baby, Activity
} from "lucide-react";

const COLOR_MAP: Record<string, {
  bg: string; iconColor: string; border: string;
  gradientFrom: string; gradientTo: string;
  badge: string; buttonBg: string; buttonHover: string;
  ctaFrom: string; ctaTo: string;
}> = {
  red: { bg: "bg-red-50", iconColor: "text-red-600", border: "border-red-100", gradientFrom: "from-red-50", gradientTo: "to-red-100/30", badge: "bg-red-100 text-red-700", buttonBg: "bg-red-600", buttonHover: "hover:bg-red-700", ctaFrom: "from-red-600", ctaTo: "to-rose-700" },
  blue: { bg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-100", gradientFrom: "from-blue-50", gradientTo: "to-blue-100/30", badge: "bg-blue-100 text-blue-700", buttonBg: "bg-blue-600", buttonHover: "hover:bg-blue-700", ctaFrom: "from-blue-600", ctaTo: "to-indigo-700" },
  sky: { bg: "bg-sky-50", iconColor: "text-sky-600", border: "border-sky-100", gradientFrom: "from-sky-50", gradientTo: "to-sky-100/30", badge: "bg-sky-100 text-sky-700", buttonBg: "bg-sky-600", buttonHover: "hover:bg-sky-700", ctaFrom: "from-sky-600", ctaTo: "to-cyan-700" },
};

const RESOURCE_ICONS = {
  lesson: BookOpen,
  flashcard: Layers,
  practice: ClipboardList,
  "mock-exam": FileText,
};

function FAQItem({ question, answer, index, accentColor }: { question: string; answer: string; index: number; accentColor: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${open ? accentColor : 'text-gray-400'}`} />
      </button>
      {open && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${index}`}>{answer}</div>}
    </div>
  );
}

export default function CertificationPrepPage({ cert }: { cert: CertPrepContent }) {
  const colors = COLOR_MAP[cert.color] || COLOR_MAP.blue;
  const Icon = cert.icon;
  const faqStructuredData = buildFaqStructuredData(cert.faq);

  const educationCourseData = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    "name": `${cert.name} - ${cert.fullName}`,
    "description": cert.heroDescription,
    "credentialCategory": "Hospital Certification",
    "recognizedBy": { "@type": "Organization", "name": cert.org },
    "url": `https://www.nursenest.ca/newgrad/certifications/${cert.slug}`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
  };

  const courseData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${cert.name} Certification Prep`,
    "description": cert.seo.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `${cert.studyRoadmap.length} weeks`,
    },
  };

  return (
    <div data-testid={`page-newgrad-cert-${cert.slug}`}>
      <Navigation />
      <SEO
        title={cert.seo.title}
        description={cert.seo.description}
        keywords={cert.seo.keywords}
        canonicalPath={`/newgrad/certifications/${cert.slug}`}
        structuredData={educationCourseData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "New Grad Hub", url: "https://www.nursenest.ca/new-grad" },
          { name: "Certifications", url: "https://www.nursenest.ca/newgrad/certifications" },
          { name: `${cert.name} Certification Prep`, url: `https://www.nursenest.ca/newgrad/certifications/${cert.slug}` },
        ]}
        additionalStructuredData={[faqStructuredData, courseData]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} via-white/50 ${colors.gradientTo}`} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-blue-600">{t("pages.newgrad.certificationPrepPage.home")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad" className="hover:text-blue-600">{t("pages.newgrad.certificationPrepPage.newGradHub")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/newgrad/certifications" className="hover:text-blue-600">{t("pages.newgrad.certificationPrepPage.certifications")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className={`${colors.iconColor} font-medium`}>{cert.name}</span>
          </div>
          <div className="max-w-3xl">
            <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
              <Icon className={`w-7 h-7 ${colors.iconColor}`} />
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colors.badge} mb-4`} data-testid="badge-cert-type">
              <GraduationCap className="w-4 h-4" />
              {cert.name} Certification Prep
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
              {cert.name}: {cert.fullName}
            </h1>
            <p className="text-lg text-gray-600 mb-4" data-testid="text-page-subtitle">
              {cert.tagline}
            </p>
            <div className="flex items-center gap-3 mb-8 text-sm text-gray-500">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.iconColor}`}>
                <Award className="w-3 h-3 mr-1" /> {cert.org}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-practice" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.buttonBg} text-white rounded-xl font-semibold ${colors.buttonHover} transition-colors shadow-lg`} data-testid="button-practice-questions">
                Practice {cert.name} Questions <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#study-roadmap" onClick={(e) => { e.preventDefault(); document.getElementById('study-roadmap')?.scrollIntoView({ behavior: 'smooth' }); }} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200" data-testid="button-study-plan">
                View Study Plan
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-what-is">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                <Target className={`w-5 h-5 ${colors.iconColor}`} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-what-heading">What is {cert.name}?</h2>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed" data-testid="text-what-content">{cert.whatItIs}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-who-its-for">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-who-heading">Who Needs {cert.name}?</h2>
            <p className="text-gray-600">Healthcare professionals and settings that require {cert.name} certification.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cert.whoItsFor.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4" data-testid={`card-who-${i}`}>
                <Users className={`w-5 h-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                <span className="text-sm text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-topics">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-topics-heading">Key Topics Covered on the {cert.name} Exam</h2>
            <p className="text-gray-600">Core domains and content areas you need to master for {cert.name} certification.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {cert.keyTopics.map((topic, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-sm transition-shadow`} data-testid={`card-topic-${i}`}>
                <div className="flex items-start gap-3">
                  <Check className={`w-5 h-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-exam-format">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-exam-heading">{cert.name} Exam Format</h2>
            <p className="text-gray-600">What to expect when you take the {cert.name} certification course.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cert.examFormat.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5" data-testid={`card-exam-format-${i}`}>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="study-roadmap" data-testid="section-study-roadmap">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className={`w-6 h-6 ${colors.iconColor}`} />
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-roadmap-heading">{cert.name} Study Roadmap</h2>
            </div>
            <p className="text-gray-600">A structured week-by-week plan to prepare for your {cert.name} certification.</p>
          </div>
          <div className="space-y-6">
            {cert.studyRoadmap.map((week, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-6`} data-testid={`card-roadmap-week-${i}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-sm font-bold ${colors.iconColor}`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${colors.iconColor} uppercase tracking-wide`}>{week.week}</p>
                    <h3 className="font-semibold text-gray-900">{week.title}</h3>
                  </div>
                </div>
                <ul className="space-y-2 ml-13">
                  {week.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className={`w-4 h-4 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-recommended-lessons">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-lessons-heading">Recommended {cert.name} Lessons</h2>
            <p className="text-gray-600">In-depth clinical lessons aligned to {cert.name} exam content.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cert.recommendedLessons.map((res, i) => (
              <Link key={i} href={res.link} className="group" data-testid={`card-lesson-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                    <BookOpen className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{res.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{res.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    View Lesson <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-recommended-flashcards">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-flashcards-heading">{cert.name} Flashcard Decks</h2>
            <p className="text-gray-600">Spaced-repetition flashcards for {cert.name} algorithms and key concepts.</p>
          </div>
          <ContentGate visibility="preview" requiredTier="newgrad" featureName="certification flashcard decks">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cert.recommendedFlashcards.map((res, i) => (
                <Link key={i} href={res.link} className="group" data-testid={`card-flashcard-${i}`}>
                  <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                      <Layers className={`w-5 h-5 ${colors.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{res.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{res.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                      Study Flashcards <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ContentGate>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-recommended-practice">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-practice-heading">{cert.name} Practice Questions</h2>
            <p className="text-gray-600">Practice with questions aligned to {cert.name} exam domains and difficulty levels.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cert.recommendedPractice.map((res, i) => (
              <Link key={i} href={res.link} className="group" data-testid={`card-practice-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                    <ClipboardList className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{res.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{res.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    Practice Now <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-recommended-mock-exams">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-mock-heading">{cert.name} Mock Exams</h2>
            <p className="text-gray-600">Timed practice exams to simulate the {cert.name} testing experience.</p>
          </div>
          <ContentGate visibility="preview" requiredTier="newgrad" featureName="certification mock exams">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cert.recommendedMockExams.map((res, i) => (
              <Link key={i} href={res.link} className="group" data-testid={`card-mock-exam-${i}`}>
                <div className={`bg-white rounded-xl border ${colors.border} p-5 hover:shadow-md transition-all h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center mb-3`}>
                    <FileText className={`w-5 h-5 ${colors.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">{res.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{res.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                    Start Exam <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          </ContentGate>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-clinical-pearls">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lightbulb className={`w-6 h-6 ${colors.iconColor}`} />
              <h2 className="text-2xl font-bold text-gray-900" data-testid="text-pearls-heading">{cert.name} Clinical Pearls</h2>
            </div>
            <p className="text-gray-600">High-yield tips and clinical insights for {cert.name} exam success.</p>
          </div>
          <div className="space-y-3">
            {cert.clinicalPearls.map((pearl, i) => (
              <div key={i} className={`bg-white rounded-xl border ${colors.border} p-5 flex items-start gap-3`} data-testid={`card-pearl-${i}`}>
                <Zap className={`w-5 h-5 ${colors.iconColor} mt-0.5 flex-shrink-0`} />
                <p className="text-sm text-gray-700 leading-relaxed">{pearl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-16 bg-gradient-to-br ${colors.ctaFrom} ${colors.ctaTo}`} data-testid="section-subscription-cta">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-subscription-heading">
            Unlock Full {cert.name} Prep Access
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Get unlimited access to {cert.name} practice questions, flashcards, mock exams, and study tools with a NurseNest subscription.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/subscribe/newgrad" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg" data-testid="button-cta-pricing">
              View Plans & Pricing <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/free-practice" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30" data-testid="button-cta-free-practice">
              Try Free Questions
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-analytics-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br ${colors.gradientFrom} to-white rounded-2xl border ${colors.border} p-8`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <BarChart3 className={`w-8 h-8 ${colors.iconColor}`} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-analytics-heading">Track Your {cert.name} Readiness</h2>
                <p className="text-gray-600 text-sm">Monitor your performance across {cert.name} domains, identify weak areas, and see your exam readiness score update in real-time as you practice.</p>
              </div>
              <Link href="/dashboard" className={`inline-flex items-center gap-2 px-6 py-3 ${colors.buttonBg} text-white rounded-xl font-semibold ${colors.buttonHover} transition-colors whitespace-nowrap`} data-testid="button-analytics">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" data-testid="section-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-faq-heading">{cert.name} Certification FAQs</h2>
            <p className="text-gray-600">Common questions about {cert.name} certification for nurses.</p>
          </div>
          <div className="space-y-3">
            {cert.faq.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} accentColor={colors.iconColor} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" data-testid="section-related-certs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3" data-testid="text-related-heading">{t("pages.newgrad.certificationPrepPage.relatedCertifications")}</h2>
            <p className="text-gray-600 mb-2">Other life support certifications that complement {cert.name}.</p>
            <Link href="/nursing-certifications" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors" data-testid="link-back-to-hub">
              ← Back to Certification Hub
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cert.slug !== "bls" && (
              <div className="bg-white rounded-xl border border-blue-100 p-5 hover:shadow-md transition-all h-full" data-testid="card-related-bls">
                <Link href="/newgrad/certifications/bls" className="group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">BLS</h3>
                  <p className="text-xs text-gray-500">{t("pages.newgrad.certificationPrepPage.basicLifeSupportThePrerequisite")}</p>
                </Link>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link href="/certifications/bls-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" data-testid="link-related-prep-bls">{t("pages.newgrad.certificationPrepPage.prep")}</Link>
                  <Link href="/certifications/bls-renewal-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors" data-testid="link-related-renewal-bls">{t("pages.newgrad.certificationPrepPage.renewal")}</Link>
                </div>
              </div>
            )}
            {cert.slug !== "acls" && (
              <div className="bg-white rounded-xl border border-red-100 p-5 hover:shadow-md transition-all h-full" data-testid="card-related-acls">
                <Link href="/newgrad/certifications/acls" className="group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">ACLS</h3>
                  <p className="text-xs text-gray-500">{t("pages.newgrad.certificationPrepPage.advancedCardiovascularLifeSupportFor")}</p>
                </Link>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link href="/certifications/acls-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" data-testid="link-related-prep-acls">{t("pages.newgrad.certificationPrepPage.prep2")}</Link>
                  <Link href="/certifications/acls-renewal-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors" data-testid="link-related-renewal-acls">{t("pages.newgrad.certificationPrepPage.renewal2")}</Link>
                </div>
              </div>
            )}
            {cert.slug !== "pals" && (
              <div className="bg-white rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all h-full" data-testid="card-related-pals">
                <Link href="/newgrad/certifications/pals" className="group">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center mb-3">
                    <Baby className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors text-sm">PALS</h3>
                  <p className="text-xs text-gray-500">{t("pages.newgrad.certificationPrepPage.pediatricAdvancedLifeSupportFor")}</p>
                </Link>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link href="/certifications/pals-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" data-testid="link-related-prep-pals">{t("pages.newgrad.certificationPrepPage.prep3")}</Link>
                  <Link href="/certifications/pals-renewal-prep" className="flex-1 text-center text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors" data-testid="link-related-renewal-pals">{t("pages.newgrad.certificationPrepPage.renewal3")}</Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/nursing-certifications" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors" data-testid="link-certification-hub">
              Certification Hub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link href="/newgrad/certifications" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors" data-testid="link-all-certs">
              New Grad Certifications <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { LICENSING_EXAMS, getExamBySlug } from "@/data/licensing-exams-data";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  ChevronRight, ArrowRight, Globe, FileText, Clock,
  MapPin, BookOpen, HelpCircle, ChevronDown, CheckCircle,
  Users, DollarSign, Award, Target,
} from "lucide-react";
import { useState } from "react";

function ExamNotFound() {
  return (
    <div data-testid="exam-not-found">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-[#2E3A59] mb-4" data-testid="text-not-found">{t("pages.licensingExamDetail.examNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.licensingExamDetail.theLicensingExamPageYou")}</p>
          <LocaleLink href="/nursing-licensing-exams" className="text-[#BFA6F6] hover:underline font-medium" data-testid="link-back-hub">
            Browse All Licensing Exams
          </LocaleLink>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function LicensingExamDetail() {
  const params = useParams<{ slug: string }>();
  const { t } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const exam = getExamBySlug(params.slug || "");
  if (!exam) return <ExamNotFound />;

  const faqStructuredData = buildFaqStructuredData(exam.faqs);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${exam.name} — ${exam.fullName}`,
    description: exam.description,
    author: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    publisher: { "@type": "Organization", name: "NurseNest", url: "https://www.nursenest.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.nursenest.ca/nursing-licensing-exams/${exam.slug}` },
  };

  const relatedExams = exam.relatedExamSlugs
    .map(slug => LICENSING_EXAMS.find(e => e.slug === slug))
    .filter(Boolean);

  return (
    <div data-testid={`licensing-exam-${exam.slug}`}>
      <Navigation />
      <SEO
        title={`${exam.name} Exam Guide: Format, Requirements & Preparation | NurseNest`}
        description={exam.description.slice(0, 160)}
        keywords={`${exam.name}, ${exam.fullName}, nursing exam, nursing license, ${exam.countries.join(", ")}`}
        canonicalPath={`/nursing-licensing-exams/${exam.slug}`}
        ogType="article"
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Nursing Licensing Exams", url: "https://www.nursenest.ca/nursing-licensing-exams" },
          { name: exam.name, url: `https://www.nursenest.ca/nursing-licensing-exams/${exam.slug}` },
        ]}
      />

      <section className="relative py-16 sm:py-20 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E3A59] to-[#3d4d73]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-nav">
            <LocaleLink href="/" className="hover:text-white/80">{t("pages.licensingExamDetail.home")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <LocaleLink href="/nursing-licensing-exams" className="hover:text-white/80">{t("pages.licensingExamDetail.licensingExams")}</LocaleLink>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{exam.name}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#BFA6F6]/20 text-[#BFA6F6] rounded-full text-xs font-semibold uppercase tracking-wider" data-testid="text-exam-region">
              {exam.region}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-exam-title">
            {exam.name} — {exam.fullName}
          </h1>
          <p className="text-lg text-white/80 max-w-3xl leading-relaxed" data-testid="text-exam-description">
            {exam.description}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <section data-testid="section-key-facts">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#BFA6F6]" /> Key Facts
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div data-testid="text-exam-body">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.examBody")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.examBody}</p>
              </div>
              <div data-testid="text-countries">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.countries")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.countries.join(", ")}</p>
              </div>
              <div data-testid="text-question-count">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.questions")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.questionCount}</p>
              </div>
              <div data-testid="text-time-limit">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.timeLimit")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.timeLimit}</p>
              </div>
              <div data-testid="text-pass-rate">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.passRate")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.passRate}</p>
              </div>
              <div data-testid="text-cost">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.licensingExamDetail.cost")}</p>
                <p className="text-sm font-medium text-[#2E3A59]">{exam.cost}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t("pages.licensingExamDetail.availableLanguages")}</p>
              <div className="flex flex-wrap gap-2">
                {exam.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm" data-testid={`badge-language-${i}`}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-testid="section-who-is-it-for">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-[#BFA6F6]" /> Who Is This Exam For?
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed">{exam.whoIsItFor}</p>
          </div>
        </section>

        {exam.sections.map((section, i) => (
          <section key={i} data-testid={`section-content-${i}`}>
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-4">{section.heading}</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          </section>
        ))}

        <section data-testid="section-preparation">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#BFA6F6]" /> Preparation Strategies
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <ul className="space-y-3">
              {exam.preparationStrategies.map((strategy, i) => (
                <li key={i} className="flex items-start gap-3" data-testid={`strategy-${i}`}>
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {exam.nurseNestLinks.length > 0 && (
          <section className="bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-8" data-testid="section-nursenest-links">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">{t("pages.licensingExamDetail.nursenestExamPrepResources")}</h2>
            <p className="text-gray-600 mb-6">Prepare for the {exam.name} with NurseNest's comprehensive exam prep tools.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {exam.nurseNestLinks.map((link, i) => (
                <LocaleLink
                  key={i}
                  href={link.href}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group flex items-center justify-between"
                  data-testid={`link-resource-${i}`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#BFA6F6]" />
                    <span className="font-medium text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{link.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                </LocaleLink>
              ))}
            </div>
          </section>
        )}

        <section data-testid="section-faq">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.licensingExamDetail.frequentlyAskedQuestions")}</h2>
          </div>
          <div className="space-y-3">
            {exam.faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`faq-answer-${i}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {relatedExams.length > 0 && (
          <section data-testid="section-related-exams">
            <h2 className="text-2xl font-bold text-[#2E3A59] mb-4">{t("pages.licensingExamDetail.relatedLicensingExams")}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedExams.map((related) => (
                <LocaleLink
                  key={related!.slug}
                  href={`/nursing-licensing-exams/${related!.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                  data-testid={`link-related-${related!.slug}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{related!.name}</p>
                      <p className="text-xs text-gray-500">{related!.region}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                  </div>
                </LocaleLink>
              ))}
              <LocaleLink
                href="/nursing-licensing-exams"
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#BFA6F6]/40 hover:shadow-sm transition-all group"
                data-testid="link-all-exams"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">{t("pages.licensingExamDetail.allLicensingExams")}</p>
                    <p className="text-xs text-gray-500">{t("pages.licensingExamDetail.browseTheFullDatabase")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors" />
                </div>
              </LocaleLink>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}

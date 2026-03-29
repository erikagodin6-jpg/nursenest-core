import { useLocation, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, ChevronRight, ChevronDown, Target, Award, CheckCircle2,
  ArrowRight, HelpCircle, FileText, Brain, Lightbulb, ListChecks
} from "lucide-react";
import {
  AUTHORITY_CONTENT_PAGES,
  type AuthorityContentPage as AuthorityContentPageData,
  type AuthorityQuestion,
} from "@shared/authority-content-data";

function TableOfContents({ sections, color }: { sections: { id: string; title: string }[]; color: string }) {
  const { t } = useI18n();
  const allItems = [
    ...sections.map(s => ({ id: s.id, title: s.title })),
    { id: "practice-questions", title: "Practice Questions" },
    { id: "key-concepts", title: "Key Concepts Summary" },
    { id: "related-resources", title: "Related Resources" },
  ];

  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {allItems.map((item, i) => (
          <li key={i}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-current pl-3"
              style={{ ["--tw-border-opacity" as any]: 1 }}
              data-testid={`toc-link-${item.id}`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function QuestionCard({ question, index, color, showAnswer, onToggle }: {
  question: AuthorityQuestion;
  index: number;
  color: string;
  showAnswer: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`question-card-${index}`}>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: color }}
          >
            {question.id}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                question.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                question.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`} data-testid={`badge-difficulty-${index}`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-gray-400">{question.category}</span>
            </div>
            <p className="text-gray-800 font-medium leading-relaxed" data-testid={`text-question-${index}`}>
              {question.question}
            </p>
          </div>
        </div>

        <div className="space-y-2 ml-11 mb-4">
          {question.options.map((opt, j) => (
            <div
              key={j}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                showAnswer && opt.startsWith(question.correctAnswer + ".")
                  ? "border-green-300 bg-green-50 text-green-800 font-medium"
                  : "border-gray-100 text-gray-600"
              }`}
              data-testid={`option-${index}-${j}`}
            >
              {opt}
            </div>
          ))}
        </div>

        <button
          onClick={onToggle}
          className="ml-11 text-sm font-medium flex items-center gap-1 transition-colors"
          style={{ color }}
          data-testid={`button-show-answer-${index}`}
        >
          {showAnswer ? "Hide" : "Show"} Answer & Rationale
          <ChevronDown className={`w-4 h-4 transition-transform ${showAnswer ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showAnswer && (
        <div className="border-t border-gray-100 bg-gray-50 p-5 ml-11 mr-5 mb-5 rounded-lg" data-testid={`rationale-${index}`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Correct Answer: {question.correctAnswer}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

function KeyConceptCard({ concept, index, color }: { concept: { title: string; description: string }; index: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow" data-testid={`key-concept-${index}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
          <Lightbulb className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm mb-1">{concept.title}</h4>
          <p className="text-sm text-gray-500 leading-relaxed">{concept.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthorityContentPage() {
  const [location, navigate] = useLocation();
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  const cleanPath = location.split("?")[0].split("#")[0].replace(/\/+$/, "");
  const pathParts = cleanPath.split("/").filter(Boolean);
  const slug = pathParts[pathParts.length - 1] || "";
  const pageData = AUTHORITY_CONTENT_PAGES[slug];

  if (!pageData) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.authorityContentPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.authorityContentPage.thisAuthorityGuideCouldNot")}</p>
            <button onClick={() => navigate("/")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" data-testid="button-go-home">
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const toggleAnswer = (index: number) => {
    setShowAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const showAllAnswers = () => {
    const all: Record<number, boolean> = {};
    pageData.practiceQuestions.forEach((_, i) => { all[i] = true; });
    setShowAnswers(all);
  };

  const hideAllAnswers = () => {
    setShowAnswers({});
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": pageData.metaTitle,
    "description": pageData.metaDescription,
    "author": { "@type": "Organization", "name": "NurseNest" },
    "publisher": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca${pageData.canonicalPath}` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pageData.practiceQuestions.slice(0, 10).map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": { "@type": "Answer", "text": `${q.correctAnswer}. ${q.rationale}` },
    })),
  };

  return (
    <div data-testid={`authority-content-${slug}`}>
      <Navigation />
      <SEO
        title={pageData.metaTitle}
        description={pageData.metaDescription}
        keywords={pageData.keywords}
        canonicalPath={pageData.canonicalPath}
        structuredData={structuredData}
        additionalStructuredData={[faqSchema]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: pageData.professionSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()), url: `https://www.nursenest.ca/${pageData.professionSlug}` },
          { name: pageData.title, url: `https://www.nursenest.ca${pageData.canonicalPath}` },
        ]}
      />

      <section className={`relative py-16 sm:py-20 overflow-hidden`} data-testid="section-hero">
        <div className={`absolute inset-0 bg-gradient-to-br ${pageData.colorGradientFrom} ${pageData.colorGradientTo} to-white`} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="nav-breadcrumb">
            <Link href="/" className="hover:text-gray-700">{t("pages.authorityContentPage.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/${pageData.professionSlug}`} className="hover:text-gray-700">
              {pageData.professionSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-800 font-medium truncate">{pageData.pageType === "top-questions" ? "Top Questions" : "Study Guide"}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: pageData.colorAccent, color: pageData.color }}
              data-testid="badge-page-type"
            >
              {pageData.pageType === "top-questions" ? (
                <><ListChecks className="w-4 h-4" /> {t("pages.authorityContentPage.practiceQuestions")}</>
              ) : (
                <><BookOpen className="w-4 h-4" /> {t("pages.authorityContentPage.comprehensiveGuide")}</>
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-title">
            {pageData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl leading-relaxed" data-testid="text-subtitle">
            {pageData.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={pageData.ctaPrimary.href}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: pageData.color }}
              data-testid="button-cta-primary"
            >
              {pageData.ctaPrimary.label} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={pageData.ctaSecondary.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-all"
              data-testid="button-cta-secondary"
            >
              {pageData.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0 hidden lg:block">
            <TableOfContents sections={pageData.sections} color={pageData.color} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="prose prose-lg max-w-none mb-12" data-testid="content-introduction">
              <p className="text-gray-600 leading-relaxed text-lg">{pageData.introduction}</p>
            </div>

            {pageData.sections.map((section, i) => (
              <section key={i} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid={`heading-${section.id}`}>
                  <Brain className="w-6 h-6" style={{ color: pageData.color }} />
                  {section.title}
                </h2>
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-td:text-sm prose-th:text-sm prose-table:text-sm"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}

            <section id="practice-questions" className="mb-12 scroll-mt-24" data-testid="section-practice-questions">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2" data-testid="heading-practice-questions">
                  <Target className="w-6 h-6" style={{ color: pageData.color }} />
                  Practice Questions
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={showAllAnswers}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    data-testid="button-show-all-answers"
                  >
                    Show All
                  </button>
                  <button
                    onClick={hideAllAnswers}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    data-testid="button-hide-all-answers"
                  >
                    Hide All
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {pageData.practiceQuestions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q}
                    index={i}
                    color={pageData.color}
                    showAnswer={!!showAnswers[i]}
                    onToggle={() => toggleAnswer(i)}
                  />
                ))}
              </div>
            </section>

            <section id="key-concepts" className="mb-12 scroll-mt-24" data-testid="section-key-concepts">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2" data-testid="heading-key-concepts">
                <Award className="w-6 h-6" style={{ color: pageData.color }} />
                Key Concepts Summary
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pageData.keyConcepts.map((concept, i) => (
                  <KeyConceptCard key={i} concept={concept} index={i} color={pageData.color} />
                ))}
              </div>
            </section>

            <section id="related-resources" className="mb-12 scroll-mt-24" data-testid="section-related-resources">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-related-resources">
                <FileText className="w-5 h-5" style={{ color: pageData.color }} />
                Related Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {pageData.relatedLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                    data-testid={`link-related-${i}`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: pageData.colorAccent }}>
                      {link.type === "hub" ? <BookOpen className="w-5 h-5" style={{ color: pageData.color }} /> :
                       link.type === "practice" ? <Target className="w-5 h-5" style={{ color: pageData.color }} /> :
                       <FileText className="w-5 h-5" style={{ color: pageData.color }} />}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </section>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <MedicalReviewBadge />
              <MedicalReferences lessonId={slug} />
            </div>

            <MedicalReviewJsonLd
              title={pageData.metaTitle}
              slug={slug}
              description={pageData.metaDescription}
              pageUrl={`https://www.nursenest.ca${pageData.canonicalPath}`}
            />

            <div className="bg-gradient-to-r rounded-xl p-8 text-center" style={{ background: `linear-gradient(135deg, ${pageData.colorAccent}, ${pageData.color}15)` }} data-testid="section-cta-bottom">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pages.authorityContentPage.readyToTestYourKnowledge")}</h3>
              <p className="text-gray-600 mb-6">{t("pages.authorityContentPage.takeAFulllengthMockExam")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={pageData.ctaPrimary.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                  style={{ backgroundColor: pageData.color }}
                  data-testid="button-bottom-cta-primary"
                >
                  {pageData.ctaPrimary.label} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={pageData.ctaSecondary.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition-all"
                  data-testid="button-bottom-cta-secondary"
                >
                  {pageData.ctaSecondary.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

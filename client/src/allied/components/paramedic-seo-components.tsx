import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

import { useI18n } from "@/lib/i18n";
interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t("allied.paramedicSeoComponents.breadcrumb")} className="text-sm text-gray-500" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-teal-600 transition-colors" data-testid={`breadcrumb-${i}`}>{item.label}</Link>
            ) : (
              <span className="text-gray-700 font-medium" data-testid={`breadcrumb-${i}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SEOHero({ title, subtitle, difficulty, examRelevance }: {
  title: string;
  subtitle?: string;
  difficulty?: string;
  examRelevance?: string;
}) {
  const diffColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };
  return (
    <div className="bg-gradient-to-br from-lavender-50 via-white to-teal-50 border-b border-gray-100 py-10 px-4" data-testid="seo-hero">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">{title}</h1>
        {subtitle && <p className="text-lg text-gray-600 mb-4" data-testid="text-page-subtitle">{subtitle}</p>}
        <div className="flex flex-wrap gap-2">
          {difficulty && (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${diffColors[difficulty] || "bg-gray-100 text-gray-600"}`} data-testid="badge-difficulty">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          )}
          {examRelevance && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700" data-testid="badge-exam-relevance">
              Exam Relevance: {examRelevance}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClinicalPearlCard({ pearl }: { pearl: { title?: string; content: string } }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4" data-testid="clinical-pearl">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div>
          {pearl.title && <h4 className="font-semibold text-amber-800 mb-1">{pearl.title}</h4>}
          <p className="text-amber-900 text-sm leading-relaxed">{pearl.content}</p>
        </div>
      </div>
    </div>
  );
}

export function ExamTipCard({ tip }: { tip: { title?: string; content: string } }) {
  return (
    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 my-4" data-testid="exam-tip">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
        <div>
          {tip.title && <h4 className="font-semibold text-teal-800 mb-1">{tip.title}</h4>}
          <p className="text-teal-900 text-sm leading-relaxed">{tip.content}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2 my-6" data-testid="faq-accordion">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.paramedicSeoComponents.frequentlyAskedQuestions")}</h2>
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-900 text-sm">{item.question}</span>
            {openIndex === i ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {openIndex === i && (
            <div className="px-4 pb-3 text-sm text-gray-700 leading-relaxed border-t border-gray-100" data-testid={`faq-answer-${i}`}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function TopicSummaryCard({ topic }: { topic: { title: string; slug: string; metaDescription?: string; difficulty?: string } }) {
  return (
    <a
      href={`/allied-health/paramedic/topic/${topic.slug}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all"
      data-testid={`topic-card-${topic.slug}`}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{topic.title}</h3>
      {topic.metaDescription && <p className="text-sm text-gray-600 line-clamp-2">{topic.metaDescription}</p>}
      {topic.difficulty && (
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{topic.difficulty}</span>
      )}
    </a>
  );
}

export function StudyGuideChecklist({ items }: { items: { label: string; completed?: boolean }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 my-4" data-testid="study-checklist">
      <h3 className="font-semibold text-gray-900 mb-3">{t("allied.paramedicSeoComponents.studyChecklist")}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <CheckCircle className={`w-4 h-4 shrink-0 ${item.completed ? "text-green-500" : "text-gray-300"}`} />
            <span className={item.completed ? "text-gray-500 line-through" : "text-gray-700"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MiniQuizBlock({ questions }: { questions: { question: string; options: string[]; correctIndex: number; rationale: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!questions || questions.length === 0) return null;
  const q = questions[current];

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 my-6" data-testid="mini-quiz">
      <h3 className="font-semibold text-purple-900 mb-1">Quick Check ({current + 1}/{questions.length})</h3>
      <p className="text-sm text-purple-800 mb-3">{q.question}</p>
      <div className="space-y-2 mb-3">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { if (!showResult) { setSelected(i); setShowResult(true); } }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
              showResult
                ? i === q.correctIndex
                  ? "bg-green-100 border-green-300 text-green-800"
                  : i === selected
                    ? "bg-red-100 border-red-300 text-red-800"
                    : "bg-white border-gray-200 text-gray-600"
                : selected === i
                  ? "bg-purple-100 border-purple-300"
                  : "bg-white border-gray-200 hover:border-purple-300"
            }`}
            data-testid={`quiz-option-${i}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <div className="text-sm text-purple-800 bg-purple-100 rounded-lg p-3 mb-3" data-testid="quiz-rationale">
          {q.rationale}
        </div>
      )}
      {showResult && current < questions.length - 1 && (
        <button
          onClick={() => { setCurrent(current + 1); setSelected(null); setShowResult(false); }}
          className="text-sm text-purple-700 font-medium hover:text-purple-900"
          data-testid="quiz-next"
        >
          Next Question →
        </button>
      )}
    </div>
  );
}

export function ComparisonHighlights({ itemA, itemB, points }: {
  itemA: string;
  itemB: string;
  points: { aspect: string; valueA: string; valueB: string }[];
}) {
  if (!points || points.length === 0) return null;
  return (
    <div className="overflow-x-auto my-6" data-testid="comparison-table">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-gray-700 border-b">{t("allied.paramedicSeoComponents.aspect")}</th>
            <th className="text-left px-4 py-3 font-semibold text-teal-700 border-b">{itemA}</th>
            <th className="text-left px-4 py-3 font-semibold text-purple-700 border-b">{itemB}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-2.5 font-medium text-gray-900 border-b">{p.aspect}</td>
              <td className="px-4 py-2.5 text-gray-700 border-b">{p.valueA}</td>
              <td className="px-4 py-2.5 text-gray-700 border-b">{p.valueB}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GlossaryBadge({ term, slug }: { term: string; slug: string }) {
  return (
    <a
      href={`/allied-health/paramedic/glossary/${slug}`}
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors"
      data-testid={`glossary-badge-${slug}`}
    >
      {term}
    </a>
  );
}

export function ConversionCTA({ title, description, ctaText, ctaHref }: {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 my-8 text-center" data-testid="conversion-cta">
      <h3 className="text-xl font-bold text-white mb-2">{title || "Ready to ace your paramedic exam?"}</h3>
      <p className="text-teal-100 text-sm mb-4">{description || "Join thousands of paramedic students using NurseNest to prepare for their certification exams."}</p>
      <a
        href={ctaHref || "/allied-health/pricing"}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-700 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors"
        data-testid="button-cta"
      >
        {ctaText || "Start Free Trial"} <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

export function RelatedContentRail({ links }: { links: { type: string; title: string; url: string }[] }) {
  if (!links || links.length === 0) return null;
  const typeColors: Record<string, string> = {
    topic: "bg-teal-100 text-teal-700",
    category: "bg-purple-100 text-purple-700",
    glossary: "bg-blue-100 text-blue-700",
    comparison: "bg-amber-100 text-amber-700",
    "study-guide": "bg-green-100 text-green-700",
    cornerstone: "bg-red-100 text-red-700",
  };
  return (
    <div className="bg-gray-50 rounded-xl p-5 my-6" data-testid="related-content">
      <h3 className="font-semibold text-gray-900 mb-3">{t("allied.paramedicSeoComponents.relatedContent")}</h3>
      <div className="space-y-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-teal-600 transition-colors"
            data-testid={`related-link-${i}`}
          >
            <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[link.type] || "bg-gray-100 text-gray-600"}`}>{link.type}</span>
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export function CategoryFeatureGrid({ topics }: { topics: { title: string; slug: string; metaDescription?: string; difficulty?: string }[] }) {
  if (!topics || topics.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6" data-testid="category-grid">
      {topics.map((topic, i) => (
        <TopicSummaryCard key={i} topic={topic} />
      ))}
    </div>
  );
}

export function SchemaInjector({ schemas }: { schemas: Record<string, any>[] }) {
  return null;
}

export function PracticeQuestionsLink() {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-xl p-5 my-6" data-testid="practice-questions-link">
      <div className="flex items-start gap-3">
        <BookOpen className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{t("allied.paramedicSeoComponents.practiceQuestionsByTopic")}</h3>
          <p className="text-sm text-gray-600 mb-3">
            Test your knowledge with 500+ paramedic practice questions organized by clinical topic. Each question includes detailed rationales.
          </p>
          <a
            href="/allied-health/paramedic/questions"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            data-testid="link-practice-questions"
          >
            Browse all question topics <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

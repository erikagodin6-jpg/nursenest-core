import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { useI18n } from "@/lib/i18n";
import {
  PTA_SEO_CONTENT_PAGES,
  PTA_BLOG_PAGES,
  getClusterPages,
  CLUSTER_META,
  type PtaContentPage,
  type PtaContentCluster,
  type PtaEmbeddedQuestion,
} from "@/allied/data/pta-seo-content-data";
import {
  buildBreadcrumbStructuredData,
  buildFaqStructuredData,
  buildEducationalOrganizationStructuredData,
} from "@/lib/structured-data";
import {
  ChevronRight, CheckCircle2, XCircle, Lock, ArrowRight,
  HelpCircle, BookOpen, Activity, Heart, Zap, Crosshair,
  GraduationCap, FileText, Brain, Star
} from "lucide-react";

const CLUSTER_ICONS: Record<PtaContentCluster, typeof Heart> = {
  conditions: Heart,
  exercises: Activity,
  anatomy: Crosshair,
  modalities: Zap,
};

function QuestionCard({ question, index, total, isLocked, onNext }: {
  question: PtaEmbeddedQuestion;
  index: number;
  total: number;
  isLocked: boolean;
  onNext?: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);

  if (isLocked) {
    return (
      <div className="relative bg-white rounded-2xl border border-gray-100 p-6 overflow-hidden" data-testid={`card-locked-question-${index}`}>
        <div className="absolute inset-0 backdrop-blur-sm bg-white/70 z-10 flex flex-col items-center justify-center">
          <Lock className="w-8 h-8 text-teal-400 mb-2" />
          <p className="font-semibold text-gray-800 text-sm">{t("allied.ptaSeoContentPage.premiumQuestion")}</p>
          <p className="text-xs text-gray-500 mb-3">{t("allied.ptaSeoContentPage.unlockAllPtaQuestionsWith")}</p>
          <Link
            href="/allied-health/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700"
            data-testid={`button-unlock-question-${index}`}
          >
            Unlock Full Question Bank <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-gray-400 text-sm blur-sm select-none">{question.stem}</p>
        <div className="mt-3 space-y-2">
          {question.options.map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg blur-sm" />
          ))}
        </div>
      </div>
    );
  }

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowRationale(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6" data-testid={`card-question-${index}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Question {index + 1} of {total}
        </span>
      </div>
      <p className="text-gray-900 font-medium mb-4 leading-relaxed" data-testid={`text-question-stem-${index}`}>
        {question.stem}
      </p>
      <div className="space-y-2 mb-4">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.correctIndex;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                showRationale && isCorrect
                  ? "border-green-300 bg-green-50"
                  : showRationale && isSelected && !isCorrect
                  ? "border-red-300 bg-red-50"
                  : isSelected
                  ? "border-teal-300 bg-teal-50"
                  : "border-gray-100 hover:border-teal-200 hover:bg-teal-50/30"
              }`}
              data-testid={`button-option-${index}-${idx}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm text-gray-800">{opt}</span>
                {showRationale && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                {showRationale && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>
      {showRationale && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-3" data-testid={`text-rationale-${index}`}>
          <h4 className="text-sm font-semibold text-blue-900 mb-1">{t("allied.ptaSeoContentPage.rationale")}</h4>
          <p className="text-sm text-blue-800 leading-relaxed">{question.rationale}</p>
        </div>
      )}
      {showRationale && onNext && (
        <button onClick={onNext} className="flex items-center gap-2 text-teal-600 font-medium text-sm hover:text-teal-700" data-testid={`button-next-question-${index}`}>
          Next Question <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function ConversionCTA({ variant }: { variant: "mid" | "end" }) {
  const { t } = useI18n();
  if (variant === "mid") {
    return (
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-8 text-center my-10" data-testid="cta-mid-page">
        <GraduationCap className="w-10 h-10 text-teal-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("allied.ptaSeoContentPage.masterPtaExamsFaster")}</h3>
        <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
          Access 2,000+ NPTE-PTA practice questions with detailed clinical rationales, 5 mock exams, flashcards, and adaptive study tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/allied-health/physiotherapy-assistant/practice-questions"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-200"
            data-testid="button-cta-mid-practice"
          >
            Start Practicing Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/allied-health/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-xl text-sm font-semibold border border-teal-200 hover:bg-teal-50"
            data-testid="button-cta-mid-pricing"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-r from-teal-600 to-emerald-600 py-16 mt-12" data-testid="cta-end-page">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("allied.ptaSeoContentPage.unlockTheFullPtaQuestion")}</h2>
        <p className="text-teal-100 mb-6 max-w-xl mx-auto">
          Join thousands of PTA students mastering the NPTE-PTA with 2,000+ practice questions, detailed rationales, and comprehensive study tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/allied-health/physiotherapy-assistant/practice-questions"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-teal-700 rounded-xl font-semibold hover:bg-teal-50"
            data-testid="button-cta-end-start"
          >
            <GraduationCap className="w-5 h-5" /> Start Practicing Free
          </Link>
          <Link
            href="/allied-health/pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent border border-white/40 text-white rounded-xl font-semibold hover:bg-white/10"
            data-testid="button-cta-end-pricing"
          >
            See Pricing Plans
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-accordion">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full text-left px-6 py-4 flex items-center justify-between"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
            <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openIdx === i ? "text-teal-600 rotate-180" : "text-gray-400"}`} />
          </button>
          {openIdx === i && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RelatedTopicsBlock({ page }: { page: PtaContentPage }) {
  const directLinks = page.relatedLinks;
  const clusterPages = getClusterPages(page.cluster).filter((p) => p.slug !== page.slug).slice(0, 3);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-related-topics">{t("allied.ptaSeoContentPage.relatedPtaTopics")}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {directLinks.map((link) => {
          const Icon = CLUSTER_ICONS[link.cluster];
          return (
            <Link
              key={link.slug}
              href={`/allied-health/physiotherapy-assistant/guide/${link.slug}`}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
              data-testid={`link-related-${link.slug}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">{link.label}</span>
              </div>
              <span className="text-xs text-teal-600 capitalize">{CLUSTER_META[link.cluster].label}</span>
            </Link>
          );
        })}
        {clusterPages.map((cp) => {
          const Icon = CLUSTER_ICONS[cp.cluster];
          return (
            <Link
              key={cp.slug}
              href={`/allied-health/physiotherapy-assistant/guide/${cp.slug}`}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-teal-200 transition-all group"
              data-testid={`link-cluster-${cp.slug}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-semibold text-gray-900 group-hover:text-teal-700">{cp.title.split(" — ")[0]}</span>
              </div>
              <span className="text-xs text-teal-600 capitalize">{CLUSTER_META[cp.cluster].label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ClusterNavigation({ currentCluster }: { currentCluster: PtaContentCluster }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" data-testid="cluster-navigation">
      {(Object.entries(CLUSTER_META) as [PtaContentCluster, typeof CLUSTER_META.conditions][]).map(([key, meta]) => {
        const isActive = key === currentCluster;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              isActive ? "bg-teal-100 text-teal-800 border border-teal-200" : "bg-gray-100 text-gray-600 border border-gray-200"
            }`}
            data-testid={`cluster-badge-${key}`}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

export default function PtaSeoContentPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const page = PTA_SEO_CONTENT_PAGES.find((p) => p.slug === slug);

  const [currentQIdx, setCurrentQIdx] = useState(0);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.ptaSeoContentPage.pageNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("allied.ptaSeoContentPage.theRequestedPtaContentPage")}</p>
          <Link href="/allied-health/physiotherapy-assistant" className="text-teal-600 hover:text-teal-700 font-medium" data-testid="link-back-hub">
            Back to PTA Hub
          </Link>
        </div>
      </div>
    );
  }

  const ClusterIcon = CLUSTER_ICONS[page.cluster];
  const freeQuestionCount = Math.min(3, page.embeddedQuestions.length);
  const lockedQuestions = page.embeddedQuestions.slice(freeQuestionCount);

  const breadcrumbData = buildBreadcrumbStructuredData([
    { name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    { name: "PTA", url: "https://www.nursenest.ca/allied-health/physiotherapy-assistant" },
    { name: CLUSTER_META[page.cluster].label, url: `https://www.nursenest.ca/allied-health/physiotherapy-assistant/guide/${page.slug}` },
  ]);

  const faqData = buildFaqStructuredData(
    page.faqs.map((f) => ({ question: f.q, answer: f.a }))
  );

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    author: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    mainEntityOfPage: `https://www.nursenest.ca/allied-health/physiotherapy-assistant/guide/${page.slug}`,
  };

  const orgData = buildEducationalOrganizationStructuredData();

  return (
    <>
      <AlliedSEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.targetKeyword}
        canonicalPath={`/allied-health/physiotherapy-assistant/guide/${page.slug}`}
        structuredData={articleData}
        additionalStructuredData={[breadcrumbData, faqData, orgData]}
      />

      <div data-testid={`pta-content-page-${page.slug}`}>
        <section className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
              <Link href="/allied-health" className="hover:text-teal-600">{t("allied.ptaSeoContentPage.alliedHealth")}</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/allied-health/physiotherapy-assistant" className="hover:text-teal-600">PTA</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{page.title.split(" — ")[0]}</span>
            </nav>

            <ClusterNavigation currentCluster={page.cluster} />

            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <ClusterIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="heading-h1">
                  {page.h1}
                </h1>
                <p className="text-gray-600 text-lg max-w-3xl leading-relaxed" data-testid="text-hero-subtitle">{page.heroSubtitle}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {page.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid={`heading-section-${i}`}>{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed" data-testid={`text-section-${i}`}>{section.content}</p>
              {i === Math.floor(page.sections.length / 2) - 1 && <ConversionCTA variant="mid" />}
            </section>
          ))}

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="heading-practice-questions">
              Practice PTA Questions: {page.title.split(" — ")[0]}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Try {freeQuestionCount} free questions below. Unlock all with Allied Pro.
            </p>
            <div className="space-y-4">
              {page.embeddedQuestions.slice(0, freeQuestionCount).map((q, i) => (
                <QuestionCard
                  key={i}
                  question={q}
                  index={i}
                  total={freeQuestionCount}
                  isLocked={false}
                  onNext={i < freeQuestionCount - 1 ? () => setCurrentQIdx(i + 1) : undefined}
                />
              ))}
            </div>
            {lockedQuestions.length > 0 && (
              <div className="mt-6 space-y-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t("allied.ptaSeoContentPage.premiumQuestions")}</p>
                {lockedQuestions.map((q, i) => (
                  <QuestionCard
                    key={freeQuestionCount + i}
                    question={q}
                    index={freeQuestionCount + i}
                    total={page.embeddedQuestions.length}
                    isLocked={true}
                  />
                ))}
              </div>
            )}
          </section>

          <RelatedTopicsBlock page={page} />

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-faq">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={page.faqs} />
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-explore-clusters">
              Explore PTA Content Clusters
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(CLUSTER_META) as [PtaContentCluster, typeof CLUSTER_META.conditions][]).map(([key, meta]) => {
                const Icon = CLUSTER_ICONS[key as PtaContentCluster];
                const count = getClusterPages(key as PtaContentCluster).length;
                return (
                  <div key={key} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <Icon className="w-6 h-6 text-teal-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{meta.label}</h3>
                    <p className="text-xs text-gray-500 mb-2">{meta.description}</p>
                    <span className="text-xs font-medium text-teal-600">{count} guides</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-pta-resources">{t("allied.ptaSeoContentPage.ptaStudyResources")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "PTA Practice Questions", href: "/allied-health/physiotherapy-assistant/practice-questions", desc: "2,000+ NPTE-PTA questions" },
                { label: "PTA Mock Exams", href: "/allied-health/physiotherapy-assistant/mock-exam", desc: "5 full-length simulations" },
                { label: "PTA Flashcards", href: "/allied-health/physiotherapy-assistant/flashcards", desc: "10 spaced-repetition decks" },
                { label: "PTA Study Guide", href: "/allied-health/physiotherapy-assistant/study-guide", desc: "Domain-organized content" },
                { label: "PTA Hub", href: "/allied-health/physiotherapy-assistant", desc: "All PTA resources" },
                { label: "How to Pass the PTA Exam", href: "/allied-health/physiotherapy-assistant/guide/how-to-pass-the-pta-exam", desc: "Study strategies & tips" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors border border-gray-100"
                  data-testid={`link-resource-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <ArrowRight className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{link.label}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <ConversionCTA variant="end" />
      </div>
    </>
  );
}

export function PtaBlogPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const page = PTA_BLOG_PAGES.find((p) => p.slug === slug);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.ptaSeoContentPage.pageNotFound2")}</h1>
          <p className="text-gray-600 mb-4">{t("allied.ptaSeoContentPage.theRequestedArticleCouldNot")}</p>
          <Link href="/allied-health/physiotherapy-assistant" className="text-teal-600 hover:text-teal-700 font-medium">
            Back to PTA Hub
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbData = buildBreadcrumbStructuredData([
    { name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    { name: "PTA", url: "https://www.nursenest.ca/allied-health/physiotherapy-assistant" },
    { name: page.title, url: `https://www.nursenest.ca/allied-health/physiotherapy-assistant/guide/${page.slug}` },
  ]);

  const faqData = buildFaqStructuredData(
    page.faqs.map((f) => ({ question: f.q, answer: f.a }))
  );

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.metaDescription,
    author: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    publisher: { "@type": "Organization", name: "NurseNest Allied", url: "https://www.nursenest.ca/allied-health" },
    mainEntityOfPage: `https://www.nursenest.ca/allied-health/physiotherapy-assistant/guide/${page.slug}`,
  };

  return (
    <>
      <AlliedSEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.targetKeyword}
        canonicalPath={`/allied-health/physiotherapy-assistant/guide/${page.slug}`}
        structuredData={articleData}
        additionalStructuredData={[breadcrumbData, faqData]}
      />

      <div data-testid={`pta-blog-page-${page.slug}`}>
        <section className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumb-nav">
              <Link href="/allied-health" className="hover:text-teal-600">{t("allied.ptaSeoContentPage.alliedHealth2")}</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/allied-health/physiotherapy-assistant" className="hover:text-teal-600">PTA</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{page.title.split(":")[0]}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="heading-blog-h1">
              {page.h1}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl" data-testid="text-blog-subtitle">
              {page.heroSubtitle}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {page.sections.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3" data-testid={`heading-blog-section-${i}`}>{section.heading}</h2>
              <p className="text-gray-700 leading-relaxed" data-testid={`text-blog-section-${i}`}>{section.content}</p>
              {i === Math.floor(page.sections.length / 2) - 1 && <ConversionCTA variant="mid" />}
            </section>
          ))}

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-blog-faq">{t("allied.ptaSeoContentPage.frequentlyAskedQuestions")}</h2>
            <div className="space-y-3">
              {page.faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between"
                    data-testid={`blog-faq-toggle-${i}`}
                  >
                    <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                    <HelpCircle className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "text-teal-600 rotate-180" : "text-gray-400"}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-blog-content-clusters">
              Explore PTA Content Clusters
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.entries(CLUSTER_META) as [PtaContentCluster, typeof CLUSTER_META.conditions][]).map(([key, meta]) => {
                const Icon = CLUSTER_ICONS[key as PtaContentCluster];
                const pages = getClusterPages(key as PtaContentCluster);
                return (
                  <div key={key} className="bg-white rounded-xl border border-gray-100 p-5">
                    <Icon className="w-6 h-6 text-teal-500 mb-2" />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{meta.label}</h3>
                    <p className="text-xs text-gray-500 mb-3">{meta.description}</p>
                    <ul className="space-y-1">
                      {pages.slice(0, 3).map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/allied-health/physiotherapy-assistant/guide/${p.slug}`}
                            className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                            data-testid={`link-blog-cluster-${p.slug}`}
                          >
                            <ArrowRight className="w-3 h-3" /> {p.title.split(" — ")[0]}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.ptaSeoContentPage.morePtaArticles")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PTA_BLOG_PAGES.filter((p) => p.slug !== slug).map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/allied-health/physiotherapy-assistant/guide/${blog.slug}`}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all"
                  data-testid={`link-blog-${blog.slug}`}
                >
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{blog.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{blog.heroSubtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <ConversionCTA variant="end" />
      </div>
    </>
  );
}

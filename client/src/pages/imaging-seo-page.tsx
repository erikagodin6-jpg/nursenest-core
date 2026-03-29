import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import {
  BookOpen, ArrowRight, FileText, Brain, Radio, CheckCircle2,
  ChevronDown, ChevronUp, HelpCircle, Target, Zap, ExternalLink
} from "lucide-react";
import { useState } from "react";

import { useI18n } from "@/lib/i18n";
interface SeoPageData {
  id: string;
  slug: string;
  country: string;
  pageType: string;
  topic: string | null;
  subtopic: string | null;
  examType: string | null;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  introHtml: string | null;
  contentHtml: string | null;
  faqJson: { question: string; answer: string }[];
  internalLinksJson: { title: string; href: string; type: string }[];
  ctaJson: { heading?: string; description?: string; buttonText?: string; buttonHref?: string };
  sampleQuestionsJson: { question: string; options: string[]; correctIndex: number; rationale: string }[];
  tags: string[];
  primaryKeyword: string | null;
  secondaryKeywords: string[];
  schemaMarkupJson: Record<string, any> | null;
  status: string;
}

interface InternalLinks {
  seoPages: { slug: string; title: string; pageType: string; topic: string; country: string; tags: string[] }[];
  blogArticles: { slug: string; title: string; articleType: string; category: string; country: string; tags: string[] }[];
  positioningEntries: { slug: string; projectionName: string; bodyPart: string; bodyRegion: string; country: string }[];
  physicsTopics: { id: string; title: string; category: string; modality: string }[];
}

const PAGE_TYPE_ICONS: Record<string, typeof BookOpen> = {
  "practice-questions": FileText,
  "positioning-guide": Radio,
  "artifact-recognition": Target,
  "physics-study": Brain,
  "exam-prep": Zap,
  "study-guide": BookOpen,
  "topic-overview": BookOpen,
};

const COUNTRY_META: Record<string, { flag: string; exam: string; name: string; color: string }> = {
  canada: { flag: "\u{1F1E8}\u{1F1E6}", exam: "CAMRT", name: "Canada", color: "red" },
  usa: { flag: "\u{1F1FA}\u{1F1F8}", exam: "ARRT", name: "USA", color: "blue" },
};

function FAQSection({ items }: { items: { question: string; answer: string }[] }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12" data-testid="section-faq">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.imagingSeoPage.frequentlyAskedQuestions")}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              data-testid={`button-faq-toggle-${i}`}
            >
              <span className="font-medium text-gray-900 pr-4">{item.question}</span>
              {openIndex === i ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SampleQuestionPreview({ questions }: { questions: SeoPageData["sampleQuestionsJson"] }) {
  const [showAnswer, setShowAnswer] = useState<number | null>(null);
  if (!questions || questions.length === 0) return null;

  return (
    <section className="mt-12" data-testid="section-sample-questions">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("pages.imagingSeoPage.samplePracticeQuestions")}</h2>
      <div className="space-y-6">
        {questions.slice(0, 3).map((q, qi) => (
          <div key={qi} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm" data-testid={`card-sample-question-${qi}`}>
            <p className="font-medium text-gray-900 mb-4">{q.question}</p>
            <div className="space-y-2 mb-4">
              {q.options.map((opt, oi) => (
                <div key={oi} className={`px-4 py-2.5 rounded-lg text-sm border ${showAnswer === qi && oi === q.correctIndex ? "border-green-300 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-700"}`} data-testid={`text-option-${qi}-${oi}`}>
                  <span className="font-medium mr-2">{String.fromCharCode(65 + oi)}.</span> {opt}
                </div>
              ))}
            </div>
            {showAnswer === qi ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800" data-testid={`text-rationale-${qi}`}>
                <strong>{t("pages.imagingSeoPage.rationale")}</strong> {q.rationale}
              </div>
            ) : (
              <button onClick={() => setShowAnswer(qi)} className="text-sm text-indigo-600 font-medium hover:text-indigo-700" data-testid={`button-show-answer-${qi}`}>
                Show Answer & Rationale
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function InternalLinksSection({ links, country }: { links: InternalLinks; country: string }) {
  const countryMeta = COUNTRY_META[country];
  const hasContent = links.seoPages.length > 0 || links.blogArticles.length > 0 || links.positioningEntries.length > 0 || links.physicsTopics.length > 0;
  if (!hasContent) return null;

  return (
    <section className="mt-12" data-testid="section-internal-links">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Resources {countryMeta?.flag}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {links.seoPages.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {t("pages.imagingSeoPage.studyPages")}</h3>
            <ul className="space-y-2">
              {links.seoPages.map((p, i) => (
                <li key={i}><Link href={`/medical-imaging/${p.country}/seo/${p.slug}`} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5" data-testid={`link-related-seo-${i}`}><ArrowRight className="w-3 h-3" />{p.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {links.blogArticles.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><FileText className="w-4 h-4" /> {t("pages.imagingSeoPage.articlesGuides")}</h3>
            <ul className="space-y-2">
              {links.blogArticles.map((a, i) => (
                <li key={i}><Link href={`/medical-imaging/blog/${a.slug}`} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5" data-testid={`link-related-article-${i}`}><ArrowRight className="w-3 h-3" />{a.title}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {links.positioningEntries.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Radio className="w-4 h-4" /> {t("pages.imagingSeoPage.positioningGuides")}</h3>
            <ul className="space-y-2">
              {links.positioningEntries.map((p, i) => (
                <li key={i}><Link href={`/medical-imaging/${p.country}/positioning/${p.slug}`} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5" data-testid={`link-related-positioning-${i}`}><ArrowRight className="w-3 h-3" />{p.projectionName}</Link></li>
              ))}
            </ul>
          </div>
        )}
        {links.physicsTopics.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> {t("pages.imagingSeoPage.physicsTopics")}</h3>
            <ul className="space-y-2">
              {links.physicsTopics.map((t, i) => (
                <li key={i}><span className="text-sm text-gray-700 flex items-center gap-1.5" data-testid={`text-related-physics-${i}`}><ArrowRight className="w-3 h-3" />{t.title}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function CTABlock({ cta, country }: { cta: SeoPageData["ctaJson"]; country: string }) {
  if (!cta || !cta.heading) return null;
  const countryMeta = COUNTRY_META[country];

  return (
    <section className={`mt-12 bg-gradient-to-r ${countryMeta?.color === "red" ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600"} rounded-2xl p-8 text-white text-center`} data-testid="section-cta">
      <h2 className="text-2xl font-bold mb-3">{cta.heading}</h2>
      {cta.description && <p className="text-white/90 mb-6 max-w-lg mx-auto">{cta.description}</p>}
      {cta.buttonText && cta.buttonHref && (
        <Link href={cta.buttonHref} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors" data-testid="link-cta-button">
          {cta.buttonText} <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </section>
  );
}

export default function ImagingSeoPage() {
  const [, params] = useRoute("/medical-imaging/:country/seo/:slug");
  const country = params?.country || "canada";
  const slug = params?.slug || "";
  const countryMeta = COUNTRY_META[country];

  const { data: page, isLoading } = useQuery<SeoPageData>({
    queryKey: ["/api/imaging-seo/pages", slug, country],
    queryFn: async () => {
      const res = await fetch(`/api/imaging-seo/pages/${slug}?country=${encodeURIComponent(country)}`);
      if (!res.ok) throw new Error("Page not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const { data: links } = useQuery<InternalLinks>({
    queryKey: ["/api/imaging-seo/internal-links", country, page?.topic],
    queryFn: async () => {
      const params = new URLSearchParams({ country });
      if (page?.topic) params.set("topic", page.topic);
      if (page?.tags?.length) params.set("tags", page.tags.join(","));
      const res = await fetch(`/api/imaging-seo/internal-links?${params}`);
      return res.json();
    },
    enabled: !!page,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-not-found">{t("pages.imagingSeoPage.pageNotFound")}</h1>
        <p className="text-gray-600 mb-4">{t("pages.imagingSeoPage.thePageYoureLookingFor")}</p>
        <Link href={`/medical-imaging/${country}`} className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700" data-testid="link-back-country">
          Back to {countryMeta?.name || "Medical Imaging"}
        </Link>
      </div>
    );
  }

  const Icon = PAGE_TYPE_ICONS[page.pageType] || BookOpen;

  const faqSchema = page.faqJson && page.faqJson.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqJson.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.metaTitle || page.title,
    description: page.metaDescription || "",
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/medical-imaging/${country}/seo/${page.slug}`,
    },
  };

  const additionalSchemas = [articleSchema];
  if (faqSchema) additionalSchemas.push(faqSchema);
  if (page.schemaMarkupJson) additionalSchemas.push(page.schemaMarkupJson);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription || `${page.title} - Medical Imaging study resource for ${countryMeta?.exam || ""} certification`}
        keywords={[page.primaryKeyword, ...(page.secondaryKeywords || [])].filter(Boolean).join(", ")}
        canonicalPath={`/medical-imaging/${country}/seo/${page.slug}`}
        additionalStructuredData={additionalSchemas}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Medical Imaging", url: "/medical-imaging" },
          { name: countryMeta?.name || country, url: `/medical-imaging/${country}` },
          { name: page.title, url: `/medical-imaging/${country}/seo/${page.slug}` },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { name: "Medical Imaging", url: "/medical-imaging" },
            { name: `${countryMeta?.flag || ""} ${countryMeta?.name || country}`, url: `/medical-imaging/${country}` },
            { name: page.title, url: "" },
          ]}
        />

        <header className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${countryMeta?.color === "red" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-sm font-medium ${countryMeta?.color === "red" ? "text-red-600" : "text-blue-600"}`} data-testid="text-page-type">
              {page.pageType.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} {countryMeta?.flag}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight" data-testid="text-page-title">{page.title}</h1>
          {page.tags && page.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {page.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full" data-testid={`tag-${i}`}>{tag}</span>
              ))}
            </div>
          )}
        </header>

        {page.introHtml && (
          <div className="prose prose-lg max-w-none mb-8 text-gray-700" dangerouslySetInnerHTML={{ __html: page.introHtml }} data-testid="section-intro" />
        )}

        {page.contentHtml && (
          <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.contentHtml }} data-testid="section-content" />
        )}

        <SampleQuestionPreview questions={page.sampleQuestionsJson} />

        <FAQSection items={page.faqJson} />

        {links && <InternalLinksSection links={links} country={country} />}

        <CTABlock cta={page.ctaJson} country={country} />

        <nav className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/medical-imaging/${country}`} className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-country">
              {countryMeta?.flag} {countryMeta?.exam} Hub
            </Link>
            <Link href={`/medical-imaging/${country}/lessons`} className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-lessons">
              Lessons
            </Link>
            <Link href={`/medical-imaging/${country}/positioning`} className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-positioning">
              Positioning Guide
            </Link>
            <Link href={`/medical-imaging/${country}/physics`} className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-physics">
              Physics Review
            </Link>
            <Link href={`/medical-imaging/${country}/practice-exams`} className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-practice">
              Practice Exams
            </Link>
            <Link href="/medical-imaging/blog" className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1" data-testid="link-nav-blog">
              Blog & Articles
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

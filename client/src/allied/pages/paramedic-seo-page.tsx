import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { AlliedSEO } from "../allied-seo";
import {
  Breadcrumbs, SEOHero, ClinicalPearlCard, ExamTipCard, FAQAccordion,
  ComparisonHighlights, ConversionCTA, RelatedContentRail,
  StudyGuideChecklist, MiniQuizBlock, CategoryFeatureGrid, TopicSummaryCard,
  PracticeQuestionsLink,
} from "../components/paramedic-seo-components";
import { Loader2 } from "lucide-react";

import { useI18n } from "@/lib/i18n";
const ALLIED_DOMAIN = "https://www.nursenest.ca/allied-health";

type PageType = "topic" | "category" | "glossary" | "comparison" | "study-guide";

function useParamedicSeoContent(type: PageType, slug: string | undefined) {
  const { t } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedLinks, setRelatedLinks] = useState<any[]>([]);
  const [childTopics, setChildTopics] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/paramedic-seo/public/${type}/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => {
        setData(d);
        setError(null);
        fetch(`/api/paramedic-seo/public/links/${type}/${slug}`)
          .then(r => r.json())
          .then(links => setRelatedLinks(Array.isArray(links) ? links : []))
          .catch(() => {});
        if (type === "category") {
          fetch(`/api/paramedic-seo/public/category/${slug}/topics`)
            .then(r => r.json())
            .then(topics => setChildTopics(Array.isArray(topics) ? topics : []))
            .catch(() => {});
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [type, slug]);

  return { data, loading, error, relatedLinks, childTopics };
}

function buildStructuredData(type: PageType, data: any, breadcrumbs: { label: string; href: string }[]) {
  const schemas: Record<string, any>[] = [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `${ALLIED_DOMAIN}${b.href}`,
    })),
  };
  schemas.push(breadcrumbSchema);

  if (type === "topic" || type === "study-guide" || type === "comparison") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.seoTitle || data.title,
      description: data.metaDescription || "",
      publisher: { "@type": "Organization", name: "NurseNest" },
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
    });
  }

  if (type === "glossary") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: data.term,
      description: data.definition,
      inDefinedTermSet: { "@type": "DefinedTermSet", name: "Paramedic Glossary" },
    });
  }

  const faq = data.faq || [];
  if (faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f: any) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  if (type === "category") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: data.title,
      description: data.metaDescription || data.description || "",
    });
  }

  return schemas;
}

function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
    </div>
  );
}

function PageNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("allied.paramedicSeoPage.pageNotFound")}</h1>
      <p className="text-gray-600">{t("allied.paramedicSeoPage.theParamedicContentYoureLooking")}</p>
      <a href="/" className="inline-block mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700" data-testid="link-back-home">{t("allied.paramedicSeoPage.backToHome")}</a>
    </div>
  );
}

function SectionRenderer({ sections }: { sections: any[] }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="space-y-6">
      {sections.map((section: any, i: number) => (
        <div key={i}>
          {section.heading && <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>}
          {section.content && <div className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>}
          {section.bullets && (
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm mt-2">
              {section.bullets.map((b: string, j: number) => <li key={j}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function ParamedicTopicPage() {
  const params = useParams<{ slug: string }>();
  const { data, loading, error, relatedLinks } = useParamedicSeoContent("topic", params.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageNotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: data.title, href: `/allied-health/paramedic/topic/${data.slug}` },
  ];

  const schemas = buildStructuredData("topic", data, breadcrumbs);

  return (
    <div data-testid="paramedic-topic-page">
      <AlliedSEO
        title={data.seoTitle || data.title}
        description={data.metaDescription || ""}
        canonicalPath={`/allied-health/paramedic/topic/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <SEOHero title={data.title} subtitle={data.metaDescription} difficulty={data.difficulty} examRelevance={data.examRelevance} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SectionRenderer sections={data.sections || []} />
        {(data.clinicalPearls || []).map((pearl: any, i: number) => (
          <ClinicalPearlCard key={i} pearl={pearl} />
        ))}
        {(data.examTips || []).map((tip: any, i: number) => (
          <ExamTipCard key={i} tip={tip} />
        ))}
        <FAQAccordion items={data.faq || []} />
        <PracticeQuestionsLink />
        <RelatedContentRail links={relatedLinks} />
        <ConversionCTA />
      </div>
    </div>
  );
}

export function ParamedicCategoryPage() {
  const params = useParams<{ slug: string }>();
  const { data, loading, error, childTopics, relatedLinks } = useParamedicSeoContent("category", params.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageNotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: data.title, href: `/allied-health/paramedic/category/${data.slug}` },
  ];

  const schemas = buildStructuredData("category", data, breadcrumbs);

  return (
    <div data-testid="paramedic-category-page">
      <AlliedSEO
        title={data.seoTitle || data.title}
        description={data.metaDescription || data.description || ""}
        canonicalPath={`/allied-health/paramedic/category/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <SEOHero title={data.title} subtitle={data.description} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CategoryFeatureGrid topics={childTopics} />
        <PracticeQuestionsLink />
        <RelatedContentRail links={relatedLinks} />
        <ConversionCTA />
      </div>
    </div>
  );
}

export function ParamedicGlossaryPage() {
  const params = useParams<{ slug: string }>();
  const { data, loading, error, relatedLinks } = useParamedicSeoContent("glossary", params.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageNotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: "Glossary", href: "/allied-health/paramedic/glossary" },
    { label: data.term, href: `/allied-health/paramedic/glossary/${data.slug}` },
  ];

  const schemas = buildStructuredData("glossary", data, breadcrumbs);

  return (
    <div data-testid="paramedic-glossary-page">
      <AlliedSEO
        title={data.seoTitle || `${data.term} - Paramedic Glossary`}
        description={data.metaDescription || data.definition}
        canonicalPath={`/allied-health/paramedic/glossary/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <SEOHero title={data.term} subtitle={data.abbreviation ? `(${data.abbreviation})` : undefined} difficulty={data.difficulty} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t("allied.paramedicSeoPage.definition")}</h2>
          <p className="text-gray-700 leading-relaxed">{data.definition}</p>
        </div>
        {data.extendedDescription && (
          <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{data.extendedDescription}</div>
        )}
        {(data.usageExamples || []).length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{t("allied.paramedicSeoPage.usageExamples")}</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              {(data.usageExamples || []).map((ex: any, i: number) => (
                <li key={i}>{typeof ex === "string" ? ex : ex.text || ex.example}</li>
              ))}
            </ul>
          </div>
        )}
        <PracticeQuestionsLink />
        <RelatedContentRail links={relatedLinks} />
        <ConversionCTA />
      </div>
    </div>
  );
}

export function ParamedicComparisonPage() {
  const params = useParams<{ slug: string }>();
  const { data, loading, error, relatedLinks } = useParamedicSeoContent("comparison", params.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageNotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: data.title, href: `/allied-health/paramedic/compare/${data.slug}` },
  ];

  const schemas = buildStructuredData("comparison", data, breadcrumbs);

  return (
    <div data-testid="paramedic-comparison-page">
      <AlliedSEO
        title={data.seoTitle || data.title}
        description={data.metaDescription || data.summary || ""}
        canonicalPath={`/allied-health/paramedic/compare/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <SEOHero title={data.title} subtitle={data.summary} examRelevance={data.examRelevance} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ComparisonHighlights itemA={data.itemA} itemB={data.itemB} points={data.comparisonPoints || []} />
        <FAQAccordion items={data.faq || []} />
        <PracticeQuestionsLink />
        <RelatedContentRail links={relatedLinks} />
        <ConversionCTA />
      </div>
    </div>
  );
}

export function ParamedicStudyGuidePage() {
  const params = useParams<{ slug: string }>();
  const { data, loading, error, relatedLinks } = useParamedicSeoContent("study-guide", params.slug);

  if (loading) return <PageLoading />;
  if (error || !data) return <PageNotFound />;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Paramedic", href: "/allied-health/paramedic" },
    { label: "Study Guides", href: "/allied-health/paramedic/study-guide" },
    { label: data.title, href: `/allied-health/paramedic/study-guide/${data.slug}` },
  ];

  const schemas = buildStructuredData("study-guide", data, breadcrumbs);

  return (
    <div data-testid="paramedic-study-guide-page">
      <AlliedSEO
        title={data.seoTitle || data.title}
        description={data.metaDescription || ""}
        canonicalPath={`/allied-health/paramedic/study-guide/${data.slug}`}
        structuredData={schemas[0]}
        additionalStructuredData={schemas.slice(1)}
      />
      <Breadcrumbs items={breadcrumbs} />
      <SEOHero title={data.title} subtitle={data.metaDescription} difficulty={data.difficulty} examRelevance={data.examRelevance} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {data.estimatedMinutes && (
          <div className="text-sm text-gray-500 mb-4">Estimated time: {data.estimatedMinutes} minutes</div>
        )}
        {(data.objectives || []).length > 0 && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-teal-800 mb-2">{t("allied.paramedicSeoPage.learningObjectives")}</h2>
            <ul className="list-disc pl-5 space-y-1 text-teal-900 text-sm">
              {(data.objectives || []).map((obj: string, i: number) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        )}
        <SectionRenderer sections={data.sections || []} />
        <StudyGuideChecklist items={data.checklist || []} />
        <MiniQuizBlock questions={data.miniQuiz || []} />
        <FAQAccordion items={data.faq || []} />
        <PracticeQuestionsLink />
        <RelatedContentRail links={relatedLinks} />
        <ConversionCTA />
      </div>
    </div>
  );
}

export function ParamedicExamPrepPage() {
  return <ParamedicStudyGuidePage />;
}

export default ParamedicTopicPage;

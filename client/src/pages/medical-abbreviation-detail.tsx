import { useParams } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  getAbbreviationBySlug,
  getRelatedAbbreviations,
} from "@/data/medical-abbreviations";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  FileText,
  GraduationCap,
  Stethoscope,
} from "lucide-react";

export default function MedicalAbbreviationDetail() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const abbreviation = getAbbreviationBySlug(params.slug || "");

  if (!abbreviation) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center" data-testid="text-not-found">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("medAbbreviations.notFound")}</h1>
            <p className="text-gray-500 mb-4">{t("medAbbreviations.notFoundDesc")}</p>
            <LocaleLink href="/medical-abbreviations-for-nurses">
              <Button data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("medAbbreviations.backToHub")}
              </Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedAbbreviations = getRelatedAbbreviations(abbreviation.slug);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${abbreviation.abbreviation} – ${abbreviation.fullForm} | Medical Abbreviation`,
    "description": abbreviation.definition.slice(0, 160),
    "url": `https://www.nursenest.ca/medical-abbreviations-for-nurses/${abbreviation.slug}`,
    "author": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "publisher": { "@type": "Organization", "name": "NurseNest Education Inc.", "url": "https://www.nursenest.ca" },
    "mainEntityOfPage": `https://www.nursenest.ca/medical-abbreviations-for-nurses/${abbreviation.slug}`,
    "keywords": `${abbreviation.abbreviation}, ${abbreviation.fullForm}, medical abbreviation, nursing terminology`,
  };

  return (
    <>
      <SEO
        title={`${abbreviation.abbreviation} (${abbreviation.fullForm}) – Nursing Definition & Clinical Usage`}
        description={`${abbreviation.abbreviation} stands for ${abbreviation.fullForm}. ${abbreviation.definition.slice(0, 120)}`}
        keywords={`${abbreviation.abbreviation}, ${abbreviation.fullForm}, medical abbreviation, nursing abbreviation, clinical terminology, NCLEX`}
        canonicalPath={`/medical-abbreviations-for-nurses/${abbreviation.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(abbreviation.faqs)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Medical Abbreviations", url: "https://www.nursenest.ca/medical-abbreviations-for-nurses" },
          { name: abbreviation.abbreviation, url: `https://www.nursenest.ca/medical-abbreviations-for-nurses/${abbreviation.slug}` },
        ]}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: t("medAbbreviations.breadcrumb"), url: "https://www.nursenest.ca/medical-abbreviations-for-nurses" },
              { name: abbreviation.abbreviation, url: `https://www.nursenest.ca/medical-abbreviations-for-nurses/${abbreviation.slug}` },
            ]}
          />

          <LocaleLink href="/medical-abbreviations-for-nurses" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6 mt-4" data-testid="link-back">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("medAbbreviations.backToHub")}
          </LocaleLink>

          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
            <Badge className="bg-emerald-100 text-emerald-700 mb-3" data-testid="badge-category">
              {abbreviation.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-abbreviation-title">
              {abbreviation.abbreviation}
            </h1>
            <p className="text-lg text-emerald-700 font-medium mb-4" data-testid="text-full-form">
              {abbreviation.fullForm}
            </p>
            <p className="text-gray-700 text-base leading-relaxed" data-testid="text-definition">
              {abbreviation.definition}
            </p>
          </article>

          <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-8" data-testid="section-clinical-examples">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              {t("medAbbreviations.clinicalExamples")}
            </h2>
            <ul className="space-y-3">
              {abbreviation.clinicalExamples.map((example, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8" data-testid="section-usage-context">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {t("medAbbreviations.usageContext")}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{abbreviation.usageContext}</p>
          </div>

          {abbreviation.commonMistakes && abbreviation.commonMistakes.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-100 p-6 mb-8" data-testid="section-common-mistakes">
              <h2 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {t("medAbbreviations.commonMistakes")}
              </h2>
              <ul className="space-y-2">
                {abbreviation.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6 mb-8" data-testid="section-exam-relevance">
            <h2 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              {t("medAbbreviations.examRelevance")}
            </h2>
            <p className="text-sm text-emerald-800 leading-relaxed">{abbreviation.examRelevance}</p>
          </div>

          {abbreviation.faqs.length > 0 && (
            <div className="mb-8" data-testid="section-faq">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t("medAbbreviations.faqTitle")}</h2>
              <div className="space-y-3">
                {abbreviation.faqs.map((faq, i) => (
                  <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group" data-testid={`faq-${i}`}>
                    <summary className="font-semibold text-sm text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                    </summary>
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {abbreviation.relatedLessonSlugs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8" data-testid="section-related-lessons">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("medAbbreviations.relatedLessons")}</h2>
              <div className="grid gap-2">
                {abbreviation.relatedLessonSlugs.map((lessonSlug) => (
                  <LocaleLink
                    key={lessonSlug}
                    href={`/lessons/${lessonSlug}`}
                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                    data-testid={`link-related-lesson-${lessonSlug}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {lessonSlug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </LocaleLink>
                ))}
              </div>
            </div>
          )}

          {relatedAbbreviations.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8" data-testid="section-related-abbreviations">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("medAbbreviations.relatedAbbreviations")}</h2>
              <div className="grid gap-2">
                {relatedAbbreviations.map((ra) => (
                  <LocaleLink
                    key={ra.slug}
                    href={`/medical-abbreviations-for-nurses/${ra.slug}`}
                    className="flex items-center justify-between gap-2 text-sm text-gray-700 hover:text-primary transition-colors py-1"
                    data-testid={`link-related-${ra.slug}`}
                  >
                    <span>
                      <span className="font-bold">{ra.abbreviation}</span>
                      <span className="text-gray-400 ml-2">— {ra.fullForm}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </LocaleLink>
                ))}
              </div>
            </div>
          )}

          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center" data-testid="section-cta">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("medAbbreviations.ctaTitle")}</h2>
            <p className="text-gray-600 text-sm mb-4">{t("medAbbreviations.ctaDesc")}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <LocaleLink href="/practice-questions">
                <Button data-testid="button-cta-practice">{t("medAbbreviations.ctaPractice")}</Button>
              </LocaleLink>
              <LocaleLink href="/flashcards">
                <Button variant="outline" data-testid="button-cta-flashcards">{t("medAbbreviations.ctaFlashcards")}</Button>
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

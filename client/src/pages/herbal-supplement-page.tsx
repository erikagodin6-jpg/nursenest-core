import { useState } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { seoHerbalPages } from "@/data/seo-herbal-supplements";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import {
  Leaf,
  AlertTriangle,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Pill,
} from "lucide-react";

export default function HerbalSupplementPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const page = seoHerbalPages.find((p) => p.slug === params.slug);

  if (!page) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-testid="herbal-page-not-found">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("pages.herbalSupplementPage.pageNotFound")}</h1>
            <p className="text-gray-600 mb-4">{t("pages.herbalSupplementPage.theHerbalSupplementGuideYou")}</p>
            <Button onClick={() => navigate("/herbal-supplements")} data-testid="button-back-herbal-hub">
              Browse Herbal Supplement Guides
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.metaDescription,
    author: {
      "@type": "Organization",
      name: "NurseNest",
    },
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
    },
  };

  return (
    <>
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.targetKeywords.join(", ")}
        canonicalPath={`/herbal-supplements/${page.slug}`}
        ogType="article"
        structuredData={articleStructuredData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Pharmacology", url: "https://www.nursenest.ca/pharmacology" },
          { name: "Herbal Supplements", url: "https://www.nursenest.ca/herbal-supplements" },
          { name: page.title, url: `https://www.nursenest.ca/herbal-supplements/${page.slug}` },
        ]}
      />
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-16 lg:py-20" data-testid="herbal-seo-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6" data-testid="breadcrumb-herbal">
              <button onClick={() => navigate("/")} className="hover:text-white/80 transition-colors">{t("pages.herbalSupplementPage.home")}</button>
              <span>/</span>
              <button onClick={() => navigate("/pharmacology")} className="hover:text-white/80 transition-colors">{t("pages.herbalSupplementPage.pharmacology")}</button>
              <span>/</span>
              <button onClick={() => navigate("/herbal-supplements")} className="hover:text-white/80 transition-colors">{t("pages.herbalSupplementPage.herbalSupplements")}</button>
              <span>/</span>
              <span className="text-white/90">{page.title}</span>
            </nav>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600/30 flex items-center justify-center shrink-0">
                <Leaf className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight" data-testid="text-herbal-page-title">
                  {page.heroHeading}
                </h1>
                <p className="text-white/70 text-lg mt-1" data-testid="text-herbal-page-subtitle">
                  {page.heroSubheading}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
          <section data-testid="section-introduction">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg" data-testid="text-introduction">
                  {page.introduction}
                </p>
              </CardContent>
            </Card>
          </section>

          {page.sections.map((section, sIdx) => (
            <section key={sIdx} data-testid={`section-content-${sIdx}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  {sIdx === 0 ? (
                    <AlertTriangle className="w-5 h-5 text-emerald-600" />
                  ) : sIdx === 1 ? (
                    <Pill className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
              </div>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-3">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-3" data-testid={`text-item-${sIdx}-${iIdx}`}>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </section>
          ))}

          <section data-testid="section-faq">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementPage.frequentlyAskedQuestions")}</h2>
            </div>
            <div className="space-y-3">
              {page.faq.map((f, fIdx) => (
                <Card key={fIdx} data-testid={`card-faq-${fIdx}`}>
                  <CardContent className="p-0">
                    <button
                      className="w-full text-left p-5 flex items-start justify-between gap-4"
                      onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                      data-testid={`button-faq-${fIdx}`}
                    >
                      <span className="font-semibold text-gray-900">{f.question}</span>
                      {openFaq === fIdx ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                    {openFaq === fIdx && (
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-gray-600 leading-relaxed" data-testid={`text-faq-answer-${fIdx}`}>{f.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section data-testid="section-related-lessons">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementPage.relatedLessons")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.relatedLessons.map((lessonSlug) => (
                <LocaleLink key={lessonSlug} href={`/lessons/${lessonSlug}`}>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-left cursor-pointer" data-testid={`link-related-lesson-${lessonSlug}`}>
                    <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{lessonSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                      <p className="text-xs text-gray-500">{t("pages.herbalSupplementPage.herbalSupplementLesson")}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                  </div>
                </LocaleLink>
              ))}
            </div>
          </section>

          <section data-testid="section-pharma-crosslinks">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.herbalSupplementPage.pharmacologyResources")}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <LocaleLink href="/pharmacology">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-left cursor-pointer" data-testid="link-pharma-hub">
                  <Pill className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{t("pages.herbalSupplementPage.pharmacologyCrashCourse")}</p>
                    <p className="text-xs text-gray-500">{t("pages.herbalSupplementPage.5dayIntensiveDrugReview")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                </div>
              </LocaleLink>
              <LocaleLink href="/medication-mastery">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all text-left cursor-pointer" data-testid="link-med-mastery">
                  <Stethoscope className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{t("pages.herbalSupplementPage.medicationMastery")}</p>
                    <p className="text-xs text-gray-500">{t("pages.herbalSupplementPage.mechanismfirstDrugExplorer")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0" />
                </div>
              </LocaleLink>
            </div>
          </section>

          <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-8 text-white text-center" data-testid="section-cta">
            <h2 className="text-2xl font-bold mb-3">{t("pages.herbalSupplementPage.masterHerbalSupplementSafety")}</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Access comprehensive herbal supplement lessons, practice questions, and clinical simulations designed for nursing exam success.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6"
                onClick={() => navigate("/herbal-supplements")}
                data-testid="button-cta-herbal-hub"
              >
                View All Herbal Lessons
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-6"
                onClick={() => navigate("/pricing")}
                data-testid="button-cta-pricing"
              >
                View Plans
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

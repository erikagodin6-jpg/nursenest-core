import { LocaleLink } from "@/lib/LocaleLink";
import { useMemo } from "react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Heart,
  Wind,
  Droplets,
  Gauge,
  Syringe,
  Zap,
  Baby,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Target,
  ArrowLeft,
  Link2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { clinicalConfusions, type ClinicalConfusion, type ClinicalImage } from "@/data/clinical-confusions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
function ClinicalImageBlock({ images, placement }: { images?: ClinicalImage[]; placement: ClinicalImage["placement"] }) {
  const { t } = useI18n();
  if (!images) return null;
  const filtered = images.filter((img) => img.placement === placement);
  if (filtered.length === 0) return null;
  return (
    <div className="my-8 space-y-6">
      {filtered.map((img, i) => (
        <figure key={i} className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm" data-testid={`figure-clinical-image-${placement}-${i}`}>
          <div className="bg-gray-50 p-2">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full rounded-lg object-contain max-h-[500px]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="px-5 py-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
            {img.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const systemIcons: Record<string, any> = {
  Cardiovascular: Heart,
  Respiratory: Wind,
  Neurological: Brain,
  Endocrine: Gauge,
  Gastrointestinal: Droplets,
  Hematology: Syringe,
  Emergency: Zap,
  Maternity: Baby,
};

const difficultyColors: Record<string, { bg: string; text: string; label: string }> = {
  foundational: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Foundational" },
  intermediate: { bg: "bg-amber-50", text: "text-amber-700", label: "Intermediate" },
  advanced: { bg: "bg-rose-50", text: "text-rose-700", label: "Advanced" },
};

export default function ClinicalClarityDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const confusion = useMemo(() => {
    return clinicalConfusions.find((c) => c.slug === slug);
  }, [slug]);

  const relatedTopics = useMemo(() => {
    if (!confusion) return [];
    return clinicalConfusions
      .filter(
        (c) =>
          c.slug !== confusion.slug &&
          (c.bodySystem === confusion.bodySystem || c.category === confusion.category)
      )
      .slice(0, 3);
  }, [confusion]);

  if (!confusion) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Brain className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t("pages.clinicalClarityDetail.topicNotFound")}</h1>
          <p className="text-gray-500 mb-8">{t("pages.clinicalClarityDetail.theClinicalClarityTopicYoure")}</p>
          <LocaleLink href="/clinical-clarity">
            <Button className="rounded-full px-8 bg-primary text-white" data-testid="button-back-to-clarity">
              Back to Clinical Clarity
            </Button>
          </LocaleLink>
        </main>
      </div>
    );
  }

  const Icon = systemIcons[confusion.bodySystem] || Brain;
  const diff = difficultyColors[confusion.difficulty];

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={`${confusion.question} | Clinical Clarity - NurseNest`}
        description={confusion.shortAnswer}
        keywords={confusion.keywords.join(", ")}
        canonicalPath={`/clinical-clarity/${confusion.slug}`}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          "name": confusion.question,
          "headline": confusion.question,
          "description": confusion.shortAnswer,
          "url": `https://www.nursenest.ca/clinical-clarity/${confusion.slug}`,
          "publisher": {
            "@type": "Organization",
            "name": "NurseNest",
          },
          "educationalLevel": confusion.difficulty,
          "learningResourceType": "Clinical Explanation",
          "about": {
            "@type": "MedicalCondition",
            "name": confusion.bodySystem,
          },
        }}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Clinical Clarity", url: "https://www.nursenest.ca/clinical-clarity" },
          { name: confusion.question, url: `https://www.nursenest.ca/clinical-clarity/${confusion.slug}` },
        ]}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": confusion.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": confusion.shortAnswer,
                },
              },
            ],
          },
        ]}
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <BreadcrumbNav items={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Clinical Clarity", url: "https://www.nursenest.ca/clinical-clarity" },
          { name: confusion.question, url: `https://www.nursenest.ca/clinical-clarity/${confusion.slug}` },
        ]} />
        <LocaleLink href="/clinical-clarity">
          <Button variant="ghost" className="gap-2 text-gray-500 hover:text-primary mb-6 -ml-2 text-sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            All Clinical Clarity Topics
          </Button>
        </LocaleLink>

        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Icon className="w-4 h-4 text-primary/60" />
                {confusion.bodySystem}
              </div>
              <span className="text-gray-300">·</span>
              <span className="text-xs font-medium text-gray-400">{confusion.category}</span>
              <span className="text-gray-300">·</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                {diff.label}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6" data-testid="text-question">
              {confusion.question}
            </h1>

            <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-5 sm:p-6 border-l-4 border-primary">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium" data-testid="text-short-answer">
                {confusion.shortAnswer}
              </p>
            </div>
          </header>

          <ClinicalImageBlock images={confusion.images} placement="top" />

          <section className="mb-12" data-testid="section-mechanism">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{confusion.mechanism.title}</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-[1.8] text-[15px] sm:text-base">
                {confusion.mechanism.content}
              </p>
            </div>

            <ClinicalImageBlock images={confusion.images} placement="after-mechanism" />

            <div className="mt-8 bg-gray-50 rounded-xl p-5 sm:p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                Mechanism Chain
              </h3>
              <div className="space-y-3">
                {confusion.mechanism.chain.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <ClinicalImageBlock images={confusion.images} placement="after-chain" />
          </section>

          <section className="mb-12" data-testid="section-misconceptions">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalClarityDetail.commonMisconceptions")}</h2>
            </div>

            <div className="space-y-4">
              {confusion.misconceptions.map((m, i) => (
                <Card key={i} className="border border-gray-100 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-red-50/50 px-5 sm:px-6 py-4 border-b border-red-100/50">
                      <div className="flex items-start gap-2.5">
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">{t("pages.clinicalClarityDetail.misconception")}</span>
                          <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">{m.myth}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 sm:px-6 py-4 bg-emerald-50/30">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">{t("pages.clinicalClarityDetail.evidencebasedReality")}</span>
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{m.reality}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <ClinicalImageBlock images={confusion.images} placement="after-misconceptions" />
          </section>

          <section className="mb-12" data-testid="section-clinical-relevance">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{confusion.clinicalRelevance.title}</h2>
            </div>

            <div className="space-y-3">
              {confusion.clinicalRelevance.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-50">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <ClinicalImageBlock images={confusion.images} placement="after-relevance" />
          </section>

          <section className="mb-12" data-testid="section-pause-think">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t("pages.clinicalClarityDetail.pauseThink")}</h2>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                  {confusion.pauseAndThink}
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Consider the physiological mechanism before scrolling to related content. 
                  Active reasoning builds stronger clinical judgment than passive reading.
                </p>
              </CardContent>
            </Card>
          </section>

          {confusion.relatedLessons.length > 0 && (
            <section className="mb-12" data-testid="section-related-lessons">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalClarityDetail.diveDeeper")}</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {confusion.relatedLessons.map((lesson) => (
                  <LocaleLink key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <Card className="border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer group h-full">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                            {lesson.title}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>
          )}

          {relatedTopics.length > 0 && (
            <section className="mb-12" data-testid="section-related-topics">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{t("pages.clinicalClarityDetail.relatedQuestions")}</h2>
              </div>

              <div className="space-y-3">
                {relatedTopics.map((topic) => {
                  const TopicIcon = systemIcons[topic.bodySystem] || Brain;
                  return (
                    <LocaleLink key={topic.slug} href={`/clinical-clarity/${topic.slug}`}>
                      <Card className="border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <TopicIcon className="w-4 h-4 text-primary/40" />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                              {topic.question}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardContent>
                      </Card>
                    </LocaleLink>
                  );
                })}
              </div>
            </section>
          )}
        </article>

        <EducationalIntegrity variant="banner" className="mt-8" />

        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <LocaleLink href="/clinical-clarity">
              <Button variant="outline" className="rounded-full gap-2 text-sm" data-testid="button-all-topics">
                <ArrowLeft className="w-4 h-4" />
                All Clinical Clarity Topics
              </Button>
            </LocaleLink>
            <LocaleLink href="/lessons">
              <Button className="rounded-full gap-2 bg-primary text-white hover:brightness-110 text-sm" data-testid="button-full-lessons">
                Full Lesson Library
                <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
          </div>
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}

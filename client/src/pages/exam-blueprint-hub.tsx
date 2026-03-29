import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData } from "@/lib/structured-data";
import { BLUEPRINT_HUBS, type BlueprintHubConfig } from "@/data/blueprint-hub-data";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  BookOpen,
  FileText,
  Target,
  Clock,
  BarChart3,
  Shield,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  Layers,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EndOfContentLeadCapture } from "@/components/lead-capture";

import { useI18n } from "@/lib/i18n";
function FAQAccordion({ faqItems, prefix }: { faqItems: { question: string; answer: string }[]; prefix: string }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqItems.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`${prefix}-faq-item-${i}`}>
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            data-testid={`${prefix}-faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`${prefix}-faq-answer-${i}`}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function BlueprintHubNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[#2E3A59] mb-4" data-testid="text-blueprint-not-found">{t("pages.examBlueprintHub.blueprintNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("pages.examBlueprintHub.theExamBlueprintPageYou")}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {BLUEPRINT_HUBS.map(hub => (
            <LocaleLink key={hub.slug} href={`/${hub.slug}`} className="text-[#BFA6F6] hover:underline font-medium" data-testid={`link-blueprint-${hub.slug}`}>
              {hub.examName}
            </LocaleLink>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

const CATEGORY_ICONS = [Target, BookOpen, Shield, Lightbulb, FileText, Layers, GraduationCap, BarChart3];

export default function ExamBlueprintHub() {
  const [location] = useLocation();
  const pathSlug = location
    .replace(/^\/(?:en|fr|es|fil|hi|zh|ar|ko|pt|pa|vi|ht|ur|ja|fa|de|th)\//, "/")
    .replace(/^\//, "")
    .replace(/\/$/, "");

  const hubData = BLUEPRINT_HUBS.find(h => h.slug === pathSlug);

  if (!hubData) {
    return <BlueprintHubNotFound />;
  }

  const faqStructuredData = buildFaqStructuredData(
    hubData.faqItems.map(f => ({ question: f.question, answer: f.answer }))
  );

  const credentialSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalCredential",
    name: hubData.examName,
    credentialCategory: "Professional Licensure Examination",
    educationalLevel: hubData.tier === "rn" ? "Undergraduate" : hubData.tier === "rpn" ? "Vocational" : "Professional",
    recognizedBy: {
      "@type": "Organization",
      name: hubData.region === "CA" ? "NCSBN Canada" : hubData.region === "US" ? "NCSBN" : "NCSBN",
    },
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: hubData.h1Title,
    description: hubData.introText.slice(0, 300),
    url: `https://www.nursenest.ca/${hubData.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
    about: credentialSchema,
  };

  const adaptiveLabel = hubData.adaptiveOrFixed === "adaptive"
    ? "Computer Adaptive Testing (CAT)"
    : hubData.adaptiveOrFixed === "fixed"
      ? "Fixed-Length Exam"
      : "Linear Scaled Testing";

  const breadcrumbItems = [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: `${hubData.examName} Blueprint`, url: `https://www.nursenest.ca/${hubData.slug}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <SEO
        title={hubData.h1Title}
        description={hubData.introText.slice(0, 160)}
        keywords={hubData.keywords.join(", ")}
        canonicalPath={`/${hubData.slug}`}
        ogType="article"
        structuredData={webPageSchema}
        additionalStructuredData={[faqStructuredData, credentialSchema]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="bg-gradient-to-b from-[#2E3A59] to-[#3d4d73] text-white py-16 md:py-20" data-testid="blueprint-hero">
        <div className="max-w-4xl mx-auto px-4">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="flex items-center gap-3 mb-4 mt-6">
            <Badge className="bg-[#BFA6F6]/20 text-[#BFA6F6] border-0" data-testid="badge-blueprint-exam-code">
              {hubData.examCode}
            </Badge>
            <Badge variant="outline" className="text-white/70 border-white/20" data-testid="badge-blueprint-region">
              {hubData.region === "CA" ? "Canada" : hubData.region === "US" ? "United States" : "US & Canada"}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-blueprint-h1">
            {hubData.h1Title}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-3xl" data-testid="text-blueprint-intro">
            {hubData.introText}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        <section data-testid="section-exam-structure">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#BFA6F6]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#BFA6F6]" />
            </div>
            <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examBlueprintHub.examStructure")}</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div data-testid="text-bp-question-count">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examBlueprintHub.questions")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{hubData.questionCount}</p>
                </div>
                <div data-testid="text-bp-time-limit">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examBlueprintHub.timeLimit")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{hubData.timeLimit}</p>
                </div>
                <div data-testid="text-bp-format">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examBlueprintHub.testingFormat")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{adaptiveLabel}</p>
                </div>
                <div data-testid="text-bp-pass-info">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{t("pages.examBlueprintHub.passInformation")}</p>
                  <p className="text-lg font-bold text-[#2E3A59]">{hubData.passInfo}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">{t("pages.examBlueprintHub.questionTypes")}</p>
                <div className="flex flex-wrap gap-2">
                  {hubData.questionTypes.map((qt, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-gray-200 text-gray-600" data-testid={`badge-bp-qtype-${i}`}>
                      {qt}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section data-testid="section-categories">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examBlueprintHub.examCategories")}</h2>
          </div>
          <p className="text-gray-600 mb-6">
            The {hubData.examName} exam is divided into the following categories. Click on any category to explore topics, study resources, and practice questions.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {hubData.categories.map((cat, i) => {
              const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
              return (
                <LocaleLink key={cat.slug} href={`/${cat.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-[#BFA6F6]/40 transition-all cursor-pointer group" data-testid={`card-category-${i}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#BFA6F6]/10 flex items-center justify-center shrink-0 group-hover:bg-[#BFA6F6]/20 transition-colors">
                          <Icon className="w-5 h-5 text-[#BFA6F6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#2E3A59] group-hover:text-[#BFA6F6] transition-colors">
                              {cat.name}
                            </h3>
                            <Badge className="bg-[#BFA6F6]/10 text-[#BFA6F6] border-0 text-xs shrink-0">
                              {cat.weight}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
                          <p className="text-xs text-[#BFA6F6] font-medium mt-2 group-hover:underline">{t("pages.examBlueprintHub.browseQuestionsStudyResources")}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#BFA6F6] transition-colors shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </LocaleLink>
              );
            })}
          </div>
        </section>

        <section data-testid="section-study-strategies">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examBlueprintHub.studyStrategies")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {hubData.studyStrategies.map((strategy, i) => (
              <Card key={i} data-testid={`card-strategy-${i}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-[#2E3A59] mb-2">{strategy.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{strategy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#BFA6F6]/10 to-[#BFA6F6]/5 border border-[#BFA6F6]/20 rounded-2xl p-8 text-center" data-testid="section-blueprint-cta">
          <h2 className="text-2xl font-bold text-[#2E3A59] mb-3">Start Your {hubData.examName} Preparation</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Access practice questions, mock exams, flashcards, and study materials aligned to the {hubData.examName} blueprint on NurseNest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LocaleLink
              href="/mock-exams"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#BFA6F6] text-white rounded-lg font-semibold hover:bg-[#a88de8] transition-colors"
              data-testid="link-blueprint-start-exam"
            >
              Start Practice Exam
              <ArrowRight className="w-4 h-4" />
            </LocaleLink>
            <LocaleLink
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2E3A59] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              data-testid="link-blueprint-view-plans"
            >
              View Plans
            </LocaleLink>
          </div>
        </section>

        <section data-testid="section-blueprint-faq">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2E3A59]">{t("pages.examBlueprintHub.frequentlyAskedQuestions")}</h2>
          </div>
          <FAQAccordion faqItems={hubData.faqItems} prefix="blueprint" />
        </section>

        <EndOfContentLeadCapture context={`${hubData.examName} exam blueprint`} />
      </div>

      <Footer />
    </div>
  );
}

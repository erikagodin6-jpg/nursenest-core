import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import {
  getTopicClusterBySlug,
  getRelatedTopicClusters,
  TOPIC_CLUSTERS,
  type TopicCluster,
} from "@shared/topic-cluster-data";
import { findPrimaryHubForTopic } from "@shared/category-hub-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { AutoRelatedContent } from "@/components/auto-related-content";
import {
  BookOpen, ChevronDown, ArrowRight, HelpCircle,
  Stethoscope, Activity, FileText, Brain, Pill,
  Target, Heart, Layers, ClipboardList,
  AlertTriangle, Star, Shield, GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
function TopicTableOfContents({ topic }: { topic: TopicCluster }) {
  const { t } = useI18n();
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "clinical-explanation", title: "Clinical Explanation" },
    { id: "nursing-interventions", title: "Key Nursing Interventions" },
    { id: "medications", title: "Related Medications" },
    { id: "practice-questions", title: "Practice Questions" },
    { id: "related-resources", title: "Lessons & Flashcards" },
    { id: "related-topics", title: "Related Topics" },
    { id: "faq", title: "Frequently Asked Questions" },
  ];

  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-topic-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color: topic.color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {sections.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
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

function SectionHeading({ id, title, icon: Icon, color }: { id: string; title: string; icon: any; color: string }) {
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 scroll-mt-24" data-testid={`heading-${id}`}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {title}
    </h2>
  );
}

function TopicCtaBanner({ variant, color, previewSlugs }: { variant: "questions" | "flashcards" | "lessons"; color: string; previewSlugs?: string[] }) {
  const configs = {
    questions: {
      title: "Start Practice Questions",
      description: "Test your knowledge with exam-style questions and detailed clinical rationales.",
      buttonText: "Start Practice Questions",
      href: previewSlugs?.length ? `/questions/${previewSlugs[0]}` : "/practice-questions",
    },
    flashcards: {
      title: "Explore Flashcards",
      description: "Reinforce your learning with spaced-repetition flashcards.",
      buttonText: "Explore Flashcards",
      href: "/flashcards",
    },
    lessons: {
      title: "View Clinical Lessons",
      description: "Deepen your understanding with comprehensive pathophysiology lessons.",
      buttonText: "View Clinical Lessons",
      href: "/lessons",
    },
  };
  const config = configs[variant];

  return (
    <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${color}10`, borderLeft: `4px solid ${color}` }} data-testid={`cta-${variant}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{config.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{config.description}</p>
      <LocaleLink href={config.href}>
        <Button className="text-white" style={{ backgroundColor: color }} data-testid={`button-cta-${variant}`}>
          {config.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </LocaleLink>
    </div>
  );
}

const PRIORITY_STYLES = {
  high: { label: "High Priority", color: "#DC2626", bg: "#FEE2E2" },
  medium: { label: "Medium Priority", color: "#D97706", bg: "#FEF3C7" },
  standard: { label: "Standard", color: "#059669", bg: "#D1FAE5" },
};

function buildBreadcrumbsForTopic(topic: TopicCluster) {
  const parentHub = findPrimaryHubForTopic(topic.slug, topic.parentCategorySlug);
  if (parentHub) {
    return [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Topics", url: "https://www.nursenest.ca/topics" },
      { name: parentHub.title, url: `https://www.nursenest.ca/${parentHub.slug}` },
      { name: topic.title, url: `https://www.nursenest.ca/${topic.slug}` },
    ];
  }
  return [
    { name: "Home", url: "https://www.nursenest.ca" },
    { name: "Topics", url: "https://www.nursenest.ca/topics" },
    { name: topic.category, url: `https://www.nursenest.ca/study-guide/${topic.parentCategorySlug}` },
    { name: topic.title, url: `https://www.nursenest.ca/${topic.slug}` },
  ];
}

function buildMedicalWebPageData(topic: TopicCluster) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": topic.title,
    "description": topic.metaDescription,
    "author": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": PARENT_EDUCATIONAL_ORG.name,
        "url": PARENT_EDUCATIONAL_ORG.url,
      },
    },
    "datePublished": "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/${topic.slug}`,
    },
    "medicalAudience": {
      "@type": "MedicalAudience",
      "audienceType": "Nurse",
    },
    "specialty": "Nursing",
  };
}

export default function TopicClusterPage() {
  const params = useParams<{ slug: string }>();
  const topic = getTopicClusterBySlug(params.slug || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-topic-not-found">{t("pages.topicClusterPage.topicNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.topicClusterPage.theClinicalTopicYouAre")}</p>
          <LocaleLink href="/topics">
            <Button data-testid="button-back-to-topics">{t("pages.topicClusterPage.browseAllTopics")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedTopics = getRelatedTopicClusters(topic.relatedTopicSlugs);
  const parentHub = findPrimaryHubForTopic(topic.slug, topic.parentCategorySlug);

  const faqStructuredData = buildFaqStructuredData(
    topic.faqs.map(f => ({ question: f.question, answer: f.answer }))
  );

  const medicalWebPageData = buildMedicalWebPageData(topic);
  const breadcrumbItems = buildBreadcrumbsForTopic(topic);

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`topic-cluster-${topic.slug}`}>
      <Navigation />
      <SEO
        title={topic.metaTitle}
        description={topic.metaDescription}
        keywords={topic.keywords}
        canonicalPath={`/${topic.slug}`}
        structuredData={medicalWebPageData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${topic.colorAccent}60, white, ${topic.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: topic.color }} data-testid="badge-topic-category">
              <Stethoscope className="w-3 h-3 mr-1" /> {topic.category}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-topic-title">
              {topic.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-topic-description">
              {topic.metaDescription}
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="outline" className="text-xs border-gray-300">
                <ClipboardList className="w-3 h-3 mr-1" /> Nursing Interventions
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <Pill className="w-3 h-3 mr-1" /> Medications
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <FileText className="w-3 h-3 mr-1" /> Practice Questions
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-300">
                <HelpCircle className="w-3 h-3 mr-1" /> FAQ
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TopicTableOfContents topic={topic} />
          </div>

          <div className="flex-1 min-w-0">
            {parentHub && (
              <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3" data-testid="link-back-to-hub">
                <ArrowRight className="w-4 h-4 text-blue-600 rotate-180 shrink-0" />
                <p className="text-sm text-blue-800">
                  This topic is part of our{" "}
                  <LocaleLink href={`/${parentHub.slug}`} className="font-semibold text-blue-700 underline hover:text-blue-900" data-testid="link-parent-hub">
                    {parentHub.title}
                  </LocaleLink>
                  {" "}hub.
                </p>
              </div>
            )}

            <section id="introduction" className="mb-12 scroll-mt-24" data-testid="section-introduction">
              <p className="text-gray-700 leading-relaxed text-base">{topic.introduction}</p>
            </section>

            <section id="clinical-explanation" className="mb-12 scroll-mt-24" data-testid="section-clinical-explanation">
              <SectionHeading id="clinical-explanation-heading" title={t("pages.topicClusterPage.clinicalExplanation")} icon={Brain} color={topic.color} />
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{topic.clinicalExplanation}</p>
              </div>
            </section>

            <TopicCtaBanner variant="questions" color={topic.color} previewSlugs={topic.previewQuestionsSlugs} />

            <section id="nursing-interventions" className="mb-12 scroll-mt-24" data-testid="section-nursing-interventions">
              <SectionHeading id="interventions-heading" title={t("pages.topicClusterPage.keyNursingInterventions")} icon={Activity} color={topic.color} />
              <div className="space-y-4">
                {topic.nursingInterventions.map((intervention, i) => {
                  const priorityStyle = PRIORITY_STYLES[intervention.priority];
                  return (
                    <Card key={i} className="overflow-hidden" data-testid={`card-intervention-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0" style={{ backgroundColor: topic.color }}>
                              {i + 1}
                            </span>
                            {intervention.title}
                          </h3>
                          <Badge
                            className="text-xs shrink-0"
                            style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color, borderColor: priorityStyle.color }}
                            variant="outline"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {priorityStyle.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ml-9">{intervention.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section id="medications" className="mb-12 scroll-mt-24" data-testid="section-medications">
              <SectionHeading id="medications-heading" title={t("pages.topicClusterPage.relatedMedications")} icon={Pill} color={topic.color} />
              <div className="space-y-4">
                {topic.medications.map((med, i) => (
                  <Card key={i} data-testid={`card-medication-${i}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-gray-900">{med.drugClass}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">{med.examples.split(",").length} drugs</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2"><span className="font-medium text-gray-700">{t("pages.topicClusterPage.examples")}</span> {med.examples}</p>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <p className="text-sm text-amber-800"><span className="font-semibold">{t("pages.topicClusterPage.nursingConsiderations")}</span> {med.nursingConsiderations}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <TopicCtaBanner variant="flashcards" color={topic.color} />

            <section id="practice-questions" className="mb-12 scroll-mt-24" data-testid="section-practice-questions">
              <SectionHeading id="practice-heading" title={t("pages.topicClusterPage.practiceQuestions")} icon={FileText} color={topic.color} />
              <p className="text-sm text-gray-600 mb-4">
                Test your knowledge of {topic.title.toLowerCase()} with targeted practice questions featuring detailed clinical rationales.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {topic.previewQuestionsSlugs.map((slug, i) => (
                  <LocaleLink key={i} href={`/questions/${slug}`}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-preview-question-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${topic.color}15` }}>
                          <FileText className="w-4 h-4" style={{ color: topic.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize">
                            {slug.replace(/-/g, " ")} Questions
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="related-resources" className="mb-12 scroll-mt-24" data-testid="section-related-resources">
              <SectionHeading id="resources-heading" title={t("pages.topicClusterPage.lessonsFlashcards")} icon={GraduationCap} color={topic.color} />
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: topic.color }} /> Related Lessons
                  </h3>
                  <div className="space-y-2">
                    {topic.relatedLessonSlugs.map((slug, i) => (
                      <LocaleLink key={i} href={`/lessons/${slug}`}>
                        <Card className="hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-lesson-${i}`}>
                          <CardContent className="p-3 flex items-center gap-3">
                            <BookOpen className="w-4 h-4 shrink-0" style={{ color: topic.color }} />
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize flex-1">
                              {slug.replace(/-/g, " ")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                          </CardContent>
                        </Card>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" style={{ color: topic.color }} /> Related Flashcards
                  </h3>
                  <div className="space-y-2">
                    {topic.relatedFlashcardSlugs.map((slug, i) => (
                      <LocaleLink key={i} href={`/flashcards/deck/${slug}`}>
                        <Card className="hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-flashcard-${i}`}>
                          <CardContent className="p-3 flex items-center gap-3">
                            <Layers className="w-4 h-4 shrink-0" style={{ color: topic.color }} />
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize flex-1">
                              {slug.replace(/-/g, " ")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                          </CardContent>
                        </Card>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <TopicCtaBanner variant="lessons" color={topic.color} />

            <section id="related-topics" className="mb-12 scroll-mt-24" data-testid="section-related-topics">
              <SectionHeading id="related-heading" title={t("pages.topicClusterPage.relatedClinicalTopics")} icon={Target} color={topic.color} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTopics.map((related) => (
                  <LocaleLink key={related.slug} href={`/${related.slug}`}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-related-topic-${related.slug}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: related.color }} />
                          <Badge variant="outline" className="text-[10px]">{related.category}</Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                          {related.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.metaDescription}</p>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <SectionHeading id="faq-heading" title={t("pages.topicClusterPage.frequentlyAskedQuestions")} icon={HelpCircle} color={topic.color} />
              <div className="space-y-3">
                {topic.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    data-testid={`faq-item-${i}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <MedicalReviewBadge />
              <MedicalReferences lessonId={topic.slug} />
            </div>

            <MedicalReviewJsonLd
              title={topic.title}
              slug={topic.slug}
              description={topic.metaDescription}
              pageUrl={`https://www.nursenest.ca/${topic.slug}`}
            />

            <div className="mb-12">
              <EndOfContentLeadCapture leadMagnetType="study_guide" source="topic_cluster" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function TopicClusterBySlug({ slug }: { slug: string }) {
  const topic = getTopicClusterBySlug(slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!topic) return null;

  const relatedTopics = getRelatedTopicClusters(topic.relatedTopicSlugs);
  const parentHub = findPrimaryHubForTopic(topic.slug, topic.parentCategorySlug);

  const faqStructuredData = buildFaqStructuredData(
    topic.faqs.map(f => ({ question: f.question, answer: f.answer }))
  );

  const medicalWebPageData = buildMedicalWebPageData(topic);
  const breadcrumbItems = buildBreadcrumbsForTopic(topic);

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`topic-cluster-${topic.slug}`}>
      <Navigation />
      <SEO
        title={topic.metaTitle}
        description={topic.metaDescription}
        keywords={topic.keywords}
        canonicalPath={`/${topic.slug}`}
        structuredData={medicalWebPageData}
        additionalStructuredData={[faqStructuredData]}
        breadcrumbs={breadcrumbItems}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${topic.colorAccent}60, white, ${topic.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: topic.color }} data-testid="badge-topic-category">
              <Stethoscope className="w-3 h-3 mr-1" /> {topic.category}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-topic-title">
              {topic.title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-topic-description">
              {topic.metaDescription}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TopicTableOfContents topic={topic} />
          </div>

          <div className="flex-1 min-w-0">
            {parentHub && (
              <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center gap-3" data-testid="link-back-to-hub">
                <ArrowRight className="w-4 h-4 text-blue-600 rotate-180 shrink-0" />
                <p className="text-sm text-blue-800">
                  This topic is part of our{" "}
                  <LocaleLink href={`/${parentHub.slug}`} className="font-semibold text-blue-700 underline hover:text-blue-900" data-testid="link-parent-hub">
                    {parentHub.title}
                  </LocaleLink>
                  {" "}hub.
                </p>
              </div>
            )}

            <section id="introduction" className="mb-12 scroll-mt-24" data-testid="section-introduction">
              <p className="text-gray-700 leading-relaxed text-base">{topic.introduction}</p>
            </section>

            <section id="clinical-explanation" className="mb-12 scroll-mt-24" data-testid="section-clinical-explanation">
              <SectionHeading id="clinical-explanation-heading" title={t("pages.topicClusterPage.clinicalExplanation2")} icon={Brain} color={topic.color} />
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{topic.clinicalExplanation}</p>
              </div>
            </section>

            <TopicCtaBanner variant="questions" color={topic.color} previewSlugs={topic.previewQuestionsSlugs} />

            <section id="nursing-interventions" className="mb-12 scroll-mt-24" data-testid="section-nursing-interventions">
              <SectionHeading id="interventions-heading" title={t("pages.topicClusterPage.keyNursingInterventions2")} icon={Activity} color={topic.color} />
              <div className="space-y-4">
                {topic.nursingInterventions.map((intervention, i) => {
                  const priorityStyle = PRIORITY_STYLES[intervention.priority];
                  return (
                    <Card key={i} className="overflow-hidden" data-testid={`card-intervention-${i}`}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shrink-0" style={{ backgroundColor: topic.color }}>
                              {i + 1}
                            </span>
                            {intervention.title}
                          </h3>
                          <Badge
                            className="text-xs shrink-0"
                            style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.color, borderColor: priorityStyle.color }}
                            variant="outline"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {priorityStyle.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 ml-9">{intervention.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section id="medications" className="mb-12 scroll-mt-24" data-testid="section-medications">
              <SectionHeading id="medications-heading" title={t("pages.topicClusterPage.relatedMedications2")} icon={Pill} color={topic.color} />
              <div className="space-y-4">
                {topic.medications.map((med, i) => (
                  <Card key={i} data-testid={`card-medication-${i}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-gray-900">{med.drugClass}</h3>
                        <Badge variant="outline" className="text-xs shrink-0">{med.examples.split(",").length} drugs</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2"><span className="font-medium text-gray-700">{t("pages.topicClusterPage.examples2")}</span> {med.examples}</p>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                        <p className="text-sm text-amber-800"><span className="font-semibold">{t("pages.topicClusterPage.nursingConsiderations2")}</span> {med.nursingConsiderations}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <TopicCtaBanner variant="flashcards" color={topic.color} />

            <section id="practice-questions" className="mb-12 scroll-mt-24" data-testid="section-practice-questions">
              <SectionHeading id="practice-heading" title={t("pages.topicClusterPage.practiceQuestions2")} icon={FileText} color={topic.color} />
              <p className="text-sm text-gray-600 mb-4">
                Test your knowledge of {topic.title.toLowerCase()} with targeted practice questions featuring detailed clinical rationales.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {topic.previewQuestionsSlugs.map((slug, i) => (
                  <LocaleLink key={i} href={`/questions/${slug}`}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-preview-question-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${topic.color}15` }}>
                          <FileText className="w-4 h-4" style={{ color: topic.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize">
                            {slug.replace(/-/g, " ")} Questions
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="related-resources" className="mb-12 scroll-mt-24" data-testid="section-related-resources">
              <SectionHeading id="resources-heading" title={t("pages.topicClusterPage.lessonsFlashcards2")} icon={GraduationCap} color={topic.color} />
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: topic.color }} /> Related Lessons
                  </h3>
                  <div className="space-y-2">
                    {topic.relatedLessonSlugs.map((slug, i) => (
                      <LocaleLink key={i} href={`/lessons/${slug}`}>
                        <Card className="hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-lesson-${i}`}>
                          <CardContent className="p-3 flex items-center gap-3">
                            <BookOpen className="w-4 h-4 shrink-0" style={{ color: topic.color }} />
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize flex-1">
                              {slug.replace(/-/g, " ")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                          </CardContent>
                        </Card>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" style={{ color: topic.color }} /> Related Flashcards
                  </h3>
                  <div className="space-y-2">
                    {topic.relatedFlashcardSlugs.map((slug, i) => (
                      <LocaleLink key={i} href={`/flashcards/deck/${slug}`}>
                        <Card className="hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-flashcard-${i}`}>
                          <CardContent className="p-3 flex items-center gap-3">
                            <Layers className="w-4 h-4 shrink-0" style={{ color: topic.color }} />
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors capitalize flex-1">
                              {slug.replace(/-/g, " ")}
                            </p>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                          </CardContent>
                        </Card>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <TopicCtaBanner variant="lessons" color={topic.color} />

            <section id="related-topics" className="mb-12 scroll-mt-24" data-testid="section-related-topics">
              <SectionHeading id="related-heading" title={t("pages.topicClusterPage.relatedClinicalTopics2")} icon={Target} color={topic.color} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTopics.map((related) => (
                  <LocaleLink key={related.slug} href={`/${related.slug}`}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-related-topic-${related.slug}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: related.color }} />
                          <Badge variant="outline" className="text-[10px]">{related.category}</Badge>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                          {related.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.metaDescription}</p>
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <SectionHeading id="faq-heading" title={t("pages.topicClusterPage.frequentlyAskedQuestions2")} icon={HelpCircle} color={topic.color} />
              <div className="space-y-3">
                {topic.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    data-testid={`faq-item-${i}`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              <MedicalReviewBadge />
              <MedicalReferences lessonId={topic.slug} />
            </div>

            <MedicalReviewJsonLd
              title={topic.title}
              slug={topic.slug}
              description={topic.metaDescription}
              pageUrl={`https://www.nursenest.ca/${topic.slug}`}
            />

            <div className="mb-12">
              <EndOfContentLeadCapture leadMagnetType="study_guide" source="topic_cluster" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

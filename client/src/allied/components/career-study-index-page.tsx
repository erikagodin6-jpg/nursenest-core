import { Link } from "wouter";
import { useState } from "react";
import {
  BookOpen, Clock, BarChart3, Star, Zap,
  ArrowRight, Brain, Target, GraduationCap, Lightbulb
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import type { ProfessionHubData } from "@/allied/data/profession-hub-data";
import type { StudyTopicCard } from "@/allied/data/imaging-career-data";

import { useI18n } from "@/lib/i18n";
interface CareerStudyIndexPageProps {
  hubData: ProfessionHubData;
  studyTopics: StudyTopicCard[];
  featuredTopics: string[];
  mostTestedConcepts: string[];
  studyTips: string[];
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "bg-green-50", text: "text-green-700" },
  Intermediate: { bg: "bg-amber-50", text: "text-amber-700" },
  Advanced: { bg: "bg-red-50", text: "text-red-700" },
};

export default function CareerStudyIndexPage({ hubData, studyTopics, featuredTopics, mostTestedConcepts, studyTips }: CareerStudyIndexPageProps) {
  const { t } = useI18n();
  const basePath = `/allied-health/${hubData.professionSlug}`;
  const featured = studyTopics.filter(t => featuredTopics.includes(t.slug));
  const allTopics = studyTopics;

  const seoTitle = `${hubData.shortName} Study Topics — ${hubData.name} Exam Prep | NurseNest Allied`;
  const seoDescription = `Browse ${studyTopics.length}+ study topics for ${hubData.shortName} certification exam prep. Organized by domain with difficulty levels and time estimates.`;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": hubData.shortName, "item": `https://www.nursenest.ca${basePath}` },
      { "@type": "ListItem", "position": 4, "name": "Study Topics", "item": `https://www.nursenest.ca${basePath}/study` },
    ],
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${hubData.name} Study Topics`,
    "description": seoDescription,
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest Allied" },
    "courseMode": "online",
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (hubData.faqs || []).slice(0, 3).map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  return (
    <div data-testid={`study-index-${hubData.professionSlug}`}>
      <AlliedSEO
        title={seoTitle}
        description={seoDescription}
        keywords={hubData.seo.keywords}
        canonicalPath={`${basePath}/study`}
        structuredData={courseStructuredData}
        additionalStructuredData={[breadcrumbStructuredData, faqStructuredData]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-study-title">
            {hubData.shortName} Study Topics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-6">
            Organized study materials covering all {hubData.shortName} certification exam domains. Each topic includes key concepts, practice questions, and clinical applications.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={`${basePath}/flashcards`} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="link-to-flashcards">
              <Brain className="w-4 h-4" /> Flashcards
            </Link>
            <Link href={`${basePath}/exams`} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50" data-testid="link-to-exams">
              <Target className="w-4 h-4" /> Practice Exams
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100" data-testid="section-featured-topics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: hubData.color }} /> Featured Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map(topic => (
                <TopicCard key={topic.slug} topic={topic} color={hubData.color} colorAccent={hubData.colorAccent} basePath={basePath} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-gray-50" data-testid="section-all-topics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Study Topics ({allTopics.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allTopics.map(topic => (
              <TopicCard key={topic.slug} topic={topic} color={hubData.color} colorAccent={hubData.colorAccent} basePath={basePath} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-most-tested">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: hubData.color }} /> Most-Tested Concepts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mostTestedConcepts.map((concept, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3" data-testid={`most-tested-${i}`}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: hubData.color }}>
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-gray-700">{concept}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-study-tips">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" style={{ color: hubData.color }} /> Study Tips
          </h2>
          <div className="space-y-3">
            {studyTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100" data-testid={`study-tip-${i}`}>
                <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: hubData.color }} />
                <span className="text-sm text-gray-700">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white" data-testid="section-study-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerStudyIndexPage.readyToStartStudying")}</h2>
          <p className="text-gray-600 mb-6">Pair these study topics with flashcards and practice exams for comprehensive {hubData.shortName} exam preparation.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`${basePath}/flashcards`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-cta-flashcards">
              Browse Flashcards <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={`${basePath}/exams`} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 border border-gray-200 text-gray-700" data-testid="button-cta-exams">
              Practice Exams
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TopicCard({ topic, color, colorAccent, basePath, featured }: { topic: StudyTopicCard; color: string; colorAccent: string; basePath: string; featured?: boolean }) {
  const diffColors = DIFFICULTY_COLORS[topic.difficulty] || DIFFICULTY_COLORS.Intermediate;

  return (
    <div
      className={`bg-white rounded-xl border ${featured ? "border-2" : "border-gray-100"} p-5 hover:shadow-md transition-all`}
      style={featured ? { borderColor: color } : undefined}
      data-testid={`card-topic-${topic.slug}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: colorAccent }}>
          <BookOpen className="w-4 h-4" style={{ color }} />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffColors.bg} ${diffColors.text}`}>
          {topic.difficulty}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-2">{topic.title}</h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{topic.description}</p>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.estimatedTime}</span>
        {topic.topicCount && <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {topic.topicCount} concepts</span>}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-medium">
          {topic.topicCount ? `${topic.topicCount} concepts` : topic.estimatedTime}
        </span>
      </div>
    </div>
  );
}

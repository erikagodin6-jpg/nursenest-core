import { Link } from "wouter";
import {
  BookOpen, Brain, FileText, GraduationCap, ChevronRight, Target, Zap,
  Hand, Home, Wrench, Search, Heart, Shield, Activity, Sparkles, Users,
  ArrowRight, Baby, Footprints, BarChart3 as BarChart, Layers, ClipboardList,
  Scissors, AlertTriangle, Wind, Thermometer, Settings, DollarSign, Globe,
  Scale, Code, Database, ShieldCheck
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { CAREER_SUBPAGE_DATA, type StudyTopic } from "@/allied/data/career-subpage-data";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  Target, Sparkles, Brain, Hand, Activity, BarChart, BookOpen, FileText,
  GraduationCap, Zap, Heart, Shield, Wrench, Home, Search, Users, Baby,
  Footprints, Layers, ClipboardList, Scissors, AlertTriangle, Wind,
  Thermometer, Settings, DollarSign, Globe, Scale, Code, Database, ShieldCheck,
  ArrowRight,
};

function getIcon(name: string) {

  return ICON_MAP[name] || BookOpen;
}

interface CareerStudyPageProps {
  careerSlug: string;
}

export default function CareerStudyPage({ careerSlug }: CareerStudyPageProps) {
  const subpageData = CAREER_SUBPAGE_DATA[careerSlug];
  const hubData = PROFESSION_HUB_DATA[careerSlug];
  if (!subpageData || !hubData) return null;

  const topics = subpageData.studyTopics;
  const basePath = `/allied-health/${careerSlug}`;

  return (
    <div data-testid={`career-study-page-${careerSlug}`}>
      <AlliedSEO
        title={`${hubData.shortName} Study Topics — ${hubData.name} Exam Prep | NurseNest Allied`}
        description={`Explore ${topics.length}+ study topics for the ${hubData.examInfo.examNames.join(", ")} ${hubData.shortName} certification exams. Organized by domain with detailed lessons and practice questions.`}
        keywords={`${hubData.shortName} study topics, ${hubData.shortName} exam topics, ${hubData.name} study guide, ${hubData.shortName} exam domains`}
        canonicalPath={`${basePath}/study`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: hubData.shortName, item: `https://www.nursenest.ca${basePath}` },
            { "@type": "ListItem", position: 3, name: "Study Topics", item: `https://www.nursenest.ca${basePath}/study` },
          ],
        }}
      />

      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50/30 py-12 sm:py-16" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/allied-health" className="hover:text-gray-700">{t("allied.careerStudyPage.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={basePath} className="hover:text-gray-700">{hubData.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: hubData.color }}>{t("allied.careerStudyPage.studyTopics")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
            {hubData.shortName} Study Topics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive study materials organized by exam domain. Each topic covers the concepts, skills, and clinical scenarios tested on the {hubData.examInfo.examNames.join(" and ")} exams.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic, i) => {
            const Icon = getIcon(topic.icon);
            return (
              <Link
                key={topic.slug}
                href={basePath}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                style={{ borderColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = hubData.color + "40")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                data-testid={`card-topic-${topic.slug}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: hubData.colorAccent }}>
                  <Icon className="w-5 h-5" style={{ color: hubData.color }} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{topic.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium mt-3 group-hover:gap-2 transition-all" style={{ color: hubData.color }}>
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerStudyPage.readyToStartStudying")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.careerStudyPage.takeAFreeDiagnosticTo")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`/diagnostic?career=${hubData.careerSlug}`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-cta-diagnostic">
              Start Free Diagnostic <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={basePath} className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-semibold hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700" data-testid="button-back-to-hub">
              Back to {hubData.shortName} Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { getTopicBySlug, BODY_SYSTEM_ICONS, isConditionTopic } from "@/data/topics";
import { slugToDisplayName } from "@/lib/canonical-display";
import type { Topic, TopicResource } from "@/data/topics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft, BookOpen, HelpCircle, Layers, Briefcase, GraduationCap,
  Heart, Wind, Brain, Droplets, Zap, Activity, Baby, Eye, Pill, ClipboardList,
  Users, ChevronRight, ExternalLink, Stethoscope
} from "lucide-react";

const iconMap: Record<string, any> = {
  Heart, Wind, Brain, Droplets, Zap, Activity, Baby, Eye, Pill, ClipboardList,
};

function getBodySystemIcon(system: string) {

  const iconName = BODY_SYSTEM_ICONS[system];
  return iconMap[iconName] || Activity;
}

const systemColorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  "Cardiovascular": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", badge: "bg-red-100 text-red-800" },
  "Respiratory": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", badge: "bg-sky-100 text-sky-800" },
  "Neurological": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-800" },
  "Renal": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
  "Endocrine": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
  "Gastrointestinal": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", badge: "bg-green-100 text-green-800" },
  "Hematology": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", badge: "bg-rose-100 text-rose-800" },
  "Maternity": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", badge: "bg-pink-100 text-pink-800" },
  "Mental Health": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-800" },
  "Musculoskeletal": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-800" },
  "Integumentary": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", badge: "bg-teal-100 text-teal-800" },
  "Pharmacology": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-800" },
  "Pediatrics": { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200", badge: "bg-fuchsia-100 text-fuchsia-800" },
  "Emergency": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", badge: "bg-red-100 text-red-800" },
  "Fundamentals": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", badge: "bg-slate-100 text-slate-800" },
  "General": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", badge: "bg-gray-100 text-gray-800" },
};

function getColors(system: string) {
  return systemColorMap[system] || systemColorMap["Fundamentals"];
}

function ResourceCard({ resource, icon: Icon }: { resource: TopicResource; icon: any }) {
  return (
    <LocaleLink href={resource.url}>
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-resource-${resource.slug}`}>
        <div className="mt-0.5 shrink-0">
          <Icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">{resource.title}</p>
          {resource.description && (
            <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
      </div>
    </LocaleLink>
  );
}

function ResourceSection({ title, resources, icon: Icon, emptyMessage }: {
  title: string;
  resources: TopicResource[];
  icon: any;
  emptyMessage?: string;
}) {
  if (resources.length === 0 && !emptyMessage) return null;

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-gray-900" data-testid={`heading-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>{title}</h2>
        <span className="ml-auto text-xs text-gray-400 font-medium">{resources.length} {resources.length === 1 ? "resource" : "resources"}</span>
      </div>
      <CardContent className="p-2">
        {resources.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {resources.map((resource, i) => (
              <ResourceCard key={`${resource.slug}-${i}`} resource={resource} icon={Icon} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 p-3">{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}

function buildTopicStructuredData(topic: Topic) {
  const base = "https://www.nursenest.ca";
  const hasPart = topic.relatedLessons.map((lesson) => ({
    "@type": "LearningResource",
    "name": lesson.title,
    "url": `${base}${lesson.url}`,
  }));

  if (isConditionTopic(topic.slug)) {
    return {
      "@context": "https://schema.org",
      "@type": "MedicalCondition",
      "name": topic.name,
      "description": topic.description,
      "url": `${base}/topics/${topic.slug}`,
      "associatedAnatomy": {
        "@type": "AnatomicalStructure",
        "name": topic.bodySystem,
      },
      "subjectOf": hasPart.slice(0, 20),
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": topic.name,
    "description": topic.description,
    "url": `${base}/topics/${topic.slug}`,
    "about": {
      "@type": "MedicalEntity",
      "name": topic.bodySystem,
    },
    "mainEntity": hasPart.slice(0, 20),
  };
}

function buildEducationalStructuredData(topic: Topic) {
  const base = "https://www.nursenest.ca";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${topic.name} - Complete Study Resources`,
    "description": topic.description,
    "url": `${base}/topics/${topic.slug}`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": base,
    },
    "courseMode": "online",
    "isAccessibleForFree": true,
    "numberOfCredits": topic.relatedLessons.length,
    "hasPart": topic.relatedLessons.slice(0, 10).map((l) => ({
      "@type": "LearningResource",
      "name": l.title,
      "url": `${base}${l.url}`,
    })),
  };
}

function TopicDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const topic = slug ? getTopicBySlug(slug) : undefined;

  if (!topic) {
    return (
      <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-topic-not-found">{t("pages.topicDetail.topicNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.topicDetail.theTopicYoureLookingFor")}</p>
          <LocaleLink href="/topics">
            <Button data-testid="link-back-topics">{t("pages.topicDetail.browseAllTopics")}</Button>
          </LocaleLink>
        </main>
        <Footer />
      </div>
    );
  }

  const colors = getColors(topic.bodySystem);
  const SystemIcon = getBodySystemIcon(topic.bodySystem);
  const structuredData = buildTopicStructuredData(topic);
  const educationalData = buildEducationalStructuredData(topic);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <SEO
        title={`${topic.name} - Clinical Topic Resources | NurseNest`}
        description={`Explore all ${topic.name} resources: lessons, practice questions, flashcards, new grad tips, and career paths. Cross-platform clinical study hub.`}
        keywords={`${topic.name}, nursing ${topic.name}, ${topic.bodySystem}, NCLEX ${topic.name}, clinical nursing`}
        canonicalPath={`/topics/${topic.slug}`}
        structuredData={structuredData}
        additionalStructuredData={[educationalData]}
      />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full" data-testid="topic-detail-page">
        <LocaleLink href="/topics">
          <Button variant="ghost" className="mb-6 group" data-testid="link-back-topics">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            All Topics
          </Button>
        </LocaleLink>

        <div className={`rounded-2xl ${colors.bg} ${colors.border} border p-6 md:p-8 mb-8`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${colors.badge} flex items-center justify-center shrink-0`}>
              <SystemIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`} data-testid="badge-body-system">
                  {topic.bodySystem}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2" data-testid="text-topic-name">{topic.name}</h1>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl" data-testid="text-topic-description">{topic.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" />{topic.relatedLessons.length} Lessons</span>
                <span className="flex items-center gap-1"><HelpCircle className="w-4 h-4" />{topic.practiceQuestions.length} Question Sets</span>
                <span className="flex items-center gap-1"><Layers className="w-4 h-4" />{topic.flashcardTopics.length} Flashcard Topics</span>
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{topic.careerPaths.length} Career Paths</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ResourceSection
            title={t("pages.topicDetail.relatedLessons")}
            resources={topic.relatedLessons}
            icon={BookOpen}
          />
          <ResourceSection
            title={t("pages.topicDetail.practiceQuestions")}
            resources={topic.practiceQuestions}
            icon={HelpCircle}
          />
          <ResourceSection
            title={t("pages.topicDetail.flashcardTopics")}
            resources={topic.flashcardTopics}
            icon={Layers}
          />
          <ResourceSection
            title={t("pages.topicDetail.newGradClinicalTips")}
            resources={topic.newGradTips}
            icon={GraduationCap}
            emptyMessage="No specific new grad tips for this topic yet."
          />
        </div>

        {topic.crossProfessionPerspectives.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" data-testid="heading-cross-profession">
              <Users className="w-5 h-5 text-primary" />
              Cross-Profession Perspectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.crossProfessionPerspectives.map((perspective) => (
                <Card key={perspective.professionSlug} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-gray-900" data-testid={`text-perspective-${perspective.professionSlug}`}>{perspective.profession}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{perspective.approach}</p>
                    {perspective.lessonSlugs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {perspective.lessonSlugs.slice(0, 3).map((lessonSlug) => (
                          <LocaleLink key={lessonSlug} href={`/lessons/${lessonSlug}`}>
                            <span className="inline-flex items-center text-xs px-2 py-1 bg-gray-100 hover:bg-primary/10 hover:text-primary rounded-full transition-colors cursor-pointer" data-testid={`link-perspective-lesson-${lessonSlug}`}>
                              {slugToDisplayName(lessonSlug).slice(0, 30)}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </span>
                          </LocaleLink>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <ResourceSection
          title={t("pages.topicDetail.relatedCareerPaths")}
          resources={topic.careerPaths}
          icon={Briefcase}
        />

        {topic.relatedTopicSlugs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4" data-testid="heading-related-topics">{t("pages.topicDetail.relatedTopics")}</h2>
            <div className="flex flex-wrap gap-2">
              {topic.relatedTopicSlugs.map((relatedSlug) => {
                const displayName = relatedSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <LocaleLink key={relatedSlug} href={`/topics/${relatedSlug}`}>
                    <span className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors cursor-pointer" data-testid={`link-related-topic-${relatedSlug}`}>
                      {displayName}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </LocaleLink>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TopicDetailContent;

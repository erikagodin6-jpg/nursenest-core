import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { getTopicsByBodySystem, BODY_SYSTEM_ORDER, BODY_SYSTEM_ICONS } from "@/data/topics";
import type { Topic } from "@/data/topics";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  Search, BookOpen, ChevronRight,
  Heart, Wind, Brain, Droplets, Zap, Activity, Baby, Eye, Pill, ClipboardList,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Heart, Wind, Brain, Droplets, Zap, Activity, Baby, Eye, Pill, ClipboardList,
};

function getIcon(system: string) {

  const iconName = BODY_SYSTEM_ICONS[system];
  return iconMap[iconName] || Activity;
}

const systemColorMap: Record<string, string> = {
  "Cardiovascular": "bg-red-100 text-red-800",
  "Respiratory": "bg-sky-100 text-sky-800",
  "Neurological": "bg-purple-100 text-purple-800",
  "Renal": "bg-blue-100 text-blue-800",
  "Endocrine": "bg-amber-100 text-amber-800",
  "Gastrointestinal": "bg-green-100 text-green-800",
  "Hematology": "bg-rose-100 text-rose-800",
  "Maternity": "bg-pink-100 text-pink-800",
  "Mental Health": "bg-indigo-100 text-indigo-800",
  "Pediatrics": "bg-fuchsia-100 text-fuchsia-800",
  "Emergency": "bg-red-100 text-red-800",
  "Musculoskeletal": "bg-orange-100 text-orange-800",
  "Integumentary": "bg-teal-100 text-teal-800",
  "Pharmacology": "bg-emerald-100 text-emerald-800",
  "Fundamentals": "bg-slate-100 text-slate-800",
  "General": "bg-gray-100 text-gray-800",
};

function TopicCard({ topic }: { topic: Topic }) {
  const totalResources = topic.relatedLessons.length + topic.practiceQuestions.length + topic.flashcardTopics.length;
  return (
    <LocaleLink href={`/topics/${topic.slug}`}>
      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer" data-testid={`link-topic-${topic.slug}`}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors truncate">{topic.name}</p>
            <p className="text-xs text-gray-400">{totalResources} resources</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
      </div>
    </LocaleLink>
  );
}

function buildTopicIndexStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Clinical Topics - Knowledge Graph",
    "description": "Browse all clinical nursing topics organized by body system. Each topic connects lessons, practice questions, flashcards, new grad tips, and career paths.",
    "url": "https://www.nursenest.ca/topics",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
  };
}

function TopicsIndex() {
  const [search, setSearch] = useState("");
  const grouped = useMemo(() => getTopicsByBodySystem(), []);

  const filteredGrouped = useMemo(() => {
    if (!search.trim()) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, Topic[]> = {};
    for (const [system, topics] of Object.entries(grouped)) {
      const filtered = topics.filter(
        (t) => t.name.toLowerCase().includes(q) || t.bodySystem.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
      );
      if (filtered.length > 0) result[system] = filtered;
    }
    return result;
  }, [search, grouped]);

  const totalTopics = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  const totalSystems = BODY_SYSTEM_ORDER.filter((s) => grouped[s]?.length).length;

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans text-gray-900">
      <Navigation />
      <SEO
        title={t("pages.topics.clinicalTopicsKnowledgeGraphNursenest")}
        description={`Browse ${totalTopics} clinical nursing topics organized by body system. Each topic connects lessons, practice questions, flashcards, and career paths across the NurseNest platform.`}
        keywords="nursing topics, clinical nursing, body systems, NCLEX topics, nursing knowledge graph, pathophysiology topics"
        canonicalPath="/topics"
        structuredData={buildTopicIndexStructuredData()}
      />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full" data-testid="topics-index-page">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" data-testid="text-topics-heading">{t("pages.topics.clinicalTopics")}</h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            Explore {totalTopics} clinical topics across {totalSystems} body systems. Each topic connects you to lessons, practice questions, flashcards, and career resources.
          </p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("pages.topics.searchTopics")}
            className="pl-10"
            data-testid="input-search-topics"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BODY_SYSTEM_ORDER.filter((system) => filteredGrouped[system]?.length).map((system) => {
            const topics = filteredGrouped[system]!;
            const SystemIcon = getIcon(system);
            const badgeColor = systemColorMap[system] || "bg-gray-100 text-gray-800";

            return (
              <Card key={system} className="overflow-hidden" data-testid={`card-system-${system.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${badgeColor} flex items-center justify-center`}>
                    <SystemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{system}</h2>
                    <p className="text-xs text-gray-400">{topics.length} {topics.length === 1 ? "topic" : "topics"}</p>
                  </div>
                </div>
                <CardContent className="p-2">
                  <div className="divide-y divide-gray-50">
                    {topics.map((topic) => (
                      <TopicCard key={topic.slug} topic={topic} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {Object.keys(filteredGrouped).length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg" data-testid="text-no-results">No topics found matching "{search}"</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TopicsIndex;

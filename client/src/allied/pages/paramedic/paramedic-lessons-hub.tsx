import { useState, useMemo } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { HubHero, ContentCard, FilterChip, FinalCTASection } from "./components";
import { BookOpen, Search } from "lucide-react";
import { paramedicLessons } from "@/data/lessons/paramedic-lessons";

import { useI18n } from "@/lib/i18n";
const LESSON_ENTRIES = Object.entries(paramedicLessons).map(([slug, lesson]) => ({
  slug,
  title: lesson.title,
  description: lesson.cellular.substring(0, 200).replace(/\n/g, " ") + "...",
  topic: slug.replace(/-paramedic$/, "").replace(/-/g, " "),
}));

const TOPIC_FILTERS = ["All", "Trauma", "Cardiac", "Pharmacology", "Airway", "Pediatric", "Medical", "OB", "Operations"];

export default function ParamedicLessonsHub() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    return LESSON_ENTRIES.filter(l => {
      const matchesSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.topic.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === "All" || l.title.toLowerCase().includes(activeFilter.toLowerCase()) || l.topic.toLowerCase().includes(activeFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <div data-testid="paramedic-lessons-hub">
      <AlliedSEO
        title={t("allied.paramedicParamedicLessonsHub.paramedicLessonsClinicalStudyGuides")}
        description={t("allied.paramedicParamedicLessonsHub.indepthParamedicLessonsCoveringTrauma")}
        keywords="paramedic lessons, paramedic study guide, EMS clinical lessons, paramedic protocols, ACLS lessons, trauma assessment guide, paramedic education"
        canonicalPath="/allied-health/paramedic/lessons"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Paramedic Clinical Lessons",
          "description": "In-depth paramedic lessons covering trauma algorithms, ACLS pharmacology, airway management, pediatric emergencies, and field triage.",
          "provider": { "@type": "Organization", "name": "NurseNest Allied", "url": "https://www.nursenest.ca/allied-health" }
        }}
      />

      <HubHero
        title={t("allied.paramedicParamedicLessonsHub.paramedicLessons")}
        subtitle={t("allied.paramedic_lessons_hub.indepthClinicalStudyGuidesCovering")}
        breadcrumbs={[
          { label: "Paramedic", href: "/allied-health/paramedic" },
          { label: "Lessons" },
        ]}
      />

      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t("allied.paramedicParamedicLessonsHub.searchLessons")}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                data-testid="input-search-lessons"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {TOPIC_FILTERS.map(f => (
                <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">{filtered.length} Lessons Available</h2>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(lesson => (
                <ContentCard
                  key={lesson.slug}
                  title={lesson.title}
                  description={lesson.description}
                  href={`/allied-health/paramedic/study-plan`}
                  icon={BookOpen}
                  tags={[lesson.topic]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t("allied.paramedicParamedicLessonsHub.noLessonsMatchYourSearch")}</p>
            </div>
          )}
        </div>
      </section>

      <FinalCTASection
        title={t("allied.paramedicParamedicLessonsHub.wantFullAccessToAll")}
        subtitle="Pro members get unlimited access to every lesson, question, and study tool. Start with a free diagnostic to see where you stand."
        primaryCTA={{ label: "Start Free Diagnostic", href: "/diagnostic?career=paramedic" }}
        secondaryCTA={{ label: "View Pricing", href: "/allied-health/pricing" }}
      />
    </div>
  );
}

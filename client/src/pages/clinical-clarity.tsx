import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { EducationalIntegrity } from "@/components/educational-integrity";
import { ContextualRelatedResources } from "@/components/related-resources";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
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
  ArrowRight,
} from "lucide-react";
import { clinicalConfusions, confusionCategories, confusionBodySystems } from "@/data/clinical-confusions";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

import { useI18n } from "@/lib/i18n";
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

export default function ClinicalClarityIndex() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  const filteredConfusions = useMemo(() => {
    return clinicalConfusions.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || c.category === selectedCategory;
      const matchesSystem = !selectedSystem || c.bodySystem === selectedSystem;
      return matchesSearch && matchesCategory && matchesSystem;
    });
  }, [searchQuery, selectedCategory, selectedSystem]);

  return (
    <div className="min-h-screen bg-warmwhite flex flex-col font-sans">
      <SEO
        title={t("pages.clinicalClarity.clinicalClarityWhyDoesThis")}
        description={t("pages.clinicalClarity.expertMechanisticExplanationsForThe")}
        keywords="nursing pathophysiology explained, why does potassium affect heart, clinical reasoning nursing, mechanism nursing education, nursing student confusion, clinical clarity"
        canonicalPath="/clinical-clarity"
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Clinical Clarity - Mechanism-Driven Nursing Explanations",
          "description": "Expert answers to the most searched nursing pathophysiology questions, explained through cellular mechanisms and clinical reasoning.",
          "url": "https://www.nursenest.ca/clinical-clarity",
          "provider": {
            "@type": "Organization",
            "name": "NurseNest",
          },
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": clinicalConfusions.slice(0, 10).map((c) => ({
              "@type": "Question",
              "name": c.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": c.shortAnswer,
              },
            })),
          },
        ]}
      />
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900" data-testid="text-page-title">
                Clinical Clarity
              </h1>
              <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
                Mechanism-Driven Answers
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mt-4">
            The questions every nursing student asks: answered through cellular mechanisms, 
            not textbook definitions. Each explanation traces the physiological chain from 
            molecular disturbance to clinical consequence.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t("pages.clinicalClarity.searchQuestionsMechanismsOrKeywords")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 bg-white"
              data-testid="input-search-confusions"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null && selectedSystem === null ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => { setSelectedCategory(null); setSelectedSystem(null); }}
              data-testid="button-filter-all"
            >
              All Topics
            </Button>
            {confusionBodySystems.map((system) => {
              const Icon = systemIcons[system] || Brain;
              return (
                <Button
                  key={system}
                  variant={selectedSystem === system ? "default" : "outline"}
                  size="sm"
                  className="rounded-full text-xs gap-1.5"
                  onClick={() => { setSelectedSystem(selectedSystem === system ? null : system); setSelectedCategory(null); }}
                  data-testid={`button-filter-${system.toLowerCase()}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {system}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {confusionCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "ghost"}
                size="sm"
                className="rounded-full text-xs"
                onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setSelectedSystem(null); }}
                data-testid={`button-filter-cat-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-6" data-testid="text-result-count">
          {filteredConfusions.length} {filteredConfusions.length === 1 ? "topic" : "topics"}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredConfusions.map((confusion) => {
            const diff = difficultyColors[confusion.difficulty];
            const Icon = systemIcons[confusion.bodySystem] || Brain;
            return (
              <LocaleLink key={confusion.slug} href={`/clinical-clarity/${confusion.slug}`}>
                <Card
                  className="border border-gray-100 bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group h-full"
                  data-testid={`card-confusion-${confusion.slug}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary/70" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {confusion.bodySystem}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>
                        {diff.label}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors leading-snug">
                      {confusion.question}
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                      {confusion.shortAnswer}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                          {confusion.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 font-medium">
                          {confusion.misconceptions.length} misconceptions
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </LocaleLink>
            );
          })}
        </div>

        {filteredConfusions.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t("pages.clinicalClarity.noTopicsMatchYourSearch")}</p>
            <p className="text-gray-300 text-sm mt-1">{t("pages.clinicalClarity.tryAdjustingYourFiltersOr")}</p>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-primary/5 to-accent-foreground/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Deeper Clinical Reasoning Awaits
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Each Clinical Clarity topic connects to comprehensive lessons with 
            full pathophysiology, pharmacology integration, clinical pearls, and 
            pre/post assessments.
          </p>
          <LocaleLink href="/lessons">
            <Button className="rounded-full px-8 bg-primary text-white hover:brightness-110 gap-2" data-testid="button-explore-lessons">
              Explore Full Lessons
              <ArrowRight className="w-4 h-4" />
            </Button>
          </LocaleLink>
        </div>

        <ContextualRelatedResources
          pageType="lesson"
          category="clinical-reasoning"
          currentPath="/clinical-clarity"
          className="border-t border-gray-200 mt-8"
        />

        <EducationalIntegrity variant="footer" className="mt-12" />
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}

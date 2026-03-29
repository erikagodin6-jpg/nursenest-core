import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { LocaleLink } from "@/lib/LocaleLink";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import { slugToDisplayName } from "@/lib/canonical-display";
import { useI18n } from "@/lib/i18n";
import {
  glossaryTerms,
  getTermBySlug,
  searchTerms,
  getAlphabetLetters,
  getTermsByLetter,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
  type GlossaryTerm,
} from "@/data/glossary";

const CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  Anatomy: "bg-blue-100 text-blue-700",
  Pharmacology: "bg-purple-100 text-purple-700",
  Pathophysiology: "bg-red-100 text-red-700",
  Assessment: "bg-green-100 text-green-700",
  Procedures: "bg-orange-100 text-orange-700",
  "Lab Values": "bg-yellow-100 text-yellow-700",
  ECG: "bg-pink-100 text-pink-700",
};

function GlossaryIndex() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabetLetters = useMemo(() => getAlphabetLetters(), []);

  const filteredTerms = useMemo(() => {
    let results = query ? searchTerms(query) : glossaryTerms;
    if (selectedCategory) {
      results = results.filter((t) => t.category === selectedCategory);
    }
    if (selectedLetter) {
      results = results.filter((t) => t.term[0].toUpperCase() === selectedLetter);
    }
    return results.sort((a, b) => a.term.localeCompare(b.term));
  }, [query, selectedCategory, selectedLetter]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    for (const term of filteredTerms) {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }
    return groups;
  }, [filteredTerms]);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: glossaryTerms.slice(0, 10).map((t) => ({
      "@type": "Question",
      name: `What is ${t.term} in nursing?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.definition,
      },
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.glossary.nursingGlossary100EssentialNursing")}
        description={t("pages.glossary.comprehensiveNursingGlossaryWith100")}
        keywords="nursing glossary, nursing terms, nursing definitions, medical terminology, NCLEX vocabulary, nursing dictionary"
        canonicalPath="/glossary"
        structuredData={faqStructuredData}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Glossary", url: "https://www.nursenest.ca/glossary" },
            ]}
          />

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" data-testid="text-glossary-title">
              {t("glossary.title")}
            </h1>
            <p className="text-gray-600 text-lg" data-testid="text-glossary-description">
              {t("glossary.description", { count: String(glossaryTerms.length) })}
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("glossary.searchPlaceholder")}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedLetter(null);
                }}
                className="pl-10"
                data-testid="input-glossary-search"
              />
            </div>

            <div className="flex flex-wrap gap-2" data-testid="filter-glossary-categories">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="button-category-all"
              >
                {t("glossary.all")}
              </Button>
              {GLOSSARY_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                  data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1" data-testid="nav-glossary-alphabet">
              {alphabetLetters.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0 text-sm font-semibold"
                  onClick={() => {
                    setSelectedLetter(letter === selectedLetter ? null : letter);
                    setQuery("");
                  }}
                  data-testid={`button-letter-${letter}`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4" data-testid="text-glossary-count">
            {t("glossary.showing", { filtered: String(filteredTerms.length), total: String(glossaryTerms.length) })}
          </p>

          <div className="space-y-6">
            {Object.keys(groupedTerms)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h2 className="text-xl font-bold text-primary border-b border-primary/20 pb-1 mb-3" data-testid={`text-letter-heading-${letter}`}>
                    {letter}
                  </h2>
                  <div className="grid gap-2">
                    {groupedTerms[letter].map((term) => (
                      <LocaleLink
                        key={term.slug}
                        href={`/glossary/${term.slug}`}
                        className="group block bg-white rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-sm transition-all p-4"
                        data-testid={`link-term-${term.slug}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {term.term}
                              </h3>
                              <Badge variant="secondary" className={`text-[10px] ${CATEGORY_COLORS[term.category]}`}>
                                {term.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{term.definition}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                        </div>
                      </LocaleLink>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16 text-gray-500" data-testid="text-glossary-no-results">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">{t("glossary.noTerms")}</p>
              <p className="text-sm">{t("glossary.noTermsDesc")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function GlossaryDetail({ slug }: { slug: string }) {
  const { t } = useI18n();
  const term = getTermBySlug(slug);

  if (!term) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center" data-testid="text-glossary-not-found">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("glossary.termNotFound")}</h1>
            <p className="text-gray-500 mb-4">{t("glossary.termNotFoundDesc")}</p>
            <LocaleLink href="/glossary">
              <Button data-testid="button-back-to-glossary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("glossary.backToGlossary")}
              </Button>
            </LocaleLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const definedTermData = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "NurseNest Nursing Glossary",
      url: "https://www.nursenest.ca/glossary",
    },
  };

  const relatedTerms = glossaryTerms
    .filter((t) => t.slug !== term.slug && t.category === term.category)
    .slice(0, 5);

  return (
    <>
      <SEO
        title={`${term.term} – Nursing Definition & Clinical Explanation`}
        description={term.definition.slice(0, 160)}
        keywords={`${term.term}, nursing definition, ${term.category.toLowerCase()}, medical terminology, NCLEX`}
        canonicalPath={`/glossary/${term.slug}`}
        structuredData={definedTermData}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "https://www.nursenest.ca/" },
              { name: "Glossary", url: "https://www.nursenest.ca/glossary" },
              { name: term.term, url: `https://www.nursenest.ca/glossary/${term.slug}` },
            ]}
          />

          <LocaleLink href="/glossary" className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6" data-testid="link-back-glossary">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("glossary.backToGlossary")}
          </LocaleLink>

          <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${CATEGORY_COLORS[term.category]}`} data-testid="badge-term-category">
                {term.category}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="text-term-title">
              {term.term}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed" data-testid="text-term-definition">
              {term.definition}
            </p>
          </article>

          {term.relatedLessonIds.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3" data-testid="text-related-lessons-heading">
                {t("glossary.relatedLessons")}
              </h2>
              <div className="grid gap-2">
                {term.relatedLessonIds.map((lessonId) => (
                  <LocaleLink
                    key={lessonId}
                    href={`/lessons/${lessonId}`}
                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                    data-testid={`link-related-lesson-${lessonId}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {slugToDisplayName(lessonId)}
                  </LocaleLink>
                ))}
              </div>
            </div>
          )}

          {relatedTerms.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3" data-testid="text-related-terms-heading">
                {t("glossary.relatedTerms", { category: term.category })}
              </h2>
              <div className="grid gap-2">
                {relatedTerms.map((rt) => (
                  <LocaleLink
                    key={rt.slug}
                    href={`/glossary/${rt.slug}`}
                    className="flex items-center justify-between gap-2 text-sm text-gray-700 hover:text-primary transition-colors py-1"
                    data-testid={`link-related-term-${rt.slug}`}
                  >
                    <span className="font-medium">{rt.term}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </LocaleLink>
                ))}
              </div>
            </div>
          )}

          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{t("glossary.masterTitle")}</h2>
            <p className="text-gray-600 text-sm mb-4">
              {t("glossary.masterDesc")}
            </p>
            <LocaleLink href="/start-free">
              <Button data-testid="button-glossary-cta">{t("glossary.startFree")}</Button>
            </LocaleLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function GlossaryPage() {
  const params = useParams<{ term?: string }>();

  if (params.term) {
    return <GlossaryDetail slug={params.term} />;
  }

  return <GlossaryIndex />;
}

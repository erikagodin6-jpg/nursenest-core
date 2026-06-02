import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, ChevronRight, Filter, ArrowLeft } from "lucide-react";
import { ENCYCLOPEDIA_PROFESSIONS } from "@shared/schema";

import { useI18n } from "@/lib/i18n";
interface EncyclopediaListEntry {
  id: string;
  slug: string;
  title: string;
  category: string;
  seoDescription: string | null;
  status: string;
}

interface EncyclopediaListResponse {
  entries: EncyclopediaListEntry[];
  categories: string[];
  total: number;
}

const CATEGORY_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-green-50 text-green-700 border-green-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-orange-50 text-orange-700 border-orange-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

function getCategoryColor(category: string, categories: string[]) {

  const idx = categories.indexOf(category) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx >= 0 ? idx : 0];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function extractProfessionFromPath(pathname: string): string {
  const match = pathname.match(/\/([a-z0-9-]+)-encyclopedia/);
  return match ? match[1] : "";
}

export default function EncyclopediaHubPage() {
  const { t } = useI18n();
  const [location] = useLocation();
  const profession = useMemo(() => extractProfessionFromPath(location), [location]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const professionInfo = useMemo(() =>
    ENCYCLOPEDIA_PROFESSIONS.find(p => p.slug === profession),
    [profession]
  );

  const queryParams = useMemo(() => {
    const p = new URLSearchParams();
    if (selectedCategory) p.set("category", selectedCategory);
    if (searchQuery) p.set("search", searchQuery);
    if (selectedLetter) p.set("letter", selectedLetter);
    return p.toString();
  }, [selectedCategory, searchQuery, selectedLetter]);

  const { data, isLoading } = useQuery<EncyclopediaListResponse>({
    queryKey: ["/api/encyclopedia", profession, queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/encyclopedia/${profession}?${queryParams}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: !!profession,
  });

  const entries = data?.entries || [];
  const categories = data?.categories || [];

  const groupedEntries = useMemo(() => {
    const groups: Record<string, EncyclopediaListEntry[]> = {};
    for (const entry of entries) {
      const letter = entry.title[0]?.toUpperCase() || "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(entry);
    }
    return groups;
  }, [entries]);

  const availableLetters = useMemo(() =>
    new Set(entries.map(e => e.title[0]?.toUpperCase())),
    [entries]
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${professionInfo?.label || profession} Encyclopedia`,
    description: `Comprehensive ${professionInfo?.label || profession} reference encyclopedia with detailed clinical topics.`,
    publisher: { "@type": "Organization", name: "NurseNest" },
  };

  return (
    <>
      <Navigation />
      <SEO
        title={`${professionInfo?.label || profession} Encyclopedia — Clinical Reference Guide | NurseNest`}
        description={`Browse the complete ${professionInfo?.label || profession} encyclopedia. ${entries.length}+ detailed clinical topics covering assessment, management, pharmacology, and exam preparation.`}
        keywords={`${professionInfo?.label || profession} encyclopedia, ${profession} study guide, clinical reference, exam prep`}
        canonicalPath={`/${profession}-encyclopedia`}
        structuredData={faqSchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Encyclopedia", url: "https://www.nursenest.ca/encyclopedia" },
          { name: `${professionInfo?.label || profession} Encyclopedia`, url: `https://www.nursenest.ca/${profession}-encyclopedia` },
        ]}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNav
            items={[
              { name: "Home", url: "/" },
              { name: "Encyclopedia", url: "/encyclopedia" },
              { name: professionInfo?.label || profession, url: "" },
            ]}
          />

          <div className="mb-8 mt-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }} data-testid="heading-hub-title">
              {professionInfo?.label || profession} Encyclopedia
            </h1>
            <p className="text-gray-600 text-lg" data-testid="text-hub-description">
              {entries.length > 0
                ? `${entries.length} detailed clinical topics for ${professionInfo?.label || profession} professionals`
                : `Clinical reference encyclopedia for ${professionInfo?.label || profession} — content coming soon`
              }
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("pages.encyclopediaHub.searchTopics")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLetter(null);
                }}
                className="pl-10"
                data-testid="input-encyclopedia-search"
              />
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2" data-testid="filter-categories">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  data-testid="button-category-all"
                >
                  All
                </Button>
                {categories.map(cat => (
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
            )}

            <div className="flex flex-wrap gap-1" data-testid="nav-alphabet">
              {ALPHABET.map(letter => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  size="sm"
                  className={`w-8 h-8 p-0 text-sm font-semibold ${!availableLetters.has(letter) && !selectedLetter ? "opacity-30" : ""}`}
                  onClick={() => {
                    setSelectedLetter(letter === selectedLetter ? null : letter);
                    setSearchQuery("");
                  }}
                  disabled={!availableLetters.has(letter) && selectedLetter !== letter}
                  data-testid={`button-letter-${letter}`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-gray-500" data-testid="text-no-results">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">{t("pages.encyclopediaHub.noTopicsFound")}</p>
              <p className="text-sm">
                {searchQuery || selectedCategory || selectedLetter
                  ? "Try adjusting your search or filters"
                  : "Encyclopedia content for this profession is being developed"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-gray-500" data-testid="text-result-count">
                Showing {entries.length} topic{entries.length !== 1 ? "s" : ""}
              </p>
              {Object.keys(groupedEntries).sort().map(letter => (
                <div key={letter}>
                  <h2 className="text-xl font-bold text-primary border-b border-primary/20 pb-1 mb-3" data-testid={`heading-letter-${letter}`}>
                    {letter}
                  </h2>
                  <div className="grid gap-2">
                    {groupedEntries[letter].map(entry => (
                      <Link
                        key={entry.id}
                        href={`/encyclopedia/${profession}/${entry.slug}`}
                        className="group block bg-white rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-sm transition-all p-4"
                        data-testid={`link-entry-${entry.slug}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {entry.title}
                              </h3>
                              <Badge variant="secondary" className={`text-[10px] ${getCategoryColor(entry.category, categories)}`}>
                                {entry.category}
                              </Badge>
                            </div>
                            {entry.seoDescription && (
                              <p className="text-sm text-gray-500 line-clamp-2">{entry.seoDescription}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 text-center" data-testid="section-cta">
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Ready to Study {professionInfo?.label || profession}?
            </h3>
            <p className="text-gray-600 mb-4">
              Practice with questions, flashcards, and mock exams aligned to your certification.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/allied-health/${profession}/test-bank`}>
                <Button data-testid="button-cta-questions">{t("pages.encyclopediaHub.practiceQuestions")}</Button>
              </Link>
              <Link href={`/${profession}/flashcards`}>
                <Button variant="outline" data-testid="button-cta-flashcards">{t("pages.encyclopediaHub.flashcards")}</Button>
              </Link>
              <Link href={`/${profession}/mock-exams`}>
                <Button variant="outline" data-testid="button-cta-mock-exams">{t("pages.encyclopediaHub.mockExams")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useState, useMemo } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  medicalAbbreviations,
  searchAbbreviations,
  getAlphabetLetters,
  getAbbreviationsByCategory,
  ABBREVIATION_CATEGORIES,
  type AbbreviationCategory,
} from "@/data/medical-abbreviations";
import { Search, BookOpen, ChevronRight, ArrowRight, FileText, Stethoscope } from "lucide-react";

const CATEGORY_COLORS: Record<AbbreviationCategory, string> = {
  Communication: "bg-purple-100 text-purple-700",
  "Medication Orders": "bg-blue-100 text-blue-700",
  Charting: "bg-green-100 text-green-700",
  Assessment: "bg-teal-100 text-teal-700",
  Procedures: "bg-orange-100 text-orange-700",
  "Time & Frequency": "bg-amber-100 text-amber-700",
  "Lab & Diagnostics": "bg-red-100 text-red-700",
};

export default function MedicalAbbreviationsHub() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AbbreviationCategory | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabetLetters = useMemo(() => getAlphabetLetters(), []);

  const filteredAbbreviations = useMemo(() => {
    let results = query ? searchAbbreviations(query) : medicalAbbreviations;
    if (selectedCategory) {
      results = results.filter(a => a.category === selectedCategory);
    }
    if (selectedLetter) {
      results = results.filter(a => a.abbreviation[0].toUpperCase() === selectedLetter);
    }
    return results.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  }, [query, selectedCategory, selectedLetter]);

  const groupedAbbreviations = useMemo(() => {
    const groups: Record<string, typeof filteredAbbreviations> = {};
    for (const abbr of filteredAbbreviations) {
      const letter = abbr.abbreviation[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(abbr);
    }
    return groups;
  }, [filteredAbbreviations]);

  const faqData = [
    { question: "What are the most common medical abbreviations nurses need to know?", answer: "The most essential medical abbreviations for nurses include SBAR (Situation, Background, Assessment, Recommendation), ADPIE (Assessment, Diagnosis, Planning, Implementation, Evaluation), PRN (as needed), STAT (immediately), NPO (nothing by mouth), VS (vital signs), I&O (intake and output), SOB (shortness of breath), BID/TID/QID (twice/three times/four times daily), and DNR (do not resuscitate)." },
    { question: "Why is it important to know medical abbreviations in nursing?", answer: "Medical abbreviations are used extensively in clinical documentation, physician orders, medication administration records, and interdisciplinary communication. Understanding them is essential for patient safety, accurate medication administration, and effective clinical communication. Many NCLEX exam questions test knowledge of common medical abbreviations." },
    { question: "What medical abbreviations are on the Joint Commission's Do Not Use list?", answer: "The Joint Commission's official 'Do Not Use' list includes: U (write 'unit'), IU (write 'international unit'), Q.D./QD (write 'daily'), Q.O.D./QOD (write 'every other day'), trailing zero (X.0 mg — write X mg), and lack of leading zero (.X mg — write 0.X mg). Additionally, MS, MSO4, and MgSO4 should not be used." },
    { question: "How can I memorize medical abbreviations quickly?", answer: "Effective strategies include using flashcards, creating mnemonics, practicing with clinical scenarios, reviewing abbreviations by category (medications, charting, assessment), and using our practice questions that incorporate real-world abbreviation usage. Regular exposure during clinical rotations also reinforces learning." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Medical Abbreviations for Nurses – Complete Clinical Terminology Guide",
    "description": "Comprehensive guide to medical abbreviations and clinical terminology for nursing students and practicing nurses. Includes SBAR, ADPIE, PRN, STAT, and common charting abbreviations.",
    "url": "https://www.nursenest.ca/medical-abbreviations-for-nurses",
    "author": { "@type": "Organization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "publisher": { "@type": "Organization", "name": "NurseNest Education Inc.", "url": "https://www.nursenest.ca" },
    "mainEntityOfPage": "https://www.nursenest.ca/medical-abbreviations-for-nurses",
  };

  return (
    <>
      <SEO
        title={t("pages.medicalAbbreviationsHub.medicalAbbreviationsForNursesComplete")}
        description={t("pages.medicalAbbreviationsHub.comprehensiveGuideToMedicalAbbreviations")}
        keywords="medical abbreviations for nurses, nursing abbreviations, SBAR, ADPIE, PRN, STAT, NPO, clinical terminology, charting abbreviations, NCLEX abbreviations"
        canonicalPath="/medical-abbreviations-for-nurses"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(faqData)]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Medical Abbreviations for Nurses", url: "https://www.nursenest.ca/medical-abbreviations-for-nurses" },
        ]}
      />
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        <section className="relative py-14 sm:py-18 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white border-b" data-testid="section-hero">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav
              items={[
                { name: "Home", url: "https://www.nursenest.ca/" },
                { name: t("medAbbreviations.breadcrumb"), url: "https://www.nursenest.ca/medical-abbreviations-for-nurses" },
              ]}
            />
            <div className="mt-6">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700" data-testid="badge-reference">
                <Stethoscope className="w-3 h-3 mr-1" /> {t("medAbbreviations.badge")}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
                {t("medAbbreviations.title")}
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-3xl" data-testid="text-page-description">
                {t("medAbbreviations.description", { count: String(medicalAbbreviations.length) })}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("medAbbreviations.searchPlaceholder")}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedLetter(null); }}
                className="pl-10"
                data-testid="input-abbreviation-search"
              />
            </div>

            <div className="flex flex-wrap gap-2" data-testid="filter-categories">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="button-category-all"
              >
                {t("medAbbreviations.all")}
              </Button>
              {ABBREVIATION_CATEGORIES.map((cat) => (
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

            <div className="flex flex-wrap gap-1" data-testid="nav-alphabet">
              {alphabetLetters.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0 text-sm font-semibold"
                  onClick={() => { setSelectedLetter(letter === selectedLetter ? null : letter); setQuery(""); }}
                  data-testid={`button-letter-${letter}`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4" data-testid="text-count">
            {t("medAbbreviations.showing", { filtered: String(filteredAbbreviations.length), total: String(medicalAbbreviations.length) })}
          </p>

          <div className="space-y-6">
            {Object.keys(groupedAbbreviations).sort().map((letter) => (
              <div key={letter}>
                <h2 className="text-xl font-bold text-primary border-b border-primary/20 pb-1 mb-3" data-testid={`text-letter-heading-${letter}`}>
                  {letter}
                </h2>
                <div className="grid gap-2">
                  {groupedAbbreviations[letter].map((abbr) => (
                    <LocaleLink
                      key={abbr.slug}
                      href={`/medical-abbreviations-for-nurses/${abbr.slug}`}
                      className="group block bg-white rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-sm transition-all p-4"
                      data-testid={`link-abbreviation-${abbr.slug}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {abbr.abbreviation}
                            </h3>
                            <span className="text-sm text-gray-500">— {abbr.fullForm}</span>
                            <Badge variant="secondary" className={`text-[10px] ${CATEGORY_COLORS[abbr.category]}`}>
                              {abbr.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">{abbr.definition}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary mt-1 shrink-0 transition-colors" />
                      </div>
                    </LocaleLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {filteredAbbreviations.length === 0 && (
            <div className="text-center py-16 text-gray-500" data-testid="text-no-results">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">{t("medAbbreviations.noResults")}</p>
              <p className="text-sm">{t("medAbbreviations.noResultsDesc")}</p>
            </div>
          )}
        </div>

        <section className="py-12 bg-gray-50 border-t" data-testid="section-faq">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("medAbbreviations.faqTitle")}</h2>
            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl p-4 border border-gray-200 group" data-testid={`faq-${i}`}>
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0" />
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white" data-testid="section-related">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("medAbbreviations.relatedResources")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <LocaleLink href="/glossary" className="block" data-testid="link-glossary">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("medAbbreviations.linkGlossary")}</h3>
                    <p className="text-xs text-gray-500">{t("medAbbreviations.linkGlossaryDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/nursing-skill-checklists" className="block" data-testid="link-checklists">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("medAbbreviations.linkChecklists")}</h3>
                    <p className="text-xs text-gray-500">{t("medAbbreviations.linkChecklistsDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/lessons" className="block" data-testid="link-lessons">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("medAbbreviations.linkLessons")}</h3>
                    <p className="text-xs text-gray-500">{t("medAbbreviations.linkLessonsDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
              <LocaleLink href="/practice-questions" className="block" data-testid="link-practice">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{t("medAbbreviations.linkExamPrep")}</h3>
                    <p className="text-xs text-gray-500">{t("medAbbreviations.linkExamPrepDesc")}</p>
                  </CardContent>
                </Card>
              </LocaleLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { Link } from "wouter";
import {
  BookOpen, Brain, FileText, GraduationCap, ChevronRight, Target, Zap,
  Hand, Wrench, Search, Heart, Shield, Activity, Sparkles, Layers, ClipboardList,
  Scissors, ArrowRight, Pill, Footprints, Thermometer, Code, DollarSign, BarChart3 as BarChart
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import { CAREER_SUBPAGE_DATA } from "@/allied/data/career-subpage-data";
import { PROFESSION_HUB_DATA } from "@/allied/data/profession-hub-data";

import { useI18n } from "@/lib/i18n";
const ICON_MAP: Record<string, any> = {
  Target, Sparkles, Brain, Hand, Activity, BarChart, BookOpen, FileText,
  GraduationCap, Zap, Heart, Shield, Wrench, Search, Layers, ClipboardList,
  Scissors, ArrowRight, Pill, Footprints, Thermometer, Code, DollarSign,
};

function getIcon(name: string) {

  return ICON_MAP[name] || Brain;
}

interface CareerFlashcardsPageProps {
  careerSlug: string;
}

export default function CareerFlashcardsPage({ careerSlug }: CareerFlashcardsPageProps) {
  const subpageData = CAREER_SUBPAGE_DATA[careerSlug];
  const hubData = PROFESSION_HUB_DATA[careerSlug];
  if (!subpageData || !hubData) return null;

  const decks = subpageData.flashcardDecks;
  const basePath = `/allied-health/${careerSlug}`;
  const totalCards = decks.reduce((sum, d) => sum + d.cardCount, 0);

  return (
    <div data-testid={`career-flashcards-page-${careerSlug}`}>
      <AlliedSEO
        title={`${hubData.shortName} Flashcards — Spaced Repetition Study Cards | NurseNest Allied`}
        description={`Master ${hubData.shortName} concepts with ${totalCards}+ spaced repetition flashcards across ${decks.length} decks. Covering ${hubData.examInfo.examNames.join(", ")} exam content.`}
        keywords={`${hubData.shortName} flashcards, ${hubData.name} study cards, ${hubData.shortName} exam flashcards, spaced repetition ${hubData.shortName}`}
        canonicalPath={`${basePath}/flashcards`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
            { "@type": "ListItem", position: 2, name: hubData.shortName, item: `https://www.nursenest.ca${basePath}` },
            { "@type": "ListItem", position: 3, name: "Flashcards", item: `https://www.nursenest.ca${basePath}/flashcards` },
          ],
        }}
      />

      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50/30 py-12 sm:py-16" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
            <Link href="/allied-health" className="hover:text-gray-700">{t("allied.careerFlashcardsPage.alliedHealth")}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={basePath} className="hover:text-gray-700">{hubData.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium" style={{ color: hubData.color }}>{t("allied.careerFlashcardsPage.flashcards")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-page-title">
            {hubData.shortName} Flashcard Decks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {totalCards}+ spaced repetition flashcards organized into {decks.length} topic decks. Master key concepts for the {hubData.examInfo.examNames.join(" and ")} exams.
          </p>
          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: hubData.color }}>{totalCards}+</div>
              <div className="text-xs text-gray-500">{t("allied.careerFlashcardsPage.totalCards")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: hubData.color }}>{decks.length}</div>
              <div className="text-xs text-gray-500">{t("allied.careerFlashcardsPage.decks")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck, i) => {
            const Icon = getIcon(deck.icon);
            return (
              <Link
                key={deck.slug}
                href={basePath}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all"
                data-testid={`card-deck-${deck.slug}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: hubData.colorAccent }}>
                    <Icon className="w-5 h-5" style={{ color: hubData.color }} />
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: hubData.colorAccent, color: hubData.color }}>
                    {deck.cardCount} cards
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{deck.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{deck.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: hubData.color }}>
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerFlashcardsPage.readyToStartReviewing")}</h2>
          <p className="text-gray-600 mb-6">{t("allied.careerFlashcardsPage.startWithADiagnosticTo")}</p>
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

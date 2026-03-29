import { Link } from "wouter";
import {
  Brain, Star, Zap, ArrowRight, BookOpen, Target,
  GraduationCap, Layers
} from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";
import type { ProfessionHubData } from "@/allied/data/profession-hub-data";
import type { FlashcardDeck } from "@/allied/data/imaging-career-data";

import { useI18n } from "@/lib/i18n";
interface CareerFlashcardsIndexPageProps {
  hubData: ProfessionHubData;
  flashcardDecks: FlashcardDeck[];
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "bg-green-50", text: "text-green-700" },
  Intermediate: { bg: "bg-amber-50", text: "text-amber-700" },
  Advanced: { bg: "bg-red-50", text: "text-red-700" },
};

export default function CareerFlashcardsIndexPage({ hubData, flashcardDecks }: CareerFlashcardsIndexPageProps) {
  const { t } = useI18n();
  const basePath = `/allied-health/${hubData.professionSlug}`;
  const totalCards = flashcardDecks.reduce((sum, d) => sum + d.cardCount, 0);
  const beginnerDecks = flashcardDecks.filter(d => d.difficulty === "Beginner");
  const mostTestedDecks = flashcardDecks.filter(d => d.difficulty === "Advanced" || d.difficulty === "Intermediate").slice(0, 3);

  const seoTitle = `${hubData.shortName} Flashcards — ${hubData.name} Exam Prep | NurseNest Allied`;
  const seoDescription = `${flashcardDecks.length} flashcard decks with ${totalCards}+ cards for ${hubData.shortName} certification exam prep. Spaced repetition learning for every exam domain.`;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "NurseNest", "item": "https://www.nursenest.ca/" },
      { "@type": "ListItem", "position": 2, "name": "Allied Health", "item": "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", "position": 3, "name": hubData.shortName, "item": `https://www.nursenest.ca${basePath}` },
      { "@type": "ListItem", "position": 4, "name": "Flashcards", "item": `https://www.nursenest.ca${basePath}/flashcards` },
    ],
  };

  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${hubData.name} Flashcard Decks`,
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
    <div data-testid={`flashcards-index-${hubData.professionSlug}`}>
      <AlliedSEO
        title={seoTitle}
        description={seoDescription}
        keywords={hubData.seo.keywords}
        canonicalPath={`${basePath}/flashcards`}
        structuredData={breadcrumbStructuredData}
        additionalStructuredData={[courseStructuredData, faqStructuredData]}
      />

      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${hubData.colorAccent}40, white, ${hubData.colorAccent}20)` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3" data-testid="text-flashcards-title">
            {hubData.shortName} Flashcard Decks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-6">
            {totalCards}+ flashcards across {flashcardDecks.length} topic decks. Use spaced repetition to master key concepts for your {hubData.shortName} certification exam.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" /> {flashcardDecks.length} Decks</span>
            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4" /> {totalCards}+ Cards</span>
          </div>
        </div>
      </section>

      {beginnerDecks.length > 0 && (
        <section className="py-10 bg-white border-b border-gray-100" data-testid="section-beginner-decks">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" style={{ color: hubData.color }} /> Start Here — Beginner Decks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {beginnerDecks.map(deck => (
                <DeckCard key={deck.slug} deck={deck} color={hubData.color} colorAccent={hubData.colorAccent} />
              ))}
            </div>
          </div>
        </section>
      )}

      {mostTestedDecks.length > 0 && (
        <section className="py-10 bg-gray-50 border-b border-gray-100" data-testid="section-most-tested-decks">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: hubData.color }} /> Most-Tested Topic Decks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mostTestedDecks.map(deck => (
                <DeckCard key={deck.slug} deck={deck} color={hubData.color} colorAccent={hubData.colorAccent} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-white" data-testid="section-all-decks">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Flashcard Decks ({flashcardDecks.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcardDecks.map(deck => (
              <DeckCard key={deck.slug} deck={deck} color={hubData.color} colorAccent={hubData.colorAccent} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50" data-testid="section-flashcards-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("allied.careerFlashcardsIndexPage.pairFlashcardsWithPracticeExams")}</h2>
          <p className="text-gray-600 mb-6">Combine flashcard review with practice questions and mock exams for the most effective {hubData.shortName} exam preparation.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={`${basePath}/study`} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg" style={{ backgroundColor: hubData.color }} data-testid="button-cta-study">
              Study Topics <ArrowRight className="w-4 h-4" />
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

function DeckCard({ deck, color, colorAccent, featured }: { deck: FlashcardDeck; color: string; colorAccent: string; featured?: boolean }) {
  const diffColors = DIFFICULTY_COLORS[deck.difficulty] || DIFFICULTY_COLORS.Intermediate;

  return (
    <div
      className={`bg-white rounded-xl border ${featured ? "border-2" : "border-gray-100"} p-5 hover:shadow-md transition-all`}
      style={featured ? { borderColor: color } : undefined}
      data-testid={`card-deck-${deck.slug}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: colorAccent }}>
          <Brain className="w-4 h-4" style={{ color }} />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${diffColors.bg} ${diffColors.text}`}>
          {deck.difficulty}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{deck.title}</h3>
      <p className="text-xs text-gray-400 mb-2">{deck.topicFocus}</p>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{deck.description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Layers className="w-3 h-3" /> {deck.cardCount} cards
      </div>
      <div className="mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400 font-medium">
          {deck.cardCount} cards
        </span>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useParams, Link } from "wouter";
import { getCareerByRouteSlug, getCanonicalRoute, type CareerConfig } from "@shared/careers";
import { AlliedSEO } from "@/allied/allied-seo";
import { Brain, ChevronRight, RotateCcw, ChevronLeft, ChevronRight as ChevronRightIcon, ThumbsUp, ThumbsDown, Eye, Layers } from "lucide-react";
import { ComingSoonFallback } from "@/allied/components/coming-soon-fallback";
import { pharmacyTechDecks, type FlashcardDeck } from "@/data/pharmacy-tech-flashcards";
import { mltFlashcardDecks } from "@/data/mlt-flashcards";
import { alliedHealthFlashcardDecks } from "@/data/allied-health-flashcards";
import { rrtFlashcardDecks } from "@/data/rrt-flashcards";

import { useI18n } from "@/lib/i18n";
export default function AlliedFlashcardsPage() {
  const { t } = useI18n();
  const params = useParams<{ careerSlug: string }>();
  const career = getCareerByRouteSlug(params.careerSlug || "");
  const isPharmacyTech = career?.slug === "pharmacy-tech";
  const isMLT = career?.slug === "mlt";
  const isRRT = career?.slug === "rrt";
  const isAlliedHealth = !isPharmacyTech && !isMLT && !isRRT;
  const hasDeckSelector = true;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [showDeckSelector, setShowDeckSelector] = useState(hasDeckSelector);

  const activeDeckList: any[] = isRRT ? rrtFlashcardDecks : isMLT ? mltFlashcardDecks : isPharmacyTech ? pharmacyTechDecks : alliedHealthFlashcardDecks;

  const cards = useMemo(() => {
    if (!career) return [];
    if (isPharmacyTech) {
      if (selectedDeckId) {
        const deck = pharmacyTechDecks.find(d => d.id === selectedDeckId);
        return deck ? deck.cards.map(c => ({ ...c, domain: deck.category })) : [];
      }
      return pharmacyTechDecks.flatMap(deck => deck.cards.map(c => ({ ...c, domain: deck.category })));
    }
    if (isMLT) {
      if (selectedDeckId) {
        const deck = mltFlashcardDecks.find(d => d.id === selectedDeckId);
        return deck ? deck.cards.map(c => ({ ...c, domain: deck.discipline })) : [];
      }
      return mltFlashcardDecks.flatMap(deck => deck.cards.map(c => ({ ...c, domain: deck.discipline })));
    }
    if (isRRT) {
      if (selectedDeckId) {
        const deck = rrtFlashcardDecks.find(d => d.id === selectedDeckId);
        return deck ? deck.cards.map(c => ({ ...c, domain: deck.category })) : [];
      }
      return rrtFlashcardDecks.flatMap(deck => deck.cards.map(c => ({ ...c, domain: deck.category })));
    }
    if (selectedDeckId) {
      const deck = alliedHealthFlashcardDecks.find(d => d.id === selectedDeckId);
      return deck ? deck.cards.map(c => ({ ...c, domain: deck.category })) : [];
    }
    return alliedHealthFlashcardDecks.flatMap(deck => deck.cards.map(c => ({ ...c, domain: deck.category })));
  }, [career?.id, selectedDeckId, isPharmacyTech, isMLT, isRRT, isAlliedHealth]);

  if (!career) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.alliedFlashcards.careerNotFound")}</h1></div>;
  }

  const current = cards[currentIdx];

  const markKnown = () => {
    setKnown(s => new Set(s).add(currentIdx));
    setUnknown(s => { const n = new Set(s); n.delete(currentIdx); return n; });
    next();
  };

  const markUnknown = () => {
    setUnknown(s => new Set(s).add(currentIdx));
    setKnown(s => { const n = new Set(s); n.delete(currentIdx); return n; });
    next();
  };

  const next = () => {
    setFlipped(false);
    if (currentIdx < cards.length - 1) setCurrentIdx(i => i + 1);
  };

  const prev = () => {
    setFlipped(false);
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const reset = () => {
    setCurrentIdx(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  };

  const selectDeck = (deckId: string | null) => {
    setSelectedDeckId(deckId);
    setShowDeckSelector(false);
    reset();
  };

  const selectedDeckName = selectedDeckId
    ? activeDeckList.find((d: any) => d.id === selectedDeckId)?.name || "All Decks"
    : "All Decks";

  const getDeckCategory = (deck: any) => deck.category || deck.discipline || "";

  if (activeDeckList.length === 0) {
    return (
      <>
        <AlliedSEO
          title={`${career.name} Flashcards`}
          description={`Flashcard decks for ${career.name} exam preparation are being developed.`}
          keywords={`${career.name} flashcards`}
          canonicalPath={`/career/${params.careerSlug}/flashcards`}
        />
        <div className="max-w-3xl mx-auto px-4 py-16" data-testid="allied-flashcards-page">
          <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
            <Link href={getCanonicalRoute(career.slug)} className="hover:text-primary">{career.shortName}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-medium">{t("allied.alliedFlashcards.flashcards")}</span>
          </div>
          <ComingSoonFallback
            title={`${career.shortName} Flashcards — In Development`}
            description={`Spaced repetition flashcard decks for ${career.shortName} exam preparation are being developed by our team of certified professionals.`}
            careerSlug={career.slug}
          />
        </div>
      </>
    );
  }

  if (hasDeckSelector && showDeckSelector) {
    const totalCards = activeDeckList.reduce((sum: number, d: any) => sum + d.cards.length, 0);
    const deckCount = activeDeckList.length;
    const seoDesc = isRRT
      ? `Master ${career.name} concepts with ${deckCount} spaced repetition flashcard decks and ${totalCards}+ cards covering ABG interpretation, mechanical ventilation, respiratory pharmacology, airway management, and more.`
      : isMLT
      ? `Master ${career.name} concepts with ${deckCount} spaced repetition flashcard decks and ${totalCards}+ cards covering Hematology, Chemistry, Microbiology, Blood Banking, and more.`
      : isPharmacyTech
      ? `Master ${career.name} concepts with ${deckCount} spaced repetition flashcard decks and ${totalCards}+ cards covering Top 200 Drugs, dosage calculations, pharmacy law, compounding, and more.`
      : `Master ${career.name} concepts with ${deckCount} spaced repetition flashcard decks and ${totalCards}+ cards covering medical terminology, anatomy, lab values, clinical concepts, medications, and professional responsibilities.`;
    const seoKeywords = isRRT
      ? `${career.name} flashcards, RRT flashcards, TMC exam flashcards, ABG interpretation flashcards, mechanical ventilation flashcards, respiratory therapy study cards`
      : isMLT
      ? `${career.name} flashcards, CSMLS flashcards, ASCP MLT flashcards, hematology flashcards, clinical chemistry flashcards`
      : isPharmacyTech
      ? `${career.name} flashcards, PTCB flashcards, pharmacy tech study cards, top 200 drugs flashcards, pharmacy math flashcards`
      : `${career.name} flashcards, allied health flashcards, medical terminology flashcards, anatomy flashcards, clinical concepts study cards`;
    return (
      <>
      <AlliedSEO
        title={`${career.name} Flashcards - ${deckCount} Study Decks, ${totalCards}+ Cards`}
        description={seoDesc}
        keywords={seoKeywords}
        canonicalPath={`/career/${params.careerSlug}/flashcards`}
      />
      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="allied-flashcards-page">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
          <Link href={getCanonicalRoute(career.slug)} className="hover:text-primary">{career.shortName}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium">{t("allied.alliedFlashcards.flashcards2")}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-flashcards-title">{career.shortName} Flashcards</h1>
          <p className="text-muted-foreground text-sm mt-1">{deckCount} decks · {totalCards} cards · Spaced repetition learning</p>
        </div>

        <button onClick={() => selectDeck(null)} className="w-full mb-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-5 text-left hover:from-primary/90 hover:to-primary/70 transition-all" data-testid="button-all-decks">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6" />
            <div>
              <div className="font-semibold text-lg">{t("allied.alliedFlashcards.studyAllDecks")}</div>
              <div className="text-primary-foreground/70 text-sm">{totalCards} cards across all topics — shuffle mode</div>
            </div>
          </div>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDeckList.map((deck: any) => (
            <button key={deck.id} onClick={() => selectDeck(deck.id)} className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary/30 hover:shadow-md transition-all" data-testid={`deck-card-${deck.id}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{getDeckCategory(deck)}</span>
                <span className="text-xs text-muted-foreground">{deck.cards.length} cards</span>
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{deck.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{deck.description}</p>
            </button>
          ))}
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <AlliedSEO
      title={`${career.name} Flashcards - Spaced Repetition Study Cards`}
      description={`Master ${career.name} concepts with spaced repetition flashcards. Key terms, drug dosages, clinical procedures, and exam-critical facts across all ${career.examNames[0]} domains.`}
      keywords={`${career.name} flashcards, ${career.name} study cards, ${career.examNames[0]} flashcards, spaced repetition, ${career.name} exam review`}
      canonicalPath={`/career/${params.careerSlug}/flashcards`}
    />
    <div className="max-w-3xl mx-auto px-4 py-8" data-testid="allied-flashcards-page">
      <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
        <Link href={getCanonicalRoute(career.slug)} className="hover:text-primary">{career.shortName}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {hasDeckSelector && (
          <>
            <button onClick={() => setShowDeckSelector(true)} className="hover:text-primary">{t("allied.alliedFlashcards.flashcards3")}</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary font-medium">{selectedDeckName}</span>
          </>
        )}
        {!hasDeckSelector && <span className="text-primary font-medium">{t("allied.alliedFlashcards.flashcards4")}</span>}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-flashcards-title">
            {hasDeckSelector ? selectedDeckName : `${career.shortName} Flashcards`}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{cards.length} cards - Spaced repetition learning</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDeckSelector(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-lg text-sm text-primary hover:bg-primary/20" data-testid="button-switch-deck">
            <Layers className="w-3.5 h-3.5" /> Decks
          </button>
          <button onClick={reset} className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg text-sm text-foreground/60 hover:bg-secondary/80" data-testid="button-reset">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
        <span>Card {currentIdx + 1} of {cards.length}</span>
        <span className="text-green-600">Known: {known.size}</span>
        <span className="text-red-600">Review: {unknown.size}</span>
      </div>

      <div className="w-full bg-secondary rounded-full h-1.5 mb-6">
        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / cards.length) * 100}%` }} />
      </div>

      {current && (
        <div className="mb-6">
          <div
            onClick={() => setFlipped(!flipped)}
            className="bg-card rounded-2xl border border-border p-8 sm:p-12 min-h-[280px] flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all select-none"
            data-testid="flashcard"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 bg-secondary text-foreground/60 rounded text-xs">{current.domain}</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{flipped ? "Answer" : "Question"}</span>
            </div>
            <p className="text-lg sm:text-xl text-foreground font-medium text-center leading-relaxed" data-testid="text-card-content">
              {flipped ? current.back : current.front}
            </p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-6">
              <Eye className="w-3.5 h-3.5" /> Click to {flipped ? "see question" : "reveal answer"}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={currentIdx === 0} className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground disabled:opacity-30" data-testid="button-prev-card">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <div className="flex gap-3">
          <button onClick={markUnknown} className="flex items-center gap-1 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100" data-testid="button-dont-know">
            <ThumbsDown className="w-4 h-4" /> Review Again
          </button>
          <button onClick={markKnown} className="flex items-center gap-1 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100" data-testid="button-know">
            <ThumbsUp className="w-4 h-4" /> Got It
          </button>
        </div>
        <button onClick={next} disabled={currentIdx === cards.length - 1} className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground disabled:opacity-30" data-testid="button-next-card">
          Next <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
    </>
  );
}

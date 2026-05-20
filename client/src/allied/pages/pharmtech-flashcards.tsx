import { useState, useEffect, useCallback } from "react";
import { fisherYatesShuffle } from "@shared/shuffle";
import { Link, useParams } from "wouter";
import { Brain, ChevronRight, ArrowRight, RotateCcw, ChevronLeft, Shuffle, Globe } from "lucide-react";
import { AlliedSEO } from "@/allied/allied-seo";

import { useI18n } from "@/lib/i18n";
const CERT_OPTIONS = [
  { value: "", label: "All Content" },
  { value: "PTCB", label: "US (PTCB/ExCPT)" },
  { value: "PEBC", label: "Canada (PEBC)" },
];

function CertBadge({ certContext }: { certContext?: string }) {
  const { t } = useI18n();
  if (!certContext || certContext === "BOTH") return null;
  if (certContext === "PTCB") return <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">US</span>;
  if (certContext === "PEBC") return <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[10px] font-medium">CA</span>;
  return null;
}

function DeckLibrary() {
  const [decks, setDecks] = useState<any[]>([]);
  const [cert, setCert] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = cert ? `?cert=${cert}` : "";
    fetch(`/api/pharmtech/flashcard-decks${params}`).then(r => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then(data => { setDecks(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false));
  }, [cert]);

  return (
    <>
      <AlliedSEO
        title={t("allied.pharmtechFlashcards.pharmacyTechnicianFlashcardsStudyDecks")}
        description={t("allied.pharmtechFlashcards.masterPharmacyTechnicianConceptsWith")}
        canonicalPath="/allied-health/pharmacy-technician/flashcards"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-flashcards-page">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-primary">{t("allied.pharmtechFlashcards.pharmacyTechnician")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium">{t("allied.pharmtechFlashcards.flashcards")}</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="text-flashcards-title">{t("allied.pharmtechFlashcards.flashcardDecks")}</h1>
        <p className="text-muted-foreground text-sm mb-4">{decks.length} decks available — tap to study</p>

        <div className="flex items-center gap-1.5 mb-8" data-testid="cert-filter-decks">
          <Globe className="w-4 h-4 text-gray-400 mr-1" />
          {CERT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCert(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${cert === opt.value ? "bg-green-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              data-testid={`button-deck-cert-${opt.value || "all"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map(deck => (
              <Link key={deck.id} href={`/allied-health/pharmacy-technician/flashcards/${deck.slug}`} className="group bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all" data-testid={`card-deck-${deck.slug}`}>
                <div className="flex items-center justify-between mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                  <CertBadge certContext={deck.certContext} />
                </div>
                <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium mb-2">{deck.category}</span>
                <h3 className="font-semibold text-foreground mb-1">{deck.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{deck.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{deck.cardCount} cards</span>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Study <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function DeckDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pharmtech/flashcard-decks/${slug}`).then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then(data => {
      setDeck(data);
      setCards(data.cards || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleShuffle = useCallback(() => {
    setCards(prev => fisherYatesShuffle([...prev]));
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setFlipped(false);
    }
  }, [currentIndex]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!deck) return <div className="max-w-2xl mx-auto px-4 py-20 text-center"><h1 className="text-2xl font-bold">{t("allied.pharmtechFlashcards.deckNotFound")}</h1></div>;

  const card = cards[currentIndex];

  return (
    <>
      <AlliedSEO
        title={`${deck.title} - Pharmacy Technician Flashcards`}
        description={deck.description || `Study ${deck.title} flashcards for pharmacy technician certification exam prep. ${deck.cardCount} cards available.`}
        canonicalPath={`/allied-health/pharmacy-technician/flashcards/${deck.slug}`}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="pharmtech-deck-detail">
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
          <Link href="/allied-health/pharmacy-technician" className="hover:text-primary">{t("allied.pharmtechFlashcards.pharmacyTechnician2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/allied-health/pharmacy-technician/flashcards" className="hover:text-primary">{t("allied.pharmtechFlashcards.flashcards2")}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-medium truncate">{deck.title}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-deck-title">{deck.title}</h1>
            <p className="text-muted-foreground text-sm">{deck.cardCount} cards · {deck.category}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShuffle} className="p-2 rounded-lg bg-secondary text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors" data-testid="button-shuffle">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={() => { setCurrentIndex(0); setFlipped(false); }} className="p-2 rounded-lg bg-secondary text-foreground/60 hover:bg-primary/10 hover:text-primary transition-colors" data-testid="button-restart">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground" data-testid="text-card-progress">Card {currentIndex + 1} of {cards.length}</span>
          <div className="w-40 bg-secondary rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} />
          </div>
        </div>

        {card ? (
          <>
            <div
              onClick={() => setFlipped(!flipped)}
              className="bg-card rounded-2xl border-2 border-border p-8 sm:p-12 min-h-[280px] flex items-center justify-center cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all select-none"
              data-testid="flashcard"
            >
              <div className="text-center max-w-lg">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4 block">
                  {flipped ? "Answer" : "Question"} — tap to flip
                </span>
                <p className={`text-lg leading-relaxed ${flipped ? "text-primary" : "text-foreground"} font-medium`} data-testid="text-card-content">
                  {flipped ? card.back : card.front}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed" data-testid="button-prev-card">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button onClick={handleNext} disabled={currentIndex >= cards.length - 1} className="flex items-center gap-1 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" data-testid="button-next-card">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Brain className="w-12 h-12 text-muted-foreground/60 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("allied.pharmtechFlashcards.noCardsInThisDeck")}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function PharmtechFlashcardsPage() {
  const params = useParams<{ slug: string }>();
  if (params.slug) return <DeckDetail />;
  return <DeckLibrary />;
}

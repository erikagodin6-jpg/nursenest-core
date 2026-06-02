import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/lib/LocaleLink";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import {
  Layers,
  RotateCcw,
  ArrowRight,
  Lock,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FREE_LIMIT = 5;

interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category: string;
}

interface InlineFlashcardPreviewProps {
  topic?: string;
  bodySystem?: string;
  profession?: string;
  maxCards?: number;
}

export function InlineFlashcardPreview({
  topic,
  bodySystem,
  profession,
  maxCards = FREE_LIMIT,
}: InlineFlashcardPreviewProps) {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gated, setGated] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const hasPaid = user && effectiveTier && effectiveTier !== "free";

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/decks?visibility=public");
        if (res.ok) {
          const decks = await res.json();
          const matchingDeck = decks.find(
            (d: any) =>
              (topic && d.title?.toLowerCase().includes(topic.toLowerCase())) ||
              (bodySystem && d.title?.toLowerCase().includes(bodySystem.toLowerCase())) ||
              (profession && d.title?.toLowerCase().includes(profession.toLowerCase()))
          );
          const deckToUse = matchingDeck || (decks.length > 0 ? decks[0] : null);
          if (deckToUse) {
            const cardsRes = await fetch(`/api/decks/${deckToUse.id}/cards`);
            if (cardsRes.ok) {
              const cardsData = await cardsRes.json();
              setCards(
                cardsData.slice(0, maxCards).map((c: any) => ({
                  id: c.id,
                  front: c.front,
                  back: c.back,
                  category: c.tags?.[0] || bodySystem || "General",
                }))
              );
            }
          }
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [topic, bodySystem, profession, maxCards]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse" data-testid="inline-flashcard-loading">
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (cards.length === 0) return null;

  if (gated) {
    return (
      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50/50" data-testid="inline-flashcard-gate">
        <CardContent className="p-6 text-center space-y-4">
          <Lock className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">
            You've reviewed {reviewedCount} flashcards!
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {user
              ? "Upgrade to access full flashcard decks with spaced repetition and progress tracking."
              : "Create a free account to build your own decks and continue studying."}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {!user ? (
              <LocaleLink href="/start-free">
                <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" data-testid="button-flashcard-signup">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Button>
              </LocaleLink>
            ) : (
              <LocaleLink href="/pricing">
                <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700" data-testid="button-flashcard-upgrade">
                  <Crown className="w-4 h-4" /> Unlock All Flashcards
                </Button>
              </LocaleLink>
            )}
            <LocaleLink href="/flashcards">
              <Button variant="outline" className="rounded-xl gap-2" data-testid="button-flashcard-hub">
                Browse Flashcard Decks <ArrowRight className="w-4 h-4" />
              </Button>
            </LocaleLink>
          </div>
        </CardContent>
      </Card>
    );
  }

  const card = cards[currentIdx];
  if (!card) return null;

  const handleFlip = () => {
    if (!flipped) {
      setReviewedCount((c) => c + 1);
    }
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIdx >= cards.length - 1 && !hasPaid) {
      setGated(true);
      return;
    }
    setCurrentIdx((i) => Math.min(i + 1, cards.length - 1));
    setFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIdx((i) => Math.max(i - 1, 0));
    setFlipped(false);
  };

  return (
    <div className="space-y-4" data-testid="inline-flashcard-preview">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">{t("components.conversionFunnelInlineFlashcardPreview.quickFlashcardReview")}</h3>
        </div>
        <Badge variant="outline" className="text-xs" data-testid="badge-flashcard-progress">
          {currentIdx + 1} / {cards.length}
        </Badge>
      </div>

      <div
        onClick={handleFlip}
        className="cursor-pointer select-none"
        data-testid="card-flashcard"
      >
        <Card className={`border-2 transition-all duration-300 min-h-[200px] flex items-center justify-center ${
          flipped
            ? "border-emerald-300 bg-emerald-50/50"
            : "border-gray-200 bg-white hover:border-primary/30"
        }`}>
          <CardContent className="p-6 text-center w-full">
            <Badge variant="secondary" className="text-xs mb-3">
              {card.category}
            </Badge>
            {!flipped ? (
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-3" data-testid="text-flashcard-front">
                  {card.front}
                </p>
                <p className="text-xs text-gray-400">{t("components.conversionFunnelInlineFlashcardPreview.tapToRevealAnswer")}</p>
              </div>
            ) : (
              <div>
                <p className="text-base text-gray-700 leading-relaxed" data-testid="text-flashcard-back">
                  {card.back}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="rounded-xl gap-1"
          data-testid="button-flashcard-prev"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlip}
          className="rounded-xl gap-1"
          data-testid="button-flashcard-flip"
        >
          <RotateCcw className="w-4 h-4" /> Flip
        </Button>
        <Button
          size="sm"
          onClick={handleNext}
          className="rounded-xl gap-1"
          data-testid="button-flashcard-next"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

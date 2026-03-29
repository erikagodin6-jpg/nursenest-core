import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, Check, ArrowLeft, Layers, Share2, Globe, Lock, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { MedicalReviewBadge, MedicalReviewJsonLd } from "@/components/medical-review-badge";
import { MedicalReferences } from "@/components/medical-references";
import { validateFlashcards, getSkippedItemsMessage } from "@/lib/payload-validators";

import { useI18n } from "@/lib/i18n";
export default function DeckPage() {
  const { t } = useI18n();
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user, effectiveTier } = useAuth();
  const { toast } = useToast();
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [totalCardCount, setTotalCardCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [skippedMsg, setSkippedMsg] = useState<string | null>(null);

  const isOwner = deck && user && deck.ownerId === user.id;
  const isPaid = user && effectiveTier !== "free" && ((user as any).subscriptionStatus === "active" || ((user as any).tier === "admin" && effectiveTier !== "free"));
  const hasFullAccess = isOwner || isPaid;
  const FREE_PREVIEW = 5;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/decks/by-slug/${params.slug}`);
        if (!res.ok) { setLoading(false); return; }
        const d = await res.json();
        setDeck(d);
        setTotalCardCount(d.cardCount || 0);
        const uid = user?.id || "";
        const cardsRes = await fetch(`/api/decks/${d.id}/cards?userId=${uid}`);
        if (cardsRes.ok) {
          const rawCards = await cardsRes.json();
          const { valid, skippedCount } = validateFlashcards(rawCards);
          setCards(valid);
          setSkippedMsg(getSkippedItemsMessage(skippedCount, "card"));
        }
      } catch {}
      setLoading(false);
    }
    if (params.slug) load();
  }, [params.slug, user?.id]);

  const shareUrl = `${window.location.origin}/flashcards/deck/${params.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share this link with your study group." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      toast({ title: "Link copied!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: deck?.title ? `${deck.title} - NurseNest Study Deck` : "NurseNest Study Deck",
          text: deck?.description || "Check out this nursing study deck on NurseNest!",
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <Navigation />
        <SEO title={t("pages.deckPage.deckNotFoundNursenest")} description={t("pages.deckPage.thisStudyDeckCouldNot")} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-deck-not-found">{t("pages.deckPage.deckNotFound")}</h1>
          <p className="text-gray-500 mb-6">{t("pages.deckPage.thisStudyDeckMayHave")}</p>
          <Button onClick={() => setLocation("/flashcards")} className="rounded-xl gap-2" data-testid="button-back-flashcards">
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": deck.title,
    "description": deck.description || `${deck.title} - nursing study flashcard deck`,
    "educationalLevel": "Professional",
    "learningResourceType": "Flashcard Deck",
    "numberOfItems": cards.length,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca"
    },
    "url": shareUrl,
    "inLanguage": "en",
    "isAccessibleForFree": false,
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <Navigation />
      <AdminEditButton />
      <SEO
        title={`${deck.title} - Free Nursing Flashcards | NurseNest`}
        description={deck.description || `Study ${deck.title} with ${cards.length} free nursing flashcards. Learn and test mode available. Perfect for NCLEX and REX-PN exam preparation.`}
        keywords={`${deck.title}, nursing flashcards, NCLEX study cards, nursing exam prep, free flashcards, ${(deck.tags || []).join(", ")}`}
        canonicalPath={`/flashcards/deck/${params.slug}`}
        structuredData={structuredData}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: "Flashcards", url: "https://www.nursenest.ca/flashcards" },
          { name: deck.title, url: `https://www.nursenest.ca/flashcards/deck/${params.slug}` },
        ]}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label={t("pages.deckPage.breadcrumb")} data-testid="nav-breadcrumb">
          <LocaleLink href="/" className="hover:text-primary transition-colors">{t("pages.deckPage.home")}</LocaleLink>
          <span>/</span>
          <LocaleLink href="/flashcards" className="hover:text-primary transition-colors">{t("pages.deckPage.flashcards")}</LocaleLink>
          <span>/</span>
          <span className="text-gray-900 font-medium">{deck.title}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-deck-title">{deck.title}</h1>
            {deck.description && <p className="text-gray-600 text-lg" data-testid="text-deck-description">{deck.description}</p>}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-sm text-gray-500">{cards.length} cards</span>
              {deck.ownerUsername && <span className="text-sm text-gray-400">by {deck.ownerUsername}</span>}
              {deck.visibility === "public" && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs">
                  <Globe className="w-3 h-3 mr-1" /> Public
                </Badge>
              )}
              {(deck.tags || []).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button onClick={handleCopy} variant="outline" className="rounded-xl gap-2" data-testid="button-copy-link">
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <Button onClick={handleShare} variant="outline" className="rounded-xl gap-2" data-testid="button-share-deck">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button onClick={() => setLocation("/flashcards")} className="rounded-xl gap-2" data-testid="button-study-deck">
              <BookOpen className="w-4 h-4" /> Study Now
            </Button>
          </div>
        </div>

        {cards.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {hasFullAccess ? "All Cards" : "Preview Cards"}
              </h2>
              <span className="text-sm text-gray-400">
                {hasFullAccess ? `${cards.length} cards` : `${cards.length} of ${totalCardCount || cards.length} cards`}
              </span>
            </div>
            {skippedMsg && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded px-3 py-1.5 mb-2" data-testid="text-skipped-cards-warning">{skippedMsg}</p>
            )}
            <div className="space-y-3">
              {cards.map((card: any, i: number) => (
                <Card key={card.id} className="border-gray-100 hover:border-primary/20 transition-colors" data-testid={`card-preview-${i}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-400 font-mono mt-0.5 shrink-0">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{card.front}</p>
                        <p className="text-sm text-gray-600 mt-1.5">{card.back}</p>
                        {card.rationale && (
                          <p className="text-xs text-gray-400 mt-2 italic border-l-2 border-gray-200 pl-3">{card.rationale}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!hasFullAccess && totalCardCount > FREE_PREVIEW && (
              <div className="mt-4 relative">
                <div className="space-y-3 opacity-30 pointer-events-none select-none" aria-hidden="true">
                  {[1, 2, 3].map(i => (
                    <Card key={`blur-${i}`} className="border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-gray-400 font-mono mt-0.5 shrink-0">{cards.length + i}.</span>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-primary/20 shadow-lg p-6 text-center max-w-sm mx-4">
                    <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {totalCardCount - cards.length} more cards
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {user ? "Upgrade your plan to access the full deck with all cards, study modes, and progress tracking." : "Sign up for free to preview more, or upgrade for full access to all study cards."}
                    </p>
                    <div className="flex flex-col gap-2">
                      {user ? (
                        <Button onClick={() => setLocation("/pricing")} className="rounded-xl gap-2 w-full" data-testid="button-upgrade-full-deck">
                          <Crown className="w-4 h-4" /> Upgrade for Full Access
                        </Button>
                      ) : (
                        <>
                          <Button onClick={() => setLocation("/login")} className="rounded-xl gap-2 w-full" data-testid="button-signup-full-deck">
                            Start Free - See More Cards
                          </Button>
                          <Button variant="outline" onClick={() => setLocation("/pricing")} className="rounded-xl gap-2 w-full text-xs" data-testid="button-pricing-full-deck">
                            <Crown className="w-3.5 h-3.5" /> View Premium Plans
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {deck && (
          <AutoRelatedContent
            slug={params.slug || ""}
            contentType="flashcard-deck"
            title={deck.title || ""}
            className="mt-8 pt-8 border-t border-gray-200"
            sectionTitle="Related Lessons & Practice"
          />
        )}

        {deck && (
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <MedicalReviewBadge />
            <MedicalReferences lessonId={params.slug || ""} />
          </div>
        )}

        {deck && (
          <MedicalReviewJsonLd
            title={deck.title || ""}
            slug={params.slug || ""}
            description={deck.description || `Flashcard deck: ${deck.title}`}
            pageUrl={`https://www.nursenest.ca/flashcards/deck/${params.slug}`}
          />
        )}

        <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("pages.deckPage.readyToStudyThisDeck")}</h2>
          <p className="text-gray-600 mb-4">{t("pages.deckPage.createAFreeAccountTo")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <Button onClick={() => setLocation("/flashcards")} className="rounded-xl gap-2" data-testid="button-go-study">
                <BookOpen className="w-4 h-4" /> Open in Study Mode
              </Button>
            ) : (
              <>
                <Button onClick={() => setLocation("/login")} className="rounded-xl gap-2" data-testid="button-signup-study">
                  Start Free - No Credit Card
                </Button>
                <Button variant="outline" onClick={handleCopy} className="rounded-xl gap-2" data-testid="button-copy-link-cta">
                  <Copy className="w-4 h-4" /> Share with Friends
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

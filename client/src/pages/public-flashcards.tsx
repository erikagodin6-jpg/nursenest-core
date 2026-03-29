import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeckHub, DeckView, DeckEditor, DeckStudyLearn, DeckStudyTest, DeckReportCard } from "@/components/deck-views";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { createCheckpointManager } from "@/lib/session-checkpoint";
import { cn } from "@/lib/utils";
import {
  Layers, Search, BookOpen, Plus, ArrowLeft, ChevronRight,
  Sparkles, GraduationCap, Brain, Heart, Stethoscope,
  Loader2, RotateCcw, CheckCircle2, Star, Filter,
  RefreshCw, Eye, Lightbulb, Lock, Crown
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";

import { useI18n } from "@/lib/i18n";
interface DeckRecord {
  id: string;
  title: string;
  description?: string;
  visibility?: string;
  userId?: string;
  cardCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface DeckCardRecord {
  id: string;
  deckId: string;
  front: string;
  back: string;
  rationale?: string;
  clinicalPearl?: string;
  position?: number;
}

interface DeckEntitlement {
  isPremium: boolean;
  totalFreeCards: number;
  limit: number;
  percentage: number;
}

const FLASHCARD_TOPICS = [
  { name: "Cardiovascular", icon: Heart, color: "bg-red-50 text-red-600 border-red-100" },
  { name: "Respiratory", icon: Stethoscope, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "Neurological", icon: Brain, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "Pharmacology", icon: Sparkles, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Pediatrics", icon: Star, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Oncology", icon: Lightbulb, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "GI", icon: BookOpen, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "Endocrine", icon: RefreshCw, color: "bg-teal-50 text-teal-600 border-teal-100" },
  { name: "Infection", icon: Eye, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { name: "Maternal", icon: Heart, color: "bg-violet-50 text-violet-600 border-violet-100" },
  { name: "Psychiatry", icon: Brain, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { name: "Hematology", icon: Stethoscope, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
];

type SimpleFlashcard = {
  id: string;
  front: string;
  back: string;
  category: string;
};

const QUICK_STUDY_CARDS: SimpleFlashcard[] = [
  { id: "qs1", front: "Pulsatile Abdominal Mass", back: "A key clinical finding in Abdominal Aortic Aneurysm (AAA), indicating the aorta is dilated and transmitting the heart's pulsations through the abdominal wall.", category: "Cardiovascular" },
  { id: "qs2", front: "Strawberry Tongue", back: "A characteristic finding in Kawasaki Disease (acute phase) where the tongue appears red and bumpy due to inflamed papillae.", category: "Pediatrics" },
  { id: "qs3", front: "Pancytopenia", back: "A simultaneous reduction in RBCs, WBCs, and platelets, commonly seen in leukemia due to bone marrow overcrowding by malignant blasts.", category: "Oncology" },
  { id: "qs4", front: "tPA Window", back: "The critical 3 to 4.5 hour timeframe from the 'last known well' time for administering thrombolytic therapy in ischemic stroke.", category: "Neurological" },
  { id: "qs5", front: "Cushing's Triad", back: "A late sign of increased ICP characterized by widening pulse pressure (HTN), bradycardia, and irregular respirations.", category: "Neurological" },
  { id: "qs6", front: "MAP (Mean Arterial Pressure)", back: "The average pressure in the arteries during one cardiac cycle. Must be > 65 mmHg to ensure adequate end-organ perfusion.", category: "Cardiovascular" },
  { id: "qs7", front: "Rule of Nines", back: "A standardized tool used to quickly estimate the Total Body Surface Area (TBSA) burned in adults to guide fluid resuscitation.", category: "Skin" },
  { id: "qs8", front: "SIRS Criteria", back: "Systemic Inflammatory Response Syndrome: Defined by 2+ of: Temp >38C or <36C, HR >90, RR >20, or WBC >12k or <4k.", category: "Infection" },
  { id: "qs9", front: "Epiglottitis (The 4 Ds)", back: "Drooling, Dysphagia, Dysphonia, and Distressed inspiratory stridor. A pediatric airway emergency.", category: "Pediatrics" },
  { id: "qs10", front: "Serotonin Syndrome", back: "Caused by excess serotonin. Symptoms: Agitation, fever, tachycardia, and hyperreflexia. Often occurs with SSRI/MAOI combinations.", category: "Psychiatry" },
  { id: "qs11", front: "Melena vs Hematochezia", back: "Melena is black, tarry stool (Upper GI bleed). Hematochezia is bright red blood per rectum (Lower GI bleed).", category: "GI" },
  { id: "qs12", front: "Autonomic Dysreflexia", back: "Life-threatening emergency in spinal cord injury (T6 or higher). Triggered by noxious stimuli (full bladder/constipation). Signs: Severe HTN, headache, bradycardia.", category: "Neurological" },
  { id: "qs13", front: "Diabetes Insipidus (DI)", back: "Caused by ADH deficiency. Characterized by polydipsia and large amounts of dilute urine (low specific gravity). Risk: Dehydration.", category: "Endocrine" },
  { id: "qs14", front: "Cushing's Syndrome", back: "Caused by excess cortisol. Signs: Moon face, Buffalo hump, Truncal obesity, Hypertension, Hyperglycemia, and Hypokalemia.", category: "Endocrine" },
  { id: "qs15", front: "Iron Deficiency Anemia Education", back: "Take iron supplements with Vitamin C (orange juice) to increase absorption. Use a straw to prevent teeth staining. Stools will turn black/tarry (normal).", category: "Hematology" },
  { id: "qs16", front: "Intussusception", back: "Telescoping of the bowel. Classic signs: Sudden severe abdominal pain (knees to chest), 'sausage-shaped' abdominal mass, and 'currant jelly' stools.", category: "GI" },
  { id: "qs17", front: "Cholecystitis", back: "Inflammation of the gallbladder. Signs: RUQ pain radiating to right shoulder/scapula, Murphy's sign (pain on inspiration with palpation), triggered by fatty meals.", category: "GI" },
  { id: "qs18", front: "Rheumatic Fever", back: "Inflammatory disease following untreated Strep throat (Group A Beta-hemolytic Streptococcus). Can cause carditis and permanent heart valve damage.", category: "Cardiovascular" },
  { id: "qs19", front: "Phenytoin (Dilantin)", back: "Anticonvulsant. Therapeutic range: 10-20 mcg/mL. Side effects: Gingival hyperplasia (need dental care). Toxicity: Ataxia, nystagmus, slurred speech.", category: "Pharmacology" },
  { id: "qs20", front: "Tetralogy of Fallot (Tet Spell)", back: "Acute cyanotic episode. Priority action: Place the infant in a knee-chest position to increase systemic vascular resistance.", category: "Pediatrics" },
  { id: "qs21", front: "Osteoporosis Safety", back: "Focus on fall prevention, weight-bearing exercise (walking), and adequate Calcium/Vitamin D intake.", category: "Musculoskeletal" },
];

export default function PublicFlashcards() {
  const { t } = useI18n();
  const { user, effectiveTier } = useAuth();
  const [, setLocation] = useLocation();
  type PublicFlashcardView = "landing" | "quick-study" | "decks" | "deck-view" | "deck-edit" | "deck-study-learn" | "deck-study-test" | "deck-report";
  const [view, setView] = useState<PublicFlashcardView>("landing");
  const setViewCallback = useCallback((v: string) => setView(v as PublicFlashcardView), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [quickStudyIndex, setQuickStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const [myDecks, setMyDecks] = useState<DeckRecord[]>([]);
  const [publicDecks, setPublicDecks] = useState<DeckRecord[]>([]);
  const [savedDecksList, setSavedDecksList] = useState<DeckRecord[]>([]);
  const [currentDeck, setCurrentDeck] = useState<DeckRecord | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCardRecord[]>([]);
  const [deckLoading, setDeckLoading] = useState(false);
  const [entitlement, setEntitlement] = useState<DeckEntitlement>({ isPremium: false, totalFreeCards: 0, limit: 50, percentage: 0 });
  const [deckTab, setDeckTab] = useState("my");
  const [deckSearchQuery, setDeckSearchQuery] = useState("");
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [newDeckVisibility, setNewDeckVisibility] = useState("private");
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardRationale, setNewCardRationale] = useState("");
  const [newCardClinicalPearl, setNewCardClinicalPearl] = useState("");
  const [aiCheckResult, setAiCheckResult] = useState<{ valid: boolean; suggestions?: string[] } | null>(null);
  const [aiChecking, setAiChecking] = useState(false);
  const [csvImportText, setCsvImportText] = useState("");
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [aiGeneratePrompt, setAiGeneratePrompt] = useState("");
  const [aiGenerateCount, setAiGenerateCount] = useState(10);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiGeneratedCards, setAiGeneratedCards] = useState<{front: string; back: string; rationale: string; clinicalPearl?: string}[]>([]);
  const [aiUpgradeRequired, setAiUpgradeRequired] = useState(false);
  const [deckStudyIndex, setDeckStudyIndex] = useState(0);
  const [deckStudyFlipped, setDeckStudyFlipped] = useState(false);
  const [deckStudyCorrect, setDeckStudyCorrect] = useState(0);
  const [deckStudyIncorrect, setDeckStudyIncorrect] = useState(0);
  const [deckStudyQueue, setDeckStudyQueue] = useState<DeckCardRecord[]>([]);
  const [deckStudyComplete, setDeckStudyComplete] = useState(false);
  const [deckStudyStartTime, setDeckStudyStartTime] = useState(0);
  const [deckStudyMissed, setDeckStudyMissed] = useState<string[]>([]);
  const flashcardCheckpointRef = useRef<ReturnType<typeof createCheckpointManager> | null>(null);
  const flashcardStateRef = useRef({ quickStudyIndex, masteredIds, view, deckStudyIndex, deckStudyCorrect, deckStudyIncorrect });
  flashcardStateRef.current = { quickStudyIndex, masteredIds, view, deckStudyIndex, deckStudyCorrect, deckStudyIncorrect };

  useEffect(() => {
    if (view !== "quick-study" && view !== "deck-study-learn" && view !== "deck-study-test") {
      flashcardCheckpointRef.current?.stopAutoSave();
      return;
    }
    const deckId = currentDeck?.id || "quick";
    const sessionId = `flashcard-${view}-${deckId}`;
    const mgr = createCheckpointManager("flashcard-study", sessionId);
    flashcardCheckpointRef.current = mgr;
    mgr.startAutoSave(() => {
      const s = flashcardStateRef.current;
      return {
        currentIndex: view === "quick-study" ? s.quickStudyIndex : s.deckStudyIndex,
        answers: {
          mastered: Array.from(s.masteredIds),
          correct: s.deckStudyCorrect,
          incorrect: s.deckStudyIncorrect,
        },
        timeSpent: 0,
        metadata: { view: s.view },
      };
    });
    return () => { mgr.stopAutoSave(); };
  }, [view]);

  const isPaid = user && effectiveTier !== "free" && (user.subscriptionStatus === "active" || (user.tier === "admin" && effectiveTier !== "free"));

  const fetchMyDecks = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/decks?userId=${user.id}`);
      if (res.ok) setMyDecks(await res.json());
    } catch {}
  }, [user?.id]);

  const fetchPublicDecks = useCallback(async () => {
    try {
      const res = await fetch("/api/decks/public");
      if (res.ok) setPublicDecks(await res.json());
    } catch {}
  }, []);

  const fetchSavedDecks = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/decks/saved?userId=${user.id}`);
      if (res.ok) setSavedDecksList(await res.json());
    } catch {}
  }, [user?.id]);

  const fetchDeckCards = useCallback(async (deckId: string) => {
    setDeckLoading(true);
    try {
      const res = await fetch(`/api/decks/${deckId}/cards?userId=${user?.id || ""}`);
      if (res.ok) setDeckCards(await res.json());
    } catch {}
    setDeckLoading(false);
  }, [user?.id]);

  const fetchEntitlement = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/decks/entitlement?userId=${user.id}`);
      if (res.ok) setEntitlement(await res.json());
    } catch {}
  }, [user?.id]);

  const createDeck = useCallback(async () => {
    if (!user?.id || !newDeckTitle.trim()) return;
    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title: newDeckTitle, description: newDeckDescription, visibility: newDeckVisibility }),
      });
      if (res.ok) {
        const deck = await res.json();
        setMyDecks(prev => [deck, ...prev]);
        setCurrentDeck(deck);
        setDeckCards([]);
        setNewDeckTitle("");
        setNewDeckDescription("");
        setView("deck-edit");
      }
    } catch {}
  }, [user?.id, newDeckTitle, newDeckDescription, newDeckVisibility]);

  const addCardToDeck = useCallback(async (front?: string, back?: string) => {
    if (!currentDeck || !user?.id) return;
    const f = front || newCardFront.trim();
    const b = back || newCardBack.trim();
    if (!f || !b) return;
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, front: f, back: b, rationale: newCardRationale, clinicalPearl: newCardClinicalPearl }),
      });
      if (res.ok) {
        fetchDeckCards(currentDeck.id);
        setNewCardFront("");
        setNewCardBack("");
        setNewCardRationale("");
        setNewCardClinicalPearl("");
      }
    } catch {}
  }, [currentDeck, user?.id, newCardFront, newCardBack, newCardRationale, newCardClinicalPearl, fetchDeckCards]);

  const deleteDeckCard = useCallback(async (cardId: string) => {
    if (!currentDeck || !user?.id) return;
    try {
      await fetch(`/api/decks/${currentDeck.id}/cards/${cardId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) });
      fetchDeckCards(currentDeck.id);
    } catch {}
  }, [currentDeck, user?.id, fetchDeckCards]);

  const deleteDeck = useCallback(async (deckId: string) => {
    if (!user?.id) return;
    try {
      await fetch(`/api/decks/${deckId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) });
      setMyDecks(prev => prev.filter(d => d.id !== deckId));
      setView("decks");
    } catch {}
  }, [user?.id]);

  const saveDeck = useCallback(async (deckId: string) => {
    if (!user?.id) return;
    try { await fetch(`/api/decks/${deckId}/save`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) }); fetchSavedDecks(); } catch {}
  }, [user?.id, fetchSavedDecks]);

  const duplicateDeck = useCallback(async (deckId: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/decks/${deckId}/duplicate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) });
      if (res.ok) fetchMyDecks();
    } catch {}
  }, [user?.id, fetchMyDecks]);

  const reportDeck = useCallback(async (deckId: string, reason: string) => {
    try { await fetch(`/api/decks/${deckId}/report`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user?.id, reason }) }); } catch {}
  }, [user?.id]);

  const validTestBankSlugs = ["rpn", "rn", "np", "rrt", "paramedic", "pharmacy-tech", "mlt", "imaging", "critical-care", "emergency-nursing", "perioperative", "oncology-nursing", "pediatric-cert", "psychotherapist", "social-worker", "addictions-counsellor"];
  const testBankSlug = effectiveTier && validTestBankSlugs.includes(effectiveTier) ? effectiveTier : "rpn";

  const aiCheckCard = useCallback(async () => {
    setLocation(`/${testBankSlug}/test-bank`);
  }, [testBankSlug, setLocation]);
  const handleCsvImport = useCallback(async () => {
    setLocation(`/${testBankSlug}/test-bank`);
  }, [testBankSlug, setLocation]);

  const startDeckStudy = useCallback((mode: "learn" | "test") => {
    if (!deckCards.length) return;
    const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
    setDeckStudyQueue(shuffled);
    setDeckStudyIndex(0);
    setDeckStudyFlipped(false);
    setDeckStudyCorrect(0);
    setDeckStudyIncorrect(0);
    setDeckStudyComplete(false);
    setDeckStudyStartTime(Date.now());
    setDeckStudyMissed([]);
    setView(mode === "learn" ? "deck-study-learn" : "deck-study-test");
  }, [deckCards]);

  const handleDeckStudyAnswer = useCallback((correct: boolean) => {
    if (correct) setDeckStudyCorrect(prev => prev + 1);
    else {
      setDeckStudyIncorrect(prev => prev + 1);
      const card = deckStudyQueue[deckStudyIndex];
      if (card) setDeckStudyMissed(prev => [...prev, card.id]);
    }
    if (deckStudyIndex + 1 >= deckStudyQueue.length) {
      setDeckStudyComplete(true);
      setView("deck-report");
    } else {
      setDeckStudyIndex(prev => prev + 1);
      setDeckStudyFlipped(false);
    }
  }, [deckStudyIndex, deckStudyQueue]);

  const aiGenerateCards = useCallback(async () => {
    setLocation(`/${testBankSlug}/test-bank`);
  }, [testBankSlug, setLocation]);
  const addAiGeneratedCards = useCallback(async () => {
    setLocation(`/${testBankSlug}/test-bank`);
  }, [testBankSlug, setLocation]);
  const removeAiGeneratedCard = useCallback((index: number) => {
    setAiGeneratedCards(prev => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "decks") {
      setView("decks");
      fetchMyDecks();
      fetchPublicDecks();
      fetchEntitlement();
    }
  }, []);

  const filteredQuickStudyCards = useMemo(() => {
    let cards = QUICK_STUDY_CARDS;
    if (selectedTopic) {
      cards = cards.filter(c => c.category === selectedTopic);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(c => c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }
    return cards;
  }, [selectedTopic, searchQuery]);

  if (view === "decks") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => setView("landing")} data-testid="button-back-landing">
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </Button>
          <DeckHub
            user={user}
            isPaid={!!isPaid}
            setView={setViewCallback}
            setLocation={setLocation}
            myDecks={myDecks}
            setMyDecks={setMyDecks}
            publicDecks={publicDecks}
            savedDecksList={savedDecksList}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            deckLoading={deckLoading}
            entitlement={entitlement}
            deckTab={deckTab}
            setDeckTab={setDeckTab}
            deckSearchQuery={deckSearchQuery}
            setDeckSearchQuery={setDeckSearchQuery}
            fetchMyDecks={fetchMyDecks}
            fetchPublicDecks={fetchPublicDecks}
            fetchSavedDecks={fetchSavedDecks}
            fetchDeckCards={fetchDeckCards}
            fetchEntitlement={fetchEntitlement}
            createDeck={createDeck}
            deleteDeck={deleteDeck}
            saveDeck={saveDeck}
            duplicateDeck={duplicateDeck}
            newDeckTitle={newDeckTitle}
            setNewDeckTitle={setNewDeckTitle}
            newDeckDescription={newDeckDescription}
            setNewDeckDescription={setNewDeckDescription}
            newDeckVisibility={newDeckVisibility}
            setNewDeckVisibility={setNewDeckVisibility}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-view") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <DeckView
            user={user}
            isPaid={!!isPaid}
            setView={setViewCallback}
            setLocation={setLocation}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            deckLoading={deckLoading}
            fetchDeckCards={fetchDeckCards}
            startDeckStudy={startDeckStudy}
            saveDeck={saveDeck}
            duplicateDeck={duplicateDeck}
            reportDeck={reportDeck}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-edit") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <DeckEditor
            user={user}
            isPaid={!!isPaid}
            setView={setViewCallback}
            setLocation={setLocation}
            currentDeck={currentDeck}
            setCurrentDeck={setCurrentDeck}
            deckCards={deckCards}
            setDeckCards={setDeckCards}
            deckLoading={deckLoading}
            entitlement={entitlement}
            fetchDeckCards={fetchDeckCards}
            fetchEntitlement={fetchEntitlement}
            addCardToDeck={addCardToDeck}
            deleteDeckCard={deleteDeckCard}
            deleteDeck={deleteDeck}
            newCardFront={newCardFront}
            setNewCardFront={setNewCardFront}
            newCardBack={newCardBack}
            setNewCardBack={setNewCardBack}
            newCardRationale={newCardRationale}
            setNewCardRationale={setNewCardRationale}
            newCardClinicalPearl={newCardClinicalPearl}
            setNewCardClinicalPearl={setNewCardClinicalPearl}
            aiCheckResult={aiCheckResult}
            aiChecking={aiChecking}
            aiCheckCard={aiCheckCard}
            csvImportText={csvImportText}
            setCsvImportText={setCsvImportText}
            showCsvImport={showCsvImport}
            setShowCsvImport={setShowCsvImport}
            handleCsvImport={handleCsvImport}
            aiGeneratePrompt={aiGeneratePrompt}
            setAiGeneratePrompt={setAiGeneratePrompt}
            aiGenerateCount={aiGenerateCount}
            setAiGenerateCount={setAiGenerateCount}
            aiGenerating={aiGenerating}
            aiGeneratedCards={aiGeneratedCards}
            aiGenerateCards={aiGenerateCards}
            addAiGeneratedCards={addAiGeneratedCards}
            removeAiGeneratedCard={removeAiGeneratedCard}
            aiUpgradeRequired={aiUpgradeRequired}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-study-learn") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <DeckStudyLearn
            user={user}
            setView={setViewCallback}
            deckStudyQueue={deckStudyQueue}
            deckStudyIndex={deckStudyIndex}
            deckStudyFlipped={deckStudyFlipped}
            setDeckStudyFlipped={setDeckStudyFlipped}
            handleDeckStudyAnswer={handleDeckStudyAnswer}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-study-test") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <DeckStudyTest
            user={user}
            setView={setViewCallback}
            deckStudyQueue={deckStudyQueue}
            deckStudyIndex={deckStudyIndex}
            deckStudyFlipped={deckStudyFlipped}
            setDeckStudyFlipped={setDeckStudyFlipped}
            handleDeckStudyAnswer={handleDeckStudyAnswer}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "deck-report") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
          <DeckReportCard
            user={user}
            setView={setViewCallback}
            deckStudyCorrect={deckStudyCorrect}
            deckStudyIncorrect={deckStudyIncorrect}
            deckStudyQueue={deckStudyQueue}
            deckStudyStartTime={deckStudyStartTime}
            deckStudyMissed={deckStudyMissed}
            startDeckStudy={startDeckStudy}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === "quick-study") {
    const cards = filteredQuickStudyCards;
    const currentCard = cards[quickStudyIndex];

    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
        <Navigation />
        <SEO title={t("pages.publicFlashcards.studyFlashcardsNursenest")} description={t("pages.publicFlashcards.quickStudyFlashcardsForNursing")} />
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">
          <Button variant="ghost" className="mb-6 gap-2" onClick={() => { setView("landing"); setQuickStudyIndex(0); setIsFlipped(false); }} data-testid="button-back-flashcards">
            <ArrowLeft className="w-4 h-4" /> Back to Flashcards
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-1" data-testid="text-quick-study-title">{t("pages.publicFlashcards.quickStudy")}</h1>
            <p className="text-sm text-slate-500">
              {selectedTopic ? `${selectedTopic} - ` : ""}{quickStudyIndex + 1} of {cards.length} cards
              {masteredIds.size > 0 && <span className="ml-2 text-emerald-600">{masteredIds.size} mastered</span>}
            </p>
          </div>

          {currentCard ? (
            <div className="space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={cn(
                  "min-h-[300px] sm:min-h-[360px] cursor-pointer select-none rounded-2xl shadow-lg border-0 flex flex-col items-center justify-center p-8 sm:p-12 text-center transition-all duration-300",
                  isFlipped
                    ? "bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white shadow-xl shadow-primary/20"
                    : "bg-white hover:shadow-xl"
                )}
                data-testid="card-flashcard"
              >
                <Badge variant="outline" className={cn("mb-4 text-xs", isFlipped ? "border-white/30 text-white/80" : "border-primary/20 text-primary")}>
                  {currentCard.category}
                </Badge>
                {isFlipped ? (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-3 opacity-60">{t("pages.publicFlashcards.answer")}</p>
                    <p className="text-lg sm:text-xl leading-relaxed font-medium" data-testid="text-card-back">{currentCard.back}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-3 text-slate-400">{t("pages.publicFlashcards.tapToFlip")}</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-800" data-testid="text-card-front">{currentCard.front}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2"
                  disabled={quickStudyIndex === 0}
                  onClick={() => { setQuickStudyIndex(prev => prev - 1); setIsFlipped(false); }}
                  data-testid="button-prev-card"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                <Button
                  variant={masteredIds.has(currentCard.id) ? "default" : "outline"}
                  className={cn("rounded-xl gap-2", masteredIds.has(currentCard.id) && "bg-emerald-500 hover:bg-emerald-600")}
                  onClick={() => {
                    setMasteredIds(prev => {
                      const next = new Set(prev);
                      if (next.has(currentCard.id)) next.delete(currentCard.id);
                      else next.add(currentCard.id);
                      return next;
                    });
                  }}
                  data-testid="button-mark-mastered"
                >
                  <CheckCircle2 className="w-4 h-4" /> {masteredIds.has(currentCard.id) ? "Mastered" : "Mark Mastered"}
                </Button>
                <Button
                  className="rounded-xl gap-2"
                  disabled={quickStudyIndex >= cards.length - 1}
                  onClick={() => { setQuickStudyIndex(prev => prev + 1); setIsFlipped(false); }}
                  data-testid="button-next-card"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" className="text-xs gap-2" onClick={() => { setQuickStudyIndex(0); setIsFlipped(false); setMasteredIds(new Set()); }} data-testid="button-restart">
                  <RotateCcw className="w-3 h-3" /> Restart
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">{t("pages.publicFlashcards.noCardsMatchYourFilters")}</p>
              <Button variant="outline" className="rounded-xl" onClick={() => { setSelectedTopic(null); setSearchQuery(""); }} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-white to-blue-50/20 flex flex-col font-sans">
      <Navigation />
      <SEO
        title={t("pages.publicFlashcards.flashcardsStudyNursingConceptsNursenest")}
        description={t("pages.publicFlashcards.freeNursingFlashcardsForQuick")}
        keywords="nursing flashcards, study cards, nursing concepts, free flashcards, study decks, nursing terms"
        canonicalPath="/flashcards"
      />

      <main className="flex-1">
        <section className="relative overflow-hidden" data-testid="section-flashcards-hero">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-100/20 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
            <div className="max-w-5xl mb-4">
              <BreadcrumbNav />
            </div>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6" data-testid="badge-flashcards-public">
                <Layers className="w-3.5 h-3.5" />
                Free for Everyone
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-800 tracking-tight leading-[1.15] mb-5" data-testid="text-flashcard-heading">
                Flashcards for Quick Concept Review
              </h1>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed mb-8 max-w-xl" data-testid="text-flashcard-subheading">
                Simple, effective flashcards to reinforce nursing concepts. Browse by topic, create your own decks, or study with pre-built card sets.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-13 shadow-lg shadow-primary/20 gap-2"
                  onClick={() => {
                    setQuickStudyIndex(0);
                    setIsFlipped(false);
                    setMasteredIds(new Set());
                    setView("quick-study");
                  }}
                  data-testid="button-start-studying"
                >
                  <BookOpen className="w-4 h-4" />
                  Start Studying
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-primary/20 text-primary hover:bg-primary/5 font-medium px-7 h-13 gap-2"
                  onClick={() => {
                    setView("decks");
                    fetchMyDecks();
                    fetchPublicDecks();
                    fetchEntitlement();
                  }}
                  data-testid="button-browse-decks"
                >
                  <Layers className="w-4 h-4" />
                  Browse Decks
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-b" data-testid="section-topic-browse">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3" data-testid="text-explore-topics">{t("pages.publicFlashcards.exploreTopics")}</h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Browse flashcards by body system or specialty area. Select a topic to start reviewing.
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={t("pages.publicFlashcards.searchFlashcardsByTermOr")}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus:border-primary"
                  data-testid="input-search-flashcards"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {FLASHCARD_TOPICS.map(topic => {
                const Icon = topic.icon;
                const cardCount = QUICK_STUDY_CARDS.filter(c => c.category === topic.name).length;
                const isSelected = selectedTopic === topic.name;
                return (
                  <button
                    key={topic.name}
                    onClick={() => {
                      setSelectedTopic(isSelected ? null : topic.name);
                      if (!isSelected) {
                        setQuickStudyIndex(0);
                        setIsFlipped(false);
                        setMasteredIds(new Set());
                        setView("quick-study");
                      }
                    }}
                    className={cn(
                      "group p-4 rounded-2xl border transition-all text-left hover:shadow-md",
                      isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 bg-white hover:border-primary/30"
                    )}
                    data-testid={`card-topic-${topic.name.toLowerCase().replace(/[\s\/]+/g, "-")}`}
                  >
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", topic.color.split(" ")[0])}>
                      <Icon className={cn("w-4 h-4", topic.color.split(" ")[1])} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-0.5">{topic.name}</p>
                    {cardCount > 0 && (
                      <p className="text-[11px] text-slate-400">{cardCount} cards</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-b from-white to-primary/5" data-testid="section-study-modes">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{t("pages.publicFlashcards.studyYourWay")}</h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Choose how you want to study - simple card review, deck-based learning, or create your own study materials.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <button
                onClick={() => {
                  setQuickStudyIndex(0);
                  setIsFlipped(false);
                  setView("quick-study");
                }}
                className="group p-6 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white hover:shadow-lg hover:border-blue-200 transition-all text-left"
                data-testid="card-mode-review"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{t("pages.publicFlashcards.reviewMode")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Flip through cards at your own pace. Simple term-definition review for quick concept recall.
                </p>
              </button>

              <button
                onClick={() => {
                  setView("decks");
                  fetchMyDecks();
                  fetchPublicDecks();
                  fetchEntitlement();
                }}
                className="group p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-white hover:shadow-lg hover:border-primary/30 transition-all text-left"
                data-testid="card-mode-decks"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{t("pages.publicFlashcards.studyDecks")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse shared decks, save favorites, or create your own custom study decks.
                </p>
              </button>

              <button
                onClick={() => {
                  if (!user) { setLocation("/login"); return; }
                  setView("decks");
                  fetchMyDecks();
                  fetchPublicDecks();
                  fetchEntitlement();
                }}
                className="group p-6 rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white hover:shadow-lg hover:border-emerald-200 transition-all text-left"
                data-testid="card-mode-create"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{t("pages.publicFlashcards.createDeck")}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Build your own flashcard deck manually, from notes, or generate cards automatically.
                </p>
              </button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-primary/5" data-testid="section-test-bank-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-8 sm:p-10">
              <GraduationCap className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">{t("pages.publicFlashcards.lookingForExamstylePractice")}</h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
                Our Test Bank offers clinical scenario questions with full rationales, distractor analysis, adaptive difficulty, and tier-calibrated exam preparation for RPN, RN, and NP.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <LocaleLink href="/rpn/test-bank">
                  <Button variant="outline" className="rounded-xl gap-2" data-testid="button-rpn-testbank">
                    RPN Test Bank
                  </Button>
                </LocaleLink>
                <LocaleLink href="/rn/test-bank">
                  <Button variant="outline" className="rounded-xl gap-2" data-testid="button-rn-testbank">
                    RN Test Bank
                  </Button>
                </LocaleLink>
                <LocaleLink href="/np/test-bank">
                  <Button variant="outline" className="rounded-xl gap-2" data-testid="button-np-testbank">
                    NP Test Bank
                  </Button>
                </LocaleLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

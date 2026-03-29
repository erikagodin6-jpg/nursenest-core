import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, ChevronLeft, ChevronDown, ArrowLeft, Plus, Search, Trash2, Pencil, Loader2,
  BookOpen, Layers, Copy, Flag, Globe, EyeOff, Eye, Timer, Upload,
  Download, BarChart3, Sparkles, Lock, CreditCard, CheckCircle2,
  XCircle, RefreshCw, Share2, Home, ArrowUpDown, Users, Link2,
  SortAsc, SortDesc, Clock, Hash, AlignLeft, Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useI18n } from "@/lib/i18n";
type DeckViewsProps = {
  user: any;
  isPaid: boolean;
  view: string;
  setView: (v: any) => void;
  setLocation: (l: string) => void;
  myDecks: any[];
  setMyDecks: (d: any) => void;
  publicDecks: any[];
  savedDecksList: any[];
  currentDeck: any;
  setCurrentDeck: (d: any) => void;
  deckCards: any[];
  setDeckCards: (c: any) => void;
  deckLoading: boolean;
  entitlement: any;
  deckTab: string;
  setDeckTab: (t: any) => void;
  deckSearchQuery: string;
  setDeckSearchQuery: (s: string) => void;
  fetchMyDecks: () => void;
  fetchPublicDecks: () => void;
  fetchSavedDecks: () => void;
  fetchDeckCards: (id: string) => void;
  fetchEntitlement: () => void;
  createDeck: () => void;
  addCardToDeck: (f?: string, b?: string) => void;
  deleteDeckCard: (id: string) => void;
  deleteDeck: (id: string) => void;
  startDeckStudy: (mode: "learn" | "test") => void;
  handleDeckStudyAnswer: (correct: boolean) => void;
  saveDeck: (id: string) => void;
  duplicateDeck: (id: string) => void;
  reportDeck: (id: string, reason: string) => void;
  aiCheckCard: () => void;
  handleCsvImport: () => void;
  newDeckTitle: string;
  setNewDeckTitle: (s: string) => void;
  newDeckDescription: string;
  setNewDeckDescription: (s: string) => void;
  newDeckVisibility: string;
  setNewDeckVisibility: (s: string) => void;
  newCardFront: string;
  setNewCardFront: (s: string) => void;
  newCardBack: string;
  setNewCardBack: (s: string) => void;
  newCardRationale: string;
  setNewCardRationale: (s: string) => void;
  newCardClinicalPearl: string;
  setNewCardClinicalPearl: (s: string) => void;
  aiCheckResult: any;
  aiChecking: boolean;
  csvImportText: string;
  setCsvImportText: (s: string) => void;
  showCsvImport: boolean;
  setShowCsvImport: (b: boolean) => void;
  aiGeneratePrompt: string;
  setAiGeneratePrompt: (s: string) => void;
  aiGenerateCount: number;
  setAiGenerateCount: (n: number) => void;
  aiGenerating: boolean;
  aiGeneratedCards: {front: string; back: string; rationale: string; clinicalPearl?: string}[];
  aiGenerateCards: () => void;
  addAiGeneratedCards: () => void;
  removeAiGeneratedCard: (index: number) => void;
  aiUpgradeRequired: boolean;
  deckStudyIndex: number;
  deckStudyFlipped: boolean;
  setDeckStudyFlipped: (b: boolean) => void;
  deckStudyCorrect: number;
  deckStudyIncorrect: number;
  deckStudyQueue: any[];
  deckStudyComplete: boolean;
  deckStudyStartTime: number;
  deckStudyMissed: string[];
};

type DeckSortOption = "newest" | "oldest" | "alpha-asc" | "alpha-desc" | "cards-most" | "cards-least";

function sortDecks(decks: any[], sortBy: DeckSortOption): any[] {

  const sorted = [...decks];
  switch (sortBy) {
    case "newest": return sorted.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    case "oldest": return sorted.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    case "alpha-asc": return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    case "alpha-desc": return sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    case "cards-most": return sorted.sort((a, b) => (b.cardCount || 0) - (a.cardCount || 0));
    case "cards-least": return sorted.sort((a, b) => (a.cardCount || 0) - (b.cardCount || 0));
    default: return sorted;
  }
}

const SORT_OPTIONS: { value: DeckSortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "alpha-asc", label: "A to Z" },
  { value: "alpha-desc", label: "Z to A" },
  { value: "cards-most", label: "Most Cards" },
  { value: "cards-least", label: "Fewest Cards" },
];

export function DeckHub({
  user, isPaid, setView, setLocation, myDecks, setMyDecks, publicDecks, savedDecksList,
  currentDeck, setCurrentDeck, deckCards, setDeckCards, deckLoading, entitlement,
  deckTab, setDeckTab, deckSearchQuery, setDeckSearchQuery,
  fetchMyDecks, fetchPublicDecks, fetchSavedDecks, fetchDeckCards, fetchEntitlement,
  createDeck, deleteDeck, saveDeck, duplicateDeck,
  newDeckTitle, setNewDeckTitle, newDeckDescription, setNewDeckDescription,
  newDeckVisibility, setNewDeckVisibility,
}: Partial<DeckViewsProps> & { user: any; setView: any; setLocation: any }) {
  const { t } = useI18n();
  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<"manual" | "ai" | "notes">("ai");
  const [deckSortBy, setDeckSortBy] = useState<DeckSortOption>("newest");
  const [showStudyGroupPanel, setShowStudyGroupPanel] = useState(false);
  const [studyGroups, setStudyGroups] = useState<any[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<Record<string, any[]>>({});
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const fetchStudyGroups = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/study-groups/user/${user.id}`);
      if (res.ok) { const data = await res.json(); setStudyGroups(data); }
    } catch (err: any) {
      console.warn("[DeckViews] fetchStudyGroups failed:", err.message);
    }
  }, [user?.id]);

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const res = await fetch(`/api/study-groups/${groupId}/members`);
      if (res.ok) { const data = await res.json(); setGroupMembers(prev => ({ ...prev, [groupId]: data })); }
    } catch (err: any) {
      console.warn("[DeckViews] fetchGroupMembers failed:", err.message);
    }
  };

  const createStudyGroup = async () => {
    if (!newGroupName.trim() || !user?.id) return;
    setGroupLoading(true);
    try {
      const res = await fetch("/api/study-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName.trim(), userId: user.id }),
      });
      if (res.ok) { setNewGroupName(""); fetchStudyGroups(); }
    } catch (err: any) {
      console.warn("[DeckViews] createStudyGroup failed:", err.message);
    }
    setGroupLoading(false);
  };

  const joinStudyGroup = async () => {
    if (!joinCode.trim() || !user?.id) return;
    setGroupLoading(true);
    try {
      const res = await fetch("/api/study-groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: joinCode.trim().toUpperCase(), userId: user.id }),
      });
      if (res.ok) { setJoinCode(""); fetchStudyGroups(); }
    } catch (err: any) {
      console.warn("[DeckViews] joinStudyGroup failed:", err.message);
    }
    setGroupLoading(false);
  };

  const copyInviteLink = (code: string) => {
    const url = `${window.location.origin}/en/flashcards?join=${code}`;
    navigator.clipboard.writeText(url).then(() => { setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => { setCopiedCode(code); setTimeout(() => setCopiedCode(null), 2000); });
  };

  useEffect(() => { if (showStudyGroupPanel && user?.id) fetchStudyGroups(); }, [showStudyGroupPanel, user?.id]);
  const [aiTopic, setAiTopic] = useState("");
  const [aiCardCount, setAiCardCount] = useState(10);
  const [aiCreating, setAiCreating] = useState(false);
  const [aiPreviewCards, setAiPreviewCards] = useState<{front: string; back: string; rationale: string}[]>([]);
  const [aiError, setAiError] = useState("");
  const [notesText, setNotesText] = useState("");
  const [notesCardCount, setNotesCardCount] = useState(15);
  const [notesFileName, setNotesFileName] = useState("");

  const handleCreateWithAI = async () => {
    if (!user || !aiTopic.trim()) return;
    setAiCreating(true);
    setAiError("");
    setAiPreviewCards([]);
    try {
      const title = aiTopic.trim().length > 60 ? aiTopic.trim().substring(0, 60) : aiTopic.trim();
      const deckRes = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title, description: aiTopic, visibility: newDeckVisibility || "private" }),
      });
      if (!deckRes.ok) { setAiError("Failed to create deck."); return; }
      const deck = await deckRes.json();

      const genRes = await fetch(`/api/decks/${deck.id}/ai-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, prompt: aiTopic, count: aiCardCount }),
      });
      if (!genRes.ok) {
        let err: any = {};
        try { err = await genRes.json(); } catch { err = { error: `Server returned status ${genRes.status}` }; }
        if (err.upgradeRequired) {
          setAiError("You've reached the free card limit. Upgrade to create more cards automatically.");
        } else {
          setAiError(err.error || "AI generation failed. Try again.");
        }
        setMyDecks?.((prev: any) => [deck, ...prev]);
        setCurrentDeck?.(deck);
        setDeckCards?.([]);
        setView("deck-edit");
        setShowCreate(false);
        return;
      }
      const data = await genRes.json();
      const cards = data.cards || [];

      if (cards.length > 0) {
        const bulkRes = await fetch(`/api/decks/${deck.id}/cards/bulk-import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, cards }),
        });
        if (bulkRes.ok) {
          const result = await bulkRes.json();
          setMyDecks?.((prev: any) => [deck, ...prev]);
          setCurrentDeck?.(deck);
          fetchDeckCards?.(deck.id);
          fetchEntitlement?.();
          setView("deck-view");
          setShowCreate(false);
          setAiTopic("");
        }
      } else {
        setAiError("AI didn't generate any cards. Try a more specific topic.");
        setMyDecks?.((prev: any) => [deck, ...prev]);
        setCurrentDeck?.(deck);
        setDeckCards?.([]);
        setView("deck-edit");
        setShowCreate(false);
      }
    } catch (e: any) {
      console.error("AI deck creation error:", e);
      setAiError(e.message && e.message !== "Failed to fetch" 
        ? `Generation error: ${e.message}` 
        : "Could not connect to the service. Please try again in a moment.");
    } finally {
      setAiCreating(false);
    }
  };

  const handleCreateFromNotes = async () => {
    if (!user || !notesText.trim()) return;
    setAiCreating(true);
    setAiError("");
    try {
      const title = notesFileName
        ? notesFileName.replace(/\.[^.]+$/, "").substring(0, 60)
        : `Notes Deck - ${new Date().toLocaleDateString()}`;
      const deckRes = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title, description: `Study notes: ${notesFileName || "pasted content"}`, visibility: newDeckVisibility || "private" }),
      });
      if (!deckRes.ok) { setAiError("Failed to create deck."); return; }
      const deck = await deckRes.json();

      const genRes = await fetch(`/api/decks/${deck.id}/ai-generate-from-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, notes: notesText, count: notesCardCount }),
      });
      if (!genRes.ok) {
        const err = await genRes.json();
        if (err.upgradeRequired) {
          setAiError("You've reached the free card limit. Upgrade to create more cards automatically.");
        } else {
          setAiError(err.error || "AI generation from notes failed. Try again.");
        }
        setMyDecks?.((prev: any) => [deck, ...prev]);
        setCurrentDeck?.(deck);
        setDeckCards?.([]);
        setView("deck-edit");
        setShowCreate(false);
        return;
      }
      const data = await genRes.json();
      const cards = data.cards || [];

      if (cards.length > 0) {
        const bulkRes = await fetch(`/api/decks/${deck.id}/cards/bulk-import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, cards }),
        });
        if (bulkRes.ok) {
          setMyDecks?.((prev: any) => [deck, ...prev]);
          setCurrentDeck?.(deck);
          fetchDeckCards?.(deck.id);
          fetchEntitlement?.();
          setView("deck-view");
          setShowCreate(false);
          setNotesText("");
          setNotesFileName("");
        }
      } else {
        setAiError("AI couldn't extract flashcards from your notes. Try adding more detailed content.");
        setMyDecks?.((prev: any) => [deck, ...prev]);
        setCurrentDeck?.(deck);
        setDeckCards?.([]);
        setView("deck-edit");
        setShowCreate(false);
      }
    } catch (e: any) {
      console.error("AI notes deck creation error:", e);
      setAiError(e.message && e.message !== "Failed to fetch" 
        ? `Generation error: ${e.message}` 
        : "Could not connect to the service. Please try again in a moment.");
    } finally {
      setAiCreating(false);
    }
  };

  const handleNotesFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAiError("File too large. Please limit to 5 MB.");
      return;
    }
    const validTypes = [".txt", ".md", ".csv", ".rtf", ".pdf", ".doc", ".docx"];
    const validMimes = ["text/", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validTypes.includes(ext) && !validMimes.some(m => file.type.startsWith(m))) {
      setAiError("Please upload a supported file (.txt, .md, .csv, .rtf, .pdf, .doc, or .docx).");
      return;
    }
    setNotesFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) setNotesText(text);
    };
    reader.readAsText(file);
  };

  const isGuest = !user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-decks-title">{t("components.deckViews.studyDecks")}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isGuest
              ? "Browse public decks or sign up to create your own"
              : entitlement?.isPremium
                ? `Premium - ${entitlement?.totalFreeCards || 0} cards created`
                : `${entitlement?.totalFreeCards || 0} / ${entitlement?.limit || 50} free cards used`
            }
          </p>
        </div>
        {isGuest ? (
          <Button onClick={() => setLocation("/signup")} className="rounded-xl gap-2 shadow-sm" data-testid="button-signup-decks">
            Sign Up to Create Decks
          </Button>
        ) : (
          <Button onClick={() => setShowCreate(!showCreate)} className="rounded-xl gap-2 bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20" data-testid="button-new-deck">
            <Plus className="w-4 h-4" /> New Deck
          </Button>
        )}
      </div>

      {showCreate && !isGuest && (
        <Card className="premium-card border-0 shadow-lg">
          <CardContent className="p-5 space-y-4">
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setCreateMode("ai")}
                className={cn("flex-1 px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
                  createMode === "ai" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/60 hover:bg-secondary/80"
                )}
                data-testid="button-create-mode-ai"
              >
                <Sparkles className="w-3.5 h-3.5" /> Smart Generator
              </button>
              <button
                onClick={() => setCreateMode("notes")}
                className={cn("flex-1 px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
                  createMode === "notes" ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/60 hover:bg-secondary/80"
                )}
                data-testid="button-create-mode-notes"
              >
                <Upload className="w-3.5 h-3.5" /> From Notes
              </button>
              <button
                onClick={() => setCreateMode("manual")}
                className={cn("flex-1 px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors",
                  createMode === "manual" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/80"
                )}
                data-testid="button-create-mode-manual"
              >
                <Plus className="w-3.5 h-3.5" /> Manual
              </button>
            </div>

            {createMode === "ai" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-primary">{t("components.deckViews.smartFlashcardGenerator")}</h3>
                </div>
                <p className="text-xs text-primary/80">{t("components.deckViews.enterAnyNursingTopicAnd")}</p>
                <Input
                  placeholder="e.g., Cardiac medications and their side effects"
                  value={aiTopic}
                  onChange={(e: any) => setAiTopic(e.target.value)}
                  className="rounded-xl border-border focus:border-primary"
                  onKeyDown={(e: any) => { if (e.key === "Enter" && aiTopic.trim() && !aiCreating) handleCreateWithAI(); }}
                  disabled={aiCreating}
                  data-testid="input-ai-topic"
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground">{t("components.deckViews.cards")}</label>
                  <select
                    value={aiCardCount}
                    onChange={(e: any) => setAiCardCount(parseInt(e.target.value))}
                    className="text-xs border rounded-lg px-2 py-1.5 bg-card"
                    data-testid="select-ai-card-count"
                  >
                    {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300].map(n => <option key={n} value={n}>{n}{n > 25 ? " (premium)" : ""} cards</option>)}
                  </select>
                  <div className="flex-1" />
                  <label className="text-xs text-muted-foreground">{t("components.deckViews.visibility")}</label>
                  <div className="flex rounded-lg border overflow-hidden">
                    {[
                      { v: "private", icon: EyeOff, label: "Private" },
                      { v: "public", icon: Globe, label: "Public" },
                    ].map(({ v, icon: Icon, label }) => (
                      <button
                        key={v}
                        onClick={() => setNewDeckVisibility!(v)}
                        className={cn("px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
                          newDeckVisibility === v ? "bg-primary text-primary-foreground" : "bg-card text-foreground/50 hover:bg-secondary"
                        )}
                        data-testid={`button-ai-visibility-${v}`}
                      >
                        <Icon className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                {aiError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" data-testid="text-ai-error">
                    {aiError}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleCreateWithAI}
                    disabled={!aiTopic.trim() || aiCreating}
                    className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
                    data-testid="button-create-ai-deck"
                  >
                    {aiCreating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("components.deckViews.generatingDeck")}</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> {t("components.deckViews.createDeckAutomatically")}</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowCreate(false); setAiError(""); }} className="rounded-xl" disabled={aiCreating}>{t("components.deckViews.cancel")}</Button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    "Cardiac Medications & Side Effects",
                    "Respiratory Assessment Findings",
                    "Diabetes Management Nursing",
                    "Electrolyte Imbalances",
                    "Pediatric Milestones",
                    "Mental Health Medications",
                  ].map(topic => (
                    <button
                      key={topic}
                      onClick={() => setAiTopic(topic)}
                      className="text-[11px] text-left text-primary hover:text-primary/80 hover:bg-secondary rounded-lg px-2.5 py-1.5 border border-border transition-colors"
                      disabled={aiCreating}
                      data-testid={`button-topic-${topic.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ) : createMode === "notes" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-blue-800">{t("components.deckViews.createDeckFromYourNotes")}</h3>
                </div>
                <p className="text-xs text-blue-600">{t("components.deckViews.pasteYourStudyNotesOr")}</p>
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.md,.csv,.rtf,.pdf,.doc,.docx,text/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleNotesFileUpload}
                    className="hidden"
                    id="notes-file-upload"
                    data-testid="input-notes-file"
                  />
                  <label htmlFor="notes-file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-blue-300" />
                    <span className="text-xs text-blue-600 font-medium">{t("components.deckViews.clickToUploadAText")}</span>
                    <span className="text-[10px] text-muted-foreground">{t("components.deckViews.txtMdCsvRtfPdf")}</span>
                  </label>
                  {notesFileName && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg" data-testid="text-notes-filename">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {notesFileName}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -translate-y-1/2">
                    <span className="bg-card px-2 text-[10px] text-foreground/40">{t("components.deckViews.orPasteYourNotesBelow")}</span>
                  </div>
                </div>
                <Textarea
                  placeholder={t("components.deckViews.pasteYourStudyNotesHere")}
                  value={notesText}
                  onChange={(e: any) => setNotesText(e.target.value)}
                  className="rounded-xl min-h-[120px] border-blue-200 focus:border-blue-400 text-sm"
                  data-testid="textarea-notes-content"
                />
                {notesText && (
                  <p className="text-[10px] text-muted-foreground" data-testid="text-notes-char-count">{notesText.length.toLocaleString()} characters</p>
                )}
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground">{t("components.deckViews.cards2")}</label>
                  <select
                    value={notesCardCount}
                    onChange={(e: any) => setNotesCardCount(parseInt(e.target.value))}
                    className="text-xs border rounded-lg px-2 py-1.5 bg-card"
                    data-testid="select-notes-card-count"
                  >
                    {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300].map(n => <option key={n} value={n}>{n}{n > 25 ? " (premium)" : ""} cards</option>)}
                  </select>
                  <div className="flex-1" />
                  <label className="text-xs text-muted-foreground">{t("components.deckViews.visibility2")}</label>
                  <div className="flex rounded-lg border overflow-hidden">
                    {[
                      { v: "private", icon: EyeOff, label: "Private" },
                      { v: "public", icon: Globe, label: "Public" },
                    ].map(({ v, icon: Icon, label }) => (
                      <button
                        key={v}
                        onClick={() => setNewDeckVisibility!(v)}
                        className={cn("px-2.5 py-1 text-xs font-medium flex items-center gap-1 transition-colors",
                          newDeckVisibility === v ? "bg-primary text-primary-foreground" : "bg-card text-foreground/50 hover:bg-secondary"
                        )}
                        data-testid={`button-notes-visibility-${v}`}
                      >
                        <Icon className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                {aiError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" data-testid="text-notes-error">
                    {aiError}
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleCreateFromNotes}
                    disabled={!notesText.trim() || aiCreating}
                    className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700"
                    data-testid="button-create-from-notes"
                  >
                    {aiCreating ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {t("components.deckViews.convertingNotes")}</>
                    ) : (
                      <><Upload className="w-4 h-4" /> {t("components.deckViews.createDeckFromNotes")}</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowCreate(false); setAiError(""); setNotesText(""); setNotesFileName(""); }} className="rounded-xl" disabled={aiCreating}>{t("components.deckViews.cancel2")}</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-foreground/70">{t("components.deckViews.createEmptyDeck")}</h3>
                <Input
                  placeholder={t("components.deckViews.deckTitleEgCardiacMedications")}
                  value={newDeckTitle}
                  onChange={(e: any) => setNewDeckTitle!(e.target.value)}
                  className="rounded-xl"
                  data-testid="input-deck-title"
                />
                <Textarea
                  placeholder={t("components.deckViews.descriptionOptional")}
                  value={newDeckDescription}
                  onChange={(e: any) => setNewDeckDescription!(e.target.value)}
                  className="rounded-xl min-h-[60px]"
                  data-testid="input-deck-description"
                />
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground">{t("components.deckViews.visibility3")}</label>
                  <div className="flex rounded-lg border overflow-hidden">
                    {[
                      { v: "private", icon: EyeOff, label: "Private" },
                      { v: "unlisted", icon: Eye, label: "Unlisted" },
                      { v: "public", icon: Globe, label: "Public" },
                    ].map(({ v, icon: Icon, label }) => (
                      <button
                        key={v}
                        onClick={() => setNewDeckVisibility!(v)}
                        className={cn("px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors",
                          newDeckVisibility === v ? "bg-primary text-primary-foreground" : "bg-card text-foreground/50 hover:bg-secondary"
                        )}
                        data-testid={`button-visibility-${v}`}
                      >
                        <Icon className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button onClick={() => { createDeck!(); setShowCreate(false); }} disabled={!newDeckTitle?.trim()} className="rounded-xl" data-testid="button-create-deck">
                    Create Deck
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">{t("components.deckViews.cancel3")}</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-1 bg-secondary/80 rounded-2xl p-1">
        {(isGuest
          ? ([["browse", "Browse Public"]] as const)
          : ([["my", "My Decks"], ["browse", "Browse Public"], ["saved", "Saved"]] as const)
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setDeckTab!(key);
              if (key === "browse") fetchPublicDecks!();
              if (key === "saved") fetchSavedDecks!();
            }}
            className={cn("flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              deckTab === key ? "bg-card text-foreground shadow-sm" : "text-foreground/60 hover:text-foreground/80"
            )}
            data-testid={`tab-deck-${key}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {deckTab === "browse" && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("components.deckViews.searchPublicDecks")}
              value={deckSearchQuery}
              onChange={(e: any) => setDeckSearchQuery!(e.target.value)}
              onKeyDown={(e: any) => e.key === "Enter" && fetchPublicDecks!()}
              className="pl-10 rounded-xl"
              data-testid="input-search-decks"
            />
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={deckSortBy}
            onChange={(e) => setDeckSortBy(e.target.value as DeckSortOption)}
            className="text-xs border rounded-lg px-2 py-1.5 bg-card text-foreground/70 cursor-pointer"
            data-testid="select-deck-sort"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {user && (
            <Button
              variant={showStudyGroupPanel ? "default" : "outline"}
              size="sm"
              className="rounded-lg gap-1.5 text-xs h-8"
              onClick={() => setShowStudyGroupPanel(!showStudyGroupPanel)}
              data-testid="button-toggle-study-groups"
            >
              <Users className="w-3.5 h-3.5" />
              Study Groups
              {studyGroups.length > 0 && (
                <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0 border-none ml-0.5">{studyGroups.length}</Badge>
              )}
            </Button>
          )}
        </div>
      </div>

      {showStudyGroupPanel && user && (
        <Card className="border-2 border-blue-100 shadow-md">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-blue-900">{t("components.deckViews.studyGroups")}</h3>
              </div>
              <span className="text-[10px] text-muted-foreground">{t("components.deckViews.inviteFriendsToStudyTogether")}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t("components.deckViews.createNewGroup")}</label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t("components.deckViews.groupName")}
                    value={newGroupName}
                    onChange={(e: any) => setNewGroupName(e.target.value)}
                    onKeyDown={(e: any) => e.key === "Enter" && createStudyGroup()}
                    className="rounded-lg text-xs h-8 flex-1"
                    disabled={groupLoading}
                    data-testid="input-group-name"
                  />
                  <Button size="sm" className="rounded-lg h-8 text-xs" onClick={createStudyGroup} disabled={!newGroupName.trim() || groupLoading} data-testid="button-create-group">
                    {groupLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">{t("components.deckViews.joinWithInviteCode")}</label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t("components.deckViews.enterCodeEgB4x9kl")}
                    value={joinCode}
                    onChange={(e: any) => setJoinCode(e.target.value.toUpperCase())}
                    onKeyDown={(e: any) => e.key === "Enter" && joinStudyGroup()}
                    className="rounded-lg text-xs h-8 flex-1 uppercase tracking-widest"
                    maxLength={6}
                    disabled={groupLoading}
                    data-testid="input-join-code"
                  />
                  <Button size="sm" variant="secondary" className="rounded-lg h-8 text-xs" onClick={joinStudyGroup} disabled={!joinCode.trim() || groupLoading} data-testid="button-join-group">
                    Join
                  </Button>
                </div>
              </div>
            </div>

            {studyGroups.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{t("components.deckViews.yourGroups")}</label>
                {studyGroups.map((group: any) => (
                  <div key={group.id} className="bg-secondary rounded-xl border border-border overflow-hidden">
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary transition-colors"
                      onClick={() => {
                        const newId = expandedGroup === group.id ? null : group.id;
                        setExpandedGroup(newId);
                        if (newId && !groupMembers[newId]) fetchGroupMembers(newId);
                      }}
                      data-testid={`group-row-${group.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">{group.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); copyInviteCode(group.inviteCode); }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-card rounded border text-[10px] font-mono text-foreground/60 hover:border-primary/30 transition-colors"
                          data-testid={`button-copy-code-${group.id}`}
                        >
                          {copiedCode === group.inviteCode ? "Copied!" : group.inviteCode}
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyInviteLink(group.inviteCode); }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded border border-blue-200 text-[10px] text-blue-600 hover:bg-blue-100 transition-colors"
                          data-testid={`button-share-link-${group.id}`}
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          Share Link
                        </button>
                        <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", expandedGroup === group.id && "rotate-90")} />
                      </div>
                    </div>
                    {expandedGroup === group.id && (
                      <div className="px-3 pb-3 border-t border-border">
                        <div className="pt-2 space-y-1">
                          {groupMembers[group.id]?.length > 0 ? (
                            groupMembers[group.id].map((member: any, i: number) => (
                              <div key={member.userId || i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-card text-xs">
                                <span className="font-medium text-foreground/70">{member.username || `Member ${i + 1}`}</span>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                  {member.accuracy != null && <span>{Math.round(member.accuracy)}% accuracy</span>}
                                  {member.questionsAnswered != null && <span>{member.questionsAnswered} Qs</span>}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground py-2">{t("components.deckViews.loadingMembers")}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {studyGroups.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">{t("components.deckViews.noStudyGroupsYetCreate")}</p>
            )}
          </CardContent>
        </Card>
      )}

      {deckLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t("components.deckViews.loadingDecks")}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortDecks(deckTab === "my" ? myDecks : deckTab === "browse" ? publicDecks : savedDecksList, deckSortBy)?.map((deck: any) => (
            <Card
              key={deck.id}
              className="premium-card-interactive border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => {
                setCurrentDeck!(deck);
                fetchDeckCards!(deck.id);
                setView("deck-view");
              }}
              data-testid={`card-deck-${deck.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">{deck.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {deck.isUpgraded && <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 text-[10px] border-none rounded-lg">PRO</Badge>}
                    {deck.visibility === "public" && <Globe className="w-3 h-3 text-muted-foreground" />}
                    {deck.visibility === "private" && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </div>
                {deck.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{deck.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-medium">{deck.cardCount || 0} cards</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
          {((deckTab === "my" ? myDecks : deckTab === "browse" ? publicDecks : savedDecksList)?.length || 0) === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-8 h-8 text-primary/40" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {deckTab === "my" ? "No decks yet. Create your first study deck!" :
                 deckTab === "browse" ? "No public decks found." : "No saved decks yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DeckView({
  user, setView, currentDeck, setCurrentDeck, deckCards,
  fetchDeckCards, startDeckStudy, deleteDeck,
  saveDeck, duplicateDeck, reportDeck, entitlement,
  aiGeneratePrompt, setAiGeneratePrompt, aiGenerateCount, setAiGenerateCount,
  aiGenerating, aiGeneratedCards, aiGenerateCards, addAiGeneratedCards, removeAiGeneratedCard,
  aiUpgradeRequired, fetchEntitlement,
}: Partial<DeckViewsProps> & { user: any; setView: any }) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deckStats, setDeckStats] = useState<any>(null);
  const [visibilityChanging, setVisibilityChanging] = useState(false);
  const [visibilityMenuOpen, setVisibilityMenuOpen] = useState(false);
  const isOwner = currentDeck?.userId === user?.id;
  const isAdmin = user?.tier === "admin";

  useEffect(() => {
    if (currentDeck?.id && user?.id) {
      fetch(`/api/decks/${currentDeck.id}/stats?userId=${user.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setDeckStats(data); })
        .catch(() => {});
    }
  }, [currentDeck?.id, user?.id]);

  const shareUrl = currentDeck?.slug
    ? `${window.location.origin}/flashcards/deck/${currentDeck.slug}`
    : "";

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share && shareUrl) {
      try {
        await navigator.share({
          title: `${currentDeck.title} - NurseNest Study Deck`,
          text: currentDeck.description || "Check out this nursing study deck!",
          url: shareUrl,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const changeVisibility = async (newVisibility: string) => {
    if (!currentDeck || visibilityChanging) return;
    setVisibilityChanging(true);
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, visibility: newVisibility }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentDeck!(updated);
      }
    } catch {} finally {
      setVisibilityChanging(false);
      setVisibilityMenuOpen(false);
    }
  };

  if (!currentDeck) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-2.5 shadow-sm">
        <button onClick={() => setView("decks")} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition" data-testid="button-back-decks">
          <Home className="w-4 h-4" />
          <span>{t("components.deckViews.myFlashcards")}</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
        <span className="text-sm font-semibold text-foreground/70 truncate max-w-[280px]">{currentDeck.title}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("decks")} className="h-8 text-xs gap-1.5 rounded-xl border-border" data-testid="button-back-library">
            <ArrowLeft className="w-3.5 h-3.5" /> All Decks
          </Button>
          <Button size="sm" onClick={() => setView("decks")} className="h-8 text-xs gap-1.5 rounded-xl shadow-sm" data-testid="button-create-new-deck-from-view">
            <Plus className="w-3.5 h-3.5" /> New Deck
          </Button>
        </div>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-deck-title">{currentDeck.title}</h2>
          {currentDeck.description && <p className="text-muted-foreground text-sm mt-1">{currentDeck.description}</p>}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{deckCards?.length || 0} cards</span>
            {currentDeck.isUpgraded && <Badge className="bg-amber-100 text-amber-700 text-[10px] border-none">PRO</Badge>}
            {(isOwner || isAdmin) ? (
              <div className="relative">
                <button
                  onClick={() => setVisibilityMenuOpen(!visibilityMenuOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition text-xs font-medium text-foreground/60"
                  data-testid="button-visibility-toggle"
                >
                  {visibilityChanging ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                    <>
                      {currentDeck.visibility === "public" ? <Globe className="w-3 h-3 text-emerald-500" /> :
                       currentDeck.visibility === "unlisted" ? <Eye className="w-3 h-3 text-amber-500" /> :
                       <EyeOff className="w-3 h-3 text-muted-foreground" />}
                      {currentDeck.visibility === "public" ? "Public" :
                       currentDeck.visibility === "unlisted" ? "Unlisted" : "Private"}
                      <ChevronRight className={cn("w-3 h-3 transition-transform", visibilityMenuOpen && "rotate-90")} />
                    </>
                  )}
                </button>
                {visibilityMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setVisibilityMenuOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[180px]" data-testid="menu-visibility">
                      <button
                        onClick={() => changeVisibility("private")}
                        className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-secondary transition", currentDeck.visibility === "private" && "bg-primary/5 text-primary font-medium")}
                        data-testid="button-set-private"
                      >
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{t("components.deckViews.private")}</div>
                          <div className="text-[10px] text-muted-foreground">{t("components.deckViews.onlyYouCanSeeThis")}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => changeVisibility("unlisted")}
                        className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-secondary transition", currentDeck.visibility === "unlisted" && "bg-primary/5 text-primary font-medium")}
                        data-testid="button-set-unlisted"
                      >
                        <Eye className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="font-medium">{t("components.deckViews.unlisted")}</div>
                          <div className="text-[10px] text-muted-foreground">{t("components.deckViews.anyoneWithTheLinkCan")}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => changeVisibility("public")}
                        className={cn("w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-secondary transition", currentDeck.visibility === "public" && "bg-primary/5 text-primary font-medium")}
                        data-testid="button-set-public"
                      >
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <div>
                          <div className="font-medium">{t("components.deckViews.public")}</div>
                          <div className="text-[10px] text-muted-foreground">{t("components.deckViews.visibleInBrowseAndSearchable")}</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <span className="flex items-center gap-1">
                {currentDeck.visibility === "public" ? <><Globe className="w-3 h-3" /> {t("components.deckViews.public2")}</> :
                 currentDeck.visibility === "unlisted" ? <><Eye className="w-3 h-3" /> {t("components.deckViews.unlisted2")}</> :
                 <><EyeOff className="w-3 h-3" /> {t("components.deckViews.private2")}</>}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(deckCards?.length || 0) >= 2 && (
            <>
              <Button onClick={() => startDeckStudy!("learn")} className="rounded-xl gap-2 bg-primary hover:bg-primary/90" data-testid="button-learn-mode">
                <BookOpen className="w-4 h-4" /> Learn
              </Button>
              <Button onClick={() => startDeckStudy!("test")} className="rounded-xl gap-2 bg-primary/80 hover:bg-primary/70" data-testid="button-test-mode">
                <Timer className="w-4 h-4" /> Test
              </Button>
            </>
          )}
          {isOwner && (
            <>
              <Button variant="outline" onClick={() => { setView("deck-edit"); }} className="rounded-xl gap-2" data-testid="button-edit-deck">
                <Pencil className="w-4 h-4" /> Edit
              </Button>
              <Button variant="outline" onClick={() => duplicateDeck!(currentDeck.id)} className="rounded-xl gap-2" data-testid="button-duplicate-deck">
                <Copy className="w-4 h-4" /> Duplicate
              </Button>
            </>
          )}
          {!isOwner && user && (
            <>
              <Button variant="outline" onClick={() => saveDeck!(currentDeck.id)} className="rounded-xl gap-2" data-testid="button-save-deck">
                <BookOpen className="w-4 h-4" /> Save
              </Button>
              <Button variant="outline" onClick={() => duplicateDeck!(currentDeck.id)} className="rounded-xl gap-2" data-testid="button-duplicate-deck-other">
                <Copy className="w-4 h-4" /> Copy
              </Button>
              <Button variant="outline" onClick={() => setReportOpen(!reportOpen)} className="rounded-xl gap-2 text-red-500 hover:text-red-600" data-testid="button-report-deck">
                <Flag className="w-4 h-4" /> Report
              </Button>
            </>
          )}
          {!user && (
            <Button variant="outline" onClick={() => setLocation("/signup")} className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5" data-testid="button-guest-save-deck">
              <UserPlus className="w-4 h-4" /> Create Account to Save
            </Button>
          )}
          {isOwner && !currentDeck.isUpgraded && (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const res = await fetch("/api/billing/deck-upgrade/create-checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, deckId: currentDeck.id }),
                  });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                } catch {}
              }}
              className="rounded-xl gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
              data-testid="button-upgrade-deck"
            >
              <CreditCard className="w-4 h-4" /> Upgrade ($2.99 CAD)
            </Button>
          )}
          {(isOwner || isAdmin) && (
            <Button variant="ghost" onClick={() => { setDeleteConfirmOpen(true); setDeleteConfirmText(""); }} className="text-red-400 hover:text-red-600" data-testid="button-delete-deck">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirmOpen(false)}>
          <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 space-y-4" onClick={e => e.stopPropagation()} data-testid="modal-delete-deck">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t("components.deckViews.deleteDeck")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This will permanently delete <strong>{currentDeck?.title}</strong> and all its cards and study history.
              </p>
            </div>
            {currentDeck?.visibility === "public" ? (
              <div className="space-y-2">
                <p className="text-xs text-red-600 font-medium">{t("components.deckViews.thisIsAPublicDeck")}</p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e: any) => setDeleteConfirmText(e.target.value)}
                  placeholder={t("components.deckViews.typeDelete")}
                  className="text-center"
                  data-testid="input-delete-confirm"
                />
              </div>
            ) : null}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 rounded-xl"
                data-testid="button-cancel-delete"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (currentDeck?.visibility === "public" && deleteConfirmText !== "DELETE") return;
                  setDeleting(true);
                  try {
                    await deleteDeck!(currentDeck.id);
                    setDeleteConfirmOpen(false);
                  } catch {} finally {
                    setDeleting(false);
                  }
                }}
                disabled={deleting || (currentDeck?.visibility === "public" && deleteConfirmText !== "DELETE")}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-confirm-delete"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {shareUrl && (
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl border border-border">
          <div className="flex-1 min-w-0">
            <input
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-sm text-foreground/60 border-none outline-none truncate"
              onClick={(e) => (e.target as HTMLInputElement).select()}
              data-testid="input-share-url"
            />
          </div>
          <Button size="sm" variant="outline" onClick={handleCopyLink} className="rounded-lg gap-1.5 shrink-0" data-testid="button-copy-deck-link">
            {linkCopied ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t("components.deckViews.copied")}</> : <><Copy className="w-3.5 h-3.5" /> {t("components.deckViews.copyLink")}</>}
          </Button>
          <Button size="sm" variant="outline" onClick={handleNativeShare} className="rounded-lg gap-1.5 shrink-0" data-testid="button-share-deck-native">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
        </div>
      )}

      {reportOpen && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-medium text-red-700">{t("components.deckViews.reportThisDeckForInaccuracy")}</p>
            <Textarea
              placeholder={t("components.deckViews.describeTheIssue")}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="min-h-[80px]"
              data-testid="input-report-reason"
            />
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={() => { reportDeck!(currentDeck.id, reportReason); setReportOpen(false); setReportReason(""); }} disabled={!reportReason.trim()} data-testid="button-submit-report">
                Submit Report
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReportOpen(false)}>{t("components.deckViews.cancel4")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {deckStats && deckStats.totalSessions > 0 && (
        <Card className="premium-card border-0 bg-gradient-to-br from-primary/5 to-secondary/60" data-testid="card-deck-progress">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{t("components.deckViews.yourProgress")}</span>
              <span className="text-[10px] text-muted-foreground">{deckStats.totalSessions} session{deckStats.totalSessions !== 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-primary" data-testid="text-accuracy">{deckStats.accuracy}%</p>
                <p className="text-[9px] text-muted-foreground">{t("components.deckViews.accuracy")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600" data-testid="text-mastered">{deckStats.masteredCount}</p>
                <p className="text-[9px] text-muted-foreground">{t("components.deckViews.mastered")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-600" data-testid="text-learning">{deckStats.learningCount}</p>
                <p className="text-[9px] text-muted-foreground">{t("components.deckViews.learning")}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-primary" data-testid="text-streak">{deckStats.streak}</p>
                <p className="text-[9px] text-muted-foreground">{t("components.deckViews.dayStreak")}</p>
              </div>
            </div>
            {deckStats.totalCards > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{t("components.deckViews.mastery")}</span>
                  <span>{Math.round((deckStats.masteredCount / deckStats.totalCards) * 100)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.round((deckStats.masteredCount / deckStats.totalCards) * 100)}%` }} data-testid="progress-mastery" />
                </div>
              </div>
            )}
            {deckStats.lastStudiedAt && (
              <p className="text-[10px] text-muted-foreground">Last studied {new Date(deckStats.lastStudiedAt).toLocaleDateString()}</p>
            )}
          </CardContent>
        </Card>
      )}

      {isOwner && (
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="w-full rounded-xl gap-2 border-border bg-secondary text-primary hover:bg-secondary/80 py-3"
            data-testid="button-ai-generate-deck-view"
          >
            <Sparkles className="w-4 h-4" />
            {showAiPanel ? "Hide Smart Generator" : "Generate Cards Automatically"}
          </Button>

          {showAiPanel && (
            <Card className="border-border bg-secondary/30" data-testid="card-ai-generate-deckview">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t("components.deckViews.smartFlashcardGenerator2")}</span>
                </div>
                <p className="text-xs text-primary/80">{t("components.deckViews.enterANursingTopicAnd")}</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Cardiac medications, Diabetes management, Pediatric milestones..."
                    value={aiGeneratePrompt || ""}
                    onChange={(e) => setAiGeneratePrompt?.(e.target.value)}
                    className="text-sm bg-card flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter" && aiGeneratePrompt?.trim()) aiGenerateCards?.(); }}
                    data-testid="input-ai-generate-prompt-deckview"
                  />
                  <select
                    value={aiGenerateCount || 10}
                    onChange={(e) => setAiGenerateCount?.(parseInt(e.target.value))}
                    className="bg-card border border-border rounded-lg px-2 text-sm"
                    data-testid="select-ai-generate-count-deckview"
                  >
                    {[5, 10, 15, 20, 25, 30, 40, 50].map(n => <option key={n} value={n}>{n}{n > 25 ? " (premium)" : ""} cards</option>)}
                  </select>
                </div>
                <Button
                  onClick={aiGenerateCards}
                  disabled={aiGenerating || !aiGeneratePrompt?.trim()}
                  className="w-full gap-2 bg-primary hover:bg-primary/90 rounded-xl"
                  data-testid="button-ai-generate-deckview"
                >
                  {aiGenerating ? <><Layers className="w-4 h-4 animate-spin" /> {t("components.deckViews.generating")}</> : <><Sparkles className="w-4 h-4" /> {t("components.deckViews.generateCards")}</>}
                </Button>
                {aiUpgradeRequired && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">{t("components.deckViews.youveReachedTheFreeCard")}</p>
                )}
                {aiGeneratedCards && aiGeneratedCards.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-primary">{aiGeneratedCards.length} cards generated — review before adding:</p>
                      <Button size="sm" onClick={addAiGeneratedCards} className="gap-1 bg-primary hover:bg-primary/90 text-xs rounded-lg" data-testid="button-add-ai-cards-deckview">
                        <Plus className="w-3 h-3" /> Add All to Deck
                      </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {aiGeneratedCards.map((card, idx) => (
                        <div key={idx} className="bg-card rounded-lg border border-border p-3 relative group">
                          <button
                            onClick={() => removeAiGeneratedCard?.(idx)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity"
                            data-testid={`button-remove-ai-card-${idx}`}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <p className="text-sm font-medium text-foreground">{card.front}</p>
                          <p className="text-xs text-foreground/60 mt-1">{card.back}</p>
                          {card.rationale && <p className="text-[10px] text-muted-foreground mt-1 italic">{card.rationale}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {deckCards?.map((card: any, i: number) => (
          <Card key={card.id} className="premium-card-interactive border-0 shadow-sm" data-testid={`card-deck-card-${card.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-primary/60 font-bold">{i + 1}.</span>
                  <p className="text-sm font-medium text-foreground mt-0.5">{card.front}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{card.back}</p>
                  {card.rationale && <p className="text-[10px] text-muted-foreground mt-1.5 italic">{card.rationale}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!deckCards || deckCards.length === 0) && (
          <div className="text-center py-12 space-y-4">
            <Sparkles className="w-10 h-10 text-primary/30 mx-auto" />
            <p className="text-muted-foreground text-sm font-medium">{t("components.deckViews.thisDeckIsEmpty")}</p>
            <p className="text-muted-foreground text-xs max-w-md mx-auto">{t("components.deckViews.useTheSmartGeneratorAbove")}</p>
            <div className="flex gap-3 justify-center">
              {isOwner && !showAiPanel && (
                <Button variant="outline" onClick={() => setShowAiPanel(true)} className="gap-2 border-border text-primary hover:bg-secondary rounded-xl" data-testid="button-ai-generate-empty">
                  <Sparkles className="w-4 h-4" /> Generate Automatically
                </Button>
              )}
              {isOwner && (
                <Button variant="outline" onClick={() => setView("deck-edit")} className="gap-2 rounded-xl" data-testid="button-add-cards-manual">
                  <Plus className="w-4 h-4" /> Add Manually
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DeckEditor({
  user, setView, currentDeck, deckCards, setDeckCards,
  addCardToDeck, deleteDeckCard, aiCheckCard, handleCsvImport, entitlement,
  newCardFront, setNewCardFront, newCardBack, setNewCardBack,
  newCardRationale, setNewCardRationale,
  newCardClinicalPearl, setNewCardClinicalPearl,
  aiCheckResult, aiChecking,
  csvImportText, setCsvImportText, showCsvImport, setShowCsvImport,
  fetchDeckCards, fetchEntitlement,
  aiGeneratePrompt, setAiGeneratePrompt, aiGenerateCount, setAiGenerateCount,
  aiGenerating, aiGeneratedCards, aiGenerateCards, addAiGeneratedCards, removeAiGeneratedCard,
  aiUpgradeRequired, isPaid,
}: Partial<DeckViewsProps> & { user: any; setView: any }) {
  const [editingCard, setEditingCard] = useState<any>(null);
  const [showAiGenerate, setShowAiGenerate] = useState(false);

  if (!currentDeck) return null;

  const limitInfo = currentDeck.isUpgraded
    ? { max: 300, used: deckCards?.length || 0 }
    : entitlement?.isPremium
    ? { max: 5000, used: entitlement?.totalFreeCards || 0 }
    : { max: entitlement?.limit || 50, used: entitlement?.totalFreeCards || 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-2.5 shadow-sm flex-wrap">
        <button onClick={() => setView("decks")} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition" data-testid="button-back-decks-from-edit">
          <Home className="w-4 h-4" />
          <span>{t("components.deckViews.myFlashcards2")}</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <button onClick={() => setView("deck-view")} className="text-sm font-medium text-primary hover:text-primary/80 transition truncate max-w-[200px]" data-testid="button-back-deck-view">
          {currentDeck.title}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-sm font-semibold text-foreground/70">{t("components.deckViews.edit")}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setView("deck-view")} className="h-8 text-xs gap-1.5 rounded-xl border-border" data-testid="button-back-to-deck">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Deck
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView("decks")} className="h-8 text-xs gap-1.5 rounded-xl border-border" data-testid="button-back-library-from-edit">
            <Home className="w-3.5 h-3.5" /> All Decks
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
        <span>{deckCards?.length || 0} cards</span>
        <span className={cn("font-medium", limitInfo.used >= limitInfo.max ? "text-red-500" : "text-muted-foreground")}>
          {limitInfo.used} / {limitInfo.max} {currentDeck.isUpgraded ? "deck" : "total"} cards used
        </span>
        <Button size="sm" variant="outline" onClick={() => { setShowAiGenerate(!showAiGenerate); if (showCsvImport) setShowCsvImport!(false); }} className="h-7 text-xs gap-1 ml-auto bg-secondary border-border text-primary hover:bg-secondary/80" data-testid="button-ai-generate-toggle">
          <Sparkles className="w-3 h-3" /> Auto Generate
        </Button>
        <Button size="sm" variant="outline" onClick={() => { setShowCsvImport!(!showCsvImport); if (showAiGenerate) setShowAiGenerate(false); }} className="h-7 text-xs gap-1" data-testid="button-csv-import">
          <Upload className="w-3 h-3" /> CSV Import
        </Button>
      </div>

      {showAiGenerate && (
        <Card className="border-border bg-secondary/30" data-testid="card-ai-generate">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-primary">{t("components.deckViews.smartFlashcardGenerator3")}</h3>
            </div>
            <p className="text-xs text-foreground/60">{t("components.deckViews.describeWhatYouWantTo")}</p>
            <Textarea
              placeholder="e.g., Cardiac medications including beta blockers, ACE inhibitors, and antiarrhythmics with their mechanisms of action and side effects"
              value={aiGeneratePrompt}
              onChange={(e) => setAiGeneratePrompt!(e.target.value)}
              className="min-h-[80px] text-sm bg-card"
              data-testid="input-ai-generate-prompt"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">{t("components.deckViews.cards3")}</label>
                <select
                  value={aiGenerateCount}
                  onChange={(e) => setAiGenerateCount!(parseInt(e.target.value))}
                  className="text-xs border rounded-lg px-2 py-1.5 bg-card"
                  data-testid="select-ai-generate-count"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>{t("components.deckViews.30Premium")}</option>
                  <option value={40}>{t("components.deckViews.40Premium")}</option>
                  <option value={50}>{t("components.deckViews.50Premium")}</option>
                </select>
              </div>
              <Button
                size="sm"
                onClick={aiGenerateCards}
                disabled={aiGenerating || !aiGeneratePrompt?.trim()}
                className="gap-1 bg-primary hover:bg-primary/90"
                data-testid="button-ai-generate"
              >
                {aiGenerating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" /> Generate Cards
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAiGenerate(false)}>{t("components.deckViews.cancel5")}</Button>
            </div>

            {!isPaid && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2" data-testid="text-ai-card-limit">
                <span>Free plan: {limitInfo.used} / {limitInfo.max} cards used</span>
                {limitInfo.used >= limitInfo.max && (
                  <span className="text-red-500 font-medium">{t("components.deckViews.limitReached")}</span>
                )}
              </div>
            )}

            {aiUpgradeRequired && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl" data-testid="text-ai-upgrade-prompt">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">{t("components.deckViews.freeCardLimitReached50")}</p>
                  <p className="text-xs text-amber-600 mt-0.5">{t("components.deckViews.upgradeYourPlanToGenerate")}</p>
                </div>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 shrink-0" onClick={() => setLocation("/pricing")} data-testid="button-ai-upgrade">
                  Upgrade Now
                </Button>
              </div>
            )}

            {aiGeneratedCards && aiGeneratedCards.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-primary">{aiGeneratedCards.length} cards generated — review before adding:</p>
                  <Button size="sm" onClick={addAiGeneratedCards} className="gap-1 bg-primary hover:bg-primary/90" data-testid="button-add-ai-cards">
                    <Plus className="w-3 h-3" /> Add All to Deck
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                  {aiGeneratedCards.map((card, idx) => (
                    <div key={idx} className="bg-card rounded-lg border border-border p-3 text-sm" data-testid={`ai-card-preview-${idx}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{card.front}</p>
                          <p className="text-foreground/60 mt-1">{card.back}</p>
                          {card.rationale && <p className="text-xs text-muted-foreground mt-1 italic">{card.rationale}</p>}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0 text-red-400 hover:text-red-600 h-7 w-7 p-0"
                          onClick={() => removeAiGeneratedCard!(idx)}
                          data-testid={`button-remove-ai-card-${idx}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showCsvImport && (
        <Card className="border-primary/20">
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-foreground/60">{t("components.deckViews.pasteCsvDataFrontBack")}</p>
            <Textarea
              placeholder={"What is normal saline?, 0.9% NaCl isotonic solution, Used for fluid resuscitation, Always check IV site patency before infusion\nWhat is D5W?, 5% dextrose in water, Provides free water and calories, D5W becomes hypotonic once dextrose is metabolized"}
              value={csvImportText}
              onChange={(e) => setCsvImportText!(e.target.value)}
              className="min-h-[120px] font-mono text-xs"
              data-testid="input-csv-import"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleCsvImport} disabled={!csvImportText?.trim()} data-testid="button-import-csv">{t("components.deckViews.importCards")}</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCsvImport!(false)}>{t("components.deckViews.cancel6")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-primary/20">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground/70">{t("components.deckViews.addNewCard")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">{t("components.deckViews.frontQuestionterm")}</label>
              <Textarea
                placeholder="e.g., What is the antidote for heparin?"
                value={newCardFront}
                onChange={(e) => setNewCardFront!(e.target.value)}
                className="min-h-[80px] text-sm"
                data-testid="input-card-front"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">{t("components.deckViews.backAnswerdefinition")}</label>
              <Textarea
                placeholder="e.g., Protamine sulfate"
                value={newCardBack}
                onChange={(e) => setNewCardBack!(e.target.value)}
                className="min-h-[80px] text-sm"
                data-testid="input-card-back"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">{t("components.deckViews.rationaleOptional")}</label>
            <Input
              placeholder={t("components.deckViews.whyThisIsTheCorrect")}
              value={newCardRationale}
              onChange={(e) => setNewCardRationale!(e.target.value)}
              className="text-sm"
              data-testid="input-card-rationale"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">{t("components.deckViews.clinicalPearlOptional")}</label>
            <Input
              placeholder={t("components.deckViews.highyieldClinicalTipOrFact")}
              value={newCardClinicalPearl}
              onChange={(e) => setNewCardClinicalPearl!(e.target.value)}
              className="text-sm"
              data-testid="input-card-clinical-pearl"
            />
          </div>

          {aiCheckResult && (
            <div className={cn("p-3 rounded-lg border text-sm", aiCheckResult.accurate ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800")}>
              <div className="flex items-center gap-2 font-medium mb-1">
                {aiCheckResult.accurate ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {aiCheckResult.accurate ? "Accurate" : "Needs Review"}
              </div>
              <p className="text-xs">{aiCheckResult.feedback}</p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => addCardToDeck!()} disabled={!newCardFront?.trim() || !newCardBack?.trim()} className="rounded-xl" data-testid="button-add-card">
              <Plus className="w-4 h-4 mr-1" /> Add Card
            </Button>
            <Button variant="outline" onClick={aiCheckCard} disabled={aiChecking || !newCardFront?.trim() || !newCardBack?.trim()} className="rounded-xl gap-2" data-testid="button-ai-check">
              <Sparkles className="w-4 h-4" /> {aiChecking ? "Checking..." : "Verify Accuracy"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {deckCards?.map((card: any, i: number) => (
          <Card key={card.id} className="border-border" data-testid={`card-edit-${card.id}`}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{i + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{card.front}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.back}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteDeckCard!(card.id)} className="text-red-400 hover:text-red-600 shrink-0" data-testid={`button-delete-card-${card.id}`}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RevealSection({ label, icon, content, testId }: { label: string; icon: React.ReactNode; content: string; testId: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setRevealed(!revealed); }}
      className="w-full text-left"
      data-testid={testId}
    >
      <div className={cn(
        "rounded-xl border border-primary-foreground/20 transition-all duration-300 overflow-hidden",
        revealed ? "bg-primary-foreground/10" : "bg-primary-foreground/5 hover:bg-primary-foreground/10"
      )}>
        <div className="flex items-center gap-2 px-4 py-3">
          {icon}
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/70">{label}</span>
          <ChevronDown className={cn("w-3.5 h-3.5 ml-auto text-primary-foreground/40 transition-transform duration-300", revealed && "rotate-180")} />
        </div>
        <div className={cn(
          "px-4 transition-all duration-300 ease-in-out",
          revealed ? "pb-3 max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <p className="text-sm text-primary-foreground/90 leading-relaxed">{content}</p>
        </div>
      </div>
    </button>
  );
}

export function DeckStudyLearn({
  user, setView, currentDeck, deckStudyQueue, deckStudyIndex,
  deckStudyFlipped, setDeckStudyFlipped, deckStudyCorrect, deckStudyIncorrect,
  handleDeckStudyAnswer,
}: Partial<DeckViewsProps> & { user: any; setView: any }) {
  const card = deckStudyQueue?.[deckStudyIndex!];
  const total = deckStudyQueue?.length || 0;
  const progress = total > 0 ? ((deckStudyIndex! + 1) / total) * 100 : 0;
  const [aiVerifyResult, setAiVerifyResult] = useState<{status: string; explanation: string; confidence: number; suggestedCorrection?: string} | null>(null);
  const [aiVerifying, setAiVerifying] = useState(false);

  useEffect(() => {
    setAiVerifyResult(null);
    setAiVerifying(false);
  }, [deckStudyIndex]);

  const verifyCardAccuracy = async () => {
    if (!card || !currentDeck) return;
    setAiVerifying(true);
    try {
      const res = await fetch(`/api/decks/${currentDeck.id}/ai-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: card.front, back: card.back, rationale: card.rationale }),
      });
      if (res.ok) setAiVerifyResult(await res.json());
    } catch {} finally { setAiVerifying(false); }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!deckStudyFlipped) setDeckStudyFlipped!(true);
      }
      if (deckStudyFlipped && (e.key === "1" || e.key === "ArrowLeft")) handleDeckStudyAnswer!(false);
      if (deckStudyFlipped && e.key === "2") handleDeckStudyAnswer!(true);
      if (deckStudyFlipped && (e.key === "3" || e.key === "ArrowRight")) handleDeckStudyAnswer!(true);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [deckStudyFlipped, deckStudyIndex]);

  if (!card) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-2.5 shadow-sm flex-wrap">
        <button onClick={() => setView("decks")} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition" data-testid="button-exit-to-decks">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t("components.deckViews.myFlashcards3")}</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
        <button onClick={() => setView("deck-view")} className="text-sm font-medium text-primary hover:text-primary/80 transition truncate max-w-[160px]" data-testid="button-exit-learn">
          {currentDeck?.title || "Deck"}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />
        <span className="text-sm font-semibold text-foreground/70">{t("components.deckViews.learn")}</span>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="text-emerald-600 font-medium">{deckStudyCorrect} correct</span>
          <span className="text-red-400 font-medium">{deckStudyIncorrect} missed</span>
          <span className="text-muted-foreground font-mono">{deckStudyIndex! + 1} / {total}</span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {card.retry && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50/80 border border-amber-200/60 px-4 py-2.5 rounded-xl">
          <RefreshCw className="w-3.5 h-3.5" /> Retry card — you missed this one earlier
        </div>
      )}

      <div
        className="min-h-[350px] cursor-pointer perspective-1000"
        onClick={() => !deckStudyFlipped && setDeckStudyFlipped!(true)}
      >
        <Card className={cn(
          "border-none shadow-xl rounded-3xl min-h-[350px] flex flex-col items-center p-8 md:p-10 text-center transition-all duration-300",
          deckStudyFlipped
            ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-primary/20 justify-start pt-10"
            : "bg-card shadow-border/60 justify-center"
        )}>
          {!deckStudyFlipped ? (
            <>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">{t("components.deckViews.question")}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed max-w-lg">{card.front}</h2>
              <div className="mt-8 text-xs text-foreground/40 uppercase tracking-widest animate-pulse flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Tap or press Space to reveal
              </div>
            </>
          ) : (
            <div className="w-full max-w-lg space-y-3">
              <span className="text-[10px] font-bold text-primary-foreground/50 uppercase tracking-[0.2em] block text-center mb-2">{t("components.deckViews.tapEachSectionToReveal")}</span>
              <RevealSection
                label={t("components.deckViews.correctAnswer")}
                icon={<CheckCircle2 className="w-4 h-4 text-primary-foreground/60" />}
                content={card.back}
                testId="reveal-answer"
              />
              {card.rationale?.trim() && (
                <RevealSection
                  label={t("components.deckViews.whyThisIsCorrect")}
                  icon={<BookOpen className="w-4 h-4 text-primary-foreground/60" />}
                  content={card.rationale}
                  testId="reveal-rationale"
                />
              )}
              {card.clinicalPearl?.trim() && (
                <RevealSection
                  label={t("components.deckViews.clinicalPearl")}
                  icon={<Lightbulb className="w-4 h-4 text-primary-foreground/60" />}
                  content={card.clinicalPearl}
                  testId="reveal-clinical-pearl"
                />
              )}
            </div>
          )}
        </Card>
      </div>

      {deckStudyFlipped && (
        <div className="space-y-3">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-[0.15em] font-medium">{t("components.deckViews.howWellDidYouKnow")}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => {
                if (user?.id && card?.id && currentDeck?.id) {
                  fetch("/api/flashcard-review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, cardId: card.id, deckId: currentDeck.id, response: "wrong" }),
                  }).catch(() => {});
                }
                handleDeckStudyAnswer!(false);
              }}
              variant="outline"
              className="rounded-2xl gap-2 px-5 py-6 border-2 border-red-200/80 text-red-600 hover:bg-red-50/60 hover:border-red-300 flex-1 transition-all duration-200"
              data-testid="button-missed"
            >
              <XCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">{t("components.deckViews.iGotItWrong")}</div>
                <div className="text-[10px] text-red-400">{t("components.deckViews.reviewTomorrow")}</div>
              </div>
            </Button>
            <Button
              onClick={() => {
                if (user?.id && card?.id && currentDeck?.id) {
                  fetch("/api/flashcard-review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, cardId: card.id, deckId: currentDeck.id, response: "unsure" }),
                  }).catch(() => {});
                }
                handleDeckStudyAnswer!(true);
              }}
              variant="outline"
              className="rounded-2xl gap-2 px-5 py-6 border-2 border-amber-200/80 text-amber-600 hover:bg-amber-50/60 hover:border-amber-300 flex-1 transition-all duration-200"
              data-testid="button-unsure"
            >
              <RefreshCw className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">{t("components.deckViews.iWasUnsure")}</div>
                <div className="text-[10px] text-amber-400">{t("components.deckViews.reviewIn3Days")}</div>
              </div>
            </Button>
            <Button
              onClick={() => {
                if (user?.id && card?.id && currentDeck?.id) {
                  fetch("/api/flashcard-review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, cardId: card.id, deckId: currentDeck.id, response: "knew_it" }),
                  }).catch(() => {});
                }
                handleDeckStudyAnswer!(true);
              }}
              className="rounded-2xl gap-2 px-5 py-6 bg-emerald-600 hover:bg-emerald-700 flex-1 shadow-sm shadow-emerald-200 transition-all duration-200"
              data-testid="button-got-it"
            >
              <CheckCircle2 className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">{t("components.deckViews.iKnewThis")}</div>
                <div className="text-[10px] text-emerald-300">{t("components.deckViews.reviewIn7Days")}</div>
              </div>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={verifyCardAccuracy}
              disabled={aiVerifying}
              className="text-xs text-muted-foreground hover:text-primary gap-1.5"
              data-testid="button-verify-accuracy"
            >
              <Sparkles className="w-3 h-3" />
              {aiVerifying ? "Checking..." : "Verify Medical Accuracy"}
            </Button>
          </div>
          {aiVerifyResult && (
            <div className={cn(
              "rounded-xl border p-4 text-sm",
              aiVerifyResult.status === "pass" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
              aiVerifyResult.status === "flag" ? "bg-red-50 border-red-200 text-red-800" :
              "bg-amber-50 border-amber-200 text-amber-800"
            )} data-testid="ai-verify-result">
              <div className="flex items-center gap-2 mb-1">
                {aiVerifyResult.status === "pass" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                 aiVerifyResult.status === "flag" ? <Flag className="w-4 h-4 text-red-600" /> :
                 <Sparkles className="w-4 h-4 text-amber-600" />}
                <span className="font-semibold capitalize">{aiVerifyResult.status === "pass" ? "Medically Accurate" : aiVerifyResult.status === "flag" ? "Accuracy Concern" : "Uncertain"}</span>
                <span className="text-xs opacity-60 ml-auto">{Math.round(aiVerifyResult.confidence * 100)}% confidence</span>
              </div>
              <p className="text-xs leading-relaxed">{aiVerifyResult.explanation}</p>
              {aiVerifyResult.suggestedCorrection && (
                <p className="text-xs mt-2 font-medium">Suggested: {aiVerifyResult.suggestedCorrection}</p>
              )}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-[10px] text-muted-foreground">
        Keyboard: Space/Enter to flip | Right Arrow/1 = Got it | Left Arrow/2 = Missed
      </p>
    </div>
  );
}

export function DeckStudyTest({
  user, setView, currentDeck, deckStudyQueue, deckStudyIndex,
  deckStudyFlipped, setDeckStudyFlipped, deckStudyCorrect, deckStudyIncorrect,
  handleDeckStudyAnswer, deckStudyStartTime,
}: Partial<DeckViewsProps> & { user: any; setView: any }) {
  const [elapsed, setElapsed] = useState(0);
  const card = deckStudyQueue?.[deckStudyIndex!];
  const total = deckStudyQueue?.length || 0;
  const progress = total > 0 ? ((deckStudyIndex! + 1) / total) * 100 : 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (deckStudyStartTime || Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [deckStudyStartTime]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!deckStudyFlipped) setDeckStudyFlipped!(true);
      }
      if (deckStudyFlipped && (e.key === "1" || e.key === "ArrowLeft")) handleDeckStudyAnswer!(false);
      if (deckStudyFlipped && e.key === "2") handleDeckStudyAnswer!(true);
      if (deckStudyFlipped && (e.key === "3" || e.key === "ArrowRight")) handleDeckStudyAnswer!(true);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [deckStudyFlipped, deckStudyIndex]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (!card) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl px-4 py-2.5 shadow-sm flex-wrap">
        <button onClick={() => setView("decks")} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition" data-testid="button-exit-to-decks-test">
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">{t("components.deckViews.myFlashcards4")}</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <button onClick={() => setView("deck-view")} className="text-sm font-medium text-primary hover:text-primary/80 transition truncate max-w-[160px]" data-testid="button-exit-test">
          {currentDeck?.title || "Deck"}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-sm font-semibold text-foreground/70">{t("components.deckViews.test")}</span>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground"><Timer className="w-4 h-4" /> {formatTime(elapsed)}</span>
          <span className="text-muted-foreground font-mono">{deckStudyIndex! + 1} / {total}</span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      <div
        className="min-h-[350px] cursor-pointer perspective-1000"
        onClick={() => !deckStudyFlipped && setDeckStudyFlipped!(true)}
      >
        <Card className={cn(
          "border-none shadow-xl rounded-3xl min-h-[350px] flex flex-col items-center p-8 md:p-10 text-center transition-all duration-300",
          deckStudyFlipped
            ? "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-primary/20 justify-start pt-10"
            : "bg-card shadow-border/60 justify-center"
        )}>
          {!deckStudyFlipped ? (
            <>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-6">{t("components.deckViews.testMode")}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed max-w-lg">{card.front}</h2>
              <div className="mt-8 text-xs text-foreground/40 uppercase tracking-widest animate-pulse flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Tap or press Space to reveal
              </div>
            </>
          ) : (
            <div className="w-full max-w-lg space-y-3">
              <span className="text-[10px] font-bold text-primary-foreground/50 uppercase tracking-[0.2em] block text-center mb-2">{t("components.deckViews.tapEachSectionToReveal2")}</span>
              <RevealSection
                label={t("components.deckViews.correctAnswer2")}
                icon={<CheckCircle2 className="w-4 h-4 text-primary-foreground/60" />}
                content={card.back}
                testId="reveal-answer-test"
              />
              {card.rationale?.trim() && (
                <RevealSection
                  label={t("components.deckViews.whyThisIsCorrect2")}
                  icon={<BookOpen className="w-4 h-4 text-primary-foreground/60" />}
                  content={card.rationale}
                  testId="reveal-rationale-test"
                />
              )}
              {card.clinicalPearl?.trim() && (
                <RevealSection
                  label={t("components.deckViews.clinicalPearl2")}
                  icon={<Lightbulb className="w-4 h-4 text-primary-foreground/60" />}
                  content={card.clinicalPearl}
                  testId="reveal-clinical-pearl-test"
                />
              )}
            </div>
          )}
        </Card>
      </div>

      {deckStudyFlipped && (
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => handleDeckStudyAnswer!(false)}
            variant="outline"
            className="rounded-2xl gap-2 px-8 py-6 border-2 border-red-200/80 text-red-600 hover:bg-red-50/60 hover:border-red-300 transition-all duration-200"
            data-testid="button-test-wrong"
          >
            <XCircle className="w-5 h-5" /> Wrong
          </Button>
          <Button
            onClick={() => handleDeckStudyAnswer!(true)}
            className="rounded-2xl gap-2 px-8 py-6 bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-all duration-200"
            data-testid="button-test-correct"
          >
            <CheckCircle2 className="w-5 h-5" /> Correct
          </Button>
        </div>
      )}
    </div>
  );
}

export function DeckReportCard({
  setView, currentDeck, deckStudyCorrect, deckStudyIncorrect,
  deckStudyQueue, deckStudyStartTime, deckStudyMissed, deckCards,
  startDeckStudy,
}: Partial<DeckViewsProps> & { setView: any }) {
  const total = (deckStudyCorrect || 0) + (deckStudyIncorrect || 0);
  const percentage = total > 0 ? Math.round(((deckStudyCorrect || 0) / total) * 100) : 0;
  const timeSeconds = Math.round((Date.now() - (deckStudyStartTime || Date.now())) / 1000);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const missedCards = deckCards?.filter((c: any) => deckStudyMissed?.includes(c.id)) || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center py-4">
        <div className={cn(
          "w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl font-black shadow-lg",
          percentage >= 80 ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-200/40" :
          percentage >= 60 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-200/40" :
          "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-200/40"
        )}>
          {percentage}%
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t("components.deckViews.sessionComplete")}</h2>
        <p className="text-muted-foreground text-sm mt-1">{currentDeck?.title}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center premium-card border-0 bg-emerald-50/60">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-600">{deckStudyCorrect}</p>
            <p className="text-xs text-emerald-700 font-medium">{t("components.deckViews.correct")}</p>
          </CardContent>
        </Card>
        <Card className="text-center premium-card border-0 bg-red-50/60">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-500">{deckStudyIncorrect}</p>
            <p className="text-xs text-red-700 font-medium">{t("components.deckViews.missed")}</p>
          </CardContent>
        </Card>
        <Card className="text-center premium-card border-0 bg-secondary/60">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{formatTime(timeSeconds)}</p>
            <p className="text-xs text-muted-foreground font-medium">{t("components.deckViews.time")}</p>
          </CardContent>
        </Card>
      </div>

      {missedCards.length > 0 && (
        <Card className="premium-card border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Cards to Review ({missedCards.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {missedCards.map((card: any) => (
              <div key={card.id} className="text-sm border-b border-border pb-2.5 last:border-0">
                <p className="font-medium text-foreground">{card.front}</p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{card.back}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 justify-center">
        <Button onClick={() => startDeckStudy!("learn")} className="rounded-2xl gap-2 bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20" data-testid="button-study-again">
          <RefreshCw className="w-4 h-4" /> Study Again
        </Button>
        <Button variant="outline" onClick={() => setView("deck-view")} className="rounded-2xl border-border" data-testid="button-back-to-deck">
          Back to Deck
        </Button>
        <Button variant="outline" onClick={() => setView("decks")} className="rounded-2xl border-border" data-testid="button-all-decks">
          All Decks
        </Button>
      </div>
    </div>
  );
}

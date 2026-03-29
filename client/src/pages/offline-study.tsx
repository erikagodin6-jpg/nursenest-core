import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OfflineDownloadManager } from "@/components/offline-download-manager";
import { PushNotificationSettings } from "@/components/push-notifications";
import { getDownloadedPacks, getOfflineQuestions, getOfflineFlashcards } from "@/lib/offline-store";
import { saveOfflineProgress } from "@/lib/offline-store";
import {
  BookOpen, Brain, ArrowRight, CheckCircle2, XCircle,
  Lightbulb, RotateCcw, WifiOff, Wifi,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { useI18n } from "@/lib/i18n";
type Mode = "menu" | "questions" | "flashcards";

interface OfflinePack {
  id: string;
  type: string;
  title: string;
  topic: string;
  tier: string;
  itemCount: number;
  downloadedAt: number;
}

export default function OfflineStudyPage() {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [mode, setMode] = useState<Mode>("menu");
  const [packs, setPacks] = useState<OfflinePack[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tab, setTab] = useState<"study" | "download" | "settings">("study");

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardResults, setCardResults] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    getDownloadedPacks().then(setPacks);
  }, [tab]);

  const startQuestionPack = async (packId: string) => {
    const qs = await getOfflineQuestions(packId);
    if (qs.length === 0) return;
    setQuestions(qs);
    setSelectedPack(packId);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotal(0);
    setMode("questions");
  };

  const startFlashcardPack = async (packId: string) => {
    const cards = await getOfflineFlashcards(packId);
    if (cards.length === 0) return;
    setFlashcards(cards);
    setSelectedPack(packId);
    setCurrentCard(0);
    setFlipped(false);
    setCardResults({});
    setMode("flashcards");
  };

  const handleAnswer = (label: string) => {
    if (showResult) return;
    setSelectedAnswer(label);
    setShowResult(true);
    const q = questions[currentQ];
    const correct = q.correctAnswer?.includes?.(label) || q.correctAnswer === label;
    if (correct) setScore((s) => s + 1);
    setTotal((t) => t + 1);
    if (selectedPack) {
      saveOfflineProgress(q.id, correct, selectedPack).catch(console.error);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setMode("menu");
    }
  };

  const markCard = (known: boolean) => {
    setCardResults((prev) => ({ ...prev, [currentCard]: known }));
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((c) => c + 1);
      setFlipped(false);
    } else {
      setMode("menu");
    }
  };

  const questionPacks = packs.filter((p) => p.type === "questions");
  const flashcardPacks = packs.filter((p) => p.type === "flashcards");

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SEO
        title={t("pages.offlineStudy.offlineStudyMode")}
        description={t("pages.offlineStudy.studyPracticeQuestionsAndFlashcards")}
        canonicalPath="/offline-study"
        noindex
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" data-testid="text-offline-title">
            {!isOnline && <WifiOff className="w-6 h-6 inline mr-2 text-amber-500" />}
            Offline Study
          </h1>
          <Badge variant="outline" className={isOnline ? "text-green-600 border-green-200" : "text-amber-600 border-amber-200"}>
            {isOnline ? <><Wifi className="w-3 h-3 mr-1" /> {t("pages.offlineStudy.online")}</> : <><WifiOff className="w-3 h-3 mr-1" /> {t("pages.offlineStudy.offline")}</>}
          </Badge>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(["study", "download", "settings"] as const).map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              size="sm"
              onClick={() => { setTab(t); setMode("menu"); }}
              data-testid={`tab-${t}`}
            >
              {t === "study" ? "Study" : t === "download" ? "Downloads" : "Settings"}
            </Button>
          ))}
        </div>

        {tab === "study" && mode === "menu" && (
          <div className="space-y-6">
            {packs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("pages.offlineStudy.noContentDownloaded")}</h3>
                  <p className="text-gray-500 mb-4">{t("pages.offlineStudy.downloadQuestionPacksOrFlashcard")}</p>
                  <Button onClick={() => setTab("download")} data-testid="button-go-downloads">
                    Browse Downloads
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {questionPacks.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" /> Question Packs
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {questionPacks.map((p) => (
                        <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`study-pack-${p.id}`}>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-sm mb-1">{p.title}</h3>
                            <p className="text-xs text-gray-500 mb-3">{p.itemCount} questions</p>
                            <Button size="sm" onClick={() => startQuestionPack(p.id)} data-testid={`button-start-${p.id}`}>
                              Start Practice <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {flashcardPacks.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" /> Flashcard Decks
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {flashcardPacks.map((p) => (
                        <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" data-testid={`study-fc-${p.id}`}>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-sm mb-1">{p.title}</h3>
                            <p className="text-xs text-gray-500 mb-3">{p.itemCount} cards</p>
                            <Button size="sm" onClick={() => startFlashcardPack(p.id)} data-testid={`button-start-fc-${p.id}`}>
                              Start Review <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "study" && mode === "questions" && questions[currentQ] && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500" data-testid="text-q-progress">
                Question {currentQ + 1} / {questions.length}
              </span>
              <span className="text-sm font-medium">Score: {score}/{total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
            <Card className="shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <p className="text-base sm:text-lg font-medium mb-4" data-testid="text-offline-stem">{questions[currentQ].stem}</p>
                <div className="space-y-2">
                  {(questions[currentQ].options || []).map((opt: any, idx: number) => {
                    const label = opt.label || String.fromCharCode(65 + idx);
                    const text = opt.text || opt;
                    const isSelected = selectedAnswer === label;
                    const isCorrect = questions[currentQ].correctAnswer?.includes?.(label) || questions[currentQ].correctAnswer === label;
                    let cls = "border-gray-200 hover:border-primary cursor-pointer";
                    if (showResult) {
                      if (isCorrect) cls = "border-green-500 bg-green-50";
                      else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-50";
                      else cls = "border-gray-200 opacity-60";
                    }
                    return (
                      <button key={idx} onClick={() => handleAnswer(label)} disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all min-h-[48px] ${cls}`}
                        data-testid={`button-offline-opt-${label}`}>
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold shrink-0">{label}</span>
                          <span className="text-sm">{text}</span>
                          {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {showResult && questions[currentQ].rationale && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <Lightbulb className="w-4 h-4 inline mr-1" />
                    {questions[currentQ].rationale}
                  </div>
                )}
                {showResult && (
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setMode("menu")} data-testid="button-offline-exit">{t("pages.offlineStudy.exit")}</Button>
                    <Button size="sm" onClick={nextQuestion} data-testid="button-offline-next">
                      {currentQ < questions.length - 1 ? "Next" : "Finish"} <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "study" && mode === "flashcards" && flashcards[currentCard] && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Card {currentCard + 1} / {flashcards.length}</span>
              <Button variant="outline" size="sm" onClick={() => setMode("menu")} data-testid="button-fc-exit">{t("pages.offlineStudy.exit2")}</Button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }} />
            </div>
            <Card
              className="shadow-lg cursor-pointer min-h-[200px] flex items-center justify-center"
              onClick={() => setFlipped(!flipped)}
              data-testid="card-offline-flashcard"
            >
              <CardContent className="p-6 text-center">
                <p className="text-xs text-gray-400 mb-2">{flipped ? "Answer" : "Question"}</p>
                <p className="text-lg font-medium" data-testid="text-flashcard-content">
                  {flipped ? flashcards[currentCard].back : flashcards[currentCard].front}
                </p>
                {flipped && flashcards[currentCard].rationale && (
                  <p className="text-sm text-gray-500 mt-3">{flashcards[currentCard].rationale}</p>
                )}
              </CardContent>
            </Card>
            {flipped && (
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="border-red-200 text-red-600 min-h-[48px] min-w-[120px] text-base" onClick={() => markCard(false)} data-testid="button-fc-incorrect">
                  <XCircle className="w-5 h-5 mr-1.5" /> Didn't Know
                </Button>
                <Button variant="outline" className="border-green-200 text-green-600 min-h-[48px] min-w-[120px] text-base" onClick={() => markCard(true)} data-testid="button-fc-correct">
                  <CheckCircle2 className="w-5 h-5 mr-1.5" /> Got It
                </Button>
              </div>
            )}
          </div>
        )}

        {tab === "download" && <OfflineDownloadManager />}

        {tab === "settings" && (
          <div className="space-y-6">
            <PushNotificationSettings />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

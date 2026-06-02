import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import {
  Settings, PlayCircle, ArrowLeft, BookOpen, Bookmark,
  XCircle, SlidersHorizontal, Target, Zap
} from "lucide-react";

const NURSING_DOMAINS = [
  "Professional Practice", "Nurse-Client Relationship", "Health Promotion",
  "Illness Prevention", "Curative & Supportive Care", "Rehabilitative Care",
  "Pharmacology", "Pediatric Nursing", "Mental Health", "Maternal-Newborn",
  "Medical-Surgical", "Community Health", "Leadership & Management",
];

const PROFESSION_DOMAINS: Record<string, string[]> = {
  nursing: NURSING_DOMAINS,
  rpn: NURSING_DOMAINS,
  rn: NURSING_DOMAINS,
  np: [...NURSING_DOMAINS, "Advanced Clinical Assessment", "Diagnostic Reasoning"],
  paramedic: [
    "Airway Management", "Cardiology", "Trauma", "Medical Emergencies",
    "Pharmacology", "Obstetrics & Pediatrics", "Operations", "Legal & Ethics",
  ],
  rrt: [
    "Patient Assessment", "Airway Management", "Ventilator Management",
    "Oxygen Therapy", "Diagnostics", "Neonatal & Pediatric", "Pharmacology",
  ],
  mlt: [
    "Clinical Chemistry", "Hematology", "Microbiology", "Blood Banking",
    "Urinalysis & Body Fluids", "Immunology", "Molecular Diagnostics",
    "Laboratory Operations",
  ],
  imaging: [
    "Radiographic Procedures", "Patient Care", "Radiation Protection",
    "Image Production", "Equipment Operation", "Quality Assurance",
  ],
};

function getDomains(userTier: string, profession?: string): string[] {

  if (profession && PROFESSION_DOMAINS[profession]) {
    return PROFESSION_DOMAINS[profession];
  }
  const tierProfessionMap: Record<string, string> = {
    rpn: "rpn", rn: "rn", np: "np", free: "nursing", admin: "nursing",
  };
  return PROFESSION_DOMAINS[tierProfessionMap[userTier] || "nursing"] || NURSING_DOMAINS;
}

export default function CustomPracticePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([1, 5]);
  const [questionCount, setQuestionCount] = useState(20);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [creating, setCreating] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const source = searchParams.get("source");
  const preSelectedTopics = searchParams.get("topics");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (preSelectedTopics) {
      setSelectedTopics(preSelectedTopics.split(","));
    }
    if (source === "bookmarks") {
      setBookmarkedOnly(true);
    }
  }, [user, preSelectedTopics, source]);

  const domains = getDomains(user?.tier || "free", user?.profession);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const selectAllTopics = () => setSelectedTopics([...domains]);
  const clearAllTopics = () => setSelectedTopics([]);

  const handleStartSession = async () => {
    if (!user) return;
    setCreating(true);
    try {
      const res = await fetch("/api/practice-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
        body: JSON.stringify({
          topics: selectedTopics.length > 0 ? selectedTopics : domains,
          difficultyMin: difficultyRange[0],
          difficultyMax: difficultyRange[1],
          questionCount,
          incorrectOnly,
          bookmarkedOnly,
          questionIds: source === "bookmarks" ? searchParams.get("ids")?.split(",") : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/mock-exams/${data.sessionId || data.id}`);
      } else {
        toast({ title: "Error", description: "Failed to create practice session", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create practice session", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  const difficultyLabels: Record<number, string> = { 1: "Very Easy", 2: "Easy", 3: "Medium", 4: "Hard", 5: "Very Hard", 6: "Expert", 7: "Critical Thinking" };

  return (
    <div className="min-h-screen bg-background" data-testid="custom-practice-page">
      <SEO
        title={t("pages.customPractice.customPracticeNursenest")}
        description={t("pages.customPractice.createACustomPracticeSession")}
        canonicalPath="/practice"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2" data-testid="text-practice-title">
            <SlidersHorizontal className="h-6 w-6 text-primary" />
            Custom Practice Mode
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure a practice session tailored to your study needs.
          </p>
        </header>

        <div className="space-y-6">
          <Card data-testid="card-topic-selection">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm" onClick={selectAllTopics} data-testid="button-select-all-topics">
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllTopics} data-testid="button-clear-all-topics">
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2" data-testid="topic-chips">
                {domains.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid={`chip-topic-${topic.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
              {selectedTopics.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  No topics selected — all topics will be included.
                </p>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-difficulty">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Difficulty Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Minimum: {difficultyLabels[difficultyRange[0]]} ({difficultyRange[0]})
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={difficultyRange[0]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDifficultyRange([val, Math.max(val, difficultyRange[1])]);
                    }}
                    className="w-full accent-primary"
                    data-testid="slider-difficulty-min"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Maximum: {difficultyLabels[difficultyRange[1]]} ({difficultyRange[1]})
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={difficultyRange[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setDifficultyRange([Math.min(val, difficultyRange[0]), val]);
                    }}
                    className="w-full accent-primary"
                    data-testid="slider-difficulty-max"
                  />
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-2 rounded-full ${
                        level >= difficultyRange[0] && level <= difficultyRange[1]
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-filters">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Source Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" data-testid="toggle-incorrect-only">
                  <input
                    type="checkbox"
                    checked={incorrectOnly}
                    onChange={(e) => setIncorrectOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("pages.customPractice.previouslyIncorrectOnly")}</p>
                    <p className="text-xs text-muted-foreground">{t("pages.customPractice.focusOnQuestionsYouGot")}</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors" data-testid="toggle-bookmarked-only">
                  <input
                    type="checkbox"
                    checked={bookmarkedOnly}
                    onChange={(e) => setBookmarkedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Bookmark className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t("pages.customPractice.bookmarkedOnly")}</p>
                    <p className="text-xs text-muted-foreground">{t("pages.customPractice.practiceOnlyYourBookmarkedQuestions")}</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-question-count">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Question Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(5, Math.min(100, parseInt(e.target.value) || 5)))}
                  className="w-24 px-3 py-2 border rounded-lg text-sm text-center font-medium"
                  data-testid="input-question-count"
                />
                <div className="flex gap-2">
                  {[10, 20, 30, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        questionCount === count
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      data-testid={`button-count-${count}`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Estimated time: ~{Math.round(questionCount * 1.5)} minutes
              </p>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-xl p-4 border">
            <h3 className="text-sm font-semibold mb-2">{t("pages.customPractice.sessionSummary")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{t("pages.customPractice.topics")}</p>
                <p className="font-medium" data-testid="text-summary-topics">
                  {selectedTopics.length > 0 ? selectedTopics.length : "All"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("pages.customPractice.difficulty")}</p>
                <p className="font-medium" data-testid="text-summary-difficulty">
                  {difficultyLabels[difficultyRange[0]]} — {difficultyLabels[difficultyRange[1]]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("pages.customPractice.questions")}</p>
                <p className="font-medium" data-testid="text-summary-count">{questionCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("pages.customPractice.filters")}</p>
                <p className="font-medium" data-testid="text-summary-filters">
                  {[incorrectOnly && "Incorrect", bookmarkedOnly && "Bookmarked"].filter(Boolean).join(", ") || "None"}
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleStartSession}
            disabled={creating}
            data-testid="button-start-practice-session"
          >
            <PlayCircle className="h-5 w-5" />
            {creating ? "Creating Session..." : "Start Practice Session"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

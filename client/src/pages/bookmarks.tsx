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
import { useProtectedFetch } from "@/components/protected-access-recovery";
import {
  Bookmark, BookmarkX, Search, Filter, PlayCircle, ArrowLeft,
  ChevronDown, CheckCircle2, XCircle, Tag
} from "lucide-react";

type BookmarkedQuestion = {
  id: string;
  question: string;
  bodySystem: string;
  difficulty: string;
  options: string[];
  correct: number;
  bookmarkedAt: string;
  lastAttemptCorrect?: boolean;
};

export function BookmarkToggle({
  questionId,
  isBookmarked,
  onToggle,
  size = "sm",
}: {
  questionId: string;
  isBookmarked: boolean;
  onToggle?: (questionId: string, newState: boolean) => void;
  size?: "sm" | "md";
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleToggle = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookmarks/${questionId}`, {
        method: bookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.id },
      });
      if (res.ok) {
        const newState = !bookmarked;
        setBookmarked(newState);
        onToggle?.(questionId, newState);
        toast({
          title: newState ? "Bookmarked" : "Removed",
          description: newState ? "Question added to bookmarks" : "Question removed from bookmarks",
        });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update bookmark", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = size === "md" ? "h-9 w-9" : "h-7 w-7";
  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`${sizeClasses} flex items-center justify-center rounded-lg transition-all ${
        bookmarked
          ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-amber-500"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      data-testid={`button-bookmark-${questionId}`}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className={`${iconSize} ${bookmarked ? "fill-current" : ""}`} />
    </button>
  );
}

export default function BookmarksPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const protectedFetch = useProtectedFetch("bookmarks");
  const [bookmarks, setBookmarks] = useState<BookmarkedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSystem, setFilterSystem] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await protectedFetch("/api/bookmarks", {
        headers: { "x-user-id": user.id },
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(Array.isArray(data) ? data : []);
      }
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (questionId: string) => {
    if (!user) return;
    try {
      await fetch(`/api/bookmarks/${questionId}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      });
      setBookmarks((prev) => prev.filter((b) => b.id !== questionId));
      toast({ title: "Removed", description: "Bookmark removed" });
    } catch {
      toast({ title: "Error", description: "Failed to remove bookmark", variant: "destructive" });
    }
  };

  const handleLaunchReview = () => {
    const ids = filteredBookmarks.map((b) => b.id);
    if (ids.length === 0) return;
    navigate(`/practice?source=bookmarks&ids=${ids.join(",")}`);
  };

  const systems = [...new Set(bookmarks.map((b) => b.bodySystem))].sort();
  const difficulties = [...new Set(bookmarks.map((b) => b.difficulty))].sort();

  const filteredBookmarks = bookmarks.filter((b) => {
    if (searchQuery && !b.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterSystem !== "all" && b.bodySystem !== filterSystem) return false;
    if (filterDifficulty !== "all" && b.difficulty !== filterDifficulty) return false;
    return true;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" data-testid="bookmarks-page">
      <SEO
        title={t("pages.bookmarks.bookmarkedQuestionsNursenest")}
        description={t("pages.bookmarks.reviewYourBookmarkedQuestionsFor")}
        canonicalPath="/bookmarks"
      />
      <Navigation />
      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} data-testid="button-back-dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" /> Dashboard
          </Button>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2" data-testid="text-bookmarks-title">
              <Bookmark className="h-6 w-6 text-amber-500" />
              Bookmarked Questions
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {bookmarks.length} question{bookmarks.length !== 1 ? "s" : ""} bookmarked
            </p>
          </div>
          {filteredBookmarks.length > 0 && (
            <Button onClick={handleLaunchReview} className="gap-2" data-testid="button-review-bookmarked">
              <PlayCircle className="h-4 w-4" />
              Review Bookmarked ({filteredBookmarks.length})
            </Button>
          )}
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("pages.bookmarks.searchBookmarkedQuestions")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              data-testid="input-search-bookmarks"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
            data-testid="button-toggle-filters"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 bg-muted/30 rounded-lg border" data-testid="filters-panel">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("pages.bookmarks.bodySystem")}</label>
              <select
                value={filterSystem}
                onChange={(e) => setFilterSystem(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                data-testid="select-filter-system"
              >
                <option value="all">{t("pages.bookmarks.allSystems")}</option>
                {systems.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("pages.bookmarks.difficulty")}</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                data-testid="select-filter-difficulty"
              >
                <option value="all">{t("pages.bookmarks.allDifficulties")}</option>
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2" data-testid="text-no-bookmarks">
                {bookmarks.length === 0 ? "No Bookmarked Questions Yet" : "No Matching Questions"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {bookmarks.length === 0
                  ? "Bookmark questions during practice or mock exams to review them later."
                  : "Try adjusting your search or filters."}
              </p>
              {bookmarks.length === 0 && (
                <Button variant="outline" onClick={() => navigate("/mock-exams")} data-testid="button-start-practicing">
                  Start Practicing
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3" data-testid="bookmarks-list">
            {filteredBookmarks.map((bq) => (
              <Card key={bq.id} className="hover:shadow-sm transition-shadow" data-testid={`bookmark-card-${bq.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed mb-2" data-testid={`text-question-${bq.id}`}>
                        {bq.question}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          <Tag className="h-3 w-3" />
                          {bq.bodySystem}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          bq.difficulty === "hard" ? "bg-red-50 text-red-700" :
                          bq.difficulty === "medium" ? "bg-amber-50 text-amber-700" :
                          "bg-green-50 text-green-700"
                        }`}>
                          {bq.difficulty}
                        </span>
                        {bq.lastAttemptCorrect !== undefined && (
                          <span className={`inline-flex items-center gap-1 text-xs ${bq.lastAttemptCorrect ? "text-green-600" : "text-red-600"}`}>
                            {bq.lastAttemptCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {bq.lastAttemptCorrect ? "Correct" : "Incorrect"}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Bookmarked {new Date(bq.bookmarkedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(bq.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                      data-testid={`button-remove-bookmark-${bq.id}`}
                      aria-label={t("pages.bookmarks.removeBookmark")}
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

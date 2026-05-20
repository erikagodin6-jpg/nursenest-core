import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, X, BookOpen, Stethoscope, Pill, FileText, ArrowRight, Layers, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { readApiJsonResponse, BackendErrorCodes } from "@/lib/api-error";

type SearchResult = {
  id: string;
  title: string;
  type: "lesson" | "clinical-clarity" | "medication" | "blog" | "deck";
  path: string;
  snippet?: string;
};

const TYPE_ICONS: Record<string, any> = {
  lesson: BookOpen,
  "clinical-clarity": Stethoscope,
  medication: Pill,
  blog: Newspaper,
  deck: Layers,
};

const TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  "clinical-clarity": "Clinical Clarity",
  medication: "Medication",
  blog: "Blog Article",
  deck: "Flashcard Deck",
};

export function GlobalSearch({ compact = false }: { compact?: boolean } = {}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { data: lessonResults = [] } = useQuery<SearchResult[]>({
    queryKey: ["/api/lessons/search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const res = await fetch(`/api/lessons/search?q=${encodeURIComponent(query)}`);
      const parsed = await readApiJsonResponse<unknown[]>(res);
      if (!parsed.ok) {
        if (parsed.code === BackendErrorCodes.CONTENT_MODULE_UNAVAILABLE) {
          console.warn("[GlobalSearch] lesson search degraded:", parsed.message);
        }
        return [];
      }
      const items = Array.isArray(parsed.data) ? parsed.data : [];
      return items.map((m: any) => ({
        id: m.id,
        title: m.title,
        type: "lesson" as const,
        path: `/lessons/${m.id}`,
        snippet: "",
      }));
    },
    staleTime: 30_000,
    enabled: open && query.length >= 2,
  });

  const { data: contentItems = [] } = useQuery({
    queryKey: ["/api/search/content"],
    queryFn: async () => {
      const types = ["article", "blog-post", "blog"];
      const all: any[] = [];
      for (const t of types) {
        try {
          const res = await fetch(`/api/content?type=${t}`);
          if (res.ok) {
            const items = await res.json();
            all.push(...items);
          }
        } catch {}
      }
      return all;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const { data: publicDecks = [] } = useQuery({
    queryKey: ["/api/search/decks"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/decks?visibility=public");
        if (res.ok) return await res.json();
      } catch {}
      return [];
    },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const searchIndex = useMemo(() => {
    const combined = [...lessonResults];

    const seenSlugs = new Set(combined.map((r) => r.id));

    if (Array.isArray(contentItems)) {
      contentItems.forEach((item: any) => {
        if (item.slug && item.status === "published" && !seenSlugs.has(item.slug)) {
          seenSlugs.add(item.slug);
          const snippetText = item.summary || "";
          let contentSnippet = "";
          if (item.content && Array.isArray(item.content)) {
            contentSnippet = item.content
              .slice(0, 5)
              .map((b: any) => b.content || b.text || "")
              .join(" ")
              .slice(0, 200);
          }
          combined.push({
            id: item.slug,
            title: item.title,
            type: "blog",
            path: `/learn/${item.slug}`,
            snippet: snippetText || contentSnippet,
          });
        }
      });
    }

    if (Array.isArray(publicDecks)) {
      publicDecks.forEach((deck: any) => {
        if (deck.id && !seenSlugs.has(`deck-${deck.id}`)) {
          seenSlugs.add(`deck-${deck.id}`);
          combined.push({
            id: `deck-${deck.id}`,
            title: deck.title,
            type: "deck",
            path: `/flashcards?deck=${deck.id}`,
            snippet: deck.description || `${deck.cardCount || 0} cards`,
          });
        }
      });
    }

    return combined;
  }, [lessonResults, contentItems, publicDecks]);

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    return searchIndex
      .map((item) => {
        const titleLower = item.title.toLowerCase();
        const snippetLower = (item.snippet || "").toLowerCase();

        let score = 0;
        let matches = true;
        for (const word of words) {
          const inTitle = titleLower.includes(word);
          const inSnippet = snippetLower.includes(word);
          if (!inTitle && !inSnippet) {
            matches = false;
            break;
          }
          if (inTitle) score += 10;
          if (inSnippet) score += 3;
        }
        if (titleLower === q) score += 50;
        if (titleLower.startsWith(q)) score += 20;

        return { ...item, score, matches };
      })
      .filter((item) => item.matches)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [query, searchIndex]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = (result: SearchResult) => {
    setLocation(result.path);
    setOpen(false);
    setQuery("");
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!open) {
    if (compact) {
      return (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors"
          data-testid="button-global-search-compact"
          aria-label={t("components.globalSearch.search")}
        >
          <Search className="w-4 h-4" />
        </button>
      );
    }
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/15 bg-white/70 hover:bg-white transition-colors text-xs text-gray-400 hover:text-primary w-32 sm:w-44 lg:w-56"
        data-testid="button-global-search"
      >
        <Search className="w-3 h-3 shrink-0" />
        <span className="truncate">{t("nav.searchEverything")}</span>
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]" />
      <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]">
        <div
          ref={containerRef}
          className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden"
          data-testid="section-global-search"
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Search className="w-5 h-5 text-primary/60 shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("nav.searchEverything")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyNav}
              className="border-0 shadow-none focus-visible:ring-0 text-base px-0 h-auto"
              data-testid="input-global-search"
            />
            <button
              onClick={() => { setOpen(false); setQuery(""); }}
              className="shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {query.length >= 2 && results.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">{t("search.noResults")} "{query}"</p>
                <p className="text-xs mt-1">{t("search.tryDifferent")}</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type] || FileText;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left group ${
                        isSelected ? "bg-primary/10" : "hover:bg-primary/5"
                      }`}
                      data-testid={`search-result-${result.id}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {TYPE_LABELS[result.type]}
                          </span>
                          {result.snippet && (
                            <span className="text-xs text-gray-300 truncate max-w-[200px]">
                              {result.snippet.slice(0, 60)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            )}

            {query.length < 2 && (
              <div className="px-6 py-8 text-center text-gray-400">
                <p className="text-sm">{t("search.minChars")}</p>
                <p className="text-xs mt-1">{t("search.searchAcross")}</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">↑↓</kbd> {t("components.globalSearch.navigate")}</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">{t("components.globalSearch.enter")}</kbd> {t("components.globalSearch.select")}</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">{t("components.globalSearch.esc")}</kbd> {t("components.globalSearch.close")}</span>
            </div>
            <span>{searchIndex.length} items indexed</span>
          </div>
        </div>
      </div>
    </>
  );
}

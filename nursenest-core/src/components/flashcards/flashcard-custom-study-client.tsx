"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import {
  ActiveStudySession,
  type ActiveStudyCard,
  type ActiveStudyHeader,
} from "@/components/study/active-study-session";
import { isSyntheticFlashcardStudyId } from "@/lib/flashcards/flashcard-access";
import { parseFlashcardCustomSessionResponse } from "@/lib/flashcards/flashcard-custom-session-response";
import { isSataPayload, type ExamMicroQuestionPayload, type SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildAppQuestionBankTopicDrillHref,
  humanizeTopicSlug,
} from "@/components/lessons/pathway-lesson-link-practice";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import {
  clearFlashcardsCustomSessionCheckpoint,
  saveFlashcardsCustomSessionCheckpoint,
} from "@/lib/flashcards/flashcards-hub-preferences";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";
import { emitRuntimeEvent } from "@/lib/runtime/client-runtime-event";

type ApiCard = {
  id: string;
  front: string;
  back: string;
  topic?: string;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload | SataQuestionPayload;
  lessonHref?: string;
  lessonTitle?: string;
  /** Same as {@link lessonHref} when serialized from `serializeFlashcardForCustomSession` cross-link. */
  lessonStudyHref?: string;
  lessonStudyTitle?: string;
  lessonSlug?: string;
  clinicalImageUrl?: string | null;
};

type SessionSummary = {
  matchingCards: number;
  returnedCards?: number;
  hasMore?: boolean;
  offset?: number;
  weakOnly: boolean;
  starredOnly: boolean;
  selectedCategories: string[];
};

type SessionErrorState = {
  title: string;
  detail: string;
  message: string;
  code?: string;
};

function isPlaceholderFlashcardStem(stem: string): boolean {
  const normalized = stem.trim().toLowerCase();
  return (
    normalized.startsWith("clinical recall") ||
    normalized.includes("tap to reveal") ||
    normalized.includes("which finding or action best reflects the clinical principle") ||
    /\b([a-z]+) - \1\b/.test(normalized)
  );
}

function hasRenderableFlashcard(card: ApiCard): boolean {
  if (!card.front.trim() || !card.back.trim()) return false;
  const exam = card.examMicroQuestion;
  if (!exam || isSataPayload(exam)) return true;
  const stem = exam.questionStem?.trim() ?? "";
  return Boolean(
    stem.length >= 10 &&
      !isPlaceholderFlashcardStem(stem) &&
      Array.isArray(exam.answerOptions) &&
      exam.answerOptions.length === 4 &&
      exam.answerOptions.every((option) => option.text.trim().length > 0) &&
      typeof exam.correctLetter === "string" &&
      exam.correctLetter.trim().length > 0,
  );
}

function flashcardSessionFailureCopy(code: string | undefined, message: string, isResume: boolean): SessionErrorState {
  const normalizedCode = (code ?? "").trim().toLowerCase();
  const normalizedMessage = message.trim() || "The session request failed.";
  if (normalizedCode.includes("empty") || /no flashcards|empty pool|no cards/i.test(normalizedMessage)) {
    return {
      title: "Flashcard pool is empty.",
      detail: "No flashcards were found for the selected systems and filters.",
      message: normalizedMessage,
      code,
    };
  }
  if (normalizedCode.includes("invalid")) {
    return {
      title: "Session data is invalid.",
      detail: "The session response did not match the flashcard player contract.",
      message: normalizedMessage,
      code,
    };
  }
  if (normalizedCode.includes("timeout") || normalizedCode.includes("service_unavailable")) {
    return {
      title: isResume ? "Unable to resume previous session." : "Your study session could not be created.",
      detail: "The flashcard service did not respond in time.",
      message: normalizedMessage,
      code,
    };
  }
  if (normalizedCode.includes("database")) {
    return {
      title: "Your study session could not be created.",
      detail: "The flashcard pool could not be read from the content database.",
      message: normalizedMessage,
      code,
    };
  }
  return {
    title: isResume ? "Unable to resume previous session." : "Your study session could not be created.",
    detail: "The flashcard player received a precise failure from the session API.",
    message: normalizedMessage,
    code,
  };
}

export function FlashcardCustomStudyClient() {
  const sp = useSearchParams();
  const { t } = useMarketingI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<SessionErrorState | null>(null);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [loadingStage, setLoadingStage] = useState<"preparing" | "due" | "building" | "still">("preparing");
  const prefetchedOffsets = useRef(new Set<number>());
  const sessionSeedRef = useRef<string>("");
  if (!sessionSeedRef.current) {
    sessionSeedRef.current =
      globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  const searchParamString = sp.toString();
  const pathwayId = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    return q.get("pathwayId")?.trim() ?? "";
  }, [searchParamString]);

  const initialCardIndex = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const raw = q.get("resumeIndex");
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  }, [searchParamString]);

  const queryString = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const rawLimit = Number(q.get("cardLimit") || "20");
    const requestedLimit = Number.isFinite(rawLimit) ? Math.max(1, Math.floor(rawLimit)) : 20;
    q.set("includeCards", "1");
    if (!q.get("shuffle")) q.set("shuffle", "1");
    q.set("sessionSeed", sessionSeedRef.current);
    q.set("offset", "0");
    q.set("cardLimit", String(Math.min(requestedLimit, 8)));
    return q.toString();
  }, [searchParamString]);

  const requestedCardLimit = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const raw = Number(q.get("cardLimit") || "20");
    return Number.isFinite(raw) ? Math.max(1, Math.floor(raw)) : 20;
  }, [searchParamString]);

  const exitHref = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const pid = q.get("pathwayId")?.trim();
    if (!pid) return "/app/flashcards";
    const out = new URLSearchParams({ pathwayId: pid });
    const topicSlug =
      q.get("topic")?.trim().toLowerCase() || q.get("topicCode")?.trim().toLowerCase() || "";
    if (topicSlug) out.set("topic", topicSlug);
    if (q.get("weakOnly") === "1") out.set("weakOnly", "1");
    return `/app/flashcards?${out.toString()}`;
  }, [searchParamString]);

  const sessionTopicSlug = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    return q.get("topic")?.trim().toLowerCase() || q.get("topicCode")?.trim().toLowerCase() || null;
  }, [searchParamString]);

  const practiceTopicHref = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const pid = q.get("pathwayId")?.trim();
    const topicCode = sessionTopicSlug;
    if (!pid || !topicCode) return null;
    const pathway = getExamPathwayById(pid);
    if (!pathway) return null;
    const topicParam = q.get("topic")?.trim();
    const topicLabel = topicParam || humanizeTopicSlug(topicCode);
    return buildAppQuestionBankTopicDrillHref(pathway, topicLabel, topicCode);
  }, [searchParamString, sessionTopicSlug]);

  const practiceTestsTopicHref = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    const pid = q.get("pathwayId")?.trim();
    const ts = sessionTopicSlug;
    if (!pid || !ts) return null;
    return buildAppPracticeTestsTopicHref(pid, ts);
  }, [searchParamString, sessionTopicSlug]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const stageTimers = [
      window.setTimeout(() => {
        if (!cancelled) setLoadingStage("due");
      }, 900),
      window.setTimeout(() => {
        if (!cancelled) setLoadingStage("building");
      }, 2200),
      window.setTimeout(() => {
        if (!cancelled) setLoadingStage("still");
      }, 4000),
    ];
    (async () => {
      setLoading(true);
      setError(null);
      setLoadingStage("preparing");
      prefetchedOffsets.current.clear();
      try {
        const res = await fetchWithRetry(`/api/flashcards/custom-session?${queryString}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }, { attempts: 2, timeoutMs: 8_000 });
        let json: unknown;
        try {
          json = await res.json();
        } catch (jsonErr) {
          logDedupedClientDiagnostic("flashcard_custom_session", "json_parse_failed", `${pathwayId}:${res.status}`, {
            pathwayId,
            httpStatus: res.status,
            message: jsonErr instanceof Error ? jsonErr.message : "unknown",
          });
          if (!cancelled) {
            setError({
              title: "Session data is invalid.",
              detail: "The study API returned data the flashcard player could not safely use.",
              message: "Refresh this session or return to the launcher and start a new one.",
              code: "invalid_json",
            });
          }
          return;
        }
        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        if (!parsed.ok) {
          const failureCopy = flashcardSessionFailureCopy(parsed.code, parsed.message, initialCardIndex > 0);
          emitRuntimeEvent("activity_bootstrap_failure", {
            activity: "flashcards",
            pathwayId,
            status: res.status,
            errorCode: parsed.code ?? "flashcard_custom_session_payload_invalid",
          });
          logDedupedClientDiagnostic("flashcard_custom_session", "payload_parse_failed", `${pathwayId}:${res.status}`, {
            pathwayId,
            httpStatus: res.status,
            errorCode: parsed.code ?? "unknown",
            finalCount: parsed.integrity?.finalCount,
            message: parsed.message,
          });
          if (!cancelled) setError(failureCopy);
          return;
        }
        const rawCards =
          json && typeof json === "object" && Array.isArray((json as { cards?: unknown }).cards)
            ? ((json as { cards: ApiCard[] }).cards ?? [])
            : [];
        const validCards = rawCards.filter(
          (c) => c && typeof c.id === "string" && c.id.length > 0 &&
                 typeof c.front === "string" && typeof c.back === "string",
        ).filter(hasRenderableFlashcard);
        if (parsed.summary && parsed.summary.matchingCards > 0 && rawCards.length > 0 && validCards.length === 0) {
          const failureCopy = flashcardSessionFailureCopy(
            "session_data_invalid",
            "Session data is invalid. The selected flashcards could not be prepared for study.",
            initialCardIndex > 0,
          );
          emitRuntimeEvent("activity_bootstrap_failure", {
            activity: "flashcards",
            pathwayId,
            status: res.status,
            errorCode: "session_data_invalid",
          });
          logDedupedClientDiagnostic("flashcard_custom_session", "renderable_cards_empty", `${pathwayId}:${res.status}`, {
            pathwayId,
            httpStatus: res.status,
            matchingCards: parsed.summary.matchingCards,
            returnedCards: parsed.summary.returnedCards,
            rawCards: rawCards.length,
          });
          if (!cancelled) setError(failureCopy);
          return;
        }
        if (!cancelled) {
          setCards(validCards);
          setSummary(
            parsed.summary
              ? {
                  matchingCards: parsed.summary.matchingCards,
                  returnedCards: parsed.summary.returnedCards,
                  hasMore: parsed.summary.hasMore,
                  offset: parsed.summary.offset,
                  weakOnly: parsed.summary.weakOnly,
                  starredOnly: parsed.summary.starredOnly,
                  selectedCategories: parsed.summary.selectedCategories ?? [],
                }
              : null,
          );
          emitRuntimeEvent("flashcard_custom_session_bootstrap_complete", {
            pathwayId,
            cardCount: validCards.length,
            status: res.status,
          });
        }
      } catch (err) {
        if (cancelled) return;
        if (controller.signal.aborted) return;
        emitRuntimeEvent("activity_bootstrap_failure", {
          activity: "flashcards",
          pathwayId,
          errorCode: "flashcard_custom_session_network_error",
        });
        logDedupedClientDiagnostic("flashcard_custom_session", "network_error", pathwayId || "unknown", {
          pathwayId,
          message: err instanceof Error ? err.message : "unknown",
        });
        if (!cancelled) {
          setError({
            title: initialCardIndex > 0 ? "Unable to resume previous session." : "Your study session could not be created.",
            detail: "The request did not complete before the flashcard player could hydrate.",
            message: "Retry the session. If it repeats, go back to the launcher and start from the same systems.",
            code: "network_error",
          });
        }
      } finally {
        stageTimers.forEach(window.clearTimeout);
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      stageTimers.forEach(window.clearTimeout);
      controller.abort();
    };
  }, [queryString, pathwayId, retryNonce, initialCardIndex]);

  const prefetchMore = useCallback(
    async (loadedCount: number) => {
      if (!summary?.hasMore) return;
      if (loadedCount >= Math.min(requestedCardLimit, summary.matchingCards)) return;
      if (prefetchedOffsets.current.has(loadedCount)) return;
      prefetchedOffsets.current.add(loadedCount);
      const controller = new AbortController();
      try {
        const q = new URLSearchParams(searchParamString);
        q.set("includeCards", "1");
        if (!q.get("shuffle")) q.set("shuffle", "1");
        q.set("sessionSeed", sessionSeedRef.current);
        q.set("offset", String(loadedCount));
        q.set("cardLimit", String(Math.min(4, requestedCardLimit - loadedCount)));
        const res = await fetchWithRetry(`/api/flashcards/custom-session?${q.toString()}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }, { attempts: 1, timeoutMs: 6_000 });
        if (!res.ok) return;
        const json = await res.json();
        const rawCards =
          json && typeof json === "object" && Array.isArray((json as { cards?: unknown }).cards)
            ? ((json as { cards: ApiCard[] }).cards ?? [])
            : [];
        const validCards = rawCards.filter(
          (c) => c && typeof c.id === "string" && c.id.length > 0 &&
                 typeof c.front === "string" && typeof c.back === "string",
        ).filter(hasRenderableFlashcard);
        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        setCards((prev) => {
          const seen = new Set(prev.map((card) => card.id));
          const merged = [...prev];
          for (const card of validCards) {
            if (!seen.has(card.id)) merged.push(card);
          }
          return merged;
        });
        if (parsed.ok && parsed.summary) {
          setSummary((prev) => prev ? {
            ...prev,
            returnedCards: Math.max(prev.returnedCards ?? 0, loadedCount + validCards.length),
            hasMore: parsed.summary?.hasMore,
            offset: parsed.summary?.offset,
          } : prev);
        }
      } catch {
        prefetchedOffsets.current.delete(loadedCount);
      }
    },
    [requestedCardLimit, searchParamString, summary?.hasMore, summary?.matchingCards],
  );

  const loadingCopy = useMemo(() => {
    switch (loadingStage) {
      case "due":
        return {
          message: "Loading due cards...",
          detail: "Checking saved progress, filters, and deck availability.",
          showRetry: false,
        };
      case "building":
        return {
          message: "Building study session...",
          detail: "Arranging the first card, rationale panel, and grading controls.",
          showRetry: false,
        };
      case "still":
        return {
          message: "Still loading your session...",
          detail: "This can take a moment on a slower connection. You can retry without losing your setup.",
          showRetry: true,
        };
      case "preparing":
      default:
        return {
          message: "Preparing your flashcards...",
          detail: "Opening the study workspace while your cards load.",
          showRetry: false,
        };
    }
  }, [loadingStage]);

  const activeCards: ActiveStudyCard[] = useMemo(
    () =>
      cards.map((c) => {
        const href = c.lessonHref?.trim() || c.lessonStudyHref?.trim() || null;
        const title = c.lessonTitle?.trim() || c.lessonStudyTitle?.trim() || null;
        return {
          id: c.id,
          prompt: c.front,
          answer: c.back,
          explanation: c.explanation,
          examMicroQuestion: isSataPayload(c.examMicroQuestion) ? undefined : c.examMicroQuestion,
          topic: c.topic,
          subtopic: c.subtopic,
          sourceKey: c.sourceKey,
          pathwayId: c.pathwayId,
          topicSlug: c.subtopic,
          lessonHref: href,
          lessonTitle: title,
          practiceTopicHref,
          practiceTestsTopicHref,
          clinicalImageUrl: c.clinicalImageUrl?.trim() || null,
        };
      }),
    [cards, practiceTopicHref, practiceTestsTopicHref],
  );

  const categoriesLabel = useMemo(() => {
    if (summary?.selectedCategories && summary.selectedCategories.length > 0) {
      const n = summary.selectedCategories.length;
      return `${n} system${n === 1 ? "" : "s"} selected`;
    }
    const q = new URLSearchParams(searchParamString);
    const cats = q.get("categories")?.trim();
    if (cats) {
      const n = cats.split(",").filter(Boolean).length;
      if (n > 0) return `${n} system${n === 1 ? "" : "s"} selected`;
    }
    return "All systems";
  }, [summary, searchParamString]);

  const header: ActiveStudyHeader = useMemo(
    () => {
      const q = new URLSearchParams(searchParamString);
      const pathwayId = q.get("pathwayId")?.trim() ?? "";
      const raw = pathwayId.toLowerCase();
      const hubLabel =
        raw.includes("np") || raw.includes("cnple")
          ? "NP Hub"
          : raw.includes("pn") || raw.includes("rpn") || raw.includes("lpn") || raw.includes("rex")
            ? "PN Hub"
            : raw.includes("allied")
              ? "Allied Hub"
              : "RN Hub";
      return {
        sessionTitle: t("learner.flashcards.hub.title"),
        modeLabel: "Study",
        categoriesLabel,
        exitHref,
        hubLabel,
      };
    },
    [exitHref, t, categoriesLabel, searchParamString],
  );

  const sessionMeta = useMemo(() => {
    if (!summary) return undefined;
    return {
      requestedCount: requestedCardLimit,
      returnedCount: summary.returnedCards ?? cards.length,
      totalAvailable: summary.matchingCards,
      hasMore: Boolean(summary.hasMore && cards.length < Math.min(requestedCardLimit, summary.matchingCards)),
    };
  }, [summary, requestedCardLimit, cards.length]);

  const onRate = useCallback(async (cardId: string, rating: "again" | "hard" | "good" | "easy") => {
    if (isSyntheticFlashcardStudyId(cardId)) return;
    try {
      await fetch(`/api/flashcards/cards/${encodeURIComponent(cardId)}/review`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
    } catch {
      /* non-fatal — progress is best-effort for custom sessions */
    }
  }, []);

  const onStudyProgress = useCallback(
    ({ index }: { index: number; revealed: boolean }) => {
      if (!pathwayId || activeCards.length === 0) return;
      const q = new URLSearchParams(searchParamString);
      q.delete("includeCards");
      q.delete("resumeIndex");
      saveFlashcardsCustomSessionCheckpoint({
        pathwayId,
        queryString: q.toString(),
        index,
        totalCards: activeCards.length,
        systemsLabel: categoriesLabel,
        updatedAt: new Date().toISOString(),
      });
    },
    [pathwayId, activeCards.length, searchParamString, categoriesLabel],
  );

  const onSessionComplete = useCallback(() => {
    if (pathwayId) clearFlashcardsCustomSessionCheckpoint(pathwayId);
  }, [pathwayId]);

  if (loading) {
    return (
      <FlashcardStudySessionSkeleton
        message={loadingCopy.message}
        detail={loadingCopy.detail}
        showRetry={loadingCopy.showRetry}
        onRetry={() => setRetryNonce((n) => n + 1)}
      />
    );
  }

  if (error) {
    return (
      <section className="nn-flashcard-session-error-shell" aria-labelledby="flashcard-session-error-title">
        <div className="nn-flashcard-session-error-card">
          <div className="nn-flashcard-session-error-icon" aria-hidden>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-2 text-center">
            <h1 id="flashcard-session-error-title">{error.title}</h1>
            <p>{error.detail}</p>
            <p className="nn-flashcard-session-error-detail">
              {error.message}
              {error.code ? <span className="sr-only"> Error code: {error.code}.</span> : null}
            </p>
          </div>
          <div className="nn-flashcard-session-error-actions">
            <button
              type="button"
              onClick={() => setRetryNonce((n) => n + 1)}
              className="nn-flashcard-session-error-primary"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Retry Session
            </button>
            <Link href={exitHref} className="nn-flashcard-session-error-secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Decks
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!activeCards.length) {
    const emptyStateClass =
      "nn-flashcard-empty-state mx-auto max-w-3xl space-y-3 rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-8 text-sm text-[var(--semantic-text-secondary)] shadow-[var(--semantic-shadow-soft)]";
    const emptyHeadingClass = "text-lg font-semibold text-[var(--semantic-text-primary)]";
    const emptyLinkClass = "inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-brand)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]";
    if (summary?.starredOnly) {
      return (
        <section className={emptyStateClass}>
          <h2 className={emptyHeadingClass}>No starred cards yet</h2>
          <p>Star cards while you study — they will appear here for quick review.</p>
          <Link href={exitHref} className={emptyLinkClass}>
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    if (summary?.weakOnly) {
      return (
        <section className={emptyStateClass}>
          <h2 className={emptyHeadingClass}>No weak-area flashcards yet</h2>
          <p>Weak-area cards appear after you rate cards as difficult or need more practice in a tracked session.</p>
          <Link href={exitHref} className={emptyLinkClass}>
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    if (summary && summary.selectedCategories.length > 0) {
      return (
        <section className={emptyStateClass}>
          <h2 className={emptyHeadingClass}>No cards in selected systems</h2>
          <p>Try adding another body system or clear the filter to study all systems.</p>
          <Link href={exitHref} className={emptyLinkClass}>
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    return (
      <section className={emptyStateClass}>
        <h2 className={emptyHeadingClass}>No cards for this pathway yet</h2>
        <p>
          There are no published cards for this filter. Try All cards or pick another body system.
        </p>
        <Link href={exitHref} className={emptyLinkClass}>
          {t("flashcards.backToMyCards")}
        </Link>
      </section>
    );
  }

  return (
    <div className="nn-flashcard-study-canvas mx-auto max-w-6xl px-4 py-2 sm:py-2">
      <div className="mb-4 flex justify-between">
        <Link href={exitHref} className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline">
          ← {t("flashcards.backToMyCards")}
        </Link>
      </div>

      <ExamSessionShell examMode="practice" className="nn-premium-flashcard-session-root nn-flashcard-study-premium">
        <ActiveStudySession
          cards={activeCards}
          header={header}
          layout="split"
          onRate={onRate}
          sessionMeta={sessionMeta}
          enableLocalStudyPins
          initialCardIndex={initialCardIndex}
          onStudyProgress={onStudyProgress}
          onNeedMore={({ loadedCount }) => void prefetchMore(loadedCount)}
          onSessionComplete={onSessionComplete}
        />
      </ExamSessionShell>
    </div>
  );
}

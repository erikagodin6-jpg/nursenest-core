"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";
import {
  ActiveStudySession,
  type ActiveStudyCard,
  type ActiveStudyHeader,
} from "@/components/study/active-study-session";
import { isSyntheticFlashcardStudyId } from "@/lib/flashcards/flashcard-access";
import { parseFlashcardCustomSessionResponse } from "@/lib/flashcards/flashcard-custom-session-response";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildAppQuestionBankTopicDrillHref,
  humanizeTopicSlug,
} from "@/components/lessons/pathway-lesson-link-practice";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";

type ApiCard = {
  id: string;
  front: string;
  back: string;
  topic?: string;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload;
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
  weakOnly: boolean;
  starredOnly: boolean;
  selectedCategories: string[];
};

export function FlashcardCustomStudyClient() {
  const sp = useSearchParams();
  const { t } = useMarketingI18n();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  const searchParamString = sp.toString();
  const queryString = useMemo(() => {
    const q = new URLSearchParams(searchParamString);
    q.set("includeCards", "1");
    if (!q.get("shuffle")) q.set("shuffle", "1");
    if (!q.get("cardLimit")) q.set("cardLimit", "20");
    return q.toString();
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
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/flashcards/custom-session?${queryString}`, { credentials: "include" });
        const json: unknown = await res.json();
        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        if (!parsed.ok) {
          if (!cancelled) setError(parsed.message);
          return;
        }
        const rawCards =
          json && typeof json === "object" && Array.isArray((json as { cards?: unknown }).cards)
            ? ((json as { cards: ApiCard[] }).cards ?? [])
            : [];
        if (!cancelled) {
          setCards(rawCards.filter((c) => c && typeof c.id === "string" && c.id.length > 0));
          setSummary(
            parsed.summary
              ? {
                  matchingCards: parsed.summary.matchingCards,
                  returnedCards: parsed.summary.returnedCards,
                  weakOnly: parsed.summary.weakOnly,
                  starredOnly: parsed.summary.starredOnly,
                  selectedCategories: parsed.summary.selectedCategories ?? [],
                }
              : null,
          );
        }
      } catch {
        if (!cancelled) setError("Could not load this session. Check your connection and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

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
          examMicroQuestion: c.examMicroQuestion,
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

  const header: ActiveStudyHeader = useMemo(
    () => ({
      sessionTitle: t("learner.flashcards.hub.title"),
      modeLabel: "Study",
      categoriesLabel: "",
      exitHref,
    }),
    [exitHref, t],
  );

  const sessionMeta = useMemo(() => {
    if (!summary) return undefined;
    const q = new URLSearchParams(searchParamString);
    const requested = Math.max(1, Number(q.get("cardLimit") || "20") || 20);
    return {
      requestedCount: requested,
      returnedCount: summary.returnedCards ?? cards.length,
      totalAvailable: summary.matchingCards,
    };
  }, [summary, searchParamString, cards.length]);

  const onRate = useCallback(async (cardId: string, rating: "again" | "hard" | "good" | "easy") => {
    if (isSyntheticFlashcardStudyId(cardId)) return;
    try {
      await fetch(`/api/flashcards/cards/${encodeURIComponent(cardId)}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
    } catch {
      /* non-fatal — progress is best-effort for custom sessions */
    }
  }, []);

  if (loading) {
    return (
      <BrandedPageLoader message={t("learner.loading.flashcards")} contentClassName="!p-0">
        <FlashcardStudySessionSkeleton withRouteAria={false} />
      </BrandedPageLoader>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 text-sm">
        <p className="text-destructive">{error}</p>
        <Link href={exitHref} className="text-primary underline">
          {t("flashcards.backToMyCards")}
        </Link>
      </div>
    );
  }

  if (!activeCards.length) {
    if (summary?.starredOnly) {
      return (
        <section className="mx-auto max-w-3xl space-y-3 rounded-2xl border border-border bg-[var(--theme-card-bg)] px-6 py-8 text-sm text-[var(--theme-muted-text)]">
          <h2 className="text-lg font-semibold text-[var(--theme-fg)]">No starred cards yet</h2>
          <p>Star cards while you study — they will appear here for quick review.</p>
          <Link href={exitHref} className="inline-block text-primary underline">
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    if (summary?.weakOnly) {
      return (
        <section className="mx-auto max-w-3xl space-y-3 rounded-2xl border border-border bg-[var(--theme-card-bg)] px-6 py-8 text-sm text-[var(--theme-muted-text)]">
          <h2 className="text-lg font-semibold text-[var(--theme-fg)]">No weak-area flashcards yet</h2>
          <p>Weak-area cards appear after you rate cards as difficult or need more practice in a tracked session.</p>
          <Link href={exitHref} className="inline-block text-primary underline">
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    if (summary && summary.selectedCategories.length > 0) {
      return (
        <section className="mx-auto max-w-3xl space-y-3 rounded-2xl border border-border bg-[var(--theme-card-bg)] px-6 py-8 text-sm text-[var(--theme-muted-text)]">
          <h2 className="text-lg font-semibold text-[var(--theme-fg)]">No cards in selected systems</h2>
          <p>Try adding another body system or clear the filter to study all systems.</p>
          <Link href={exitHref} className="inline-block text-primary underline">
            {t("flashcards.backToMyCards")}
          </Link>
        </section>
      );
    }
    return (
      <section className="mx-auto max-w-3xl space-y-3 rounded-2xl border border-border bg-[var(--theme-card-bg)] px-6 py-8 text-sm text-[var(--theme-muted-text)]">
        <h2 className="text-lg font-semibold text-[var(--theme-fg)]">No cards for this pathway yet</h2>
        <p>
          {summary && summary.matchingCards === 0
            ? "There are no published flashcards or bank-linked lesson questions for this filter. Try the hub with All cards, study a lesson with checkpoints (we synthesize recall cards from the catalog when the bank is empty), or pick another body system."
            : t("flashcards.noCardsMatch")}
        </p>
        <Link href={exitHref} className="inline-block text-primary underline">
          {t("flashcards.backToMyCards")}
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex justify-between">
        <Link href={exitHref} className="text-sm text-primary underline">
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
        />
      </ExamSessionShell>
    </div>
  );
}

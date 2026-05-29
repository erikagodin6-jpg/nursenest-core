"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";

type DeckCardLimit = 10 | 20 | 25 | 50 | "all";

const DECK_CARD_LIMITS: readonly DeckCardLimit[] = [10, 20, 25, 50, "all"];

export function FlashcardDeckStudyGate({ deckRef }: { deckRef: string }) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const sp = useSearchParams();
  const [title, setTitle] = useState<string>(() => t("learner.flashcards.hub.title"));
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedCardLimit, setSelectedCardLimit] = useState<DeckCardLimit>(25);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetchWithRetry(
          `/api/flashcards/decks/${encodeURIComponent(deckRef)}`,
          { credentials: "include", cache: "no-store", signal: controller.signal },
          { attempts: 1, timeoutMs: 8_000 },
        );

        if (!res.ok || cancelled) return;

        const m = (await res.json()) as { deck?: { title?: string } };

        if (!cancelled && m.deck?.title) {
          setTitle(formatTitleCase(String(m.deck.title)));
        }
      } catch (error) {
        if (controller.signal.aborted || cancelled) return;
        logDedupedClientDiagnostic("flashcard_deck_gate", "deck_meta_failed", deckRef, {
          deckRef,
          message: error instanceof Error ? error.message : "unknown",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [deckRef]);

  const startQs = new URLSearchParams(sp.toString());
  startQs.set("start", "1");
  startQs.set("configured", "1");
  startQs.set("focus", selectedTopic);
  startQs.set("cardLimit", String(selectedCardLimit));

  const startHref = `/app/flashcards/${encodeURIComponent(
    deckRef
  )}?${startQs.toString()}`;

  return (
    <div className="nn-flashcard-study-canvas nn-flashcard-study-canvas--launcher mx-auto px-4 py-8 sm:py-12">
      <div className="nn-flashcard-deck-launcher" data-nn-e2e-flashcard-session-launcher>
        <div className="nn-flashcard-deck-launcher__header">
          <Link href="/app/flashcards#study-session" className="nn-flashcard-deck-launcher__return">
            {t("flashcards.configuration")}
          </Link>
          <div>
            <p className="nn-flashcard-deck-launcher__eyebrow">Study setup</p>
            <h1>{loading ? t("learner.flashcards.hub.loadingDecks") : title}</h1>
            <p>
              Select a focus and card count before the session starts. Existing active sessions can still
              resume directly.
            </p>
          </div>
        </div>

        <div className="nn-flashcard-deck-launcher__grid">
          <section className="nn-flashcard-deck-launcher__section" aria-labelledby="flashcard-deck-topic">
            <div className="nn-flashcard-deck-launcher__section-heading">
              <h2 id="flashcard-deck-topic">Body system or topic</h2>
              <p>Keep every system available or focus this deck.</p>
            </div>
            <div className="nn-flashcard-deck-launcher__topic-grid">
              {[
                { id: "all", label: "All systems", detail: "Use all eligible cards in this deck." },
                { id: "deck", label: loading ? "Selected deck" : title, detail: "Focus this session on the current deck topic." },
              ].map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  data-nn-e2e-flashcard-launcher-topic={topic.id}
                  data-selected={selectedTopic === topic.id}
                  aria-pressed={selectedTopic === topic.id}
                  className="nn-flashcard-deck-launcher__topic"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <span>{topic.label}</span>
                  <small>{topic.detail}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="nn-flashcard-deck-launcher__section" aria-labelledby="flashcard-deck-count">
            <div className="nn-flashcard-deck-launcher__section-heading">
              <h2 id="flashcard-deck-count">Number of cards</h2>
              <p>Choose a quick review or a deeper study set.</p>
            </div>
            <div className="nn-flashcard-deck-launcher__count-grid" role="group" aria-label="Number of cards">
              {DECK_CARD_LIMITS.map((limit) => (
                <button
                  key={String(limit)}
                  type="button"
                  data-nn-e2e-session-size-preset={String(limit)}
                  data-selected={selectedCardLimit === limit}
                  aria-pressed={selectedCardLimit === limit}
                  className="nn-flashcard-deck-launcher__count"
                  onClick={() => setSelectedCardLimit(limit)}
                >
                  {limit === "all" ? "Full review" : limit}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="nn-flashcard-deck-launcher__footer">
          <p>
            Starts with {selectedCardLimit === "all" ? "the full deck" : `${selectedCardLimit} cards`} · {selectedTopic === "all" ? "All systems" : title}
          </p>
          <button
            type="button"
            onClick={() => router.push(startHref)}
            className="nn-flashcard-deck-launcher__start"
            data-nn-e2e-flashcard-launcher-start
          >
            {t("flashcards.startSession")}
          </button>
        </div>
      </div>
    </div>
  );
}

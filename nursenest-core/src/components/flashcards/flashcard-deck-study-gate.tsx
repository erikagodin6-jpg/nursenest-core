"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTitleCase } from "@/lib/format/text-case";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";

export function FlashcardDeckStudyGate({ deckRef }: { deckRef: string }) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const sp = useSearchParams();
  const [title, setTitle] = useState<string>(() => t("learner.flashcards.hub.title"));
  const [loading, setLoading] = useState(true);

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

  const startHref = `/app/flashcards/${encodeURIComponent(
    deckRef
  )}?${startQs.toString()}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <div className="nn-premium-flashcard-gate-card rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          {loading ? t("learner.flashcards.hub.loadingDecks") : title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {t("learner.flashcards.hub.customStudyIntro")}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/flashcards#study-session"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-3 text-center text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)]"
          >
            {t("flashcards.configuration")}
          </Link>

          <button
            type="button"
            onClick={() => router.push(startHref)}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold shadow-md transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] motion-reduce:transition-none"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color:
                "var(--role-cta-foreground, var(--semantic-text-on-brand, #fff))",
            }}
          >
            {t("flashcards.startSession")}
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-[var(--semantic-border-soft)]" />

        {/* Tip */}
        <p className="mt-4 text-xs text-[var(--semantic-text-muted)]">
          Tip: bookmark{" "}
          <span className="rounded bg-[var(--semantic-panel-muted)] px-1.5 py-0.5 font-mono">
            ?start=1
          </span>{" "}
          to skip this screen next time.
        </p>
      </div>
    </div>
  );
}

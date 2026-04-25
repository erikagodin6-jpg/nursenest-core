"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTitleCase } from "@/lib/format/text-case";

export function FlashcardDeckStudyGate({ deckRef }: { deckRef: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [title, setTitle] = useState<string>("Flashcard deck");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(
          `/api/flashcards/decks/${encodeURIComponent(deckRef)}`,
          { credentials: "include" }
        );

        if (!res.ok || cancelled) return;

        const m = (await res.json()) as { deck?: { title?: string } };

        if (!cancelled && m.deck?.title) {
          setTitle(formatTitleCase(String(m.deck.title)));
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  const startQs = new URLSearchParams(sp.toString());
  startQs.set("start", "1");

  const startHref = `/app/flashcards/${encodeURIComponent(
    deckRef
  )}?${startQs.toString()}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-3xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">
          {loading ? "Loading deck…" : title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Customize your study session with filters, weak areas, and spacing —
          or jump straight into this deck for focused review.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/app/flashcards#study-session"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-[var(--semantic-border-soft)] bg-white px-5 py-3 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] hover:shadow-md"
          >
            Configure session
          </Link>

          <button
            type="button"
            onClick={() => router.push(startHref)}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-bold shadow-md transition hover:scale-[1.02] hover:opacity-95 active:scale-[0.98]"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color:
                "var(--role-cta-foreground, var(--semantic-text-on-brand, #fff))",
            }}
          >
            Start now
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
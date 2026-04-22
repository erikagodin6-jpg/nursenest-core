"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTitleCase } from "@/lib/format/text-case";

/**
 * First screen when opening a deck URL without `?start=1` — nudges learners through the
 * flashcard builder first while still allowing an immediate study shortcut.
 */
export function FlashcardDeckStudyGate({ deckRef }: { deckRef: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}`, { credentials: "include" });
        if (!res.ok || cancelled) return;
        const m = (await res.json()) as { deck?: { title?: string } };
        if (!cancelled && m.deck?.title) setTitle(formatTitleCase(String(m.deck.title)));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  const startQs = new URLSearchParams(sp.toString());
  startQs.set("start", "1");
  const startHref = `/app/flashcards/${encodeURIComponent(deckRef)}?${startQs.toString()}`;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold text-[var(--theme-heading-text)]">{title || "Flashcard deck"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
        Configure filters, performance focus, and session size on the flashcard hub first — or jump straight into this
        deck when you already know what you want to review.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/app/flashcards#study-session"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
        >
          Configure study session
        </Link>
        <button
          type="button"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold shadow-md transition hover:opacity-95"
          style={{
            background: "var(--role-cta, var(--semantic-brand))",
            color: "var(--role-cta-foreground, var(--semantic-text-on-brand, #fff))",
          }}
          onClick={() => router.push(startHref)}
        >
          Start this deck now
        </button>
      </div>
      <p className="mt-6 text-xs text-[var(--semantic-text-muted)]">
        Tip: bookmark <span className="font-mono">?start=1</span> if you always want to skip this screen for this deck.
      </p>
    </div>
  );
}

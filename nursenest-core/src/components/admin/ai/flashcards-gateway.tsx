"use client";

import dynamic from "next/dynamic";

const FlashcardsTool = dynamic(() => import("./flashcards-tool").then((m) => m.FlashcardsTool), {
  loading: () => <p className="text-sm text-muted">Loading…</p>,
  ssr: false,
});

export function FlashcardsGateway() {
  return <FlashcardsTool />;
}

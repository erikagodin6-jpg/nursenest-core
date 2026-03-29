import Link from "next/link";
import samples from "@/content/flashcard-samples.json";

type Card = { front: string; back: string };

const DECK = samples as Card[];

export default function FlashcardsPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold">Flashcards</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Quick retrieval practice strengthens long-term memory. Use these sample cards for a fast warm-up, then move to the
        question bank for full stems and rationales.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
        >
          Open question bank
        </Link>
        <Link href="/tools/med-math" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Medication math tools
        </Link>
      </div>
      <ul className="mt-8 space-y-3">
        {DECK.map((c, i) => (
          <li key={i} className="nn-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Card {i + 1}</p>
            <p className="mt-2 font-medium text-foreground">{c.front}</p>
            <p className="mt-3 text-sm text-muted">{c.back}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

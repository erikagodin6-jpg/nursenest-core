import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { loadPublicFlashcardHub } from "@/lib/seo/public-flashcard-landing";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NCLEX & nursing flashcards",
  description:
    "Topic-organized nursing flashcards for NCLEX-RN, NCLEX-PN, and clinical review—sample cards and full study inside NurseNest.",
  alternates: { canonical: absoluteUrl("/flashcards") },
};

export default async function PublicFlashcardsHubPage() {
  const { topics, featuredDecks } = await loadPublicFlashcardHub();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Flashcards", path: "/flashcards" }]} />
      <nav className="mb-6 text-sm text-[var(--theme-muted-text)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="text-primary underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">Flashcards</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Nursing flashcards</h1>
      <p className="mt-3 max-w-2xl text-sm text-[var(--theme-muted-text)]">
        NurseNest flashcards tie to your pathway, lessons, and practice stats. Browse topics and deck previews here—sign in for
        full decks, spaced repetition, and weak-area study.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Topics & tags</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">Topics will appear as decks are published.</li>
          ) : (
            topics.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/flashcards/${t.slug}`}
                  className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
                >
                  {t.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Featured decks</h2>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">Sample fronts only—full backs and every card are in the app.</p>
        <ul className="mt-6 space-y-6">
          {featuredDecks.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">Check back soon for deck previews.</li>
          ) : (
            featuredDecks.map((d) => (
              <li key={d.slug} className="nn-card p-5">
                <Link href={`/flashcards/${d.slug}`} className="text-lg font-semibold text-primary hover:underline">
                  {d.title}
                </Link>
                {d.description ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{d.description}</p> : null}
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{d.cardCount} cards in app</p>
                {d.sampleFront ? (
                  <blockquote className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-sm text-[var(--theme-heading-text)]">
                    <span className="text-xs font-semibold uppercase text-primary">Sample card</span>
                    <p className="mt-2 whitespace-pre-wrap">{d.sampleFront}</p>
                  </blockquote>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Sign in to study
        </Link>
        <Link href="/pricing" className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
          View plans
        </Link>
      </div>
    </div>
  );
}

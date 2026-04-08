import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { resolvePublicFlashcardLanding } from "@/lib/seo/public-flashcard-slug-resolve";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await resolvePublicFlashcardLanding(slug);
  if (!data) {
    return { title: "Flashcards" };
  }
  if (data.kind === "deck") {
    const title = `${data.title} flashcards`;
    const desc =
      data.description?.slice(0, 155) ||
      `Study ${data.title} with NurseNest: ${data.cardCount} nursing flashcards. Preview sample cards; subscribe for full decks and spaced repetition.`;
    return {
      title,
      description: desc,
      alternates: { canonical: absoluteUrl(`/flashcards/${slug}`) },
    };
  }
  const title = `${data.name} topic flashcards | NurseNest`;
  const desc = `Topic “${data.name}”: curated nursing flashcard decks on NurseNest. Preview sample cards; subscribe for full decks, spaced repetition, and weak-area review tied to your exam track.`;
  return {
    title,
    description: desc,
    alternates: { canonical: absoluteUrl(`/flashcards/${slug}`) },
  };
}

export default async function PublicFlashcardSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = await resolvePublicFlashcardLanding(slug);
  if (!data) notFound();

  const crumbName = data.kind === "deck" ? data.title : data.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Flashcards", path: "/flashcards" },
          { name: crumbName, path: `/flashcards/${slug}` },
        ]}
      />
      <nav className="mb-6 text-sm text-[var(--theme-muted-text)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="text-primary underline">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/flashcards" className="text-primary underline">
              Flashcards
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[var(--theme-heading-text)]">
            {data.kind === "deck" ? data.title : data.name}
          </li>
        </ol>
      </nav>

      {data.kind === "deck" ? (
        <>
          <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">{data.title}</h1>
          {data.description ? <p className="mt-3 text-sm text-[var(--theme-muted-text)]">{data.description}</p> : null}
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{data.cardCount} cards · full deck in the learner app</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">{data.name} flashcards</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--theme-muted-text)]">
            Decks below share this topic tag. Use them to reinforce quick recall alongside{" "}
            <Link href="/lessons" className="font-medium text-primary underline">
              pathway lessons
            </Link>{" "}
            and{" "}
            <Link href="/question-bank" className="font-medium text-primary underline">
              question bank
            </Link>{" "}
            practice. Samples are shortened; subscribers get full cards, scheduling, and weak-area queues.
          </p>
          {data.decks.length > 0 ? (
            <ul className="mt-4 space-y-1 text-sm">
              {data.decks.map((d) => (
                <li key={d.slug}>
                  <Link href={`/flashcards/${d.slug}`} className="text-primary underline">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Sample cards</h2>
        <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
          Short answer previews here. Premium study includes full explanations and unlimited reviews.
        </p>
        <ul className="mt-6 space-y-5">
          {data.samples.length === 0 ? (
            <li className="text-sm text-[var(--theme-muted-text)]">No public samples yet.</li>
          ) : (
            data.samples.map((s, i) => (
              <li key={i} className="nn-card p-5">
                {data.kind === "topic" && "deckTitle" in s ? (
                  <p className="text-xs font-medium text-primary">{s.deckTitle}</p>
                ) : null}
                <p className="mt-2 text-sm font-medium text-[var(--theme-heading-text)]">Front</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{s.front}</p>
                <p className="mt-4 text-sm font-medium text-[var(--theme-heading-text)]">Answer (preview)</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--theme-muted-text)]">{s.backTeaser}</p>
              </li>
            ))
          )}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/login" className="rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground">
          Study in app
        </Link>
        <Link href="/flashcards" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
          All flashcards
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

/**
 * When a subscriber has multiple entitled pathways but no `pathwayId` in the URL and no single
 * `learnerPath` lock-in, show explicit track links instead of redirecting in a loop.
 */
export function FlashcardsPathwayPickSurface({
  title,
  subtitle,
  pathways,
}: {
  title: string;
  subtitle: string;
  pathways: { id: string; label: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--theme-fg)]">{title}</h1>
        <p className="text-sm text-[var(--theme-muted-text)]">{subtitle}</p>
      </header>

      {pathways.length === 0 ? (
        <p className="text-sm text-[var(--theme-muted-text)]">
          No exam tracks are available on this account yet. Try again after your subscription syncs, or update study
          preferences.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {pathways.map((p) => (
            <li key={p.id}>
              <Link
                href={`/app/flashcards?pathwayId=${encodeURIComponent(p.id)}`}
                className="block rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm font-medium text-[var(--theme-fg)] transition-colors hover:border-[var(--semantic-info)]"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-[var(--theme-muted-text)]">
        <Link href="/app/account/study-preferences" className="text-primary underline underline-offset-2">
          Study preferences
        </Link>{" "}
        — set a default track for questions, CAT, and flashcards.
      </p>
    </div>
  );
}

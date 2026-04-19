import Link from "next/link";

/**
 * Minimal server fallback when the marketing homepage shell throws — no i18n shards, no DB, no stats.
 * Keeps a navigable surface if upstream data fails during render.
 */
export function MarketingHomeErrorFallback() {
  return (
    <main className="mx-auto max-w-md px-6 py-20 text-center">
      <p className="text-lg font-semibold tracking-tight">NurseNest</p>
      <p className="mt-4 text-sm text-muted-foreground">
        We couldn&apos;t load the full homepage right now. You can refresh or continue to another page.
      </p>
      <div className="mt-8 flex flex-col gap-3 text-sm">
        <Link href="/" className="font-medium text-primary underline underline-offset-4">
          Try again
        </Link>
        <Link href="/lessons" className="text-primary underline underline-offset-4">
          Public lessons
        </Link>
      </div>
    </main>
  );
}

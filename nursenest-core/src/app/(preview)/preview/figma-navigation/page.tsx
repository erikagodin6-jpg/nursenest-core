import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Figma navigation preview — variants",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function FigmaNavigationPreviewIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-16 text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Design preview only
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">Premium navigation variants</h1>
        <p className="mb-8 text-[var(--muted-foreground)]">
          Isolated routes under{" "}
          <code className="rounded bg-[color-mix(in_srgb,var(--semantic-border-soft)_40%,var(--card))] px-1 py-0.5 text-sm">
            /preview/figma-navigation
          </code>
          .
          Use each link to compare hierarchy, spacing, and utility clusters. Toggle guest vs learner via query params on each
          surface.
        </p>
        <ul className="flex flex-col gap-3">
          <li>
            <Link
              className="block rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] px-5 py-4 font-semibold shadow-[var(--elevation-rest)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[var(--elevation-hover)]"
              href="/preview/figma-navigation/a"
            >
              Variant A — Ultra clean clinical
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] px-5 py-4 font-semibold shadow-[var(--elevation-rest)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[var(--elevation-hover)]"
              href="/preview/figma-navigation/b"
            >
              Variant B — Playful pastel premium
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--card)] px-5 py-4 font-semibold shadow-[var(--elevation-rest)] transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[var(--elevation-hover)]"
              href="/preview/figma-navigation/c"
            >
              Variant C — Modern app / dashboard hybrid
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

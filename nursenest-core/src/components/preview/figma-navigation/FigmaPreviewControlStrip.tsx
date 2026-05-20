import Link from "next/link";

/** Preview-only: switches auth / dropdown states without touching production auth. */
export function FigmaPreviewControlStrip({
  variant,
}: {
  variant: "a" | "b" | "c";
}) {
  const base = `/preview/figma-navigation/${variant}`;
  const pill =
    "rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--card)_92%,var(--background))] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-[var(--elevation-rest)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--card))]";

  return (
    <div
      className="pointer-events-auto fixed bottom-4 left-1/2 z-[130] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] px-3 py-2 shadow-[var(--elevation-overlay)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--background)_85%,transparent)]"
      data-preview-control-strip
    >
      <span className="px-1 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">Preview</span>
      <Link className={pill} href={`${base}?auth=anon`} prefetch={false}>
        Guest
      </Link>
      <Link className={pill} href={`${base}?auth=learner`} prefetch={false}>
        Learner
      </Link>
      <Link className={pill} href={`${base}?auth=anon&dropdown=1`} prefetch={false}>
        Open dropdown
      </Link>
      <Link
        className="rounded-full border border-dashed border-[var(--semantic-border-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]"
        href="/preview/figma-navigation"
        prefetch={false}
      >
        All variants
      </Link>
    </div>
  );
}

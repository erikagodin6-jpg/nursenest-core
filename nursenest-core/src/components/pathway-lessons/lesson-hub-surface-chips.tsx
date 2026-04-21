import Link from "next/link";

export type LessonHubSurfaceChip = { label: string; href: string };

type Props = {
  links: LessonHubSurfaceChip[];
};

/**
 * Above-the-fold quick links on pathway lesson hubs (legacy lesson index “study surfaces” strip).
 */
export function LessonHubSurfaceChips({ links }: Props) {
  if (!links.length) return null;
  return (
    <nav
      aria-label="Quick study surfaces for this exam pathway"
      className="mt-4"
      data-testid="lesson-hub-surface-chips"
    >
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            className="inline-flex min-h-10 items-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[var(--semantic-info)] hover:bg-[var(--semantic-panel-cool)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

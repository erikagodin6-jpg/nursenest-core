import Link from "next/link";

export type CountrySwitcherOption = {
  label: string;
  href: string;
  active?: boolean;
};

export function CountrySwitcher({
  options,
  ariaLabel = "Lesson country",
}: {
  options: CountrySwitcherOption[];
  ariaLabel?: string;
}) {
  if (options.length < 2) return null;

  return (
    <div
      className="inline-flex rounded-full border border-[var(--semantic-border-soft)] bg-[var(--theme-page-bg)] p-1 shadow-[var(--semantic-shadow-soft)]"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <Link
          key={option.label}
          href={option.href}
          role="tab"
          aria-selected={option.active ? "true" : "false"}
          className={`inline-flex min-h-11 min-w-[6.5rem] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            option.active
              ? "bg-[var(--semantic-surface)] text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)]"
              : "text-[var(--theme-muted-text)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--theme-page-bg))] hover:text-[var(--theme-heading-text)]"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

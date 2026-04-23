import Link from "next/link";
import { BookOpen, ClipboardList, Layers } from "lucide-react";

/**
 * In-article “Next steps” — three action targets only (no long prose).
 * Parents supply localized labels and final hrefs.
 */
export function PathwayLessonNextStepsCards({
  practiceHref,
  lessonsHref,
  flashcardsHref,
  practiceLabel,
  lessonsLabel,
  flashcardsLabel,
}: {
  practiceHref: string;
  lessonsHref: string;
  flashcardsHref: string;
  practiceLabel: string;
  lessonsLabel: string;
  flashcardsLabel: string;
}) {
  const items = [
    { href: practiceHref, label: practiceLabel, Icon: ClipboardList, tone: "brand" as const },
    { href: lessonsHref, label: lessonsLabel, Icon: BookOpen, tone: "info" as const },
    { href: flashcardsHref, label: flashcardsLabel, Icon: Layers, tone: "chart2" as const },
  ];
  return (
    <div
      className="mt-4 grid gap-3 sm:grid-cols-3"
      data-nn-qa-lesson-next-steps="true"
      role="list"
    >
      {items.map(({ href, label, Icon, tone }) => (
        <Link
          key={href}
          href={href}
          role="listitem"
          className={[
            "flex min-h-[3.25rem] flex-col justify-center rounded-lg border px-3 py-3 text-center text-sm font-semibold leading-snug shadow-sm transition",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]",
            tone === "brand"
              ? "border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--bg-card))] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
              : tone === "info"
                ? "border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--bg-card))] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] focus-visible:ring-[color-mix(in_srgb,var(--semantic-info)_35%,transparent)]"
                : "border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,var(--bg-card))] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] focus-visible:ring-[color-mix(in_srgb,var(--semantic-chart-2)_35%,transparent)]",
          ].join(" ")}
        >
          <span className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-[color-mix(in_srgb,var(--theme-page-bg)_55%,transparent)] text-[var(--theme-heading-text)]">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          {label}
        </Link>
      ))}
    </div>
  );
}

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
    {
      href: practiceHref,
      label: practiceLabel,
      Icon: ClipboardList,
      variant: "primary" as const,
    },
    {
      href: lessonsHref,
      label: lessonsLabel,
      Icon: BookOpen,
      variant: "secondary" as const,
      warmth: "cool" as const,
    },
    {
      href: flashcardsHref,
      label: flashcardsLabel,
      Icon: Layers,
      variant: "secondary" as const,
      warmth: "warm" as const,
    },
  ];

  return (
    <div className="nn-lesson-next-steps" data-nn-qa-lesson-next-steps="true" role="list">
      {items.map(({ href, label, Icon, variant, warmth }) => (
        <Link
          key={href}
          href={href}
          role="listitem"
          className={[
            "nn-lesson-next-steps__link",
            variant === "primary" ? "nn-lesson-next-steps__link--primary" : "nn-lesson-next-steps__link--secondary",
            warmth === "warm" ? "nn-lesson-next-steps__link--warm" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="nn-lesson-next-steps__icon" aria-hidden>
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          {label}
        </Link>
      ))}
    </div>
  );
}

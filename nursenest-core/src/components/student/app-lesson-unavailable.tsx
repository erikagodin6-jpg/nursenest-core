import Link from "next/link";

type Props = {
  t: (key: string) => string;
};

/**
 * Soft landing when `/app/lessons/[id]` cannot render (missing row, unloadable document, empty presentable sections).
 */
export function AppLessonUnavailable({ t }: Props) {
  return (
    <div className="nn-card mx-auto max-w-lg space-y-4 border-[var(--semantic-border-soft)] p-8 shadow-[var(--semantic-shadow-soft)]">
      <h1 className="text-xl font-semibold text-[var(--semantic-text-primary)]">{t("learner.lessons.detail.unavailableTitle")}</h1>
      <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.lessons.detail.unavailableBody")}</p>
      <Link
        href="/app/lessons"
        className="inline-flex min-h-[44px] items-center font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
      >
        {t("learner.lessons.detail.backToLessons")}
      </Link>
    </div>
  );
}

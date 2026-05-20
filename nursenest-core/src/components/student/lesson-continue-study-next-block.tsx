"use client";

import Link from "next/link";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Compact “Continue learning” Study Next strip at lesson end (no SEO / route changes).
 */
export function LessonContinueStudyNextBlock({ bundle }: { bundle: PostTestStudyNextBundle | null }) {
  const { t } = useMarketingI18n();
  if (!bundle) return null;

  return (
    <aside
      className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 text-sm"
      aria-label={t("lessonContinue.ariaLabel")}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("lessonContinue.title")}</p>
      <p className="mt-2 font-semibold text-[var(--theme-heading-text)]">{bundle.primary.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{bundle.primary.reason}</p>
      <Link
        href={bundle.primary.href}
        className="mt-3 inline-flex rounded-full bg-role-cta px-3 py-1.5 text-xs font-semibold text-role-cta-foreground shadow-sm"
      >
        {t("studyNext.openCta")}
      </Link>
      {bundle.secondary.length > 0 ? (
        <ul className="mt-4 space-y-3 border-t border-border/50 pt-3">
          {bundle.secondary.map((s) => (
            <li key={s.href}>
              <p className="font-medium text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.reason}</p>
              <Link href={s.href} className="mt-1 inline-block text-xs font-semibold text-primary underline-offset-2 hover:underline">
                {t("studyNext.openCta")}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}

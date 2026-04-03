"use client";

import Link from "next/link";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/** Post-mock / post-submit remediation — same markup in exam widget and attempt detail page. */
export function PostTestStudyNextCard({ bundle }: { bundle: PostTestStudyNextBundle }) {
  const { t } = useMarketingI18n();

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("studyNext.title")}</p>
      <p className="mt-2 text-sm font-semibold text-foreground">{bundle.primary.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{bundle.primary.reason}</p>
      <Link
        href={bundle.primary.href}
        className="mt-3 inline-flex rounded-full bg-role-cta px-4 py-2 text-sm font-semibold text-role-cta-foreground shadow-[0_4px_14px_var(--role-cta-shadow)]"
      >
        {t("studyNext.openCta")}
      </Link>
      {bundle.secondary.length > 0 ? (
        <ul className="mt-4 space-y-3 border-t border-border/60 pt-4">
          {bundle.secondary.map((s) => (
            <li key={s.href} className="text-sm">
              <p className="font-medium text-foreground">{s.title}</p>
              <p className="text-muted-foreground">{s.reason}</p>
              <Link href={s.href} className="mt-1 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
                {t("studyNext.openCta")}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

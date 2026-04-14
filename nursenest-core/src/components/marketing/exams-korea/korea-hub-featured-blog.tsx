"use client";

import Link from "next/link";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";

export function KoreaHubFeaturedBlog() {
  const { t, locale } = useMarketingI18n();
  const tagHref = withMarketingLocale(
    locale,
    `/blog/tag/${encodeURIComponent(t("blog.country.korea.tagName"))}`,
  );
  const isKo = locale === "ko";

  return (
    <section
      className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-panel-positive) 10%, var(--semantic-surface))",
      }}
      aria-labelledby="kr-featured-blog"
    >
      <h2 id="kr-featured-blog" className="nn-marketing-h2 !mt-0">
        {t("featured.korea.sectionTitle")}
      </h2>
      <p className="mt-2 text-[var(--theme-muted-text)]">{t("featured.korea.lead")}</p>
      {isKo ? (
        <p className="mt-3 text-sm text-[var(--semantic-text-muted)]">{t("blog.country.korea.koPriorityNote")}</p>
      ) : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <article
          className="rounded-xl border border-[var(--semantic-border-soft)] p-5"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-1) 6%, var(--semantic-surface))" }}
        >
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("featured.korea.card1Title")}</h3>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{t("featured.korea.card1Body")}</p>
          <p className="mt-4">
            <Link
              className="text-sm font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
              href={tagHref}
            >
              {formatTitleCase(t("featured.korea.browseTag"), locale)}
            </Link>
          </p>
        </article>
        <article
          className="rounded-xl border border-[var(--semantic-border-soft)] p-5"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-2) 6%, var(--semantic-surface))" }}
        >
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("featured.korea.card2Title")}</h3>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{t("featured.korea.card2Body")}</p>
          <p className="mt-4">
            <Link
              className="text-sm font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
              href={tagHref}
            >
              {formatTitleCase(t("featured.korea.browseTag"), locale)}
            </Link>
          </p>
        </article>
      </div>
    </section>
  );
}

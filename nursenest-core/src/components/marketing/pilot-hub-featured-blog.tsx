"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { PilotCountrySlug } from "@/config/country-localization-types";
import { PILOT_BLOG_SAMPLE_BUNDLES } from "@/lib/blog/pilot-sample-posts-bundles";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { formatTitleCase } from "@/lib/format/text-case";
import { rankAndSortBlogSamples, resolveLanguageTryOrder } from "@/lib/localization/resolve-localized-content";

/** i18n segment for `featured.{prefix}.*` and `blog.country.{prefix}.*` (matches existing keys). */
const FEATURED_PREFIX: Record<PilotCountrySlug, string> = {
  india: "india",
  "middle-east": "middleEast",
  australia: "australia",
  china: "china",
  korea: "korea",
  japan: "japan",
  germany: "germany",
  france: "france",
  italy: "italy",
  hungary: "hungary",
  portugal: "portugal",
  mexico: "mexico",
  philippines: "philippines",
};

/**
 * Regional hub: language-ranked sample titles + i18n featured cards.
 * Imports only the small sample batch JSON — never the 200-row manifest.
 */
export function PilotHubFeaturedBlog({ pilot }: { pilot: PilotCountrySlug }) {
  const { t, locale } = useMarketingI18n();
  const p = FEATURED_PREFIX[pilot];

  const bundle = PILOT_BLOG_SAMPLE_BUNDLES[pilot];
  const languageTryOrder = useMemo(() => resolveLanguageTryOrder(pilot, locale), [pilot, locale]);
  const ranked = useMemo(
    () => rankAndSortBlogSamples(bundle.entries, pilot, languageTryOrder).slice(0, 6),
    [bundle.entries, pilot, languageTryOrder],
  );

  const tagHref = withMarketingLocale(
    locale,
    `/blog/tag/${encodeURIComponent(t(`blog.country.${p}.tagName`))}`,
  );

  const priorityNote = useMemo(() => {
    if (pilot === "china" && (locale === "zh" || locale === "zh-tw")) {
      return t("blog.country.china.zhPriorityNote");
    }
    if (pilot === "korea" && locale === "ko") {
      return t("blog.country.korea.koPriorityNote");
    }
    if (pilot === "germany" && locale === "de") {
      return t("blog.country.germany.dePriorityNote");
    }
    return t(`blog.country.${p}.featuredNote`);
  }, [pilot, p, locale, t]);

  return (
    <section
      className="mt-12 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-panel-positive) 8%, var(--semantic-surface))",
      }}
      aria-labelledby={`pilot-featured-${p}`}
    >
      <h2 id={`pilot-featured-${p}`} className="nn-marketing-h2 !mt-0">
        {t(`featured.${p}.sectionTitle`)}
      </h2>
      <p className="mt-2 text-[var(--theme-muted-text)]">{t(`featured.${p}.lead`)}</p>
      <p className="mt-3 text-sm text-[var(--semantic-text-muted)]">{priorityNote}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <article
          className="rounded-xl border border-[var(--semantic-border-soft)] p-5"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-3) 6%, var(--semantic-surface))" }}
        >
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t(`featured.${p}.card1Title`)}</h3>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{t(`featured.${p}.card1Body`)}</p>
          <p className="mt-4">
            <Link
              className="text-sm font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
              href={tagHref}
            >
              {formatTitleCase(t(`featured.${p}.browseTag`), locale)}
            </Link>
          </p>
        </article>
        <article
          className="rounded-xl border border-[var(--semantic-border-soft)] p-5"
          style={{ background: "color-mix(in srgb, var(--semantic-chart-4) 6%, var(--semantic-surface))" }}
        >
          <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t(`featured.${p}.card2Title`)}</h3>
          <p className="mt-2 text-sm text-[var(--theme-body-text)]">{t(`featured.${p}.card2Body`)}</p>
          <p className="mt-4">
            <Link
              className="text-sm font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
              href={tagHref}
            >
              {formatTitleCase(t(`featured.${p}.browseTag`), locale)}
            </Link>
          </p>
        </article>
      </div>

      <div className="mt-8">
        <h3 className="nn-marketing-h3">{t(`blog.country.${p}.sampleListTitle`)}</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--theme-body-text)]">
          {ranked.map(({ item }) => (
            <li
              key={item.slug}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--semantic-border-soft)] pb-2"
            >
              <span className="min-w-0 flex-1 font-medium">{item.title}</span>
              <span className="shrink-0 text-xs uppercase text-[var(--semantic-text-muted)]">{item.language}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--semantic-text-muted)]">{t(`blog.country.${p}.sampleFootnote`)}</p>
      </div>
    </section>
  );
}

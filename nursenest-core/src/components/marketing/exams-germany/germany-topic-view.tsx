"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const GERMANY_TOPIC_SLUGS = [
  "nurse-recognition",
  "kenntnisprufung",
  "work-as-a-nurse",
  "german-language-for-nurses",
] as const;
export type GermanyTopicSlug = (typeof GERMANY_TOPIC_SLUGS)[number];

function isGermanyTopicSlug(s: string): s is GermanyTopicSlug {
  return (GERMANY_TOPIC_SLUGS as readonly string[]).includes(s);
}

function RichBody({ text }: { text: string }) {
  const parts = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="space-y-4">
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function GermanyTopicView({ topic }: { topic: GermanyTopicSlug }) {
  const { t, locale } = useMarketingI18n();
  const base = "/germany/" + topic;
  const { crumbs } = simpleMarketingBreadcrumbs(t(`exams.germany.subpage.${topic}.title`), base);
  const hubHref = withMarketingLocale(locale, "/exams/germany");

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />
      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.germany.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t(`exams.germany.subpage.${topic}.title`)}</h1>
        <RichBody text={t(`exams.germany.subpage.${topic}.body`)} />
        <p className="mt-10">
          <Link
            className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
            href={hubHref}
          >
            ← {t("nav.country.germany.examsHub")}
          </Link>
        </p>
      </article>
    </div>
  );
}

export function parseGermanyTopicParam(topic: string): GermanyTopicSlug | null {
  return isGermanyTopicSlug(topic) ? topic : null;
}

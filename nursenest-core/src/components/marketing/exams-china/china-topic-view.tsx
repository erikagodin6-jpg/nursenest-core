"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const CHINA_TOPIC_SLUGS = [
  "nursing-exam",
  "work-abroad",
  "how-to-become-a-nurse",
  "nclex-for-chinese-nurses",
] as const;
export type ChinaTopicSlug = (typeof CHINA_TOPIC_SLUGS)[number];

function isChinaTopicSlug(s: string): s is ChinaTopicSlug {
  return (CHINA_TOPIC_SLUGS as readonly string[]).includes(s);
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

export function ChinaTopicView({ topic }: { topic: ChinaTopicSlug }) {
  const { t, locale } = useMarketingI18n();
  const base = "/china/" + topic;
  const { crumbs } = simpleMarketingBreadcrumbs(t(`exams.china.subpage.${topic}.title`), base);
  const hubHref = withMarketingLocale(locale, "/exams/china");

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />
      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.china.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t(`exams.china.subpage.${topic}.title`)}</h1>
        <RichBody text={t(`exams.china.subpage.${topic}.body`)} />
        <p className="mt-10">
          <Link
            className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
            href={hubHref}
          >
            ← {t("nav.country.china.examsHub")}
          </Link>
        </p>
      </article>
    </div>
  );
}

export function parseChinaTopicParam(topic: string): ChinaTopicSlug | null {
  return isChinaTopicSlug(topic) ? topic : null;
}

"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const PORTUGAL_TOPIC_SLUGS = ["nurse-registration", "how-to-become-a-nurse", "work-abroad"] as const;
export type PortugalTopicSlug = (typeof PORTUGAL_TOPIC_SLUGS)[number];

function isPortugalTopicSlug(s: string): s is PortugalTopicSlug {
  return (PORTUGAL_TOPIC_SLUGS as readonly string[]).includes(s);
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

export function PortugalTopicView({ topic }: { topic: PortugalTopicSlug }) {
  const { t, locale } = useMarketingI18n();
  const base = "/portugal/" + topic;
  const { crumbs } = simpleMarketingBreadcrumbs(t(`exams.portugal.subpage.${topic}.title`), base);
  const hubHref = withMarketingLocale(locale, "/exams/portugal");

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />
      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.portugal.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t(`exams.portugal.subpage.${topic}.title`)}</h1>
        <RichBody text={t(`exams.portugal.subpage.${topic}.body`)} />
        <p className="mt-10">
          <Link
            className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
            href={hubHref}
          >
            ← {t("nav.country.portugal.examsHub")}
          </Link>
        </p>
      </article>
    </div>
  );
}

export function parsePortugalTopicParam(topic: string): PortugalTopicSlug | null {
  return isPortugalTopicSlug(topic) ? topic : null;
}

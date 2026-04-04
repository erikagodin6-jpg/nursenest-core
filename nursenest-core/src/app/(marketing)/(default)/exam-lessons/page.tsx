import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { MarketingStudyCrossLinks } from "@/components/seo/marketing-study-cross-links";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { listPathwayIdsWithLessons } from "@/lib/lessons/pathway-lesson-loader";
import { examLessonsIndexBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site-origin";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { formatMarketingMessage, resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";

export const revalidate = 600;

const cachedPathwayIdsWithLessons = unstable_cache(
  () => listPathwayIdsWithLessons(),
  ["exam-lessons-pathway-ids-v1"],
  { revalidate: 600, tags: ["pathway-lesson-index"] },
);

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const title = resolveMarketingCopy(
    m,
    "pages.examLessons.metaTitle",
    en,
    "Exam-scoped clinical lessons | NurseNest",
  );
  const description = resolveMarketingCopy(
    m,
    "pages.examLessons.metaDescription",
    en,
    "Browse nursing lessons by country, role, and exam track (REx-PN, NCLEX-RN, NCLEX-PN, NP specialties, and more). Previews are free; full depth unlocks with the matching subscription.",
  );
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl("/exam-lessons") },
    openGraph: {
      title,
      url: absoluteUrl("/exam-lessons"),
      type: "website",
    },
  };
}

export default async function ExamLessonsIndexPage() {
  const pathwayIds = await cachedPathwayIdsWithLessons();
  const rows = pathwayIds
    .map((id) => getExamPathwayById(id))
    .filter((p): p is NonNullable<typeof p> => !!p && p.status !== "hidden");

  const { crumbs, schemaItems } = examLessonsIndexBreadcrumbs();

  const locale = await getMarketingLocaleForDefaultRoute();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const t = (key: string, params?: Record<string, string | number>) =>
    formatMarketingMessage(m, key, params, en);

  const regionLabel = (slug: string) =>
    slug === "canada" ? t("pages.pricing.country.ca") : t("pages.pricing.country.us");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-[var(--nn-rhythm-section-y)] nn-marketing-x nn-rhythm-page">
      <BreadcrumbJsonLd items={schemaItems} />
      <div>
        <BreadcrumbTrail items={crumbs} />
      </div>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-5 sm:p-6">
        <div className="nn-stack-hero-heading">
          <h1 className="text-3xl font-extrabold text-[var(--theme-heading-text)]">{t("pages.examLessons.h1")}</h1>
          <p className="text-[var(--theme-muted-text)]">{t("pages.examLessons.intro")}</p>
        </div>
        <div className="nn-hero-cta-row mt-[var(--nn-rhythm-text-to-cta)] flex-wrap">
          <Link
            href={withMarketingLocale(locale, "/pricing")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
          >
            {t("pages.examLessons.ctaPricing")}
          </Link>
          <Link
            href={withMarketingLocale(locale, "/blog")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/40"
          >
            {t("pages.examLessons.ctaBlog")}
          </Link>
          <Link
            href={withMarketingLocale(locale, "/tools")}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5"
          >
            {t("pages.examLessons.ctaTools")}
          </Link>
        </div>
      </div>
      <ul className="flex flex-col gap-3 sm:gap-[var(--nn-rhythm-card-grid-gap)]">
        {rows.map((p) => (
          <li key={p.id} className="nn-card p-4">
            <p className="text-xs font-semibold uppercase text-primary">
              {t("pages.examLessons.pathwayBadge", { region: regionLabel(p.countrySlug), shortName: p.shortName })}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{p.displayName}</h2>
            <p className="mt-2 text-sm text-muted">{p.seoDescription}</p>
            <Link
              href={buildExamPathwayPath(p, "lessons")}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {t("pages.examLessons.openHub")}
            </Link>
          </li>
        ))}
      </ul>
      <MarketingStudyCrossLinks className="mt-10" />
      <p className="mt-8 text-sm text-muted sm:mt-9">
        {t("pages.examLessons.appLessonsLead")}{" "}
        <Link href="/app/lessons" className="font-semibold text-primary">
          {t("pages.examLessons.appLessonsLink")}
        </Link>
      </p>
    </div>
  );
}

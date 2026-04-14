"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { JapanHubFeaturedBlog } from "./japan-hub-featured-blog";

const PATH = "/exams/japan";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
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

export function ExamsJapanHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.japan.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.japan.faq.q${i}`);
    const a = t(`exams.japan.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.japan.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.japan.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.japan.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.japan.lead")}</p>

        <section className="mt-12" aria-labelledby="jp-overview">
          <h2 id="jp-overview" className="nn-marketing-h2">
            {t("exams.japan.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-regulator">
          <h2 id="jp-regulator" className="nn-marketing-h2">
            {t("exams.japan.sections.regulator.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.regulator.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-national-exam">
          <h2 id="jp-national-exam" className="nn-marketing-h2">
            {t("exams.japan.sections.nationalExam.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.nationalExam.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-language">
          <h2 id="jp-language" className="nn-marketing-h2">
            {t("exams.japan.sections.languageDomestic.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.languageDomestic.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-epa">
          <h2 id="jp-epa" className="nn-marketing-h2">
            {t("exams.japan.sections.epaInternational.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.epaInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-abroad">
          <h2 id="jp-abroad" className="nn-marketing-h2">
            {t("exams.japan.sections.abroad.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.abroad.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-ca">
          <h2 id="jp-ca" className="nn-marketing-h2">
            {t("exams.japan.sections.migrationCanada.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.migrationCanada.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-au">
          <h2 id="jp-au" className="nn-marketing-h2">
            {t("exams.japan.sections.migrationAustralia.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.migrationAustralia.body")} />
          <p className="mt-4">
            <ProseLink href={withMarketingLocale(locale, "/exams/australia")}>
              {formatTitleCase(t("exams.japan.links.australiaHub"), locale)}
            </ProseLink>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="jp-uk">
          <h2 id="jp-uk" className="nn-marketing-h2">
            {t("exams.japan.sections.migrationUk.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.migrationUk.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-best">
          <h2 id="jp-best" className="nn-marketing-h2">
            {t("exams.japan.sections.best.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="jp-links">
          <h2 id="jp-links" className="nn-marketing-h2">
            {t("exams.japan.sections.links.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.japan.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.japan.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/japan/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.japan.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/japan/work-abroad")}>
                {formatTitleCase(t("nav.country.japan.workAbroad"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/japan/nclex-for-japanese-nurses")}>
                {formatTitleCase(t("nav.country.japan.nclexTopic"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.japan.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.japan.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.japan.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.japan.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.japan.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.japan.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.japan.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.japan.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.japan.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.japan.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.japan.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.japan.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.japan.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="jp-blog-integration">
          <h2 id="jp-blog-integration" className="nn-marketing-h2">
            {t("exams.japan.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.japan.sections.blogIntegration.body")} />
        </section>

        <JapanHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="jp-faq">
          <h2 id="jp-faq" className="nn-marketing-h2">
            {t("exams.japan.sections.faq.title")}
          </h2>
          <dl className="space-y-6">
            {faqPairs.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-[var(--theme-heading-text)]">{item.q}</dt>
                <dd className="mt-2 text-[var(--theme-body-text)]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside
          className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
          style={{ background: "color-mix(in srgb, var(--semantic-panel-cool) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.japan.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.japan.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/japan/nursing-exam")}>{t("exams.japan.next.linkNursingExam")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/japan/how-to-become-a-nurse")}>{t("exams.japan.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/japan/work-abroad")}>{t("exams.japan.next.linkWorkAbroad")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/japan/nclex-for-japanese-nurses")}>{t("exams.japan.next.linkNclexJapanese")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}

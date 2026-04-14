"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { ChinaHubFeaturedBlog } from "./china-hub-featured-blog";

const PATH = "/exams/china";

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

export function ExamsChinaHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.china.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.china.faq.q${i}`);
    const a = t(`exams.china.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.china.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.china.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.china.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.china.lead")}</p>

        <section className="mt-12" aria-labelledby="cn-overview">
          <h2 id="cn-overview" className="nn-marketing-h2">
            {t("exams.china.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.china.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-nursenest">
          <h2 id="cn-nursenest" className="nn-marketing-h2">
            {t("exams.china.sections.nurseNestCovers.title")}
          </h2>
          <RichBody text={t("exams.china.sections.nurseNestCovers.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-languages">
          <h2 id="cn-languages" className="nn-marketing-h2">
            {t("exams.china.sections.languageHonesty.title")}
          </h2>
          <RichBody text={t("exams.china.sections.languageHonesty.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-nnqe">
          <h2 id="cn-nnqe" className="nn-marketing-h2">
            {t("exams.china.sections.nnqe.title")}
          </h2>
          <RichBody text={t("exams.china.sections.nnqe.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-regulator">
          <h2 id="cn-regulator" className="nn-marketing-h2">
            {t("exams.china.sections.regulator.title")}
          </h2>
          <RichBody text={t("exams.china.sections.regulator.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-domestic-intl">
          <h2 id="cn-domestic-intl" className="nn-marketing-h2">
            {t("exams.china.sections.domesticVsIntl.title")}
          </h2>
          <RichBody text={t("exams.china.sections.domesticVsIntl.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-allied">
          <h2 id="cn-allied" className="nn-marketing-h2">
            {t("exams.china.sections.allied.title")}
          </h2>
          <RichBody text={t("exams.china.sections.allied.body")} />
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.china.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.china.links.alliedCa"), locale)}</ProseLink>
            </li>
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="cn-ca">
          <h2 id="cn-ca" className="nn-marketing-h2">
            {t("exams.china.sections.migrationCanada.title")}
          </h2>
          <RichBody text={t("exams.china.sections.migrationCanada.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-au">
          <h2 id="cn-au" className="nn-marketing-h2">
            {t("exams.china.sections.migrationAustralia.title")}
          </h2>
          <RichBody text={t("exams.china.sections.migrationAustralia.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-uk">
          <h2 id="cn-uk" className="nn-marketing-h2">
            {t("exams.china.sections.migrationUk.title")}
          </h2>
          <RichBody text={t("exams.china.sections.migrationUk.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-gulf">
          <h2 id="cn-gulf" className="nn-marketing-h2">
            {t("exams.china.sections.migrationGulf.title")}
          </h2>
          <RichBody text={t("exams.china.sections.migrationGulf.body")} />
          <p className="mt-4">
            <ProseLink href={withMarketingLocale(locale, "/exams/middle-east")}>
              {formatTitleCase(t("exams.china.links.middleEastHub"), locale)}
            </ProseLink>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="cn-abroad">
          <h2 id="cn-abroad" className="nn-marketing-h2">
            {t("exams.china.sections.abroad.title")}
          </h2>
          <RichBody text={t("exams.china.sections.abroad.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-best">
          <h2 id="cn-best" className="nn-marketing-h2">
            {t("exams.china.sections.best.title")}
          </h2>
          <RichBody text={t("exams.china.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="cn-links">
          <h2 id="cn-links" className="nn-marketing-h2">
            {t("exams.china.sections.links.title")}
          </h2>
          <RichBody text={t("exams.china.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.china.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.china.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/china/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.china.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/china/work-abroad")}>
                {formatTitleCase(t("nav.country.china.workAbroad"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/exams/australia")}>
                {formatTitleCase(t("exams.china.links.australiaHub"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">{t("quicklinks.china.lessons")} / NCLEX</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.china.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.china.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.china.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.china.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.china.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.china.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.china.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.china.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.china.links.tools"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.pricing}>{formatTitleCase(t("exams.china.links.pricing"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.china.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="cn-blog-integration">
          <h2 id="cn-blog-integration" className="nn-marketing-h2">
            {t("exams.china.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.china.sections.blogIntegration.body")} />
        </section>

        <ChinaHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="cn-faq">
          <h2 id="cn-faq" className="nn-marketing-h2">
            {t("exams.china.sections.faq.title")}
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
          style={{ background: "color-mix(in srgb, var(--semantic-panel-positive) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.china.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.china.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/china/nursing-exam")}>{t("exams.china.next.linkNursingExam")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/china/how-to-become-a-nurse")}>{t("exams.china.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/china/work-abroad")}>{t("exams.china.next.linkWorkAbroad")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/china/nclex-for-chinese-nurses")}>{t("exams.china.next.linkNclexChinese")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}

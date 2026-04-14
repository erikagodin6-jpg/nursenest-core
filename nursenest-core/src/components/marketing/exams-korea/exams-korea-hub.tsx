"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { KoreaHubFeaturedBlog } from "./korea-hub-featured-blog";

const PATH = "/exams/korea";

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

export function ExamsKoreaHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.korea.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.korea.faq.q${i}`);
    const a = t(`exams.korea.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.korea.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.korea.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.korea.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.korea.lead")}</p>

        <section className="mt-12" aria-labelledby="kr-overview">
          <h2 id="kr-overview" className="nn-marketing-h2">
            {t("exams.korea.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-khplei">
          <h2 id="kr-khplei" className="nn-marketing-h2">
            {t("exams.korea.sections.khplei.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.khplei.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-exam">
          <h2 id="kr-exam" className="nn-marketing-h2">
            {t("exams.korea.sections.exam.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.exam.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-language">
          <h2 id="kr-language" className="nn-marketing-h2">
            {t("exams.korea.sections.language.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.language.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-domestic">
          <h2 id="kr-domestic" className="nn-marketing-h2">
            {t("exams.korea.sections.domesticProcess.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.domesticProcess.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-rn-scope">
          <h2 id="kr-rn-scope" className="nn-marketing-h2">
            {t("exams.korea.sections.rnScope.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.rnScope.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-abroad">
          <h2 id="kr-abroad" className="nn-marketing-h2">
            {t("exams.korea.sections.abroad.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.abroad.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-au">
          <h2 id="kr-au" className="nn-marketing-h2">
            {t("exams.korea.sections.migrationAustralia.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.migrationAustralia.body")} />
          <p className="mt-4">
            <ProseLink href={withMarketingLocale(locale, "/exams/australia")}>
              {formatTitleCase(t("exams.korea.links.australiaHub"), locale)}
            </ProseLink>
          </p>
        </section>

        <section className="mt-12" aria-labelledby="kr-uk">
          <h2 id="kr-uk" className="nn-marketing-h2">
            {t("exams.korea.sections.migrationUk.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.migrationUk.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-best">
          <h2 id="kr-best" className="nn-marketing-h2">
            {t("exams.korea.sections.best.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="kr-links">
          <h2 id="kr-links" className="nn-marketing-h2">
            {t("exams.korea.sections.links.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.korea.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.korea.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/korea/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.korea.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/korea/work-abroad")}>
                {formatTitleCase(t("nav.country.korea.workAbroad"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/korea/nclex-for-korean-nurses")}>
                {formatTitleCase(t("nav.country.korea.nclexTopic"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.korea.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.korea.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.korea.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.korea.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.korea.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.korea.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.korea.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.korea.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.korea.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.korea.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.korea.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.korea.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.korea.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="kr-blog-integration">
          <h2 id="kr-blog-integration" className="nn-marketing-h2">
            {t("exams.korea.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.korea.sections.blogIntegration.body")} />
        </section>

        <KoreaHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="kr-faq">
          <h2 id="kr-faq" className="nn-marketing-h2">
            {t("exams.korea.sections.faq.title")}
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
          style={{ background: "color-mix(in srgb, var(--semantic-panel-warm) 8%, var(--semantic-surface))" }}
        >
          <p className="nn-marketing-h3 !mt-0">{t("exams.korea.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.korea.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/korea/nursing-exam")}>{t("exams.korea.next.linkNursingExam")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/korea/how-to-become-a-nurse")}>{t("exams.korea.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/korea/work-abroad")}>{t("exams.korea.next.linkWorkAbroad")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/korea/nclex-for-korean-nurses")}>{t("exams.korea.next.linkNclexKorean")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}

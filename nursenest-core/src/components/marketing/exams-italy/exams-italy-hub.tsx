"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { ItalyHubFeaturedBlog } from "./italy-hub-featured-blog";

const PATH = "/exams/italy";

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

export function ExamsItalyHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.italy.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.italy.faq.q${i}`);
    const a = t(`exams.italy.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.italy.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.italy.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.italy.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.italy.lead")}</p>

        <section className="mt-12" aria-labelledby="it-overview">
          <h2 id="it-overview" className="nn-marketing-h2">
            {t("exams.italy.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-recognition">
          <h2 id="it-recognition" className="nn-marketing-h2">
            {t("exams.italy.sections.recognitionSystem.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.recognitionSystem.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-domestic">
          <h2 id="it-domestic" className="nn-marketing-h2">
            {t("exams.italy.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-lang">
          <h2 id="it-lang" className="nn-marketing-h2">
            {t("exams.italy.sections.languageRequirements.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.languageRequirements.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-eu">
          <h2 id="it-eu" className="nn-marketing-h2">
            {t("exams.italy.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-abroad">
          <h2 id="it-abroad" className="nn-marketing-h2">
            {t("exams.italy.sections.abroadMigration.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.abroadMigration.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-best">
          <h2 id="it-best" className="nn-marketing-h2">
            {t("exams.italy.sections.best.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="it-links">
          <h2 id="it-links" className="nn-marketing-h2">
            {t("exams.italy.sections.links.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.italy.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.italy.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/italy/nurse-registration")}>
                {formatTitleCase(t("nav.country.italy.nurseRegistration"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/italy/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.italy.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/italy/work-abroad")}>
                {formatTitleCase(t("nav.country.italy.workAbroad"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.italy.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.italy.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.italy.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.italy.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.italy.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.italy.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.italy.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.italy.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.italy.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.italy.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.italy.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.italy.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.italy.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="it-blog-integration">
          <h2 id="it-blog-integration" className="nn-marketing-h2">
            {t("exams.italy.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.italy.sections.blogIntegration.body")} />
        </section>

        <ItalyHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="it-faq">
          <h2 id="it-faq" className="nn-marketing-h2">
            {t("exams.italy.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.italy.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.italy.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/italy/nurse-registration")}>{t("exams.italy.next.linkNurseRegistration")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/italy/how-to-become-a-nurse")}>{t("exams.italy.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/italy/work-abroad")}>{t("exams.italy.next.linkWorkAbroad")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}

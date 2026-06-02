"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { PortugalHubFeaturedBlog } from "./portugal-hub-featured-blog";

const PATH = "/exams/portugal";

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

export function ExamsPortugalHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.portugal.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.portugal.faq.q${i}`);
    const a = t(`exams.portugal.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.portugal.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.portugal.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.portugal.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.portugal.lead")}</p>

        <section className="mt-12" aria-labelledby="pt-overview">
          <h2 id="pt-overview" className="nn-marketing-h2">
            {t("exams.portugal.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-recognition">
          <h2 id="pt-recognition" className="nn-marketing-h2">
            {t("exams.portugal.sections.recognitionSystem.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.recognitionSystem.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-domestic">
          <h2 id="pt-domestic" className="nn-marketing-h2">
            {t("exams.portugal.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-lang">
          <h2 id="pt-lang" className="nn-marketing-h2">
            {t("exams.portugal.sections.languageRequirements.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.languageRequirements.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-eu">
          <h2 id="pt-eu" className="nn-marketing-h2">
            {t("exams.portugal.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-abroad">
          <h2 id="pt-abroad" className="nn-marketing-h2">
            {t("exams.portugal.sections.abroadMigration.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.abroadMigration.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-best">
          <h2 id="pt-best" className="nn-marketing-h2">
            {t("exams.portugal.sections.best.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="pt-links">
          <h2 id="pt-links" className="nn-marketing-h2">
            {t("exams.portugal.sections.links.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.portugal.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.portugal.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/portugal/nurse-registration")}>
                {formatTitleCase(t("nav.country.portugal.nurseRegistration"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/portugal/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.portugal.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/portugal/work-abroad")}>
                {formatTitleCase(t("nav.country.portugal.workAbroad"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.portugal.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.portugal.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.portugal.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.portugal.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.portugal.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.portugal.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.portugal.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.portugal.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.portugal.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.portugal.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.portugal.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.portugal.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.portugal.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="pt-blog-integration">
          <h2 id="pt-blog-integration" className="nn-marketing-h2">
            {t("exams.portugal.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.portugal.sections.blogIntegration.body")} />
        </section>

        <PortugalHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="pt-faq">
          <h2 id="pt-faq" className="nn-marketing-h2">
            {t("exams.portugal.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.portugal.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.portugal.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/portugal/nurse-registration")}>{t("exams.portugal.next.linkNurseRegistration")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/portugal/how-to-become-a-nurse")}>{t("exams.portugal.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/portugal/work-abroad")}>{t("exams.portugal.next.linkWorkAbroad")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}

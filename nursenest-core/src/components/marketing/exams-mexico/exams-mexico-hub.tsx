"use client";

import Link from "next/link";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { ALLIED, HUB, NP, PN, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { formatTitleCase } from "@/lib/format/text-case";
import { MexicoHubFeaturedBlog } from "./mexico-hub-featured-blog";

const PATH = "/exams/mexico";

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

export function ExamsMexicoHub() {
  const { t, locale } = useMarketingI18n();
  const { crumbs } = simpleMarketingBreadcrumbs(t("exams.mexico.breadcrumb"), PATH);

  const faqPairs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = t(`exams.mexico.faq.q${i}`);
    const a = t(`exams.mexico.faq.a${i}`);
    if (q?.trim() && a?.trim()) faqPairs.push({ q, a });
  }

  const blogTagHref = withMarketingLocale(locale, `/blog/tag/${encodeURIComponent(t("blog.country.mexico.tagName"))}`);

  return (
    <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
      <BreadcrumbTrail items={crumbs} />

      <article className="nn-marketing-body">
        <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{t("exams.mexico.eyebrow")}</p>
        <h1 className="nn-marketing-h1 mt-2 text-balance">{t("exams.mexico.title")}</h1>
        <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">{t("exams.mexico.lead")}</p>

        <section className="mt-12" aria-labelledby="mx-overview">
          <h2 id="mx-overview" className="nn-marketing-h2">
            {t("exams.mexico.sections.overview.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.overview.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-recognition">
          <h2 id="mx-recognition" className="nn-marketing-h2">
            {t("exams.mexico.sections.recognitionSystem.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.recognitionSystem.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-domestic">
          <h2 id="mx-domestic" className="nn-marketing-h2">
            {t("exams.mexico.sections.domesticInternational.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.domesticInternational.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-cross">
          <h2 id="mx-cross" className="nn-marketing-h2">
            {t("exams.mexico.sections.crossBorder.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.crossBorder.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-lang">
          <h2 id="mx-lang" className="nn-marketing-h2">
            {t("exams.mexico.sections.languageRequirements.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.languageRequirements.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-eu">
          <h2 id="mx-eu" className="nn-marketing-h2">
            {t("exams.mexico.sections.euVsNonEu.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.euVsNonEu.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-abroad">
          <h2 id="mx-abroad" className="nn-marketing-h2">
            {t("exams.mexico.sections.abroadMigration.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.abroadMigration.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-best">
          <h2 id="mx-best" className="nn-marketing-h2">
            {t("exams.mexico.sections.best.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.best.body")} />
        </section>

        <section className="mt-12" aria-labelledby="mx-links">
          <h2 id="mx-links" className="nn-marketing-h2">
            {t("exams.mexico.sections.links.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.links.body")} />
          <p className="mt-4 text-sm font-semibold text-[var(--theme-heading-text)]">{t("blog.country.mexico.relatedTitle")}</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={blogTagHref}>{formatTitleCase(t("quicklinks.mexico.blogTag"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/mexico/nurse-registration")}>
                {formatTitleCase(t("nav.country.mexico.nurseRegistration"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/mexico/how-to-become-a-nurse")}>
                {formatTitleCase(t("nav.country.mexico.howToBecome"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/mexico/nclex-for-mexican-nurses")}>
                {formatTitleCase(t("nav.country.mexico.nclexForMexicanNurses"), locale)}
              </ProseLink>
            </li>
            <li>
              <ProseLink href={withMarketingLocale(locale, "/mexico/work-abroad")}>
                {formatTitleCase(t("nav.country.mexico.workAbroad"), locale)}
              </ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm font-semibold text-[var(--theme-heading-text)]">
            {t("quicklinks.mexico.lessons")} / NCLEX
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <ProseLink href={HUB.examLessons}>{formatTitleCase(t("quicklinks.mexico.lessons"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={HUB.questionBank}>{formatTitleCase(t("quicklinks.mexico.questions"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={loginWithCallback("/app/study-plan")}>{formatTitleCase(t("quicklinks.mexico.studyPlan"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={RN.usLessons}>{formatTitleCase(t("exams.mexico.links.rnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={RN.usQuestions}>{formatTitleCase(t("exams.mexico.links.rnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={PN.usLessons}>{formatTitleCase(t("exams.mexico.links.pnLessonsUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={PN.usQuestions}>{formatTitleCase(t("exams.mexico.links.pnQuestionsUs"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={NP.fnpLessons}>{formatTitleCase(t("exams.mexico.links.npLessons"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={ALLIED.usHub}>{formatTitleCase(t("exams.mexico.links.alliedUs"), locale)}</ProseLink>
              {" · "}
              <ProseLink href={ALLIED.caHub}>{formatTitleCase(t("exams.mexico.links.alliedCa"), locale)}</ProseLink>
            </li>
            <li>
              <ProseLink href={HUB.tools}>{formatTitleCase(t("exams.mexico.links.tools"), locale)}</ProseLink>
            </li>
          </ul>
          <p className="mt-6 text-sm text-[var(--semantic-text-muted)]">{t("exams.mexico.paginationNote")}</p>
        </section>

        <section className="mt-12" aria-labelledby="mx-blog-integration">
          <h2 id="mx-blog-integration" className="nn-marketing-h2">
            {t("exams.mexico.sections.blogIntegration.title")}
          </h2>
          <RichBody text={t("exams.mexico.sections.blogIntegration.body")} />
        </section>

        <MexicoHubFeaturedBlog />

        <section className="mt-12" aria-labelledby="mx-faq">
          <h2 id="mx-faq" className="nn-marketing-h2">
            {t("exams.mexico.sections.faq.title")}
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
          <p className="nn-marketing-h3 !mt-0">{t("exams.mexico.next.title")}</p>
          <p className="mt-2 text-[var(--theme-muted-text)]">{t("exams.mexico.next.body")}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            <ProseLink href={withMarketingLocale(locale, "/mexico/nurse-registration")}>{t("exams.mexico.next.linkNurseRegistration")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/mexico/how-to-become-a-nurse")}>{t("exams.mexico.next.linkHowToBecome")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/mexico/nclex-for-mexican-nurses")}>{t("exams.mexico.next.linkNclex")}</ProseLink>
            <ProseLink href={withMarketingLocale(locale, "/mexico/work-abroad")}>{t("exams.mexico.next.linkWorkAbroad")}</ProseLink>
          </p>
        </aside>
      </article>
    </div>
  );
}
